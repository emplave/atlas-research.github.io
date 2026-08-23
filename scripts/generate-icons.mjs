/**
 * Generate every raster icon and the OG vector from the one mark source.
 *
 *   node scripts/generate-icons.mjs
 *
 * THE SOURCE OF TRUTH IS public/atlas-mark.svg. Its path is read at run time,
 * so nothing here restates the geometry and nothing can drift from it. The same
 * path is copied verbatim into src/components/AtlasMark.tsx for the on-page
 * logo; if you change the mark, change that file, run this, and copy the path
 * across.
 *
 * Writes:
 *   public/favicon-16x16.png    16    dark tile
 *   public/favicon-32x32.png    32    dark tile
 *   public/icon-192.png        192    dark tile, maskable-safe
 *   public/icon-512.png        512    dark tile, maskable-safe
 *   public/og.svg             1200x630  light ground, wordmark + tagline
 *
 * Does NOT write, on purpose:
 *   favicon.svg, favicon.ico, apple-touch-icon.png  — supplied as brand assets
 *   og-image.png                                     — supplied as a brand asset
 *   public/atlas-*.{svg,png}                         — the source assets
 * Those are authored artwork, not derivatives. Overwriting them here would
 * quietly replace a designed file with a mechanically composed one.
 *
 * SHARP IS NOT A PROJECT DEPENDENCY, and that is deliberate. The other scripts
 * in this directory run under plain node with nothing installed, and this one is
 * needed only when the mark changes, which is close to never. Rather than put a
 * ~10MB native binary in package.json for that, install it when you need it:
 *
 *   npm i -D sharp && node scripts/generate-icons.mjs && npm un sharp
 *
 * The script says so itself if sharp is missing.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(here, "..", "public");

let sharp;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.error(
    "sharp is not installed. It is intentionally not a project dependency —\n" +
      "see the header of this file. To run this script:\n\n" +
      "  npm i -D sharp && node scripts/generate-icons.mjs && npm un sharp\n"
  );
  process.exit(1);
}

/* ------------------------------------------------------------------------- */
/* The mark                                                                   */
/* ------------------------------------------------------------------------- */

const markSvg = readFileSync(join(PUBLIC, "atlas-mark.svg"), "utf8");
const MARK = /\sd="([^"]+)"/.exec(markSvg)?.[1];
if (!MARK) {
  console.error("Could not find a path in public/atlas-mark.svg.");
  process.exit(1);
}

/** The mark's own viewBox, and the ink box measured from its path points. */
const VIEW = 1000;
const INK = { x: 75.39, y: 65.0, w: 849.22, h: 870.0 };

const GROUND = "#0E0E10";
const PAPER = "#FFFFFF";
const MUTED = "#57575C";

/**
 * Fraction of a square tile the 1000-unit artwork box occupies.
 *
 * Taken from public/atlas-mark-tile.svg, which is the supplied favicon.svg:
 * translate(207 207) scale(0.61) on a 1024 canvas puts the artwork box at
 * 610/1024 of the canvas, centred. Matching it exactly is the point — the tile,
 * the .ico and the apple-touch icon were authored to this padding, so the
 * generated PNGs have to use it or the set looks inconsistent again at the sizes
 * where the treatments sit side by side.
 *
 * Maskable check, since icon-512 is declared maskable in the webmanifest: the
 * ink inside that box is 0.506 x 0.518 of the canvas, so its diagonal is 0.724 —
 * comfortably inside the 0.8 safe circle Android masks to.
 */
const TILE_ARTWORK_FRACTION = 610 / 1024;

/**
 * Browser-tab favicons get a much tighter margin than app icons.
 *
 * MEASURED, not guessed. At 16px the tile padding above leaves the ink about 8px
 * across, and a serif A with a hairline nib at 8px renders as a grey smudge — I
 * rendered it and looked. Nothing recovers detail at that size, so the only
 * useful move is to spend every pixel on the letterform and accept that the nib
 * is gone: the job of a 16px favicon is a recognisable silhouette, not fidelity.
 *
 * App icons keep the authored tile padding instead, because Android masks
 * icon-512 to a circle and cropping the mark there would be worse than a small
 * mark. That is the trade, and it is why these two numbers differ.
 */
const FAVICON_ARTWORK_FRACTION = 0.94;

/** A square dark tile with the mark centred, at the given pixel size. */
function tileSvg(size, fraction) {
  const art = fraction * size;
  const offset = (size - art) / 2;
  const scale = art / VIEW;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><rect width="${size}" height="${size}" fill="${GROUND}"/><g transform="translate(${offset} ${offset}) scale(${scale})"><path d="${MARK}" fill="${PAPER}" fill-rule="evenodd" clip-rule="evenodd"/></g></svg>`;
}

/* ------------------------------------------------------------------------- */
/* Rasterise                                                                  */
/* ------------------------------------------------------------------------- */

/**
 * Supersample 4x then downsample with lanczos3.
 *
 * The mark is a serif letterform with a hairline nib, and a single-pass render
 * at 16px turns that detail into mud. Rendering at 64 and resolving down keeps
 * the crossbar and the counter distinguishable.
 */
const SS = 4;

const TILES = [
  { name: "favicon-16x16.png", size: 16, fraction: FAVICON_ARTWORK_FRACTION },
  { name: "favicon-32x32.png", size: 32, fraction: FAVICON_ARTWORK_FRACTION },
  { name: "icon-192.png", size: 192, fraction: TILE_ARTWORK_FRACTION },
  { name: "icon-512.png", size: 512, fraction: TILE_ARTWORK_FRACTION },
];

for (const { name, size, fraction } of TILES) {
  await sharp(Buffer.from(tileSvg(size * SS, fraction)))
    .resize(size, size, { kernel: "lanczos3", fit: "fill" })
    .png({ compressionLevel: 9 })
    .toFile(join(PUBLIC, name));
  const inkPx = (INK.h / VIEW) * fraction * size;
  console.log(
    `  ${name.padEnd(20)} ${size}x${size}   ink ${inkPx.toFixed(1)}px tall`
  );
}

/* ------------------------------------------------------------------------- */
/* OG vector                                                                  */
/* ------------------------------------------------------------------------- */

/**
 * public/og.svg — the editable OG composition.
 *
 * Light ground, kept from the previous version: only the geometry changed here,
 * not the treatment. The mark is scaled so its INK stands 176px tall and is
 * positioned by its ink box rather than its viewBox, so the optical left edge
 * lines up with nothing depending on the transparent padding around it.
 *
 * NOTE: this file is not what the site serves. og:image points at
 * public/og-image.png, which is supplied artwork on a dark ground with no
 * tagline. This SVG keeps the tagline by request and therefore does not match
 * it. Do not assume rasterising this file reproduces the live preview image.
 */
const OG = { w: 1200, h: 630 };
const inkH = 176;
const ogScale = inkH / INK.h;

/*
 * Positioned by the INK box, not the viewBox, and vertically centred on the TEXT
 * block rather than on the canvas.
 *
 * Both matter. The mark carries ~7% transparent padding, so aligning by viewBox
 * would leave the mark's optical left edge short of the 96px margin. And the two
 * text lines sit above the canvas centre, so centring the mark on the canvas
 * instead of on them left it 17px low and visibly out of step with the wordmark.
 *
 * Text block: wordmark cap top (baseline 286 less capHeight 0.72em of 76px) down
 * to the tagline descender (baseline 344 plus roughly 8px).
 */
const TEXT_TOP = 286 - 76 * 0.72;
const TEXT_BOTTOM = 344 + 8;
const textCenter = (TEXT_TOP + TEXT_BOTTOM) / 2;

const ogX = 96 - INK.x * ogScale;
const ogY = textCenter - inkH / 2 - INK.y * ogScale;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${OG.w} ${OG.h}" width="${OG.w}" height="${OG.h}">
  <rect width="${OG.w}" height="${OG.h}" fill="${PAPER}"/>
  <g transform="translate(${ogX.toFixed(2)} ${ogY.toFixed(2)}) scale(${ogScale.toFixed(5)})">
    <path d="${MARK}" fill="${GROUND}" fill-rule="evenodd" clip-rule="evenodd"/>
  </g>
  <text x="340" y="286" font-family="Instrument Serif, Georgia, serif" font-size="76" fill="${GROUND}">Atlas Research Institute</text>
  <text x="340" y="344" font-family="Archivo, Helvetica, Arial, sans-serif" font-size="30" fill="${MUTED}">Student research groups in any field.</text>
</svg>
`;
writeFileSync(join(PUBLIC, "og.svg"), ogSvg);
console.log(`  ${"og.svg".padEnd(20)} ${OG.w}x${OG.h}`);
