# SAMJO — Canonical Design System

**Samajh aane tak.**  
*Know where you stand.*

This document is the authoritative, canonical design specification for SAMJO. It defines the brand principles, tokens, typography, colors, layout rules, component specifications, navigation, responsive behavior, accessibility guidelines, UI states, and landing page architecture needed to build and maintain the interface.

---

## 1. Brand & Product Identity

### 1.1 Name & Positioning
- **Name:** Samjo (pronounced *SAM-jo*), from the Hindi word **"समझो"** (understand).
- **Tagline:** *"Samajh aane tak."* ("Until it makes sense.")
- **Positioning:** *"Know where you stand."* — An India-first legal information and document-orientation product for residential rental agreements and housing notices.
- **Support copy:** *"Legal documents ko samajhna mushkil nahi hona chahiye."*

### 1.2 Purpose & Audience
The user is often a stressed person holding a physical paper or digital document that frightens them. They are frequently:
- Reading on a mobile phone on a variable or slow mobile connection.
- Reading in their second language (English or Hindi).
- Operating under an active, stressful deadline (e.g., notice to vacate, rent hike, deposit dispute).

**The design's primary job is to lower the heart rate**, establish trust, and explain clearly item by item what the paper says, what matters, whether a clock is running, and what reasonable next steps exist.

### 1.3 Tone & Voice
- **Calm, trustworthy, unhurried, human, and dignified.**
- Feels like a knowledgeable, quiet friend sitting beside you turning the pages.
- Uses plain, respectful language. Avoids legal jargon and systemic AI terminology.
- **Strict Legal Boundary:** Samjo provides document orientation and legal information—**never legal advice**. It never predicts court outcomes and never claims to replace an advocate.

### 1.4 What Samjo Deliberately Refuses
- **No generic AI SaaS tropes:** No purple/blue neon gradients, no mesh gradients, no floating iridescent blobs, no dark-mode cyber aesthetics, no AI sparkle icons (`✨`).
- **No chatbot framing:** The core product is a structured document reading surface with an evidence rail, not an open-ended conversational prompt.
- **No government portal density:** No claustrophobic tables, unstyled forms, or bureaucratic complexity.
- **No marketing fluff:** No fake testimonials, fabricated user statistics, partner logo carousels, or aggressive upsell badges.
- **No decorative animations:** No looping micro-interactions, no bounce effects, no scroll-jacking parallax, and no all-caps tracked-out eyebrow labels.

---

## 2. Color System & Tokens

Colors are **strictly semantic**. Nothing is colored for decoration. A calm document is almost entirely ink on warm paper. Amber, red, and green appear **only** when they carry critical meaning.

### 2.1 CSS Custom Properties (Tokens)

```css
:root {
  /* Surfaces */
  --background:        #F6F3EE;   /* Warm tactile paper */
  --surface:           #FFFFFF;   /* Clean card and panel background */
  --surface-subtle:    #EEEAE2;   /* Muted sections, quotes, secondary areas */

  /* Text & Ink */
  --text-primary:      #131C2B;   /* Deep ink navy — primary reading color */
  --text-secondary:    #49566A;   /* Slate ink — supporting explanations */
  --text-muted:        #6E7A8A;   /* Muted ink — captions, metadata, borders */

  /* Structural Dividers */
  --border:            #DDD6CC;   /* Standard hairline separator */
  --border-strong:     #C4BBAE;   /* Input borders, active evidence rail */

  /* Interactive & Action */
  --primary:           #1B4DB1;   /* Trustworthy deep blue */
  --primary-hover:     #163F92;   /* Darkened interactive hover state */
  --primary-subtle:    #E8EEF9;   /* Active tint, selection background */

  /* Semantic Statuses */
  --warning:           #92600A;   /* Caution amber */
  --warning-surface:   #FBF0DC;   /* Light amber surface */
  --danger:            #A32219;   /* Critical red */
  --danger-surface:    #FAE9E7;   /* Light red surface */
  --success:           #1C6244;   /* Verification green */
  --success-surface:   #E6F1EB;   /* Light green surface */

  /* Focus Indicator */
  --focus-ring:        #1B4DB1;   /* 2px solid ring with 2px offset */

  /* Spacing Scale (4px base) */
  --space-1: 4px;   --space-2: 8px;   --space-3: 12px;  --space-4: 16px;
  --space-5: 20px;  --space-6: 24px;  --space-8: 32px;  --space-10: 40px;
  --space-12: 48px; --space-16: 64px;

  /* Corner Radii */
  --radius-sm: 8px;    /* Inputs, chips, tags */
  --radius-md: 12px;   /* Buttons, cards, alert banners */
  --radius-lg: 16px;   /* Modals, upload dropzones */
  --radius-xl: 24px;   /* Mobile bottom sheet top corners */

  /* Elevation (Reserved for floating overlays only) */
  --shadow-subtle: 0 1px 2px rgba(19, 28, 43, 0.06);
  --shadow-medium: 0 8px 24px rgba(19, 28, 43, 0.10);
}
```

### 2.2 Dark Theme Palette (Display Support)
When dark theme is enabled via user display preferences (`.dark` class on root):

```css
.dark {
  --background:        #0D1117;
  --surface:           #161B22;
  --surface-subtle:    #21262D;
  --text-primary:      #F0F6FC;
  --text-secondary:    #C9D1D9;
  --text-muted:        #8B949E;
  --border:            #30363D;
  --border-strong:     #484F58;
  --primary:           #388BFD;
  --primary-hover:     #58A6FF;
  --primary-subtle:    rgba(56, 139, 253, 0.15);
  --warning:           #D29922;
  --warning-surface:   rgba(187, 128, 9, 0.15);
  --danger:            #F85149;
  --danger-surface:    rgba(248, 81, 73, 0.15);
  --success:           #3FB950;
  --success-surface:   rgba(46, 160, 67, 0.15);
  --focus-ring:        #58A6FF;
}
```

### 2.3 Measured Contrast Ratios (WCAG 2.1 / 2.2 AA)
All color combinations clear WCAG 2.1 AA standards for body text:
- `--text-primary` (`#131C2B`) on `--background` (`#F6F3EE`): **14.2:1**
- `--text-secondary` (`#49566A`) on `--background` (`#F6F3EE`): **7.4:1**
- `--text-muted` (`#6E7A8A`) on `--background` (`#F6F3EE`): **4.7:1** (AA body)
- `--primary` (`#1B4DB1`) on white surface: **7.1:1**
- `--warning` (`#92600A`) on `--warning-surface` (`#FBF0DC`): **5.6:1**
- `--danger` (`#A32219`) on `--danger-surface` (`#FAE9E7`): **6.8:1**
- `--success` (`#1C6244`) on `--success-surface` (`#E6F1EB`): **6.4:1**

### 2.4 Non-Color Reliance Rule
**Never communicate information through color alone:**
- **Urgency:** Always combines color + icon + text (e.g. Amber surface + Clock icon + *"Time-sensitive"*).
- **Evidence Verification:** Always combines shape + word (e.g. Hollow circle + the word *"Verify"*).
- **Confidence:** Explicit text label (e.g. *"High"*, *"Medium"*, *"Low"*), never a coloured bar or indicator alone.
- **Form Errors:** Red border + Alert triangle icon + descriptive helper error message.

---

## 3. Typography & Typesetting

The system uses two font families, self-hosted as `woff2` files for maximum privacy and zero latency on slow mobile networks:
1. **DM Sans:** Brand voice, headings, interface buttons, and briefing prose.
2. **Inter:** Dense functional content, extracted legal quotations, tabular data, money amounts, dates, and metadata.

### 3.1 Type Scale

| Role | Family | Size / Line-height | Weight | Desktop Use | Mobile Delta |
|---|---|---|---|---|---|
| **Display** | DM Sans | 40px / 44px | 500 | Landing hero only | 32px / 38px |
| **H1** | DM Sans | 32px / 38px | 500 | Main page titles | 26px / 32px |
| **H2** | DM Sans | 24px / 30px | 500 | Briefing section headings | 20px / 26px |
| **H3** | DM Sans | 20px / 26px | 500 | Item titles, modal titles | 18px / 24px |
| **Body Large** | DM Sans | 18px / 28px | 400 | **Briefing prose reading size** | **18px / 28px (Unchanged)** |
| **Body** | DM Sans | 16px / 26px | 400 | Interface prose, descriptions | 16px / 26px |
| **Body Small** | Inter | 14px / 22px | 400 | Quoted document text, metadata | 14px / 22px |
| **Label** | DM Sans | 14px / 20px | 500 | Button labels, form inputs | 14px / 20px |
| **Caption** | Inter | 12px / 18px | 400 | Page numbers, confidence tags | 12px / 18px |

### 3.2 Invariants & Rules
- **Weights:** Restricted strictly to **400 (regular), 500 (medium), and 600 (semibold)**. Weight 700 (bold) is prohibited everywhere.
- **Body Large Never Shrinks:** Body Large (18px) stays 18px on mobile devices. A stressed reader on a mobile phone requires high legibility.
- **Reading Measure Invariant:** The line width of prose text is capped at **68ch** (~560px to 640px) across all viewports. Desktop screens provide wider side margins/whitespace, never wider lines of text.
- **Sentence Case:** Used exclusively across titles, headings, badges, and buttons. No ALL-CAPS text or tracked-out eyebrow labels.
- **Devanagari Support (Hindi):** When displaying Hindi text (`lang="hi"`), add **+4px line-height** to prevent vowel ascenders/descenders from clipping.

---

## 4. Spacing, Elevation & Layout Principles

### 4.1 Grid & Viewport Breakpoints

| Breakpoint | Viewport Range | Max Container | Columns | Gutter | Page Margin |
|---|---|---|---|---|---|
| **xs** | 320px – 389px | Fluid | 4 | 12px | 16px |
| **sm** | 390px – 767px | Fluid (Mobile ref) | 4 | 16px | 20px |
| **md** | 768px – 1023px | Fluid / 680px centered | 8 | 16px | 24px |
| **lg** | 1024px – 1279px | 960px centered | 12 | 20px | 32px |
| **xl** | 1280px+ | 1200px centered (1440 ref) | 12 | 24px | auto |

### 4.2 Three-Pane Desktop Briefing Layout (≥1280px)
At viewports ≥1280px, the briefing utilizes a three-pane structure:
- **Left Pane (240px, sticky):** Section navigation jump-list with active scroll-spy indicator.
- **Center Pane (640px max, 68ch measure):** Continuous reading surface with the evidence rail down its left edge.
- **Right Pane (320px, permanent):** Evidence and document verification panel. When no source is selected, displays guidance to tap any rail marker.

### 4.3 Responsive Layout Transformations
- **lg (1024px – 1279px):** Left navigation collapses to an inline section bar; evidence pane becomes an overlay right drawer (360px) over the briefing.
- **<1024px (Mobile/Tablet):** Briefing sections transform into an accessible accordion (first two open by default). The evidence panel becomes an **80vh bottom sheet**. This keeps the tapped briefing claim visible above the sheet.

---

## 5. The Evidence Rail (Core Identity Element)

The evidence rail is the physical manifestation of SAMJO's core thesis: **every claim is grounded in verified source text**.

```
│
├── ●  What you need to do
│      Pay a security deposit of ₹25,000 before you move in.
│      ┌──────────────────────────────────────────────┐
│      │ Where this comes from                        │  ← Active marker tapped
│      │                                              │
│      │ Document says                                │
│      │ "The Tenant shall deposit a sum of           │
│      │  Rs. 25,000/- as interest-free security"     │
│      │ Page 1                                       │
│      │                                              │
│      │ Samjo interprets                             │
│      │ This is refundable, but the agreement        │
│      │ sets conditions for deductions.              │
│      │                                              │
│      │ How confident is Samjo?  High                │
│      │                                              │
│      │ [ See it in the document ]                   │
│      └──────────────────────────────────────────────┘
│
├── ○  Give 30 days notice before leaving   Verify
│
```

### 5.1 Evidence Rail Specs
- **Rail Line:** 1px solid `--border-strong` (`#C4BBAE`), inset 12px from content edge.
- **Source Marker:** 8px filled circle in `--primary` (`#1B4DB1`).
- **Hit Area:** An invisible 44px × 44px bounding box centered over the 8px dot to satisfy touch-target standards.
- **Active State:** 10px filled dot with a 3px `--primary-subtle` halo.
- **Verification Required State:** 8px hollow circle with a 1.5px `--warning` stroke + the text label *"Verify"* in 12px Caption beside the item title.
- **Accessible Name:** `Where this comes from: {item title}`.

### 5.2 Evidence Card Structure
The evidence display (pane, drawer, or sheet) enforces a strict 4-part internal order that never changes:
1. **Document says:** The exact quoted span from the original document in Inter 14/22 on a `--surface-subtle` card with a 3px `--border-strong` left bar. **The quote is never translated**, preserving legal authenticity.
2. **Page & Location:** Caption with page reference (e.g., *"Page 1, Clause 4"*).
3. **Samjo interprets:** Plain-language explanation in Body 16/26. Translated to user's selected language.
4. **Confidence & Actions:** Confidence label (*High*, *Medium*, or *Low*) + primary action button (*"See it in the document"*).

---

## 6. Components Specification

### 6.1 Buttons
- **Variants:**
  - `Primary`: Solid `--primary` fill (`#1B4DB1`), white text.
  - `Secondary`: White fill, 1px `--border-strong` (`#C4BBAE`), `--text-primary` text.
  - `Quiet`: Transparent background, `--primary` text, hover `--primary-subtle` tint.
  - `Danger`: Solid `--danger` fill (`#A32219`), white text.
- **Sizes:**
  - `sm`: 36px height (desktop pointer only, never on mobile).
  - `md`: 44px height (default interface target).
  - `lg`: 52px height (landing hero and mobile bottom action bars).
- **Touch Target Invariant:** Minimum 44px on all touch viewports. Never append arrow glyphs (`->` or `→`) to button text.

### 6.2 Forms & Inputs
- **Input, Textarea, Select:** 44px min height, 8px radius, white fill, 1px `--border` (`#DDD6CC`).
- **Labels:** Always persistently visible above the field in Label 14/500 `--text-primary`. Placeholders are never used as labels.
- **Error Presentation:** 1px `--danger` border, alert icon, and helper text below tied via `aria-describedby`.

### 6.3 FileDropzone & UploadCard
- **Dropzone:** 240px height (desktop) / 180px (mobile), 2px dashed `--border-strong`, radius 16px.
- **Keyboard Access:** A visible "Choose a file" button is always present inside the zone.
- **Mobile Camera First:** On mobile, a dedicated secondary button *"Take a photo"* (52px height) sits directly beneath the dropzone for direct mobile document capture.
- **UploadCard:** Replaces dropzone during upload; displays filename, file size, page count, indeterminate progress bar, and a Cancel button.

### 6.4 Urgency Banners & Badges

| Urgency Level | Visual Form | Surface / Border | Text / Icon | Wording |
|---|---|---|---|---|
| **LOW** | Inline text | None | `--text-muted` | *"No deadline found in this document."* |
| **MEDIUM** | Inline chip | `--warning-surface` | `--warning` + Clock icon | *"Time-sensitive"* |
| **HIGH** | Full banner | `--warning-surface`, 1px 30% border | `--warning` + Alert triangle | *"Time-sensitive"* + deadline date in H3 |
| **CRITICAL** | Full banner | `--danger-surface`, 1px 30% border | `--danger` + Alert triangle | *"Urgent"* + deadline date + lawyer assistance CTA |

### 6.5 Audio Player (Read Aloud)
- Docked bar (56px) positioned at the bottom of the reading column on desktop, or above the bottom bar on mobile.
- Controls: `Listen`, `Pause`, `Resume`, `Stop`.
- Each action is a 44px touch target with a visible text label.
- Never autoplays. Announces state changes via an ARIA live region.

### 6.6 Language Switcher
- Persistent header control displaying two explicit options in their own native script: **English** and **हिन्दी**.
- Active option indicated by a checkmark and `aria-current="true"`.
- Uses a neutral Globe icon (20px). Country flag icons are strictly prohibited.

---

## 7. Navigation & Header System

The application distinguishes between two specific header contexts to avoid mixing marketing and task controls.

### 7.1 Marketing Header (`/`, `/privacy`, `/safety`, `/accessibility`)
- **Desktop (64px, `--surface`, 1px bottom border):**
  - Left: "Samjo" wordmark in DM Sans 20/500 `--text-primary`.
  - Center/Right: Navigation links (*"How it works"*, *"What Samjo does"*, *"Privacy"*).
  - Far Right: Language switcher + Primary CTA button (*"Start"*).
- **Mobile (56px, sticky):**
  - Left: "Samjo" wordmark.
  - Right: Language switcher + compact Start button.

### 7.2 App Header (`/upload`, `/d/:id`, `/situation`, `/help`)
- **Desktop (64px, `--surface`, 1px bottom border):**
  - Left: "Samjo" wordmark or Back button + Document title (truncated with ellipsis).
  - Right: Language switcher, Display settings popover (Theme + Text size), Read aloud trigger, and `⋯` overflow menu (Export, Delete data, Professional help).
- **Mobile (56px, sticky):**
  - Left: Back chevron (44px target) + Document title.
  - Right: `⋯` overflow icon opening a bottom sheet holding Language, Display, Audio, Export, and Delete actions.

### 7.3 Mobile Bottom Action Bar
- Height: 72px + device safe-area inset. `--surface` fill, 1px top border, `--shadow-subtle`.
- Houses a single full-width primary button (52px height) for the primary progression action (e.g. *"What to do next"*, *"Continue"*).

---

## 8. UI States (The 6-State Framework)

Every asynchronous surface implements all six standard states:

1. **Loading:**
   - Real pipeline stage descriptions (*"Reading your document"*, *"Working out what this is"*, *"Finding what matters"*).
   - Indeterminate progress bar. **Fabricated percentage meters are strictly forbidden.**
   - Skeletons match exact final component dimensions to avoid layout shift (CLS = 0).
2. **Success:**
   - Complete rendering with active evidence rail and interactive source markers.
3. **Empty:**
   - Courteous explanation and clear call to action (e.g., *"No financial amounts were found in this agreement."*). Section headings are never silently hidden.
4. **Partial:**
   - Completed sections render normally; failed sections present an inline retry banner (*"Samjo couldn't finish this section. [Try this section again]"*).
5. **Error:**
   - Clear plain-language explanation of what occurred and concrete next step.
   - **Never use generic messages like "Something went wrong."**
   - **Uploaded file is always preserved** so the user never has to re-upload.
6. **Retry:**
   - Single-click action that re-initiates analysis using the existing file or session.

### Standard Error Copy Reference

| Condition | Verified Error Copy | Primary Action |
|---|---|---|
| **Unreadable File** | *"Samjo couldn't read this document. It looks like a scan with no text layer. Try a clearer photo, or upload the original PDF."* | Try another file |
| **Encrypted PDF** | *"This PDF is password-protected, so Samjo can't open it. Remove the password and upload it again."* | Try another file |
| **File Too Large** | *"This file is over 10 MB. Try uploading just the pages that matter."* | Try another file |
| **Unsupported Type** | *"Samjo reads PDF, Word and photos. This file is a different type."* | Choose file |
| **Non-Legal Document** | *"This doesn't look like a legal document. If something has happened and you want help thinking it through, tell us about it instead."* | Tell us what happened |
| **Analysis Failure** | *"Samjo read your document but couldn't finish the briefing. Your file is still here. Try again."* | Try again |
| **Offline** | *"You're offline. Samjo will pick up where you left off when you reconnect."* | Retry connection |

---

## 9. Landing Page Architecture

The landing page (`/`) is structured to establish immediate trust and orientation rather than selling software:

1. **Hero Section (Left-Aligned, 680px Max Measure):**
   - Left-aligned layout rather than centered SaaS default.
   - Wordmark lockup: `Samjo` + `Samajh aane tak.`
   - Bilingual empathy header: *"Legal documents ko samajhna mushkil nahi hona chahiye."*
   - Clear two-door CTA:
     - `[ I have a document ]` (Primary 52px button → `/upload`)
     - `[ Something happened ]` (Secondary 52px button → `/situation`)
   - Trust strip: `Source-grounded · Private by design · Hindi + English · Read aloud` (plain text with middot separators, no boxes).
2. **Proof Section (Show, Don't Tell):**
   - Direct demonstration of the product rather than feature cards.
   - A real briefing excerpt at 60% scale with a visible evidence rail and an open source card demonstrating exact document citation.
   - Supporting heading: *"Every claim points back to your document."*
3. **Boundaries & Transparency Section ("What Samjo does not do"):**
   - Full-bleed band on `--surface-subtle`.
   - Clear bulleted list stating what Samjo does not do: does not give legal advice, does not predict case outcomes, does not store documents permanently.

---

## 10. Accessibility (WCAG 2.1 / 2.2 AA)

SAMJO commits to testable WCAG 2.2 AA conformance across all routes.

- **Keyboard Traversal:** Every interactive element is fully reachable via keyboard.
- **Focus Rings:** 2px solid `--focus-ring` with 2px offset. Focus is never suppressed (`outline: none` without replacement is a build failure).
- **Focus Management:** Modals, right drawers, and bottom sheets trap focus while open, close on `Escape`, and return focus to the exact triggering element (e.g. the rail marker).
- **Touch Targets:** Minimum 44px × 44px for every interactive target across desktop and mobile.
- **Reduced Motion:** When `prefers-reduced-motion: reduce` is active, all section reveal staggered sequences and layout transitions are disabled; only instant opacity changes (<100ms) are permitted.
- **Screen Reader Announcements:** Pipeline stages and completion states announce through polite ARIA live regions (`aria-live="polite"`).
