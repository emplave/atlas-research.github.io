import { cn } from "@/lib/utils";

/**
 * The Atlas mark — a serif A whose crossbar resolves into a pen nib.
 *
 * ONE PATH, not two. The previous mark was a pair of angular blocks (LARGE and
 * SMALL) that had to be filled in two different greys to read as a letter: the
 * counter was negative space between two separate shapes, so the lighter leg was
 * doing the work of separating them. This mark carries its own counter, so the
 * distinction is gone and so is the second fill. Do not reintroduce a two-tone
 * treatment — at any size below about 32px the nib is the first thing to go, and
 * a second colour behind it makes that worse rather than better.
 *
 * fillRule="evenodd" is carried over from the source file, and is currently a
 * NO-OP — verified by rendering the path both ways and diffing: zero bytes
 * differ. The three subpaths (right stroke, left stroke with the nib, and a
 * hairline shaping the nib tip) do not overlap, and the counter of the A is an
 * open shape rather than a hole punched through one, so nonzero produces the
 * same result. It stays anyway, because it is what public/atlas-mark.svg
 * specifies and the two must not diverge — and because a future path edit that
 * did overlap would need it. Do not "clean it up" on the grounds that it changes
 * nothing today.
 *
 * Geometry is verbatim from public/atlas-mark.svg, the vector source. Do not
 * hand-edit the numbers here; edit that file and copy the path across, so the
 * component and the file that generates every favicon cannot drift.
 *
 * SIZING. viewBox is square, and `size` is the rendered height in px, as before.
 * The ink inside it spans 0.8492 x 0.8700 of the box, against the old mark's
 * 0.9000 x 0.8625 — so at the same `size` the mark stands the same height to
 * within 1% and sits about 6% narrower. That is why the nav and footer needed no
 * adjustment, and why the lockup balance note below still holds.
 *
 * LEGIBILITY FLOOR: 24px, up from the old mark's 16px. Verified by rendering,
 * not assumed — see the note in AtlasLockup. At 24px the counter and the nib
 * both still resolve; at 16px the nib closes up into the crossbar. Below 24px
 * use a favicon-style tile (public/atlas-mark-tile.svg) rather than this
 * component, which is what the icon set does.
 */
const MARK =
  "M 485.15,65.00 L 421.81,187.73 L 421.81,193.67 L 462.39,275.82 L 489.11,334.22 L 511.88,379.74 L 518.81,396.57 L 596.01,555.92 L 638.57,647.97 L 737.54,852.85 L 747.44,875.61 L 775.15,931.04 L 775.15,933.02 L 777.13,935.00 L 780.10,934.01 L 924.61,934.01 L 909.76,918.17 L 895.90,900.36 L 881.06,877.59 L 870.17,857.80 L 700.92,511.38 L 685.09,476.74 L 665.29,438.14 L 639.56,382.71 L 622.73,350.05 L 622.73,348.07 L 605.90,315.41 L 605.90,313.43 Z M 449.52,299.57 L 446.55,321.35 L 438.63,351.04 L 428.74,378.75 L 409.93,419.33 L 396.08,444.08 L 370.34,483.67 L 308.98,565.82 L 270.38,626.19 L 240.68,682.61 L 196.14,781.59 L 166.45,839.98 L 145.67,872.65 L 132.80,889.47 L 111.02,911.25 L 90.24,926.09 L 75.39,934.01 L 173.38,934.01 L 175.36,933.02 L 187.24,919.16 L 216.93,871.66 L 247.61,811.28 L 267.41,768.72 L 283.24,742.99 L 294.13,729.13 L 313.92,709.33 L 342.63,688.55 L 371.33,673.70 L 406.96,660.84 L 441.60,652.92 L 458.43,651.93 L 459.42,650.94 L 492.08,650.94 L 493.07,651.93 L 517.82,653.91 L 597.00,607.39 L 531.67,619.27 L 525.73,627.18 L 518.81,629.16 L 513.86,627.18 L 509.90,622.24 L 509.90,615.31 L 516.83,608.38 L 523.75,608.38 L 529.69,614.32 L 589.08,604.42 L 595.02,604.42 L 541.57,595.51 L 536.62,593.53 L 531.67,593.53 L 509.90,588.58 L 504.95,588.58 L 480.20,601.45 L 458.43,610.36 L 430.72,619.27 L 394.10,628.17 L 367.37,637.08 L 334.71,651.93 L 311.95,665.78 L 310.96,664.80 L 315.90,651.93 L 338.67,604.42 L 397.06,501.48 L 413.89,467.83 L 429.73,429.23 L 439.62,398.55 L 447.54,363.91 L 449.52,340.15 L 450.51,339.16 L 450.51,303.53 Z M 519.80,594.52 L 520.78,593.53 L 526.72,593.53 L 527.71,594.52 L 532.66,594.52 L 533.65,595.51 L 538.60,595.51 L 539.59,596.50 L 544.54,596.50 L 545.53,597.49 L 549.49,597.49 L 550.48,598.48 L 554.44,598.48 L 555.43,599.47 L 560.38,599.47 L 561.37,600.46 L 560.38,601.45 L 554.44,601.45 L 553.45,600.46 L 549.49,600.46 L 548.50,599.47 L 542.56,599.47 L 541.57,598.48 L 536.62,598.48 L 535.63,597.49 L 531.67,597.49 L 530.68,596.50 L 525.73,596.50 L 524.74,595.51 L 520.78,595.51 Z";

export type MarkTone = "light" | "ink";

export function AtlasMark({
  size = 32,
  tone = "light",
  className,
  title,
}: {
  /** Rendered height in px. The viewBox is square, so width matches. */
  size?: number;
  /** Ground the mark sits on. */
  tone?: MarkTone;
  className?: string;
  /** Set only when the mark stands alone as the accessible name. */
  title?: string;
}) {
  const fill = tone === "ink" ? "#FFFFFF" : "#0E0E10";

  return (
    <svg
      viewBox="0 0 1000 1000"
      height={size}
      width={size}
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      <path d={MARK} fill={fill} fillRule="evenodd" clipRule="evenodd" />
    </svg>
  );
}

/**
 * The lockup: the mark plus "Atlas Research Institute" in Instrument Serif.
 *
 * NOTHING SITS BENEATH THE WORDMARK. A descriptor line here repeated "Research
 * Institute" twice in the same lockup, and the tagline that used to sit under
 * the wordmark in the artwork has been removed from the brand. Do not
 * reintroduce either.
 *
 * BALANCE, measured rather than eyeballed. The mark is a filled letterform and
 * the wordmark is a light serif, so at equal height the mark always wins. What
 * matters is the mark's INK height against the wordmark's CAP height:
 *
 *   Instrument Serif capHeight = 0.720 em (from OS/2)
 *   this mark's ink spans y65-935 of a 1000 viewBox = 0.870 of rendered height
 *
 *   mark 24 / word 20  ->  ink 20.9px vs cap 14.4px  =  1.45x
 *
 * The old mark measured 1.44x at these same values, so replacing the artwork did
 * not disturb the balance and neither size needed changing.
 *
 * 24px IS THE FLOOR AND THE NAV IS AT IT. Both the nav and the footer render
 * this default. The nib inside the counter is roughly two pixels across there,
 * which reads as a nib rather than resolving as one — going smaller loses it
 * entirely. If the nav ever gets shorter, drop the wordmark before shrinking the
 * mark.
 */
export function AtlasLockup({
  size = 24,
  tone = "light",
  variant = "horizontal",
  className,
}: {
  size?: number;
  tone?: MarkTone;
  variant?: "horizontal" | "stacked";
  className?: string;
}) {
  const onInk = tone === "ink";
  const stacked = variant === "stacked";

  return (
    <span
      className={cn(
        "inline-flex select-none",
        stacked
          ? "flex-col items-start gap-2.5"
          : "flex-row items-center gap-2.5",
        className
      )}
    >
      <AtlasMark size={size} tone={tone} />
      <span
        className={cn(
          "font-display text-[20px] leading-none tracking-[-0.015em]",
          onInk ? "text-paper" : "text-ink"
        )}
      >
        Atlas Research Institute
      </span>
    </span>
  );
}
