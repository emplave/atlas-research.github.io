import { Link } from "react-router-dom";
import { formatEventWhen, undatedEvents, upcomingEvents } from "@/data/events";
import { useEvents } from "@/lib/useEvents";
import { Section } from "./Section";

/**
 * Upcoming events — asymmetric two-column split.
 *
 * The next event is large on the left; the ones after it stack small on the
 * right. Three equal tiles gave every session the same weight, which is wrong:
 * the next one is the only one a reader can act on today.
 *
 * Renders nothing when there is nothing upcoming, rather than an empty shell.
 */
export function EventsStrip() {
  const { events: all } = useEvents();
  // Dated events first, then undated, so "next" is always a real date when one
  // exists. An undated event is still forthcoming and belongs in this strip.
  const events = [...upcomingEvents(all), ...undatedEvents(all)].slice(0, 3);
  if (events.length === 0) return null;

  const [next, ...later] = events;

  return (
    <Section
      number="02"
      title="Upcoming events"
      tone="surface"
      action={
        <Link
          to="/events"
          className="text-sm link"
        >
          See all events
        </Link>
      }
    >
      <div className="mt-8 grid gap-5 lg:grid-cols-[3fr_2fr]">
        <article className="card-hover rounded-card border border-line bg-paper p-7 md:p-8">
          <p className="meta-label text-faint">Next</p>
          <p className="mt-3 meta-label">{formatEventWhen(next)}</p>
          <h3 className="mt-2.5 font-display text-2xl md:text-3xl leading-tight">
            <Link
              to={`/events/${next.slug}`}
              className="hover:underline underline-offset-4"
            >
              {next.title}
            </Link>
          </h3>
          {next.speakerName && (
            <p className="mt-3 text-[15px] text-ink">
              {next.speakerName}
              {next.speakerAffiliation && (
                <span className="text-muted">, {next.speakerAffiliation}</span>
              )}
            </p>
          )}
          <p className="mt-5 max-w-xl text-[15px] text-muted leading-relaxed">
            {next.description}
          </p>
        </article>

        {later.length > 0 && (
          <ul className="grid gap-5 content-start">
            {later.map((event) => (
              <li
                key={event.slug}
                className="card-hover rounded-card border border-line bg-paper p-5"
              >
                <p className="meta-label">{formatEventWhen(event)}</p>
                <h3 className="mt-2 font-display text-lg leading-snug">
                  <Link
                    to={`/events/${event.slug}`}
                    className="hover:underline underline-offset-4"
                  >
                    {event.title}
                  </Link>
                </h3>
                {event.speakerName && (
                  <p className="mt-1.5 text-sm text-ink">
                    {event.speakerName}
                    {event.speakerAffiliation && (
                      <span className="text-muted">
                        , {event.speakerAffiliation}
                      </span>
                    )}
                  </p>
                )}
                <p className="mt-1.5 meta-label text-muted">{event.kind}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Section>
  );
}
