import { useState } from "react";
import { Link } from "react-router-dom";
import { Outcomes } from "@/components/Outcomes";
import { Field, inputCls, SubmitState } from "@/components/forms";
import { DATES, WAITLIST_ENDPOINT } from "@/lib/dates";
import { ELIGIBILITY_LABEL, FELLOWSHIP_WEEKS } from "@/lib/stats";

/**
 * The Fellowship. Dark chrome.
 *
 * APPLICATIONS ARE CLOSED for the current cohort. The cohort is underway and
 * the only action on this page is joining the waitlist for the next cycle.
 *
 * There is deliberately NO path to /apply.html from this page. The waitlist
 * form posts directly to WAITLIST_ENDPOINT — the same live Apps Script
 * backend that /apply.html uses — so submissions land in the same sheet.
 */
export function Fellowship() {
  const [state, setState] = useState<SubmitState>("idle");

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => (data[k] = String(v)));
    setState("sending");
    try {
      const res = await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify({
          kind: "Fellowship waitlist",
          ...data,
          submittedAt: new Date().toISOString(),
        }),
      });
      setState(res.ok ? "sent" : "error");
    } catch {
      setState("error");
    }
  };

  return (
    <div className="bg-paper">
      <section className="border-b border-line">
        <div className="mx-auto max-w-4xl px-6 pt-16 md:pt-24 pb-12">
            <p className="meta-label text-muted">
              The Fellowship · A separate programme · Applications closed
            </p>
            <h1 className="mt-4 font-display text-4xl md:text-5xl leading-[1.06]">
              A selective {FELLOWSHIP_WEEKS}-week summer cohort.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-muted leading-relaxed">
              Free and remote. {ELIGIBILITY_LABEL}. {DATES.cohortState}, so
              applications for this cohort are closed. {DATES.nextCycle}.
            </p>
            <p className="mt-5 max-w-2xl text-[15px] text-muted leading-relaxed">
              The Fellowship is a separate programme from Atlas research groups.
              Starting a research group is open now. A student may do both.{" "}
              <Link
                to="/research-groups"
                className="text-accent underline underline-offset-4 hover:text-navy-hi transition-colors"
              >
                Browse research groups
              </Link>
              .
            </p>
        </div>
      </section>

      <Outcomes />

      <section id="waitlist" className="border-t border-line">
        <div className="mx-auto max-w-2xl px-6 py-16 md:py-20">
            <p className="meta-label text-muted">Next cohort</p>
            <h2 className="mt-4 font-display text-3xl">
              {DATES.waitlist}
            </h2>
            <p className="mt-4 text-[15px] text-muted leading-relaxed">
              {DATES.nextCycle}. Joining the waitlist is not an application and
              does not affect selection — it means you hear when the next cycle
              opens.
            </p>

          {state === "sent" ? (
            <div className="mt-9 rounded-card border border-line bg-surface p-10 text-center">
              <p className="font-display text-3xl">You're on the list.</p>
              <p className="mt-4 text-muted">
                We'll write when the next cohort opens.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="mt-9 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Your name" required>
                  <input
                    name="name"
                    required
                    className={inputCls}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email" required>
                  <input
                    name="email"
                    type="email"
                    required
                    className={inputCls}
                    autoComplete="email"
                  />
                </Field>
                <Field label="School or institution">
                  <input name="school" className={inputCls} />
                </Field>
                <Field label="City + country">
                  <input
                    name="location"
                    className={inputCls}
                    placeholder="e.g. Kathmandu, Nepal"
                  />
                </Field>
              </div>
              <Field
                label="What would you want to research?"
                hint="A sentence is plenty. Any field."
              >
                <textarea
                  name="interest"
                  rows={3}
                  className={inputCls + " resize-y"}
                />
              </Field>
              <label className="flex items-start gap-3 text-sm text-muted">
                <input
                  type="checkbox"
                  name="privacy"
                  required
                  className="mt-1 accent-accent"
                />
                <span>I agree to the privacy policy.</span>
              </label>
              <button
                type="submit"
                disabled={state === "sending"}
                className="rounded-control bg-navy text-white pl-7 pr-6 py-3.5 text-[15px] inline-flex items-center gap-2.5 hover:bg-navy-hi transition-all hover:gap-3.5 disabled:opacity-60"
              >
                {state === "sending" ? "Joining…" : "Join the waitlist"}
                <span aria-hidden>→</span>
              </button>
              {state === "error" && (
                <p className="text-sm text-alert">
                  Something failed — please retry, or email us directly.
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
