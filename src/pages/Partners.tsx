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
    <div className="bg-ground">
      <section className="border-b border-line/50">
        <div className="mx-auto max-w-3xl px-6 pt-16 md:pt-24 pb-12">
          <Reveal>
            <p className="meta-label text-muted">
              Partners · Journals · Funders · Institutions
            </p>
            <h1 className="mt-4 font-display text-4xl md:text-6xl text-text leading-[1.05]">
              Start a conversation.
            </h1>
            <p className="mt-6 text-lg text-muted leading-relaxed">
              Atlas supports student research groups worldwide, in every
              field. If your organisation works on research integrity, student
              publishing, or mentorship — or you're a researcher who would
              speak to a group — tell us a little and we'll write back.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-14 md:py-20">
        {state === "sent" ? (
          <div className="border border-line bg-ground rounded-card p-10 text-center">
            <p className="font-display text-3xl text-text">Message on its way.</p>
            <p className="mt-4 text-muted">
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
                  placeholder="A sentence or two is plenty — mentorship, a partnership, speaking to a research group, publishing…"
                />
              </Field>
            </Reveal>
            <Reveal>
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={state === "sending"}
                  className="rounded-control bg-text text-ground pl-7 pr-6 py-3.5 text-[15px] inline-flex items-center gap-2.5 hover:bg-text-hi transition-all hover:gap-3.5 disabled:opacity-60"
                >
                  {state === "sending" ? "Sending…" : "Send to Atlas"}
                  <span aria-hidden>→</span>
                </button>
                {state === "error" && (
                  <p className="text-sm text-alert">
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
