import { Link } from "react-router-dom";
import { upcomingEvents } from "@/data/events";
import { formatEventDate } from "@/pages/Events";

/**
 * Section 5 — three upcoming events.
 *
 * Reads from src/data/events.ts. A past event drops off automatically, so this
 * strip needs no maintenance. Renders nothing when there is nothing upcoming,
 * rather than an empty shell.
 */
export function EventsStrip() {
  const events = upcomingEvents().slice(0, 3);
  if (events.length === 0) return null;

  return (
    <section className="bg-paper border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-display text-2xl md:text-3xl">Upcoming events</h2>
          <Link
            to="/events"
            className="text-sm text-accent underline underline-offset-4 hover:text-navy-hi transition-colors"
          >
            See all events
          </Link>
        </div>

        <ul className="mt-8 grid gap-px bg-line border border-line md:grid-cols-3">
          {events.map((event) => (
            <li key={event.slug} className="bg-surface p-6">
              <p className="meta-label text-muted">
                {formatEventDate(event.date)}
                {event.time && ` · ${event.time}`}
              </p>
              <h3 className="mt-2.5 font-display text-lg leading-snug">
                {event.title}
              </h3>
              {event.speakerName && (
                <p className="mt-2 text-sm text-ink">
                  {event.speakerName}
                  {event.speakerAffiliation && (
                    <span className="text-muted">
                      , {event.speakerAffiliation}
                    </span>
                  )}
                </p>
              )}
              <p className="mt-2 meta-label text-muted">{event.kind}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
