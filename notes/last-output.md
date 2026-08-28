# Closing band subhead

Commit `bc0a2f0` on `main`, pushed. Build (`tsc -b && vite build`) passes.

---

## What changed

One file, `src/components/Closing.tsx`. One paragraph.

```
- Pick a question, recruit three or more members, and submit the finished
- paper for review. Free.
+ Recruit three or more members and submit the finished paper for review.
+ Free.
```

Note the second edit inside the sentence: dropping the leading clause turned a
three-item list into a two-item one, so the Oxford comma after "members" went
with it. "Recruit three or more members and submit the finished paper for
review." is the two-verb version; leaving the comma in would have punctuated a
list that no longer exists.

The `<p>` keeps its classes (`mt-5 text-lg text-paper/75 leading-relaxed`) and
its position between the heading and the button.

## What did not change

- **The heading.** Still "Pick a question you actually care about.", same `<h2>`,
  same `type-section font-display`.
- **The button.** Still `<BringAtlasCta tone="paper" />` — same component, same
  position, same `mt-9` spacing, label still "Lead an Atlas research group" read
  from the Principal Researcher opening. Still the one primary CTA.
- The "Takes about two minutes." line, `id="start"`, the ink band styling, the
  max-width and padding.
- Every other file in the repo.

## The band as it now reads

> **Pick a question you actually care about.**
> Recruit three or more members and submit the finished paper for review. Free.
> `[ Lead an Atlas research group ]`
> Takes about two minutes.

Three steps, each stated once and in order: the question in the heading, the
members and the submission in the subhead. The echo is gone and nothing was
lost — "pick a question" still appears, it just appears once now.

## The comment I added

Six lines, recording why the subhead starts where it does. This is the third
edit in a row to this band, and each one was caused by the previous one:

1. Removing "this semester" (factual — no fixed term) left the heading identical
   to its own button.
2. Replacing the heading with "Pick a question you actually care about." fixed
   that and left the heading echoing the subhead's opening clause.
3. This edit removes the clause.

None of those were mistakes on their own; each was a correct local fix whose
knock-on effect landed one line away. So the file now says the two lines are
sequential rather than independent — the subhead picks up at the step the
heading leaves off at — and tells the next person to re-check the handoff if the
heading changes again. Without that, the natural future edit is someone
restoring "Pick a question" to the subhead to make it read as a complete
three-step sentence, which is exactly what was just removed.

---

## Nothing to flag

The band has no remaining internal repetition that I can see: no word or phrase
appears in more than one of the four lines, and the heading, subhead, button and
reassurance line each do a different job. This was the last of the three
knock-on effects.
