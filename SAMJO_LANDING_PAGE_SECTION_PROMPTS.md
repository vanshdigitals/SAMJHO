# Samjo Landing Page — Stitch Section Prompts

Each prompt below is independently usable in Google Stitch. Prepend the **Standing Context** block once per Stitch session, then paste any section prompt.

Fourteen sections, not sixteen. The standalone trust strip merged into the hero (the specs place it as one line under the CTAs, and a separate strip would compete with the hero). "What Samjo helps you understand" merged into the product showcase — the briefing's own section names already are that list, and showing beats listing.

---

## STANDING CONTEXT — paste once per session

> Brand: **Samjo** (sentence case, never all-caps). Tagline "Samajh aane tak." English line "Know where you stand." An India-first product that helps ordinary people understand a residential rental agreement or a housing-related legal notice. Not a lawyer, no legal advice, no outcome prediction, not a chatbot.
>
> Reader context: often on a phone, often on a slow connection, often reading their second language, sometimes with a deadline already running.
>
> Colours: background `#F6F3EE` warm paper · surface `#FFFFFF` · surface-subtle `#EEEAE2` · text-primary `#131C2B` · text-secondary `#49566A` · text-muted `#6E7A8A` · border `#DDD6CC` · border-strong `#C4BBAE` · primary `#1B4DB1` · primary-subtle `#E8EEF9` · warning `#92600A` on `#FBF0DC` · danger `#A32219` on `#FAE9E7`. Semantic only — nothing coloured for decoration.
>
> Type: **DM Sans** for brand voice, **Inter** for quoted document text and for money/date figures (tabular numerals). Weights 400/500/600 only, **no 700**. Display 40/44 · H1 32/38 · H2 24/30 · H3 20/26 · Body Large 18/28 · Body 16/26 · Body Small Inter 14/22 · Label 14/20 · Caption Inter 12/18. Sentence case everywhere, no all-caps labels.
>
> Spacing 4/8/12/16/20/24/32/40/48/64. Radius by role: 8 inputs · 12 buttons and small panels · 16 sheets and modals. **No shadow on static content. No gradients anywhere.** Prose capped at **68 characters** at every width.
>
> Signature element: the **evidence rail** — a 1px `#C4BBAE` vertical rule inset 12px, carrying 8px filled `#1B4DB1` source markers with 44px hit areas. Because the rail connects, **the page uses no card grid**; sections divide by space and 1px hairlines. Only two card usages on the whole page: the two "ways to start" panels, and the FAQ accordion.
>
> Three-state labels, verbatim: **Where this comes from** / **Document says** (Inter, plus page number) / **Samjo interprets** (DM Sans) / **How confident is Samjo?** followed by High, Medium or Low. **Never "AI interprets". Never a numeric confidence score.** Items needing checking get a hollow marker plus the word **Verify** in `#92600A`.
>
> Banned everywhere: Upload · Submit · Processing · AI Analysis · Risk Assessment · Legal Obligations · Extracted Entities · Source span · LLM · AI model · OCR · pipeline · embeddings · vector database · RAG · prompt · schema · token · API · "powered by".
>
> Forbidden visuals: gradients · animated blobs · glassmorphism · glow · dark hero · equal rounded cards with one grey shadow · all-caps letter-spaced eyebrows · arrows in button text · 3D or isometric illustration · abstract AI imagery · sparkle icons · gavels · scales of justice · courthouse columns · law books · stock handshake photos · navy-and-gold trust palettes.
>
> Forbidden content: invented statistics · user counts · accuracy percentages · testimonials · logo walls · awards · press · partnerships · lawyer names, firms, numbers, ratings or prices · legal-aid listings · "revolutionising law" · "AI-powered" as a selling point.
>
> Forbidden patterns: login · sign-up · email capture · newsletter · pricing · countdown · exit modal · sticky bottom CTA bar · hamburger menu · carousel · chat widget · "Book a demo" · SOC 2/ISO/GDPR badges · lock or shield reassurance icons · Terms of Service link.
>
> Accessibility: WCAG 2.2 AA. No meaning from colour alone. Targets ≥44px. Focus ring 2px `#1B4DB1` with 2px offset, never suppressed. One `h1`. Semantic headings. Hindi text carries `lang="hi"` and **+4px line-height** for Devanagari. Plain language throughout.
>
> Motion: one hero reveal on first load only, 40ms stagger. Everything else responds to a user action. No scroll-triggered entrances, no parallax, no autoplay. Under `prefers-reduced-motion`, opacity only under 100ms.
>
> Breakpoints: desktop **1440×900** and **1280×800** (12 cols, 24px gutters, max 1200/1120px, page gutter 120/80px). Mobile **390×844**, **360×800**, **430×932** (single column, 16px gutter at 360, **no horizontal scroll**).

---

## 01 — Header

> Design a sticky header, 64px tall on desktop and 56px on mobile, `#FFFFFF` at full opacity with a 1px `#DDD6CC` bottom border. **No shadow, no blur, no transparency** — a legal-help site should not shimmer.
>
> Desktop 1440: wordmark "Samjo" left in DM Sans 500 at 28px. Centred nav group: "How it works", "What Samjo does", "Privacy" at Body 16/26 in `#49566A`, turning `#131C2B` on hover with no transform. Right group, 16px apart: a language switcher showing both labels visibly — `English` and `हिन्दी`, not a dropdown — then a secondary button "Start" at sm 36px.
>
> The header CTA is deliberately quieter than the hero's. It must not outweigh it.
>
> Mobile 390: one row — wordmark, language switcher, "Start". **The three nav links drop out entirely and reappear in the footer. Do not add a hamburger menu** — four links do not justify a drawer. Keep `हिन्दी` spelled in full at 360px; never abbreviate it.
>
> First focusable element is a skip link to main content, visible on focus.
>
> Do not include: login, sign up, account avatar, search, notification bell, product dropdown, "Book a demo", cart.

---

## 02 — Hero

> Design the hero. It must deliver the whole proposition and both entry points within one screen.
>
> **Desktop 1440, two columns.** Left, columns 1–5 (~464px), in this order:
> - Wordmark "Samjo", DM Sans 500 28px
> - "Samajh aane tak." — DM Sans 400 20/26, `#49566A`
> - **"Know where you stand."** — Display 40/44 DM Sans 500, `#131C2B`
> - "Legal documents ko samajhna mushkil nahi hona chahiye." — DM Sans 400 20/30 (+4px line-height for Devanagari), `#49566A`, `lang="hi"`
> - "Show us a rental agreement or a housing notice, or just tell us what happened. Samjo explains what it says, what matters in it, and what to do next." — Body Large 18/28, `#49566A`, max 68ch
> - Two buttons side by side, 16px apart, both lg 52px, **equal height and equal type size**: primary **"I have a document"** in `#1B4DB1`, secondary **"Something happened"**
> - "Source-grounded · Private by design · Hindi + English" — Body Small Inter 14/22, `#6E7A8A`
> - "No account. No sign-up. Nothing to remember." — Body Small Inter, `#6E7A8A`
>
> Right, columns 6–12 (~640px): a **real rendered briefing specimen**, not an illustration and not a browser-chrome mockup. `#FFFFFF` panel on the warm paper background, 1px `#DDD6CC` border, 16px radius, **no shadow**, scaled to about 92% of true UI size. Align it optically to the Display baseline, not vertically centred.
>
> The specimen contains, top to bottom: an amber "⚠ Time-sensitive" banner reading "You have 30 days from 14 March to respond"; "What this is — A notice to vacate, sent by your landlord"; "What you need to do" with two items on the evidence rail ("Respond in writing within 30 days", "Pay the outstanding rent of ₹25,000"); and **one evidence panel rendered open**, showing "Where this comes from", "Document says" with the quote "The Tenant shall vacate the premises within thirty (30) days of receipt of this notice." and "Page 1", then "Samjo interprets — The notice period starts from the date you received it, not the date on the letter.", then "How confident is Samjo?  High".
>
> The panel must be open. The connection between a claim and its quote is the entire product and it has to be visible without interaction.
>
> **Mobile 390 — the order changes.** Single column: tagline → headline (Display 32/38) → Hindi line → explanation → **both CTAs, full-width, stacked, 52px, 12px apart** → trust line → reassurance → **specimen last**. A phone user must not scroll past an image to reach the action. At 360, Display steps to 28/34 and the side gutter is 16px. The specimen scales to container width and **never scrolls horizontally** — if the full briefing won't fit legibly, drop rows rather than shrinking type below Caption 12/18, but always keep the urgency banner and the open evidence panel.
>
> Motion: this is the page's one orchestrated moment. Reveal top to bottom, 40ms stagger per element, first load only.
>
> Do not include: gradient background, animated blobs, invented statistics, user counts, testimonials, logo wall, "revolutionising law", a "no credit card required" badge, an email field, a video, a scroll-down chevron.

---

## 03 — Product showcase

> Design a section that shows what the user actually receives.
>
> Heading H2 "This is what you get". Framing line at Body Large: "Not a shorter version of your document. An answer to what it means for you, in a fixed order, with the urgent part first."
>
> Below it, render a full briefing as **one continuous reading surface with the evidence rail down its left edge — not eight separate cards.** Sections divide by 32px of space plus a 1px `#DDD6CC` hairline. Desktop: centred column, max 900px at 1440 and 860px at 1280.
>
> Sections in this fixed order, with these exact labels:
> 1. **⚠ Time-sensitive** — `#FBF0DC` fill, `#92600A` text, icon + the word + colour. "You have 30 days from 14 March to respond."
> 2. **What this is** — "A notice to vacate, sent by your landlord under the terms of your rental agreement."
> 3. **What you need to do** — two rail items: "Respond in writing within 30 days", "Pay the outstanding rent of ₹25,000"
> 4. **Watch out** — one rail item: "The agreement lets the landlord deduct repair costs from your deposit without an itemised list." with a hollow marker and the word **Verify** in `#92600A`
> 5. **Important details** — "Security deposit  ₹25,000" and "Monthly rent  ₹12,000", figures right-aligned in **Inter tabular numerals**
> 6. **Dates that matter** — "Respond by  13 April 2026" with **Verify**
> 7. **Questions to ask** — "4 questions prepared for a legal professional"
> 8. **What to do next** — a button "See what to do next"
>
> The evidence rail runs continuously from section 3 through section 6: 1px `#C4BBAE`, inset 12px, carrying 8px filled `#1B4DB1` markers with 44px hit areas.
>
> Closing line: "Every line has a marker beside it. Tap one and you see the exact sentence it came from, and where in the document it sits."
>
> **Mobile 390:** same order, never reflowed. Becomes an accordion with **the first two sections expanded by default**; the urgency banner is never collapsible. The rail narrows to an 8px inset at 360 but **never disappears** — it is the identity element. Money and date labels stack above their values at 360 so figures never truncate. **Briefing prose stays at 18px** — do not step it down.
>
> Do not include: a progress bar or percentage, a numeric confidence score, a chart, a dashboard layout, document types outside rental agreements and housing notices, any real person's name or address.

---

## 04 — Evidence

> Design the section that explains Samjo's core differentiator. **This is the one section that gets the page's concentration of visual weight** — everything else stays quiet.
>
> **Desktop 1440, two columns.** Left, columns 1–5: H2 "Samjo shows you where every answer came from". Thesis at Body Large: "Samjo never merges three different things. What your document says, what Samjo reads into it, and what a professional should check stay separate on screen — because they are separate." Then a hairline, then: "If Samjo can't point to the exact sentence in your document, it doesn't make the claim at all. Nothing unsourced reaches your briefing."
>
> Right, columns 6–12: the evidence panel at **about 120% of true UI scale** — larger than in the showcase. `#FFFFFF`, 1px `#DDD6CC`, 16px radius, **no shadow**. Contents, with these labels verbatim:
> - **Where this comes from** — panel title, Label style
> - **Document says** — then, in **Inter** Body Small 14/22, `"The Tenant shall deposit a sum of Rs. 25,000/- as interest-free security"`, then "Page 1" in Caption
> - **Samjo interprets** — then, in **DM Sans** Body 16/26, "This is refundable, but the agreement sets conditions for deductions."
> - **How confident is Samjo?** — then the word **High** in Label style
>
> The three blocks separate by a 1px `#DDD6CC` hairline and 20px of space. **They must read as three distinct things — that separation is the whole point.** The family switch between Inter for the quote and DM Sans for the interpretation is meaningful; keep it.
>
> Optionally sit the section on a full-bleed `#EEEAE2` band to lift it from its neighbours. No gradient, no radius on the band.
>
> Supporting line beneath: "Where Samjo is less sure, it says so and marks the item Verify rather than sounding equally confident about everything."
>
> **Mobile 390:** single column — heading → thesis → **panel** → drop rule → confidence line. The panel moves above the drop rule so the visual proof arrives before the explanation. "How confident is Samjo?" and "High" stack on two lines at 360; never truncate the question. The three blocks must never merge into a single paragraph at any width. Nothing here collapses.
>
> Do not include: the phrase "AI interprets" — the label is **"Samjo interprets"**. No accuracy percentage, no "99% accurate", no "hallucination-free", no claim of legal correctness.

---

## 05 — The problem

> Design a quiet, prose-led section. **Not a 2×2 grid, not icon cards** — a single reading column, because this is read rather than scanned.
>
> H2 "The hard part isn't the words". Opening at Body Large: "Most people can read a legal notice. What they can't do is answer four questions about it."
>
> Then an ordered list at Body Large 18/28 with 24px between items (20px at 360), numerals in DM Sans 500 `#6E7A8A` hanging outside the text block:
> 1. What is this document, and is it serious?
> 2. Which parts of it actually affect me?
> 3. Is a clock running?
> 4. What do I do next, and what should I ask a professional?
>
> Closing line: "A summary answers none of these. It gives you a shorter version of the same confusion."
>
> Centre the column at max 68ch on desktop. Generous leading — this is the page's emotional hinge and it should slow the reader down. Identical at 1440 and 1280, which is the point of a fixed measure.
>
> **Mobile:** unchanged structurally. Nothing collapses. All four questions render; do not truncate to three. At 360 the numerals may sit inline with 8px following space if hanging costs too much width.
>
> Do not include: fear-based statistics, "millions of Indians", eviction or distress photography, courtroom imagery, a gavel, scales of justice, red warning iconography, invented survey data.

---

## 06 — How Samjo works

> Design a four-step explanation in plain user language.
>
> **Desktop 1440:** H2 "How it works", then four equal columns (1–3, 4–6, 7–9, 10–12). A **single continuous 1px `#DDD6CC` hairline runs horizontally behind all four numerals, connecting them** — this is the evidence rail turned on its side, the page's one structural motif reused deliberately.
>
> Numerals `01`–`04` in DM Sans 500 20px `#6E7A8A`. **This is one of only two places numbered markers are permitted on this page** (the other is Preparing for professional help).
>
> - **01 · Show us the document, or tell us what happened** — "A rental agreement, a housing notice, a photo of a letter — or just describe what arrived."
> - **02 · Samjo reads it and works out what it is** — "Before anything else, Samjo identifies the document and tells you how sure it is."
> - **03 · Samjo finds what matters** — "What you must do, what money is involved, which dates are running, and what to watch for."
> - **04 · You get a briefing you can check** — "Every point carries a marker back to the sentence it came from."
>
> Step titles H3 20/26; bodies Body 16/26 `#49566A`.
>
> Timing line beneath: "Usually about a minute. Samjo shows you what it's doing while it works — real steps, not a loading bar that means nothing."
>
> **No icons, no illustrations, no arrows between steps.** The hairline already carries sequence.
>
> **Mobile 390 — the axis changes.** Four steps stack vertically, 32px apart, and **the connector becomes a vertical hairline down the left edge**, echoing the evidence rail. Titles H3 18/24 at 360. Nothing collapses.
>
> At 1280 keep four columns; tighten step bodies to Body Small rather than wrapping to two rows.
>
> Do not use any of these words: LLM, AI model, OCR, pipeline, extraction, embeddings, vector database, RAG, prompt, schema, token, API, "powered by". This section is for users, not developers.

---

## 07 — Two ways to start

> Design the two entry paths as **equally legitimate options**. This is one of only two permitted card usages on the page.
>
> H2 "Two ways to start". Framing line: "Both are real starting points. Pick whichever matches what you're holding."
>
> **Desktop 1440:** two panels side by side, columns 1–6 and 7–12. `#FFFFFF`, 1px `#DDD6CC`, 16px radius, **no shadow**, **equal height**, identical 32px padding, identical internal structure.
>
> **Panel A** — H3 "I have a document". Body: "Show us a rental agreement or a housing notice. Samjo explains what it says, what you're agreeing to or being asked to do, and what's time-sensitive." Hairline. Then two key/value rows: "Takes — PDF, Word, or a photo, up to 10 MB and 30 pages" and "Gives — A briefing where every point traces to your document". Primary button, full panel width, lg 52px: **"Start with a document"**.
>
> **Panel B** — H3 "Something happened". Body: "Tell us what happened in your own words. Samjo asks a few plain questions, then helps you work out where you stand and what to ask next." Hairline. "Takes — A few questions, one at a time" and "Gives — Orientation, what's still unknown, and questions to ask". Secondary button, full panel width, lg 52px: **"Tell us what happened"**.
>
> **Equal visual weight is a hard requirement.** Identical padding, identical H3 size, identical CTA size. Neither gets a coloured fill or a "recommended" badge. The only permitted difference is primary vs secondary button style, reflecting which persona the MVP prioritises — not which option is better.
>
> Directly beneath panel B, **outside its border**, at Body Small `#6E7A8A`: "Without a document there's nothing to quote from, so this path gives you orientation and questions rather than a line-by-line briefing. You can add a document later." This line is required and must never be collapsed or removed — it keeps the page honest about what the second path can produce.
>
> **Mobile 390:** panels stack, **"I have a document" first**. **Not a carousel** — a carousel hides the second option. Both render in full, equal height, full-width CTAs. The "Takes / Gives" rows become label-above-value stacks so nothing truncates. Panel padding 20px at 360.
>
> Do not include: any suggestion the second path yields document-grounded evidence, a "recommended" badge, a comparison table implying one is inferior, an upsell, a third option.

---

## 08 — Language, read-aloud and access

> Design a restrained section communicating reach as a user benefit — **not a compliance table and not a feature grid.**
>
> H2 "Built to be used, not just visited".
>
> **Desktop 1440:** two columns (1–6, 7–12), two statements each. **No icons** — an icon set would turn a substance section into a feature grid. Titles H3 20/26, bodies Body 16/26 `#49566A`.
>
> - **Hindi and English, all the way through** — "Not just the buttons. The briefing itself, including the explanations."
> - **Listen instead of reading** — "Play the briefing aloud. Pause and pick it up again. It never starts on its own."
> - **Works on the phone you have** — "Designed for a 360-pixel screen and a slow connection first, not as an afterthought."
> - **Keyboard and screen reader throughout** — "Every part of the flow, including the evidence panel."
>
> Below a hairline, at full 68ch measure: "Read-aloud uses the voices already on your device, so a Hindi voice depends on your phone. If yours doesn't have one, Samjo tells you instead of reading Hindi in an English voice."
>
> **That caveat line is required and must never be collapsed, truncated, or de-emphasised into invisibility.** It is the difference between a claim and a promise.
>
> Any Hindi example text carries `lang="hi"` and +4px line-height.
>
> **Mobile 390:** single column, four statements in order, 28px apart. The caveat line renders in full. This section is self-demonstrating — "Designed for a 360-pixel screen" is being read at that width, so the layout must not strain there.
>
> Do not include: a WCAG conformance badge, "fully accessible", "AAA", an accessibility certification, a logo row of screen readers, "works for every age", or any language beyond Hindi and English.

---

## 09 — Privacy

> Design a **deliberately unadorned** section. No lock icons, no shield graphics, no badge row. This section earns trust by looking like a plain statement of fact, which is what it is.
>
> H2 "What happens to your document". Then four statements, hairline-separated, 24px apart, centred column max 900px on desktop. Titles H3 20/26, bodies Body 16/26 `#49566A`.
>
> - **No account** — "No email, no phone number, no password. Nothing that identifies you."
> - **Deleted within 24 hours** — "Your document and its text are removed within a day, or the moment you ask — whichever comes first."
> - **Never in our logs** — "The text of your document is never written into any log."
> - **Read by an AI service** — "To analyse your document, Samjo sends its text to an AI provider. We're telling you because you'd want to know."
>
> Then a link at Body 16/26 `#1B4DB1`: "Read the full privacy note →".
>
> **All four statements carry equal visual weight. The fourth must not be smaller, greyer, or lower-contrast than the first three, and it must never be collapsed behind an interaction on any screen size.** Burying it would be exactly the kind of omission this product exists to help people notice.
>
> **Mobile 390:** single column, same order, all four in full.
>
> Do not include: "your data can never be seen by anyone", "military-grade encryption", "bank-level security", a lock or padlock icon, SOC 2, ISO 27001, GDPR or DPDP badges, "we never share your data", zero-knowledge claims.

---

## 10 — What Samjo does not do

> Design a section that makes the product's boundary understandable **without sounding defensive or alarming.**
>
> H2 "What Samjo does, and what it doesn't".
>
> **Desktop 1440:** two columns, 1–5 and 7–12, with column 6 left empty as a visual gap. Column headings "What it does" and "What it doesn't" in Label style `#6E7A8A`.
>
> Left, Body Large: "Samjo explains what your document says, points out what matters and what's time-sensitive, and helps you prepare for a professional."
>
> Right, four statements at Body Large with 16px separation, **no ✗ icons and no red**:
> - "It won't predict how a dispute will turn out."
> - "It won't tell you whether to sign."
> - "It won't decide whether a clause is enforceable."
> - "It isn't a lawyer, and it doesn't replace one."
>
> Below, spanning full width: "Ask Samjo who'll win and this is what it says:" then the quote, which is the most important element in the section — Body Large 18/28 with a **2px `#C4BBAE` left rule and 20px left padding**:
>
> > "I can help you understand the document, identify what it says, highlight issues to discuss with a legal professional, and prepare questions. I can't predict the outcome of a legal dispute."
>
> Then: "That's not Samjo being cautious. Applying law to your facts is what a qualified professional is for."
>
> **The quote must not sit in `#FAE9E7` or any warning treatment.** Escalation styling is reserved for real urgency; this is a boundary statement, not an alarm.
>
> **Mobile 390:** stacked, "does" first so the section doesn't open on a wall of negatives, then "doesn't", then the quote, then the closing line. Left rule stays at 2px with 16px padding at 360. Nothing collapses.
>
> Do not include: a red warning banner, a wall of legal small print, an "I understand" checkbox, a modal, a terms gate, the word "liability", defensive hedging in every sentence.

---

## 11 — Preparing for professional help

> Design a section showing how Samjo helps someone get ready for a consultation.
>
> H2 "Walk in knowing what to ask". Opening: "Legal help costs money, and much of a first consultation goes on explaining the basics. Samjo does that part first."
>
> **Desktop 1440:** two columns. Left, columns 1–6, a numbered checklist — **the second and final permitted use of numbered markers on this page**, because a checklist genuinely is a sequence. Numerals DM Sans 500 18px `#6E7A8A`, hanging:
> - **01** The questions worth asking, and why each one matters
> - **02** What's still unclear in your document, named plainly
> - **03** What to take with you
> - **04** Where Samjo wasn't sure, so you can have it checked
>
> Right, columns 7–12, a panel — `#FFFFFF`, 1px `#DDD6CC`, 12px radius, 24px padding, no shadow:
> - Label "Sample question"
> - At Body Large: *"Does the deposit clause let you deduct repair costs without giving me an itemised list?"*
> - Hairline
> - Label "Why this one matters"
> - At Body `#49566A`: "The agreement mentions deductions but doesn't say whether an itemised list is required. That gap is worth closing before you sign."
>
> Full width beneath a hairline: "Where a document looks time-sensitive, or the situation is serious, Samjo puts getting help above reading further."
>
> **Mobile 390:** stacked, checklist first, then the panel, then the escalation line. Panel padding 20px at 360. Numerals may go inline at 360.
>
> **Critical — do not include any of these anywhere in this section:** a lawyer name, a firm, a phone number, a rating, a price, availability, "verified lawyer", a directory, a booking flow, a legal-aid listing, a map, or "find a lawyer near you". This section shows the *shape* of the preparation Samjo produces, never actual professional listings.

---

## 12 — Questions people ask

> Design an accordion FAQ. This is the second permitted card-ish usage on the page.
>
> H2 "Questions people ask". Centred, max 800px at 1440 and 760px at 1280.
>
> Twelve items, **the first one open by default**, separated by 1px `#DDD6CC` hairlines rather than boxes. Trigger rows full width, minimum 56px tall, with the question at H3 20/26 and a 20px chevron in `#6E7A8A` right-aligned and vertically centred. Answers at Body 16/26 `#49566A`, max 68ch, 16px padding top and bottom. Prefer multi-expand so someone comparing two answers doesn't lose one.
>
> Questions, in order: What is Samjo? · Do I need an account? · What can I give Samjo? · What kinds of documents does Samjo handle right now? · Can I use Samjo in Hindi? · Does Samjo give legal advice? · Can Samjo tell me whether I'll win? · How does Samjo show where something came from? · What happens to my document? · Can I listen to the briefing? · What if Samjo can't find something in my document? · What if my photo is blurry?
>
> Use the answer text from `SAMJO_LANDING_PAGE_CONTENT.md` verbatim.
>
> **Mobile 390:** same accordion, first item open. Questions at H3 18/24 at 360, **wrapping to two lines rather than truncating with an ellipsis**. Chevron rotation is instant under `prefers-reduced-motion`.
>
> Do not include: pricing, refunds, plans, enterprise, integrations, API access, SLA, uptime, team seats, or a question about any capability not listed above. In particular, **do not add "Is my data used to train AI?"** — the honest answer depends on a provider decision that has not been finalised, and an unqualified "no" would be false.

---

## 13 — Final CTA

> Design a calm closing section that returns to the single action.
>
> **Full-bleed `#EEEAE2` band**, edge to edge, ignoring the page gutter. 120px vertical padding at 1440, 96px at 1280, 80px at 390, 64px at 360. **No gradient, no radius, no shadow.**
>
> Centred content, max 640px on desktop:
> - H2 stepped up to 32/38: "Start understanding where you stand"
> - Body Large: "One document, or one description of what happened. About a minute either way."
> - Primary button, lg 52px, **auto width with 32px horizontal padding** on desktop: **"Start with Samjo"**
> - Secondary as a text link in `#1B4DB1` at Body 16/26: "See how it works first"
> - Body Small `#6E7A8A`: "No account. Deleted within 24 hours."
>
> **Mobile 390:** the primary button goes **full width**. The secondary stays a text link with a 44px tap target. **Left-align the text at 360** — centred text across three wrapped lines reads worse than left-aligned at that width. Centre at 390 and above.
>
> **Do not add a sticky bottom CTA bar.** The page already offers CTAs in the header, the hero, "Two ways to start" and here; a fifth, permanently docked, is the aggressive conversion pattern this product avoids.
>
> Do not include: countdown timer, "limited spots", "join the waitlist", email capture, urgency language, exit-intent modal, "Don't miss out", a social-proof counter.

---

## 14 — Footer

> Design the footer. `#FFFFFF` background, 1px `#DDD6CC` top border, 64px top padding, 48px bottom.
>
> **Desktop 1440:** four columns. Columns 1–3: wordmark "Samjo" and "Samajh aane tak." Then three link groups with headings in Label style `#6E7A8A`, **sentence case**:
> - **Product** — How it works · Two ways to start
> - **Limits and safety** — What Samjo does and doesn't
> - **Privacy and access** — Privacy · Accessibility
>
> Links at Body 16/26 `#49566A`, 12px apart, each with a 44px effective target height. Language switcher (`English` / `हिन्दी`) in the right column.
>
> Below a hairline, at full 68ch measure, Body Small Inter 14/22 `#49566A`, **as real text and never an image**:
>
> > "Samjo gives legal information to help you understand your document and prepare. It is not legal advice and not a substitute for a lawyer."
>
> Then, at Caption 12/18 Inter `#6E7A8A`: "India (verify)".
>
> **Mobile 390:** everything stacks — wordmark, then the three link groups, then the language switcher, then the hairline, disclaimer and jurisdiction line. **This footer carries the three nav links the mobile header dropped, which is why no hamburger menu is needed.** Repeat the language switcher here so someone who scrolled the whole page doesn't have to scroll back up. 44px row height per link.
>
> Do not include: a company name, registered address, CIN, GST number, a copyright line naming a legal entity, **a Terms of Service link** (no such page exists), social media icons, a newsletter field, "Made with ❤️", careers, press, investors, a status page, or any language not actually supported.

---

## Generation order

Build in this sequence so the shared elements stabilise before they are reused:

1. **02 Hero** — establishes the type ladder, button weights, and the evidence-panel specimen
2. **04 Evidence** — establishes the three-state panel at full scale
3. **03 Product showcase** — reuses the rail and panel from 02 and 04
4. **01 Header** and **14 Footer** — the frame
5. **07 Two ways to start** — the page's only true card pattern
6. **06 How it works** — the rail rotated horizontally
7. **05, 08, 09, 10, 11** — the prose sections
8. **12 FAQ**, **13 Final CTA**

Generating 02, 04 and 03 first matters: the evidence rail and the three-state panel appear in all three, and if they drift apart the page loses its one unifying motif.
