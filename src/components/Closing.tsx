import { Link } from "react-router-dom";
import { Reveal } from "./Reveal";
import { AtlasLogo } from "./AtlasLogo";
import { DATES, APPLY_EMAIL } from "@/lib/dates";

/** Bookend close — the hero thesis returns, on ink. Sitewide footer. */
export function Closing() {
  return (
    <section id="apply" className="bg-navy-950 text-cream-200">
      <div className="mx-auto max-w-4xl px-6 py-24 md:py-32 text-center">
        <Reveal>
          <p className="meta-label text-cream-300/60">
            Founding cohort · Applications open now
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-6 font-serif text-4xl md:text-6xl leading-[1.08] text-cream-100">
            Put your school
            <br />
            on the map.
          </h2>
        </Reveal>
        <Reveal delay={0.22}>
          <p className="mt-6 mx-auto max-w-xl text-cream-300/75 text-lg">
            The selective summer Fellowship — free, remote, and open to
            grades 9–12. Applications close {DATES.deadline}, a real deadline,
            not a manufactured one.
          </p>
        </Reveal>
        <Reveal delay={0.34}>
          <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
            <Link
              to="/fellowship"
              className="rounded-full bg-cream-100 text-navy-900 pl-7 pr-6 py-3.5 text-[15px] inline-flex items-center gap-2.5 hover:bg-cream-200 transition-all hover:gap-3.5"
            >
              Apply to the Fellowship
              <span aria-hidden className="text-gold-600">→</span>
            </Link>
          </div>
        </Reveal>
        <Reveal delay={0.45}>
          <p className="mt-8 meta-label text-cream-300/40">
            Due {DATES.deadline} · Review {DATES.review} · Program{" "}
            {DATES.programStart}
          </p>
        </Reveal>
      </div>

      <footer className="border-t border-hairline-inverse-soft">
        <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <AtlasLogo inverse />
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-cream-300/60">
            <Link to="/fellowship" className="hover:text-cream-200 transition-colors">
              Fellowship
            </Link>
            <Link to="/publish" className="hover:text-cream-200 transition-colors">
              Publish with us
            </Link>
            <a
              href={`mailto:${APPLY_EMAIL}`}
              className="hover:text-cream-200 transition-colors"
            >
              {APPLY_EMAIL}
            </a>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-8">
          <p className="meta-label text-cream-300/30">
            © 2026 Atlas Research Institute
          </p>
        </div>
      </footer>
    </section>
  );
}
