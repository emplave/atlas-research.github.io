# Listing header, generated apply links, "Taking members" marker

All three done. `npx tsc --noEmit` clean, `npx vite build` clean.

**The listing is live now.** The Sheet changed between my last turn and this one: all six rows are `Published = yes`, `Status` is `Forming` (it was `Pending`), and one group has `RecruitingOpen = yes`. So six cards render, one of them marked.

```
student-access-to-academic-opportunity-in-vi   Published=yes  Status=Forming  RecruitingOpen=no
educational-accessibility-visual-and-hearing   Published=yes  Status=Forming  RecruitingOpen=no
school-environment-and-adolescent-health       Published=yes  Status=Forming  RecruitingOpen=no
home-based-learning-and-adolescent-well-bein   Published=yes  Status=Forming  RecruitingOpen=no
traditional-medicine-and-chemotherapy-side-e   Published=yes  Status=Forming  RecruitingOpen=no
international-academic-resources-chinese-stu   Published=yes  Status=Forming  RecruitingOpen=yes  ← marked
```

---

# 2. The link to click and confirm

**Group:** Access to International Academic Resources Among Chinese High School Students — the one group currently recruiting, so this is the link that is actually live on the site.

```
https://docs.google.com/forms/d/e/1FAIpQLSd7FD4MfbTBcTwdCqGsFvqPGfYheNQ3CY_p519S7k0B63xyNQ/viewform?usp=pp_url&entry.244092308=Access%20to%20International%20Academic%20Resources%20Among%20Chinese%20High%20School%20Students
```

A second, to check a title with a hyphen and an en-dash-free compound:

```
https://docs.google.com/forms/d/e/1FAIpQLSd7FD4MfbTBcTwdCqGsFvqPGfYheNQ3CY_p519S7k0B63xyNQ/viewform?usp=pp_url&entry.244092308=Home-Based%20Learning%20and%20Adolescent%20Well-Being%20in%20Delhi-NCR
```

If the prefill lands in the wrong field, the entry ID is bound to a different question than intended — the existing comment in `memberApplication.ts` explains what breaks it. Editing question 1's wording is safe; deleting and re-adding it is not.

## Config, split into two constants

You gave the base URL and the parameter separately, which is how they are now stored:

```ts
MEMBER_APPLICATION_FORM_URL  = "…/viewform?usp=pp_url"
MEMBER_APPLICATION_ENTRY_ID  = "244092308"
MEMBER_APPLICATION_BASE_URL  = `${MEMBER_APPLICATION_FORM_URL}&entry.${MEMBER_APPLICATION_ENTRY_ID}=`   // composed
```

Both values already existed in the file — but the base was one hardcoded string with `&entry.244092308=` baked onto the end, and a comment warning *"If you change one, change the other."* That is a drift hazard with a note attached rather than a fix: the ID appeared twice and nothing enforced that the copies matched. It is composed now, so there is one place to edit and they cannot disagree.

## Every group gets a link; the Sheet column is an override

`memberApplicationUrl()` already had exactly this shape — override first, generated otherwise. What changed is what depends on it. Verified across all six, with the override column empty on every row:

```
Student Access to Academic Opportunity in Vietnam
  override cell : null
  link          : …&entry.244092308=Student%20Access%20to%20Academic%20Opportunity%20in%20Vietnam
```

…and the override still wins when a row supplies one:

```
MemberApplicationUrl = "https://example.org/own-form"  ->  https://example.org/own-form
```

## `canApply` is `RecruitingOpen` alone

```ts
export function canApply(group: ResearchGroup): boolean {
  return group.recruitingOpen;
}
```

The URL condition is gone, because its premise is: a link always exists now.

**`isRecruitingWithoutForm` removed.** It described "recruiting open, no form to point at" — a state that can no longer occur. It had no callers, so nothing else changed.

**The fallback in `memberApplication.ts` was NOT removed**, and I want to be explicit about why, since you asked me to remove it if redundant. It is not redundant — it is now the *primary* path. It is what generates the link for all six groups; the override is the exception. What I removed instead was the doc comment claiming the fallback was "unreachable from every gated call site", which was true under the old gating and is now exactly backwards.

---

# 3. "Taking members" marker

A filled monochrome pill in the card header, beside the status chip, on both header variants (the ink block and the image version).

**Both the marker and the button read `canApply` and nothing else**, so they cannot diverge. Verified per group:

```
student-access-to-academic-opportunity-in-   recruitingOpen=false  marker=no     button=no
educational-accessibility-visual-and-heari   recruitingOpen=false  marker=no     button=no
school-environment-and-adolescent-health     recruitingOpen=false  marker=no     button=no
home-based-learning-and-adolescent-well-be   recruitingOpen=false  marker=no     button=no
traditional-medicine-and-chemotherapy-side   recruitingOpen=false  marker=no     button=no
international-academic-resources-chinese-s   recruitingOpen=true   marker=SHOWN  button=SHOWN
```

And flipping `RecruitingOpen` on another row turns both on together.

The marker takes a boolean rather than recomputing the predicate — that is the mechanism, not a style preference. A component that derived its own answer could drift from the footer's.

## One design decision

The marker is **inverted** — filled ink on paper, filled paper on ink — where every `StatusChip` is an outline. Monochrome throughout, same pill shape, same `meta-label` type.

The reason is that it is not a louder status; it is a different kind of thing. Six cards with six outline chips give the eye nothing to catch, which is the problem you described. One filled pill among outlines is scannable at a glance without introducing colour or weight the palette does not have. The header row also wraps now, so a long status and the marker cannot overflow side by side.

---

# 1. Header and subhead

`/research-groups`:

| | Was | Now |
| --- | --- | --- |
| Heading | "Groups running now." | **"Research groups."** |
| Subhead | "Every published Atlas research group. Groups taking new members show an apply link." | "Every published Atlas research group. Groups taking new members are marked." |

The subhead changed for two reasons. It said "show an apply link", which described the old bottom-of-card-only signal and is now wrong — the primary signal is the header marker. And "running now" claimed activity that is false of all six: every one is `Forming` with a single member.

## The homepage needed a different fix

Renaming the listing to "Research groups" collided head-on with section 01, which is already titled "Research groups" and sits directly beneath it — the same duplicate-heading problem just removed from `/get-involved`.

Your instruction named the `/research-groups` header, so that one is exactly as specified. The homepage listing is titled **"Groups on Atlas"** instead: true of all six, claims nothing about progress, and does not repeat the heading below it. Flagging it as my call — if you would rather the pitch section be retitled and the listing take "Research groups", that is the alternative.

---

## Files changed

```
M  src/lib/memberApplication.ts                 config split; docs corrected
M  src/data/research-groups.ts                  canApply simplified; isRecruitingWithoutForm removed
M  src/components/research-groups/ResearchGroupCard.tsx   TakingMembers marker, both variants
M  src/pages/ResearchGroups.tsx                 heading + subhead
M  src/components/home/FeaturedGroups.tsx       section title
```

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 764ms
                   dist/assets/index-wdzvn4j3.js   343.20 kB │ gzip: 107.80 kB
```

Links, override precedence, and marker/button coupling all checked by running the real functions against the live Sheet rather than by reading them.

## Not verified

The rendered cards. Worth one look now that there is real data to see, specifically: the filled marker against the ink header block on the one recruiting group, and whether the header row wraps cleanly on the narrowest card in a three-column grid, where "Taking members" and "Forming" have to share a line with the field icon.

Also unverified: that the prefill lands in the right form field. That needs the click — it is the one thing in this change I cannot check.
