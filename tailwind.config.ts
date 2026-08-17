import type { Config } from "tailwindcss";

/**
 * Atlas design tokens — semantic names only, no numeric ramps.
 *
 * A token is named for the job it does, not for its hue. There is no
 * cream-200 / navy-700 to pick from, which is the point: the site has two
 * modes and each surface in them has exactly one correct color.
 *
 *   DARK CHROME (default)   ground / panel / line / text / muted
 *   LIGHT READING           paper / ink
 *   ACCENT (both modes)     brass / brass-hi
 *
 * BRASS IS ACCENT-ONLY, BY RULE. Links and buttons. Never a background wash,
 * never body text. If a block of prose is brass, it is wrong.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /** dark page background */
        ground: "#17181A",
        /** cards, raised surfaces */
        panel: "#1F2022",
        /** hairline borders */
        line: "#34342F",
        /** primary text on dark */
        text: "#E9E4DA",
        /** secondary text on dark */
        muted: "#98948B",
        /**
         * LINKS ONLY. Not buttons, not eyebrows, not meta labels, not the
         * logo, not rules. The site reads as monochrome editorial with blue
         * links; an accent-colored button breaks that immediately.
         *
         * The one non-link exception is the Recruiting status chip, which is
         * a link-adjacent affordance — every other status is muted.
         */
        accent: "#6B8CAE",
        /** link hover */
        "accent-hi": "#83A3C4",
        /**
         * Primary button hover only. Primary buttons are cream (`text`) with
         * ground-colored labels and lift to pure white on hover.
         */
        "text-hi": "#FFFFFF",
        /** light reading background */
        paper: "#F2EBDD",
        /** light reading text */
        ink: "#241B10",
        /**
         * Form errors and destructive states ONLY. A muted brick red that
         * sits with the palette. Never decoration, never an accent, never a
         * status chip for anything that is merely inactive.
         */
        alert: "#C4553D",
        /**
         * The white plate behind third-party partner logos. Legibility on a
         * dark ground wins here — partner marks are supplied light-background.
         * This is the ONLY white in the system and it has exactly one use.
         */
        "logo-plate": "#FFFFFF",
      },
      fontFamily: {
        /**
         * Headings. Weights 400 and 500 ONLY — never 600+. Headings are
         * deliberately light and thin; a bold Spectral heading is off-brand.
         */
        display: ["Spectral", "Georgia", "serif"],
        /**
         * Alias of `display`, kept so the ~35 existing `font-serif` call
         * sites keep rendering correctly without a mid-flight sweep.
         * Prefer `font-display` in new code.
         */
        serif: ["Spectral", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        // font-mono removed — no monospace anywhere in the system.
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
