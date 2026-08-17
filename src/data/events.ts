/**
 * Atlas events — THE SINGLE SOURCE OF TRUTH FOR EVERY EVENT.
 *
 * This file is the only place events are added, edited, or removed. No page or
 * component may hardcode an event.
 *
 * Events move themselves. An event whose date has passed is classified as past
 * automatically by upcomingEvents() / pastEvents() — nobody edits this file
 * when a date rolls by. Set `status` to "cancelled" to pull an event from the
 * upcoming list without deleting the record.
 */

export type EventKind =
  | "webinar"
  | "guest session"
  | "workshop"
  | "deadline"
  | "info session";

export type EventStatus = "upcoming" | "past" | "cancelled";

/** Same shape as GroupImage. Null renders a typographic fallback. */
export type EventImage = { src: string; alt: string };

export type AtlasEvent = {
  slug: string;
  title: string;
  kind: EventKind;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Display time, or null when there is no fixed time (e.g. a deadline). */
  time: string | null;
  /** Never invent these. Null until a speaker is actually confirmed. */
  speakerName: string | null;
  speakerAffiliation: string | null;
  description: string;
  /** null renders "Details coming soon" — never a dead link. */
  registrationUrl: string | null;
  status: EventStatus;
  /** 16:9 image, or null to render the typographic fallback. */
  image: EventImage | null;
};

/** True when an event's date is in the past (date-only, UTC). */
export function isPast(event: AtlasEvent, now: Date = new Date()): boolean {
  const end = Date.parse(`${event.date}T23:59:59Z`);
  if (Number.isNaN(end)) return false;
  return now.getTime() > end;
}

/**
 * The status a page should render. A stored "upcoming" whose date has passed
 * resolves to "past" on its own; "cancelled" is sticky and never reclassified.
 */
export function effectiveEventStatus(
  event: AtlasEvent,
  now: Date = new Date()
): EventStatus {
  if (event.status === "cancelled") return "cancelled";
  return isPast(event, now) ? "past" : "upcoming";
}

/** Upcoming events, soonest first. */
export function upcomingEvents(now: Date = new Date()): AtlasEvent[] {
  return EVENTS.filter((e) => effectiveEventStatus(e, now) === "upcoming").sort(
    (a, b) => a.date.localeCompare(b.date)
  );
}

/**
 * Past events, most recent first. These stay visible on purpose — a dated
 * record of sessions that actually happened is a credibility signal.
 */
export function pastEvents(now: Date = new Date()): AtlasEvent[] {
  return EVENTS.filter((e) => effectiveEventStatus(e, now) === "past").sort(
    (a, b) => b.date.localeCompare(a.date)
  );
}

/** Cancelled events, most recent first. */
export function cancelledEvents(): AtlasEvent[] {
  return EVENTS.filter((e) => e.status === "cancelled").sort((a, b) =>
    b.date.localeCompare(a.date)
  );
}

/** True when the registration control must render disabled. */
export function isRegistrationPending(event: AtlasEvent): boolean {
  return !event.registrationUrl;
}

export function findEvent(slug: string): AtlasEvent | undefined {
  return EVENTS.find((e) => e.slug === slug);
}

/**
 * PLACEHOLDER DATA — NOT REAL EVENTS.
 *
 * Both entries below are invented to exercise the events UI. Hamaad replaces
 * these with real sessions before launch. Speaker names and affiliations are
 * deliberately null: no researcher is named until they have actually agreed
 * to appear.
 */
export const EVENTS: AtlasEvent[] = [
  {
    slug: "placeholder-methods-webinar",
    title: "PLACEHOLDER: Framing a research question you can actually answer",
    kind: "webinar",
    date: "2026-10-14",
    time: "5:00 PM UTC",
    speakerName: null,
    speakerAffiliation: null,
    description:
      "PLACEHOLDER EVENT. A working session on narrowing a broad interest into a question a small team can answer with the access it actually has — scoping, feasibility, and knowing when a question is too large. Open to all research group leads and members.",
    registrationUrl: null,
    status: "upcoming",
    image: null,
  },
  {
    slug: "placeholder-sources-workshop",
    title: "PLACEHOLDER: Reading and citing sources without drowning",
    kind: "workshop",
    date: "2026-11-11",
    time: "5:00 PM UTC",
    speakerName: null,
    speakerAffiliation: null,
    description:
      "PLACEHOLDER EVENT. How to judge whether a source holds up, how to cite accurately, and how to write about limitations honestly rather than hiding them. Includes a walkthrough of a real literature review and where its argument is weakest.",
    registrationUrl: null,
    status: "upcoming",
    image: null,
  },
];
