# Samjo Landing Page — Information Architecture

Source of truth: the 16 specs in this directory. Every claim below traces to one. Deviations from the brief are flagged in §A.

---

## A. Decisions taken against the brief, with spec citations

| Brief said | Spec says | Resolution |
|---|---|---|
| Entry 2 = "I don't have a document" | UX_FLOWS §8 hero: `[ I have a document ]  [ Something happened ]`; §3 flow named "situation" | **"Something happened"**. The spec wording is characterization-first — PRD §1 says people who do not recognise a situation as legal never enter a help pathway, so the label must describe an event, not the absence of a file |
| "SAMJO" | Every spec writes "Samjo" | **"Samjo"** in all copy |
| Include Terms in footer | No terms page in any spec. Routes are `/privacy`, `/safety`, `/accessibility` (UX_FLOWS §1) | **Omitted.** Flagged, not invented |
| 16 sections | UX_FLOWS §8: "Hero carries the brand line and the two entries. Nothing else competes." PRD §5 bans "dashboard sprawl" | **14 sections.** Consolidations in §C |
| Single CTA → `/start` → chooser | UX_FLOWS §8 puts both entries **in the hero**; `/start` exists as its own route | **Both.** Hero offers the two entries directly (spec §8 verbatim); `/start` serves the final CTA and anyone arriving without hero context |
| Trust strip as its own section | UX_FLOWS §8 places it as one line under the CTAs: "Source-grounded · Private by design · Hindi + English" | **Merged into hero.** A separate strip would compete with the hero, which §8 forbids |
| "What Samjo helps you understand" as its own section | The briefing's own section names (UX_FLOWS §4) already are that list | **Merged into the product showcase.** Showing beats listing |

Two further constraints the brief did not mention but which bind the design:

- **DESIGN_SYSTEM §1 forbids a card grid.** "Cards float and detach; the rail connects. Sections are separated by space and a hairline, not by boxes." No section below may be built as a row of equal rounded cards. The two exceptions are the two entry choices (§07) and the FAQ accordion.
- **DESIGN_SYSTEM defines no dark theme.** ACCESSIBILITY §5 gates axe on "light and dark" — an unresolved contradiction (logged as C5 in RESOURCE_AUDIT.md). Build light only; do not invent dark tokens.

---

## B. Scope honesty constraint — applies to the whole page

PRD §8 fixes the MVP document family: **residential rental agreements, and legal notices arising from rental and housing situations.**

The page must not imply Samjo reads any legal document. Every place the page names what it accepts, it names the family. This is not a hedge — PRD §9.3 makes "this doesn't look like a legal document" a real, tested behaviour, and a visitor who uploads an employment contract because the landing page implied it would work has been misled by the marketing, not failed by the product.

---

## C. Final section order, and why

UX_FLOWS §8 sets the opening sequence explicitly: hero → "one short section showing a real briefing fragment with a visible source link, because the differentiator has to be seen rather than claimed" → "then the limits, stated plainly."

So the showcase precedes the problem statement. The differentiator is demonstrated before anything is explained.

| # | Section | Spec anchor |
|---|---|---|
| 01 | Header | UX_FLOWS §1 (persistent header control), DESIGN_SYSTEM §6 (LanguageSwitcher) |
| 02 | Hero | UX_FLOWS §8 |
| 03 | Product showcase — the briefing | UX_FLOWS §4, §8 |
| 04 | Evidence — Document says / Samjo interprets / Verify | AI_SCHEMAS core principle, DESIGN_SYSTEM §5 |
| 05 | The problem | PRD §1 |
| 06 | How Samjo works | UX_FLOWS §2, ARCHITECTURE §2 |
| 07 | Two ways to start | PRD §7, UX_FLOWS §2–3 |
| 08 | Language, read-aloud and access | PRD §9.8, ACCESSIBILITY §1 |
| 09 | Privacy | PRD §9.9, SECURITY §5, DATABASE retention |
| 10 | What Samjo does not do | AI_SAFETY §1, §3, §7 |
| 11 | Preparing for professional help | PRD §3 job 5, AI_SAFETY §5 |
| 12 | Questions people ask | derived only from tested behaviour |
| 13 | Final CTA | UX_FLOWS §1 (`/start`) |
| 14 | Footer | UX_FLOWS §1 static routes |

**Removed from the brief's list:** the standalone trust strip (03) and "What Samjo helps you understand" (05), both merged per §A.

---

## 01 — Header

**Purpose** Persistent orientation and the language control. Nothing else.
**User question** Where am I, and can I read this in my language?
**Hierarchy** Wordmark (left) → nav (centre, desktop only) → LanguageSwitcher + primary action (right).
**CTA** Primary: `Start` → `/start`. Secondary: none.
**Component** Sticky header, 64px, `--surface` at full opacity with a 1px `--border` bottom edge. No shadow — DESIGN_SYSTEM §4 reserves elevation for things that genuinely float.
**After seeing it** This is a real product; I can switch to Hindi immediately.
**Desktop** Wordmark, then nav links (How it works · What Samjo does · Privacy), then `हिन्दी / English` switcher, then `Start`.
**Mobile** Wordmark + switcher + `Start` only. Nav collapses into the footer rather than a hamburger — four links do not justify a drawer, and a drawer adds a focus trap to maintain.
**Accessibility** Skip link to `#main` as the first focusable element (ACCESSIBILITY §1). Switcher labels in their own script: `English`, `हिन्दी` (DESIGN_SYSTEM §6). Header nav is a `<nav>` with an accessible name. 44px minimum targets.
**Must NOT contain** Login, Sign up, account avatar, search, notification bell, product dropdown, "Book a demo", cart.

---

## 02 — Hero

**Purpose** Deliver the whole proposition and both entries in one screen.
**User question** What is this, is it for me, what do I do now?
**Hierarchy** Wordmark lockup + tagline → English support line → Hindi context line → two-sentence explanation → two entry buttons → trust meta line → briefing preview.
**CTA** Primary: `I have a document` → `/upload`. Secondary: `Something happened` → `/situation`.
**Component** Two-column on desktop: copy left, live briefing preview right. The preview is a real rendered briefing fragment with a visible source marker on the evidence rail — not an illustration, not a mockup frame, not a browser chrome graphic.
**After seeing it** Samjo reads a legal document I already have and tells me what matters in it, in my language, without an account.
**Desktop** 1440: copy column 5/12, preview 6/12, 1/12 gutter each side. Copy measure capped at 68ch (DESIGN_SYSTEM §3). Preview optically aligned to the headline baseline, not vertically centred. Display type 40/44.
**Mobile** Single column, this order: tagline → headline → explanation → two full-width buttons → trust line → preview. **Preview comes after the CTAs**, because a phone user should not scroll past a picture to reach the action. Display steps down to 32/38.
**Accessibility** One `h1` (ACCESSIBILITY §1). The Hindi line carries `lang="hi"` so screen readers pronounce Devanagari correctly, and Devanagari line-height gets +4px (DESIGN_SYSTEM §3). Both buttons are 52px (`lg`). The preview is decorative-adjacent but contains real text — mark it `aria-hidden="true"` and provide a concise text equivalent, so a screen-reader user hears a summary rather than a disembodied briefing fragment.
**Must NOT contain** Gradient background, animated blobs, invented statistics, user counts, testimonials, logo wall, "revolutionising law", any claim Samjo does what a lawyer does, a "no credit card required" badge (there is no paid tier to contrast with), an email capture field, a video, a scroll-down chevron.

---

## 03 — Product showcase: the briefing

**Purpose** Show what the user actually receives, using the product's own section names. This is the section UX_FLOWS §8 mandates below the fold.
**User question** What will I get?
**Hierarchy** Section heading → one line of framing → the briefing rendered in its fixed hierarchy → one line pointing at the evidence rail.
**Content shown, in the fixed order of UX_FLOWS §4 — this order is not negotiable, it encodes the product thesis:**

| Order | Label (verbatim from spec) | Shown in preview | Emphasis |
|---|---|---|---|
| 1 | Urgency banner — `Time-sensitive` | Yes, HIGH state | **Strongest.** Top of the frame, `--warning-surface`, icon + word + colour |
| 2 | What this is | Yes | High — this is the orientation payload |
| 3 | What you need to do | Yes, 2 items with source markers | **Strongest after urgency** |
| 4 | Watch out | Yes, 1 item | Medium |
| 5 | Important details | Yes, 1 money item in Inter tabular numerals | Medium |
| 6 | Dates that matter | Yes, 1 item carrying `Verify` | Medium |
| 7 | Questions to ask | Collapsed to a count | Low |
| 8 | What to do next | Persistent primary action | Low in the preview |

**Component** A single continuous reading surface with the evidence rail down its left edge — not a grid of cards (DESIGN_SYSTEM §1). One source marker is shown in its open state so the connection between claim and quote is visible without interaction.
**After seeing it** This is a briefing, not a summary. Every line traces back to my document.
**Desktop** Full-bleed centred column, max 900px. The rail and its markers are the visual anchor. Sections separated by space and a hairline, never boxes.
**Mobile** Same vertical order, full width, 16px gutters. Sections 7 and 8 collapse to labels. The rail narrows but never disappears — it is the identity element.
**Accessibility** Real heading hierarchy (`h2` for the section, `h3` per briefing section) so the structure is navigable. Money and dates render in Inter tabular numerals at Body Small with sufficient contrast. `Verify` appears as a word, never a bare coloured dot (ACCESSIBILITY §1).
**Must NOT contain** A fabricated percentage or progress bar, a confidence score shown as a raw float (AI_SCHEMAS maps confidence to High/Medium/Low), a chart, a dashboard layout, invented document types outside the MVP family, a fake lawyer name, a real person's name or address in the sample.

---

## 04 — Evidence: Document says / Samjo interprets / Verify

**Purpose** The differentiator, given its own section and the page's strongest visual treatment.
**User question** How do I know Samjo isn't making this up?
**Hierarchy** Section heading → one-sentence thesis → the three-state panel → the drop rule stated plainly.
**Exact labels — from AI_SCHEMAS and DESIGN_SYSTEM §5, do not paraphrase:**

| Label | Content | Provenance shown |
|---|---|---|
| `Where this comes from` | Panel title | — |
| `Document says` | Verbatim quote + `Page 1` | The document. Verified. |
| `Samjo interprets` | Plain-language reading | Samjo, labelled as interpretation |
| `How confident is Samjo?` | `High` / `Medium` / `Low` | Samjo's own uncertainty |

**Component** The evidence panel exactly as specified in DESIGN_SYSTEM §5: rail at 1px `--border-strong` inset 12px, 8px filled `--primary` marker with a 44px hit area, three labelled blocks never visually merged.
**After seeing it** Samjo quotes my document and labels its own interpretation separately. If it can't quote it, it doesn't say it.
**Desktop** Two columns: thesis and the drop rule left, the panel right at a larger scale than in §03 — this is the one place the design spends visual weight (DESIGN_SYSTEM §1).
**Mobile** Single column, panel below the thesis, full width. The three blocks stack with clear label separation; they must not become a single paragraph at any width.
**Accessibility** Each of the three states is a separately labelled DOM region (TESTING #44). The source marker is a real button with an accessible name in the spec's form: "Where this comes from: pay a security deposit." Contrast holds on `--surface`.
**Must NOT contain** The phrase "AI interprets" — the spec label is **"Samjo interprets"**. Also no accuracy percentage, no "99% accurate", no "hallucination-free", no claim of legal correctness, no fuzzy-match language.

---

## 05 — The problem

**Purpose** Make the reason the product exists legible, without fear marketing.
**User question** Why does this exist, and is my situation in it?
**Hierarchy** Section heading → the four questions a person cannot answer → one line naming why summarising fails.
**Content** The four questions from PRD §1, as the section's spine:
1. What is this document, and is it serious?
2. Which parts of it actually affect me?
3. Is a clock running?
4. What do I do next, and what should I ask a professional?

**After seeing it** The problem isn't that the words are hard. It's that I can't tell what matters or whether I'm late.
**Desktop** The four questions as a numbered vertical list at Body Large, left-aligned within the 68ch measure, generous leading. Not a 2×2 grid of icon cards.
**Mobile** Same list, same order, full width. No collapsing — this is short and it is the emotional hinge of the page.
**Accessibility** An ordered list, because the ranking is meaningful. Plain language per UX_FLOWS §7, which ACCESSIBILITY §1 treats as an accessibility control rather than a tone preference.
**Must NOT contain** Fear-based statistics, "millions of Indians", eviction imagery, a photograph of a distressed person, courtroom photography, a gavel, scales of justice, red warning iconography, invented survey data.

---

## 06 — How Samjo works

**Purpose** Remove uncertainty about the mechanics in four steps.
**User question** What happens after I press the button?
**Hierarchy** Section heading → four steps → one line on timing.
**Content** Four steps derived from UX_FLOWS §2 and the real pipeline stages, in user language. The step labels reuse the actual processing copy the user will later see, so the promise and the product match (UX_FLOWS §7: "Actions keep their name across the whole flow"):
1. Show us the document, or tell us what happened
2. Samjo reads it and works out what it is
3. Samjo finds what matters — obligations, money, dates, risks
4. You get a briefing, with every point traceable to your document

**After seeing it** Three steps, about a minute, and I can see where each answer came from.
**Desktop** Four steps horizontally, connected by a hairline rule, numerals in DM Sans 500. Numbered markers are permitted here and in the lawyer-prep checklist only (DESIGN_SYSTEM §1 restricts 01/02/03 markers to genuine sequences — this is one).
**Mobile** Vertical, connected by a left-hand hairline that echoes the evidence rail. Numerals retained.
**Accessibility** Ordered list. Step numerals are decorative if the list markup already conveys order — do not double-announce.
**Must NOT contain** LLM, AI model, OCR, pipeline, extraction, embeddings, vector database, RAG, prompt, schema, token, Gemini, API, "powered by" anything. UX_FLOWS §7 bans system vocabulary from the interface, and that applies here most of all.

---

## 07 — Two ways to start

**Purpose** Present both entries as equally legitimate, while being honest that they differ in what they can produce.
**User question** Which one is me?
**Hierarchy** Section heading → two parallel choices → the honest asymmetry line.
**Content**

| | Entry A | Entry B |
|---|---|---|
| Label | `I have a document` | `Something happened` |
| Route | `/upload` | `/situation` |
| Description | Show us a rental agreement or a housing notice. Samjo tells you what it says and what matters in it. | Tell us what happened in your own words. Samjo helps you work out where you stand and what to ask. |
| Accepts | PDF, Word or a photo, up to 10 MB and 30 pages | A few plain questions, one at a time |
| Produces | A source-grounded briefing | Orientation and questions — **not** obligations, deadlines or money items |

**The asymmetry must be stated, not implied.** UX_FLOWS §3: "Without a document there is nothing to ground against... Making that asymmetry visible is honest and is itself a safety feature." The line: *"Without a document there's nothing to quote from, so this path gives you orientation and questions rather than a line-by-line briefing."*
**After seeing it** Both paths are real. The document path gives more because it has something to quote.
**Desktop** Two equal-width panels side by side, identical internal structure, identical CTA weight. This is one of the two permitted card usages. Equal visual weight is the requirement — neither may look like the default.
**Mobile** Stacked, `I have a document` first (PRD §2: personas A and B drive the MVP), equal height, full-width CTAs. Not a carousel — a carousel hides the second option.
**Accessibility** Each panel's CTA has an accessible name that works out of context ("Start with a document", not "Start"). Both 52px. The asymmetry line is associated with panel B via `aria-describedby`, not left as ambient text.
**Must NOT contain** Any suggestion that the situation flow yields document-grounded evidence, a "recommended" badge on either, a comparison table implying one is inferior, an upsell, a third option.

---

## 08 — Language, read-aloud and access

**Purpose** Communicate reach as a user benefit, not a compliance table.
**User question** Can I actually use this — in my language, on my phone, read aloud?
**Hierarchy** Section heading → four short benefit statements → one honest line on voice availability.
**Content, each traceable:**

| Benefit | Spec |
|---|---|
| Full Hindi and English, interface and briefing | PRD §9.8 |
| Read aloud, with pause and resume, never autoplaying | PRD §9.8, DESIGN_SYSTEM §6 |
| Works on a 360px phone screen | ACCESSIBILITY §4 |
| Keyboard and screen-reader usable throughout | ACCESSIBILITY §1 |

**The honest line, required by ACCESSIBILITY §1:** read-aloud uses the voices already on the device, so a Hindi voice depends on the phone. Where none exists Samjo says so rather than reading Hindi in an English voice. **Do not omit this** — it is the difference between a claim and a promise.
**After seeing it** This was built for me to use in Hindi on a cheap phone, and it tells me when something won't work.
**Desktop** Four statements in two columns, quiet typography, no icon set. Contained, not a feature grid.
**Mobile** Single column list.
**Accessibility** No colour-only meaning. Devanagari examples carry `lang="hi"`.
**Must NOT contain** A WCAG conformance badge, "fully accessible", "AAA", an accessibility certification, a list of supported screen readers as a logo row, "works for every age" (ACCESSIBILITY explicitly rejects this framing), more Indic languages than Hindi and English — those are post-MVP (PRD §10).

---

## 09 — Privacy

**Purpose** State the data handling accurately, including the part that requires disclosure.
**User question** What happens to my document?
**Hierarchy** Section heading → four factual statements → link to `/privacy`.
**Content, each traceable and each literally true:**

| Statement | Spec |
|---|---|
| No account. No email, no phone number, no password. | SECURITY §4, PRD §9.9 |
| Your document and its text are deleted within 24 hours, or the moment you ask. | PRD §9.9, `DOCUMENT_TTL_HOURS=24` |
| Your document's text is never written to our logs. | SECURITY §6 |
| Your document's text is sent to an AI provider to be analysed. | SECURITY §5 |

**The fourth statement is mandatory and must not be softened.** SECURITY §5: "The privacy page states plainly that document text is sent to an LLM provider for analysis, because burying that would be the kind of omission this product exists to help people notice." A privacy section that omits it fails the product's own standard.
**After seeing it** They hold almost nothing, delete it fast, and they told me the part I'd have wanted to know.
**Desktop** Four statements, equal weight, no iconography. Deliberately plain — this section earns trust by being unadorned.
**Mobile** Single column.
**Accessibility** Plain language. `/privacy` link has a descriptive accessible name.
**Must NOT contain** "Your data can never be seen by anyone", "military-grade encryption", "bank-level security", a lock icon as reassurance, SOC 2, ISO 27001, GDPR or DPDP compliance badges, "we never share your data" (unqualified and therefore false, given the AI provider), a padlock illustration, zero-knowledge claims.

---

## 10 — What Samjo does not do

**Purpose** Make the boundary understandable without sounding defensive.
**User question** What can't it do, and will it pretend otherwise?
**Hierarchy** Section heading → what it does, in one line → what it does not do, as four plain statements → the canonical refusal, quoted.
**Content** From AI_SAFETY §1, §3 and §7:

Does: explains what your document says, identifies what matters, flags what's time-sensitive, helps you prepare.

Does not: predict how a dispute will turn out · tell you whether to sign · decide whether a clause is enforceable · replace a lawyer.

**Quote the canonical refusal verbatim** (AI_SAFETY §3) so the page demonstrates the behaviour rather than describing it:
> "I can help you understand the document, identify what it says, highlight issues to discuss with a legal professional, and prepare questions. I can't predict the outcome of a legal dispute."

**After seeing it** It's clear about its limits, and it showed me exactly what it says when I push past them.
**Desktop** Two columns — does / does not — with the quote below, full measure, set apart by space rather than a box.
**Mobile** Stacked, "does" first. The quote sits last.
**Accessibility** Styled distinctly from the urgency treatment. AI_SAFETY §8: the high-risk escalation message must not inherit a disclaimer's learned invisibility, and the inverse holds too — this must not look like an alarm.
**Must NOT contain** A red warning banner, a legal-disclaimer wall of small print, an "I understand" checkbox, a modal, a terms acceptance gate, defensive hedging in every sentence, the word "liability".

---

## 11 — Preparing for professional help

**Purpose** Show the safest high-value job Samjo does (PRD §3: "generating good questions requires no legal conclusion at all").
**User question** What do I do with this once I have it?
**Hierarchy** Section heading → what the prep gives you → a sample question with its rationale → one line on escalation.
**Content** Per PRD §3 job 5 and AI_SAFETY §5: questions worth asking, with the reason each one matters; what's still unclear, named explicitly; what to take with you. Plus: where a document looks time-sensitive or high-risk, Samjo puts getting help above reading further.
**Component** A short numbered checklist — the second permitted use of 01/02/03 numerals (DESIGN_SYSTEM §1), because a checklist genuinely is a sequence. One sample question shown with its rationale.
**After seeing it** I'll walk into a consultation knowing what to ask instead of paying someone to explain the basics.
**Desktop** Checklist left, one sample question with rationale right.
**Mobile** Stacked, checklist first.
**Accessibility** Ordered list. Sample question and rationale programmatically associated.
**Must NOT contain** Any lawyer name, firm, phone number, rating, price, availability, "verified lawyer", a directory, a booking flow, a legal-aid listing, a map, "find a lawyer near you". AI_SAFETY §7 prohibits a fabricated lawyer directory; PRD §10 defers a real one to post-MVP sourced from published NALSA data. **`professional_help.pathways` stays a curated placeholder** (AI_SCHEMAS) — the landing page shows the shape, never entries.

---

## 12 — Questions people ask

**Purpose** Resolve the objections that stop someone starting.
**User question** The specific thing still bothering me.
**Component** Accordion (DESIGN_SYSTEM §6, Radix). First item open. Second permitted card-ish usage.
**Ten questions — every answer traces to tested behaviour; nothing speculative:**

| Q | Answer basis |
|---|---|
| What is Samjo? | README, PRD §1 |
| Do I need an account? | SECURITY §4 — no |
| What can I upload? | PRD §9.1 — PDF, Word, JPEG, PNG; 10 MB; 30 pages |
| What kinds of documents does Samjo handle right now? | PRD §8 — rental agreements and housing notices; says so plainly |
| Can I use Samjo in Hindi? | PRD §9.8 |
| Does Samjo give legal advice? | AI_SAFETY §1 — no, with the boundary |
| Can Samjo tell me if I'll win? | AI_SAFETY §3 — canonical refusal |
| How does Samjo show where something came from? | AI_SCHEMAS — quote, page, verified |
| What happens to my document? | PRD §9.9, SECURITY §5 — includes the AI-provider disclosure |
| Can I listen to the briefing? | PRD §9.8 — yes, with the device-voice caveat |
| What if Samjo can't find something in my document? | TESTING #28 — says it isn't there rather than inventing it |
| What if my document is a blurry photo? | PRD §9.2 — briefing with a visible low-confidence warning |

**Must NOT contain** Pricing, refunds, plans, enterprise, integrations, API access, SLA, uptime, team seats, a question about a capability not in the specs, "Is my data used to train AI?" answered with an unqualified no — the honest answer depends on the provider tier and is not settled (see RESOURCE_AUDIT.md §0.1). **Omit that question until the tier decision is made.**

---

## 13 — Final CTA

**Purpose** Return to the single action, calmly.
**User question** Alright — where do I start?
**Hierarchy** Heading → one line → primary CTA → one line of reassurance.
**CTA** Primary: `Start with Samjo` → `/start`, which is the "Choose how you want to start" chooser (UX_FLOWS §1). Secondary: `How it works` → anchor to §06.
**After seeing it** One button, no signup, and I know what's behind it.
**Desktop** Centred, generous vertical space, `--surface-subtle` band to close the page. No gradient.
**Mobile** Full-width primary button; secondary as a text link beneath.
**Accessibility** The CTA's accessible name states the destination. 52px.
**Must NOT contain** Countdown timer, "limited spots", "join the waitlist", email capture, urgency language, exit-intent modal, "Don't miss out", social proof counter.

---

## 14 — Footer

**Purpose** Static routes and the standing disclaimer.
**Hierarchy** Wordmark + tagline → three link groups → disclaimer → language switcher.
**Links — only routes that exist in UX_FLOWS §1:**

| Group | Links |
|---|---|
| Product | How it works (anchor) · Two ways to start (anchor) |
| Limits and safety | What Samjo does and doesn't do → `/safety` |
| Privacy and access | Privacy → `/privacy` · Accessibility → `/accessibility` |

**Disclaimer, verbatim from AI_SCHEMAS:**
> "Samjo gives legal information to help you understand your document and prepare. It is not legal advice and not a substitute for a lawyer."

**Jurisdiction line, from AI_SAFETY §6:** `India (verify)` — the MVP assumes India and says so.
**Desktop** Three columns plus a wordmark column; disclaimer full-width beneath a hairline.
**Mobile** Stacked groups, disclaimer last, switcher repeated for reach.
**Accessibility** `<footer>` landmark. Link groups as lists with headings. Disclaimer is real text, never an image.
**Must NOT contain** A company name, registered address, CIN, GST number, copyright line naming a legal entity, Terms of Service (no such page exists — **flagged**), social media icons, newsletter signup, "Made with ❤️", a language dropdown listing unsupported languages, careers, press, investors, a status page.

---

## D. Story arc check

Hero states it → showcase proves it → evidence explains why it can be trusted → problem explains why it matters → how-it-works removes friction → two ways to start routes → access/privacy/limits remove objections → professional help shows the payoff → FAQ mops up → final CTA closes.

The differentiator appears at positions 2 and 3, before any persuasion. That ordering is the spec's, not a choice: UX_FLOWS §8 requires the briefing fragment below the fold "because the differentiator has to be seen rather than claimed."

## E. Open items requiring your decision

1. **No Terms page exists.** Footer omits it. Add the route to UX_FLOWS §1 or leave omitted.
2. **Dark mode.** ACCESSIBILITY §5 gates it; DESIGN_SYSTEM has no tokens. Building light only.
3. **"Is my data used to train AI?"** deliberately absent from the FAQ pending the provider-tier decision (RESOURCE_AUDIT.md §0.1). Once billing is confirmed on a no-training tier, add it with a truthful answer.
4. **Sample document in the showcase** must be a synthetic rental agreement written for this purpose. Do not screenshot a real one.
