/**
 * Single source of truth for cohort dates + contact.
 * Applications OPEN, due July 24, 2026, reviewed on a rolling basis.
 * Cohort runs four weeks, starting August 3, 2026.
 */
export const DATES = {
  status: "closed" as const,
  deadline: "July 24, 2026",
  review: "rolling — decisions within days of submission",
  programStart: "August 3, 2026",
} as const;

export const APPLY_EMAIL = "info@atlas-research.org";
export const LEGACY_PORTAL = "https://atlas-research.org/apply.html";

/**
 * Where the fellowship/chapter forms POST. Point this at a real endpoint
 * (Formspree, Google Apps Script, your own API) to activate direct
 * submission; until then the forms fall back to a prefilled email draft.
 */
export const FORM_ENDPOINT: string | null = null;
