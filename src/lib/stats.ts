/**
 * Atlas counts — single source of truth for every displayed number.
 *
 * NO COUNTS ARE DISPLAYED AT LAUNCH. Every value below is null, so the stat
 * band renders nothing at all. That is deliberate: an unverified number on a
 * credibility site is worse than no number.
 *
 * TO TURN THE BAND ON: fill in one or more values here. Nothing else needs
 * editing — hasStat() gates each slot and displayStats() builds the band from
 * whatever is non-null.
 *
 * Rules: do not invent counts, do not use placeholder numbers, and never put
 * "coming soon" in a stat slot. A slot with no number does not exist.
 */

/** Number of active research groups. */
export const ACTIVE_RESEARCH_GROUPS: number | null = null;

/** Number of countries with at least one active research group. */
export const COUNTRIES_ACTIVE: number | null = null;

/** Number of students across all active research groups. */
export const STUDENTS_ACTIVE: number | null = null;

/** Number of completed research outputs. */
export const COMPLETED_OUTPUTS: number | null = null;

/** Number of schools and community organisations hosting groups. */
export const HOST_INSTITUTIONS: number | null = null;

/**
 * Eligibility, expressed as copy rather than a grade range.
 *
 * DO NOT render "9-12" anywhere. Atlas accepts Grade 8 or below, Grades 9
 * through 12, gap year students, college and university students, and
 * international equivalents. A grade range excludes most of that.
 */
export const ELIGIBILITY_LABEL = "Secondary and university students worldwide";

/** Length of the Fellowship cohort, in weeks. */
export const FELLOWSHIP_WEEKS = 4;

/** True when a stat has a real value and may be rendered. */
export function hasStat(value: number | null): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export type DisplayStat = { value: number; label: string };

/**
 * The stats the band should render, in order — only those with real values.
 * Empty at launch, which is why the band renders nothing.
 */
export function displayStats(): DisplayStat[] {
  const candidates: { value: number | null; label: string }[] = [
    { value: ACTIVE_RESEARCH_GROUPS, label: "Research groups" },
    { value: COUNTRIES_ACTIVE, label: "Countries" },
    { value: STUDENTS_ACTIVE, label: "Students" },
    { value: COMPLETED_OUTPUTS, label: "Completed outputs" },
    { value: HOST_INSTITUTIONS, label: "Host institutions" },
  ];
  return candidates.flatMap((c) =>
    hasStat(c.value) ? [{ value: c.value, label: c.label }] : []
  );
}
