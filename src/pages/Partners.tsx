import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Field, inputCls, submitApplication, SubmitState } from "@/components/forms";

/**
 * Partners — start a conversation. Collects name, title/research group
 * (optional), the sender's email, and a short message, then sends it to
 * Atlas (via FORM_ENDPOINT when configured, otherwise a prefilled email).
 */
export function Partners() {
  const [state, setState] = useState<SubmitState>("idle");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => (data[k] = String(v)));
    void submitApplication("Partnership inquiry", data, setState);
  };

  return (
    <div className="bg-cream-100">
      <section className="border-b border-hairline-soft">
        <div className="mx-auto max-w-3xl px-6 pt-16 md:pt-24 pb-12">
          <Reveal>
            <p className="meta-label text-navy-500">
              Partners · Journals · Funders · NGOs
            </p>
            <h1 className="mt-4 font-serif text-4xl md:text-6xl text-navy-900 leading-[1.05]">
              Start a conversation.
            </h1>
            <p className="mt-6 text-lg text-navy-600 leading-relaxed">
              Atlas is a for-youth nonprofit. If your organization works on
              education access, research integrity, or youth publishing — or
              you're a researcher who'd speak to a cohort — tell us a little and
              we'll write back.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-14 md:py-20">
        {state === "sent" ? (
          <div className="border border-hairline bg-cream-50 rounded-2xl p-10 text-center">
            <p className="font-serif text-3xl text-navy-900">Message on its way.</p>
            <p className="mt-4 text-navy-600">
              Thanks for reaching out — we read every note and reply
              personally. (If your email client opened, hit send there to
              finish.)
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <Reveal>
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Your name" required>
                  <input name="name" required className={inputCls} autoComplete="name" />
                </Field>
                <Field label="Your email" required>
                  <input name="email" type="email" required className={inputCls} autoComplete="email" />
                </Field>
              </div>
            </Reveal>
            <Reveal>
              <Field
                label="Title / research group"
                hint="e.g. Professor of Education, Stanford · or a lab / journal / NGO name"
              >
                <input name="title_group" className={inputCls} placeholder="Optional" />
              </Field>
            </Reveal>
            <Reveal>
              <Field label="What would you like to explore together?">
                <textarea
                  name="message"
                  rows={5}
                  className={inputCls + " resize-y"}
                  placeholder="A sentence or two is plenty — mentorship, a partnership, speaking to a cohort, publishing…"
                />
              </Field>
            </Reveal>
            <Reveal>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="rounded-full bg-navy-800 text-cream-100 pl-7 pr-6 py-3.5 text-[15px] inline-flex items-center gap-2.5 hover:bg-navy-700 transition-all hover:gap-3.5 disabled:opacity-60"
                >
                  {state === "sending" ? "Sending…" : "Send to Atlas"}
                  <span aria-hidden className="text-gold-300">→</span>
                </button>
                {state === "error" && (
                  <p className="text-sm text-gold-600">
                    Something failed — please retry.
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
