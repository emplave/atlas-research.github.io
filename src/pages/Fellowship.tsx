import { useState } from "react";
import { Link } from "react-router-dom";
import { Outcomes } from "@/components/Outcomes";
import { Field, inputCls, SubmitState } from "@/components/forms";
import { CONTACT_EMAIL, DATES, WAITLIST_ENDPOINT } from "@/lib/dates";
import { ELIGIBILITY_LABEL, FELLOWSHIP_WEEKS } from "@/lib/stats";

/** Waitlist fields that must be filled, with the message shown when they are not. */
const REQUIRED_FIELDS = {
  name: "Enter your name.",
  email: "Enter your email address.",
  school: "Enter your school or institution.",
  location: "Enter your city and country.",
} as const;

type FieldName = keyof typeof REQUIRED_FIELDS;
type Errors = Partial<Record<FieldName, string>>;

/**
 * The Fellowship.
 *
 * APPLICATIONS ARE CLOSED for the current cohort. The cohort is underway and
 * the only action on this page is joining the waitlist for the next cycle.
 *
 * There is deliberately NO path to /apply.html from this page. The waitlist
 * form posts directly to WAITLIST_ENDPOINT — the same live Apps Script backend
 * /apply.html used — so submissions land in the same sheet.
 *
 * Validation runs in JS rather than relying on the browser's `required`
 * attribute alone, so the messages are ours and are announced at the field.
 * The controls still carry `required` for assistive tech.
 */
export function Fellowship() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errors, setErrors] = useState<Errors>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const data: Record<string, string> = {};
    fd.forEach((v, k) => (data[k] = String(v).trim()));

    // Every required field must be non-blank. Whitespace does not count.
    const found: Errors = {};
    for (const key of Object.keys(REQUIRED_FIELDS) as FieldName[]) {
      if (!data[key]) found[key] = REQUIRED_FIELDS[key];
    }
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setState("idle");
      return;
    }

    setErrors({});
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
        <div className="mx-auto max-w-4xl px-6 pt-16 md:pt-20 pb-12">
          <p className="meta-label text-muted">
            The Fellowship · A separate programme · Applications closed
          </p>
          <h1 className="type-hero font-display mt-4">
            A selective {FELLOWSHIP_WEEKS}-week summer cohort.
          </h1>
          <p className="mt-6 max-w-2xl type-body text-muted">
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

      {/*
        The named-institutions line belongs here and nowhere else: this is the
        page where guest sessions are discussed. Exact approved phrasing — do
        not append "and more".
      */}
      <section className="bg-paper border-t border-line">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="meta-label text-muted">Guest sessions</p>
          <p className="mt-3 max-w-2xl type-body text-ink">
            Fellows learn from researchers at the University of Melbourne, USC,
            and Stanford.
          </p>
        </div>
      </section>

      <section id="waitlist" className="bg-surface border-t border-line">
        <div className="mx-auto max-w-2xl px-6 py-12 md:py-16">
          <p className="meta-label text-muted">Next cohort</p>
          <h2 className="type-section font-display mt-4">{DATES.waitlist}</h2>
          <p className="mt-4 text-[15px] text-muted leading-relaxed">
            {DATES.nextCycle}. Joining the waitlist is not an application and
            does not affect selection. It means you hear when the next cycle
            opens.
          </p>

          {state === "sent" ? (
            <div className="mt-9 rounded-card border border-line bg-paper p-10 text-center">
              <h3 className="font-display text-2xl">You're on the list.</h3>
              <p className="mt-3 text-muted">
                We'll write when the next cohort opens.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="mt-9 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Field label="Your name" required error={errors.name}>
                  <input
                    name="name"
                    required
                    aria-invalid={Boolean(errors.name)}
                    className={inputCls}
                    autoComplete="name"
                  />
                </Field>
                <Field label="Email" required error={errors.email}>
                  <input
                    name="email"
                    type="email"
                    required
                    aria-invalid={Boolean(errors.email)}
                    className={inputCls}
                    autoComplete="email"
                  />
                </Field>
                <Field
                  label="School or institution"
                  required
                  error={errors.school}
                >
                  <input
                    name="school"
                    required
                    aria-invalid={Boolean(errors.school)}
                    className={inputCls}
                    autoComplete="organization"
                  />
                </Field>
                <Field label="City + country" required error={errors.location}>
                  <input
                    name="location"
                    required
                    aria-invalid={Boolean(errors.location)}
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
                  className="mt-1 accent-navy"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    to="/privacy"
                    className="text-accent underline underline-offset-4 hover:text-navy-hi transition-colors"
                  >
                    privacy policy
                  </Link>
                  .
                </span>
              </label>

              <button
                type="submit"
                disabled={state === "sending"}
                className="rounded-control bg-navy text-white px-6 py-3 text-[15px] hover:bg-navy-hi transition-colors disabled:opacity-60"
              >
                {state === "sending" ? "Joining" : "Join the waitlist"}
              </button>

              {Object.keys(errors).length > 0 && (
                <p role="alert" className="text-sm text-alert">
                  Fill in the required fields above and submit again.
                </p>
              )}
              {state === "error" && (
                <p role="alert" className="text-sm text-alert">
                  Something failed. Please retry, or email {CONTACT_EMAIL}.
                </p>
              )}
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
