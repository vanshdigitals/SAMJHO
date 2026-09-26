# SAMJO — Design to Code Mapping

Stack per `README.md` and `TRD.md`: **React 18 + TypeScript + Vite + Tailwind CSS**, React Router, react-i18next, Radix primitives for the components where accessibility is hard to hand-roll.

This file exists so the Stitch output lands in code without a translation layer inventing its own names.

---

## 1. Token wiring

Tokens are declared **once** as CSS custom properties and mapped in `tailwind.config.ts` (canonical `DESIGN_SYSTEM.md` §8). Arbitrary values in class names are a **lint error**, so the token system cannot quietly erode.

```ts
theme: {
  extend: {
    colors: {
      background: 'var(--background)',
      surface: { DEFAULT: 'var(--surface)', subtle: 'var(--surface-subtle)' },
      ink: {
        DEFAULT:   'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        muted:     'var(--text-muted)',
      },
      primary: {
        DEFAULT: 'var(--primary)',
        hover:   'var(--primary-hover)',
        subtle:  'var(--primary-subtle)',
      },
      warning: { DEFAULT: 'var(--warning)', surface: 'var(--warning-surface)' },
      danger:  { DEFAULT: 'var(--danger)',  surface: 'var(--danger-surface)'  },
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

Fonts **self-host as woff2**, `font-display: swap`, subset to Latin + Devanagari. Self-hosting is not a preference: a third-party font request is one more thing to fail on a slow connection, and one more party learning that someone visited a legal-help site.

### Stitch output → Tailwind class

| Stitch produces | Use | Never |
|---|---|---|
| `#F6F3EE` | `bg-background` | `bg-[#F6F3EE]` |
| `#131C2B` | `text-ink` | `text-[#131C2B]` |
| `#49566A` | `text-ink-secondary` | — |
| `#6E7A8A` | `text-ink-muted` | — |
| `#1B4DB1` | `bg-primary` / `text-primary` | — |
| `#DDD6CC` | `border-[color:var(--border)]` via a `border-hairline` utility | — |
| 18/28 prose | `text-[1.125rem] leading-7` as a `.prose-brief` component class | inline arbitrary values |
| 68ch cap | `max-w-measure` | `max-w-[68ch]` |

Any hex or px that survives into a class name is a defect. Add the token first.

---

## 2. Screen → route → component

| Screens | Route | Page component |
|---|---|---|
| 01, 02 | `/` | `LandingPage` |
| 03 | `/safety` | `SafetyPage` |
| 04 | `/privacy` | `PrivacyPage` |
| 05 | `/accessibility` | `AccessibilityPage` |
| 06 | `/start` | `StartPage` |
| 07, 08, 09, 36 | `/upload` | `UploadPage` |
| 10–13 | `/d/:id/processing` | `ProcessingPage` |
| 14–24, 28, 37–39, 46 | `/d/:id` | `BriefingPage` |
| 25, 26 | `/d/:id/help` | `HelpPage` |
| 27 | `/d/:id/export` | `ExportPage` |
| 29–35 | `/situation` | `SituationPage` |
| 40–45 | — | global providers and overlays |

**Nine routes, forty-six frames.** A frame is a state of a page, not a URL. Routing a user elsewhere to see an error, a loading bar or a highlighted clause fragments the experience and breaks the back button (`UX_FLOWS.md` §1).

---

## 3. Component inventory

```
components/
  ui/                      primitives — no product knowledge
    Button.tsx             variant: primary|secondary|quiet|danger; size: sm|md|lg
    IconButton.tsx         requires `label`, enforced by types
    Input.tsx  Textarea.tsx  Select.tsx
    Badge.tsx  Chip.tsx
    Sheet.tsx              Radix Dialog → bottom sheet <1024
    Drawer.tsx             Radix Dialog → right drawer 1024–1279
    Popover.tsx  Tabs.tsx  Accordion.tsx  Tooltip.tsx   all Radix
    Skeleton.tsx  Toast.tsx  ProgressIndicator.tsx

  evidence/                the identity element
    EvidenceRail.tsx       the 1px rule + slot for markers
    SourceChip.tsx         8px dot, 44px hit area, `verified` | `needsVerification`
    EvidenceCard.tsx       the three blocks, order fixed in the component
    EvidenceSurface.tsx    picks pane | drawer | sheet from a breakpoint hook
    DocumentViewer.tsx     paged render + span highlight + scroll-to-span

  briefing/
    BriefingLayout.tsx     three-pane | two-pane | single column
    SectionNav.tsx         jump list + scroll-spy
    BriefingSection.tsx    h2 + hairline + rail slot
    UrgencyBanner.tsx      level → icon + word + surface
    ObligationItem.tsx  RiskItem.tsx  MoneyRow.tsx
    DeadlineItem.tsx    QuestionItem.tsx  NextStepList.tsx
    ConfidenceLabel.tsx    float → High|Medium|Low, never a number

  upload/
    FileDropzone.tsx  UploadCard.tsx  CameraCapture.tsx

  system/
    AppHeader.tsx  AppFooter.tsx  SkipLink.tsx
    LanguageSwitcher.tsx  TextSizeControl.tsx  AudioPlayer.tsx
    ErrorState.tsx  EmptyState.tsx  OfflineBanner.tsx
```

**Radix is used** for Dialog, Popover, Tabs, Accordion, Tooltip and the bottom sheet — the focus trap, Escape handling and focus restoration in the evidence surface are exactly the behaviours that are hard to get right by hand, and they are accessibility gates here, not niceties.

---

## 4. Schema → UI binding

Every field the UI renders comes from `AI_SCHEMAS.md`. Nothing is rendered that is not in the schema.

| Schema field | Renders as | Component |
|---|---|---|
| `document_type`, `document_title` | context bar | `BriefingPage` header |
| `type_confidence` | Screen 11 confirmation wording | `ProcessingPage` |
| `summary` | Screen 15, no rail | `BriefingSection` |
| `urgency.level` | Screen 24 banner | `UrgencyBanner` |
| `urgency.deadline_date` | the H3 date inside the banner | `UrgencyBanner` |
| `urgency.evidence` | required for HIGH/CRITICAL | `SourceChip` |
| `obligations[]` | Screen 16 | `ObligationItem` |
| `risks[].severity` | a **word** beside the title | `RiskItem` |
| `money_items[].amount_text` | the figure, **as written** | `MoneyRow` |
| `money_items[].amount_value` | alignment/sorting only, never displayed raw | `MoneyRow` |
| `deadlines[].date_text` | the line as written | `DeadlineItem` |
| `deadlines[].resolved_date` | Caption beneath | `DeadlineItem` |
| `conflicts[]` | Screen 17, ≥2 spans, both linked | `RiskItem` |
| `questions[]` + `rationale` | Screen 20 | `QuestionItem` |
| `next_steps[]` | bottom action target | `NextStepList` |
| `uncertainty[]` | Screen 33 on the situation flow | `BriefingSection` |
| `professional_help.pathways` | Screen 25 panel — **curated only** | `HelpPage` |
| `safety.is_high_risk` | promotes help above self-help | `BriefingLayout` |
| `source_metadata.ocr_confidence` | Screen 46 notice | `BriefingPage` |
| `source_metadata.dropped_item_count` | the honesty line at the foot | `BriefingPage` |
| `disclaimer` | first-briefing line + every export | `BriefingPage`, `ExportPage` |

**`what_document_says` / `ai_interpretation` / `confidence` are three separate props on `EvidenceCard`, never one composed string.** The component takes them individually so a future refactor cannot merge them.

### Confidence mapping — one place only

```ts
// components/briefing/ConfidenceLabel.tsx
export function toLabel(c: number) {
  if (c >= 0.85) return 'High';
  if (c >= 0.65) return 'Medium';
  return 'Low';
}
```

Users never see the float. Below 0.65 sets `needs_verification` automatically. **Every `Deadline` renders `Verify` regardless of confidence** — that flag is `True` by default in the schema.

---

## 5. Breakpoint hook

One hook decides the evidence form. No component queries the width itself.

```ts
type EvidenceForm = 'sheet' | 'drawer' | 'pane';
// <1024 → 'sheet'  ·  1024–1279 → 'drawer'  ·  ≥1280 → 'pane'
```

`EvidenceSurface` switches on the return value. This keeps the responsive rule from `SAMJO_RESPONSIVE_BEHAVIOR.md` §4 in exactly one file.

---

## 6. i18n

`react-i18next`, keys only — **no hardcoded user-facing strings in components.** Namespaces: `common`, `landing`, `upload`, `processing`, `briefing`, `evidence`, `help`, `situation`, `errors`.

Two rules that are correctness rules, not translation rules:

1. **`what_document_says.quoted_text` is never passed through i18n.** It renders verbatim, wrapped in `lang="en"`, even on a Hindi interface. It is verified against the extracted text; translating it would break the grounding guarantee.
2. **Amounts and dates render from the deterministic extractor**, not from the translation layer (`PRD.md` §11), so `₹15,000` is byte-identical in both languages.

Devanagari gets `+4px` line-height through a `[lang="hi"]` rule, not per-component overrides.

---

## 7. Motion

```css
.briefing-reveal > * { animation: fade-up 240ms ease-out backwards; }
/* stagger 40ms per section, first load only — a ref guard, not a key change */

@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition-duration: 100ms !important; }
  /* opacity only; no transforms */
}
```

Reduced motion is asserted in CI (`ACCESSIBILITY.md` §5), so any state conveyed only by motion is a build failure.

---

## 8. What the implementer must not "improve"

| Temptation | Why it is wrong |
|---|---|
| Wrap briefing sections in `<Card>` | Cards float and detach; the rail connects. The briefing is a reading surface. |
| Show confidence as a percentage or a bar | Users never see the float. A bar is also colour-only meaning. |
| Translate the source quote | Breaks the grounding guarantee and the span verification. |
| Add an "Evidence" tab to the section nav | Evidence is attached to items, never a section. |
| Make the OCR notice dismissible | OCR-derived facts must never be presented silently as certain. |
| Reorder briefing sections, or make the order configurable | The ranking encodes the product thesis. |
| Add a shimmer gradient to skeletons | Violates the no-gradient rule. Opacity pulse only. |
| Replace the bottom sheet with a side drawer on mobile | A side drawer covers the tapped item; the user loses their place. |
| Use `--danger` outside CRITICAL urgency and the delete button | Colour must stay meaningful. |
| Render any item without a verified span | Unverified items are dropped before persistence — if one reaches the UI, that is a bug, not a render case. |

---

## 9. Implementation order

From `TRD.md`, phase 1: **tokens in Tailwind config, landing passes axe.** Then:

1. Tokens + `ui/` primitives + the Batch 1 specimen sheet
2. `AppHeader`, `SkipLink`, routing shell, landing
3. Upload + processing, including every error state
4. `BriefingLayout` + sections + `EvidenceRail` + `SourceChip`
5. `EvidenceSurface` in all three forms + `DocumentViewer`
6. Urgency, help, lawyer prep, export, delete
7. Situation flow
8. Q&A
9. i18n Hindi pass + read aloud
10. Full state matrix, axe on every route at 360 and 1280

Each phase ends green before the next begins. The keyboard walkthrough and the screen-reader pass are **release gates**, not suggestions — automated tools catch a minority of real barriers.
