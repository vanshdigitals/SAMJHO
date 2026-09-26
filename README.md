# Samjo — AI for Legal Assistance & Access

**Samajh aane tak.**
Know where you stand.

**Live:** https://samjho-legal-ai.vercel.app · **API health:** https://samjho.onrender.com/api/v1/health

Samjo is an India-first AI system that helps ordinary people understand legal documents and legal situations. It answers four questions: what is this, what matters in it, is anything urgent, and what do I do next.

Samjo is not a lawyer and does not replace one. It provides legal information, document orientation, source-grounded explanation, and next-step guidance.

**Chosen vertical: residential tenancy.** Rental agreements and housing notices in India — a notice to vacate, a rent demand, a lease a tenant is about to sign. One vertical, designed around one persona: a tenant or small landlord with no lawyer, a document they did not draft, and often a clock already running. Narrow scope is deliberate. The deterministic amount, date and notice-period extraction, the urgency rules and the plain-language register are all tuned to this document family, and would be weaker if spread across every kind of contract.

## What it does

1. **Reads the document** — PDF, DOCX or a photo. Tells you what kind of document it is, and how sure it is.
2. **Says what it is, in plain language** — a source-grounded briefing in eight fixed sections, not a summary.
3. **Names your obligations** — what the document requires, of whom.
4. **Flags risks** — clauses worth attention before you sign or reply.
5. **Pulls out the money** — amounts, deposits, interest, charges, each traced to the sentence it came from.
6. **Pulls out the deadlines** — dates that matter, and what is time-sensitive.
7. **Surfaces inconsistencies** — where two parts of the same document appear to say different things.
8. **Gives you next steps** — a structured, ordered list of factual steps, never legal strategy.
9. **Prepares you for a professional** — questions to ask a qualified lawyer, with the reason each one matters.
10. **Shows its evidence** — every substantive claim opens the exact quoted sentence, its page, and its surrounding context.
11. **Keeps the boundary** — legal information, never legal advice.
12. **Works without a document too** — a situation-first intake for people who have a problem but nothing to upload.

### How it maps to the challenge

| Challenge capability | Samjo implementation | Status |
|---|---|---|
| Simplify complex legal documents | Source-grounded briefing, `ai_interpretation` per item | Implemented |
| Highlight important clauses | Obligations, Watch out, Important details | Implemented |
| Identify obligations | `obligations[]` — "What you need to do" | Implemented |
| Identify risks | `risks[]` — "Watch out" | Implemented |
| Identify inconsistencies | `conflicts[]` — "Potential inconsistencies" | Implemented |
| Identify deadlines | `deadlines[]` — "Dates that matter" + urgency | Implemented |
| Understand options and next steps | `next_steps[]` — ordered actionable list | Implemented |
| Generate summaries / actionable outputs | Eight-section briefing, structured next steps | Implemented |
| Prepare questions for a legal professional | `questions[]` — "Questions to ask" + `/d/:id/help` | Implemented |
| Source traceability | Evidence panel: quote, page, context, `/source/{id}` | Implemented |
| Information, not advice | Server-enforced disclaimer, advice-shaped output refused | Implemented |
| Compare contracts or policies | Not implemented — single-document by design | Not implemented |
| Answer follow-up questions about a document | Not implemented | Not implemented |

The last two are listed in the challenge as *potential* directions. Samjo does not implement them, and does not claim to.

## Approach and logic

```
upload or situation
  → extraction (PyMuPDF / python-docx / OCR)
  → characterization gate: is this even a legal document, and which kind?
  → deterministic extraction of amounts, dates, percentages, notice periods
  → AI analysis against a strict JSON schema
  → verification: every quote matched back to the extracted text
  → briefing + evidence
```

Two decisions do most of the work.

**The characterization gate runs first, on the first 2,000 characters.** A grocery bill or a resume is rejected there, before the expensive full-document call. It costs one extra round trip on a genuine document and saves the large one on everything else.

**Verification is separate from generation.** The model produces a quote; the backend then looks for that quote in the extracted text — exact match first, then a normalisation pass for whitespace and typographic quotes. **There is no fuzzy matching.** A claim whose quote cannot be found is dropped before it reaches the screen, and the count of dropped claims is shown to the reader rather than hidden. The interface never merges the document's words with Samjo's reading:

- **Document says** — the exact quoted text
- **Samjo interprets** — the plain-language reading
- **A professional should check** — what a lawyer decides

## Assumptions

- The reader is not a lawyer and has no lawyer yet.
- The document is one the reader already has, in English or Hindi, under 10 MB and 30 pages.
- Jurisdiction is assumed to be India and labelled as an assumption, never asserted.
- A document that fits in one model context — so no retrieval layer is warranted.
- The reader may be on a phone, on a slow connection, and in a hurry.
- Anonymous use: no account, no sign-in, no identity.

## Limitations

- **One vertical.** Residential tenancy documents. Other contract types will produce weaker results.
- **No document comparison and no interactive Q&A.** Neither is implemented.
- **No PDF export.** There is no export endpoint; the briefing is read in the browser.
- **OCR does not run in production.** Render's native Python runtime cannot install Tesseract, so images and scanned PDFs return a typed `OCR_UNAVAILABLE`. Digital PDFs and DOCX are unaffected. OCR works locally when Tesseract is installed.
- **Not legal advice.** Samjo does not predict outcomes, rule on enforceability, or tell anyone what to decide.
- Analysis quality depends on the model. A claim Samjo cannot ground, it drops — which means a thin briefing is possible, and is preferred over a confident wrong one.

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
| Database | Supabase PostgreSQL in production; SQLite for local development and tests |
| Documents | PyMuPDF, python-docx, OCR fallback |
| AI | LLM API behind a provider abstraction, structured outputs |

No vector database. No RAG. No fine-tuning. No agents. The corpus is one document that fits in context; retrieval infrastructure would add cost, latency, and an attack surface for no benefit.

## Documentation

| Document | Contents |
|---|---|
| [PRD](PRD.md) | Problem, users, jobs, features, acceptance criteria |
| [TRD](TRD.md) | Stack, architecture, pipeline, deployment |
| [ARCHITECTURE](ARCHITECTURE.md) | System diagrams |
| [UX_FLOWS](UX_FLOWS.md) | Screens, states, microcopy |
| [DESIGN_SYSTEM](design/SAMJO_DESIGN_SYSTEM.md) | Canonical tokens, typography, components, responsive rules |
| [API](API.md) | REST contracts |
| [DATABASE](DATABASE.md) | Schema and retention |
| [AI_SCHEMAS](AI_SCHEMAS.md) | Pydantic output contracts |
| [AI_SAFETY](AI_SAFETY.md) | Information vs advice boundary |
| [SECURITY](SECURITY.md) | Threat model, injection defence |
| [ACCESSIBILITY](ACCESSIBILITY.md) | WCAG 2.2 AA commitments |
| [TESTING](TESTING.md) | Test strategy and cases |
| [CONTRIBUTING](CONTRIBUTING.md) | Contribution standards and rules |

## Repository layout

```
samjo/
  frontend/          React + TypeScript + Vite
  backend/           FastAPI application
  design/            Design system specifications
  fixtures/          Test documents, including adversarial ones
  .env.example
```

## Prerequisites

Python 3.12+, Node 20+, and **Tesseract OCR** with the `eng` and `hin` language data.

Tesseract is a native binary, not a pip package. Without it, scans and photos
fail with a typed `OCR_UNAVAILABLE` rather than a wrong answer — digital PDFs
and DOCX still work. **The deployed backend has no Tesseract** (see Deploying
below), so this step only enables OCR locally:

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

**Deployed and running.** The full pipeline — upload, extraction, characterization, AI analysis, evidence verification, briefing, source lookup, delete — works end to end in production against Groq (`openai/gpt-oss-120b`).

- Frontend: https://samjho-legal-ai.vercel.app
- Backend health: https://samjho.onrender.com/api/v1/health
- Both test suites run offline with `LLM_PROVIDER=mock` — no key, no network (`pytest` and `cd frontend && npm test`)

Known gaps are listed under [Limitations](#limitations) above. Nothing in this repository documents an endpoint the running service does not answer.
