# Event ordering fix

Found it. **One of the two views was wrong; the other was already correct.**
`npx tsc --noEmit` clean, `npx vite build` clean.

---

## Current order, before the fix

### `/events` — WRONG. This is the bug you saw.

Sections rendered in this order:

```
1. "Date to be announced"   ← undated, FIRST
2. "Upcoming"               ← dated
3. "Past sessions"
```

So with the live Sheet:

```
1. Date to be announced
     stanford-webinar-levine    Date to be announced
     stanford-webinar-pope      Date to be announced
2. Upcoming
     berkeley-lesson-fuller     Tue, Aug 25, 2026        ← a confirmed date, below two unscheduled sessions
```

### Homepage `EventsStrip` — already correct

```
const events = [...upcomingEvents(all), ...undatedEvents(all)].slice(0, 3);
```

Dated concatenated before undated, so `berkeley-lesson-fuller` was already the "Next" card. This view never had the bug.

## Cause

**Not the sorts.** All three selectors in `src/data/events.ts` were and are correct:

| Selector | Sort | Correct? |
| --- | --- | --- |
| `upcomingEvents` | `a.date.localeCompare(b.date)` — ascending, soonest first | yes |
| `undatedEvents` | by title, since there is no date | yes |
| `pastEvents` | `b.date.localeCompare(a.date)` — most recent first | yes |

**The cause was the section order in the JSX of `src/pages/Events.tsx`**, and it was deliberate rather than accidental. The line above it read:

```
{/* Undated first: an event without a date is still forthcoming. */}
```

That reasoning is half right and leads to the wrong conclusion. An undated event *is* forthcoming — but it cannot be acted on, so it must not outrank one that can. A reader scanning this page is looking for something to attend; putting "we haven't scheduled these yet" above "this is on 25 August" buries the only actionable item.

The page's own doc comment also asserted the wrong order in writing — *"Three sections, in this order: undated, upcoming, past"* — so the file documented the bug as intended behaviour, which is why it survived.

**Root cause of the divergence:** the two views each built the order independently, one by concatenating arrays and one by sequencing JSX. Nothing stated the rule, so nothing caught that they disagreed.

## The fix

**1. Section order swapped in `src/pages/Events.tsx`** — now `Upcoming` → `Date to be announced` → `Past sessions`. The misleading comment is replaced with one that states the rule and why dated wins, and the file's doc comment is corrected.

**2. The rule is now stated once**, in `src/data/events.ts`, as the authority both views point at:

```
1. dated upcoming, soonest first
2. undated ("to be announced")
3. past, most recent first
```

**3. Added `forthcomingEvents(events)`** — returns `[...upcomingEvents, ...undatedEvents]` in that order. The homepage strip now calls it instead of concatenating by hand.

That last part is the actual regression fix. The strip was right by luck of how someone typed a spread; now the ordering lives in one function, so a view cannot get it wrong by concatenating in the wrong sequence. `/events` still renders three separate sections rather than one flat list, because each needs its own heading and note — but it follows the same stated rule, and the comment says so.

## After the fix, against the live Sheet

```
HOMEPAGE EventsStrip (forthcomingEvents, first 3):
  NEXT DATED    berkeley-lesson-fuller     Tue, Aug 25, 2026 · 9:00 PM–9:45 PM PDT
       UNDATED  stanford-webinar-levine    Date to be announced
       UNDATED  stanford-webinar-pope      Date to be announced

/events sections, in render order:
  1. Upcoming
       DATED    berkeley-lesson-fuller     Tue, Aug 25, 2026 · 9:00 PM–9:45 PM PDT
  2. Date to be announced
       UNDATED  stanford-webinar-levine    Date to be announced
       UNDATED  stanford-webinar-pope      Date to be announced
  (Past sessions: omitted, empty)

INVARIANT dated-before-undated: HOLDS
INVARIANT upcoming ascending  : HOLDS
```

### Proved with more than one dated event

The live Sheet has only one dated event, so "soonest first" is not actually exercised by it. I ran the selectors against a deliberately shuffled set mixing near-future, far-future, undated and past:

```
input order: undated-zebra, far-2027, past-2025, near-2026-09, undated-apple, soonest-2026-08

forthcomingEvents():
  1. DATED    soonest-2026-08  2026-08-25
  2. DATED    near-2026-09     2026-09-02
  3. DATED    far-2027         2027-01-15
  4. UNDATED  undated-apple    -
  5. UNDATED  undated-zebra    -

pastEvents():
     past-2025  2025-05-01

dated all before undated       : HOLDS
dated ascending                : HOLDS
past excluded from forthcoming : HOLDS
undated sorted by title        : Apple session < Zebra session
```

## Files changed

```
M  src/data/events.ts                    ordering rule documented; forthcomingEvents() added
M  src/pages/Events.tsx                  section order swapped; comment and doc comment corrected
M  src/components/home/EventsStrip.tsx   now uses forthcomingEvents() instead of hand-concatenating
```

## Two things worth noting

**The time now formats correctly.** It rendered `21:00:00–21:45:00 PDT` when I last reported; it now reads `9:00 PM–9:45 PM PDT`. You changed the Sheet cells — that resolves the cosmetic issue I flagged, and no code change was needed.

**`Past sessions` was already in the right place** and is untouched. The bug was only the relative order of the two forthcoming sections.

## Not verified

The rendered pages. The ordering is confirmed at the data layer for both views and the section sequence is now literal JSX order, but I have not loaded `/events` in a browser to see the two headings stacked.
