import { Link, useLocation } from "react-router-dom";
import { AtlasLogo } from "./AtlasLogo";
import { CONTACT_EMAIL } from "@/lib/dates";
import { modeForPath } from "@/lib/theme";
import { cn } from "@/lib/utils";

/**
 * Sitewide footer. Split out of Closing.tsx — Closing is a landing-page CTA
 * section, the footer is shell chrome that belongs on every route.
 *
 * Works in both modes, same as Nav: it reads the route's mode rather than
 * taking a prop.
 *
 * No donate link and no donate page in this build.
 */
const LINKS = [
  { to: "/research-groups", label: "Research Groups" },
  { to: "/events", label: "Events" },
  { to: "/journal", label: "Journal" },
  { to: "/fellowship", label: "Fellowship" },
  { to: "/partners", label: "Partners" },
];

export function Footer() {
  const { pathname } = useLocation();
  const light = modeForPath(pathname) === "light";
  const year = new Date().getFullYear();

  return (
    <footer
      className={cn(
        "border-t",
        light ? "bg-paper border-ink/10" : "bg-ground border-line"
      )}
    >
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <AtlasLogo mode={light ? "light" : "dark"} />
        <div
          className={cn(
            "flex flex-wrap gap-x-8 gap-y-2 text-sm",
            light ? "text-ink/65" : "text-muted"
          )}
        >
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                "transition-colors",
                light ? "hover:text-ink" : "hover:text-text"
              )}
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent hover:text-accent-hi transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10 flex flex-col gap-2">
        <p
          className={cn(
            "text-xs leading-relaxed max-w-2xl",
            light ? "text-ink/55" : "text-muted"
          )}
        >
          Atlas Research Institute operates as a project of yourbuddy Inc., a
          California nonprofit public benefit corporation.
        </p>
        <p className={cn("meta-label", light ? "text-ink/40" : "text-muted/70")}>
          © {year} Atlas Research Institute
        </p>
      </div>
    </footer>
  );
}
