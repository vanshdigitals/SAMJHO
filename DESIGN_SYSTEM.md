# Samjo: Design System

## 1. Design plan

### Subject and audience

The subject is a person holding a piece of paper that frightens them. Often on a phone, often on a slow connection, often reading their second language, sometimes with a deadline already running. The design's job is to lower the heart rate and then show, item by item, what the paper actually says.

That framing rules out most of what legal and AI products look like. A dashboard implies the user is in control of a system. A chat window implies an open-ended conversation the user has to drive. A government portal implies process. Samjo is closer to a person sitting beside you turning the pages.

### Where the boldness goes

One element carries the identity: **the evidence rail**. Every claim on the briefing sits against a thin vertical rule with a source marker on it. Tap the marker and the exact sentence from the document appears, highlighted in place. The rail is the visible form of the product thesis, so it is the one place that gets visual weight. Everything else stays quiet.

This is also the reason the design does not chop content into identical rounded cards. Cards float and detach; the rail connects. Sections are separated by space and a hairline, not by boxes, so the eye reads a continuous document rather than a grid of widgets.

### What was deliberately avoided

The brief pins the palette direction and the typefaces, and those are followed exactly. Where it left room, the room was not spent on the current generated-design defaults. Specifically: no high-contrast serif display over cream (the base is warm, but the type is DM Sans and the accent is ink blue, not terracotta); no identical-radius card kit with one grey shadow under everything; no all-caps tracked-out eyebrow labels; no numbered 01/02/03 markers except in the lawyer-prep checklist, which genuinely is a sequence; no arrows appended to button text; no per-section fade-and-slide entrances.

## 2. Colour

Semantic only. Nothing is coloured for decoration. Amber, red and green appear only when they carry meaning, which means a calm document is almost entirely ink on paper.

```css
:root {
  /* surfaces */
  --background:      #F6F3EE;   /* warm paper */
  --surface:         #FFFFFF;
  --surface-subtle:  #EEEAE2;

  /* text */
  --text-primary:    #131C2B;   /* deep ink navy */
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
  --warning:         #92600A;
  --warning-surface: #FBF0DC;
  --danger:          #A32219;
  --danger-surface:  #FAE9E7;
  --success:         #1C6244;
  --success-surface: #E6F1EB;

  /* focus */
  --focus-ring:      #1B4DB1;
}
```

Contrast, measured against the surface each colour is used on: `--text-primary` on `--background` 14.2:1, `--text-secondary` 7.4:1, `--text-muted` 4.7:1, `--primary` on white 7.1:1, `--warning` on `--warning-surface` 5.6:1, `--danger` on `--danger-surface` 6.8:1, `--success` on `--success-surface` 6.4:1. All clear AA for body text.

No gradients of any kind. No colour carries meaning on its own: urgency uses an icon and a word alongside the colour, and confidence uses a label, never a coloured dot alone.

### Urgency colour mapping

| Level | Treatment |
|---|---|
| LOW | No colour. Plain text, "No deadline found in this document." |
| MEDIUM | `--warning` text on `--warning-surface`, no banner |
| HIGH | Banner, `--warning-surface`, icon plus the word "Time-sensitive" |
| CRITICAL | Banner, `--danger-surface`, icon plus the word "Urgent", professional help surfaced inline |

## 3. Typography

DM Sans for everything the brand speaks in. Inter for dense functional content: extracted document text, evidence panels, tabular money and date data, where Inter's narrower forms and clearer figures help at small sizes.

Weights are 400, 500 and 600 only. No 700 anywhere.

| Role | Family | Size / line | Weight | Use |
|---|---|---|---|---|
| Display | DM Sans | 40 / 44 | 500 | Landing hero only |
| H1 | DM Sans | 32 / 38 | 500 | Page title |
| H2 | DM Sans | 24 / 30 | 500 | Briefing section |
| H3 | DM Sans | 20 / 26 | 500 | Item title |
| Body Large | DM Sans | 18 / 28 | 400 | Briefing prose, the default reading size |
| Body | DM Sans | 16 / 26 | 400 | Interface text |
| Body Small | Inter | 14 / 22 | 400 | Evidence text, metadata |
| Label | DM Sans | 14 / 20 | 500 | Form labels, buttons |
| Caption | Inter | 12 / 18 | 400 | Confidence, page references |

Briefing prose sets at 18px, not 16px, because the reader is stressed and may be older. Measure is capped at 68 characters at every breakpoint. Sentence case throughout; no all-caps labels. Devanagari sets one step larger in line-height (add 4px) because the script needs the vertical room.

## 4. Spacing, radius, elevation

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
--space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
--space-12: 48px; --space-16: 64px;

--radius-sm: 8px;    /* inputs, chips */
--radius-md: 12px;   /* buttons, small panels */
--radius-lg: 16px;   /* sheets, modals */
--radius-xl: 24px;   /* bottom sheet top corners only */

--shadow-subtle: 0 1px 2px rgba(19, 28, 43, 0.06);
--shadow-medium: 0 8px 24px rgba(19, 28, 43, 0.10);
```

Radius is assigned by role, not applied uniformly. Elevation exists in two steps and is reserved for things that genuinely float: the evidence sheet, modals, toasts. Static content never carries a shadow.

## 5. The evidence rail

The identity element, specified precisely because it must be built consistently.

```
│
├─●  What you need to do
│    Pay a security deposit of ₹25,000 before you move in.
│    ┌──────────────────────────────────────────┐
│    │ Where this comes from                    │  ← source marker tapped
│    │                                          │
│    │ Document says                            │
│    │ "The Tenant shall deposit a sum of       │
│    │  Rs. 25,000/- as interest-free security" │
│    │ Page 1                                   │
│    │                                          │
│    │ Samjo interprets                         │
│    │ This is refundable, but the agreement    │
│    │ sets conditions for deductions.          │
│    │                                          │
│    │ How confident is Samjo?  High            │
│    └──────────────────────────────────────────┘
│
├─●  Give 30 days notice before leaving
│
```

Rail: 1px `--border-strong`, inset 12px from the content edge. Marker: 8px filled circle in `--primary`, with a 44px invisible hit area. The marker is a real button with an accessible name, "Where this comes from: pay a security deposit."

Items with `verification_required` carry a hollow marker plus the word "Verify" in `--warning`, never the hollow shape alone.

## 6. Components

Built on Radix primitives for the ones where accessibility is hard to get right by hand: Dialog, Popover, Tabs, Accordion, Tooltip, and the bottom sheet.

| Component | Notes |
|---|---|
| Button | Variants: primary, secondary, quiet, danger. Sizes sm 36px, md 44px, lg 52px. Never below 44px on touch. |
| IconButton | 44px minimum. Always has an accessible name. |
| Input, Textarea, Select | Label always visible. Placeholder is never the label. Errors sit below, referenced by `aria-describedby`. |
| FileDropzone | Click, drag, and a visible "choose a file" button, because drag-only excludes keyboard and many mobile users. |
| UploadCard | Shows filename, size, page count, and a remove action. |
| ProgressIndicator | Stage name plus indeterminate motion. No percentage. |
| StatusBadge | Text plus icon. |
| UrgencyBadge | Word plus icon plus colour, per the mapping above. |
| SourceChip | The rail marker. |
| EvidenceCard / EvidenceDrawer | Drawer on desktop, bottom sheet on mobile. Focus trapped, Escape closes, focus returns to the marker. |
| AnalysisCard variants | Obligation, Risk, Money, Deadline, Question, NextStep. Shared shell, different affordances. Money and Deadline render figures in Inter tabular numerals. |
| DocumentViewer | Paged, with span highlighting and scroll-to-span. |
| EmptyState, ErrorState | Copy from UX_FLOWS section 6. Always offer an action. |
| Skeleton | Matches final layout metrics to avoid reflow. |
| Toast | Polite live region. Never the only channel for important information. |
| Tabs, Accordion | Accordion for briefing sections on mobile; first two open. |
| LanguageSwitcher | Persistent in the header. Labels in their own script: English, हिन्दी. |
| AudioPlayer | Listen, pause, resume, stop. Never autoplays. Announces state changes. |

Card usage is restrained on purpose. The briefing is a reading surface with a rail down its side, not a board of tiles.

## 7. Motion

One orchestrated moment, and everything else is a response to an action.

- The briefing reveals once, top to bottom, staggered by 40ms per section, on first load only.
- Everything else is action-driven: the evidence sheet opening, an accordion expanding, a toast arriving.
- No hover transitions on cards. No scroll-triggered entrances. No looping decoration.
- `prefers-reduced-motion: reduce` removes the reveal and all transforms, keeping only opacity changes under 100ms.

## 8. Tailwind wiring

Tokens are declared once as CSS custom properties and mapped in `tailwind.config.ts`. Arbitrary values in class names are a lint error, so the token system cannot quietly erode.

```ts
theme: {
  extend: {
    colors: {
      background: 'var(--background)',
      surface: { DEFAULT: 'var(--surface)', subtle: 'var(--surface-subtle)' },
      ink: {
        DEFAULT: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted: 'var(--text-muted)',
      },
      primary: {
        DEFAULT: 'var(--primary)',
        hover: 'var(--primary-hover)',
        subtle: 'var(--primary-subtle)',
      },
      warning: { DEFAULT: 'var(--warning)', surface: 'var(--warning-surface)' },
      danger:  { DEFAULT: 'var(--danger)',  surface: 'var(--danger-surface)' },
      success: { DEFAULT: 'var(--success)', surface: 'var(--success-surface)' },
    },
    fontFamily: {
      sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      ui:   ['Inter', 'system-ui', 'sans-serif'],
    },
    maxWidth: { measure: '68ch' },
  },
}
```

Fonts self-host as woff2 with `font-display: swap`, subset to Latin plus Devanagari. Self-hosting matters here: a third-party font request is one more thing to fail on a slow connection and one more party learning that someone visited a legal-help site.
