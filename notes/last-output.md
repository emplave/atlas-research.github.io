# Research groups listing restored

Restored and wired up. `npx tsc --noEmit` clean, `npx vite build` clean.

**Read the next section first.** The listing works, but it renders nothing right now, and the reason is in the Sheet rather than the code.

---

## ⚠ All six groups have `Published` set to `no` — the listing is empty until you flip that

```
=== AS SHIPPED (Published as-is in the Sheet) ===
  published groups: 0
```

Every one of the six rows has `Published` = `"no"`. Nothing renders on either page, by design: the listing section is omitted entirely rather than showing an empty grid or a "none yet" line.

Flipping those six cells to `yes` is the only remaining step, and needs no deploy. With them flipped, all six parse:

```
=== WITH Published FLIPPED TO yes ===
  parsed groups: 6 of 6 rows
```

## ⚠ Two schema mismatches were silently skipping every row — both fixed

Before this change, flipping `Published` would have produced **zero** groups anyway. Two columns held values the code did not accept, and the row was discarded at the first one:

**1. `Status` is `"Pending"`, and `"Pending"` was not a valid status.** The union was `Recruiting | Full | In Progress | Completed | Archived`, so all six rows failed here and were skipped with a console warning.

You asked about `"Forming"`. **The Sheet says `"Pending"`, not `"Forming"`, on all six rows.** I added *both* to the union so either works, since you clearly intend to use "Forming" and the data currently says "Pending". Status matching is now case-insensitive too, and stores the canonical capitalisation, so `pending` and `Pending` behave alike.

**2. `Setting` holds sentences, and the union holds tokens.** The Sheet has `"At a school"`, `"In a community"`, `"Fully online"`, `"Hybrid"`. The code compared against `school | community | hybrid | online`, so `"Hybrid"` passed via `toLowerCase()` and the other three phrasings did not — **four of six rows would have been skipped on this alone.**

Rather than make you retype tokens, the source now maps the phrasings. The Sheet's wording is better for a human filling it in:

```
at a school / at school / school / school-based   -> school
in a community / in community / community-based   -> community
hybrid                                            -> hybrid
fully online / entirely online / online / remote   -> online
```

Matched with punctuation and spaces stripped, so casing and articles do not matter.

## ⚠ `StartedAt` is US `M/D/YYYY`, not ISO — so the listing order is arbitrary

Cells read `9/1/2026`, `8/15/2026`, `11/1/2026`. The field is typed and documented as ISO `YYYY-MM-DD`, and both the listing and the homepage sort on it with `localeCompare`. As a string sort on that format, `11/1/2026` sorts before `8/10/2026`.

Nothing is skipped — the field is not validated — so this is cosmetic, but "newest first" is not currently true. **Fix by changing the cells to `2026-09-01` form.** I did not add a date parser: `9/1/2026` is genuinely ambiguous between US and international convention, and guessing in code is worse than a Sheet edit.

---

## Files restored from git history

| File | Recovered from | Size |
| --- | --- | --- |
| `src/components/research-groups/ResearchGroupCard.tsx` | `81dc692` | 6,193 B |
| `src/components/research-groups/GroupCardSkeleton.tsx` | `81dc692` | 1,875 B |
| `src/components/home/FeaturedGroups.tsx` | `f16f64e` | 2,305 B |

`GroupCardSkeleton.tsx` carries both `GroupCardSkeleton` and `GroupGridSkeleton`, so that is three files for the four components. Recovered with `git checkout <sha> -- <path>`, not rewritten.

**`DirectoryFilters.tsx` — checked, not restored.** It is at `81dc692`, 5,592 bytes, exporting `DirectoryFilters`, `ALL`, `EMPTY_FILTERS`, `isFiltered`, `DirectoryFilterState`. Left deleted per your instruction; six groups do not need filtering. Recorded the recovery point in the page's doc comment so the next person does not rewrite it.

## Files changed

| File | Change |
| --- | --- |
| `src/data/research-groups.ts` | `Status` widened with `Pending`/`Forming`; `recruitingOpen` added to the type; `canApply` rewritten; `isRecruitingWithoutForm` added |
| `src/lib/groupsSource.ts` | `toStatus` + `toSetting` resolvers; `RecruitingOpen` parsed |
| `src/components/research-groups/StatusChip.tsx` | styles for the two new statuses; `Recruiting` de-emphasised |
| `src/pages/ResearchGroups.tsx` | listing section added above the four founder sections |
| `src/pages/Landing.tsx` | `FeaturedGroups` placed above section 01; doc corrected |
| `src/components/home/FeaturedGroups.tsx` | "See all research groups" action removed; unnumbered; retitled |
| `src/lib/memberApplication.ts` | comment: the prefill fallback is now unreachable from gated call sites |
| `src/components/BringAtlasCta.tsx`, `Hero.tsx`, `Closing.tsx` | comments that asserted "there is no group listing" — no longer true |

---

## Apply button behaviour

`canApply()` no longer looks at `status` at all. It requires **both**:

1. `RecruitingOpen` is exactly `yes` (trimmed, case-insensitive — same rule as `Published`)
2. `MemberApplicationUrl` is non-empty

Verified across the combinations, on a real row:

| Status | RecruitingOpen | MemberApplicationUrl | Apply button |
| --- | --- | --- | --- |
| `Pending` *(live today)* | `no` | empty | **not shown** |
| `Forming` | `no` | empty | **not shown** |
| **`Recruiting`** | `no` | empty | **not shown** ← proves status is not the gate |
| `Forming` | `yes` | a URL | **SHOWN** |
| `Pending` | `yes` | **empty** | **not shown** — misconfiguration |

**The misconfiguration case is reportable, not just invisible.** `isRecruitingWithoutForm(group)` returns true when recruiting is open with no form URL — the difference between "the lead closed applications" and "the lead forgot to paste a URL". Right now **zero groups** are in that state, because all six have `RecruitingOpen` = `no`.

The group still appears in the listing with everything else in every case. Only the button is gated.

One thing this closed: `memberApplicationUrl()` has a fallback that builds a generic prefilled form when a group has no URL of its own. Because `canApply` now demands a real URL and both call sites gate on it, that fallback is unreachable — so an empty cell can no longer produce a live button pointing at a form the lead never set up. Documented in the module, with a warning not to call it ungated.

---

## What a card renders for `Status: Forming`, `MemberCount: 1`

Walked through the real component with a real row. **Nothing implies an active group with a full team:**

```
status chip   : "Forming"        faint, no dot
title         : Student Access to Academic Opportunity in Vietnam
one-line      : A survey of how high school students in Hanoi and Haiphong…
Lead          : Chloe
Setting       : Hybrid · Chi Linh High School · Chi Linh district, Vietnam
Members       : 1
"Read the brief" link : always
APPLY BUTTON  : not shown
```

The member count renders as the bare number — **"Members 1"**. It states the fact and claims nothing. Identical output for `Pending`.

I did change one thing to protect this. **`StatusChip` used to emphasise `Recruiting`** with a filled dot and an ink border, on the reasoning that it was the only status carrying an action. That reasoning is now false — the action is gated on `RecruitingOpen`, so an emphasised "Recruiting" chip could sit on a card with no button and read as a broken promise. Every status is now the same weight, and `Pending`/`Forming` are the faintest: a group that has not started must not look like one that is running.

---

## What was kept

- The four founder sections on `/research-groups`, in order, below the listing. Proof first, pitch second.
- **"Lead an Atlas research group" as the only primary CTA.** Confirmed no `Browse research groups`, `See all research groups`, or `Browse all research groups` string exists anywhere in `src/` outside explanatory comments. `FeaturedGroups` shipped with a "See all research groups" action in history — deliberately dropped, since `/research-groups` now leads with the same listing.
- The value props, the cost line, and all current copy.

`FeaturedGroups` is **unnumbered** and sits above section 01. That is not cosmetic: it renders `null` when nothing is published, and a numbered section that can vanish would leave the spine starting at `02` with no `01`. It is evidence for section 01, not a seventh pillar — the same relationship the events strip has to the "sessions with researchers" claim.

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 781ms
                   dist/assets/index-BW9wJsP9.js   342.83 kB │ gzip: 107.75 kB
```

TypeScript caught all three sites that needed updating when `Status` was widened and `recruitingOpen` added — `StatusChip`'s two exhaustive `Record<Status, string>` maps and the row builder in `groupsSource` — which is why the union is worth having.

## Not committed

`public/atlas-linkedin-cover-4200x700.png` has been untracked since this session started and is unrelated to this work. Left untracked rather than swept into this commit.

## Not verified

The rendered pages — and with `Published` = `no` there is currently nothing to render, so the card layout is verified by walking the component and its data, not by looking at it. **Flip one row to `yes` and check the card before flipping all six**, particularly the ink header block with the field icon and the faint `Pending` chip, which no longer has an emphasised state to contrast against.
