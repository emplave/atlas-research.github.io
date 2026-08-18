# Working Papers hidden behind a flag

Branch `chapters-rebuild`, PR #2. `tsc --noEmit` clean, `vite build` succeeds, all routes serve
with no dev warnings, **38 checks pass** (27 hidden-state, 11 restore-path).

---

## I could not push this to main, and it is not only the standing rule

You asked me to commit and push to main. **Main does not contain the journal.** Checked rather
than assumed:

```
src/pages/Journal.tsx           ABSENT on main
src/pages/JournalArticle.tsx    ABSENT on main
src/data/publications.ts        ABSENT on main
src/pages/Publish.tsx           on main        ← the old page it replaced
/journal route                  not on main
```

There is nothing on main to add this flag to. `Journal.tsx`, `JournalArticle.tsx` and
`publications.ts` exist only on `chapters-rebuild`, still behind PR #2. A commit to main would
either add three orphan files with no route, or fail to apply at all.

So the work is on `chapters-rebuild` and pushed there, which also keeps your standing "never
commit directly to main" rule from the original plan. **The flag reaches production when PR #2
merges** — see the question at the end.

## 1. The flag

`src/lib/flags.ts`, a new file, so it is the obvious place to look rather than buried in a
component or a data file:

```ts
export const SHOW_WORKING_PAPERS = false;
```

The comment states that flipping it to `true` is the only change needed, lists exactly what
happens while it is `false`, and names every file that still holds the hidden code so nobody
concludes the feature was deleted.

## 2. Nothing from the track renders

With the flag off, `/journal` renders no working-papers heading, no "Not externally peer
reviewed" badge, no disclosure paragraph, no cards, and no empty state. The section is wrapped in
`{SHOW_WORKING_PAPERS && ( … )}` rather than having pieces removed, so the whole block is intact
in the source.

The peer-reviewed track and all the review-process content are untouched: the three steps, the
six criteria, and the revision and rejection copy all still render exactly as before.

## 3. Direct URLs 404

`/journal/placeholder-working-paper` now renders the not-found page.

This mattered more than it might look. The Journal no longer links to that paper, but the slug is
guessable and the record is still in `publications.ts`, so without the check the page would have
stayed live by direct URL — a published claim with no route into it. 404 is the honest answer:
as far as the site is concerned it is not published. Peer-reviewed articles are unaffected.

## 4. Nothing deleted, and the restore path is proven

The `Publication` type, `publications.ts` and its seeded paper, `workingPapers()`,
`peerReviewedArticles()`, `findPublication()`, `JournalArticle.tsx`, and the "not externally peer
reviewed" disclosure copy are all still present. Asserted, including by reading the source files
back to confirm the copy strings survive.

I did not just claim one boolean restores it — **I flipped the flag to `true`, re-rendered, and
checked**, then flipped it back:

```
SHOW_WORKING_PAPERS = true  (temporarily flipped)

PASS  heading restored                    PASS  badge restored
PASS  disclosure paragraph restored       PASS  working-paper card restored
PASS  link to the paper restored          PASS  intro back to 'two separate tracks'
PASS  reviewed section border-t restored  PASS  peer-reviewed track still intact
PASS  article page renders instead of 404
PASS  working-paper standing stated on the article

all 11 restore checks passed
```

## 5. Two layout problems hiding the section would have caused

Neither was visible from the instruction, and both would have made the page read as broken.

**The intro copy advertised the missing section.** It opened *"The Journal runs two separate
tracks. Working papers are founding contributions from the Atlas team…"* — describing, in the
first paragraph, a section that is no longer on the page. That is worse than a gap: it tells the
reader something is missing. The intro is now conditional and, while the flag is off, reads:

> The Journal publishes student research that has completed external review. The first reviewed
> issue has not been published yet, so what follows is how review actually works.

That also gives the process content a reason to be there, rather than leaving it as the only
thing on a page that promised two tracks.

**The hairline would have doubled.** The header carries `border-b border-line` and the
peer-reviewed section carried `border-t border-line`. With the working-papers section gone those
two rules became adjacent — a visible double line under the header. The `border-t` is now applied
only when a section actually precedes it.

Both revert with the flag. Verified in the restore pass above.

## The page reads as complete

Rendered reading order with the flag off:

```
The Atlas Journal
Student research, published in the open.
The Journal publishes student research that has completed external review. The first
  reviewed issue has not been published yet, so what follows is how review actually works.
Peer-Reviewed Articles — First issue not yet published
01 Submission / 02 Review / 03 Decision
What review looks for — six criteria
What revision means / What rejection means
```

No dangling heading, no orphan reference, and no mention of working papers anywhere — asserted,
not eyeballed. It reads as a page about how review works, which is what it now is.

---

## One thing to decide

This flag is on `chapters-rebuild`, so **it does not affect the live site until PR #2 merges**.
The live site currently runs main, which has the old `Publish.tsx` and no `/journal` at all — so
there is no working-papers section in production to hide right now.

If the intent was "make sure Working Papers is not visible when the rebuild goes live", that is
done. If the intent was "hide something visible on atlas-research.org today", nothing there
matches — tell me what you are seeing and I will look.

I have not merged PR #2. Say the word if you want it merged.
