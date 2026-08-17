# Phase 7 — design craft pass

Branch: `chapters-rebuild`. Prior: `548b701` P0 · `f5c156c` P1 · `b3337f7` P2 · `1ef922e` P3
· `f97a993` P4 · `80ceca5` P5 · `eaf5337` P6.

Verification: `tsc --noEmit` clean, `vite build` succeeds, `npm run dev` starts clean (200
on all six top-level routes, no warnings), **43/43 checks pass**.

---

## Footer

Replaced with the exact line, in `Footer.tsx`, `public/apply.html`, and `public/llms.txt`:

> Atlas Research Institute operates as a project of a California nonprofit public benefit
> corporation. For more information contact admin@atlas-research.org

The entity name is gone from the entire repo — grepped, and asserted per-page in the checks.
A comment above the line says not to reintroduce a company name, EIN, "501(c)(3)", or "tax
deductible".

## 1. Globe

`cobe` reinstalled. `src/data/reach.ts` holds the 20 countries with centroid coordinates,
under a header stating that no country may be added without a real fellow and no count may
be shown that does not match the array length.

`REACH_COUNT` is **derived**, not written — the caption reads "Fellows in {REACH_COUNT}
countries", so a hardcoded number cannot drift from the list. Checks assert the count
matches the array, codes are unique, and every coordinate is in range.

Sits right of the headline. Paper sphere `#FAFAF9`, navy markers `#1C3F5E`, a `#E2E0DA` rim
rather than a glow. Slow rotation at 0.0022 rad/frame.

**One implementation note:** this cobe version does not expose `onRender` in its types, so
rotation is driven by our own rAF loop calling the documented `update()` API. Under
`prefers-reduced-motion` the globe draws once at an opening angle showing the widest marker
spread and **no rAF loop starts at all** — the preference is honoured by not animating,
rather than by animating and hiding it. The listener is live, so toggling the OS setting
takes effect without a reload.

## 2. Field icons

`src/components/FieldIcon.tsx` — eight hand-drawn line icons, one per `Field`. Stroke-only,
1.5px, `currentColor`, 24px default, no fills, no library, no emoji. All drawn on the same
24-unit grid at matching visual weight so a row reads as one set.

Used in card headers, directory filters, brief pages, and the field index band. `currentColor`
means the same icon works on paper and on a navy header without a variant.

## 3. Paper grain

An inline `feTurbulence` SVG on `body::before` — fixed, `pointer-events: none`, behind
content via `#root { z-index: 1 }`. Fractal noise at `baseFrequency 0.82`, desaturated,
rect opacity 0.035 under a layer opacity of 0.5.

Cheap by construction: one fixed element, no blend mode, no repaint on scroll. It never
lands on top of type, so measured text contrast is unchanged.

## 4. Process track

`ProcessTrack.tsx` replaces the four text boxes. Five nodes — Question, Sources, Analysis,
Draft, Review — numbered 01–05 on a hairline, each with supporting text. Nodes are drawn
SVG. No animation.

Desktop runs horizontal with the rule behind the node row, clipped at both ends so it does
not overhang. Mobile becomes a vertical rail with the line down the left. **One set of
markup for both** — a grid change, not duplicated steps.

Step 05 states that completed work *may* be submitted and review decides.

## 5. Field index band

Eight rows, each with its icon, each linking to `/research-groups?field=…`. Kept compact and
typographic rather than eight cards — a card grid here would out-weigh the research groups
section above it, which is what actually carries proof.

The directory now **reads `?field=`**, validates it against the `Field` union, applies it,
and strips it from the URL. An unrecognised value is ignored rather than producing an empty
directory.

## 6. Typographic scale

- `.type-hero` — `clamp(2.75rem, 7.2vw, 5.25rem)` = 44px → 84px
- `.type-section` — `clamp(1.75rem, 3.4vw, 2.75rem)` = 28px → 44px
- `.type-body` — fixed 17px
- `.numeral` — oversized light-navy display numerals for numbered sections

## 7. Asymmetric layout

- Hero: `lg:grid-cols-[55fr_45fr]`, text left, globe right.
- Homepage groups: first card `md:col-span-2` with larger type and a taller header.
- Events: `lg:grid-cols-[3fr_2fr]` — next event large left, following stacked small right.
  Three equal tiles gave every session the same weight, which was wrong; only the next one
  is actionable today.

## 8. Structure as design

`components/home/Section.tsx` owns the numbering, the hairline rule, and the tone
alternation so no section can drift. Sections 01–06 carry their numeral in the heading's
left margin, `aria-hidden` because the heading already says it. Vertical spacing tightened
~25% (py-16/20 → py-12/16).

## 9. Card headers

The navy block is now the card's main surface: field icon top-left, status chip top-right,
project title in large Spectral white at the bottom. The duplicate field label below is gone.

Navy tint varies deterministically across four steps `#1C3F5E → #22496B → #265078 →
#2A5A82`, keyed to field index — deterministic rather than random because a tint that
changes between renders reads as a bug, and because the association becomes learnable.

`StatusChip` gained an `onNavy` variant; the paper-toned chip was illegible on navy.

When a real image exists the image takes the block and the title moves below it.

## 10. Research groups page

A band directly under the heading, above the filters: "No group here doing your question?
Start one." plus the primary button. The bottom CTA is kept.

The empty-filter state now leads with **Start a research group** and demotes reset to
secondary — resetting only returns the reader to a list that already did not have what they
wanted.

## 11. Motion

Kept: globe rotation, card hover (1px navy border + `translateY(-2px)` + small shadow at
120ms), button/link transitions, focus-visible rings, smooth anchor scroll. None added.

`prefers-reduced-motion` drops the hover lift to `transform: none` and stops the globe loop
entirely.

---

## Verification

```
PASS  /                                               38094b
PASS  /research-groups                                18674b
PASS  /research-groups/placeholder-model-card-review   8337b
PASS  /events                                          6032b
PASS  /journal                                          9389b
PASS  /journal/placeholder-working-paper               6134b
PASS  /fellowship                                      9462b
PASS  /partners                                        6664b
PASS  /nope                                            3403b
```

Every page scanned for 33 banned strings (dead tokens, banned words, ISSN / 501(c) / info@ /
scholarship / 9-12 / education framing / July 24 / apply.html / yourbuddy) and asserted to
carry the exact footer line and the contact address. Then 34 behavioural assertions across
the globe data, icons, process track, type scale, asymmetry, card headers, directory CTAs,
motion, and the still-empty stat band. **All 43 passed.**

Bundle: 281 KB → 305 KB JS (97 KB gzipped); CSS 19.4 KB → 22.8 KB. The increase is cobe.

---

## Two things worth your attention

**The globe is the site's only unverifiable-by-me claim.** `reach.ts` asserts that a real
fellow exists in each of those 20 countries. I took the list as given and wrote the guard
rails around it, but I cannot check it — and unlike the stat band, which stays empty until
you fill it, this one ships visible. If any country on that list is aspirational rather than
actual, remove it before launch and the count follows automatically.

**`public/og-globe.png` is still stale** — 842 KB, and now doubly odd since a globe exists
on the site again but this image is not it. Still needs a 1200×630 replacement; generating
imagery remains out of bounds for me. `public/logo-plate.jpeg` is still unused.
