import os
import io
from typing import List, Tuple, Optional, Dict

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

import google.generativeai as genai
import faiss
from pypdf import PdfReader
import re
import statistics

# ---------------------
# Environment and Config
# ---------------------
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")
EMBEDDING_MODEL = os.getenv("GEMINI_EMBEDDING_MODEL", "text-embedding-004")
PORT = int(os.getenv("PORT", "8000"))

if not GOOGLE_API_KEY:
    # We won't crash the server; but chat will not work until key provided
    print("WARNING: GOOGLE_API_KEY is not set. Set it in .env for embeddings and chat.")

# Configure Gemini SDK
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

# ---------------------
# App Setup
# ---------------------
app = FastAPI(title="ICT Chatbot Server", version="1.0.0")

# Enable CORS for React frontend (allow all for simplicity)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------
# Data Ingestion and Indexing
# ---------------------
DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
PDF_PATH = os.path.join(DATA_DIR, "ICT_Department.pdf")

faiss_index = None  # type: ignore
index_texts: List[str] = []
index_metadatas: List[dict] = []
embedding_dim: int | None = None

# In-memory conversation history per session_id
SESSION_HISTORY: Dict[str, List[dict]] = {}


def read_pdf_text(pdf_path: str) -> str:
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF not found at {pdf_path}. Place ICT_Department.pdf under data/.")
    reader = PdfReader(pdf_path)
    texts = []
    for i, page in enumerate(reader.pages):
        try:
            txt = page.extract_text() or ""
        except Exception:
            txt = ""
        if txt:
            texts.append(txt)
    return "\n".join(texts).strip()


def chunk_text(text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
    if not text:
        return []
    chunks = []
    start = 0
    length = len(text)
    while start < length:
        end = min(start + chunk_size, length)
        chunk = text[start:end]
        chunks.append(chunk)
        if end == length:
            break
        start = end - overlap
        if start < 0:
            start = 0
    return chunks


def embed_texts(texts: List[str]) -> np.ndarray:
    if not GOOGLE_API_KEY:
        raise RuntimeError("GOOGLE_API_KEY is not set; cannot create embeddings.")
    if not texts:
        return np.zeros((0, 0), dtype="float32")
    # Call embed_content per-item to avoid SDK batch variability
    embeddings: List[List[float]] = []
    for t in texts:
        res = genai.embed_content(model=EMBEDDING_MODEL, content=t)
        vec = None
        if isinstance(res, dict) and "embedding" in res:
            e = res["embedding"]
            vec = e.get("values") if isinstance(e, dict) else e
        else:
            # Fallback for SDK objects
            try:
                vec = res.embedding.values  # type: ignore[attr-defined]
            except Exception:
                pass
        if vec is None:
            raise RuntimeError("Unexpected embedding API response format for a chunk")
        embeddings.append(list(vec))

    arr = np.array(embeddings, dtype="float32")
    return arr


def build_faiss_index(chunks: List[str]) -> Tuple[faiss.IndexFlatIP, np.ndarray]:
    global embedding_dim
    if not chunks:
        raise ValueError("No text chunks to index.")
    embs = embed_texts(chunks)
    if embs.ndim != 2 or embs.shape[0] != len(chunks):
        raise RuntimeError("Embedding shape mismatch.")

    # Normalize for inner product to act like cosine similarity
    faiss.normalize_L2(embs)
    dim = embs.shape[1]
    embedding_dim = dim
    index = faiss.IndexFlatIP(dim)
    index.add(embs)
    return index, embs


# Attempt to index on startup
@app.on_event("startup")
def startup_index_pdf():
    global faiss_index, index_texts, index_metadatas
    try:
        text = read_pdf_text(PDF_PATH)
        chunks = chunk_text(text)
        index_texts = chunks
        index_metadatas = [{"source": "ICT_Department.pdf", "chunk_id": i} for i in range(len(chunks))]
        if chunks:
            faiss_index, _ = build_faiss_index(chunks)
            print(f"Indexed {len(chunks)} chunks from ICT_Department.pdf")
        else:
            print("No text extracted from PDF to index.")
    except FileNotFoundError as e:
        print(str(e))
    except Exception as e:
        print(f"Failed to build index: {e}")


# ---------------------
# API Models
# ---------------------
class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    answer: str
    sources: Optional[List[dict]] = None


# ---------------------
# Utilities
# ---------------------

def search_similar(query: str, k: int = 5) -> List[Tuple[str, dict, float]]:
    if faiss_index is None or not index_texts:
        raise RuntimeError("Index not ready. Ensure the PDF exists and server has built the index.")
    # Embed query
    q_emb = embed_texts([query])
    if q_emb.size == 0:
        return []
    faiss.normalize_L2(q_emb)
    D, I = faiss_index.search(q_emb, k)
    results = []
    for idx, score in zip(I[0], D[0]):
        if idx == -1:
            continue
        results.append((index_texts[idx], index_metadatas[idx], float(score)))
    return results


def generate_answer(query: str, contexts: List[str], history: Optional[List[dict]] = None) -> str:
    if not GOOGLE_API_KEY:
        raise RuntimeError("GOOGLE_API_KEY is not set; cannot call Gemini chat.")
    model = genai.GenerativeModel(GEMINI_MODEL)
    system_prompt = (
        "You are a helpful assistant for questions about the ICT Department. "
        "Use the provided context chunks to answer the user's question. "
        "If the answer isn't in the context, say you don't know. Keep the answer concise."
    )
    history_text = ""
    if history:
        # Include up to last 6 turns
        trimmed = history[-6:]
        formatted = []
        for turn in trimmed:
            role = turn.get("role", "user")
            content = turn.get("content", "")
            if role == "user":
                formatted.append(f"User: {content}")
            else:
                formatted.append(f"Assistant: {content}")
        history_text = "\n".join(formatted)

    context_text = "\n\n".join([f"Context chunk {i+1}:\n{c}" for i, c in enumerate(contexts)])

    prompt = (
        f"{system_prompt}\n\n"
        + (f"Conversation so far:\n{history_text}\n\n" if history_text else "")
        + f"User question: {query}\n\n"
        + f"Context:\n{context_text}"
    )


    resp = model.generate_content(prompt)
    # google-generativeai returns a response with .text in most cases
    try:
        return resp.text.strip()
    except Exception:
        # Fallback extraction
        try:
            parts = []
            for c in resp.candidates:
                for part in c.content.parts:
                    if getattr(part, "text", None):
                        parts.append(part.text)
            return "\n".join(parts).strip() or ""
        except Exception:
            return ""


# ---------------------
# Math-aware extraction and computation
# ---------------------

_LPA_REGEX = re.compile(r"(\d+(?:[\.,]\d+)?)\s*(?:lpa|lac|lakh|lakhs)", re.IGNORECASE)
_CURR_REGEX = re.compile(r"(?:₹|rs\.?\s?)([\d,]+(?:\.\d+)?)", re.IGNORECASE)


def _to_float(s: str) -> float:
    s = s.replace(",", "").strip()
    try:
        return float(s)
    except Exception:
        return float("nan")


def extract_packages_lpa(contexts: List[str]) -> List[float]:
    """Extract package values in LPA from context text.
    Supports formats like '7.5 LPA', '7 Lakh', '₹700,000', 'Rs 700000'.
    Currency amounts are converted to LPA assuming per-annum (divide by 100000).
    """
    text = "\n".join(contexts)
    values: List[float] = []
    # LPA / lakh mentions
    for m in _LPA_REGEX.finditer(text):
        v = _to_float(m.group(1).replace(".", "."))
        if np.isfinite(v):
            values.append(v)
    # Raw currency amounts (₹ or Rs)
    for m in _CURR_REGEX.finditer(text):
        rupees = _to_float(m.group(1))
        if np.isfinite(rupees) and rupees > 0:
            lpa = rupees / 100000.0
            values.append(lpa)
    # Filter out absurd values
    values = [v for v in values if 0.1 <= v <= 200]
    return values


def intent_for_package(query: str) -> str | None:
    q = query.lower()
    if any(k in q for k in ["average package", "avg package", "mean package", "average salary", "avg ctc", "average ctc"]):
        return "average"
    if any(k in q for k in ["highest package", "max package", "maximum package", "highest ctc"]):
        return "max"
    if any(k in q for k in ["lowest package", "min package", "minimum package", "lowest ctc"]):
        return "min"
    return None


def try_compute_package_answer(query: str, contexts: List[str]) -> str | None:
    intent = intent_for_package(query)
    if not intent:
        return None
    vals = extract_packages_lpa(contexts)
    if not vals:
        return None
    avg = statistics.mean(vals)
    lo = min(vals)
    hi = max(vals)
    if intent == "average":
        return f"the average package is approximately {avg:.2f} LPA (min {lo:.2f} LPA, max {hi:.2f} LPA)."
    if intent == "min":
        return f" the lowest package is approximately {lo:.2f} LPA (average {avg:.2f} LPA)."
    if intent == "max":
        return f"the highest package is approximately {hi:.2f} LPA (average {avg:.2f} LPA)."
    return None


# ---------------------
# Endpoints
# ---------------------
@app.get("/")
def root():
    return {"message": "InfoMate backend is running 🚀"}

@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(body: ChatRequest):
    query = body.query.strip()
    session_id = body.session_id or "default"
    history = SESSION_HISTORY.get(session_id, [])
    if not query:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    try:
        results = search_similar(query, k=5)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

    contexts = [r[0] for r in results]
    sources = [
        {"source": r[1].get("source"), "chunk_id": r[1].get("chunk_id"), "score": r[2]}
        for r in results
    ]

    # First, attempt deterministic computation for numeric queries (e.g., average package)
    computed = try_compute_package_answer(query, contexts)
    if computed:
        # Update history and persist
        history.append({"role": "user", "content": query})
        history.append({"role": "assistant", "content": computed})
        # Trim history to last 20 turns
        SESSION_HISTORY[session_id] = history[-20:]
        return ChatResponse(answer=computed, sources=sources)

    # Otherwise, fall back to Gemini for natural language answer
    try:
        answer = generate_answer(query, contexts, history=history)
        if not answer:
            answer = "I'm sorry, I couldn't generate an answer from the provided context."
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini error: {e}")

    # Update and persist history
    history.append({"role": "user", "content": query})
    history.append({"role": "assistant", "content": answer})
    SESSION_HISTORY[session_id] = history[-20:]

    return ChatResponse(answer=answer, sources=sources)


# ---------------------
# Local run
# ---------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=PORT, reload=True)
