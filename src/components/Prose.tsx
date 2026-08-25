import { cn } from "@/lib/utils";

/**
 * Long-form reading typography.
 *
 * Used by research group briefs and journal articles. Measure caps near 68
 * characters, which is where sustained reading stays comfortable.
 *
 * This component owns reading typography so the two long-form surfaces cannot
 * drift apart.
 */
export function Prose({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-[68ch] text-ink",
        "[&_p]:font-sans [&_p]:text-[17px] [&_p]:leading-[1.75] [&_p]:mt-5 [&_p]:text-ink/90",
        "[&_p:first-child]:mt-0",
        "[&_h2]:font-display [&_h2]:text-[26px] [&_h2]:text-ink [&_h2]:mt-12 [&_h2]:mb-4",
        /*
         * A leading h2 has nothing above it to separate from, so mt-12 was 48px
         * of dead space at the top of every brief and every journal article. The
         * same reset already existed for paragraphs; this is the missing half of
         * that rule, not a new idea.
         */
        "[&_h2:first-child]:mt-0",
        "[&_h3]:font-display [&_h3]:text-[21px] [&_h3]:text-ink [&_h3]:mt-9 [&_h3]:mb-3",
        "[&_ul]:mt-5 [&_ul]:space-y-2.5",
        "[&_li]:font-sans [&_li]:text-[17px] [&_li]:leading-[1.7] [&_li]:text-ink/90",
        "[&_a]:text-ink [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-1 [&_a:hover]:decoration-2",
        "[&_strong]:text-ink [&_strong]:font-medium",
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Renders a blank-line-separated string as paragraphs.
 *
 * Abstracts are authored as plain text with blank lines between paragraphs, so
 * the data layer stays free of markup.
 */
export function ProseParagraphs({ text }: { text: string }) {
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return (
    <>
      {paragraphs.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}
