# Phase 14 — events from a live Sheet, plus individual event pages

Branch: `chapters-rebuild`. Prior: … P11 `cd417d8` · P12 `94a48c1` · P13 `ab2a7bd`.

Verification: `tsc --noEmit` clean, `vite build` succeeds, `npm run dev` starts clean with
`EVENTS_CSV_URL` null and fallback events rendering (200 on all 11 routes, no warnings),
**47/47 checks pass**.

---

## 1. Event type extended

All twelve fields added: `dateStatus`, nullable `date`, `endTime`, `timezone`, `location`,
`joinUrl`, `speakerBio`, `speakerUrl`, `audience`, `longDescription`, `recordingUrl`,
`capacity`. Existing fields kept.

`date` becoming nullable is the change that touches everything. Rather than leave each caller
to guard it, the type ships a narrowing predicate and two formatters:

- `hasDate(event)` — a type guard narrowing `date` to `string`, so sorting and comparison code
  cannot reach a null.
- `formatEventDate(iso | null)` — the single place a date becomes text. Returns
  `DATE_TBD_LABEL` for null **and for an unparseable string**, so no caller can emit
  "Invalid Date" even if bad data reaches it.
- `formatEventWhen(event)` — the card/header line. A TBD event returns only the label; a time
  appended to "Date to be announced" would read as a partial answer.

## 2. `src/lib/eventsSource.ts`

**The CSV parser is now shared, not duplicated.** I extracted it to `src/lib/csv.ts` along
with the header reader, slug helpers, `isPublished`, `orNull`, and the fetch-with-timeout, and
refactored `groupsSource.ts` onto it — that file dropped from ~390 to 292 lines. A second
parser would have drifted, and these are exactly the edge cases that only surface in
production.

`eventsSource` mirrors `groupsSource`: null URL falls back, `Published` = `yes` only, skip-and-
log validation, promise-level caching, 8s `AbortController` timeout, HTML-response detection
for an un-published Sheet, and the same slug derivation and collision suffixing.

Column contract documented verbatim at the top of the file.

## 3. Date handling

This was the part that needed care, and there were a few decisions worth stating.

**TBD is a first-class state, not an error.** `DateStatus: tbd` with a blank `Date` validates,
is kept, and lands in its own group. Asserted directly: `confirmed` with no date is skipped,
`tbd` with no date is kept.

**A TBD event can never be past.** `isPast` returns false without a date rather than comparing
against `NaN` — otherwise `Date.parse("nullT23:59:59Z")` would produce `NaN`, the comparison
would be false by accident, and the behaviour would be right for the wrong reason and break
on the next refactor.

**Three sections, empty ones omitted:** "Date to be announced" → "Upcoming" → "Past sessions".
Undated sits *above* upcoming because an event without a date is still forthcoming, not
lesser. Dated upcoming ascends, dated past descends, undated sorts by title since there is no
date and spreadsheet row order is arbitrary.

**Two details beyond the brief:**

- **An impossible date is rejected.** `2026-02-31` passes a regex but is not a real day, so
  validation round-trips through `Date` and compares the ISO string back. Without that, the
  event would render as 2 March.
- **A TBD row that already has a valid date keeps it.** That lets you type the date in first
  and flip `DateStatus` afterwards without silently losing it. It stays in the TBD section
  until `DateStatus` says `confirmed`.

I also **added a past event to the fallback data**. The seed previously had no past event, so
the past section, the recording control, and the no-join-link-on-past rule were unreachable
without a live Sheet. Now all three date states ship in the fallback and every render path is
exercised.

## 4. Individual event pages

`/events/:slug`, using `Prose` like the briefs. Order as specified: kind and date line, title,
speaker with affiliation (linked to `speakerUrl` when present), `longDescription` through
Prose, then a details block omitting whatever is blank.

- Registration uses `registrationUrl`, or a disabled "Details coming soon".
- `joinUrl` renders **only for upcoming** events. A meeting link on a finished session is a
  dead end for anyone arriving later.
- `recordingUrl` renders **only for past** events — held back beforehand, since there is
  nothing to watch yet. A past event with no recording says so plainly rather than showing a
  broken control.
- Unknown slug renders the 404 **after** the fetch resolves, with a matching skeleton before.
- Back link to `/events`.

`longDescription` falls back to `description` when blank, so a short event still gets a working
page rather than an empty column.

## 5. Cards clickable

Titles on `/events` and in the homepage strip link to the detail page. The registration and
recording controls are **siblings**, not nested — a link inside a link is invalid HTML and
browsers resolve it unpredictably. There is an explicit regex check that no anchor is nested
inside another anywhere on the events page.

Each row also carries a plain "Event details" link, so the destination is reachable without
relying on the title being recognised as clickable.

The homepage strip now includes undated events after dated ones, so a TBD session is not
invisible on the homepage while sitting on `/events`.

## 6. Template and docs

`scripts/generate-events-template.mjs` → `notes/events-template.csv`: 23 columns, three rows
covering exactly the cases that behave differently — confirmed upcoming with a named speaker,
TBD with a blank date, past with a recording. Round-tripped through the real parser rather than
eyeballed; it produced the correct three-way grouping and `"Date to be announced"` for the TBD
row.

The example speaker is labelled `EXAMPLE NAME — replace or leave blank`, and the docs say to
delete all three example rows before publishing, because a placeholder name on a live site
reads as a real claim.

`notes/managing-events.md` covers publishing and the CSV URL, adding an event, setting TBD and
confirming later, automatic upcoming/past, Zoom links, recordings after the fact, renamed
columns, and Google's five-minute cache. It states plainly:

> **Do not put a speaker's name in the Sheet until that person has agreed to appear.**

Plus three things an operator will hit: the difference between `RegistrationUrl` and `JoinUrl`,
that Sheets will reformat a typed date unless the column is set to plain text, and that
`Timezone` should always be filled for an online session because a bare "5:00 PM" is unusable
across time zones.

## Constraints honoured

No dependency added (`@vercel/analytics, clsx, cobe, react, react-dom, react-router-dom,
tailwind-merge` — unchanged). No auth. No admin UI.

---

## Verification

```
PASS  /events                                        8216b
PASS  /events/placeholder-analysis-clinic            5637b   (TBD)
PASS  /events/placeholder-methods-webinar            5885b   (upcoming)
PASS  /events/placeholder-past-sources-workshop      5769b   (past)
PASS  /events/does-not-exist                         3945b   (404)
…all 12 routes clean

PASS  TBD sorts into its own group        PASS  TBD is never past
PASS  formatEventDate(null) is the label  PASS  formatEventDate(garbage) is the label
PASS  no Invalid Date anywhere            PASS  confirmed without a date is skipped
PASS  tbd without a date is KEPT          PASS  impossible date is rejected
PASS  past detail has no meeting link     PASS  upcoming detail has no recording control
PASS  no anchor nested inside an anchor   PASS  one shared CSV parser

all checks passed
```

Every page also scanned for `Invalid Date`, `NaN`, `undefined`, off-token hex values, and the
standing banned-string list.

One check failed on the first run: a stale assertion of mine claiming the seed had no past
event, which stopped being true when I added one. Replaced with a correct
heading-appears-iff-group-is-non-empty check in both directions.

---

## Open

- **`reach.ts`** still asserts a real fellow in each of 20 countries. Unverifiable by me,
  ships visible. Unchanged since Phase 7.
- **Two Sheet URLs to fill in** when ready: `RESEARCH_GROUPS_CSV_URL` and `EVENTS_CSV_URL`.
  Each is one line and one deploy, after which both datasets are Sheet-only.
- **"Research Group Leader" vs "Research Group Lead"** — still unrenamed, from Phase 11.
