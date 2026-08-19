/**
 * Per-route title, description and canonical URL.
 *
 * No dependency. `react-helmet` and friends are not worth adding for eight
 * static strings — a single effect that writes the tags directly does the same
 * job, and the tags in index.html remain the crawler-visible defaults.
 *
 * CANONICAL HOST. Every canonical points at https://www.atlas-research.org,
 * because that is what the deployment actually serves. Verified rather than
 * assumed:
 *
 *   dig NS atlas-research.org      → *.ns.cloudflare.com   (DNS only; no cf-ray
 *                                     in responses, so Cloudflare is not
 *                                     proxying — it just answers DNS)
 *   GET https://atlas-research.org/     → 308 → https://www.atlas-research.org/
 *   GET https://www.atlas-research.org/ → 200, server: Vercel
 *
 * So Vercel is configured with www as the primary domain and the apex
 * redirecting to it. Pointing canonicals at the apex would name a host that
 * immediately 308s, which is the opposite of a canonical.
 *
 * If the Vercel primary domain is ever switched to the apex, change SITE_ORIGIN
 * here and regenerate public/sitemap.xml — those are the only two places the
 * host is written.
 */
export const SITE_ORIGIN = "https://www.atlas-research.org";

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
  "Atlas runs student research groups in eight fields. Three to ten students, one research question, one term. Free, and open worldwide.";

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
      "Researchers can run a guest session, mentor a group, or review for the journal. Students can lead a group or join the Atlas team.",
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
