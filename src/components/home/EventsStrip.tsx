import { Link } from "react-router-dom";
import { forthcomingEvents, formatEventWhen } from "@/data/events";
import { useEvents } from "@/lib/useEvents";
import { Section } from "./Section";

/**
 * Upcoming events — asymmetric two-column split.
 *
 * The next event is large on the left; the ones after it stack small on the
 * right. Three equal tiles gave every session the same weight, which is wrong:
 * the next one is the only one a reader can act on today.
 *
 * PROMOTED TO THE MOST PROMINENT SECTION AFTER THE OFFER, and deliberately so:
 * this is the only section on the homepage whose content is checkable. A named
 * researcher, a named institution and a date are evidence; every other section
 * is Atlas describing itself. It sits directly under the research groups pitch
 * so it reads as the proof of that section's "sessions with researchers" claim
 * rather than as a calendar.
 *
 * Made heavier three ways: an intro line that frames it as evidence, ink tone on
 * the "Next" card so it is the visual anchor of the upper page, and a date-led
 * hierarchy in the small cards.
 *
 * Renders nothing when there is nothing upcoming, rather than an empty shell.
 * That is a real risk here — an empty Sheet silently removes the page's only
 * evidence — so keep at least one forthcoming session in it, dated or TBD.
 */
export function EventsStrip() {
  const { events: all } = useEvents();
  // forthcomingEvents applies the site-wide order — dated soonest-first, then
  // undated — so "Next" is always a real date when one exists. See the rule in
  // src/data/events.ts; do not re-concatenate these lists here.
  const events = forthcomingEvents(all).slice(0, 3);
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
      <p className="mt-6 max-w-2xl type-body text-muted">
        Groups hear directly from researchers, with live Q&amp;A. Every session
        below is open to Atlas research groups.
      </p>

      <div className="mt-9 grid gap-5 lg:grid-cols-[3fr_2fr]">
        {/*
          Ink card, not paper. This is the one element in the upper half of the
          homepage that is a verifiable fact, so it gets the weight — and it
          makes the section scan as the anchor rather than as filler between the
          pitch and the process.
        */}
        <article className="on-ink card-hover rounded-card bg-ink p-7 md:p-8">
          <p className="meta-label">Next</p>
          {/*
            Audience sits with the date, not buried on the detail page. This
            strip has no registration control, so the only thing it owes a
            reader who cannot attend is saying so before they click through.
          */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <p className="meta-label">{formatEventWhen(next)}</p>
            {next.audience && (
              <p className="meta-label text-paper/70">{next.audience}</p>
            )}
          </div>
          <h3 className="mt-2.5 font-display text-2xl md:text-3xl leading-tight text-paper">
            <Link
              to={`/events/${next.slug}`}
              className="hover:underline underline-offset-4"
            >
              {next.title}
            </Link>
          </h3>
          {next.speakerName && (
            <p className="mt-3 text-[15px] text-paper">
              {next.speakerName}
              {next.speakerAffiliation && (
                <span className="text-paper/70">
                  , {next.speakerAffiliation}
                </span>
              )}
            </p>
          )}
          <p className="mt-5 max-w-xl text-[15px] text-paper/75 leading-relaxed">
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
                <div className="flex flex-wrap items-center gap-3">
                  <p className="meta-label">{formatEventWhen(event)}</p>
                  {event.audience && (
                    <p className="meta-label text-ink">{event.audience}</p>
                  )}
                </div>
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
