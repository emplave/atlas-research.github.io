import type { Field } from "@/data/research-groups";

/**
 * Field icons — the site's visual vocabulary.
 *
 * Eight hand-built line icons, one per Field. Deliberately restrained:
 * stroke-only, 1.5px, currentColor, no fills, no gradients, no icon library,
 * no emoji. They inherit color from context so the same icon works on paper,
 * on a navy card header, and inside a filter row.
 *
 * All eight are drawn on the same 24-unit grid with the same visual weight, so
 * a row of them reads as one set rather than eight borrowed marks. Keep it
 * that way: if a new field is added, draw it to match rather than importing
 * something close.
 */
const PATHS: Record<Field, React.ReactNode> = {
  // Terminal window with a cursor — computation.
  "Computer Science & AI": (
    <>
      <rect x="2.75" y="4.75" width="18.5" height="14.5" rx="2" />
      <path d="M2.75 9h18.5" />
      <path d="M7 12.75l2.25 2.25L7 17.25" />
      <path d="M12 17.25h4.5" />
    </>
  ),

  // Heartbeat trace inside a rounded field — health.
  "Health & Life Sciences": (
    <>
      <path d="M20.6 8.4a4.6 4.6 0 0 0-8.6-2.2 4.6 4.6 0 0 0-8.6 2.2c0 4.6 8.6 10.1 8.6 10.1s8.6-5.5 8.6-10.1Z" />
      <path d="M4.6 11.4h3.3l1.6-2.6 2 5 1.6-2.4h6.3" />
    </>
  ),

  // Gear tooth arc over a beam — engineering.
  "Engineering & Technology": (
    <>
      <circle cx="12" cy="12" r="3.1" />
      <path d="M12 3.2v2.4M12 18.4v2.4M20.8 12h-2.4M5.6 12H3.2" />
      <path d="M18.2 5.8 16.5 7.5M7.5 16.5l-1.7 1.7M18.2 18.2 16.5 16.5M7.5 7.5 5.8 5.8" />
    </>
  ),

  // Orbit around a nucleus — physical sciences and mathematics.
  "Physical Sciences & Mathematics": (
    <>
      <circle cx="12" cy="12" r="2.1" />
      <ellipse cx="12" cy="12" rx="9.2" ry="4" />
      <ellipse
        cx="12"
        cy="12"
        rx="9.2"
        ry="4"
        transform="rotate(60 12 12)"
      />
    </>
  ),

  // Three linked figures — social sciences.
  "Social Sciences": (
    <>
      <circle cx="12" cy="6.4" r="2.4" />
      <circle cx="5.6" cy="16.4" r="2.4" />
      <circle cx="18.4" cy="16.4" r="2.4" />
      <path d="M10.4 8.5 7.2 14.3M16.8 14.3 13.6 8.5M8 16.4h8" />
    </>
  ),

  // Open book — humanities.
  Humanities: (
    <>
      <path d="M12 6.6v13" />
      <path d="M12 6.6C10.3 5.3 8 4.7 4.6 4.7v12.4c3.4 0 5.7.6 7.4 1.9" />
      <path d="M12 6.6c1.7-1.3 4-1.9 7.4-1.9v12.4c-3.4 0-5.7.6-7.4 1.9" />
    </>
  ),

  // Ascending bars with a trend line — economics and business.
  "Economics & Business": (
    <>
      <path d="M3.5 20.2h17" />
      <path d="M6.6 20.2v-5.1M11 20.2v-8.4M15.4 20.2v-4.2M19.8 20.2v-11" />
      <path d="M4.8 10.4 9.6 6.2l3.6 3 5.2-5.4" />
    </>
  ),

  // Leaf over a horizon line — environment and sustainability.
  "Environment & Sustainability": (
    <>
      <path d="M20 4.4c0 7.7-4.4 11.6-9.4 11.6A5.2 5.2 0 0 1 5.4 10.8C5.4 6.6 10.6 4.4 20 4.4Z" />
      <path d="M4.4 20c1.6-4.3 4.6-7.6 8.8-9.9" />
    </>
  ),
};

export function FieldIcon({
  field,
  size = 24,
  className,
}: {
  field: Field;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {PATHS[field]}
    </svg>
  );
}
