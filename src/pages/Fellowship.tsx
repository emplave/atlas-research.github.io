import { useState } from "react";

// Same tested endpoint apply.html posts to. no-cors mirrors apply.html so this
// keeps working with zero maintenance. To reopen applications later, restore the
// redirect to /apply.html (see git history).
const ENDPOINT =
  "https://script.google.com/macros/s/AKfycbzoGRSNMoJhYjcbHbqG2NEdIqCZ9DJ5vGVaMBvnXHwnRnoQInQ6RsuwWirb5nb0iwTqlA/exec";

export function Fellowship() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function submit() {
    if (!name.trim() || !email.trim() || !email.includes("@")) {
      setState("error");
      return;
    }
    setState("sending");
    try {
      await fetch(ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          referral: "Future interest (applications closed)",
        }),
      });
      setState("sent");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="bg-cream-100 min-h-[70vh]">
      <div className="mx-auto max-w-xl px-6 py-24 md:py-32">
        <p className="meta-label text-navy-500">Atlas Fellowship</p>
        <h1 className="mt-4 font-serif text-4xl md:text-5xl leading-tight text-navy-900">
          Applications are closed.
        </h1>
        <p className="mt-5 text-navy-600 leading-relaxed">
          This cohort is full. Atlas has more coming — new ways to do real
          research on education access. Leave your email and we'll reach out
          when the next opportunity opens.
        </p>

        {state === "sent" ? (
          <div className="mt-8 rounded-xl border border-hairline bg-cream-50 p-6">
            <p className="font-serif text-xl text-navy-900">
              You're on the list.
            </p>
            <p className="mt-2 text-navy-600 text-[15px]">
              We'll email{" "}
              <span className="text-navy-800">{email.trim()}</span> when the
              next opportunity opens. Nothing else.
            </p>
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="meta-label text-navy-500">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="rounded-lg border border-hairline bg-cream-50 px-4 py-3 text-navy-900 outline-none focus:border-navy-400 transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="meta-label text-navy-500">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="rounded-lg border border-hairline bg-cream-50 px-4 py-3 text-navy-900 outline-none focus:border-navy-400 transition-colors"
              />
            </div>
            {state === "error" && (
              <p className="text-sm text-[#8a2b22]">
                Please enter your name and a valid email, or write to{" "}
                <a className="underline" href="mailto:info@atlas-research.org">
                  info@atlas-research.org
                </a>
                .
              </p>
            )}
            <button
              onClick={submit}
              disabled={state === "sending"}
              className="self-start rounded-full bg-navy-800 text-cream-100 pl-6 pr-5 py-3 text-[15px] inline-flex items-center gap-2.5 hover:bg-navy-700 transition-all hover:gap-3.5 disabled:opacity-60"
            >
              {state === "sending" ? "Adding you…" : "Keep me posted"}
              <span aria-hidden className="text-gold-300">
                →
              </span>
            </button>
          </div>
        )}

        <p className="mt-10">
          <a
            className="meta-label text-navy-500 hover:text-navy-800 transition-colors"
            href="/"
          >
            ← Back to Atlas
          </a>
        </p>
      </div>
    </section>
  );
}
