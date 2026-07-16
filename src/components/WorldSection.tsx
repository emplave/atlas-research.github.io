import { Globe, GLOBE_LIGHT } from "@/components/ui/globe";
import { Reveal } from "./Reveal";

const facts = [
  { n: "$0", label: "Cost, both programs" },
  { n: "6", label: "Weeks, the Fellowship" },
  { n: "9–12", label: "Grades, any school" },
  { n: "15+", label: "Countries, north & south" },
];

/**
 * The network — full-screen moment. Light editorial globe rising from the
 * bottom half; gold dots are applicant schools, animated arcs connect them.
 */
export function WorldSection() {
  return (
    <section
      id="world"
      className="relative bg-cream-50 border-y border-hairline-soft overflow-hidden mt-14"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6 pt-20 md:pt-28 text-center">
        <Reveal>
          <p className="meta-label text-navy-500">The network</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl text-navy-900 leading-tight">
            Applications are already arriving
            <br />
            <span className="italic">from both sides of the access gap.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.22}>
          <p className="mt-6 mx-auto max-w-2xl text-navy-600 leading-relaxed">
            Every gold point is a school whose students applied. The Fellowship
            is selective — but the network isn't: Chapters keep the door open
            to every school, because access is the entire point.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 border border-hairline divide-x divide-[rgba(28,46,69,0.12)] bg-cream-100/70 backdrop-blur-sm max-w-3xl mx-auto">
            {facts.map((f) => (
              <div key={f.label} className="px-4 py-5">
                <p className="font-serif text-3xl md:text-4xl text-navy-900">
                  {f.n}
                </p>
                <p className="mt-1 meta-label text-navy-500">{f.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>

      {/* The rising globe with applicant arcs */}
      <div className="relative h-[46vh] md:h-[54vh] mt-6 md:mt-10">
        <Globe
          config={GLOBE_LIGHT}
          rotateSpeed={0.003}
          showArcs
          className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-[46%] w-[min(94vw,1040px)] max-w-none"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream-50 via-cream-50/70 to-transparent"
        />
        <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 meta-label text-navy-400 whitespace-nowrap">
          Drag to explore · Gold marks applicant schools
        </p>
      </div>
    </section>
  );
}
