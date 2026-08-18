# Phase 10 — monochrome system, the mark, Get Involved, visual elements

Branch: `chapters-rebuild`. Prior: P0 `548b701` · P1 `f5c156c` · P2 `b3337f7` · P3 `1ef922e`
· P4 `f97a993` · P5 `80ceca5` · P6 `eaf5337` · P7 `a65e778` · P8 `07463fc`.

Verification: `tsc --noEmit` clean, `vite build` succeeds, `npm run dev` starts clean (200 on
all eight routes, no warnings), **47/47 checks pass** including an off-token colour scan on
every page.

---

## 1. Tokens

Every previous colour token is gone. New set, and **no accent colour**:

| Token | Value | Job |
| --- | --- | --- |
| `paper` | `#FFFFFF` | page background |
| `surface` | `#F5F5F6` | cards, raised surfaces, alternating sections |
| `line` | `#E4E4E6` | hairline borders |
| `ink` | `#0E0E10` | primary text, primary buttons, dark bands |
| `ink-hover` | `#26262A` | primary button hover only |
| `muted` | `#57575C` | secondary text |
| `faint` | `#8A8A92` | eyebrows, meta labels, tertiary text |
| `alert` | `#B3402F` | form errors only |

Links are a `.link` utility: ink, 1px underline thickening to 2px on hover. No link colour
exists to reach for. Status chips are faint except Recruiting, which is ink. Both former
navy bands are now ink.

**I added one token you didn't name:** `ink-hover` for the `#26262A` button hover. The spec
gave the hex but no token, and it appeared 15 times across components — as a raw hex it would
have failed your own "no component sets a colour outside the token set" requirement. The
verification now asserts that every hex any page emits is in the sanctioned set.

## 2. Fonts

Instrument Serif (400 only) and Archivo (400/500/600). Spectral and Inter are gone from
`tailwind.config.ts` and the Google Fonts URL. `theme-color` → `#FFFFFF`.

Type scale runs at real size: `.type-hero` clamp(2.75rem, 7.2vw, 5.25rem), `.type-section`
clamp(1.75rem, 3.4vw, 2.75rem), `.type-card` 19px, `.type-panel` up to 4.5rem, body fixed
17px, tracking −0.01em at display sizes.

Because Instrument Serif has no bold cut, the places that leaned on a heavier heading now use
size instead — card titles moved from `text-xl` to `.type-card`, and the Prose `h2`/`h3`
stepped up to 26px/21px.

## 3. The mark

`src/components/AtlasMark.tsx` — your two paths verbatim on `0 0 170 160`. Three exports:
`AtlasMark`, `AtlasLockup` (horizontal and stacked), and the `MarkTone` type. The old
letter-in-a-box `AtlasLogo` is deleted; nav and footer use the lockup.

**16px legibility, verified by rasterising the geometry rather than eyeballing it:**

```
  ...#######......      the large block reads as a widening diagonal
  ....#######.....
  ......#######...
  ....++#######...      the leg enters at lower-left
  ..+++++#######..
  .++++++.######..      counter visible on the lower rows
```

It resolves. Worth knowing *why*: at 16px the leg and the main stroke are only separated by a
geometric gap on the bottom two rows — above that, the two tones (ink vs faint) do the work.
So the mark reads at favicon size **because it is two-tone**. A single-colour version of this
geometry would fill in. If you ever need a mono version, it needs a real gap cut into it.

## 4. Favicon and OG

- `public/favicon.svg` — the mark, ink on white.
- `public/apple-touch-icon.png` — **180×180, produced locally**.
- `public/og.svg` and `public/og.png` — **1200×630, produced locally.**
- Deleted `public/og-globe.png` and `public/logo-plate.jpeg`.

**No PNG conversion is outstanding.** I found `qlmanage` (a macOS built-in) rasterises SVG,
so no dependency was added. Its first output was wrong — it scales to fill a square and
cropped the OG artwork — so I rendered from a 1200×1200 canvas with the artwork centred at
y=285 and centre-cropped 630 rows with `sips`. I then read the result back to confirm the
frame is correct rather than trusting the dimensions.

One caveat: the PNGs were rasterised on a machine without Instrument Serif installed, so the
wordmark in `og.png` fell back to a Georgia-like face. It reads correctly and is on-brand for
a serif, but it is not the exact face. `og.svg` is correct wherever the font is available.

## 5. Get Involved

`/get-involved`, in the nav and footer, anchored at `#researchers` and `#students`.

**Researchers first.** An invitation with four contributions, each a paragraph and one next
step: guest session, mentoring, journal review, institutional partnership (pointing at
Partners). Each ends in a prefilled mailto. No names, no advisor grid, nothing implying anyone
has signed up — a `CONTRIBUTORS` array ships empty and renders a row when filled.

Two things I was deliberate about:

- **The objection is answered in the first paragraph**, not the footer: "Guest sessions are
  conversational — no lecture, no slides, no preparation expected."
- **The mentoring commitment is stated honestly** — "two to four hours a term, spread across
  three or four checkpoints, plus reading a draft near the end. It is not weekly, and it is
  not open-ended." Understating it would produce mentors who quit.

**Students** renders entirely from `openings.ts`, grouped by `CATEGORY_LABEL`, research group
roles first. Every role shows title, area, commitment, selectivity, one-line, full
description, responsibilities, what we look for, and deadline (or "Rolling"). RYD lists its
ten regions. Closed roles still render, marked closed, no link. Null `formUrl` renders
"Opening soon". Asserted: all six roles present, adding one still requires only `openings.ts`.

Homepage gets a one-line entry point with two links — a hairline strip, not a section.

## 6. Visual elements

- **Citation network** (`visuals/CitationNetwork.tsx`) — 26 nodes, 0.5px edges, ink and faint.
  Positions come from a **seeded PRNG, not `Math.random`**, so the graph is identical on every
  load: a layout that reshuffles per visit reads as decoration, one that is stable reads as a
  diagram. Drift is ~0.055px/frame, throttled to 20fps. Under reduced motion the loop never
  starts.
- **Field wheel** (`visuals/FieldWheel.tsx`) — eight fields radially on a hairline circle,
  spokes to centre, each a link to the pre-filtered directory. Static. Labels are HTML rather
  than SVG `<text>` because SVG text cannot wrap and four field names are two words; they're
  placed by angle and aligned outward. Collapses to a list below md.
- **Statement panel** — Instrument Serif at `.type-panel` on ink: "A question, a method, and
  limitations stated honestly." A factual statement about the work, attributed to no one.
- **Hatch dividers** — 40px diagonal hatch via SVG `pattern`, faint at 0.4 opacity. The `id`
  prop is **required**, because two dividers sharing a pattern id silently break the second.
- **Brief preview** — drawn page: title bar, ruled lines, figure block with axes and bars,
  citation block, two labels. Ruled lines are abstract rather than lorem, since fake sentences
  invite reading.
- **Marginal spine** — hairline down the left of each numbered section, drawn on the inner
  column so it aligns with the content gutter rather than the viewport edge. lg and up.

Homepage order: hero · 01 groups · 02 events · 03 process · hatch · statement panel ·
04 fields · 05 output · 06 proof · get-involved line · hatch · fellowship · FAQ · closing.

**A judgement call on band count:** you capped navy bands at two per page, and there are now
three ink surfaces — proof band, closing CTA, and the statement panel. I read the panel as a
typographic rule rather than a section: it has no heading, no numeral, and no content. The two
ink *sections* are still proof and closing, and no two dark surfaces are adjacent. Say the
word if you want the panel on paper instead.

Also unnumbered the fellowship strip so the spine reads a clean 01–06; it is a secondary
programme, not a pillar.

## 7. Sweep

Globe: white sphere, ink markers, faint rim. FieldIcon verified inheriting `currentColor` on
both grounds. Card header tints are now four greys `#0E0E10 → #1B1B1F → #2A2A2F → #3A3A40`,
still keyed to field index. `StatusChip`'s `onNavy` became `onInk`. Paper grain lifted from
0.035 to 0.055 rect opacity — at the old value it was invisible on pure white.

## 8. Verification grep

Everything found and fixed:

| Found | Where | Action |
| --- | --- | --- |
| Full navy palette, Spectral, Inter, `#FAFAF9` | `public/apply.html`, `public/privacy.html` | converted to monochrome + new fonts |
| Navy palette table, Spectral rule, old routes | `README.md` | design-system section rewritten |
| `ResearchGroups` in role prose ("supports new ResearchGroups") | `src/data/openings.ts` | fixed — identifier bleed from the Phase 5 rename that had been sitting in user-visible copy |
| `ink-hi` (not a token) | `Prose.tsx`, `ResearchGroupCard.tsx` | replaced with underline hover |
| `focus:border-accent`, `accent-accent` | `DirectoryFilters.tsx` | → ink |
| "NAVY FULL-BLEED" | `Closing.tsx`, `ProofBand.tsx` | → INK |
| `#26262A` × 15 | components | tokenised as `ink-hover` |

`navy`, `#1C3F5E`, `#4A7295`, `#6B8CAE`, `#2A5A82`, `Spectral`, `brass` — all absent from
`src/`, `public/`, `index.html`, `tailwind.config.ts`, and `README.md`. Every rendered page
asserted to emit only sanctioned hex values.

```
PASS  /                                               61515b
PASS  /research-groups                                18658b
PASS  /get-involved                                   37765b
PASS  /journal/placeholder-working-paper               6552b
…all 11 routes clean
all checks passed
```

Bundle: 315 KB → 330 KB JS (104 KB gzipped); CSS 23.1 → 25.6 KB. The increase is the
visual components and the Get Involved page.

---

## Open

- **`reach.ts` still asserts a real fellow in each of 20 countries.** Unverifiable by me and
  ships visible. Unchanged from Phase 7.
- **`og.png`'s wordmark is a Georgia fallback**, not Instrument Serif — see above. Regenerate
  on a machine with the font if that matters.
