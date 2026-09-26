# Samjo Landing Page — Final Copy

Near-final copy, ready for Stitch. Bracketed notes `[ ]` are instructions, not copy.

Copy rules in force throughout, from UX_FLOWS §7 and DESIGN_SYSTEM §3:
- Sentence case everywhere. No all-caps labels.
- Banned words on every surface: Upload, Submit, Processing, AI Analysis, Risk Assessment, Legal Obligations, Extracted Entities, Retrieval confidence, Source span, LLM, OCR, pipeline, model.
- Actions keep their name across the whole flow. The button that says "Show us the document" leads to a state that says "Reading your document."
- Measure capped at 68 characters. Every paragraph below is written to fit it.

---

## 01 — Header

```
[wordmark]  Samjo

Nav (desktop only):
  How it works
  What Samjo does
  Privacy

Language switcher:
  English   हिन्दी

Button (secondary, sm):
  Start
```

---

## 02 — Hero

```
[Wordmark lockup]
Samjo
Samajh aane tak.

[English support line]
Know where you stand.

[Hindi context line — lang="hi"]
Legal documents ko samajhna mushkil nahi hona chahiye.

[Explanation — two sentences, 68ch measure]
Show us a rental agreement or a housing notice, or just tell us
what happened. Samjo explains what it says, what matters in it,
and what to do next.

[Primary button, lg 52px]
I have a document

[Secondary button, lg 52px]
Something happened

[Trust meta line — verbatim from UX_FLOWS §8]
Source-grounded · Private by design · Hindi + English

[Reassurance line, Body Small, --text-muted]
No account. No sign-up. Nothing to remember.
```

**Hero briefing preview — the exact content to render:**

```
┌─────────────────────────────────────────────────┐
│  ⚠  Time-sensitive                              │
│     You have 30 days from 14 March to respond.  │
├─────────────────────────────────────────────────┤
│  What this is                                    │
│  A notice to vacate, sent by your landlord.     │
│                                                  │
│  What you need to do                             │
│  │                                               │
│  ├─●  Respond in writing within 30 days          │
│  │                                               │
│  ├─●  Pay the outstanding rent of ₹25,000        │
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │ Where this comes from                      │ │
│  │                                            │ │
│  │ Document says                              │ │
│  │ "The Tenant shall vacate the premises      │ │
│  │  within thirty (30) days of receipt        │ │
│  │  of this notice."                          │ │
│  │ Page 1                                     │ │
│  │                                            │ │
│  │ Samjo interprets                           │ │
│  │ The notice period starts from the date you │ │
│  │ received it, not the date on the letter.   │ │
│  │                                            │ │
│  │ How confident is Samjo?     High           │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

`[Text equivalent for screen readers, replacing the aria-hidden preview]`
> A sample Samjo briefing for a notice to vacate. It shows a time-sensitive banner, what the document is, two things the reader needs to do, and an open evidence panel quoting the document with Samjo's plain-language reading beside it.

---

## 03 — Product showcase

```
[h2]
This is what you get

[Framing line]
Not a shorter version of your document. An answer to what it
means for you, in a fixed order, with the urgent part first.
```

**Briefing rendered in the fixed UX_FLOWS §4 order. Labels verbatim:**

```
⚠  Time-sensitive
   You have 30 days from 14 March to respond.

What this is
   A notice to vacate, sent by your landlord under the terms
   of your rental agreement.

What you need to do
   ├─●  Respond in writing within 30 days
   ├─●  Pay the outstanding rent of ₹25,000

Watch out
   ├─●  The agreement lets the landlord deduct repair costs
        from your deposit without an itemised list.
        [Verify]

Important details
   ├─●  Security deposit          ₹25,000
   ├─●  Monthly rent              ₹12,000

Dates that matter
   ├─●  Respond by                13 April 2026   [Verify]

Questions to ask
   4 questions prepared for a legal professional

What to do next
   [ See what to do next ]
```

```
[Closing line, pointing at the rail]
Every line has a marker beside it. Tap one and you see the exact
sentence it came from, and where in the document it sits.
```

---

## 04 — Evidence

```
[h2]
Samjo shows you where every answer came from

[Thesis, Body Large]
Samjo never merges three different things. What your document
says, what Samjo reads into it, and what a professional should
check stay separate on screen — because they are separate.

[The drop rule, stated plainly]
If Samjo can't point to the exact sentence in your document,
it doesn't make the claim at all. Nothing unsourced reaches
your briefing.
```

**The three-state panel — labels verbatim from AI_SCHEMAS and DESIGN_SYSTEM §5:**

```
Where this comes from

Document says
"The Tenant shall deposit a sum of Rs. 25,000/- as
 interest-free security"
Page 1

Samjo interprets
This is refundable, but the agreement sets conditions
for deductions.

How confident is Samjo?          High
```

```
[Supporting line under the panel]
Where Samjo is less sure, it says so and marks the item Verify
rather than sounding equally confident about everything.
```

---

## 05 — The problem

```
[h2]
The hard part isn't the words

[Opening, Body Large]
Most people can read a legal notice. What they can't do is
answer four questions about it.

[Ordered list, Body Large]
1.  What is this document, and is it serious?
2.  Which parts of it actually affect me?
3.  Is a clock running?
4.  What do I do next, and what should I ask a professional?

[Closing line]
A summary answers none of these. It gives you a shorter version
of the same confusion.
```

---

## 06 — How Samjo works

```
[h2]
How it works

[Four steps]
01  Show us the document, or tell us what happened
    A rental agreement, a housing notice, a photo of a letter —
    or just describe what arrived.

02  Samjo reads it and works out what it is
    Before anything else, Samjo identifies the document and
    tells you how sure it is.

03  Samjo finds what matters
    What you must do, what money is involved, which dates
    are running, and what to watch for.

04  You get a briefing you can check
    Every point carries a marker back to the sentence it
    came from.

[Timing line]
Usually about a minute. Samjo shows you what it's doing while
it works — real steps, not a loading bar that means nothing.
```

---

## 07 — Two ways to start

```
[h2]
Two ways to start

[Framing line]
Both are real starting points. Pick whichever matches what
you're holding.
```

**Panel A**
```
I have a document

Show us a rental agreement or a housing notice. Samjo explains
what it says, what you're agreeing to or being asked to do,
and what's time-sensitive.

Takes:  PDF, Word, or a photo — up to 10 MB and 30 pages
Gives:  A briefing where every point traces to your document

[ Start with a document ]
```

**Panel B**
```
Something happened

Tell us what happened in your own words. Samjo asks a few plain
questions, then helps you work out where you stand and what to
ask next.

Takes:  A few questions, one at a time
Gives:  Orientation, what's still unknown, and questions to ask

[ Tell us what happened ]

[Asymmetry line — required by UX_FLOWS §3, aria-describedby this panel]
Without a document there's nothing to quote from, so this path
gives you orientation and questions rather than a line-by-line
briefing. You can add a document later.
```

---

## 08 — Language, read-aloud and access

```
[h2]
Built to be used, not just visited

[Four statements]
Hindi and English, all the way through
    Not just the buttons. The briefing itself, including the
    explanations.

Listen instead of reading
    Play the briefing aloud. Pause and pick it up again.
    It never starts on its own.

Works on the phone you have
    Designed for a 360-pixel screen and a slow connection
    first, not as an afterthought.

Keyboard and screen reader throughout
    Every part of the flow, including the evidence panel.

[Honest line — required by ACCESSIBILITY §1]
Read-aloud uses the voices already on your device, so a Hindi
voice depends on your phone. If yours doesn't have one, Samjo
tells you instead of reading Hindi in an English voice.
```

---

## 09 — Privacy

```
[h2]
What happens to your document

[Four statements — each literally true, none softened]
No account
    No email, no phone number, no password. Nothing that
    identifies you.

Deleted within 24 hours
    Your document and its text are removed within a day, or
    the moment you ask — whichever comes first.

Never in our logs
    The text of your document is never written into any log.

Read by an AI service
    To analyse your document, Samjo sends its text to an AI
    provider. We're telling you because you'd want to know.

[Link]
Read the full privacy note →
```

---

## 10 — What Samjo does not do

```
[h2]
What Samjo does, and what it doesn't

[What it does — one line]
Samjo explains what your document says, points out what matters
and what's time-sensitive, and helps you prepare for a
professional.

[What it doesn't — four statements]
It won't predict how a dispute will turn out.
It won't tell you whether to sign.
It won't decide whether a clause is enforceable.
It isn't a lawyer, and it doesn't replace one.

[The canonical refusal, quoted verbatim from AI_SAFETY §3]
Ask Samjo who'll win and this is what it says:

    "I can help you understand the document, identify what it
    says, highlight issues to discuss with a legal
    professional, and prepare questions. I can't predict the
    outcome of a legal dispute."

[Closing line]
That's not Samjo being cautious. Applying law to your facts is
what a qualified professional is for.
```

---

## 11 — Preparing for professional help

```
[h2]
Walk in knowing what to ask

[Opening]
Legal help costs money, and much of a first consultation goes
on explaining the basics. Samjo does that part first.

[Numbered checklist]
01  The questions worth asking, and why each one matters
02  What's still unclear in your document, named plainly
03  What to take with you
04  Where Samjo wasn't sure, so you can have it checked

[Sample question with rationale]
Sample question

    "Does the deposit clause let you deduct repair costs
    without giving me an itemised list?"

Why this one matters
    The agreement mentions deductions but doesn't say whether
    an itemised list is required. That gap is worth closing
    before you sign.

[Escalation line — AI_SAFETY §5]
Where a document looks time-sensitive, or the situation is
serious, Samjo puts getting help above reading further.
```

---

## 12 — Questions people ask

```
[h2]
Questions people ask
```

**Q: What is Samjo?**
> A tool that helps you understand a legal document you've received. It tells you what the document is, what matters in it, whether a deadline is running, and what to ask a professional. It gives legal information, not legal advice.

**Q: Do I need an account?**
> No. No email, no password, no sign-up. Start and you're in.

**Q: What can I give Samjo?**
> A PDF, a Word document, or a photo — JPEG or PNG. Up to 10 MB and 30 pages.

**Q: What kinds of documents does Samjo handle right now?**
> Residential rental agreements, and legal notices that come out of rental and housing situations. If you give Samjo something else, it says so rather than guessing — and offers to help you think the situation through instead.

**Q: Can I use Samjo in Hindi?**
> Yes. Both the interface and the briefing itself. Switch language at any time in the header.

**Q: Does Samjo give legal advice?**
> No. Samjo explains what your document says and helps you prepare. Applying law to your particular facts is legal advice, and that's a qualified professional's work.

**Q: Can Samjo tell me whether I'll win?**
> No, and it won't pretend to. Ask and it will say: "I can help you understand the document, identify what it says, highlight issues to discuss with a legal professional, and prepare questions. I can't predict the outcome of a legal dispute."

**Q: How does Samjo show where something came from?**
> Every point in your briefing has a marker beside it. Tap the marker and you see the exact sentence from your document, the page it's on, and Samjo's reading of it kept separate from the quote. If Samjo can't find the sentence, it drops the point rather than showing it.

**Q: What happens to my document?**
> It's deleted within 24 hours, or immediately if you ask. Its text is never written into our logs. To analyse it, Samjo does send the text to an AI provider — worth knowing before you start.

**Q: Can I listen to the briefing?**
> Yes, with pause and resume. It never starts on its own. Read-aloud uses your device's own voices, so a Hindi voice depends on your phone; if yours doesn't have one, Samjo tells you.

**Q: What if Samjo can't find something in my document?**
> It says it isn't in the document. Samjo won't fill the gap with something plausible.

**Q: What if my photo is blurry?**
> Samjo will still try, and will warn you that it wasn't confident about the text it read. You'll be able to see what it made out and check it before relying on it.

---

## 13 — Final CTA

```
[h2]
Start understanding where you stand

[Supporting line]
One document, or one description of what happened. About a
minute either way.

[Primary button, lg 52px] → /start
Start with Samjo

[Secondary, text link] → #how-it-works
See how it works first

[Reassurance, Body Small, --text-muted]
No account. Deleted within 24 hours.
```

---

## 14 — Footer

```
Samjo
Samajh aane tak.

PRODUCT                LIMITS AND SAFETY        PRIVACY AND ACCESS
How it works           What Samjo does          Privacy
Two ways to start        and doesn't            Accessibility

[Language switcher]
English   हिन्दी

─────────────────────────────────────────────────────────────

[Disclaimer — verbatim from AI_SCHEMAS]
Samjo gives legal information to help you understand your
document and prepare. It is not legal advice and not a
substitute for a lawyer.

[Jurisdiction — AI_SAFETY §6]
India (verify)
```

`[Column headings render in sentence case — "Product", "Limits and safety", "Privacy and access". Shown capitalised above only to mark them as headings.]`

---

## Copy provenance index

Every non-obvious string and where it comes from, so a reviewer can verify rather than trust.

| String | Source |
|---|---|
| "Samajh aane tak." | README, UX_FLOWS §8 |
| "Know where you stand." | README |
| "Legal documents ko samajhna mushkil nahi hona chahiye." | UX_FLOWS §8, verbatim |
| "Source-grounded · Private by design · Hindi + English" | UX_FLOWS §8, verbatim |
| "Show us the document" | UX_FLOWS §7 microcopy table |
| "What this is" / "What you need to do" / "Watch out" / "Important details" / "Dates that matter" / "Questions to ask" / "What to do next" | UX_FLOWS §4, verbatim, fixed order |
| "Where this comes from" | DESIGN_SYSTEM §5, verbatim |
| "Document says" / "Samjo interprets" | AI_SCHEMAS core principle, verbatim |
| "How confident is Samjo?" | UX_FLOWS §7 microcopy table, verbatim |
| "Verify" | DESIGN_SYSTEM §5 |
| "Time-sensitive" | DESIGN_SYSTEM §2 urgency mapping (HIGH) |
| Canonical refusal | AI_SAFETY §3, verbatim |
| Footer disclaimer | AI_SCHEMAS `AnalysisResponse.disclaimer`, verbatim |
| "India (verify)" | AI_SCHEMAS `jurisdiction_assumed`, AI_SAFETY §6 |
| 10 MB / 30 pages / PDF, Word, photo | PRD §9.1 |
| 24 hours | PRD §9.9, `DOCUMENT_TTL_HOURS` |
| "never written into any log" | SECURITY §6 |
| AI-provider disclosure | SECURITY §5, mandatory |
| Device-voice caveat | ACCESSIBILITY §1, mandatory |
| Situation-flow asymmetry line | UX_FLOWS §3 |
| "about a minute" | TRD §7 — roughly 60 seconds for a typical 10-page document |
| ₹25,000 / ₹12,000 / 30 days | Synthetic fixture values, consistent with DESIGN_SYSTEM §5's own example |
