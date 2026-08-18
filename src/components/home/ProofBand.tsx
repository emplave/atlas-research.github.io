import { StatBand } from "./StatBand";

/**
 * The proof band. NAVY FULL-BLEED.
 *
 * One of only two navy bands on the page (the other is the closing CTA).
 *
 * The logos are the primary element: larger, evenly spaced, centred. Partner
 * marks are supplied light-background, so they sit on white plates.
 *
 * The "fellows learn from researchers at…" line does NOT belong here — it
 * describes guest sessions, which are a Fellowship matter. It lives on the
 * Fellowship page only.
 *
 * EXTENSION POINT: the guest row below the relationship line is built for a
 * future set of named guest researchers. Fill GUEST_RESEARCHERS in and the row
 * appears with no redesign. Leave it empty until names are confirmed — never
 * seed it with a placeholder person.
 */
const LOGOS = [
  {
    src: "/partners/ijhsr.png",
    alt: "International Journal of High School Research",
    /** Plate height, tuned per mark so the logos read as optically equal. */
    h: "h-9 md:h-11",
  },
  { src: "/partners/lumiere.png", alt: "Lumiere Education", h: "h-9 md:h-11" },
  { src: "/partners/curieux.png", alt: "The Curieux Review", h: "h-11 md:h-14" },
];

/**
 * Named guest researchers, for the row beneath the logos.
 *
 * EMPTY UNTIL CONFIRMED. Never add a name without that person having agreed to
 * appear — a named researcher on an organisation's homepage is an endorsement
 * claim.
 */
const GUEST_RESEARCHERS: { name: string; affiliation: string }[] = [];

export function ProofBand() {
  return (
    <section className="on-navy bg-navy">
      <div className="mx-auto max-w-6xl px-6 py-14 md:py-16 text-center">
        <p aria-hidden className="meta-label text-white/45">
          05
        </p>

        <p className="mt-4 meta-label text-white/70">
          Partners and publication routes
        </p>

        <ul className="mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {LOGOS.map((logo) => (
            <li key={logo.src}>
              <span className="inline-flex items-center justify-center rounded-card bg-white px-6 py-4 md:px-8 md:py-5">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={`${logo.h} w-auto`}
                  loading="lazy"
                />
              </span>
            </li>
          ))}
        </ul>

        <p className="mt-8 mx-auto max-w-3xl text-[15px] text-white/80 leading-relaxed">
          IJHSR is a peer-reviewed submission route. Lumiere Education is a
          program partner. The Curieux Review is a student research writing
          partner.
        </p>

        {GUEST_RESEARCHERS.length > 0 && (
          <div className="mt-10 pt-8 border-t border-white/20">
            <p className="meta-label text-white/45">Guest researchers</p>
            <ul className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {GUEST_RESEARCHERS.map((g) => (
                <li key={g.name} className="text-[15px] text-white">
                  {g.name}
                  <span className="text-white/60">, {g.affiliation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Renders nothing while every value in stats.ts is null. */}
        <div className="mt-10 empty:mt-0 text-left">
          <StatBand />
        </div>
      </div>
    </section>
  );
}
