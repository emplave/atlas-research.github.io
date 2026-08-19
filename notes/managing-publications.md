# Managing publications

Journal publications live in a Google Sheet. The site reads that Sheet at runtime.

**No code change and no deploy is needed to add a paper, edit one, change a
track, publish, or unpublish.** You edit the Sheet, reload the site, and the
change is there. The only thing that ever needs a code change is the one-time
setup in step 2.

This mirrors `notes/managing-research-groups.md` and `notes/managing-events.md`.
If you have set up either of those, this will be familiar.

---

## 1. Set the Sheet up

1. Open `notes/publications-template.csv` and import it into a new Google Sheet:
   **File → Import → Upload**, and choose **Replace current sheet**. That gives
   you the exact header row the site expects, plus two example rows — one per
   track.
2. **Both example rows arrive with `Published` set to `no`.** That is
   deliberate and different from the other two templates. The reviewed example
   would otherwise go live claiming to have completed peer review when
   nobody reviewed it. Leave them hidden, and set `Published` to `yes` only on
   rows holding a real paper.
3. Delete the two example rows once you have real papers. Do not delete the
   header row.
4. Do not rename, reorder, or delete columns. Order does not matter, but names
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

6. Paste it into `src/lib/publicationsSource.ts`, replacing `null`:

   ```ts
   export const PUBLICATIONS_CSV_URL: string | null =
     "https://docs.google.com/spreadsheets/d/e/2PACX-.../pub?gid=0&single=true&output=csv";
   ```

7. Commit and deploy that one change. **This is the only deploy you need.**
   After it, everything below is Sheet-only.

Until that URL is filled in, the site renders the fallback publication in
`src/data/publications.ts`, so nothing looks broken while you set up.

> Google caches published CSVs for a few minutes. A change can take up to about
> five minutes to appear. That is Google's cache, not the site's — reloading
> harder will not speed it up.

## 3. The columns

Sixteen columns, in this order in the template. Order does not matter to the
site; names do.

| Column | Required | Notes |
| --- | --- | --- |
| `Published` | yes | `yes` publishes. Anything else hides the row. |
| `Slug` | no | Blank derives one from `Title`. |
| `Title` | yes | |
| `Authors` | yes | Pipe-separated: `A. Author \| B. Author` |
| `Track` | yes | `working-paper` or `peer-reviewed`. No default. |
| `Field` | yes | Must match one of the eight exactly. |
| `Abstract` | yes | Blank lines separate paragraphs. |
| `FullTextUrl` | no | Google Drive link. Blank → "Full text coming soon". |
| `PublishedAt` | yes | `YYYY-MM-DD` |
| `ReviewedAt` | no | `YYYY-MM-DD`. **Peer-reviewed rows only.** |
| `Affiliation` | no | One line, e.g. a school or institution. |
| `ArticleType` | no | Free text, e.g. `Research article`. Shown as a chip. |
| `Keywords` | no | Pipe-separated. Rendered as chips. |
| `License` | no | **Verbatim.** No wording exists in the code. |
| `ConflictOfInterest` | no | **Verbatim.** |
| `EditorialNote` | no | **Verbatim.** Blank lines separate paragraphs. |

The last six are the publication-record fields, all optional — see section 6.

If a required field is missing or misspelled, **the row is skipped** rather than
half-rendered. Nothing breaks, but the paper will not appear. Open the browser
console to see exactly which row and which field.

### Allowed values

**Track** — exactly one of:

```
working-paper
peer-reviewed
```

There is no default. A blank `Track` skips the row, on purpose: guessing wrong
either hides a reviewed article or presents an unreviewed one as reviewed, and
neither is an acceptable guess.

**Field** — exactly one of the eight the site uses:

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

## 4. The two tracks, and what renders

The Journal keeps two tracks and never lets a reader mistake one for the other.

- **Working papers** are founding contributions from the Atlas team, published
  **without** peer review.
- **Peer-reviewed articles** have completed peer review.

A working paper must never render as reviewed. The site enforces that in two
places — the parser discards a review date on a working-paper row, and the
render layer ignores the field again on that track — so no single mistake can
put a review date on an unreviewed paper.

### What renders for each combination

| `Track` | `ReviewedAt` in the Sheet | Stored | Badge on the article page | Date shown |
| --- | --- | --- | --- | --- |
| `working-paper` | *(blank)* | `null` | Working paper | `Published <PublishedAt>` |
| `working-paper` | `2026-07-15` | `null` — **discarded, with a console warning** | Working paper | `Published <PublishedAt>` |
| `peer-reviewed` | `2026-08-20` | `2026-08-20` | Peer reviewed | `Reviewed 2026-08-20` |
| `peer-reviewed` | *(blank)* | `null` — warned | Peer reviewed | `Published <PublishedAt>` |
| `peer-reviewed` | `not-a-date` | `null` — warned | Peer reviewed | `Published <PublishedAt>` |

Reading the table:

- **Row 2 is the important one.** Typing a review date on a working paper does
  not promote it. The date is thrown away when the Sheet is read, and the
  console says so. If you meant it to be reviewed, change `Track` as well.
- **Row 4 still publishes.** A peer-reviewed article with no `ReviewedAt` is not
  skipped — it shows its published date instead, which is true of every record.
  The console warns so you can fill the date in.
- Lists are ordered by whichever date the row displays, newest first.

## 5. FullTextUrl: Google Drive links

Papers are PDFs on Google Drive. The column takes a **full URL**.

### Getting the link

1. Upload the PDF to Drive.
2. Right-click the file → **Share**.
3. Under **General access**, set **Anyone with the link** → **Viewer**.
4. Click **Copy link**. You get something like:

   ```
   https://drive.google.com/file/d/1AbC_dEf-123/view?usp=sharing
   ```

5. Paste that whole thing into `FullTextUrl`. Nothing else to do.

### What the site does with it

| What you paste | What the site renders |
| --- | --- |
| `https://drive.google.com/file/d/FILE_ID/view?usp=sharing` | `https://drive.google.com/uc?export=download&id=FILE_ID` |
| `https://drive.google.com/file/d/FILE_ID/view` | same rewrite |
| `https://drive.google.com/file/d/FILE_ID/preview` | same rewrite |
| `https://drive.google.com/uc?export=download&id=FILE_ID` | unchanged — already direct |
| `https://drive.google.com/drive/folders/...` | **link dropped.** Renders "Full text coming soon" |
| any other URL, e.g. `https://example.org/paper.pdf` | unchanged |
| blank, or `N/A` / `TBD` / `-` | no link. Renders "Full text coming soon" |

The rewrite exists so the PDF **downloads** rather than opening Drive's viewer.
The viewer is slow, needs JavaScript, and nags anonymous readers to sign in.

**Never paste a folder link.** A folder is not a paper — "Read the full paper"
pointing at a file browser is worse than no link at all, so the site drops it and
falls back to "Full text coming soon". Check the console if a link you expected
did not appear.

Pasting a link that is already in `uc?export=download` form is fine. Normalising
twice is a no-op, so you cannot break a working link by re-pasting it.

### Test every link in a private window

**This is the step people skip, and it is the one that matters.** A Drive link
works in your own browser because *you* are signed in and have access. A reader
does not.

1. Open a **private / incognito** window.
2. Paste the URL from the Sheet.
3. The PDF should download or open with no sign-in prompt.

If you get "You need access" or a sign-in screen, the file's sharing is still
restricted. Go back to step 3 above and set **Anyone with the link → Viewer**.
The site cannot detect this — the link will look fine and be dead for everyone
but you.

## 6. The publication record fields

Six optional columns feed the formal record on an article's page: `Affiliation`,
`ArticleType`, `Keywords`, `License`, `ConflictOfInterest`, `EditorialNote`.

**A blank cell omits the field and its label completely.** The page does not print
`License` followed by nothing. A record with all six blank renders as a shorter,
complete page — it does not look broken, and it does not look like something is
missing. So leave anything you do not have blank rather than filling it in to
"complete the record".

| Column | Where it appears | Format |
| --- | --- | --- |
| `Affiliation` | under the authors, in the record, in the sidebar | one line of text |
| `ArticleType` | a chip at the top, in the record, in the sidebar | free text, e.g. `Research article` |
| `Keywords` | its own Keywords section, as chips | pipe-separated |
| `License` | Publication details, and the sidebar | verbatim text |
| `ConflictOfInterest` | Publication details | verbatim text |
| `EditorialNote` | its own Editorial note section | verbatim, blank lines = paragraphs |

### License, ConflictOfInterest and EditorialNote are verbatim

**There is no default wording for these anywhere in the code, on purpose.**
Whatever you type is what appears; if you type nothing, nothing appears.

A licence is a legal grant. Software must not invent one on Atlas's behalf, so
the code contains no licence text to fall back on. The same goes for a conflict
of interest statement — it is a claim by the authors about themselves, and only
they can make it.

Write these yourself, or leave them blank.

### `ArticleType` is free text, not a fixed list

Unlike `Track` and `Field`, this is not validated. Whatever you type is shown as
a chip. Keep it short and keep it consistent between papers — `Research article`
on one and `research paper` on another will read as two different things.

`Track` and `ArticleType` are different: `Track` is the review standing and is
validated; `ArticleType` is what kind of piece it is.

## 7. The citation

**The citation is generated, not stored. There is no column for it.**

The format is:

```
Authors (Year). Title. The Atlas Journal. Retrieved from <the article URL>
```

For example:

```
A. Author, B. Author (2026). The title of the paper. The Atlas Journal. Retrieved from https://atlas-research.org/journal/your-slug
```

- **Year** is the year from `PublishedAt`, not `ReviewedAt`. That is the
  convention every citation style follows: the review date is a fact about the
  article's history, not its date of record.
- **Authors** are joined with commas, in the order you list them in the Sheet.
- **The URL** is built from the slug, so it is always the live address.

It is generated so it cannot go stale. A stored citation would keep the old title
after you fix a typo and the old URL after a slug change, and you would have to
retype it in the Sheet on every edit.

There is a **Copy citation** button at the top of the article and another beside
the citation block. Both copy the same string.

### No identifiers

There is **no article ID, no DOI, and no ISSN**, and none should be added to the
Sheet. Those are registrations with external bodies. Atlas does not hold them, and
printing one it does not hold would be a false claim about the Journal's standing.

## 8. Leave cells blank — never type "N/A"

Leave an optional cell **empty**. Do not type `N/A`, `NA`, `none`, `nil`, `TBD`,
`TBA`, `-`, or `null`.

Those are read as content. `N/A` in `FullTextUrl` would be a link to nothing.

The site skips these tokens — the same rule that stops a group's location line
reading `Online · N/A · Online` — comparing case-insensitively with whitespace
and punctuation stripped, so `N/A`, `n.a.` and ` NA ` all get dropped. **But an
empty cell is still the correct input.** Relying on the site to clean up after
you is worse, because a placeholder still sits in the cell, still looks like an
answer to whoever reads the Sheet next, and still has to be removed eventually.

## 9. Abstract paragraphs

Press **Alt+Enter** (Option+Enter on a Mac) twice inside the cell to make a blank
line. Blank lines become paragraph breaks on the site. A single newline does not.

Only the **first paragraph** is shown in the Journal list. The full abstract
appears on the paper's own page. Write the first paragraph so it stands alone.

## 10. Authors: use pipes

One cell, entries separated by `|`:

```
Placeholder Author | Placeholder Co-Author
```

Spaces around the pipe are trimmed. Blank entries and placeholder tokens are
dropped. A row with no usable author is skipped — an unattributed paper is not
publishable.

Do not invent authors, affiliations, or credentials. Write the names as the
authors want them printed.

## 11. Slugs

The slug is the URL: `/journal/your-slug`.

Leave `Slug` blank and one is derived from the title. Set it explicitly when you
want a stable, short URL — worth doing, because **changing a slug breaks every
link anyone has shared to that paper.** Set it once, before you publish, and
leave it.

Duplicate slugs get a numeric suffix and a console warning.

## 12. Unpublish a paper

Set `Published` to anything other than `yes`. Blank works.

The paper disappears from the Journal and its page 404s. Nothing is deleted, so
setting it back to `yes` restores it exactly.

Consider whether you should. A paper that has been public and cited should
normally stay up; withdrawing one is a real editorial act, not a tidy-up.

## 13. If a column gets renamed

Columns are matched by **name**, not position. Reordering them is safe. Renaming
one is not.

- A renamed **required** column (`Title`, `Track`, `Field`, `Abstract`,
  `PublishedAt`, `Authors`) makes every row fail that check, so every row is
  skipped and the Journal falls back to the seed data.
- A renamed **optional** column (`Slug`, `FullTextUrl`, `ReviewedAt`,
  `Affiliation`, `ArticleType`, `Keywords`, `License`, `ConflictOfInterest`,
  `EditorialNote`) silently goes blank. Papers still appear, just without that
  field — and because a blank field is omitted rather than shown empty, a renamed
  optional column looks exactly like a cell you left blank. If a field you filled
  in is not showing, check the header spelling first.

Nothing crashes either way. Fix the header name and reload.

## 14. When something looks wrong

**Open the browser console first.** Every skipped row and every dropped value is
logged there, prefixed `[publications]`, with the row number and the reason.

| Symptom | Likely cause |
| --- | --- |
| A paper does not appear | `Published` is not `yes`, or a required field is missing. Console names it. |
| Journal shows the placeholder paper | Sheet unreachable, un-published, or every row was skipped. |
| "Full text coming soon" on a paper that has a PDF | `FullTextUrl` blank, a placeholder token, or a folder link. |
| Link works for you, not for readers | File sharing is not "Anyone with the link". Test in a private window. |
| A working paper shows no review date | Correct and deliberate. Working papers are not reviewed. |
| A reviewed article shows "Published" not "Reviewed" | `ReviewedAt` is blank or not `YYYY-MM-DD`. |
| A field you filled in is missing from the article | Header renamed or misspelled, or the cell holds a placeholder token like `N/A`. |
| No Keywords section | `Keywords` is blank. The whole section is omitted, by design. |
| No License or Conflict of interest line | Those cells are blank. There is no default wording. |
| Copy button says "Copy failed" | The browser blocked clipboard access. Select the citation text and copy it manually. |
| Changes not showing | Google's CSV cache. Wait about five minutes. |

The site never shows a visitor a parse error. A broken Sheet degrades to the
fallback publication; it does not produce a broken page.

## 15. What still needs code

Sheet-only, no deploy:

- adding, editing, unpublishing a paper
- changing a track, a field, a date, an author list
- adding or replacing a PDF link
- affiliation, article type, keywords
- licence terms, the conflict of interest statement, the editorial note

Needs a code change:

- the one-time CSV URL in step 2
- adding a new `Field` to the eight
- adding a third track
- the citation format, and the review status wording — the wording lives in
  `REVIEW_STATUS` in `src/data/publications.ts`, one constant per track, so that
  the Journal index and the article page cannot drift apart
- showing the working-papers section at all — it is currently behind
  `SHOW_WORKING_PAPERS` in `src/lib/flags.ts`, which is `false`. While it is
  off, working-paper rows are parsed but neither listed nor reachable by URL.
  Peer-reviewed rows are unaffected.
