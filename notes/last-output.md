# Display type rebalanced

Branch `chapters-rebuild`. `tsc --noEmit` clean, `vite build` succeeds, all routes serve with no
dev warnings. No `font-weight` added anywhere — the only two in the stylesheet are the existing
`400` declarations.

Numbers below are **measured**, not estimated. I parsed the installed
`InstrumentSerif-Regular.ttf` for `unitsPerEm`, `OS/2` cap height, and per-glyph advance widths,
then computed line breaking at each viewport. Any line count or block height here is from that,
not from eyeballing.

---

## 1–2. Scale raised

| | Before | After |
| --- | --- | --- |
| `.type-hero` | `clamp(2.75rem, 7.2vw, 5.25rem)` — 44→84px | `clamp(3.25rem, 7.6vw, 6.5rem)` — **52→104px** |
| hero tracking | `-0.01em` | **`-0.025em`** |
| hero line-height | 1.02 | 0.98 |
| `.type-section` | `clamp(1.75rem, 3.4vw, 2.75rem)` — 28→44px | `clamp(2rem, 4vw, 3.5rem)` — **32→56px** |
| section tracking | `-0.01em` | **`-0.022em`** |

I raised the section *minimum* too (28→32px), which you did not ask for. Reason is item 3: at
375px a 28px heading against 17px body is only 1.6× — not enough separation to read as a
different level. 32px gets it to 1.9×.

**On tracking specifically:** this was doing as much damage as the size. Instrument Serif sets
loose at display sizes, so the old headlines were both light *and* airy — the letters weren't
touching. Pulling to `-0.025em` condenses each headline into a single mass, which is the lever
this face actually responds to. It is the change I'd keep if I could only keep one.

## 3. Heading-to-body contrast

| | 1440px | 375px |
| --- | --- | --- |
| hero vs body | 4.9× → **6.1×** | 2.6× → **3.1×** |
| section vs body | 2.6× → **3.3×** | 1.6× → **1.9×** |

Body stays 17px. Gaps widened where a heading meets its copy: hero subhead `mt-6`→`mt-8`, hero
buttons `mt-8`→`mt-10`, section intros `mt-3/4`→`mt-5/6`, plus `mb-2` under the `Section` heading
row.

## 4. No font-weight

Confirmed by grep. The comment in `index.css` now says presence comes from size, tracking and
contrast, and not to add one.

## 5. Lockup rebalanced — and it was measurably wrong

You were right that the mark was competing. The number:

```
Instrument Serif capHeight = 0.720 em   (OS/2 table)
mark ink spans y8–146 of a 160 viewBox  = 0.863 of rendered height

mark 32 / word 17  →  ink 27.6px  vs cap 12.2px  =  2.25×
mark 24 / word 20  →  ink 20.7px  vs cap 14.4px  =  1.44×
```

The mark's ink was **more than twice** the wordmark's cap height, while also being a solid black
wedge next to light serif type. Two compounding reasons it dominated.

**I did both** rather than one, because each alone failed:

- Only shrinking the mark left the lockup weightless in a 64px nav bar.
- Only growing the wordmark cost nav width — measured at **165px at 21px** vs 134px at 17px, and
  that bar also carries five links and a CTA. At 20px it's 158px, so +24px total. That is why the
  wordmark is 20px and not 21px.

Also added `-0.015em` to the wordmark, for the same reason as the headings.

---

## The hero, described

**At 1440px.** Headline renders at the **104px ceiling**, three lines, ending "any field." — no
widow. Text block ≈ **306px tall**, up from 257px. It sits in a 629px column beside the globe,
which is ~419px. The headline is the largest thing on the page by a factor of six over body copy
and is now clearly the first thing the eye lands on.

**At 375px.** Headline renders at the **52px floor**, still three lines, block ≈ **153px**, up
from 135px. Ratio to body 3.1×. It does not gain a line, so it costs almost no extra vertical
space — I checked this specifically, because a bigger minimum usually adds one.

**Does the headline now dominate?** Yes at 1440px, clearly. Yes at 375px, though less
emphatically — a 375px viewport caps how much any headline can dominate, and 52px is near the
sensible ceiling before the text block starts pushing the buttons below the fold.

### One thing I had to fix that the numbers surfaced

At 104px in the old **55/45** hero split, the 576px column broke the headline into **four** lines
and left **"field." alone** as a widow. I widened the split to **60/40** (629px), which sets it in
three lines ending "any field.". Verified at every breakpoint:

```
1440px  104.0px  col 629px  3 lines  block 306px  last="any field."
1024px   77.8px  col 552px  3 lines  block 229px  last="any field."
 768px   58.4px  col 720px  2 lines  block 114px  last="any field."
 375px   52.0px  col 327px  3 lines  block 153px  last="any field."
```

A comment in `Hero.tsx` records that narrowing the column again reintroduces the widow.

---

## Is size and spacing enough, or do you need a different typeface?

**Honest answer: it is enough for the hero, and it is marginal for section headings.**

The hero at 104px with `-0.025em` has real presence. At that size the stroke contrast in
Instrument Serif becomes an asset rather than a liability — the thin strokes read as refinement
because the thick strokes are finally thick enough in absolute terms. I would not change the face
on the hero's account.

Section headings are the weaker case, and I want to be straight about why. At **56px** they are
fine. At the **32px** floor on mobile they are still noticeably light, because Instrument Serif's
thin strokes fall to roughly a hair under 1px at that size and start to disappear against white.
Size cannot fix that — 32px is already as large as a section heading can go at 375px without
crowding, and there is no heavier cut to reach for.

So: **if the thinness still bothers you specifically at small-to-mid heading sizes, the answer is
a different typeface, not more of this.** What would fix it is a display serif with a second
weight or lower stroke contrast — something like Fraunces (variable, has real weight axis),
Newsreader, or Source Serif. Any of those would let section headings carry weight at 32px without
touching the hero.

I have not pushed further than size, tracking and spacing, because the next step after this is
faking weight — text-shadow, stroke, or synthetic bold — and all three look broken on a
high-contrast serif. Tell me if you want me to trial an alternate face; it is a
`tailwind.config.ts` + `index.html` change and a font swap, not a rebuild.

---

## Not verified

**I have not seen this rendered in a browser.** Everything above is computed from the font's own
metrics, which is reliable for sizes, tracking, line counts and block heights — but it cannot
tell you how the page *feels*, and "does the headline dominate" is ultimately a judgement made by
eye. Check the preview at both widths.

Two specific things to look at:

1. **The 1024px breakpoint.** The headline is 77.8px there and the globe column is 552px — the
   tightest pairing of the four. If anything looks cramped it will be there.
2. **The nav lockup at md (768px)**, where the links first appear alongside it. The lockup grew
   ~15px; I calculated that it fits, but I estimated the Archivo link widths rather than measuring
   them, so that one is arithmetic rather than measurement.
