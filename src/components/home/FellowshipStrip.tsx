import { Link } from "react-router-dom";

/**
 * Section 6 — the fellowship, as one compact block.
 *
 * Applications for the current cohort are CLOSED. The only action is the
 * waitlist. This block must never link to /apply.html.
 */
export function FellowshipStrip() {
  return (
    <section className="bg-paper border-b border-line">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="rounded-card border border-line bg-surface p-7 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="font-display text-xl md:text-2xl">
              The Atlas Fellowship
            </h2>
            <p className="mt-2.5 text-[15px] text-muted leading-relaxed">
              A selective four-week summer cohort, free and remote. Applications
              for the current cohort are closed. The waitlist is open for the
              next one.
            </p>
          </div>
          <Link
            to="/fellowship"
            className="shrink-0 rounded-control border border-navy bg-surface text-navy px-5 py-2.5 text-[15px] text-center hover:bg-navy hover:text-white transition-colors"
          >
            Join the waitlist
          </Link>
        </div>
      </div>
    </section>
  );
}
