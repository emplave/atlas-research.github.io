import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Field,
  inputCls,
  isFormEndpointConfigured,
  SubmitState,
} from "@/components/forms";
import { FORM_ENDPOINT, PARTNERS_EMAIL } from "@/lib/dates";
import { logPayload } from "@/lib/payloadLog";

/** Fields that must be non-blank, with the message shown when they are not. */
const REQUIRED_TEXT_FIELDS = {
  name: "Enter your name.",
  email: "Enter your email address.",
  /*
   * Required, not optional. An enquiry with no affiliation cannot be evaluated —
   * "who is this and what are they part of" is the first thing a reviewer needs.
   */
  titleorg: "Enter your title and organisation.",
} as const;

/**
 * Consent is required and is validated in JS like everything else.
 *
 * The browser's `required` attribute cannot be relied on: the form sets
 * `noValidate` so all messages are ours, which makes native constraint
 * validation inert. The attribute stays on the input for assistive tech, but
 * the check in validatePartnership is what actually blocks submission.
 */
const CONSENT_ERROR = "Agree to the privacy policy to continue.";

type TextFieldName = keyof typeof REQUIRED_TEXT_FIELDS;
type FieldName = TextFieldName | "privacy";
export type PartnershipErrors = Partial<Record<FieldName, string>>;

/**
 * The exact keys the partnership Apps Script reads, in the order it appends.
 *
 * THE SCRIPT WRITES POSITIONALLY and must not change. It appends:
 *
 *   new Date(), name, email, titleorg, interest, consent, 'New', '', ''
 *
 * The script supplies the timestamp and the last three columns — Status,
 * Reviewer, Notes — itself. THE CLIENT MUST NOT SEND THOSE THREE.
 *
 * Every key is always a string, never undefined: `JSON.stringify` DROPS an
 * undefined-valued key entirely rather than sending a blank.
 */
export type PartnershipPayload = {
  name: string;
  email: string;
  titleorg: string;
  interest: string;
  consent: string;
};

/**
 * Build the POST body from the submitted form.
 *
 * Pure and exported so the payload can be asserted directly — the POST is
 * no-cors and its response unreadable, so this is the only place the body can
 * actually be verified.
 *
 * Call only after validatePartnership returns clean. `consent` is hardcoded to
 * "yes" because submission is blocked when the box is unchecked, so a posted row
 * can only ever represent granted consent.
 */
export function buildPartnershipPayload(fd: FormData): PartnershipPayload {
  const text = (key: string) => String(fd.get(key) ?? "").trim();
  return {
    name: text("name"),
    email: text("email"),
    titleorg: text("titleorg"),
    interest: text("interest"),
    consent: "yes",
  };
}

/**
 * The partnership validation rule, as a pure function of the submitted data.
 *
 * Exported and free of React so the rule can be tested without a DOM, the same
 * way validateWaitlist is. `onSubmit` does nothing but call this and bail out
 * when it returns anything.
 */
export function validatePartnership(fd: FormData): PartnershipErrors {
  const found: PartnershipErrors = {};

  for (const key of Object.keys(REQUIRED_TEXT_FIELDS) as TextFieldName[]) {
    const value = String(fd.get(key) ?? "").trim();
    if (!value) found[key] = REQUIRED_TEXT_FIELDS[key];
  }

  /*
   * Consent. An UNCHECKED checkbox contributes no entry to FormData at all — it
   * is absent rather than empty or "off" — so absence is the signal. A checked
   * box yields "on".
   */
  if (!fd.get("privacy")) found.privacy = CONSENT_ERROR;

  return found;
}

/**
 * Partners — partnership enquiries.
 *
 * Posts to FORM_ENDPOINT, a different Apps Script deployment and a different
 * sheet from the fellowship waitlist. Same no-cors pattern, because it is the
 * same infrastructure and it works.
 *
 * NO MAILTO, ever. isFormEndpointConfigured() is retained as the mechanism, so
 * nulling FORM_ENDPOINT restores the disabled state automatically with no other
 * edit.
 */
export function Partners() {
  const [state, setState] = useState<SubmitState>("idle");
  const [errors, setErrors] = useState<PartnershipErrors>({});
  const enabled = isFormEndpointConfigured();

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!enabled) return;

    const fd = new FormData(e.currentTarget);

    const found = validatePartnership(fd);
    if (Object.keys(found).length > 0) {
      setErrors(found);
      setState("idle");
      return;
    }

    const payload = buildPartnershipPayload(fd);

    // The POST is no-cors, so this is the only way to see what actually left the
    // browser. Silent on the live domain — see src/lib/payloadLog.ts.
    logPayload("partnership", payload);

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
       * itself was already processed and the row was written. The sender would be
       * told it failed when it had not.
       *
       * mode: "no-cors" sends the request opaquely, which is what the waitlist
       * and public/apply.html both do and what is known to work. The cost is
       * that the response is unreadable: status is 0 and res.ok always false.
       *
       * So "sent" below is OPTIMISTIC. It means the request left the browser,
       * not that the server accepted it.
       */
      await fetch(FORM_ENDPOINT as string, {
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
        <div className="mx-auto max-w-3xl px-6 pt-16 md:pt-24 pb-12">
          <p className="meta-label">Partners</p>
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
            {/*
              Retained deliberately. Unreachable while FORM_ENDPOINT holds a URL,
              and it is what makes nulling that constant safe — the form disables
              itself rather than posting into a void.
            */}
            {!enabled && (
              <div className="mb-8 rounded-card border border-line bg-surface p-6">
                <h2 className="font-display text-lg">
                  This form is not open yet.
                </h2>
                <p className="mt-2.5 text-[15px] text-muted leading-relaxed">
                  Submissions are not being accepted through the site right now.
                  Write to <span className="text-ink">{PARTNERS_EMAIL}</span> and
                  we will reply.
                </p>
              </div>
            )}

            <form onSubmit={onSubmit} noValidate className="space-y-6">
              <fieldset disabled={!enabled} className="space-y-6 border-0 p-0">
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
                  <Field label="Your email" required error={errors.email}>
                    <input
                      name="email"
                      type="email"
                      required
                      aria-invalid={Boolean(errors.email)}
                      className={inputCls}
                      autoComplete="email"
                    />
                  </Field>
                </div>

                <Field
                  label="Title and organisation"
                  required
                  error={errors.titleorg}
                  hint="e.g. Professor of Chemistry, or a journal or NGO name"
                >
                  <input
                    name="titleorg"
                    required
                    aria-invalid={Boolean(errors.titleorg)}
                    className={inputCls}
                    autoComplete="organization"
                  />
                </Field>

                <Field label="What would you like to explore together?">
                  <textarea
                    name="interest"
                    rows={5}
                    className={inputCls + " resize-y"}
                    placeholder="Mentorship, a submission route, a guest session"
                  />
                </Field>

                {/*
                  One consent control, required. Same treatment as the waitlist:
                  alert-coloured message under the control, aria-invalid on the
                  input, and counted in the summary below the button.
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

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <button
                    type="submit"
                    disabled={state === "sending"}
                    className="rounded-control bg-ink text-paper px-6 py-3 text-[15px] hover:bg-ink-hover transition-colors disabled:opacity-60"
                  >
                    {state === "sending" ? "Sending" : "Send to Atlas"}
                  </button>

                  {Object.keys(errors).length > 0 && (
                    <p role="alert" className="text-sm text-alert">
                      Fill in the required fields above and submit again.
                    </p>
                  )}
                  {state === "error" && (
                    <p role="alert" className="text-sm text-alert">
                      Something failed. Please retry, or email {PARTNERS_EMAIL}.
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
