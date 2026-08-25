# Brief page title scales to its length

Done. `npx tsc --noEmit` clean, `npx vite build` clean. One file changed.

**Cards do not need the same treatment.** Measured, not assumed — see the last section.

---

## The thresholds

Three tiers, all existing scale steps. No new sizes.

| Title length | Class | 375px | 768px | 1440px |
| --- | --- | --- | --- | --- |
| **≤ 55 chars** | `.type-hero` *(unchanged)* | 52px | 58px | 104px |
| **56–85 chars** | `.type-panel` | 36px | 46px | 72px |
| **≥ 86 chars** | `.type-section` | 32px | 32px | 56px |

Each keeps its own `clamp()`, so responsiveness is exactly as before — the tier picks which clamp applies, it does not replace it with a fixed size.

## Your three titles

```
 40 chars -> type-hero      375px:52px   768px:58px   1440px:104px
             School Environment and Adolescent Health

 75 chars -> type-panel     375px:36px   768px:46px   1440px:72px
             Educational Accessibility for Students with Visual and Hearing…

129 chars -> type-section   375px:32px   768px:32px   1440px:56px
             The Desynchronization of Adolescent Development: A Neurobiological…
```

**The short one does not shrink** — it stays on `.type-hero` at full size, which was your requirement.

## What that does to header height, which is the actual goal

Measured by reading Instrument Serif's advance widths out of the TTF and simulating greedy word-wrap at the real container widths, rather than estimating:

| | 375px | 768px | 1440px |
| --- | --- | --- | --- |
| 40 chars, `hero` | 153px | 114px | 204px |
| 75 chars, `panel` | 113px | 97px | 227px |
| 129 chars, `section` | **200px** | 67px | 233px |
| *129 chars before this change* | *510px* | *229px* | *713px* |

**The long title goes from 510px to 200px on a phone** — from ten wrapped lines to six. Against 153px for the shortest title, the spread is now 1.3× instead of 3.3×. At 1440px the three land within 30px of each other (204 / 227 / 233), which is as level as three different line counts can be.

## Two things worth knowing about how these were picked

**The font is narrower than it looks.** Average advance across these three titles is **0.35 em per character**, not the ~0.45 an eyeball estimate would give. Every threshold would have been set one tier too aggressive on a guess.

**The boundaries sit in real gaps.** Live titles are 40, 49, 50, 75, 77, and 129 characters. The boundaries at 55 and 85 fall where nothing is close:

```
 40 -> type-hero      shortest live title, 15 chars of headroom
 49 -> type-hero
 50 -> type-hero
 75 -> type-panel
 77 -> type-panel
129 -> type-section
```

No live title sits within 15 characters of a boundary, so a title cannot flip tier because someone fixed a typo or dropped a subtitle. That is the point of setting them against the actual data.

Boundary behaviour confirmed: 55 → `hero`, 56 → `panel`, 85 → `panel`, 86 → `section`.

## One tier I rejected

`.type-prop` (22→28px) for the long tier. It renders the 129-character title as a **64px block at 1440px** — a page title smaller than the body copy beneath it. `.type-section` at 233px is still clearly the page's heading while no longer dominating it.

---

## The cards: checked, and they do not need it

Same simulation against real card widths, minus the `p-6` padding:

| Variant | 40 chars | 75 chars | 129 chars | Header box |
| --- | --- | --- | --- | --- |
| regular, 1440 (3-col, 306px) | 1 line | 2 lines | 4 lines | 184 → **188px** |
| featured, 1440 (2-col, 680px) | 1 line | 2 lines | 3 lines | 184 → **200px** |
| regular, 375 (1-col, 279px) | 2 lines | 2 lines | 4 lines | 184 → **188px** |
| featured, 375 (1-col, 279px) | 2 lines | 3 lines | 5 lines | 184 → **234px** |

**The `min-h-[11.5rem]` on the card header absorbs it.** Short and medium titles leave the box at exactly 184px; only the 129-character title pushes it at all, and the worst case is the featured card on mobile at 234px — **27% growth, against 233% on the brief page.**

Two other things already contain it: the title is one element among several in a fixed-height block rather than the whole header, and the grid uses `items-start`, so a taller card does not stretch its row-mates.

The existing comment on that `min-h` says growth is intentional — *"min-h rather than a fixed h so a long title can still push the box taller instead of being clipped"*. That reasoning still holds at these magnitudes. **No change made.**

If the featured-on-mobile case ever bothers you, the fix is the same helper applied to `text-2xl`/`text-xl`, but at 50px of growth it is not worth the coupling today.

---

## File changed

```
M  src/pages/ResearchGroupBrief.tsx    titleSizeClass() + the h1 uses it
```

The helper is local to the brief page rather than shared, deliberately: the cards demonstrably do not need it, and a shared utility would invite applying it where it is not warranted. The measurement table and the rejected `.type-prop` option are recorded in the file so the thresholds can be re-derived rather than re-guessed.

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 700ms
```

Tier assignment run against all six live titles plus your three references, and against the boundary values 54/55/56 and 84/85/86.

## Not verified

The rendered page. The heights above are computed from font metrics and a greedy-wrap simulation, which is the right way to choose thresholds but is not the browser: real line-breaking differs on hyphenation and on how `letter-spacing` interacts with the trailing space of a wrapped line, so a line count could be off by one at a boundary width. **Worth loading the 129-character group's brief at phone width** — it is `/research-groups/home-based-learning-and-adolescent-well-being-in-delhi-ncr` — since that is the case this change exists for.
