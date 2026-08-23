# Value props restructured; speaker headshots wired up

Both done. `npx tsc --noEmit` clean, `npx vite build` clean.

---

# ITEM 1 — Value props

## What was wrong

Both pages set the heading in `.type-card` (**19px**) against **15px** body in a two-column grid. That is a **1.27× type jump** with no rules and no anchor — so every element carried the same weight and the section read as a wall, exactly as you described. Two other problems compounded it:

- **Five items in two columns leaves an orphan.** The set was hard to count, and the fifth prop sat alone looking like an afterthought.
- **The markup was duplicated.** Same data, two hand-written renderings, already diverging on gap and `max-width`. The data was shared and the presentation was not.

## What I chose

**A hairline-ruled ledger: one row per prop, heading in a fixed left column, body in a wider right column, rules above every row and one closing the set.** Four levers, contrast and structure only:

| Lever | Change |
| --- | --- |
| **Size** | New `.type-prop` step, **22px → 28px** clamped. Against the same 15px body that is **1.87×**, up from 1.27×. This is the single biggest change. |
| **Hairlines** | `border-t` on every row plus `border-b` on the list, so the five read as a bounded, countable set rather than text that stopped. |
| **Asymmetric rows** | `md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]`, baseline-aligned. All five headings stack into **one vertical line** the eye can run down; two equal columns scattered them across four positions. |
| **Rhythm** | `py-7 md:py-8` between rows, `gap-y-2` inside one — so a heading and its body couple as a unit and the units separate. |

`.type-prop` deliberately sits between `.type-card` (19px) and `.type-section` (32px+), filling the gap in the existing scale rather than inventing an unrelated size. Verified in the built CSS:

```
.type-prop{font-size:clamp(1.375rem,2.2vw,1.75rem);line-height:1.15;letter-spacing:-.014em}
```

**Also extracted to one component**, `src/components/ValuePropList.tsx`, used by both pages. That was not cosmetic: two copies of the most important section on the site is how it drifts, and it had already started.

Monochrome throughout — `ink`, `muted`, `line`, `paper`. No icons, no illustration, no colour.

## What I rejected, and why

**Numbering the props 01–05 — rejected, and this is the interesting one.** It is the obvious move and it collides twice on the homepage:

- The **marginal spine already numbers the sections** 01–06. The value props live inside section **01**.
- **`ProcessTrack` in section 03 already numbers its five steps 01–05.**

A third 01–05 sequence would make "03" mean three different things depending on which column of the page you are reading, and two five-item numbered lists on one page look like the same list rendered twice. The hairlines do the counting job without competing. I left a `numbered?: never` prop on the component purely to carry that reasoning, so the next person reaches for it and finds the explanation instead of adding it.

**An ink band — rejected.** `Landing.tsx` documents the rule: three dark surfaces, spaced so no two are adjacent. Section 01 is immediately above `EventsStrip`, whose "Next" card is ink. A full ink band there would stack two dark masses, and the statement panel two sections later is the third. It would also have to differ between the two pages (on `/research-groups` section 04 is already ink), which breaks the shared component.

**Cards or bordered boxes — rejected.** Five boxes give every prop an identical frame, which is the same "everything weighs the same" failure in a heavier form. Rules separate without framing.

**Keeping two columns with a bigger heading — rejected.** At 28px the headings would wrap awkwardly in a half-width column, and the orphan fifth item remains.

---

# ITEM 2 — Speaker headshots

The `ImageSrc` / `ImageAlt` columns were **already parsed** into `event.image` and never rendered by anything. This is the first thing that uses them. The field's comment described it as a "16:9 image", which was the original spec and wrong for a portrait — corrected.

## The rendering rule

**Three cells must all be filled for anything to appear: `ImageSrc`, `ImageAlt`, and `SpeakerName`.**

```
image + speaker      -> portrait SHOWN
image, NO speaker    -> nothing rendered (no placeholder)
NO image, speaker    -> nothing rendered (no placeholder)
neither              -> nothing rendered (no placeholder)
```

`SpeakerName` is part of the condition because this is a *speaker* portrait — a face on a card with no name attached is worse than no face. Flagging it as my call: it means a filled `ImageSrc` can render nothing, which is why it is documented in three places.

**No placeholder, ever.** No initials, no silhouette, no grey circle. The component returns `null` and the speaker's name renders exactly as it does today, so the card is not missing a slot — there was never a slot. All three live events have an empty `ImageSrc`, so the no-image case is the common one and is the one that had to look right:

```
stanford-webinar-pope      image=null  speaker=set  -> portrait not rendered
stanford-webinar-levine    image=null  speaker=set  -> portrait not rendered
berkeley-lesson-fuller     image=null  speaker=set  -> portrait not rendered
```

Small and secondary by construction: round, on the speaker's name line, never above or beside the title. `width`/`height` attributes are set as well as classes so the box is reserved before the file loads and the card does not reflow.

| View | Size |
| --- | --- |
| Homepage strip, small cards | 36px |
| `/events` list cards | 44px |
| Homepage strip, "Next" card | 56px |
| `/events/:slug` header | 64px |

One shared component, `src/components/SpeakerPortrait.tsx`, so the three views cannot drift.

## Dimensions to request from speakers

> **Square, 400×400 pixels minimum. 800×800 is ideal.** Head and shoulders, face roughly centred. JPG or PNG.

Reasoning: the largest render is 64px, so at 3× device pixel ratio that is 192px — 400×400 covers it with room, and 800×800 survives a larger treatment later without re-collecting photos.

**Square matters more than the pixel count.** It is displayed in a circle, and `object-cover` centre-crops a non-square file rather than squashing it — so a landscape photo loses its sides, usually including part of the head. A speaker sending a wide group photo will get a crop of their shoulder.

`ImageAlt` should be the person's name, e.g. `Dr Jane Fuller` — not "headshot of…", since a screen reader already announces it as an image.

Written up for operators in `notes/managing-events.md` under a new "Speaker headshots" section, and in the column notes at the top of `eventsSource.ts`.

---

## Files changed

```
A  src/components/ValuePropList.tsx        the ledger, shared by both pages
A  src/components/SpeakerPortrait.tsx      the portrait, shared by three views
M  src/index.css                           .type-prop scale step
M  src/components/home/ResearchGroupsPitch.tsx   uses ValuePropList
M  src/pages/ResearchGroups.tsx            uses ValuePropList
M  src/data/events.ts                      image field comment corrected
M  src/pages/Events.tsx                    portrait on list cards
M  src/pages/EventDetail.tsx               portrait in the header
M  src/components/home/EventsStrip.tsx     portrait on next + small cards
M  src/lib/eventsSource.ts                 image column notes
M  notes/managing-events.md                headshot section for operators
```

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 701ms
                   dist/index.html                   5.82 kB │ gzip:  2.23 kB
                   dist/assets/index-lZLwxEDb.css   26.52 kB │ gzip:  6.07 kB
                   dist/assets/index-BiDKE3gT.js   337.36 kB │ gzip: 106.48 kB
```

`.type-prop` confirmed present in the built CSS. Portrait rule asserted across all four input combinations plus the three live events.

## Not verified

The rendered pages — I cannot drive a browser, so the visual claims rest on the type maths and the markup.

Three things worth your eye before you consider item 1 settled, since it is a deliberate visual change:

- **The 17rem heading column at tablet width.** "A research framework and curriculum." is the longest heading; check it does not wrap to three lines just above the `md` breakpoint.
- **Baseline alignment** between heading and body on the first row of each — `md:items-baseline` aligns the first lines, which is right when the body is one or two lines and can look loose on the longest one.
- **Whether 28px is enough.** I chose the conservative end of the range deliberately: the next step up is `.type-section` at 32px+, which would compete with the section heading directly above it. If it still reads flat, the fix is more vertical space per row rather than more size.

I also have not seen a real headshot in place — no live event has one, so the portrait path is verified by rule and by build, not by looking at a photo in a circle.
