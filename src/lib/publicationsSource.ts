/**
 * Publications — LIVE SOURCE.
 *
 * Journal publications are managed in a Google Sheet published to the web as
 * CSV, fetched and parsed at runtime. A change in the Sheet appears on the site
 * with no code change and no deploy.
 *
 * Mirrors src/lib/eventsSource.ts and src/lib/groupsSource.ts, and shares their
 * CSV parser (src/lib/csv.ts). There is one parser and one fetch helper on this
 * site; this file adds no second approach.
 *
 * ============================================================================
 * EXPECTED SHEET COLUMNS — the header row must contain exactly these names:
 *
 * Published, Slug, Title, Authors, Track, Field, Abstract, FullTextUrl,
 * PublishedAt, ReviewedAt
 *
 * Column ORDER does not matter — columns are matched by header name. Renaming a
 * column breaks only the field it feeds: required fields cause the row to be
 * skipped with a console warning, optional ones go blank. Nothing crashes.
 *
 * Notes on specific columns:
 *   Published    "yes" (case-insensitive) publishes the row. Anything else,
 *                including blank, hides it.
 *   Slug         Blank derives one from Title. Collisions get a numeric suffix
 *                and a console warning.
 *   Authors      Pipe-separated in one cell: "A. Author | B. Author".
 *   Track        working-paper | peer-reviewed. Required, no default — a blank
 *                Track cannot be guessed, because guessing wrong either hides a
 *                reviewed article or presents an unreviewed one as reviewed.
 *   Abstract     Blank lines separate paragraphs, same as group abstracts.
 *   FullTextUrl  A Google Drive share link. Normalised to a direct download —
 *                see normalizeFullTextUrl below. Blank renders "Full text
 *                coming soon" rather than a dead link.
 *   PublishedAt  YYYY-MM-DD. Required.
 *   ReviewedAt   YYYY-MM-DD. Set ONLY on peer-reviewed rows. IGNORED on a
 *                working-paper row, with a warning — see the track rules below.
 * ============================================================================
 *
 * See notes/managing-publications.md for the operator workflow.
 */
import { isMeaningfulValue } from "@/data/research-groups";
import type { Field } from "@/data/research-groups";
import {
  PUBLICATIONS as FALLBACK_PUBLICATIONS,
  type Publication,
  type Track,
} from "@/data/publications";
import {
  fetchSheetRows,
  headerReader,
  isPublished,
  pipeList,
  slugify,
  uniqueSlug,
} from "./csv";

/**
 * The published-to-web CSV URL for the publications Sheet.
 *
 * PASTE THE URL HERE. While it is null the site renders the fallback dataset in
 * src/data/publications.ts, so nothing breaks before it is wired up.
 *
 * Format: https://docs.google.com/spreadsheets/d/e/<long-id>/pub?gid=0&single=true&output=csv
 */
export const PUBLICATIONS_CSV_URL: string | null =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTuaX-SdX7dSlxtropJkn_rAfZPJYUNMs2NOeDPOhTX8hjbh_6YtMntnF-kyfz4xgAjdIcwV_c07V-N/pub?gid=0&single=true&output=csv";

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

const TRACKS: readonly Track[] = ["working-paper", "peer-reviewed"];

/** ISO calendar date, and a real one — 2026-02-31 is rejected. */
function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function warn(message: string): void {
  // Console only. A visitor must never see sheet-shaped diagnostics.
  console.warn(`[publications] ${message}`);
}

/**
 * A cell's value, or null when it is blank OR a placeholder token.
 *
 * Uses isMeaningfulValue, the same predicate settingLine uses, so "N/A", "TBD",
 * "none", "-" and friends are dropped here exactly as they are dropped from a
 * group's setting line. Reusing it rather than writing a second list is the
 * point: one definition of "the operator meant to leave this blank".
 */
function cleanOrNull(raw: string): string | null {
  return isMeaningfulValue(raw) ? raw.trim() : null;
}

/* ------------------------------------------------------------------------- */
/* Full-text URL normalisation                                                */
/* ------------------------------------------------------------------------- */

/** Matches the FILE_ID in a Drive file link, whatever follows it. */
const DRIVE_FILE_RE = /^https:\/\/drive\.google\.com\/file\/d\/([^/?#]+)/i;

/** A Drive FOLDER link. Never renderable as a paper. */
const DRIVE_FOLDER_RE = /drive\.google\.com\/drive\/folders\//i;

/** Already a direct-download link. Passed through untouched. */
const DRIVE_DIRECT_RE = /^https:\/\/drive\.google\.com\/uc\?export=download/i;

/**
 * Turn whatever is in FullTextUrl into something safe to render, or null.
 *
 * Four cases, in order:
 *
 *   1. A Drive FOLDER link is INVALID and returns null. A folder is not a
 *      paper: the link would open a file browser, and "Read the full paper"
 *      pointing at a directory listing is worse than the disabled control.
 *   2. A Drive FILE share link — https://drive.google.com/file/d/FILE_ID/view,
 *      with or without ?usp=sharing — becomes
 *      https://drive.google.com/uc?export=download&id=FILE_ID so the PDF
 *      downloads instead of opening Drive's viewer, which is slow, requires
 *      JavaScript, and nags anonymous readers to sign in.
 *   3. An already-direct uc?export=download URL passes through unchanged, so
 *      normalising twice is a no-op and an operator who pasted the direct form
 *      is not second-guessed.
 *   4. Any other URL passes through unchanged. Not every paper will live on
 *      Drive forever and this must not become a Drive-only field.
 *
 * Blank and placeholder cells return null via cleanOrNull, so "N/A" in this
 * column renders "Full text coming soon" rather than linking to nothing.
 *
 * Exported for testing: this is the one function here with enough branches to
 * be worth asserting directly.
 */
export function normalizeFullTextUrl(
  raw: string,
  onWarn: (message: string) => void = warn
): string | null {
  const value = cleanOrNull(raw);
  if (!value) return null;

  if (DRIVE_FOLDER_RE.test(value)) {
    onWarn(
      `FullTextUrl "${value}" is a Drive FOLDER link, not a file; dropping the link (the row still publishes, with "Full text coming soon")`
    );
    return null;
  }

  if (DRIVE_DIRECT_RE.test(value)) return value;

  const match = value.match(DRIVE_FILE_RE);
  if (match) {
    return `https://drive.google.com/uc?export=download&id=${match[1]}`;
  }

  return value;
}

/* ------------------------------------------------------------------------- */
/* Row conversion                                                             */
/* ------------------------------------------------------------------------- */

/**
 * Convert parsed CSV rows into publications.
 *
 * Skips-and-logs rather than throwing: one bad row must not blank the Journal.
 *
 * THE TRACK RULE IS THE DELICATE PART. A working paper has not been reviewed,
 * so a ReviewedAt supplied on a working-paper row is DISCARDED with a warning
 * rather than stored. Storing it and hoping every render path checks the track
 * would leave a reviewed date one careless `publication.reviewedAt` away from
 * appearing on an unreviewed paper.
 */
export function rowsToPublications(rows: string[][]): Publication[] {
  if (rows.length === 0) return [];

  const read = headerReader(rows[0]);
  const out: Publication[] = [];
  const seenSlugs = new Set<string>();

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const at = (name: string) => read(row, name);
    const label = `row ${r + 1}`;

    if (!isPublished(at("Published"))) continue;

    const title = at("Title");
    if (!title) {
      warn(`${label} skipped: Title is blank`);
      continue;
    }

    const track = at("Track").trim().toLowerCase() as Track;
    if (!TRACKS.includes(track)) {
      warn(
        `${label} skipped: Track "${at("Track")}" is not "working-paper" or "peer-reviewed"`
      );
      continue;
    }

    const field = at("Field") as Field;
    if (!FIELDS.includes(field)) {
      warn(`${label} skipped: Field "${at("Field")}" is not a known field`);
      continue;
    }

    const abstract = at("Abstract");
    if (!abstract) {
      warn(`${label} skipped: Abstract is blank`);
      continue;
    }

    const publishedAt = at("PublishedAt");
    if (!publishedAt) {
      warn(`${label} skipped: PublishedAt is blank`);
      continue;
    }
    if (!isIsoDate(publishedAt)) {
      warn(
        `${label} skipped: PublishedAt "${publishedAt}" is not a valid YYYY-MM-DD date`
      );
      continue;
    }

    const authors = pipeList(at("Authors")).filter((a) => isMeaningfulValue(a));
    if (authors.length === 0) {
      warn(`${label} skipped: Authors is blank`);
      continue;
    }

    /*
     * ReviewedAt. Three outcomes:
     *   working-paper  → always null, and a supplied value is reported as
     *                    ignored so the operator finds out rather than
     *                    believing the date took effect.
     *   peer-reviewed with a valid date → stored.
     *   peer-reviewed with a blank or unparseable date → null, warned. The row
     *                    still publishes and shows its published date; see
     *                    publicationDate() in src/data/publications.ts.
     */
    const rawReviewedAt = cleanOrNull(at("ReviewedAt"));
    let reviewedAt: string | null = null;
    if (track === "working-paper") {
      if (rawReviewedAt) {
        warn(
          `${label}: ReviewedAt "${rawReviewedAt}" ignored because Track is "working-paper" — a working paper has not been peer reviewed`
        );
      }
    } else if (!rawReviewedAt) {
      warn(
        `${label}: Track is "peer-reviewed" but ReviewedAt is blank; showing the published date instead`
      );
    } else if (!isIsoDate(rawReviewedAt)) {
      warn(
        `${label}: ReviewedAt "${rawReviewedAt}" is not a valid YYYY-MM-DD date; showing the published date instead`
      );
    } else {
      reviewedAt = rawReviewedAt;
    }

    const slug = uniqueSlug(
      slugify(at("Slug") || title) || `publication-${r}`,
      seenSlugs,
      (from, to) => warn(`${label}: slug "${from}" already used, using "${to}"`)
    );

    out.push({
      slug,
      title,
      authors,
      track,
      field,
      abstract,
      fullTextUrl: normalizeFullTextUrl(at("FullTextUrl"), (m) =>
        warn(`${label}: ${m}`)
      ),
      publishedAt,
      reviewedAt,
    });
  }

  return out;
}

/* ------------------------------------------------------------------------- */
/* Fetch + cache                                                              */
/* ------------------------------------------------------------------------- */

const FALLBACK: Publication[] = FALLBACK_PUBLICATIONS;

/**
 * In-memory cache for the session. The promise is cached, not just the result,
 * so concurrent callers during the first render share one request.
 */
let cache: Promise<Publication[]> | null = null;

async function fetchPublications(url: string): Promise<Publication[]> {
  const rows = await fetchSheetRows(url, warn);
  if (!rows) return FALLBACK;
  const publications = rowsToPublications(rows);
  if (publications.length === 0) {
    warn("sheet parsed to zero published publications; using fallback data");
    return FALLBACK;
  }
  return publications;
}

/**
 * All published publications. Never throws — returns the fallback dataset when
 * the URL is null, and on any fetch failure, timeout, or malformed response.
 */
export function loadPublications(): Promise<Publication[]> {
  if (!cache) {
    cache = PUBLICATIONS_CSV_URL
      ? fetchPublications(PUBLICATIONS_CSV_URL)
      : Promise.resolve(FALLBACK);
  }
  return cache;
}

/** True when the Sheet is wired up. Drives whether a loading state shows. */
export const IS_PUBLICATIONS_SHEET_CONFIGURED = PUBLICATIONS_CSV_URL !== null;

/**
 * The publications available synchronously, for a component's initial state.
 *
 * With no Sheet configured the fallback is already in the bundle, so returning
 * it here means the first paint is correct rather than flashing an empty page
 * while an effect resolves a promise that was never going to do any work.
 */
export function initialPublications(): Publication[] {
  return IS_PUBLICATIONS_SHEET_CONFIGURED ? [] : FALLBACK;
}

/** Test seam: clears the session cache. Not used by the app. */
export function __resetPublicationsCache(): void {
  cache = null;
}
