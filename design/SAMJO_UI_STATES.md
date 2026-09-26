# SAMJO — UI States

`UX_FLOWS.md` §6: *"Every async surface ships six states. Designing only the happy path is the single most common way this product would fail a real user."*

Six states per async surface: **Loading · Success · Empty · Partial · Error · Retry.**

---

## 1. State rules

| State | Rule |
|---|---|
| Loading | Real pipeline stage names. **Never a fabricated percentage.** |
| Success | Content renders with evidence affordances **present, not hidden behind hover** |
| Empty | An invitation to act, not a shrug |
| Partial | Says which sections completed and which did not, offers retry for the rest |
| Error | Names what happened and what to do. **Never "Something went wrong."** |
| Retry | Always available, and **never loses the uploaded file** |

---

## 2. Error copy — verbatim, do not rewrite

These strings are fixed in `UX_FLOWS.md` §6. Stitch must render them exactly.

| Condition | Copy |
|---|---|
| Unreadable file | "Samjo couldn't read this document. It looks like a scan with no text layer. Try a clearer photo, or upload the original PDF." |
| Encrypted PDF | "This PDF is password-protected, so Samjo can't open it. Remove the password and upload it again." |
| Too large | "This file is over 10 MB. Try uploading just the pages that matter." |
| Wrong type | "Samjo reads PDF, Word and photos. This file is a different type." |
| Not a legal document | "This doesn't look like a legal document. If something has happened and you want help thinking it through, tell us about it instead." |
| Analysis failed | "Samjo read your document but couldn't finish the briefing. Your file is still here. Try again." |
| Offline | "You're offline. Samjo will pick up where you left off when you reconnect." |

**Universal error anatomy** — every error state, no exceptions:

```
[icon 24px, semantic colour]
Heading            H3 — what happened, in plain words
Body               Body 16/26 — why, and what it means
[ Primary action ] [ Secondary action ]
```

The file is always retained. "Try again" never returns the user to an empty upload screen.

---

## 3. Per-screen state inventory

### Upload (07 / 08 / 09)

| State | Treatment |
|---|---|
| Idle | Dropzone, dashed `--border-strong` |
| Hover / drag-over | `--primary` border, `--primary-subtle` fill |
| Uploading | UploadCard: filename, size, indeterminate bar, Cancel |
| **Validation error (08)** | Dropzone border → `--danger`, fill `--danger-surface`, message inside, **file retained**, actions `Try another file` / `Take a photo` |
| **Unsupported (09)** | Same shell, copy = "Wrong type" row above, plus the accepted-formats line repeated in `--text-primary` |
| Too large | Same shell, "Too large" copy, plus "This file is 14.2 MB" in Caption |
| Encrypted | Same shell, "Encrypted PDF" copy |

### Processing (10 / 11 / 12 / 13)

| State | Treatment |
|---|---|
| **Reading (10)** | Stage 1 active, 2–5 dim |
| **Detected / ready (11)** | All five stages checked, then a 72px confirmation row: document icon, "This looks like a residential rental agreement", `type_confidence` as a word, and `[ See your briefing ]` primary |
| Low type confidence | Same row, but: "Samjo thinks this is a rental agreement, but isn't certain." + `[ See your briefing ]` and `[ This isn't right ]` |
| **Analysing (12)** | Stages 1–3 checked, 4 active |
| **Failed (13)** | Alert icon `--danger`, "Analysis failed" copy verbatim, actions `[ Try again ]` primary + `[ Upload a different file ]` secondary. Stage list stays visible, showing where it stopped. |
| Not a legal document | "Not a legal document" copy, actions `[ Tell us what happened ]` primary + `[ Try a different file ]` secondary |

### Briefing (14)

| State | Treatment |
|---|---|
| Loading | Skeleton matching final metrics: context bar, three section headings, six item rows with rail and markers. **No shimmer gradient** — opacity pulse only. |
| Success | Full briefing |
| **Partial** | Completed sections render normally. Incomplete ones show an inline row on `--surface-subtle`, radius 12: "Samjo couldn't finish this section." + `[ Try this section again ]` quiet button. **Never hide the failure.** |
| Empty section | A section with zero items renders its heading and one line in `--text-muted`, e.g. "No amounts were found in this document." — the heading is never dropped silently. |
| **Low OCR confidence (46)** | Notice directly beneath the context bar, `--warning-surface`, radius 12, 16px padding, alert icon: "Some text in this document was difficult to read." then "Please check important dates, amounts and names against the original document." + `[ See the document ]` quiet button. **Persistent — not dismissible.** |
| Dropped items | When `dropped_item_count > 0`, one Caption line at the foot of the briefing: "Samjo removed N items it couldn't trace back to your document." Honesty about the grounding filter is a feature. |

### Evidence (21)

| State | Treatment |
|---|---|
| Empty (xl pane, nothing selected) | Document icon 32px `--text-muted`, "Tap any point on the line to see exactly where it comes from in your document." |
| Loading | Skeleton: three blocks matching the final three sections |
| Success | Three blocks |
| Span not found | Should be impossible — `AI_SCHEMAS.md` drops unverified items before persistence. If it occurs: "Samjo couldn't locate this in the document, so it has been removed from your briefing." + a reload action. This is a **bug state**, and is designed so it is loud rather than silent. |

### Situation (29–34)

| State | Treatment |
|---|---|
| Intake | One question per screen (mobile) / 2–3 visible (desktop) |
| Analysing | Same stage pattern, fewer stages: "Understanding what you've told us" → "Working out what matters" |
| Summary | Reading surface, **no rail, no markers** |
| **What is missing (33)** | `--surface-subtle` panel, radius 16: "What Samjo doesn't know yet", then a plain list. Naming gaps explicitly is a safety feature (`UX_FLOWS.md` §3), not an apology. |
| Too little information | "Samjo needs a little more to be useful here." + `[ Answer a few more questions ]` + `[ Show us a document instead ]` |

### Q&A (37 / 38 / 39)

| State | Treatment |
|---|---|
| Idle | Input + label + one example in `--text-muted`: "Does this agreement mention when the deposit is returned?" |
| Thinking | "Looking through your document…" + indeterminate bar. No streaming cursor, no typing dots. |
| **Answer (38)** | Answer prose → `Document says` quote → `Page N` → confidence |
| **Not found (39)** | "I couldn't find that information in this document." then "Samjo only answers from what's written in the document you uploaded." + `[ Ask something else ]`. **No speculation, no partial guess.** |
| Refused | Reframe per `AI_SAFETY.md` §3 — canonical line: "I can help you understand the document, identify what it says, highlight issues to discuss with a legal professional, and prepare questions. I can't predict the outcome of a legal dispute." + `[ Prepare questions for a lawyer ]` |

---

## 4. Global states

### Network error (43)

**Transient** — a banner below the header, `--warning-surface`, full width, 48px: alert icon + "You're offline. Samjo will pick up where you left off when you reconnect." Dismissible. Work in progress is preserved; nothing is discarded.

**Blocking** (an action needs the network) — the action button enters disabled + a Caption beneath: "This needs a connection. Try again when you're back online."

### Generic error (44)

Reserved for genuinely unclassified failures. Even here, never "Something went wrong":

```
Samjo hit a problem it didn't expect.
Your document is still here, and nothing was lost.
[ Try again ]   [ Go back to your briefing ]
```

Centred, 480px, no illustration.

### Session expired (45)

Modal, 480px, radius 16, `--shadow-medium`, focus trapped:

```
Your session has ended
Samjo keeps documents for 24 hours and then deletes them
automatically. This one has been removed.
[ Start again ]  primary
```

Framed as **privacy working as intended**, not as a failure — `PRD.md` §9.9 makes deletion a guarantee, so the copy should read like the guarantee being honoured.

### Empty states

No decorative illustrations (brief §32). Pattern:

```
[icon 32px, --text-muted]
No document yet.                          H3
Show us a document to start understanding it.   Body, --text-secondary
[ Upload document ]                       primary
```

---

## 5. Confidence and verification display

From `AI_SCHEMAS.md` — users **never** see a raw float.

| Score | Word | Extra |
|---|---|---|
| ≥ 0.85 | High | — |
| 0.65 – 0.85 | Medium | — |
| < 0.65 | Low | automatic `needs_verification` |

`needs_verification` renders as a **hollow rail marker + the word "Verify"** in `--warning`. Never the shape alone.

**Every deadline shows "Verify" regardless of confidence.** A wrong date is the highest-harm error this product can make.

---

## 6. Destructive confirmation (28)

Modal, 480px, focus trapped, Escape closes, focus returns to the trigger.

```
Delete this document?
This removes the file, the text Samjo read from it, and
your briefing. This cannot be undone.
[ Cancel ]  secondary      [ Delete ]  danger
```

`Cancel` is focused on open, not `Delete`. Danger variant is the **only** place `--danger` is used as a button fill. On success: a toast, "Document deleted." and a redirect to `/`.

---

## 7. Loading state inventory

| Surface | Form | Never |
|---|---|---|
| Processing | Named stages + indeterminate bar | a percentage |
| Briefing | Skeleton matching final metrics | a spinner on an empty page |
| Evidence | Three-block skeleton | a spinner |
| Q&A | "Looking through your document…" | typing dots, streaming cursor |
| Export | Button loading state, label held | a full-page block |
| Button | Spinner replaces label, width preserved | the button changing size |

Under `prefers-reduced-motion`, all skeleton pulses and indeterminate bars become a static `--surface-subtle` fill with the stage name still updating as text.
