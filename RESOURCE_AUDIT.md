# Samjo: Resource, API, LLM and Implementation Audit

**Status:** Planning only. No implementation started.
**Date:** 2026-09-22
**Scope:** What Samjo actually needs to build and run the MVP, what it costs, and in what order it gets built.

All forward-looking claims about model availability, pricing, free tiers and hosting limits were verified against official documentation on 2026-09-22. Sources are cited inline. Where an official page declined to publish a number, this document says so rather than inventing one.

---

## 0. Two findings that change the plan

Read these before anything else. Both are conflicts between the cost-first principle and commitments already made in the existing spec set.

### 0.1 The Gemini free tier trains on your data. Samjo's security model forbids that.

Google's Gemini API Additional Terms distinguish the unpaid and paid tiers explicitly. On the **unpaid tier**, Google "uses the content you submit to the Services and any generated responses to provide, improve, and develop Google products," and "human reviewers may read, annotate, and process your API input and output." On the **paid tier**, Google "doesn't use your prompts ... or responses to improve our products," and logs are kept briefly and solely for abuse detection. ([Gemini API Additional Terms](https://ai.google.dev/gemini-api/terms))

SECURITY.md §5 commits to the opposite: *"The provider must be configured on a tier that does not train on submitted content, under a data processing agreement."*

Samjo's uploads are tenancy agreements, eviction notices, and sometimes identity and financial information belonging to people already in trouble. Sending those through a tier where human reviewers may read them is not a cost optimisation, it is a breach of the product's stated privacy posture — and the privacy page promises users plain disclosure.

**This is not silently resolvable. It is a decision you have to make.** The recommendation in §4.4 is: free tier for development and synthetic fixtures only; billing enabled (paid tier) before any real user document is processed. Enabling billing does not mean spending meaningfully — see §23.

### 0.2 No free hosting tier can run the deployment described in TRD §10.

TRD §10 specifies "SQLite on a persistent volume." Every free tier investigated fails that requirement:

| Platform | Why the documented architecture does not fit on the free tier |
|---|---|
| Render | Ephemeral filesystem — "local SQLite databases ... are lost every time the service redeploys, restarts, or spins down." Persistent disks unavailable on free. Free Postgres **expires 30 days after creation**. ([Render Free docs](https://render.com/docs/free)) |
| Fly.io | "There is no free account/free tier on Fly.io" — only a trial. Volumes cost $0.15/GB/mo. ([Fly.io pricing](https://fly.io/docs/about/pricing/)) |
| Railway | Free plan provides $1 of credit per month. Not enough to keep a service running. ([Railway pricing](https://docs.railway.com/pricing/plans)) |
| Hugging Face Spaces | Default disk is not persistent; creating a compute Space requires a paid plan. ([HF Spaces storage](https://huggingface.co/docs/hub/en/spaces-storage)) |

**The resolution is architectural, and it is a good one.** Samjo deletes everything after 24 hours by design (`DOCUMENT_TTL_HOURS=24`). Uploaded files are transient — validated, extracted, then discarded. That makes Samjo unusually tolerant of an ephemeral filesystem. Move durable state (sessions, analyses, spans) to an external managed Postgres, keep only in-flight files on local disk, and the free tier works. See §15.

---

## 1. Source audit

16 files read in full. **The research documents referenced in the brief are not present** — not in the project directory, not elsewhere on this machine, and not in the connected Drive account. Specifically missing: the legal AI research, problem research, product research, competitor research, naming research, and the Samjo brand decision document.

Their conclusions appear to have been folded into PRD.md and AI_SAFETY.md (the root-cause chain, the persona table, the hallucination-rate argument, the brand line "Samajh aane tak"). **This audit is built on the 16 spec files only.** If the research documents contain decisions that contradict what follows, supply them and I will re-run the affected sections.

| File | What it contributes | Important decisions | Open questions |
|---|---|---|---|
| `README.md` | Product framing, stack table, repo layout, run instructions | React/TS/Vite + FastAPI/Pydantic + SQLite; no vector DB, no RAG, no fine-tuning, no agents | Describes `docs/`, `frontend/`, `backend/`, `fixtures/` — **none exist**. Links are broken. |
| `PRD.md` | Problem, 5 personas, 5 jobs, MVP scope, 10 acceptance criteria | Orientation over summary; hybrid document + situation entry; MVP family = residential rental + housing notices; 10 MB / 30 pages | §9.8 conflicts with the API's per-analysis `language` param (C4) |
| `TRD.md` | Stack justification, layered architecture, pipeline, perf budgets, 12 phases | Deterministic extraction before LLM; one LLM call; temp 0; in-process worker; SQLite → Postgres path | Names OpenAI + Anthropic providers only — no Gemini. Phase list (0–11) differs from the 17 phases in this brief. |
| `ARCHITECTURE.md` | 8 Mermaid diagrams: system, journey, pipeline, request flow, ER, safety boundary, session, export | LLM is the only external dependency; untrusted text passed as a data parameter | Export flow assumes a PDF renderer; none is chosen anywhere |
| `API.md` | 11 endpoints, error shape, cross-cutting security | Signed httpOnly cookie; 404 not 403 on ownership failure; 425 while polling | No question-asking endpoint exists, but TESTING #28 and AI_SAFETY §3 require one |
| `AI_SCHEMAS.md` | Pydantic output contracts, validation chain, prompt structure | Three separate states; span verification; parser wins over model on amounts/dates | Deeply nested schema vs. Gemini's documented rejection of large/nested schemas (§4.5) |
| `AI_SAFETY.md` | Information/advice boundary, refusal table, high-risk handling | Never predict outcomes; never assert law absent from the document; minors pathway | Implies a Q&A surface with no endpoint behind it |
| `SECURITY.md` | Threat model, 6-layer injection defence, file validation, MVP vs production split | No-training provider tier **required**; app-level encryption of extracted text | Encryption library unnamed. Directly conflicts with Gemini free tier (§0.1) |
| `DATABASE.md` | 10 tables, retention, indexes, Postgres migration notes | Real deletion not soft flags; encrypted extractions; audit table safe to read in full | `situations.description` marked encrypted; same unnamed crypto dependency |
| `UX_FLOWS.md` | 9 routes, 2 flows, state inventory, error copy, microcopy rules | States not routes; six states per async surface; banned vocabulary list | — |
| `DESIGN_SYSTEM.md` | Colour, type, spacing, the evidence rail, components, Tailwind wiring | DM Sans + Inter, self-hosted; Radix primitives; semantic colour only | Defines **no dark theme**, but ACCESSIBILITY §5 gates axe on "light and dark" (C5) |
| `ACCESSIBILITY.md` | WCAG 2.2 AA commitments, testing gates | Keyboard-complete; 44px targets; Hindi voice with graceful fallback | Dark mode gate has no tokens to test against |
| `TESTING.md` | 15 fixtures, 57 numbered cases, CI gates | Everything runs against `MockProvider` with no key and no network | `fixtures/` does not exist yet |
| `CONTRIBUTING.md` | 5 non-negotiables, PR checklist | A provider that cannot guarantee schema compliance is not eligible | — |
| `.env.example` | 27 variables across 8 groups | `LLM_PROVIDER=mock` default; TTLs; rate limits | `RATE_LIMIT_QUESTIONS_PER_HOUR` governs an endpoint that does not exist (C3) |

### 1.1 Contradictions found — reported, not resolved

These need your decision. I have not silently picked a side on any of them.

**C1 — The provider list excludes the recommended provider.**
TRD §5 specifies three implementations: OpenAI, Anthropic, Mock. `.env.example` says `LLM_PROVIDER=mock | openai | anthropic`. This audit recommends **Gemini** as primary (§4). Adopting it means editing TRD §5, `.env.example`, and the `services/llm/` file list. Low effort, but it is a documented decision being changed.

**C2 — "One LLM call, not a chain" is already two calls.**
TRD §7 states "One LLM call, not a chain." TRD §7 also states "Characterization runs on the first 2000 characters." Characterization + analysis = two calls. The intent is clear (no multi-step agentic chains) but the sentence as written is false. Recommend rewording to "two bounded calls, no chain." Note that §11 may add a third for bilingual output.

**C3 — A rate limit exists for an endpoint that does not.**
`RATE_LIMIT_QUESTIONS_PER_HOUR=40` is defined. No question endpoint appears in API.md. Meanwhile TESTING case #28 ("Asking about a clause absent from the document returns 'not found in this document'") and the AI_SAFETY §3 refusal table both require a user-question surface. **Either the endpoint is missing from API.md, or the variable and those tests are stale.** This is a scope question, not a typo — a follow-up Q&A surface is a real feature with its own injection surface. See §16.

**C4 — Language switching cannot work as specified.**
PRD §9.8 acceptance: *"switching language re-renders the briefing without re-running analysis."* But `POST /documents/{id}/analyze` takes `{"language": "en"|"hi"}` and the analysis persists in one language. Switching therefore requires either re-analysis (violating §9.8) or a stored second language. Three options, costed in §11. **Critical constraint either way: `source_span.quoted_text` must never be translated.** It is evidence, verified by exact match against the extracted text. A translated quote fails verification and is definitionally no longer a quote.

**C5 — Dark mode is gated in CI but has no tokens.**
ACCESSIBILITY §5 gates axe on "Every route, light and dark." DESIGN_SYSTEM §2 defines a single `:root` palette with no dark variant. Either add dark tokens (real work — the warm paper base does not invert trivially) or drop "and dark" from the gate. Recommend dropping it for MVP.

**C6 — README describes a repository that does not exist.**
`docs/`, `frontend/`, `backend/`, `fixtures/` are all referenced; all 16 spec files sit flat at the repo root; the project is not a git repository. Phase 1 fixes this.

**C7 — Encryption is required but unspecified.**
SECURITY.md §5 and DATABASE.md require application-level encryption of `extractions.content_encrypted` and `situations.description`, keyed by `ENCRYPTION_KEY`. No library, algorithm or key-derivation scheme is named anywhere. See §18.

---

## 2. LLM strategy

### 2.1 Model comparison

Pricing is per 1M tokens. Gemini figures are introductory rates in effect through 2026-12-31 ([Gemini pricing](https://ai.google.dev/gemini-api/docs/pricing)); Claude figures are first-party API rates; OpenAI figures are list rates ([OpenAI pricing](https://developers.openai.com/api/docs/pricing)).

| Model | Primary role | Strength | Weakness | Free tier | Cost (in/out) | Samjo fit |
|---|---|---|---|---|---|---|
| **Gemini 3.8 Flash** (`gemini-3.8-flash`) | **Recommended primary** | 1M context; native PDF vision; JSON-schema structured output; strong Indic coverage; free tier exists; cheapest credible option | Free tier trains on data (§0.1); large/nested schemas may be rejected; `minimal` thinking level unsupported | **Yes** | $0.75 / $3.75 | **Best.** Covers analysis, characterization and OCR fallback in one dependency |
| Gemini 3.1 Flash-Lite (`gemini-3.1-flash-lite`) | Cost lever / characterization | ~2.6× cheaper than 3.8 Flash | Lower reasoning quality; unproven on legal nuance and Hindi | Yes (Standard) | $0.25 / $1.50 | **Good for characterization** (a 2000-char classification task). Evaluate for analysis only after §14 evals |
| Claude Sonnet 5 (`claude-sonnet-5`) | Fallback candidate | Excellent instruction-following and refusal discipline; 1M context; strong structured outputs | ~2.7× the input cost, 2.7× output; **no free tier** | No | $2.00 / $10.00 | **Recommended fallback provider** — different vendor, different failure modes |
| Claude Haiku 4.5 (`claude-haiku-4-5`) | Cheap fallback | Cheapest Claude; 200K context | 200K context; weaker on nuanced interpretation | No | $1.00 / $5.00 | Viable cheaper fallback if Sonnet 5 cost bites |
| Claude Opus 5 (`claude-opus-5`) | **Development only** | Strongest reasoning | Far too expensive for per-document runtime | No | $5.00 / $25.00 | **Not in runtime.** See §3 |
| GPT-5.6 Luna | Fallback candidate | Very cheap | No free tier; no advantage over Gemini Flash-Lite here | No | $0.20 / $1.20 | Possible, but adds a third vendor for no capability gain |
| GPT-5.6 Terra | Fallback candidate | Balanced | No free tier | No | $2.00 / $12.00 | No advantage over Sonnet 5 for this task |
| Open-source (Llama / Mistral, self-hosted) | — | No per-token cost; no data egress | Needs a GPU; free hosting tiers cannot run it; no reliable constrained JSON decoding; weaker Hindi legal reasoning | n/a (infra cost) | Infra only | **Not viable for MVP.** The hosting analysis in §15 rules it out |

### 2.2 Dimension-by-dimension, for the dimensions Samjo actually depends on

| Requirement | Why Samjo needs it | Verdict |
|---|---|---|
| Structured JSON output | CONTRIBUTING: "If a provider cannot guarantee schema compliance, it is not eligible" | Gemini, Claude and OpenAI all qualify. Gemini supports a JSON Schema subset via `response_format` with `mime_type: application/json` and a `schema`; the Python SDK accepts a Pydantic model's `model_json_schema()` directly ([structured output docs](https://ai.google.dev/gemini-api/docs/structured-output)) |
| Long-context documents | 30-page cap ≈ 25k tokens worst case | Trivially satisfied. 1M context on Gemini 3.8 Flash and Claude. **No chunking needed** — confirms the "no RAG" decision |
| Document / OCR understanding | Scanned notices and phone photos | Gemini has native PDF vision: up to 50 MB / 1000 pages, ~258 tokens per page, and **native text extracted from PDFs is not billed** ([document processing](https://ai.google.dev/gemini-api/docs/document-processing)). This is a genuine differentiator — see §8 |
| Hindi | Personas C and E; PRD §9.8 | Gemini and Claude both handle Devanagari well. **Budget for token inflation**: Devanagari costs materially more tokens per character than Latin. Re-baseline with a token count before trusting §23 |
| Source-grounding | The entire product thesis | **No model provides this.** Grounding comes from Samjo's own `evidence_service` exact-match verification. Model choice is nearly irrelevant here — which is exactly why the architecture is sound |
| Latency | 10–40s budget (TRD §7) | Gemini Flash at `thinking: low` is the fastest credible option |
| Factual consistency | Hallucinated obligations | Mitigated structurally by span verification, not by model choice |
| SDK quality | Team velocity | `google-genai` (Python) is mature and supports Pydantic schemas directly |

### 2.3 Multi-model decision: ONE model, plus a configured fallback

Evaluated against the three options in the brief:

- **Task-specific models (extraction / analysis / safety validation split): rejected.** Extraction is deterministic (PyMuPDF), not a model task. Safety validation is rule-based in `safety_service` — routing it to a second LLM would replace a testable pure function with a probabilistic one, which is worse in every way that matters here. Only characterization and analysis are model tasks, and one model does both.
- **Primary + fallback: adopted, but as configuration, not orchestration.** `LLMProvider` already abstracts this. The fallback is a provider swap on sustained failure, not a runtime chain. No request calls two providers hoping one works — that doubles cost and latency on the unhappy path.
- **Single model with no fallback: rejected** only because Gemini free-tier rate limits are not published (§4.3) and a hackathon demo failing live is an unacceptable risk.

**Decision: Gemini 3.8 Flash primary, Claude Sonnet 5 as a configured fallback, Mock for tests.** Characterization may be routed to Flash-Lite as a cost optimisation *after* evals prove it holds (§14). Three providers in the codebase, one in the hot path.

---

## 3. Development-time AI vs production runtime AI

These are separate budgets, separate vendors, and separate risk surfaces. Conflating them is a common way to accidentally put an expensive model in a per-request path.

| | **A. Development-time AI** | **B. Production runtime AI** |
|---|---|---|
| What | Research, architecture review, code review, prompt review, security review, test generation | Document characterization and structured analysis |
| Model | Claude Opus 5 / Claude Code | Gemini 3.8 Flash |
| Who pays | The team's existing Claude subscription | The Samjo project's Gemini billing account |
| In `requirements.txt`? | **No** | Yes (`google-genai`) |
| In `.env.example`? | **No** | Yes (`LLM_API_KEY`) |
| Scales with users? | No | Yes — this is the cost centre |
| Sees user documents? | **Never** | Yes |

**Claude being used to build Samjo creates no runtime dependency on the Claude API.** The `ClaudeProvider` in §22 exists as a fallback implementation, which is a separate and deliberate decision — not a consequence of the team's tooling.

---

## 4. Gemini investigation

### 4.1 "Gemini Flash 3.8" — corrected identifier

The name in the brief is close but not the identifier. The correct current model is:

- **Product name:** Gemini 3.8 Flash (not "Gemini Flash 3.8")
- **API model ID:** `gemini-3.8-flash`

It is real, current and available. ([Models](https://ai.google.dev/gemini-api/docs/models), [What's new in Gemini 3.8 Flash](https://ai.google.dev/gemini-api/docs/latest-model))

### 4.2 Verified capabilities

| Property | Value | Source |
|---|---|---|
| Model ID | `gemini-3.8-flash` | [latest-model](https://ai.google.dev/gemini-api/docs/latest-model) |
| Context window | 1M tokens | [latest-model](https://ai.google.dev/gemini-api/docs/latest-model) |
| Max output | 64K tokens | [latest-model](https://ai.google.dev/gemini-api/docs/latest-model) |
| Thinking levels | `low` / `medium` (default) / `high`. **`minimal` is not supported on 3.8 Flash** | [latest-model](https://ai.google.dev/gemini-api/docs/latest-model) |
| Structured output | Yes — JSON Schema subset via `response_format`; Pydantic supported in the Python SDK | [structured-output](https://ai.google.dev/gemini-api/docs/structured-output) |
| PDF input | Up to 50 MB / 1000 pages; ~258 tokens/page; native PDF text is **not billed** | [document-processing](https://ai.google.dev/gemini-api/docs/document-processing) |
| Image input | Yes | [document-processing](https://ai.google.dev/gemini-api/docs/document-processing) |
| Free tier | **Yes** — input and output free of charge | [pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| Paid pricing | $0.75 / $3.75 per 1M in/out through 2026-12-31; **$1.50 / $7.50 from 2027-01-01** | [pricing](https://ai.google.dev/gemini-api/docs/pricing) |
| Files API | Uploads stored 48 hours at no cost | [document-processing](https://ai.google.dev/gemini-api/docs/document-processing) |
| Availability | Google AI Studio and the Gemini Developer API | [models](https://ai.google.dev/gemini-api/docs/models) |

### 4.3 Rate limits — not published, and you must not guess them

Google's rate-limits page no longer publishes numeric RPM/TPM/RPD values. It states that limits "depend on a variety of factors (such as your usage tier) and can be viewed in Google AI Studio," and that exceeding any limit returns **`429 RESOURCE_EXHAUSTED`**. ([rate-limits](https://ai.google.dev/gemini-api/docs/rate-limits))

**Action for Phase 6:** read your account's actual limits from the [AI Studio rate limit dashboard](https://aistudio.google.com/rate-limit) and record them in the repo. Do not hardcode a guessed limit; build the 429 backoff path in §25 instead, which is correct regardless of the number.

### 4.4 The free-tier decision

| Phase | Tier | Data used | Justification |
|---|---|---|---|
| Development, CI, fixtures | **Free** | Synthetic fixtures only — no real documents | Zero cost; training on synthetic rental agreements you wrote is harmless |
| Hackathon demo | **Paid (billing enabled)** | Demo documents, possibly judges' own | Cost is a few rupees (§23); a judge uploading a real document on a training tier is a serious problem |
| Any real user | **Paid — mandatory** | Real legal documents | SECURITY.md §5. Non-negotiable |

Enable billing early. The paid tier still costs approximately nothing at MVP volume, and it removes the §0.1 conflict entirely.

### 4.5 Schema-complexity risk — plan for it now

Google documents that "very large or deeply nested schemas may be rejected," without publishing a depth or size limit. ([structured-output](https://ai.google.dev/gemini-api/docs/structured-output))

`AnalysisResponse` is exactly the shape at risk: a root model containing seven lists of items, each item carrying a nested `SourceSpan`, plus `UrgencyAssessment`, `ProfessionalHelp`, `SafetyFlags`, `Conflict` and `SourceMetadata`.

**Mitigation, in Phase 6 before any other AI work:** generate `AnalysisResponse.model_json_schema()` and send one live request with it. If rejected, the fallback is to split the analysis into two constrained calls along a natural seam (items vs. assessment) rather than to loosen the schema. **Loosening the schema is not an option** — the schema is the safety mechanism (AI_SCHEMAS.md preamble).

---

## 5. Document processing stack

### 5.1 Format scope

| Format | MVP? | Parser | Notes |
|---|---|---|---|
| Digital PDF | **Must** | PyMuPDF | Primary path. Gives per-page coordinates and char offsets — required for span highlighting |
| DOCX | **Must** | python-docx | Paragraph order preserved. Reject macro-bearing files at validation |
| JPEG / PNG | **Must** | OCR | Persona A photographs a notice with a phone. This is the realistic entry path |
| Scanned PDF (no text layer) | **Must** | OCR fallback | Detected by empty/near-empty text layer |
| DOC (legacy), ODT, RTF, HEIC | Not in MVP | — | Already excluded by `ALLOWED_MIME_TYPES`. Keep it that way |

### 5.2 OCR comparison

| Option | Cost | Quality on Devanagari | Deployment weight | Data egress | Verdict |
|---|---|---|---|---|---|
| **Tesseract** (`pytesseract` + `hin`/`eng` data) | Free | Adequate on clean scans, weak on phone photos and low-contrast Devanagari | ~10 MB binary, CPU-only, runs anywhere | **None** | **MVP choice.** Matches TRD; fits in a small container |
| PaddleOCR | Free | Better on Indian scripts | Heavy — model weights plus a deep-learning runtime; will not fit a small free instance | None | **Deferred.** Revisit if Tesseract quality blocks real use |
| Gemini native PDF/image vision | Per-token (native PDF text is unbilled) | **Best** of the three | Zero — already a dependency | **Yes** — sends the image to Google | **Recommended second-stage fallback**, paid tier only |
| Cloud OCR (Google Vision, AWS Textract, Azure) | Paid per page | Very good | Zero | Yes | **Not needed.** Adds a vendor, a key and a bill for what Gemini already does |

### 5.3 Recommended pipeline

```
Upload
 └─ Validation (size → ext → MIME → magic bytes → page count → encryption → macros)
     └─ Has text layer?
         ├─ YES → PyMuPDF / python-docx  →  text + (page, start, end) offsets
         └─ NO  → Tesseract (hin+eng)    →  text + confidence
                   └─ confidence < OCR_MIN_CONFIDENCE (0.60)?
                       ├─ Paid tier available → retry via Gemini vision, keep the better result
                       └─ Otherwise → proceed, set ocr_low_confidence flag, show the user the
                                      extracted text and ask them to confirm (PRD §9.2)
     └─ Sanitisation (zero-width, near-zero font size, off-mediabox, white-on-white, control chars)
     └─ Extracted text becomes the single source of truth for span verification
```

**The key architectural point:** whichever engine produced the text, the *extracted text* is what spans are verified against. Grounding integrity does not depend on the extraction being correct — only on it being consistent. A garbled OCR quote still verifies against the garbled text, and the low-confidence flag is what tells the user to check it. That is the honest behaviour and it is already what PRD §9.2 asks for.

### 5.4 Limits and malformed-document handling

| Control | Value | Source |
|---|---|---|
| Max upload | 10 MB (`MAX_UPLOAD_BYTES`) | `.env.example`, PRD §9.1 |
| Max pages | 30 (`MAX_PAGE_COUNT`) | `.env.example` |
| OCR confidence floor | 0.60 (`OCR_MIN_CONFIDENCE`) | `.env.example` |
| OCR wall-clock cap | **Add `OCR_TIMEOUT_SECONDS=30`** | New — §24 |
| Encrypted PDF | Reject, `FILE_ENCRYPTED` | API.md |
| Macro-bearing DOCX | Reject, `UNSUPPORTED_TYPE` | SECURITY.md §3 |
| Parser crash | Catch, return `EXTRACTION_EMPTY` — never a 500 with a trace | TRD §6, TESTING #13 |

---

## 6. Legal information and external data

### 6.1 Recommendation: no external legal data source in the MVP

This follows directly from the product's own thesis. AI_SAFETY §2: *"Samjo does not ask a model to recall law. It asks a model to interpret a document the user supplied."* AI_SAFETY §7 prohibits "a statute or case citation absent from the document." PRD §5 excludes fabricated statutes entirely.

If Samjo never asserts external law, it needs no external law. Adding a legislation API would create a capability the safety model forbids using.

### 6.2 What exists, classified honestly

The brief asks to differentiate SOURCE vs API vs WEB PAGE vs DATABASE. That distinction matters here, because a third-party service naming itself after a government one is easy to mistake for official.

| Resource | What it actually is | Official? | Use in Samjo |
|---|---|---|---|
| **India Code** (`indiacode.gov.in`) | Government **web page / document repository** of the Legislative Department. No developer API. | **Yes, official** | **Not in MVP.** Cite as a human-readable source on the safety page if you reference legislation at all |
| **IndiaCode on `indiacode.ecourtsindia.com`** | A **third-party JSON API** re-publishing that corpus. Documented as open, keyless, OpenAPI 3.1 | **No** — a commercial product, not a Legislative Department offering | **Not in MVP.** Do not present third-party data as official law |
| **eCourts** (`ecourts.gov.in`) | Government **portal** for case status. Not a general-purpose public API | Yes, official | **Not in MVP.** Case lookup is outside scope |
| **eCourtsIndia API** (`ecourtsindia.com/api`) | **Third-party commercial REST API**, token-authenticated, paid | **No** | **Not in MVP** |
| **NALSA** | A statutory body. Publishes legal-aid contact information as **web pages / PDFs**, not an API | Yes, official | **Post-MVP.** PRD §10 already scopes this correctly: "sourced from published NALSA data rather than invented" |
| `data.gov.in` | Government open-data **catalogue** | Yes, official | Only relevant if a legal-aid dataset is published there. Check at the time, do not assume |

### 6.3 `ProfessionalHelp.pathways` — the one place real data is needed

`AI_SCHEMAS.md` specifies `pathways: list[str]` as "curated, never model-generated." For the MVP this is a **hand-authored static list** committed to the repo: the NALSA national helpline, state legal services authority contacts for the demo states, and consumer-court guidance. No API, no scraping, no model generation.

**Verify every entry manually before shipping.** A wrong helpline number given to someone facing eviction is the highest-harm failure this product can produce that is not a wrong date.

---

## 7. TTS

**Recommendation: browser `SpeechSynthesis` (Web Speech API). Free, zero dependencies, zero keys, zero cost, and — importantly — zero data egress.**

| Option | Cost | Hindi | Verdict |
|---|---|---|---|
| **Browser SpeechSynthesis** | **Free** | `hi-IN` voices ship on Android/Chrome, Windows (with the language pack) and iOS/macOS; availability varies by device | **MVP choice** |
| Google Cloud TTS | Free tier then paid | Excellent Hindi | Not needed; adds a key, a bill, and sends briefing text to a third party |
| Other cloud TTS | Paid | Varies | No |

Three reasons beyond cost:

1. **Privacy.** The briefing text is derived from the user's legal document. Cloud TTS would send it to a second vendor — a disclosure obligation Samjo does not currently have and does not need.
2. **ACCESSIBILITY.md already specifies the correct fallback**: "Hindi uses a Hindi voice where the device provides one, and falls back gracefully with a notice rather than reading Devanagari with an English voice." That is exactly the right behaviour for variable browser support.
3. It works offline and on a slow connection, which matches the stated user context.

**Required work in Phase 11:** enumerate `speechSynthesis.getVoices()`, filter for `hi-IN`, and if none is present show the notice rather than reading Devanagari with an English voice. `getVoices()` populates asynchronously — handle the `voiceschanged` event or the list will be empty on first call. **Test on a real low-end Android device**, not just desktop Chrome.

---

## 8. Translation

**Recommendation: no translation API. Not Google Translate, not an open-source model.**

Two separate translation problems, two local solutions:

| What needs translating | Solution | Cost |
|---|---|---|
| UI strings (buttons, labels, errors, microcopy) | **Hand-authored** `en.json` / `hi.json` via react-i18next | Free |
| Analysis output (summary, interpretations, reasons) | **The LLM generates it directly** in the requested language | Included in the analysis call |

UI strings must be hand-authored regardless — UX_FLOWS §7 bans system vocabulary and specifies exact copy. Machine-translating "Show us the document" would destroy the tone the product depends on.

### 8.1 Resolving C4 (the language-switch contradiction)

Three options for satisfying PRD §9.8 without re-analysis:

| Option | How | Cost impact | Verdict |
|---|---|---|---|
| **A. Bilingual in one call** | Schema carries `ai_interpretation_en` and `ai_interpretation_hi` | Roughly doubles output tokens on every analysis, including for users who never switch | Wasteful — most users use one language |
| **B. Lazy second-language call** | On first switch, one extra LLM call translating only the *validated, persisted* interpretation fields. Persist the result | One cheap call, only for users who actually switch | **Recommended** |
| **C. Re-run analysis** | Full re-analysis in the other language | Doubles cost and breaks §9.8's "without re-running analysis" | No |

**Option B, with one non-negotiable rule: `source_span.quoted_text` is never sent to translation and never altered.** It is verified evidence. The UI shows the original quote in its original language alongside the translated interpretation — which is *more* honest, not less, because the document genuinely says what it says. Update PRD §9.8's acceptance criterion to reflect that a first switch may take a few seconds.

---

## 9. Database

**SQLite for local development and tests. Managed Postgres for any deployment.** This is a refinement of TRD §10, forced by §0.2.

| Concern | Decision |
|---|---|
| ORM | **SQLAlchemy 2.x** (already specified). Typed `Mapped[]` declarative style |
| Migrations | **Alembic** (already specified). Initialise in Phase 1, not later |
| Local dev / CI | **SQLite** — zero-ops, fast test runs, no service to start |
| Deployed | **Managed Postgres** — Supabase free tier (§15) |
| MongoDB | **No.** TRD §12 is right: the data is relational. Documents have pages, analyses have items, items have spans. Nothing here wants a document store |
| Redis | **No** for MVP. In-process background tasks suffice |

**Schema:** DATABASE.md is complete and sound as written. No changes needed. Ten tables, UUID PKs, cascade deletes, five indexes.

**Portability rules that make the swap a connection-string change** (mostly already implied by DATABASE.md, worth making explicit as lint-able rules):

- UUIDs via a SQLAlchemy `TypeDecorator` — `CHAR(36)` on SQLite, native `UUID` on Postgres
- `content_encrypted` as `LargeBinary` — `BLOB` / `bytea`
- `injection_flags` as SQLAlchemy `JSON` — never `JSONB`-specific operators in queries
- No `INSERT OR REPLACE`, no `AUTOINCREMENT`, no SQLite date functions
- Timestamps always timezone-aware UTC in application code, since SQLite does not enforce this

**One SQLite-specific caveat for local dev:** enable `PRAGMA foreign_keys=ON` per connection. SQLite does not enforce foreign keys by default, so the cascade-delete behaviour DATABASE.md depends on will silently not happen in dev while working correctly in production — the worst possible failure shape.

---

## 10. Storage

**Recommendation: local temporary filesystem, deleted immediately after extraction. No object storage in the MVP.**

| Option | Verdict |
|---|---|
| **A. Temporary filesystem** | **Chosen.** Simplest and, here, also the safest |
| B. Object storage (R2 / Supabase Storage / Vercel Blob) | Unnecessary. Adds a vendor, a key, a bill and a second place sensitive documents live |
| C. Database blobs | No. Bloats the DB and complicates the purge job |
| D. Encrypted object storage | Correct for a product that must retain documents. Samjo deliberately does not |

### 10.1 The reasoning, given that these are sensitive documents

The brief rightly warns against optimising only for convenience. The conclusion still favours local temporary storage, because **the strongest privacy control is not holding the data** — DATABASE.md says this already.

Samjo never needs the original file after extraction:

```
Upload → validate → extract text → DELETE THE FILE
                         ↓
              encrypted text in the DB (24h TTL)
                         ↓
              analysis + verified spans (24h TTL)
```

Nothing downstream reads the original bytes. The briefing renders from the analysis; the evidence drawer renders from `extractions.content_encrypted` plus offsets; export renders from the persisted analysis. **Deleting the file at the end of extraction — not at the 24-hour TTL — is strictly safer than any storage product**, and it makes the ephemeral-filesystem constraint in §0.2 a non-issue for uploads.

This is a tightening of SECURITY.md §5, which currently retains the uploaded file for `DOCUMENT_TTL_HOURS`. Recommend changing that row to "deleted immediately after successful extraction."

Required handling regardless of backend:
- Write outside any served directory, with a generated internal name (SECURITY.md §3)
- Never execute, never serve directly
- `try/finally` deletion so a parser crash still removes the file
- A startup sweep of `UPLOAD_TMP_DIR` to clear orphans from a crashed process

---

## 11. Authentication

**Recommendation: anonymous signed sessions. No auth provider. No accounts.**

This is already decided in SECURITY.md §4 and TRD §12, and the reasoning holds: "an account is a pile of credentials and personal data that this product does not need."

| Option | Verdict |
|---|---|
| **Anonymous signed session cookie** | **Chosen.** Zero friction, zero credentials held, zero vendor |
| Magic link | Needs an email provider and stores an email address — a new PII category |
| Email/password | Worst option: credential storage, reset flows, breach liability |
| Google OAuth | Tells Google who is reading a legal notice. Actively bad here |
| Supabase Auth / Clerk / Auth0 | Solving a problem Samjo does not have |

### 11.1 How ownership and security work without accounts

```
POST /sessions
  → create sessions row (uuid, language_pref, expires_at = now + SESSION_TTL_HOURS)
  → sign the session id with SESSION_SIGNING_KEY (itsdangerous URLSafeTimedSerializer)
  → Set-Cookie: samjo_session=<signed>; HttpOnly; Secure; SameSite=Lax; Max-Age=...

Every document route
  → verify signature (tamper-proof) and expiry
  → SELECT ... WHERE id = :doc_id AND session_id = :session_id
  → no row → 404, never 403
```

Properties worth stating plainly, because "anonymous" can be misread as "insecure":

- **The cookie is signed, not encrypted.** It carries a session UUID and nothing else. There is nothing secret in it to protect; the signature prevents forging a different session id.
- **Ownership is enforced in the service layer**, in the `WHERE` clause, on every read, write and delete — not in a decorator, never in the frontend (SECURITY.md §4).
- **404 rather than 403** so the API never confirms that a document id exists.
- **The honest limitation, which belongs on the privacy page:** anyone with the browser session can see that session's documents. There is no second factor. This is the correct trade for a 24-hour, no-account tool, and users should be told rather than left to assume otherwise.

**One gap to close in Phase 13:** the `SameSite=Lax` cookie is the only thing identifying the caller, so state-changing routes need CSRF protection. Simplest sufficient approach: require a custom header (e.g. `X-Samjo-Session: 1`) on all non-GET routes and reject requests without it. Cross-origin forms cannot set custom headers, and this costs one middleware.

---

## 12. Hosting

### 12.1 Verified free-tier reality, 2026-09-22

| Platform | Free tier | Fatal limitation for Samjo | Source |
|---|---|---|---|
| **Vercel** | Yes (Hobby) | Non-commercial use only. Serverless functions cannot run the Tesseract binary or a long analysis job | — |
| **Render** | Yes — 750 instance-hours/month | Ephemeral FS; 15-min spin-down; ~1-min cold start; free Postgres **expires after 30 days** | [Render](https://render.com/docs/free) |
| **Supabase** | Yes — Postgres, 0.5 GB, 2 active projects | Paused after **1 week** of inactivity; restorable | [Supabase](https://supabase.com/docs/guides/platform/free-project-pausing) |
| Fly.io | **No free tier** — trial only | Volumes $0.15/GB/mo | [Fly.io](https://fly.io/docs/about/pricing/) |
| Railway | $1/month credit | Not enough to run a service | [Railway](https://docs.railway.com/pricing/plans) |
| Hugging Face Spaces | Compute Space now needs a paid plan | Non-persistent disk; 48h sleep | [HF](https://huggingface.co/docs/hub/en/spaces-storage) |
| Google Cloud Run | Generous free requests tier | Viable, but cold starts plus more setup than Render for the same result | — |

### 12.2 Recommended deployment

```
┌─────────────────────────────────────────────────────────────┐
│ Frontend: Vercel (Hobby, free)                              │
│   Static React/Vite build. No serverless functions.         │
│   Fonts self-hosted per DESIGN_SYSTEM §8.                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS, credentials: include
┌──────────────────────────▼──────────────────────────────────┐
│ Backend: Render Web Service (free), Docker                  │
│   Docker is required — Tesseract is an apt package, not pip │
│   FastAPI + uvicorn, in-process background worker           │
│   Ephemeral FS: fine, uploads are deleted after extraction  │
│   15-min spin-down: pre-warm before the demo                │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│ Database: Supabase Postgres (free, 0.5 GB)                  │
│   Chosen over Render Postgres, which expires after 30 days  │
│   Paused after 1 week idle — a weekly ping keeps it alive   │
└─────────────────────────────────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│ LLM: Gemini API, billing enabled (§4.4)                     │
└─────────────────────────────────────────────────────────────┘
```

### 12.3 Constraints the brief asked about, answered

| Constraint | Reality on this stack |
|---|---|
| **FastAPI** | Runs fine on Render as a Docker web service |
| **Background processing** | In-process `BackgroundTasks` works, **but a spin-down mid-analysis kills the job.** Mitigation: `analyses.status` starts as `processing` with a `started_at`; a job still `processing` after a timeout is marked `failed` on next read, and the UI offers retry (UX_FLOWS §6 already requires a retry state). Never leave a poll hanging — §25 |
| **OCR** | Tesseract must be `apt-get install`ed in the Dockerfile with `tesseract-ocr-hin` and `tesseract-ocr-eng`. **This is why Vercel/serverless cannot host the backend** |
| **File uploads** | Multipart to Render works. 10 MB cap well within limits |
| **Execution timeout** | No hard function timeout on a Render web service, unlike serverless. Analysis budget of 10–40s is fine |
| **Persistent storage** | Not needed for files (§10). Needed for the DB — hence external Postgres |
| **Cold starts** | ~1 minute after 15 minutes idle. **Demo risk.** Hit the health endpoint a few minutes before judging, or run an external uptime pinger during the event |

### 12.4 If the free tier proves too fragile for the demo

Render's Starter tier (a few dollars a month) removes spin-down and cold starts. For a live-judged demo this is the single highest-value paid upgrade available, and it is worth more than any AI spend. Decide before the event, not during it.

---

## 13. API inventory

### 13.1 Public API endpoints

All under `/api/v1`. Auth is the signed `samjo_session` httpOnly cookie unless noted.

| # | Method | Route | Purpose | Auth | Request | Response | Errors | Rate limit | Data stored |
|---|---|---|---|---|---|---|---|---|---|
| 1 | POST | `/sessions` | Create anonymous session | None | `{language}` | 201 `{session_id, expires_at}` + Set-Cookie | 429 | 20/h/IP | `sessions` row |
| 2 | POST | `/documents` | Upload + validate | Cookie | multipart `file`, optional `situation_context` (≤500 ch) | 201 `{document_id, status, page_count, mime_type, delete_after}` | 413, 415, 422 `FILE_ENCRYPTED`, 429 | 10/h/session | `documents` row; temp file (deleted after extraction) |
| 3 | GET | `/documents/{id}` | Metadata only | Cookie + ownership | — | 200 `{document_id, status, page_count, document_type, ocr_used, ocr_confidence, delete_after}` | 404 | 60/h | none |
| 4 | POST | `/documents/{id}/analyze` | Start pipeline | Cookie + ownership | `{language}` | 202 `{job_id, status, stage}` | 404, 409, 422 `NOT_LEGAL_DOCUMENT`, 422 `EXTRACTION_EMPTY`, 429 | **15/h/session** | `extractions`, `document_pages` |
| 5 | GET | `/documents/{id}/analysis` | Poll + final read | Cookie + ownership | — | 425 `{status, stage}` while running; 200 `AnalysisResponse`; 200 partial | 404, 502 `SCHEMA_INVALID` | 120/h | `analyses`, `analysis_items`, `source_spans`, `questions` |
| 6 | GET | `/documents/{id}/source/{source_id}` | One verified span + context window | Cookie + ownership | — | 200 `{source_id, quoted_text, page, start_offset, end_offset, context_before, context_after, verified}` | 404 | 120/h | none |
| 7 | POST | `/situations` | Start situation flow | Cookie | `{description, language}` | 201 `{situation_id, clarifying_questions[]}` | 429 | **Add `RATE_LIMIT_SITUATIONS_PER_HOUR=10`** | `situations` (description encrypted) |
| 8 | POST | `/situations/{id}/analyze` | Situation orientation | Cookie + ownership | `{answers[]}` | 200 `{characterization, what_we_know, what_is_missing, possible_next_steps, questions_for_professional, professional_help, disclaimer}` | 404, 429 | 10/h | `situations` update |
| 9 | POST | `/documents/{id}/export` | Render briefing PDF | Cookie + ownership | `{language, include_sources}` | 200 `application/pdf` | 404 | 10/h | `exports` metadata row only |
| 10 | DELETE | `/documents/{id}` | Immediate purge | Cookie + ownership | — | 204, idempotent | — | 30/h | Deletes file, extraction, analysis, items, spans |
| 11 | GET | `/health` | Liveness | None | — | 200 `{status, version, llm_provider}` | — | none | none |
| 12 | POST | `/documents/{id}/questions` | **Proposed — resolves C3** | Cookie + ownership | `{question, language}` | 200 `{answer_type, text, source_span?, refused?}` | 404, 429, 422 | 40/h (`RATE_LIMIT_QUESTIONS_PER_HOUR`) | optional `questions` row |

**On #12:** this endpoint does not exist in API.md, but `RATE_LIMIT_QUESTIONS_PER_HOUR` exists, and TESTING #28 plus the AI_SAFETY §3 refusal table both require it. **Your decision** (C3): either add it to API.md and build it in Phase 10, or delete the variable and TESTING #28. If built, it is a *second untrusted-input surface* — the user's question must be passed as a delimited data parameter exactly like document text (ARCHITECTURE §6 already diagrams `USERQ` this way).

### 13.2 Internal service calls — not HTTP, not routable

These are Python function calls inside the process. Listing them separately matters because none of them should ever become an HTTP endpoint: each would be an unauthenticated path to the LLM or to document content.

| Service | Method | Called by |
|---|---|---|
| `document_service` | `validate_and_store`, `assert_owned`, `purge` | API #2, #10 |
| `extraction_service` | `extract(document) -> ExtractedText` | worker |
| `ocr_service` | `ocr(path) -> (text, confidence)` | `extraction_service` |
| `characterization_service` | `characterize(first_2000_chars) -> (type, confidence)` | worker |
| `deterministic_service` | `extract_facts(text) -> DeterministicFacts` | worker |
| `analysis_service` | `analyze(text, facts, language) -> AnalysisResponse` | worker |
| `evidence_service` | `verify_spans(analysis, text) -> (analysis, dropped_count)` | worker |
| `safety_service` | `apply(analysis) -> analysis` | worker |
| `export_service` | `render_pdf(analysis, language) -> bytes` | API #9 |
| `llm.LLMProvider` | `analyze`, `generate_structured_output`, `health_check` | `analysis_service`, `characterization_service` |

---

## 14. Environment variables

Additions and changes to the existing `.env.example`. Existing variables not listed here are correct as written.

| Variable | Status | Notes |
|---|---|---|
| `APP_ENV` | REQUIRED | `development` / `production` |
| `LOG_LEVEL` | REQUIRED | |
| `API_BASE_URL` | REQUIRED | |
| `DATABASE_URL` | REQUIRED | SQLite locally; Postgres URL when deployed |
| `LLM_PROVIDER` | REQUIRED | **CHANGE:** `mock \| gemini \| claude` (was `mock \| openai \| anthropic`) — C1 |
| `LLM_MODEL` | REQUIRED | **`gemini-3.8-flash`** |
| `LLM_API_KEY` | REQUIRED (prod) | Gemini API key. Empty is valid only with `LLM_PROVIDER=mock` |
| `LLM_FALLBACK_PROVIDER` | **NEW**, OPTIONAL | `claude`. Empty disables fallback |
| `LLM_FALLBACK_API_KEY` | **NEW**, OPTIONAL | Required only if the above is set |
| `LLM_FALLBACK_MODEL` | **NEW**, OPTIONAL | `claude-sonnet-5` |
| `LLM_THINKING_LEVEL` | **NEW**, OPTIONAL | `low` / `medium` / `high`. Default `low`. **Not `minimal`** — unsupported on 3.8 Flash (§4.2) |
| `CHARACTERIZATION_MODEL` | **NEW**, OPTIONAL | Defaults to `LLM_MODEL`. Set to a Flash-Lite id as a cost lever after §14 evals |
| `LLM_TIMEOUT_SECONDS` | REQUIRED | 90 |
| `LLM_MAX_OUTPUT_TOKENS` | REQUIRED | 8000. Well under the 64K cap |
| `LLM_TEMPERATURE` | REQUIRED | 0 |
| `LLM_MAX_RETRIES` | **NEW**, OPTIONAL | 1 schema retry (TRD §6) |
| `MAX_UPLOAD_BYTES` | REQUIRED | 10485760 |
| `MAX_PAGE_COUNT` | REQUIRED | 30 |
| `ALLOWED_MIME_TYPES` | REQUIRED | unchanged |
| `UPLOAD_TMP_DIR` | REQUIRED | unchanged |
| `OCR_ENABLED` | REQUIRED | |
| `OCR_MIN_CONFIDENCE` | REQUIRED | 0.60 |
| `OCR_TIMEOUT_SECONDS` | **NEW**, REQUIRED | 30 — §24 |
| `OCR_LANGUAGES` | **NEW**, REQUIRED | `hin+eng` |
| `DOCUMENT_TTL_HOURS` | REQUIRED | 24 |
| `SESSION_TTL_HOURS` | REQUIRED | 72 |
| `RATE_LIMIT_UPLOADS_PER_HOUR` | REQUIRED | 10 |
| `RATE_LIMIT_ANALYSES_PER_HOUR` | REQUIRED | 15 |
| `RATE_LIMIT_QUESTIONS_PER_HOUR` | REQUIRED **or delete** | Depends on C3 |
| `RATE_LIMIT_SITUATIONS_PER_HOUR` | **NEW**, REQUIRED | 10 — §13.1 #7 |
| `SESSION_SIGNING_KEY` | REQUIRED | App refuses to start in production if empty |
| `ENCRYPTION_KEY` | REQUIRED | Fernet key — §18 |
| `CORS_ALLOWED_ORIGINS` | REQUIRED | |

**Deliberately absent, and each absence is a decision:** no `STORAGE_KEY` (§10), no `TTS_KEY` (§7), no `TRANSLATION_API_KEY` (§8), no `SENTRY_DSN` (§15), no `ANALYTICS_KEY` (§15), no `SMTP_*` (§15), no `REDIS_URL` (§9).

**Never invent a secret for a service you have not decided to use.** Each unused key in `.env.example` is a thing a contributor will try to obtain.

---

## 15. Resource matrix

| Resource | Purpose | Provider | Free? | Free limit | Required? | MVP phase | Alternative |
|---|---|---|---|---|---|---|---|
| **LLM (primary)** | Characterization + structured analysis | Gemini 3.8 Flash | **FREE TIER** (trains on data) → **PAID** for real docs | Limits not published; see AI Studio | **Required** | 6 | Claude Sonnet 5 |
| **LLM (fallback)** | Provider outage / sustained 429 | Claude Sonnet 5 | PAID | — | Optional | 6 | Haiku 4.5 |
| **LLM (mock)** | Offline tests, CI | In-repo fixtures | **FREE** | — | **Required** | 6 | — |
| **OCR** | Scans and photos | Tesseract + `hin`/`eng` | **FREE** | — | **Required** | 5 | Gemini vision (paid), PaddleOCR |
| **PDF parser** | Text + page/char offsets | PyMuPDF | **FREE** (AGPL — see §27) | — | **Required** | 5 | pdfplumber |
| **DOCX parser** | Paragraph extraction | python-docx | **FREE** (MIT) | — | **Required** | 5 | — |
| **PDF export** | Briefing download | WeasyPrint or ReportLab | **FREE** | — | **Required** | 12 | Client-side print-to-PDF |
| **Encryption** | Extracted text at rest | `cryptography` (Fernet) | **FREE** | — | **Required** | 4 | — |
| **TTS** | Read-aloud, en + hi | Browser SpeechSynthesis | **FREE** | Device-dependent voices | **Required** | 11 | Google Cloud TTS |
| **Translation** | — | **None** | — | — | **NOT NEEDED** | — | §8 |
| **Storage** | In-flight uploads | Local temp FS | **FREE** | — | **Required** | 4 | R2 / Supabase Storage |
| **Database** | Sessions, analyses, spans | SQLite (dev) / Supabase Postgres (deployed) | **FREE TIER** | 0.5 GB; paused after 1 week idle | **Required** | 1 | Neon, Render PG (expires 30d) |
| **Auth** | Session ownership | `itsdangerous` signed cookie | **FREE** | — | **Required** | 4 | Supabase Auth (not needed) |
| **Hosting (frontend)** | Static SPA | Vercel Hobby | **FREE** | Non-commercial | **Required** | 15 | Netlify, Cloudflare Pages |
| **Hosting (backend)** | FastAPI + Tesseract | Render (Docker) | **FREE** | 750 h/mo; 15-min spin-down; ephemeral FS | **Required** | 15 | Cloud Run; Render Starter (paid) |
| **Rate limiting** | Cost + abuse control | `slowapi` (in-memory) | **FREE** | Resets on restart | **Required** | 13 | Redis-backed (not needed) |
| **Monitoring** | Health + stage durations | `/health` + structured stdout logs | **FREE** | — | **Required** | 13 | Sentry free tier |
| **Testing** | Unit, integration, a11y, e2e | pytest, httpx, Vitest, RTL, Playwright, axe | **FREE** | — | **Required** | 14 | — |
| **CI** | Lint, typecheck, test gates | GitHub Actions | **FREE** (public repo) | — | **Required** | 1 | — |
| **Analytics** | — | **None** | — | — | **NOT NEEDED** | — | §15.1 |
| **Email** | — | **None** | — | — | **NOT NEEDED** | — | §15.1 |
| **Domain** | Demo URL | `*.vercel.app` | **FREE** | — | **OPTIONAL** | 16 | ~₹800/yr `.in` |
| **Legal data API** | — | **None** | — | — | **NOT NEEDED** | — | §6 |
| **Vector DB / RAG** | — | **None** | — | — | **NOT NEEDED** | — | TRD §12 |

### 15.1 Things deliberately not used, with reasons

- **Analytics.** Samjo has no growth loop to instrument and no funnel to optimise in an MVP. Adding a third-party analytics script to a page where people upload eviction notices means a tracker learns who visits a legal-help site — precisely the harm DESIGN_SYSTEM §8 avoids by self-hosting fonts. If product metrics become necessary later, count events server-side in the existing `audit_events` table, which is already designed to hold identifiers only.
- **Email.** No accounts, no magic links, no notifications, no password resets. Deadline reminders (PRD §10, post-MVP) would be the first real need.
- **Error-tracking SaaS (Sentry etc.).** Attractive, but an error tracker's job is to capture context — stack locals, request bodies, breadcrumbs — and SECURITY.md §6 forbids exactly that leaving the system. Using one safely requires aggressive scrubbing that must be right every time. Structured stdout logs behind the existing allowlist formatter are lower-risk for MVP. Revisit with a deliberate scrubbing config.
- **Redis.** In-process background tasks and in-memory rate limits are sufficient at MVP scale (TRD §12).

---

## 16. Implementation phases

Adapted from the brief's 17 phases, reconciled with TRD §11's 12. Deviations from the brief's ordering are marked and justified.

Every phase ends green — lint, typecheck and tests passing — before the next begins.

### Phase 0 — Audit and architecture lock
**Objective:** Resolve C1–C7 and lock the stack. No code.
**Create:** `RESOURCE_AUDIT.md` (this file), `DECISIONS.md` (one line per resolved contradiction).
**Modify:** `TRD.md` (§5 providers, §7 wording, §10 deployment), `.env.example` (§14), `README.md` (§C6), `ACCESSIBILITY.md` (§C5), `API.md` (C3 decision), `PRD.md` (§9.8 per C4), `SECURITY.md` (§5 file retention per §10.1).
**Done when:** every contradiction in §1.1 has a recorded decision and the spec set no longer contradicts itself.

### Phase 1 — Repository foundation
**Objective:** A real repository that CI can run.
**Create:** `git init`; `frontend/`, `backend/`, `fixtures/`, `docs/` (move the 16 specs into `docs/`, fixing README links); `backend/pyproject.toml`, `requirements.txt`, `Dockerfile`; `backend/app/main.py` with `/health`; `backend/app/core/config.py` (Pydantic Settings, refuses to start in prod with empty key material); `alembic.ini` + initial migration for all 10 tables; `frontend/` Vite scaffold; `.github/workflows/ci.yml`; `.gitignore`.
**Dependencies:** none. **Backend:** app skeleton, config, DB session, Alembic. **DB:** all 10 tables from DATABASE.md, with the UUID/JSON/LargeBinary TypeDecorators from §9. **Tests:** `/health` returns 200; migrations apply and roll back cleanly on both SQLite and Postgres.
**Security:** `.env` gitignored; no secrets committed; `PRAGMA foreign_keys=ON` for SQLite.
**Done when:** CI is green on a fresh clone; `alembic upgrade head` works on both engines.

### Phase 2 — Design system and frontend shell
**Objective:** Tokens, primitives and routing. No product screens.
**Create:** `tailwind.config.ts` with the DESIGN_SYSTEM §8 mapping; `src/styles/tokens.css`; self-hosted DM Sans + Inter woff2, subset Latin + Devanagari; `src/components/ui/` (Button, IconButton, Input, Textarea, Select, StatusBadge, Skeleton, Toast, EmptyState, ErrorState); Radix wrappers (Dialog, Popover, Tabs, Accordion, Tooltip, BottomSheet); `src/router.tsx` with the 9 UX_FLOWS §1 routes; i18n scaffold with `en.json`/`hi.json`.
**Dependencies:** Phase 1. **Parallel:** can start alongside Phase 1 backend work.
**Tests:** axe passes on every empty route at 360 and 1280; keyboard reaches every primitive; ESLint rule failing on arbitrary Tailwind values (DESIGN_SYSTEM §8).
**Done when:** all 9 routes render, axe is green, no arbitrary values.

### Phase 3 — Landing and intake flow
**Objective:** Entry points, in both languages.
**Create:** `/` landing per UX_FLOWS §8 (hero, one real briefing fragment, stated limits — none of the banned elements); `/start`; `/situation` intake (React Hook Form, one question per screen on mobile); `LanguageSwitcher`; skip link; static `/privacy`, `/safety`, `/accessibility`.
**API:** `POST /sessions`. **Backend:** session service, signed cookie, `sessions` repository.
**Tests:** language switch re-renders; axe green; keyboard path complete; session cookie is HttpOnly + Secure + SameSite=Lax.
**Done when:** a user can start either flow and a session cookie is issued.

### Phase 4 — Upload and validation
**Objective:** Get a file in safely. **This is the first real security surface.**
**Create:** `services/document_service.py`, `core/security.py` (magic bytes), `api/v1/documents.py`, `utils/crypto.py` (Fernet); `FileDropzone`, `UploadCard`, `/upload` route with every error state.
**API:** `POST /documents`, `GET /documents/{id}`, `DELETE /documents/{id}`.
**Tests:** TESTING #8–14 in full — `.exe` renamed `.pdf` rejected on magic bytes; 50 MB → 413 before parsing; 200-page → page-count rejection; encrypted PDF → `FILE_ENCRYPTED`; macro DOCX rejected; malformed PDF → typed error not a 500; `../` in filename cannot affect the write path.
**Security:** validation cheapest-first; filename discarded not sanitised; write outside served dirs; `try/finally` deletion; ownership check returning 404.
**Done when:** every TESTING #8–14 case passes and no malicious fixture reaches a parser.

### Phase 5 — Document extraction
**Objective:** Text with offsets, from every supported format.
**Create:** `extraction_service.py` (PyMuPDF + python-docx, page and char offsets), `ocr_service.py` (pytesseract, `hin+eng`, confidence from `image_to_data`, timeout), `utils/sanitise.py` (zero-width, near-zero font, off-mediabox, white-on-white, control chars → `injection_flags`).
**DB:** `extractions`, `document_pages`.
**Tests:** TESTING #1–2; offsets round-trip to the correct page; OCR path produces confidence; sanitiser strips each hidden-text pattern; empty extraction → `EXTRACTION_EMPTY`.
**Done when:** a real PDF, a DOCX, a photo and a scan all yield text with correct `(page, start, end)` offsets.

### Phase 6 — LLM integration
**Objective:** The provider abstraction and a schema-valid response. **Gate: §4.5 schema test runs first.**
**Create:** `services/llm/base.py` (Protocol), `gemini.py`, `claude.py`, `mock.py`; `schemas/analysis.py` (all AI_SCHEMAS.md contracts); `prompts/system_v1.md` (versioned, no secrets).
**AI:** send `AnalysisResponse.model_json_schema()` to Gemini in a single live call **before any other work in this phase**. If rejected, split the schema (§4.5) — do not loosen it.
**Tests:** `MockProvider` returns schema-valid fixtures; the whole suite runs with no key and no network; `health_check` on each provider; schema failure triggers exactly one retry then a typed 502.
**Security:** `untrusted_document` is a separate parameter — assert by test that no code path concatenates it into `system_instructions`.
**Done when:** mock produces a valid `AnalysisResponse` and the real schema is confirmed accepted by Gemini.

### Phase 7 — Structured analysis
**Objective:** The full pipeline, end to end, minus grounding.
**Create:** `characterization_service.py` (first 2000 chars), `deterministic_service.py` (Indian currency incl. lakh/crore, absolute and relative dates, percentages, notice periods), `analysis_service.py`, `workers/analysis_job.py`; `/d/:id/processing` with real stage names.
**API:** `POST /documents/{id}/analyze` (202), `GET /documents/{id}/analysis` (425 while running).
**DB:** `analyses`, `analysis_items`, `questions`.
**Tests:** TESTING #3–7 — `Rs. 25,000/-`, `₹25,000`, `INR 25000` all parse identically; `₹2,50,000` → 250000 not 25000; relative dates resolve; notice period vs cure period distinguished; stable chunk ids; a recipe returns `NOT_LEGAL_DOCUMENT` **before** the expensive call.
**Done when:** an analysis completes and persists; stage names surface verbatim to the UI; no fake percentages.

### Phase 8 — Source-span validation ⚠ **THE GATE**
**Objective:** Nothing unsourced survives.
**Create:** `evidence_service.py` — exact match, then normalised (whitespace and quote characters) match. **No fuzzy matching.** Failures drop the item and increment `dropped_item_count`. Deterministic reconciliation: parser wins over model on `amount_value` and `resolved_date`, and the item gets `needs_verification = True`.
**API:** `GET /documents/{id}/source/{source_id}`.
**DB:** `source_spans` — a row exists only if `verified` is true.
**Tests:** TESTING #15–20; a fabricated quote never appears in the API response; whitespace and curly-quote variants match, a paraphrase does not; confidence below 0.65 forces `needs_verification`; every deadline carries `needs_verification` regardless of confidence.
**Done when:** TRD §11's gate is met — **if span verification drops more than 30% of items on real fixtures, stop and fix the prompt before any further feature work.**

### Phase 9 — Briefing UI
**Objective:** The evidence rail — the identity element.
**Create:** `/d/:id` briefing in the fixed UX_FLOWS §4 hierarchy; `EvidenceRail`, `SourceChip` (8px dot, 44px hit area, accessible name), `EvidenceDrawer`/bottom sheet, `DocumentViewer` with span highlighting, `AnalysisCard` variants; TanStack Query polling at 1.5s; Zod validation at the boundary mirroring the Pydantic contract.
**Tests:** TESTING #43–48; "Document says", "Samjo interprets" and "Verify" are separately labelled in the DOM; focus traps, Escape closes, focus returns to the marker; all six states render.
**Done when:** every claim on screen is tappable through to a verified quote, and the three states are never visually merged.

### Phase 10 — Urgency and safety
**Objective:** Make the safety model executable, not aspirational.
**Create:** `safety_service.py` — high-risk detection (eviction, court summons, criminal notice, minors, deadline within 7 days), refusal reframing, stripping of law assertions absent from the document, `is_advice` enforcement; urgency classification as a **pure function over evidence**; curated `professional_help.pathways` (§6.3, manually verified); `UrgencyBadge`, escalation banner, `/d/:id/help` lawyer-prep checklist.
**Optionally:** `POST /documents/{id}/questions` if C3 resolves that way.
**Tests:** TESTING #29–34; eviction notice sets `is_high_risk`; a stated age of 16 triggers the trusted-adult pathway; "will I win" returns the canonical refusal; "should I sign this" returns information plus questions; a deadline within 7 days escalates to at least HIGH; `NextStep.is_advice` is never true.
**Done when:** the AI_SAFETY §3 refusal table is fully asserted in tests, and urgency is testable with no DB and no network.

### Phase 11 — Hindi and TTS
**Objective:** Reach the users the product exists for.
**Create:** complete `hi.json`; the C4 Option B lazy-translation path (**never touching `quoted_text`**); `AudioPlayer` over `SpeechSynthesis` with listen/pause/resume/stop, no autoplay, state announced; Hindi voice detection with the graceful-fallback notice; Devanagari line-height step (+4px).
**Tests:** language switch re-renders without re-analysis; amounts and dates render from the deterministic extractor, not the translation (PRD §11); no autoplay; voice fallback shows a notice. **Manual: a real low-end Android device.**
**Done when:** a full briefing reads correctly in Hindi and reads aloud, and numbers survive translation intact.

### Phase 12 — Export
**Objective:** Something to take to a lawyer.
**Create:** `export_service.py` (WeasyPrint or ReportLab), the `/d/:id/export` route, the disclaimer stamp, and a visual treatment deliberately unlike an official instrument — no seal, no letterhead, no signature block (ARCHITECTURE §8).
**Tests:** PDF contains the disclaimer; Devanagari renders (**font embedding is the usual failure here — test early**); the `exports` row stores metadata only and the PDF is streamed, not retained.
**Done when:** both languages export correctly with the disclaimer present.

### Phase 13 — Security hardening
**Objective:** Make the SECURITY.md claims true.
**Create:** `core/ratelimit.py` (slowapi), CSRF header check (§11.1), security headers (`nosniff`, `Referrer-Policy: no-referrer`, HSTS, CSP), CORS allowlist, body-size caps on every route, the allowlist log formatter, the hourly TTL purge job.
**Create:** `fixtures/adversarial/` — hidden white text, zero-width, off-page instructions, DAN-style jailbreak, injected URL, injected markup.
**Tests:** TESTING #21–25 and #35–42; the system prompt never appears in output; analysis completes normally on an injected document; no document content in any log across a full run; the formatter drops a non-allowlisted field even when a developer passes one; session A gets 404 on session B's document.
**Done when:** every adversarial fixture is defeated in CI and the log allowlist cannot be bypassed accidentally.

### Phase 14 — Testing and accessibility
**Objective:** Close the suite and the a11y gates.
**Create:** the remaining fixtures (15 total, TESTING.md); Playwright keyboard walkthrough; axe on every route; reduced-motion assertion; performance assertions.
**Tests:** all 57 TESTING.md cases; #49–57 (axe at 360 and 1280, keyboard-only upload→briefing→evidence, 200% zoom, reduced motion, 44px targets, 60s budget, polling ≤ 1/1.5s).
**Done when:** CI gates are green and the manual screen-reader pass (NVDA/VoiceOver) is recorded.

### Phase 15 — Deployment
**Objective:** A live, pre-warmed URL.
**Create:** `backend/Dockerfile` with `tesseract-ocr`, `tesseract-ocr-hin`, `tesseract-ocr-eng`; `render.yaml`; Vercel project config; Supabase project; production env vars; a weekly Supabase keep-alive ping; an uptime pinger for the demo window.
**Tests:** a full upload→briefing flow against production; cold-start timing measured and recorded; **billing confirmed enabled on the Gemini key** (§4.4).
**Done when:** the demo URL works from a phone on mobile data, and the paid-tier check has been verified, not assumed.

### Phase 16 — Final polish
**Objective:** Copy, spacing, and the judging evidence.
**Do:** audit every state against UX_FLOWS §6; verify the microcopy table §7 has no system vocabulary anywhere; confirm the motion spec (one reveal, 40ms stagger, first load only); README with the CI badge; surface `fixtures/adversarial/`, SECURITY.md, ACCESSIBILITY.md and the axe report where a judge will find them without hunting (TESTING.md, "Judging evidence").
**Done when:** the repository makes its security and testing claims verifiable at a glance.

### 16.1 Where this ordering differs from the brief

| Change | Reason |
|---|---|
| Schema-complexity test moved to the **start** of Phase 6 | §4.5. Discovering the schema is rejected in Phase 7 would invalidate Phase 6's work |
| Adversarial fixtures created in Phase 13, not 14 | They are the deliverable of hardening, not of testing |
| Export (12) placed before hardening (13) | Export is feature work; hardening should be the last thing touching the request path |
| Deployment (15) before polish (16) | Cold-start and font-embedding problems surface only in production, and both need time to fix |

---

## 17. Dependency graph

```
Phase 0  Audit + architecture lock
   │
Phase 1  Repository foundation
   ├──────────────────────────────┐
   │                              │
Phase 2  Design system      (backend track)
   │      + frontend shell         │
Phase 3  Landing + intake          │
   │                               │
   └──────────┬────────────────────┘
              │
Phase 4  Upload + validation
   │
Phase 5  Document extraction
   │
Phase 6  LLM integration ⚠ schema test first
   │
Phase 7  Structured analysis
   │
Phase 8  Source-span validation  ⚠⚠ THE GATE (>30% dropped = stop)
   │
Phase 9  Briefing UI
   │
Phase 10 Urgency + safety
   │
Phase 11 Hindi + TTS
   │
Phase 12 Export
   │
Phase 13 Security hardening
   │
Phase 14 Testing + accessibility
   │
Phase 15 Deployment
   │
Phase 16 Final polish
```

### 17.1 What can run in parallel

| Track A (frontend) | Track B (backend) | Shared blocker |
|---|---|---|
| Phase 2 design system | Phase 1 DB + config | — |
| Phase 3 landing + situation intake | Phase 4 upload + validation | `POST /sessions` contract |
| `/d/:id/processing` skeleton | Phase 5 extraction | stage name list |
| Static briefing against a **fixture JSON** | Phases 6–7 analysis | **`AnalysisResponse` schema — freeze it in Phase 6** |
| Phase 12 export styling | Phase 10 safety rules | persisted analysis shape |

**The single most valuable parallelisation:** freeze `AnalysisResponse` and commit a realistic fixture JSON at the start of Phase 6. The entire briefing UI (Phase 9) can then be built against that fixture while the backend catches up — the frontend never needs a working LLM.

**The hard serialisations, which cannot be parallelised away:**
- Phase 8 depends on Phase 5 offsets and Phase 7 output. Span verification is meaningless without both.
- Phase 9's evidence drawer depends on the Phase 8 schema. Building it earlier means rebuilding it.
- Phase 11 translation depends on Phase 10's final field set, or strings get missed.

---

## 18. Frontend ↔ backend contract

**The frontend never sees raw LLM output.** Five gates sit between the model and the screen.

```
  Gemini raw JSON
        │
  [1] Pydantic validation ──── fail ──► retry once ──► fail ──► 502 SCHEMA_INVALID
        │                                                        (typed error state,
        │                                                         never partial prose)
  [2] Normalization
        │  amount_value and resolved_date overwritten by the deterministic parsers;
        │  on disagreement the parser wins and needs_verification = True
        │
  [3] Source-span validation
        │  exact match, then normalised match, against the extracted text
        │  no match ──► item dropped, dropped_item_count++
        │  NO FUZZY MATCHING
        │
  [4] Safety validation
        │  strip assertions about law absent from the document
        │  is_advice must be False; high-risk flags set; refusals reframed
        │
  [5] API response (AnalysisResponse)
        │
  [6] Zod validation at the frontend boundary — mirrors the Pydantic contract
        │
      React render (text only; extracted text escaped, never markup)
```

**Why gate [6] exists even though the backend already validated:** it is not distrust of the backend, it is a contract test that runs in production. If the Pydantic and Zod schemas drift apart, a Zod failure surfaces it as a typed error state immediately, rather than as a blank section or a crash deep in a component.

**Rules that hold at every gate:**
- No field reaches the UI that did not survive all five gates.
- An item without a verified span is deleted, not caveated (PRD §6.2).
- The frontend renders text, never markup, from any document-derived field (TESTING #25).
- Types are generated from one source of truth. Generate the OpenAPI schema from FastAPI and derive the TS types from it, so drift is a build failure rather than a runtime surprise.

---

## 19. AI provider abstraction

```python
from typing import Protocol
from pydantic import BaseModel

class LLMProvider(Protocol):
    """Every provider must support constrained decoding against a JSON schema.
    A provider that cannot guarantee schema compliance is not eligible.
    (CONTRIBUTING.md, 'Adding an LLM provider')
    """

    async def analyze(
        self,
        *,
        system_instructions: str,        # trusted, versioned, no secrets
        untrusted_document: str,         # UNTRUSTED — data, never instructions
        known_facts: DeterministicFacts, # trusted, from parsers
        schema: type[BaseModel],
    ) -> BaseModel: ...

    async def generate_structured_output(
        self,
        *,
        system_instructions: str,
        untrusted_input: str,
        schema: type[BaseModel],
    ) -> BaseModel: ...

    async def health_check(self) -> ProviderHealth: ...
```

`untrusted_document` being a **separate keyword-only parameter** is the load-bearing design decision. Concatenating it into `system_instructions` is not something a developer can do by accident — it requires deliberately rewriting the interface. The security boundary is enforced by the type signature rather than by discipline or code review (SECURITY.md §2, Layer 1).

| Implementation | MVP | Notes |
|---|---|---|
| `GeminiProvider` | **Build** | `google-genai`; `response_format` with `mime_type: application/json` and `schema=Model.model_json_schema()`; `thinking_level` from config; maps `429 RESOURCE_EXHAUSTED` to the typed `RATE_LIMITED` error |
| `MockProvider` | **Build** | Returns schema-valid fixtures. The entire suite, including adversarial cases, runs with no key and no network (TRD §5) |
| `ClaudeProvider` | **Build (thin)** | `anthropic` SDK, `output_config.format`. Needed for the §2.3 fallback |
| `OpenAIProvider` | **Do not build** | The interface accommodates it. Writing it now is speculative work for a provider with no role |

**Two additions to the TRD §5 signature, both justified:**
- `generate_structured_output` — characterization needs a constrained call that is not a full document analysis, and (if C3 resolves that way) so does the question endpoint. Without it, characterization would misuse `analyze`.
- `health_check` — `GET /health` reports `llm_provider`, and the fallback logic in §25 needs a liveness signal that is not "wait for a user request to fail."

---

## 20. Cost estimation

### 20.1 Assumptions, stated so you can correct them

- USD → INR at **₹88**. This moves; re-check before quoting figures.
- Typical document: 10 pages, digital PDF, ~25,000 characters ≈ **~7,000 tokens**.
- Prompt overhead (system + schema + known facts): **~2,500 tokens**.
- Output: structured JSON ~2,500 tokens + thinking at `low` ~1,500 = **~4,000 tokens**.
- Characterization: ~800 in / ~100 out — negligible, but counted.
- Gemini 3.8 Flash introductory pricing: **$0.75 / $3.75** per 1M in/out, **through 2026-12-31**.

**Two caveats that materially affect these numbers:**
1. **Hindi roughly doubles output tokens.** Devanagari tokenizes far less efficiently than Latin. A Hindi analysis costs roughly 1.7–2× an English one. Measure with a token count in Phase 6 before trusting any of this.
2. **From 2027-01-01, Gemini 3.8 Flash pricing doubles** to $1.50 / $7.50. Every figure below doubles on that date.

### 20.2 Per-analysis cost

| Item | Tokens | Rate | Cost |
|---|---|---|---|
| Analysis input | 9,500 | $0.75/1M | $0.0071 |
| Analysis output | 4,000 | $3.75/1M | $0.0150 |
| Characterization | ~900 | mixed | $0.0007 |
| **Total (English)** | | | **≈ $0.023 ≈ ₹2.00** |
| **Total (Hindi)** | | | **≈ $0.038 ≈ ₹3.35** |

### 20.3 Scenario costs

| Scenario | LLM | OCR | Storage | Hosting | DB | TTS | Other | **Total** |
|---|---|---|---|---|---|---|---|---|
| **Development** (free tier, synthetic fixtures, MockProvider in CI) | **₹0** | ₹0 | ₹0 | ₹0 | ₹0 | ₹0 | ₹0 | **₹0** |
| **Hackathon demo** (~200 analyses, paid tier) | ~₹400 | ₹0 | ₹0 | ₹0 | ₹0 | ₹0 | ₹0 | **≈ ₹400** |
| **100 users** (~300 analyses/mo) | ~₹600/mo | ₹0 | ₹0 | ₹0 | ₹0 | ₹0 | ₹0 | **≈ ₹600/mo** |
| **1,000 documents** | ₹2,000–3,400 | ₹0 | ₹0 | ₹0 | ₹0 | ₹0 | ₹0 | **₹2,000–3,400** |
| **10,000 documents** | ₹20,000–34,000 | ₹0 | ₹0 | **may exceed free** | **exceeds 0.5 GB** | ₹0 | ₹0 | **₹20,000–34,000+** |

**Reading this table:** every non-LLM line is ₹0 at MVP scale because of the free-first choices in §15. **The LLM is essentially the entire bill**, which is the right shape — it means cost control is a single lever (§21, §24), not a diffuse infrastructure problem.

At 10,000 documents the free tier stops being the right answer: Supabase's 0.5 GB and Render's 750 hours both come under pressure, and the honest move is a small paid backend plus a paid Postgres — on the order of ₹1,500–3,000/month, still dominated by the LLM line.

### 20.4 The cost lever, if needed

Switching analysis to `gemini-3.1-flash-lite` ($0.25 / $1.50) drops the per-analysis cost to roughly **₹0.77** — about 2.6× cheaper. **Do not do this preemptively.** Run the §14 fixture suite on both models and compare `dropped_item_count` and span-verification rates. If Flash-Lite grounds as reliably, take the saving; if it drops more items, the saving is not real, because a dropped item is a failed briefing.

Routing **characterization alone** to Flash-Lite is low-risk and worth doing regardless — it is a classification task over 2,000 characters, not a reasoning task.

---

## 21. Rate limit strategy

| Limit | Value | Protects against |
|---|---|---|
| Max upload size | 10 MB | Storage and parser DoS |
| Max pages | 30 | Zip-bomb expansion; LLM token cost |
| Max extracted characters | **Add `MAX_EXTRACTION_CHARS=120000`** | A 30-page dense PDF blowing the token budget |
| Uploads | 10/hour/session | Abuse |
| Analyses | **15/hour/session** | **The cost centre.** Tightest limit, deliberately |
| Situations | 10/hour/session | New — §13.1 |
| Questions | 40/hour/session | If C3 resolves that way |
| Reads / polling | 120/hour/session | Polling at 1.5s = 40/min; do not throttle legitimate polling |
| Sessions | 20/hour/IP | Limit evasion via new sessions |
| Concurrent analyses | **1 per session, 3 per process** | Render free has limited RAM; concurrent Tesseract runs will OOM |
| Max LLM output tokens | 8,000 | Runaway generation |
| LLM timeout | 90s | Hung request |
| OCR timeout | **30s** | Tesseract pathological input |
| Total analysis timeout | **120s** | Guarantees the §25 no-infinite-loading rule |

**Two notes on enforcement:**
- **Per-IP limits matter more than per-session limits.** A session is free to create; an IP is not. The analyze limit in particular should be enforced per IP *and* per session, or it is trivially bypassed by clearing a cookie.
- **In-memory rate limiting resets on restart.** On Render free, spin-downs make this a real gap. Acceptable for MVP, but it is a known weakness — record it in SECURITY.md §7's deferred list rather than leaving it implicit.

---

## 22. Fallback strategy

**The governing rule: never leave the user in an infinite loading state.** Every failure below terminates in a named state with an action.

| Failure | Detection | Behaviour | User sees |
|---|---|---|---|
| **LLM schema-invalid** | Pydantic raises | Retry once, then fail | "Samjo read your document but couldn't finish the briefing. Your file is still here. Try again." + Retry |
| **LLM 429** | `RESOURCE_EXHAUSTED` | Exponential backoff, 2 attempts; then fallback provider if configured; then typed error | "Samjo is busy right now. Try again in a minute." |
| **LLM timeout** | 90s exceeded | Mark job failed | Same as schema-invalid, with Retry |
| **LLM provider down** | `health_check` fails | Switch to `LLM_FALLBACK_PROVIDER` if set; else typed error | Transparent if fallback succeeds |
| **OCR fails / times out** | Exception or 30s | `EXTRACTION_EMPTY` | "Samjo couldn't read this document. It looks like a scan with no text layer. Try a clearer photo, or upload the original PDF." |
| **OCR low confidence** | `< OCR_MIN_CONFIDENCE` | **Proceed**, flag it, show the extracted text | Briefing + a visible verification prompt (PRD §9.2) |
| **PDF extraction fails** | Parser exception | Caught, `EXTRACTION_EMPTY`, never a 500 trace | Unreadable-file copy + alternatives |
| **Document unsupported** | Magic bytes | `UNSUPPORTED_TYPE` | "Samjo reads PDF, Word and photos. This file is a different type." |
| **Not a legal document** | Characterization | `NOT_LEGAL_DOCUMENT` | "This doesn't look like a legal document..." + the situation flow |
| **Source span missing** | `evidence_service` | **Drop the item**, increment `dropped_item_count` | Nothing — the claim never existed. This is correct, not a degradation |
| **All items dropped** | `dropped_item_count` = total | Return `status: partial` | "Samjo couldn't verify enough of this document to brief you on it." + Retry |
| **Low confidence** | `< 0.65` | Force `needs_verification` | "Verify" marker in `--warning`, plus the word |
| **Analysis timeout** | 120s total | Job marked failed by the reaper | Failed state + Retry, **never an endless spinner** |
| **Worker killed by spin-down** | `processing` past timeout | Reaper marks failed on next poll | Failed state + Retry |
| **Network fails (client)** | Fetch error | TanStack Query retry with backoff | "You're offline. Samjo will pick up where you left off when you reconnect." |
| **TTS unavailable** | No `hi-IN` voice | Disable the control, show a notice | A notice — **never Devanagari read in an English voice** |
| **DB paused (Supabase)** | Connection error | Typed 503 | "Samjo is starting up. Try again in a moment." |

**The reaper is the load-bearing component here.** A background sweep marking any `processing` job older than 120s as `failed` is what makes the "no infinite loading" guarantee true in the presence of a killed worker. Without it, a spin-down mid-analysis leaves a poll spinning forever. Build it in Phase 7, not Phase 13.

---

## 23. Free-first stack (summary)

| Layer | Choice | Cost |
|---|---|---|
| Frontend | React + TypeScript + Vite + Tailwind, on Vercel Hobby | **₹0** |
| Backend | FastAPI + Pydantic + SQLAlchemy, Docker on Render free | **₹0** |
| Database | SQLite (dev) → Supabase Postgres free (deployed) | **₹0** |
| LLM | Gemini 3.8 Flash — free tier in dev, **paid for real documents** | ₹0 dev / ~₹2 per analysis |
| PDF | PyMuPDF | **₹0** |
| DOCX | python-docx | **₹0** |
| OCR | Tesseract (`hin`+`eng`) | **₹0** |
| TTS | Browser SpeechSynthesis | **₹0** |
| Translation | None — hand-authored i18n + LLM output | **₹0** |
| Auth | `itsdangerous` signed cookie | **₹0** |
| Storage | Local temp FS, deleted after extraction | **₹0** |
| Testing | pytest, httpx, Vitest, RTL, Playwright, axe | **₹0** |
| CI | GitHub Actions (public repo) | **₹0** |
| Monitoring | `/health` + structured stdout logs | **₹0** |
| Analytics | **None** | **₹0** |
| Domain | `*.vercel.app` | **₹0** |

**Recurring infrastructure cost: ₹0.** The only variable cost is the LLM, and it is the one cost that should scale with use.

---

## 24. Security architecture

```
USER
 │
FRONTEND ──────────── CSP; text-only rendering; Zod boundary validation
 │
API ───────────────── HTTPS/HSTS; CORS allowlist; body caps; security headers;
 │                    CSRF custom-header check
SESSION ───────────── signed httpOnly cookie; ownership in the WHERE clause;
 │                    404 never 403
FILE VALIDATION ───── size → ext → MIME → MAGIC BYTES → pages → encryption → macros
 │                    filename discarded; written outside served dirs; never executed
EXTRACTION ────────── PyMuPDF / python-docx / Tesseract; resource-limited;
 │                    crash → typed error, never a 500 trace
SANITISATION ──────── strip zero-width, near-zero font, off-mediabox, white-on-white,
 │                    control chars → record pattern names in injection_flags
 │                    (patterns stored; content never)
╔═══════════════════════════════════════════════════════════════════╗
║ UNTRUSTED DOCUMENT CONTENT                                        ║
║ Passed as a separate keyword-only parameter.                      ║
║ NEVER concatenated into system instructions.                      ║
║ NO SECRETS EVER ENTER THIS BOUNDARY.                              ║
╚═══════════════════════════════════════════════════════════════════╝
 │
LLM ───────────────── schema-constrained decoding; temp 0; no tools; no network
 │                    access from the model; nothing to exfiltrate
STRUCTURED OUTPUT ─── Pydantic validation; one retry; then a typed 502
 │
SOURCE VALIDATION ─── exact then normalised match; NO FUZZY MATCHING
 │                    unverified items dropped before persistence
SAFETY VALIDATION ─── strip law assertions absent from the document;
 │                    is_advice enforced False; high-risk flags; refusal reframing
 │
USER
```

### 24.1 The three invariants, and what makes each structurally true

| Invariant | What enforces it |
|---|---|
| **Document content never becomes system instructions** | The `LLMProvider` signature (§19). Concatenation requires rewriting the interface, not forgetting a rule |
| **Secrets never enter document prompts** | Prompts are versioned files in `prompts/` containing no interpolation of config. A prompt-leak attack retrieves only authored instructions — which is why the payoff for injection is near zero (SECURITY.md §2, Layer 5) |
| **No sensitive content in logs** | The formatter drops any field not on an allowlist. Logging document text requires defeating the logger deliberately (SECURITY.md §6) |

### 24.2 Crypto decision (resolves C7)

Use **`cryptography`** with **Fernet** (AES-128-CBC + HMAC-SHA256, authenticated). `ENCRYPTION_KEY` is a `Fernet.generate_key()` value, stored in the environment.

Applied to `extractions.content_encrypted` and `situations.description`. Generate with:

```bash
python -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())"
```

Fernet rather than raw AES because it is authenticated by default and has no mode, IV or padding decisions to get wrong. The `.env.example` comment currently suggests `secrets.token_urlsafe(48)` for both keys — that is correct for `SESSION_SIGNING_KEY` but **wrong for `ENCRYPTION_KEY`**, which needs a Fernet key specifically. Fix in Phase 0.

**Honest limitation to record in SECURITY.md:** the key sits in the same environment as the application, so this protects against a leaked database file or a backup dump — which is the threat DATABASE.md names — but not against a compromised application host. HSM/KMS custody is already on SECURITY.md §7's deferred list, correctly.

---

## 25. Final recommendation

**A. Recommended MVP stack** — React/TS/Vite/Tailwind on Vercel; FastAPI/Pydantic/SQLAlchemy in Docker on Render; Supabase Postgres; Gemini 3.8 Flash; PyMuPDF + python-docx + Tesseract; browser TTS; signed anonymous cookies.

**B. Required APIs** — Gemini API (`gemini-3.8-flash`). **That is the entire list.**

**C. Optional APIs** — Claude API (Sonnet 5) as a configured fallback only.

**D. APIs we should NOT use** — Google Translate (§8); Google Cloud TTS (§7); Google Vision / AWS Textract / Azure OCR (§5.2); any legal-data API, official or third-party (§6); any analytics SDK (§15.1); any error-tracking SaaS for MVP (§15.1); any object-storage service (§10); any auth provider (§11); any vector database (TRD §12).

**E. Primary LLM** — Gemini 3.8 Flash (`gemini-3.8-flash`), **paid tier for any real document**.

**F. Fallback LLM** — Claude Sonnet 5 (`claude-sonnet-5`), provider-swap on sustained failure, not a runtime chain.

**G. OCR** — Tesseract with `hin`+`eng`, local. Gemini vision as an optional second-stage fallback on the paid tier.

**H. TTS** — Browser `SpeechSynthesis`. No API, no key, no data egress.

**I. Database** — SQLite for dev and CI; Supabase Postgres when deployed. SQLAlchemy + Alembic throughout.

**J. Storage** — Local temporary filesystem, file deleted immediately after extraction. No object storage.

**K. Hosting** — Vercel (frontend) + Render Docker (backend) + Supabase (database). Budget for Render Starter if the demo cannot tolerate a 1-minute cold start.

**L. Authentication** — Anonymous signed session cookies. No accounts, no provider.

**M. Testing** — pytest + httpx (backend); Vitest + React Testing Library (frontend); Playwright + axe (e2e and a11y); Ruff + MyPy + ESLint + Prettier; everything runs against `MockProvider` with no key and no network.

**N. Estimated MVP cost** — **₹0 for development.** Roughly **₹400 for a hackathon demo** (~200 analyses on the paid tier). Approximately **₹600/month at 100 users**. Recurring infrastructure: **₹0**.

**O. Implementation phases** — §16, seventeen phases, Phase 8 is the gate.

**P. Dependency graph** — §17. Freeze `AnalysisResponse` early; it is what unblocks parallel frontend work.

### Q. Biggest technical risks

| Risk | Impact | Mitigation |
|---|---|---|
| **Gemini rejects the nested `AnalysisResponse` schema** | Blocks the entire analysis pipeline | Test the real schema in the **first** task of Phase 6. Split, never loosen (§4.5) |
| **Span verification drops >30% of items** | The product thesis fails | TRD §11's gate. Stop feature work and fix the prompt (Phase 8) |
| **Render spin-down kills a running analysis** | Infinite spinner | The reaper job (§22), built in Phase 7 |
| **Tesseract quality on Hindi phone photos** | Persona C unusable | Confidence threshold + visible warning + user confirmation; Gemini vision as paid fallback |
| **Devanagari fails to embed in the export PDF** | Hindi export broken | Test font embedding in Phase 12, early |
| **Cold start during live judging** | Demo failure | Pre-warm; budget for Render Starter |

### R. Biggest cost risks

| Risk | Mitigation |
|---|---|
| **Gemini pricing doubles on 2027-01-01** ($0.75/$3.75 → $1.50/$7.50) | Known and dated. Re-baseline §20 before then; Flash-Lite is the lever |
| **Hindi doubles output tokens** | Measure with a token count in Phase 6, not at scale |
| Analyze endpoint abused | 15/hour/session **and per IP** (§21) |
| Bilingual output doubling every analysis | C4 Option B — lazy, only for users who switch (§8.1) |
| Supabase 0.5 GB / Render 750h exceeded | Only bites near 10,000 documents; plan the paid step then |

### S. Biggest AI risks

| Risk | Mitigation |
|---|---|
| **Fabricated obligation** | Span verification drops it before display. Structural, not exhortative |
| **Wrong deadline** — the highest-harm error this product can make | Deterministic date parsing; parser wins over model; **every** deadline carries `needs_verification` regardless of confidence |
| Hallucinated statute | Prohibited by prompt, stripped in `safety_service`, and asserted by TESTING #26 |
| Advice presented as information | `is_advice` enforced False; refusal reframing; TESTING #31–34 |
| Uniform confidence teaching false trust | Confidence labels, `uncertainty[]`, conflicts reported not resolved |
| Model drift raising `dropped_item_count` | It is persisted per analysis specifically as a quality signal — alert on it rising |

### T. Biggest security risks

| Risk | Mitigation |
|---|---|
| **Free-tier training on real legal documents** (§0.1) | **Enable billing before any real user document.** The single most important action in this document |
| Prompt injection | Six layers (SECURITY.md §2); adversarial fixtures in CI; payoff near zero by design |
| Malicious upload | Magic bytes as the authoritative check; validation cheapest-first; filename discarded |
| Cross-session access | Ownership in the `WHERE` clause; 404 not 403 |
| Document content in logs | Allowlist formatter — bypassing it must be deliberate |
| Leaked database file | Fernet encryption of extracted text (§24.2) |
| CSRF on state-changing routes | Custom-header requirement (§11.1) — **currently missing from the specs** |
| In-memory rate limits reset on spin-down | Known MVP weakness; record in SECURITY.md §7's deferred list |

---

## 26. What I need from you before implementation

1. **C1–C7 decisions** (§1.1) — especially **C3** (does the question endpoint exist?) and **C4** (how language switching works).
2. **Confirmation on §0.1** — billing enabled on Gemini before any real document, or an explicit decision to accept the free tier for synthetic data only.
3. **The missing research documents**, if they contain decisions that contradict anything above.
4. **A call on Render Starter** for the demo — a small spend that removes the largest demo-day risk.

Once those are settled, Phase 0 is a documentation pass and Phase 1 can begin.

---

## Sources

- [Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing)
- [Gemini API models](https://ai.google.dev/gemini-api/docs/models)
- [What's new in Gemini 3.8 Flash](https://ai.google.dev/gemini-api/docs/latest-model)
- [Gemini API rate limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Gemini document processing](https://ai.google.dev/gemini-api/docs/document-processing)
- [Gemini structured output](https://ai.google.dev/gemini-api/docs/structured-output)
- [Gemini API Additional Terms of Service](https://ai.google.dev/gemini-api/terms)
- [Render: Deploy for Free](https://render.com/docs/free)
- [Fly.io resource pricing](https://fly.io/docs/about/pricing/)
- [Railway pricing plans](https://docs.railway.com/pricing/plans)
- [Hugging Face Spaces storage](https://huggingface.co/docs/hub/en/spaces-storage)
- [Supabase project pausing](https://supabase.com/docs/guides/platform/free-project-pausing)
- [OpenAI API pricing](https://developers.openai.com/api/docs/pricing)
