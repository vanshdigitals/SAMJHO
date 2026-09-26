# Contributing to Samjo

## Non-negotiables

These are not style preferences. A change that breaks one of them will be rejected regardless of how well it is written.

1. **No unsourced claims reach the UI.** Every substantive analysis item carries a `source_span` that is verified against the extracted document text. Items that fail verification are dropped in `evidence_service`, not hidden in the frontend.
2. **Document text is untrusted data.** It is never concatenated into a system or developer instruction. See [SECURITY](docs/SECURITY.md#prompt-injection).
3. **No document content in logs.** Log identifiers and operational metadata only. A PR that logs extracted text, prompts containing document content, or LLM responses will be rejected.
4. **No legal advice.** Samjo describes what a document says and what a person might reasonably do next. It does not conclude, predict outcomes, or assert law the document does not contain.
5. **No secrets in code.** Environment variables only, with an entry added to `.env.example`.

## Before you open a PR

```bash
# Backend
ruff check . && mypy app && pytest

# Frontend
npm run lint && npm run typecheck && npm run test && npm run test:a11y
```

New analysis behaviour needs a fixture in `fixtures/` and a test that asserts the source span resolves. New UI needs keyboard and screen-reader coverage.

## Adding a document type

Extend `characterization` with the new type, add fixtures including one messy real-world scan, and add urgency rules if the type carries statutory clocks. Do not widen the LLM prompt to "handle everything"; each type gets its own extraction hints.

## Adding an LLM provider

Implement `LLMProvider` in `app/services/llm/`. It must support constrained JSON output against a Pydantic schema. If a provider cannot guarantee schema compliance, it is not eligible.

## Commits

Conventional commits. Reference the phase from the TRD where relevant, for example `feat(analysis): add source span verification (phase 4)`.
