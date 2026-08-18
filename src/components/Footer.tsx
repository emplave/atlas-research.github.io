import { Link } from "react-router-dom";
import { AtlasLogo } from "./AtlasLogo";
import { CONTACT_EMAIL } from "@/lib/dates";

/**
 * Sitewide footer. Light, single polarity.
 *
 * No donate link and no donate page in this build.
 */
const LINKS = [
  { to: "/research-groups", label: "Research Groups" },
  { to: "/events", label: "Events" },
  { to: "/journal", label: "Journal" },
  { to: "/fellowship", label: "Fellowship" },
  { to: "/partners", label: "Partners" },
  { to: "/privacy", label: "Privacy" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-paper border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <AtlasLogo />
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-muted">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="hover:text-navy transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent underline underline-offset-4 hover:text-navy-hi transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-10 flex flex-col gap-2">
        {/*
          Exact required wording. The parent entity is deliberately NOT named.
          Do not reintroduce a company name, an EIN, "501(c)(3)", or
          "tax deductible" here.
        */}
        <p className="text-xs leading-relaxed max-w-2xl text-muted">
          Atlas Research Institute operates as a project of a California
          nonprofit public benefit corporation. For more information contact{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-accent underline underline-offset-4 hover:text-navy-hi transition-colors"
          >
            {CONTACT_EMAIL}
          </a>
        </p>
        <p className="meta-label text-muted">
          © {year} Atlas Research Institute
        </p>
      </div>
    </footer>
  );
}
