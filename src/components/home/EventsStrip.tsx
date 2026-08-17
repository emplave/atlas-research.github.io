import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { upcomingEvents } from "@/data/events";
import { formatEventDate } from "@/pages/Events";

/**
 * Section 6 — upcoming events strip.
 *
 * Reads from src/data/events.ts and shows at most three. A past event drops
 * off automatically, so this strip needs no maintenance. Renders nothing at
 * all when there is nothing upcoming, rather than an empty shell.
 */
export function EventsStrip() {
  const events = upcomingEvents().slice(0, 3);
  if (events.length === 0) return null;

  return (
    <section className="bg-ground border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="meta-label text-muted">Upcoming</p>
              <h2 className="mt-4 font-display text-2xl md:text-4xl text-text leading-tight">
                Sessions open to every group.
              </h2>
            </div>
            <Link
              to="/events"
              className="text-sm text-accent hover:text-accent-hi transition-colors inline-flex items-center gap-1.5"
            >
              All events
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>

        <ul className="mt-9 grid gap-px bg-line border border-line md:grid-cols-3">
          {events.map((event, i) => (
            <Reveal key={event.slug} delay={i * 0.06} className="h-full">
              <li className="h-full bg-ground p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="meta-label text-muted">{event.kind}</span>
                </div>
                <p className="mt-2 meta-label text-muted">
                  {formatEventDate(event.date)}
                  {event.time && ` · ${event.time}`}
                </p>
                <h3 className="mt-3 font-display text-lg leading-snug text-text">
                  {event.title}
                </h3>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
