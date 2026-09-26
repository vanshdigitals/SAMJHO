# SAMJO — Master Stitch Design Context

**Paste the block in section A verbatim at the top of every single Google Stitch generation.**
Never let a later prompt invent a new visual style. If a Stitch output drifts from this, regenerate — do not patch.

Canonical source of truth: `../DESIGN_SYSTEM.md`. This file restates it in Stitch-consumable form and adds nothing that contradicts it.

---

## A. THE PASTE BLOCK

```
=== SAMJO MASTER DESIGN CONTEXT (do not deviate) ===

PRODUCT
Samjo (SAM-jo), from Hindi "समझो" — understanding.
Tagline: "Samajh aane tak." Positioning: "Know where you stand."
An India-first legal information and document-orientation product.
It explains what a document is, what matters in it, whether a clock is
running, and what to do next. It is NOT a lawyer, gives NO legal advice,
and NEVER predicts outcomes.

AUDIENCE
A stressed, non-technical person holding a document that frightens them.
Often on a phone, often on a slow connection, often reading their second
language, sometimes with a deadline already running. The design's job is
to lower the heart rate, then show item by item what the paper says.

FEEL
Calm, trustworthy, human, premium, minimal, extremely readable.
Like a person sitting beside you turning the pages — not a dashboard,
not a chat window, not a portal.

MUST NOT LOOK LIKE
Generic AI SaaS. ChatGPT clone. Government portal. Law-firm website.
Fintech dashboard. Medical app. Crypto app. Enterprise admin panel.
Flashy AI startup. Edtech platform.

COLOUR — semantic only, never decorative
background        #F6F3EE   warm paper
surface           #FFFFFF
surface-subtle    #EEEAE2
text-primary      #131C2B   deep ink navy
text-secondary    #49566A
text-muted        #6E7A8A
border            #DDD6CC
border-strong     #C4BBAE
primary           #1B4DB1   trustworthy blue
primary-hover     #163F92
primary-subtle    #E8EEF9
warning           #92600A   on surface #FBF0DC
danger            #A32219   on surface #FAE9E7
success           #1C6244   on surface #E6F1EB
focus-ring        #1B4DB1

ABSOLUTE COLOUR RULES
- ZERO gradients. No gradient backgrounds, buttons, text, cards, borders,
  glows, meshes or blobs. Flat solid fills only.
- A calm document is almost entirely ink on warm paper. Amber, red and
  green appear ONLY when they carry meaning.
- Colour NEVER carries meaning alone. Urgency = icon + word + colour.
  Confidence = a word. Verification = word + shape.
- No dark mode in this spec. Light only.

TYPOGRAPHY
DM Sans for everything the brand speaks in.
Inter for dense functional content: quoted document text, evidence panels,
money figures, dates, metadata, captions.
Weights 400 / 500 / 600 only. NEVER 700. Sentence case everywhere.
No all-caps tracked-out eyebrow labels.

Display     DM Sans  40/44  500   landing hero only
H1          DM Sans  32/38  500   page title
H2          DM Sans  24/30  500   briefing section
H3          DM Sans  20/26  500   item title
Body Large  DM Sans  18/28  400   briefing prose — the default reading size
Body        DM Sans  16/26  400   interface text
Body Small  Inter    14/22  400   evidence text, metadata
Label       DM Sans  14/20  500   form labels, buttons
Caption     Inter    12/18  400   confidence, page references

Reading measure capped at 68 characters at EVERY breakpoint.
Devanagari adds +4px line-height at every size.

SPACING  4 8 12 16 20 24 32 40 48 64
RADIUS   sm 8 (inputs, chips) · md 12 (buttons, small panels)
         lg 16 (sheets, modals) · xl 24 (bottom-sheet top corners only)
Radius is assigned by ROLE, never applied uniformly.

ELEVATION  two steps only, reserved for things that genuinely float
  subtle  0 1px 2px rgba(19,28,43,0.06)
  medium  0 8px 24px rgba(19,28,43,0.10)
Static content NEVER carries a shadow.

LAYOUT LANGUAGE — the most important rule
Sections are separated by WHITESPACE and a 1px hairline, NOT by boxes.
Do not chop the briefing into identical rounded cards. Cards float and
detach; Samjo needs a continuous reading surface. Use a card only where
it genuinely groups (evidence sheet, upload dropzone, help pathway).

THE EVIDENCE RAIL — the single identity element, the only place with
visual weight
A 1px vertical rule in #C4BBAE runs down the briefing, inset 12px from
the content edge. Every substantive claim hangs off it with an 8px
filled circle marker in #1B4DB1 (44px invisible hit area). Tapping a
marker opens the source. Items needing verification use a HOLLOW marker
PLUS the word "Verify" in #92600A — never the hollow shape alone.

EVIDENCE — three states, NEVER merged into one paragraph
  1. "Document says"    verbatim quote, Inter, in a tinted quote block,
                        with "Page N" beneath. NEVER translated.
  2. "Samjo interprets" plain-language reading, DM Sans.
  3. "How confident is Samjo?"  High / Medium / Low as a WORD,
                        plus "Verify" when confirmation is needed.
Label it "Samjo interprets", never "AI interprets" or "AI analysis".

URGENCY — visible but calm, four levels
  LOW       no colour at all, plain text
  MEDIUM    #92600A text on #FBF0DC, inline, NO banner
  HIGH      banner on #FBF0DC, icon + the words "Time-sensitive"
  CRITICAL  banner on #FAE9E7, icon + the word "Urgent",
            professional help surfaced inline
Never red everywhere. Never manufacture fear.

MICROCOPY — system vocabulary is BANNED from the interface
  "Show us the document"      not "Upload your legal document"
  "Reading your document"     not "Processing"
  "Understanding your document" not "AI Analysis"
  "What you need to do"       not "Legal Obligations"
  "Watch out"                 not "Risk Assessment"
  "Important details"         not "Extracted Entities"
  "Dates that matter"         not "Deadlines"
  "Where this comes from"     not "Source span"
  "How confident is Samjo?"   not "Retrieval confidence"
An action keeps its name across the whole flow.

ICONS
One consistent minimal line-icon set, 1.5px stroke, 20px or 24px,
rounded caps. Only: document, upload, camera, alert-triangle, clock,
calendar, rupee, check, question, shield, volume, globe, trash,
chevron, arrow, external-link, info, close, search.
NEVER an AI sparkle. NEVER decorate every card with an icon.

BUTTONS
primary   solid #1B4DB1, white text, radius 12, no shadow, no gradient
secondary #FFFFFF fill, 1px #C4BBAE border, #131C2B text
quiet     no fill, no border, #1B4DB1 text
danger    solid #A32219, white text — destructive confirmation only
Heights sm 36 / md 44 / lg 52. Never below 44 on touch.
Never append an arrow glyph to button text.

MOTION
The briefing reveals ONCE, top to bottom, 40ms stagger, first load only.
Everything else is action-driven. No hover transitions on cards. No
scroll-triggered entrances. No looping decoration. No AI shimmer.
prefers-reduced-motion removes the reveal and all transforms.

ACCESSIBILITY — WCAG 2.2 AA, non-negotiable
44px minimum touch targets. Visible 2px focus ring #1B4DB1 with 2px
offset, never suppressed. One h1 per screen. Labels always visible —
placeholder is never the label. Errors sit below the field and name
both what happened and what to do. Text works at 200% zoom.

VIEWPORTS
Desktop 1440×900 primary, must also hold at 1280×800.
Mobile 390×844 primary, must also hold at 360×800 and 430×932.
Mobile is PRIMARY and is redesigned, never a shrunken desktop.

DEMO CONTENT — always fictional, always labelled "DEMO DOCUMENT"
Residential Rental Agreement · Tenant: Aarav Mehta ·
Landlord: Demo Property Owner · Noida, Uttar Pradesh ·
Monthly rent ₹15,000 · Security deposit ₹25,000 · 30 days notice.
NEVER invent statistics, user counts, testimonials, logos, lawyer
directories, phone numbers, or statute citations.

=== END MASTER DESIGN CONTEXT ===
```

---

## B. Global chrome that appears on every app screen

**Desktop header** — 64px tall, `--surface` fill, 1px bottom border `--border`, content centred in a 1200px container.
Left: wordmark "Samjo" (DM Sans 20/500, `--text-primary`) — no logomark, no icon, no tagline in the header.
Right, in order: language switcher (`English` / `हिन्दी`, each in its own script), text-size control (`A` / `A` larger), read-aloud `Listen`, then the document action menu when inside a document.

**Mobile header** — 56px, same fill and border. Left: back chevron (44px target) or wordmark on root screens. Centre: truncated document title, Body 16/500, single line with ellipsis. Right: overflow `⋯` (44px) holding language, text size, read aloud, export, delete.

**Footer** — only on public pages (`/`, `/privacy`, `/safety`, `/accessibility`). Never on task screens. One row: Privacy · Safety · Accessibility · "Samjo gives legal information, not legal advice." `--text-muted`, Body Small.

**Skip link** — first focusable element on every screen, visually hidden until focused, then a solid `--primary` chip at top-left reading "Skip to main content".

---

## C. Six rules a Stitch generation must never break

1. **No gradients, anywhere, in any form.** This is the most common failure mode of generated design. Check every output.
2. **The briefing is a reading surface with a rail down its side — not a board of tiles.** If Stitch returns uniform rounded cards in a grid, regenerate.
3. **Document says / Samjo interprets / Confidence are three visually distinct blocks.** Never one paragraph.
4. **68-character measure at every width.** A wide desktop does not get wider text; it gets more whitespace.
5. **Urgency is icon + word + colour.** Never a bare coloured dot or a red border alone.
6. **No fabricated content.** No stats, no testimonials, no logo wall, no lawyer names, no phone numbers.

---

## D. Per-batch context suffix

Append the relevant line to the paste block when generating that batch.

| Batch | Suffix to append |
|---|---|
| 1 Design system | `Generate a component sheet on #F6F3EE. Show every state side by side. No sample page layout.` |
| 2 Public pages | `Marketing surface, but restrained. Footer present. No hero illustration, no gradient, no stats.` |
| 3 Entry/upload/processing | `Task surface. One obvious primary action per screen. Footer absent.` |
| 4 Briefing | `THE most important screen. Continuous reading surface + evidence rail. Not cards.` |
| 5 Evidence/viewer | `Evidence is a drawer on desktop, a bottom sheet on mobile. Quote block in Inter, never translated.` |
| 6 Urgency/next steps/help | `Calm urgency. Help is guidance, never a marketplace. No invented contacts.` |
| 7 Situation flow | `Guided form, one question per screen on mobile. NOT a chatbot. No chat bubbles.` |
| 8 Document Q&A | `Not a chat UI. No bubbles, no avatars, no streaming cursor. Answer + evidence block.` |
| 9 Settings/a11y/language | `Inline controls in the header popover, not a settings page.` |
| 10 Error/empty/loading | `Every state names what happened and offers an action. Never "Something went wrong."` |
