# Chapters rebuild — Phase 3

Branch: `chapters-rebuild`. Prior commits: `548b701` (Phase 0), `f5c156c` (Phase 1),
`b3337f7` (Phase 2).

Verification: `npx tsc --noEmit` clean, `npx vite build` succeeds, 11/11 directory behavior
checks pass, all 8 routes render.

---

## Cleanups

### 1. `alert` token — `#C4553D`

Added to `tailwind.config.ts` with the usage rule in the comment: form errors and
destructive states only. The two form error messages in `Partners.tsx` and `Chapters.tsx`
now use `text-alert`, replacing the brass-left-border workaround from Phase 2.

Deliberate call in `StatusChip`: **`Archived` is muted, not alert.** A dissolved group is
inactive, not an error, and widening `alert` to mean "bad status" is exactly how a
single-purpose token erodes.

### 2. `logo-plate` token — `#FFFFFF`

The three partner logo chips in `Hero.tsx` now use `bg-logo-plate` instead of raw
`bg-white`. There is no raw color left anywhere in `src/`. The token comment states it is
the only white in the system and has exactly one use.

### 3. `dates.ts` — cohort running, no expired deadline

`deadline` and `programStart` are **removed as fields**, not just blanked, so nothing can
render a stale date by reaching for them:

```ts
export const DATES = {
  status: "cohort-running" as const,
  cohortState: "The current cohort is underway",
  waitlist: "Join the waitlist for the next cohort",
  review: "rolling — decisions within days of submission",
  nextCycle: "Next cohort dates are announced to the waitlist first",
} as const;
```

All four consumers were rewritten: `ApplyBox` (headline is now the waitlist CTA, button
reads "Join the waitlist"), `Closing` (×3 references), and the `Faq` selectivity answer,
which had asserted "Applications are open now, due July 24, 2026". Grepped clean — no
"July 24", "August 3", "deadline", or "applications are open" anywhere in `src/`.

---

## Phase 3 — the directory

Four new files under `src/components/chapters/` plus a rebuilt page.

### `StatusChip.tsx`

Maps each `Status` to its own treatment. Only `Recruiting` gets brass — it is the only
status carrying an action — and it alone gets a dot. Everything else is muted, because a
status chip is information, not an accent. Uses `rounded-full`, which the radius rule
permits for small status chips.

### `ChapterCard.tsx`

Contents in the specified order: field tag, status chip, project title, `oneLine`, then a
definition list for lead / setting+location / members, then a footer row with "View brief"
and the conditional Apply.

The Apply gate reads from the data layer rather than reimplementing the rule:

```tsx
const applyable = canApply(group);
const chapterOpening = findOpening("chapter-leader");
const formPending = !chapterOpening || isFormPending(chapterOpening);
```

The URL comes from `openings.ts` and is never hardcoded — verified by grep, the only
`forms.gle` string in `src/` is in `data/openings.ts`. If that opening ever loses its
`formUrl`, the card renders a disabled "Opening soon" rather than a dead link.

Visual spec as given: `bg-panel`, `border-line`, `rounded-card` (10px), Spectral 400 title
via `font-display`, Inter body, `text-muted` secondary, brass only on the "View brief" link
and the Apply button. Hover is a border shift to `brass/40`. No entrance animation — no
`Reveal` wrapper anywhere in the directory.

### `DirectoryFilters.tsx`

Owns the filter state type, the empty state, and the `isFiltered` predicate, so the page
does not hand-roll them.

**`Archived` is deliberately not in the status dropdown.** It is reachable only through the
"Include archived" checkbox, off by default. Putting it in the dropdown would let a stray
selection fill the directory with dead listings — the failure mode this design is avoiding.

Count is live and `aria-live="polite"`: "Showing 5 of 5 groups". "Reset filters" appears
only when something is actually narrowing the view.

### `pages/Chapters.tsx`

Rebuilt from scratch. The old page was a chapter-registration form with hardcoded marketing
copy; it is now a directory rendered entirely from `src/data/chapters.ts`.

Sort is newest-first by `startedAt`. Search matches across project title, `oneLine`, and
lead name. Archive scope is computed before the other filters so the "of N" denominator is
honest — it reflects what is reachable, not the raw array length.

Empty state never renders an empty grid: it states plainly that nothing matched and offers
a reset. It distinguishes "no groups match those filters" from "the directory is empty",
since those need different responses.

The "Start a Chapter" CTA closes the loop for someone who finds no group worth joining. It
pulls its `area` and `oneLine` from the Chapter Leader opening and uses the same
`isFormPending` guard as the cards.

---

## Verification

`npx tsc --noEmit` clean. `npx vite build` succeeds — 21.01 kB CSS, 395 kB JS.

Directory behavior, asserted against the data layer rather than hardcoded numbers, so the
checks stay valid when the placeholder groups are replaced:

```
PASS  archived group absent from default view  (1 archived: Archived)
PASS  all non-archived groups rendered  (5 visible)
PASS  count reads 'Showing N of N' with archived excluded
PASS  Apply action count equals Recruiting count  (found 2, expected 2)
PASS  Apply points at the Chapter Leader form from openings.ts
PASS  no hardcoded forms.gle URL outside openings.ts
PASS  Completed and Full render without Apply  (In Progress,Full,Completed)
PASS  default sort is newest first by startedAt
PASS  'Start a chapter' CTA present
PASS  no empty grid rendered
PASS  every status chip label present for visible groups

all 11 checks passed
```

All 8 routes still render, `/chapters` now at 15159b:

```
/                                          mode=dark   32669b legal=y email=y
/chapters                                  mode=dark   15159b legal=y email=y
/fellowship                                mode=dark    3204b legal=y email=y
/apply                                     mode=dark    3201b legal=y email=y
/journal                                   mode=dark    7293b legal=y email=y
/partners                                  mode=dark    6343b legal=y email=y
/chapters/placeholder-model-card-review    mode=light   2982b legal=y email=y
/definitely-not-a-page                     mode=dark    2982b legal=y email=y
```

Both smoke harnesses were temporary and are not committed.

---

## One content fix outside stated scope

The banned-string sweep caught **two live "Grades 9–12" claims in `Hero.tsx`** — the exact
string the eligibility rule says must never appear. Fixed:

- The kicker read "A for-youth nonprofit · Global education access · Grades 9–12" → now
  "A nonprofit · Global Research Access · Secondary and university". This also removed an
  education-access framing and aligned the phrase with the brand tagline.
- The body read "Atlas trains **high school students** to study **education inequality**…
  open to **grades 9–12**" — three separate rule violations in one sentence (eligibility
  narrowed twice, plus the education framing). Now: "Atlas trains students to investigate a
  question in their own local context, in any discipline… open to secondary and university
  students worldwide."

Only the eligibility and framing claims were touched. The full homepage rewrite is a later
phase and I did not start it.

---

## Open items for the next phase

- **`/chapters/:slug` has no route yet**, so every "View brief" link currently lands on the
  404. The `theme.ts` mode map already resolves those paths to light reading, and the smoke
  test confirms it — the brief pages themselves are the missing piece.
- **`Instrument.tsx` and `Outcomes.tsx` remain education-framed**, as does the rest of the
  `Faq` copy and the `Publish`/journal page. Pending the topic-agnostic rewrite.
- **`Partners.tsx` still falls back to mailto** — `FORM_ENDPOINT` is still `null` and Q2's
  fix is not done.
- **Root-level duplicate files** (`about.html`, `apply.html`, `index.html` siblings, etc.)
  are still present; Q6 says delete them and keep `public/` only.
- **The old chapter-registration form is gone** with the `Chapters.tsx` rebuild. That was
  intentional — chapter applications now go through the Chapter Leader Google Form — but it
  means `submitApplication("Chapter registration", …)` no longer has a caller.
