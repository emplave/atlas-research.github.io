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

`src/components/AtlasMark.tsx` exports `AtlasMark` (mark alone) and
`AtlasLockup` (mark plus the wordmark, horizontal or stacked). **Nothing sits
beneath the wordmark** — a descriptor line there repeated "Research Institute"
twice. The
geometry is two fixed paths on a `0 0 170 160` viewBox — do not nudge them, the
counter is what makes the pair read as an A and it is already tight at 16px.

`public/favicon.svg`, `public/apple-touch-icon.png`, `public/og.svg` and
`public/og.png` carry the same geometry by hand. Change the mark and all four
need regenerating.

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
