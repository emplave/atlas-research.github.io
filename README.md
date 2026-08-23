# Atlas Research Institute — website

Vite + React 18 + TypeScript + Tailwind CSS 3. No animation library, no runtime
dependencies beyond React Router and two class utilities.

The primary programme is **student research groups**. The Fellowship is a
separate, secondary programme whose applications are currently closed.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build
```

On Windows you can also double-click `dev.cmd`.

## Deploy on Vercel

Vercel auto-detects Vite. Build command `npm run build`, output directory
`dist`, no environment variables.

## Design system

Light mode only, and **pure monochrome — there is no accent colour.** Tokens live
in `tailwind.config.ts`:

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

Rules that are easy to break by accident:

- **Never colour a link.** Links are ink with a 1px underline that thickens to
  2px on hover — the `.link` utility. There is no link colour to reach for.
- **If a design problem seems to need a colour, it needs size, spacing, or a
  rule instead.** `alert` is the only non-grey token and it is form errors only.
- **Instrument Serif has ONE weight (400).** There is no bold cut. Where a
  heavier heading is wanted, use size and spacing — never `font-weight`.
- **Ink full-bleed bands are rationed.** On the homepage: the proof band, the
  closing CTA, and the statement panel. Bands carry `on-ink` so headings render
  paper instead of ink.
- **Primary buttons** are `bg-ink` + paper text. **Secondary** are paper with a
  `line` border and ink text.
- Type scale utilities: `.type-hero`, `.type-section`, `.type-panel`,
  `.type-card`, `.type-body` (fixed 17px). The contrast between the display
  sizes and the fixed body is the effect.
- Radii: `rounded-card` (10px) for cards, `rounded-control` (6px) for controls.
- **Hover states only.** No scroll-entrance or staggered animation. The only
  motion is the globe's rotation and the citation network's drift, both static
  under `prefers-reduced-motion`.

### Brand mark

**`public/atlas-mark.svg` is the source of truth for the mark.** One path on a
`0 0 1000 1000` viewBox — a serif A whose crossbar resolves into a pen nib. Edit
that file, never a copy of it.

`src/components/AtlasMark.tsx` exports `AtlasMark` (mark alone) and
`AtlasLockup` (mark plus the wordmark, horizontal or stacked). **Nothing sits
beneath the wordmark** — a descriptor line there repeated "Research Institute"
twice, and the tagline that used to sit under the wordmark in the artwork has
been removed from the brand. The component copies the path from
`public/atlas-mark.svg` verbatim; do not hand-edit the numbers.

Legibility floor is **24px**, and the nav and footer both sit exactly on it. At
24px the counter and the nib still read; at 16px the nib closes into the
crossbar. Below 24px use a tile (`public/atlas-mark-tile.svg`), which is what the
favicons do.

To change the mark: edit `public/atlas-mark.svg`, run
`node scripts/generate-icons.mjs`, then copy the new path into the `MARK`
constant in `src/components/AtlasMark.tsx`. The generator needs `sharp`, which is
a devDependency, so it just runs.

It reads two sources and writes six files:

| Source | Writes |
| --- | --- |
| `atlas-mark.svg` | `favicon-16x16.png`, `favicon-32x32.png`, `icon-192.png`, `icon-512.png` |
| `atlas-lockup-horizontal-white.svg` | `og.svg`, then `og-image.png` **from that same `og.svg`** |

**`og.svg` is the editable source of `og-image.png`.** The raster is produced
from the vector in the same run, so the file the site serves cannot disagree with
the file you edit. It used to: `og.svg` carried a tagline on a light ground while
`og-image.png` was dark with none.

`og.svg` contains **no `<text>` elements** — the wordmark comes from the lockup as
outlined paths, so rendering never depends on a font being installed. An earlier
version used live text and silently rasterised in Georgia on a machine without
Instrument Serif. Do not reintroduce live text there.

The generator deliberately does **not** overwrite `favicon.svg`, `favicon.ico`,
`apple-touch-icon.png` or the `public/atlas-*` files — those are authored
artwork, not derivatives, and have to be replaced by hand.

It also validates the lockup's measured ink box before writing anything, and
fails with the correct numbers if the lockup has been redrawn, rather than
quietly producing an off-centre card.

## Data layer — edit these, never a page

Every list on the site is driven by a file in `src/data/`. No page or component
hardcodes a group, role, event, or publication.

| File | Owns |
| --- | --- |
| `src/data/research-groups.ts` | research groups + the `Field` union |
| `src/data/openings.ts` | every role, and whether it is open |
| `src/data/events.ts` | every event |
| `src/data/publications.ts` | journal working papers and articles |
| `src/lib/stats.ts` | every displayed number |
| `src/lib/dates.ts` | cohort state, contact email, form endpoints |

Behaviour that is automatic, so you never edit a page for it:

- An **opening** whose `deadline` has passed renders as closed
  (`effectiveStatus`).
- An **event** whose `date` has passed moves from upcoming to past
  (`upcomingEvents` / `pastEvents`).
- An **archived** research group drops out of the directory
  (`isVisibleByDefault`); it is reachable only via the "Include archived"
  toggle.
- A null `formUrl` / `registrationUrl` / `fullTextUrl` renders a **disabled**
  control, never a dead link.

### Stats are off until you fill them in

Every value in `src/lib/stats.ts` is `null`, so the stat band renders nothing.
Set one to a real number and the band appears — no other file changes. Do not
put placeholder numbers or "coming soon" in a stat slot.

### Images

`image` is `null` on every seeded record, which renders a designed typographic
fallback rather than an empty box. See `public/images/README.md` for dimensions
and rules before adding any.

## Current state — read before editing copy

- **The Fellowship cohort is underway and applications are closed.** The only
  action is the waitlist. `src/lib/dates.ts` has no `deadline` field on purpose:
  a past date reads as a dead programme.
- `public/apply.html` is a **noindex signpost** kept because old emails link to
  it. The live Apps Script waitlist backend is `WAITLIST_ENDPOINT` in
  `src/lib/dates.ts` — do not delete it, and do not re-inline it in the HTML.
- `FORM_ENDPOINT` is `null`, so the Partners form renders **visibly disabled**.
  There is no mailto fallback anywhere.
- Placeholder seed data is marked `PLACEHOLDER` in every data file and must be
  replaced before launch.

## Copy rules

- Topic agnostic. A research group works in any of eight fields. No
  education-inequality or education-access framing.
- **Publication is never guaranteed.** Completed work *may be submitted*;
  review decides. Working papers are never described as peer reviewed.
- Named institutions are always "fellows learn from researchers at…", never
  "partnered with".
- Lumiere is a **discount** partner, never scholarships.
- Never write "ISSN", "501(c)(3)", "tax deductible", an EIN, a street address,
  or an individual's name.
- Research groups are student-led; **Atlas itself is not described as
  student-run** at the organisational level.
- Eligibility is prose, not a grade range. Never "9-12".
- Contact is `admin@atlas-research.org` everywhere.
- Banned words: empower, foster, robust, holistic, comprehensive, leverage,
  unlock, cutting-edge, seamless, journey, passionate, dedicated to.

## Routes

`/` · `/research-groups` · `/research-groups/:slug` · `/events` · `/journal` ·
`/journal/:slug` · `/get-involved` · `/fellowship` · `/partners` · `/privacy`

`/chapters`, `/chapters/:slug`, and `/apply` redirect to their current
equivalents so older links keep working.
