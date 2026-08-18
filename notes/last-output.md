# Phases 11 and 12

Branch: `chapters-rebuild`. Phase 11 committed as `cd417d8`; Phase 12 follows as its own
commit, keeping the one-commit-per-phase convention. Phase 12 arrived mid-turn, so Phase 11
was finished and committed first rather than merged into one change.

Verification: `tsc --noEmit` clean, `vite build` succeeds, `npm run dev` starts clean (200 on
all nine routes, no warnings), **36/36 render checks + 31/31 parser checks pass**.

---

# Phase 11

## 1. Lockup descriptor removed

`AtlasLockup` is now the mark plus the wordmark, nothing beneath, with a comment saying not to
reintroduce a descriptor. Removed as a standalone tagline from `index.html`, the README's copy
rules, **and `public/og.svg`**, which still had "STUDENT RESEARCH INSTITUTE" as a footer line
under a rule — that one wasn't obvious from the brief but was the same repetition.

## 2. Role renames

Fellowship Mentor → **Youth Research TA** (`youth-research-ta`), Logistics Analyst →
**Logistics Analyst Intern** (`logistics-analyst-intern`).

**No redirects were needed.** I checked before assuming: role slugs appear only as React keys
in `GetInvolved.tsx`. They are not URLs, not anchors, and nothing external addresses them, so
there was no link to break.

**One thing I did not rename:** "Research Group Leader" kept its title. Your rename list named
exactly two roles, and the `RESEARCH GROUP LEAD` heading in the copy block reads as a label
for which role the copy belongs to rather than a third rename. Say the word if you meant the
title to change to "Research Group Lead" too — it's a two-line edit.

## 3. Role copy replaced verbatim

All six roles: `oneLine`, `description`, `responsibilities`, `lookingFor`. Nothing rewritten,
expanded, or padded; no closing lines added; short bullets left short.

Applied by locating each role's object literal by slug and substituting those four fields
only, so `selectivity`, `commitment`, `regions`, `formUrl` and `formNote` were untouched and
no neighbouring data moved. `updatedAt` stamped to 2026-08-17. Scanned the result for the
banned adjectives — none present.

Verified verbatim by asserting exact substrings from each block render on the page, including
"Sessions need scheduling. Forms need chasing. Submissions go missing." and "The goal is that
they need you less by the end."

## 4. OG image regenerated with the real face

Instrument Serif and Archivo were fetched from Google Fonts and installed to
`~/Library/Fonts`, so `qlmanage` now rasterises the wordmark in Instrument Serif rather than
the Georgia fallback. **No project dependency added.** I read the PNG back to confirm the face
changed rather than trusting that installing the font was enough — the letterforms are
visibly the narrower, higher-contrast Instrument Serif.

Note this installed two fonts on your machine (in `~/Library/Fonts`, user-level, no sudo).
You authorised installing locally; flagging it because it is outside the repo.

## 5. Statement panel

Unchanged, on ink.

---

# Phase 12 — live Google Sheet source

## `src/lib/groupsSource.ts`

`RESEARCH_GROUPS_CSV_URL` starts `null`. While null the site renders the fallback dataset, so
nothing breaks before wiring.

**The CSV parser is a real parser**, hand-written, no dependency. It handles quoted fields
containing commas, quoted fields containing newlines, escaped `""` quotes, CRLF and lone-CR
line endings, and a UTF-8 BOM. All of those come out of Google Sheets — a single comma in an
abstract is enough to break a naive split. 31 parser and validation checks cover the edge
cases, including `","` as a whole field.

**Validation skips and logs rather than throwing.** A row with an unknown Field, Status,
Setting, or OutputType, or missing any required field, is skipped with a console warning
naming the row and the reason. One bad row cannot blank the directory, and a half-populated
card never renders.

Behaviour as specified: only `Published` = `yes` (case-insensitive) is returned; blank slugs
derive from the title; collisions get a numeric suffix and a warning; `MemberCount` defaults
to 0; `Methods`/`Milestones` split on pipes and trim; `image` is null unless **both** src and
alt are present; abstracts keep blank-line paragraphs.

**Caching** holds the *promise*, not just the result, so concurrent first-render callers share
one request rather than firing three.

**Fallback** on non-200, timeout (8s via `AbortController`), zero published rows, or an HTML
response. That last case matters: un-publishing a Sheet makes Google serve an error *page*
with a 200 status, which would otherwise parse as garbage CSV — it's detected by sniffing for
a leading `<`.

## Column contract

Documented verbatim at the top of the file. Columns match **by header name**, so reordering is
safe and renaming is not — a renamed required column skips every row, a renamed optional one
blanks that field. Both behaviours are asserted.

## Wiring

Directory, homepage featured cards, and brief pages all read through `useResearchGroups`.
No page imports the static array any more.

**A bug my own test caught.** The hook first initialised to `[]` and filled in via
`useEffect`. With no Sheet configured that meant the first paint rendered an empty
directory — "No groups match those filters" — for one frame, even though the fallback data was
already in the bundle and needed no await. Fixed with `initialResearchGroups()`, which seeds
state synchronously when there is nothing to fetch. Worth noting the three failures were real,
not artefacts of the SSR harness.

Skeletons match the real card dimensions — same header min-heights, same padding, same row
count — so swapping in real cards causes no layout shift. No pulse animation: the motion
budget is the globe and the citation network, and a shimmering grid would out-busy both. The
brief page renders a matching skeleton and only 404s **after** the fetch resolves, so an
existing group never shows "no research group at this address".

`src/data/research-groups.ts` is relabelled as the fallback dataset in both its file header
and the array comment, and says editing it does not change the site once the Sheet is live.
Its **types stay authoritative** — that is what Sheet rows are validated against.

## Template and docs

`scripts/generate-sheet-template.mjs` → `notes/research-groups-template.csv`: the exact 20
column headers plus two example rows from the seed data, one Recruiting with no image and one
Completed with a review status, so both ends of the lifecycle are visible. Runs under plain
node, no dependency, RFC 4180 quoting.

I round-tripped the generated file through the real parser rather than eyeballing it: 20
columns, 2 rows, both validating, 3 abstract paragraphs each, pipe lists splitting correctly.

`notes/managing-research-groups.md` covers publishing to the web and finding the CSV URL,
where to paste it, publishing a group, changing status, unpublishing, images, the pipe
convention, abstracts, slugs, renamed columns, and reading the console. It also covers two
things worth knowing that the brief did not ask for: Google caches published CSVs for about
five minutes, and `Published = no` versus `Status = Archived` mean different things — the doc
says not to delete rows, because a deleted row kills any shared link to that brief.

## Constraints honoured

No dependency added (`@vercel/analytics, clsx, cobe, react, react-dom, react-router-dom,
tailwind-merge` — unchanged). No auth. No admin UI.

---

## Verification

```
PASS  /                                               50602b
PASS  /research-groups                                 8844b
PASS  /research-groups/placeholder-model-card-review   4030b
PASS  /get-involved                                   29315b
…all 11 routes clean

PASS  lockup has no descriptor line      PASS  Youth Research TA present
PASS  Fellowship Mentor gone             PASS  old slugs gone
PASS  lead oneLine verbatim              PASS  TA description verbatim
PASS  CSV url starts null                PASS  falls back to seed data
PASS  cache returns the same promise     PASS  directory renders fallback groups
PASS  brief renders for a fallback slug  PASS  no skeleton when sheet unconfigured

all checks passed   (36 render + 31 parser/validation)
```

Every page still scanned for off-token hex values and the banned-string list.

---

## Open

- **`reach.ts` still asserts a real fellow in each of 20 countries.** Unverifiable by me,
  ships visible. Unchanged since Phase 7.
- **`MemberApplicationUrl` is parsed and carried but unused**, per the brief — Phase 13.
- **"Research Group Leader" vs "Research Group Lead"** — see above.
