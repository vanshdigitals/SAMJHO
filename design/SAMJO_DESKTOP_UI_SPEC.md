# SAMJO — Desktop UI Specification

Primary 1440×900. Must hold at 1280×800. Container 1200 centred at 1440, 1120 at 1280.

**Governing rule:** desktop gets more *whitespace*, not more *text*. The reading column stays at 68 characters no matter how wide the window is. Desktop is not a stretched phone and it is not a dashboard.

---

## 1. Chrome

**Header** 64px, `--surface`, 1px bottom `--border`, sticky. Content in the 1200 container.

```
┌────────────────────────────────────────────────────────────────┐
│ Samjo                          English ▾   A  A   ♪ Listen   ⋯ │
└────────────────────────────────────────────────────────────────┘
```

Wordmark DM Sans 20/500 `--text-primary`, left. Controls right-aligned, 24px apart, each ≥44px. Inside a document the `⋯` menu holds Export, Delete, Ask about this document.

**Footer** public pages only: one 72px row, centred, `--text-muted` Body Small — `Privacy · Safety · Accessibility` then the disclaimer line. Never on task screens.

---

## 2. Landing (Screen 01)

Container 1200, but the hero column is capped at **680px and left-aligned**, not centred — centred hero text is the generic-SaaS default and reads as a template.

```
├─ 96px top space
│
│  Samjo                                    Display 40/44, 500
│  Samajh aane tak.                         H2 24/30, 500, --text-secondary
│
│  ─ 32px ─
│
│  Legal documents ko samajhna              H1 32/38, 500, max 16ch/line
│  mushkil nahi hona chahiye.
│
│  ─ 20px ─
│
│  Upload a document or tell us what        Body Large 18/28, 400,
│  happened. Samjo helps you understand     --text-secondary, 68ch
│  what matters, what's urgent, and
│  what to do next.
│
│  ─ 32px ─
│
│  [ I have a document ]  [ Something happened ]
│    primary, lg 52px       secondary, lg 52px
│
│  ─ 20px ─
│
│  Source-grounded · Private by design · Hindi + English · Read aloud
│    Body Small, --text-muted, middot separators, no icons, no boxes
│
├─ 96px
```

**Below the fold — one proof section, not three feature cards.** A real briefing fragment rendered at 60% scale inside a `--surface` panel, radius 16, 1px `--border`, with a visible evidence rail and one open source marker. Left of it, 400px: heading "Every claim points back to your document" (H2) and two sentences. The differentiator has to be *seen*, not claimed.

Then the limits, stated plainly on `--surface-subtle`, full-bleed band, 64px padding: "What Samjo does not do" (H2) followed by three plain lines — no cards, no icons. Not buried in the footer.

**Banned on this page:** invented statistics, user counts, testimonials, logo walls, gradient hero, animated blobs, "revolutionising law" copy, any claim Samjo does what a lawyer does.

---

## 3. Choose starting point (Screen 06)

Two panels side by side, 560px each, 32px gutter, vertically centred in the viewport. `--surface`, 1px `--border`, radius 16, 40px padding, **no shadow**.

| Left | Right |
|---|---|
| document icon 32px `--primary` | question icon 32px `--primary` |
| "I have a document" H2 | "Something happened" H2 |
| "A notice, an agreement, or anything you've been asked to sign." Body, `--text-secondary` | "No document yet. Tell us what happened and Samjo will help you think it through." Body, `--text-secondary` |
| primary button, full width | secondary button, full width |

Hover: border `--border-strong`. Focus: 2px ring on the whole panel. Whole panel is one click target.

---

## 4. Upload (Screen 07)

Single column, 680px centred. H1 "Show us the document". Body Large helper "Upload a PDF, Word file, or a clear photo." Then the dropzone at 240px tall, full column width.

Beneath, a 3-column metadata row, Body Small `--text-muted`: `PDF, Word, JPG, PNG` · `Up to 10 MB, 30 pages` · `Deleted automatically after 24 hours`.

Privacy line directly under the dropzone, Body Small `--text-secondary` with a 16px shield icon: "Your document is processed securely and temporary files are deleted after extraction."

---

## 5. Processing (Screen 10–12)

680px centred, vertically centred in viewport. Stage list, left-aligned, 20px between rows.

```
✓  Reading your document              --success check, --text-muted label
✓  Working out what this is
▸  Finding what matters               Body 16/500 --text-primary + 2px
   ────────────────────                indeterminate bar, --primary
   Checking dates and amounts         --text-muted
   Preparing your briefing            --text-muted
```

No percentage, ever. Above the list: filename + page count, Body Small `--text-muted`. Below: the privacy line, and a quiet "Cancel" button.

Stage changes announce through a polite live region.

---

## 6. Briefing workspace (Screen 14) — the most important layout

At **≥1280**: three panes. At **1024–1279**: two panes, evidence becomes a right drawer. At **<1024**: single column, mobile spec applies.

```
┌──────────────────────────────────────────────────────────────────────┐
│ HEADER 64                                                            │
├──────────────────────────────────────────────────────────────────────┤
│ DOCUMENT CONTEXT BAR 72  — --surface, 1px bottom border              │
│  Residential Rental Agreement          DEMO   Hindi/English  Page 4  │
│  H3 20/500                             chip   Body Small --text-muted│
├────────────┬─────────────────────────────────┬───────────────────────┤
│ SECTIONS   │  BRIEFING                       │  EVIDENCE             │
│ 240        │  640 (text capped 68ch)         │  320                  │
│ sticky     │  scrolls                        │  sticky               │
│            │                                 │                       │
│ What this  │  [urgency banner if HIGH/CRIT]  │  Where this comes     │
│  is        │                                 │  from                 │
│ What you   │  ## What this is          H2    │  ─────────────        │
│  need to   │  2–4 sentences.  Body Large     │  Document says        │
│  do    ●   │  ─── hairline ───               │  "The Tenant shall…"  │
│ Watch out  │                                 │  Page 1               │
│ Important  │  ## What you need to do   H2    │  ─────────────        │
│  details   │  │                              │  Samjo interprets     │
│ Dates that │  ├─● Pay ₹25,000 deposit   H3   │  This is refundable…  │
│  matter    │  │   before you move in.        │  ─────────────        │
│ Questions  │  │   Body Large, 68ch           │  How confident?  High │
│  to ask    │  │                              │                       │
│            │  ├─○ Give 30 days notice  Verify│  [See it in the       │
│ ────────   │  │   Body Large                 │   document]           │
│ Ask about  │  │                              │                       │
│  this doc  │  ─── hairline ───               │                       │
│            │  ## Watch out             H2    │                       │
│            │  …                              │                       │
├────────────┴─────────────────────────────────┴───────────────────────┤
│ What to do next — persistent primary action, --surface, top border   │
└──────────────────────────────────────────────────────────────────────┘
```

**Sections pane (240):** a jump list, not navigation chrome. Body 16/400 `--text-secondary`, 44px rows, 12px left padding. Active row: `--text-primary` 500 + 2px `--primary` left bar. Scroll-spy. No icons. No counts. **"Evidence" never appears here** — evidence is attached to items, never a section (`UX_FLOWS.md` §4).

**Briefing pane (640):** the reading surface. Sections separated by 48px space and a 1px `--border` hairline — **never by cards**. Section heading H2, then items hanging off the evidence rail. Prose at Body Large 18/28, capped 68ch, which lands around 560px of the 640.

**Evidence rail geometry:** 1px `--border-strong` vertical rule, inset 12px from the content's left edge, running the full height of each item group. Markers sit centred on the rule. Item text indents 32px from the rule.

**Evidence pane (320):** sticky, `--surface`, 1px left `--border`, 24px padding. Empty state before any marker is tapped: a document icon 32px `--text-muted`, then "Tap any point on the line to see exactly where it comes from in your document." Body Small, centred, 40px top padding.

**Section order is fixed and not user-configurable** (`UX_FLOWS.md` §4): urgency (HIGH/CRITICAL only) → what this is → what you need to do → watch out → important details → dates that matter → questions to ask → what to do next.

---

## 7. Money section (Screen 18) desktop

Not a chart, not a table with borders. A definition list, two columns, hairline between rows.

```
Monthly rent                                          ₹15,000
  Body Large, --text-primary          Inter 20/500 tabular, right-aligned
  ──────────────────────────────────────────────────────────
Security deposit                                      ₹25,000
  ──────────────────────────────────────────────────────────
Late payment fee                                       ₹1,000
```

Each row carries its own rail marker on the left. Amounts in **Inter tabular numerals** so the rupee figures align. `₹` is part of the figure, same weight. No charts unless they genuinely improve understanding — for three amounts they do not.

---

## 8. Dates that matter (Screen 19) desktop

Vertical timeline on the rail itself — the rail already exists, so the timeline reuses it rather than adding a second vertical line.

```
│
●  Today                          Caption --text-muted
│  Document received              Body Large
│
●  30 September 2026              H3 20/500 --text-primary
│  Response deadline              Body Large
│  Verify  ← always, per AI_SCHEMAS: every deadline needs verification
│
●  15 October 2026
   Notice period ends
```

Dates in Inter 20/500. Every deadline carries the "Verify" word — `AI_SCHEMAS.md` sets `needs_verification = True` on every `Deadline` regardless of confidence, because a wrong date is the highest-harm error the product can make.

---

## 9. Professional help (Screen 25) desktop

680px centred. H1 "When to get professional help". Then a plain list of triggers — urgent deadline, eviction notice, court or summons document, conflicting clauses, high financial impact, anything involving a minor — each one line with a 20px `alert-triangle` in `--warning`, 16px gap, no cards.

Then pathways on `--surface-subtle`, radius 16, 32px padding. **Curated entries only** (`AI_SCHEMAS.md`: `pathways` is "curated, never model-generated"). **Never invent a phone number, a firm, or a lawyer's name.**

Tab strip above: `When to get help` | `Prepare for your lawyer`. Screen 26 is the second tab, and is the **one place numbered 01/02/03 markers are permitted**, because it genuinely is a sequence.

---

## 10. Document viewer (Screens 22–23) desktop

Full-screen overlay, `--background`, `--shadow-medium`. Header 64px: back chevron, document title, page `4 / 12`, zoom −/+, close. Page canvas centred, max 900px, white, 1px `--border`, `--shadow-subtle`.

**Source highlight:** `--warning-surface` fill behind the matched span, 2px `--warning` left edge, scroll-to-span on open with a single 300ms ease. A floating chip above the highlight: "This is the part Samjo referred to" + a "Back to briefing" quiet button. Highlight persists while the viewer is open.

---

## 11. Situation flow (Screens 29–31) desktop

Compact guided form, 680px centred — **not a chatbot, no bubbles, no avatars**. Two to three questions visible at a time, each with a visible label and generous field. Progress as `Question 2 of 4` in Body Small `--text-muted`, not a progress bar.

Situation summary (31) reuses the briefing reading surface **without an evidence rail** — there is no document to ground against, and that absence is deliberate and must be visible. `UX_FLOWS.md` §3: situation output is deliberately thinner, and never produces obligations, deadlines or money items.

---

## 12. Ask about this document (Screen 37) desktop

Occupies the **evidence pane**, not a floating chat window. Single input at the top of the pane, label "Ask about this document", helper "Ask about something that appears in the document." Answer renders below as: answer prose (Body) → `Document says` quote block → `Page N` → confidence.

**No chat bubbles. No avatars. No message history stack. No streaming cursor.** One question, one grounded answer, replaced on the next question.
