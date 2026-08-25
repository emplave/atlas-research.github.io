# Brief page layout; /research-groups restructure

All five done. `npx tsc --noEmit` clean, `npx vite build` clean.

Item 4 created a new heading collision that I resolved rather than shipped — see the note under it.

---

# AREA 1 — the brief page

## 1. `[&_h2:first-child]:mt-0`

Added to `Prose`, beside the `[&_p:first-child]:mt-0` it was missing its other half of. Removes **48px** of dead top margin from every research group brief and every journal article. On a one-section brief that was 31% of the column height spent separating a heading from nothing.

## 2. Single column when there is only one section

The layout now switches on how many of the three prose sections have content:

```
sectionCount >= 2  ->  two columns, sidebar card    (unchanged)
sectionCount <= 1  ->  single column, details band
```

Derived from the **same conditions the sections themselves render on**, so the layout cannot disagree with what is actually on the page.

Live state — all six are single-column today, and a group that fills in Methods gets the sidebar back automatically:

```
student-access-to-academic-opportunity-in-vi   sections=1  single column  apply=no
educational-accessibility-visual-and-hearing   sections=1  single column  apply=no
school-environment-and-adolescent-health       sections=1  single column  apply=no
home-based-learning-and-adolescent-well-bein   sections=1  single column  apply=yes
traditional-medicine-and-chemotherapy-side-e   sections=1  single column  apply=no
international-academic-resources-chinese-stu   sections=1  single column  apply=yes
```

I extracted `GroupDetailRows` and `ApplyAction` so both layouts render the same six fields and the same button from one definition. Only the wrapping `<dl>` differs — vertical stack in the card, grid in the band — which is the actual difference between them.

### What it looks like at each width

Measured with Archivo advance widths and the real container arithmetic (`max-w-4xl` 896 − `px-6` 48; `Prose` caps at 68ch = 662px):

| | Desktop 1440 | Tablet 768 | Phone 375 |
| --- | --- | --- | --- |
| Content width | 848px | 720px | 327px |
| Reading measure | 662px *(68ch cap)* | 662px *(cap)* | 327px |
| Abstract | 3 lines, **136px** | 3 lines, **136px** | 5 lines, **196px** |
| Details band | 3-up, 2 rows, **130px** | 3-up, 2 rows, **130px** | 1-up, 6 rows, **362px** |
| Apply block | 141px | 141px | 141px |
| **Total** | **463px** | **463px** | **755px** |

**Desktop and tablet are identical** because the 68ch cap binds at both — the measure never widens past 662px, so the abstract sets the same three lines either way. The band goes 3-up at `md` and above, 2-up at `sm`, and stacks below that.

Nothing sits beside the column now, so there is no empty half. Compare the previous state: 155–184px of prose next to a 386–523px card, a 2.1–3.4× mismatch.

**Phone is the one to look at.** 755px total, of which the details band is 362px — six stacked label/value pairs. That is taller than the old sidebar, but it is *below* the content rather than beside it, so it reads as a continuation instead of a gap. If it feels long I would go 2-up from the smallest breakpoint rather than stacking, which halves it to ~190px.

### The apply button is more prominent, not less

| | Before | After |
| --- | --- | --- |
| Container | 260px sidebar card | full-width band |
| Button width | 260 − 48 padding = **212px** | capped at `max-w-md` = **448px** |
| Position | right gutter | in the reading column |

**2.1× wider**, and in the column the reader is actually looking at rather than off to the side. Same text size, same padding, same ink fill — only the width and position changed, both upward. It also now sits under a rule below the details, so it closes the page rather than floating in a card.

`max-w-md` rather than truly full width, deliberately: a 662px-wide button reads as a banner, not a button.

---

# AREA 2 — /research-groups

## 3. Section 03 deleted, remaining sections renumbered

`"You run it."` is gone. Numbering now runs:

```
01  the value props        (heading: "Lead a research group.")
02  What running a group actually involves.
03  Start with the application.   (ink band, the CTA)
```

Confirmed three numbered sections, `01`/`02`/`03`, and the only remaining occurrence of `"You run it."` in the file is the doc comment recording the deletion and why — so the reasoning survives without the duplication.

## 4. h1 → "Research groups."

The page title names the page; the ask lives in the section 01 heading.

### This created a new collision, which I fixed

The listing section's heading was **already** `"Research groups."` — set two turns ago. Changing the h1 to the same string put the identical sentence twice in a row, separated only by the header block. That is worse than the problem item 4 was solving.

**I removed the listing's heading.** The h1 names the page, the listing is the page's first content, so it needs no second label. Its intro line is kept — "Every published Atlas research group. Groups taking new members are marked." — because that carries what the marker means, which no other line says.

Same principle already applied to `RoleGroup` on `/get-involved`: suppress the heading rather than invent a second name for one thing. I left a comment noting that any heading added back here must avoid claiming activity, since "Groups running now" was wrong for exactly that reason.

Final sequence, no duplicates:

```
1. h1      Research groups.
2. (listing: no heading, intro line only)
3. h2 [01] Lead a research group.
4. h2 [02] What running a group actually involves.
5. h2 [03] Start with the application.
```

## 5. "guest session" left alone, and why is now recorded

Untouched, verified still in place:

```
src/pages/GetInvolved.tsx:35   "Run a guest session"
src/pages/GetInvolved.tsx:37   "Offer a guest session"
src/pages/Partners.tsx:260     placeholder "…or a guest session"
src/lib/seo.ts:68              /events description
src/lib/seo.ts:83              /partners description
```

The distinction is recorded in `src/data/value-props.ts`, immediately above the props, where "lessons" is defined:

> **TWO WORDS FOR ONE ACTIVITY, AND THAT IS DELIBERATE. Do not harmonise them:**
> - **"lessons"** — the STUDENT-FACING word. What a group receives.
> - **"guest session"** — the RESEARCHER- AND PARTNER-FACING register. Used when inviting a researcher to teach or describing that contribution to an institution. *"Run a lesson" is the wrong register to put in front of university faculty.*
>
> A sweep that renames one to the other in both directions will read as a correction and is not.

It also notes the Fellowship's "guest sessions" as a third case — separate approved phrasing on its own page.

---

## Files changed

```
M  src/components/Prose.tsx              h2:first-child reset
M  src/data/value-props.ts               the lessons / guest session distinction
M  src/pages/ResearchGroupBrief.tsx      one-or-two column; GroupDetailRows + ApplyAction extracted
M  src/pages/ResearchGroups.tsx          section 03 deleted, renumbered, h1, listing heading removed
```

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 732ms
```

Layout switching checked against all six live groups; heading uniqueness checked by comparing the h1, the shared `VALUE_PROPS_HEADING`, and both remaining section headings as a set.

## Not verified

The rendered pages, and here that matters more than usual because this change is mostly layout. The heights come from font metrics and container arithmetic, not the browser — real line-breaking can differ by a line, and the details band's row heights assume the `Review status` value stays on one line at each width, which it does at 3-up but is the thing most likely to wrap.

Two specific things to look at: the **details band at phone width**, where six stacked pairs make it the tallest element on the page and 2-up may be better; and the **48px that came off the top of the abstract**, which also affects every journal article — worth one glance at `/journal/<slug>` to confirm it tightened rather than crowded.
