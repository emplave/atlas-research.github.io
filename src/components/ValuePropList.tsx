import { VALUE_PROPS } from "@/data/value-props";
import { cn } from "@/lib/utils";

/**
 * The five value props, rendered as a hairline-ruled ledger.
 *
 * ONE COMPONENT, BOTH PAGES. The homepage and /research-groups each had their own
 * copy of this markup — same data, two renderings, already diverging on gap and
 * max-width. The data was shared and the presentation was not, which is the same
 * mistake in a different layer.
 *
 * WHAT WAS WRONG. Both versions set the heading in .type-card (19px) against
 * 15px body in a two-column grid. That is a 1.27x type jump with no rules and no
 * anchor, so every element carried the same weight and the most important section
 * on the page read as a wall. Five items in two columns also left an orphan in
 * the second column, which made the set hard to count.
 *
 * WHAT THIS DOES INSTEAD, using contrast and structure only:
 *
 *   1. SIZE. Headings move to .type-prop (22-28px) against the same 15px body —
 *      1.87x rather than 1.27x. This is the single biggest change and the reason
 *      the eye now has somewhere to land.
 *   2. HAIRLINES. A rule above every row makes each prop a discrete, countable
 *      unit. The list closes with a rule too, so it reads as a bounded set of
 *      five rather than as text that stopped.
 *   3. ASYMMETRIC ROWS. On desktop the heading occupies a fixed left column and
 *      the body a wider right one, so all five headings stack into a single
 *      vertical line the eye can run down. Two equal columns scattered them
 *      across four positions.
 *   4. RHYTHM. Generous padding between rows, tight coupling inside one, so the
 *      heading and its body read as one unit and the units read as separate.
 *
 * NO NUMBERING, deliberately. See the note on `numbered` below.
 *
 * Monochrome only — paper, ink, muted, and the line token. No icons, no
 * illustration, no colour.
 */
export function ValuePropList({
  className,
  /**
   * Numbering is NOT offered, and this prop exists only to record why.
   *
   * The obvious move is to number these 01-05. On the homepage that collides
   * twice over: the marginal spine already numbers the SECTIONS 01-06, and
   * ProcessTrack in section 03 already numbers its five steps 01-05. A third
   * 01-05 sequence on one page makes "03" mean three different things depending
   * on which column of the page you are reading, and the two five-item lists
   * would look like the same list rendered twice.
   *
   * The hairlines do the counting job instead, without competing.
   */
  numbered,
}: {
  className?: string;
  numbered?: never;
}) {
  void numbered;

  return (
    <ul className={cn("border-b border-line", className)}>
      {VALUE_PROPS.map((prop) => (
        <li
          key={prop.title}
          className="border-t border-line py-7 md:py-8 grid gap-x-10 gap-y-2 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:items-baseline"
        >
          <h3 className="type-prop font-display text-ink">{prop.title}</h3>
          <p className="max-w-2xl text-[15px] text-muted leading-relaxed">
            {prop.body}
          </p>
        </li>
      ))}
    </ul>
  );
}
