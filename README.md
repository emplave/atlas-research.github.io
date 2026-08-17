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

Light mode only. There is no dark mode and no per-route polarity.

Tokens live in `tailwind.config.ts`:

| Token | Value | Job |
| --- | --- | --- |
| `paper` | `#FAFAF9` | page background |
| `surface` | `#FFFFFF` | cards, raised surfaces |
| `ink` | `#16191D` | primary text |
| `muted` | `#5A6169` | secondary text |
| `line` | `#E2E0DA` | hairline borders |
| `navy` | `#1C3F5E` | headings, primary buttons, section bands |
| `navy-hi` | `#2A5A82` | hover |
| `accent` | `#1C3F5E` | links |
| `alert` | `#B3402F` | errors only |

Rules that are easy to break by accident:

- **Navy full-bleed bands appear at most twice per page.** On the homepage they
  are the proof band and the closing CTA. A third turns a light page striped.
  Bands carry the `on-navy` class so headings render white instead of navy.
- **Spectral (`font-display`) never exceeds weight 500.** A base rule pins
  `h1`–`h4` to 400.
- **Primary buttons** are `bg-navy` + white text. **Secondary** are white with a
  navy border and navy text. Links are navy and underlined.
- Radii: `rounded-card` (10px) for cards, `rounded-control` (6px) for controls.
- **Hover states only.** No scroll-entrance or staggered animation.

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
- Logo tagline is "Student Research Institute".
- Banned words: empower, foster, robust, holistic, comprehensive, leverage,
  unlock, cutting-edge, seamless, journey, passionate, dedicated to.

## Routes

`/` · `/research-groups` · `/research-groups/:slug` · `/events` · `/journal` ·
`/journal/:slug` · `/fellowship` · `/partners`

`/chapters`, `/chapters/:slug`, and `/apply` redirect to their current
equivalents so older links keep working.
