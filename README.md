# Atlas Research Institute — website

Marketing site for the Atlas Research Institute founding cohort (Fall 2026).
Vite + React 18 + TypeScript + Tailwind CSS 3, framer-motion animation, cobe globe.

## Run locally

```bash
npm install
npm run dev        # http://localhost:5173
```

On Windows you can also double-click `dev.cmd`.

## Deploy on Vercel

1. Push this folder to a GitHub repo (see below).
2. In Vercel: **Add New → Project → Import** the repo.
3. Vercel auto-detects Vite. Defaults are correct:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Deploy. Done — no environment variables needed.

## Push to GitHub (one-time)

```bash
# if you use the GitHub CLI (install: winget install GitHub.cli, then: gh auth login)
gh repo create atlas-website --private --source . --push

# or with a repo you created on github.com:
git remote add origin https://github.com/<your-username>/atlas-website.git
git push -u origin main
```

## Before public launch — operator checklist

- **Dates** live in `src/lib/dates.ts` (single source of truth). Currently:
  applications open **July 21, 2026**, deadline **September 8, 2026**, program
  begins **week of October 5, 2026**. These print on the site — operate by
  them or change them.
- **Contact email** is a placeholder (`apply@atlasresearch.institute` — domain
  not registered). Replace in `src/lib/dates.ts` with a real address or wire
  the CTAs to a real application form.
- Claims discipline (see `../research/ATLAS_WEBSITE_BLUEPRINT.md`): no
  invented stats, exact Stanford phrasing, deadline urgency only while real.

## Structure

- `src/App.tsx` — section order (per the researched blueprint)
- `src/components/` — one file per section; `Reveal.tsx` is the shared
  scroll-entrance system
- `src/components/ui/` — 21st.dev-derived components (globe, container scroll),
  adapted to Atlas (real cohort cities, navy/cream/gold, reduced-motion support)
- `src/lib/dates.ts` — cohort dates + contact email
- `tailwind.config.ts` — the Atlas design tokens (Antigravity grammar × Atlas
  identity: navy ink, cream surface, gold accent, Playfair/Inter/JetBrains Mono)
