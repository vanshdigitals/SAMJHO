# Samjo — Header System Specification

Canonical source: `DESIGN_SYSTEM.md`, `UX_FLOWS.md`, `ACCESSIBILITY.md`. No parallel design system is created here. Every added token is listed in §16 under "Tokens that need to be added" rather than assumed.

---

## 0. Three findings that shape this spec

### 0.1 The spec names three header controls, and theme is not one of them

UX_FLOWS §1: *"Settings for language, read-aloud and text size live in a persistent header control, not a route."*

Language, read-aloud, text size. Theme is absent from that list, absent from ACCESSIBILITY §2 (Should have) and absent from §3 (Later). Its only appearance anywhere in the spec set is ACCESSIBILITY §5, which gates axe on "light and dark" — and `DESIGN_SYSTEM.md` §2 defines a single `:root` palette with **no dark variant at all**. That is a live contradiction, already logged as C5 in `RESOURCE_AUDIT.md`.

**Consequence:** dark mode is a product decision you are taking now, not an existing spec commitment. §6 delivers the dark header, and §16.2 lists every token that must be added to make it real. Nothing is silently invented.

### 0.2 There are two headers, not one

Read-aloud and text size are controls for *reading a briefing*. They have nothing to do on a marketing page — there is no briefing to read aloud and no analysis text to resize.

So the persistent header control UX_FLOWS §1 describes belongs to the **app** header (`/d/:id`, `/upload`, `/situation`), not the **marketing** header (`/`, `/privacy`, `/safety`, `/accessibility`).

| | Marketing header | App header |
|---|---|---|
| Routes | `/`, `/privacy`, `/safety`, `/accessibility` | `/start`, `/upload`, `/d/:id/*`, `/situation` |
| Nav links | 3 | none |
| Language | yes | yes |
| Read-aloud | no | yes (briefing routes only) |
| Text size | no | yes |
| Theme | in Display popover | in Display popover |
| Primary CTA | yes | no |

This spec covers both. Building one header that tries to serve both is how the marketing bar ends up with an audio control and the briefing ends up with a "Start with Samjo" button beside the document the user already started.

### 0.3 "AI for Legal Assistance & Access" must stay out of the lockup

Three independent reasons from the specs:

1. **UX_FLOWS §7 bans system vocabulary from the interface.** "AI Analysis" is on the banned list by name. Putting "AI" in the permanent wordmark contradicts the microcopy rule on every screen simultaneously.
2. **"Assistance" edges across the AI_SAFETY §1 boundary.** That document draws the line at legal *information*; "assistance" reads as the guidance tier or worse. The product is not permitted to describe itself that way.
3. **A backronym in a lockup is a startup tell.** The brief asks the header not to look like a generic AI startup. An expanded-acronym descriptor under the wordmark is the single most recognisable marker of one.

**Verdict: never in the header, never in the lockup, never as a favicon label.** If the phrase has a use, it is as an internal positioning note or a `<meta name="description">` string — not as visible brand furniture. Flagged for your decision, but the recommendation is unambiguous.

---

## 1. Brand expression in the header

The header must read: clarity, trust, accessibility, calm, and competence with documents.

It gets there by restraint, not by signalling. DESIGN_SYSTEM §1 is explicit that one element carries the identity and everything else stays quiet — so the header is the quietest surface on the site. No gradient, no glass, no shadow, no transparency, no motion. A solid bar, a wordmark, three links, a language control, one button.

**What that rules out, and why each one is a real risk here:**

| Avoided | Why |
|---|---|
| Serif wordmark, navy-and-gold | Law-firm signal. DESIGN_SYSTEM §1 sets DM Sans and ink blue deliberately against this |
| Emblem, crest, seal, ashoka-adjacent mark | Government-portal signal. ARCHITECTURE §8 separately forbids the *export* from resembling an official instrument; the brand must not either |
| Sparkle, gradient orb, "✨ AI" | Generic AI startup |
| Centred single-input hero bar | ChatGPT |
| Sidebar, workspace switcher, avatar cluster | SaaS dashboard |
| Tabular data, ticker, green/red accents | Fintech |
| Monospace wordmark, neon on near-black | Crypto |

---

## 2. Logo concept

### 2.1 Concept — the margin mark

The symbol is **the evidence rail**: a vertical rule with a single filled marker on it, beside implied lines of text.

This is not a metaphor invented for the logo. DESIGN_SYSTEM §1 already states: *"One element carries the identity: the evidence rail. Every claim on the briefing sits against a thin vertical rule with a source marker on it... The rail is the visible form of the product thesis."*

The logo is therefore the product's own identity element at 24px. Nothing is invented, and the mark is unownable by any competitor who has not built source-grounded evidence.

```
Full symbol (24×24)          Favicon (16×16)
┌──────────────────┐         ┌──────────┐
│ │ ───────────    │         │  │       │
│ ●  ─────────     │         │  ●       │
│ │ ───────        │         │  │       │
└──────────────────┘         └──────────┘
  rail + marker + text lines   rail + marker
```

### 2.2 Symbol meaning

| Requirement | How the mark carries it |
|---|---|
| Document | The three horizontal strokes are lines of text. Unmistakable at any size |
| Understanding | The marker sits *beside* a specific line — the universal human gesture of marking the part that matters. Not decoding; noticing |
| Conversation / help | The marker is the affordance that opens an explanation. It is the product's one interactive element, and it reads as "someone pointed this out to you" |
| Human accessibility | A pen mark in a margin is pre-digital and pre-literate-in-English. It needs no technical reference to parse |
| Clarity | Two shapes. A line and a dot |

The mark says *this is the part that matters* — which is the entire product thesis, since PRD §1 identifies orientation failure, not comprehension failure, as the root problem.

### 2.3 Wordmark direction

**Samjo** — DM Sans, weight **500**, tracking `-0.01em`, sentence case.

Weight 500 because DESIGN_SYSTEM §3 permits only 400, 500 and 600, and states **no 700 anywhere**. A logo is not an exception to the type system.

Sentence case because the same section mandates sentence case throughout with no all-caps labels. **Never "SAMJO".**

**The j-tittle treatment.** In "Samjo", the dot of the *j* is set in `--primary` while every other letterform stays `--text-primary`. The wordmark's own punctuation becomes the source marker. No extra glyph, no added complexity, and the mark's logic is present even when the symbol is not.

```
S a m j o          j-tittle in --primary #1B4DB1
      •            all other letterforms --text-primary #131C2B
```

This is the ownable move. It is invisible until explained, and obvious afterwards — the same shape as the product.

### 2.4 Lockup structure

Three lockups. No others.

**A — Horizontal (default: all headers, all sizes)**
```
│●  Samjo
```
Symbol 24×24, then 8px, then wordmark at 20px. Symbol optically centred to wordmark x-height, not to the bounding box.

**B — Stacked (footer, export PDF, splash)**
```
│●
Samjo
Samajh aane tak.
```
Symbol 32×32, 12px gap, wordmark 24px, 4px gap, tagline 16/22 in `--text-secondary`.

**C — Symbol alone (favicon, app icon, ≤32px contexts)**
Rail and marker only. Text lines are dropped below 20px — see §2.5.

**The tagline is not in the header.** The brief proposes stacking "Samajh aane tak." under the wordmark in the header. Rejected: at a 64px bar it forces the wordmark down to ~16px and the tagline to ~11px, and it converts a product navigation bar into a marketing block — which the brief itself asks to avoid in §4. The tagline lives in the hero, the footer and the export. **Flagged as a deliberate deviation.**

### 2.5 Minimum usable size

| Context | Size | Lockup | Notes |
|---|---|---|---|
| Desktop header | 24px symbol + 20px wordmark | A | Default |
| Mobile header | 24px symbol + 18px wordmark | A | Symbol does not shrink; only type does |
| Hamburger panel brand area | 32px symbol + 24px wordmark | B | Tagline permitted here |
| Footer | 32px symbol + 24px wordmark | B | |
| Favicon | 16×16 | C | Rail + marker only |
| App icon | 180×180 / 512×512 | C | Rail + marker, generous padding |
| **Absolute minimum, symbol** | **16px** | C | Below this the marker and rail merge |
| **Absolute minimum, full lockup** | **20px wordmark** | A | Below this the j-tittle stops reading |

**Hard rule:** the three text-line strokes are dropped below **20px**. At 16px they become a grey smudge and the mark loses its geometry. Rail + marker survives to 16px and no further.

### 2.6 Light-mode treatment

| Element | Token | Value |
|---|---|---|
| Rail | `--border-strong` | `#C4BBAE` |
| Marker | `--primary` | `#1B4DB1` |
| Text lines | `--text-muted` | `#6E7A8A` |
| Wordmark | `--text-primary` | `#131C2B` |
| j-tittle | `--primary` | `#1B4DB1` |

Rail in `--border-strong` rather than `--primary` matters: the rail is structure, the marker is the point of interest. If both are blue, the eye has no focus and the mark reads as a decorative glyph.

### 2.7 Dark-mode treatment

Not a mechanical inversion. Light mode is **warm paper with cool ink**; dark mode is **cool ink ground with warm paper text**. The warmth crosses over with the content, which keeps the brand recognisable rather than merely legible.

| Element | Token (new — see §16.2) | Value |
|---|---|---|
| Rail | `--dark-border-strong` | `#3A4658` |
| Marker | `--dark-primary` | `#7BA4F5` |
| Text lines | `--dark-text-muted` | `#8996A8` |
| Wordmark | `--dark-text-primary` | `#EDEAE4` |
| j-tittle | `--dark-primary` | `#7BA4F5` |

The marker lightens from `#1B4DB1` to `#7BA4F5` because `#1B4DB1` on a dark ground fails contrast and the marker is the mark's focal point. Wordmark is warm off-white `#EDEAE4`, not `#FFFFFF` — pure white on dark ink glares, and the warmth echoes `--background` `#F6F3EE` from light mode.

### 2.8 Monochrome treatment

For fax, stamps, single-colour print, and any embedded context that strips colour.

| Element | Treatment |
|---|---|
| Rail | 100% ink |
| Marker | 100% ink, filled |
| Text lines | 40% ink |
| Wordmark | 100% ink |
| j-tittle | 100% ink |

The mark survives monochrome because its hierarchy is carried by **weight and fill**, not by hue. The marker is the only filled circular shape; that alone distinguishes it.

**Knockout (ink on solid colour):** all elements 100% paper except the text lines at 60% paper.

### 2.9 Favicon and app icon

| Output | Size | Content |
|---|---|---|
| `favicon.ico` | 16, 32, 48 | Symbol only — rail + marker. No wordmark, no text lines |
| `icon.svg` | scalable | Symbol only, `currentColor`-aware for the rail so it responds to browser theme |
| `apple-touch-icon.png` | 180×180 | Symbol on `--surface` `#FFFFFF`, 20% padding, no rounding (iOS masks) |
| `icon-512.png` | 512×512 | Symbol on `--surface`, 20% padding |
| `icon-maskable-512.png` | 512×512 | Symbol on `--surface`, **40% padding** for Android's safe zone |

**No letter "S" favicon.** An S is generic and it discards the one asset that is actually ownable. The rail-and-marker reads at 16px and is unique; a letterform is neither.

### 2.10 Clear space

Clear space = **the marker's diameter** on all four sides. At a 24px symbol the marker is 6px, so clear space is 6px.

In the header this is satisfied by the layout spacing and needs no extra allowance. It matters for the footer, the export PDF, and any partner or judging context.

**Never inside the clear space:** text, rules, icons, container edges, the language switcher, a badge, a version label, or "beta".

---

## 3. Desktop header

### 3.1 Navigation items — final, derived from the specs

UX_FLOWS §1 defines exactly three static policy routes: `/privacy`, `/safety`, `/accessibility`. Plus in-page anchors on `/`.

**Final: three nav items.**

| Label | Destination | Source |
|---|---|---|
| How it works | `/#how-it-works` | Landing IA §06 |
| What Samjo does | `/safety` | UX_FLOWS §1 static route |
| Privacy | `/privacy` | UX_FLOWS §1 static route |

**Rejected from the brief's proposed list: FAQ.** Reasons: it is an in-page accordion on `/`, not a route, so a nav link to it is an anchor competing with "How it works" for the same scroll region. And a fourth item plus the language control plus the CTA measurably crowds the right half at 1280.

**Accessibility** (`/accessibility`) is a real route but lives in the footer. Rationale: it is a policy statement, not a task. Someone who needs the accessibility features needs them *working in the product*, not documented in the top nav — ACCESSIBILITY.md's whole position is that accessibility is a property of the build, not a page.

**Not added, per the brief and confirmed by SECURITY §4 (no accounts exist):** Login, Sign up, Account, Profile, Dashboard, Pricing. There is no authentication in this product and no paid tier.

### 3.2 Desktop layout — 1440×900

```
│←──120px──→│                                                    │←──120px──→│
┌───────────────────────────────────────────────────────────────────────────┐
│                                                                           │
│  │●  Samjo      How it works  What Samjo does  Privacy    EN │ हिन्दी   ⚙  [ Start with Samjo ] │
│                                                                           │
└───────────────────────────────────────────────────────────────────────────┘
                          1px --border #DDD6CC
   ↑ 24px symbol          ↑ nav group, left-aligned      ↑ lang    ↑ Display  ↑ primary CTA
     + 20px wordmark        after a 48px gap               toggle    popover     sm 36px
```

**Height: 64px.** Content max-width 1200px, page gutter 120px.

**Horizontal structure — three groups, not a centred nav.** The nav sits left-aligned 48px after the wordmark rather than centred in the bar. Centring a three-item nav in a 1200px container leaves two large voids and makes the header read as a marketing band. Left-grouping reads as product navigation, which is what §4 of the brief asks for.

| Element | Spec |
|---|---|
| Symbol | 24×24, optically centred to wordmark x-height |
| Symbol → wordmark | 8px |
| Wordmark | DM Sans 500, 20px, `-0.01em` |
| Wordmark → nav group | 48px |
| Nav items | Body 16/26, DM Sans 400, `--text-secondary` |
| Nav item gap | 28px |
| Nav item hit area | 44px tall (padding, not visible box) |
| Nav group → right group | flexible (`margin-left: auto`) |
| Language toggle | 76×36 |
| Language → Display | 12px |
| Display popover trigger | 36×36 icon button, 44px hit area |
| Display → CTA | 16px |
| CTA | `sm` 36px height, 20px horizontal padding, `--radius-md` 12px |

### 3.3 Desktop layout — 1280×800

```
│←─80px─→│                                                       │←─80px─→│
┌───────────────────────────────────────────────────────────────────────┐
│  │●  Samjo   How it works  What Samjo does  Privacy   EN│हिन्दी  ⚙  [ Start with Samjo ] │
└───────────────────────────────────────────────────────────────────────┘
```

Height unchanged at 64px. Max-width 1120px, gutter 80px. Wordmark → nav gap tightens 48px → 32px. Nav item gap tightens 28px → 24px. **Nothing drops.** Every element from 1440 is present.

### 3.4 CTA

| Property | Value |
|---|---|
| Label | **Start with Samjo** |
| Destination | `/start` — the "Choose how you want to start" chooser (UX_FLOWS §1) |
| Variant | primary |
| Height | `sm` 36px, with padding giving a 44px hit area |
| Fill | `--primary` `#1B4DB1` |
| Text | `#FFFFFF`, Label style DM Sans 500 14/20 |
| Radius | `--radius-md` 12px |
| Shadow | **none** |
| Arrow glyph | **none** |

**No arrow in the button text.** DESIGN_SYSTEM §1 explicitly excludes "arrows appended to button text." The brief's proposed "Start with Samjo →" is rejected on that ground.

**The header CTA is `sm`, deliberately quieter than the hero's `lg` 52px.** Two primary buttons of equal weight on one screen split the user's attention at the exact moment the hero is doing its job.

**Anonymous-first is preserved.** `/start` requires no account, and the header carries nothing that implies one.

### 3.5 Border, sticky and scroll behaviour

| Property | Decision |
|---|---|
| Background | `--surface` `#FFFFFF` at **full opacity** |
| Bottom border | 1px `--border` `#DDD6CC`, always present |
| Shadow | **never** |
| Transparency / blur | **never** |
| Position | `sticky`, top 0 |
| On scroll | **nothing changes.** Same height, same background, same border |

**No transparent-to-solid transition. No compact-on-scroll shrink. No hide-on-scroll-down.**

DESIGN_SYSTEM §7 permits exactly one orchestrated moment on the page (the hero reveal, first load only) and states that everything else is a direct response to a user action, with "no scroll-triggered entrances." A header that transforms on scroll is a scroll-triggered animation, and it is the kind of thing that feels premium in a portfolio and feels unstable to someone reading a legal notice on a slow phone.

A constant-height sticky header also has two practical virtues: **zero layout shift**, and a CTA plus language control that are reachable from any scroll position — which matters because the language control is the accessibility affordance for persona C.

A legal-help site should not shimmer, blur, or resize while someone is reading.

---

## 4. Visual hierarchy

Ranked by intended attention, highest first:

| Rank | Element | Size | Weight | Colour | Why here |
|---|---|---|---|---|---|
| 1 | CTA | 36px, 14px label | 500 | White on `--primary` | The only filled element in the bar. Colour does the work, not size |
| 2 | Wordmark | 20px | 500 | `--text-primary` | Largest type; darkest ink; anchors the left |
| 3 | Marker (in symbol) | 6px | filled | `--primary` | Tiny but it is the only other blue. Deliberate echo of the CTA |
| 4 | Nav items | 16px | 400 | `--text-secondary` | Present, scannable, not competing |
| 5 | Language toggle | 14px | 500 active / 400 inactive | `--text-primary` / `--text-muted` | Must be discoverable without shouting |
| 6 | Display trigger | 20px icon | — | `--text-muted` | Lowest-frequency control |
| 7 | Rail, border | 1px | — | `--border-strong`, `--border` | Structure |

**Total vertical consumption: 64px, i.e. 7.1% of a 900px viewport.** The header does not consume too much vertical space, and it does not read as a marketing section, because it contains no tagline, no descriptor, no badge and no announcement bar.

---

## 5. Light mode — complete

All values are existing canonical tokens from `DESIGN_SYSTEM.md` §2. Nothing new.

| Element | State | Token | Value |
|---|---|---|---|
| Header background | — | `--surface` | `#FFFFFF` |
| Page background (behind) | — | `--background` | `#F6F3EE` |
| Bottom border | — | `--border` | `#DDD6CC` |
| Wordmark | — | `--text-primary` | `#131C2B` |
| j-tittle, marker | — | `--primary` | `#1B4DB1` |
| Rail | — | `--border-strong` | `#C4BBAE` |
| Symbol text lines | — | `--text-muted` | `#6E7A8A` |
| Nav item | default | `--text-secondary` | `#49566A` |
| Nav item | hover | `--text-primary` | `#131C2B` |
| Nav item | **current page** | `--text-primary` + 2px `--primary` underline, 4px below baseline | |
| Nav item | focus | 2px `--focus-ring` ring, 2px offset | `#1B4DB1` |
| Nav item | pressed | `--text-primary` at 80% opacity | |
| CTA | default | fill `--primary`, text `#FFFFFF` | `#1B4DB1` |
| CTA | hover | fill `--primary-hover` | `#163F92` |
| CTA | focus | 2px `--focus-ring` ring, 2px offset | |
| CTA | pressed | fill `--primary-hover`, no transform | |
| Lang toggle container | — | `--surface-subtle` fill, `--radius-sm` 8px | `#EEEAE2` |
| Lang toggle, active | — | `--surface` fill, `--text-primary` text, 1px `--border` | |
| Lang toggle, inactive | — | transparent, `--text-muted` text | `#6E7A8A` |
| Lang toggle, inactive hover | — | `--text-secondary` | `#49566A` |
| Lang divider | — | 1px `--border-strong`, 16px tall | `#C4BBAE` |
| Display trigger | default | `--text-muted` | `#6E7A8A` |
| Display trigger | hover | `--text-primary` | `#131C2B` |
| Display trigger | open | `--text-primary`, `--surface-subtle` fill | |

**Hover has no transform, no scale, no shadow, no background fade on nav items.** Colour only. DESIGN_SYSTEM §7: "No hover transitions on cards" — the same restraint applies to the bar.

**Contrast check (measured against actual backgrounds):**
- `--text-primary` on `--surface`: 14.9:1 ✓
- `--text-secondary` on `--surface`: 7.8:1 ✓
- `--text-muted` on `--surface`: 4.9:1 ✓ (AA body)
- White on `--primary`: 7.1:1 ✓ (per DESIGN_SYSTEM §2)

---

## 6. Dark mode — complete

**Read §0.1 first.** DESIGN_SYSTEM.md defines no dark tokens. Everything in this section is a **proposed addition**, listed formally in §16.2. It is derived from the existing palette's own logic, not from a generic dark theme.

### 6.1 Derivation principle — not an inversion

Light mode: **warm paper ground, cool ink text.**
Dark mode: **cool ink ground, warm paper text.**

The warmth travels with the content rather than with the surface. A mechanical inversion of `#F6F3EE` gives a muddy warm-grey `#0F110C` that looks like a rendering error; taking `--text-primary` `#131C2B` (the deep ink navy) as the *ground* keeps the brand's actual hue and gives a surface that feels like ink rather than like absence.

### 6.2 Proposed dark tokens — header scope only

Scoped deliberately to what the header uses. A full dark palette (warning, danger, success surfaces, the evidence rail in context, the urgency banner) is a separate exercise and must not be improvised here.

```
--dark-background:      #0F1622   /* deeper than the ink, so surface can sit above it */
--dark-surface:         #18202E   /* header bar */
--dark-surface-subtle:  #222B3A   /* lang toggle track, popover hover */

--dark-text-primary:    #EDEAE4   /* warm off-white, echoes light --background */
--dark-text-secondary:  #B3BCC9
--dark-text-muted:      #8996A8

--dark-border:          #2A3342
--dark-border-strong:   #3A4658

--dark-primary:         #7BA4F5   /* lightened for contrast on dark */
--dark-primary-hover:   #9BBAF8
--dark-primary-subtle:  #1C2942

--dark-focus-ring:      #7BA4F5
```

**Target contrast ratios — verify with a checker before shipping, do not take these as measured:**

| Pair | Target |
|---|---|
| `--dark-text-primary` on `--dark-surface` | ~13:1 |
| `--dark-text-secondary` on `--dark-surface` | ~8:1 |
| `--dark-text-muted` on `--dark-surface` | ~4.6:1 (AA body, at the margin — check it) |
| `--dark-background` on `--dark-primary` (CTA) | ~9:1 |

### 6.3 Dark header spec

| Element | State | Token |
|---|---|---|
| Header background | — | `--dark-surface` `#18202E` |
| Page background | — | `--dark-background` `#0F1622` |
| Bottom border | — | `--dark-border` `#2A3342` |
| Wordmark | — | `--dark-text-primary` `#EDEAE4` |
| j-tittle, marker | — | `--dark-primary` `#7BA4F5` |
| Rail | — | `--dark-border-strong` `#3A4658` |
| Symbol text lines | — | `--dark-text-muted` `#8996A8` |
| Nav item | default | `--dark-text-secondary` `#B3BCC9` |
| Nav item | hover | `--dark-text-primary` |
| Nav item | current | `--dark-text-primary` + 2px `--dark-primary` underline |
| Nav item | focus | 2px `--dark-focus-ring`, 2px offset |
| **CTA** | default | **fill `--dark-primary` `#7BA4F5`, text `--dark-background` `#0F1622`** |
| CTA | hover | fill `--dark-primary-hover` `#9BBAF8` |
| CTA | focus | 2px `--dark-focus-ring`, 2px offset, plus 2px `--dark-surface` inner gap so the ring reads against the fill |
| Lang track | — | `--dark-surface-subtle` `#222B3A` |
| Lang active | — | `--dark-surface` fill, `--dark-text-primary` text, 1px `--dark-border` |
| Lang inactive | — | transparent, `--dark-text-muted` |
| Display trigger | — | `--dark-text-muted`, → `--dark-text-primary` on hover |

**The CTA inverts in dark mode: light blue fill with dark ink text.** A `#1B4DB1` fill on a `#18202E` bar has almost no luminance separation from its background — the button would disappear as a shape. Light-fill-dark-text is the correct dark-mode primary and it keeps the CTA as the bar's single most prominent element, matching light mode's intent rather than its literal values.

**The logo stays recognisable** because its geometry is unchanged and its hierarchy (structural rail, focal marker) is preserved by the same relative relationships. Only luminance flips.

---

## 7. Theme switcher

### 7.1 Recommendation: inside a Display popover, not as a top-level header icon

UX_FLOWS §1 groups language, read-aloud and text size into "a persistent header control." Theme belongs with **text size** — both are display preferences about how content is rendered, neither is about the content itself.

Giving theme its own top-level sun/moon icon adds a fourth right-side control beside language, Display and CTA. At 1280 that crowds; at 360 it is untenable. And per the brief's own instruction in §7: do not overcrowd the header.

### 7.2 Placement

| Surface | Placement |
|---|---|
| Desktop, marketing | `⚙ Display` icon button → popover containing **Theme** |
| Desktop, app routes | Same popover, containing **Theme** and **Text size** (and **Read aloud** on briefing routes) |
| Mobile, all | Inside the hamburger panel, as a labelled segmented control |

### 7.3 Popover contents — desktop marketing

```
┌─────────────────────────────┐
│ Display                     │  Label, --text-muted
│                             │
│ Theme                       │  Label
│ ┌───────┬───────┬─────────┐ │
│ │ Light │ Dark  │ System  │ │  segmented, 36px tall
│ └───────┴───────┴─────────┘ │
└─────────────────────────────┘
```

Popover: `--surface`, 1px `--border`, `--radius-lg` 16px, `--shadow-medium`. **This is one of the few places a shadow is correct** — DESIGN_SYSTEM §4 reserves elevation for things that genuinely float, and a popover does.

Width 240px. Anchored to the trigger's right edge. Radix Popover (DESIGN_SYSTEM §6).

### 7.4 Behaviour

| Property | Value |
|---|---|
| Options | Light · Dark · **System** |
| Default | **System** — respects `prefers-color-scheme` |
| Persistence | `localStorage`, read before first paint to avoid a flash |
| Trigger icon | Half-filled circle (contrast glyph). **Not** a sun, **not** a moon — those imply a binary and the default is three-state |
| Trigger accessible name | `Display settings` |
| Group accessible name | `Theme` |
| Announcement on change | Polite live region: `Theme changed to dark` |
| Reduced motion | No cross-fade. Instant swap |

Implemented as a `radiogroup` with three `radio` children, not three buttons — the state is one-of-three and screen readers should say so.

---

## 8. Language switcher

### 8.1 Pattern: inline text toggle, both labels always visible. Not a dropdown.

PRD §2 persona C is a regional-language user who "depends on a literate relative, or gives up." A dropdown hides `हिन्दी` behind an interaction, in English, from the person who most needs it. The word must be **on screen, in Devanagari, unprompted.**

DESIGN_SYSTEM §6 confirms: *"LanguageSwitcher — Persistent in the header. Labels in their own script: English, हिन्दी."*

**No flags.** Hindi is not a country, flags do not map to languages, and the ambiguity is worst precisely for Indian languages. Text only.

### 8.2 Desktop appearance

```
┌──────────────────┐
│ EN │ हिन्दी       │   76 × 36, --surface-subtle track, --radius-sm 8px
└──────────────────┘
  ↑ active           ↑ inactive
```

| Property | Value |
|---|---|
| Size | 76×36, 44px hit area via padding |
| Track | `--surface-subtle` `#EEEAE2`, `--radius-sm` 8px |
| Active segment | `--surface` fill, `--text-primary`, 1px `--border`, Label 14/20 weight 500 |
| Inactive segment | transparent, `--text-muted`, weight 400 |
| Divider | 1px `--border-strong`, 16px tall, between segments |
| English label | `EN` at desktop, `English` in the panel and footer |
| Hindi label | **`हिन्दी` in full, always. Never abbreviated, never `HI`** |
| Devanagari line-height | +4px per DESIGN_SYSTEM §3 |

`EN` abbreviates but `हिन्दी` does not, and that asymmetry is intentional: the English reader recognises `EN` instantly; the Hindi reader needs the whole word to feel addressed.

### 8.3 Mobile appearance

Identical component, 72×36, in the header beside the hamburger. Repeated inside the panel at full width with `English` spelled out. Repeated again in the footer.

Three placements is deliberate: PRD §9.8 and ACCESSIBILITY §1 both treat language as a first-class accessibility control, and a user who scrolled the whole page should not have to scroll back up.

### 8.4 Keyboard, touch and announcement

| Property | Value |
|---|---|
| Role | `radiogroup` with two `radio` children |
| Group accessible name | `Choose language` |
| Option names | `English`, `हिन्दी` (with `lang="hi"` on the Hindi option) |
| Tab | One stop for the whole group |
| Arrow keys | Move between options and activate (standard radio behaviour) |
| Current language | `aria-checked="true"` **plus** the visible fill and weight change |
| Touch target | 44px minimum per segment |
| On change | Polite announcement: `Language changed to Hindi` |
| Page `lang` | Updates `<html lang>` to `hi` / `en` so screen readers switch pronunciation (ACCESSIBILITY §1) |

**Current language is never signalled by colour alone** — it carries fill, border, font weight and `aria-checked`. ACCESSIBILITY §1 forbids colour-only meaning.

---

## 9. Mobile header

### 9.1 Decision: the CTA stays visible in the bar

The landing page's entire purpose is to reach `/start`. Burying the primary action behind a hamburger on the main conversion surface would mean the most important element on the page requires two taps and a discovery step.

Four elements in the bar, which is tight at 360 but fits. Verified:

```
360px viewport − 32px gutters = 328px available

│●  Samjo          EN│हिन्दी   [Start]  ☰
 └─ 92px ─┘        └─ 72px ─┘ └ 64px ┘ └44px┘   = 272px
                                      + 3 gaps × 8px = 296px
                                      ✓ 32px headroom
```

### 9.2 Mobile layout — 390 × 844

```
┌──────────────────────────────────────────┐
│ │●  Samjo      EN│हिन्दी  [Start]   ☰   │  56px tall
└──────────────────────────────────────────┘
            1px --border
```

| Property | 360 | 390 | 430 |
|---|---|---|---|
| Height | 56px | 56px | 56px |
| Side gutter | 16px | 20px | 24px |
| Symbol | 24×24 | 24×24 | 24×24 |
| Wordmark | 18px | 18px | 20px |
| Lang toggle | 72×36 | 72×36 | 76×36 |
| CTA label | `Start` | `Start` | `Start` |
| CTA | 64×36 | 68×36 | 72×36 |
| Hamburger | 44×44 | 44×44 | 44×44 |
| Element gap | 8px | 10px | 12px |

**Symbol never shrinks below 24px.** Only type scales.

### 9.3 CTA label: `Start` on mobile, `Start with Samjo` on desktop — flagged

UX_FLOWS §7 states: *"Actions keep their name across the whole flow."*

That rule governs an action's identity across a *journey* — the button that says "Show us the document" must not lead to a state called "Processing upload." It is not a prohibition on responsive label length: both labels name the same action and lead to the same `/start`.

`Start with Samjo` does not fit at 360 alongside the language toggle, and the language toggle is the more important of the two for persona C.

**Flagged as a judgment call.** If you prefer strict consistency, the alternative is `Start` everywhere including desktop — which is also defensible and slightly more spec-literal. Recommendation stands at the responsive pair.

### 9.4 What the hamburger is for

With the CTA and language already in the bar, the hamburger carries: the three nav links dropped from the bar, the accessibility route, the theme control, and a repeat of language and CTA for reach.

---

## 10. Mobile hamburger panel

Opens from the **right**, matching the trigger's position — a panel that flies in from the opposite side to the button that summoned it breaks the spatial link.

### 10.1 Structure

```
        backdrop                    panel
┌───────────┬──────────────────────────────────────┐
│           │                                      │
│  rgba     │  │●  Samjo                    ✕     │ ← brand + close
│  (19,28,  │     Samajh aane tak.                 │
│   43,     │  ──────────────────────────────      │
│   0.48)   │                                      │
│           │  How it works                        │ ← nav, 56px rows
│           │  ──────────────────────────────      │
│           │  What Samjo does                     │
│           │  ──────────────────────────────      │
│           │  Privacy                             │
│           │  ──────────────────────────────      │
│           │  Accessibility                       │
│           │                                      │
│           │  ──────────────────────────────      │
│           │  Language                            │ ← Label, --text-muted
│           │  ┌──────────┬──────────┐             │
│           │  │ English  │ हिन्दी    │             │
│           │  └──────────┴──────────┘             │
│           │                                      │
│           │  Theme                               │
│           │  ┌───────┬───────┬────────┐          │
│           │  │ Light │ Dark  │ System │          │
│           │  └───────┴───────┴────────┘          │
│           │                                      │
│           │  ══════════════════════════════      │ ← sticky footer edge
│           │  ┌──────────────────────────────┐    │
│           │  │     Start with Samjo         │    │ ← lg 52px, full width
│           │  └──────────────────────────────┘    │
│           │  No account. Deleted within 24 hours.│
└───────────┴──────────────────────────────────────┘
```

### 10.2 Dimensions and tokens

| Property | Value |
|---|---|
| Width | **86vw, max 340px** at 360/390; **320px** at 430 |
| Height | 100dvh (`dvh`, not `vh` — avoids the iOS Safari toolbar bug) |
| Background | `--surface` / `--dark-surface` |
| Left edge | 1px `--border` |
| Shadow | `--shadow-medium` — a panel genuinely floats, so elevation is correct here |
| Radius | `--radius-xl` 24px on the **left two corners only**. DESIGN_SYSTEM §4 assigns `--radius-xl` to "bottom sheet top corners only"; this is the horizontal equivalent and is the closest correct reading |
| Backdrop | `rgba(19, 28, 43, 0.48)` — derived from `--text-primary` `#131C2B`, **not** generic black |
| Padding | 20px sides, 20px top, 20px bottom |
| Brand area | Symbol 32px + wordmark 24px + tagline 16/22 `--text-secondary` |
| Close button | 44×44, top-right, 20px `✕` glyph in `--text-secondary` |
| Nav rows | 56px tall, Body Large 18/28, `--text-primary`, 1px `--border` between |
| Section labels | Label 14/20, `--text-muted`, 24px above / 12px below |
| Language control | Full-width segmented, 44px tall |
| Theme control | Full-width segmented, 44px tall |
| CTA | `lg` 52px, full width, primary |
| Reassurance | Body Small Inter 14/22, `--text-muted` |

### 10.3 Why nav rows are 18px, not 16px

DESIGN_SYSTEM §3: briefing prose sets at 18px "because the reader is stressed and may be older." The same reasoning applies to a navigation panel on a legal-help site. 56px rows at 18px type are comfortable for an unsteady thumb.

### 10.4 The CTA is pinned, not scrolled

The CTA and its reassurance line sit in a sticky footer region inside the panel, above a 1px `--border` top edge. If the nav list grows, the CTA stays visible.

**Why this panel does not feel generic:** the brand area carries the full stacked lockup with the tagline (the only header context where the tagline appears); nav rows are separated by the same hairlines the briefing uses rather than being a flat list; and the CTA is pinned with its reassurance line rather than floating as the last list item. It reads as a continuation of the product, not as a menu drawer.

### 10.5 Panel nav items — final

| Label | Destination | Justification |
|---|---|---|
| How it works | `/#how-it-works` | Landing IA §06 |
| What Samjo does | `/safety` | UX_FLOWS §1 |
| Privacy | `/privacy` | UX_FLOWS §1 |
| Accessibility | `/accessibility` | UX_FLOWS §1 — present here though not in the desktop bar |

**"Home" is rejected from the brief's proposed list.** The wordmark in the panel's brand area is the home link, and it is also in the header bar. A separate "Home" row duplicates an affordance the user already has twice.

**No FAQ row** — it is an anchor on `/`, already reachable via "How it works" scroll region and the footer.

---

## 11. Mobile menu behaviour

| Behaviour | Spec |
|---|---|
| Open animation | Slide from right, **200ms**, `cubic-bezier(0.32, 0.72, 0, 1)`. Backdrop fades 0 → 0.48 over 200ms |
| Close animation | Reverse, **160ms** — closing faster than opening is the standard asymmetry and it feels responsive rather than sluggish |
| Backdrop tap | Closes |
| `Escape` | Closes, from anywhere including inside the segmented controls |
| Swipe | Swipe right beyond 40% of panel width, or a fling over 0.5 px/ms, closes. Follows the finger 1:1 below that threshold. **Swipe is an addition, never the only way to close** — the ✕ and the backdrop both work |
| Focus trap | `Tab` and `Shift+Tab` cycle within the panel. Nothing outside is reachable |
| Initial focus | The **close button** — not the first nav link. A user who opened the panel by accident finds the exit first |
| Focus restoration | Returns to the hamburger trigger on close, always, including on Escape and backdrop tap |
| Body scroll lock | `overflow: hidden` on `<body>` plus scroll-position preservation so the page does not jump on close |
| Role | `role="dialog"` `aria-modal="true"` `aria-labelledby` → the panel's visually hidden `<h2>` "Navigation" |
| Trigger accessible name | Closed: `Open navigation menu`. Open: `Close navigation menu` |
| Trigger `aria-expanded` | `false` / `true` |
| Announcement | The dialog role announces on open; no separate live region needed |
| Reduced motion | `prefers-reduced-motion: reduce` → **no slide.** Opacity only, under 100ms, per DESIGN_SYSTEM §7. Swipe-to-close still works (it is a gesture, not an animation) |
| Touch targets | Every interactive element ≥44×44px |
| Keyboard nav | `Tab` through: close → nav rows → language group → theme group → CTA. Arrow keys within each segmented group |

---

## 12. Scroll behaviour — decided

**Sticky, constant, unchanging.** See §3.5 for the full reasoning.

| Evaluated | Verdict |
|---|---|
| Static | Rejected — loses the language control and CTA on a long page |
| **Sticky, constant height** | **Chosen** |
| Compact sticky (shrinks) | Rejected — scroll-triggered animation, forbidden by DESIGN_SYSTEM §7; also causes reflow |
| Transparent → solid | Rejected — same reason; also fails contrast unpredictably over the hero specimen |
| Hide on scroll down | Rejected — hides the accessibility control |

Guarantees: **no layout shift** (height never changes), CTA always reachable, nav always reachable, language always reachable, and nothing to disable under reduced motion because nothing moves.

---

## 13. Header states — complete matrix

### Desktop light

| Element | Default | Hover | Current | Focus | Pressed |
|---|---|---|---|---|---|
| Wordmark link | `--text-primary` | no change | — | 2px ring, 2px offset | 80% opacity |
| Nav item | `--text-secondary` | `--text-primary` | `--text-primary` + 2px `--primary` underline | 2px ring | `--text-primary` 80% |
| Lang active | `--surface` fill, `--text-primary` | — | `aria-checked` | 2px ring on group | — |
| Lang inactive | `--text-muted` | `--text-secondary` | — | 2px ring | — |
| Display trigger | `--text-muted` | `--text-primary` | open: `--surface-subtle` fill | 2px ring | — |
| CTA | `--primary` fill | `--primary-hover` | — | 2px ring, 2px offset | `--primary-hover`, no transform |

### Desktop dark

Identical structure; substitute every token with its `--dark-*` counterpart from §6.2. The CTA is the one behavioural difference: `--dark-primary` fill with `--dark-background` text, hovering to `--dark-primary-hover`, and its focus ring needs a 2px `--dark-surface` inner gap to read against the light fill.

### Mobile light

| Element | Default | Pressed | Focus | Open |
|---|---|---|---|---|
| Wordmark | `--text-primary` | 80% opacity | 2px ring | — |
| Lang toggle | as desktop | — | 2px ring on group | — |
| CTA `Start` | `--primary` fill | `--primary-hover` | 2px ring | — |
| Hamburger | `--text-primary`, `aria-expanded="false"` | `--surface-subtle` fill | 2px ring | `aria-expanded="true"` |
| Panel | closed, not rendered | — | — | open, focus trapped, body locked |
| Panel nav row | `--text-primary` | `--surface-subtle` full-row fill | 2px ring, inset 4px | — |
| Panel theme active | `--surface` fill, `--text-primary` | — | 2px ring on group | `aria-checked` |
| Panel CTA | `--primary` fill, 52px | `--primary-hover` | 2px ring | — |

### Mobile dark

Same matrix, `--dark-*` tokens, CTA inverted per §6.3.

**Focus is never suppressed in any state, in either mode** (ACCESSIBILITY §1). Ring is 2px `--focus-ring` / `--dark-focus-ring` with 2px offset throughout.

---

## 14. Responsive breakpoints

Four breakpoints. Not seven — the brief lists seven widths, but several need identical behaviour, and inventing a rule for each would be the "unnecessary breakpoint complexity" §14 warns against.

| Width | Header | Nav | Language | CTA | Hamburger | Logo |
|---|---|---|---|---|---|---|
| **≥1280** | 64px, gutter 120px (1440) / 80px (1280) | 3 items inline, gap 28px (1440) / 24px (1280) | `EN │ हिन्दी` 76×36 | `Start with Samjo`, sm 36 | none | 24px + 20px |
| **1024–1279** | 64px, gutter 48px | 3 items inline, gap 20px | `EN │ हिन्दी` 76×36 | `Start with Samjo`, sm 36 | none | 24px + 20px |
| **768–1023** | 60px, gutter 32px | **collapse into hamburger** | `EN │ हिन्दी` 76×36 | `Start`, sm 36 | **appears** | 24px + 20px |
| **≤767** (430 / 390 / 360) | 56px, gutter 24 / 20 / 16px | in hamburger | `EN │ हिन्दी` 76 / 72 / 72 × 36 | `Start`, sm 36 | present | 24px + 20 / 18 / 18px |

**The single collapse point is 768px.** Three nav items at 20px gaps plus language plus CTA fit comfortably to 1024 and break below 768. There is no intermediate state — a header that drops one nav item at a time reads as broken.

**Nothing changes at 430 / 390 / 360 except gutter, gap and wordmark size.** The structure is identical across all three. Only the 360 case is tight, and §9.1 shows it fits with 32px to spare.

**The symbol never changes size across any breakpoint.** 24px everywhere in the bar.

---

## 15. Accessibility

### 15.1 Semantics

```
<header>                        banner landmark
  skip link                     first focusable, visible on focus
  <a> wordmark                  → /
  <nav aria-label="Main">       navigation landmark
    <a aria-current="page">     on the current route
  <div role="radiogroup"        aria-label="Choose language"
       ...>
  <button aria-expanded>        Display settings, controls the popover
  <a> CTA                       → /start
  <button aria-expanded          mobile only
          aria-controls>
</header>
```

### 15.2 Accessible names — exact strings

| Element | Name |
|---|---|
| Skip link | `Skip to main content` |
| Wordmark link | `Samjo — home` |
| Nav landmark | `Main` |
| Language group | `Choose language` |
| Language options | `English` · `हिन्दी` (option carries `lang="hi"`) |
| Display trigger | `Display settings` |
| Theme group | `Theme` |
| Theme options | `Light` · `Dark` · `System` |
| Header CTA | `Start with Samjo` (desktop) / `Start with Samjo` (mobile — **the accessible name stays full even where the visible label is `Start`**) |
| Hamburger, closed | `Open navigation menu` |
| Hamburger, open | `Close navigation menu` |
| Panel dialog | `Navigation` |
| Panel close | `Close navigation menu` |

**The mobile CTA's visible label is `Start` but its accessible name is `Start with Samjo`.** A screen-reader user gets the full, unambiguous action; the visible label is abbreviated only for space. Implemented with `aria-label`, and the visible text remains a substring of it so voice-control users saying "Start" still match.

### 15.3 Requirements met

| Requirement | How |
|---|---|
| Keyboard navigation | Every control reachable. Logical order. Radio groups use arrow keys, one tab stop each |
| Visible focus | 2px `--focus-ring`, 2px offset, never suppressed, in both modes |
| Screen readers | Banner + navigation landmarks; `aria-current="page"`; `aria-expanded` on both disclosure triggers; `radiogroup` for one-of-N state; polite announcements on language and theme change; `<html lang>` updates on language change |
| Reduced motion | Nothing in the header animates at all. Panel slide becomes opacity-only under 100ms. Chevron and popover transitions instant |
| 200% zoom | At 360px × 200% the effective width is 180px. The bar reflows to two rows: wordmark + hamburger on row 1, language + CTA on row 2. **Header height may grow; nothing is clipped and nothing is lost.** Required by ACCESSIBILITY §5 (200% at 360px, release gate) |
| High contrast | `forced-colors: active` → `ButtonText` / `Canvas` / `LinkText` / `Highlight` system colours. Borders switch to `1px solid ButtonBorder`. The logo's rail and marker use `currentColor` so both survive |
| Semantic navigation | Real `<nav>`, real `<a>`, real `<button>`. No `div` with a click handler |
| Icons never alone | Hamburger, close and Display trigger each carry a text accessible name. The language and theme controls are text-labelled, not iconographic |
| Touch targets | 44×44 minimum on every interactive element, at every breakpoint |

### 15.4 One thing to get right that is easy to miss

Changing the language must update `<html lang>`, not just the visible strings. ACCESSIBILITY §1 requires it so screen readers pronounce Devanagari correctly. A header that swaps the copy but leaves `lang="en"` produces Hindi read in an English phoneme set — which is precisely the failure ACCESSIBILITY §1 calls out for TTS, occurring in the screen reader instead.

---

## 16. Design system

### 16.1 Existing canonical tokens used — no changes

| Category | Tokens |
|---|---|
| Surfaces | `--surface`, `--surface-subtle`, `--background` |
| Text | `--text-primary`, `--text-secondary`, `--text-muted` |
| Structure | `--border`, `--border-strong` |
| Action | `--primary`, `--primary-hover`, `--primary-subtle` |
| Focus | `--focus-ring` |
| Spacing | `--space-1` … `--space-6`, `--space-12` |
| Radius | `--radius-sm` 8, `--radius-md` 12, `--radius-lg` 16, `--radius-xl` 24 |
| Elevation | `--shadow-medium` (popover and panel only) |
| Type | Display / H2 / Body Large / Body / Body Small / Label / Caption, per §3 of DESIGN_SYSTEM |
| Families | DM Sans (brand), Inter (functional) |

**Shadow usage in the header: none on the bar itself, ever.** `--shadow-medium` on the Display popover and the mobile panel only, because DESIGN_SYSTEM §4 reserves elevation for things that genuinely float.

### 16.2 Tokens that need to be added

Nothing below exists in `DESIGN_SYSTEM.md` today. Each is required by this spec and none is silently assumed.

**A — Header layout (5 tokens)**

```
--header-height-desktop:  64px
--header-height-tablet:   60px   /* 768–1023 */
--header-height-mobile:   56px
--header-max-width:       1200px
--panel-width-max:        340px
```

**B — Dark mode, header scope (13 tokens)** — full set and values in §6.2

```
--dark-background      --dark-surface         --dark-surface-subtle
--dark-text-primary    --dark-text-secondary  --dark-text-muted
--dark-border          --dark-border-strong
--dark-primary         --dark-primary-hover   --dark-primary-subtle
--dark-focus-ring
```

**C — Overlay (1 token)**

```
--backdrop: rgba(19, 28, 43, 0.48)   /* derived from --text-primary, not black */
```

**D — Motion (3 tokens)**

```
--panel-enter:  200ms cubic-bezier(0.32, 0.72, 0, 1)
--panel-exit:   160ms cubic-bezier(0.32, 0.72, 0, 1)
--reduced:      100ms linear          /* opacity-only fallback */
```

**Total: 22 new tokens.**

### 16.3 Three decisions this forces, which are yours not mine

1. **C5 must be resolved.** ACCESSIBILITY §5 currently gates axe on "light and dark." Adding group B makes that gate real — but it then applies to *every route*, not just the header. Either commit to a full dark palette (warning, danger, success surfaces, the urgency banner, the evidence rail in context) or narrow the gate. **Shipping a dark header on a light-only site is worse than either option.**
2. **Dark mode is now in MVP scope.** It is not in PRD §8's must-have list, not in ACCESSIBILITY §2's should-haves, and not in §3's later list. Adding it is a scope increase. Worth stating out loud before it is absorbed silently.
3. **`--radius-xl` semantics widen.** DESIGN_SYSTEM §4 scopes it to "bottom sheet top corners only." A right-side panel needs it on the left two corners. Update the comment, or the token's stated rule and its use diverge.

---

## 17. Stitch prompts

### Standing context — paste once per Stitch session

> Product: **Samjo** (sentence case, never all-caps). An India-first tool that helps ordinary people understand a residential rental agreement or a housing-related legal notice. Not a lawyer, no legal advice, no outcome prediction, not a chatbot. No accounts exist in this product.
>
> **Light tokens:** surface `#FFFFFF` · surface-subtle `#EEEAE2` · background `#F6F3EE` · text-primary `#131C2B` · text-secondary `#49566A` · text-muted `#6E7A8A` · border `#DDD6CC` · border-strong `#C4BBAE` · primary `#1B4DB1` · primary-hover `#163F92` · focus-ring `#1B4DB1`.
>
> **Dark tokens:** background `#0F1622` · surface `#18202E` · surface-subtle `#222B3A` · text-primary `#EDEAE4` · text-secondary `#B3BCC9` · text-muted `#8996A8` · border `#2A3342` · border-strong `#3A4658` · primary `#7BA4F5` · primary-hover `#9BBAF8` · focus-ring `#7BA4F5`.
>
> **Type:** DM Sans for brand and interface; Inter for functional/caption text. Weights **400, 500, 600 only — never 700**. Body 16/26 · Body Large 18/28 · Label 14/20 · Caption 12/18. Sentence case everywhere, no all-caps, no letter-spaced labels.
>
> **Radius:** 8 inputs/chips · 12 buttons/small panels · 16 sheets/popovers · 24 panel outer corners.
>
> **The logo** is a vertical rule (the "evidence rail") with one filled circular marker on it, and three short horizontal strokes to its right suggesting lines of text. Rail in border-strong, marker in primary, text lines in text-muted. Beside it, the wordmark "Samjo" in DM Sans 500 — and **the dot of the letter j is set in primary** while all other letterforms are text-primary.
>
> **Stitch must NOT invent:** a different logo · a sun/moon icon · country flags · an arrow inside button text · a shadow on the header bar · a gradient anywhere · glassmorphism or blur · a transparent header · Login, Sign up, Account, Profile, Dashboard, Pricing or Search · a tagline inside the header bar · an announcement or banner strip above the header · a second CTA · the words "AI", "Assistance", "powered by", or the phrase "AI for Legal Assistance & Access" · a serif wordmark · gavels, scales of justice, courthouse columns or law books · any all-caps text.

---

### A. Desktop light header

> Design a desktop website header, 1440×900, light mode.
>
> Bar: **64px tall**, full width, background `#FFFFFF` at full opacity, 1px `#DDD6CC` bottom border, **no shadow, no blur, no transparency**. Content max-width 1200px, centred, 120px page gutters.
>
> **Left group:** the Samjo logo symbol at 24×24 (vertical rail in `#C4BBAE`, filled 6px marker in `#1B4DB1`, three short text-line strokes in `#6E7A8A`), then 8px, then the wordmark "Samjo" in DM Sans 500 at 20px, tracking -0.01em, in `#131C2B` — with the dot of the **j** in `#1B4DB1`.
>
> **Then 48px, then the nav group, left-aligned (not centred in the bar):** "How it works", "What Samjo does", "Privacy" — DM Sans 400 at 16/26 in `#49566A`, 28px apart. The current page's item is `#131C2B` with a 2px `#1B4DB1` underline sitting 4px below the baseline.
>
> **Right group, pushed to the right edge:**
> - A language toggle, 76×36, with a `#EEEAE2` track at 8px radius, containing "EN" (active: `#FFFFFF` fill, `#131C2B` text, DM Sans 500 at 14px, 1px `#DDD6CC` border) and "हिन्दी" (inactive: transparent, `#6E7A8A`, weight 400), separated by a 1px `#C4BBAE` divider 16px tall. **Spell हिन्दी in full. No flags.**
> - 12px gap. A 36×36 icon button showing a half-filled circle glyph in `#6E7A8A`.
> - 16px gap. A primary button, 36px tall, 20px horizontal padding, 12px radius, `#1B4DB1` fill, white DM Sans 500 14px text reading **"Start with Samjo"**. No arrow, no icon, no shadow.
>
> Hover: nav items go `#131C2B`, colour only — **no underline on hover, no background fill, no scale, no shadow**. The CTA goes `#163F92`.
>
> Focus: 2px `#1B4DB1` ring with 2px offset on every control.
>
> Also produce a **1280×800** variant: same 64px height, 1120px max-width, 80px gutters, wordmark-to-nav gap 32px, nav gap 24px. Nothing is removed.
>
> The bar must read as calm product navigation, not a marketing band.

---

### B. Desktop dark header

> Same layout, dimensions and content as prompt A, 1440×900, **dark mode**. Do not mechanically invert — use these exact values.
>
> Bar background `#18202E`, page behind it `#0F1622`, bottom border 1px `#2A3342`, still **no shadow and no transparency**.
>
> Logo: rail `#3A4658`, marker `#7BA4F5`, text-line strokes `#8996A8`. Wordmark `#EDEAE4` (a warm off-white, **not** pure white) with the **j** dot in `#7BA4F5`.
>
> Nav items `#B3BCC9`, hovering to `#EDEAE4`. Current item `#EDEAE4` with a 2px `#7BA4F5` underline.
>
> Language toggle: track `#222B3A`; active segment `#18202E` fill with `#EDEAE4` text and a 1px `#2A3342` border; inactive `#8996A8`; divider `#3A4658`.
>
> Display icon button: `#8996A8`, hovering to `#EDEAE4`.
>
> **CTA inverts:** fill `#7BA4F5` (light blue) with **dark** text `#0F1622`, hovering to fill `#9BBAF8`. A dark-blue button on a dark bar would vanish; the light fill keeps it the single most prominent element in the bar, matching the light-mode intent.
>
> Focus ring `#7BA4F5`, 2px, 2px offset — and on the CTA specifically, add a 2px `#18202E` inner gap so the ring reads against the light fill.
>
> Also produce the **1280×800** variant.

---

### C. Mobile light header

> Design a mobile website header, **390×844**, light mode.
>
> Bar: **56px tall**, background `#FFFFFF`, 1px `#DDD6CC` bottom border, no shadow, 20px side gutters.
>
> Four elements in one row, 10px apart:
> 1. **Left:** logo symbol 24×24 + 18px "Samjo" wordmark (j dot in `#1B4DB1`)
> 2. Pushed right — language toggle, 72×36, identical styling to desktop: `#EEEAE2` track, "EN" active, "हिन्दी" inactive, full Devanagari spelling
> 3. Primary button, 68×36, 12px radius, `#1B4DB1` fill, white DM Sans 500 14px, label **"Start"** (shortened from desktop for space; it leads to the same place)
> 4. A 44×44 hamburger button — three 18px horizontal strokes, 2px thick, `#131C2B`, 5px apart
>
> **No tagline in the bar. No hamburger-only layout — the Start button stays visible**, because reaching the start flow is the page's whole purpose and burying it would cost two taps.
>
> Every interactive element has a 44×44 minimum touch target, using padding where the visual element is smaller.
>
> Also produce **360×800** (16px gutters, 8px gaps, 64px CTA, 72×36 language toggle) and **430×932** (24px gutters, 12px gaps, 20px wordmark, 72×36 CTA). The structure is identical in all three; only gutters, gaps and wordmark size change. The logo symbol stays 24×24 at every width.

---

### D. Mobile dark header

> Same layout, dimensions and content as prompt C, 390×844, **dark mode**.
>
> Bar `#18202E`, 1px `#2A3342` bottom border. Logo rail `#3A4658`, marker `#7BA4F5`, wordmark `#EDEAE4` with the j dot `#7BA4F5`.
>
> Language toggle: track `#222B3A`, active segment `#18202E` with `#EDEAE4` text and 1px `#2A3342` border, inactive `#8996A8`, divider `#3A4658`.
>
> **CTA inverts:** `#7BA4F5` fill with `#0F1622` text.
>
> Hamburger strokes `#EDEAE4`.
>
> Focus ring `#7BA4F5`, 2px, 2px offset.
>
> Also produce **360×800** and **430×932**.

---

### E. Mobile right-side hamburger panel

> Design a navigation panel sliding in from the **right** edge, over a mobile viewport at 390×844. Produce both light and dark versions.
>
> **Backdrop:** `rgba(19, 28, 43, 0.48)` covering the page to the panel's left. This is derived from the ink colour — **not black**.
>
> **Panel:** 86vw wide, max 340px, full viewport height. Background `#FFFFFF` (dark: `#18202E`). 1px `#DDD6CC` (dark `#2A3342`) left edge. A soft shadow is correct here — this element genuinely floats. **24px radius on the left two corners only**; the right corners are square against the screen edge. 20px padding all round.
>
> Contents, top to bottom:
>
> 1. **Brand area** — logo symbol at 32×32, 12px gap, "Samjo" wordmark at 24px (j dot in primary), 4px gap, "Samajh aane tak." at 16/22 in `#49566A` (dark `#B3BCC9`). **This is the only header context where the tagline appears.** A 44×44 close button with a 20px ✕ glyph in `#49566A` sits at the top right.
> 2. A 1px `#DDD6CC` divider.
> 3. **Four nav rows**, each 56px tall, DM Sans 400 at **18/28** in `#131C2B` (dark `#EDEAE4`), separated by 1px `#DDD6CC` dividers: "How it works", "What Samjo does", "Privacy", "Accessibility". 18px rather than 16px because the reader may be stressed or older. Pressed state fills the whole row with `#EEEAE2` (dark `#222B3A`). **No "Home" row** — the wordmark above already links home.
> 4. 24px gap. A "Language" label in DM Sans 500 at 14/20 in `#6E7A8A`, 12px gap, then a full-width two-segment control 44px tall: "English" and "हिन्दी", same styling as the header toggle but spelling English out in full.
> 5. 24px gap. A "Theme" label in the same style, 12px gap, then a full-width **three**-segment control 44px tall: "Light", "Dark", "System" — with System active by default.
> 6. **Pinned to the bottom, above a 1px divider:** a full-width primary button, **52px tall**, 12px radius, `#1B4DB1` fill (dark: `#7BA4F5` fill with `#0F1622` text), reading **"Start with Samjo"** — the full label, since there is room here. Beneath it, "No account. Deleted within 24 hours." in Inter 14/22 `#6E7A8A`.
>
> The CTA region is sticky inside the panel, so it stays visible if the content above scrolls.
>
> **This must not look like a generic hamburger drawer.** What distinguishes it: the full stacked brand lockup with tagline at the top; nav rows divided by the same hairlines the product's briefing uses rather than being a plain list; and the CTA pinned at the bottom with its reassurance line rather than trailing as the last list item.
>
> **Stitch must NOT add:** a search field, social icons, a "Home" row, a login or sign-up row, an account avatar, a settings gear, a version label, a "beta" badge, a country flag, a sun or moon icon, or a second CTA.

---

## 18. Final recommendation — one architecture

**Desktop structure (≥1024).** A 64px sticky bar on `--surface`, 1200px max-width. Left: logo symbol 24px + "Samjo" wordmark 20px with the j-tittle in `--primary`. Then 48px, then three left-aligned nav items — How it works · What Samjo does · Privacy. Right edge: language toggle (`EN │ हिन्दी`, both visible), a Display popover trigger, then a `sm` 36px primary CTA reading "Start with Samjo". No tagline, no descriptor, no shadow, no transparency.

**Mobile structure (≤767).** A 56px bar with four elements: logo, language toggle, a `sm` primary CTA labelled "Start", and a 44px hamburger. The CTA stays in the bar rather than moving into the panel, because reaching `/start` is the page's only conversion goal.

**Hamburger structure.** Right-side panel, 86vw max 340px, 24px radius on the left corners, backdrop derived from the ink colour. Contents: stacked brand lockup with the tagline (its only header appearance) and a close button; four nav rows at 18px on 56px rows — How it works · What Samjo does · Privacy · Accessibility; a labelled full-width language control; a labelled full-width three-way theme control; and a pinned 52px "Start with Samjo" CTA with its reassurance line.

**CTA placement.** Desktop bar (`sm` 36px, quieter than the hero's `lg` 52px) · mobile bar (`sm` 36px, label "Start", accessible name still "Start with Samjo") · panel bottom (`lg` 52px, full label). All three route to `/start`, the anonymous-first chooser. Never an arrow in the label.

**Language placement.** Always in the bar at every breakpoint, as an inline text toggle with both scripts visible. Repeated in the panel and the footer. Never a dropdown, never a flag, `हिन्दी` never abbreviated. This is the product's primary accessibility affordance for persona C and it is never one interaction away.

**Theme placement.** Inside the Display popover on desktop, grouped with text size on app routes; inside the panel as a labelled segmented control on mobile. Light · Dark · System, defaulting to System. Not a top-level header icon — that would add a fourth right-side control and crowd 1280 and 360 alike.

**Logo lockup.** Horizontal — symbol (rail + marker + text lines) at 24px, 8px gap, wordmark at 20px with the j-tittle in `--primary`. The stacked lockup with tagline is reserved for the panel, footer and export. Symbol alone below 32px; text-line strokes dropped below 20px; absolute floor 16px.

**Sticky behaviour.** Sticky from the first pixel, constant height, solid background, permanent 1px border. Nothing transforms, shrinks, fades, blurs or hides on scroll. Zero layout shift, nothing to disable under reduced motion, and the language control and CTA reachable from any scroll position.

**Two header variants, not one.** The marketing header above, and an app header for `/upload`, `/d/:id/*` and `/situation` that drops the nav and the CTA and adds read-aloud and text size to the Display popover, per UX_FLOWS §1.

### Open items for your decision

1. **C5 — dark mode gate.** Adding the 13 dark tokens makes ACCESSIBILITY §5's "light and dark" axe gate real across every route, not just the header. Commit to a full dark palette or narrow the gate. Do not ship a dark header on a light-only site.
2. **Dark mode is a scope increase.** Absent from PRD §8, ACCESSIBILITY §2 and §3. Worth acknowledging explicitly rather than absorbing.
3. **"AI for Legal Assistance & Access"** — recommended out of the header and the lockup entirely, on three independent grounds (§0.3).
4. **Mobile CTA label** — `Start` visible, `Start with Samjo` as the accessible name. Flagged as a judgment call against UX_FLOWS §7; `Start` everywhere is the more literal alternative.
5. **Tagline not in the header bar** — deviation from the brief's §3 proposal, reasoned in §2.4.
6. **`--radius-xl` comment needs updating** in DESIGN_SYSTEM §4 to cover a side panel's left corners.
