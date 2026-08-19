/**
 * Generate the research groups Sheet template.
 *
 *   node scripts/generate-sheet-template.mjs
 *
 * Writes notes/research-groups-template.csv: the exact header row the site
 * expects, plus three example rows taken from the fallback seed data so the
 * expected format is visible rather than described.
 *
 * The header list is duplicated here deliberately. This script must run under
 * plain node with no build step and no dependencies, so it cannot import the
 * TypeScript source. If the columns in src/lib/groupsSource.ts change, change
 * them here too — the check at the bottom of this file will not catch it.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HEADERS = [
  "Published",
  "Slug",
  "ProjectTitle",
  "Field",
  "Status",
  "Setting",
  "OneLine",
  "LeadName",
  "SchoolOrCommunityName",
  "Location",
  "MemberCount",
  "Abstract",
  "OutputType",
  "Methods",
  "Milestones",
  "StartedAt",
  "ReviewStatus",
  "ImageSrc",
  "ImageAlt",
  "MemberApplicationUrl",
];

/**
 * Three example rows drawn from the fallback seed data.
 *
 * The first is a Recruiting school-based group with no image. The second is a
 * Completed community group with a review status set, so both ends of the
 * lifecycle are visible. The third is a fully ONLINE group, included
 * specifically to show that SchoolOrCommunityName is left EMPTY for those.
 *
 * LEAVE OPTIONAL CELLS BLANK. Never type "N/A", "NA", "none", "TBD" or "-" into
 * any column. Those get printed as though they were data: an online group with
 * "N/A" as its host rendered as "Online · N/A · Online". The site now skips
 * placeholder tokens and never repeats a value, but an empty cell is still the
 * correct input.
 *
 * Multi-paragraph abstracts use a real blank line inside the quoted cell, which
 * is what Sheets produces when you press Alt+Enter twice.
 */
const ROWS = [
  {
    Published: "yes",
    Slug: "placeholder-transit-reliability",
    ProjectTitle:
      "Placeholder: Bus Reliability and Late Arrivals in a Commuter Corridor",
    Field: "Social Sciences",
    Status: "Recruiting",
    Setting: "school",
    OneLine:
      "Placeholder group testing whether published bus timetables match observed arrivals along one commuter corridor.",
    LeadName: "Placeholder Lead",
    SchoolOrCommunityName: "Placeholder Secondary School",
    Location: "Placeholder City, Placeholder Region",
    MemberCount: "5",
    Abstract:
      "PLACEHOLDER ABSTRACT. This group examines the gap between scheduled and observed arrival times on a single bus corridor that a large share of local students depend on.\n\nMembers collect timestamped arrival observations at fixed stops, then compare them against the operator's published schedule and open service data.\n\nFindings are written up as a policy brief, with explicit discussion of sampling limits and the hours the data does not cover.",
    OutputType: "Policy brief",
    Methods:
      "Structured field observation at fixed stops | Comparison against published timetable and open service data | Descriptive distribution analysis of delay",
    Milestones:
      "Define corridor, stops, and observation windows | Pilot observation round | Complete primary data collection | Analysis and internal review | Draft policy brief and submit for review",
    StartedAt: "2026-02-09",
    ReviewStatus: "none",
    ImageSrc: "",
    ImageAlt: "",
    MemberApplicationUrl: "",
  },
  {
    Published: "yes",
    Slug: "placeholder-market-vendor-costs",
    ProjectTitle:
      "Placeholder: Input Costs and Pricing Among Open-Air Market Vendors",
    Field: "Economics & Business",
    Status: "Completed",
    Setting: "community",
    OneLine:
      "Placeholder group interviewing market vendors about how rising input costs moved their prices over one year.",
    LeadName: "Placeholder Lead",
    SchoolOrCommunityName: "Placeholder Market Association",
    Location: "Placeholder District, Placeholder Region",
    MemberCount: "4",
    Abstract:
      "PLACEHOLDER ABSTRACT. This group interviewed vendors at a single open-air market about how changes in wholesale input costs translated into the prices they charged.\n\nInterviews were summarized rather than recorded, at the vendors' request, and no vendor is identified by name.\n\nThe completed study describes delayed and partial pass-through. The group is direct about the limits: one market, one year, recalled figures rather than records.",
    OutputType: "Survey or interview study",
    Methods:
      "Semi-structured vendor interviews with a fixed question set | Paired recall of price changes on staple items | Thematic coding of interview summaries",
    Milestones:
      "Market association approval and vendor outreach | Question set drafted and piloted | Interview round completed | Thematic analysis and write-up | Final study submitted for review",
    StartedAt: "2025-03-10",
    ReviewStatus: "in review",
    ImageSrc: "",
    ImageAlt: "",
    MemberApplicationUrl: "",
  },
  // 3. A fully ONLINE group. SchoolOrCommunityName is deliberately EMPTY —
  //    there is no school or community hosting it. Do not write "N/A" here.
  //    This row renders as "Online · Distributed / online".
  {
    Published: "yes",
    Slug: "placeholder-model-card-review",
    ProjectTitle: "Placeholder: What Public Model Cards Actually Disclose",
    Field: "Computer Science & AI",
    Status: "Recruiting",
    Setting: "online",
    OneLine:
      "Placeholder group reviewing published model cards to see which disclosures appear consistently and which do not.",
    LeadName: "Placeholder Lead",
    SchoolOrCommunityName: "",
    Location: "Distributed / online",
    MemberCount: "6",
    Abstract:
      "PLACEHOLDER ABSTRACT. This group reviews publicly available model cards to identify which categories of disclosure recur and which are routinely absent.\n\nTwo members independently code each document so disagreement can be measured rather than assumed away. Only public documents are used.\n\nThe group notes that the sample reflects what organizations chose to publish, which is not the same as what those organizations know.",
    OutputType: "Literature review",
    Methods:
      "Systematic document sampling with stated inclusion criteria | Independent double-coding against a shared scheme | Inter-coder agreement measurement",
    Milestones:
      "Define inclusion criteria | Draft and pilot the coding scheme | Independent coding | Synthesis and drafting | Submit for review",
    StartedAt: "2026-01-20",
    ReviewStatus: "none",
    ImageSrc: "",
    ImageAlt: "",
    MemberApplicationUrl: "",
  },
];

/** Quote a cell if it contains a comma, quote, or newline. RFC 4180 rules. */
function cell(value) {
  const v = String(value ?? "");
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

const csv =
  [
    HEADERS.join(","),
    ...ROWS.map((row) => HEADERS.map((h) => cell(row[h])).join(",")),
  ].join("\r\n") + "\r\n";

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, "..", "notes", "research-groups-template.csv");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, csv, "utf8");

console.log(`Wrote ${out}`);
console.log(`${HEADERS.length} columns, ${ROWS.length} example rows.`);
