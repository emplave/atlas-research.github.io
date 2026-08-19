# Journal article page: review wording, and a publication record layout

Branch **`journal-article-record`**, one commit. Not merged to main, not pushed.

(No commit hash cited: this report is inside the commit that would name it, so any hash written here
is wrong the moment the commit is amended. `git log -1 journal-article-record` is the authority.)

---

## CHANGE 1 — review status wording

### The new wording

```
This article completed peer review. It was evaluated by the Atlas research and
editorial team against the Journal's published criteria.
```

### It now lives in one constant per track

`REVIEW_STATUS` in `src/data/publications.ts` — three strings per track, because three different
lengths were needed in three places and separate literals are how the drift started:

| | `peer-reviewed` | `working-paper` |
| --- | --- | --- |
| `chip` | Peer reviewed | Working paper |
| `short` | Completed peer review | Not peer reviewed |
| `statement` | *the sentence above* | This is a working paper. … It has not been through peer review. |

It **was** duplicated. The article page carried the full statement and the Journal index carried its
own separate wording of the same claim (`Not externally peer reviewed`, plus a disclosure paragraph).
Both now read the constant, so there is no second copy to update.

### Every hit, as requested

**`"external peer review"` — 10 hits:**

| File | Line | Disposition |
| --- | --- | --- |
| `src/pages/JournalArticle.tsx` | 101, 106 | replaced by `REVIEW_STATUS[track].statement` |
| `src/pages/Journal.tsx` | 63, 81 | comment + disclosure paragraph, "external" removed |
| `src/data/publications.ts` | 18, 131 | comments, "external" removed |
| `public/llms.txt` | 46 | copy, "external" removed |
| `notes/managing-publications.md` | 23, 116 | docs, "external" removed |
| `scripts/generate-sheet-template.mjs` | 174 | comment, "external" removed |

**`"external review"` — 8 hits:**

| File | Line | Disposition |
| --- | --- | --- |
| `src/pages/Journal.tsx` | 44 | intro copy, "external" removed |
| `src/data/publications.ts` | 23, 45, 95 | comments, "external" removed |
| `public/llms.txt` | 47 | copy, "external" removed |
| `notes/managing-publications.md` | 117 | docs, "external" removed |
| `scripts/generate-sheet-template.mjs` | 220 | placeholder title, "external" removed |
| `notes/publications-template.csv` | 7 | regenerated from the script |

**`"externally"` — 4 further hits**, all the same claim in adjective form, all updated:
`src/pages/Journal.tsx:74`, `src/lib/flags.ts:25`, `src/data/publications.ts:76` (seed abstract),
`scripts/generate-sheet-template.mjs:210`.

**Deliberately left:** `public/apply.html:17` and `public/robots.txt:4` both say "external links",
which is an unrelated sense of the word. And the comment in `REVIEW_STATUS` explaining *why*
"external" is absent necessarily contains it — the same exemption the redirect comment in `seo.ts`
has.

Verified: **zero** occurrences of "external" remain in shipping source or user-facing copy, other
than that explanatory comment.

### One decision beyond the literal instruction

You asked me to remove "external" from the **peer-reviewed** copy. I removed it from the
**working-paper** copy too: `has not been through external peer review` → `has not been through peer
review`.

Reason: once reviewed articles no longer claim *external* review, contrasting a working paper against
"external peer review" implies an external tier that does not exist, and it would have reintroduced
exactly the inconsistency the single-constant requirement is meant to prevent. Easy to revert if you
disagree — it is one string in one place now.

---

## CHANGE 2 — the publication record layout

`/journal/:slug` rebuilt. Existing design system only: monochrome tokens, Instrument Serif via
`font-display`, Archivo body. Verified mechanically — **0 raw hex colours, 0 non-token colour
utilities**; the only colour/font classes used are `bg-ink`, `bg-ink-hover`, `bg-line`, `bg-paper`,
`bg-surface`, `border-line`, `text-faint`, `text-ink`, `text-muted`, `text-paper`, `font-display`.

### Structure, in order

1. **Breadcrumb** — The Atlas Journal / article title. Current page is not a link, and truncates at
   `18rem` so a long title does not wrap to three lines on a phone.
2. **Status chips** — article type (omitted when blank), then track.
3. **Title → Authors → Affiliation**, then the record: Authors, Affiliation, Article type, Field,
   Publication date, Review date.
4. **Action row** — Open PDF (or the disabled "Full text coming soon"), Copy citation, Copy link.
5. **Review standing block** — the `statement` for the track.
6. **Abstract** `#abstract`
7. **Keywords** `#keywords`, as chips
8. **Citation** `#citation`, bordered block with its own copy button
9. **Publication details** `#details` — Full text, Review status, License, Conflict of interest
10. **Editorial note** `#editorial-note`
11. **Back to The Atlas Journal**
12. **Right sidebar** — the record fields repeated, plus "On this page" anchors

### The sidebar

`grid lg:grid-cols-[1fr_18rem]` with `order-1 lg:order-2` on the aside, so it sits **above** the
content on mobile and **right** of it on desktop, sticky at `lg:top-24`. The anchor list is built from
the sections that actually exist, so a paper with no keywords and no editorial note gets three
anchors, not five pointing at two dead ids. Headings carry `scroll-mt-24` so an anchor jump does not
tuck the heading under the sticky nav.

### Copy buttons

`navigator.clipboard.writeText`, confirming "Copied" for 2s. Failure is **surfaced as "Copy failed"**
rather than swallowed — `navigator.clipboard` is unavailable in a non-secure context and can be
permission-denied, and a copy button that silently does nothing is worse than one that admits it. The
timer is cleared on unmount and before replacement, so navigating away mid-confirmation cannot set
state on an unmounted component. `aria-live="polite"` so the confirmation is announced.

### Omit-when-blank

Every optional field renders through `RecordRow` / `SidebarRow`, which **return `null` when the value
is empty** — label included. Verified against the template: the sparse row reports
`OMITTED (label+value hidden): affiliation, articleType, license, conflictOfInterest, editorialNote`
and `keywords section rendered: false`. The full row omits nothing.

---

## New Sheet columns

You named three. I added **six**, because your rules also required licence and conflict of interest to
be Sheet-driven optional columns, and the Editorial Note section needs a source — writing that content
in code would have meant authoring editorial and licence language, which the rules forbid.

| Column | Renders as |
| --- | --- |
| `Affiliation` | under the authors, in the record, in the sidebar |
| `ArticleType` | chip at top, in the record, in the sidebar |
| `Keywords` | Keywords section, pipe-separated → chips |
| `License` | Publication details + sidebar, **verbatim** |
| `ConflictOfInterest` | Publication details, **verbatim** |
| `EditorialNote` | Editorial note section, **verbatim** |

`EditorialNote` is my inference rather than your instruction — flagging it as the one column you did
not name.

All six are optional and parsed with `cleanOrNull`, so `N/A` and `TBD` become absent rather than
printing as content. **No wording for the last three exists anywhere in the code.** Blank means the
field is absent, full stop; there is no fallback text to invent a licence Atlas never granted.

**Full header row, 16 columns:**

```
Published,Slug,Title,Authors,Track,Field,Abstract,FullTextUrl,PublishedAt,ReviewedAt,Affiliation,ArticleType,Keywords,License,ConflictOfInterest,EditorialNote
```

Added to the schema, `scripts/generate-sheet-template.mjs`, and
`notes/managing-publications.md` (new §6 "The publication record fields", new §7 "The citation";
subsequent sections renumbered to §15).

---

## Citation

Generated, never stored. No column for it.

```
Authors (Year). Title. The Atlas Journal. Retrieved from <canonical URL>
```

Real output from the live Sheet's article:

```
Hamaad Mahmood (2026). The Political Disinformation Epidemic: How Algorithms and Cable News Drive US
Polarization. The Atlas Journal. Retrieved from
https://atlas-research.org/journal/the-political-disinformation-epidemic-how-algorithms-and-cable-news-drive-us-pol
```

The **year comes from `PublishedAt`, not `ReviewedAt`** — confirmed on the template's reviewed row,
which has `publishedAt 2026-09-01` and `reviewedAt 2026-08-20` and cites `(2026)` from the former.
That is the convention every citation style follows: the review date is a fact about the article's
history, not its date of record.

The URL uses `SITE_ORIGIN` from `src/lib/seo.ts`, so it is the apex host and stays correct if the
canonical host changes again.

**No article ID, no DOI, no ISSN, no impact factor, no invented licence terms.** Nothing was added
that would imply a registration Atlas does not hold.

---

## Backward compatibility — checked, because it would have been easy to break

**The live Sheet still has only 10 columns.** The new code expects 16. Run against the real live CSV:

```
live sheet header cells: 10
missing new columns: Affiliation, ArticleType, Keywords, License, ConflictOfInterest, EditorialNote
rows parsed: 1  (must still be 1)
  track peer-reviewed | displays "Published 2026-03-09"
  new fields all absent: true
  chip shown: "Peer reviewed"
```

Missing columns read as empty via `headerReader` → `null` → omitted. **The live article keeps working
with no Sheet change**, just without the new fields. Add the six columns when you want them.

That existing warning is still outstanding and unrelated to this work:

```
[publications] row 2: ReviewedAt "27 April 2026" is not a valid YYYY-MM-DD date
```

The three Sheet fixes from last time still apply — `ReviewedAt` → `2026-04-27`, set an explicit
`Slug`, and break the abstract into paragraphs.

---

## Checks

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 737ms
                   dist/index.html                   5.19 kB │ gzip:   1.97 kB
                   dist/assets/index-C_Hba8Vt.css   26.91 kB │ gzip:   6.11 kB
                   dist/assets/index-kQbDCK77.js   356.72 kB │ gzip: 110.98 kB
```

Also verified by executing the real parser: `REVIEW_STATUS` contains no "external" on either track;
the 16-column template parses with the sparse row omitting five fields and the full row omitting none;
citations generate correctly for both tracks.

`SHOW_WORKING_PAPERS` untouched at `false`.

## Not verified

The rendered page. I cannot drive a browser, so the layout — sidebar collapsing above content at the
`lg` breakpoint, sticky behaviour, anchor scrolling, and the copy-button confirmation — is verified by
type-check, build, and construction rather than by looking at it. **Worth loading
`/journal/<slug>` and checking on both a wide window and a phone width before merging.**

Note that with the live Sheet as it stands the page will show a fairly sparse record: no article type
chip, no keywords, no licence, no conflict statement, no editorial note, and "Published" rather than
"Reviewed". That is correct behaviour for blank cells, not a layout fault — fill the columns in to see
the full record.
