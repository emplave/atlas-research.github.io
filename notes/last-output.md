# Chapters rebuild — Phase 0 + Phase 1

Branch: `chapters-rebuild`. Typecheck (`npx tsc --noEmit`) passes clean. Nothing committed.

Phases 0 and 1 only. No page or component code written. Q1–Q7 changes (dates.ts status,
globe removal, Partners.tsx mailto fix, root-file cleanup, footer line) are later phases
and were deliberately not started.

---

## Phase 0 — waitlist backend extracted

`src/lib/dates.ts` now holds the live Apps Script endpoint as a named constant:

```ts
/**
 * DO NOT DELETE — LIVE WAITLIST BACKEND.
 *
 * This is the deployed Google Apps Script that receives every waitlist /
 * fellowship application submitted from public/apply.html. It is a real,
 * in-production endpoint writing to a live Google Sheet. Deleting, renaming,
 * or pointing this elsewhere silently drops applicant submissions on the
 * floor with no error surface.
 *
 * The same literal is currently inlined in public/apply.html (that file is a
 * standalone static page, intentionally untouched). If this URL ever changes,
 * it must be updated in BOTH places.
 */
export const WAITLIST_ENDPOINT = "https://script.google.com/macros/s/AKfycbz…/exec";

/** The static page that posts to WAITLIST_ENDPOINT. */
export const WAITLIST_FORM_PATH = "/apply.html";
```

`src/pages/Fellowship.tsx` imports both.

**Judgment call to be aware of:** that route is currently only a redirect to `/apply.html`,
so it has no natural *use* for the raw endpoint — importing it alone would be dead weight a
linter strips. `WAITLIST_FORM_PATH` drives the actual redirect; `WAITLIST_ENDPOINT` is
referenced via an explicit `void` + comment so the live backend stays statically linked to
the route through the rebuild.

`public/apply.html` untouched, as instructed. `FORM_ENDPOINT` left alone — that is the
Partners/Chapters form path and rewiring it is Q2's job in a later phase.

---

## Phase 1 — data layer, three files

### FILE 1 — `src/data/chapters.ts`

Types: `Field` (the 8 specified, exactly), `Status`, `Setting`, `OutputType`, `ReviewStatus`,
`ResearchGroup`.

The two directory rules live in the data layer, not in a page:

- `isVisibleByDefault(group)` — excludes `Archived` from the default view.
- `canApply(group)` — true for `Recruiting` only.

`ReviewStatus` is documented as a review state carrying no publication expectation:
work may be submitted, the Atlas research and editorial team decides, and `"published"`
is only ever set after the fact.

```ts
export type Field =
  | "Computer Science & AI"
  | "Health & Life Sciences"
  | "Engineering & Technology"
  | "Physical Sciences & Mathematics"
  | "Social Sciences"
  | "Humanities"
  | "Economics & Business"
  | "Environment & Sustainability";

export type Status = "Recruiting" | "Full" | "In Progress" | "Completed" | "Archived";

export type Setting = "school" | "community" | "hybrid" | "online";

export type OutputType =
  | "Policy brief"
  | "Literature review"
  | "Survey or interview study"
  | "Regional data profile"
  | "Community presentation"
  | "Access initiative";

export type ReviewStatus = "none" | "submitted" | "in review" | "published";

export type ResearchGroup = {
  slug: string;
  projectTitle: string;
  field: Field;
  status: Status;
  setting: Setting;
  oneLine: string;               // ~140 chars, directory cards
  leadName: string;
  schoolOrCommunityName?: string;
  location?: string;
  memberCount: number;
  abstract: string;              // 2–3 paragraphs
  outputType: OutputType;
  methods: string[];
  milestones: string[];
  startedAt: string;             // ISO
  reviewStatus: ReviewStatus;
};
```

**Seed coverage** — 6 groups, all marked PLACEHOLDER DATA with a comment saying Hamaad
replaces them with real groups before launch:

| Field | Status | Setting |
| --- | --- | --- |
| Social Sciences | Recruiting | school |
| Health & Life Sciences | In Progress | community |
| Environment & Sustainability | Full | hybrid |
| Computer Science & AI | Recruiting | online |
| Economics & Business | Completed | community |
| Humanities | Archived | school |

Six fields, all five statuses represented (incl. the required Archived and Completed), all
four settings. Every group is topic-agnostic; none is education-framed.

**Seeded example:**

```ts
{
  slug: "placeholder-model-card-review",
  projectTitle: "Placeholder: What Public Model Cards Actually Disclose",
  field: "Computer Science & AI",
  status: "Recruiting",
  setting: "online",
  oneLine: "Placeholder group reviewing published model cards to see which disclosures appear consistently and which do not.",
  leadName: "Placeholder Lead",
  location: "Distributed / online",
  memberCount: 6,
  abstract: "PLACEHOLDER ABSTRACT. This group reviews publicly available model cards…\n\nThe team builds a coding scheme…two members independently code each document so disagreement can be measured rather than assumed away…\n\nThe output is a literature review… The group notes that the sample reflects what organizations chose to publish, which is not the same as what those organizations know.",
  outputType: "Literature review",
  methods: [
    "Systematic document sampling with stated inclusion criteria",
    "Independent double-coding against a shared scheme",
    "Inter-coder agreement measurement",
  ],
  milestones: [
    "Define inclusion criteria and assemble the document sample",
    "Draft and pilot the coding scheme",
    "Independent coding and disagreement resolution",
    "Synthesis and drafting",
    "Submit for Atlas review",
  ],
  startedAt: "2026-01-20",
  reviewStatus: "none",
}
```

---

### FILE 2 — `src/data/openings.ts`

Single source of truth for every role. Top-of-file comment states this is the only place
roles are added, edited, opened, or closed, that no page or component may hardcode a role,
and that chapter vs. team are two separate pathways a student may hold both of.

```ts
export type OpeningCategory = "chapter" | "team";
export type OpeningStatus = "open" | "closed" | "rolling";

export type Opening = {
  slug: string;
  title: string;
  category: OpeningCategory;
  area: string;
  status: OpeningStatus;
  selectivity: string | null;
  commitment: string | null;
  oneLine: string;
  description: string;
  responsibilities: string[];
  lookingFor: string[];
  regions: string[] | null;
  deadline: string | null;   // ISO date, null renders as "Rolling"
  formUrl: string | null;    // null renders a disabled "Opening soon" state, never a dead link
  formNote: string | null;
  updatedAt: string;         // ISO date
};
```

**Deadline helper**, plus the wrapper pages should actually call:

```ts
export function isDeadlinePassed(o: Opening, now = new Date()): boolean {
  if (!o.deadline) return false;                        // rolling never expires
  const due = Date.parse(`${o.deadline}T23:59:59Z`);    // live through the whole deadline day
  return Number.isNaN(due) ? false : now.getTime() > due;
}

export function effectiveStatus(o: Opening, now = new Date()): OpeningStatus {
  if (o.status === "closed") return "closed";
  return isDeadlinePassed(o, now) ? "closed" : o.status;
}
```

An expired role auto-renders as closed with no file edit. Also exported:
`isAcceptingApplications()`, `isFormPending()` (drives the disabled "Opening soon" state when
`formUrl` is null, so no page can produce a dead link), `chapterOpenings()`, `teamOpenings()`,
`findOpening(slug)`.

**Six roles seeded**, all `status: "rolling"`, all `deadline: null`:

| # | Role | Category | Area | Selectivity | Commitment |
| --- | --- | --- | --- | --- | --- |
| 1 | Chapter Leader | chapter | Chapter leadership | — | — |
| 2 | Regional Youth Director | team | Regional leadership | Extremely selective | 5-8+ hrs/week |
| 3 | Logistics Analyst | team | Program operations | Selective | 2-4 hrs/week |
| 4 | Marketing Associate | team | Brand and growth strategy | Selective | 2-4 hrs/week |
| 5 | Social Media Manager | team | Digital communications | Highly selective | 3-5 hrs/week |
| 6 | Fellowship Mentor | team | Research mentorship | Highly selective | 3-5 hrs/week |

Chapter Leader → `https://forms.gle/s2qpP3XX3ydLc58k6`, `formNote: null`.
Roles 2–6 → `https://forms.gle/XiLxGwedVS32LLNc9`, `formNote: "One role per submission. Select this role inside the form."`

Regional Youth Director carries all ten regions and the multi-director note (international
regions may have more than one director depending on scale, time zones, and language) in its
description. Roles 2–6 have 5–6 `responsibilities` and 5–6 `lookingFor` bullets written from
the supplied material.

**Seeded example:**

```ts
{
  slug: "social-media-manager",
  title: "Social Media Manager",
  category: "team",
  area: "Digital communications",
  status: "rolling",
  selectivity: "Highly selective",
  commitment: "3-5 hours per week",
  oneLine: "Own the content calendar and the day-to-day quality of Atlas's public social presence.",
  description: "…This is a public-facing voice role. Everything posted is an Atlas statement, which means accuracy comes before reach: no overstated outcomes, no implied publication guarantees, no claims that have not been confirmed…",
  responsibilities: [
    "Own and maintain the content calendar across approved platforms.",
    "Write, schedule, and publish posts at a consistent cadence and standard.",
    "Keep a consistent visual and verbal identity across every channel.",
    "Monitor replies, mentions, and messages, and respond or escalate appropriately.",
    "Verify every factual claim before it is posted; route anything uncertain to Atlas leadership first.",
    "Report on what content actually reached people and adjust the calendar accordingly.",
  ],
  lookingFor: [ /* 6 bullets */ ],
  regions: null,
  deadline: null,
  formUrl: "https://forms.gle/XiLxGwedVS32LLNc9",
  formNote: "One role per submission. Select this role inside the form.",
  updatedAt: "2026-08-16",
}
```

---

### FILE 3 — `src/lib/stats.ts`

Homepage was audited for numbers first. Confirmed-able figures exported and marked
PLACEHOLDER:

- `FELLOWSHIP_WEEKS` = `4`
- `ELIGIBLE_GRADES` = `"9–12"`
- `APPLICATION_ESSAY_COUNT` = `3`
- `FELLOWSHIP_COST_LABEL` = `"Free"` (flagged as a policy statement, not a metric)

Country count was **not** carried over. `WorldSection.tsx` asserts "Active in 15 countries"
in three separate places with nothing behind it:

```ts
/**
 * UNVERIFIED — INTENTIONALLY NULL. DO NOT FILL IN WITH AN ESTIMATE.
 *
 * The site previously claimed "Active in 15 countries" in three places. That
 * figure has no source behind it and is not a live claim. It stays null until
 * there is a real record to count, and the UI must render nothing — not a
 * fallback, not a rounded guess — while it is null.
 */
export const COUNTRIES_ACTIVE: number | null = null;
```

Same treatment for `ACTIVE_CHAPTERS`, `FELLOWS_TO_DATE`, `HOST_INSTITUTIONS`.

```ts
/** True when a stat has a confirmed value and may be rendered. */
export function hasStat(value: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
```

`hasStat()` is the guard so a null renders as absent rather than `0`.

**Deliberately excluded:** `Instrument.tsx` has "1970–2024 · 200+ territories" and similar,
but those are illustrative labels on a mock UNESCO/World Bank dataset card, not Atlas
claims — and that whole component is education-framed, so it is slated for the
topic-agnostic rewrite anyway. Open question whether they belong in `stats.ts` regardless.

---

## Open items for the next phase

- `WorldSection.tsx` imports the globe being cut (Q3) **and** carries the 15-countries
  claim, so Q3 and the stats cleanup land on the same file.
- Seeded `updatedAt` on all six roles is `2026-08-16` (today). Change if it should instead
  reflect when the role copy was actually written.
- `Instrument.tsx` mock dataset numbers — in or out of `stats.ts`?
