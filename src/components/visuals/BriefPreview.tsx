/**
 * Brief preview — a drawn mock of a finished research brief.
 *
 * Pure geometry: page outline, title bar, ruled text lines, a figure block, a
 * citation block. Two labels at most.
 *
 * The point is to show the shape of the output instead of describing it. The
 * ruled lines are deliberately abstract rather than lorem text — fake sentences
 * would invite reading, and there is nothing to read.
 */
export function BriefPreview({ className }: { className?: string }) {
  // Ruled text lines: y position and width, varied so the block reads as prose
  // rather than a barcode.
  const lines: [number, number][] = [
    [96, 190],
    [104, 172],
    [112, 186],
    [120, 148],
    [136, 190],
    [144, 178],
    [152, 164],
  ];

  const citations: [number, number][] = [
    [286, 150],
    [294, 132],
    [302, 142],
  ];

  return (
    <svg
      viewBox="0 0 240 340"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Page */}
      <rect
        x="0.5"
        y="0.5"
        width="239"
        height="339"
        fill="#FFFFFF"
        stroke="#E4E4E6"
      />

      {/* Title bar and byline rule */}
      <rect x="25" y="34" width="150" height="9" fill="#0E0E10" />
      <rect x="25" y="50" width="92" height="4" fill="#8A8A92" />
      <line x1="25" y1="70" x2="215" y2="70" stroke="#E4E4E6" />

      {/* Ruled body text */}
      <g fill="#8A8A92" opacity="0.75">
        {lines.map(([y, w], i) => (
          <rect key={i} x="25" y={y} width={w} height="2.5" />
        ))}
      </g>

      {/* Figure block, with axes drawn as hairlines and three plotted bars */}
      <rect
        x="25"
        y="176"
        width="190"
        height="86"
        fill="#F5F5F6"
        stroke="#E4E4E6"
      />
      <line x1="43" y1="190" x2="43" y2="246" stroke="#8A8A92" strokeWidth="0.6" />
      <line x1="43" y1="246" x2="198" y2="246" stroke="#8A8A92" strokeWidth="0.6" />
      <rect x="60" y="222" width="20" height="24" fill="#0E0E10" />
      <rect x="94" y="206" width="20" height="40" fill="#0E0E10" />
      <rect x="128" y="214" width="20" height="32" fill="#8A8A92" />
      <rect x="162" y="198" width="20" height="48" fill="#8A8A92" />

      {/* Citation block */}
      <line x1="25" y1="274" x2="215" y2="274" stroke="#E4E4E6" />
      <g fill="#8A8A92" opacity="0.75">
        {citations.map(([y, w], i) => (
          <rect key={i} x="25" y={y} width={w} height="2" />
        ))}
      </g>

      {/* Two labels, no more */}
      <text
        x="25"
        y="168"
        fill="#8A8A92"
        fontFamily="Archivo, system-ui, sans-serif"
        fontSize="7"
        letterSpacing="1.2"
      >
        FIGURE 1
      </text>
      <text
        x="25"
        y="326"
        fill="#8A8A92"
        fontFamily="Archivo, system-ui, sans-serif"
        fontSize="7"
        letterSpacing="1.2"
      >
        REFERENCES
      </text>
    </svg>
  );
}
