import { Link } from "react-router-dom";
import { upcomingEvents } from "@/data/events";
import { formatEventDate } from "@/pages/Events";
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
  const events = upcomingEvents().slice(0, 3);
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
          <p className="mt-3 meta-label">
            {formatEventDate(next.date)}
            {next.time && ` · ${next.time}`}
          </p>
          <h3 className="mt-2.5 font-display text-2xl md:text-3xl leading-tight">
            {next.title}
          </h3>
          {next.speakerName && (
            <p className="mt-3 text-[15px] text-ink">
              {next.speakerName}
              {next.speakerAffiliation && (
                <span className="text-muted">, {next.speakerAffiliation}</span>
              )}
            </p>
          )}
          <p className="mt-3 max-w-xl text-[15px] text-muted leading-relaxed">
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
                <p className="meta-label">
                  {formatEventDate(event.date)}
                  {event.time && ` · ${event.time}`}
                </p>
                <h3 className="mt-2 font-display text-lg leading-snug">
                  {event.title}
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
