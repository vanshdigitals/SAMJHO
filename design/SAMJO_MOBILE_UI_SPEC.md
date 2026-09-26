# SAMJO — Mobile UI Specification

Primary 390×844. Must hold at 360×800 and 430×932. Margin 20 at 390, 16 at 360.

**Mobile is primary.** `ACCESSIBILITY.md` §4 names 360/390/430 as the primary breakpoints. Every screen here is intentionally redesigned, never a shrunken desktop. Three-pane layouts do not exist on mobile in any form.

---

## 1. Chrome

**Header** 56px, `--surface`, 1px bottom `--border`, sticky.

```
┌──────────────────────────────────┐
│ ‹   Residential Rental Agree…  ⋯ │
└──────────────────────────────────┘
  44px      truncate 1 line      44px
```

Back chevron left (44px target) or the wordmark "Samjo" on root screens. Title Body 16/500, single line, ellipsis. Overflow `⋯` opens a bottom sheet holding: Language, Text size, Listen, Ask about this document, Export, Delete.

**No bottom tab bar.** The user is completing a task, not exploring a dashboard (`UX_FLOWS.md` §1 reasoning, brief §36). A persistent bottom *action* bar is used instead, and only where it earns its place.

**Bottom action bar** — 72px + safe-area inset, `--surface`, 1px top `--border`, `--shadow-subtle`. One full-width primary button. Appears on: upload, briefing ("What to do next"), situation questions ("Continue"), export. Absent everywhere else.

---

## 2. Landing (Screen 01)

Single column, 20px margins, left-aligned throughout — never centred.

```
├─ 48px
│  Samjo                        Display 32/38, 500
│  Samajh aane tak.             H3 20/26, 500, --text-secondary
├─ 28px
│  Legal documents ko           H1 26/32, 500
│  samajhna mushkil nahi
│  hona chahiye.
├─ 16px
│  Upload a document or tell    Body Large 18/28, --text-secondary
│  us what happened. Samjo
│  helps you understand what
│  matters, what's urgent,
│  and what to do next.
├─ 28px
│  ┌────────────────────────┐
│  │  I have a document     │   primary, 52px, full width
│  └────────────────────────┘
│  ┌────────────────────────┐
│  │  Something happened    │   secondary, 52px, full width, 12px gap
│  └────────────────────────┘
├─ 20px
│  Source-grounded ·            Body Small, --text-muted, wraps to
│  Private by design ·          2 lines naturally
│  Hindi + English · Read aloud
├─ 48px
```

Below: the same proof fragment as desktop, stacked — heading, two sentences, then the briefing sample at full column width inside a `--surface` panel with one open source marker. Then the limits band on `--surface-subtle`, 32px padding.

At 360 the Display drops to 30/36 and the two CTAs keep 52px height — they are never shortened.

---

## 3. Choose starting point (Screen 06)

Two stacked panels, full width, 16px gap, `--surface`, 1px `--border`, radius 16, 24px padding. Each ≥140px tall. Icon 28px, H3 title, Body Small description, then a full-width button. Whole panel tappable.

Vertically centred if it fits; top-aligned with 32px offset if it does not.

---

## 4. Upload (Screen 07)

```
├─ H1 26/32  Show us the document
├─ Body Large  Upload a PDF, Word file, or a clear photo.
├─ 24px
│  ┌────────────────────────────┐
│  │                            │   dropzone 180px
│  │        [upload icon]       │   2px dashed --border-strong
│  │   Choose a file from       │   radius 16
│  │       your phone           │
│  └────────────────────────────┘
├─ 12px
│  ┌────────────────────────────┐
│  │  📷  Take a photo          │   secondary, 52px, full width
│  └────────────────────────────┘
├─ 16px
│  🛡 Your document is processed securely and temporary
│     files are deleted after extraction.   Body Small
├─ 12px
│  PDF, Word, JPG, PNG · Up to 10 MB · Deleted after 24 hours
│     Caption, --text-muted, wraps
```

"Take a photo" is a **first-class sibling**, not hidden behind the dropzone — a phone photo of a notice is the single most common real input (`PRD.md` §9.2 acceptance criterion). Drag-and-drop is irrelevant here and is not shown.

---

## 5. Processing (Screen 10–12)

Full-height, content starting 25% down. Stage list left-aligned, 16px rows, full width. Same five real stage names, same `✓ / ▸ / dim` treatment as desktop, no percentage. Filename above in Body Small. "Cancel" quiet button at the bottom, above the safe area.

---

## 6. Briefing (Screen 14) — mobile

Single column. Evidence opens as a **bottom sheet over the briefing**, so the user never loses their place (`UX_FLOWS.md` §5, `ACCESSIBILITY.md` §4).

```
┌──────────────────────────────────┐
│ ‹  Residential Rental Agree…  ⋯  │  header 56
├──────────────────────────────────┤
│ DEMO · Rental agreement · Hindi  │  context strip 44, Body Small
├──────────────────────────────────┤
│ ⚠ Time-sensitive                 │  urgency banner — HIGH/CRITICAL only
│   Response due 30 September 2026 │  --warning-surface, radius 12
│   [ See what to do ]             │
├──────────────────────────────────┤
│                                  │
│ What this is                     │  H2 20/26 — ALWAYS OPEN, no chevron
│ This is a rental agreement for   │  Body Large 18/28 — never shrinks
│ a flat in Noida. It runs 11      │
│ months from 1 April 2026.        │
│ ──────────────────────────────── │  hairline, 32px above and below
│                                  │
│ What you need to do          ▲   │  accordion — OPEN by default
│ │                                │
│ ├─● Pay ₹25,000 deposit          │  H3, rail + marker
│ │   before you move in.          │  Body Large
│ │                                │
│ ├─○ Give 30 days notice   Verify │  hollow marker + word
│ │   before leaving.              │
│ ──────────────────────────────── │
│ Watch out                    ▼   │  collapsed
│ ──────────────────────────────── │
│ Important details            ▼   │
│ ──────────────────────────────── │
│ Dates that matter            ▼   │
│ ──────────────────────────────── │
│ Questions to ask             ▼   │
│                                  │
├──────────────────────────────────┤
│  ♪ Listen                        │  audio bar 56, appears on scroll stop
├──────────────────────────────────┤
│  ┌────────────────────────────┐  │
│  │   What to do next          │  │  bottom action bar 72 + safe area
│  └────────────────────────────┘  │
└──────────────────────────────────┘
```

**Accordion rules:** first two sections expanded (`DESIGN_SYSTEM.md` §6). "What this is" has no chevron — it is always visible. Headers 56px with trailing chevron, `aria-expanded`. Expanding does not change fill colour.

**Rail on mobile:** 1px `--border-strong`, inset 12px from the 20px margin (so 32px from the screen edge). Markers centred on it with 44×44 hit areas. Item text indents 28px from the rail. At 360 the inset drops to 8px and the indent to 24px.

---

## 7. Evidence bottom sheet (Screen 21) — mobile

Slides up from the bottom. Height: content-driven, **max 80vh**, min 40vh. Top corners `--radius-xl` 24px — the only place that radius is used. `--surface`, `--shadow-medium`. A 36×4 `--border-strong` grab handle, centred, 12px from the top.

Backdrop `rgba(19,28,43,0.32)` — flat, no blur, no gradient.

Content order is identical to desktop and never reordered:

```
      ────                              grab handle
 Where this comes from            ✕     Label + 44px close
 ─────────────────────────────────────
 Document says
 ┌───────────────────────────────────┐
 │ "The Tenant shall deposit a sum   │  Inter 14/22
 │  of Rs. 25,000/- as interest-free │  --surface-subtle, radius 8
 │  security deposit."               │  3px --border-strong left edge
 └───────────────────────────────────┘
 Page 1                                 Caption
 ─────────────────────────────────────
 Samjo interprets
 This is refundable, but the agreement
 sets conditions for deductions.        Body 16/26
 ─────────────────────────────────────
 How confident is Samjo?        High
 ─────────────────────────────────────
 ┌───────────────────────────────────┐
 │    See it in the document         │  secondary, 52px, full width
 └───────────────────────────────────┘
```

**Behaviour:** focus traps inside, Escape and swipe-down close, focus returns to the marker that opened it (`ACCESSIBILITY.md` §1). Body scroll locks. The briefing stays visible behind the backdrop — that is the whole reason a sheet is used instead of a route.

---

## 8. Money (Screen 18) mobile

Stacked pairs, not a two-column table — a table collapses badly at 360.

```
│
●  Monthly rent              Body, --text-secondary
   ₹15,000                   Inter 22/500 tabular, --text-primary
   ────────────────────────
●  Security deposit
   ₹25,000
```

Amount on its own line beneath the label, larger than the label. Right-aligning currency against a label at 360px causes ragged, unscannable columns.

---

## 9. Dates that matter (Screen 19) mobile

Identical structure to desktop — the rail already is the timeline. Dates Inter 20/500. Every entry carries "Verify". Relative dates ("within 30 days of receipt") render as written, with the resolved date beneath in `--text-muted` Caption.

---

## 10. Situation flow (Screens 29–34) mobile

**One focused question per screen.** Never a scrolling form.

```
├─ Question 2 of 4            Body Small, --text-muted
├─ 24px
│  When did this happen?      H1 26/32
├─ 12px
│  An approximate date is fine.   Body, --text-secondary
├─ 24px
│  [ input / option list ]     52px rows, radius 8
│
│  … fills remaining height
├──────────────────────────────
│  [ Continue ]                bottom bar, primary, full width
```

Back is the header chevron. Options are 52px rows with a 1px `--border` divider, selected state = `--primary-subtle` fill + `--primary` check. **No chat bubbles, no typing indicator, no avatar.**

Situation summary reuses the briefing accordion **with no evidence rail and no markers** — nothing to ground against, and that absence is visible and deliberate.

---

## 11. Ask about this document (Screen 37) mobile

Opens as a bottom sheet from the `⋯` menu, same geometry as the evidence sheet. Input pinned at the top of the sheet with a visible label. Answer below: prose → quote block → page → confidence. One question, one answer, replaced on the next.

**Not a chat.** No bubble stack, no history scroll, no avatars, no send-arrow icon button — the action is a labelled "Ask" button.

---

## 12. Touch and gesture rules

| Rule | Value |
|---|---|
| Minimum target | 44×44 everywhere, including 8px rail markers |
| Spacing between adjacent targets | ≥8px |
| Thumb zone | Primary actions in the bottom third |
| Destructive actions | Never in the thumb zone — Delete lives in the `⋯` sheet and requires typed-free double confirmation |
| Swipe | Only to dismiss a bottom sheet. No swipe-to-delete, no carousels, no horizontal scroll anywhere |
| Pull to refresh | Not used — it would re-trigger analysis |
| Safe areas | Respected top and bottom; the bottom bar adds `env(safe-area-inset-bottom)` |

---

## 13. 360px survival checklist

Every screen must pass all of these at 360×800:

- Both landing CTAs full width at 52px, text on one line
- "Residential Rental Agreement" truncates cleanly in the header
- Body Large stays **18px** — it never drops to 16
- Rail + 24px indent still leaves ≥52 characters of measure
- `₹15,000` never wraps
- Evidence sheet quote block holds ≥30 characters per line
- Accordion headers stay 56px with the chevron visible
- Urgency banner holds icon + word + date without the date wrapping mid-number
- Bottom bar button text on one line
- At 200% zoom nothing is clipped and no horizontal scroll appears
