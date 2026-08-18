# Phase 13 — member application wired to every research group

Branch: `chapters-rebuild`. Prior: … P10 `026eca6` · P11 `cd417d8` · P12 `94a48c1`.

Verification: `tsc --noEmit` clean, `vite build` succeeds, `npm run dev` starts clean (200 on
all nine routes, no warnings), **27/27 checks pass** (13 render/audit + 14 URL encoding).

---

## 1. `src/lib/memberApplication.ts`

Three exports, as specified:

- `MEMBER_APPLICATION_BASE_URL` — the given URL, ending in `=`.
- `MEMBER_APPLICATION_ENTRY_ID` — `"244092308"`.
- `memberApplicationUrl(group)` — the base URL plus the `encodeURIComponent`'d
  `projectTitle`, or the group's own `memberApplicationUrl` when the Sheet supplies one.

The entry-ID comment distinguishes the two ways the prefill breaks, because they fail
differently and one is silent:

- Deleting and re-adding question 1 issues a **new** field ID, so the group name fills
  nothing at all.
- Reordering questions keeps the ID resolving but lands the group name **in the wrong
  field** — worse, because it looks like it worked.

Editing question 1's *wording* is safe. Editing its *identity* is not.

The parameter type is structural (`Pick<ResearchGroup, "projectTitle"> & { memberApplicationUrl?: … }`)
rather than the full record, so it works with both fallback and Sheet-derived groups.

I also added `memberApplicationUrl?: string | null` as an optional field on the base
`ResearchGroup` type. Without it the override was carried by `SheetResearchGroup` but invisible
to the card and brief, which are typed against `ResearchGroup` — so the per-group override
would have parsed correctly out of the Sheet and then been silently ignored at the point of
use.

## 2. Form audit — two wrong pointers found and fixed

I audited every `<a href>` on every route by label, rather than only checking the two files I
expected to change. **Exactly two actions pointed at the wrong form**, and both were the ones
this phase targets:

| Location | Label | Was pointing at | Now |
| --- | --- | --- | --- |
| `ResearchGroupCard.tsx:183` | "Apply to join" | start-a-group form | member form |
| `ResearchGroupBrief.tsx:174` | "Apply to join" | start-a-group form | member form |

Everything else was already correct: Hero, Nav, Closing, the directory's start band, its
empty-state CTA, and "Apply to lead a group" all point at the Research Group Leader opening;
Get Involved's per-role buttons point at their own role forms.

The audit output, which I kept in the test rather than reasoning about it by hand:

```
ok   JOIN   Apply to join           -> member form          (/)
ok   JOIN   Apply to join           -> member form          (/research-groups)
ok   JOIN   Apply to join           -> member form          (/research-groups/placeholder-transit-reliability)
ok   START  Start a group           -> start-a-group form   (/)
ok   START  Apply to lead a group   -> start-a-group form   (/research-groups)
…19 actions, all correct
```

Both components dropped their `findOpening("chapter-leader")` import entirely, so the join path
no longer has any reference to the start form to regress toward.

**One behaviour change worth naming.** The join actions previously inherited the start form's
"Opening soon" disabled state from `isFormPending(opening)`. That state is now gone from the
join path: the member form is a constant, not a nullable field, so there is nothing to be
pending. Closing a group to new members is done by changing its **Status** away from
`Recruiting`, which removes the button — documented in the new docs section.

`canApply()` still gates the action, so only `Recruiting` groups show it. Asserted: the join
count on the directory equals the recruiting-group count, and a non-recruiting brief renders no
join action.

## 3. What happens next

On the brief, under the join button:

> This group's lead reviews applications and decides who joins.

One sentence, no response time. A comment records why: leads are students, and a promised
turnaround nobody owns becomes a broken promise. A check asserts no response-time language
crept in.

## 4. Docs

`notes/managing-research-groups.md` gains section 12, "The two application forms": a table of
which form is for whom and where each is set, how the prefill works and that it follows a
renamed ProjectTitle automatically, the safe-vs-breaking edits to question 1 with the recovery
steps (**Send → Get pre-filled link**), and how to override the join form for a single group
via `MemberApplicationUrl`.

Two things I added beyond the brief because an operator will hit them: that closing a group to
members is a **Status** change rather than a form change, and that a custom override form gets
no prefill, so it needs to ask which group the applicant means.

## 5. Encoding verified

The required case — a title with both an ampersand and a colon:

```
title : Placeholder: Costs & Pricing in Open-Air Markets
url   : …/viewform?usp=pp_url&entry.244092308=Placeholder%3A%20Costs%20%26%20Pricing%20in%20Open-Air%20Markets
```

Colon → `%3A`, ampersand → `%26`, spaces → `%20`. Checked structurally, not just by eye:
`new URL(...).searchParams.get("entry.244092308")` returns the **exact original title**, there
is exactly one raw `&` in the whole URL (the `usp` separator), and none after the entry
parameter. All six seeded titles round-trip.

The unencoded ampersand is the real failure mode here: a raw `&` would terminate the query
parameter and Google would receive "Placeholder: Costs" with the rest dropped.

---

## Verification

```
PASS  every join action targets the member form
PASS  no join action targets the start form
PASS  every start action targets the start form
PASS  no start action targets the member form
PASS  join count equals recruiting-group count on the directory
PASS  non-recruiting brief shows no join action
PASS  prefill carries the group title, encoded
PASS  brief states who decides
PASS  no response time promised
PASS  helper honours a per-group override
…all 13 render checks + 14 encoding checks passed
```

Three checks failed on first run. All three were artifacts of my own harness reading raw
serialised HTML, where React writes `&amp;` in hrefs and `&#x27;` in text — the browser DOM has
neither. Added entity decoding to the harness; no product code was at fault.

---

## Open

- **`reach.ts`** still asserts a real fellow in each of 20 countries. Unverifiable by me,
  ships visible. Unchanged since Phase 7.
- **The member form's question 1 has not been exercised end to end** — I verified the URL is
  correctly formed and round-trips, but not that Google accepts this specific entry ID against
  the live form. Worth one manual click: open a Recruiting group's brief, hit "Apply to join",
  and confirm the group name is prefilled.
- **"Research Group Leader" vs "Research Group Lead"** — still unrenamed, from Phase 11.
