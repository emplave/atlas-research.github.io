/**
 * Atlas openings — THE SINGLE SOURCE OF TRUTH FOR EVERY ROLE.
 *
 * This file is the only place roles are added, edited, opened, or closed.
 * No page or component may hardcode a role. To open or close a position,
 * edit the entry below — never a page.
 *
 * Two separate application pathways, never merged:
 *   category "chapter" — the student who runs a local Atlas Chapter.
 *   category "team"    — Atlas team and leadership positions.
 * A student may hold both. They are applied for separately, through
 * different forms.
 */

export type OpeningCategory = "chapter" | "team";

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

const CHAPTER_FORM_URL = "https://forms.gle/s2qpP3XX3ydLc58k6";
const TEAM_FORM_URL = "https://forms.gle/XiLxGwedVS32LLNc9";
const TEAM_FORM_NOTE =
  "One role per submission. Select this role inside the form.";

export const OPENINGS: Opening[] = [
  {
    slug: "chapter-leader",
    title: "Chapter Leader",
    category: "chapter",
    area: "Chapter leadership",
    status: "rolling",
    selectivity: null,
    commitment: null,
    oneLine:
      "Start and lead a local Atlas Chapter — a working research community, not an honorary title.",
    description:
      "Chapter Leaders run a local Atlas Chapter at a school, in a community setting, as a hybrid, or fully online. The role is to recruit a reliable team, identify an issue in your own local context, and guide a structured research project through to a concrete output — while communicating openly with Atlas and upholding research integrity throughout.\n\nChapters are topic agnostic. A Chapter may investigate a question in any discipline, so long as the question matters where the Chapter is and the team can study it honestly with the access it actually has.\n\nA Chapter is a working research community, not an honorary title. Leading one means holding a meeting cadence, keeping records, chasing people who owe work, and finishing something real.",
    responsibilities: [
      "Secure school or community approval where it is required, before recruiting.",
      "Recruit members and set clear expectations for participation, conduct, and deadlines.",
      "Guide the team to a focused research question and a scope it can realistically complete.",
      "Maintain a meeting cadence, weekly logs, and organized records.",
      "Require credible sources, accurate citations, and honest discussion of limitations.",
      "Communicate with Atlas and raise risks or delays early, not after they land.",
      "Submit milestones and the final product for review.",
      "Represent Atlas professionally in every school, community, and partner interaction.",
    ],
    lookingFor: [
      "Reliability and follow-through — you finish what you start, including the boring middle.",
      "Clear, professional communication with peers, adults, and institutions.",
      "Genuine intellectual curiosity about a question in your own context.",
      "The ability to organize people without over-controlling them.",
      "Respect for evidence and a real willingness to take feedback.",
      "Realistic planning, and early communication when difficulties arise.",
      "Commitment to expanding research access where you are.",
    ],
    regions: null,
    deadline: null,
    formUrl: CHAPTER_FORM_URL,
    formNote: null,
    updatedAt: "2026-08-16",
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
      "Lead Atlas growth and operating quality across an assigned region, and hold the line on both.",
    description:
      "Regional Youth Directors lead Atlas growth and operating quality across an assigned region. The role is the primary link between Atlas leadership, Chapter teams, schools, and regional partners — the person who knows what is actually happening on the ground and reports it accurately.\n\nThe work is equal parts expansion and quality control. A Director recruits and supports new Chapters, but is also responsible for whether existing Chapters in the region are meeting, progressing, and producing work that holds up to review.\n\nInternational regions may have more than one Director depending on scale, time zones, and language. Assignments are made based on where a Director can genuinely operate, not on map boundaries alone.",
    responsibilities: [
      "Own Chapter growth in the assigned region: outreach to schools and community organizations, and support through launch.",
      "Serve as the standing point of contact between Atlas leadership and every Chapter team in the region.",
      "Monitor operating quality across regional Chapters — cadence, progress, and record-keeping — and intervene early when a Chapter stalls.",
      "Build and maintain relationships with regional partners, schools, and community organizations.",
      "Report regional status to Atlas leadership accurately, including problems and stalled Chapters.",
      "Coordinate with other Directors where a region is split across time zones or languages.",
    ],
    lookingFor: [
      "A track record of running things that involved other people and finishing them.",
      "Judgment about when a Chapter needs support and when it needs a hard conversation.",
      "Professional communication with school administrators, community leaders, and partners.",
      "Honest reporting — you surface the Chapters that are failing, not just the ones that look good.",
      "Regional knowledge: you understand the schools, languages, and constraints where you would operate.",
      "Availability of 5-8+ hours per week, sustained, across an academic year.",
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
    updatedAt: "2026-08-16",
  },
  {
    slug: "logistics-analyst",
    title: "Logistics Analyst",
    category: "team",
    area: "Program operations",
    status: "rolling",
    selectivity: "Selective",
    commitment: "2-4 hours per week",
    oneLine:
      "Strengthen the operating systems behind Atlas programs so nothing depends on someone remembering.",
    description:
      "Logistics Analysts strengthen the operating systems behind Atlas programs: calendars, attendance and submission trackers, webinar logistics, status reporting, and documented operating procedures.\n\nThe role exists because programs fail quietly — a deadline nobody tracked, a session nobody set up, a submission nobody logged. The Analyst builds the systems that make those failures visible before they happen.\n\nThe measure of the work is that things run the same way whether or not any particular person is paying attention that week.",
    responsibilities: [
      "Maintain program calendars and keep deadlines accurate across every Atlas program.",
      "Own attendance and submission trackers, and flag gaps to program leads while there is still time to fix them.",
      "Run webinar and session logistics end to end: scheduling, setup, access links, and follow-up.",
      "Produce regular status reports that show real progress, not activity.",
      "Write and maintain documented operating procedures so processes survive turnover.",
    ],
    lookingFor: [
      "Comfort with spreadsheets, trackers, and scheduling tools, and the patience to keep them current.",
      "Attention to detail — you notice the row that is missing.",
      "Clear written documentation: someone else can follow what you wrote without asking you.",
      "Consistency over intensity; the work is small, recurring, and unglamorous.",
      "Availability of 2-4 hours per week on a predictable schedule.",
    ],
    regions: null,
    deadline: null,
    formUrl: TEAM_FORM_URL,
    formNote: TEAM_FORM_NOTE,
    updatedAt: "2026-08-16",
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
      "Research the audience, shape credible campaigns, and support outreach that holds up to scrutiny.",
    description:
      "Marketing Associates work on audience and program research, campaign concepts, credible messaging for email, web, and partner outreach, outreach support, and performance review.\n\nThe constraint that defines the role is credibility. Atlas messaging describes what Atlas actually does — no inflated numbers, no implied guarantees, no borrowed prestige. Copy that overstates is a liability, not a win.\n\nAssociates also close the loop: campaigns get reviewed against what they actually produced, and that review feeds the next one.",
    responsibilities: [
      "Research the audiences Atlas is trying to reach and what each program actually offers them.",
      "Develop campaign concepts and take them from idea to a concrete plan.",
      "Draft credible messaging for email, web, and partner outreach that describes Atlas accurately.",
      "Support outreach to schools, community organizations, and prospective partners.",
      "Review campaign performance and report what worked, what did not, and what changes next time.",
    ],
    lookingFor: [
      "Clear, plain writing — you can explain a program without inflating it.",
      "Instinct for what a specific audience actually needs to hear.",
      "Willingness to check a claim before publishing it.",
      "Comfort reading basic performance data and drawing an honest conclusion from it.",
      "Availability of 2-4 hours per week.",
    ],
    regions: null,
    deadline: null,
    formUrl: TEAM_FORM_URL,
    formNote: TEAM_FORM_NOTE,
    updatedAt: "2026-08-16",
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
      "Own the content calendar and the day-to-day quality of Atlas's public social presence.",
    description:
      "The Social Media Manager owns the content calendar and the day-to-day quality of Atlas's public social presence across approved platforms.\n\nThis is a public-facing voice role. Everything posted is an Atlas statement, which means accuracy comes before reach: no overstated outcomes, no implied publication guarantees, no claims that have not been confirmed.\n\nThe job is steady output at a consistent standard — planning ahead, writing and scheduling posts, responding to what comes back, and keeping a visual and verbal identity that reads as one organization.",
    responsibilities: [
      "Own and maintain the content calendar across approved platforms.",
      "Write, schedule, and publish posts at a consistent cadence and standard.",
      "Keep a consistent visual and verbal identity across every channel.",
      "Monitor replies, mentions, and messages, and respond or escalate appropriately.",
      "Verify every factual claim before it is posted; route anything uncertain to Atlas leadership first.",
      "Report on what content actually reached people and adjust the calendar accordingly.",
    ],
    lookingFor: [
      "Strong short-form writing with a professional register — engaging without being loud.",
      "Reliable cadence; you post on schedule without being chased.",
      "Design sense sufficient to keep visuals consistent.",
      "Judgment about what should not be posted, and when to ask first.",
      "Working knowledge of the platforms Atlas uses and how each one actually behaves.",
      "Availability of 3-5 hours per week.",
    ],
    regions: null,
    deadline: null,
    formUrl: TEAM_FORM_URL,
    formNote: TEAM_FORM_NOTE,
    updatedAt: "2026-08-16",
  },
  {
    slug: "fellowship-mentor",
    title: "Fellowship Mentor",
    category: "team",
    area: "Research mentorship",
    status: "rolling",
    selectivity: "Highly selective",
    commitment: "3-5 hours per week",
    oneLine:
      "Guide fellows through research questions, sources, analysis, and revision — with structured feedback on a schedule.",
    description:
      "Fellowship Mentors guide fellows on research questions, source use, project planning, analysis, and revision. The work runs on structured feedback, scheduled check-ins, and modeling academic integrity in practice rather than describing it.\n\nMentors do not do the research. The role is to sharpen a fellow's question, push back on weak sourcing, catch scope that has grown unrealistic, and make sure limitations are stated honestly in the final work.\n\nMentorship is a commitment to specific fellows for the length of a cohort. Missed check-ins cost a fellow real progress, so consistency matters more than credentials here.",
    responsibilities: [
      "Hold scheduled check-ins with assigned fellows and keep them.",
      "Help fellows narrow a research question to something answerable within the cohort.",
      "Review source quality and citation accuracy, and require corrections where needed.",
      "Give structured written feedback on drafts, focused on evidence and reasoning.",
      "Guide analysis and revision without doing the fellow's work for them.",
      "Model academic integrity directly: attribution, honest limitations, and no overstated conclusions.",
    ],
    lookingFor: [
      "Research experience you can teach from — you can explain why a source is weak, not just that it is.",
      "Feedback that is specific and usable rather than encouraging and vague.",
      "Reliability across a full cohort; fellows depend on the check-ins happening.",
      "Patience with beginners and no interest in taking over their projects.",
      "A firm line on integrity, including when it is inconvenient.",
      "Availability of 3-5 hours per week for the duration of a cohort.",
    ],
    regions: null,
    deadline: null,
    formUrl: TEAM_FORM_URL,
    formNote: TEAM_FORM_NOTE,
    updatedAt: "2026-08-16",
  },
];

/** Openings for the Chapter Leader pathway. Separate from the team pathway. */
export function chapterOpenings(): Opening[] {
  return OPENINGS.filter((o) => o.category === "chapter");
}

/** Openings for the Atlas team and leadership pathway. */
export function teamOpenings(): Opening[] {
  return OPENINGS.filter((o) => o.category === "team");
}

export function findOpening(slug: string): Opening | undefined {
  return OPENINGS.find((o) => o.slug === slug);
}
