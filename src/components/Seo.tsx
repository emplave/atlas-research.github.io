import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  canonicalUrl,
  documentTitle,
  seoForPath,
} from "@/lib/seo";

/**
 * Writes the per-route title, description and canonical URL.
 *
 * Mounted once in App, inside the router. Renders nothing.
 *
 * This runs on the client, so a crawler that does not execute JS sees the
 * defaults baked into index.html instead. That is the reason index.html carries
 * a complete set of tags rather than placeholders: the home page must be correct
 * without JS, and every other route degrades to the site-level title and
 * description rather than to nothing.
 */
function setMeta(selector: string, attr: "content" | "href", value: string) {
  const el = document.head.querySelector(selector);
  if (el) {
    el.setAttribute(attr, value);
    return;
  }
  // Only the canonical link is created on demand; every meta tag already exists
  // in index.html, so a missing one means the markup was edited out of sync.
  if (selector === 'link[rel="canonical"]') {
    const link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    link.setAttribute("href", value);
    document.head.appendChild(link);
  }
}

export function Seo() {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = seoForPath(pathname);
    const title = documentTitle(seo);
    const canonical = canonicalUrl(pathname);

    document.title = title;
    setMeta('meta[name="description"]', "content", seo.description);
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", seo.description);
    setMeta('meta[property="og:url"]', "content", canonical);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", seo.description);
    setMeta('link[rel="canonical"]', "href", canonical);
  }, [pathname]);

  return null;
}
