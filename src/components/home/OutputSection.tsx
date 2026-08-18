import { Link } from "react-router-dom";
import { Section } from "./Section";
import { BriefPreview } from "@/components/visuals/BriefPreview";
import { CitationNetwork } from "@/components/visuals/CitationNetwork";

/**
 * What the work produces — the journal-adjacent section.
 *
 * Holds both drawn visuals: the brief preview shows the shape of a finished
 * output instead of describing it, and the citation network sits beneath as a
 * reference graph.
 *
 * The citation network is decorative and aria-hidden. The brief preview is too:
 * every fact a reader needs is in the text beside it, so neither figure carries
 * information that is only available visually.
 */
export function OutputSection() {
  return (
    <Section
      number="05"
      title="What the work produces"
      tone="paper"
      action={
        <Link to="/journal" className="text-sm link">
          The Atlas Journal
        </Link>
      }
    >
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_240px] lg:gap-14 items-start">
        <div>
          <p className="max-w-2xl type-body text-muted">
            A group finishes with a literature review, a policy brief, a survey
            study, a regional data profile, or a community presentation.
            Completed work may be submitted to the Atlas Journal for review.
            Review decides what is published.
          </p>

          <div className="mt-8 overflow-hidden rounded-card border border-line bg-surface">
            <CitationNetwork className="h-[200px] w-full" />
          </div>
          <p className="mt-3 meta-label">
            Every claim traced to a source
          </p>
        </div>

        <div className="mx-auto w-full max-w-[240px] lg:mx-0">
          <BriefPreview className="w-full" />
          <p className="mt-3 meta-label">A finished brief</p>
        </div>
      </div>
    </Section>
  );
}
