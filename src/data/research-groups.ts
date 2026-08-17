/**
 * Atlas ResearchGroups — research group directory data layer.
 *
 * This file is the only source of truth for Atlas research groups. No page
 * or component may hardcode a group.
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
};

/** Statuses hidden from the directory unless explicitly filtered for. */
export const HIDDEN_BY_DEFAULT: readonly Status[] = ["Archived"];

/** True when a group should appear in the default (unfiltered) directory view. */
export function isVisibleByDefault(group: ResearchGroup): boolean {
  return !HIDDEN_BY_DEFAULT.includes(group.status);
}

/** True when a group should render an Apply action. Recruiting only. */
export function canApply(group: ResearchGroup): boolean {
  return group.status === "Recruiting";
}

/**
 * PLACEHOLDER DATA — NOT REAL CHAPTERS.
 *
 * Every group below is invented to exercise the directory UI across fields,
 * statuses, and settings. Hamaad replaces these with real groups before
 * launch. Do not cite, screenshot, or reference any of this as an Atlas
 * claim while it remains placeholder.
 */
export const RESEARCH_GROUPS: ResearchGroup[] = [
  {
    slug: "placeholder-transit-reliability",
    projectTitle: "Placeholder: Bus Reliability and Late Arrivals in a Commuter Corridor",
    field: "Social Sciences",
    status: "Recruiting",
    setting: "school",
    oneLine:
      "Placeholder group testing whether published bus timetables match observed arrivals along one commuter corridor.",
    leadName: "Placeholder Lead",
    schoolOrCommunityName: "Placeholder Secondary School",
    location: "Placeholder City, Placeholder Region",
    memberCount: 5,
    abstract:
      "PLACEHOLDER ABSTRACT. This group examines the gap between scheduled and observed arrival times on a single bus corridor that a large share of local students depend on. Published timetables are treated as a claim to be tested rather than a description of service.\n\nMembers collect timestamped arrival observations at fixed stops across a set observation window, then compare them against the operator's published schedule and open service data. The analysis focuses on the distribution of delay rather than the average, since a small number of long delays drives most missed connections.\n\nFindings are written up as a policy brief for the local transit authority, with explicit discussion of sampling limits, observer error, and the seasons and hours the data does not cover.",
    outputType: "Policy brief",
    methods: [
      "Structured field observation at fixed stops",
      "Comparison against published timetable and open service data",
      "Descriptive distribution analysis of delay",
    ],
    milestones: [
      "Define corridor, stops, and observation windows",
      "Pilot observation round and refine the recording protocol",
      "Complete primary data collection",
      "Analysis and internal review",
      "Draft policy brief and submit for Atlas review",
    ],
    startedAt: "2026-02-09",
    reviewStatus: "none",
  },
  {
    slug: "placeholder-clinic-wait-times",
    projectTitle: "Placeholder: Reported Wait Times at Walk-In Clinics",
    field: "Health & Life Sciences",
    status: "In Progress",
    setting: "community",
    oneLine:
      "Placeholder group surveying patients on how long walk-in clinic visits actually take, start to finish.",
    leadName: "Placeholder Lead",
    schoolOrCommunityName: "Placeholder Community Center",
    location: "Placeholder Town, Placeholder Region",
    memberCount: 7,
    abstract:
      "PLACEHOLDER ABSTRACT. This group documents patient-reported wait times at walk-in clinics in one municipality, where no wait-time figures are published and residents rely on word of mouth.\n\nThe team administers a short exit survey with informed consent, recording arrival time, time seen, visit reason category, and time of day. No identifying information is collected. Responses are voluntary, and the group tracks refusals so response bias can be discussed honestly rather than ignored.\n\nThe output is a survey study written for a general audience, presented to a local health advisory group. The group states plainly that self-reported times are estimates and that a convenience sample cannot support claims about the municipality as a whole.",
    outputType: "Survey or interview study",
    methods: [
      "Anonymous patient exit survey with informed consent",
      "Refusal and non-response tracking",
      "Cross-tabulation by time of day and visit category",
    ],
    milestones: [
      "Draft survey instrument and consent script",
      "Secure clinic and community center permissions",
      "Pilot with a small sample and revise wording",
      "Full collection period",
      "Analysis, write-up, and submission for Atlas review",
    ],
    startedAt: "2025-11-03",
    reviewStatus: "none",
  },
  {
    slug: "placeholder-river-turbidity",
    projectTitle: "Placeholder: Seasonal Turbidity in a Local River After Rainfall",
    field: "Environment & Sustainability",
    status: "Full",
    setting: "hybrid",
    oneLine:
      "Placeholder group measuring how river water clarity changes in the days following heavy rainfall.",
    leadName: "Placeholder Lead",
    schoolOrCommunityName: "Placeholder Regional School",
    location: "Placeholder Valley, Placeholder Region",
    memberCount: 9,
    abstract:
      "PLACEHOLDER ABSTRACT. This group tracks turbidity at three points along a local river to describe how water clarity responds to rainfall events over a single season.\n\nMembers take readings on a fixed weekly schedule plus additional readings within 48 hours of any rainfall above a set threshold, using the same instrument and protocol at every site. Rainfall totals come from the nearest public weather station, and the group records instrument calibration dates alongside every reading.\n\nResults are compiled into a regional data profile with the full raw dataset attached. The group is explicit that three sites over one season describes a pattern and does not establish a cause.",
    outputType: "Regional data profile",
    methods: [
      "Fixed-site turbidity sampling on a weekly and post-rainfall schedule",
      "Public weather station rainfall matching",
      "Instrument calibration logging",
    ],
    milestones: [
      "Site selection and access permissions",
      "Protocol write-up and instrument calibration",
      "Weekly sampling across the season",
      "Dataset cleaning and quality checks",
      "Data profile drafted and submitted for Atlas review",
    ],
    startedAt: "2025-09-15",
    reviewStatus: "none",
  },
  {
    slug: "placeholder-model-card-review",
    projectTitle: "Placeholder: What Public Model Cards Actually Disclose",
    field: "Computer Science & AI",
    status: "Recruiting",
    setting: "online",
    oneLine:
      "Placeholder group reviewing published model cards to see which disclosures appear consistently and which do not.",
    leadName: "Placeholder Lead",
    location: "Distributed / online",
    memberCount: 6,
    abstract:
      "PLACEHOLDER ABSTRACT. This group reviews publicly available model cards and system cards for machine learning models to identify which categories of disclosure recur and which are routinely absent.\n\nThe team builds a coding scheme covering training data description, evaluation coverage, known limitations, and stated intended use, then two members independently code each document so disagreement can be measured rather than assumed away. Only public documents are used, and every source is cited with its retrieval date.\n\nThe output is a literature review summarizing disclosure patterns across the sample. The group notes that the sample reflects what organizations chose to publish, which is not the same as what those organizations know.",
    outputType: "Literature review",
    methods: [
      "Systematic document sampling with stated inclusion criteria",
      "Independent double-coding against a shared scheme",
      "Inter-coder agreement measurement",
    ],
    milestones: [
      "Define inclusion criteria and assemble the document sample",
      "Draft and pilot the coding scheme",
      "Independent coding and disagreement resolution",
      "Synthesis and drafting",
      "Submit for Atlas review",
    ],
    startedAt: "2026-01-20",
    reviewStatus: "none",
  },
  {
    slug: "placeholder-market-vendor-costs",
    projectTitle: "Placeholder: Input Costs and Pricing Among Open-Air Market Vendors",
    field: "Economics & Business",
    status: "Completed",
    setting: "community",
    oneLine:
      "Placeholder group interviewing market vendors about how rising input costs moved their prices over one year.",
    leadName: "Placeholder Lead",
    schoolOrCommunityName: "Placeholder Market Association",
    location: "Placeholder District, Placeholder Region",
    memberCount: 4,
    abstract:
      "PLACEHOLDER ABSTRACT. This group interviewed vendors at a single open-air market about how changes in wholesale input costs over the prior year translated into the prices they charged.\n\nThe team conducted semi-structured interviews with consenting vendors, using a fixed question set with room for follow-ups, and paired each interview with the vendor's own recollection of price changes on two staple items. Interviews were summarized rather than recorded, at the vendors' request, and no vendor is identified by name.\n\nThe completed study describes a consistent pattern of delayed and partial pass-through, with vendors absorbing early cost increases before raising prices. The group is direct about the limits: one market, one year, recalled figures rather than records, and a self-selected set of participants.",
    outputType: "Survey or interview study",
    methods: [
      "Semi-structured vendor interviews with a fixed question set",
      "Paired recall of price changes on staple items",
      "Thematic coding of interview summaries",
    ],
    milestones: [
      "Market association approval and vendor outreach",
      "Question set drafted and piloted",
      "Interview round completed",
      "Thematic analysis and write-up",
      "Final study submitted for Atlas review",
    ],
    startedAt: "2025-03-10",
    reviewStatus: "in review",
  },
  {
    slug: "placeholder-oral-history-archive",
    projectTitle: "Placeholder: Oral Histories of a Closed Neighborhood Library",
    field: "Humanities",
    status: "Archived",
    setting: "school",
    oneLine:
      "Placeholder group that dissolved before collection began; retained as an archived record only.",
    leadName: "Placeholder Lead",
    schoolOrCommunityName: "Placeholder Academy",
    location: "Placeholder City, Placeholder Region",
    memberCount: 3,
    abstract:
      "PLACEHOLDER ABSTRACT. This group set out to record oral histories from long-term residents about a neighborhood library that closed, and what its closure changed about how people in the area gathered and studied.\n\nThe group completed a consent protocol and an interview guide but dissolved before collection began, after the lead graduated and the remaining members could not sustain a meeting cadence. No interviews were conducted and no participant data exists.\n\nThe record is retained in archived state so the planning materials remain available to any future group that wants to take up the question. It is excluded from the default directory view and carries no findings.",
    outputType: "Community presentation",
    methods: [
      "Oral history interview protocol (drafted, never executed)",
      "Participant consent framework (drafted)",
    ],
    milestones: [
      "Interview guide drafted",
      "Consent protocol drafted",
      "Group dissolved — collection never started",
    ],
    startedAt: "2025-01-13",
    reviewStatus: "none",
  },
];
