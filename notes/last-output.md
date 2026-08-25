# Condensed the commitment section; recruiting groups sort first

Both done. `npx tsc --noEmit` clean, `npx vite build` clean.

---

# 1. "What running a group actually involves" — five rows to three

`REQUIREMENTS` in `src/data/value-props.ts`, verbatim as specified:

```
1. Three or more members. There is no maximum.
2. Two to four hours a week. About a semester to finish a paper.
3. No faculty advisor, no school approval, no dues. You pick the question, in any field.
```

**No markup changed.** The section heading, its position as 02, and the hairline rules all come from `ResearchGroups.tsx`, which renders whatever `REQUIREMENTS` holds — so this was a data-only edit. The rules are still `divide-y divide-line` with a `border-t` above the first row, now producing three rows instead of five.

I updated the doc comment above the array, which described five separate facts and stated the timeline as fixed. It now records two things worth not losing:

- **"About a semester", not "One semester"** — and why. No Atlas group has finished a paper, so a hard number is a promise nobody can check. The comment says not to tighten it back until there are completed groups to measure.
- **Why the merges are the right pairs**, so a future edit does not re-split them arbitrarily: the weekly commitment and the timeline are one question, and "no gatekeeping" and "any question" are both answers to "what will you not make me do".

---

# 2. Groups taking members sort first

One function in the data layer, `sortForListing`, used by both listings:

```ts
export function sortForListing(groups: ResearchGroup[]): ResearchGroup[] {
  return groups.slice().sort((a, b) => {
    const byRecruiting = Number(canApply(b)) - Number(canApply(a));
    if (byRecruiting !== 0) return byRecruiting;
    return b.startedAt.localeCompare(a.startedAt);
  });
}
```

**It reads `canApply`** — the same predicate as the "Taking members" marker and the "Apply to join" button. That is what you asked for and it is the whole mechanism: a card marked as taking members cannot sort below one that is not, because both facts come from the same call.

**Both pages now call it**, replacing two separate inline `.sort()` expressions. Those were identical, but identical-by-coincidence in two files is how they drift — and it would have taken only one of them being updated for the homepage and `/research-groups` to disagree about which groups lead.

Secondary sort is unchanged: `startedAt` descending.

## Live result — both listings

```
1. TAKING MEMBERS  Access to International Academic Resources Among Chi…
2. TAKING MEMBERS  Home-Based Learning and Adolescent Well-Being in Del…
3.                 School Environment and Adolescent Health
4.                 Educational Accessibility for Students with Visual a…
5.                 Student Access to Academic Opportunity in Vietnam
6.                 Traditional Medicine and Chemotherapy Side Effects

INVARIANT recruiting-first: HOLDS
```

**Two groups are recruiting now, not one** — the Sheet changed again since my last turn; `Home-Based Learning` has `RecruitingOpen = yes` as well. Both lead.

## Verified with more than the live data

Six groups with two recruiting does not exercise much, so I ran a shuffled synthetic set:

```
input : closed-2026-09, open-2026-07, closed-2026-11, open-2026-10
sorted: open-2026-10*, open-2026-07*, closed-2026-11, closed-2026-09
```

Both open groups lead, and newest-first holds independently inside each half — `open-2026-10` before `open-2026-07`, `closed-2026-11` before `closed-2026-09`. The input array is left untouched, so no caller can be surprised by a reordered prop.

## The homepage gets a second benefit from this

`FeaturedGroups` slices to six. With recruiting-first, a group someone can actually join is never the one cut from the list — which matters more there than on `/research-groups`, where nothing is cut. Noted in the component.

## One thing this does not fix

The secondary date sort is still arbitrary, and not because of this function. The Sheet holds `StartedAt` as US `M/D/YYYY`, so `"11/1/2026"` sorts before `"8/10/2026"` as a string. The recruiting split above it works regardless, which is why the top of the list is now meaningful even though the tail order is not. Fix is changing those cells to `2026-09-01` form — a parser here would have to guess between US and international convention on an ambiguous value. Recorded in the function's comment.

---

## Files changed

```
M  src/data/value-props.ts                      REQUIREMENTS 5 -> 3; docs
M  src/data/research-groups.ts                  sortForListing added
M  src/pages/ResearchGroups.tsx                 uses sortForListing; 2 stale comments
M  src/components/home/FeaturedGroups.tsx       uses sortForListing; 1 stale comment
```

Three comments were asserting things that stopped being true when you published the rows: two claimed "all six rows have Published set to `no`", and one said every group is "Pending" when the Sheet now says `Forming`. Corrected rather than left to mislead the next reader.

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 715ms
                   dist/assets/index-DSHd3RQC.js   343.05 kB │ gzip: 107.75 kB
```

Order and the recruiting-first invariant checked by running the real function against the live Sheet and against a shuffled synthetic set.

## Not verified

The rendered pages. Two things worth a look: the commitment section at desktop width, which is the change you asked for and the one I cannot judge without seeing it — three rows of unequal length where the third now wraps to two lines on most widths; and the top of the grid, where two adjacent cards now both carry the filled "Taking members" marker, which is the first time that pairing appears.
