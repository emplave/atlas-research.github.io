import { BringAtlasCta, CostLine } from "./BringAtlasCta";
import { ReachGlobe } from "./ReachGlobe";

/**
 * Homepage hero. Asymmetric: text on the left at 60%, globe on the right.
 *
 * The 60/40 split is measured, not chosen by feel. At the 104px headline size,
 * a 55% column (576px) breaks the headline into four lines and leaves "field."
 * alone as a widow. 60% (629px) sets it in three lines ending "any field.".
 * Narrowing this column again will reintroduce the widow.
 *
 * No entrance animation — the globe's rotation is the only motion, and the
 * headline is never delayed.
 *
 * ONE CTA. The secondary "Browse research groups" button stays gone even now
 * that the listing is back — the listing is the very next section, so a button
 * to reach it competed with the primary action to scroll past it. A lone primary
 * button also reads as a decision rather than a menu.
 *
 * THE COST LINE SITS DIRECTLY UNDER THE SUBHEAD, above the button, because free
 * is the strongest fact on the page and comparable programmes in this category
 * charge thousands. Do not move it below the fold or fold it into the FAQ.
 *
 * The fellowship is deliberately absent. Nothing on the homepage links to the
 * application.
 */
export function Hero() {
  return (
    <section id="top" className="bg-paper border-b border-line">
      <div className="mx-auto max-w-6xl px-6 pt-16 pb-14 md:pt-20 md:pb-16">
        <div className="grid items-center gap-10 lg:gap-14 lg:grid-cols-[60fr_40fr]">
          <div>
            <h1 className="type-hero font-display">
              Atlas runs student research groups in any field.
            </h1>

            <p className="mt-8 max-w-xl type-body text-muted">
              You pick the question, recruit three or more members, and finish a
              paper in one semester.
            </p>

            <CostLine className="mt-5 max-w-xl" />

            <div className="mt-10">
              <BringAtlasCta />
            </div>
          </div>

          <ReachGlobe className="order-first lg:order-none" />
        </div>
      </div>
    </section>
  );
}
