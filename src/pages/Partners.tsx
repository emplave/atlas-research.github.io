import { useState } from "react";
import {
  Field,
  inputCls,
  isFormEndpointConfigured,
  submitApplication,
  SubmitState,
} from "@/components/forms";
import { CONTACT_EMAIL } from "@/lib/dates";

/**
 * Partners — partnership enquiries.
 *
 * NO MAILTO. When FORM_ENDPOINT is not configured the form renders visibly
 * DISABLED with the contact address shown as plain text, rather than handing
 * the reader a mailto: link that silently fails without a desktop mail client.
 * A disabled control that explains itself beats a dead end.
 */
export function Partners() {
  const [state, setState] = useState<SubmitState>("idle");
  const enabled = isFormEndpointConfigured();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!enabled) return;
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    fd.forEach((v, k) => (data[k] = String(v)));
    void submitApplication("Partnership inquiry", data, setState);
  };

  return (
    <div className="bg-paper">
      <section className="border-b border-line">
        <div className="mx-auto max-w-3xl px-6 pt-16 md:pt-24 pb-12">
          <p className="meta-label text-muted">Partners</p>
          <h1 className="mt-4 font-display text-4xl md:text-5xl leading-[1.06]">
            Work with Atlas.
          </h1>
          <p className="mt-6 text-lg text-muted leading-relaxed">
            Atlas runs student research groups in eight fields. We work with
            journals on submission routes, with researchers who run guest
            sessions, and with organisations that mentor student teams.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-6 py-14 md:py-20">
        {state === "sent" ? (
          <div className="rounded-card border border-line bg-surface p-10 text-center">
            <h2 className="font-display text-2xl">Message received.</h2>
            <p className="mt-3 text-muted">We reply to every enquiry.</p>
          </div>
        ) : (
          <>
            {!enabled && (
              <div className="mb-8 rounded-card border border-line bg-surface p-6">
                <h2 className="font-display text-lg">
                  This form is not open yet.
                </h2>
                <p className="mt-2.5 text-[15px] text-muted leading-relaxed">
                  Submissions are not being accepted through the site right now.
                  Write to{" "}
                  <span className="text-ink">{CONTACT_EMAIL}</span> and we will
                  reply.
                </p>
              </div>
            )}

            <form
              onSubmit={onSubmit}
              className={enabled ? "space-y-6" : "space-y-6 opacity-60"}
              aria-disabled={!enabled}
            >
              <fieldset disabled={!enabled} className="space-y-6 border-0 p-0">
                <div className="grid md:grid-cols-2 gap-6">
                  <Field label="Your name" required>
                    <input
                      name="name"
                      required
                      className={inputCls}
                      autoComplete="name"
                    />
                  </Field>
                  <Field label="Your email" required>
                    <input
                      name="email"
                      type="email"
                      required
                      className={inputCls}
                      autoComplete="email"
                    />
                  </Field>
                </div>

                <Field
                  label="Title and organisation"
                  hint="e.g. Professor of Chemistry, or a journal or NGO name"
                >
                  <input
                    name="title_group"
                    className={inputCls}
                    placeholder="Optional"
                  />
                </Field>

                <Field label="What would you like to explore together?">
                  <textarea
                    name="message"
                    rows={5}
                    className={inputCls + " resize-y"}
                    placeholder="Mentorship, a submission route, a guest session"
                  />
                </Field>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  {enabled ? (
                    <button
                      type="submit"
                      disabled={state === "sending"}
                      className="rounded-control bg-navy text-white px-6 py-3 text-[15px] hover:bg-navy-hi transition-colors disabled:opacity-60"
                    >
                      {state === "sending" ? "Sending" : "Send to Atlas"}
                    </button>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="rounded-control border border-line px-6 py-3 text-[15px] text-muted cursor-not-allowed"
                    >
                      Form not open
                    </span>
                  )}
                  {state === "error" && (
                    <p className="text-sm text-alert">
                      Something failed. Please retry.
                    </p>
                  )}
                </div>
              </fieldset>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
