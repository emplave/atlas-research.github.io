# Principal Researcher rename; responsibilities trimmed

Both done. `npx tsc --noEmit` clean, `npx vite build` clean.

---

# ITEM 1 — Renamed to Principal Researcher

## Every instance found, and what happened to it

| File | Line | Was | Now |
| --- | --- | --- | --- |
| `src/data/openings.ts` | 113 | `title: "Research Group Leader"` | `title: "Principal Researcher"` |
| `src/data/openings.ts` | 27 | `chapter: "Research Group"` *(category label)* | `chapter: "Principal Researcher"` |
| `src/data/openings.ts` | 115 | `area: "Research Group leadership"` | `area: "Research group leadership"` |
| `src/data/openings.ts` | 313 | comment: "the Research Group Leader pathway" | "the Principal Researcher pathway" |
| `src/data/openings.ts` | 24 | doc comment: *the site reads "Research Group" everywhere* | rewritten — it named the old label |
| `src/data/openings.ts` | 9 | doc: `category "chapter" — the student who runs a local group` | now names the role |
| `src/lib/memberApplication.ts` | 8 | "the Research Group Leader opening in…" | "the Principal Researcher opening in…" |
| `src/components/BringAtlasCta.tsx` | 26 | "read from the Research Group Leader opening" | "read from the Principal Researcher opening" |
| `notes/managing-research-groups.md` | 267 | "`formUrl` on the Research Group Leader role" | "…on the Principal Researcher role" |

**Zero occurrences of "Research Group Leader" remain anywhere in the repo.**

Confirmed live:

```
CATEGORY_LABEL: {"chapter":"Principal Researcher","team":"Atlas Student Team"}

/get-involved, Principal Researcher pathway:
  heading (label) : Principal Researcher
  card title      : Principal Researcher
  area            : Research group leadership
  slug (internal) : chapter-leader   <- unchanged on purpose
```

`/research-groups` already said Principal Researcher, so all three now agree.

## Two judgement calls

**`slug: "chapter-leader"` is unchanged.** It is an internal identifier, not display copy, and `openings.ts` documents that deliberately. Changing it would change the form's identity key for no reader-visible benefit. Same reasoning as the `category: "chapter"` value, which also stays.

**`area` lowercased to "Research group leadership".** It never contained the role name, so it did not strictly need to change — but "Research Group" was capitalised as a proper-noun label to match the old category label, and that label is gone. It renders uppercased through `.meta-label`, so this is invisible on the page; it just stops the file implying a label that no longer exists.

## One consequence you should decide on

**The pathway heading and the card title are now the same string.** On `/get-involved` the chapter pathway renders:

```
Principal Researcher          ← RoleGroup heading, from CATEGORY_LABEL.chapter
  ┌────────────────────────
  │ Principal Researcher     ← the card's own title
  │ RESEARCH GROUP LEADERSHIP
```

You asked for the category label renamed, so I renamed it — but with exactly one opening in that pathway, the words appear twice in a row. I noted in the code that this is intentional rather than an oversight, since the alternative was inventing a second name for one thing.

If it reads badly, the cleanest fix is to **drop the heading when a pathway has one opening whose title matches the label** — a two-line change in `RoleGroup`. I did not do it because it changes layout you did not ask me to touch. The other option is a distinct pathway name ("Lead a group", "Start a group"), which reintroduces the second name.

---

# ITEM 2 — Responsibilities trimmed, criteria removed

## The four responsibilities, exactly as specified

```
Recruit your members and pick your question
Run the meetings and keep the log current
Check sources and citations before anything goes out
Submit the finished work for review
```

Down from seven. The three dropped were "Find somewhere to meet, in person or online", "Narrow the question until it is answerable", and "Tell Atlas early when something slips".

## "What we look for" removed — scoped to this role only

`lookingFor` is now `[]` on the Principal Researcher opening. The five removed criteria were:

```
You finish things
You write clearly
You can run a group without controlling everyone in it
You take feedback without arguing
You say when you are behind instead of going quiet
```

**The five Atlas Student Team openings keep theirs**, verified:

```
Regional Youth Director    resp=5  lookingFor=5 -> two columns
Logistics Analyst Intern   resp=5  lookingFor=4 -> two columns
Marketing Associate        resp=4  lookingFor=4 -> two columns
Social Media Manager       resp=5  lookingFor=4 -> two columns
Youth Research TA          resp=5  lookingFor=4 -> two columns
```

That scoping is deliberate and I recorded the reasoning in the data file: those are applications to join a team that selects, where stated criteria are fair warning. This one is a student deciding whether to run a group at all, and a list of ways to be found wanting at that moment reads as a warning notice rather than an offer.

## The layout adapts rather than being hardcoded

`RoleCard` was `grid gap-6 md:grid-cols-2` with both lists unconditionally. It now drops the second column **and** collapses to a single column when `lookingFor` is empty:

```tsx
<div className={cn("mt-6 grid gap-6", opening.lookingFor.length > 0 && "md:grid-cols-2")}>
  <BulletList title="Responsibilities" items={opening.responsibilities} />
  {opening.lookingFor.length > 0 && (
    <BulletList title="What we look for" items={opening.lookingFor} />
  )}
</div>
```

Both halves matter. Hiding the list alone would have left the responsibilities in a half-width column with dead space beside them; collapsing the grid alone would have left an empty "What we look for" heading. Driving it off `lookingFor.length` rather than off the slug means the next role that omits criteria gets the same treatment for free.

## Kept, as instructed

- **The summary paragraph**, verbatim: *"You pick the question and recruit the members. Atlas gives you the structure, a mentor to check your work, and somewhere to submit it at the end. Groups run three or more members over one semester; three is a minimum, not a cap. You are responsible for whether it finishes."*
- **The deadline** — `null`, so it renders "Rolling", along with the Rolling status chip.
- `selectivity` and `commitment` are both `null` on this role and were already omitted from the card.

---

## Files changed

```
M  src/data/openings.ts                title, category label, area, 4 responsibilities,
                                       lookingFor emptied, three comments
M  src/pages/GetInvolved.tsx           RoleCard adapts to one column; cn imported
M  src/lib/memberApplication.ts        comment
M  src/components/BringAtlasCta.tsx    comment
M  notes/managing-research-groups.md   form-routing table
```

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 724ms
                   dist/index.html                   5.82 kB │ gzip:  2.23 kB
                   dist/assets/index-lZLwxEDb.css   26.52 kB │ gzip:  6.07 kB
                   dist/assets/index-yN4Vdclv.js   337.10 kB │ gzip: 106.40 kB
```

Ran the openings data through its own selectors to confirm the rename, the four responsibilities, the single-column path, and that the team pathway is untouched.

## Not verified

The rendered page. Two things worth a look: the doubled "Principal Researcher" heading described above, and the single-column responsibilities block at desktop width, where four short items now sit in a full-width column and may want a `max-w` to stop the lines running long.
