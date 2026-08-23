# Purge placeholder groups, align semester, delete dead components

All three done. `npx tsc --noEmit` clean, `npx vite build` clean. 7 files, 3 deleted.

**Read the first section below before treating item 1 as closed.** The fabricated
briefs you were worried about are not all gone, and the ones that remain are not in the code.

---

## ⚠ The two COMPLETED briefs are still live — they come from the Sheet, not the code

I purged the six placeholder records from `src/data/research-groups.ts`, which is what you asked
for. But I then checked what actually resolves at `/research-groups/:slug` through the real runtime
path, and the two COMPLETED briefs are still there. They were never in the code:

```
LIVE SHEET groups that still render full briefs:
  /research-groups/transit-reliability
      title  : Bus Reliability and Late Arrivals in a Commuter Corridor
      status : Completed
      lead   : Rithik Ramkumar
  /research-groups/market-vendor-costs
      title  : Input Costs and Pricing Among Open-Air Market Vendors
      status : Completed
      lead   : Nirav Goenka
```

The purged fallback records had the *same two titles* with a `Placeholder:` prefix and
`Placeholder Lead` as the lead name — the fallback was modelled on these rows. So purging the code
removed the imitations and left the originals.

**These two may well be real groups**, not fabrications: they carry real-looking lead names, no
`Placeholder:` prefix, and one of them names the same person as the partnerships contact. I am not
going to guess, and I have not touched your Sheet.

- **If they are real**, nothing more is needed. They are two genuine completed groups with no listing
  pointing at them, reachable by URL only.
- **If they are placeholders**, set `Published` to anything other than `yes` on those two rows, or
  delete the rows. No deploy needed — the site reads the Sheet at runtime.

Either way this is a Sheet edit, not a code change, which is why item 1 could not fully close it.

## 1. Placeholder records purged

Six records removed from `RESEARCH_GROUPS` in `src/data/research-groups.ts`, not just the two
COMPLETED ones — all of them were invented:

```
placeholder-transit-reliability     placeholder-model-card-review
placeholder-clinic-wait-times       placeholder-market-vendor-costs
placeholder-river-turbidity         placeholder-oral-history-archive
```

`export const RESEARCH_GROUPS: ResearchGroup[] = [];` — the array is now empty. 11,432 characters
of invented abstracts, methods, milestones and lead names gone; the file dropped from 408 to 237 lines.

The doc comment above it argued the *opposite* of this change — that a populated fallback was worth
keeping so an unreachable Sheet "degrades to a populated directory instead of a blank page". That
reasoning died with the directory, so I rewrote it rather than leaving a comment that contradicts the
code. It now records why the records were removed and warns that anything added back here is live
content served whenever the Sheet is unreachable.

`PLACEHOLDER_VALUES` in the same file is untouched — that is the `N/A`/`TBD` cell-cleaning token set,
unrelated to these records.

### The route and component are intact, and unknown slugs are handled

`/research-groups/:slug` and `ResearchGroupBrief` are unchanged in behaviour. Verified by exercising
the real path — `loadResearchGroups()` against the live Sheet, then the exact
`groups.find(g => g.slug === slug)` the component runs:

```
RESEARCH_GROUPS (fallback) length: 0
loadResearchGroups() returned:    2 records   (from the Sheet)

placeholder-transit-reliability    -> undefined -> BriefNotFound
placeholder-clinic-wait-times      -> undefined -> BriefNotFound
placeholder-river-turbidity        -> undefined -> BriefNotFound
placeholder-model-card-review      -> undefined -> BriefNotFound
placeholder-market-vendor-costs    -> undefined -> BriefNotFound
placeholder-oral-history-archive   -> undefined -> BriefNotFound
totally-made-up-slug               -> undefined -> BriefNotFound
""                                 -> undefined -> BriefNotFound
```

**Graceful: a not-found page, not a crash and not a blank page.** `BriefNotFound` renders a heading,
an explanation, and a link back to `/research-groups`. It was already correct
because the component's happy path is `find()` → `undefined`, and an empty array takes the same
branch as a wrong slug. No guard needed; the empty case is not special.

Three copy fixes there, since the page it links back to no longer browses anything: "All research
groups" → "Research groups", "Browse all research groups" → "How research groups work", and "the
group may have been archived" → "Atlas is not currently listing groups publicly". I also documented
in the component that **unknown slugs are now the normal case**, and that it is the only remaining
consumer of the group data.

## 2. "one term" → "one semester"

Six instances, all replaced:

| File | Line | Field |
| --- | --- | --- |
| `index.html` | 17 | `<meta name="description">` |
| `index.html` | 32 | `og:description` |
| `index.html` | 41 | `twitter:description` |
| `index.html` | 105 | JSON-LD `description` |
| `public/site.webmanifest` | 4 | `description` |
| `src/lib/seo.ts` | 41 | `SITE_DESCRIPTION` |

Zero `one term` left anywhere in the repo. Verified in the built output: `dist/index.html` has four
`one semester` and zero `one term`.

**One correction to my previous report:** I listed `public/llms.txt` as one of the six. It never
contained the phrase — it has no `term`/`semester` language at all. The six were `index.html` ×4 plus
the webmanifest and `seo.ts`. Nothing was missed; my earlier list was just wrong about which file.

## 3. Dead components deleted

Three files, four exported components:

| File | Exports removed |
| --- | --- |
| `ResearchGroupCard.tsx` | `ResearchGroupCard` |
| `GroupCardSkeleton.tsx` | `GroupCardSkeleton`, `GroupGridSkeleton` |
| `DirectoryFilters.tsx` | `DirectoryFilters`, plus `ALL`, `EMPTY_FILTERS`, `isFiltered`, `DirectoryFilterState` |

Confirmed no importer for any of them before deleting. The four `DirectoryFilters` helper exports
went with it — they existed only to serve the filter state and had no other consumer.

`src/components/research-groups/` now contains only `StatusChip.tsx`, which the brief page still
uses at line 102. `useResearchGroups` untouched, as instructed — still the brief page's data source.

---

## A wrong conclusion I reached and corrected

Mid-task I fetched the three Sheet URLs with `curl` and got **HTTP 400 with an HTML error page from
all three**. I was about to report that the site was serving fallback data everywhere, and that the
homepage Events section — the one I made the most prominent element last turn — was rendering three
events with literal `PLACEHOLDER:` titles from `src/data/events.ts`.

**That was wrong.** Fetching through the app's own code path instead of curl, all three Sheets work:

```
GROUPS  live: 2   (real Sheet rows, not the fallback)
EVENTS  live: 2   is fallback? false
   stanford-webinar-levine  "Guest session with Stanford researcher, Dr. Levine"
   stanford-webinar-pope    "Guest session with Stanford researcher, Dr. Pope"
PUBS    live: 1   is fallback? false
```

So the homepage Events section is showing two real Stanford guest sessions, which is exactly what
that section is for. The curl 400 was an artefact of how I extracted the URL, not a broken Sheet.

Recording it because the check that produced the false alarm — "does this render the fallback?" —
is worth keeping, and because the fallback content for events and publications *is* still
placeholder-titled, so the alarm would be real if a Sheet ever did go down. `src/data/events.ts`
holds four `PLACEHOLDER:`-titled events and `src/data/publications.ts` one placeholder working paper.
Not in scope here, and unlike the groups fallback they are a genuine safety net — but if you want
those purged on the same reasoning, say so.

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 591ms
                   dist/index.html                   5.82 kB │ gzip:  2.23 kB
                   dist/assets/index-DMpyM_Nr.css   25.97 kB │ gzip:  5.97 kB
                   dist/assets/index-2FzWgZBq.js   339.85 kB │ gzip: 106.99 kB
```

JS down another ~10kB (349.58 → 339.85) and CSS down ~0.8kB from the three deleted components.

## Files changed

```
M  index.html                                        4 strings
M  public/site.webmanifest                           1 string
M  src/lib/seo.ts                                    1 string
M  src/data/research-groups.ts                       6 records purged, comment rewritten
M  src/pages/ResearchGroupBrief.tsx                  copy + unknown-slug contract
D  src/components/research-groups/ResearchGroupCard.tsx
D  src/components/research-groups/GroupCardSkeleton.tsx
D  src/components/research-groups/DirectoryFilters.tsx
```

## Not verified

The rendered pages in a browser. In particular `/research-groups/anything` returning the not-found
page is confirmed at the data layer, not by loading it — worth one click to confirm the component
renders as expected rather than erroring in React.
