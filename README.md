# InfoMate

An AI-powered assistant for the ICT Department that answers questions grounded in a local PDF and also exposes structured programmatic endpoints (faculty, courses, semesters, subjects). The app consists of a React frontend (Create React App + Tailwind) and a Node.js/Express backend that uses Google Gemini for responses grounded in `server_new/document.pdf`.

## Features
- **Chat assistant** grounded in `document.pdf` via retrieval-augmented generation (RAG)
- **Structured endpoints** to fetch faculty, courses, semesters, and subjects parsed from the PDF
- **Caching** of extracted structured data to reduce repeated LLM calls
- **Modern UI** with Tailwind, sidebar navigation, and optional speech input/output (browser-dependent)

## Project Structure
```
InfoMate/
├─ client/            # React app (CRA)
│  ├─ src/
│  └─ package.json    # Proxy -> http://localhost:5051
└─ server_new/        # Express backend + PDF + Gemini integration
   ├─ index.js        # API endpoints and chat handler
   ├─ pdfLoader.js    # PDF parsing and simple retriever
   ├─ document.pdf    # Knowledge base (server-side only)
   └─ package.json
```

## Prerequisites
- Node.js 18+ (recommended)
- npm 9+ (recommended)
- A Google Generative AI API key with access to Gemini models

## Quick Start
1) Backend (server)
- Create `server_new/.env`:
```
GOOGLE_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-1.5-flash   # optional
PORT=5051                       # optional (default 5051)
```
- Install and run:
```
cd server_new
npm install
npm run dev   # or: npm start
```

2) Frontend (client)
- Install and run:
```
cd client
npm install
npm start
```
CRA will open http://localhost:3000 and proxy API calls to `http://localhost:5051` (configured in `client/package.json`).

## Configuration
- Server reads env from `server_new/.env`
  - `GOOGLE_API_KEY` (required)
  - `GEMINI_MODEL` (optional, default: `gemini-1.5-flash`)
  - `PORT` (optional, default: `5051`)
- Client optionally supports `REACT_APP_API_BASE` in the environment
  - If not set, the client uses relative `/api/*` paths and relies on the CRA proxy

## Available API Endpoints (Backend)
- `GET /api/health`
  - Returns `{ ok, pdfLoaded, chunks }`
- `GET /api/faculty`
  - Extracts and returns a JSON array of faculty entries from the PDF (cached in memory)
- `GET /api/courses`
  - Extracts and returns a JSON array of courses from the PDF (cached in memory)
- `GET /api/courses/:courseId/semesters`
  - Extracts and returns a JSON array of semesters for a course (cached per course)
- `GET /api/courses/:courseId/semesters/:semesterId/subjects`
  - Extracts and returns a JSON array of subjects for a course+semester (cached per key)
- `POST /api/chat`
  - Body: `{ message: string, history?: Array<{role: 'user'|'model', content: string}> }`
  - Returns: `{ answer: string, meta: { model, usedChunks } }`
- `POST /api/clear-cache`
  - Clears all in-memory caches (useful during development)

## How It Works
1. On backend startup, the server reads and parses `server_new/document.pdf`, normalizes text, and splits it into chunks.
2. For chat, the server retrieves top-k relevant chunks for the user query and sends the context + message to Gemini.
3. For structured endpoints (faculty/courses/semesters/subjects), the server prompts Gemini to produce JSON strictly, then caches the parsed results.

## Troubleshooting
- Backend failing with 500 on `/api/chat`:
  - Ensure `GOOGLE_API_KEY` is set in `server_new/.env`
  - Check the console logs for startup warnings
- Client cannot reach API:
  - Make sure the backend is running on port 5051 (default)
  - Verify CRA proxy is present in `client/package.json` and that you’re starting the client via `npm start`
- PDF not loaded:
  - Confirm `server_new/document.pdf` exists and is readable
  - Check `/api/health` for `pdfLoaded: true`

## Notes & Recommendations
- Use Node 18 LTS for best compatibility.
- Keep your API key server-side only; never expose it in frontend code.
- The current retriever uses a simple token-overlap similarity. Consider upgrading to embeddings-based retrieval for better relevance.

