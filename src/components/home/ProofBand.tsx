import { StatBand } from "./StatBand";

/**
 * Section 4 — the proof band. NAVY FULL-BLEED.
 *
 * One of only two navy bands on the page (the other is the closing CTA). A
 * third would turn a light page into a striped one.
 *
 * Partner logos sit on white plates because partner marks are supplied
 * light-background and would disappear on navy.
 *
 * The stat band renders nothing while every value in stats.ts is null. That is
 * why this section still reads as complete without it.
 */
const LOGOS = [
  {
    src: "/partners/ijhsr.png",
    alt: "International Journal of High School Research",
    h: "h-6",
  },
  { src: "/partners/lumiere.png", alt: "Lumiere Education", h: "h-6" },
  { src: "/partners/curieux.png", alt: "The Curieux Review", h: "h-8" },
];

export function ProofBand() {
  return (
    <section className="on-navy bg-navy">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-14">
        <p aria-hidden className="meta-label text-white/45">04</p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          {LOGOS.map((logo) => (
            <span
              key={logo.src}
              className="inline-flex items-center rounded-control bg-white px-3 py-2"
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className={`${logo.h} w-auto`}
                loading="lazy"
              />
            </span>
          ))}
        </div>

        <p className="mt-7 max-w-2xl text-lg text-white leading-relaxed">
          Fellows learn from researchers at USC, the University of Melbourne,
          and Stanford.
        </p>

        <div className="mt-10 empty:mt-0">
          <StatBand />
        </div>
      </div>
    </section>
  );
}
