# Managing events

Events live in a Google Sheet. The site reads that Sheet at runtime.

**No code change and no deploy is needed to add an event, edit one, remove one,
set a date, or post a recording.** You edit the Sheet, reload the site, and the
change is there. The only thing that needs a code change is the one-time setup
in step 2.

Every event also gets its own page at `/events/<slug>`, built from the same row.

---

## 1. Set the Sheet up

1. Run `node scripts/generate-events-template.mjs` if
   `notes/events-template.csv` is not already there.
2. Import it into a new Google Sheet: **File → Import → Upload**, choosing
   **Replace current sheet**. That gives you the exact header row plus three
   example rows — one confirmed, one TBD, one past with a recording.
3. **Delete all three example rows** before publishing. The first one contains a
   placeholder speaker name, and a placeholder name on a live site reads as a
   real claim.
4. Do not rename or delete columns. Order does not matter; names do.

## 2. Publish it to the web and get the CSV URL

This is **not** the same as sharing the Sheet. Sharing gives people access;
publishing gives the site a plain CSV to read.

1. **File → Share → Publish to web**.
2. Under **Link**, choose the specific sheet tab, not "Entire document".
3. Choose **Comma-separated values (.csv)**.
4. **Publish**, then confirm.
5. Copy the URL. It looks like:

   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv
   ```

6. Paste it into `src/lib/eventsSource.ts`, replacing `null`:

   ```ts
   export const EVENTS_CSV_URL: string | null =
     "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv";
   ```

7. Commit and deploy that one change. **This is the only deploy you need.**

Until that URL is filled in, the site renders the fallback events in
`src/data/events.ts`, so nothing looks broken while you set up.

> Google caches published CSVs for a few minutes. A change can take up to about
> five minutes to appear. That is Google's cache, not the site's — reloading
> harder will not speed it up.

## 3. Add an event

Fill in a row and put `yes` in **Published**. Only `yes` publishes; anything
else, including blank, keeps it hidden. Case does not matter.

Required for the row to appear at all:

- **Title**
- **Kind** — `webinar`, `guest session`, `workshop`, `deadline`, or
  `info session`
- **Description** — the short summary used on cards
- **Date** — required only when **DateStatus** is `confirmed`. See below.

If any required field is missing or misspelled, **the row is skipped** rather
than half-rendered. Check the browser console to see which row and why.

Everything else is optional and simply does not render when blank: `EndTime`,
`Timezone`, `Location`, `JoinUrl`, `SpeakerName`, `SpeakerAffiliation`,
`SpeakerBio`, `SpeakerUrl`, `Audience`, `LongDescription`, `RegistrationUrl`,
`RecordingUrl`, `Capacity`, `ImageSrc`, `ImageAlt`.

### Speaker names

**Do not put a speaker's name in the Sheet until that person has agreed to
appear.** A name on the site is a public claim that they are speaking.

Leave `SpeakerName` blank and the event renders fine without one. When you do add
a name, add `SpeakerUrl` too — a profile or faculty page makes the claim
verifiable rather than just asserted.

## 4. Dates: TBD and confirming later

**DateStatus** is either `confirmed` or `tbd`. Blank counts as `confirmed`.

### An event with no date yet

Set **DateStatus** to `tbd` and leave **Date** blank. This is a valid, expected
state, not an error:

- The event appears under a **"Date to be announced"** section at the top of the
  events page, above Upcoming.
- Everywhere a date would render, it says "Date to be announced". Never a blank,
  never "Invalid Date", never today's date.
- It will **never** move to Past on its own. Only a real date moves it.

### Confirming the date later

Put the date in **Date** as `YYYY-MM-DD` and change **DateStatus** to
`confirmed`. The event moves into Upcoming, in date order, on the next load.

You can enter the date first and flip `DateStatus` afterwards — the date is kept
either way, so nothing is lost by doing it in two passes. But it stays in the TBD
section until `DateStatus` says `confirmed`.

### Upcoming and Past are automatic

You never move an event between sections. A dated event is Upcoming until its
date passes, then it is Past, from the next page load.

- Upcoming sorts **soonest first**.
- Past sorts **most recent first**.
- TBD sorts by title, since there is no date to sort by.

An empty section is not rendered at all, so if nothing is TBD there is no "Date
to be announced" heading.

### Date format

`YYYY-MM-DD`, e.g. `2026-10-14`. Anything else is rejected with a console
warning, and so is an impossible date like `2026-02-31`. If you type a date into
Google Sheets and it reformats to `10/14/2026`, set that column's format to
**Plain text** (Format → Number → Plain text) and retype it.

## 5. Times

- **Time** — start, e.g. `5:00 PM`
- **EndTime** — end, e.g. `6:00 PM`. Blank is fine.
- **Timezone** — e.g. `UTC` or `PT`

These are display strings, not parsed, so write them how you want them read. The
site joins them as `5:00 PM–6:00 PM UTC`, and omits whatever is blank without
leaving a stray dash.

Always fill in **Timezone** for an online session. Atlas has members across many
time zones and a bare "5:00 PM" is unusable to most of them.

## 6. Add a Zoom or meeting link

Put it in **JoinUrl**.

It renders as a "Meeting link" button on the event page, **for upcoming events
only**. A past event never shows a join link — that is a dead end for anyone who
finds the page later.

**RegistrationUrl** and **JoinUrl** are different things:

- **RegistrationUrl** — a form someone fills in beforehand. When blank, the
  button renders as a disabled "Details coming soon" rather than a dead link.
- **JoinUrl** — the actual meeting room. Only shown for upcoming events.

You can use either, both, or neither.

## 7. Add a recording after the session

Put the URL in **RecordingUrl**. It renders as "Watch the recording" **only once
the event is past** — before that it is held back, since there is nothing to
watch yet.

Nothing else needs changing. The event has already moved itself to Past.

If a past session has no recording, the page says so plainly rather than showing
a broken control.

## 8. Long descriptions

**Description** is the short line on cards. **LongDescription** is the full text
on the event page.

For paragraphs in `LongDescription`, press **Alt+Enter** (Option+Enter on Mac)
twice to leave a blank line. Blank lines become paragraph breaks. A single line
break is ignored.

If `LongDescription` is blank the event page falls back to `Description`, so a
short event still gets a working page.

## 9. Slugs

The **Slug** is the event's URL: `/events/<slug>`.

- Leave it blank and one is derived from the title.
- Fill it in to control the URL, worth doing for anything you will link to.
- **Do not change a slug once you have shared the link.** Changing it breaks
  every existing link to that event.
- Two rows with the same slug: the second gets `-2` appended and a console
  warning.

## 10. Removing an event

Set **Published** to `no`. It disappears on the next load and the row is kept.

Do not delete rows. A deleted row loses the record, and if anyone linked to that
event's page the link dies. Past events are worth keeping visible — a dated list
of sessions that actually ran is the strongest evidence the programme is real.

## 11. If a column gets renamed

Columns are matched **by header name**, not position, so reordering is safe and
renaming is not.

- Rename a **required** column (`Title`, `Kind`, `Description`, `Date`,
  `DateStatus`, `Published`) and every row loses that field, so **every row is
  skipped**. The page falls back to the seed events rather than going blank,
  which can look like nothing happened — check the console.
- Rename an **optional** column and just that field goes blank.

If the events page suddenly shows the old placeholder sessions, a renamed or
deleted column is the first thing to check.

## 12. When something looks wrong

Open the browser console. Every skipped row is logged with its row number and
the reason:

```
[events] row 4 skipped: Kind "seminar" is not a known kind
[events] row 7 skipped: Date is required when DateStatus is "confirmed"
         (set DateStatus to "tbd" if the date is not settled)
[events] row 9 skipped: Date "2026-13-01" is not a valid YYYY-MM-DD date
[events] row 5: slug "methods" already used, using "methods-2"
```

The site falls back to the seed events if the Sheet is unreachable, times out,
returns an error page, or parses to zero published events. Visitors see a working
page either way — they are never shown a fetch error.

Common causes:

- **Nothing changed after an edit** — Google's CSV cache, up to ~5 minutes.
- **Page shows placeholder sessions** — Sheet unreachable, un-published, or a
  required column renamed.
- **One event missing** — that row failed validation. Console says why.
- **An event stuck in "Date to be announced"** — `DateStatus` is still `tbd`.
- **"Publish to web" was undone** — Google then serves an HTML error page
  instead of CSV, which is detected and treated as unreachable.

## 13. What still needs code

Everything else is the Sheet. These are not:

- The one-time CSV URL in `src/lib/eventsSource.ts`.
- Image **files** in `public/images/` — the Sheet holds the path, not the file.
- Adding a **new Kind**. The five kinds are a union in `src/data/events.ts`, and
  a value outside them is rejected on purpose, so a typo cannot invent a sixth.
