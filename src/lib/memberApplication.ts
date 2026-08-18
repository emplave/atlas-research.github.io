/**
 * The MEMBER application — for students applying to JOIN an existing research
 * group.
 *
 * THERE ARE TWO SEPARATE FORMS ON THIS SITE. Do not confuse them:
 *
 *   JOIN a specific group   → this file. Prefilled with the group's title.
 *   START a research group   → the Research Group Leader opening in
 *                              src/data/openings.ts (`formUrl`).
 *
 * A card or brief that shows "Apply to join" must use this module. Anything
 * that says "Start a research group" must use openings.ts. Pointing a join
 * action at the start form sends a prospective member to the wrong questions.
 */
import type { ResearchGroup } from "@/data/research-groups";

/**
 * The Google Form entry ID for question 1 of the join form ("which group are
 * you applying to?").
 *
 * THIS ID IS POSITIONAL IN THE FORM'S INTERNAL SCHEMA, NOT IN THE URL. It is
 * bound to that specific question. Two things break the prefill:
 *
 *   - Deleting and re-adding question 1. Google assigns a NEW entry ID, and
 *     this constant then targets a field that no longer exists, so the group
 *     name silently does not appear.
 *   - Reordering questions so a different question becomes question 1. The ID
 *     still resolves, but the group name lands in the wrong field.
 *
 * Editing question 1's *wording* is safe. Editing its *identity* is not. If
 * the form is rebuilt, re-copy the prefilled link from Google and update both
 * this ID and MEMBER_APPLICATION_BASE_URL below.
 */
export const MEMBER_APPLICATION_ENTRY_ID = "244092308";

/**
 * Prefill base URL, ending in `=` so the encoded group title appends directly.
 *
 * Contains MEMBER_APPLICATION_ENTRY_ID as the `entry.` parameter. If you change
 * one, change the other.
 */
export const MEMBER_APPLICATION_BASE_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSd7FD4MfbTBcTwdCqGsFvqPGfYheNQ3CY_p519S7k0B63xyNQ/viewform?usp=pp_url&entry.244092308=";

/**
 * The minimum a group needs to produce a join URL.
 *
 * Deliberately structural rather than the full ResearchGroup, so the helper
 * works with both the fallback records and the Sheet-derived ones.
 */
export type MemberApplicationTarget = Pick<ResearchGroup, "projectTitle"> & {
  /** Per-group override from the Sheet's MemberApplicationUrl column. */
  memberApplicationUrl?: string | null;
};

/**
 * Where "Apply to join" should point for a given group.
 *
 * Returns the group's own `memberApplicationUrl` when the Sheet supplies one,
 * so a lead can run their own form without a code change. Otherwise returns
 * the shared form prefilled with the group's title.
 *
 * `encodeURIComponent` is required, not optional: project titles contain
 * spaces, colons, and ampersands, and a raw `&` would terminate the query
 * parameter and drop the rest of the title.
 */
export function memberApplicationUrl(group: MemberApplicationTarget): string {
  const override = group.memberApplicationUrl?.trim();
  if (override) return override;
  return MEMBER_APPLICATION_BASE_URL + encodeURIComponent(group.projectTitle);
}
