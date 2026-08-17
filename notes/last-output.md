# Phase 6 — light mode, visual rebuild, cleanup

Branch: `chapters-rebuild`. Prior: `548b701` P0, `f5c156c` P1, `b3337f7` P2, `1ef922e` P3,
`f97a993` P4, `80ceca5` P5.

Verification: `tsc --noEmit` clean, `vite build` succeeds, `npm run dev` starts clean with
no warnings (200 on all six top-level routes), 47/47 checks pass.

---

## Light mode

The dual-mode system is gone: `src/lib/theme.ts` deleted, `ModeManager` removed from
`App.tsx`, and no mode class is written to `<html>`. Background lives on `html` so it
extends past a short page.

New tokens replace the entire previous set. `ground`, `panel`, `text`, `accent-hi`, `brass`,
`brass-hi`, `text-hi`, and `logo-plate` are all deleted — verified absent from every
rendered page, not just from the config.

| Token | Value | Job |
| --- | --- | --- |
| `paper` | `#FAFAF9` | page background |
| `surface` | `#FFFFFF` | cards, raised surfaces |
| `ink` | `#16191D` | primary text |
| `muted` | `#5A6169` | secondary text |
| `line` | `#E2E0DA` | hairline borders |
| `navy` | `#1C3F5E` | headings, primary buttons, bands |
| `navy-hi` | `#2A5A82` | hover |
| `accent` | `#1C3F5E` | links |
| `alert` | `#B3402F` | errors only |

Headings are navy via a base-layer rule, so no component sets heading color. Navy bands
carry an `on-navy` class that flips headings to white — without it they would inherit navy
on navy and vanish. **Exactly two navy bands on the homepage**, asserted in the checks.

Primary buttons are `bg-navy` + white; secondary are white with navy border and text. A
visible `:focus-visible` ring was added, because with motion removed there is less signal
that a control is interactive.

`Prose` retuned for light: ink body at 17px/1.75, navy headings, underlined navy links.

## No stat band on launch

`stats.ts` holds five counts, all `null`. `displayStats()` returns only non-null entries,
so `StatBand` returns `null` and renders nothing. Filling in one value in `stats.ts` makes
the band appear with no other edit.

Asserted: `displayStats()` is empty, no stat markup renders, and no "coming soon" appears
in any stat slot.

## Images

`image: { src, alt } | null` added to `ResearchGroup` and `AtlasEvent`. Every seeded record
is `null`, so the fallback is what you can judge.

`ResearchGroupCard` opens with a 16:9 block: real image when present, otherwise a navy
typographic block showing the field name. No broken image, no gray box.

`public/images/README.md` documents the 16:9 / 960×540 minimum, the 1600×900 recommendation,
the 300 KB budget, the slug-based naming convention, alt-text rules, and the licensing and
identifiable-minors constraints. Nothing was downloaded, generated, or hotlinked.

## Copy

The named sentence is deleted, along with the sections built to host that kind of
description. The homepage no longer explains what a category is; it shows six real projects
instead.

Homepage rebuilt to the eight-section order: hero → six group cards → what Atlas provides
→ navy proof band → events → fellowship strip → FAQ → navy closing CTA.

Deleted outright: `WhatIsAResearchGroup`, `HowItWorks`, `PartnersStrip` (replaced by
`ProofBand`), plus `Reveal` and `container-scroll-animation`.

Section intros are gone — every section is a heading and then content. Hero subhead is one
sentence: "You pick the question, recruit three to ten members, and finish a paper in one
term." Every CTA names its action. Checked against the banned-word list on every rendered
page: no hits.

Homepage HTML is **26.3 KB, down from 34.3 KB** — 23% less markup.

## Events

Past events stay visible with dates. `speakerName` / `speakerAffiliation` remain `null` in
the seed and no name is invented. Both the events page and the homepage strip render a
speaker line only when a name exists, so adding one is a single edit to `events.ts`.

## Motion

`Reveal`, `StaggerWords`, and `container-scroll-animation` deleted. Hover states only.

**On your framer-motion question:** `AnimatePresence` was used nowhere, and
`container-scroll-animation.tsx` — the only file using `useScroll`/`useTransform` — was
already orphaned (its consumer was the `Instrument` section deleted in Phase 5). So nothing
legitimately required it, and framer-motion is dropped. I also found `lucide-react` unused
and dropped it.

**JS bundle: 403 KB → 281 KB (-30%); gzip 127 KB → 87 KB.** Dependencies are now `clsx`,
`react`, `react-dom`, `react-router-dom`, `tailwind-merge`.

## Cleanup

**1. `public/apply.html`** replaced with a minimal self-contained light page: applications
closed, cohort underway, buttons to `/fellowship` and `/research-groups`. `noindex` +
canonical to `/fellowship`, and `Disallow` in robots.txt. The file is kept because old
emails point at it. The 16-column form is gone — a live form on a closed cycle collects
submissions nobody reads. `WAITLIST_ENDPOINT` is untouched in `dates.ts` and is no longer
duplicated in the HTML, so the two-place sync problem from Phase 0 is resolved.

**2. Partners form.** The mailto fallback is deleted from `submitApplication` entirely — it
cannot be reached by any caller. New `isFormEndpointConfigured()` gates the page: with
`FORM_ENDPOINT` null, the form renders inside a `<fieldset disabled>` at reduced opacity,
the submit becomes a disabled "Form not open", and an explainer shows the contact address as
plain text. Asserted: no mailto on the submit path.

**3. Root duplicates deleted:** `about.html`, `apply.html`, `journal.html`, `privacy.html`,
`llms.txt`, `robots.txt`, `sitemap.xml`, `CNAME`, `googlecf01a647f079a605.html`,
`world-map.svg`, `atlas-journal-logo.png`, `ijhsr-logo.png`. Root `index.html` is **kept** —
it is the Vite entry point, not a duplicate. `dev.cmd` kept.

**4. `stats.ts` unused constants.** `ELIGIBILITY_LABEL` and `FELLOWSHIP_WEEKS` are now wired
into the Fellowship page headline and eligibility line, so numbers and eligibility prose
have one source. `ELIGIBILITY_LONG` was deleted rather than forced in. Also removed
`LEGACY_PORTAL` and `WAITLIST_FORM_PATH` from `dates.ts` — both had zero consumers and
`WAITLIST_FORM_PATH` pointed at `apply.html`.

**5. Crawler files rewritten.** `llms.txt` was the worst offender on the site: education
inequality throughout, "grades 9-12", scholarships, "15+ countries" plus an invented
14-country list, the July 24 deadline, and apply.html as the primary CTA. Rewritten
topic-agnostic and research-group-led, with the review process stated honestly and the
two journal tracks distinguished. `sitemap.xml` rebuilt on current routes, deliberately
excluding placeholder group and article slugs. `robots.txt` disallows the apply.html
signpost.

**6. Motion removed** — see above.

**7. Full-repo grep.** Everything found and fixed:

| Found | Where | Action |
| --- | --- | --- |
| Education-inequality framing, grades 9-12, scholarships, invented 14-country reach list, July 24, apply.html CTA | `public/llms.txt` | full rewrite |
| "Atlas Journal of Education Policy" | `public/privacy.html` | → "Atlas Journal" |
| framer-motion, cobe globe, `Reveal.tsx`, gold accent, Playfair/JetBrains, wrong dates (July 21 / Sept 8 / Oct 5), unregistered email `apply@atlasresearch.institute` | `README.md` | full rewrite |
| Banned filler sentence verbatim in `og:description` and `description` | `index.html` | rewritten with facts |
| `theme-color` `#17181A` (dark) | `index.html` | → `#FAFAF9` |
| Brass favicon `#C08A3E` | `index.html` | → navy `#1C3F5E` |
| "NOT REAL CHAPTERS" | `research-groups.ts` | → research groups |
| `chapterOpenings()` | `openings.ts` | → `researchGroupOpenings()` |
| "fellowship/chapter forms POST" + mailto-fallback comment | `dates.ts` | corrected |
| Stale "Dark chrome" doc comments | Events, Journal, JournalArticle, App | corrected |

Remaining `chapter` matches are the two internal identifiers you told me to keep
(`category: "chapter"`, `slug: "chapter-leader"`) and the legacy redirect routes. Remaining
`ISSN` / `9-12` / `scholarship` matches are prohibition comments telling future editors not
to write them.

---

## Verification

```
PASS  /                                               26270b
PASS  /research-groups                                17493b
PASS  /research-groups/placeholder-model-card-review   7775b
PASS  /events                                          5832b
PASS  /journal                                          9200b
PASS  /journal/placeholder-working-paper               5956b
PASS  /fellowship                                      9284b
PASS  /partners                                        6486b
PASS  /nope                                            3225b
```

Each page scanned for 33 banned strings — every dead token, every banned word, plus ISSN /
501(c) / info@ / scholarship / 9-12 / education framing / July 24 / apply.html — and
asserted to carry the yourbuddy Inc. line and the contact address. Then 38 behavioural
assertions covering the stat band, the image fallback, homepage structure, the two-navy-band
rule, deleted sections, the apply.html ban, the disabled Partners form, journal track
separation, and speaker nulls. **All 47 passed.**

`npm run dev`: clean start, 200 on `/`, `/research-groups`, `/events`, `/journal`,
`/fellowship`, `/partners`, no warnings.

---

## Two things you should look at

**`public/og-globe.png` is stale.** It is an 842 KB image of a globe — a component deleted
in Phase 2 — and it is still the `og:image` for every social share. I did not replace it
because generating or downloading imagery was out of bounds. It needs a 1200×630 replacement
(see `public/images/README.md`); until then every shared link previews a globe the site no
longer has.

**`public/logo-plate.jpeg` is unused** (the `logo-plate` token is deleted). Left in place
since the cleanup brief covered root duplicates only, but it is dead weight.

Also worth noting: several data-layer exports have no callers yet —
`researchGroupOpenings()`, `teamOpenings()`, `CATEGORY_LABEL`, `cancelledEvents()`,
`findEvent()`. They are the documented API for pages not yet built (a roles page, a single
event page), so I left them rather than trimming an interface you are about to use.
