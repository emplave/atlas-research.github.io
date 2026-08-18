import { Link, useParams } from "react-router-dom";
import {
  DATE_TBD_LABEL,
  effectiveEventStatus,
  findEvent,
  formatEventDate,
  hasDate,
  isRegistrationPending,
  type AtlasEvent,
} from "@/data/events";
import { useEvents } from "@/lib/useEvents";
import { Prose, ProseParagraphs } from "@/components/Prose";

/**
 * A single event. A reading page, so it uses Prose, same as research group
 * briefs.
 *
 * The 404 renders only AFTER the fetch resolves. Rendering it while the request
 * is outstanding would tell a visitor an event does not exist when it does.
 */
export function EventDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { events, loading } = useEvents();

  if (loading) return <DetailSkeleton />;

  const event = slug ? findEvent(events, slug) : undefined;
  if (!event) return <EventNotFound />;
  return <Detail event={event} />;
}

function Detail({ event }: { event: AtlasEvent }) {
  const isPastEvent = effectiveEventStatus(event) === "past";
  const registrationPending = isRegistrationPending(event);
  const dated = hasDate(event);

  // Clock line, assembled so a missing endTime or timezone leaves no stray
  // separator behind.
  const clock = [event.time, event.endTime].filter(Boolean).join("–");
  const timeLine = clock
    ? event.timezone
      ? `${clock} ${event.timezone}`
      : clock
    : event.timezone;

  return (
    <article className="bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto max-w-4xl px-6 pt-12 md:pt-16 pb-10">
          <Link to="/events" className="meta-label hover:text-ink transition-colors">
            ← All events
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="meta-label">{event.kind}</span>
            <span className="meta-label">
              {dated ? formatEventDate(event.date) : DATE_TBD_LABEL}
            </span>
            {isPastEvent && <span className="meta-label">Past session</span>}
          </div>

          <h1 className="type-hero font-display mt-4 max-w-3xl">
            {event.title}
          </h1>

          {event.speakerName && (
            <p className="mt-5 type-body text-ink">
              {event.speakerUrl ? (
                <a
                  href={event.speakerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  {event.speakerName}
                </a>
              ) : (
                event.speakerName
              )}
              {event.speakerAffiliation && (
                <span className="text-muted">, {event.speakerAffiliation}</span>
              )}
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12 grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16 items-start">
        <div>
          <Prose>
            <ProseParagraphs text={event.longDescription || event.description} />
            {event.speakerBio && (
              <>
                <h2>About the speaker</h2>
                <ProseParagraphs text={event.speakerBio} />
              </>
            )}
          </Prose>
        </div>

        <aside className="lg:sticky lg:top-24 rounded-card border border-line bg-surface p-6">
          <h2 className="meta-label">Details</h2>
          <dl className="mt-4 space-y-4 text-[15px]">
            <Detail_ label="Date">
              {dated ? formatEventDate(event.date) : DATE_TBD_LABEL}
            </Detail_>
            {timeLine && <Detail_ label="Time">{timeLine}</Detail_>}
            {event.location && (
              <Detail_ label="Location">{event.location}</Detail_>
            )}
            {event.audience && (
              <Detail_ label="Who it is for">{event.audience}</Detail_>
            )}
            {event.capacity && (
              <Detail_ label="Capacity">{event.capacity}</Detail_>
            )}
          </dl>

          <div className="mt-6 pt-5 border-t border-line space-y-3">
            {/*
              A past event gets no registration and no join link — both would be
              dead ends. It gets the recording, if there is one.
            */}
            {isPastEvent ? (
              event.recordingUrl ? (
                <a
                  href={event.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center rounded-control bg-ink text-paper px-4 py-2.5 text-sm hover:bg-ink-hover transition-colors"
                >
                  Watch the recording
                </a>
              ) : (
                <p className="text-sm text-muted">
                  This session has finished. No recording is posted.
                </p>
              )
            ) : (
              <>
                {registrationPending ? (
                  <span
                    aria-disabled="true"
                    className="block text-center rounded-control border border-line px-4 py-2.5 text-sm text-muted cursor-not-allowed"
                  >
                    Details coming soon
                  </span>
                ) : (
                  <a
                    href={event.registrationUrl as string}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center rounded-control bg-ink text-paper px-4 py-2.5 text-sm hover:bg-ink-hover transition-colors"
                  >
                    Register
                  </a>
                )}

                {event.joinUrl && (
                  <a
                    href={event.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center rounded-control border border-line bg-paper px-4 py-2.5 text-sm text-ink hover:bg-ink hover:text-paper transition-colors"
                  >
                    Meeting link
                  </a>
                )}
              </>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}

/** Named with a trailing underscore to avoid shadowing the page component. */
function Detail_({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="meta-label">{label}</dt>
      <dd className="mt-1 text-ink">{children}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div aria-hidden className="bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto max-w-4xl px-6 pt-12 md:pt-16 pb-10">
          <div className="h-3 w-28 rounded bg-line" />
          <div className="mt-7 h-3 w-48 rounded bg-line" />
          <div className="mt-5 h-10 w-4/5 rounded bg-line" />
          <div className="mt-5 h-4 w-1/3 rounded bg-line" />
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-6 py-12 grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16 items-start">
        <div className="space-y-3">
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              className="h-3 rounded bg-line"
              style={{ width: `${95 - i * 5}%` }}
            />
          ))}
        </div>
        <div className="rounded-card border border-line p-6 space-y-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-2.5 w-20 rounded bg-line" />
              <div className="h-3 w-32 rounded bg-line" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EventNotFound() {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-2xl px-6 py-28 text-center">
        <p className="meta-label">Not found</p>
        <h1 className="mt-5 font-display text-4xl">No event at this address.</h1>
        <p className="mt-5 text-muted leading-relaxed">
          The link may be out of date, or the session may have been removed.
        </p>
        <Link
          to="/events"
          className="mt-8 inline-flex rounded-control bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink-hover transition-colors"
        >
          All events
        </Link>
      </div>
    </div>
  );
}
