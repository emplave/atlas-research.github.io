/**
 * Per-route title, description and canonical URL.
 *
 * No dependency. `react-helmet` and friends are not worth adding for eight
 * static strings — a single effect that writes the tags directly does the same
 * job, and the tags in index.html remain the crawler-visible defaults.
 *
 * CANONICAL HOST. Every canonical points at https://atlas-research.org, the
 * apex, because that is what the deployment actually serves. Verified rather
 * than assumed:
 *
 *   GET https://www.atlas-research.org/ → 308 → https://atlas-research.org/
 *   GET https://atlas-research.org/     → 200, server: Vercel
 *
 * So Vercel is configured with the apex as the primary domain and www
 * redirecting to it. Pointing canonicals at www would name a host that
 * immediately 308s, which is the opposite of a canonical.
 *
 * THIS WAS THE OTHER WAY ROUND. Until 18 August 2026 the apex redirected to www
 * and everything here named www. The direction is a Vercel domain setting, not a
 * property of the code, so re-check it with curl rather than trusting this
 * comment if anything looks off.
 *
 * If the primary domain is switched again, change SITE_ORIGIN here and rewrite
 * public/sitemap.xml, public/robots.txt, public/llms.txt and the tags in
 * index.html — those are the places the host is written.
 */
export const SITE_ORIGIN = "https://atlas-research.org";

/** The bare site name. Nothing is appended to it on the home page. */
export const SITE_NAME = "Atlas Research Institute";

/**
 * The site description, used on the home page and as the fallback.
 *
 * Under 155 characters, no em dashes, no adjective pairs, none of the banned
 * words. Research groups first; the fellowship is not mentioned, because it is
 * the secondary programme and its applications are closed.
 */
export const SITE_DESCRIPTION =
  "Atlas runs student research groups in eight fields. Three or more students, one research question, one term. Free, and open worldwide.";

export type RouteSeo = {
  /** Rendered as "<title> | Atlas Research Institute". Omit for the home page. */
  title?: string;
  description: string;
};

/**
 * Route table. Every description is derived from copy already on that page, so
 * none of it asserts anything the site does not already say.
 *
 * Matched longest-prefix-first, so /research-groups/:slug and /journal/:slug
 * inherit their parent's entry rather than falling back to the site default.
 */
export const ROUTE_SEO: Record<string, RouteSeo> = {
  "/": {
    description: SITE_DESCRIPTION,
  },
  "/research-groups": {
    title: "Research Groups",
    description:
      "Every Atlas research group and what it is working on. Groups open to new members are marked Recruiting.",
  },
  "/events": {
    title: "Events",
    description:
      "Webinars, workshops, and guest sessions. Available to research groups, and occasionally the public.",
  },
  "/journal": {
    title: "The Atlas Journal",
    description:
      "Student research published in the open. How review works, what it looks for, and what revision and rejection mean.",
  },
  "/fellowship": {
    title: "Fellowship",
    description:
      "A selective four-week summer cohort, free and remote. Applications for this cohort are closed and the waitlist is open.",
  },
  "/partners": {
    title: "Partners",
    description:
      "Atlas works with journals on submission routes, researchers who run guest sessions, and organisations that mentor student teams.",
  },
  "/get-involved": {
    title: "Get Involved",
    description:
      "Two ways in. Lead a research group in your field, or join the Atlas Student Team. Both open to high school and college students worldwide.",
  },
  "/privacy": {
    title: "Privacy",
    description:
      "What Atlas collects, why, where it is stored, and how to ask for a copy or have it removed.",
  },
};

/** Strip a trailing slash so "/events/" and "/events" resolve alike. */
function normalize(pathname: string): string {
  return pathname.length > 1 && pathname.endsWith("/")
    ? pathname.slice(0, -1)
    : pathname;
}

/** The SEO entry for a path, by longest matching prefix. */
export function seoForPath(pathname: string): RouteSeo {
  const path = normalize(pathname);
  if (ROUTE_SEO[path]) return ROUTE_SEO[path];

  const prefix = Object.keys(ROUTE_SEO)
    .filter((key) => key !== "/" && path.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];

  return prefix ? ROUTE_SEO[prefix] : ROUTE_SEO["/"];
}

/** The full document title. The site name is always last, with nothing after it. */
export function documentTitle(seo: RouteSeo): string {
  return seo.title ? `${seo.title} | ${SITE_NAME}` : SITE_NAME;
}

/** The absolute canonical URL for a path. */
export function canonicalUrl(pathname: string): string {
  const path = normalize(pathname);
  return path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${path}`;
}
