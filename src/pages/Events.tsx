import { Link } from "react-router-dom";
import {
  DATE_TBD_LABEL,
  formatEventWhen,
  isRegistrationPending,
  pastEvents,
  undatedEvents,
  upcomingEvents,
  type AtlasEvent,
} from "@/data/events";
import { useEvents } from "@/lib/useEvents";

/**
 * Events.
 *
 * Three sections, in this order: undated, upcoming, past. Any empty section is
 * omitted entirely rather than rendering an empty heading.
 *
 * Past events stay visible on purpose — a dated record of sessions that actually
 * happened is a credibility signal, and deleting them would leave the page
 * looking like nothing has ever run.
 *
 * Everything comes through useEvents, so this reflects the live Sheet. A dated
 * event moves from upcoming to past on its own; a TBD event never moves until it
 * is given a real date in the Sheet.
 */
export function Events() {
  const { events, loading } = useEvents();

  const undated = undatedEvents(events);
  const upcoming = upcomingEvents(events);
  const past = pastEvents(events);
  const nothingScheduled =
    !loading && undated.length === 0 && upcoming.length === 0;

  return (
    <div className="bg-paper">
      <section className="border-b border-line">
        <div className="mx-auto max-w-5xl px-6 pt-16 md:pt-20 pb-12">
          <p className="meta-label">Events</p>
          <h1 className="type-hero font-display mt-4 max-w-3xl">
            Webinars, workshops, and guest sessions.
          </h1>
          <p className="mt-6 max-w-2xl type-body text-muted">
            Open to research group leads and members. Sessions cover methods,
            sources, scoping, and writing.
          </p>
        </div>
      </section>

      {loading ? (
        <section className="mx-auto max-w-5xl px-6 py-12">
          <EventListSkeleton />
        </section>
      ) : (
        <>
          {/* Undated first: an event without a date is still forthcoming. */}
          {undated.length > 0 && (
            <EventSection
              title={DATE_TBD_LABEL}
              note="These are being scheduled. Dates are announced here first."
              events={undated}
            />
          )}

          {upcoming.length > 0 && (
            <EventSection title="Upcoming" events={upcoming} />
          )}

          {nothingScheduled && (
            <section className="mx-auto max-w-5xl px-6 py-12">
              <p className="max-w-xl type-body text-muted">
                No sessions are scheduled right now. New events are announced
                here and to research group leads directly.
              </p>
            </section>
          )}

          {past.length > 0 && (
            <EventSection
              title="Past sessions"
              note="A record of sessions Atlas has actually run."
              events={past}
              past
            />
          )}
        </>
      )}
    </div>
  );
}

function EventSection({
  title,
  note,
  events,
  past = false,
}: {
  title: string;
  note?: string;
  events: AtlasEvent[];
  past?: boolean;
}) {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-5xl px-6 py-12 md:py-14">
        <h2 className="type-section font-display">{title}</h2>
        {note && (
          <p className="mt-5 max-w-xl text-[15px] text-muted leading-relaxed">
            {note}
          </p>
        )}
        <ul className="mt-7 space-y-4">
          {events.map((event) => (
            <EventRow key={event.slug} event={event} past={past} />
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * One event row.
 *
 * The title links to the detail page and the registration control is a separate
 * sibling — NOT nested inside it. A link inside a link is invalid HTML and
 * browsers resolve it unpredictably.
 */
function EventRow({ event, past = false }: { event: AtlasEvent; past?: boolean }) {
  const pending = isRegistrationPending(event);

  return (
    <li className="card-hover rounded-card border border-line bg-surface p-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="meta-label">{event.kind}</span>
            <span className="meta-label">{formatEventWhen(event)}</span>
          </div>

          <h3 className="mt-3 type-card font-display leading-snug">
            <Link
              to={`/events/${event.slug}`}
              className="hover:underline underline-offset-4"
            >
              {event.title}
            </Link>
          </h3>

          {event.speakerName && (
            <p className="mt-2 text-sm text-ink">
              {event.speakerName}
              {event.speakerAffiliation && (
                <span className="text-muted">, {event.speakerAffiliation}</span>
              )}
            </p>
          )}

          <p className="mt-3 max-w-2xl text-[15px] text-muted leading-relaxed">
            {event.description}
          </p>

          <p className="mt-4">
            <Link to={`/events/${event.slug}`} className="text-sm link">
              Event details
            </Link>
          </p>
        </div>

        {past
          ? event.recordingUrl && (
              <div className="shrink-0">
                <a
                  href={event.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-control border border-line bg-paper px-4 py-2 text-sm text-ink hover:bg-ink hover:text-paper transition-colors"
                >
                  Watch the recording
                </a>
              </div>
            )
          : !pending && (
              <div className="shrink-0">
                <a
                  href={event.registrationUrl as string}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-control bg-ink text-paper px-4 py-2 text-sm hover:bg-ink-hover transition-colors"
                >
                  Register
                </a>
              </div>
            )}
      </div>
    </li>
  );
}

/** Matches the row layout so nothing shifts when events arrive. */
function EventListSkeleton() {
  return (
    <ul aria-hidden className="space-y-4">
      {Array.from({ length: 3 }, (_, i) => (
        <li key={i} className="rounded-card border border-line bg-surface p-6">
          <div className="h-3 w-40 rounded bg-line" />
          <div className="mt-4 h-4 w-3/5 rounded bg-line" />
          <div className="mt-4 h-3 w-full rounded bg-line" />
          <div className="mt-2 h-3 w-4/5 rounded bg-line" />
        </li>
      ))}
    </ul>
  );
}
