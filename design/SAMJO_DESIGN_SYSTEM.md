# SAMJO — Design System (Stitch-facing)

> **Canonical source: `../DESIGN_SYSTEM.md`.** That file already defines the tokens, and they are correct. Nothing here overrides it. This document adds only what Stitch needs that the canonical file leaves to implementation: component state matrices, exact pixel metrics, and generation instructions.
>
> If the two ever disagree, the canonical file wins.

---

## 1. Tokens — verbatim from canonical

```css
:root {
  /* surfaces */
  --background:      #F6F3EE;
  --surface:         #FFFFFF;
  --surface-subtle:  #EEEAE2;

  /* text */
  --text-primary:    #131C2B;
  --text-secondary:  #49566A;
  --text-muted:      #6E7A8A;

  /* structure */
  --border:          #DDD6CC;
  --border-strong:   #C4BBAE;

  /* action */
  --primary:         #1B4DB1;
  --primary-hover:   #163F92;
  --primary-subtle:  #E8EEF9;

  /* semantic */
  --warning:         #92600A;  --warning-surface: #FBF0DC;
  --danger:          #A32219;  --danger-surface:  #FAE9E7;
  --success:         #1C6244;  --success-surface: #E6F1EB;

  /* focus */
  --focus-ring:      #1B4DB1;

  /* spacing */
  --space-1:4px;  --space-2:8px;  --space-3:12px; --space-4:16px;
  --space-5:20px; --space-6:24px; --space-8:32px; --space-10:40px;
  --space-12:48px;--space-16:64px;

  /* radius */
  --radius-sm:8px; --radius-md:12px; --radius-lg:16px; --radius-xl:24px;

  /* elevation */
  --shadow-subtle: 0 1px 2px rgba(19,28,43,0.06);
  --shadow-medium: 0 8px 24px rgba(19,28,43,0.10);
}
```

Measured contrast (canonical §2): text-primary on background **14.2:1**, text-secondary **7.4:1**, text-muted **4.7:1**, primary on white **7.1:1**, warning on warning-surface **5.6:1**, danger on danger-surface **6.8:1**, success on success-surface **6.4:1**. All clear AA for body text. Do not darken or lighten any value when generating.

---

## 2. Type scale

| Role | Family | px / line-height | Weight | Use |
|---|---|---|---|---|
| Display | DM Sans | 40 / 44 | 500 | landing hero only |
| H1 | DM Sans | 32 / 38 | 500 | page title |
| H2 | DM Sans | 24 / 30 | 500 | briefing section heading |
| H3 | DM Sans | 20 / 26 | 500 | item title |
| Body Large | DM Sans | 18 / 28 | 400 | briefing prose — default reading size |
| Body | DM Sans | 16 / 26 | 400 | interface text |
| Body Small | Inter | 14 / 22 | 400 | evidence text, metadata |
| Label | DM Sans | 14 / 20 | 500 | form labels, buttons |
| Caption | Inter | 12 / 18 | 400 | confidence, page references |

Weights **400 / 500 / 600 only — never 700.** Sentence case throughout. Measure capped at **68ch** at every breakpoint. Devanagari: **+4px line-height** at every size, and set `lang="hi"` on the element.

Mobile deltas: Display drops to 32/38, H1 to 26/32, H2 to 20/26. **Body Large stays 18px on mobile** — it is the reading size and must not shrink.

---

## 3. Grid

| Viewport | Container | Columns | Gutter | Margin |
|---|---|---|---|---|
| 1440 | 1200 centred | 12 | 24 | auto |
| 1280 | 1120 centred | 12 | 24 | 80 |
| 1024 | 960 centred | 12 | 20 | 32 |
| 768 | fluid | 8 | 16 | 24 |
| 390 | fluid | 4 | 16 | 20 |
| 360 | fluid | 4 | 12 | 16 |

Briefing three-pane split at ≥1280: **sections 240 / briefing 640 (68ch cap) / evidence 320**, gutters 32. At 1024–1279 the evidence rail becomes a right drawer. Below 1024, single column.

---

## 4. Component state matrix

Every reusable component defines all nine states. Generate them as a visible sheet in Batch 1.

### Button

| State | Primary | Secondary | Quiet | Danger |
|---|---|---|---|---|
| Default | `#1B4DB1` fill, white text | white fill, 1px `#C4BBAE`, ink text | transparent, `#1B4DB1` text | `#A32219` fill, white text |
| Hover | `#163F92` | `#F6F3EE` fill | `#E8EEF9` fill | darken 8% |
| Focus | + 2px `#1B4DB1` ring, 2px offset | same | same | same |
| Pressed | `#163F92`, scale 0.99 | `#EEEAE2` | `#E8EEF9` | darken 12% |
| Disabled | `#C4BBAE` fill, `#FFFFFF` text, cursor not-allowed | `#DDD6CC` border, `#6E7A8A` text | `#6E7A8A` text | as primary |
| Loading | spinner replaces label, width held, `aria-busy` | same | same | same |

Heights **sm 36 / md 44 / lg 52**, radius 12, horizontal padding 20 (sm 16, lg 24). Never below 44 on touch. Never append an arrow glyph.

### Input / Textarea / Select

| State | Treatment |
|---|---|
| Default | white fill, 1px `--border`, radius 8, 44px min height, 12/16 padding |
| Hover | border `--border-strong` |
| Focus | 2px `--focus-ring` ring, 2px offset, border `--primary` |
| Filled | ink text 16px |
| Disabled | `--surface-subtle` fill, `--text-muted` text |
| Error | 1px `--danger` border + message below in `--danger` 14px + `alert-triangle` icon; wired by `aria-describedby` |
| Success | `--success` check at trailing edge + word confirmation |

**Label always visible above the field.** Placeholder is never the label. Helper text sits below in `--text-muted` Caption.

### FileDropzone

| State | Treatment |
|---|---|
| Idle | 2px dashed `--border-strong`, radius 16, `--surface` fill, 240px tall desktop / 180 mobile, upload icon 32px `--text-muted`, heading + helper + "Choose a file" secondary button |
| Hover | border `--primary`, fill `--primary-subtle` |
| Drag over | border 2px solid `--primary`, fill `--primary-subtle`, helper swaps to "Drop it here" |
| Focus | 2px focus ring around the whole zone |
| Uploading | becomes UploadCard with indeterminate bar |
| Error | border `--danger`, `--danger-surface` fill, message inside, file retained |
| Disabled | `--surface-subtle`, `--text-muted` |

Drag is never the only path — a real "Choose a file" button is always present and keyboard-reachable.

### UrgencyBadge / Banner

| Level | Form | Fill | Text/icon | Words |
|---|---|---|---|---|
| LOW | none | — | `--text-muted` | "No deadline found in this document." |
| MEDIUM | inline chip | `--warning-surface` | `--warning` + clock | "Time-sensitive" |
| HIGH | full banner | `--warning-surface`, 1px `--warning` at 30% | `--warning` + alert-triangle | "Time-sensitive" |
| CRITICAL | full banner | `--danger-surface`, 1px `--danger` at 30% | `--danger` + alert-triangle | "Urgent" |

Banner: radius 12, padding 16/20, icon 20px at top-left, heading Label 14/500, body Body 16/400, deadline date H3 20/500, then a primary button. **Icon + word are mandatory. Never colour alone.**

### SourceChip (the rail marker)

| State | Treatment |
|---|---|
| Default | 8px filled circle `--primary`, centred in a 44×44 invisible hit area |
| Hover | 10px, `--primary-hover` |
| Focus | 2px ring, 2px offset, on the 44px box |
| Active / open | 10px filled + 3px `--primary-subtle` halo |
| Needs verification | **hollow** 8px circle, 1.5px `--warning` stroke, **plus the word "Verify"** in `--warning` Caption beside the item title |

Accessible name pattern: `Where this comes from: {item title}`.

### EvidenceCard

Fixed internal order, never reordered, never merged:

```
Where this comes from                          ✕
──────────────────────────────────────────────
Document says                          ← Label, --text-muted
"The Tenant shall deposit a sum of
 Rs. 25,000/- as interest-free security"   ← Inter 14/22, --text-primary,
                                              --surface-subtle fill, radius 8,
                                              3px --border-strong left edge,
                                              padding 12/16
Page 1                                     ← Caption, --text-muted
──────────────────────────────────────────────
Samjo interprets                       ← Label, --text-muted
This is refundable, but the agreement      ← Body 16/26, --text-primary
sets conditions for deductions.
──────────────────────────────────────────────
How confident is Samjo?   High         ← Label + value, --text-primary
[Verify · what to confirm]             ← only when needs_verification
──────────────────────────────────────────────
[ See it in the document ]             ← secondary button, full width
```

Separators are 1px `--border` hairlines, 16px above and below. **The quote is never translated**, even when the interface is in Hindi — only the interpretation is.

### Accordion (mobile briefing sections)

Header 56px, chevron trailing, `aria-expanded`. First two sections open by default. Divider 1px `--border` between items. No fill change on expand.

### LanguageSwitcher

Header popover. Two options, each **in its own script**: `English`, `हिन्दी`. Current marked with a check and `aria-current`. Globe icon 20px. Never a flag icon.

### AudioPlayer

Docked bar, 56px, `--surface`, 1px top border, `--shadow-medium`. Controls: `Listen` → `Pause` / `Resume` / `Stop`, each a 44px target with a visible text label, not icon-only. Never autoplays. State changes announce politely. Position: bottom of the reading column on desktop, above the bottom bar on mobile.

### ProgressIndicator

Stage name as text (Body 16/500) + indeterminate 2px bar in `--primary` on `--surface-subtle`. **Never a percentage.** Completed stages show a `--success` check and drop to `--text-muted`.

### Skeleton

Matches final layout metrics exactly so nothing reflows. `--surface-subtle` fill, no shimmer animation under `prefers-reduced-motion`, otherwise a 1.4s opacity pulse between 100% and 60%. No sweeping gradient — a gradient shimmer violates the no-gradient rule.

### Toast

Bottom-centre desktop, above the bottom bar on mobile. `--surface`, 1px `--border`, `--shadow-medium`, radius 12. Polite live region. Never the only channel for important information.

---

## 5. Iconography

Single minimal line set: 1.5px stroke, rounded caps and joins, 20px default, 24px in banners, 32px in empty states. Approved list only:

`document · upload · camera · alert-triangle · clock · calendar · rupee · check · question · shield · volume · globe · trash · chevron-down · chevron-right · arrow-left · external-link · info · close · search`

Icons support comprehension; they never decorate. **No AI sparkle glyph anywhere.** Not every card gets an icon — only banners, empty states, errors, and controls that need one.

---

## 6. What this system deliberately refuses

From canonical §1, restated because generated design reverts to these by default:

- No high-contrast serif display over cream. The base is warm, the type is DM Sans, the accent is ink blue — **not terracotta**.
- No identical-radius card kit with one grey shadow under everything.
- No all-caps tracked-out eyebrow labels.
- No `01 / 02 / 03` numbered markers — except the lawyer-prep checklist, which genuinely is a sequence.
- No arrows appended to button text.
- No per-section fade-and-slide entrances.
- No glassmorphism, neumorphism, floating blobs, mesh backgrounds, or decorative shapes.
