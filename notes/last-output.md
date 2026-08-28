# Homepage groups grid + the semester copy fix

Commit `671f1f4` on `main`, pushed. Build (`tsc -b && vite build`) passes.

---

## 1. Homepage "Groups on Atlas" section

### Cap of 6 — already in place, not a change

The section was **not** unlimited. `FeaturedGroups.tsx` already ended its
selection with `.slice(0, 6)`, committed before this task. Nothing needed doing
and nothing was changed about the count. I left the cap at 6 and documented why
6 specifically: the lead card spans two columns of a three-column row, so six
cards fill exactly two rows with no ragged gap.

### Sort — changed

Previously the homepage called the shared `sortForListing()`, which sorts on two
keys: `recruitingOpen` first, then `startedAt` descending. No member-count key.

Added `sortForFeatured()` to `src/data/research-groups.ts` and pointed the
homepage at it:

1. `canApply` (the `RecruitingOpen === "yes"` predicate) — open groups first
2. `memberCount` descending
3. `startedAt` descending

`sortForListing()` is untouched and `/research-groups` still calls it, so the
index page ordering is byte-for-byte what it was.

The two functions were deliberately one function before — the doc comment said
so — because two views of the same data drift. I split them anyway because the
homepage slices and the index does not, which makes them different questions:
the index decides what leads, the homepage decides what a reader never sees.
Both functions now carry a note pointing at the other, and specifically flagging
that the recruiting split is the part that must never diverge while the
tiebreaks below it may.

**One caveat you should know about, pre-existing and not introduced here:** the
`startedAt` tiebreak is currently arbitrary. The Sheet holds StartedAt as US
`M/D/YYYY` ("9/1/2026") rather than ISO, and the comparison is a string compare,
so "11/1/2026" sorts before "8/10/2026". This was already documented in
`sortForListing`. It matters *less* in the new function — it is the third key of
three rather than the second of two — but it is still wrong. The fix is editing
those Sheet cells to `2026-09-01` form; a parser in code would have to guess
between US and international convention on an ambiguous value.

### "See all research groups" link — added

A plain underlined text link below the grid, using the existing `.link` utility
class, pointing at `/research-groups`.

Deliberate choices, all documented in the file:

- **Text, not a button.** A second button would read as a second offer against
  the hero CTA and section 01's CTA.
- **Below the grid, not in the `Section` `action` slot.** The action slot renders
  on the heading line, where the eye lands first. Under the grid it is reached
  only after a reader runs out of cards.
- **Hidden while loading**, so it does not appear under a grid of skeletons and
  offer to show "all" of nothing.

The primary CTA is unchanged everywhere.

---

## 2. The "semester" sweep

`grep -rn -i semester` over the repo (excluding `node_modules` and `.git`)
found **13 hits across 8 files**. All 13 are fixed.

| File | Line | Was | Now |
|---|---|---|---|
| `src/components/Hero.tsx` | 39 | "…and finish a paper in one semester." | "…and finish a paper." |
| `src/pages/ResearchGroups.tsx` | 87 | "…finish a paper in one semester. At a school…" | "…finish a paper. At a school…" |
| `src/components/Closing.tsx` | 17 | "Lead an Atlas research group this semester." | "Lead an Atlas research group." |
| `src/data/value-props.ts` | 110 | "Two to four hours a week. About a semester to finish a paper." | "Two to four hours a week. Groups run for as long as the work requires." |
| `src/data/value-props.ts` | 98 | Comment mandating "ABOUT A SEMESTER", NOT "ONE SEMESTER" | Rewritten to forbid any fixed length |
| `src/data/openings.ts` | 129 | "Groups run three or more members over one semester; three is a minimum, not a cap." | "Groups run with three or more members; three is a minimum, not a cap." |
| `src/lib/seo.ts` | 41 | `SITE_DESCRIPTION`: "…one research question, one semester. Free…" | "…one research question. Free…" |
| `src/lib/seo.ts` | 63 | `/research-groups` description, same clause | same removal |
| `index.html` | 17, 32, 41, 105 | meta description, OG, Twitter, JSON-LD — all the same string | same removal ×4 |
| `public/site.webmanifest` | 4 | same string | same removal |

Three notes on the judgement calls:

**The `value-props.ts` comment was a rule, not prose.** It read: *"ABOUT A
SEMESTER", NOT "ONE SEMESTER". No Atlas group has finished a paper yet, so a hard
number is a promise nobody can check.* That comment would have re-created the
problem the next time someone edited the line — it forbade only the tight
version. It now says no length belongs there at all: not a semester, not a hedged
semester, not a range of weeks.

**The requirements line lost its second fact, not just a word.** "Two to four
hours a week. About a semester to finish a paper." was deliberately two facts
merged into one bullet — the file comment says the weekly cost and the timeline
are one question. Rather than leave a half-bullet I replaced the timeline with
your own framing: "Groups run for as long as the work requires."

**The four `index.html` hits are one string in four places** — `<meta
name="description">`, `og:description`, `twitter:description`, and the JSON-LD
`description` — which duplicate `SITE_DESCRIPTION` in `seo.ts`. All five copies
are now identical again. The new description is 124 characters, comfortably
under the 155 the file's own comment requires.

I also grepped for adjacent fixed-term phrasing that would survive a
"semester"-only sweep — `one term`, `per term`, `academic year`, `N weeks`,
`few months`. **No hits.** `public/llms.txt` was clean too.

---

## Two things I want to flag

**1. `Closing.tsx` now duplicates its own button.** The heading reads "Lead an
Atlas research group." and the button directly beneath it reads "Lead an Atlas
research group". Removing "this semester" is what caused this — it was the only
thing distinguishing them. I made the minimal edit you asked for rather than
rewriting the heading, because picking new closing-band copy is a call for you,
not a mechanical consequence of dropping the term. Worth a second look. The
comment style in this repo is emphatic that a heading should not restate the
control below it.

**2. `src/data/openings.ts` has `updatedAt: "2026-08-17"` on the Principal
Researcher opening,** whose `description` I edited. I did not bump it — I do not
know whether that field is meant to track copy edits or substantive changes to
the role, and it may be rendered.

## Out of scope, untouched

- `/research-groups` ordering and group count — unchanged, still `sortForListing`
  over the full unsliced list.
- The primary CTA — unchanged in copy, link, styling, and placement.
- `public/atlas-linkedin-cover-4200x700.png` — untracked in your working tree
  before I started, unrelated to this work, left uncommitted.
