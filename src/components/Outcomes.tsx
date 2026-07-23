import { Reveal } from "./Reveal";

const outcomes = [
  {
    title: "Co-author credit",
    body: "Your name on a real cross-national dataset — the kind of authorship most people first earn in university, if ever.",
  },
  {
    title: "Journal submission",
    body: "Your policy brief is submitted to the International Journal of High School Research (EBSCO & Google Scholar indexed) and the Atlas Journal of Education Policy.",
  },
  {
    title: "Real methodology",
    body: "Survey design, sampling, analysis — taught straight, through guest seminars from university researchers, including faculty from USC, the University of Melbourne, and Stanford.",
  },
  {
    title: "A global peer network",
    body: "The people in your cohort are researching the same access gap from their own regions, the same weeks you are.",
  },
];

export function Outcomes() {
  return (
    <section id="outcomes" className="bg-cream-100">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal>
          <p className="meta-label text-navy-500">What fellows get</p>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl text-navy-900 leading-tight">
            Outcomes, not perks.
          </h2>
        </Reveal>
        <div className="mt-14 grid md:grid-cols-2 gap-x-16 gap-y-12">
          {outcomes.map((o, i) => (
            <Reveal key={o.title} delay={i * 0.07}>
              <div className="border-t border-hairline pt-6">
                <h3 className="font-serif text-2xl text-navy-900">{o.title}</h3>
                <p className="mt-3 text-navy-600 leading-relaxed text-[15px]">
                  {o.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={0.2}>
          <p className="mt-14 text-sm text-navy-500 max-w-2xl">
            What we don't promise: college admission. No single program can,
            and we'd rather earn your trust than borrow it — so we point you to
            verifiable work, not invented numbers.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
