# Closing band heading

Commit `cf5f942` on `main`, pushed. Build (`tsc -b && vite build`) passes.

---

## What changed

One file, `src/components/Closing.tsx`. One heading.

```
- Lead an Atlas research group.
+ Pick a question you actually care about.
```

The `<h2>` keeps its classes (`type-section font-display`) and its position in
the ink band. Nothing else in the rendered output moved.

## What did not change

- **The button.** `<BringAtlasCta tone="paper" />` is untouched — same
  component, same `tone`, same position, same `mt-9` spacing. Its label is still
  "Lead an Atlas research group", read from the Principal Researcher opening
  rather than hardcoded, and it is still the one primary CTA on the page.
- The subhead, the "Takes about two minutes." line, the section `id="start"`,
  the ink band styling, the max-width, the padding.
- Every other file in the repo.

The diff is 12 insertions, 1 deletion — and 11 of those insertions are the
comment described below.

## The comment I added

The heading and the button are now different strings for a reason that is not
self-evident from reading either one, and the previous state of this file is
exactly what happens when that reason is not written down: the heading read
"Lead an Atlas research group this semester.", the fixed-term sweep removed
"this semester" as a factual correction, and the correction silently produced a
heading identical to its own button.

So the file now records the rule rather than just the result: the heading names
the **motive**, the button names the **action**. "Pick a question you actually
care about." is why someone presses it; "Lead an Atlas research group" is what
pressing it does. The comment says not to harmonise them and not to restore a
heading beginning "Lead" — because the obvious future edit is someone noticing
the mismatch and "fixing" it back.

---

## One thing to flag

**The heading and the subhead now both open with "Pick a question".** The band
reads:

> **Pick a question you actually care about.**
> Pick a question, recruit three or more members, and submit the finished paper
> for review. Free.

Two consecutive lines, same two opening words. The heading no longer collides
with the button, but it now collides with the line immediately under it instead.

I did not touch it. You said heading only, and this is the subhead — and unlike
the button duplication, this one is genuinely arguable: the repetition is an
echo rather than a restatement, since the subhead continues into "recruit three
or more members, and submit the finished paper for review", which the heading
does not say. Some copy uses that echo deliberately.

If you do want it gone, the smallest fix is dropping the subhead's first clause,
since the heading now covers it:

> Recruit three or more members and submit the finished paper for review. Free.

That is a one-line change and I can make it on request.
