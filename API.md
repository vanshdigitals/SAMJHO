# Samjo: API Contracts

Base path `/api/v1`. JSON throughout except upload (multipart) and export (PDF). Authentication is a signed, httpOnly session cookie issued by `POST /sessions`. Every document route enforces ownership in the service layer and returns 404 rather than 403 when ownership fails.

## Conventions

Errors share one shape:

```json
{ "error": { "code": "FILE_ENCRYPTED", "message": "This PDF is password-protected.", "retryable": false } }
```

`code` drives the user-facing copy. `message` is a fallback and is never the primary channel for user-facing text, so translation stays in the frontend.

---

## POST /sessions

Creates an anonymous session. No personal data collected.

Request: `{ "language": "en" | "hi" }`
Response 201: `{ "session_id": "uuid", "expires_at": "iso8601" }` plus `Set-Cookie: samjo_session=<signed>; HttpOnly; Secure; SameSite=Lax`
Rate limit: 20/hour/IP.

---

## POST /documents

Multipart upload.

Input: `file`, optional `situation_context` (string, 500 char cap).

Validation in order: size, extension, declared MIME, magic bytes, page count, encryption check. Failing fast on cheap checks keeps a malicious upload from reaching the parser.

Response 201:
```json
{ "document_id": "uuid", "status": "uploaded", "page_count": 6,
  "mime_type": "application/pdf", "delete_after": "iso8601" }
```

Errors: 413 `FILE_TOO_LARGE`, 415 `UNSUPPORTED_TYPE`, 422 `FILE_ENCRYPTED`, 429 `RATE_LIMITED`.
Rate limit: 10/hour/session.

Security: the original filename is discarded and replaced with a generated internal name. Files are written outside any served directory and are never executed.

---

## GET /documents/{document_id}

Metadata only, never content.

Response 200:
```json
{ "document_id": "uuid", "status": "analyzed", "page_count": 6,
  "document_type": "residential_rental_agreement", "ocr_used": false,
  "ocr_confidence": null, "delete_after": "iso8601" }
```
Errors: 404.

---

## POST /documents/{document_id}/analyze

Starts the pipeline. Returns immediately; analysis is asynchronous.

Request: `{ "language": "en" | "hi" }`

Response 202:
```json
{ "job_id": "uuid", "status": "processing", "stage": "extracting" }
```

Stages, in order, surfaced verbatim to the UI: `extracting`, `ocr`, `characterizing`, `extracting_facts`, `analyzing`, `verifying`, `complete`.

Errors: 404, 409 `ALREADY_PROCESSING`, 422 `NOT_LEGAL_DOCUMENT`, 422 `EXTRACTION_EMPTY`, 429.
Rate limit: 15/hour/session. This endpoint is the cost centre, so it is limited more tightly than reads.

---

## GET /documents/{document_id}/analysis

Poll target and final read.

Response 425 while running:
```json
{ "status": "processing", "stage": "analyzing" }
```

Response 200 when complete: the full `AnalysisResponse` from AI_SCHEMAS.md.

Response 200 when partial:
```json
{ "status": "partial", "completed_sections": ["summary","obligations","money"],
  "failed_sections": ["risks"], "analysis": { } }
```

Errors: 404, 502 `SCHEMA_INVALID`.

---

## GET /documents/{document_id}/source/{source_id}

Returns one verified span plus enough surrounding text to render it in context. This is the only endpoint that returns document content, and it returns a bounded window rather than the whole document.

Response 200:
```json
{ "source_id": "uuid", "quoted_text": "The Tenant shall deposit a sum of Rs. 25,000/-",
  "page": 1, "start_offset": 1204, "end_offset": 1249,
  "context_before": "...", "context_after": "...", "verified": true }
```
Errors: 404.

---

## POST /situations

Creates a situation-first session.

Request: `{ "description": "string", "language": "en" | "hi" }`
Response 201: `{ "situation_id": "uuid", "clarifying_questions": [ { "id": "q1", "question": "..." } ] }`

The response is questions, not answers. A situation with no document does not produce obligations, deadlines or money items, and the contract enforces that by omitting those fields entirely.

---

## POST /situations/{situation_id}/analyze

Request: `{ "answers": [ { "question_id": "q1", "answer": "..." } ] }`

Response 200:
```json
{ "situation_id": "uuid",
  "characterization": { "summary": "...", "confidence": 0.7 },
  "what_we_know": ["..."],
  "what_is_missing": ["..."],
  "possible_next_steps": [ { "step": "...", "type": "information|prepare|see_professional" } ],
  "questions_for_professional": ["..."],
  "professional_help": { "recommended": true, "reason": "..." },
  "disclaimer": "..." }
```

---

## POST /documents/{document_id}/export

Renders the briefing as a PDF.

Request: `{ "language": "en" | "hi", "include_sources": true }`
Response 200: `application/pdf`.

The document is stamped "AI-generated information for understanding purposes. Not legal advice." and is styled to not resemble an official instrument: no seal, no letterhead, no signature block.

---

## DELETE /documents/{document_id}

Immediate purge of the file, extraction, analysis, items and spans.

Response 204. Subsequent reads return 404. Idempotent.

---

## GET /health

Response 200: `{ "status": "ok", "version": "0.1.0", "llm_provider": "mock" }`

No dependency detail, no build paths, no environment values.

## Cross-cutting security

| Concern | Rule |
|---|---|
| Transport | HTTPS only, HSTS in production |
| CORS | Explicit allowlist from `CORS_ALLOWED_ORIGINS`, credentials on |
| Ownership | Service-layer check on every document and situation route |
| Rate limits | Per session and per IP, tightest on analyze |
| Payloads | Body size caps on every route, not only upload |
| Output | Content-Type enforced; extracted text escaped before render |
| Headers | `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`, CSP on the frontend |
| Logging | Ids and metadata only. No content, no filenames, no prompts. |
