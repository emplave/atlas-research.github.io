import { Link, useLocation } from "react-router-dom";
import { AtlasLogo } from "./AtlasLogo";
import { modeForPath } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Sitewide navigation. Works in both modes — it reads the route's mode from
 * src/lib/theme.ts rather than taking a prop, so no page can put it in the
 * wrong one.
 *
 * Links point at real routes. The previous /#study and /#sequence anchors are
 * gone; those section ids do not survive the rebuild.
 */
const LINKS = [
  { to: "/chapters", label: "Chapters" },
  { to: "/fellowship", label: "Fellowship" },
  { to: "/journal", label: "Journal" },
  { to: "/partners", label: "Partners" },
];

export function Nav() {
  const { pathname } = useLocation();
  const light = modeForPath(pathname) === "light";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 backdrop-blur border-b",
        light ? "bg-paper/90 border-ink/10" : "bg-ground/90 border-line"
      )}
    >
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-6">
        <Link to="/" aria-label="Atlas Research Institute — home">
          <AtlasLogo mode={light ? "light" : "dark"} />
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {LINKS.map((l) => {
            const active = pathname === l.to || pathname.startsWith(`${l.to}/`);
            return (
              <Link
                key={l.to}
                to={l.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "text-sm transition-colors",
                  light
                    ? active
                      ? "text-ink"
                      : "text-ink/65 hover:text-ink"
                    : active
                      ? "text-text"
                      : "text-muted hover:text-text"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <Link
          to="/apply"
          className="rounded-control bg-brass text-ground text-sm pl-5 pr-4 py-2 inline-flex items-center gap-2 hover:bg-brass-hi transition-colors"
        >
          Apply
          <span aria-hidden>→</span>
        </Link>
      </nav>
    </header>
  );
}
