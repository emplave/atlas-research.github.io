import type { Config } from "tailwindcss";

/**
 * Atlas design tokens — LIGHT MODE, single polarity.
 *
 * The site is light everywhere. There is no dark mode, no mode class, and no
 * per-route polarity: a text-heavy credibility site reads better and is
 * trusted more on positive polarity, and every journal and university site
 * this one sits beside is light.
 *
 * NAVY IS THE BRAND COLOR. It does three jobs: headings, primary buttons, and
 * a full-bleed section band. That band appears AT MOST TWICE PER PAGE — the
 * proof band and the closing CTA. Everywhere else navy is type and buttons
 * only; a third navy band turns a light page into a striped one.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /** default page background */
        paper: "#FAFAF9",
        /** cards and raised surfaces */
        surface: "#FFFFFF",
        /** primary text */
        ink: "#16191D",
        /** secondary text */
        muted: "#5A6169",
        /** hairline borders */
        line: "#E2E0DA",
        /** brand: headings, dark section bands, primary buttons */
        navy: "#1C3F5E",
        /** navy hover */
        "navy-hi": "#2A5A82",
        /** links — navy, same value, named for the job it does */
        accent: "#1C3F5E",
        /** errors only. Never decoration, never a status. */
        alert: "#B3402F",
      },
      fontFamily: {
        /**
         * Headings. Weights 400 and 500 ONLY — never 600+. A bold Spectral
         * heading is off-brand.
         */
        display: ["Spectral", "Georgia", "serif"],
        /** Alias kept so any stray `font-serif` still resolves correctly. */
        serif: ["Spectral", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        caps: "0.18em",
        meta: "0.14em",
      },
      borderRadius: {
        /** cards and panels */
        card: "10px",
        /** buttons, inputs, selects */
        control: "6px",
      },
    },
  },
  plugins: [],
} satisfies Config;
