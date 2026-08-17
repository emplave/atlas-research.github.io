import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { DATES } from "@/lib/dates";

/**
 * Bookend close — the landing page's final CTA section.
 *
 * The sitewide footer used to live inside this component; it is now
 * src/components/Footer.tsx, rendered by the shell on every route. This is a
 * landing-page section only.
 */
export function Closing() {
  return (
    <section id="apply" className="bg-ground text-text border-t border-line">
      <div className="mx-auto max-w-4xl px-6 py-24 md:py-32 text-center">
        <Reveal>
          <p className="meta-label text-muted">{DATES.cohortState}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-display text-4xl md:text-6xl leading-[1.08] text-text">
            Do research that
            <br />
            gets taken seriously.
          </h2>
        </Reveal>
        <Reveal delay={0.22}>
          <p className="mt-6 mx-auto max-w-xl text-muted text-lg">
            The selective summer Fellowship — free, remote, and open to
            secondary and university students worldwide. {DATES.nextCycle}.
          </p>
        </Reveal>
        <Reveal delay={0.34}>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
            <Link
              to="/apply"
              className="rounded-control bg-brass text-ground pl-7 pr-6 py-3.5 text-[15px] inline-flex items-center gap-2.5 hover:bg-brass-hi transition-all hover:gap-3.5"
            >
              {DATES.waitlist}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.45}>
          <p className="mt-8 meta-label text-muted">
            {DATES.cohortState} · Review {DATES.review}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
