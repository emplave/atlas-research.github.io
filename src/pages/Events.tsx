import {
  isRegistrationPending,
  pastEvents,
  upcomingEvents,
  type AtlasEvent,
} from "@/data/events";

/**
 * Events.
 *
 * Upcoming first, then past. Past events stay visible on purpose — a dated
 * record of sessions that actually happened is a credibility signal, and
 * deleting them would leave the page looking like nothing has ever run.
 *
 * Everything comes from src/data/events.ts. Nothing is hardcoded here, and no
 * event needs a page edit when its date passes.
 */
export function Events() {
  const upcoming = upcomingEvents();
  const past = pastEvents();

  return (
    <div className="bg-paper">
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-6 pt-16 md:pt-24 pb-12">
          <p className="meta-label">Events</p>
          <h1 className="mt-4 font-display text-4xl md:text-6xl leading-[1.05] max-w-3xl">
            Webinars, workshops, and guest sessions.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
            Open to research group leads and members. Sessions cover methods,
            sources, scoping, and writing — the parts of research that are
            hardest to learn alone.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-12 md:py-16">
        <h2 className="font-display text-2xl">Upcoming</h2>
        {upcoming.length > 0 ? (
          <ul className="mt-6 space-y-4">
            {upcoming.map((event) => (
              <EventRow key={event.slug} event={event} />
            ))}
          </ul>
        ) : (
          <p className="mt-5 max-w-xl text-[15px] text-muted leading-relaxed">
            No sessions are scheduled right now. New events are announced here
            and to research group leads directly.
          </p>
        )}
      </section>

      {past.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
            <h2 className="font-display text-2xl">Past sessions</h2>
            <p className="mt-3 max-w-xl text-[15px] text-muted leading-relaxed">
              A record of sessions Atlas has actually run.
            </p>
            <ul className="mt-6 space-y-4">
              {past.map((event) => (
                <EventRow key={event.slug} event={event} past />
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}

function EventRow({ event, past = false }: { event: AtlasEvent; past?: boolean }) {
  const pending = isRegistrationPending(event);
  const speaker = [event.speakerName, event.speakerAffiliation]
    .filter(Boolean)
    .join(" · ");

  return (
    <li
      className={
        "card-hover rounded-card border border-line bg-surface p-6 " +
        (past ? "opacity-75" : "")
      }
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="meta-label">{event.kind}</span>
            <span className="meta-label">
              {formatEventDate(event.date)}
              {event.time && ` · ${event.time}`}
            </span>
          </div>

          <h3 className="mt-3 font-display text-xl leading-snug">
            {event.title}
          </h3>

          {speaker && (
            <p className="mt-1.5 text-sm text-muted">{speaker}</p>
          )}

          <p className="mt-3 max-w-2xl text-[15px] text-muted leading-relaxed">
            {event.description}
          </p>
        </div>

        {!past && (
          <div className="shrink-0">
            {pending ? (
              <span
                aria-disabled="true"
                className="inline-flex rounded-control border border-line px-4 py-2 text-sm text-muted cursor-not-allowed"
              >
                Details coming soon
              </span>
            ) : (
              <a
                href={event.registrationUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-control bg-ink text-paper px-4 py-2 text-sm hover:bg-ink-hover transition-colors"
              >
                Register
              </a>
            )}
          </div>
        )}
      </div>
    </li>
  );
}

/** ISO date → readable, without pulling in a date library. */
export function formatEventDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
