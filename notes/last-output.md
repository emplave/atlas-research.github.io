# Homepage and research groups rewrite

All nine items done. `npx tsc --noEmit` clean, `npx vite build` clean. 15 files, +441/−398.

---

## Files changed

| File | What |
| --- | --- |
| `src/components/BringAtlasCta.tsx` | **new** — the one sitewide CTA, plus `CostLine` |
| `src/data/value-props.ts` | **new** — the five value props and the five requirements, shared |
| `src/components/home/ResearchGroupsPitch.tsx` | **new** — homepage section 01, replaces the listing |
| `src/components/home/FeaturedGroups.tsx` | **deleted** — it listed the placeholder cards |
| `src/pages/ResearchGroups.tsx` | rebuilt into the four founder sections (−334/+ the new page) |
| `src/components/Hero.tsx` | cost line, single CTA, new copy |
| `src/components/Closing.tsx` | single CTA, new copy |
| `src/components/home/EventsStrip.tsx` | promoted (item 9) |
| `src/components/ReachGlobe.tsx` | globe caption scoped to the Fellowship |
| `src/data/reach.ts` | added `FELLOW_COUNT` |
| `src/pages/Landing.tsx` | rewired section 01, documented the new order |
| `src/pages/Fellowship.tsx` | cross-link no longer says "Browse" |
| `src/data/openings.ts` | group-size copy aligned |
| `src/lib/seo.ts` | `/research-groups` meta rewritten — it described a directory |
| `src/lib/memberApplication.ts` | comment updated; notes the join path now has no UI entry |

---

## 1–2. Listings and secondary CTAs removed

The group grid is gone from the homepage and from `/research-groups`. **No empty grid, no "no groups yet"** — an empty state still advertises absence. `FeaturedGroups.tsx` is deleted rather than emptied, because a component named FeaturedGroups that features nothing is a trap for the next reader.

Also gone: "Browse research groups" from the hero, "See all research groups" from the section header, and the same button from the closing band. One primary CTA sitewide now, implemented once.

## 3. CTA copy

"Start a research group" → **"Bring Atlas to your school"**, in all four places it appeared. Same link (the Research Group Leader opening's `formUrl`, never hardcoded), same not-yet-open behaviour.

I extracted it into `BringAtlasCta` rather than editing four anchors. The four copies had already drifted — different padding, different disabled text ("Applications opening soon" vs "Opening soon"), one with an arrow. One component means the next copy change is one edit.

## 4. Cost line

> **Free.** No application fee, no tuition, no cost to your school.

Directly under the hero subhead, above the button. Also on `/research-groups` in the header, and on the homepage section 01 above its CTA.

I did **not** put the $3,900–$6,650 comparison on the page. That is an unsourced claim about named competitors and the site has a standing rule against exactly that. The figures are recorded in the component's comment as the *reason* the line sits high, which is where they belong.

## 5. `/research-groups` rebuilt as four sections

Header (cost line) → **01 What you get** → **02 What running a group actually involves** → **03 You run it** → **04 the CTA**, in that order, with the founder's four questions written into the file's doc comment so the order does not get "tidied" later.

All copy verbatim as supplied. Section 04 is an ink band with the single CTA and "Takes about two minutes."

Removed with the directory: the filters, the `?field=` handler, the no-results empty state, and **both** bottom CTA blocks ("No group here doing your question? Start one." and "Nothing here fits? Start your own.") — three competing CTAs on one page.

## 6. Homepage condensed version

Section 01 carries the five value props, the cost line, and the CTA. **Sections two and three are not duplicated** — the commitment and the title live only on `/research-groups`.

Value props come from `src/data/value-props.ts`, imported by both, so the two cannot drift.

## 7. Group size copy — every instance found

The `three to ten` → `three or more` standardisation had already landed in an earlier commit; this pass verified it and fixed the one remaining awkward phrasing.

**Every instance, current state:**

| File | Line | Text |
| --- | --- | --- |
| `src/components/Hero.tsx` | 37 | "recruit three or more members" |
| `src/components/Closing.tsx` | 20 | "recruit three or more members" |
| `src/pages/ResearchGroups.tsx` | 46 | "recruit three or more members" |
| `src/data/value-props.ts` | 60 | "Three or more members. That is the minimum. There is no maximum." |
| `src/components/Faq.tsx` | 11 | "Three or more students working one research question" |
| `src/data/openings.ts` | 122 | **changed** — was "Most groups run three or more people over one term", now "Groups run three or more members over one semester; three is a minimum, not a cap." |
| `src/lib/seo.ts` | 41, 63 | "Three or more students" |
| `index.html` | 17, 32, 41, 105 | "Three or more students" (meta, og, twitter, JSON-LD) |
| `public/site.webmanifest` | 4 | "Three or more students" |
| `public/llms.txt` | 3, 30 | "three or more students" / "three or more members" |

**No upper limit is stated anywhere.** The only remaining `three to ten` in the repo is inside a comment in `value-props.ts` explaining why it must never come back.

Searched variants: `three or more`, `three to ten`, `3 to 10`, `3–10`, `3-10`, `ten members`, `ten students`, `ten people`, `up to ten`, `maximum`, `no maximum`, `at most`, `between three and ten`. The `3-10` hits were all the date `2025-03-10`.

## 8. Globe caption

Now **"FELLOWSHIP: 25 FELLOWS IN 20 COUNTRIES"** (`.meta-label` uppercases it).

`20` is still derived from `REACH_COUNTRIES.length`, never typed. `25` could not be derived — that array holds one entry per country and several countries have more than one fellow — so it is a new `FELLOW_COUNT` constant in `reach.ts`, typed `number | null`, documented as the one hand-entered figure in that file. If it ever cannot be confirmed, set it to `null` and the caption falls back to countries alone rather than asserting an unchecked number.

The `aria-label` uses the same string in sentence case; uppercase in an aria-label gets spelled out letter-by-letter by some screen readers.

## 9. Events made more prominent — what and why

**Position unchanged at 02.** I considered moving it to 01 and rejected it: items 1–6 exist to make the offer the first thing on the page, and demoting the offer to promote the evidence would undercut them.

What I changed instead, in order of effect:

1. **The "Next" card is now an ink card** on the surface section. It is the only visually heavy element in the upper half of the page besides the hero, so the section now reads as the anchor between the pitch and the process track rather than as filler.
2. **Added an intro line** — "Groups hear directly from researchers, with live Q&A. Every session below is open to Atlas research groups." This reframes the section from a calendar into *evidence for value prop #3*, which is the actual argument it makes.
3. **Sits directly under the pitch**, so the claim ("sessions with researchers") is immediately followed by the checkable version of it.

**Why this section deserves the weight:** it is the only part of the homepage whose content a stranger can verify. A named researcher, a named institution, and a date are evidence; every other section is Atlas describing itself.

**One consequence you should know:** `EventsStrip` returns `null` when nothing is upcoming. Now that it carries more of the page's credibility, an empty events Sheet silently removes the homepage's only evidence *and* leaves an ink-card-shaped hole in the layout rhythm. I documented that in the component. Keep at least one forthcoming session in the Sheet, dated or TBD.

This is also the one change that touches the visual system: the ink card is a fourth dark surface on the page. It is a card inside a surface section, not a band, and the nearest ink *section* (the statement panel) is two sections further down, so the no-adjacent-ink-bands rule still holds. Easy to revert to `bg-paper` if you'd rather.

---

## Three things I did not do, that you should decide on

**1. Fabricated group briefs are still reachable by URL.** Removing the listings means no card renders anywhere — but `/research-groups/placeholder-transit-reliability` and five siblings still render full fabricated briefs, including the two COMPLETED ones, via `ResearchGroupBrief`. They are not in the sitemap and nothing links to them, so they will not be indexed, but they are live to anyone with the URL. Options: purge the placeholder records from `src/data/research-groups.ts`, or drop the `/research-groups/:slug` route. Both are larger than this task and neither was asked for.

**2. Four components are now dead code.** `ResearchGroupCard`, `GroupCardSkeleton`, `GroupGridSkeleton`, `DirectoryFilters` — nothing imports them (the one apparent reference is a comment). I left them because a directory plausibly returns and they represent real work. `useResearchGroups` is still live, used by the brief pages. Say the word and I'll delete them.

**3. "one term" vs "one semester" now disagree.** Your Section Two copy says "One semester to finish a paper", so I moved the hero and `/research-groups` to "one semester" to match. Six crawler-facing strings still say "one term": `index.html` ×4, `site.webmanifest`, `seo.ts:41`, plus `llms.txt`. I did not rewrite those — you didn't ask, and they are the strings Google and social previews read. One-line fix each if you want them aligned.

---

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 736ms
                   dist/index.html                   5.80 kB │ gzip:  2.23 kB
                   dist/assets/index-C-up8MqI.css   26.74 kB │ gzip:  6.10 kB
                   dist/assets/index-RmqAk5Mc.js   349.58 kB │ gzip: 110.34 kB
```

JS came down ~7kB — the removed directory, filters and card components outweigh what was added.

Also checked: no `Start a research group`, `Browse research groups`, or `See all research groups` string remains in `src/` outside explanatory comments; the `/research-groups` meta description no longer promises a directory (149 chars, under the 155 limit).

## Not verified

The rendered pages in a browser. Everything here is type-check, build, and reading the markup — I cannot drive a browser. Worth a look at two things specifically: the ink "Next" event card against its surface section, and the five value props in two columns at tablet width, where the fifth item wraps to a row of its own.
