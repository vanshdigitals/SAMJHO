# Samjo: Technical Requirements

## 1. Stack and justification

Every component here earns its place. Anything that could not justify itself was left out, and section 12 lists what was deliberately excluded.

| Component | Why it exists | MVP |
|---|---|---|
| React + TypeScript + Vite | Required stack. Strict TS gives the analysis schema end-to-end type safety. | Required |
| Tailwind CSS | Token-driven styling with no runtime cost. | Required |
| TanStack Query | Polling the async analysis job, cache, retry semantics. | Required |
| React Router | Route structure in UX_FLOWS section 1. | Required |
| Zod | Validates API responses at the boundary. Mirrors the Pydantic contract. | Required |
| react-i18next | Hindi and English via translation keys. | Required |
| React Hook Form | Situation intake only. | Should |
| FastAPI + Pydantic | Structured validation is the backbone of the safety model, not a convenience. | Required |
| SQLAlchemy + Alembic | Postgres migration path without rewriting queries. | Required |
| SQLite | Zero-ops single file. Correct choice at this scale. | Required |
| PyMuPDF | PDF text with per-page coordinates, needed for span highlighting. | Required |
| python-docx | DOCX paragraph extraction. | Required |
| pytesseract | OCR fallback for scans and photos. | Required |
| LLM API | Maps arbitrary legal prose to a fixed schema. The one thing only a model can do. | Required |

## 2. Layered architecture

```
API layer          FastAPI routers. HTTP only. No business logic.
  ↓
Application        Services orchestrating a use case.
  ↓
Domain             Pipeline rules, urgency rules, safety rules. Pure functions, no I/O.
  ↓
Infrastructure     DB, filesystem, OCR, LLM provider.
```

Domain logic stays pure so the rules that matter most, urgency classification and span verification, are testable without a database or a network.

```
backend/app/
  main.py
  api/v1/           sessions.py documents.py analysis.py situations.py exports.py health.py
  core/             config.py security.py logging.py errors.py ratelimit.py
  models/           SQLAlchemy ORM
  schemas/          Pydantic request/response + LLM output contracts
  services/
    document_service.py      upload, validation, ownership
    extraction_service.py    PyMuPDF / python-docx, page and offset mapping
    ocr_service.py           fallback, confidence
    characterization_service.py
    deterministic_service.py dates, currency, percentages, notice periods
    analysis_service.py      prompt assembly, LLM call, schema validation
    evidence_service.py      span verification, drop-on-fail
    safety_service.py        high-risk detection, refusal, urgency
    export_service.py
    llm/                     base.py openai.py anthropic.py mock.py
  repositories/
  workers/          analysis job runner
  prompts/          versioned templates, no secrets
  utils/
tests/
```

## 3. The pipeline

```
UPLOAD
 └─ FILE VALIDATION        extension, MIME, magic bytes, size, page count, encryption
     └─ TEXT EXTRACTION    PyMuPDF or python-docx, retaining page + char offsets
         └─ OCR FALLBACK   only when no usable text layer; records confidence
             └─ SANITISATION   strip hidden/zero-width/off-page text, normalise
                 └─ CHARACTERIZATION   document type + confidence
                     └─ DETERMINISTIC EXTRACTION   dates, money, %, notice periods
                         └─ STRUCTURED LLM ANALYSIS   constrained JSON, temp 0
                             └─ SOURCE SPAN MAPPING   locate each quote in the text
                                 └─ VALIDATION       schema + span existence
                                     └─ SAFETY CHECK  high risk, refusal, no external law
                                         └─ URGENCY   evidence-derived classification
                                             └─ FINAL JSON → FRONTEND
```

### Why the split matters

The model is not asked to compute. It is asked to interpret. Dates, amounts and percentages are parsed deterministically first and passed into the prompt as known facts. A regex does not hallucinate a security deposit of ₹2,50,000 when the document says ₹25,000, and a language model sometimes does.

### Span mapping

Extraction stores text with `(page, start, end)` offsets. The model returns a verbatim quote. `evidence_service` performs exact match, then normalised match (whitespace and quote characters). No fuzzy threshold, because a fuzzy match is how a fabricated claim gets attached to a real-looking citation. No match means the item is dropped and counted in `dropped_items` for observability.

## 4. Async processing

Analysis exceeds a comfortable request timeout. `POST /documents/{id}/analyze` returns `202` with a job id. The frontend polls every 1.5s and renders real stage names from the job record. The worker is an in-process background task, sufficient at MVP scale and replaceable with a queue later without touching the API contract.

Progress is never a percentage. It is the pipeline stage, because a fake progress bar is a lie about a process the user is being asked to trust.

## 5. LLM provider abstraction

```python
class LLMProvider(Protocol):
    async def analyze(
        self,
        *,
        system_instructions: str,
        untrusted_document: str,
        known_facts: DeterministicFacts,
        schema: type[BaseModel],
    ) -> BaseModel: ...
```

Three implementations: OpenAI, Anthropic, Mock. A provider is eligible only if it supports constrained decoding against a JSON schema. `MockProvider` returns schema-valid fixtures so the whole suite, including adversarial tests, runs with no key and no network.

`untrusted_document` is a separate parameter, never string-concatenated into `system_instructions`. The signature enforces the security boundary rather than relying on discipline.

## 6. Error taxonomy

Typed errors map to specific user-facing copy in UX_FLOWS section 6.

| Code | HTTP | Meaning |
|---|---|---|
| `FILE_TOO_LARGE` | 413 | Over `MAX_UPLOAD_BYTES` |
| `UNSUPPORTED_TYPE` | 415 | MIME or magic bytes not allowed |
| `FILE_ENCRYPTED` | 422 | Password-protected |
| `EXTRACTION_EMPTY` | 422 | No usable text after OCR |
| `OCR_LOW_CONFIDENCE` | 200 | Succeeds with a warning flag |
| `NOT_LEGAL_DOCUMENT` | 422 | Characterization rejected it |
| `SCHEMA_INVALID` | 502 | Model output failed validation twice |
| `ANALYSIS_PARTIAL` | 200 | Some sections produced, flagged |
| `RATE_LIMITED` | 429 | Quota exceeded |
| `NOT_FOUND` | 404 | Missing, or not owned by this session |

Ownership failures return 404 rather than 403, so the API does not confirm that a document id exists.

## 7. Performance

Target for a typical 10-page document is a briefing within roughly 60 seconds under normal conditions.

| Stage | Budget |
|---|---|
| Validation | < 200ms |
| Extraction (digital) | < 2s |
| OCR (10 pages) | < 25s |
| Deterministic | < 500ms |
| LLM analysis | 10 to 40s |
| Verification + safety | < 500ms |

One LLM call, not a chain. Temperature 0. Characterization runs on the first 2000 characters rather than the whole document, so a non-legal upload is rejected before an expensive call.

## 8. Observability

Operational metrics only: request duration, stage durations, failure code, document type, page count, OCR used, dropped item count, schema retry count.

Never logged: document text, extracted PII, prompts containing document content, LLM responses, filenames as uploaded. The logger runs a formatter that drops any field not on an allowlist, so logging sensitive content requires deliberately defeating the infrastructure rather than merely forgetting.

## 9. Configuration

All of section `.env.example`. No defaults that would be unsafe in production. The app refuses to start if `SESSION_SIGNING_KEY` or `ENCRYPTION_KEY` is empty while `APP_ENV=production`.

## 10. Deployment

Single FastAPI process behind a reverse proxy with TLS. Static frontend build served separately. SQLite on a persistent volume. A scheduled job purges expired documents, extractions and sessions hourly.

Postgres migration requires changing `DATABASE_URL` and running migrations. No query rewrites, because nothing SQLite-specific is used.

## 11. Implementation order

Each phase ends green before the next begins.

| Phase | Deliverable | Done when |
|---|---|---|
| 0 | Docs, repo, CI | This document set exists, CI runs lint and type checks |
| 1 | Design system, landing, routing | Tokens in Tailwind config, landing passes axe |
| 2 | Upload, validation, extraction | A real PDF yields text with offsets; bad files rejected on magic bytes |
| 3 | LLM analysis + schemas | Mock provider produces a schema-valid analysis |
| 4 | Span verification | Fabricated quotes are dropped and counted |
| 5 | Briefing UI | Evidence drawer shows document-says vs interprets |
| 6 | Urgency + safety | Notice fixture yields HIGH; advice request is reframed |
| 7 | Hindi + read-aloud | Language switch re-renders without re-analysis |
| 8 | Export | PDF briefing with disclaimer |
| 9 | Security hardening | Injection fixture defeated; rate limits enforced |
| 10 | Testing + accessibility | Suite in TESTING.md green; keyboard path complete |
| 11 | Polish | Copy, spacing, states audit |

Phase 4 is the gate. If span verification drops more than 30 percent of items on real fixtures, the extraction prompt gets fixed before any further feature work, because everything downstream depends on grounding being reliable.

## 12. Deliberately excluded

| Excluded | Reason |
|---|---|
| Vector DB / RAG | One document, fits in context. Adds cost, latency and an injection surface for no retrieval benefit. |
| Fine-tuning | Structured prompting with deterministic pre-extraction solves this. |
| Agents / tool use | Samjo reads and explains. It takes no actions, which removes excessive-agency risk by construction. |
| Microservices, Kubernetes | One process. Scaling is not the problem being solved. |
| MongoDB | The data is relational: documents have pages, analyses have items, items have spans. |
| Redis | In-process background tasks suffice; adding a broker is premature. |
| Accounts / auth provider | Anonymous sessions reduce both friction and the amount of sensitive data held. |
