# SAMJO — Google Stitch Prompts

**How to use this file**

1. Paste the full block from `SAMJO_MASTER_STITCH_DESIGN_CONTEXT.md` §A at the top of **every** generation.
2. Append the batch suffix from §D of that file.
3. Append the screen prompt below.
4. Generate desktop and mobile as **separate** generations. Never ask Stitch for "responsive" — it produces a shrunken desktop.
5. Reject and regenerate on any of: a gradient, uniform card grid in the briefing, merged evidence blocks, measure wider than 68ch, a bare coloured urgency indicator, invented content.

Screens marked **†** inherit another screen's full layout. Generate the parent first, then pass the parent's output plus the delta.

Demo content is fixed across every frame: **Residential Rental Agreement · Tenant Aarav Mehta · Landlord Demo Property Owner · Noida, Uttar Pradesh · rent ₹15,000 · deposit ₹25,000 · late fee ₹1,000 · 30 days notice · response deadline 30 September 2026.** Always show the `DEMO` chip.

---

# BATCH 1 — Brand and design system

### SHEET 1.1 — Token and component sheet

**PURPOSE** One reference artboard every later generation is matched against.

**DESKTOP 1440 only** (no mobile frame). Background `#F6F3EE`. Six labelled zones on a 12-column grid, 48px gutters, section headings H2:

1. **Colour** — 16 swatches, 88×88, radius 8, each with its token name (Label) and hex (Caption) beneath. Grouped: surfaces, text, structure, action, semantic, focus.
2. **Type** — the nine roles rendered at real size in one column, each with the role name, family, size/line-height and weight in Caption to the left. Include one Devanagari line: `यह एक किराया अनुबंध है।` at Body Large with +4px line-height.
3. **Spacing and radius** — 10 spacing bars (4→64) and 4 radius squares (8/12/16/24), each labelled with its role, not just its value.
4. **Buttons** — 4 variants × 6 states (default, hover, focus, pressed, disabled, loading) as a labelled grid, at md 44px.
5. **Inputs** — text input, textarea, select, each in default / hover / focus / filled / disabled / error / success, labels visible above.
6. **Signature components** — the evidence rail with 3 items (one filled marker, one hollow + "Verify", one active with halo); the four urgency treatments side by side; an evidence card; a source chip at all five states; the progress indicator with 5 stages; an audio bar.

**DO NOT** lay this out as a website. No hero, no nav, no footer. It is a specimen sheet.

---

# BATCH 2 — Public pages

### SCREEN 01 — Landing / Home ★ priority 4

**PURPOSE** Two obvious doors in, and one visible proof that Samjo is source-grounded.
**USER CONTEXT** Often arriving stressed, from a search or a forwarded link, on a phone.

**DESKTOP 1440×900** — Header 64 (wordmark left; language, text size, Listen right). Container 1200. Hero column capped **680px, left-aligned, not centred**, starting 96px below the header. Order: `Samjo` Display 40/44 → `Samajh aane tak.` H2 in `--text-secondary` → 32px gap → the Hindi headline H1 32/38 over two lines → 20px → the supporting paragraph Body Large 18/28 at 68ch in `--text-secondary` → 32px → two lg 52px buttons side by side, 16px apart → 20px → the trust row, Body Small `--text-muted`, middot-separated, no icons and no boxes. 96px bottom space.

Below the fold, a two-column proof band: left 400px holds H2 "Every claim points back to your document" plus two sentences; right holds a real briefing fragment at ~60% scale inside a `--surface` panel, radius 16, 1px `--border`, showing the evidence rail with one marker open. Then a full-bleed `--surface-subtle` band, 64px padding, H2 "What Samjo does not do" followed by three plain lines — no cards, no icons. Footer one row.

**MOBILE 390×844** — Single column, 20px margins, left-aligned. Display 32/38, H1 26/32. Both CTAs full width at 52px, stacked 12px apart. Trust row wraps to two lines. Proof band stacks: heading, two sentences, then the briefing sample full width. Limits band 32px padding. Footer stacked.

**COPY** (exact)
- `Samjo`
- `Samajh aane tak.`
- `Legal documents ko samajhna mushkil nahi hona chahiye.`
- `Upload a document or tell us what happened. Samjo helps you understand what matters, what's urgent, and what to do next.`
- Primary: `I have a document` · Secondary: `Something happened`
- Trust row: `Source-grounded · Private by design · Hindi + English · Read aloud`
- Limits heading: `What Samjo does not do`
- Limits lines: `Samjo is not a lawyer and does not replace one.` / `Samjo cannot predict what will happen in a dispute.` / `Samjo gives legal information, not legal advice.`

**INTERACTIONS** Buttons: hover `--primary-hover` / `--background` fill. No scroll animation. No parallax.

**A11Y** One h1. Skip link first. Trust row is plain text, not a list of badges. 52px CTAs.

**DO NOT** Gradient hero. Centred hero text. Hero illustration or device mockup. Statistics, user counts, testimonials, logo wall. Animated blobs. "Revolutionising law" copy. Three feature cards with icons.

---

### SCREEN 02 † — How Samjo works

Inherits Screen 01's below-fold band. **Delta:** a three-step horizontal sequence on desktop (stacked on mobile), each step being a heading and one sentence on plain background — **no cards, no numbered circles, no connecting arrows**.

**COPY** `Show us the document` / `Samjo reads it and finds what matters` / `You see what to do, and exactly where it comes from`

---

### SCREEN 03 — Safety: what Samjo does and doesn't do

**PURPOSE** State the boundary plainly, as a page rather than fine print.

**DESKTOP** 680 centred, H1 `What Samjo does, and what it doesn't`. Two stacked blocks separated by a hairline, each with an H2 and a plain list at Body Large — **`Samjo can` uses check icons in `--success`; `Samjo cannot` uses close icons in `--text-muted`, not red.** Refusing to do something is not an error state. Then an H2 `If you ask Samjo to predict an outcome` followed by the canonical line in a `--surface-subtle` quote block.

**MOBILE** Single column, same order, 20px margins.

**COPY** — `Samjo can`: `Explain what a document says, in plain words` / `Point to the exact line each explanation comes from` / `Show amounts, dates and deadlines it found` / `Suggest questions to ask a professional`. `Samjo cannot`: `Tell you what to do` / `Predict what will happen in a dispute` / `Say whether a clause is enforceable` / `Act for you, or replace a lawyer`.
Canonical line: `I can help you understand the document, identify what it says, highlight issues to discuss with a legal professional, and prepare questions. I can't predict the outcome of a legal dispute.`

**DO NOT** Use `--danger` for the "cannot" list.

---

### SCREEN 04 — Privacy

**DESKTOP/MOBILE** 680 centred / single column. H1 `What happens to your document`. Four blocks, hairline-separated, each H3 + Body Large. Then a `--surface-subtle` panel, radius 16, 32px padding, listing the three guarantees in Body with shield icons.

**COPY** H3s: `No account needed` / `Deleted automatically` / `Never used to train anything` / `Not in our logs`. Guarantees: `Documents are deleted after 24 hours, or immediately when you ask.` / `Deleting removes the file, the text Samjo read, and your briefing.` / `Document content never appears in any log.`

---

### SCREEN 05 — Accessibility statement

Same shell as 04. H1 `Accessibility`. Blocks covering the WCAG 2.2 AA commitment, keyboard operation, read-aloud, Hindi and English, text size and zoom, reduced motion. Close with a line inviting reports of barriers — **no email address is invented**; use `[ Tell us about a barrier ]` as a placeholder action.

---

# BATCH 3 — Entry, upload, processing

### SCREEN 06 — Choose starting point ★ priority 4

**PURPOSE** One decision, two doors, nothing else on screen.

**DESKTOP 1440×900** Header only, no footer. Two panels 560×auto, 32px gutter, vertically centred. Each: `--surface`, 1px `--border`, radius 16, 40px padding, **no shadow**. Icon 32px `--primary` → H2 → Body in `--text-secondary` → full-width button. Above the pair, centred, H1 `Where would you like to start?` with 48px below it.

**MOBILE 390×844** Panels stacked full width, 16px gap, 24px padding, icon 28px, H3 title, Body Small description, full-width button. H1 26/32 at the top with 32px below.

**COPY** — H1 `Where would you like to start?`
Left: `I have a document` / `A notice, an agreement, or anything you've been asked to sign.` / button `Show us the document`
Right: `Something happened` / `No document yet. Tell us what happened and Samjo will help you think it through.` / button `Tell us what happened`

**INTERACTIONS** Whole panel is one target. Hover → border `--border-strong`. Focus ring wraps the panel.

**DO NOT** Add a third option. Add a "skip" link. Use different icon colours per panel.

---

### SCREEN 07 — Upload ★ priority 3

**PURPOSE** Make handing over a file feel trivially easy and obviously safe.

**DESKTOP 1440×900** 680 centred. H1 `Show us the document` → Body Large `Upload a PDF, Word file, or a clear photo.` → 24px → dropzone full width, **240px tall**, 2px dashed `--border-strong`, radius 16, `--surface` fill, containing a centred 32px upload icon, Body 16/500 `Drag a file here`, Caption `or`, and a secondary md button `Choose a file`. Below: privacy line with a 16px shield icon, Body Small. Below that, a three-item metadata row in Caption `--text-muted`.

**MOBILE 390×844** H1 26/32. Dropzone **180px**, with a 28px icon and the primary action inside as `Choose a file from your phone` — drag copy is omitted entirely. Beneath it, a full-width **secondary 52px button `Take a photo`** with a camera icon. Then the privacy line, then metadata wrapping to two lines. No bottom bar — the actions are in-flow.

**COPY** — H1 `Show us the document` · helper `Upload a PDF, Word file, or a clear photo.` · privacy `Your document is processed securely and temporary files are deleted after extraction.` · metadata `PDF, Word, JPG, PNG` / `Up to 10 MB, 30 pages` / `Deleted automatically after 24 hours`

**A11Y** The dropzone is a real button, keyboard-reachable; drag is never the only path. Focus ring wraps the whole zone.

**DO NOT** Hide "Take a photo" behind the dropzone on mobile. Use the word "Upload" as the button label. Show a file-type icon grid.

---

### SCREEN 08 † — Upload validation error

Inherits 07. **Delta:** dropzone border → 2px solid `--danger`, fill `--danger-surface`. Inside: 24px alert-triangle `--danger`, the error heading Body 16/500 `--text-primary`, the error body Body `--text-secondary`, then two buttons `Try another file` (secondary) and `Take a photo` (quiet). **The rejected filename stays visible in Caption above the message.** Nothing else on the page changes.

**COPY variants** — Too large: `This file is over 10 MB. Try uploading just the pages that matter.` · Encrypted: `This PDF is password-protected, so Samjo can't open it. Remove the password and upload it again.` · Unreadable: `Samjo couldn't read this document. It looks like a scan with no text layer. Try a clearer photo, or upload the original PDF.`

---

### SCREEN 09 † — Unsupported document

Inherits 08. **Delta:** copy is `Samjo reads PDF, Word and photos. This file is a different type.` and the accepted-formats line repeats directly beneath in `--text-primary` Body rather than `--text-muted` Caption.

---

### SCREEN 10 — Processing ★ priority 3

**PURPOSE** Show real work happening, honestly, without a fabricated number.

**DESKTOP 1440×900** 680 centred, vertically centred in the viewport. Above the list: filename + `12 pages` in Body Small `--text-muted`. The five-stage list, left-aligned, 20px between rows:
- completed → 20px check `--success` + label Body `--text-muted`
- active → label Body 16/500 `--text-primary`, with a 2px indeterminate bar in `--primary` on `--surface-subtle` directly beneath, full column width
- pending → label Body `--text-muted`

Below: privacy line, then a quiet `Cancel` button.

**MOBILE 390×844** Content starts 25% down, 16px rows, full width, otherwise identical. `Cancel` sits above the safe area.

**COPY** Stages, in order and verbatim: `Reading your document` / `Working out what this is` / `Finding what matters` / `Checking dates and amounts` / `Preparing your briefing`

**A11Y** Stage changes announce through a polite live region.

**DO NOT** Show a percentage, an ETA, a spinner ring, a shimmering AI animation, or a document-scanning illustration.

---

### SCREEN 11 † — Document detected / ready

Inherits 10. **Delta:** all five stages checked and dimmed. Below them, 32px gap, a confirmation row: 24px document icon `--primary`, H3 `This looks like a residential rental agreement`, Body Small `--text-muted` `Samjo is confident about this`, then a **lg 52px primary button `See your briefing`**.

**Low-confidence variant:** H3 becomes `Samjo thinks this is a rental agreement, but isn't certain.` and a secondary `This isn't right` sits beside the primary.

---

### SCREEN 12 † — Analysis in progress

Inherits 10. **Delta:** stages 1–3 checked, stage 4 `Checking dates and amounts` active, stage 5 pending.

---

### SCREEN 13 † — Analysis failed

Inherits 10. **Delta:** the stage list stays visible showing where it stopped, with the failed stage marked by a 20px alert-triangle `--danger` and its label in `--danger`. Below, 32px gap: H3 `Samjo couldn't finish your briefing`, Body `Samjo read your document but couldn't finish the briefing. Your file is still here. Try again.`, then `Try again` (primary) and `Upload a different file` (secondary).

**Not-a-legal-document variant:** `This doesn't look like a legal document. If something has happened and you want help thinking it through, tell us about it instead.` with `Tell us what happened` primary and `Try a different file` secondary.

---

# BATCH 4 — The briefing

### SCREEN 14 — Briefing / main results ★★★ priority 1

**PURPOSE** The product. A stressed person must, within seconds, know what the document is, whether a clock is running, and what to do — and be able to trace every claim back to the page it came from.

**DESKTOP 1440×900** Header 64. Document context bar 72, `--surface`, 1px bottom border: document title H3 left, then a `DEMO` chip (`--surface-subtle`, radius 8, Caption), then `Rental agreement · English · 12 pages` in Body Small `--text-muted` right.

Three panes below, gutters 32:
- **Sections 240**, sticky. A jump list: Body 16/400 `--text-secondary`, 44px rows, 12px left padding. Active row `--text-primary` 500 with a 2px `--primary` left bar. No icons, no counts. Items: `What this is` / `What you need to do` / `Watch out` / `Important details` / `Dates that matter` / `Questions to ask`. Below a hairline, a quiet `Ask about this document`.
- **Briefing 640**, scrolls, text capped **68ch**. Sections separated by 48px space and a 1px `--border` hairline — **never boxed**. Each section: H2 heading, then items hanging off the evidence rail (1px `--border-strong`, inset 12px, markers centred on it, item text indented 32px).
- **Evidence 320**, sticky, `--surface`, 1px left border, 24px padding. Shows its empty state until a marker is tapped.

A persistent bottom strip, `--surface` with a 1px top border, holds `What to do next` as a primary button.

**MOBILE 390×844** Header 56 (back, truncated title, `⋯`). Context strip 44: `DEMO · Rental agreement · English`. Then urgency banner if HIGH/CRITICAL. Then `What this is` — **always open, no chevron**. Then five accordion sections, **first two expanded**, headers 56px with trailing chevron, 1px `--border` dividers. Rail inset 12px from the 20px margin, item indent 28px. Audio bar 56 above the bottom bar. Bottom action bar 72 + safe area with `What to do next`.

**COPY** Section headings exactly: `What this is` · `What you need to do` · `Watch out` · `Important details` · `Dates that matter` · `Questions to ask`. Primary action `What to do next`.

Summary body: `This is a rental agreement for a flat in Sector 62, Noida. It runs for 11 months from 1 April 2026. It sets out what you pay, when you pay it, and how much notice either side must give.`

First-briefing disclosure line, once, directly under the context bar in Body Small `--text-secondary`: `Samjo gives legal information to help you understand your document and prepare. It is not legal advice and not a substitute for a lawyer.`

**INTERACTIONS** Marker tap → evidence updates (xl) / drawer (lg) / bottom sheet (<1024). Scroll-spy drives the sections pane. Briefing reveals once on first load, 40ms stagger, never again.

**A11Y** h1 is the document title. Section headings h2, item titles h3. `nav` named "Briefing sections". Evidence pane is an `aside`. Rail markers carry `Where this comes from: {title}`.

**DO NOT** Put each section in a rounded card. Add an "Evidence" entry to the sections list. Widen prose past 68ch. Add a chart. Add a confidence score as a number or a bar. Use a coloured left border to indicate section type.

---

### SCREEN 15 † — What this is

Delta of 14: H2 `What this is`, then 2–4 sentences at Body Large 18/28, 68ch, `--text-primary`. **No rail and no markers in this section** — it is orientation, not a claim list. On mobile it is always expanded with no chevron.

---

### SCREEN 16 † — What you need to do ★ priority 5

Delta of 14. H2 `What you need to do`. Items hang off the rail, 32px apart:

```
├─● Pay a security deposit of ₹25,000              H3 20/26
│   before you move in.                            Body Large 18/28
│
├─○ Give 30 days written notice    Verify          H3 + Caption --warning
│   before you leave.
│
├─● Pay rent by the 5th of each month.
```

Filled marker = verified, hollow + the word `Verify` = needs confirmation. No numbering, no checkboxes — these are obligations, not a to-do list the user ticks off.

---

### SCREEN 17 † — Watch out

Delta of 14. H2 `Watch out`. Same rail. Each item: H3 title, then Body Large explaining why it matters. Severity is shown as a **word** in Caption `--warning` beside the title where HIGH — never a coloured dot, never a red card.

**COPY** e.g. `The deposit can be reduced for "damage beyond normal wear"` / `The agreement doesn't define what counts as normal wear, so this is worth clarifying before you sign.`

---

### SCREEN 18 † — Important details (money) ★ priority

Delta of 14. H2 `Important details`.

**Desktop:** two-column definition rows, hairline between, each with its own rail marker. Label Body Large `--text-primary` left; amount **Inter 20/500 tabular numerals** `--text-primary`, right-aligned.
**Mobile:** stacked — label Body `--text-secondary`, amount **Inter 22/500** on the line beneath.

**COPY** `Monthly rent ₹15,000` · `Security deposit ₹25,000` · `Late payment fee ₹1,000` · `Maintenance ₹1,200 per month`

**DO NOT** Use the heading "Money". Add a pie chart, bar chart or total. Use `--success` green for amounts. Use a fintech card treatment.

---

### SCREEN 19 † — Dates that matter

Delta of 14. H2 `Dates that matter`. **The rail is the timeline** — do not draw a second vertical line.

```
●  Today                       Caption --text-muted
│  Document received           Body Large
│
●  30 September 2026           Inter 20/500 --text-primary
│  Response deadline    Verify Caption --warning
│  Body Large description
│
●  15 October 2026
   Notice period ends   Verify
```

**Every deadline shows `Verify`, regardless of confidence.** Relative dates render as written (`within 30 days of receipt`) with the resolved date beneath in Caption `--text-muted`.

---

### SCREEN 20 † — Questions to ask

Delta of 14. H2 `Questions to ask`. Each question: Body Large `--text-primary`, then its rationale in Body `--text-secondary` beneath, then a quiet `Copy` action. Rail markers link to the clause that prompted the question.

**COPY** `Can the security deposit be deducted for normal wear and tear?` / `Ask because the agreement allows deductions but doesn't define the term.` · `What happens if I need to leave before 11 months?` · `Is the maintenance charge fixed for the whole period?`

**DO NOT** Number these. Add save/star/bookmark chrome beyond `Copy`.

---

# BATCH 5 — Evidence and document viewer

### SCREEN 21 — Evidence / source view ★★ priority 2

**PURPOSE** The differentiator. Three things kept visually separate, always.

**DESKTOP 1440 (xl) — permanent right pane 320.** `--surface`, 1px left border, 24px padding, sticky. Content in fixed order with 1px `--border` hairlines and 16px above/below each:

```
Where this comes from                    ✕
──────────────────────────────────────────
Document says                  Label, --text-muted
┌────────────────────────────────────────┐
│ "The Tenant shall deposit a sum of     │  Inter 14/22
│  Rs. 25,000/- as interest-free         │  --surface-subtle, radius 8
│  security deposit."                    │  3px --border-strong left edge
└────────────────────────────────────────┘  padding 12/16
Page 1                         Caption, --text-muted
──────────────────────────────────────────
Samjo interprets               Label, --text-muted
This is refundable, but the agreement      Body 16/26
sets conditions for deductions.
──────────────────────────────────────────
How confident is Samjo?   High  Label + value
──────────────────────────────────────────
[ See it in the document ]     secondary, full width
```

**DESKTOP 1024–1279 (lg)** — identical content in a **360px right drawer** overlaying the briefing, scrim `rgba(19,28,43,0.24)`, 180ms slide.

**MOBILE 390×844 — bottom sheet.** Max 80vh, min 40vh, top corners **24px** (the only use of that radius), `--surface`, `--shadow-medium`, 36×4 `--border-strong` grab handle centred 12px from the top. Scrim `rgba(19,28,43,0.32)` — flat, **no blur**. Same content order. Button 52px full width. Briefing visible behind.

**INTERACTIONS** Focus traps inside. Escape closes. Swipe-down closes (mobile). Focus **returns to the marker that opened it**, and that marker shows its active halo.

**A11Y** The quote sits in `lang="en"` even when the interface is Hindi. Confidence is the word `High`, never a bar or a number.

**DO NOT** Merge the three blocks into one paragraph. Translate the quote. Show a percentage. Add an AI avatar or a "generated by" label. Blur the scrim.

---

### SCREEN 22 — Document viewer ★ priority 6

**DESKTOP** Full-screen overlay on `--background`. Header 64: back chevron, document title, `Page 4 of 12`, zoom `−` `+`, close `✕`. Page canvas centred, max 900px, white, 1px `--border`, `--shadow-subtle`. A slim page-thumbnail strip 88px on the left, scrollable, active page outlined 2px `--primary`.

**MOBILE** Full screen. Header 56: back, `4 / 12`, close. Page fills the width with 16px margins. Pinch-zoom enabled. Page navigation by vertical scroll; no horizontal carousel.

**A11Y** `user-scalable=no` is never set. Page indicator has the accessible name `Page 4 of 12`.

---

### SCREEN 23 † — Source highlight

Delta of 22. The matched span carries a `--warning-surface` fill with a 2px `--warning` left edge. The viewer opens scrolled to the span with a single 300ms ease. A floating chip sits above the highlight: `--surface`, radius 12, `--shadow-medium`, Body Small `This is the part Samjo referred to`, plus a quiet `Back to briefing`. The highlight persists while the viewer is open.

**DO NOT** Animate the highlight. Use `--danger` for it. Dim the rest of the page.

---

# BATCH 6 — Urgency, next steps, help, export, delete

### SCREEN 24 † — Urgency / high-risk state ★ priority 5

Delta of 14. A banner directly beneath the context bar, above `What this is`.

**HIGH** — `--warning-surface` fill, 1px `--warning` at 30%, radius 12, padding 16/20. 20px alert-triangle `--warning` top-left. Then: Label 14/500 `--warning` `Time-sensitive` → Body 16/26 `--text-primary` `This document appears to contain a time-sensitive requirement.` → H3 20/500 `Response due 30 September 2026` → a md primary button `See what to do`.

**CRITICAL** — identical structure on `--danger-surface` with `--danger`, the word `Urgent`, and **professional help surfaced inline**: a second row inside the banner with a secondary button `Get professional help`. Per `AI_SAFETY.md` §5, next steps then lead with getting help rather than reading further, and self-help content is de-emphasised but **never removed**.

**Desktop** banner spans the briefing column only (640), not the full width — it belongs to the reading surface.
**Mobile** full width minus margins, stacked, button full width.

**A11Y** Icon + word + colour, always. The escalation message is styled **distinctly from a disclaimer** so it does not inherit the disclaimer's learned invisibility.

**DO NOT** Use red for HIGH. Add a countdown timer. Make it dismissible. Repeat it at the bottom of the page. Use an exclamation mark in the copy.

---

### SCREEN 25 — Professional help ★ priority 7

**DESKTOP** 680 centred. A tab strip at the top: `When to get help` | `Prepare for your lawyer`. H1 `When to get professional help`. Then a plain list of triggers — each one line, Body Large, with a 20px `alert-triangle` in `--warning` and a 16px gap. **No cards.** Then pathways in a `--surface-subtle` panel, radius 16, 32px padding.

**MOBILE** Tabs as a 2-up segmented control 44px. Single column. Triggers stacked with 20px rows.

**COPY** Triggers: `A deadline in the next seven days` / `An eviction notice` / `Anything from a court, or a summons` / `Clauses that appear to contradict each other` / `A large amount of money is at stake` / `Anything involving someone under 18`. Panel heading `Where you can get help`.

**DO NOT** Build a lawyer marketplace, directory, ratings, profiles, or a "book a consultation" flow. **Invent no phone numbers, no firm names, no lawyer names.** Pathways are curated entries only — leave placeholder slots if the curated list is not yet supplied.

---

### SCREEN 26 † — Lawyer preparation

Second tab of 25. **The one place numbered markers are permitted**, because it genuinely is a sequence. A checklist, 01–05, numbers in Inter 14/500 `--text-muted` at the left, item text Body Large. Then a `Copy all` secondary button and an `Export this checklist` quiet button.

**COPY** `01 Bring the original document` / `02 Bring anything you've already sent or received` / `03 Note the dates that matter` / `04 Take your questions` / `05 Write down what outcome you want`

---

### SCREEN 27 — Export briefing

**DESKTOP** 680 centred. H1 `Take your briefing with you`. A preview panel, `--surface`, 1px `--border`, radius 16, showing the first page of the PDF at ~50% scale. Below, two checkboxes (44px rows, labels visible): `Include the quoted text from your document` (checked) and `Include the questions to ask` (checked). Then a lg primary `Download PDF` and a quiet `Back to briefing`.

**MOBILE** Preview full width, controls stacked, download button in the bottom bar.

**COPY** Footer note in Body Small `--text-secondary`: `Your export includes a note that Samjo gives legal information, not legal advice.` (per `AI_SAFETY.md` §8, the disclaimer is always in the export).

---

### SCREEN 28 — Delete data confirmation

Modal, 480px, `--surface`, radius 16, `--shadow-medium`, 32px padding, focus trapped, Escape closes, focus returns to the trigger. On mobile it is a centred modal, **not** a bottom sheet — destructive confirmation should not sit under the thumb.

**COPY** H3 `Delete this document?` → Body `This removes the file, the text Samjo read from it, and your briefing. This cannot be undone.` → `Cancel` (secondary) and `Delete` (danger), right-aligned on desktop, stacked full width on mobile with **Cancel on top**.

**A11Y** `Cancel` receives focus on open, never `Delete`.

**DO NOT** Use `--danger` fill anywhere else in the product. Add a countdown or a "type DELETE" field.

---

# BATCH 7 — Situation flow

### SCREEN 29 — Situation intake ★ priority 8

**PURPOSE** Serve the person who does not yet know they have a legal problem — the characterization gate in `PRD.md` §1.

**DESKTOP 1440×900** 680 centred. `Question 1 of 4` Body Small `--text-muted` → H1 `What happened?` → Body `--text-secondary` `A few sentences is enough. Write however feels natural — English or Hindi.` → a textarea, min 160px, label visible → `Continue` primary, right-aligned.

**MOBILE 390×844** Same, single column, textarea min 200px, `Continue` in the bottom action bar.

**DO NOT** Use a chat input with a send arrow. Add an avatar, a typing indicator, or message bubbles. Call it a conversation.

---

### SCREEN 30 † — Guided situation questions

Delta of 29. **Mobile: one question per screen, never a scrolling form.** Desktop: 2–3 visible at once. Option lists are 52px rows with 1px `--border` dividers; selected = `--primary-subtle` fill + `--primary` check. Progress stays as `Question 2 of 4` text — **no progress bar**.

**COPY** `When did this happen?` (`An approximate date is fine.`) / `Did you receive a document?` (`Yes / No / I'm not sure`) / `Is there a date you've been told to respond by?` / `Which state is this related to?`

**A11Y** WCAG 2.2 3.3.7 — a review summary before submission, never re-asking an answered question.

---

### SCREEN 31 † — Situation summary

Delta of 14's reading surface, **with the rail and all markers removed.** There is no document to ground against, and that absence must be visible — it is a safety feature, not an omission (`UX_FLOWS.md` §3).

Sections: `What we understand so far` / `What Samjo doesn't know yet` / `Things people in this position often do next` / `When to get professional help` / `Questions worth asking`. Then a `--surface-subtle` panel: H3 `Do you have a document?` + Body + primary `Show us the document`.

**DO NOT** Produce obligations, deadlines, or money items here. Add an evidence rail. Show confidence labels.

---

### SCREEN 32 † — What we know

Delta of 31. H2 `What we understand so far`, plain prose at Body Large, no markers.

### SCREEN 33 † — What is missing

Delta of 31. H2 `What Samjo doesn't know yet` inside a `--surface-subtle` panel, radius 16, 24px padding. A plain list, Body Large. Framed as clarity, not apology — no warning colour, no icon.

### SCREEN 34 † — Possible next steps

Delta of 31. H2 `Things people in this position often do next`. Numbered 1–4, Body Large. Hedged language throughout — `often`, `usually`, `you may want to` — never `you should`.

### SCREEN 35 † — Professional help (situation)

Delta of 31, reusing Screen 25's trigger list inline at Body rather than Body Large, with a `See when to get help` quiet link.

### SCREEN 36 † — Upload supporting document

Delta of 07, reached from Screen 31. **Delta:** a `--surface-subtle` context strip above the H1: `You told us about a rental dispute in Noida. Adding the document will let Samjo be much more specific.` Header back-chevron returns to the situation summary, not to `/start`.

---

# BATCH 8 — Document Q&A

### SCREEN 37 — Ask about this document

**DESKTOP** Occupies the **evidence pane** (320), not a floating window. Label `Ask about this document` above a textarea, min 88px. Beneath, Caption `--text-muted`: `Ask about something that appears in the document.` Then an `Ask` primary button, full width. One example in `--text-muted` below: `Does this agreement mention when the deposit is returned?`

**MOBILE** Bottom sheet from the `⋯` menu, same geometry as the evidence sheet. Input pinned at the top of the sheet, `Ask` button 52px full width.

**DO NOT** Render chat bubbles, an avatar, a message history stack, a streaming cursor, typing dots, or a send-arrow icon button. The action is a labelled button.

---

### SCREEN 38 † — Question answer with source

Delta of 37. The question echoes at the top in Body Small `--text-muted`. Then, in this order with hairlines:

```
The agreement says the deposit is returned      Body 16/26
within 30 days of the tenancy ending, after
deductions for damage.
──────────────────────────────────────────
Document says
┌──────────────────────────────────────┐
│ "...shall be refunded within thirty   │   Inter 14/22, quote block
│  (30) days of vacating the premises"  │
└──────────────────────────────────────┘
Page 3
──────────────────────────────────────────
How confident is Samjo?   High
[ See it in the document ]
```

Then `Ask something else` as a quiet button. One question, one answer, replaced on the next.

---

### SCREEN 39 † — Information not found

Delta of 38. No quote block, no confidence row.

**COPY** `I couldn't find that information in this document.` (Body 16/500) then `Samjo only answers from what's written in the document you uploaded.` (Body `--text-secondary`), then `Ask something else` primary.

**Refusal variant** — for prediction/advice requests, the canonical line from `AI_SAFETY.md` §3 verbatim, plus a secondary button `Prepare questions for a lawyer`.

**DO NOT** Speculate, offer a partial guess, or suggest what the answer might be.

---

# BATCH 9 — Settings, accessibility, language

### SCREEN 40 — Language selection

**DESKTOP** Popover anchored under the header control. 280px, `--surface`, radius 12, 1px `--border`, `--shadow-medium`, 8px padding. Two 44px rows, each **in its own script**: `English`, `हिन्दी`. Current row has a `--primary` check and `aria-current`. Globe icon 20px in the trigger.

**MOBILE** A section inside the `⋯` bottom sheet, same two rows at 52px.

**A11Y** Trigger name `Language, currently English`. **Never a flag icon.** Switching re-renders without re-running analysis (`PRD.md` §9.8) — so no loading state appears.

---

### SCREEN 41 — Accessibility settings

**DESKTOP** Popover, 320px. Three controls, each with a visible label and a 44px target:
- `Text size` — three options `A` `A` `A` at 100/125/150%, segmented, current marked with a word not just a fill
- `Reduce motion` — toggle, defaulting to the system preference, with Caption `Following your device setting`
- `Read aloud` — a shortcut row opening the audio bar

**MOBILE** Same rows at 52px inside the `⋯` sheet.

**DO NOT** Build a settings page or route. Include a theme toggle — there is no dark mode in this system.

---

### SCREEN 42 — Read aloud active

**DESKTOP** Inline bar at the foot of the reading column, `--surface`, 1px `--border`, radius 12, 56px: a 20px volume icon, `Playing — What you need to do` in Body Small, then `Pause` and `Stop` as quiet buttons **with visible text labels**. A 2px `--primary` progress line along the bottom edge of the bar.

**MOBILE** Docked bar 56px directly above the bottom action bar, full width, same contents.

**COPY** `Listen` → `Pause` / `Resume` / `Stop`. Hindi-voice fallback notice in Caption when needed: `Your device doesn't have a Hindi voice, so read aloud isn't available in Hindi here.`

**A11Y** Never autoplays. State changes announce politely. **Controls are never icon-only.**

---

# BATCH 10 — Error, empty, loading

### SCREEN 43 — Network error

**Transient banner** directly beneath the header, full width, 48px, `--warning-surface`, 1px bottom `--warning` at 30%: 20px alert icon + Body Small `You're offline. Samjo will pick up where you left off when you reconnect.` + a 44px dismiss `✕`. Work in progress is preserved and visibly retained behind it.

**Blocking variant** — the action button goes disabled with a Caption beneath: `This needs a connection. Try again when you're back online.`

---

### SCREEN 44 — Generic error

480 centred, vertically centred. 32px alert-triangle `--text-muted` (**not red** — an unexpected error is not a danger state), H2 `Samjo hit a problem it didn't expect.`, Body `--text-secondary` `Your document is still here, and nothing was lost.`, then `Try again` (primary) and `Go back to your briefing` (secondary).

**DO NOT** Write "Something went wrong". Show an error code as the headline. Add an illustration or a 404 mascot.

---

### SCREEN 45 — Session expired

Modal, 480px, focus trapped, no close `✕` — the only way out is the action.

**COPY** H3 `Your session has ended` → Body `Samjo keeps documents for 24 hours and then deletes them automatically. This one has been removed.` → `Start again` primary, full width.

Framed as **privacy working as intended**, not as a failure. Use a 24px shield icon in `--success`, not a warning icon.

---

### SCREEN 46 † — Low OCR confidence

Delta of 14. A notice directly beneath the context bar, above the urgency banner: `--warning-surface`, radius 12, 16px padding, 20px alert-triangle `--warning`.

**COPY** Body 16/500 `Some text in this document was difficult to read.` → Body `--text-secondary` `Please check important dates, amounts and names against the original document.` → quiet button `See the document`.

**Persistent and not dismissible.** Per `PRD.md` §9.2, OCR-derived facts are never presented silently as certain.

---

### EMPTY STATES — applies wherever a surface has no content

```
[icon 32px, --text-muted]
No document yet.                                H3
Show us a document to start understanding it.   Body, --text-secondary
[ Upload document ]                             primary
```

Centred, 400px max. **No decorative illustration.** Always offer an action.

Variants: `No amounts were found in this document.` · `No dates were found in this document.` · `Samjo didn't find anything to flag here.` — each rendered under its section heading in `--text-muted`, so the heading is **never silently dropped**.
