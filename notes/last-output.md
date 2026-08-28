# Homepage groups grid: cap of 5, wide slot, "see all" link — and the deploy question

Commit `6a32cf2` on `main`, pushed. Build passes.

**The headline finding: three of the four things you reported are already fixed
in the deployed bundle. You are looking at a stale page.** Evidence below, then
the changes I made anyway.

---

## The hero "semester" line — fixed, in source, in main, and live

You asked me to verify and say which. It is fixed in all three:

- **Source:** `src/components/Hero.tsx:38` reads "…recruit three or more members,
  and finish a paper."
- **`origin/main`:** `git show origin/main:src/components/Hero.tsx` — same.
- **The deployed JavaScript bundle:** I pulled
  `https://atlas-research.org/assets/index-yvEPyyZm.js` and grepped it.
  **Zero occurrences of "semester".** The strings actually in the live bundle are
  "recruit three or more members, and finish a paper." and "…and finish a paper.
  At a school, in a community, or entirely online."

The deployed `index.html` also already carries the corrected meta description
("…one research question. Free, and open worldwide." — no "one semester").

So: **treat it as deploy lag on your end, not a deploy lag on the server.** The
server is current. What is stale is the copy of the page in your browser. Vercel
returned `x-vercel-cache: HIT` with `age: 349` on the HTML, and the bundle
filename is content-hashed, so a browser holding the old HTML keeps requesting
the old hashed bundle and never sees the new one. A hard reload clears it.

---

## Why items 2 and 3 have the same cause

I checked the deployed bundle rather than guessing. The live `FeaturedGroups`
compiles to this (reformatted from the minified source):

```js
function sv() {
  const { groups: r, loading: s } = qa(),
        a = Py(r.filter(hp)).slice(0, 6);      // Py = sortForFeatured
  if (!s && a.length === 0) return null;
  const [u, ...d] = a;                          // u = first sorted group
  return jsxs(Cr, { title: "Groups on Atlas", ..., children: [
    ...jsx("div", { className: "md:col-span-2",
                    children: jsx(ba, { group: u, featured: true }) }),
    ...d.map(p => jsx(ba, { group: p }, p.slug)),
    !s && jsx("p", { className: "mt-8 text-sm",
                     children: jsx(ge, { to: "/research-groups",
                                         className: "link",
                                         children: "See all research groups" }) })
  ]});
}
```

`Py` is `sortForFeatured`, member-count key and all — I found its comparator in
the bundle:

```js
function Py(r){return r.slice().sort((s,a)=>{
  const u=Number(jr(a))-Number(jr(s)); if(u!==0) return u;
  const d=a.memberCount-s.memberCount;
  return d!==0?d:a.startedAt.localeCompare(s.startedAt)})}
```

So on the **deployed** code the wide card is `featured[0]` and the link string is
present. Both of the behaviours you describe belong to the **previous** bundle.

### Proved against the live Sheet

I pulled the actual CSV the site reads and ran both sort orders over it. Eleven
rows are published. The relevant six:

| Lead | Members | StartedAt | Recruiting |
|---|---|---|---|
| Thukten | 2 | 2026-11-01 | yes |
| Katelyn | 1 | 2026-09-30 | yes |
| Chloe | 1 | 2026-09-01 | yes |
| Rishita | 3 | 2026-08-30 | yes |
| Aurora | 1 | 2026-08-10 | yes |
| Yakshita | 1 | 2026-08-01 | yes |

**Old sort** (`sortForListing` — recruiting, then StartedAt desc; no member key):

1. **Thukten → WIDE**, 2. Katelyn, 3. Chloe, 4. **Rishita → narrow, second row**,
5. Aurora, 6. Yakshita

**Current sort** (`sortForFeatured` — recruiting, members desc, StartedAt desc):

1. **Rishita → WIDE**, 2. Thukten, 3. Katelyn, 4. Chloe, 5. Aurora, 6. Yakshita

The old order reproduces your report exactly, down to Rishita landing in the
second row — position 4 falls there because the lead card eats two of the three
columns in row 1. The current order puts Rishita wide, which is what you expect.

**There was no bug in the wide slot and none in the link.** I did not invent a
fix for either. What I changed is described below and is real, but it is not what
made those two symptoms go away — a hard reload is.

I also ruled out a second stale deployment: `emplave.github.io/atlas-research.github.io/`
returns 200, but it serves the raw unbuilt `index.html` (script src `/src/main.tsx`,
no `assets/` bundle), so it renders nothing at all and is not what you are seeing.
`atlas-research.github.io` itself 404s. `atlas-research.org` is Vercel and is current.

---

## What I actually changed

### 1. Cap at 5 — and it fixes a real layout bug

Done, via a named `FEATURED_COUNT = 5`.

**I have to correct something I told you last time.** I wrote that six cards
"fill exactly two rows with no gap." That was wrong, and wrong by one. The lead
card spans two of three columns, so N cards occupy **N + 1 column units**, not N.
Six cards is seven units: two full rows and then a single orphan card alone on a
third row. Your cap of 5 is six units and tiles exactly — row 1 wide + narrow,
row 2 three narrow, which is the layout you specified.

The rule is now written next to the constant: whole rows only when N ≡ 2 (mod 3),
so 5, 8, 11 tile and 6, 7, 9, 10 do not.

**A related inconsistency this closes:** the skeleton branch was rendering
1 featured + 4 narrow = **5** cards while the loaded branch rendered **6**, so the
grid changed size when data arrived. The skeleton count now derives from
`FEATURED_COUNT`, so they cannot drift again.

### 2. The wide slot — already unconditional, now stated

`const [lead, ...rest] = featured` with a single `md:col-span-2` outside the map,
fed the head of the sorted array. There is no condition on it and no second place
that can produce a wide card. I did not change the logic — changing working code
to look like it was fixed would have hidden the real cause. I added a comment
saying the wide slot is `featured[0]` unconditionally, and pointing at
`sortForFeatured` as the thing to inspect if the wrong group looks wide, since
the two are the same question.

The sort order itself is untouched, as you asked.

### 3. The link — ungated from `loading`

It was `{!loading && (…)}`. That was my own doing last time and it was the wrong
instinct: it ties a static destination to the state of a network fetch.
/research-groups exists whether or not the Sheet has answered, so there is no
state in which the grid is on screen and the way out of it should not be. Now the
only thing that removes the link is the whole section returning null.

This was **not** the cause of what you saw — the gate only hides the link while
skeletons are showing, and you were seeing real cards. But it is the one state in
which the link could legitimately go missing, so it is gone.

### 4. Two stale comments corrected

- `FeaturedGroups.tsx` claimed "all six real rows have Published set to 'no', so
  this section is currently absent from the homepage." The Sheet now publishes
  **eleven** rows and the section renders. Corrected.
- `sortForFeatured` inherited a caveat saying StartedAt is US `M/D/YYYY` and does
  not string-sort. I checked the live CSV: **every published row is ISO**
  (`2026-09-01`), so the comparison is correct as written. The caveat now says so
  while keeping the warning for anyone who reverts the format. This also revises
  what I told you last time, where I repeated the caveat as a live defect.

---

## Untouched, as instructed

- The sort order — `sortForFeatured`'s keys are unchanged.
- `/research-groups` — still `sortForListing`, still unsliced.
- The primary CTA — untouched.

## One thing to check after this deploys

With the cap at 5 and eleven rows published, the homepage now hides six groups
rather than five. The link matters more than it did. Worth confirming on a hard
reload that you get Rishita wide, Thukten narrow beside her, and Katelyn / Chloe /
Aurora across row 2.
