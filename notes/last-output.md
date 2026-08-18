# Sheet URLs set and verified against the live endpoints

Branch: `chapters-rebuild`. Prior: … P12 `94a48c1` · P13 `ab2a7bd` · P14 `56614f9`.

Both URLs are set. Both sheets were fetched for real, parsed through the actual production
code, and verified. `tsc --noEmit` clean, `vite build` succeeds, `npm run dev` starts clean.

---

## 1. Both URLs return real CSV, not an HTML error page

```
GROUPS  http=200  type=text/csv; charset=utf-8  bytes=2532
EVENTS  http=200  type=text/csv; charset=utf-8  bytes=1943
```

Neither response begins with `<`, so neither trips the un-published-sheet detector. Both are
genuinely published to the web as CSV.

## 2. Parser results

Run through the real `parseCsv` → `rowsToGroups` / `rowsToEvents`, not a reimplementation.

**Research groups**

| | |
| --- | --- |
| Data rows | 2 |
| `Published = yes` | 2 |
| Validated | **2** |
| Skipped | **0** |

```
placeholder-transit-reliability   Social Sciences | Recruiting | school | 5 members
placeholder-market-vendor-costs   Economics & Business | Completed | community | 4 members
```

Visible in directory: 2. Recruiting (shows "Apply to join"): 1.

**Events**

| | |
| --- | --- |
| Data rows | 3 |
| `Published = yes` | 3 |
| Validated | **3** |
| Skipped | **0** |

```
example-methods-webinar    webinar  | confirmed | Wed, Oct 14, 2026 · 5:00 PM–6:00 PM UTC
example-analysis-clinic    workshop | tbd       | Date to be announced
example-sources-workshop   workshop | confirmed | Tue, Nov 11, 2025 · 5:00 PM–6:15 PM UTC
```

Grouping: 1 undated, 1 upcoming, 1 past. The TBD row renders "Date to be announced" and the
past row carries a recording URL, so all three date paths are live.

**No rows were skipped in either sheet, so there are no skip reasons to report.**

## 3. Header contract — both match exactly

**Research groups:** 20 columns, 20 expected, **0 missing, 0 extra**, order also matches.

**Events:** 23 columns, 23 expected, **0 missing, 0 extra**, order also matches.

Both sheets match the documented contract exactly. (Order is checked for information only —
columns are matched by name, so order never mattered.)

## 4. Neither sheet is empty

Both have published rows, so the fallback is not in play for either.

I verified the fallback path separately rather than leaving it assumed, and all three failure
modes engage correctly:

```
unreachable host          → null → fallback engages
HTML body with a 200      → "sheet returned HTML rather than CSV" → fallback engages
zero published rows       → 0 parsed → loadX() substitutes the fallback dataset
```

## 5. The site reads from the Sheets, not the fallback

Confirmed by calling the real `loadResearchGroups()` and `loadEvents()` over the network and
comparing returned slugs against the fallback slugs:

```
groups source : LIVE SHEET   (2 rows, vs 6 in the fallback)
events source : LIVE SHEET   (3 rows, vs 4 in the fallback)
```

The slug sets differ from the fallback in both cases, which is the proof — a coincidental
match would have been ambiguous.

---

## Two things you need to know

### The sheets contain the template's example rows, not real content

Both sheets are currently populated with the example rows from the templates I generated, not
real groups or events. That is fine for a wiring test, but it is now what a visitor sees.

Most significant: **the events sheet is publishing a fake speaker name.**

```
example-methods-webinar   speakerName: "EXAMPLE NAME — replace or leave blank"
```

That string is live on the events page and on `/events/example-methods-webinar` right now. A
speaker name on the site is a public claim that the person is appearing, and this one reads as
a real name to anyone who does not know it came from a template. `notes/managing-events.md`
says to delete all three example rows before publishing for exactly this reason.

Also live: two `placeholder-` research groups and three `example-` events, all with
"PLACEHOLDER"/"EXAMPLE" text in their abstracts and descriptions.

Nothing is broken — the pipeline is doing precisely what it should. But the sheets need real
rows, and that first example row needs deleting or its speaker fields blanking, before this is
shown to anyone.

### The events endpoint is intermittently slow, and the 8s timeout will sometimes bite

Repeated timed fetches:

```
events:  5.47s   0.60s   0.60s   2.68s   TIMED OUT (>30s)   0.56s
groups:  1.39s   1.15s   0.81s   2.96s   3.14s              0.60s
```

Typical is well under a second, but Google's publish-to-web endpoint occasionally hangs
outright — I saw one full timeout past 30 seconds on the events sheet and an 18-second response
on an earlier run. Groups was slower on average but never hung.

The consequence: the app's 8-second timeout means an occasional visitor gets the **fallback**
events instead of the Sheet's. That is the designed behaviour and it fails safe — the page
renders, nothing errors, and a console warning explains it. But it does mean the site will
sometimes show seed content instead of live content, and while the seed content is placeholder
text, that is a visible difference.

Nothing to fix in the code; the timeout is doing its job. Two options if it becomes annoying:
raise `SHEET_FETCH_TIMEOUT_MS` in `src/lib/csv.ts` (at the cost of a longer skeleton on a slow
load), or accept the occasional fallback. I would leave it at 8s until you see it in practice —
a 20-second blank wait is worse than a stale card.

---

## Verification

`tsc --noEmit` clean. `vite build` succeeds. `npm run dev` starts clean, 200 on all eight
routes, no warnings.

Both temporary verification scripts were removed and are not committed.

---

## Open

- **Replace the template rows in both sheets with real content**, and delete or blank the
  `EXAMPLE NAME` speaker on `example-methods-webinar`.
- **`reach.ts`** still asserts a real fellow in each of 20 countries. Unverifiable by me,
  ships visible. Unchanged since Phase 7.
- **"Research Group Leader" vs "Research Group Lead"** — still unrenamed, from Phase 11.
