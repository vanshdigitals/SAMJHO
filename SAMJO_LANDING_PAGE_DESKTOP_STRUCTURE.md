# Samjo Landing Page — Desktop Structure

Targets: **1440 × 900** (primary) and **1280 × 800**. DESIGN_SYSTEM §5 desktop breakpoint is 1024+; these two are the design targets.

---

## Global desktop frame

| Property | 1440 | 1280 |
|---|---|---|
| Max content width | 1200px | 1120px |
| Page gutter | 120px | 80px |
| Grid | 12 columns, 24px gutter | 12 columns, 24px gutter |
| Reading measure | **68ch, at every width** | **68ch** |
| Section vertical rhythm | 96px top and bottom (`--space-16` ×1.5) | 80px |
| Section separator | 1px `--border` hairline, or space alone. **Never a box** | same |
| Body copy size | Body Large 18/28 for prose, Body 16/26 for interface text | same |
| Background | `--background` (#F6F3EE warm paper) | same |

**The 68ch rule is absolute.** DESIGN_SYSTEM §5: "The centre column keeps the same 68-character measure at every width. Desktop is not a stretched phone, and it is not a dashboard." Extra width at 1440 becomes margin, never longer lines.

**Elevation discipline.** `--shadow-subtle` and `--shadow-medium` exist for things that genuinely float — the evidence sheet, modals, toasts. **No section on this page carries a shadow.** No card has a shadow. Static content is flat (DESIGN_SYSTEM §4).

**No gradients anywhere** (DESIGN_SYSTEM §2).

---

## 01 — Header

```
│←120px→│                                                    │←120px→│
┌───────────────────────────────────────────────────────────────────┐
│ Samjo        How it works  What Samjo does  Privacy   EN|हिन्दी  [Start] │
└───────────────────────────────────────────────────────────────────┘
                              1px --border
```

- Height 64px, sticky, `--surface` at full opacity. No blur, no transparency — a legal-help site should not shimmer.
- Wordmark left. Nav centred as a group. Switcher + `Start` right, 16px apart.
- Nav links: Body 16/26, `--text-secondary`; `--text-primary` on hover with no transform.
- `Start` is a `secondary` button at `sm` 36px — the header CTA must not outweigh the hero's.
- **1280:** nav gap tightens to 24px. Nothing drops.
- Focus ring: 2px `--focus-ring`, 2px offset, never suppressed.

---

## 02 — Hero

```
│←120px→│                                                     │←120px→│
┌──────────────────────────────┬────────────────────────────────────┐
│ cols 1–5 (≈464px)            │ cols 6–12 (≈640px)                 │
│                              │                                    │
│ Samjo                        │  ┌──────────────────────────────┐  │
│ Samajh aane tak.             │  │ ⚠ Time-sensitive             │  │
│                              │  ├──────────────────────────────┤  │
│ Know where you stand.        │  │ What this is                 │  │
│                              │  │ A notice to vacate…          │  │
│ Legal documents ko samajhna  │  │                              │  │
│ mushkil nahi hona chahiye.   │  │ What you need to do          │  │
│                              │  │ │                            │  │
│ Show us a rental agreement   │  │ ├─● Respond within 30 days   │  │
│ or a housing notice, or just │  │ │                            │  │
│ tell us what happened…       │  │ ├─● Pay ₹25,000              │  │
│                              │  │   ┌────────────────────────┐ │  │
│ [ I have a document ]        │  │   │ Where this comes from  │ │  │
│ [ Something happened ]       │  │   │ Document says          │ │  │
│                              │  │   │ "The Tenant shall…"    │ │  │
│ Source-grounded · Private    │  │   │ Samjo interprets       │ │  │
│ by design · Hindi + English  │  │   │ …                      │ │  │
│                              │  │   │ How confident?   High  │ │  │
│ No account. No sign-up.      │  │   └────────────────────────┘ │  │
│                              │  └──────────────────────────────┘  │
└──────────────────────────────┴────────────────────────────────────┘
```

**Vertical:** 96px above, 120px below (the hero gets the page's most generous close).

**Typography ladder:**
| Element | Spec |
|---|---|
| Wordmark | DM Sans 500, 28px |
| "Samajh aane tak." | DM Sans 400, 20/26, `--text-secondary` |
| "Know where you stand." | Display 40/44 DM Sans 500, `--text-primary` |
| Hindi line | DM Sans 400, 20/30 (**line-height +4px for Devanagari**), `--text-secondary`, `lang="hi"` |
| Explanation | Body Large 18/28, `--text-secondary`, max 68ch |
| Trust meta | Body Small 14/22 Inter, `--text-muted` |
| Reassurance | Body Small 14/22 Inter, `--text-muted` |

**Buttons:** side by side, 16px gap. Both `lg` 52px. `I have a document` = primary (`--primary` #1B4DB1). `Something happened` = secondary. **Equal height and equal type size** — PRD §7 treats both entries as first-class.

**Preview panel:** `--surface` on `--background`, 1px `--border`, `--radius-lg` 16px, **no shadow**. Optically aligned to the Display baseline, not vertically centred. Scaled to ~92% of true UI size so it reads as a specimen, not a live app. The evidence panel inside renders **open** — the connection between claim and quote must be visible without interaction.

**1280:** copy cols 1–5 (≈432px), preview cols 6–12 (≈592px). Display drops to 36/42. Nothing else changes.

**Motion:** the one orchestrated moment on the page. Reveal top to bottom, 40ms stagger per element, **first load only** (DESIGN_SYSTEM §7). Under `prefers-reduced-motion: reduce`, opacity only, under 100ms, no transforms.

---

## 03 — Product showcase

```
│                    centred, max 900px                     │
┌───────────────────────────────────────────────────────────┐
│ This is what you get                            (h2 24/30)│
│ Not a shorter version of your document…         (68ch)    │
│                                                            │
│ ⚠  Time-sensitive                          ← --warning-surface
│    You have 30 days from 14 March to respond.             │
│ ─────────────────────────────────────────── hairline      │
│ What this is                                               │
│   A notice to vacate, sent by your landlord…               │
│ ─────────────────────────────────────────── hairline      │
│ What you need to do                                        │
│ │                                                          │
│ ├─●  Respond in writing within 30 days                     │
│ │                                                          │
│ ├─●  Pay the outstanding rent of ₹25,000                   │
│ ─────────────────────────────────────────── hairline      │
│ Watch out                                                  │
│ ├─●  The agreement lets the landlord deduct…    [Verify]   │
│ ─────────────────────────────────────────── hairline      │
│ Important details                                          │
│ ├─●  Security deposit                    ₹25,000           │
│ ├─●  Monthly rent                        ₹12,000           │
│ ─────────────────────────────────────────── hairline      │
│ Dates that matter                                          │
│ ├─●  Respond by              13 April 2026      [Verify]   │
│ ─────────────────────────────────────────── hairline      │
│ Questions to ask     4 questions prepared                  │
│ ─────────────────────────────────────────── hairline      │
│ [ See what to do next ]                                    │
│                                                            │
│ Every line has a marker beside it…                         │
└───────────────────────────────────────────────────────────┘
```

**Critical layout constraints:**
- **One continuous surface, not eight cards.** DESIGN_SYSTEM §1: "Cards float and detach; the rail connects." Sections divided by 32px space + 1px `--border` hairline.
- **The evidence rail runs the full height** of the "what you need to do" through "dates that matter" region: 1px `--border-strong`, inset 12px from the content edge.
- Markers: 8px filled circle `--primary`, 44px invisible hit area.
- `Verify` items: **hollow marker + the word "Verify"** in `--warning`. Never the hollow shape alone (DESIGN_SYSTEM §5).
- Money and dates: **Inter tabular numerals**, right-aligned in their own column so figures align vertically.
- Urgency banner: `--warning-surface` (#FBF0DC), `--warning` text (#92600A), icon + the word "Time-sensitive" + colour. Three channels, never colour alone.

**1280:** max width 860px. No structural change.

---

## 04 — Evidence

```
│←120px→│                                                     │←120px→│
┌────────────────────────────────┬──────────────────────────────────┐
│ cols 1–5                       │ cols 6–12                        │
│                                │                                  │
│ Samjo shows you where every    │  Where this comes from           │
│ answer came from      (h2)     │                                  │
│                                │  Document says                   │
│ Samjo never merges three       │  "The Tenant shall deposit a sum  │
│ different things… (Body Large) │   of Rs. 25,000/- as              │
│                                │   interest-free security"         │
│ ─── hairline ───               │  Page 1                          │
│                                │                                  │
│ If Samjo can't point to the    │  ─── hairline ───                │
│ exact sentence in your         │                                  │
│ document, it doesn't make the  │  Samjo interprets                │
│ claim at all.                  │  This is refundable, but the     │
│                                │  agreement sets conditions for   │
│                                │  deductions.                     │
│                                │                                  │
│                                │  ─── hairline ───                │
│                                │                                  │
│                                │  How confident is Samjo?    High │
└────────────────────────────────┴──────────────────────────────────┘
│              Where Samjo is less sure, it says so…                │
```

**This is the one section that gets visual weight** (DESIGN_SYSTEM §1: "it is the one place that gets visual weight. Everything else stays quiet").

- Panel rendered at **~120% of true UI scale** — larger than in §03. This is the page's hero moment after the hero itself.
- `--surface` on `--background`, 1px `--border`, `--radius-lg`. **Still no shadow.**
- The three blocks separated by 1px `--border` hairlines and 20px space. They must read as three distinct things — that separation is the entire point.
- Labels (`Document says`, `Samjo interprets`, `How confident is Samjo?`): Label style, DM Sans 500 14/20, `--text-muted`.
- Quote: **Inter** Body Small 14/22, `--text-primary`. Inter because DESIGN_SYSTEM §3 assigns it to extracted document text.
- `Samjo interprets` body: DM Sans Body 16/26 — different family from the quote, reinforcing that these are different kinds of text.
- `High`: Label style, `--text-primary`. **Never a raw float, never a coloured dot alone.**
- Optional band: `--surface-subtle` (#EEEAE2) behind the whole section to lift it from neighbours. No gradient, no border radius on the band.

**1280:** copy cols 1–5, panel cols 6–12. Panel scale drops to ~110%.

---

## 05 — The problem

```
│                    centred, max 68ch                      │
┌───────────────────────────────────────────────────────────┐
│ The hard part isn't the words                       (h2)  │
│                                                            │
│ Most people can read a legal notice. What they can't do    │
│ is answer four questions about it.        (Body Large)     │
│                                                            │
│   1.  What is this document, and is it serious?            │
│                                                            │
│   2.  Which parts of it actually affect me?                │
│                                                            │
│   3.  Is a clock running?                                  │
│                                                            │
│   4.  What do I do next, and what should I ask a           │
│       professional?                                        │
│                                                            │
│ A summary answers none of these. It gives you a shorter    │
│ version of the same confusion.                             │
└───────────────────────────────────────────────────────────┘
```

- **Not a 2×2 grid. Not icon cards.** A single reading column, because this section is read as prose, not scanned.
- Questions at Body Large 18/28 with 24px between items. Generous leading — this is the page's emotional hinge and it should slow the reader down.
- Numerals: DM Sans 500, `--text-muted`, hanging outside the text block.
- `<ol>` markup. The ranking is meaningful.
- **1280:** unchanged. A 68ch column looks identical at both widths, which is the point.

---

## 06 — How Samjo works

```
│←120px→│                                                     │←120px→│
┌───────────────────────────────────────────────────────────────────┐
│ How it works                                                (h2) │
│                                                                   │
│  01              02              03              04               │
│  ────────────────────────────────────────────────────  hairline   │
│  Show us the     Samjo reads     Samjo finds     You get a        │
│  document, or    it and works    what matters    briefing you     │
│  tell us what    out what it                     can check        │
│  happened        is                                               │
│                                                                   │
│  A rental        Before          What you must   Every point      │
│  agreement, a    anything        do, what money  carries a        │
│  housing         else, Samjo…    is involved…    marker back…     │
│  notice…                                                          │
│                                                                   │
│ Usually about a minute. Samjo shows you what it's doing…          │
└───────────────────────────────────────────────────────────────────┘
```

- Four equal columns, cols 1–3 / 4–6 / 7–9 / 10–12, 24px gutters.
- A **single continuous 1px `--border` hairline** runs behind all four numerals, connecting them. This echoes the evidence rail turned horizontal — the page's one structural motif reused deliberately.
- Numerals `01`–`04`: DM Sans 500, 20px, `--text-muted`. **This is one of only two places numbered markers are allowed** (DESIGN_SYSTEM §1); the other is §11.
- Step titles: H3 20/26. Step bodies: Body 16/26, `--text-secondary`.
- No icons. No illustrations. No arrows between steps — the hairline already carries sequence.
- **1280:** still four columns; step bodies tighten to Body Small 14/22 rather than wrapping to two rows.

---

## 07 — Two ways to start

```
│←120px→│                                                     │←120px→│
┌──────────────────────────────┬────────────────────────────────────┐
│ Two ways to start                                           (h2) │
│ Both are real starting points…                                    │
├──────────────────────────────┬────────────────────────────────────┤
│ cols 1–6                     │ cols 7–12                          │
│ ┌──────────────────────────┐ │ ┌────────────────────────────────┐ │
│ │ I have a document   (H3) │ │ │ Something happened       (H3)  │ │
│ │                          │ │ │                                │ │
│ │ Show us a rental         │ │ │ Tell us what happened in your  │ │
│ │ agreement or a housing   │ │ │ own words. Samjo asks a few    │ │
│ │ notice…                  │ │ │ plain questions…               │ │
│ │                          │ │ │                                │ │
│ │ ─── hairline ───         │ │ │ ─── hairline ───               │ │
│ │ Takes:  PDF, Word, photo │ │ │ Takes:  A few questions        │ │
│ │ Gives:  A briefing where │ │ │ Gives:  Orientation, what's    │ │
│ │         every point      │ │ │         still unknown…         │ │
│ │         traces…          │ │ │                                │ │
│ │                          │ │ │ [ Tell us what happened ]      │ │
│ │ [ Start with a document ]│ │ │                                │ │
│ └──────────────────────────┘ │ │ Without a document there's     │ │
│                              │ │ nothing to quote from…         │ │
│                              │ └────────────────────────────────┘ │
└──────────────────────────────┴────────────────────────────────────┘
```

- **The two permitted card usages on this page.** `--surface`, 1px `--border`, `--radius-lg` 16px, no shadow, **equal height** via equal-height rows.
- **Equal visual weight is a hard requirement.** Identical padding (32px), identical H3 size, identical CTA size (`lg` 52px, full panel width). Neither gets `--primary-subtle` fill or a badge. Panel A's CTA is `primary`; Panel B's is `secondary` — this is the only permitted difference, and it reflects persona priority (PRD §2: A and B drive the MVP), not superiority.
- `Takes:` / `Gives:` rows: Label style key, Body Small value, aligned in two columns.
- The asymmetry line sits **outside** panel B's border, directly beneath it, at Body Small `--text-muted`, and is bound to the panel by `aria-describedby`.
- **1280:** cols 1–6 / 7–12 unchanged. Padding tightens to 24px.

---

## 08 — Language, read-aloud and access

```
│←120px→│                                                     │←120px→│
┌───────────────────────────────────────────────────────────────────┐
│ Built to be used, not just visited                          (h2) │
│                                                                   │
│ Hindi and English, all the way   │ Works on the phone you have   │
│ through                          │ Designed for a 360-pixel      │
│ Not just the buttons…            │ screen…                       │
│                                  │                               │
│ Listen instead of reading        │ Keyboard and screen reader    │
│ Play the briefing aloud…         │ throughout                    │
│                                  │ Every part of the flow…       │
│                                                                   │
│ ─── hairline ───                                                  │
│ Read-aloud uses the voices already on your device…                │
└───────────────────────────────────────────────────────────────────┘
```

- Two columns (cols 1–6 / 7–12), two statements each. **No icons** — an icon set here would turn a substance section into a feature grid.
- Statement titles: H3 20/26. Bodies: Body 16/26 `--text-secondary`.
- The honest caveat line sits below a hairline, full 68ch measure, `--text-muted`. It must not be visually de-emphasised into invisibility — ACCESSIBILITY §1 requires it to be read.
- The Hindi example text carries `lang="hi"` and +4px line-height.
- **1280:** unchanged.

---

## 09 — Privacy

```
│                     centred, max 900px                     │
┌───────────────────────────────────────────────────────────┐
│ What happens to your document                        (h2) │
│                                                            │
│ No account                                                 │
│ No email, no phone number, no password.                    │
│ ─── hairline ───                                           │
│ Deleted within 24 hours                                    │
│ Your document and its text are removed within a day…       │
│ ─── hairline ───                                           │
│ Never in our logs                                          │
│ The text of your document is never written into any log.   │
│ ─── hairline ───                                           │
│ Read by an AI service                                      │
│ To analyse your document, Samjo sends its text to an AI    │
│ provider. We're telling you because you'd want to know.    │
│                                                            │
│ Read the full privacy note →                               │
└───────────────────────────────────────────────────────────┘
```

- **Deliberately unadorned.** No lock icons, no shield graphics, no badge row. This section earns trust by looking like a plain statement of fact, which is what it is.
- Four statements, **equal visual weight**. The fourth (AI provider) must not be smaller, greyer, or lower-contrast than the first three — SECURITY §5's whole point is that it isn't buried.
- Titles H3 20/26, bodies Body 16/26 `--text-secondary`, separated by hairlines and 24px.
- Link at Body 16/26 `--primary`.
- **1280:** max 860px.

---

## 10 — What Samjo does not do

```
│←120px→│                                                     │←120px→│
┌──────────────────────────────┬────────────────────────────────────┐
│ What Samjo does, and what it doesn't                        (h2) │
├──────────────────────────────┬────────────────────────────────────┤
│ cols 1–5                     │ cols 7–12                          │
│ What it does                 │ What it doesn't                    │
│                              │                                    │
│ Samjo explains what your     │ It won't predict how a dispute     │
│ document says, points out    │ will turn out.                     │
│ what matters and what's      │                                    │
│ time-sensitive, and helps    │ It won't tell you whether to sign. │
│ you prepare for a            │                                    │
│ professional.                │ It won't decide whether a clause   │
│                              │ is enforceable.                    │
│                              │                                    │
│                              │ It isn't a lawyer, and it doesn't  │
│                              │ replace one.                       │
├──────────────────────────────┴────────────────────────────────────┤
│ Ask Samjo who'll win and this is what it says:                    │
│                                                                   │
│   │ "I can help you understand the document, identify what it     │
│   │ says, highlight issues to discuss with a legal                │
│   │ professional, and prepare questions. I can't predict the      │
│   │ outcome of a legal dispute."                                  │
│                                                                   │
│ That's not Samjo being cautious…                                  │
└───────────────────────────────────────────────────────────────────┘
```

- Two columns with col 6 empty as a visual gap.
- **The quote is the most important element here.** Set at Body Large 18/28 with a 2px `--border-strong` left rule and 20px left padding. **Not** in `--danger-surface`, **not** in a warning box — AI_SAFETY §8 requires the escalation treatment to be visually distinct from disclaimers, and this is a disclaimer's neighbour, not an alarm.
- Column headings `What it does` / `What it doesn't`: Label style, `--text-muted`.
- The four "doesn't" statements at Body Large with 16px separation. No ✗ icons, no red.
- **1280:** cols 1–5 / 7–12 unchanged.

---

## 11 — Preparing for professional help

```
│←120px→│                                                     │←120px→│
┌──────────────────────────────┬────────────────────────────────────┐
│ Walk in knowing what to ask                                 (h2) │
│ Legal help costs money, and much of a first consultation…         │
├──────────────────────────────┬────────────────────────────────────┤
│ cols 1–6                     │ cols 7–12                          │
│                              │ ┌────────────────────────────────┐ │
│ 01  The questions worth      │ │ Sample question                │ │
│     asking, and why each     │ │                                │ │
│     one matters              │ │ "Does the deposit clause let   │ │
│                              │ │ you deduct repair costs        │ │
│ 02  What's still unclear in  │ │ without giving me an itemised  │ │
│     your document, named     │ │ list?"                         │ │
│     plainly                  │ │                                │ │
│                              │ │ ─── hairline ───               │ │
│ 03  What to take with you    │ │ Why this one matters           │ │
│                              │ │ The agreement mentions         │ │
│ 04  Where Samjo wasn't sure, │ │ deductions but doesn't say…    │ │
│     so you can have it       │ └────────────────────────────────┘ │
│     checked                  │                                    │
├──────────────────────────────┴────────────────────────────────────┤
│ Where a document looks time-sensitive… Samjo puts getting help    │
│ above reading further.                                            │
└───────────────────────────────────────────────────────────────────┘
```

- Numbered checklist — **the second and final permitted use of 01/02/03 markers** (DESIGN_SYSTEM §1: "no numbered 01/02/03 markers except in the lawyer-prep checklist, which genuinely is a sequence").
- Numerals: DM Sans 500 18px `--text-muted`, hanging.
- Sample question panel: `--surface`, 1px `--border`, `--radius-md` 12px, 24px padding, no shadow. Question in Body Large; rationale in Body `--text-secondary`.
- Escalation line spans full width below a hairline, Body 16/26.
- **No lawyer names, firms, numbers, ratings, prices, or legal-aid entries anywhere in this section.** `professional_help.pathways` remains a placeholder.
- **1280:** cols 1–6 / 7–12 unchanged.

---

## 12 — Questions people ask

```
│                     centred, max 800px                     │
┌───────────────────────────────────────────────────────────┐
│ Questions people ask                                 (h2) │
│                                                            │
│ ▾ What is Samjo?                                           │
│   A tool that helps you understand a legal document…       │
│ ─────────────────────────────────────────── hairline      │
│ ▸ Do I need an account?                                    │
│ ─────────────────────────────────────────── hairline      │
│ ▸ What can I give Samjo?                                   │
│ ─────────────────────────────────────────── hairline      │
│ ▸ What kinds of documents does Samjo handle right now?     │
│ … (12 items total)                                         │
└───────────────────────────────────────────────────────────┘
```

- Radix Accordion (DESIGN_SYSTEM §6). **First item open**, matching the mobile briefing convention of opening the first sections by default.
- Questions: H3 20/26, full-width 44px+ trigger rows with a 20px chevron right-aligned.
- Answers: Body 16/26 `--text-secondary`, max 68ch, 16px top padding.
- Separated by hairlines, **not boxes**.
- Single-expand or multi-expand both acceptable; multi-expand preferred so a user comparing two answers doesn't lose one.
- **1280:** max 760px.

---

## 13 — Final CTA

```
│                    full-bleed --surface-subtle band                │
┌───────────────────────────────────────────────────────────────────┐
│                                                                   │
│                  Start understanding where you stand         (h2) │
│                                                                   │
│            One document, or one description of what happened.     │
│                     About a minute either way.                    │
│                                                                   │
│                      [ Start with Samjo ]                         │
│                                                                   │
│                    See how it works first                         │
│                                                                   │
│              No account. Deleted within 24 hours.                 │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

- Full-bleed `--surface-subtle` (#EEEAE2) band, 120px vertical padding. **No gradient, no radius, no shadow.**
- Centred, max 640px content.
- H2 steps up to 32/38 (H1 scale) — this is the page's closing statement.
- Primary button `lg` 52px, auto width with 32px horizontal padding. Not full-width on desktop.
- Secondary as a text link, `--primary`, Body 16/26.
- Reassurance Body Small `--text-muted`.
- **1280:** vertical padding 96px.

---

## 14 — Footer

```
│←120px→│                                                     │←120px→│
┌───────────────────────────────────────────────────────────────────┐
│ cols 1–3        cols 4–6       cols 7–9        cols 10–12         │
│ Samjo           Product        Limits and      Privacy and        │
│ Samajh aane     How it works     safety          access           │
│ tak.            Two ways to    What Samjo      Privacy            │
│                   start          does and      Accessibility      │
│                                  doesn't                          │
│                                                                   │
│                                                 English  हिन्दी    │
│ ──────────────────────────────────────────────────── hairline     │
│ Samjo gives legal information to help you understand your         │
│ document and prepare. It is not legal advice and not a            │
│ substitute for a lawyer.                                          │
│                                                                   │
│ India (verify)                                                    │
└───────────────────────────────────────────────────────────────────┘
```

- `--surface` background, 1px `--border` top edge. 64px top padding, 48px bottom.
- Column headings: Label style DM Sans 500 14/20 `--text-muted`, **sentence case**.
- Links: Body 16/26 `--text-secondary`, 12px apart, 44px effective target height.
- Disclaimer: Body Small 14/22 Inter `--text-secondary`, full 68ch measure, above a hairline. **Real text, never an image.**
- `India (verify)`: Caption 12/18 Inter `--text-muted`.
- **No company name, address, CIN, GST, copyright line, social icons, or newsletter field.** No Terms link (no such page exists — flagged in the IA doc §E).
- **1280:** unchanged.

---

## Desktop QA checklist

- [ ] No section exceeds 68ch for prose at either width
- [ ] No shadow on any static section
- [ ] No gradient anywhere
- [ ] Only two card usages: §07 panels, §12 accordion rows
- [ ] Only two numbered-marker usages: §06 steps, §11 checklist
- [ ] Evidence rail present in §02 preview, §03 showcase, §04 panel
- [ ] Urgency uses icon + word + colour, never colour alone
- [ ] `Verify` renders as a word beside a hollow marker, never a shape alone
- [ ] Money and dates in Inter tabular numerals
- [ ] Devanagari carries `lang="hi"` and +4px line-height
- [ ] Focus ring visible on every interactive element, 2px + 2px offset
- [ ] All touch targets ≥44px
- [ ] Reveal animation fires once, on first load only
- [ ] axe passes at 1440 and 1280
- [ ] Keyboard path: skip link → hero CTA → §07 CTAs → §12 accordion → §13 CTA → footer
