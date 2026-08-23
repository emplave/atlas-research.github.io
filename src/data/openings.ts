/**
 * Atlas openings — THE SINGLE SOURCE OF TRUTH FOR EVERY ROLE.
 *
 * This file is the only place roles are added, edited, opened, or closed.
 * No page or component may hardcode a role. To open or close a position,
 * edit the entry below — never a page.
 *
 * Two separate application pathways, never merged:
 *   category "chapter" — the Principal Researcher, the student who runs a
 *                        local Atlas research group.
 *                        NOTE: the stored value and the "chapter-leader" slug
 *                        deliberately keep their original names. They are
 *                        internal identifiers, not display copy; the label
 *                        shown to readers is CATEGORY_LABEL below.
 *   category "team"    — Atlas Student Team and leadership positions.
 * A student may hold both. They are applied for separately, through
 * different forms.
 */

export type OpeningCategory = "chapter" | "team";

/**
 * Display labels for the stored category values. Pages render THESE, never
 * the raw value — which is how the internal "chapter" identifier can stay put
 * while the site reads "Principal Researcher" everywhere.
 *
 * THE LABEL AND THE ROLE TITLE ARE THE SAME STRING on the chapter pathway, and
 * that is not an oversight: the pathway has exactly one opening, and naming the
 * pathway anything other than the role invented a second name for one thing.
 * /research-groups already calls this person the Principal Researcher, so the
 * three now agree.
 */
export const CATEGORY_LABEL: Record<OpeningCategory, string> = {
  chapter: "Principal Researcher",
  team: "Atlas Student Team",
};

/**
 * - "open"    — accepting applications until `deadline`.
 * - "rolling" — accepting applications continuously, no deadline.
 * - "closed"  — not accepting applications.
 */
export type OpeningStatus = "open" | "closed" | "rolling";

export type Opening = {
  slug: string;
  title: string;
  category: OpeningCategory;
  area: string;
  status: OpeningStatus;
  selectivity: string | null;
  commitment: string | null;
  oneLine: string;
  description: string;
  responsibilities: string[];
  lookingFor: string[];
  regions: string[] | null;
  /** ISO date (YYYY-MM-DD). null renders as "Rolling". */
  deadline: string | null;
  /** null renders a disabled "Opening soon" state — never a dead link. */
  formUrl: string | null;
  formNote: string | null;
  /** ISO date (YYYY-MM-DD) this entry was last edited. */
  updatedAt: string;
};

/**
 * True when an opening's deadline is in the past.
 *
 * Compared date-only in UTC, so a role stays live through the entirety of its
 * deadline day. Openings with no deadline (rolling) never expire.
 */
export function isDeadlinePassed(
  opening: Opening,
  now: Date = new Date()
): boolean {
  if (!opening.deadline) return false;
  const due = Date.parse(`${opening.deadline}T23:59:59Z`);
  if (Number.isNaN(due)) return false;
  return now.getTime() > due;
}

/**
 * The status a page should actually render — the single function every UI
 * calls. An expired deadline auto-resolves to "closed" so no one has to edit
 * this file when a date passes.
 */
export function effectiveStatus(
  opening: Opening,
  now: Date = new Date()
): OpeningStatus {
  if (opening.status === "closed") return "closed";
  return isDeadlinePassed(opening, now) ? "closed" : opening.status;
}

/** True when the role is currently accepting applications. */
export function isAcceptingApplications(
  opening: Opening,
  now: Date = new Date()
): boolean {
  return effectiveStatus(opening, now) !== "closed";
}

/**
 * True when the apply control must render disabled ("Opening soon") because
 * no form endpoint exists. Never render a dead link.
 */
export function isFormPending(opening: Opening): boolean {
  return !opening.formUrl;
}

const RESEARCH_GROUP_FORM_URL = "https://forms.gle/s2qpP3XX3ydLc58k6";
const TEAM_FORM_URL = "https://forms.gle/aPG2PfhexDJLz8e58";
const TEAM_FORM_NOTE =
  "One role per submission. Select this role inside the form.";

export const OPENINGS: Opening[] = [
  {
    slug: "chapter-leader",
    title: "Principal Researcher",
    category: "chapter",
    area: "Research group leadership",
    status: "rolling",
    selectivity: null,
    commitment: null,
    oneLine:
      "Run a research group at a school, in a community, or online.",
    description:
      "You pick the question and recruit the members. Atlas gives you the structure, a mentor to check your work, and somewhere to submit it at the end. Groups run three or more members over one semester; three is a minimum, not a cap. You are responsible for whether it finishes.",
    responsibilities: [
      "Recruit your members and pick your question",
      "Run the meetings and keep the log current",
      "Check sources and citations before anything goes out",
      "Submit the finished work for review",
    ],
    /*
     * EMPTY ON PURPOSE — the "What we look for" column is not shown for this
     * role, and RoleCard drops the column when this array is empty.
     *
     * This is the highest-friction point in the funnel: it is the one page where
     * a student decides whether to run a group at all. Seven responsibilities
     * beside five criteria they had to measure themselves against read as a
     * warning notice rather than an offer, and the criteria were the worse half —
     * "You finish things", "You take feedback without arguing" — a list of ways
     * to be found wanting, at the exact moment the reader is deciding.
     *
     * The four responsibilities that remain are the job. Do not add a fifth
     * without removing one, and do not put the criteria back here.
     *
     * The five Atlas Student Team openings KEEP their lookingFor — those are
     * applications to join a team that selects, where stated criteria are fair
     * warning rather than a deterrent.
     */
    lookingFor: [],
    regions: null,
    deadline: null,
    formUrl: RESEARCH_GROUP_FORM_URL,
    formNote: null,
    updatedAt: "2026-08-17",
  },
  {
    slug: "regional-youth-director",
    title: "Regional Youth Director",
    category: "team",
    area: "Regional leadership",
    status: "rolling",
    selectivity: "Extremely selective",
    commitment: "5-8+ hours per week",
    oneLine:
      "Build and support research groups across one region.",
    description:
      "You recruit group leads in your region, help them get started, and keep track of whether their projects are actually moving. When a group stalls you find out why. Ten regions, and some international regions have more than one director depending on size, time zones, and language.",
    responsibilities: [
      "Recruit and onboard new group leads",
      "Check in on groups and flag the ones going quiet",
      "Reach out to schools and teachers in your region",
      "Report what is working and what is not",
      "Coordinate with the other directors in shared regions",
    ],
    lookingFor: [
      "You have run something with other people in it",
      "You follow up without being asked twice",
      "You write a clear update",
      "You are comfortable being told your region is behind",
      "You can work across time zones and languages",
    ],
    regions: [
      "America – West",
      "America – Northwest",
      "America – Midwest",
      "America – Northeast",
      "America – Southeast",
      "America – Southwest",
      "International – Europe",
      "International – Asia",
      "International – Africa",
      "International – Oceania",
    ],
    deadline: null,
    formUrl: TEAM_FORM_URL,
    formNote: TEAM_FORM_NOTE,
    updatedAt: "2026-08-17",
  },
  {
    slug: "logistics-analyst-intern",
    title: "Logistics Analyst Intern",
    category: "team",
    area: "Program operations",
    status: "rolling",
    selectivity: "Selective",
    commitment: "2-4 hours per week",
    oneLine:
      "Keep the calendars, trackers, and deadlines straight.",
    description:
      "Sessions need scheduling. Forms need chasing. Submissions go missing. You own the systems that keep those from becoming problems, and you tell leadership when something is about to slip.",
    responsibilities: [
      "Keep the calendar and the submission tracker current",
      "Chase missing forms and logs",
      "Handle session logistics and reminders",
      "Spot scheduling conflicts before they happen",
      "Write down how a process works so the next person can run it",
    ],
    lookingFor: [
      "You are good with spreadsheets",
      "You notice when something is missing",
      "You send the reminder nobody asked you to send",
      "You are fine with unglamorous work that matters",
    ],
    regions: null,
    deadline: null,
    formUrl: TEAM_FORM_URL,
    formNote: TEAM_FORM_NOTE,
    updatedAt: "2026-08-17",
  },
  {
    slug: "marketing-associate",
    title: "Marketing Associate",
    category: "team",
    area: "Brand and growth strategy",
    status: "rolling",
    selectivity: "Selective",
    commitment: "2-4 hours per week",
    oneLine:
      "Get the right students to hear about Atlas.",
    description:
      "You figure out where students who would actually finish a research project spend time, and you reach them there. You write the emails and the copy. You do not overstate what Atlas is.",
    responsibilities: [
      "Find where the right students already are",
      "Write email and web copy",
      "Reach out to schools and student groups",
      "Track what worked and drop what did not",
    ],
    lookingFor: [
      "You write well",
      "You can tell the difference between accurate and impressive",
      "You are curious about why people say yes",
      "You check numbers before you use them",
    ],
    regions: null,
    deadline: null,
    formUrl: TEAM_FORM_URL,
    formNote: TEAM_FORM_NOTE,
    updatedAt: "2026-08-17",
  },
  {
    slug: "social-media-manager",
    title: "Social Media Manager",
    category: "team",
    area: "Digital communications",
    status: "rolling",
    selectivity: "Highly selective",
    commitment: "3-5 hours per week",
    oneLine:
      "Run the accounts and the content calendar.",
    description:
      "Everything you post is Atlas saying it. That means accuracy comes before reach, and anything you are unsure about goes past leadership first. You own the calendar and the standard.",
    responsibilities: [
      "Build and keep the content calendar",
      "Write and schedule posts",
      "Reply to messages or pass them up",
      "Check every claim before it goes out",
      "Report what actually reached people",
    ],
    lookingFor: [
      "You have run an account, a publication, or a campaign",
      "You write well and quickly",
      "Your judgment is good under pressure",
      "You post on time",
    ],
    regions: null,
    deadline: null,
    formUrl: TEAM_FORM_URL,
    formNote: TEAM_FORM_NOTE,
    updatedAt: "2026-08-17",
  },
  {
    slug: "youth-research-ta",
    title: "Youth Research TA",
    category: "team",
    area: "Research mentorship",
    status: "rolling",
    selectivity: "Highly selective",
    commitment: "3-5 hours per week",
    oneLine:
      "Give feedback on student research while it is being written.",
    description:
      "You read questions, sources, and drafts, and you tell students specifically what is wrong and what to do about it. You do not write it for them. The goal is that they need you less by the end.",
    responsibilities: [
      "Help students narrow a question until it can be answered",
      "Read drafts and return specific changes",
      "Hold scheduled check-ins",
      "Flag problems to program leadership early",
      "Correct weak sources and bad citations without being harsh about it",
    ],
    lookingFor: [
      "You have written something researched and finished it",
      "Your feedback is specific rather than encouraging",
      "You are patient",
      "You know the difference between helping and doing it for them",
    ],
    regions: null,
    deadline: null,
    formUrl: TEAM_FORM_URL,
    formNote: TEAM_FORM_NOTE,
    updatedAt: "2026-08-17",
  },
];

/** Openings for the Principal Researcher pathway. Separate from the team pathway. */
export function researchGroupOpenings(): Opening[] {
  return OPENINGS.filter((o) => o.category === "chapter");
}

/** Openings for the Atlas team and leadership pathway. */
export function teamOpenings(): Opening[] {
  return OPENINGS.filter((o) => o.category === "team");
}

export function findOpening(slug: string): Opening | undefined {
  return OPENINGS.find((o) => o.slug === slug);
}
