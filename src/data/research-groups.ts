/**
 * Atlas research groups — FALLBACK DATASET AND TYPES.
 *
 * THIS IS NOT THE LIVE SOURCE. Research groups are managed in a Google Sheet
 * and read at runtime by src/lib/groupsSource.ts. The array at the bottom of
 * this file is used ONLY when the Sheet is unreachable, unconfigured, or
 * returns nothing publishable.
 *
 * Editing this file does not change the site once the Sheet is wired up. To
 * add, edit, publish, unpublish, or restatus a group, edit the Sheet — see
 * notes/managing-research-groups.md.
 *
 * The TYPES here remain authoritative: groupsSource validates every Sheet row
 * against the unions below and skips rows that do not match.
 *
 * TOPIC AGNOSTIC by design. A group investigates an issue in its own local
 * context, in any discipline. Nothing here assumes an education subject.
 */

/** Disciplinary bucket a group's work sits in. Deliberately broad. */
export type Field =
  | "Computer Science & AI"
  | "Health & Life Sciences"
  | "Engineering & Technology"
  | "Physical Sciences & Mathematics"
  | "Social Sciences"
  | "Humanities"
  | "Economics & Business"
  | "Environment & Sustainability";

/**
 * Lifecycle state of a research group.
 *
 * - "Recruiting"  — open for members. The ONLY status that shows an Apply action.
 * - "Full"        — active, roster closed. Visible, no Apply action.
 * - "In Progress" — active, mid-project. Visible, no Apply action.
 * - "Completed"   — finished its output. Stays visible permanently. No Apply action.
 * - "Archived"    — dead or dissolved. EXCLUDED from the default directory view,
 *                   reachable only when a user explicitly filters for it.
 */
export type Status =
  | "Pending"
  | "Forming"
  | "Recruiting"
  | "Full"
  | "In Progress"
  | "Completed"
  | "Archived";

/** Where the group actually meets and operates. */
export type Setting = "school" | "community" | "hybrid" | "online";

/** The concrete deliverable a group is working toward. */
export type OutputType =
  | "Policy brief"
  | "Literature review"
  | "Survey or interview study"
  | "Regional data profile"
  | "Community presentation"
  | "Access initiative";

/**
 * Where a completed output sits in the Atlas review process.
 *
 * This is a review state, NOT a publication promise. Completed work may be
 * submitted; the Atlas research and editorial team decides what advances.
 * Work meeting the journal's standards may be considered for publication in
 * the Atlas Journal. "submitted" and "in review" carry no expectation of a
 * published outcome.
 *
 * - "none"      — nothing submitted for review.
 * - "submitted" — received by Atlas, not yet assigned to reviewers.
 * - "in review" — under evaluation. Outcome undecided.
 * - "published" — reviewed, accepted, and published. Only ever set after the fact.
 */
export type ReviewStatus = "none" | "submitted" | "in review" | "published";

/**
 * A card image. `src` is a path under /public/images/ (see the README there
 * for required dimensions). Null is a first-class value, not a missing
 * asset — the card renders a typographic fallback instead.
 */
export type GroupImage = { src: string; alt: string };

export type ResearchGroup = {
  slug: string;
  projectTitle: string;
  field: Field;
  status: Status;
  setting: Setting;
  /** One-sentence summary for directory cards. Keep to ~140 characters. */
  oneLine: string;
  leadName: string;
  schoolOrCommunityName?: string;
  location?: string;
  memberCount: number;
  /** 2–3 paragraphs, separated by blank lines. */
  abstract: string;
  outputType: OutputType;
  methods: string[];
  milestones: string[];
  /** ISO date (YYYY-MM-DD) the group started work. */
  startedAt: string;
  reviewStatus: ReviewStatus;
  /** 16:9 card image, or null to render the typographic fallback. */
  image: GroupImage | null;
  /**
   * The group's own join form, from the Sheet's MemberApplicationUrl column.
   *
   * REQUIRED FOR AN APPLY BUTTON. There is no generic fallback: if this is null
   * no button renders, even when recruitingOpen is true. A shared prefilled form
   * used to stand in here, which meant an empty cell still produced a live
   * button pointing somewhere the operator had not chosen.
   */
  memberApplicationUrl?: string | null;
  /**
   * From the Sheet's RecruitingOpen column — exactly "yes" opens applications.
   *
   * SEPARATE FROM `status` ON PURPOSE. Status is the lifecycle ("Forming",
   * "In Progress"); this is a switch the lead controls. A group can be
   * mid-project and still taking members, or Recruiting on paper with the form
   * closed while the lead catches up. Deriving one from the other, which is what
   * canApply() used to do, made both wrong.
   */
  recruitingOpen: boolean;
};

/**
 * Values operators sometimes type into a cell that is meant to be blank.
 *
 * These are NOT data. "N/A" in SchoolOrCommunityName is someone answering the
 * column rather than leaving it empty, and printing it produces lines like
 * "Online · N/A · Online". Compared case-insensitively with whitespace and
 * punctuation stripped, so "N/A", "n.a.", and " NA " all match.
 */
const PLACEHOLDER_VALUES = new Set([
  "na",
  "n/a",
  "n.a.",
  "none",
  "nil",
  "tbd",
  "tba",
  "-",
  "--",
  "null",
  "undefined",
  "notapplicable",
]);

/** True when a cell holds real content rather than blank or a placeholder. */
export function isMeaningfulValue(value?: string | null): boolean {
  if (!value) return false;
  const trimmed = value.trim();
  if (trimmed === "") return false;
  return !PLACEHOLDER_VALUES.has(trimmed.toLowerCase().replace(/[\s.]/g, ""));
}

/** Short setting labels, used on cards and in the directory. */
export const SETTING_LABEL: Record<Setting, string> = {
  school: "School",
  community: "Community",
  hybrid: "Hybrid",
  online: "Online",
};

/** Longer setting labels, for the brief page's details sidebar. */
export const SETTING_LABEL_LONG: Record<Setting, string> = {
  school: "School-based",
  community: "Community-based",
  hybrid: "Hybrid",
  online: "Online",
};

/**
 * The one-line "where this group is" string: setting, host, location.
 *
 * Three rules, all of which the naive join broke:
 *
 *   1. Blank and placeholder segments are dropped. SchoolOrCommunityName does
 *      not apply to a fully online group, so it is legitimately empty there.
 *   2. No value is printed twice. An online group whose Location is also
 *      "Online" produced "Online · Online".
 *   3. Order is fixed — setting, host, location — so the line reads the same
 *      way for every group regardless of which parts exist.
 *
 * An online group with nothing else set therefore reads just "Online".
 */
export function settingLine(
  group: Pick<
    ResearchGroup,
    "setting" | "schoolOrCommunityName" | "location"
  >,
  labels: Record<Setting, string> = SETTING_LABEL
): string {
  const segments = [
    labels[group.setting],
    group.schoolOrCommunityName,
    group.location,
  ];

  const out: string[] = [];
  const seen = new Set<string>();
  for (const segment of segments) {
    if (!isMeaningfulValue(segment)) continue;
    const value = (segment as string).trim();
    const key = value.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(value);
  }
  return out.join(" · ");
}

/** Statuses hidden from the directory unless explicitly filtered for. */
export const HIDDEN_BY_DEFAULT: readonly Status[] = ["Archived"];

/** True when a group should appear in the default (unfiltered) directory view. */
export function isVisibleByDefault(group: ResearchGroup): boolean {
  return !HIDDEN_BY_DEFAULT.includes(group.status);
}

/**
 * True when a group is taking new members.
 *
 * ONE CONDITION: the Sheet's RecruitingOpen cell is exactly "yes". Not `status` —
 * a group can be Forming and taking members, or Recruiting on paper with intake
 * paused, so deriving one from the other made both wrong.
 *
 * It used to also require a non-empty MemberApplicationUrl, to avoid rendering a
 * button with nowhere to send anyone. That condition is gone because the premise
 * is: memberApplicationUrl() now generates a prefilled link for every group from
 * its title, so a URL always exists and the Sheet column is only an override.
 * isRecruitingWithoutForm() went with it — the state it described can no longer
 * occur.
 *
 * THIS IS THE SINGLE SOURCE FOR BOTH THE MARKER AND THE BUTTON. The card's
 * "Taking members" marker and its "Apply to join" action both read this, so a
 * group can never advertise one without the other.
 *
 * A group not taking members still appears in the listing with everything else.
 */
export function canApply(group: ResearchGroup): boolean {
  return group.recruitingOpen;
}

/**
 * THE /research-groups LISTING ORDER: groups taking new members first, newest
 * first within each half.
 *
 * The recruiting-first rule reads canApply — THE SAME PREDICATE the "Taking
 * members" marker and the "Apply to join" button use — so the order can never
 * disagree with the marker. A card marked as taking members cannot sort below
 * one that is not.
 *
 * The secondary sort is startedAt descending.
 *
 * THAT SECONDARY SORT IS CURRENTLY ARBITRARY, and not because of this function.
 * The Sheet holds StartedAt as US M/D/YYYY ("9/1/2026") rather than ISO, so this
 * is a string comparison on a format that does not sort — "11/1/2026" lands
 * before "8/10/2026". Fixing it means changing those cells to 2026-09-01 form; a
 * parser here would have to guess between US and international convention on an
 * ambiguous value, which is worse than a Sheet edit. The recruiting split above
 * it works regardless.
 *
 * THE HOMEPAGE NO LONGER USES THIS. It sorts with sortForFeatured below, which
 * adds member count as a middle key. The two functions were one for exactly the
 * reason you would expect — two views of the same data drift — so if you change
 * the recruiting split here, change it there too. The split itself is the part
 * that must never diverge; the tiebreaks below it are allowed to.
 *
 * Returns a new array. Callers must not rely on the input being reordered.
 */
export function sortForListing(groups: ResearchGroup[]): ResearchGroup[] {
  return groups.slice().sort((a, b) => {
    const byRecruiting = Number(canApply(b)) - Number(canApply(a));
    if (byRecruiting !== 0) return byRecruiting;
    return b.startedAt.localeCompare(a.startedAt);
  });
}

/**
 * THE HOMEPAGE ORDER: recruiting first, then the biggest groups, then the newest.
 *
 * Separate from sortForListing because the homepage SLICES. Only six cards
 * survive, so the order decides what a reader never sees, and the two questions
 * are different: the listing is showing everything and only has to decide what
 * leads, while this has to decide what makes the cut.
 *
 * The keys, in order:
 *
 *   1. canApply — a group someone can actually join is never the one cut. Same
 *      predicate as the marker and the button, exactly as in sortForListing.
 *   2. memberCount descending — of the groups that are open, the ones that have
 *      pulled people in are the better evidence that any of this is real. A
 *      six-member group is a stronger card than a one-member group.
 *   3. startedAt descending — the tiebreak, matching the listing.
 *
 * The startedAt caveat above applies here too: the Sheet's US date format does
 * not string-sort. It is the last key of three, so it decides less here than it
 * does in the listing.
 *
 * Returns a new array.
 */
export function sortForFeatured(groups: ResearchGroup[]): ResearchGroup[] {
  return groups.slice().sort((a, b) => {
    const byRecruiting = Number(canApply(b)) - Number(canApply(a));
    if (byRecruiting !== 0) return byRecruiting;
    const byMembers = b.memberCount - a.memberCount;
    if (byMembers !== 0) return byMembers;
    return b.startedAt.localeCompare(a.startedAt);
  });
}

/**
 * FALLBACK DATA — DELIBERATELY EMPTY.
 *
 * This array held six invented groups, used to exercise the directory UI. They
 * are gone, and it must stay empty until there are REAL groups to put in it.
 *
 * WHY THEY WERE REMOVED. They rendered as complete research group briefs at
 * /research-groups/<slug> — with abstracts, methods, named leads, and two marked
 * Completed — to anyone who had or guessed the URL. Removing the directory hid
 * them from the site's own navigation but left them served. Fabricated research
 * output is not something to leave reachable, indexed or not.
 *
 * The old note here argued the opposite: that a populated fallback was worth
 * keeping so an unreachable Sheet "degrades to a populated directory instead of
 * a blank page". That reasoning died with the directory. There is no listing to
 * populate, and the only consumer left is the brief page, which resolves one
 * slug at a time — so the honest failure mode for an unreachable Sheet is "no
 * research group at this address", not a page of invented ones.
 *
 * IF YOU ADD ENTRIES HERE they must be real, published groups, and they will be
 * served whenever the Sheet is unreachable. Placeholder content in this array is
 * live content.
 */
export const RESEARCH_GROUPS: ResearchGroup[] = [];
