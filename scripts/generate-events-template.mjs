/**
 * Generate the events Sheet template.
 *
 *   node scripts/generate-events-template.mjs
 *
 * Writes notes/events-template.csv: the exact header row the site expects, plus
 * three example rows covering the cases that behave differently — a confirmed
 * upcoming event with a named speaker, a TBD event with no date, and a past
 * event with a recording.
 *
 * The header list is duplicated here deliberately. This script runs under plain
 * node with no build step, so it cannot import the TypeScript source. If the
 * columns in src/lib/eventsSource.ts change, change them here too.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HEADERS = [
  "Published",
  "Slug",
  "Title",
  "Kind",
  "DateStatus",
  "Date",
  "Time",
  "EndTime",
  "Timezone",
  "Location",
  "JoinUrl",
  "SpeakerName",
  "SpeakerAffiliation",
  "SpeakerBio",
  "SpeakerUrl",
  "Audience",
  "Description",
  "LongDescription",
  "RegistrationUrl",
  "RecordingUrl",
  "Capacity",
  "ImageSrc",
  "ImageAlt",
];

const ROWS = [
  // 1. Confirmed, upcoming, with a named speaker. The speaker here is an
  //    EXAMPLE PLACEHOLDER, not a real person — do not ship it.
  {
    Published: "yes",
    Slug: "example-methods-webinar",
    Title: "EXAMPLE: Framing a research question you can actually answer",
    Kind: "webinar",
    DateStatus: "confirmed",
    Date: "2026-10-14",
    Time: "5:00 PM",
    EndTime: "6:00 PM",
    Timezone: "UTC",
    Location: "Online (Zoom)",
    JoinUrl: "https://zoom.us/j/000000000",
    SpeakerName: "EXAMPLE NAME — replace or leave blank",
    SpeakerAffiliation: "EXAMPLE Affiliation",
    SpeakerBio:
      "EXAMPLE BIO. Two or three sentences on what this person works on and why they are worth listening to. Leave blank until the person has agreed to appear.",
    SpeakerUrl: "https://example.edu/faculty/example",
    Audience: "Research group leads and members",
    Description:
      "A working session on narrowing a broad interest into a question a small team can answer.",
    LongDescription:
      "A working session on narrowing a broad interest into a question a small team can answer with the access it actually has.\n\nWe work through scoping, feasibility, and how to tell when a question is too large. Bring a question you are stuck on.\n\nOpen to all research group leads and members.",
    RegistrationUrl: "https://forms.gle/example",
    RecordingUrl: "",
    Capacity: "100 places",
    ImageSrc: "",
    ImageAlt: "",
  },
  // 2. TBD. Date is BLANK and that is valid — the row is not skipped, and the
  //    event appears under "Date to be announced".
  {
    Published: "yes",
    Slug: "example-analysis-clinic",
    Title: "EXAMPLE: Analysis clinic for groups mid-project",
    Kind: "workshop",
    DateStatus: "tbd",
    Date: "",
    Time: "",
    EndTime: "",
    Timezone: "",
    Location: "Online (Zoom)",
    JoinUrl: "",
    SpeakerName: "",
    SpeakerAffiliation: "",
    SpeakerBio: "",
    SpeakerUrl: "",
    Audience: "Groups with data already collected",
    Description:
      "Bring a dataset and a question you cannot answer with it yet.",
    LongDescription:
      "An open clinic for groups that have collected data and are unsure what it supports.\n\nDate to be announced.",
    RegistrationUrl: "",
    RecordingUrl: "",
    Capacity: "",
    ImageSrc: "",
    ImageAlt: "",
  },
  // 3. Past, with a recording. Nothing needed to move it here — the date did it.
  {
    Published: "yes",
    Slug: "example-sources-workshop",
    Title: "EXAMPLE: Reading and citing sources without drowning",
    Kind: "workshop",
    DateStatus: "confirmed",
    Date: "2025-11-11",
    Time: "5:00 PM",
    EndTime: "6:15 PM",
    Timezone: "UTC",
    Location: "Online (Zoom)",
    JoinUrl: "",
    SpeakerName: "",
    SpeakerAffiliation: "",
    SpeakerBio: "",
    SpeakerUrl: "",
    Audience: "Research group leads and members",
    Description:
      "How to judge whether a source holds up, and how to cite accurately.",
    LongDescription:
      "How to judge whether a source holds up, how to cite accurately, and how to write about limitations honestly rather than hiding them.\n\nIncludes a walkthrough of a real literature review and where its argument is weakest.",
    RegistrationUrl: "",
    RecordingUrl: "https://example.com/recording",
    Capacity: "",
    ImageSrc: "",
    ImageAlt: "",
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
const out = join(here, "..", "notes", "events-template.csv");
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, csv, "utf8");

console.log(`Wrote ${out}`);
console.log(`${HEADERS.length} columns, ${ROWS.length} example rows.`);
