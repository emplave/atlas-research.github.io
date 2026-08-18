/**
 * Atlas events — FALLBACK DATASET AND TYPES.
 *
 * THIS IS NOT THE LIVE SOURCE. Events are managed in a Google Sheet and read at
 * runtime by src/lib/eventsSource.ts. The array at the bottom of this file is
 * used ONLY when the Sheet is unreachable, unconfigured, or returns nothing
 * publishable.
 *
 * Editing this file does not change the site once the Sheet is wired up. To add,
 * edit, or remove an event, edit the Sheet — see notes/managing-events.md.
 *
 * The TYPES here remain authoritative: eventsSource validates every Sheet row
 * against the unions below and skips rows that do not match.
 */

export type EventKind =
  | "webinar"
  | "guest session"
  | "workshop"
  | "deadline"
  | "info session";

export type EventStatus = "upcoming" | "past" | "cancelled";

/**
 * Whether the date is settled.
 *
 * "tbd" is a FIRST-CLASS STATE, not an error. A TBD event has no date yet, is
 * grouped on its own, and never sorts into past — only a real date moves it.
 */
export type DateStatus = "confirmed" | "tbd";

/** Same shape as GroupImage. Null renders a typographic fallback. */
export type EventImage = { src: string; alt: string };

export type AtlasEvent = {
  slug: string;
  title: string;
  kind: EventKind;
  /** "confirmed" requires a date. "tbd" permits a null one. */
  dateStatus: DateStatus;
  /**
   * ISO date (YYYY-MM-DD), or null when dateStatus is "tbd".
   *
   * NULLABLE ON PURPOSE. Every render path must handle null — a TBD event shows
   * "Date to be announced", never a blank, never "Invalid Date", and never a
   * fallback to today.
   */
  date: string | null;
  /** Display start time, or null when there is no fixed time. */
  time: string | null;
  endTime: string | null;
  /** e.g. "5:00 PM UTC" or "9:30 AM PT". */
  timezone: string | null;
  /** "Online (Zoom)", a room, a city, or null. */
  location: string | null;
  /** The meeting link. Rendered for upcoming events only. */
  joinUrl: string | null;
  /** Never invent these. Null until a speaker has agreed to appear. */
  speakerName: string | null;
  speakerAffiliation: string | null;
  /** Two or three sentences. */
  speakerBio: string | null;
  /** A profile or faculty page, so a claimed name is verifiable. */
  speakerUrl: string | null;
  /** Who the session is for. */
  audience: string | null;
  /** Short summary, for cards. */
  description: string;
  /** Full detail for the event page. Blank lines separate paragraphs. */
  longDescription: string | null;
  /** null renders "Details coming soon" — never a dead link. */
  registrationUrl: string | null;
  /** Rendered for past events only. */
  recordingUrl: string | null;
  capacity: string | null;
  status: EventStatus;
  /** 16:9 image, or null to render the typographic fallback. */
  image: EventImage | null;
};

/** True when the event has a settled date. Narrows `date` to a string. */
export function hasDate(
  event: AtlasEvent
): event is AtlasEvent & { date: string } {
  return event.dateStatus === "confirmed" && typeof event.date === "string";
}

/**
 * True when a dated event's date has passed (date-only, UTC).
 *
 * A TBD event is NEVER past. Without a date there is nothing to compare, and
 * treating it as past would bury an event that has not happened yet.
 */
export function isPast(event: AtlasEvent, now: Date = new Date()): boolean {
  if (!hasDate(event)) return false;
  const end = Date.parse(`${event.date}T23:59:59Z`);
  if (Number.isNaN(end)) return false;
  return now.getTime() > end;
}

/**
 * The status a page should render. A stored "upcoming" whose date has passed
 * resolves to "past" on its own; "cancelled" is sticky and never reclassified.
 * A TBD event resolves to "upcoming" and stays there until it gets a date.
 */
export function effectiveEventStatus(
  event: AtlasEvent,
  now: Date = new Date()
): EventStatus {
  if (event.status === "cancelled") return "cancelled";
  return isPast(event, now) ? "past" : "upcoming";
}

/** True when the registration control must render disabled. */
export function isRegistrationPending(event: AtlasEvent): boolean {
  return !event.registrationUrl;
}

/* ------------------------------------------------------------------------- */
/* Grouping and sorting                                                       */
/* ------------------------------------------------------------------------- */

/** Dated upcoming events, soonest first. Excludes TBD. */
export function upcomingEvents(
  events: AtlasEvent[],
  now: Date = new Date()
): AtlasEvent[] {
  return events
    .filter((e) => hasDate(e) && effectiveEventStatus(e, now) === "upcoming")
    .sort((a, b) => (a.date as string).localeCompare(b.date as string));
}

/** Dated past events, most recent first. TBD events can never appear here. */
export function pastEvents(
  events: AtlasEvent[],
  now: Date = new Date()
): AtlasEvent[] {
  return events
    .filter((e) => hasDate(e) && effectiveEventStatus(e, now) === "past")
    .sort((a, b) => (b.date as string).localeCompare(a.date as string));
}

/**
 * Undated events, in their own group.
 *
 * Sorted by title, since there is no date to sort by and source order in a
 * spreadsheet is arbitrary.
 */
export function undatedEvents(events: AtlasEvent[]): AtlasEvent[] {
  return events
    .filter((e) => !hasDate(e) && e.status !== "cancelled")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function cancelledEvents(events: AtlasEvent[]): AtlasEvent[] {
  return events.filter((e) => e.status === "cancelled");
}

export function findEvent(
  events: AtlasEvent[],
  slug: string
): AtlasEvent | undefined {
  return events.find((e) => e.slug === slug);
}

/* ------------------------------------------------------------------------- */
/* Display                                                                    */
/* ------------------------------------------------------------------------- */

/** What a TBD event shows wherever a date would go. */
export const DATE_TBD_LABEL = "Date to be announced";

/**
 * ISO date → readable. The single place a date becomes text.
 *
 * Returns DATE_TBD_LABEL for a null or unparseable date, so no caller can emit
 * "Invalid Date" or an empty string.
 */
export function formatEventDate(iso: string | null): string {
  if (!iso) return DATE_TBD_LABEL;
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return DATE_TBD_LABEL;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The date-and-time line for a card or header.
 *
 * A TBD event returns only the label — appending a time to "Date to be
 * announced" would read as a partial answer.
 */
export function formatEventWhen(event: AtlasEvent): string {
  if (!hasDate(event)) return DATE_TBD_LABEL;
  const parts = [formatEventDate(event.date)];
  const clock = [event.time, event.endTime].filter(Boolean).join("–");
  if (clock) parts.push(event.timezone ? `${clock} ${event.timezone}` : clock);
  else if (event.timezone) parts.push(event.timezone);
  return parts.join(" · ");
}

/**
 * FALLBACK DATA — NOT THE LIVE SOURCE, AND NOT REAL EVENTS.
 *
 * Shown only when the Sheet is unreachable or unconfigured. Speaker names and
 * affiliations are deliberately null: no researcher is named until they have
 * actually agreed to appear.
 *
 * The set deliberately covers all three date states — one upcoming, one TBD, one
 * past with a recording — so every render path is exercised by the fallback
 * rather than only appearing once a real Sheet is wired up.
 */
export const EVENTS: AtlasEvent[] = [
  {
    slug: "placeholder-methods-webinar",
    title: "PLACEHOLDER: Framing a research question you can actually answer",
    kind: "webinar",
    dateStatus: "confirmed",
    date: "2026-10-14",
    time: "5:00 PM",
    endTime: "6:00 PM",
    timezone: "UTC",
    location: "Online (Zoom)",
    joinUrl: null,
    speakerName: null,
    speakerAffiliation: null,
    speakerBio: null,
    speakerUrl: null,
    audience: "Research group leads and members",
    description:
      "PLACEHOLDER EVENT. A working session on narrowing a broad interest into a question a small team can answer with the access it actually has.",
    longDescription:
      "PLACEHOLDER EVENT. A working session on narrowing a broad interest into a question a small team can answer with the access it actually has.\n\nWe work through scoping, feasibility, and how to tell when a question is too large. Bring a question you are stuck on.\n\nOpen to all research group leads and members.",
    registrationUrl: null,
    recordingUrl: null,
    capacity: null,
    status: "upcoming",
    image: null,
  },
  {
    slug: "placeholder-sources-workshop",
    title: "PLACEHOLDER: Reading and citing sources without drowning",
    kind: "workshop",
    dateStatus: "confirmed",
    date: "2026-11-11",
    time: "5:00 PM",
    endTime: null,
    timezone: "UTC",
    location: "Online (Zoom)",
    joinUrl: null,
    speakerName: null,
    speakerAffiliation: null,
    speakerBio: null,
    speakerUrl: null,
    audience: "Research group leads and members",
    description:
      "PLACEHOLDER EVENT. How to judge whether a source holds up, how to cite accurately, and how to write about limitations honestly.",
    longDescription:
      "PLACEHOLDER EVENT. How to judge whether a source holds up, how to cite accurately, and how to write about limitations honestly rather than hiding them.\n\nIncludes a walkthrough of a real literature review and where its argument is weakest.",
    registrationUrl: null,
    recordingUrl: null,
    capacity: null,
    status: "upcoming",
    image: null,
  },
  {
    slug: "placeholder-past-sources-workshop",
    title: "PLACEHOLDER: Reading and citing sources without drowning",
    kind: "workshop",
    dateStatus: "confirmed",
    date: "2025-11-11",
    time: "5:00 PM",
    endTime: "6:15 PM",
    timezone: "UTC",
    location: "Online (Zoom)",
    joinUrl: null,
    speakerName: null,
    speakerAffiliation: null,
    speakerBio: null,
    speakerUrl: null,
    audience: "Research group leads and members",
    description:
      "PLACEHOLDER EVENT. How to judge whether a source holds up, and how to cite accurately.",
    longDescription:
      "PLACEHOLDER EVENT. How to judge whether a source holds up, how to cite accurately, and how to write about limitations honestly rather than hiding them.\n\nIncludes a walkthrough of a real literature review and where its argument is weakest.",
    registrationUrl: null,
    recordingUrl: null,
    capacity: null,
    status: "upcoming",
    image: null,
  },
  {
    slug: "placeholder-analysis-clinic",
    title: "PLACEHOLDER: Analysis clinic for groups mid-project",
    kind: "workshop",
    dateStatus: "tbd",
    date: null,
    time: null,
    endTime: null,
    timezone: null,
    location: "Online (Zoom)",
    joinUrl: null,
    speakerName: null,
    speakerAffiliation: null,
    speakerBio: null,
    speakerUrl: null,
    audience: "Groups with data already collected",
    description:
      "PLACEHOLDER EVENT. Bring a dataset and a question you cannot answer with it yet.",
    longDescription:
      "PLACEHOLDER EVENT. An open clinic for groups that have collected data and are unsure what it supports.\n\nDate to be announced. Groups on the waitlist hear first.",
    registrationUrl: null,
    recordingUrl: null,
    capacity: null,
    status: "upcoming",
    image: null,
  },
];
