# Aligning og.svg with og-image.png, and sharp as a devDependency

Both done. `npx tsc --noEmit` clean, `npx vite build` clean.

---

## 1. `og.svg` and `og-image.png` are now the same artwork

`og.svg` is the editable source; `og-image.png` is rasterised **from it**, in the same run, by
`scripts/generate-icons.mjs`. They cannot disagree about the mark, the ground, or whether there is a
tagline.

| | Before | After |
| --- | --- | --- |
| `og.svg` ground | `#FFFFFF` | `#0E0E10` |
| `og.svg` mark | dark, mark only | white, mark + wordmark |
| `og.svg` tagline | "Student research groups in any field." | **none** |
| `og.svg` `<text>` elements | 2 | **0** |
| `og-image.png` | supplied artwork, hand-made | generated from `og.svg` |

### The wordmark comes from the lockup, as outlined paths

This is the part I'd flag as the real decision. The obvious way to add a wordmark to `og.svg` is
`<text font-family="Instrument Serif">`. **I did not do that**, because this project has already been
burned by it once — an earlier OG render silently came out in Georgia on a machine without the font
installed.

Instead `og.svg` nests `public/atlas-lockup-horizontal-white.svg`, which carries the wordmark as
**outlined paths** (verified: 0 `<text>` elements, 2 `<path>`, all `#FFFFFF`). So rendering depends on
no installed font, and `og.svg` contains no live text at all. The lockup's own internal transforms are
nested verbatim rather than flattened, so nothing has to be re-derived if it is redrawn.

### The composition was measured off your approved artwork, not invented

Rather than pick a layout, I measured the `og-image.png` you supplied:

```
content ink : x 188..1012, y 216..413   →  825 x 198 px
canvas      : 1200 x 630
centre      : content 600.0 / 314.5  vs canvas 600.0 / 315.0   → centred on both axes
ink width   : 825 / 1200 = 0.6875 exactly
```

Then I checked whether it came from the lockup — lockup ink aspect **4.16957** vs the card content's
**4.16667**, a 0.07% match. It did. So the generator reproduces that composition: lockup ink at
**0.6875** of canvas width, centred.

**Result is pixel-identical to the artwork you approved:**

```
original approved:  ink x 188..1012  y 216..413   (825x198)  bg rgb(14,14,16)
regenerated      :  ink x 188..1012  y 216..413   (825x198)  bg rgb(14,14,16)
delta            :  x 0   X 0   y 0   Y 0
```

Also confirmed byte-identical across two consecutive runs, so the output is deterministic. The file got
smaller as a side effect — 26.9kB → 17.7kB — because it is now a clean render rather than a re-encode.

### Positioning is by the ink box, and there is a guard

The lockup file has ~40 units of padding on its left and top inside a 1277×367 viewBox. Centring by
viewBox would put the card 3% off. So the generator centres by a **measured ink box**
(`x 40.079, y 39.964, w 1196.963, h 287.071`, obtained at density 600 — 0.12 viewBox units per pixel).

A measured constant goes stale silently if the lockup is ever redrawn, and the failure mode is an
off-centre card nobody notices. So the script now **validates it before writing anything** and exits
with both sets of numbers if they diverge. Tested by perturbing the constant:

```
LOCKUP_INK is stale on x.
  constant: {"x":99.999,...}
  measured: {"x":40,...}
The lockup has been redrawn. Re-measure and update LOCKUP_INK, or the OG
card will sit off-centre.
```

I initially put that check at the end of the file, which meant it wrote a wrong `og-image.png` and
*then* complained. Moved ahead of the OG section and re-verified by hash: when the guard fails,
`og-image.png` is **not** touched.

---

## 2. `sharp` is a devDependency

Added at `^0.35.3`. The manual install instructions are gone from the script header, the `try/catch`
around the import is gone, and it is now a plain `import sharp from "sharp"`.

Everything else about the script is unchanged, **including what it refuses to overwrite**:

```
favicon.svg, favicon.ico, apple-touch-icon.png   — authored brand assets
public/atlas-*.{svg,png}                          — the source assets
```

`og-image.png` moved off that list, since generating it is now the point. Nothing else moved.

### One deployment risk I checked rather than assumed

A devDependency gets installed on Vercel's Linux builder, and `sharp` is a native binary — if the
lockfile only carried my macOS binaries the build would break. It doesn't:

```
16 linux entries in package-lock.json, including
  @img/sharp-linux-x64  and  @img/sharp-libvips-linux-x64
```

Also confirmed `sharp` is **not** part of the build and **not** in the client bundle:

- `npm run build` is `tsc -b && vite build`; the generator is a manual step, wired into no script
- zero occurrences of `sharp` in `dist/assets/*.js`
- zero imports of `sharp` anywhere in `src/`

So the only cost is a slightly longer install on Vercel. If that ever matters, the generator is
standalone and `sharp` could move back out.

---

## Docs corrected

Three places described the old behaviour and would now mislead:

- **`README.md`** — replaced the single-source claim with a two-source table, states that `og.svg` is
  the editable source of `og-image.png`, that `og.svg` has no `<text>` and why, that `sharp` is a
  devDependency so the script just runs, and that the lockup ink box is validated before writing.
- **`index.html`** — added that `og-image.png` is rasterised from `public/og.svg` and neither should be
  hand-edited.
- **`notes/preview-checklist.md`** — this one was actively wrong: its OG section told you to verify
  `Subhead reads "Student research groups in any field."` That subhead no longer exists, so the check
  would have failed correctly and looked like a bug. It now says to expect **no** subhead, and that
  seeing one means a crawler is serving a cached copy of the deleted `og.png`.

Left alone: `src/components/Hero.tsx:29` says "Atlas runs student research groups in any field." That
is homepage body copy, not the logo tagline, and is out of scope.

---

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 703ms
                   dist/index.html                   5.80 kB │ gzip: 2.23 kB
                   dist/assets/index-C_Hba8Vt.css   26.91 kB │ gzip: 6.11 kB
                   dist/assets/index-9GWe1aLO.js   358.81 kB │ gzip: 112.12 kB
```

Generator output:

```
favicon-16x16.png    16x16     ink 13.1px tall
favicon-32x32.png    32x32     ink 26.2px tall
icon-192.png         192x192   ink 99.5px tall
icon-512.png         512x512   ink 265.4px tall
lockup ink check     ok
og.svg               1200x630  lockup ink 825x198
og-image.png         1200x630  from og.svg, 17.7kB
```

The four icon tiles came out **byte-identical to the committed versions** — they do not appear in
`git status` after regeneration, which independently confirms the pipeline is deterministic and that
this change did not disturb them.

`dist/og-image.png` present and both meta tags point at it.

## Not verified

- The card in a real crawler. `og.svg` and `og-image.png` are now provably the same artwork and the
  raster is pixel-identical to the file you approved, but no crawler has fetched it. **The old
  `/og.png` URL 404s**, so any cached preview needs a forced re-scrape rather than waiting.
- A clean `npm ci` on Linux. The lockfile has the right optional dependencies, but I ran the install
  on macOS; the Linux resolution is inferred from the lockfile rather than observed. The next Vercel
  build will confirm it.
