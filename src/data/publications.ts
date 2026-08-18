import type { Field } from "./research-groups";

/**
 * Atlas Journal publications — THE SINGLE SOURCE OF TRUTH.
 *
 * This file is the only place publications are added or edited. No page or
 * component may hardcode one.
 *
 * TWO TRACKS, NEVER MERGED:
 *
 *   "working-paper"  — Founding contributions from the Atlas team, published
 *                      WITHOUT external peer review. A working paper must
 *                      never be labelled peer reviewed, described as
 *                      reviewed, or presented alongside reviewed articles as
 *                      though the two carry the same standing.
 *
 *   "peer-reviewed"  — Articles that have completed external review. Empty
 *                      until the first reviewed issue is actually published.
 *                      Do not seed placeholders in this track: an empty
 *                      reviewed list is honest, a fake one is not.
 *
 * NEVER write "ISSN" anywhere. No invented authors, affiliations, metrics, or
 * impact factor. Publication is decided by review.
 */
export type Track = "working-paper" | "peer-reviewed";

export type Publication = {
  slug: string;
  title: string;
  authors: string[];
  track: Track;
  field: Field;
  abstract: string;
  /** null renders "Full text coming soon" — never a dead link. */
  fullTextUrl: string | null;
  /** ISO date (YYYY-MM-DD). */
  publishedAt: string;
};

/**
 * PLACEHOLDER DATA — NOT A REAL PAPER.
 *
 * One placeholder working paper, to exercise the journal UI. Hamaad supplies
 * the real papers and their PDFs. The authors array deliberately does not
 * name a person.
 */
export const PUBLICATIONS: Publication[] = [
  {
    slug: "placeholder-working-paper",
    title:
      "PLACEHOLDER: What student research groups produce, and what gets in the way",
    authors: ["Atlas Research Institute"],
    track: "working-paper",
    field: "Social Sciences",
    abstract:
      "PLACEHOLDER ABSTRACT. This working paper describes the conditions under which small student research groups complete a project rather than abandoning it, drawing on the operating model Atlas uses to support them.\n\nIt sets out what a group needs in place before work starts — a defined question, a named lead, a meeting cadence, and access to sources it can actually reach — and identifies the points at which projects most often stall.\n\nAs a working paper, this has not been externally peer reviewed. It is published as a founding contribution while the first open call for submissions is underway.",
    fullTextUrl: null,
    publishedAt: "2026-06-01",
  },
];

/** Working papers, newest first. Published without external peer review. */
export function workingPapers(): Publication[] {
  return PUBLICATIONS.filter((p) => p.track === "working-paper").sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
}

/**
 * Peer-reviewed articles, newest first. Expected to be empty until the first
 * reviewed issue is published — callers must render the empty case honestly
 * rather than filling it.
 */
export function peerReviewedArticles(): Publication[] {
  return PUBLICATIONS.filter((p) => p.track === "peer-reviewed").sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
}

/** True when the full-text control must render disabled, not as a dead link. */
export function isFullTextPending(publication: Publication): boolean {
  return !publication.fullTextUrl;
}

export function findPublication(slug: string): Publication | undefined {
  return PUBLICATIONS.find((p) => p.slug === slug);
}
