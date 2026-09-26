# Samjo Landing Page — Google Stitch Master Prompt

Paste the block below into Stitch to generate the full page. For section-by-section generation, use this as the standing context and append one section prompt from `SAMJO_LANDING_PAGE_SECTION_PROMPTS.md`.

---

## MASTER PROMPT — copy from here

Design a responsive marketing landing page for **Samjo**, an India-first product that helps ordinary people understand legal documents they have received.

### Brand

- Product name: **Samjo** (sentence case, never all-caps)
- Tagline: **Samajh aane tak.**
- English support line: **Know where you stand.**
- Voice: calm, plain, direct. A knowledgeable person sitting beside you turning the pages — not a brand talking at you.
- The design's job: lower the reader's heart rate, then show them item by item what their document actually says.

The user is often on a phone, often on a slow connection, often reading their second language, sometimes with a legal deadline already running. Every design decision serves that person.

### What the product does

Samjo reads a residential rental agreement or a housing-related legal notice and returns a briefing: what the document is, what the reader must do, what money and dates are involved, what to watch out for, and what to ask a professional. Every claim in the briefing is tied to a quoted sentence from the reader's own document.

Samjo is not a lawyer, does not give legal advice, does not predict outcomes, and is not a chatbot.

### Design system — use exactly, do not substitute

**Colours** (semantic only; nothing is coloured for decoration):

```
--background:      #F6F3EE   warm paper
--surface:         #FFFFFF
--surface-subtle:  #EEEAE2

--text-primary:    #131C2B   deep ink navy
--text-secondary:  #49566A
--text-muted:      #6E7A8A

--border:          #DDD6CC
--border-strong:   #C4BBAE

--primary:         #1B4DB1
--primary-hover:   #163F92
--primary-subtle:  #E8EEF9

--warning:         #92600A
--warning-surface: #FBF0DC
--danger:          #A32219
--danger-surface:  #FAE9E7
--success:         #1C6244
--success-surface: #E6F1EB

--focus-ring:      #1B4DB1
```

**Typography** — two families, three weights (400, 500, 600). **No 700 anywhere.**

| Role | Family | Size / line | Weight |
|---|---|---|---|
| Display | DM Sans | 40/44 | 500 |
| H1 | DM Sans | 32/38 | 500 |
| H2 | DM Sans | 24/30 | 500 |
| H3 | DM Sans | 20/26 | 500 |
| Body Large | DM Sans | 18/28 | 400 |
| Body | DM Sans | 16/26 | 400 |
| Body Small | **Inter** | 14/22 | 400 |
| Label | DM Sans | 14/20 | 500 |
| Caption | **Inter** | 12/18 | 400 |

Inter is used only for dense functional content: quoted document text, evidence panels, money and date figures (tabular numerals). DM Sans for everything the brand speaks in.

Sentence case throughout. **No all-caps labels, no letter-spaced eyebrow text.**

**Spacing:** 4, 8, 12, 16, 20, 24, 32, 40, 48, 64px.

**Radius by role, not uniform:** 8px inputs and chips · 12px buttons and small panels · 16px sheets and modals.

**Elevation:** two steps only, reserved for things that genuinely float (modals, sheets, toasts). **No static content on this page carries a shadow.**

**Measure: prose is capped at 68 characters at every screen width.** Extra width becomes margin, never longer lines.

### The signature element — the evidence rail

One element carries the product's identity and gets the page's only concentration of visual weight: **the evidence rail.**

A thin vertical rule (1px, `--border-strong`, inset 12px from the content edge) runs beside briefing content. Small source markers sit on it: an 8px filled circle in `--primary` with a 44px invisible hit area. Each marker opens a panel showing the exact sentence from the document.

The rail appears in three places: the hero product preview, the product showcase, and the evidence section. It also appears rotated horizontally as the connector between the four "How it works" steps.

**Because the rail connects, this page does not use a card grid.** Sections are separated by generous space and 1px hairline rules — never by boxes. Cards float and detach; the rail connects. Only two card usages are permitted on the entire page: the two "ways to start" panels, and the FAQ accordion rows.

### The three-state principle — never merge these

Samjo's core differentiator is that it keeps three things visually separate. Use these labels **verbatim**:

- **Where this comes from** — the panel title
- **Document says** — the verbatim quote from the user's document, plus a page number. Set in Inter.
- **Samjo interprets** — the plain-language reading. Set in DM Sans. **Never write "AI interprets".**
- **How confident is Samjo?** — followed by the word High, Medium or Low. Never a number, never a bare coloured dot.

Items needing checking show a **hollow** marker plus the word **Verify** in `--warning`. Never the shape alone.

### Page structure — 14 sections, this exact order

```
01  Header
02  Hero
03  Product showcase — the briefing
04  Evidence — Document says / Samjo interprets / Verify
05  The problem
06  How Samjo works
07  Two ways to start
08  Language, read-aloud and access
09  Privacy
10  What Samjo does not do
11  Preparing for professional help
12  Questions people ask
13  Final CTA
14  Footer
```

The product showcase and the evidence section come **before** the problem statement. The differentiator is demonstrated before anything is explained.

### Content hierarchy inside the briefing — fixed, never reordered

Wherever a briefing is shown, its sections appear in this order. The order encodes the product's thesis and is not user-configurable:

1. **Time-sensitive** (urgency banner — shown only for high urgency)
2. **What this is**
3. **What you need to do**
4. **Watch out**
5. **Important details** (money)
6. **Dates that matter**
7. **Questions to ask**
8. **What to do next**

Urgency ranks above everything because missing a deadline is the highest-harm failure in this domain.

Urgency treatment: `--warning-surface` fill, `--warning` text, and **an icon plus the word "Time-sensitive" plus the colour**. Three channels. Never colour alone.

### Copy

Use the copy in `SAMJO_LANDING_PAGE_CONTENT.md` verbatim. Do not rewrite, shorten, or "improve" it.

Hero essentials:
- Headline: **Know where you stand.**
- Hindi context line: **Legal documents ko samajhna mushkil nahi hona chahiye.**
- Explanation: *Show us a rental agreement or a housing notice, or just tell us what happened. Samjo explains what it says, what matters in it, and what to do next.*
- Primary button: **I have a document**
- Secondary button: **Something happened**
- Trust line: **Source-grounded · Private by design · Hindi + English**
- Reassurance: **No account. No sign-up. Nothing to remember.**

**Banned vocabulary on every surface** — these words must not appear anywhere in the interface: Upload, Submit, Processing, AI Analysis, Risk Assessment, Legal Obligations, Extracted Entities, Retrieval confidence, Source span, LLM, AI model, OCR, pipeline, extraction, embeddings, vector database, RAG, prompt, schema, token, API, "powered by".

Say **"Show us the document"**, not "Upload your legal document". Say **"Reading your document"**, not "Processing".

### Visual direction

The page should feel like a real, polished, trustworthy product built by people who care about the reader.

It must **not** look like: a generic AI SaaS site, a law firm website, a government portal, a hackathon project, a template landing page, a chatbot product, an enterprise dashboard, or a decorative startup page.

Target feeling: **calm clarity for someone who doesn't know what their legal document means.**

Because the palette is semantic only, a calm page is almost entirely ink on warm paper. Amber, red and green appear only where they carry meaning.

### Components

Buttons (primary, secondary, quiet, danger) at sm 36 / md 44 / lg 52px — **never below 44px on touch**. Language switcher with both labels visible in their own script: `English` and `हिन्दी`. Accordion for the FAQ and for mobile briefing sections. The evidence panel. Source markers on the rail. Status and urgency badges (always text plus icon). Hairline section dividers.

### Responsive behaviour

**Desktop — 1440×900 and 1280×800.** 12-column grid, 24px gutters. Max content 1200px at 1440, 1120px at 1280. Page gutter 120px / 80px. Prose still capped at 68ch. Desktop is not a stretched phone and it is not a dashboard.

**Mobile — 390×844 (target), 360×800 (narrowest), 430×932.** Single column. Side gutter 16px at 360. **No horizontal scroll at any width.**

Mobile is not a compressed desktop. Three structural changes:

1. **In the hero, the two CTA buttons come before the product preview.** A phone user should not scroll past an image to reach the action. Both buttons full-width, stacked, 52px, equal weight.
2. **"How it works" and "Language and access" switch from horizontal to vertical.** The step connector becomes a vertical rail on the left edge.
3. **Long sections collapse:** the product showcase becomes an accordion with its first two sections expanded; the FAQ collapses with its first item open.

**Never collapse, truncate, or hide behind "read more"** — at any width: the AI-provider disclosure in Privacy, the device-voice caveat in Language and access, the asymmetry line in Two ways to start, any part of "What Samjo does not do", and the footer disclaimer. Each exists because the reader needs to actually see it.

Briefing prose stays at 18px on mobile — the reader is stressed and may be older. Do not step it down to 16px to save space.

### Accessibility — WCAG 2.2 AA

- Contrast: all body text clears AA on the surface it sits on.
- **No information carried by colour alone.** Urgency is icon + word + colour. Confidence is a word. Verification is a word plus a shape.
- Text resizes to 200% with no loss of content or function, including at 360px wide.
- Every interaction keyboard-reachable. Visible focus: 2px ring in `--focus-ring` with 2px offset, never suppressed.
- Touch targets minimum 44px, including the 8px rail markers, which get a 44px hit area.
- Skip link to main content as the first focusable element.
- Semantic HTML: one `h1` per page, correct heading order, real buttons and real links.
- Hindi text carries `lang="hi"`, and **Devanagari gets 4px extra line-height** because the script needs the vertical room.
- Plain language throughout. This is an accessibility control, not a tone preference — cognitive load is the barrier the product exists to reduce.

### Interactions and motion

One orchestrated moment on the page: the hero reveals once, top to bottom, staggered 40ms per element, **on first load only.**

Everything else is a direct response to a user action. No hover transitions on panels. No scroll-triggered entrances. No parallax. No looping decoration. No auto-playing anything.

Under `prefers-reduced-motion: reduce`: remove the reveal and all transforms; keep only opacity changes under 100ms.

### Forbidden — do not generate any of these

**Visual:** gradients of any kind · animated blobs or orbs · glassmorphism · neon or glow effects · dark hero with light text · a card grid of equal rounded boxes with one grey shadow under everything · uniform radius on everything · all-caps letter-spaced eyebrow labels · arrows appended to button text · per-section fade-and-slide entrances · 3D illustrations · isometric graphics · abstract AI imagery · sparkle or wand icons · hero background photography · a scroll-down chevron.

**Legal-sector clichés:** gavels · scales of justice · courthouse columns · law books · a judge's bench · legal-pad textures · serif "authority" typography · navy-and-gold "trust" palettes · stock photos of handshakes or people in suits.

**Content:** invented statistics · user counts · accuracy percentages · testimonials · logo walls · press mentions · awards · partnership claims · lawyer names, firms, phone numbers, ratings or prices · legal-aid directory listings · "revolutionising law" copy · "AI-powered" as a selling point · any claim that Samjo does what a lawyer does.

**Patterns:** login or sign-up · account avatar · email capture · newsletter field · pricing table · countdown timer · "limited spots" · exit-intent modal · cookie-consent dark patterns · sticky bottom CTA bar · hamburger menu (only four nav links; they go in the footer on mobile) · carousel for the two entry options · a chat bubble widget · "Book a demo" · trust badges (SOC 2, ISO, GDPR) · lock or shield icons used as reassurance.

**Labels:** "AI interprets" (use **Samjo interprets**) · "I don't have a document" (use **Something happened**) · "SAMJO" in caps (use **Samjo**) · a Terms of Service link (no such page exists).

### Generate

Two fully responsive artboards for every section: desktop 1440×900 and mobile 390×844. Then verify each holds at 1280×800 and 360×800 without horizontal scroll.

## END OF MASTER PROMPT
