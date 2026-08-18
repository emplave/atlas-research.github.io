import { Link } from "react-router-dom";
import { FieldIcon } from "@/components/FieldIcon";
import type { Field } from "@/data/research-groups";

/**
 * Field wheel — the eight fields arranged radially on a hairline circle.
 *
 * Static. Each spoke is a link to the directory pre-filtered to that field, so
 * this is navigation rather than illustration.
 *
 * Built with HTML positioned over one SVG circle rather than SVG <text>,
 * because SVG text cannot wrap and four of the eight field names are two words
 * long. Labels are placed by angle and given left/right alignment based on
 * which half of the wheel they sit in, so they read outward from the centre.
 *
 * Below md the wheel collapses to a plain list — a 340px-wide radial diagram
 * is unreadable, and there is no point shrinking it to prove a shape.
 */
const FIELDS: Field[] = [
  "Computer Science & AI",
  "Health & Life Sciences",
  "Engineering & Technology",
  "Physical Sciences & Mathematics",
  "Social Sciences",
  "Humanities",
  "Economics & Business",
  "Environment & Sustainability",
];

/** Icon ring radius and label ring radius, as a percentage of the box. */
const ICON_R = 33;
const LABEL_R = 46;

export function FieldWheel({ className }: { className?: string }) {
  return (
    <div className={className}>
      {/* Radial layout, md and up. */}
      <div className="hidden md:block">
        <div className="relative mx-auto aspect-square w-full max-w-[560px]">
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 h-full w-full"
            aria-hidden="true"
            focusable="false"
          >
            <circle
              cx="50"
              cy="50"
              r={ICON_R}
              fill="none"
              stroke="#E4E4E6"
              strokeWidth="0.4"
            />
            {/* Spokes from the centre out to the icon ring. */}
            {FIELDS.map((_, i) => {
              const a = (i / FIELDS.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <line
                  key={i}
                  x1={50 + Math.cos(a) * 7}
                  y1={50 + Math.sin(a) * 7}
                  x2={50 + Math.cos(a) * (ICON_R - 5)}
                  y2={50 + Math.sin(a) * (ICON_R - 5)}
                  stroke="#E4E4E6"
                  strokeWidth="0.4"
                />
              );
            })}
            <circle cx="50" cy="50" r="2.2" fill="#0E0E10" />
          </svg>

          {FIELDS.map((field, i) => {
            const a = (i / FIELDS.length) * Math.PI * 2 - Math.PI / 2;
            const ix = 50 + Math.cos(a) * ICON_R;
            const iy = 50 + Math.sin(a) * ICON_R;
            const lx = 50 + Math.cos(a) * LABEL_R;
            const ly = 50 + Math.sin(a) * LABEL_R;
            const cosA = Math.cos(a);
            // Left half of the wheel gets right-aligned labels, and vice versa,
            // so every label reads outward from the centre.
            const align =
              Math.abs(cosA) < 0.2
                ? "-translate-x-1/2 text-center"
                : cosA > 0
                  ? "text-left"
                  : "-translate-x-full text-right";

            return (
              <Link
                key={field}
                to={`/research-groups?field=${encodeURIComponent(field)}`}
                className="group absolute"
                style={{ left: `${ix}%`, top: `${iy}%` }}
              >
                <span className="absolute -translate-x-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full border border-line bg-paper text-ink transition-colors group-hover:bg-ink group-hover:text-paper">
                  <FieldIcon field={field} size={20} />
                </span>
                <span
                  className={`absolute w-[9.5rem] -translate-y-1/2 text-[13px] leading-tight text-muted transition-colors group-hover:text-ink ${align}`}
                  style={{
                    left: `${(lx - ix) * (100 / 56)}px`,
                    top: `${(ly - iy) * (100 / 56)}px`,
                  }}
                >
                  {field}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Plain list below md. */}
      <ul className="md:hidden grid gap-px border border-line bg-line">
        {FIELDS.map((field) => (
          <li key={field}>
            <Link
              to={`/research-groups?field=${encodeURIComponent(field)}`}
              className="group flex items-center gap-3 bg-paper px-5 py-4 transition-colors hover:bg-ink"
            >
              <FieldIcon
                field={field}
                size={20}
                className="shrink-0 text-ink transition-colors group-hover:text-paper"
              />
              <span className="text-[15px] text-ink transition-colors group-hover:text-paper">
                {field}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
