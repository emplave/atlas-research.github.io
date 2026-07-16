import type { Config } from "tailwindcss";

/**
 * Atlas design tokens — derived from the Antigravity identity extraction
 * (research/ANTIGRAVITY-IDENTITY-EXTRACTION.md): same grammar, different soul.
 * Ink = Atlas navy (not black). Surface = warm cream (not white).
 * One accent = signal gold, used with extreme restraint.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // warm cream ramp (surfaces)
        cream: {
          50: "#FBFAF5",
          100: "#F5F2E9",
          200: "#EEEADD",
          300: "#E9E5DA",
          400: "#DDD7C4",
        },
        // navy ramp (ink + dark surfaces)
        navy: {
          300: "#8B9BB4",
          400: "#5D7089",
          500: "#3C5068",
          600: "#2C405A",
          700: "#22384F",
          800: "#1C2E45",
          900: "#16253A",
          950: "#101B2C",
        },
        gold: {
          300: "#E3C87F",
          400: "#D4B562",
          500: "#C9A54E",
          600: "#A98A3C",
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', "Didot", "Bodoni MT", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "Consolas", "monospace"],
      },
      letterSpacing: {
        caps: "0.18em",
      },
      borderColor: {
        hairline: "rgba(28, 46, 69, 0.12)",
        "hairline-soft": "rgba(28, 46, 69, 0.06)",
        "hairline-inverse": "rgba(233, 229, 218, 0.14)",
        "hairline-inverse-soft": "rgba(233, 229, 218, 0.07)",
      },
      animation: {
        "fade-up": "fadeUp 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "pulse-node": "pulseNode 2.6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseNode: {
          "0%, 100%": { opacity: "0.5", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.35)" },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
