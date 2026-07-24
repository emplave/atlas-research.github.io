import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { DATES } from "@/lib/dates";

/** The submission-start box (NSRI-informed) — applications are live. */
export function ApplyBox() {
  return (
    <section className="bg-cream-100">
      <div className="mx-auto max-w-6xl px-6 pt-14">
        <Reveal>
          <div className="rounded-2xl border border-hairline bg-cream-50 p-7 md:p-9 flex flex-col md:flex-row md:items-center gap-7 justify-between">
            <div>
              <p className="meta-label text-gold-600 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500 animate-pulse-node" />
                Applications closed
              </p>
              <h2 className="mt-3 font-serif text-2xl md:text-3xl text-navy-900">
                Applications for this cohort have closed
              </h2>
              <p className="mt-2 text-[15px] text-navy-600 max-w-lg">
                This cohort is full. Leave your email and we'll reach out
                when the next opportunity opens.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0">
              <Link
                to="/fellowship"
                className="rounded-full bg-navy-800 text-cream-100 pl-6 pr-5 py-3 text-[15px] inline-flex items-center justify-center gap-2.5 hover:bg-navy-700 transition-all hover:gap-3.5"
              >
                Stay involved
                <span aria-hidden className="text-gold-300">→</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
