# Featured card block and the setting line

Branch `chapters-rebuild`. `tsc --noEmit` clean, `vite build` succeeds, all routes serve with no
dev warnings, **50 checks pass** (46 setting-line and card, 4 template round-trip).

---

## 1. The featured card's empty block

Two separate causes, which is why it looked worse than the numbers suggested.

**Cause A — the block's own minimum was too tall.** The featured header was
`min-h-[15rem] md:min-h-[17rem]` (240/272px) with `justify-between`: an icon row pinned to the
top, the title pinned to the bottom. With a one- or two-line title in a card spanning two of
three columns, that leaves roughly 200px of nothing between them. Reduced to
`min-h-[12rem] md:min-h-[13rem]` (192/208px), which still reads as larger than the 184px normal
block without the void.

**Cause B — the grid was stretching it.** `grid` defaults to `align-items: stretch`, so every card
in a row was forced to the height of the tallest. Added `items-start` to the homepage grid so each
card sizes to its own content — which is what you said to do rather than padding one with empty
space.

### Why not a literal 16:9

You offered "around 16:9 or a fixed max height". **16:9 would have made it worse**, and it's worth
being explicit about why: the featured card spans two of three columns, so it is about 740px wide
at 1440px. 16:9 on 740px is **416px tall** — which is the ~400px void you reported, not a fix.
An aspect ratio is only safe on the normal-width card.

So it's a bounded height, and `min-h` rather than a fixed `h` or a `max-h`, so a genuinely long
title can still push the box taller instead of being clipped. The title stays bottom-anchored via
`justify-between` — now at the bottom of a capped box rather than a stretched one. A comment in the
component records the 416px arithmetic so nobody "corrects" it back to an aspect ratio.

I left the **directory** grid stretching. Every card there is the same variant, so uniform row
heights are correct; the stretch only produced a void where a featured and a normal card shared a
row.

## 2. The setting line

`"Online · N/A · Online"` came from three separate faults compounding: a placeholder printed as
data, a duplicate printed twice, and no handling for a field that legitimately does not apply.

Replaced the two ad-hoc `[school, location].filter(Boolean).join(" · ")` expressions — one in the
card, one in the brief — with a single exported `settingLine(group, labels?)` in
`src/data/research-groups.ts`. Grep confirms it is now the **only** render path for
`schoolOrCommunityName` and `location`; nothing prints them raw.

Three rules, all of which the old join broke:

1. **Blank and placeholder segments are dropped.** `N/A`, `NA`, `n.a.`, `none`, `nil`, `tbd`,
   `tba`, `-`, `--`, `null`, `undefined`, `not applicable` — matched case-insensitively with
   whitespace and dots stripped, so `" NA "` and `"N.A."` both catch.
2. **No value is printed twice**, compared case-insensitively. Setting wins position, so an online
   group whose Location is also "Online" prints `Online` once.
3. **Order is fixed** — setting, host, location — so the line reads the same way regardless of
   which parts exist.

| Setting | Host | Location | Renders |
| --- | --- | --- | --- |
| online | *(blank)* | *(blank)* | `Online` |
| online | `N/A` | `Online` | `Online` |
| online | *(blank)* | `Distributed / online` | `Online · Distributed / online` |
| school | `Placeholder School` | `Kathmandu, Nepal` | `School · Placeholder School · Kathmandu, Nepal` |
| school | `N/A` | `Kathmandu, Nepal` | `School · Kathmandu, Nepal` |
| school | *(blank)* | *(blank)* | `School` |
| community | `Lagos` | `Lagos` | `Community · Lagos` |

**A trap I checked for deliberately.** Normalising by stripping whitespace and dots means `"N.A."`
→ `"na"`, which is what makes the detector work — but it also means a real name could collide.
Asserted that **"Nairobi", "Nassau", "Nantes" and "National Academy" are all still meaningful**.
Only exact matches against the token list are dropped, never prefixes.

I also unified the duplicated `SETTING_LABEL` maps, which had drifted: the card said "School",
the brief said "School-based". Both are now exported from the data module (`SETTING_LABEL` and
`SETTING_LABEL_LONG`) and the brief passes the long one, so each page keeps its register from a
single source.

### Display-level, not ingest-level — deliberately

I did **not** strip placeholders in `groupsSource` on the way in. One rule in one place is easier
to reason about, and mutating a Sheet value on ingest would mean the stored data silently differs
from the Sheet. The trade-off: a placeholder still sits in the cell and still has to be cleaned
out. Which is why the docs now say not to type one.

## Docs and template

`notes/managing-research-groups.md` gains **section 6, "Leave cells blank — never type N/A"** —
sections renumbered to 14. It states that SchoolOrCommunityName does not apply to a fully online
group and must be left blank, shows the exact bug that produced, carries the rendering table
above, and says relying on the site's defence is worse than an empty cell because a placeholder
still occupies the cell and still looks like content to anyone reading the Sheet.

`scripts/generate-sheet-template.mjs` now emits a **third example row**: a fully online group with
`SchoolOrCommunityName` empty, with an inline comment saying not to write "N/A" there. The
generator's header comment carries the same rule.

Round-tripped the regenerated CSV through the real parser rather than trusting it:

```
rows 3, validated 3
  school     school="Placeholder Secondary School"   → "School · Placeholder Secondary School · Placeholder City, Placeholder Region"
  community  school="Placeholder Market Association" → "Community · Placeholder Market Association · Placeholder District, Placeholder Region"
  online     school=null                             → "Online · Distributed / online"
```

---

## Not verified

**I have not seen the card rendered.** The block heights are arithmetic and the setting line is
tested as a pure function against 46 cases, but whether the featured block now looks
*deliberately* larger rather than *slightly* larger is a judgement by eye. Check the homepage at
1440px, where the featured card sits beside a normal one and the height difference is visible.

**Your live Sheet still has the `N/A`.** The site now renders it correctly regardless, but the
cell should be emptied — it is in the online group's `SchoolOrCommunityName`.
