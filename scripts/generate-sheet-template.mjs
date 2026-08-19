/**
 * Generate the research groups and publications Sheet templates.
 *
 *   node scripts/generate-sheet-template.mjs
 *
 * Writes two files:
 *   notes/research-groups-template.csv   from src/lib/groupsSource.ts
 *   notes/publications-template.csv      from src/lib/publicationsSource.ts
 *
 * Each is the exact header row the site expects plus example rows, so the
 * expected format is visible rather than described. Events have their own
 * script, scripts/generate-events-template.mjs.
 *
 * The header lists are duplicated here deliberately. This script must run under
 * plain node with no build step and no dependencies, so it cannot import the
 * TypeScript source. If the columns in either source module change, change them
 * here too — nothing in this file will catch it.
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

/* ------------------------------------------------------------------------- */
/* Publications                                                               */
/* ------------------------------------------------------------------------- */

/** Must match the column list in src/lib/publicationsSource.ts. */
const PUBLICATION_HEADERS = [
  "Published",
  "Slug",
  "Title",
  "Authors",
  "Track",
  "Field",
  "Abstract",
  "FullTextUrl",
  "PublishedAt",
  "ReviewedAt",
];

/**
 * Two example rows, one per track.
 *
 * BOTH ARE Published: "no", WHICH IS DELIBERATE AND DIFFERENT FROM THE OTHER
 * TEMPLATES. The groups and events templates ship "yes" rows because a
 * placeholder group going live is untidy. A placeholder PEER-REVIEWED row going
 * live is not untidy, it is a false claim: it would sit on the site under "This
 * article completed external peer review" having been reviewed by nobody. So
 * these import as hidden, and the operator sets Published to "yes" per row once
 * the row holds a real paper.
 *
 * TRACK RULES the rows demonstrate:
 *   working-paper  → ReviewedAt is EMPTY. A working paper has not been
 *                    reviewed. If you type a date here the site ignores it and
 *                    logs a warning; it does not quietly become a reviewed
 *                    article.
 *   peer-reviewed  → ReviewedAt holds the date review completed. That is the
 *                    date the site displays for this track, in place of
 *                    PublishedAt.
 *
 * LEAVE OPTIONAL CELLS BLANK. Never type "N/A", "NA", "none", "TBD" or "-" into
 * any column. Those get treated as content: "N/A" in FullTextUrl would be a
 * link to nothing. The site skips placeholder tokens using the same rule that
 * cleans a group's setting line, but an empty cell is still the correct input.
 *
 * FullTextUrl below is a Drive SHARE link with a fake file id, to show the shape
 * the site accepts. It is rewritten to a uc?export=download URL so the PDF
 * downloads rather than opening Drive's viewer. Never paste a Drive FOLDER link
 * — the site drops it and the paper renders "Full text coming soon".
 *
 * Multi-paragraph abstracts use a real blank line inside the quoted cell, which
 * is what Sheets produces when you press Alt+Enter twice.
 */
const PUBLICATION_ROWS = [
  {
    Published: "no",
    Slug: "placeholder-working-paper",
    Title:
      "PLACEHOLDER: What student research groups produce, and what gets in the way",
    Authors: "Atlas Research Institute",
    Track: "working-paper",
    Field: "Social Sciences",
    Abstract:
      "PLACEHOLDER ABSTRACT. This working paper describes the conditions under which small student research groups complete a project rather than abandoning it.\n\nIt sets out what a group needs in place before work starts — a defined question, a named lead, a meeting cadence, and access to sources it can actually reach — and identifies the points at which projects most often stall.\n\nAs a working paper, this has not been externally peer reviewed.",
    FullTextUrl:
      "https://drive.google.com/file/d/PLACEHOLDER_FILE_ID/view?usp=sharing",
    PublishedAt: "2026-06-01",
    // EMPTY ON PURPOSE. Working papers are not reviewed. A date here is ignored.
    ReviewedAt: "",
  },
  {
    Published: "no",
    Slug: "placeholder-reviewed-article",
    Title: "PLACEHOLDER: Title of an article that completed external review",
    Authors: "Placeholder Author | Placeholder Co-Author",
    Track: "peer-reviewed",
    Field: "Environment & Sustainability",
    Abstract:
      "PLACEHOLDER ABSTRACT. Replace this with the article's real abstract before publishing the row.\n\nBlank lines separate paragraphs. Keep the abstract to what the paper actually establishes, including its limitations.",
    // Blank is valid: the row publishes and shows its published date instead.
    FullTextUrl: "",
    PublishedAt: "2026-09-01",
    // The date review completed. This is the date the site shows for this track.
    ReviewedAt: "2026-08-20",
  },
];

/* ------------------------------------------------------------------------- */
/* Emit                                                                      */
/* ------------------------------------------------------------------------- */

/** Quote a cell if it contains a comma, quote, or newline. RFC 4180 rules. */
function cell(value) {
  const v = String(value ?? "");
  return /[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

function toCsv(headers, rows) {
  return (
    [
      headers.join(","),
      ...rows.map((row) => headers.map((h) => cell(row[h])).join(",")),
    ].join("\r\n") + "\r\n"
  );
}

const here = dirname(fileURLToPath(import.meta.url));

for (const { file, headers, rows, label } of [
  {
    file: "research-groups-template.csv",
    headers: HEADERS,
    rows: ROWS,
    label: "research groups",
  },
  {
    file: "publications-template.csv",
    headers: PUBLICATION_HEADERS,
    rows: PUBLICATION_ROWS,
    label: "publications",
  },
]) {
  const out = join(here, "..", "notes", file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, toCsv(headers, rows), "utf8");
  console.log(
    `Wrote ${out}\n  ${label}: ${headers.length} columns, ${rows.length} example rows.`
  );
}
