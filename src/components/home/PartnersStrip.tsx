import { Link } from "react-router-dom";
import { Reveal } from "@/components/Reveal";

/**
 * Section 8 — partners.
 *
 * TWO DISTINCT CATEGORIES, DELIBERATELY NOT MERGED:
 *
 *   Publishing venue — where completed work may be SUBMITTED. IJHSR only.
 *   Programme partners — organisations offering something to students that is
 *                        not publication. Lumiere belongs here, not in a
 *                        publishing strip: it is not a journal.
 *
 * Named institutions are always phrased "fellows learn from researchers at",
 * never "partnered with". Lumiere is a DISCOUNT benefit, never scholarships.
 */
export function PartnersStrip() {
  return (
    <section className="bg-ground border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Reveal>
          <p className="meta-label text-muted">Partners</p>
        </Reveal>

        <div className="mt-9 grid gap-10 md:grid-cols-2">
          <Reveal>
            <div>
              <h3 className="font-display text-xl text-text">
                Where completed work may be submitted
              </h3>
              <p className="mt-3 max-w-md text-[15px] text-muted leading-relaxed">
                The Atlas Journal, and the International Journal of High School
                Research. Submission is not acceptance — review decides what is
                published.
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="inline-flex items-center rounded-control bg-logo-plate border border-line px-3 py-2">
                  <img
                    src="/partners/ijhsr.png"
                    alt="International Journal of High School Research"
                    className="h-6 w-auto"
                  />
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div>
              <h3 className="font-display text-xl text-text">
                Programme partners
              </h3>
              <p className="mt-3 max-w-md text-[15px] text-muted leading-relaxed">
                Fellows get thousands of dollars in discounts on Lumiere
                Education programmes through our partnership. The Curieux
                Review partners with Atlas on student research writing.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-control bg-logo-plate border border-line px-3 py-2">
                  <img
                    src="/partners/lumiere.png"
                    alt="Lumiere Education"
                    className="h-6 w-auto"
                  />
                </span>
                <span className="inline-flex items-center rounded-control bg-logo-plate border border-line px-3 py-2">
                  <img
                    src="/partners/curieux.png"
                    alt="The Curieux Review"
                    className="h-8 w-auto"
                  />
                </span>
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.16}>
          <div className="mt-10 pt-7 border-t border-line flex flex-wrap items-center justify-between gap-5">
            <p className="max-w-2xl text-[15px] text-muted leading-relaxed">
              Fellows learn from researchers at institutions including USC, the
              University of Melbourne, and Stanford.
            </p>
            <Link
              to="/partners"
              className="text-sm text-accent hover:text-accent-hi transition-colors inline-flex items-center gap-1.5"
            >
              Partner with Atlas
              <span aria-hidden>→</span>
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
