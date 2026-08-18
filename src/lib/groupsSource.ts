/**
 * Research groups — LIVE SOURCE.
 *
 * The directory reads from a Google Sheet published to the web as CSV, fetched
 * and parsed at runtime. A change in the Sheet appears on the site with no code
 * change and no deploy.
 *
 * ============================================================================
 * EXPECTED SHEET COLUMNS — the header row must contain exactly these names:
 *
 * Published, Slug, ProjectTitle, Field, Status, Setting, OneLine, LeadName,
 * SchoolOrCommunityName, Location, MemberCount, Abstract, OutputType, Methods,
 * Milestones, StartedAt, ReviewStatus, ImageSrc, ImageAlt, MemberApplicationUrl
 *
 * Column ORDER does not matter — columns are matched by header name. Renaming a
 * column breaks only the field it feeds: required fields cause the row to be
 * skipped with a console warning, optional ones go blank. Nothing crashes.
 *
 * Notes on specific columns:
 *   Published    "yes" (case-insensitive) publishes the row. Anything else,
 *                including blank, hides it.
 *   Slug         Blank derives one from ProjectTitle. Collisions get a numeric
 *                suffix and a console warning.
 *   MemberCount  Parsed as an integer. Defaults to 0 if unparseable.
 *   Methods      Pipe-separated in one cell: "Field notes | Interviews".
 *   Milestones   Pipe-separated, same convention.
 *   Abstract     Blank lines separate paragraphs, same as Prose expects.
 *   ImageSrc     Blank leaves image null, which renders the typographic
 *   ImageAlt     fallback. Both are needed for an image to appear.
 *   MemberApplicationUrl  May be blank. Reserved for Phase 13.
 * ============================================================================
 *
 * See notes/managing-research-groups.md for the operator workflow.
 */
import {
  RESEARCH_GROUPS as FALLBACK_GROUPS,
  type Field,
  type OutputType,
  type ResearchGroup,
  type ReviewStatus,
  type Setting,
  type Status,
} from "@/data/research-groups";
import {
  fetchSheetRows,
  headerReader,
  isPublished,
  parseCount,
  pipeList,
  slugify,
  uniqueSlug,
} from "./csv";
export { parseCsv } from "./csv";

/**
 * The published-to-web CSV URL for the research groups Sheet.
 *
 * PASTE THE URL HERE. While it is null the site renders the fallback dataset in
 * src/data/research-groups.ts, so nothing breaks before it is wired up.
 *
 * Format: https://docs.google.com/spreadsheets/d/e/<long-id>/pub?gid=0&single=true&output=csv
 */
export const RESEARCH_GROUPS_CSV_URL: string | null =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS5pSpmYVKBtIe9-F5EZ19r2mJMrRAYh-d-VW8z-r_iRk-iBlHo2pZ4Z28iEkjsCOOKXEiRZyj9cCtb/pub?gid=1185748239&single=true&output=csv";

/* ---------------- Validation                                                                 */
/* ------------------------------------------------------------------------- */

const FIELDS: readonly Field[] = [
  "Computer Science & AI",
  "Health & Life Sciences",
  "Engineering & Technology",
  "Physical Sciences & Mathematics",
  "Social Sciences",
  "Humanities",
  "Economics & Business",
  "Environment & Sustainability",
];

const STATUSES: readonly Status[] = [
  "Recruiting",
  "Full",
  "In Progress",
  "Completed",
  "Archived",
];

const SETTINGS: readonly Setting[] = ["school", "community", "hybrid", "online"];

const OUTPUT_TYPES: readonly OutputType[] = [
  "Policy brief",
  "Literature review",
  "Survey or interview study",
  "Regional data profile",
  "Community presentation",
  "Access initiative",
];

const REVIEW_STATUSES: readonly ReviewStatus[] = [
  "none",
  "submitted",
  "in review",
  "published",
];

/** A research group plus the Sheet-only fields the type does not carry yet. */
export type SheetResearchGroup = ResearchGroup & {
  /** From MemberApplicationUrl. Null when blank. Reserved for Phase 13. */
  memberApplicationUrl: string | null;
};

/**
 * Convert parsed CSV rows into research groups.
 *
 * Skips-and-logs rather than throwing: one bad row must not blank the whole
 * directory, and a half-populated card is worse than an absent one.
 */
export function rowsToGroups(rows: string[][]): SheetResearchGroup[] {
  if (rows.length === 0) return [];

  const read = headerReader(rows[0]);
  const out: SheetResearchGroup[] = [];
  const seenSlugs = new Set<string>();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const at = (name: string) => read(row, name);
    const label = `row ${r + 1}`;

    if (!isPublished(at("Published"))) continue;

    const projectTitle = at("ProjectTitle");
    if (!projectTitle) {
      warn(`${label} skipped: ProjectTitle is blank`);
      continue;
    }

    const field = at("Field") as Field;
    if (!FIELDS.includes(field)) {
      warn(`${label} skipped: Field "${at("Field")}" is not a known field`);
      continue;
    }

    const status = at("Status") as Status;
    if (!STATUSES.includes(status)) {
      warn(`${label} skipped: Status "${at("Status")}" is not a known status`);
      continue;
    }

    const setting = at("Setting").toLowerCase() as Setting;
    if (!SETTINGS.includes(setting)) {
      warn(`${label} skipped: Setting "${at("Setting")}" is not a known setting`);
      continue;
    }

    const outputType = at("OutputType") as OutputType;
    if (!OUTPUT_TYPES.includes(outputType)) {
      warn(
        `${label} skipped: OutputType "${at("OutputType")}" is not a known output type`
      );
      continue;
    }

    const rawReview = at("ReviewStatus").toLowerCase();
    const reviewStatus = (rawReview || "none") as ReviewStatus;
    if (!REVIEW_STATUSES.includes(reviewStatus)) {
      warn(
        `${label} skipped: ReviewStatus "${at("ReviewStatus")}" is not a known review status`
      );
      continue;
    }

    const oneLine = at("OneLine");
    const leadName = at("LeadName");
    const abstract = at("Abstract");
    const startedAt = at("StartedAt");
    const missing = [
      !oneLine && "OneLine",
      !leadName && "LeadName",
      !abstract && "Abstract",
      !startedAt && "StartedAt",
    ].filter(Boolean);
    if (missing.length > 0) {
      warn(`${label} skipped: missing ${missing.join(", ")}`);
      continue;
    }

    const slug = uniqueSlug(
      slugify(at("Slug") || projectTitle) || `group-${r}`,
      seenSlugs,
      (from, to) => warn(`${label}: slug "${from}" already used, using "${to}"`)
    );

    const imageSrc = at("ImageSrc");
    const imageAlt = at("ImageAlt");

    out.push({
      slug,
      projectTitle,
      field,
      status,
      setting,
      oneLine,
      leadName,
      schoolOrCommunityName: at("SchoolOrCommunityName") || undefined,
      location: at("Location") || undefined,
      memberCount: parseCount(at("MemberCount")),
      abstract,
      outputType,
      methods: pipeList(at("Methods")),
      milestones: pipeList(at("Milestones")),
      startedAt,
      reviewStatus,
      image: imageSrc && imageAlt ? { src: imageSrc, alt: imageAlt } : null,
      memberApplicationUrl: at("MemberApplicationUrl") || null,
    });
  }

  return out;
}

function warn(message: string): void {
  // Console only. A visitor must never see sheet-shaped diagnostics.
  console.warn(`[research groups] ${message}`);
}

/* ------------------------------------------------------------------------- */
/* Fetch + cache                                                              */
/* ------------------------------------------------------------------------- */

/** The fallback dataset, widened to the Sheet shape. */
const FALLBACK: SheetResearchGroup[] = FALLBACK_GROUPS.map((g) => ({
  ...g,
  memberApplicationUrl: null,
}));

/**
 * In-memory cache for the session. Navigating between the directory, the
 * homepage and a brief must not refetch.
 *
 * The promise itself is cached, not just the result, so concurrent callers
 * during the first render share one request instead of firing several.
 */
let cache: Promise<SheetResearchGroup[]> | null = null;

async function fetchGroups(url: string): Promise<SheetResearchGroup[]> {
  const rows = await fetchSheetRows(url, warn);
  if (!rows) return FALLBACK;
  const groups = rowsToGroups(rows);
  if (groups.length === 0) {
    warn("sheet parsed to zero published groups; using fallback data");
    return FALLBACK;
  }
  return groups;
}

/**
 * All published research groups.
 *
 * Returns the fallback dataset when RESEARCH_GROUPS_CSV_URL is null, and on any
 * fetch failure, timeout, or malformed response. Never throws, so no caller
 * needs an error branch.
 */
export function loadResearchGroups(): Promise<SheetResearchGroup[]> {
  if (!cache) {
    cache = RESEARCH_GROUPS_CSV_URL
      ? fetchGroups(RESEARCH_GROUPS_CSV_URL)
      : Promise.resolve(FALLBACK);
  }
  return cache;
}

/** True when the Sheet is wired up. Drives whether a loading state shows. */
export const IS_SHEET_CONFIGURED = RESEARCH_GROUPS_CSV_URL !== null;

/**
 * The groups available synchronously, for a component's initial state.
 *
 * With no Sheet configured the fallback dataset is already in the bundle, so
 * there is nothing to wait for — returning it here means the first paint shows
 * the directory rather than flashing an empty state for one frame while an
 * effect resolves a promise that was never going to do any work.
 *
 * With a Sheet configured this is empty and the skeleton covers the fetch.
 */
export function initialResearchGroups(): SheetResearchGroup[] {
  return IS_SHEET_CONFIGURED ? [] : FALLBACK;
}

/** Test seam: clears the session cache. Not used by the app. */
export function __resetGroupsCache(): void {
  cache = null;
}
