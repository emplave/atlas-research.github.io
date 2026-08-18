import type { Config } from "tailwindcss";

/**
 * Atlas design tokens — PURE MONOCHROME.
 *
 * There is NO ACCENT COLOR. Not for links, not for buttons, not for status.
 * The only non-grey token is `alert`, and it is for form errors only.
 *
 * Links are ink with a 1px underline that thickens on hover. Never colour a
 * link. Primary buttons are ink with paper text. Full-bleed bands are ink.
 *
 * If a design problem seems to need a colour, it needs size, weight, spacing,
 * or a rule instead.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /** page background */
        paper: "#FFFFFF",
        /** cards, raised surfaces, alternating sections */
        surface: "#F5F5F6",
        /** hairline borders */
        line: "#E4E4E6",
        /** primary text, primary buttons, dark bands */
        ink: "#0E0E10",
        /** primary button hover only */
        "ink-hover": "#26262A",
        /** secondary text */
        muted: "#57575C",
        /** eyebrows, meta labels, tertiary text */
        faint: "#8A8A92",
        /** form errors ONLY. Never decoration, never a status. */
        alert: "#B3402F",
      },
      fontFamily: {
        /**
         * Headings. Instrument Serif has ONE weight (400) — there is no bold.
         * Where the old system leaned on a heavier heading, compensate with
         * size and spacing. Never reach for font-weight here.
         */
        display: ['"Instrument Serif"', "Georgia", "serif"],
        serif: ['"Instrument Serif"', "Georgia", "serif"],
        sans: ["Archivo", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        caps: "0.18em",
        meta: "0.14em",
        lockup: "0.22em",
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
