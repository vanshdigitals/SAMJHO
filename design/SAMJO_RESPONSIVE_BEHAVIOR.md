# SAMJO — Responsive Behaviour

## 1. Breakpoints

| Name | Range | Layout model |
|---|---|---|
| `xs` | 320–389 | Single column, 16px margin, compressed rail |
| `sm` | 390–767 | Single column, 20px margin — **mobile reference** |
| `md` | 768–1023 | Single column centred at 680, tablet chrome |
| `lg` | 1024–1279 | Two panes, evidence as a right drawer |
| `xl` | 1280+ | Three panes — **desktop reference at 1440** |

The jump that matters is **lg → xl**: that is where the evidence pane stops being a drawer and becomes permanent. Everything else is a margin change.

---

## 2. The one invariant

**The reading measure is 68 characters at every single breakpoint.**

At 1440 the briefing column is 640px wide and the text inside it is capped at 68ch (~560px). The remaining space is padding. Widening the window never widens a line of prose. This is the single rule most likely to be broken by a generated layout — check it on every output.

---

## 3. Component transformation map

| Component | xs / sm | md | lg | xl |
|---|---|---|---|---|
| Header | 56px, back + title + `⋯` | 64px, partial controls | 64px, full controls | 64px, full controls |
| Bottom action bar | present | present | absent | absent |
| Briefing sections nav | accordion headers, in-flow | accordion | left pane 240, sticky | left pane 240, sticky |
| Briefing body | full width − 40 | 680 centred | 640 | 640 |
| **Evidence** | **bottom sheet, max 80vh** | **bottom sheet** | **right drawer 360, overlay** | **right pane 320, permanent** |
| Evidence trigger | tap marker → sheet | tap → sheet | tap → drawer slides in | tap → pane updates in place |
| Document viewer | full screen | full screen | overlay 900 | overlay 900 |
| Money rows | stacked label/amount | stacked | two-column | two-column |
| Start panels | stacked | stacked | side by side | side by side |
| Situation questions | one per screen | one per screen | 2–3 visible | 2–3 visible |
| Q&A | bottom sheet | bottom sheet | right drawer | evidence pane |
| Audio controls | docked bar above bottom bar | docked bar | inline under briefing | inline under briefing |
| Language switcher | inside `⋯` sheet | header | header | header |
| Footer | stacked, public only | one row | one row | one row |

---

## 4. Evidence: the three behaviours in detail

Evidence is the identity element, so its responsive story is specified rather than left to the implementer.

**xl (1280+) — permanent pane.** Tapping a marker updates the right pane in place. No overlay, no motion beyond a 120ms opacity change on the content. The briefing does not move. Before first use the pane shows its empty state, so the user learns the affordance exists.

**lg (1024–1279) — overlay drawer.** 360px, slides in from the right over the briefing in 180ms ease-out. Scrim `rgba(19,28,43,0.24)`. The briefing does not reflow — it is covered, not squeezed. Escape closes, focus returns to the marker.

**xs–md (<1024) — bottom sheet.** Slides up, max 80vh, top corners 24px. Body scroll locks, briefing visible behind a `rgba(19,28,43,0.32)` scrim. Swipe-down or Escape closes.

The reason the sheet wins below 1024: a side drawer on a phone covers the item the user just tapped, so they lose their place. A bottom sheet keeps the item visible above the sheet. This is stated in both `UX_FLOWS.md` §5 and `ACCESSIBILITY.md` §4 and is not a preference.

---

## 5. Typography scaling

| Role | xs (360) | sm (390) | md+ | xl |
|---|---|---|---|---|
| Display | 30/36 | 32/38 | 36/42 | 40/44 |
| H1 | 24/30 | 26/32 | 28/34 | 32/38 |
| H2 | 20/26 | 20/26 | 22/28 | 24/30 |
| H3 | 18/24 | 18/24 | 20/26 | 20/26 |
| **Body Large** | **18/28** | **18/28** | **18/28** | **18/28** |
| Body | 16/26 | 16/26 | 16/26 | 16/26 |
| Body Small | 14/22 | 14/22 | 14/22 | 14/22 |
| Caption | 12/18 | 12/18 | 12/18 | 12/18 |

**Body Large never scales.** It is the briefing reading size, set at 18px because the reader is stressed and may be older (`DESIGN_SYSTEM.md` §3). Shrinking it on small screens inverts the intent — the small screen is exactly where the stressed reader is.

Devanagari adds +4px line-height at every row of this table.

---

## 6. Spacing scaling

| Token | xs | sm | md | lg / xl |
|---|---|---|---|---|
| Page margin | 16 | 20 | 24 | auto (container) |
| Section gap (briefing) | 32 | 32 | 40 | 48 |
| Between items on the rail | 24 | 24 | 28 | 32 |
| Rail inset from content edge | 8 | 12 | 12 | 12 |
| Item indent from rail | 24 | 28 | 32 | 32 |
| Card padding | 20 | 24 | 28 | 32 |
| Above/below hairline | 24 | 24 | 32 | 32 |

---

## 7. What must not change across breakpoints

- The **order** of briefing sections. Fixed, not user-configurable (`UX_FLOWS.md` §4).
- The **three evidence blocks** and their order.
- The words in the microcopy table. "Show us the document" is the same string at 360 and 1440.
- Urgency treatment: icon + word + colour at every size.
- 44px minimum targets at every size, including desktop.
- Every token value. Responsive changes layout, never colour or radius.

---

## 8. Orientation and zoom

**Landscape phone (844×390):** the briefing keeps the single-column layout and the bottom bar; the evidence sheet caps at 90vh. No two-pane layout is introduced below 1024 logical px regardless of orientation.

**200% zoom at 360px** (effective 180px): content reflows to a single column with no horizontal scroll and no clipping. The rail compresses to a 4px inset; markers keep their 44px targets, which is why the target is decoupled from the 8px dot. Tested as a release gate (`ACCESSIBILITY.md` §5).

**Tablet 768–1023 portrait:** treated as a wide phone, not a narrow desktop. Single column centred at 680, evidence as a bottom sheet. Introducing a cramped two-pane layout here is the most common responsive mistake in this product and is explicitly rejected — `DESKTOP_UI_SPEC` §6 only permits panes at 1024+.

---

## 9. Image and media behaviour

Document page renders scale to fit the column width, capped at 900px. Never full-bleed. Pinch-zoom enabled in the document viewer only, and `user-scalable=no` is never set anywhere in the product.

---

## 10. Responsive QA checklist

Run at 360, 390, 430, 768, 1024, 1280, 1440 for every generated screen:

1. No horizontal scroll at any width
2. Measure ≤68ch in the briefing at every width
3. Body Large is 18px at every width
4. All targets ≥44px
5. Evidence uses the correct form for the breakpoint (sheet / drawer / pane)
6. Header controls do not collide or wrap
7. Urgency banner keeps icon + word + date without a mid-number wrap
8. `₹` amounts never wrap
9. Bottom bar present below 1024, absent above
10. Nothing clipped at 200% zoom
