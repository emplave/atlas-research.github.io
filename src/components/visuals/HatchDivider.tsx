/**
 * Hairline hatching divider.
 *
 * Replaces a plain section rule with 40px of thin diagonal hatch. Subtle
 * enough to read as texture rather than as a graphic element.
 *
 * The pattern id must be unique per instance or the second divider on a page
 * silently reuses the first one's pattern — hence the required `id` prop
 * rather than a hardcoded string.
 */
export function HatchDivider({
  id,
  className,
}: {
  /** Unique per instance. Two dividers sharing an id break the second one. */
  id: string;
  className?: string;
}) {
  const patternId = `hatch-${id}`;
  return (
    <div
      className={className}
      aria-hidden="true"
      style={{ height: 40, overflow: "hidden" }}
    >
      <svg
        width="100%"
        height="40"
        preserveAspectRatio="none"
        focusable="false"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id={patternId}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="#8A8A92"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="100%" height="40" fill={`url(#${patternId})`} opacity="0.4" />
      </svg>
    </div>
  );
}
