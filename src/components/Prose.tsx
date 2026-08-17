import { cn } from "@/lib/utils";

/**
 * Long-form reading typography for light reading mode.
 *
 * Used by research group briefs and journal articles — anything meant to be
 * read at length rather than scanned. Measure is capped near 68 characters,
 * which is where sustained reading stays comfortable.
 *
 * This component owns reading typography so the two long-form surfaces cannot
 * drift apart. It assumes the light reading mode set by src/lib/theme.ts and
 * uses ink on paper throughout — no dark-mode tokens belong inside it.
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
        "max-w-[68ch] text-ink/85",
        "[&_p]:font-sans [&_p]:text-[17px] [&_p]:leading-[1.75] [&_p]:mt-5",
        "[&_p:first-child]:mt-0",
        "[&_h2]:font-display [&_h2]:text-2xl [&_h2]:text-ink [&_h2]:mt-12 [&_h2]:mb-4",
        "[&_h3]:font-display [&_h3]:text-xl [&_h3]:text-ink [&_h3]:mt-9 [&_h3]:mb-3",
        "[&_ul]:mt-5 [&_ul]:space-y-2.5",
        "[&_li]:font-sans [&_li]:text-[17px] [&_li]:leading-[1.7]",
        "[&_a]:text-brass [&_a:hover]:text-brass-hi [&_a]:underline [&_a]:underline-offset-2",
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
 * Abstracts are authored as plain text with blank lines between paragraphs
 * (see the abstract field in the research group data). This keeps the data
 * layer free of markup.
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
