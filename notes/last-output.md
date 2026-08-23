# Logo migration — applying the audit fixes

All seven items done. `npx tsc --noEmit` clean, `npx vite build` clean.

---

## 1. `AtlasMark.tsx` — new geometry, collapsed to one path

**Collapsed to a single path, yes.** The old mark needed `LARGE` and `SMALL` because it was two
separate angular blocks whose counter was the negative space *between* them — the lighter grey leg was
doing the work of keeping them apart. The new mark is one letterform that carries its own counter, so
there is no second shape and no second fill. `FAINT` (`#8A8A92`) is gone with it.

The path is read verbatim from `public/atlas-mark.svg` — verified programmatically as byte-identical to
the source, not retyped. 2050 chars, 3 subpaths (right stroke; left stroke with the nib; a hairline
shaping the nib tip).

### API preserved

| | Before | After |
| --- | --- | --- |
| `AtlasMark` props | `size`, `tone`, `className`, `title` | unchanged |
| `AtlasLockup` props | `size`, `tone`, `variant`, `className` | unchanged |
| `MarkTone` export | `"light" \| "ink"` | unchanged |
| `size` semantics | rendered height in px | unchanged |
| viewBox | `0 0 170 160` | `0 0 1000 1000` |
| width | `size * 170/160` | `size` (viewBox is square) |

`Nav.tsx` and `Footer.tsx` are **untouched** — including the `aria-label="Atlas Research Institute —
home"` on the nav link.

### Sizing behaviour is preserved, measured rather than assumed

I kept the full square viewBox rather than tightening it to the ink box, because that is what holds the
optical size steady:

```
ink height as a fraction of rendered height:  old 0.8625 → new 0.8700  (+0.87%)
ink width  as a fraction of rendered height:  old 0.9000 → new 0.8492  (−5.64%)
```

At `size=24` the mark stands 20.9px tall against the old 20.7px. **That 1% is why neither the nav nor
the footer needed adjusting**, and why the lockup balance note still holds: ink-to-capHeight is 1.45×,
against the old 1.44×. The mark is ~6% narrower, which is the only visible layout change and it falls
inside the existing `gap-2.5`.

### Nav and Footer verified by rendering

Both render `<AtlasLockup />` with no props — **both are at the 24px default.** I reproduced exactly
what the component emits (square viewBox at 24px, 10px gap, 20px Instrument Serif at −0.015em tracking)
and rasterised it. The lockup reads correctly and the mark sits balanced against the wordmark.

**The nib in the counter at nav size: legible, but only just.** Rendered at 16 / 24 / 32px and
inspected pixel-by-pixel at 12× zoom:

- **24px (nav and footer)** — counter open, nib present as a distinct ~2px detail. It reads *as* a nib
  rather than resolving fully into one.
- **32px** — nib clean and unambiguous.
- **16px** — nib closes into the crossbar and is gone. The A still reads.

So the legibility floor moved from 16px to **24px**, and the nav sits exactly on it. I documented that
in the component with the instruction that if the nav ever gets shorter, drop the wordmark rather than
shrink the mark.

### One thing I got wrong and corrected

I first wrote a comment claiming `fill-rule="evenodd"` was load-bearing and that `nonzero` would fill
the counter. **That is false.** I rendered the path both ways and diffed: **0 of 120,000 bytes differ.**
The three subpaths do not overlap and the counter is an open shape, not a punched hole. The attribute
stays — it is what the source file specifies and the two must not diverge — but the comment now says it
is currently a no-op rather than asserting something untrue.

---

## 2. OG tags → `/og-image.png`

`index.html` lines 36 and 43. Confirmed in the built output:

```
og:image"      content="https://atlas-research.org/og-image.png"
twitter:image" content="https://atlas-research.org/og-image.png"
```

This is the single highest-impact line in the change set: every social and search preview was serving
the old mark *and* a tagline.

---

## 3. Icons regenerated, filenames unchanged

| File | Size | Was | Now |
| --- | --- | --- | --- |
| `favicon-16x16.png` | 16×16 | 179 B, white ground, old mark | 376 B, dark tile, new mark |
| `favicon-32x32.png` | 32×32 | 239 B, white ground, old mark | 742 B, dark tile, new mark |
| `icon-192.png` | 192×192 | 3001 B, white ground, old mark | 2951 B, dark tile, new mark |
| `icon-512.png` | 512×512 | 13295 B, white ground, old mark | 9307 B, dark tile, new mark |

No references changed. **Treatment is now the dark tile** — white mark on `#0E0E10` — matching the
`favicon.svg`, `favicon.ico` and `apple-touch-icon.png` you supplied. They were white-ground before,
which is precisely why the icon set visibly disagreed with itself in the audit.

`public/favicon-32.png` deleted — the near-duplicate that was never wired up.

### The 16px favicon needed a different padding, and I changed it

First pass used the authored tile padding (`translate(207) scale(0.61)` — 20% margin each side) at every
size. **At 16px that renders as a grey smudge, not an A.** I looked at it zoomed rather than assuming it
was fine: the ink came out ~8px across, and a serif letterform with a hairline nib does not survive
that.

So the generator now uses **two paddings**, and says why:

- **16 and 32px** — artwork at 94% of canvas. Ink 13.1px and 26.2px tall. The A is a clean silhouette
  at 16px; the nib is gone, which is unavoidable and correct at that size.
- **192 and 512px** — authored tile padding kept, because `icon-512` is declared `maskable` in the
  webmanifest and Android masks it to a circle. Ink diagonal is 0.724 of the canvas, inside the 0.8
  safe circle. Cropping the mark there would be worse than a slightly smaller mark.

### A generator now exists: `scripts/generate-icons.mjs`

I added it rather than hand-producing five files, because the audit's core finding was that these
assets had *drifted* — and hand-generation is what let them drift. It reads the path from
`public/atlas-mark.svg` at run time, so nothing restates the geometry.

It deliberately does **not** overwrite `favicon.svg`, `favicon.ico`, `apple-touch-icon.png`,
`og-image.png` or the `public/atlas-*` files. Those are authored artwork; a generator quietly replacing
designed files with mechanically composed ones is a trap.

**`sharp` is not added to `package.json`.** The other scripts in `scripts/` run under plain node with
nothing installed, and this one is needed only when the mark changes. Rather than commit a ~10MB native
binary for that, the script detects its absence and prints the install line — verified working:

```
sharp is not installed. It is intentionally not a project dependency —
see the header of this file. To run this script:

  npm i -D sharp && node scripts/generate-icons.mjs && npm un sharp
```

Flagging this as a judgement call: if you would rather have it as a devDependency so the script just
runs, that is a one-line change.

---

## 4. `og.svg` regenerated; `og.png` deleted

`public/og.svg` rebuilt from the new mark. **Tagline kept verbatim:** "Student research groups in any
field." Light ground retained — only the geometry changed, not the treatment.

I also fixed the composition while in there: the mark is now positioned by its **ink box** rather than
its viewBox (it carries ~7% transparent padding, so viewBox alignment left it short of the 96px
margin), and centred vertically on the **text block** rather than the canvas, which was leaving it 17px
low and visibly out of step with the wordmark. Both are derived in the generator, not magic numbers.

**`og.png` was redundant and is deleted.** Same role and same dimensions as `og-image.png`
(1200×630); it carried the old mark. Confirmed zero code references before deleting — the only hits
were `README.md:71`, which item 7 rewrites, and the previous audit report, which this file replaces.

### One inconsistency this leaves, by your instruction

`og.svg` now has the tagline and a light ground. `og-image.png` — the file actually served — has **no
tagline** and a dark ground. So the vector and the shipped raster do not match, and `og.svg` is a
source for nothing.

That is the same *class* of problem the audit found, so I am not going to quietly leave it implied: you
asked for the tagline kept, so I kept it. If the intent was for `og.svg` to be the editable source of
`og-image.png`, it needs the tagline dropped and the ground darkened, and then `og-image.png` should be
regenerated from it. Say which and I will align them.

---

## 5. `public/brand/` deleted

All six files. Confirmed no code references first. These were exports of the retired logo —
`brand/atlas-logo.svg` still contained the old `M30 8 L104 8…` paths.

**If you uploaded any of these to LinkedIn, that profile still shows the old mark.** Deleting the
files does not fix the upload. The replacements are `atlas-profile-1080.png` (square) and
`atlas-lockup-2400-transparent.png` (banner), both already in `public/`.

---

## 6. `.DS_Store` removed and blocked at the build

Deleted `public/.DS_Store` (14 KB). Deleting alone is not a fix — Finder recreates it the moment anyone
opens the folder, and Vite offers no ignore list for `publicDir`.

So `vite.config.ts` gains a small `closeBundle` plugin that strips `.DS_Store` from `dist/` after every
build. **Verified by planting one in `public/` and rebuilding: it does not reach `dist/`.**

Worth noting why this went unseen: `.DS_Store` is in `.gitignore`, so `git status` never mentioned it —
but `.gitignore` has no bearing on whether Vite copies a file.

---

## 7. Stale documentation corrected

**`index.html`** — the comment claimed every icon is "the SAME two paths rendered at a different size".
Now states that `public/atlas-mark.svg` is the vector source, that the component copies it verbatim,
that the icons are generated from it, that the treatment is the dark tile, and names the generator.

**`README.md`** — the "two fixed paths on a `0 0 170 160` viewBox" and "all four need regenerating"
claims are replaced with: the source file, the one-path geometry, the 24px legibility floor, the
three-step change procedure, and an explicit list of what the generator will *not* touch.

---

## Files kept, as instructed

Every `public/atlas-*` file is untouched and still present, unreferenced by code, as source assets for
social profiles:

```
atlas-mark.svg                          atlas-lockup-horizontal.svg
atlas-mark-tile.svg                     atlas-lockup-horizontal-white.svg
atlas-mark-1000-transparent.png         atlas-lockup-2400-transparent.png
atlas-clean-mark-white.png              atlas-lockup-white-2400-transparent.png
atlas-profile-1080.png
```

`atlas-mark.svg` is now load-bearing — the component and the generator both read from it, so it is no
longer merely a source asset.

Note `favicon.svg` is still byte-identical to `atlas-mark-tile.svg`. I left the duplication: the audit
flagged it, you did not ask for it resolved, and one of the two is a live reference.

---

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 697ms
                   dist/index.html                   5.62 kB │ gzip:   2.15 kB
                   dist/assets/index-C_Hba8Vt.css   26.91 kB │ gzip:   6.11 kB
                   dist/assets/index-9GWe1aLO.js   358.81 kB │ gzip: 112.12 kB
```

All nine head references resolve in `dist/`. `og.png`, `favicon-32.png` and `brand/` are absent from
the build. `.DS_Store` stripped.

31 files changed, +577/−261.

## Not verified

The page in a real browser. Everything above is type-check, build, and pixel inspection of
component-exact renders — I cannot drive a browser. **Worth loading the site and glancing at the nav and
footer**, since 24px is now the legibility floor rather than comfortably above it, and a browser's SVG
rasteriser is not identical to libvips at that size.

Also unverified: how the new `og-image.png` looks in a live crawler. Google and LinkedIn may have the
old `og.png` cached against its URL; that URL now 404s, so a re-scrape is worth forcing.
