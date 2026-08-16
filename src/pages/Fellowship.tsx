import { useEffect } from "react";
import { WAITLIST_ENDPOINT, WAITLIST_FORM_PATH } from "@/lib/dates";

/**
 * The application lives at WAITLIST_FORM_PATH (/apply.html) — the tested
 * 16-column pipeline with minor consent and referral tracking. This route
 * forwards there so every "Apply" link resolves to the real form.
 *
 * That page posts to WAITLIST_ENDPOINT (see src/lib/dates.ts). When this
 * route is rebuilt as a native React form, it must post to that same
 * constant so submissions keep landing in the live sheet.
 */
export function Fellowship() {
  useEffect(() => {
    // Referenced so the live backend stays statically linked to this route
    // and cannot be tree-shaken or forgotten during the rebuild.
    void WAITLIST_ENDPOINT;
    window.location.replace(WAITLIST_FORM_PATH);
  }, []);
  return (
    <div className="bg-ground min-h-[60vh] grid place-items-center px-6">
      <p className="text-muted text-center">
        Taking you to the application…{" "}
        <a
          className="underline underline-offset-4 text-text"
          href={WAITLIST_FORM_PATH}
        >
          Continue
        </a>
      </p>
    </div>
  );
}
