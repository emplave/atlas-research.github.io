import { Reveal } from "./Reveal";

/** The founding thesis, set huge — the Antigravity "mission sentence" move. */
export function Thesis() {
  return (
    <section id="study" className="bg-cream-100">
      <div className="mx-auto max-w-5xl px-6 py-24 md:py-36 text-center">
        <Reveal>
          <p className="meta-label text-navy-500 mb-8">Why Atlas exists</p>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="font-serif text-3xl md:text-5xl leading-[1.2] text-navy-900">
            Research literacy is a function of{" "}
            <span className="italic">access</span>, not ability.
          </p>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="mt-8 mx-auto max-w-2xl text-navy-600 leading-relaxed">
            A student in Kathmandu, La Paz, or Dhaka rarely meets research
            methodology before university. A student in Toronto or Beijing
            often gets it built in. That gap is structural — not a talent gap.
            Atlas exists to close it: one real study, run by fellows in every
            school we can reach, published where researchers actually look.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
