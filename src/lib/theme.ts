/**
 * Route display modes — which routes are dark chrome and which are light reading.
 *
 * The site has exactly two modes and they stay cleanly separated. There is no
 * muddy middle where both bleed together:
 *
 *   "dark"  — CHROME. Marketing, directory, application, and navigation
 *             surfaces. ground / panel / line / text / muted.
 *   "light" — READING. Long-form prose meant to be read at length: chapter
 *             briefs and any long-text page added later. paper / ink.
 *
 * A route belongs to one mode for its entire height. Never mix mode tokens
 * inside a single route — a dark card on a paper page, or vice versa, is the
 * muddy middle this map exists to prevent.
 */
export type Mode = "dark" | "light";

/**
 * Light reading routes, matched by path prefix. Everything not listed here is
 * dark chrome, so a new marketing or directory route needs no edit.
 *
 * /research-groups is the DIRECTORY and is dark chrome. /research-groups/:slug
 * is an individual group brief — long-form reading — and is light. The
 * prefixes below are deliberately the deeper paths so the directory and the
 * journal landing page are unaffected.
 */
const LIGHT_READING_PREFIXES: readonly string[] = [
  "/research-groups/", // individual group briefs, not the directory
  "/journal/", // individual articles, not the journal landing page
];

/** Exact-match light reading routes. */
const LIGHT_READING_EXACT: readonly string[] = [];

/** The mode a given pathname renders in. Defaults to dark chrome. */
export function modeForPath(pathname: string): Mode {
  const path = normalize(pathname);
  if (LIGHT_READING_EXACT.includes(path)) return "light";
  if (LIGHT_READING_PREFIXES.some((p) => path.startsWith(p))) return "light";
  return "dark";
}

/** The class the shell puts on <html>. Defined in src/index.css. */
export function modeClass(mode: Mode): string {
  return mode === "light" ? "mode-light" : "mode-dark";
}

/** Strip a trailing slash so "/research-groups/" and "/research-groups" agree. */
function normalize(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

/**
 * Dark chrome routes, listed for documentation and for the route table in
 * App.tsx to stay honest: home, chapters directory, apply, fellowship,
 * journal, partners, and the 404.
 */
export const DARK_CHROME_ROUTES: readonly string[] = [
  "/",
  "/research-groups",
  "/events",
  "/fellowship",
  "/journal",
  "/partners",
];
