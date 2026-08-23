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

/**
 * The kinds an event may be.
 *
 * THIS IS AN ALLOW-LIST TO CATCH TYPOS, NOT TO RESTRICT VOCABULARY. A misspelled
 * Kind in the Sheet skips the row with a console warning, which is the whole
 * value: without it "webinarr" would publish silently and be found by noticing it
 * on the site. Adding a genuinely new kind is a two-line change — this union and
 * KINDS in src/lib/eventsSource.ts — and needs nothing else, because `kind`
 * renders as a free label in every view with no per-kind styling or copy.
 */
export type EventKind =
  | "webinar"
  | "guest session"
  | "workshop"
  | "lesson"
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
/* Audience                                                                   */
/* ------------------------------------------------------------------------- */

/**
 * Phrases in an Audience cell that mean "a stranger may attend".
 *
 * DELIBERATELY NOT A VOCABULARY SYSTEM. Audience is free text in the Sheet and
 * stays that way; this is a small list of open-access signals, and everything
 * else is treated as closed. Erring closed is the safe direction — describing an
 * open event as restricted disappoints one reader, while showing a live Register
 * button for a Fellows-only session sends a stranger to a form or a meeting link
 * they cannot use.
 *
 * "open" ALONE IS NOT IN HERE, on purpose. "Open to research groups" contains it
 * and is not open access, so matching a bare "open" would invert the rule on
 * exactly the values it matters for.
 */
const OPEN_ACCESS_SIGNALS = [
  "public",
  "anyone",
  "everyone",
  "all welcome",
  "open to all",
];

/**
 * True when the Audience names a closed group, so registration must not be
 * offered to a general visitor.
 *
 * THE RULE, in full:
 *   - Audience blank  → NOT restricted. No restriction was stated, so none is
 *                       invented. This is what every event did before.
 *   - Contains an open-access signal → NOT restricted.
 *   - Anything else   → RESTRICTED.
 *
 * Compared lowercased, so "Fellows" and "FELLOWS" behave alike.
 */
export function isAudienceRestricted(event: AtlasEvent): boolean {
  if (!event.audience) return false;
  const value = event.audience.toLowerCase();
  return !OPEN_ACCESS_SIGNALS.some((signal) => value.includes(signal));
}

/**
 * The disabled control's text for a restricted event — "Fellows only".
 *
 * Built from the cell rather than from a lookup, so a new Audience value needs no
 * code change. The cost is that a long cell makes a long label: "Groups with data
 * already collected only" is a sentence on a button. That is an argument for a
 * short controlled column in the Sheet, not for a mapping table here that would
 * silently mislabel anything not in it.
 */
export function audienceOnlyLabel(event: AtlasEvent): string | null {
  if (!isAudienceRestricted(event) || !event.audience) return null;
  return `${event.audience.trim()} only`;
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
 * FALLBACK DATA — DELIBERATELY EMPTY.
 *
 * This held four invented events, every title prefixed "PLACEHOLDER:", covering
 * the upcoming / TBD / past date states so each render path was exercised before
 * a Sheet existed. A Sheet exists now and carries real sessions, so the only
 * thing this array could still do is ship fabricated events on the day the Sheet
 * is unreachable — including onto the homepage, where the events strip is the
 * most prominent section and the page's only checkable evidence.
 *
 * RENDERING NOTHING IS BETTER THAN RENDERING SOMETHING INVENTED. With this empty,
 * an unreachable Sheet makes EventsStrip return null and /events show its
 * "nothing scheduled right now" copy. Both are true statements. A grid of
 * invented sessions with invented dates is not.
 *
 * ANYTHING ADDED BACK HERE IS LIVE CONTENT. It is served to real visitors
 * whenever the Sheet fails, with no banner and no indication it is a fallback.
 * Only put real, already-published events in this array — or leave it empty.
 */
export const EVENTS: AtlasEvent[] = [];
