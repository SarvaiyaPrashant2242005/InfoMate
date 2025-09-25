# InfoMate Backend (server_new)

An Express server that loads `document.pdf` on startup and uses Google Gemini to answer chat questions grounded in the PDF content. It also exposes structured endpoints (faculty, courses, semesters, subjects) parsed from the PDF. The PDF stays server-side and is never sent to the client.

## Requirements
- Node.js 18+ (recommended)
- npm 9+ (recommended)
- A Google Generative AI API key with access to Gemini models

## Setup
1. Create `.env` in this directory (`server_new/.env`):

```
GOOGLE_API_KEY=your_gemini_api_key
# Optional
GEMINI_MODEL=gemini-1.5-flash
PORT=5051
```

2. Install dependencies and start the server:

```
npm install
npm run dev   # nodemon
# or
npm start     # node index.js
```

The server will start on `http://localhost:5051` by default.

## Environment Variables
- `GOOGLE_API_KEY` (required): Your Gemini API key.
- `GEMINI_MODEL` (optional): Defaults to `gemini-1.5-flash`.
- `PORT` (optional): Defaults to `5051`.

## Endpoints
- `GET /api/health`
  - Returns `{ ok, pdfLoaded, chunks }` for quick diagnostics.

- `GET /api/faculty`
  - Returns an array of faculty entries extracted from the PDF.

- `GET /api/courses`
  - Returns an array of courses extracted from the PDF.

- `GET /api/courses/:courseId/semesters`
  - Returns a list of semesters for the given `courseId`.

- `GET /api/courses/:courseId/semesters/:semesterId/subjects`
  - Returns a list of subjects for the given `courseId` and `semesterId`.

- `POST /api/chat`
  - Body: `{ message: string, history?: Array<{ role: 'user'|'model', content: string }> }`
  - Returns: `{ answer: string, meta: { model, usedChunks } }`

- `POST /api/clear-cache`
  - Clears in-memory caches (faculty/courses/semesters/subjects).

## How It Works
1. On startup, the server reads and normalizes `document.pdf`, splits it into chunks, and builds a simple retriever.
2. For chat, it retrieves the most relevant chunks and sends them, along with the user message and recent history, to Gemini.
3. For structured endpoints, it prompts Gemini to output JSON and caches the parsed results.

## Notes
- Keep your API key in `.env` on the server. Do not commit it to version control.
- Consider upgrading the retriever to embeddings-based similarity for better relevance.

## Troubleshooting
- 500 from `/api/chat`: Ensure `GOOGLE_API_KEY` is set and valid; check server logs.
- `pdfLoaded: false` in `/api/health`: Ensure `document.pdf` exists and is readable.
- Port conflicts: If `5051` is in use, the server will attempt the next port automatically. Update the React app proxy if needed.
