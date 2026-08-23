# /get-involved: duplicate heading suppressed, single-column measure capped

Both done, one file. `npx tsc --noEmit` clean, `npx vite build` clean.

---

## 1. The duplicate pathway heading

`RoleGroup` now drops its heading when the pathway holds **exactly one** opening whose title already equals the label:

```tsx
const norm = (v: string) => v.trim().toLowerCase();
const headingIsRedundant =
  openings.length === 1 && norm(openings[0].title) === norm(label);
```

Compared **trimmed and case-insensitively**, so a stray capital or a trailing space in either string cannot resurrect the duplicate — the label and the title come from two different places in `openings.ts` and nothing enforces that they match character-for-character.

**Conditional, not removed.** The Atlas Student Team pathway has five openings and needs its heading, and the Principal Researcher pathway will need one back the moment it gains a second role. Verified both:

```
pathway "chapter"
  label     : "Principal Researcher"
  openings  : 1  ["Principal Researcher"]
  heading   : SUPPRESSED (duplicate)
  renders   : just the card "Principal Researcher"

pathway "team"
  label     : "Atlas Student Team"
  openings  : 5  [Regional Youth Director, Logistics Analyst Intern, …]
  heading   : SHOWN
  renders   : "Atlas Student Team" + 5 cards
```

And the guard cases:

```
exact match, 1 opening       -> heading suppressed
case/space differs           -> heading suppressed
1 opening, different title   -> heading shown
2 openings, one matches      -> heading shown
```

That third case matters: a single opening whose title *differs* from the label still gets its heading, because then the label is carrying information the card does not.

### One thing the fix had to handle

The heading owned the `mt-6` that separated it from the cards. Removing it would have left that gap floating above the first card, so the card list is now `mt-6` **only when the heading is present**:

```tsx
<div className={cn("space-y-5", !headingIsRedundant && "mt-6")}>
```

The wrapper keeps `mt-12 first:mt-10`, so the two pathways stay separated from each other and from the intro line above.

## 2. The single-column measure

`RoleCard`'s grid now caps its width when there is no second column:

```tsx
className={cn(
  "mt-6 grid gap-6",
  opening.lookingFor.length > 0 ? "md:grid-cols-2" : "max-w-2xl"
)}
```

**`max-w-2xl` (42rem / 672px)** — chosen because it is what the rest of the site uses for body text, not picked by eye. Counted across `src`:

```
32  max-w-2xl     ← dominant body measure
15  max-w-4xl     (page containers)
12  max-w-3xl
 5  max-w-xl
 4  max-w-[68ch]  (long-form prose only)
```

Applied to the grid container rather than to the `BulletList`, so it applies only in the single-column branch and the two-column layout still uses the full card width.

---

## File changed

```
M  src/pages/GetInvolved.tsx    RoleGroup heading suppression; single-column max-width
```

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 704ms
                   dist/index.html                   5.82 kB │ gzip:  2.23 kB
                   dist/assets/index-lZLwxEDb.css   26.52 kB │ gzip:  6.07 kB
                   dist/assets/index-5fwigz1n.js   337.21 kB │ gzip: 106.46 kB
```

The suppression rule was run against the real openings data plus four synthetic cases, rather than reasoned about.

## Not verified

The rendered page. The Principal Researcher card is now the first thing under "Two separate pathways. You may hold both." with no heading between them — worth one look to confirm the `mt-10` on the wrapper is enough separation now that the heading is not there to provide it.
