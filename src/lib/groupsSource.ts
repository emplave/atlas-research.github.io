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

/**
 * The published-to-web CSV URL for the research groups Sheet.
 *
 * PASTE THE URL HERE. While it is null the site renders the fallback dataset in
 * src/data/research-groups.ts, so nothing breaks before it is wired up.
 *
 * Format: https://docs.google.com/spreadsheets/d/e/<long-id>/pub?gid=0&single=true&output=csv
 */
export const RESEARCH_GROUPS_CSV_URL: string | null = null;

/** How long to wait for the Sheet before falling back. */
const FETCH_TIMEOUT_MS = 8000;

/* ------------------------------------------------------------------------- */
/* CSV parsing                                                                */
/* ------------------------------------------------------------------------- */

/**
 * Parse CSV into rows of cells.
 *
 * Written by hand rather than pulled from a package, and it is a real parser
 * rather than a split on commas: it handles quoted fields containing commas,
 * newlines, and escaped double quotes ("" inside a quoted field), plus CRLF
 * line endings. Google Sheets emits all of these — an abstract with a comma in
 * it is enough to break a naive split.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  let i = 0;

  // Strip a UTF-8 BOM, which Sheets sometimes prefixes.
  if (text.charCodeAt(0) === 0xfeff) i = 1;

  const endCell = () => {
    row.push(cell);
    cell = "";
  };
  const endRow = () => {
    endCell();
    rows.push(row);
    row = [];
  };

  while (i < text.length) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          cell += '"'; // escaped quote
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cell += c;
      i++;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      endCell();
      i++;
      continue;
    }
    if (c === "\r") {
      // CRLF or a lone CR both terminate the row.
      if (text[i + 1] === "\n") i++;
      endRow();
      i++;
      continue;
    }
    if (c === "\n") {
      endRow();
      i++;
      continue;
    }
    cell += c;
    i++;
  }

  // Flush the trailing cell/row unless the file ended on a newline.
  if (cell.length > 0 || row.length > 0) endRow();

  // Drop rows that are entirely empty — a trailing blank line is normal.
  return rows.filter((r) => r.some((v) => v.trim() !== ""));
}

/* ------------------------------------------------------------------------- */
/* Validation                                                                 */
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

function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function pickInt(raw: string): number {
  const n = Number.parseInt(raw.trim(), 10);
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function pipeList(raw: string): string[] {
  return raw
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Convert parsed CSV rows into research groups.
 *
 * Skips-and-logs rather than throwing: one bad row must not blank the whole
 * directory, and a half-populated card is worse than an absent one.
 */
export function rowsToGroups(rows: string[][]): SheetResearchGroup[] {
  if (rows.length === 0) return [];

  const header = rows[0].map((h) => h.trim());
  const idx = (name: string) => header.indexOf(name);

  const col = {
    published: idx("Published"),
    slug: idx("Slug"),
    projectTitle: idx("ProjectTitle"),
    field: idx("Field"),
    status: idx("Status"),
    setting: idx("Setting"),
    oneLine: idx("OneLine"),
    leadName: idx("LeadName"),
    school: idx("SchoolOrCommunityName"),
    location: idx("Location"),
    memberCount: idx("MemberCount"),
    abstract: idx("Abstract"),
    outputType: idx("OutputType"),
    methods: idx("Methods"),
    milestones: idx("Milestones"),
    startedAt: idx("StartedAt"),
    reviewStatus: idx("ReviewStatus"),
    imageSrc: idx("ImageSrc"),
    imageAlt: idx("ImageAlt"),
    memberApplicationUrl: idx("MemberApplicationUrl"),
  };

  const out: SheetResearchGroup[] = [];
  const seenSlugs = new Set<string>();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const at = (i: number) => (i >= 0 && i < row.length ? row[i].trim() : "");
    const label = `row ${r + 1}`;

    if (at(col.published).toLowerCase() !== "yes") continue;

    const projectTitle = at(col.projectTitle);
    if (!projectTitle) {
      warn(`${label} skipped: ProjectTitle is blank`);
      continue;
    }

    const field = at(col.field) as Field;
    if (!FIELDS.includes(field)) {
      warn(`${label} skipped: Field "${at(col.field)}" is not a known field`);
      continue;
    }

    const status = at(col.status) as Status;
    if (!STATUSES.includes(status)) {
      warn(`${label} skipped: Status "${at(col.status)}" is not a known status`);
      continue;
    }

    const setting = at(col.setting).toLowerCase() as Setting;
    if (!SETTINGS.includes(setting)) {
      warn(
        `${label} skipped: Setting "${at(col.setting)}" is not a known setting`
      );
      continue;
    }

    const outputType = at(col.outputType) as OutputType;
    if (!OUTPUT_TYPES.includes(outputType)) {
      warn(
        `${label} skipped: OutputType "${at(col.outputType)}" is not a known output type`
      );
      continue;
    }

    const rawReview = at(col.reviewStatus).toLowerCase();
    const reviewStatus = (rawReview || "none") as ReviewStatus;
    if (!REVIEW_STATUSES.includes(reviewStatus)) {
      warn(
        `${label} skipped: ReviewStatus "${at(col.reviewStatus)}" is not a known review status`
      );
      continue;
    }

    const oneLine = at(col.oneLine);
    const leadName = at(col.leadName);
    const abstract = at(col.abstract);
    const startedAt = at(col.startedAt);
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

    // Slug: given, or derived. Unique either way.
    let slug = slugify(at(col.slug) || projectTitle);
    if (!slug) slug = `group-${r}`;
    if (seenSlugs.has(slug)) {
      let n = 2;
      while (seenSlugs.has(`${slug}-${n}`)) n++;
      warn(`${label}: slug "${slug}" already used, using "${slug}-${n}"`);
      slug = `${slug}-${n}`;
    }
    seenSlugs.add(slug);

    const imageSrc = at(col.imageSrc);
    const imageAlt = at(col.imageAlt);

    out.push({
      slug,
      projectTitle,
      field,
      status,
      setting,
      oneLine,
      leadName,
      schoolOrCommunityName: at(col.school) || undefined,
      location: at(col.location) || undefined,
      memberCount: pickInt(at(col.memberCount)),
      abstract,
      outputType,
      methods: pipeList(at(col.methods)),
      milestones: pipeList(at(col.milestones)),
      startedAt,
      reviewStatus,
      image: imageSrc && imageAlt ? { src: imageSrc, alt: imageAlt } : null,
      memberApplicationUrl: at(col.memberApplicationUrl) || null,
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
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
    });
    if (!res.ok) {
      warn(`sheet fetch returned ${res.status}; using fallback data`);
      return FALLBACK;
    }
    const text = await res.text();
    // A published-to-web URL that has been unshared returns an HTML error page.
    if (/^\s*</.test(text)) {
      warn("sheet returned HTML rather than CSV; using fallback data");
      return FALLBACK;
    }
    const groups = rowsToGroups(parseCsv(text));
    if (groups.length === 0) {
      warn("sheet parsed to zero published groups; using fallback data");
      return FALLBACK;
    }
    return groups;
  } catch {
    warn("sheet unreachable or timed out; using fallback data");
    return FALLBACK;
  } finally {
    clearTimeout(timer);
  }
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
