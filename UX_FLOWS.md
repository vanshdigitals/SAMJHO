# Samjo: Screens, States and Microcopy

## 1. Routing philosophy

Forty-three screen concepts do not become forty-three routes. Most are **states** of a small number of surfaces. Routing a user to a different URL to see an error, a loading bar, or a highlighted clause fragments the experience and breaks back-button expectations.

| Route | Absorbs these states |
|---|---|
| `/` | Landing, how it works, safety summary |
| `/start` | Choose starting point |
| `/upload` | Upload, validation error, unsupported file, permission, OCR notice |
| `/d/:id/processing` | Reading, characterizing, analyzing, failed, partial |
| `/d/:id` | Briefing with all sections, evidence drawer, urgency, low-confidence, empty |
| `/d/:id/help` | Professional help, lawyer preparation |
| `/situation` | Intake, questions, summary, missing info, next steps, escalation |
| `/privacy`, `/safety`, `/accessibility` | Static policy surfaces |

Settings for language, read-aloud and text size live in a persistent header control, not a route. Delete is a modal on the briefing, not a page.

## 2. Flow 1: document

```
Landing
  └─ "I have a document"
       └─ Upload  ──(invalid)──> inline error naming the reason, retry or switch file
            └─ Processing (real pipeline states, no fake percentages)
                 ├─ Reading your document
                 ├─ Working out what this is
                 ├─ Finding what matters
                 ├─ Checking dates and amounts
                 └─ Preparing your briefing
                      ├─(not a legal document)──> offer situation flow
                      ├─(extraction empty)──────> "couldn't read this" + alternatives
                      └─ Briefing
                           ├─ Urgency banner (HIGH / CRITICAL only)
                           ├─ What this is
                           ├─ What you need to do
                           ├─ Watch out
                           ├─ Important details (money)
                           ├─ Dates that matter
                           ├─ Questions to ask
                           └─ tap any item ──> Evidence
                                                ├─ Document says (highlighted in source)
                                                ├─ Samjo interprets
                                                └─ Confidence / verify
                           └─ What to do next ──> Professional help ──> Lawyer prep
                                                └─ Export / Delete
```

## 3. Flow 2: situation

```
Landing
  └─ "Something happened"
       └─ Three to five plain questions, one per screen on mobile
            └─ What we understand so far
                 ├─ What we don't know yet   (named explicitly, not hidden)
                 ├─ Things people in this position often do next
                 ├─ When to get professional help
                 ├─ Questions worth asking
                 └─ "Do you have a document? Show us" ──> Flow 1
```

Situation output is deliberately thinner than document output. Without a document there is nothing to ground against, so it never produces obligations, deadlines or money items. Making that asymmetry visible is honest and is itself a safety feature.

## 4. Information hierarchy on the briefing

Order is fixed and is not user-configurable, because the ranking encodes the product thesis.

1. Urgency, when HIGH or CRITICAL
2. What this is
3. What you need to do
4. Watch out
5. Important details (money)
6. Dates that matter
7. Questions to ask
8. What to do next (persistent primary action)

Evidence is never a section. It is attached to every item, reachable from the item itself.

## 5. Desktop vs mobile

**Mobile (primary, 360 / 390 / 430):** single column. Evidence opens in a bottom sheet over the briefing, so the user never loses their place. Sections are collapsible, first two expanded by default.

**Desktop (1024+):** three panes, but only where width genuinely supports it.

```
┌──────────────┬────────────────────────┬──────────────────┐
│ Sections     │  Briefing              │  Evidence        │
│ (jump list)  │  (reading column,      │  (source text,   │
│              │   max 68ch)            │   highlighted)   │
│ Urgency      │                        │                  │
│ What this is │  ## What you need to do│  Document says   │
│ Must do   ●  │  1. ...          [src] │  "...quoted..."  │
│ Watch out    │  2. ...          [src] │                  │
│ Details      │                        │  Samjo interprets│
│ Dates        │                        │  ...             │
│ Questions    │                        │                  │
└──────────────┴────────────────────────┴──────────────────┘
```

The centre column keeps the same 68-character measure at every width. Desktop is not a stretched phone, and it is not a dashboard.

## 6. State inventory

Every async surface ships six states. Designing only the happy path is the single most common way this product would fail a real user.

| State | Rule |
|---|---|
| Loading | Real pipeline stage names. Never a fabricated percentage. |
| Success | Content renders with evidence affordances present, not hidden behind hover. |
| Empty | An invitation to act, not a shrug. |
| Partial | Says which sections completed and which did not, and offers retry for the rest. |
| Error | Names what happened and what to do. Never "something went wrong." |
| Retry | Always available, and never loses the uploaded file. |

### Error copy

| Condition | Copy |
|---|---|
| Unreadable file | "Samjo couldn't read this document. It looks like a scan with no text layer. Try a clearer photo, or upload the original PDF." |
| Encrypted PDF | "This PDF is password-protected, so Samjo can't open it. Remove the password and upload it again." |
| Too large | "This file is over 10 MB. Try uploading just the pages that matter." |
| Wrong type | "Samjo reads PDF, Word and photos. This file is a different type." |
| Not legal | "This doesn't look like a legal document. If something has happened and you want help thinking it through, tell us about it instead." |
| Analysis failed | "Samjo read your document but couldn't finish the briefing. Your file is still here. Try again." |
| Offline | "You're offline. Samjo will pick up where you left off when you reconnect." |

## 7. Microcopy rules

System vocabulary is banned from the interface. The left column never appears on screen.

| Not this | This |
|---|---|
| Upload your legal document | Show us the document |
| AI Analysis | Understanding your document |
| Risk Assessment | Watch out |
| Legal Obligations | What you need to do |
| Extracted Entities | Important details |
| Retrieval confidence | How confident is Samjo? |
| Source span | Where this comes from |
| Submit | Show us the document |
| Processing | Reading your document |

Actions keep their name across the whole flow. The button that says "Show us the document" leads to a state that says "Reading your document," not "Processing upload."

## 8. Landing page

Hero carries the brand line and the two entries. Nothing else competes.

```
Samjo
Samajh aane tak.

Legal documents ko samajhna mushkil nahi hona chahiye.

Upload a document or tell us what happened. Samjo helps you
understand what matters, what's urgent, and what to do next.

[ I have a document ]   [ Something happened ]

Source-grounded · Private by design · Hindi + English
```

Below the fold, one short section showing a real briefing fragment with a visible source link, because the differentiator has to be seen rather than claimed. Then the limits, stated plainly rather than buried in a footer.

Banned from this page: invented statistics, user counts, testimonials, logo walls, a gradient hero, animated blobs, "revolutionising law" copy, and any claim that Samjo does what a lawyer does.

## 9. Safety disclosure placement

A permanent banner across every screen trains people to stop seeing it. Samjo uses contextual disclosure instead.

- One line in the landing hero area.
- One line at the top of the first briefing a user ever sees.
- Inline, at the moment it matters: next to next steps, and in the professional-help surface.
- Always in the export.

The escalation message for HIGH and CRITICAL is not a disclaimer and is styled differently from one:

> This document appears to contain a time-sensitive requirement. Consider getting professional legal help promptly.
