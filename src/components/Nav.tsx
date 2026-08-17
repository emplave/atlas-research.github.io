import { Link, useLocation } from "react-router-dom";
import { AtlasLogo } from "./AtlasLogo";
import { findOpening, isFormPending } from "@/data/openings";
import { cn } from "@/lib/utils";

/**
 * Sitewide navigation. Light, single polarity.
 *
 * The CTA is starting a research group — research groups are the primary
 * programme and fellowship applications are closed. It never points at
 * /apply.html.
 */
const LINKS = [
  { to: "/research-groups", label: "Research Groups" },
  { to: "/events", label: "Events" },
  { to: "/journal", label: "Journal" },
  { to: "/fellowship", label: "Fellowship" },
  { to: "/partners", label: "Partners" },
];

export function Nav() {
  const { pathname } = useLocation();
  const opening = findOpening("chapter-leader");
  const formPending = !opening || isFormPending(opening);

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-line">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between gap-6">
        <Link to="/" aria-label="Atlas Research Institute — home">
          <AtlasLogo />
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
                  active ? "text-navy" : "text-muted hover:text-navy"
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        {formPending ? (
          <span
            aria-disabled="true"
            className="hidden sm:inline-flex rounded-control border border-line text-muted text-sm px-4 py-2 cursor-not-allowed"
          >
            Opening soon
          </span>
        ) : (
          <a
            href={opening.formUrl as string}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-control bg-navy text-white text-sm px-4 py-2 hover:bg-navy-hi transition-colors"
          >
            Start a group
          </a>
        )}
      </nav>
    </header>
  );
}
