# Publications Google Sheets pipeline

Branch **`publications-sheet`**, one commit. Not merged to main, not pushed.

(No commit hash cited here on purpose: this report is inside the commit it would name, so any hash
written here is wrong the moment the commit is amended. `git log -1 publications-sheet` is the
authority.)

Built on the existing pattern rather than a second approach: `publicationsSource.ts` mirrors
`eventsSource.ts` line for line in structure, shares the one CSV parser in `src/lib/csv.ts`, and
`usePublications.ts` mirrors `useEvents.ts`. No new parser, no new fetch helper, no new cache
strategy.

---

## What changed, by file

| File | |
| --- | --- |
| `src/data/publications.ts` | M — added `reviewedAt`; selectors now take a list; added `reviewedDate()`, `isReviewed()`, `publicationDate()` |
| `src/lib/publicationsSource.ts` | **new** — the live source, plus `normalizeFullTextUrl` |
| `src/lib/usePublications.ts` | **new** — the hook |
| `src/pages/Journal.tsx` | M — reads through the hook; skeleton; date label; conditional "first issue" badge |
| `src/pages/JournalArticle.tsx` | M — reads through the hook; 404 only after load; skeleton; date label |
| `src/lib/flags.ts` | M — comment only: notes the flag is independent of the Sheet |
| `scripts/generate-sheet-template.mjs` | M — now emits the publications template too |
| `notes/publications-template.csv` | **new** — generated |
| `notes/managing-publications.md` | **new** — 13 sections |

`PUBLICATIONS_CSV_URL` is `null`, so nothing changes on the live site until you paste the URL. The
Journal renders the fallback seed exactly as it does today.

---

## 4. The Sheet column headers you need to create, in order

```
Published
Slug
Title
Authors
Track
Field
Abstract
FullTextUrl
PublishedAt
ReviewedAt
```

Ten columns. As one header row:

```
Published,Slug,Title,Authors,Track,Field,Abstract,FullTextUrl,PublishedAt,ReviewedAt
```

Order does not matter to the site — columns are matched by name. Names do matter.

| Column | Required | Notes |
| --- | --- | --- |
| `Published` | yes | `yes` publishes; anything else hides the row |
| `Slug` | no | blank derives from `Title` |
| `Title` | yes | |
| `Authors` | yes | pipe-separated |
| `Track` | yes | `working-paper` \| `peer-reviewed`, no default |
| `Field` | yes | one of the existing eight, exactly |
| `Abstract` | yes | blank line = paragraph break |
| `FullTextUrl` | no | Drive link; blank → "Full text coming soon" |
| `PublishedAt` | yes | `YYYY-MM-DD` |
| `ReviewedAt` | no | `YYYY-MM-DD`, peer-reviewed rows only |

---

## The track rule, enforced twice on purpose

A working paper must never render as reviewed, so the rule is applied in two independent places:

1. **At parse.** `rowsToPublications` discards a `ReviewedAt` supplied on a `working-paper` row and
   logs that it ignored it. The value is never stored.
2. **At render.** `reviewedDate()` returns `null` for any `working-paper` record regardless of what
   the field holds, and `publicationDate()` is the only thing the pages call.

One layer would have been enough for the Sheet. Two means a `Publication` built by hand, or a future
caller reaching for `publication.reviewedAt` directly, still cannot put a review date on an
unreviewed paper.

### What renders for each combination

| `Track` | `ReviewedAt` in Sheet | Stored | Badge | Date shown |
| --- | --- | --- | --- | --- |
| `working-paper` | blank | `null` | Working paper | `Published <PublishedAt>` |
| `working-paper` | `2026-07-15` | `null` — discarded + warned | Working paper | `Published <PublishedAt>` |
| `peer-reviewed` | `2026-08-20` | `2026-08-20` | Peer reviewed | `Reviewed 2026-08-20` |
| `peer-reviewed` | blank | `null` — warned | Peer reviewed | `Published <PublishedAt>` |
| `peer-reviewed` | `not-a-date` | `null` — warned | Peer reviewed | `Published <PublishedAt>` |

Lists sort by whichever date the row displays, newest first.

A peer-reviewed row with no `ReviewedAt` **still publishes** rather than being skipped. It shows its
published date, which is true of every record, and warns. Skipping it would hide a real reviewed
article over a missing optional cell.

---

## 6. FullTextUrl validation

`normalizeFullTextUrl` runs at parse time, so what is stored is already safe and every render path
inherits it.

| Input | Output |
| --- | --- |
| `.../file/d/FILE_ID/view?usp=sharing` | `https://drive.google.com/uc?export=download&id=FILE_ID` |
| `.../file/d/FILE_ID/view` | same rewrite |
| `.../file/d/FILE_ID/preview` | same rewrite |
| `.../uc?export=download&id=FILE_ID` | unchanged |
| `.../drive/folders/...` | **`null`** + warning |
| any other URL | unchanged |
| blank, `N/A`, `TBD`, `-` | `null` |

I match `/file/d/([^/?#]+)` rather than requiring a literal `/view`, so `/view`, `/view?usp=sharing`,
`/preview` and `/edit` all normalise. The spec said "of the form `.../view...`"; matching the id
segment covers that and the other suffixes Drive hands out, which seemed the useful reading.

Placeholder-dropping reuses `isMeaningfulValue` from `src/data/research-groups.ts` — the same
predicate `settingLine` uses — rather than a second token list.

---

## 5. Round-trip through the real parser

Not asserted — executed. The generated CSV was bundled with the project's own esbuild against
`src/lib/csv.ts` and `src/lib/publicationsSource.ts`, so this is the shipped code, not a copy.

### parseCsv on the generated file

```
rows returned (incl. header): 3
header cells: 10
headers: ["Published","Slug","Title","Authors","Track","Field","Abstract","FullTextUrl","PublishedAt","ReviewedAt"]

Multi-paragraph abstract survived the quoted newlines:
  paragraphs in row 2 Abstract: 3
Field with an ampersand survived un-split:
  row 3 Field = "Environment & Sustainability"
```

### The template as shipped

```
published publications: 0
```

Correct: both example rows are `Published=no`, so importing the template publishes nothing.

### With Published flipped to yes

```
  slug        placeholder-working-paper
  track       working-paper
  authors     ["Atlas Research Institute"]
  field       Social Sciences
  publishedAt 2026-06-01
  reviewedAt  null
  DISPLAYS AS → "Published 2026-06-01"
  fullTextUrl "https://drive.google.com/uc?export=download&id=PLACEHOLDER_FILE_ID"
  abstract    3 paragraphs

  slug        placeholder-reviewed-article
  track       peer-reviewed
  authors     ["Placeholder Author","Placeholder Co-Author"]
  field       Environment & Sustainability
  publishedAt 2026-09-01
  reviewedAt  "2026-08-20"
  DISPLAYS AS → "Reviewed 2026-08-20"
  fullTextUrl null
  abstract    2 paragraphs

workingPapers():        placeholder-working-paper
peerReviewedArticles(): placeholder-reviewed-article
```

Note the Drive share link arrived as `/file/d/PLACEHOLDER_FILE_ID/view?usp=sharing` and came out as a
`uc?export=download` URL.

### Track rule, probed adversarially

A `working-paper` row given `ReviewedAt=2026-07-15`:

```
[publications] row 2: ReviewedAt "2026-07-15" ignored because Track is "working-paper" — a working paper has not been peer reviewed
stored reviewedAt : null
reviewedDate()    : null
displays as       : "Published 2026-06-01"
```

The date is **discarded**, not merely hidden.

A `peer-reviewed` row with a blank `ReviewedAt`:

```
[publications] row 3: Track is "peer-reviewed" but ReviewedAt is blank; showing the published date instead
stored reviewedAt : null
displays as       : "Published 2026-09-01"
```

### Every normalizeFullTextUrl branch

```
  Drive share link         → "https://drive.google.com/uc?export=download&id=1AbC_dEf-123"
  Drive share, no query    → "https://drive.google.com/uc?export=download&id=1AbC_dEf-123"
  Drive /preview suffix    → "https://drive.google.com/uc?export=download&id=1AbC_dEf-123"
  already direct download  → "https://drive.google.com/uc?export=download&id=1AbC_dEf-123"
  Drive FOLDER (invalid)   → null
  non-Drive URL            → "https://example.org/papers/paper.pdf"
  blank                    → null
  placeholder N/A          → null
  placeholder TBD          → null
  placeholder -            → null
```

Normalising twice is stable — the direct form round-trips to itself.

---

## Two judgement calls I made, and why

**1. The template's example rows are `Published: no`.** The groups and events templates both ship
`yes`. I deviated here because the peer-reviewed example row would otherwise go live on import,
sitting under "This article completed external peer review" having been reviewed by nobody. A stray
placeholder group is untidy; a stray placeholder reviewed article is a false claim. Documented in the
template's inline comment and in section 1 of the notes. Say the word if you want it back to `yes`.

**2. I wired the two Journal pages through the hook.** The deliverables listed the source module but
not the page changes. A source module nothing reads is dead code, and the existing pattern is that
pages consume the hook — so without this "build the pipeline" would not have been done. The changes
follow `Events.tsx` and `EventDetail.tsx` exactly, including rendering the 404 only *after* the fetch
resolves, so a real paper is never reported missing while its request is outstanding.

That rewiring forced two smaller changes worth flagging:

- `workingPapers()`, `peerReviewedArticles()` and `findPublication()` now take the publications array,
  matching how `upcomingEvents(events)` and `findEvent(events, slug)` already work.
- The **"First issue not yet published"** badge is now conditional. It was hardcoded. Once the Sheet
  carries a reviewed article that badge would have been a false statement printed directly above the
  article disproving it.

---

## Checks

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 717ms, 104 modules
                   dist/index.html                   5.19 kB │ gzip:   1.97 kB
                   dist/assets/index-Bh2OPDDT.css   26.28 kB │ gzip:   5.94 kB
                   dist/assets/index-mYUBNS9S.js   347.81 kB │ gzip: 108.49 kB
```

No real paper content anywhere. Every example is labelled `PLACEHOLDER`, the peer-reviewed track in
`src/data/publications.ts` is still deliberately empty, and no author, affiliation, metric, or ISSN
was invented.

---

## What you need to do

1. Import `notes/publications-template.csv` into a new Sheet tab.
2. **File → Share → Publish to web**, that tab, CSV.
3. Paste the URL into `PUBLICATIONS_CSV_URL` in `src/lib/publicationsSource.ts` and deploy that one
   line. Everything after is Sheet-only.
4. Set each PDF to **Anyone with the link → Viewer**, and test the link in a private window. The
   site cannot detect a restricted file — the link will look fine to you and be dead for readers.
5. Working papers stay hidden until `SHOW_WORKING_PAPERS` in `src/lib/flags.ts` is flipped to `true`.
   Rows still parse while it is off; they are just not listed or reachable.

## Not verified

- No live Sheet exists yet, so the fetch path is exercised only through the fallback branch. The
  parse path is verified above against the real generated CSV.
- `PLACEHOLDER_FILE_ID` is not a real Drive id, so the rewrite is verified by shape, not by
  downloading a file. Step 4 above is how that gets confirmed.
