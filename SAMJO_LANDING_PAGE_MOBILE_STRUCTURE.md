# Samjo Landing Page — Mobile Structure

Targets: **390 × 844** (design target), **360 × 800** (narrowest supported), **430 × 932** (largest).

ACCESSIBILITY §4 names 360, 390 and 430 as the primary breakpoints. **360 is the constraint that governs** — if it works at 360 it works everywhere above.

---

## Mobile is not a narrowed desktop

Three things change structurally, not just in width:

1. **CTA position in the hero.** Desktop places the briefing preview beside the copy. Mobile places it *after* the buttons. A person on a phone should not scroll past a specimen image to reach the action.
2. **Section 06 and 08 change axis.** Four horizontal steps become four vertical steps on a rail. Two columns become one.
3. **Long sections gain collapse behaviour.** §03's lower briefing sections and §12's FAQ collapse. Nothing that carries a safety or privacy obligation ever collapses — see the collapse policy below.

**Collapse policy.** These may never be collapsed, truncated, or hidden behind "read more" on any breakpoint:
- The AI-provider disclosure in §09
- The device-voice caveat in §08
- The situation-flow asymmetry line in §07
- Any part of §10
- The footer disclaimer

Each exists because a spec requires the user to actually read it. Hiding one behind an interaction defeats its purpose.

---

## Global mobile frame

| Property | 360 | 390 | 430 |
|---|---|---|---|
| Side gutter | **16px** | 20px | 24px |
| Content width | 328px | 350px | 382px |
| Section vertical rhythm | 56px | 64px | 64px |
| Prose size | Body Large 18/28 | 18/28 | 18/28 |
| Display (hero) | 28/34 | 32/38 | 32/38 |
| H2 | 22/28 | 24/30 | 24/30 |
| H3 | 18/24 | 20/26 | 20/26 |

**Non-negotiables at every width:**
- **No horizontal scroll.** Nothing, including the briefing preview, may overflow.
- **Briefing prose stays at 18px.** DESIGN_SYSTEM §3: "the reader is stressed and may be older." Do not step body copy down to 16px to save space at 360.
- **Touch targets ≥44px**, including evidence-rail markers (8px dot inside a 44px hit area).
- **Devanagari gets +4px line-height** and `lang="hi"`.
- Single column throughout. No side-by-side anything.
- No shadows on static content. No gradients.

---

## 01 — Header

```
┌────────────────────────────────┐
│ Samjo      EN|हिन्दी   [Start] │
└────────────────────────────────┘
        1px --border
```

**Stacking:** single row, 56px tall (down from desktop's 64px), sticky.
**Content priority:** wordmark → language switcher → Start.
**What disappears:** the three nav links. They move to the footer.
**No hamburger menu.** Four links do not justify a drawer, and a drawer adds a focus trap to build and maintain for no gain.
**CTA behaviour:** `Start` is `sm` 36px height but with a 44px tap target via padding.
**Language switcher:** compact `EN | हिन्दी` toggle, both labels visible — not a dropdown. A Hindi-first user must see हिन्दी without opening anything.
**360:** switcher labels shorten to `EN | हि`? **No** — keep `हिन्दी` in full and drop the `Start` button label to the wordmark's right at 36px. Never abbreviate the Hindi label.
**Spacing:** 16px gutters at 360.

---

## 02 — Hero

**Stacking order — this differs from desktop:**

```
┌────────────────────────────────┐
│ Samjo                          │  1. Wordmark
│ Samajh aane tak.               │  2. Tagline
│                                │
│ Know where you stand.          │  3. Headline (Display 28–32)
│                                │
│ Legal documents ko samajhna    │  4. Hindi line (lang="hi")
│ mushkil nahi hona chahiye.     │
│                                │
│ Show us a rental agreement or  │  5. Explanation
│ a housing notice, or just tell │
│ us what happened. Samjo        │
│ explains what it says…         │
│                                │
│ ┌────────────────────────────┐ │  6. Primary CTA — full width
│ │   I have a document        │ │
│ └────────────────────────────┘ │
│ ┌────────────────────────────┐ │  7. Secondary CTA — full width
│ │   Something happened       │ │
│ └────────────────────────────┘ │
│                                │
│ Source-grounded · Private by   │  8. Trust meta (wraps to 2 lines)
│ design · Hindi + English       │
│                                │
│ No account. No sign-up.        │  9. Reassurance
│                                │
│ ┌────────────────────────────┐ │ 10. Preview — LAST
│ │ ⚠ Time-sensitive           │ │
│ │ What this is               │ │
│ │ A notice to vacate…        │ │
│ │ What you need to do        │ │
│ │ │                          │ │
│ │ ├─● Respond within 30 days │ │
│ │ ├─● Pay ₹25,000            │ │
│ │  ┌──────────────────────┐  │ │
│ │  │ Where this comes from│  │ │
│ │  │ Document says        │  │ │
│ │  │ "The Tenant shall…"  │  │ │
│ │  │ Samjo interprets     │  │ │
│ │  │ …                    │  │ │
│ │  │ How confident?  High │  │ │
│ │  └──────────────────────┘  │ │
│ └────────────────────────────┘ │
└────────────────────────────────┘
```

**Content priority:** headline → CTAs → everything else. A visitor who reads only the headline and taps a button has succeeded.
**CTA behaviour:** both **full-width, stacked, 52px, 12px apart.** Both remain `lg`. Equal weight is still required.
**Preview behaviour:** scales to container width, **never scrolls horizontally**. The evidence panel inside stays **open** — it is the differentiator and it must be visible without interaction on a phone too. If the full briefing won't fit legibly at 360, show fewer rows rather than shrinking type: keep the urgency banner, "What this is", one "What you need to do" item, and the open evidence panel. **Never reduce the preview's type below Caption 12/18.**
**Typography at 360:** Display 28/34. The Hindi line drops to 18/28 (+4px = 18/32 effective).
**Spacing:** 56px above, 64px below.
**Motion:** the single reveal still fires, 40ms stagger, first load only. Under `prefers-reduced-motion`, opacity only.

---

## 03 — Product showcase

```
┌────────────────────────────────┐
│ This is what you get      (h2) │
│ Not a shorter version of your  │
│ document…                      │
│                                │
│ ⚠  Time-sensitive              │  ← always expanded
│    You have 30 days from       │
│    14 March to respond.        │
│ ───────────────────────────    │
│ What this is              ▾    │  ← expanded by default
│   A notice to vacate, sent by  │
│   your landlord…               │
│ ───────────────────────────    │
│ What you need to do       ▾    │  ← expanded by default
│ │                              │
│ ├─●  Respond in writing        │
│ │    within 30 days            │
│ │                              │
│ ├─●  Pay the outstanding rent  │
│ │    of ₹25,000                │
│ ───────────────────────────    │
│ Watch out                 ▸    │  ← collapsed
│ ───────────────────────────    │
│ Important details         ▸    │  ← collapsed
│ ───────────────────────────    │
│ Dates that matter         ▸    │  ← collapsed
│ ───────────────────────────    │
│ Questions to ask               │
│   4 questions prepared         │
│ ───────────────────────────    │
│ ┌────────────────────────────┐ │
│ │  See what to do next       │ │
│ └────────────────────────────┘ │
│                                │
│ Every line has a marker…       │
└────────────────────────────────┘
```

**Stacking:** the fixed UX_FLOWS §4 order, unchanged. Order is never reflowed on mobile — it encodes the product thesis.
**Collapse behaviour:** accordion, **first two sections expanded by default** (UX_FLOWS §5: "Sections are collapsible, first two expanded by default"). The urgency banner is never collapsible.
**Content priority:** urgency → what this is → what you need to do. Those three answer the user's question; the rest is detail.
**Rail behaviour:** the evidence rail **narrows but never disappears.** It is the identity element (DESIGN_SYSTEM §1). At 360 it sits 8px from the content edge instead of 12px.
**Markers:** 8px dot, 44px hit area — the hit area may overlap adjacent padding but must not overlap another marker's.
**Money/dates:** Inter tabular numerals. At 360, label and figure stack rather than sitting in two columns, so figures never truncate.
**Verify:** hollow marker + the word `Verify` on its own line beneath the item text if it won't fit inline.
**Spacing:** 24px between sections, 16px gutters at 360.

---

## 04 — Evidence

```
┌────────────────────────────────┐
│ Samjo shows you where every    │
│ answer came from          (h2) │
│                                │
│ Samjo never merges three       │
│ different things. What your    │
│ document says, what Samjo      │
│ reads into it, and what a      │
│ professional should check stay │
│ separate on screen.            │
│                                │
│ ┌────────────────────────────┐ │
│ │ Where this comes from      │ │
│ │                            │ │
│ │ Document says              │ │
│ │ "The Tenant shall deposit  │ │
│ │  a sum of Rs. 25,000/- as  │ │
│ │  interest-free security"   │ │
│ │ Page 1                     │ │
│ │ ─────────────────────────  │ │
│ │ Samjo interprets           │ │
│ │ This is refundable, but    │ │
│ │ the agreement sets         │ │
│ │ conditions for deductions. │ │
│ │ ─────────────────────────  │ │
│ │ How confident is Samjo?    │ │
│ │ High                       │ │
│ └────────────────────────────┘ │
│                                │
│ If Samjo can't point to the    │
│ exact sentence in your         │
│ document, it doesn't make the  │
│ claim at all.                  │
│                                │
│ Where Samjo is less sure, it   │
│ says so and marks the item     │
│ Verify…                        │
└────────────────────────────────┘
```

**Stacking:** heading → thesis → panel → drop rule → confidence line. The panel moves **above** the drop rule on mobile (desktop has them side by side) so the visual proof arrives before the explanation.
**Content priority:** the panel. If a user reads nothing else in this section, the three labelled blocks alone communicate the differentiator.
**What must not happen:** the three blocks must never merge into a single paragraph at any width. Hairline + 16px separation between each, always.
**`How confident is Samjo?` and `High`** stack on two lines at 360 rather than sitting on one — never truncate the question.
**Typography:** quote in **Inter** Body Small 14/22; `Samjo interprets` body in **DM Sans** Body 16/26. The family switch is meaningful and must survive to mobile.
**Nothing collapses here.** This is the differentiator.
**Spacing:** panel gets 20px internal padding at 360, 24px at 390+.

---

## 05 — The problem

```
┌────────────────────────────────┐
│ The hard part isn't the words  │
│                           (h2) │
│ Most people can read a legal   │
│ notice. What they can't do is  │
│ answer four questions about it.│
│                                │
│ 1.  What is this document, and │
│     is it serious?             │
│                                │
│ 2.  Which parts of it actually │
│     affect me?                 │
│                                │
│ 3.  Is a clock running?        │
│                                │
│ 4.  What do I do next, and     │
│     what should I ask a        │
│     professional?              │
│                                │
│ A summary answers none of      │
│ these. It gives you a shorter  │
│ version of the same confusion. │
└────────────────────────────────┘
```

**Stacking:** unchanged from desktop — it was already a single column.
**Nothing collapses.** This is short and it is the emotional hinge of the page.
**Typography:** questions stay at Body Large 18/28. 20px between items at 360 (down from 24px).
**Numerals:** hang outside the text block; at 360 they may sit inline with 8px following space if hanging would cost too much width.
**Content priority:** all four questions, equally. Do not truncate to three.

---

## 06 — How Samjo works

**Axis change: horizontal → vertical.**

```
┌────────────────────────────────┐
│ How it works              (h2) │
│                                │
│ │ 01  Show us the document,    │
│ │     or tell us what happened │
│ │     A rental agreement, a    │
│ │     housing notice, a photo… │
│ │                              │
│ │ 02  Samjo reads it and works │
│ │     out what it is           │
│ │     Before anything else…    │
│ │                              │
│ │ 03  Samjo finds what matters │
│ │     What you must do, what   │
│ │     money is involved…       │
│ │                              │
│ │ 04  You get a briefing you   │
│ │     can check                │
│ │     Every point carries a    │
│ │     marker back…             │
│                                │
│ Usually about a minute. Samjo  │
│ shows you what it's doing…     │
└────────────────────────────────┘
```

**The connecting hairline becomes vertical**, running down the left edge — deliberately echoing the evidence rail. This is the same motif in both orientations and is the page's structural signature.
**Stacking:** four steps in order, 32px apart.
**Nothing collapses.** Four short steps are the friction-removal section; hiding them defeats the purpose.
**Typography:** numerals DM Sans 500 18px `--text-muted`; titles H3 18/24 at 360; bodies Body 16/26.
**No icons, no arrows.** The rail carries sequence.

---

## 07 — Two ways to start

```
┌────────────────────────────────┐
│ Two ways to start         (h2) │
│ Both are real starting points… │
│                                │
│ ┌────────────────────────────┐ │
│ │ I have a document          │ │
│ │                            │ │
│ │ Show us a rental agreement │ │
│ │ or a housing notice…       │ │
│ │ ─────────────────────────  │ │
│ │ Takes                      │ │
│ │ PDF, Word, or a photo —    │ │
│ │ up to 10 MB and 30 pages   │ │
│ │                            │ │
│ │ Gives                      │ │
│ │ A briefing where every     │ │
│ │ point traces to your       │ │
│ │ document                   │ │
│ │                            │ │
│ │ ┌────────────────────────┐ │ │
│ │ │ Start with a document  │ │ │
│ │ └────────────────────────┘ │ │
│ └────────────────────────────┘ │
│                                │
│ ┌────────────────────────────┐ │
│ │ Something happened         │ │
│ │                            │ │
│ │ Tell us what happened in   │ │
│ │ your own words…            │ │
│ │ ─────────────────────────  │ │
│ │ Takes                      │ │
│ │ A few questions, one at    │ │
│ │ a time                     │ │
│ │                            │ │
│ │ Gives                      │ │
│ │ Orientation, what's still  │ │
│ │ unknown, and questions     │ │
│ │                            │ │
│ │ ┌────────────────────────┐ │ │
│ │ │ Tell us what happened  │ │ │
│ │ └────────────────────────┘ │ │
│ └────────────────────────────┘ │
│                                │
│ Without a document there's     │
│ nothing to quote from, so this │
│ path gives you orientation and │
│ questions rather than a        │
│ line-by-line briefing. You can │
│ add a document later.          │
└────────────────────────────────┘
```

**Stacking:** `I have a document` first (PRD §2 — personas A and B drive the MVP).
**Not a carousel.** A carousel hides the second option, and UX_FLOWS §3 requires both to feel equally legitimate. Both panels are always fully visible.
**Nothing collapses.** Both panels render in full.
**`Takes` / `Gives`:** the desktop two-column key/value layout becomes **stacked label-above-value** at mobile widths so nothing truncates.
**CTA behaviour:** full panel width, 52px. Panel A primary, Panel B secondary.
**Asymmetry line:** sits outside panel B, full width, **never collapsed or truncated**, bound via `aria-describedby`.
**Panel padding:** 20px at 360, 24px at 390+.

---

## 08 — Language, read-aloud and access

```
┌────────────────────────────────┐
│ Built to be used, not just     │
│ visited                   (h2) │
│                                │
│ Hindi and English, all the     │
│ way through                    │
│ Not just the buttons. The      │
│ briefing itself…               │
│                                │
│ Listen instead of reading      │
│ Play the briefing aloud…       │
│                                │
│ Works on the phone you have    │
│ Designed for a 360-pixel       │
│ screen and a slow connection…  │
│                                │
│ Keyboard and screen reader     │
│ throughout                     │
│ Every part of the flow…        │
│                                │
│ ───────────────────────────    │
│ Read-aloud uses the voices     │
│ already on your device, so a   │
│ Hindi voice depends on your    │
│ phone. If yours doesn't have   │
│ one, Samjo tells you instead   │
│ of reading Hindi in an English │
│ voice.                         │
└────────────────────────────────┘
```

**Axis change:** two columns → one. Four statements in order, 28px apart.
**No icons.**
**The caveat line never collapses** and is not visually de-emphasised — ACCESSIBILITY §1 requires it to be read.
**This section is a good place to be self-demonstrating:** "Works on the phone you have / Designed for a 360-pixel screen" is being read, at that width, on that phone. Do not undercut it with a layout that strains at 360.

---

## 09 — Privacy

```
┌────────────────────────────────┐
│ What happens to your document  │
│                           (h2) │
│ No account                     │
│ No email, no phone number,     │
│ no password.                   │
│ ───────────────────────────    │
│ Deleted within 24 hours        │
│ Your document and its text are │
│ removed within a day, or the   │
│ moment you ask.                │
│ ───────────────────────────    │
│ Never in our logs              │
│ The text of your document is   │
│ never written into any log.    │
│ ───────────────────────────    │
│ Read by an AI service          │
│ To analyse your document,      │
│ Samjo sends its text to an AI  │
│ provider. We're telling you    │
│ because you'd want to know.    │
│                                │
│ Read the full privacy note →   │
└────────────────────────────────┘
```

**Stacking:** four statements in order, hairline-separated, 24px apart.
**Nothing collapses. The fourth statement especially.** SECURITY §5 requires it stated plainly; putting it behind a tap on the smallest screen would be exactly the burying the product exists to help people notice.
**Equal weight:** all four titles at H3, all four bodies at Body 16/26 `--text-secondary`. The fourth must not be smaller or greyer.
**No lock icons, no shields, no badges.**

---

## 10 — What Samjo does not do

```
┌────────────────────────────────┐
│ What Samjo does, and what it   │
│ doesn't                   (h2) │
│                                │
│ What it does                   │
│ Samjo explains what your       │
│ document says, points out what │
│ matters and what's             │
│ time-sensitive, and helps you  │
│ prepare for a professional.    │
│                                │
│ ───────────────────────────    │
│ What it doesn't                │
│                                │
│ It won't predict how a dispute │
│ will turn out.                 │
│                                │
│ It won't tell you whether to   │
│ sign.                          │
│                                │
│ It won't decide whether a      │
│ clause is enforceable.         │
│                                │
│ It isn't a lawyer, and it      │
│ doesn't replace one.           │
│                                │
│ ───────────────────────────    │
│ Ask Samjo who'll win and this  │
│ is what it says:               │
│                                │
│ │ "I can help you understand  │
│ │ the document, identify what │
│ │ it says, highlight issues   │
│ │ to discuss with a legal     │
│ │ professional, and prepare   │
│ │ questions. I can't predict  │
│ │ the outcome of a legal      │
│ │ dispute."                   │
│                                │
│ That's not Samjo being         │
│ cautious. Applying law to your │
│ facts is what a qualified      │
│ professional is for.           │
└────────────────────────────────┘
```

**Stacking:** does → doesn't → quote → closing. "Does" comes first so the section doesn't open on a wall of negatives.
**Nothing collapses.** Whole section always visible.
**The quote** keeps its 2px `--border-strong` left rule and 16px left padding at 360. Body Large 18/28.
**Not `--danger-surface`. No red. No ✗ icons.** AI_SAFETY §8 keeps escalation styling distinct from disclaimer styling.

---

## 11 — Preparing for professional help

```
┌────────────────────────────────┐
│ Walk in knowing what to ask    │
│                           (h2) │
│ Legal help costs money, and    │
│ much of a first consultation   │
│ goes on explaining the basics. │
│ Samjo does that part first.    │
│                                │
│ 01  The questions worth        │
│     asking, and why each one   │
│     matters                    │
│                                │
│ 02  What's still unclear in    │
│     your document, named       │
│     plainly                    │
│                                │
│ 03  What to take with you      │
│                                │
│ 04  Where Samjo wasn't sure,   │
│     so you can have it checked │
│                                │
│ ┌────────────────────────────┐ │
│ │ Sample question            │ │
│ │                            │ │
│ │ "Does the deposit clause   │ │
│ │ let you deduct repair      │ │
│ │ costs without giving me an │ │
│ │ itemised list?"            │ │
│ │ ─────────────────────────  │ │
│ │ Why this one matters       │ │
│ │ The agreement mentions     │ │
│ │ deductions but doesn't say │ │
│ │ whether an itemised list   │ │
│ │ is required.               │ │
│ └────────────────────────────┘ │
│                                │
│ Where a document looks         │
│ time-sensitive, or the         │
│ situation is serious, Samjo    │
│ puts getting help above        │
│ reading further.               │
└────────────────────────────────┘
```

**Stacking:** checklist above the sample-question panel (desktop has them side by side).
**Nothing collapses.**
**Numerals** hang at 390+; may go inline with 8px following space at 360.
**Panel:** `--radius-md`, 20px padding at 360, no shadow.
**Still no lawyer names, firms, numbers, ratings, prices, or legal-aid listings.**

---

## 12 — Questions people ask

```
┌────────────────────────────────┐
│ Questions people ask      (h2) │
│                                │
│ ▾ What is Samjo?               │
│   A tool that helps you        │
│   understand a legal document  │
│   you've received…             │
│ ───────────────────────────    │
│ ▸ Do I need an account?        │
│ ───────────────────────────    │
│ ▸ What can I give Samjo?       │
│ ───────────────────────────    │
│ ▸ What kinds of documents does │
│   Samjo handle right now?      │
│ ───────────────────────────    │
│ ▸ Can I use Samjo in Hindi?    │
│ … (12 items)                   │
└────────────────────────────────┘
```

**Collapse behaviour:** accordion, first item open. This is the section mobile collapse exists for.
**Trigger rows:** full width, minimum 56px tall (comfortably above 44px), question wrapping to two lines where needed with the chevron vertically centred and right-aligned.
**Questions:** H3 18/24 at 360. Never truncated with an ellipsis — wrap instead.
**Answers:** Body 16/26, 16px top padding, 16px bottom.
**Chevron:** 20px, `--text-muted`, rotates on expand. Under `prefers-reduced-motion`, the rotation is instant.
**Multi-expand preferred** so a user comparing two answers doesn't lose one.

---

## 13 — Final CTA

```
┌────────────────────────────────┐
│    (full-bleed --surface-subtle)│
│                                │
│ Start understanding where you  │
│ stand                     (h2) │
│                                │
│ One document, or one           │
│ description of what happened.  │
│ About a minute either way.     │
│                                │
│ ┌────────────────────────────┐ │
│ │    Start with Samjo        │ │
│ └────────────────────────────┘ │
│                                │
│     See how it works first     │
│                                │
│ No account. Deleted within     │
│ 24 hours.                      │
│                                │
└────────────────────────────────┘
```

**Band:** full-bleed edge to edge, ignoring the page gutter. 64px vertical padding at 360, 80px at 390+.
**Left-aligned at 360**, centred at 390+. Centred text at 360 across three wrapped lines reads worse than left-aligned.
**CTA:** **full width**, 52px. Desktop keeps this button auto-width; mobile takes it full-width.
**Secondary:** text link below, 44px tap target via padding.
**No sticky bottom CTA bar.** The page has CTAs in the header, hero, §07 and here. A fifth, permanently docked, would be the aggressive conversion pattern UX_FLOWS §8 and the brief both rule out.

---

## 14 — Footer

```
┌────────────────────────────────┐
│ Samjo                          │
│ Samajh aane tak.               │
│                                │
│ Product                        │
│ How it works                   │
│ Two ways to start              │
│                                │
│ Limits and safety              │
│ What Samjo does and doesn't    │
│                                │
│ Privacy and access             │
│ Privacy                        │
│ Accessibility                  │
│                                │
│ English   हिन्दी                │
│ ───────────────────────────    │
│ Samjo gives legal information  │
│ to help you understand your    │
│ document and prepare. It is    │
│ not legal advice and not a     │
│ substitute for a lawyer.       │
│                                │
│ India (verify)                 │
└────────────────────────────────┘
```

**Stacking:** wordmark → three link groups → language switcher → hairline → disclaimer → jurisdiction.
**The header's dropped nav links live here.** This is why no hamburger is needed.
**Nothing collapses.**
**Links:** 44px row height each, `--text-secondary`, 16px Body.
**Group headings:** Label style `--text-muted`, sentence case.
**Language switcher repeated** for reach — a user who scrolled the whole page shouldn't have to scroll back up to switch.
**Disclaimer:** Body Small 14/22 Inter, full width, real text.
**No company name, address, CIN, GST, copyright, social icons, newsletter. No Terms link.**

---

## Mobile QA checklist

- [ ] **No horizontal scroll at 360, 390 or 430** — including the hero preview
- [ ] Hero CTAs appear **before** the briefing preview
- [ ] Both hero CTAs full-width, 52px, equal weight
- [ ] Briefing prose never drops below 18px
- [ ] Preview type never drops below Caption 12/18
- [ ] Evidence rail present and visible in §02, §03, §04
- [ ] Evidence panel in §02 and §04 renders **open**
- [ ] §04's three blocks never merge into one paragraph
- [ ] §03 accordion: first two sections expanded, urgency banner never collapsible
- [ ] **Never collapsed:** AI-provider disclosure (§09), device-voice caveat (§08), asymmetry line (§07), all of §10, footer disclaimer
- [ ] §07 is stacked panels, not a carousel; document panel first
- [ ] All tap targets ≥44px, including 8px rail markers
- [ ] No hamburger menu; nav links present in footer
- [ ] No sticky bottom CTA bar
- [ ] Devanagari: `lang="hi"` + 4px extra line-height, label never abbreviated
- [ ] Money and dates in Inter tabular numerals; label/value stack at 360
- [ ] `Verify` renders as a word, wrapping to its own line if needed
- [ ] 16px side gutter at 360
- [ ] 200% zoom at 360px loses no content or function (ACCESSIBILITY §5)
- [ ] `prefers-reduced-motion`: no reveal, no transforms, no chevron rotation
- [ ] axe passes at 360
- [ ] Keyboard path complete with an on-screen keyboard present
