import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import {
  Field,
  inputCls,
  WordCountArea,
  submitApplication,
  SubmitState,
} from "@/components/forms";
import { DATES, LEGACY_PORTAL } from "@/lib/dates";

const GRADES = ["9", "10", "11", "12"];

/**
 * Fellowship application — selective summer program. Fields mirror the live
 * Atlas portal (atlas-research.org/apply.html): three essays, no résumé.
 */
export function Fellowship() {
  const [essay1, setEssay1] = useState("");
  const [essay2, setEssay2] = useState("");
  const [essay3, setEssay3] = useState("");
  const [state, setState] = useState<SubmitState>("idle");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => (data[k] = String(v)));
    data.essay_problem = essay1;
    data.essay_method = essay2;
    data.essay_project = essay3;
    void submitApplication("Fellowship application", data, setState);
  };

  return (
    <div className="bg-cream-100">
      {/* header */}
      <section className="border-b border-hairline-soft">
        <div className="mx-auto max-w-3xl px-6 pt-16 md:pt-24 pb-12">
          <Reveal>
            <p className="meta-label text-navy-500">
              The Fellowship · Selective · Summer 2026
            </p>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl text-navy-900 leading-[1.05]">
              Apply to the founding cohort.
            </h1>
            <p className="mt-6 text-lg text-navy-600 leading-relaxed">
              Six weeks. You'll study education inequality in your own region
              using real datasets — UNESCO, World Bank, PISA — learn from
              researchers at institutions like Stanford, and turn your findings
              into a policy brief or literature review intended for
              publication.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 border border-hairline divide-x divide-[rgba(28,46,69,0.12)] bg-cream-50 text-center">
              {[
                ["Open", "Applications"],
                [DATES.deadline, "Deadline"],
                ["Rolling", "Review"],
                ["$0", "Cost"],
              ].map(([n, l]) => (
                <div key={l} className="px-3 py-4">
                  <p className="font-serif text-lg md:text-xl text-navy-900">{n}</p>
                  <p className="mt-0.5 meta-label text-navy-500">{l}</p>
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-6 text-sm text-navy-500">
              No prior research experience required. We select on how you
              think, not what's on your résumé. Decisions are sent{" "}
              {DATES.review}.
            </p>
          </Reveal>
        </div>
      </section>

      {/* form */}
      <section className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        {state === "sent" ? (
          <div className="border border-hairline bg-cream-50 rounded-2xl p-10 text-center">
            <p className="font-serif text-3xl text-navy-900">
              Application received.
            </p>
            <p className="mt-4 text-navy-600">
              We review individually, on a rolling basis — you'll hear from us
              soon. (If your email client opened instead, hit send there to
              complete the submission.)
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-8">
            <Reveal>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Full name" required>
                  <input name="name" required className={inputCls} autoComplete="name" />
                </Field>
                <Field label="Email" required>
                  <input name="email" type="email" required className={inputCls} autoComplete="email" />
                </Field>
                <Field label="School name" required>
                  <input name="school" required className={inputCls} />
                </Field>
                <Field label="School city" required>
                  <input name="city" required className={inputCls} />
                </Field>
                <Field label="Country" required>
                  <input name="country" required className={inputCls} placeholder="e.g. Nepal" />
                </Field>
                <Field label="Grade (2026–27 school year)" required>
                  <select name="grade" required className={inputCls} defaultValue="">
                    <option value="" disabled>
                      Select…
                    </option>
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        Grade {g}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Time zone" required hint="e.g. GMT+5:45, EST">
                  <input name="timezone" required className={inputCls} />
                </Field>
                <Field label="Prior research experience" hint="Not required — honesty helps us place you.">
                  <input name="prior_research" className={inputCls} placeholder="One line, or leave blank" />
                </Field>
              </div>
            </Reveal>

            <Reveal>
              <div className="space-y-8 border-t border-hairline pt-8">
                <Field
                  label="1 · One specific problem"
                  required
                  hint="Describe one specific problem you've observed about education access in your region."
                >
                  <WordCountArea
                    name="essay_problem"
                    min={40}
                    max={350}
                    placeholder="What have you actually seen?"
                    value={essay1}
                    onChange={setEssay1}
                  />
                </Field>
                <Field
                  label="2 · How would you investigate it?"
                  required
                  hint="How would you find out whether this problem is real, and how large it is? Mention data you'd want (UNESCO, World Bank, PISA — or your own)."
                >
                  <WordCountArea
                    name="essay_method"
                    min={40}
                    max={350}
                    placeholder="Your instinct matters more than jargon."
                    value={essay2}
                    onChange={setEssay2}
                  />
                </Field>
                <Field
                  label="3 · Something you finished"
                  required
                  hint="A self-initiated project you completed — focus on what got hard and how you pushed through."
                >
                  <WordCountArea
                    name="essay_project"
                    min={20}
                    max={300}
                    placeholder="School counts. Outside school counts more."
                    value={essay3}
                    onChange={setEssay3}
                  />
                </Field>
              </div>
            </Reveal>

            <Reveal>
              <div className="border-t border-hairline pt-8 space-y-5">
                <Field label="How did you find Atlas?">
                  <input name="found_via" className={inputCls} placeholder="Friend, teacher, Instagram…" />
                </Field>
                <label className="flex items-start gap-3 text-sm text-navy-600">
                  <input type="checkbox" name="privacy" required className="mt-1" />
                  <span>
                    I agree to the privacy policy — my application is reviewed
                    by the Atlas team and never sold or shared.
                  </span>
                </label>
                <label className="flex items-start gap-3 text-sm text-navy-600">
                  <input type="checkbox" name="newsletter" className="mt-1" />
                  <span>Keep me posted about Atlas programs and publications.</span>
                </label>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="rounded-full bg-navy-800 text-cream-100 pl-7 pr-6 py-3.5 text-[15px] inline-flex items-center gap-2.5 hover:bg-navy-700 transition-all hover:gap-3.5 disabled:opacity-60"
                  >
                    {state === "sending" ? "Submitting…" : "Submit application"}
                    <span aria-hidden className="text-gold-300">→</span>
                  </button>
                  <a
                    href={LEGACY_PORTAL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-navy-500 underline underline-offset-4 hover:text-navy-800"
                  >
                    or use the current portal
                  </a>
                </div>
                {state === "error" && (
                  <p className="text-sm text-gold-600">
                    Something failed on our end — please retry, or apply via
                    the portal link above.
                  </p>
                )}
              </div>
            </Reveal>
          </form>
        )}
      </section>
    </div>
  );
}
