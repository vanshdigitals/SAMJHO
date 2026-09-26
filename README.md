# Samjo

**Samajh aane tak.**
Know where you stand.

Samjo is an India-first AI system that helps ordinary people understand legal documents and legal situations. It answers four questions: what is this, what matters in it, is anything urgent, and what do I do next.

Samjo is not a lawyer and does not replace one. It provides legal information, document orientation, source-grounded explanation, and next-step guidance.

## The problem

The failure is not that legal language is hard to read. The failure is orientation. People who receive a notice or an agreement cannot tell what kind of document it is, which of forty clauses affect them, whether a clock is running, or what to do in the next 48 hours. Summarising the text does not fix any of that.

## What makes this different

Every substantive claim Samjo makes is tied to a quoted span from the user's own document. If the span cannot be verified against the extracted text, the claim is dropped before it reaches the screen. The interface never merges three different things:

- **Document says** the exact quoted text
- **Samjo interprets** the plain-language reading
- **Verify** what a professional should confirm

## Stack

| Layer | Choice |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | Python, FastAPI, Pydantic, SQLAlchemy |
| Database | SQLite for MVP, Postgres-ready |
| Documents | PyMuPDF, python-docx, OCR fallback |
| AI | LLM API behind a provider abstraction, structured outputs |

No vector database. No RAG. No fine-tuning. No agents. The corpus is one document that fits in context; retrieval infrastructure would add cost, latency, and an attack surface for no benefit.

## Documentation

| Document | Contents |
|---|---|
| [PRD](docs/PRD.md) | Problem, users, jobs, features, acceptance criteria |
| [TRD](docs/TRD.md) | Stack, architecture, pipeline, deployment |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | System diagrams |
| [UX_FLOWS](docs/UX_FLOWS.md) | Screens, states, microcopy |
| [DESIGN_SYSTEM](docs/DESIGN_SYSTEM.md) | Tokens, type, components |
| [API](docs/API.md) | REST contracts |
| [DATABASE](docs/DATABASE.md) | Schema and retention |
| [AI_SCHEMAS](docs/AI_SCHEMAS.md) | Pydantic output contracts |
| [AI_SAFETY](docs/AI_SAFETY.md) | Information vs advice boundary |
| [SECURITY](docs/SECURITY.md) | Threat model, injection defence |
| [ACCESSIBILITY](docs/ACCESSIBILITY.md) | WCAG 2.2 AA commitments |
| [TESTING](docs/TESTING.md) | Test strategy and cases |

## Repository layout

```
samjo/
  frontend/          React + TypeScript + Vite
  backend/           FastAPI application
  docs/              Specifications
  fixtures/          Test documents, including adversarial ones
  .env.example
```

## Prerequisites

Python 3.12+, Node 20+, and **Tesseract OCR** with the `eng` and `hin` language data.

Tesseract is a native binary, not a pip package. Without it, scans and photos
fail with a typed `OCR_UNAVAILABLE` rather than a wrong answer — digital PDFs
and DOCX still work. Deployment installs it in the image (`backend/Dockerfile`),
so this step is for local development only:

```bash
# macOS
brew install tesseract tesseract-lang

# Debian / Ubuntu
sudo apt-get install tesseract-ocr tesseract-ocr-eng tesseract-ocr-hin

# Windows
winget install UB-Mannheim.TesseractOCR
```

The backend finds the binary on `PATH` or at the usual install locations. If
yours is somewhere else, set `TESSERACT_CMD` (and `TESSDATA_PREFIX` if the
language data is not beside it) in `.env`. The startup log line
`ocr_startup_ready` reports the version and the languages actually found.

## Running it

Both commands run from the repository root — the backend imports itself as
`backend.app.*`, so the root is the import root.

```bash
# Backend
python -m venv .venv && source .venv/bin/activate    # Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
cp .env.example .env        # then add your LLM key; .env is gitignored
alembic upgrade head
uvicorn backend.app.main:app --reload --port 8000

# Frontend (second terminal)
cd frontend
npm install
npm run dev                 # http://localhost:5173, proxies /api to :8000
```

Set `LLM_PROVIDER=mock` to run the full pipeline with no API key and no network calls. The mock provider returns schema-valid fixtures, so the entire test suite runs offline.

### Choosing a provider

| `LLM_PROVIDER` | Key variable | Notes |
|---|---|---|
| `mock` | none | Fixtures. Offline. Never reached as a fallback from a real provider. |
| `groq` | `GROQ_API_KEY` | Free tier, no card. Its Services Agreement §4.2 forbids training on Inputs/Outputs on every tier, so real documents are permitted. Default model `openai/gpt-oss-120b`. |
| `gemini` | `LLM_API_KEY` | The **unpaid** tier trains on submitted content and its terms forbid confidential data, so production startup is refused unless `GEMINI_BILLING_CONFIRMED=true`. |

`LLM_FALLBACK_PROVIDER` is empty by default, which disables failover. Set it to
another real provider to allow one deterministic swap when the primary is
unavailable. It never falls back to `mock`: a real document that cannot be
analysed must produce a real failure, not fixture content.

```bash
pytest                      # backend, from the repository root
cd frontend && npm test     # frontend
```

## Deploying

GitHub → Vercel (frontend) → Render native Python (backend) → Supabase Postgres → Groq.
No Docker is required at any point, locally or in CI.

| Piece | Config | Notes |
|---|---|---|
| Frontend | `frontend/vercel.json` | Vite build, SPA rewrite for `/d/:id`. Set `VITE_API_BASE_URL` to the Render origin plus `/api/v1`. |
| Backend | `render.yaml` | `runtime: python`. Build `pip install -r backend/requirements.txt`; start runs `alembic upgrade head` then uvicorn. |
| Database | `DATABASE_URL` | Paste the Supabase URI unedited — `config.sqlalchemy_url` rewrites the scheme to the installed driver. |
| Model | `GROQ_API_KEY` | Free tier, no card. Entered in the Render dashboard, never in the repository. |

**OCR is unavailable on the native runtime.** Render's native runtimes cannot
install system packages, and Tesseract is one. Digital PDFs and DOCX work
fully; images and scanned PDFs return `OCR_UNAVAILABLE`, which the frontend
renders as a typed error with a retry. `backend/Dockerfile` remains in the
repository as the route to OCR in production if that trade stops being
acceptable — switch `render.yaml` to `runtime: docker`.

**Migrations run in the start command** because Render's pre-deploy command is
paid-only. The free plan runs a single instance, so nothing races it. On a
paid plan, move `alembic upgrade head` into `preDeployCommand`.

## Status

Phase 0 complete: specifications. See [TRD, Implementation order](docs/TRD.md#implementation-order) for what lands next.
