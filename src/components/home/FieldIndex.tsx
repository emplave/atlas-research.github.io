import { Link } from "react-router-dom";
import { FieldIcon } from "@/components/FieldIcon";
import type { Field } from "@/data/research-groups";
import { Section } from "./Section";

/**
 * The field index — makes the "any field" claim visible rather than asserted.
 *
 * Compact and typographic on purpose: eight rows, not eight cards. A card grid
 * here would out-weigh the research groups directly above it, which is the
 * section that actually carries proof.
 *
 * Each row links to the directory pre-filtered to that field. The query
 * parameter is read by the directory page, so these are working links, not
 * decoration.
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

export function FieldIndex() {
  return (
    <Section number="04" title="Eight fields" tone="surface">
      <ul className="mt-8 grid gap-px bg-line border border-line sm:grid-cols-2 lg:grid-cols-4">
        {FIELDS.map((field) => (
          <li key={field}>
            <Link
              to={`/research-groups?field=${encodeURIComponent(field)}`}
              className="group flex h-full items-center gap-3 bg-paper px-5 py-4 transition-colors hover:bg-navy"
            >
              <FieldIcon
                field={field}
                size={22}
                className="text-navy shrink-0 transition-colors group-hover:text-white"
              />
              <span className="text-[15px] leading-snug text-ink transition-colors group-hover:text-white">
                {field}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
