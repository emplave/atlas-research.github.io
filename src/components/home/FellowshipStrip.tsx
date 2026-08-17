import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";
import { DATES } from "@/lib/dates";

/**
 * Section 7 — the fellowship, as ONE compact secondary strip.
 *
 * The fellowship is not the headline programme on this site. Applications for
 * the current cohort are CLOSED and the only action here is the waitlist.
 *
 * This section must never link to /apply.html or to the application route.
 * The homepage does not carry an apply path.
 */
export function FellowshipStrip() {
  return (
    <section className="bg-ground border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16">
        <Reveal>
          <div className="rounded-card border border-line bg-panel p-7 md:p-9 flex flex-col md:flex-row md:items-center justify-between gap-7">
            <div className="max-w-2xl">
              <p className="meta-label text-muted">
                A separate programme · Applications closed
              </p>
              <h2 className="mt-3 font-display text-2xl md:text-3xl text-text">
                The Atlas Fellowship
              </h2>
              <p className="mt-3 text-[15px] text-muted leading-relaxed">
                A selective four-week summer cohort, free and remote, separate
                from the research groups. {DATES.cohortState}, so applications
                for the current cohort are closed. {DATES.nextCycle}.
              </p>
            </div>
            <div className="shrink-0">
              <Link
                to="/fellowship"
                className="inline-flex items-center gap-2.5 rounded-control border border-line text-text px-5 py-2.5 text-[15px] hover:border-muted transition-colors"
              >
                {DATES.waitlist}
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
