# SAMJO — Accessibility, as a UI specification

Target: **WCAG 2.2 AA on every route** (`ACCESSIBILITY.md`). This file turns those commitments into things a designer can draw and a reviewer can check on a Stitch frame.

`ACCESSIBILITY.md` §6 names the core tension: *"Source spans are precise, and precision is visually dense."* The resolution is structural — the briefing stays sparse and scannable, and full quoted text with page references lives one deliberate tap away in the evidence surface.

---

## 1. Contrast — drawn values

All measured in `DESIGN_SYSTEM.md` §2. Do not alter any value when generating.

| Foreground | Background | Ratio | Use |
|---|---|---|---|
| `#131C2B` | `#F6F3EE` | 14.2:1 | body, headings |
| `#49566A` | `#F6F3EE` | 7.4:1 | secondary prose |
| `#6E7A8A` | `#F6F3EE` | 4.7:1 | captions, metadata — **AA body only, never below 14px** |
| `#1B4DB1` | `#FFFFFF` | 7.1:1 | links, primary text |
| `#92600A` | `#FBF0DC` | 5.6:1 | warning |
| `#A32219` | `#FAE9E7` | 6.8:1 | danger |
| `#1C6244` | `#E6F1EB` | 6.4:1 | success |

Non-text contrast ≥3:1: `--border-strong` `#C4BBAE` on `--surface` = 2.1:1, so it is **never the sole indicator** of an interactive boundary. Input borders use `--border-strong` plus a visible label; the rail is decorative structure whose interactive element is the marker, which is `--primary` at 7.1:1.

---

## 2. No colour-only meaning — the three places it could go wrong

| Signal | Wrong | Right |
|---|---|---|
| Urgency | A red border, an amber dot | **Icon + the word** ("Time-sensitive" / "Urgent") + colour |
| Verification | A hollow marker alone | **Hollow marker + the word "Verify"** |
| Confidence | A coloured bar or dot | **The word** High / Medium / Low |
| Errors | Red field border only | **Border + icon + message text** below |
| Completed stage | Green fill only | **Check icon + dimmed label** |

A reviewer should be able to greyscale any frame and lose no information. Make that the acceptance test.

---

## 3. Focus

- Ring: **2px `#1B4DB1`, 2px offset**, following the element's radius. Never suppressed, never `outline: none` without a replacement.
- On `--primary` fills the ring needs separation: add a 2px `--surface` gap between the fill and the ring.
- Focus order follows reading order. No positive `tabindex` anywhere.
- **Skip link** is the first focusable element on every screen — visually hidden, then a solid `--primary` chip with white text at top-left on focus, reading "Skip to main content".

**Focus containment** for the evidence sheet, document viewer, and every modal: focus traps inside, **Escape closes**, and focus **returns to the element that opened it** (`ACCESSIBILITY.md` §1). For the evidence surface that is specifically the rail marker that was tapped — draw the marker's active state so the return is visible.

---

## 4. Touch targets

**44×44 minimum, everywhere, desktop included.**

The hardest case is the rail marker: an **8px dot inside a 44px invisible hit area**. The visual and the target are deliberately decoupled — that is the whole reason the dot can stay 8px without failing 2.5.8. Draw the 44px box as a guide layer in every Stitch frame that contains a rail.

Adjacent targets keep ≥8px between them. Accordion headers are 56px. Buttons are 44 (md) or 52 (lg) — `sm 36px` is desktop-pointer only and never appears on a touch frame.

---

## 5. Headings and landmarks

- **One `h1` per screen.** Landing = "Samjo" wordmark area; upload = "Show us the document"; briefing = the document title in the context bar.
- Briefing section headings are `h2`. Item titles are `h3`. Never skip a level to get a size — size comes from the type scale, not the tag.
- Landmarks: `header` / `nav` (sections jump list) / `main` / `aside` (evidence pane) / `footer`.
- The sections jump list is a `nav` with an accessible name, "Briefing sections".

---

## 6. Names for everything that is not text

| Element | Accessible name |
|---|---|
| Rail marker | `Where this comes from: {item title}` |
| Overflow `⋯` | `More options` |
| Back chevron | `Back to {destination}` |
| Close `✕` | `Close {surface name}` |
| Language switcher | `Language, currently English` |
| Text size `A` `A` | `Decrease text size` / `Increase text size` |
| Listen | `Listen to this briefing` |
| Remove file | `Remove {filename}` |
| Zoom | `Zoom in` / `Zoom out` |
| Page indicator | `Page 4 of 12` |

Icon-only buttons are permitted **only** where the name above is attached and the meaning is conventional (close, back, overflow, zoom). Read-aloud controls are **never** icon-only — they carry visible text labels.

---

## 7. Live regions

| Event | Politeness | Announcement |
|---|---|---|
| Pipeline stage change | polite | the stage name, e.g. "Finding what matters" |
| Analysis complete | polite, **once** | "Your briefing is ready." |
| Evidence sheet opens | — | handled by focus move, not an announcement |
| Read-aloud state | polite | "Playing" / "Paused" / "Stopped" |
| Toast | polite | the toast text |
| Validation error | assertive | the error message |
| Network lost / restored | polite | the banner text |

A toast is **never the only channel** for important information (`DESIGN_SYSTEM.md` §6).

---

## 8. Forms

- Label **always visible above the field**. Placeholder is never the label.
- Error message sits below the field, wired by `aria-describedby`, with an icon, and never relies on colour.
- Helper text also via `aria-describedby`.
- Required fields marked with the word "Required", not an asterisk alone.
- **WCAG 2.2 3.3.7 Redundant entry:** nothing already provided is asked for twice within a flow. In the situation flow, answers already given are shown as a review summary before submission rather than re-asked.
- **WCAG 2.2 3.2.6 Consistent help:** the help affordance sits in the same header position on every screen.

---

## 9. Language and script

- `lang="en"` or `lang="hi"` on the document, switched with the interface language.
- Any element switching script carries its own `lang` — critically, **a Hindi interface still renders the English source quote inside `lang="en"`**, so a screen reader does not attempt Devanagari pronunciation of English legal text.
- **The quoted evidence is never translated.** Only `Samjo interprets` is. This is a correctness rule first (`AI_SCHEMAS.md`: the quote is verbatim and verified) and an accessibility rule second.
- Devanagari: +4px line-height at every size, and never below 16px.
- Language switcher labels appear **in their own script**: `English`, `हिन्दी`.
- Amounts and dates render from the deterministic extractor, not the translation (`PRD.md` §11) — so `₹15,000` is identical in both languages.

---

## 10. Read aloud

Four controls, each with a **visible text label** and a 44px target: `Listen` → `Pause` / `Resume` / `Stop`. **Never autoplays.** State changes announce politely. Placed near the content it reads — the foot of the reading column on desktop, a docked bar on mobile — not buried in settings.

Hindi uses a Hindi voice where the device provides one; where it does not, show a notice rather than reading Devanagari with an English voice (`ACCESSIBILITY.md` §1).

---

## 11. Motion

`prefers-reduced-motion: reduce` removes the briefing reveal sequence and **all transforms**, keeping only opacity changes under 100ms. Sheets and drawers appear without sliding. Skeletons stop pulsing and hold a static fill. This is asserted in CI (`ACCESSIBILITY.md` §5), so a design that depends on motion to convey state is a defect.

---

## 12. Zoom and reflow

Text to **200%** with no loss of content or function, and the full reflow case is **200% at 360px**. At that size: single column, rail inset compresses to 4px, markers keep 44px targets, no horizontal scroll, nothing clipped. `user-scalable=no` is never set.

---

## 13. Per-frame accessibility review checklist

Apply to every Stitch output before accepting it:

1. Greyscale it — is any information lost?
2. Is there exactly one `h1`, with no skipped heading levels?
3. Does every interactive element have a ≥44px target, including rail markers?
4. Is the focus ring drawn, at 2px with 2px offset?
5. Is every label visible, with no placeholder-as-label?
6. Does every error name what happened **and** what to do?
7. Is urgency icon + word + colour?
8. Is confidence a word, and verification a word plus a shape?
9. Is the source quote in `lang="en"` even on a Hindi frame?
10. Are read-aloud controls text-labelled, not icon-only?
11. Is the skip link present as the first focusable element?
12. Does the frame still work with all motion removed?
