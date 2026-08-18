import { useState } from "react";
import { Link } from "react-router-dom";
import { Outcomes } from "@/components/Outcomes";
import { Field, inputCls, SubmitState } from "@/components/forms";
import { CONTACT_EMAIL, DATES, WAITLIST_ENDPOINT } from "@/lib/dates";
import { ELIGIBILITY_LABEL, FELLOWSHIP_WEEKS } from "@/lib/stats";

/** Text fields that must be non-blank, with the message shown when they are not. */
const REQUIRED_TEXT_FIELDS = {
  name: "Enter your name.",
  email: "Enter your email address.",
  school: "Enter your school or institution.",
  city: "Enter your city.",
  /*
   * Country is its own required field, not half of a combined "City, Country"
   * string. It is the column that feeds src/data/reach.ts, and a free-text
   * "Lagos, Nigeria" cannot be split back apart reliably — "Washington, DC,
   * USA" and "Cork, Ireland" do not parse the same way.
   */
  country: "Enter your country.",
} as const;

/**
 * Consent is required and is validated in JS like everything else.
 *
 * The browser's `required` attribute cannot be relied on here: the form sets
 * `noValidate` so that all messages are ours, which makes native constraint
 * validation inert. The attribute stays on the input for assistive tech, but
 * the check below is what actually blocks submission.
 */
const CONSENT_ERROR = "Agree to the privacy policy to continue.";

type TextFieldName = keyof typeof REQUIRED_TEXT_FIELDS;
type FieldName = TextFieldName | "privacy";
export type WaitlistErrors = Partial<Record<FieldName, string>>;

/**
 * The exact keys the Apps Script reads, in the order it appends them.
 *
 * THE SCRIPT WRITES POSITIONALLY and must not change. It appends:
 *
 *   new Date(), name, email, school, city, country, grade, timezone, prompt,
 *   datasource, completion, research, research_desc, consent, referral,
 *   referral_other
 *
 * The script supplies the timestamp itself, so the client sends the fifteen
 * field keys only. EVERY key is always sent as a string — never undefined.
 * `undefined` does not survive JSON.stringify (the key is dropped entirely),
 * which writes a blank the script did not expect and is the exact failure this
 * payload exists to prevent.
 *
 * Seven of the fifteen are fields this form does not collect. They are sent as
 * empty strings deliberately, so the columns stay aligned with the 85 existing
 * rows rather than shifting.
 */
export type WaitlistPayload = {
  name: string;
  email: string;
  school: string;
  city: string;
  country: string;
  grade: string;
  timezone: string;
  prompt: string;
  datasource: string;
  completion: string;
  research: string;
  research_desc: string;
  consent: string;
  referral: string;
  referral_other: string;
};

/**
 * What goes in the `referral` column for a waitlist signup.
 *
 * Deliberately NOT "Future interest (applications closed)", which is what the
 * old page sent. The current cohort is running, not closed, so that string is
 * inaccurate on every new row.
 */
export const WAITLIST_REFERRAL = "Waitlist for next cohort";

/**
 * Build the POST body from the submitted form.
 *
 * Pure and exported so the payload can be asserted directly — the POST is
 * no-cors and its response is unreadable, so this function is the only place
 * the body can actually be verified.
 *
 * Call only after validateWaitlist returns clean. `consent` is hardcoded to
 * "yes" because submission is blocked when the box is unchecked, so a posted
 * row can only ever represent granted consent.
 */
export function buildWaitlistPayload(fd: FormData): WaitlistPayload {
  const text = (key: string) => String(fd.get(key) ?? "").trim();
  return {
    name: text("name"),
    email: text("email"),
    school: text("school"),
    city: text("city"),
    country: text("country"),
    grade: "",
    timezone: "",
    prompt: "",
    datasource: "",
    completion: "",
    research: "",
    research_desc: text("research_desc"),
    consent: "yes",
    referral: WAITLIST_REFERRAL,
    referral_other: "",
  };
}

/** The live domain. Everything else — localhost, Vercel previews — is not it. */
const PRODUCTION_HOSTS = ["atlas-research.org", "www.atlas-research.org"];

/**
 * Whether to log the outgoing POST body.
 *
 * NOT gated on import.meta.env.DEV alone. A Vercel preview is a PRODUCTION
 * build, so DEV is false there and the log would be missing from precisely the
 * environment it exists to be read in.
 *
 * Gated on hostname instead: logs on localhost and on any preview URL, silent
 * on the live domain. The body contains what the visitor just typed, so it must
 * never appear in a real user's console.
 *
 * The host rule is split into isLoggableHost so it can be asserted on its own —
 * testing shouldLogWaitlistPayload directly is useless, because a test runner
 * runs in dev and short-circuits on the first line.
 */
export function isLoggableHost(hostname: string): boolean {
  return hostname !== "" && !PRODUCTION_HOSTS.includes(hostname);
}

export function shouldLogWaitlistPayload(): boolean {
  if (import.meta.env.DEV) return true;
  if (typeof window === "undefined") return false;
  return isLoggableHost(window.location.hostname);
}

/**
 * The waitlist validation rule, as a pure function of the submitted FormData.
 *
 * Exported and kept free of React so the rule can be tested directly rather
 * than only through a rendered form. `onSubmit` does nothing but call this and
 * bail out when it returns anything.
 */
export function validateWaitlist(fd: FormData): WaitlistErrors {
  const found: WaitlistErrors = {};

  // Every required text field must be non-blank. Whitespace does not count.
  for (const key of Object.keys(REQUIRED_TEXT_FIELDS) as TextFieldName[]) {
    const value = String(fd.get(key) ?? "").trim();
    if (!value) found[key] = REQUIRED_TEXT_FIELDS[key];
  }

  /*
   * Consent. An UNCHECKED checkbox contributes no entry to FormData at all —
   * it is absent rather than empty or "off" — so absence is the signal. A
   * checked box yields "on".
   */
  if (!fd.get("privacy")) found.privacy = CONSENT_ERROR;

  return found;
}

/**
 * The Fellowship.
 *
 * APPLICATIONS ARE CLOSED for the current cohort. The cohort is underway and
 * the only action on this page is joining the waitlist for the next cycle.
 *
 * There is deliberately NO path to /apply.html from this page. The waitlist
 * form posts directly to WAITLIST_ENDPOINT — the same live Apps Script backend
 * /apply.html used — so submissions land in the same sheet, using the same
 * no-cors pattern (see the comment on the fetch below for why).
 *
 * Validation runs in JS rather than relying on the browser's `required`
 * attribute alone, so the messages are ours and are announced at the field.
 * The controls still carry `required` for assistive tech.
 */
export function Fellowship() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errors, setErrors] = useState<WaitlistErrors>({});

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const found = validateWaitlist(fd);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setState("idle");
      return;
    }

    const payload = buildWaitlistPayload(fd);

    if (shouldLogWaitlistPayload()) {
      // The POST is no-cors, so this is the only way to see what actually left
      // the browser and confirm every column is populated. Silent on the live
      // domain — see shouldLogWaitlistPayload.
      console.log("[waitlist] POST body\n" + JSON.stringify(payload, null, 2));
    }

    setErrors({});
    setState("sending");
    try {
      /*
       * THE RESPONSE IS OPAQUE BY NECESSITY. Do not "improve" this by reading
       * res.ok or removing mode: "no-cors".
       *
       * The Apps Script /exec endpoint answers a POST with a 302 to
       * script.googleusercontent.com. That redirect target sends NO
       * Access-Control-Allow-Origin header, so a normal CORS-mode fetch follows
       * the redirect, fails the CORS check, and rejects — even though the POST
       * itself was already processed and the row was written. The visitor would
       * be told it failed when it had not.
       *
       * mode: "no-cors" sends the request opaquely, which is what public/
       * apply.html has always done and what is known to work. The cost is that
       * the response is unreadable: status is 0 and res.ok is always false.
       *
       * So "sent" below is OPTIMISTIC. It means "the request left the browser",
       * not "the server accepted it". A genuine server-side failure is not
       * detectable here, and pretending otherwise would need a CORS-enabled
       * endpoint.
       */
      await fetch(WAITLIST_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setState("sent");
    } catch {
      // Only a network-level failure reaches here; an HTTP error cannot.
      setState("error");
    }
  };

  return (
    <div className="bg-paper">
      <section className="border-b border-line">
        <div className="mx-auto max-w-4xl px-6 pt-16 md:pt-20 pb-12">
          <p className="meta-label">
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
              className="link"
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
          <p className="meta-label">Guest sessions</p>
          <p className="mt-3 max-w-2xl type-body text-ink">
            Fellows learn from researchers at the University of Melbourne, USC,
            and Stanford.
          </p>
        </div>
      </section>

      <section id="waitlist" className="bg-surface border-t border-line">
        <div className="mx-auto max-w-2xl px-6 py-12 md:py-16">
          <p className="meta-label">Next cohort</p>
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
                <Field label="City" required error={errors.city}>
                  <input
                    name="city"
                    required
                    aria-invalid={Boolean(errors.city)}
                    className={inputCls}
                    autoComplete="address-level2"
                    placeholder="e.g. Kathmandu"
                  />
                </Field>
                {/*
                  Country is separate on purpose — it is the column that feeds
                  src/data/reach.ts. A combined "City, Country" string cannot be
                  split back apart reliably.
                */}
                <Field label="Country" required error={errors.country}>
                  <input
                    name="country"
                    required
                    aria-invalid={Boolean(errors.country)}
                    className={inputCls}
                    autoComplete="country-name"
                    placeholder="e.g. Nepal"
                  />
                </Field>
              </div>

              <Field
                label="What would you want to research?"
                hint="A sentence is plenty. Any field."
              >
                <textarea
                  name="research_desc"
                  rows={3}
                  className={inputCls + " resize-y"}
                />
              </Field>

              {/*
                One consent control, required. Same error treatment as the text
                fields: alert-coloured message under the control, aria-invalid
                on the input, and counted in the summary below the button.
              */}
              <div>
                <label className="flex items-start gap-3 text-sm text-muted">
                  <input
                    type="checkbox"
                    name="privacy"
                    required
                    aria-invalid={Boolean(errors.privacy)}
                    className="mt-1 accent-ink"
                  />
                  <span>
                    I agree to the{" "}
                    <Link to="/privacy" className="link">
                      privacy policy
                    </Link>
                    .
                  </span>
                </label>
                {errors.privacy && (
                  <p role="alert" className="mt-1.5 text-xs text-alert">
                    {errors.privacy}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={state === "sending"}
                className="rounded-control bg-ink text-paper px-6 py-3 text-[15px] hover:bg-ink-hover transition-colors disabled:opacity-60"
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
