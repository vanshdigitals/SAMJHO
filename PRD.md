# Samjo: Product Requirements

## 1. Problem

The assumed problem is that legal language is hard to read. That is real but shallow. The deeper failure is **legal orientation**: a person holding a notice or an agreement cannot answer four questions.

1. What is this document, and is it serious?
2. Which parts of it actually affect me?
3. Is a clock running?
4. What do I do next, and what should I ask a professional?

A summariser answers none of these. It paraphrases the text and leaves the person exactly as unoriented as before, now with a shorter version of the same confusion.

### Root cause chain

```
Surface:     "I got a document I don't understand."
Immediate:   legalese, length, English-only text
Behavioural: can't tell what matters; can't tell if it's urgent; avoidance under stress
Systemic:    professional help is unaffordable or unknown; information is scattered
Root:        ORIENTATION FAILURE plus CHARACTERIZATION FAILURE
```

The characterization failure is the gate. People who do not recognise a situation as legal never enter any help pathway at all, so a product that only opens once you already know you have a legal problem misses the population that needs it most. This is why Samjo has a situation-first entry alongside the document entry.

## 2. Users

Capability-based, not age-based. Five archetypes cover the majority.

| | Persona | Trigger | Needs first | Fails when |
|---|---|---|---|---|
| A | Stressed notice receiver | A notice arrives | Urgency, deadline, immediate step | Misses a response window and loses a right by default |
| B | Pre-signature reviewer | "Sign here" | Obligations, unusual clauses, money | Signs a lock-in or deposit clause unknowingly |
| C | Regional-language user | Either of the above | Hindi explanation, read-aloud | Depends on a literate relative, or gives up |
| D | Educated, legally unfamiliar | A vendor or employment contract | Structure, risk, questions for counsel | Over-trusts a generic chatbot |
| E | Young / student | First lease, first offer, a policy | Very clear navigation on a phone | No prior experience, low confidence |

A and B drive the MVP. C, D and E are served by the same flow plus language, read-aloud, and mobile-first layout.

## 3. Jobs to be done

Ranked by severity, frequency, and how safely GenAI can do them.

1. When I receive a legal document, tell me what it is, whether it is serious, and what the deadline is.
2. When someone asks me to sign, tell me what I am agreeing to and what is unusual.
3. Show me the clauses, obligations, money and dates that affect me specifically.
4. Tell me realistic next steps, and when to stop and get a professional.
5. Help me prepare the right questions before I pay for a consultation.

Job 5 is the safest high-value job in the entire space: generating good questions requires no legal conclusion at all.

## 4. Goals

| Goal | Measure |
|---|---|
| Orientation, not summary | Every briefing leads with what it is and whether it is urgent, before any prose |
| Grounded output | 100% of displayed items resolve to a verified span in the source text |
| Honest uncertainty | Low-confidence items are visibly flagged, not silently rendered |
| Reachable | Hindi and English, read-aloud, works at 360px, WCAG 2.2 AA |
| Safe | Refuses outcome prediction and advice; escalates high-risk situations |

## 5. Non-goals

Outcome prediction. "Will I win." Legal representation. Court or statutory filing. Advice presented as fact. Lawyer replacement. Autonomous agents. Open-ended browsing. Fine-tuning. Vector database or RAG for single-document analysis. Fabricated statutes or citations. A fake lawyer directory. Community features. Crypto. Gamification. Dashboard sprawl.

When a user asks for a prediction, Samjo says:

> I can help you understand the document, identify what it says, highlight issues to discuss with a legal professional, and prepare questions. I can't predict the outcome of a legal dispute.

## 6. Product principles

1. **Orientation before explanation.** Never jump from upload to a wall of text. Characterize, then triage, then explain.
2. **Nothing unsourced survives.** An unverifiable claim is deleted, not caveated.
3. **Three states stay separate.** Document says, Samjo interprets, verify. Never visually merged.
4. **Urgency is a first-class citizen.** It ranks above everything on the screen because missing a deadline is the highest-harm failure in this domain.
5. **Deterministic where possible.** Dates, currency and percentages come from parsers, not from a language model.
6. **The answer to "what now" is always visible.** The primary action answers the user's real question.

## 7. Product model

Hybrid, document-grounded.

- **Entry A, "I have a document":** upload, validate, extract, characterize, analyze, briefing.
- **Entry B, "Something happened":** short guided intake, conservative orientation, what is known, what is missing, next steps, optional upload.

Entry B never asserts statute from model memory. With no document there is nothing to ground against, so it stays at the level of pathways and preparation.

## 8. MVP scope

**Document family:** residential rental agreements, and legal notices arising from rental and housing situations. Chosen because housing and consumer matters are among the most frequent civil problems in India, examples are easy to obtain, and the harm from missing a notice deadline is concrete and demonstrable.

### Must have

Landing. Situation-first entry. Upload with PDF and DOCX. File validation. Text extraction. OCR fallback for images and scans. Document characterization. Structured analysis producing summary, obligations, risks, money, deadlines, questions. Source-linked evidence with confidence. Document-says vs interprets vs verify. Urgency assessment. Professional escalation. Lawyer preparation checklist. Hindi and English. Read-aloud. Export. Delete. Prompt injection defence. Full loading, empty, partial and error states.

### Should have

Two-version comparison. More Indic languages. Deadline reminders. Saved history behind an explicit opt-in.

### Will not build in MVP

Everything in section 5.

### Success condition

> A user uploads a rental agreement or a housing notice, or describes their situation, in Hindi or English. Within three steps and roughly sixty seconds they receive a source-grounded briefing that correctly identifies their obligations, any running deadline, the top risks, and three to five questions for a professional, with uncertainty marked and the limits stated.

## 9. Requirements and acceptance criteria

### 9.1 Upload

- Accepts PDF, DOCX, JPEG, PNG up to 10 MB and 30 pages.
- Rejects mismatched magic bytes, encrypted PDFs, and macro-bearing files with a specific message naming the reason.
- Acceptance: a `.exe` renamed `.pdf` is rejected on magic bytes, not on extension.

### 9.2 Extraction

- Digital PDFs use the text layer. Scans and images route to OCR.
- OCR below `OCR_MIN_CONFIDENCE` surfaces a verification prompt showing the extracted text.
- Acceptance: a phone photo of a notice produces a briefing, with a visible low-confidence warning.

### 9.3 Characterization

- Returns a document type with a confidence value before analysis begins.
- An unrecognised or non-legal document returns "this doesn't look like a legal document" and offers the situation flow.
- Acceptance: uploading a recipe does not produce a legal briefing.

### 9.4 Analysis

- Output validates against the Pydantic schema or the request fails visibly. No partial prose is rendered.
- Money, dates and percentages come from deterministic extraction; the model interprets, it does not compute.
- Acceptance: schema validation failure triggers one retry, then a typed error state.

### 9.5 Grounding

- Every obligation, risk, money item and deadline carries a `source_span`.
- Spans are verified by exact match against extracted text. Failures are dropped before persistence.
- Acceptance: an item whose quoted text is absent from the document never appears in the API response.

### 9.6 Urgency

- One of LOW, MEDIUM, HIGH, CRITICAL, with a stated reason and, where present, a date.
- HIGH and CRITICAL render a persistent banner and surface professional help.
- Urgency is derived from document evidence, never invented.
- Acceptance: a rental agreement with no deadline returns LOW and no banner.

### 9.7 Safety

- Advice, prediction and decision requests are reframed, not answered.
- High-risk categories (eviction, court summons, criminal notice, anything involving a minor) set `is_high_risk` and foreground professional help.
- Acceptance: "should I sign this" returns information plus a lawyer-prep offer, not a recommendation.

### 9.8 Language and read-aloud

- Full English and Hindi for UI and analysis output, driven by translation keys.
- Read-aloud covers briefing content with listen, pause, resume, stop. No autoplay.
- Hindi uses a Hindi voice when the device provides one.
- Acceptance: switching language re-renders the briefing without re-running analysis.

### 9.9 Privacy

- Anonymous session by default, no account.
- Documents and extracted text deleted after `DOCUMENT_TTL_HOURS` or immediately on request.
- No document content in any log.
- Acceptance: deleting a document removes the file, the extraction and the analysis items, and returns 404 on subsequent reads.

### 9.10 Accessibility

- WCAG 2.2 AA. Keyboard-complete. Visible focus. 44px targets. 200% zoom. Reduced motion respected. No colour-only meaning.
- Acceptance: automated axe scan passes on every route, and the upload-to-briefing path completes with keyboard only.

## 10. Roadmap after MVP

Version comparison. More Indic languages. Additional document families, starting with employment offers and consumer notices. Deadline reminders. Legal-aid directory sourced from published NALSA data rather than invented. Voice intake for low-literacy users.

## 11. Risks

| Risk | Mitigation |
|---|---|
| Model fabricates an obligation | Span verification drops it before display |
| Deadline extracted wrongly | Deterministic date parsing plus a verify flag on every date |
| OCR garbles a scan | Confidence threshold, visible warning, user confirms text |
| Document carries injected instructions | Untrusted-data isolation, hidden-text stripping, schema-constrained output |
| User treats output as advice | Reframing behaviour, contextual disclosure, escalation paths |
| Hindi output degrades numbers | Amounts and dates render from the deterministic extractor, not the translation |
