/**
 * Single source of truth for cohort dates + contact.
 * Status per founder (2026-07-14): applications are OPEN, due July 27, 2026,
 * reviewed on a rolling basis.
 * NOTE: the legacy portal (atlas-research.org/apply.html) shows July 24 —
 * founder's stated date (July 27) is used here; reconcile before launch.
 */
export const DATES = {
  status: "open" as const,
  deadline: "July 27, 2026",
  review: "rolling — decisions within days of submission",
  programStart: "Summer 2026 (exact dates confirmed on acceptance)",
} as const;

export const APPLY_EMAIL = "apply@atlasresearch.institute";
export const LEGACY_PORTAL = "https://atlas-research.org/apply.html";

/**
 * Where the fellowship/chapter forms POST. Point this at a real endpoint
 * (Formspree, Google Apps Script, your own API) to activate direct
 * submission; until then the forms fall back to a prefilled email draft.
 */
export const FORM_ENDPOINT: string | null = null;
