import { Reveal } from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Train",
    body: "Real survey and policy methodology through a live seminar series — fellows learn from researchers at institutions like USC, the University of Melbourne, and Stanford. Not a watered-down teen curriculum.",
  },
  {
    n: "02",
    title: "Analyze real data",
    body: "UNESCO, World Bank, and PISA datasets — the same evidence base professionals use — pointed at education inequality in your own region.",
  },
  {
    n: "03",
    title: "Write the brief",
    body: "A policy brief or literature review with a defensible argument: what the data shows, what it means for your region, what should change.",
  },
  {
    n: "04",
    title: "Publish & advocate",
    body: "Editorial support toward the Atlas Journal of Education Policy and partner journals — then the work goes to people who can act on it.",
  },
];

export function Sequence() {
  return (
    <section id="sequence" className="bg-ground border-y border-line/50">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="meta-label text-muted">The Fellowship · four weeks</p>
          <h2 className="mt-4 font-display text-3xl md:text-5xl text-text max-w-2xl leading-tight">
            Each stage exists because the last one worked.
          </h2>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.08} className="h-full">
              <div className="group h-full bg-ground p-7 flex flex-col gap-4 transition-colors hover:bg-ground">
                <span className="meta-label text-brass">{s.n}</span>
                <h3 className="font-display text-2xl text-text group-hover:translate-x-0.5 transition-transform">
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-6 meta-label text-muted">
            Real datasets · Your region · Published output
          </p>
        </Reveal>
      </div>
    </section>
  );
}
