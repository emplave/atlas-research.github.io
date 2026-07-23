import { Link } from "react-router-dom";
import { AtlasLogo } from "./AtlasLogo";
import { DATES } from "@/lib/dates";

export function AnnouncementBar() {
  return (
    <div className="bg-navy-900 text-cream-200">
      <div className="mx-auto max-w-6xl px-6 py-2 flex items-center justify-center gap-3">
        <span
          className="h-1.5 w-1.5 rounded-full bg-gold-400 animate-pulse-node"
          aria-hidden
        />
        <p className="meta-label text-cream-200/90">
          Applications are open · Due {DATES.deadline} · Reviewed on a rolling
          basis
        </p>
      </div>
    </div>
  );
}

const links = [
  { to: "/#study", label: "The Mission" },
  { to: "/#sequence", label: "Fellowship" },
  { to: "/#faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-50 bg-cream-100/90 backdrop-blur border-b border-hairline">
      <nav className="mx-auto max-w-6xl px-6 h-16 flex items-center justify-between">
        <Link to="/" aria-label="Atlas Research Institute — home">
          <AtlasLogo />
        </Link>
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="text-sm text-navy-600 hover:text-navy-900 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>
        <Link
          to="/fellowship"
          className="rounded-full bg-navy-800 text-cream-100 text-sm pl-5 pr-4 py-2 inline-flex items-center gap-2 hover:bg-navy-700 transition-colors"
        >
          Apply
          <span aria-hidden className="text-gold-300">
            →
          </span>
        </Link>
      </nav>
    </header>
  );
}
