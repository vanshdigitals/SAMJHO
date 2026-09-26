# Samjo: Accessibility

Target: WCAG 2.2 AA on every route.

"Works for every age" is not accessibility. It is a statement about tone. Accessibility is a testable property covering perception, operation, understanding and robustness for people with disabilities and people with low digital confidence. Samjo commits to the testable version.

## 1. Must have, in the MVP

### Perceivable
- Contrast ratios as measured in DESIGN_SYSTEM section 2, all clearing AA for body text.
- No information carried by colour alone. Urgency is icon plus word plus colour. Confidence is a word. Verification is a word plus a shape.
- Text resizes to 200% with no loss of content or function.
- Every image and icon has a text alternative, or is marked decorative.
- Briefing prose sets at 18px, because the reader is often stressed and may be older.

### Operable
- Every interaction reachable by keyboard, including the evidence sheet, the document viewer, and read-aloud controls.
- Visible focus with a 2px ring in `--focus-ring` and a 2px offset. Focus is never suppressed.
- Touch targets at least 44px, including the source markers on the evidence rail, which get a 44px hit area around an 8px dot.
- Focus order follows reading order. The evidence sheet traps focus, closes on Escape, and returns focus to the marker that opened it.
- `prefers-reduced-motion` removes the reveal sequence and all transforms.
- Skip link to main content.

### Understandable
- Plain language throughout, per the microcopy table in UX_FLOWS section 7. This is an accessibility control, not a tone preference: cognitive load is the barrier this whole product exists to reduce.
- Progressive disclosure. Summary first, detail on request.
- Errors name what happened and what to do, are associated by `aria-describedby`, and never rely on colour.
- Help sits in a consistent position across pages (WCAG 2.2, 3.2.6).
- Nothing already provided is asked for twice within a flow (3.3.7).
- `lang` is set correctly on the document and on any element that switches script, so screen readers pronounce Devanagari properly.

### Robust
- Semantic HTML first. One `h1` per page, correct heading hierarchy, real buttons and real links.
- ARIA only where semantics fall short, primarily the sheet, tabs and live regions.
- Pipeline stage changes announce through a polite live region so a screen-reader user knows work is progressing.
- Analysis completion announces once, politely.

### Language and speech
- Full English and Hindi for interface and analysis, driven by translation keys.
- Read-aloud covers briefing content with listen, pause, resume and stop. No autoplay. State changes are announced.
- Hindi uses a Hindi voice where the device provides one, and falls back gracefully with a notice rather than reading Devanagari with an English voice.

## 2. Should have

More Indic languages. Voice input for the situation flow. A low-bandwidth mode. A dyslexia-friendly font toggle. An adjustable reading level for the interpretation text.

## 3. Later

AAA contrast. Sign-language explainer video. Offline PWA.

## 4. Mobile and bandwidth

Primary breakpoints are 360, 390 and 430. The evidence sheet is a bottom sheet rather than a side drawer, so the user never loses their place in the briefing. Fonts are self-hosted, subset, and `font-display: swap`. No layout shift after load, because skeletons match final metrics.

## 5. Testing

| Method | Scope | Gate |
|---|---|---|
| axe via Playwright | Every route, light and dark, 360 and 1280 | CI blocking |
| Keyboard walkthrough | Landing to briefing to evidence to export | CI blocking |
| Screen reader | NVDA and VoiceOver, manual, per phase | Release gate |
| Zoom | 200% at 360px, manual | Release gate |
| Reduced motion | Automated assertion | CI blocking |
| Hindi rendering | Devanagari at all sizes, and TTS voice selection | Release gate |

Automated tools catch a minority of real barriers. The keyboard walkthrough and the screen-reader pass are where the genuine defects surface, so they are gates rather than suggestions.

## 6. Known tension

Source spans are precise, and precision is visually dense. The evidence sheet resolves this by moving detail off the main reading surface: the briefing stays sparse and scannable, and full quoted text with page references lives one deliberate tap away.
