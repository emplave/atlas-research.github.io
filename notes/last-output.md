# Chapters rebuild — Phase 2

Branch: `chapters-rebuild`. Phases 0 and 1 committed separately beforehand
(`548b701`, `f5c156c`).

Verification: `npx tsc --noEmit` clean, `npx vite build` succeeds, all 8 routes render.

---

## Tokens — `tailwind.config.ts`

The `cream.*`, `navy.*`, and `gold.*` ramps are gone, along with the `fade-up` and
`pulse-node` keyframes. Nine semantic tokens replace them:

| Token | Value | Job |
| --- | --- | --- |
| `ground` | `#17181A` | dark page background |
| `panel` | `#1F2022` | cards, raised surfaces |
| `line` | `#34342F` | hairline borders |
| `text` | `#E9E4DA` | primary text on dark |
| `muted` | `#98948B` | secondary text on dark |
| `brass` | `#C08A3E` | links and buttons only |
| `brass-hi` | `#D2A254` | link and button hover |
| `paper` | `#F2EBDD` | light reading background |
| `ink` | `#241B10` | light reading text |

The file comment states the accent rule directly: brass is links and buttons, never a
background wash, never body text.

**~270 token occurrences across 23 files** were swept to the new names. The mapping was
prefix-sensitive, because the old palette was light-first and the new default is dark —
`text-cream-100` was light text *on* a dark section and became `text-text`, while
`bg-cream-100` was a light surface and became `bg-ground`. A naive find-and-replace would
have inverted half the site.

## Fonts

- `font-display` → Spectral, Georgia, serif. A base rule pins `h1`–`h4` to weight 400, so
  Spectral cannot render at 600+. Audited: no `font-bold` / `font-semibold` anywhere.
- `font-serif` was kept as an alias during the sweep, then all 35 call sites were converted
  to `font-display`. The alias remains in the config as a safety net.
- `font-sans` → Inter, system-ui, sans-serif.
- `font-mono` removed from the config; the 5 usages were rewritten.
- `.meta-label` redefined as Inter / 11px / uppercase / `0.14em`, so all 33 existing call
  sites keep working with no edits.
- `index.html` fonts → `Spectral:300;400;500` + `Inter:300..600`. Playfair Display and
  JetBrains Mono dropped.
- `theme-color` → `#17181A`. Favicon recolored to brass-on-ground.

## Radius

`rounded-card` 10px, `rounded-control` 6px. All 15 `rounded-full` CTAs converted to
`rounded-control`; the loose `rounded-2xl` / `xl` / `lg` / `md` / `[24px]` mix was
normalized into the two tokens. `rounded-full` survives on exactly 4 elements — three
`h-1.5 w-1.5` status dots and one uppercase tag pill, all small status chips.

## Dual-mode shell

`src/index.css` no longer hardcodes `color-scheme: light`, and the global `bg-cream-100`
wrapper is gone from `App.tsx`.

**`src/lib/theme.ts`** is the route→mode map. Dark chrome is the default, so nothing needs
listing to be dark; light reading is opt-in by path prefix:

```ts
const LIGHT_READING_PREFIXES: readonly string[] = [
  "/chapters/", // individual chapter briefs, not the directory
];

export function modeForPath(pathname: string): Mode { … }  // defaults to "dark"
```

The prefix is deliberately `/chapters/` with the trailing slash so the **directory** at
`/chapters` stays dark chrome while an individual **brief** at `/chapters/:slug` is light
reading. Confirmed by the smoke test below.

**`App.tsx`** applies the mode at route level via a `ModeManager` that swaps a single class
on `<html>`. Two reasons it is on the document element rather than a wrapper div: the
background then extends past the app's own height (no light strip under a short dark page),
and exactly one of `mode-dark` / `mode-light` is ever present, so the two modes cannot
bleed into each other.

Routes registered: `/`, `/chapters`, `/fellowship`, `/apply`, `/journal`, `/partners`, and
a real `404`. `Chapters.tsx` and `Publish.tsx` existed but were never routed — `/chapters`
and `/journal` now reach them. The `*` route previously rendered the Landing page, meaning
every bad URL silently returned the homepage; it now renders an actual 404.

**Nav** rebuilt. It reads its mode from `theme.ts` via `useLocation` rather than taking a
prop, so no page can put it in the wrong mode. The dead `/#study` and `/#sequence` anchors
are replaced with `/chapters`, `/fellowship`, `/journal`, `/partners`, with `aria-current`
on the active route.

**Footer** split out of `Closing.tsx` into `src/components/Footer.tsx`, rendered by the
shell on every route. `Closing` is now a landing-page CTA section only. The footer carries
the required line verbatim:

> Atlas Research Institute operates as a project of yourbuddy Inc., a California nonprofit
> public benefit corporation.

No donate link, no donate button.

**`AtlasLogo`** had to be rewritten — its `inverse` prop had collapsed to two identical dark
branches under the sweep. It now takes `mode` and renders correctly in both. Tagline kept
as "Global Research Access".

**Contact email** is `admin@atlas-research.org` everywhere; `APPLY_EMAIL` (`info@`) was
renamed to `CONTACT_EMAIL` across the 3 files that used it. The smoke test asserts no `info@`
survives on any route.

## Motion

`IntroSplash` deleted entirely. `Reveal` and the other entrance animations are untouched,
per the instruction to leave them for Phase 7.

## Q3 — globe cut

Deleted `src/components/ui/globe.tsx`, `src/lib/cohort.ts`, and the `cobe` dependency
(`package.json` + lockfile). `WorldSection.tsx` rebuilt without it. All three
"Active in 15 countries" instances are gone — the heading, the body copy, and the caption
under the globe. Figures now come from `stats.ts`, and the null country count renders
nothing at all rather than a fallback:

```tsx
...(hasStat(COUNTRIES_ACTIVE)
  ? [{ n: String(COUNTRIES_ACTIVE), label: "Countries active" }]
  : []),
```

---

## Defects found and fixed during the sweep

Four things the mechanical pass produced or exposed, all corrected:

1. **Invisible CTAs.** `bg-navy-800 text-cream-100` buttons became `bg-panel text-text` —
   near-invisible on a `ground` page, with degenerate `hover:bg-panel` no-op hovers. All
   primary CTAs are now `bg-brass text-ground hover:bg-brass-hi`, which is also what the
   accent rule calls for.
2. **Invisible arrows.** Five `→` glyphs carried `text-brass` *inside* brass buttons. Class
   removed so they inherit `text-ground`. The one remaining brass arrow is in a ghost
   button, where it is correct.
3. **Brass body text.** Two form error messages rendered as `text-sm text-brass`, which
   violates the accent-only rule. Rewritten as `text-text` with a brass left border.
4. **Dangling globe reference.** `Chapters.tsx` advertised "the same globe on our front
   page" — copy pointing at a component deleted in this phase. Rewritten.

## Two content fixes made outside the stated scope

Both were live false or broken claims that this phase's work put directly in front of me.
Flagging them rather than burying them:

- **`Hero.tsx` — the Lumiere scholarship claim.** It read "Fellows and research leads
  receive thousands of dollars in **scholarships**." That is the exact claim Q4 says must
  never appear. Replaced with the approved wording: "Fellows get thousands of dollars in
  discounts on Lumiere Education programs through our partnership." The institution line in
  the same sentence was also repointed to "Fellows learn from researchers at institutions
  including USC, the University of Melbourne, and Stanford" — it previously read "Seminars
  feature researchers from…", which is not the approved phrasing. IJHSR, Curieux, and
  Lumiere logos all kept; USC, Melbourne, and Stanford all kept.
- **`index.html` metadata.** Metadata was in scope for this phase, and the title and both
  descriptions were education-inequality framed with a "grades 9–12" eligibility claim.
  Rewritten topic-agnostic, with eligibility as "secondary and university students
  worldwide".

## AnnouncementBar

Removed from the shell. It was hardcoded to "Applications are open · Due July 24, 2026",
which contradicts Q1 (cohort is running now), and Q1 says to remove it sitewide. The
component was deleted along with the rest of the old `Nav.tsx`. Calling it out because it
was not in the explicit Phase 2 list — it came along with the shell rewrite.

---

## Verification

`npx tsc --noEmit` — clean. `npx vite build` — succeeds, 423 modules, 20.29 kB CSS.

Every route rendered through `renderToString` and asserted on:

```
/                                          mode=dark   32530b legal=y email=y
/chapters                                  mode=dark    8453b legal=y email=y
/fellowship                                mode=dark    3204b legal=y email=y
/apply                                     mode=dark    3201b legal=y email=y
/journal                                   mode=dark    7293b legal=y email=y
/partners                                  mode=dark    6343b legal=y email=y
/chapters/placeholder-model-card-review    mode=light   2982b legal=y email=y
/definitely-not-a-page                     mode=dark    2982b legal=y email=y

all routes rendered clean
```

`legal=y` asserts the yourbuddy Inc. line is present, `email=y` asserts the contact address
is present, and each route was scanned for the banned strings `ISSN`, `501(c)(3)`,
`tax deductible`, and `info@atlas-research.org` — none found. The mode column confirms the
directory/brief split works. The smoke harness was temporary and is not committed.

Note that `/chapters/:slug` currently falls through to the 404 (2982b, same as the unknown
route) because chapter brief pages are a later phase. The mode map is already correct for
them, which is why it reports `mode=light`.

---

## Open items for the next phase

- **The palette has no error/danger token.** Nine tokens, none of which signals a failed
  form submission. Handled for now with a brass left-border treatment, but forms will need
  a real answer.
- **`bg-white` on the three partner logo chips in `Hero.tsx`** is not a token. It is there
  so the logos stay legible, which is a real constraint on a dark ground — but it is
  currently the only raw color in the codebase.
- **`dates.ts` still says applications are open, due July 24, 2026.** Q1 says the cohort is
  running now. Not touched, since Q1 was not in Phase 2 scope; it is still pending.
- **`Instrument.tsx` and `Outcomes.tsx` remain education-framed** and still reference the
  access gap. Slated for the topic-agnostic rewrite.
- **`Partners.tsx` still falls back to mailto** via `FORM_ENDPOINT`, which is still `null`.
  Q2's fix is pending.
