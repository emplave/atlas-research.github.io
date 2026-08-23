import type { AtlasEvent } from "@/data/events";
import { cn } from "@/lib/utils";

/**
 * A speaker's headshot, from the Sheet's ImageSrc / ImageAlt columns.
 *
 * A PORTRAIT, NOT A HERO. It is deliberately small and sits on the speaker's
 * name line, so it supports the attribution rather than competing with the
 * title. The columns were being parsed and never rendered; this is the first
 * thing that uses them.
 *
 * NO PLACEHOLDER WHEN THERE IS NO IMAGE — no initials, no silhouette, no grey
 * circle. It returns null and the speaker line renders exactly as it did before,
 * which is why a card with no image looks finished rather than broken. All three
 * current events have an empty ImageSrc, so the no-image case is the common one
 * and has to be the one that looks right.
 *
 * IT ALSO RETURNS NULL WITH NO SPEAKER NAME, even when an image exists. This is a
 * speaker portrait: an unattributed face on a card is worse than no face. If an
 * image is set and nothing renders, check SpeakerName is filled too.
 *
 * Round, matching the chip radius already in the system. Square source images are
 * assumed — see notes/managing-events.md for the requested dimensions — and
 * object-cover means a non-square file is centre-cropped rather than squashed.
 */
const SIZES = {
  /** Homepage strip, small cards. */
  sm: "h-9 w-9",
  /** /events list cards. */
  md: "h-11 w-11",
  /** Homepage strip, the large "Next" card. */
  lg: "h-14 w-14",
  /** Event detail page. */
  xl: "h-16 w-16",
} as const;

export function SpeakerPortrait({
  event,
  size = "md",
  className,
}: {
  event: AtlasEvent;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  if (!event.image || !event.speakerName) return null;

  return (
    <img
      src={event.image.src}
      alt={event.image.alt}
      loading="lazy"
      /*
       * width/height are set as attributes as well as classes so the box is
       * reserved before the file loads and the card does not reflow. The values
       * match the `lg` class; the class wins for the other sizes.
       */
      width={56}
      height={56}
      className={cn(
        "shrink-0 rounded-full object-cover bg-surface",
        SIZES[size],
        className
      )}
    />
  );
}
