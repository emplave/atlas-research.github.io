/**
 * Homepage numbers — single source of truth.
 *
 * Every number rendered on the homepage lives here as a named export. No page
 * or component may hardcode a figure. If a number is not in this file, it
 * should not be on the site.
 *
 * Everything below is marked PLACEHOLDER until Hamaad confirms it against a
 * real record. A number with no source behind it does not ship.
 *
 * Rule: do not invent counts. If a figure cannot be verified, it stays null
 * and the UI renders nothing rather than a guess.
 */

/**
 * PLACEHOLDER — verify before launch.
 * Length of the Fellowship cohort, in weeks. Rendered as "4" / "Four weeks".
 */
export const FELLOWSHIP_WEEKS: number = 4;

/**
 * Eligibility, expressed as copy rather than a grade range.
 *
 * DO NOT render "9–12" anywhere. Atlas applications accept Grade 8 or below,
 * Grades 9 through 12, gap year students, college and university students,
 * and international equivalents. A grade range excludes most of that, so
 * eligibility is stated in words, not numbers.
 *
 * ELIGIBILITY_LABEL is the short form for cards and stat rows.
 * ELIGIBILITY_LONG is the full enumeration for eligibility sections and FAQ.
 */
export const ELIGIBILITY_LABEL = "Open to secondary and university students worldwide";

export const ELIGIBILITY_LONG =
  "Open to secondary and university students worldwide — Grade 8 or below, Grades 9 through 12, gap year, college and university, and international equivalents.";

/**
 * PLACEHOLDER — verify before launch.
 * Number of written essays in the application. Currently three short essays,
 * no résumé. Must match public/apply.html if that form changes.
 */
export const APPLICATION_ESSAY_COUNT: number = 3;

/**
 * NOT A PLACEHOLDER — this is a policy statement, not a metric.
 * The Fellowship costs nothing. Rendered as "Free" / "$0 — free, always".
 */
export const FELLOWSHIP_COST_LABEL = "Free";

/**
 * UNVERIFIED — INTENTIONALLY NULL. DO NOT FILL IN WITH AN ESTIMATE.
 *
 * The site previously claimed "Active in 15 countries" in three places. That
 * figure has no source behind it and is not a live claim. It stays null until
 * there is a real record to count, and the UI must render nothing — not a
 * fallback, not a rounded guess — while it is null.
 */
export const COUNTRIES_ACTIVE: number | null = null;

/**
 * UNVERIFIED — INTENTIONALLY NULL. DO NOT FILL IN WITH AN ESTIMATE.
 * Number of active Chapters. Derive from real records in src/data/chapters.ts
 * once those are real groups rather than placeholder seed data.
 */
export const ACTIVE_CHAPTERS: number | null = null;

/**
 * UNVERIFIED — INTENTIONALLY NULL. DO NOT FILL IN WITH AN ESTIMATE.
 * Number of fellows across all cohorts to date.
 */
export const FELLOWS_TO_DATE: number | null = null;

/**
 * UNVERIFIED — INTENTIONALLY NULL. DO NOT FILL IN WITH AN ESTIMATE.
 * Number of schools and community organizations hosting Chapters.
 */
export const HOST_INSTITUTIONS: number | null = null;

/**
 * True when a stat has a confirmed value and may be rendered.
 * Use this at every call site so null stats disappear instead of showing "0".
 */
export function hasStat(value: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}
