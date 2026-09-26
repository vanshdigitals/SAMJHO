# SAMJO — Screen Inventory

## The routing reconciliation (read this first)

The brief asks for 46 screens. `UX_FLOWS.md` §1 is explicit that screen concepts must **not** become routes: *"Routing a user to a different URL to see an error, a loading bar, or a highlighted clause fragments the experience and breaks back-button expectations."*

Both are honoured. **All 46 are designed as distinct Stitch frames. They resolve to 9 routes.** A frame is a *visual state*, not a URL. This is the mapping the implementer uses, and it is why the URL column repeats.

Screens marked **†** are states of another frame and inherit its full layout — design only the delta.

---

## Master table

| # | Screen | Route | Kind | Batch |
|---|---|---|---|---|
| 01 | Landing / Home | `/` | Page | 2 |
| 02 | How Samjo works | `/` §below fold | Section † | 2 |
| 03 | Safety — what Samjo does & doesn't do | `/safety` | Page | 2 |
| 04 | Privacy | `/privacy` | Page | 2 |
| 05 | Accessibility statement | `/accessibility` | Page | 2 |
| 06 | Choose starting point | `/start` | Page | 3 |
| 07 | Upload document | `/upload` | Page | 3 |
| 08 | Upload validation error | `/upload` | State † | 3 / 10 |
| 09 | Unsupported document | `/upload` | State † | 3 / 10 |
| 10 | Processing | `/d/:id/processing` | Page | 3 |
| 11 | Document detected / ready | `/d/:id/processing` | State † | 3 |
| 12 | Analysis in progress | `/d/:id/processing` | State † | 3 |
| 13 | Analysis failed | `/d/:id/processing` | State † | 3 / 10 |
| 14 | **Briefing / main results** | `/d/:id` | **Page — the product** | 4 |
| 15 | What this is (summary) | `/d/:id` | Section † | 4 |
| 16 | What you need to do | `/d/:id` | Section † | 4 |
| 17 | Watch out | `/d/:id` | Section † | 4 |
| 18 | Important details (money) | `/d/:id` | Section † | 4 |
| 19 | Dates that matter | `/d/:id` | Section † | 4 |
| 20 | Questions to ask | `/d/:id` | Section † | 4 |
| 21 | Evidence / source view | `/d/:id` | Drawer / sheet | 5 |
| 22 | Document viewer | `/d/:id` | Full overlay | 5 |
| 23 | Source highlight | `/d/:id` | State † of 22 | 5 |
| 24 | Urgency / high-risk state | `/d/:id` | State † of 14 | 6 |
| 25 | Professional help | `/d/:id/help` | Page | 6 |
| 26 | Lawyer preparation | `/d/:id/help` | Tab † | 6 |
| 27 | Export briefing | `/d/:id/export` | Page | 6 |
| 28 | Delete data confirmation | `/d/:id` | Modal | 6 |
| 29 | Situation intake | `/situation` | Page | 7 |
| 30 | Guided situation questions | `/situation` | State † | 7 |
| 31 | Situation summary | `/situation` | State † | 7 |
| 32 | What we know | `/situation` | Section † | 7 |
| 33 | What is missing | `/situation` | Section † | 7 |
| 34 | Possible next steps | `/situation` | Section † | 7 |
| 35 | Professional help (situation) | `/situation` | Section † | 7 |
| 36 | Upload supporting document | `/situation` → `/upload` | Handoff † | 7 |
| 37 | Ask about this document | `/d/:id` | Panel / sheet | 8 |
| 38 | Question answer + source | `/d/:id` | State † of 37 | 8 |
| 39 | Information not found | `/d/:id` | State † of 37 | 8 |
| 40 | Language selection | any | Header popover | 9 |
| 41 | Accessibility settings | any | Header popover | 9 |
| 42 | Read aloud active | any | Docked bar | 9 |
| 43 | Network error | any | Banner + state | 10 |
| 44 | Generic error | any | Page state | 10 |
| 45 | Session expired | any | Modal | 10 |
| 46 | Low OCR confidence | `/d/:id` | Inline notice † | 10 |

**Frames to produce: 46 × 2 viewports = 92.**

---

## Surface count by route

| Route | Frames it absorbs |
|---|---|
| `/` | 01, 02 |
| `/safety` `/privacy` `/accessibility` | 03, 04, 05 |
| `/start` | 06 |
| `/upload` | 07, 08, 09, 36 |
| `/d/:id/processing` | 10, 11, 12, 13 |
| `/d/:id` | 14–24, 28, 37–39, 46 |
| `/d/:id/help` | 25, 26 |
| `/d/:id/export` | 27 |
| `/situation` | 29–35 |
| Global overlays | 40, 41, 42, 43, 44, 45 |

---

## Priority order for generation

Generate in this order. If budget runs short, everything above the line still ships a coherent product.

1. **14** Briefing — the product lives or dies here
2. **21** Evidence drawer / sheet — the differentiator
3. **07** Upload · **10** Processing — the on-ramp
4. **01** Landing · **06** Start — the front door
5. **24** Urgency · **16** What you need to do — the highest-harm path
6. **22/23** Document viewer + highlight
7. **25/26** Professional help + lawyer prep
8. **29–31** Situation flow core
9. — line —
10. 27, 28, 37–39, 40–42, 03–05, 08/09/13/43–46

---

## Sections that are NOT screens

Per `UX_FLOWS.md` §4, **evidence is never a section.** It is attached to every item and reached from that item. Do not design a standalone "Evidence" tab in the briefing navigation.

Likewise, settings, language and text size are **not routes** — they are header controls (frames 40–42 are popovers and a docked bar, not pages).
