# Purge fallbacks, fix school framing, audience report, missing-event diagnosis

Items 1–3 changed and pushed. Item 4 is diagnosis only, no code touched.
`npx tsc --noEmit` clean, `npx vite build` clean.

---

# ITEM 4 — Why `berkeley-lesson-fuller` is not rendering

## Cause: `Kind` is `"lesson"`, which is not an allowed value. The row is skipped.

Loaded the live Sheet through the app's own code — `fetch` → `parseCsv` → `rowsToEvents` → `loadEvents`, not curl. The Sheet is fine (`200`, `text/csv`, gid `953737550`, 3 data rows, headers correct). The row parses out of the CSV perfectly:

```
row 4: Published="yes" Slug="berkeley-lesson-fuller" Kind="lesson"
       DateStatus="confirmed" Date="2026-08-25" Timezone="PDT"
       Audience="Fellows" Capacity="25 spots"
```

Then `rowsToEvents` drops it:

```
[events] row 4 skipped: Kind "lesson" is not a known kind

events returned: 2
  stanford-webinar-pope    kind=webinar
  stanford-webinar-levine  kind=webinar

loadEvents() -> 2 events: stanford-webinar-pope, stanford-webinar-levine
```

`loadEvents()` returns **two** events. The Berkeley row is absent from the array entirely — it is not filtered out by a view, it never becomes an event.

## The four checks you asked for, in order

| # | Check | Result |
| --- | --- | --- |
| 1 | **Is `Kind` validated against an allowed set?** | **YES — and this is the cause.** `eventsSource.ts:68` defines `KINDS = ["webinar", "guest session", "workshop", "deadline", "info session"]`. `"lesson"` is not in it, so the row is skipped with the warning above. |
| 2 | **Does `Timezone` `"PDT"` parse?** | **Not an issue.** `Timezone` is never validated — `orNull(at("Timezone"))`, free text. `"PDT"` would have been stored and displayed fine. This check is never reached, because the Kind check runs first and `continue`s. |
| 3 | **Does `Audience` filter anything?** | **No.** Stored via `orNull`, never read by any filter. See item 3 below. |
| 4 | **Does any view apply a date / DateStatus / kind filter it fails?** | **No.** Nothing reaches a view. Had it parsed, `DateStatus="confirmed"` + `Date=2026-08-25` is a valid dated event and 2026-08-25 is still in the future, so it would have appeared under Upcoming on `/events` and in the homepage strip. |

The order matters: `Kind` is checked before `DateStatus`, `Date`, and everything else, so its failure masks any other problem. There are no other problems with this row.

## The exact cell to change

**Column `Kind`, row 4 — change `lesson` to one of:**

```
webinar   |   guest session   |   workshop   |   deadline   |   info session
```

`guest session` is the closest fit for a named Berkeley researcher; `workshop` if it is hands-on. That is the only edit needed — every other cell in the row is already valid.

## Should `lesson` and `PDT` be supported in code instead?

**`lesson` — yes, and it is a two-line change.** You want to keep using it, and the allow-list exists to catch typos, not to restrict your vocabulary. Add `"lesson"` to the `EventKind` union in `src/data/events.ts:31` and to `KINDS` in `src/lib/eventsSource.ts:68`. Nothing else needs touching: `kind` renders as a free label in every view, so a new value needs no styling and no copy.

Worth knowing about the trade-off: the allow-list is what makes `Kind` typos loud rather than silent. Keeping it and adding `lesson` preserves that. The alternative — dropping validation to free text — would have let this row through but would also let `webinarr` through, and you would have found out by seeing it on the site.

**`PDT` — already supported, nothing to do.** `Timezone` is free text with no validation or parsing, deliberately: it is displayed verbatim next to the time and never used for arithmetic. `PDT`, `UTC`, `IST`, `GMT+5:30` all work identically. The prior row using `UTC` was convention, not a constraint.

**I did not make either change** — item 4 was report-only. Say the word and `lesson` is done in one commit.

---

# ITEM 3 — How the site treats `Audience` today (no changes made)

## What it does

**Nothing filters on it. Anywhere.** The only code that reads `audience` is one render:

```
src/pages/EventDetail.tsx:111-112
  {event.audience && <Detail_ label="Who it is for">{event.audience}</Detail_>}
```

That is the complete list of consumers. `eventsSource.ts:196` stores it, `events.ts:67` types it, and nothing else touches it.

| View | Shows audience? | Registration CTA to a general visitor? |
| --- | --- | --- |
| Homepage `EventsStrip` | **No** | No CTA at all — title links to the detail page |
| `/events` list | **No** | **Yes — a "Register" button**, gated only on `registrationUrl` existing |
| `/events/:slug` detail | **Yes**, as "Who it is for" | **Yes — "Register"**, plus a **"Meeting link"** button if `JoinUrl` is set |

## So, to answer directly: yes, a Fellows-only event shows a general visitor a Register CTA

And on the two list views it does not even say the event is Fellows-only. The visitor sees a session, sees "Register", clicks, and finds out at the form — or worse, `JoinUrl` is set and they get a working meeting link.

For `berkeley-lesson-fuller` specifically, once you fix the `Kind`: `Audience="Fellows"` and `Capacity="25 spots"` would both display on the detail page, and the Register button would render for anyone.

## Recommendation

I would not build audience-based access control — the events are not secret, and a login system for this is disproportionate. Two cheaper changes, in priority order:

1. **Surface the audience in the list views.** It is the one-line fix that closes most of the gap: a visitor who sees "Fellows only" beside the title self-selects, and nothing needs gating. Currently the field is invisible exactly where the Register button is most prominent.
2. **Make the CTA label reflect the audience.** When `audience` names a closed group, render "Register — Fellows only" or a disabled control with that text, instead of a bare "Register". This reuses the `isRegistrationPending` disabled pattern already in both views.

A third, only if it matters: keep `JoinUrl` off Fellows-only rows, since that button is a live meeting link with no gate in front of it. That is a Sheet discipline point, not a code one.

The blocker for anything smarter is that `Audience` is free text — `"Fellows"`, `"Research groups"`, `"Research group leads and members"` all appear. Branching on it needs either a controlled vocabulary or a separate boolean column. Worth deciding before building.

---

# ITEM 1 — Placeholder fallbacks purged

| File | Removed |
| --- | --- |
| `src/data/events.ts` | **4** `PLACEHOLDER:`-titled events (4,404 chars) |
| `src/data/publications.ts` | **1** placeholder working paper (1,962 chars) |

Both arrays are now `[]`. Doc comments rewritten in both to record why they are empty and to warn that anything added back is live content served to real visitors whenever a Sheet fails, with no banner saying so. The publications comment additionally forbids ever seeding the peer-reviewed track, since a placeholder there renders under "This article completed peer review".

## Both consumers verified against an empty fallback

Exercised the real selectors, not read by eye:

```
EVENTS fallback length: 0
  upcoming: 0  undated: 0  past: 0
  EventsStrip:  returns null (section absent from the homepage)
  /events:      nothingScheduled = true -> "No sessions are scheduled right now"
  /events:      past section not rendered

PUBLICATIONS fallback length: 0
  workingPapers: 0 | peerReviewedArticles: 0
  /journal working-papers section: hidden by SHOW_WORKING_PAPERS (false)
  /journal reviewed section: renders the review-process explainer
  "First issue not yet published" badge: shows
  /journal/:slug any slug -> ArticleNotFound
```

**The publications page renders something sensible, not a broken grid.** With zero reviewed articles it falls through to the existing empty state — the three-step review explainer, the "what review looks for" criteria, and the revision/rejection copy. That is a complete page that happens to list no articles, which is what it looked like before the Sheet was wired up. No crash, no empty grid, no dangling heading.

This closes the risk I flagged last turn: an unreachable Sheet can no longer put `PLACEHOLDER:`-titled events on the homepage's most prominent section.

---

# ITEM 2 — School framing fixed

## Full audit, reported before changing

**Changed — 12 instances that presupposed a school:**

| File | Line | Before → After |
| --- | --- | --- |
| `BringAtlasCta.tsx` | 75 | CTA: "Bring Atlas to your school" → **"Lead an Atlas research group"** |
| `BringAtlasCta.tsx` | 94 | "no cost to your school" → **"no cost to anyone"** |
| `BringAtlasCta.tsx` | 13 | comment quoting the old CTA |
| `Closing.tsx` | 17 | "Bring Atlas to your school this semester." → "Lead an Atlas research group this semester." |
| `ResearchGroupsPitch.tsx` | 27 | "Bring Atlas to your school … with your **classmates**." → "Lead a research group at a school, in a community, or entirely online." |
| `ResearchGroups.tsx` | 42 | h1 "Bring Atlas to your school." → "Lead an Atlas research group." |
| `ResearchGroups.tsx` | 45 | "Run a research group with your **classmates**." → "… At a school, in a community, or entirely online." |
| `value-props.ts` | 63 | replaced verbatim with your supplied line |
| `seo.ts` | 63 | meta description, now 145 chars |
| `openings.ts` | 120 | "Run a research group at your school or online." → "…at a school, in a community, or online." (it omitted community) |
| `openings.ts` | 124 | **"Get permission from your school if your school requires it"** → "Find somewhere to meet, in person or online" |
| `Fellowship.tsx` | 231 | "Bringing Atlas to your school is open now." → "Leading a research group is open now." |
| `memberApplication.ts` | 12 | comment quoting the old CTA |

**`openings.ts:124` was the self-contradiction you flagged.** The Research Group Leader role listed "Get permission from your school if your school requires it" as its *first responsibility*, while the same site said "No school approval required" — and that bullet is rendered on `/get-involved`. Replaced with a venue-neutral responsibility that is actually true of every setting.

**"classmates" was a second, subtler form of the same problem** — it appeared twice in shipping copy and presupposes a school just as firmly as "your school" does. Both replaced.

## Crawler-facing tags: nothing to change

You asked me to check `index.html` meta tags, `site.webmanifest`, `seo.ts`, `llms.txt`, and the JSON-LD specifically. Result:

- **`index.html` — zero school references.** All four description strings (meta, `og:description`, `twitter:description`, JSON-LD `description`) read "Atlas runs student research groups in eight fields…" and never mention a school.
- **`site.webmanifest` — zero.** Same string.
- **JSON-LD — zero.**
- **`seo.ts`** — one instance, at line 63, changed.
- **`llms.txt` — already correct.** Line 3 reads "at a school, in a community setting, hybrid, or fully online", which enumerates all four settings properly. Nothing to fix.

## Deliberately left alone, with reasons

| Location | Why |
| --- | --- |
| `Faq.tsx:31` | "present findings locally to councils, **schools**, and community organisations" — school is one venue in a list, not a requirement |
| `Fellowship.tsx:13, 297` | Fellowship application form field, "School **or institution**" — different programme, and already inclusive |
| `Privacy.tsx:53` | "Your school or institution" — a data-collection disclosure, factual |
| `GetInvolved.tsx:53` | "For universities, journals, labs, **schools**, and nonprofits" — partner categories |
| `openings.ts:160, 234` | "Reach out to **schools** and teachers in your region" — outreach *targets* for the Regional Youth Director role, not a constraint on groups |
| `research-groups.ts:49, 147`, `groupsSource.ts:88` | `Setting = "school" \| "community" \| "hybrid" \| "online"` — the data model. `"school"` is one of four, which is exactly the point |
| `stats.ts:28` | "Number of schools **and community organisations** hosting groups" — a null stat, already inclusive |
| `llms.txt:73` | "International Journal of High **School** Research" — a journal's actual name |
| `llms.txt:100` | "how to start a research group at school" — an SEO keyword phrase people really search |
| `BringAtlasCta.tsx:15` | The comment explaining why "your school" was removed necessarily quotes it |

## The CTA is one edit, as you expected

`BringAtlasCta.tsx:78` is the only place the button text lives, so the hero, the homepage section, the closing band, and section 04 of `/research-groups` all changed together. The four other occurrences of the phrase are a heading, a meta description, an h1, and a code comment — separate strings by design, all updated.

---

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 775ms
                   dist/index.html                   5.82 kB │ gzip:  2.23 kB
                   dist/assets/index-DMpyM_Nr.css   25.97 kB │ gzip:  5.97 kB
                   dist/assets/index--JCa7CHi.js   335.68 kB │ gzip: 106.07 kB
```

JS down another ~4kB from the purged fallback data. No `your school` left in shipping copy outside the one explanatory comment and the fellowship form field.

## Not verified

The rendered pages. Two worth a glance: `/journal` with the Sheet reachable (unchanged, but the empty-fallback path is now the only safety net), and the `/research-groups` header where the subhead grew to three lines at desktop width.
