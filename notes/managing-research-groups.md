# Managing research groups

Research groups live in a Google Sheet. The site reads that Sheet at runtime.

**No code change and no deploy is needed to add a group, edit one, change a
status, publish, or unpublish.** You edit the Sheet, reload the site, and the
change is there. The only thing that ever needs a code change is the one-time
setup in step 2.

---

## 1. Set the Sheet up

1. Open `notes/research-groups-template.csv` and import it into a new Google
   Sheet: **File → Import → Upload**, and choose **Replace current sheet**.
   That gives you the exact header row the site expects, plus two example rows
   showing the format.
2. Delete the two example rows once you have real groups. Do not delete the
   header row.
3. Do not rename, reorder, or delete columns. Order does not matter, but names
   do — see "If a column gets renamed" below.

## 2. Publish it to the web and get the CSV URL

This is **not** the same as sharing the Sheet. Sharing gives people access;
publishing gives the site a plain CSV to read.

1. In the Sheet: **File → Share → Publish to web**.
2. Under **Link**, choose the specific sheet tab (not "Entire document").
3. In the format dropdown, choose **Comma-separated values (.csv)**.
4. Click **Publish**, then confirm.
5. Copy the URL. It looks like:

   ```
   https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv
   ```

6. Paste it into `src/lib/groupsSource.ts`, replacing `null`:

   ```ts
   export const RESEARCH_GROUPS_CSV_URL: string | null =
     "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv";
   ```

7. Commit and deploy that one change. **This is the only deploy you need.**
   After it, everything below is Sheet-only.

Until that URL is filled in, the site renders the fallback groups in
`src/data/research-groups.ts`, so nothing looks broken while you set up.

> Google caches published CSVs for a few minutes. A change can take up to about
> five minutes to appear. That is Google's cache, not the site's — reloading
> harder will not speed it up.

## 3. Publish a group

Fill in a row and put `yes` in **Published**.

Only `yes` publishes. Anything else — `no`, `TRUE`, `pending`, blank — keeps the
row hidden. Case does not matter, so `Yes` and `YES` both work.

Required for the row to appear at all:

- **ProjectTitle**
- **Field** — must match one of the eight exactly (see below)
- **Status** — must match one of the five exactly
- **Setting** — `school`, `community`, `hybrid`, or `online`
- **OneLine**
- **LeadName**
- **Abstract**
- **OutputType** — must match one of the six exactly
- **StartedAt** — `YYYY-MM-DD`

If any of those is missing or misspelled, **the row is skipped** rather than
half-rendered. Nothing breaks, but the group will not appear. Open the browser
console to see exactly which row and which field.

### Allowed values

**Field** (exactly one):

```
Computer Science & AI
Health & Life Sciences
Engineering & Technology
Physical Sciences & Mathematics
Social Sciences
Humanities
Economics & Business
Environment & Sustainability
```

**Status**: `Recruiting`, `Full`, `In Progress`, `Completed`, `Archived`

**Setting**: `school`, `community`, `hybrid`, `online`

**OutputType**: `Policy brief`, `Literature review`,
`Survey or interview study`, `Regional data profile`,
`Community presentation`, `Access initiative`

**ReviewStatus**: `none`, `submitted`, `in review`, `published`.
Blank counts as `none`.

## 4. Change a status

Edit the **Status** cell. The site's behaviour follows automatically:

| Status | Appears in directory | Shows an Apply action |
| --- | --- | --- |
| `Recruiting` | yes | **yes** |
| `In Progress` | yes | no |
| `Full` | yes | no |
| `Completed` | yes, permanently | no |
| `Archived` | **no** — only via "Include archived" | no |

`Recruiting` is the only status that shows an Apply action. `Archived` is the
only status hidden by default.

## 5. Unpublish a group

Change **Published** from `yes` to `no`. It disappears on the next load.

Two ways to remove something, and they mean different things:

- **`Published` = `no`** — gone from the site, row kept in the Sheet. Use this
  for anything not ready, or published by mistake.
- **`Status` = `Archived`** — the group existed and ended. Still reachable
  behind the "Include archived" filter, and its brief page still works. Use
  this for a group that dissolved.

Do not delete rows to hide a group. Set `Published` to `no` instead — a deleted
row loses the record, and if anyone linked to that group's brief the link dies.

## 6. Add an image

Two columns, and **you need both**:

- **ImageSrc** — a path like `/images/research-groups/bus-study.jpg`
- **ImageAlt** — a description of what is in the photo

If either is blank, the card renders the typographic fallback block instead.
That fallback is a designed state, not a broken one — most groups will never
have a photo, and leaving these blank is fine.

The image file itself has to be committed to `public/images/` — that part does
need a deploy, because the Sheet holds the path, not the file. See
`public/images/README.md` for dimensions (16:9, at least 960×540) and the rules
on photographing students.

## 7. Methods and Milestones: use pipes

Both go in a **single cell**, separated by `|`:

```
Field observation at fixed stops | Comparison against published timetable | Distribution analysis
```

Spaces around the pipe are trimmed, so `A|B` and `A | B` are the same. Empty
entries are dropped, so a trailing pipe is harmless.

Do not use commas to separate them — a comma is a column break in CSV, and the
list would spill into the next column.

## 8. Abstract paragraphs

Press **Alt+Enter** (Option+Enter on Mac) inside the cell to make a line break,
twice to make a blank line. Blank lines become paragraph breaks on the brief
page. A single line break is ignored.

Two to three paragraphs reads best.

## 9. Slugs

The **Slug** is the group's URL: `/research-groups/<slug>`.

- Leave it blank and one is derived from the title.
- Fill it in to control the URL, which is worth doing for anything you will
  link to.
- **Do not change a slug once you have shared the link.** Changing it breaks
  every existing link to that brief.
- Two rows with the same slug: the second gets `-2` appended and a console
  warning. Give it a distinct slug.

## 10. If a column gets renamed

Columns are matched **by header name**, not position. So reordering columns is
safe, and renaming one is not.

- Rename a **required** column (`ProjectTitle`, `Field`, `Status`, `Setting`,
  `OneLine`, `LeadName`, `Abstract`, `OutputType`, `StartedAt`) and every row
  loses that field, so **every row is skipped**. The directory falls back to
  the seed data rather than going blank, which can look like nothing happened —
  check the console.
- Rename an **optional** column (`Location`, `SchoolOrCommunityName`,
  `ImageSrc`, `ImageAlt`, `MemberApplicationUrl`, `Methods`, `Milestones`,
  `MemberCount`, `Slug`, `ReviewStatus`) and just that field goes blank.

If the directory suddenly shows the old placeholder groups, a renamed or
deleted column is the first thing to check.

## 11. When something looks wrong

Open the browser console. Every skipped row is logged with its row number and
the reason, like:

```
[research groups] row 7 skipped: Field "Astrology" is not a known field
[research groups] row 12 skipped: missing LeadName, Abstract
[research groups] row 9: slug "bus-study" already used, using "bus-study-2"
```

The site falls back to the seed dataset if the Sheet is unreachable, times out,
returns an error page, or parses to zero published groups. Visitors see a
working directory either way — they are never shown a fetch error.

Common causes:

- **Nothing changed after an edit** — Google's CSV cache, up to ~5 minutes.
- **Directory shows placeholder groups** — Sheet unreachable, un-published, or
  a required column renamed.
- **One group missing** — that row failed validation. Console says why.
- **"Publish to web" was undone** — Google then serves an HTML error page
  instead of CSV, which is detected and treated as unreachable.

## 12. The two application forms

There are **two different Google Forms**, and they are for different people.

| Form | Who it is for | Where it is set |
| --- | --- | --- |
| **Research Group Application** | Someone who wants to **start** a group and lead it | `formUrl` on the Research Group Leader role in `src/data/openings.ts` |
| **Member application** | Someone who wants to **join** an existing group | `src/lib/memberApplication.ts` |

Every "Start a research group" button uses the first. Every "Apply to join" on a
specific group uses the second. They are never interchangeable — a prospective
member sent to the start form gets asked how they will recruit a team.

### The join action only appears on Recruiting groups

"Apply to join" shows on a group only when its **Status** is `Recruiting`.
Change the status to `Full`, `In Progress`, `Completed`, or `Archived` and the
join button disappears from both the card and the brief page. That is how you
close a group to new members: **change the Status, not the form.**

### How the prefill works

The join form's first question asks which group the applicant is applying to.
The site fills that in automatically by appending the group's **ProjectTitle** to
the form URL, so an applicant never has to pick from a list or type it correctly.

You do not need to do anything for this to work. It uses whatever is in the
ProjectTitle cell, so if you rename a group in the Sheet, the prefill follows.

Titles with spaces, colons, and ampersands are handled — they are URL-encoded,
so "Placeholder: Costs & Pricing" arrives intact rather than being cut off at
the ampersand.

### What breaks the prefill

The prefill is tied to the **identity of question 1** in the join form, not to
its wording. So:

- **Safe:** editing question 1's wording, its help text, or making it required.
- **Breaks it silently:** deleting question 1 and adding it back. Google issues a
  new field ID, and the group name then fills nothing.
- **Breaks it worse:** reordering questions so a different question is first.
  The group name lands in the wrong field.

If either happens, the fix is to get a fresh prefilled link from Google —
**Send → Get pre-filled link**, fill in the group-name field with any text, then
copy the link — and update `MEMBER_APPLICATION_BASE_URL` and
`MEMBER_APPLICATION_ENTRY_ID` in `src/lib/memberApplication.ts`. That is a code
change and a deploy.

Worth testing after any edit to the join form: open a Recruiting group's brief,
click "Apply to join", and check the group name is already filled in.

### Overriding the join form for one group

If a lead wants to run their own application form for their group, put its URL
in that group's **MemberApplicationUrl** cell. That group's "Apply to join" then
opens that URL instead of the shared form, and no prefill is attempted — their
form, their questions.

Leave the cell blank for every group that should use the shared form. That is
the normal case.

Note that a custom form gets no group-name prefill, so it should ask which group
the applicant means, or be specific to one group by its wording.

## 13. What still needs code

Everything else is the Sheet. These are not:

- The one-time CSV URL in `src/lib/groupsSource.ts`.
- Image **files** in `public/images/`.
- Adding a **new Field, Status, Setting, or OutputType** value. Those are unions
  in `src/data/research-groups.ts`, and a value outside them is rejected on
  purpose — it stops a typo from creating a ninth field.
