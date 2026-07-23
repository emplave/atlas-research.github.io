import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Field, inputCls, submitApplication, SubmitState } from "@/components/forms";

const gets = [
  {
    t: "The Atlas curriculum",
    d: "Session-by-session materials for running a research club: methods, real datasets (UNESCO, World Bank, PISA), and how to read a paper without drowning.",
  },
  {
    t: "A place on the map",
    d: "Your school joins the Atlas network — the same globe on our front page. Chapters are where the access mission actually scales.",
  },
  {
    t: "A pathway to the Fellowship",
    d: "Chapter leads and members get direct experience that makes a Fellowship application concrete instead of hypothetical.",
  },
  {
    t: "Publishing support",
    d: "Strong chapter projects can be developed toward the Atlas Journal and partner journals, with editorial guidance.",
  },
];

/**
 * Chapters — open enrollment. The deliberate opposite of the selective
 * Fellowship: any school, any time, no gate.
 */
export function Chapters() {
  const [state, setState] = useState<SubmitState>("idle");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => (data[k] = String(v)));
    void submitApplication("Chapter registration", data, setState);
  };

  return (
    <div className="bg-cream-100">
      <section className="border-b border-hairline-soft">
        <div className="mx-auto max-w-3xl px-6 pt-16 md:pt-24 pb-12">
          <Reveal>
            <p className="meta-label text-navy-500">
              Chapters · Open enrollment · Any school, any country
            </p>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl text-navy-900 leading-[1.05]">
              Start a research club at your school.
            </h1>
            <p className="mt-6 text-lg text-navy-600 leading-relaxed">
              The Fellowship is selective. Chapters are deliberately not —
              because the whole point of Atlas is that research access
              shouldn't depend on winning a gate. If you have a school and the
              will to run it, you can open a chapter.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14 md:py-20">
        <div className="grid md:grid-cols-2 gap-px bg-[rgba(28,46,69,0.12)] border border-hairline">
          {gets.map((g, i) => (
            <Reveal key={g.t} delay={i * 0.06} className="h-full">
              <div className="h-full bg-cream-100 p-7">
                <h3 className="font-serif text-2xl text-navy-900">{g.t}</h3>
                <p className="mt-3 text-[15px] text-navy-600 leading-relaxed">{g.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <Reveal>
          <h2 className="font-serif text-3xl text-navy-900">Register your chapter</h2>
          <p className="mt-3 text-navy-600 text-[15px]">
            Takes two minutes. We'll send the starter kit and add your school
            to the network.
          </p>
        </Reveal>
        {state === "sent" ? (
          <div className="mt-8 border border-hairline bg-cream-50 rounded-2xl p-10 text-center">
            <p className="font-serif text-3xl text-navy-900">Welcome to the network.</p>
            <p className="mt-4 text-navy-600">
              Starter kit is on its way. (If your email client opened, hit
              send there to finish.)
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Field label="Your name" required>
                <input name="name" required className={inputCls} autoComplete="name" />
              </Field>
              <Field label="Email" required>
                <input name="email" type="email" required className={inputCls} autoComplete="email" />
              </Field>
              <Field label="School" required>
                <input name="school" required className={inputCls} />
              </Field>
              <Field label="City + country" required>
                <input name="location" required className={inputCls} placeholder="e.g. Kathmandu, Nepal" />
              </Field>
            </div>
            <Field label="Why a chapter, in one or two lines?" hint="No essay. We just want to know you're real.">
              <textarea name="why" rows={3} className={inputCls + " resize-y"} />
            </Field>
            <label className="flex items-start gap-3 text-sm text-navy-600">
              <input type="checkbox" name="privacy" required className="mt-1" />
              <span>I agree to the privacy policy.</span>
            </label>
            <button
              type="submit"
              disabled={state === "sending"}
              className="rounded-full bg-navy-800 text-cream-100 pl-7 pr-6 py-3.5 text-[15px] inline-flex items-center gap-2.5 hover:bg-navy-700 transition-all hover:gap-3.5 disabled:opacity-60"
            >
              {state === "sending" ? "Registering…" : "Register chapter"}
              <span aria-hidden className="text-gold-300">→</span>
            </button>
            {state === "error" && (
              <p className="text-sm text-gold-600">
                Something failed — please retry, or email us directly.
              </p>
            )}
          </form>
        )}
      </section>
    </div>
  );
}
