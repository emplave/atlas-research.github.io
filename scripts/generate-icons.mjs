/**
 * Generate every icon and the OG card from the brand source files.
 *
 *   node scripts/generate-icons.mjs
 *
 * TWO SOURCES OF TRUTH, both read at run time so nothing here restates them:
 *
 *   public/atlas-mark.svg                  the mark, for the icon tiles
 *   public/atlas-lockup-horizontal-white.svg   mark + wordmark, for the OG card
 *
 * The mark path is also copied verbatim into src/components/AtlasMark.tsx for
 * the on-page logo. If you change the mark, change that file, run this, and copy
 * the path across.
 *
 * Writes:
 *   public/favicon-16x16.png    16       dark tile
 *   public/favicon-32x32.png    32       dark tile
 *   public/icon-192.png        192       dark tile, maskable-safe
 *   public/icon-512.png        512       dark tile, maskable-safe
 *   public/og.svg             1200x630   dark ground, white lockup
 *   public/og-image.png       1200x630   rasterised from og.svg
 *
 * og.svg AND og-image.png ARE NOW THE SAME ARTWORK. og.svg is the editable
 * source and og-image.png is rasterised from it in the same run, so the vector
 * and the file the site actually serves cannot drift. They used to: og.svg
 * carried a tagline on a light ground while og-image.png was dark with none.
 *
 * Does NOT write, on purpose:
 *   favicon.svg, favicon.ico, apple-touch-icon.png  — supplied as brand assets
 *   public/atlas-*.{svg,png}                         — the source assets
 * Those are authored artwork, not derivatives. Overwriting them here would
 * quietly replace a designed file with a mechanically composed one.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const here = dirname(fileURLToPath(import.meta.url));
const PUBLIC = join(here, "..", "public");

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
/* Lockup source — read before the guard, which validates it                 */
/* ------------------------------------------------------------------------- */

const lockupSvg = readFileSync(
  join(PUBLIC, "atlas-lockup-horizontal-white.svg"),
  "utf8"
);

/** Everything inside the lockup's root <svg>, so its transforms come along. */
const lockupInner = /<svg[^>]*>([\s\S]*)<\/svg>/.exec(lockupSvg)?.[1]?.trim();
if (!lockupInner) {
  console.error(
    "Could not read the contents of public/atlas-lockup-horizontal-white.svg."
  );
  process.exit(1);
}

/**
 * The lockup's INK box inside its own 1277x367 viewBox.
 *
 * MEASURED, not taken from the viewBox, because the file has ~40 units of
 * padding on the left and top that would throw the centring off by 3% of the
 * canvas. Obtained by rendering the file at density 600 (10642px wide, so 0.12
 * viewBox units per pixel) and scanning for the ink bounds. Re-measure if the
 * lockup is redrawn — the guard immediately below fails loudly, before anything is
 * written, if these numbers stop matching the file.
 */
const LOCKUP_INK = { x: 40.079, y: 39.964, w: 1196.963, h: 287.071 };

/**
 * Lockup ink width as a fraction of the canvas.
 *
 * 0.6875 exactly, reverse-engineered from the supplied og-image.png rather than
 * chosen: its content measured 825px wide on a 1200px canvas, centred on both
 * axes to within half a pixel. Keeping that number means the regenerated card is
 * the same composition that was already approved.
 */
const OG_LOCKUP_FRACTION = 0.6875;

/* ------------------------------------------------------------------------- */
/* Guard — must run before the OG card is written                            */
/* ------------------------------------------------------------------------- */

/**
 * Fail loudly if LOCKUP_INK has drifted from the lockup file.
 *
 * RUNS BEFORE ANYTHING IS WRITTEN. The constant is measured, so a redrawn lockup
 * silently invalidates it and the OG card quietly goes off-centre. Checking first
 * costs one render and turns a subtle visual regression into an error message —
 * and means a stale constant cannot leave a wrong og-image.png on disk.
 */
{
  const probe = await sharp(
    Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1277 367" width="1277" height="367"><rect width="1277" height="367" fill="#000000"/>${lockupInner}</svg>`
    )
  )
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: pw, height: ph, channels: pc } = probe.info;
  let minx = pw, maxx = -1, miny = ph, maxy = -1;
  for (let y = 0; y < ph; y++) {
    for (let x = 0; x < pw; x++) {
      const i = (y * pw + x) * pc;
      if (probe.data[i] + probe.data[i + 1] + probe.data[i + 2] > 60) {
        if (x < minx) minx = x;
        if (x > maxx) maxx = x;
        if (y < miny) miny = y;
        if (y > maxy) maxy = y;
      }
    }
  }
  const got = { x: minx, y: miny, w: maxx - minx + 1, h: maxy - miny + 1 };
  // 2 units of slack: this probe renders at 1x, so it is coarser than the
  // density-600 measurement the constant came from.
  const off = ["x", "y", "w", "h"].filter(
    (k) => Math.abs(got[k] - LOCKUP_INK[k]) > 2
  );
  if (off.length > 0) {
    console.error(
      `\nLOCKUP_INK is stale on ${off.join(", ")}.\n` +
        `  constant: ${JSON.stringify(LOCKUP_INK)}\n` +
        `  measured: ${JSON.stringify(got)}\n` +
        `The lockup has been redrawn. Re-measure and update LOCKUP_INK, or the OG\n` +
        `card will sit off-centre.\n`
    );
    process.exit(1);
  }
  console.log(`  ${"lockup ink check".padEnd(20)} ok`);
}

/* ------------------------------------------------------------------------- */
/* OG card — vector, then raster from that same vector                        */
/* ------------------------------------------------------------------------- */

/**
 * public/og.svg — the editable OG composition, and the source of og-image.png.
 *
 * NO TEXT ELEMENTS. The wordmark comes from
 * public/atlas-lockup-horizontal-white.svg, which carries it as OUTLINED PATHS,
 * so rendering does not depend on a font being installed. That matters: an
 * earlier version of this file used <text font-family="Instrument Serif"> and
 * silently rasterised in Georgia on a machine that did not have the font. Do not
 * reintroduce live text here.
 *
 * NO TAGLINE. It was removed from the brand along with the old lockup.
 *
 * The whole lockup is nested verbatim, transforms and all, and scaled by an outer
 * group. Its own internal transforms are left untouched so there is nothing to
 * re-derive if the file is redrawn.
 */
const OG = { w: 1200, h: 630 };



const ogInkW = OG_LOCKUP_FRACTION * OG.w;
const ogScale = ogInkW / LOCKUP_INK.w;
const ogInkH = LOCKUP_INK.h * ogScale;
const ogX = (OG.w - ogInkW) / 2 - LOCKUP_INK.x * ogScale;
const ogY = (OG.h - ogInkH) / 2 - LOCKUP_INK.y * ogScale;

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${OG.w} ${OG.h}" width="${OG.w}" height="${OG.h}">
  <rect width="${OG.w}" height="${OG.h}" fill="${GROUND}"/>
  <g transform="translate(${ogX.toFixed(3)} ${ogY.toFixed(3)}) scale(${ogScale.toFixed(6)})">
    ${lockupInner}
  </g>
</svg>
`;
writeFileSync(join(PUBLIC, "og.svg"), ogSvg);
console.log(
  `  ${"og.svg".padEnd(20)} ${OG.w}x${OG.h}   lockup ink ${ogInkW.toFixed(0)}x${ogInkH.toFixed(0)}`
);

/*
 * og-image.png, rasterised FROM og.svg — not composed separately.
 *
 * This is the file og:image and twitter:image point at. Generating it from the
 * vector in the same run is the whole point of this section: the two cannot
 * disagree about the mark, the ground, or whether there is a tagline.
 *
 * density 96 renders the 1200-unit viewBox at 1600px, then it comes down to 1200
 * with lanczos3 — the outlined serif wordmark keeps its hairlines that way.
 */
const ogPng = await sharp(Buffer.from(ogSvg), { density: 96 })
  .resize(OG.w, OG.h, { kernel: "lanczos3", fit: "fill" })
  .flatten({ background: GROUND })
  .png({ compressionLevel: 9 })
  .toBuffer();
writeFileSync(join(PUBLIC, "og-image.png"), ogPng);
console.log(
  `  ${"og-image.png".padEnd(20)} ${OG.w}x${OG.h}   from og.svg, ${(ogPng.length / 1024).toFixed(1)}kB`
);
