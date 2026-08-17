import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { DATES } from "@/lib/dates";

/** The submission-start box (NSRI-informed) — applications are live. */
export function ApplyBox() {
  return (
    <section className="bg-ground">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <Reveal>
          <div className="rounded-card border border-line bg-ground p-7 md:p-9 flex flex-col md:flex-row md:items-center gap-7 justify-between">
            <div>
              <p className="meta-label text-brass flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brass" />
                {DATES.cohortState}
              </p>
              <h2 className="mt-3 font-display text-2xl md:text-3xl text-text">
                {DATES.waitlist}
              </h2>
              <p className="mt-2 text-[15px] text-muted max-w-lg">
                {DATES.nextCycle}. Applications are reviewed {DATES.review}.
                Free, remote, no prior research required — three short essays,
                no résumé.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <Link
                to="/fellowship"
                className="rounded-control bg-brass text-ground pl-6 pr-5 py-3 text-[15px] inline-flex items-center justify-center gap-2.5 hover:bg-brass-hi transition-all hover:gap-3.5"
              >
                Join the waitlist
                <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
