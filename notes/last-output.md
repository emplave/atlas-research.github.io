# Chapters rebuild — Phases 4 and 5

Branch: `chapters-rebuild`. Prior commits: `548b701` (P0), `f5c156c` (P1), `b3337f7` (P2),
`1ef922e` (P3), `f97a993` (P4).

Verification: `tsc --noEmit` clean, `vite build` succeeds, `npm run dev` starts clean with
no warnings, 32/32 checks pass.

---

# Phase 4 — research group briefs (committed separately, `f97a993`)

Phase 4 was not complete, so it was built and committed on its own before Phase 5.

**`Prose.tsx`** owns long-form reading typography so the two long-form surfaces — briefs and
journal articles — cannot drift apart. Measure caps near 68 characters.
`ProseParagraphs` renders blank-line-separated text as paragraphs, keeping markup out of the
data layer.

**`ResearchGroupBrief`** renders abstract, methods, and milestones as prose with a sidebar
carrying lead, members, setting, output type, start date, and review status. The review
labels are written so none promises or schedules a published outcome, and a closing note
states plainly that submission does not guarantee publication. `StatusChip` gained a light
mode rather than a second component.

Every "View brief" link had been landing on the 404; the route now renders 7792b.

---

# Phase 5

## Global rename — Chapter → Research Group

Files renamed via `git mv` so history follows: `data/chapters.ts` →
`data/research-groups.ts`, `components/chapters/` → `components/research-groups/`,
`ChapterCard` → `ResearchGroupCard`, `pages/Chapters.tsx` → `ResearchGroups.tsx`,
`ChapterBrief.tsx` → `ResearchGroupBrief.tsx`.

Routes are now `/research-groups` and `/research-groups/:slug`, and `theme.ts`'s
light-reading prefix moved with them. **Redirects added** for `/chapters`,
`/chapters/:slug` (slug-preserving, via a small `LegacyChapterRedirect`), and `/apply` →
`/fellowship`, so no existing link breaks.

**Internal identifiers deliberately kept:** the `category: "chapter"` value stays as
instructed, and so does the `slug: "chapter-leader"` — both are internal ids, not display
copy. A new `CATEGORY_LABEL` map supplies what readers actually see:

```ts
export const CATEGORY_LABEL: Record<OpeningCategory, string> = {
  chapter: "Research Group",
  team: "Atlas Team",
};
```

A note in the file explains why the stored value and the label diverge, so the next person
to open it does not "fix" the mismatch.

## Accent change — no warm tone anywhere

`brass` and `brass-hi` are deleted. Replacements:

| Token | Value | Job |
| --- | --- | --- |
| `accent` | `#6B8CAE` | **links only** |
| `accent-hi` | `#83A3C4` | link hover |
| `text-hi` | `#FFFFFF` | primary button hover only |

All 44 brass sites were migrated by role, not by find-and-replace:

- **Primary buttons** → `bg-text text-ground hover:bg-text-hi` (cream with ground labels,
  lifting to white). Verified: no `bg-accent` on any button.
- **Links** → `text-accent hover:text-accent-hi`.
- **Eyebrows and meta labels** → `muted`.
- **Status chips** → Recruiting `accent`, everything else `muted`.
- **Logo mark** → cream (`bg-text text-ground`).
- **Card and control hover borders** → `muted`, since accent is links only.
- **Selection highlight** → neutral (`text/25` on dark, `ink/15` on light), previously brass.
- **Form-error hints** that were brass → `alert`.

`text-hi` needed adding: the spec called for a `#FFFFFF` button hover, and reusing
`logo-plate` for it would have overloaded a single-purpose token.

## Tagline

"Global Research Access" → "Student Research Institute" everywhere, including the logo
lockup and `index.html`. Page metadata was also rewritten — the title had become
"Atlas Research Institute — Student Research Institute", which read as a stutter, and the
description still said "network of student-led Chapters".

## Homepage restructure

`Landing.tsx` now renders exactly the approved order: hero → what a research group is → how
it works → featured groups → what Atlas provides → events → fellowship strip → partners →
FAQ → closing.

- **Hero** leads with research groups. Primary CTA "Start a research group" (reads its URL
  from the Research Group Leader opening), secondary "Browse research groups". The
  "Apply to the Fellowship" CTA is gone.
- **How it works** step four states that completed work *may* be submitted and that review
  decides — never scheduled publication.
- **Featured groups** pulls three from the data file through the same
  `isVisibleByDefault()` rule the directory uses, so an archived group can never be
  featured.
- **Fellowship strip** is one compact secondary section stating the cohort is underway,
  applications are closed, and the only action is the waitlist.
- **Closing** points at starting a group, not the fellowship.

**Deleted as instructed:** `AccessCheck`, `Instrument`, `Thesis`, `WhoItsFor`, `Pathways`.

**Deleted beyond the list — flagging explicitly:** `WorldSection`, `Sequence`, and
`ApplyBox`. None appears in the approved nine-section order, and all three were
fellowship- or education-framed (`ApplyBox` was the fellowship apply CTA; `Sequence` was
superseded by the new How it works). Leaving them would have meant unused
components carrying stale copy. Say the word if any should come back.
`Publish.tsx` was also removed, replaced by `Journal.tsx`.

## Fellowship page

Rebuilt. States the cohort is underway and applications are closed; the only action is the
waitlist, which posts directly to `WAITLIST_ENDPOINT` — the same live Apps Script backend
`/apply.html` uses. **No path to `apply.html` exists anywhere on the site** (asserted in the
checks). The page also points readers at research groups as the thing that *is* open.

**Outcomes rewritten.** The previous copy was inaccurate on two counts: it claimed
"Co-author credit — your name on a real cross-national dataset", and it asserted journal
submission as accomplished fact ("Your policy brief **is submitted to** the International
Journal of High School Research"). Replaced with what is true: research methodology
training, structured mentor feedback, guest sessions with university researchers, a
completed literature review or policy brief, and **eligibility to submit** for review with
an explicit no-guarantee line.

## Partners

Lumiere is removed from the publishing context entirely — it is not a journal. The homepage
partners section now separates two categories that must not merge:

- **Where completed work may be submitted** — the Atlas Journal and IJHSR.
- **Programme partners** — Lumiere (discounts, never scholarships) and Curieux.

Institutions remain phrased "fellows learn from researchers at… USC, the University of
Melbourne, and Stanford".

One judgment call: you said the publish strip is "IJHSR only" but also "Curieux stays".
Since Curieux is a publication rather than a discount partner, I kept it under programme
partners described as partnering "on student research writing" rather than inventing a
publishing claim for it. Easy to move if you meant something else.

## FAQ

Rewritten for research groups, covering all eight required topics: what a group is, who can
start one, prior experience (not needed), fields (any), time commitment, what happens to
completed work, whether publication is guaranteed (**no — review decides**, with the
criteria and the revision/rejection outcomes stated), and what Atlas provides. Exactly one
question covers the fellowship, marked as a separate programme with applications closed.

## Events

**`src/data/events.ts`** is the single source of truth. Events reclassify themselves:

```ts
export function effectiveEventStatus(event, now = new Date()): EventStatus {
  if (event.status === "cancelled") return "cancelled";  // sticky, never reclassified
  return isPast(event, now) ? "past" : "upcoming";
}
```

`upcomingEvents()` / `pastEvents()` split by date, so a past event moves with no file edit.
`/events` is dark chrome, upcoming first then past, and past sessions stay visible as a
dated record. Added to nav and footer. Two PLACEHOLDER events seeded with
`speakerName` and `speakerAffiliation` **null** — no researcher is named until they have
actually agreed to appear.

## Journal

**`src/data/publications.ts`** with the two-track model. The file header states the rule
directly: a working paper must never be labelled peer reviewed or presented as though it
carries the same standing.

- **Track 1, Atlas Working Papers** — founding contributions, published without external
  peer review, labelled "Not externally peer reviewed" with a line explaining they are
  published while the first open call is underway. Each entry links to the full paper;
  `isFullTextPending()` renders "Full text coming soon" rather than a dead link.
- **Track 2, Peer-Reviewed Articles** — empty. Instead of placeholders, the page states the
  first reviewed issue has not been published and describes the three-step process, six
  review criteria, and what revision and rejection actually mean.

Article pages (`/journal/:slug`) use light reading mode and the same `Prose` component as
the briefs. The standing is restated **on the article itself** — a reader arriving from a
direct link, with no memory of which list it came from, still gets told whether it was
reviewed.

One placeholder working paper seeded, authored to "Atlas Research Institute" rather than an
invented person. No ISSN, no metrics, no impact factor.

---

## Verification

```
PASS  /                                              mode=dark   34279b
PASS  /research-groups                               mode=dark   15518b
PASS  /research-groups/placeholder-model-card-review mode=light   7792b
PASS  /events                                        mode=dark    5919b
PASS  /journal                                       mode=dark    9319b
PASS  /journal/placeholder-working-paper             mode=light   5987b
PASS  /fellowship                                    mode=dark   10127b
PASS  /partners                                      mode=dark    6678b
PASS  /nope                                          mode=dark    3275b
```

Every page was scanned for `ISSN`, `501(c)`, `tax deductible`, `info@`, `scholarship`,
`9–12`, `apply.html`, and `brass`, and asserted to carry the yourbuddy Inc. line, the
contact address, and the tagline. Plus 23 behavioural assertions — all passed:

```
PASS  homepage never links to apply.html
PASS  homepage has no 'Apply to the Fellowship' CTA
PASS  fellowship page never links to apply.html
PASS  outcomes no longer claim co-author credit
PASS  outcomes no longer assert journal submission as fact
PASS  journal separates working papers from peer reviewed
PASS  journal states working papers not peer reviewed
PASS  article page states working paper standing
PASS  publish strip is IJHSR only (no Lumiere as journal)
PASS  Lumiere framed as discount, not scholarship
PASS  institutions phrased as 'learn from researchers at'
PASS  brief page uses light mode  ·  directory uses dark mode
…
all checks passed
```

`npm run dev` starts clean — 200 on `/` and `/research-groups`, no errors or warnings.
(First run reported port 5173 in use and fell back to 5174, so the check was rerun on a
free port to be sure the 200 came from this build.)

---

## Open items

- **`FORM_ENDPOINT` is still `null`**, so `Partners.tsx` still falls back to mailto. Q2's
  fix — render the form visibly disabled instead — is still outstanding. The Fellowship
  waitlist bypasses this and posts to `WAITLIST_ENDPOINT` directly.
- **Root-level duplicate files** (`about.html`, `apply.html`, `index.html` siblings) are
  still present; Q6 says delete them and keep `public/` only.
- **`submitApplication()` in `forms.tsx`** now has one caller (Partners) after the research
  group registration form was replaced by the Google Form.
- **`ELIGIBILITY_LABEL` / `ELIGIBILITY_LONG` in `stats.ts` are unused** — the new copy
  spells eligibility out inline. Worth wiring up or removing so the constants do not drift
  from the prose.
- **`public/apply.html` still exists and still works.** Nothing links to it now, but it is
  reachable by direct URL and its copy has not been reviewed against the current rules.
