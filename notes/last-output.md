# Value props replaced; "sessions" → "lessons"

Done. `npx tsc --noEmit` clean, `npx vite build` clean.

**Two heading collisions found. One is sharp and needs your decision** — the new first prop duplicates an existing section almost verbatim. Details at the end.

---

## The props, as specified

Heading and subhead now live in the shared component too, so all three pieces come from `src/data/value-props.ts`:

```
Lead a research group.

We walk you from question to publication. You pick a question you care about,
recruit three or more people, and run the group. At a school, in a community, or
entirely online.

1. You lead it.
2. We walk you through it.
3. Lessons from researchers.
4. Feedback while you work.
5. A publication pathway.
```

The reasoning you gave is recorded in the file so it does not get reverted — status before features, why the two titles now lead with what the reader does, why "Work with peers" is gone, and that "lessons" is deliberate and sitewide.

## Both parents had to give up their own headings

The heading could not simply be added — each page already had one in that slot, and adding a second would have stacked two headings:

| Page | Removed | Why |
| --- | --- | --- |
| Homepage §01 | `Section title="Research groups"` **and** its intro paragraph | The title sat directly above the new heading. The intro — "Lead a research group at a school, in a community, or entirely online. Here is what you get." — said almost exactly what the new subhead says. |
| `/research-groups` §01 | `<h2>What you get.</h2>` | Directly above the new heading, describing the same block. |

The homepage's `01` numeral still renders in the spine, now beside the component's own heading rather than a `Section` title.

## Cost line, CTA, prices

- Cost line **unchanged**: "No application fee, no tuition, no cost to anyone."
- CTA **unchanged**: "Lead an Atlas research group"
- **No competitor prices added.** The only `$3,900–$6,650` in the repo is inside a code comment in `BringAtlasCta.tsx` that exists to explain why the cost line sits high, and states the site does not name them. It predates this change and is not rendered.

---

## "sessions" → "lessons": every instance, and what happened to each

### Changed — 7 places

| File | Line | Change |
| --- | --- | --- |
| `src/data/value-props.ts` | prop 3 | "Sessions with researchers." → **"Lessons from researchers."** |
| `public/llms.txt` | 3 | "guest sessions with university researchers" → "lessons from university researchers" |
| `public/llms.txt` | 22 | "webinars, workshops, and guest sessions with university researchers" → "…and lessons with university researchers" |
| `public/llms.txt` | 66 | "sessions with university researchers" → "lessons from university researchers" |
| `src/components/home/EventsStrip.tsx` | 18 | comment naming the prop → "Lessons from researchers" |
| `src/components/home/FeaturedGroups.tsx` | 39 | same |
| `src/pages/Landing.tsx` | 39 | same |

The last three are comments that referenced the prop *by its old title*. Left alone they would have pointed at a string that no longer exists.

### Left alone — and the reasons, since you asked me to judge

**The Fellowship's "guest sessions" — locked phrasing.** `src/components/Outcomes.tsx:24-25` and `src/pages/Fellowship.tsx:249`. `Outcomes.tsx` says at the top *"What fellows actually get. Used on the Fellowship page"*, and the section beneath it carries this comment:

> *"The named-institutions line belongs here and nowhere else: this is the page where guest sessions are discussed. **Exact approved phrasing — do not append 'and more'.**"*

That is a different programme with approved wording. I did not touch it. Recorded the carve-out in `value-props.ts` so the two do not get "harmonised" later by someone who only sees one.

**The event taxonomy — `"guest session"` and `"info session"` are Sheet-validated enum values.** `src/data/events.ts:28,32` and `src/lib/eventsSource.ts:75,79`. These are `EventKind` members that live rows are matched against; renaming them would skip every event using them. `"lesson"` was added as a kind last week precisely so you can use that word in the Sheet without breaking the old ones.

**The `/events` page's generic "sessions"** — `Events.tsx:46,82,90,91`, `EventDetail.tsx`, `seo.ts:68`. There, "session" means *any calendar item*: webinars, workshops, deadlines, info sessions. "No sessions are scheduled right now" is not about researcher lessons.

**Browser/cache "session"** — `groupsSource.ts`, `publicationsSource.ts`, `eventsSource.ts`. Unrelated meaning.

**`openings.ts:215,219`** — "Sessions need scheduling", "Handle session logistics". The Logistics role's operational duties, covering all event types.

**`llms.txt:20`** — "session-by-session research frameworks". Means per-meeting cadence, not researcher lessons.

### One judgement call I did not make for you

**The researcher-facing side still says "guest session":**

- `src/pages/GetInvolved.tsx:35,37,38` — "Run a guest session", "Offer a guest session", and the mailto subject
- `src/pages/Partners.tsx:185` and `src/lib/seo.ts:83` — "researchers who run guest sessions"

These describe the *same activity* from the speaker's and partner's side, so a strict sitewide sweep would change them. I did not, for two reasons: "guest session" is the professional register a researcher expects to be invited into — "run a lesson" reads oddly addressed to a Stanford faculty member — and one of them is an email subject line that changes what lands in your inbox.

Your instruction was that the word applies sitewide, so this may well be wrong. **Say the word and it is five strings.** I would rather flag it than quietly change how you are addressed by researchers.

---

## Heading collisions

### Homepage — resolved

```
h1        Atlas runs student research groups in any field.
h2        Groups on Atlas                 (listing)
h2 [01]   Lead a research group.          NEW
h2 [02]   Upcoming events
```

No collision. Removing the old `Section title="Research groups"` fixed the adjacency that adding the heading would otherwise have created.

### `/research-groups` — two problems

```
1. h1        Lead an Atlas research group.        (page title)
2. h2        Research groups.                     (listing)
3. h2 [01]   Lead a research group.               NEW
4. h2 [02]   What running a group actually involves.
5. h2 [03]   You run it.
6. h2 [04]   Start with the application.
```

**Collision A — the page title and §01 are near-identical.** "Lead an Atlas research group." then "Lead a research group." They are not adjacent — the whole listing section sits between them — but a reader scrolling passes the same sentence twice. The h1 was specified earlier; the §01 heading is specified now. **Changing the h1 is the cleaner fix**, since §01's heading is the one you just wrote, but I did not touch a title you set deliberately in an earlier turn.

**Collision B — the new first prop duplicates §03 almost word for word.** This is the sharp one:

| | |
| --- | --- |
| **prop 1** | **"You lead it."** — You are the Principal Researcher. You choose the question, pick your members, and run the meetings. It is your group, not a class you sit in. |
| **§03** | **"You run it."** — You are your group's Principal Researcher. You choose the research question, recruit your members, and run the meetings. Atlas provides the curriculum, the mentors, and the publication pathway. The group is yours. |

Same claim, same structure, near-identical sentences, twice on one page — and §03 comes second, so it reads as a page that forgot it had already said this.

**I left §03 in place**, because you explicitly asked me to keep those four founder sections in an earlier turn and removing one is not what you asked for here. But prop 1 now supersedes it: it says the same thing, earlier, where "status before features" actually does the work.

**My recommendation: delete §03 from `/research-groups`.** That also fixes the numbering cleanly — 01 value props, 02 commitment, 03 CTA. One word from you and it is done.

---

## Files changed

```
M  src/data/value-props.ts                      heading, subhead, five props, doc rewrite
M  src/components/ValuePropList.tsx             renders heading + subhead
M  src/components/home/ResearchGroupsPitch.tsx  dropped its title and intro
M  src/pages/ResearchGroups.tsx                 dropped "What you get."
M  src/components/home/EventsStrip.tsx          comment
M  src/components/home/FeaturedGroups.tsx       comment
M  src/pages/Landing.tsx                        comment
M  public/llms.txt                              three researcher-lesson mentions
```

## Verification

```
npx tsc --noEmit   clean, no errors
npx vite build     ✓ built in 715ms
```

I broke `ResearchGroupsPitch` mid-edit by putting a JSX comment outside the single root element; `tsc` caught it immediately and the file was rewritten rather than patched.

## Not verified

The rendered pages. Two things worth looking at: the `01` numeral in the homepage spine now sits beside a component-supplied `h2` rather than a `Section` title, so check the vertical alignment holds at `lg`; and the new subhead is three sentences at `max-w-3xl`, longer than anything that slot has carried before.
