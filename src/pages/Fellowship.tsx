import { useEffect } from "react";

/**
 * The application lives at /apply.html — the tested 16-column pipeline with
 * minor consent and referral tracking. This route forwards there so every
 * "Apply" link resolves to the real form.
 */
export function Fellowship() {
  useEffect(() => {
    window.location.replace("/apply.html");
  }, []);
  return (
    <div className="bg-cream-100 min-h-[60vh] grid place-items-center px-6">
      <p className="text-navy-600 text-center">
        Taking you to the application…{" "}
        <a
          className="underline underline-offset-4 text-navy-800"
          href="/apply.html"
        >
          Continue
        </a>
      </p>
    </div>
  );
}
