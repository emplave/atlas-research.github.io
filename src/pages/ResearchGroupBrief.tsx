import { Link, useParams } from "react-router-dom";
import {
  canApply,
  settingLine,
  SETTING_LABEL_LONG,
  type ResearchGroup,
  type ReviewStatus,
} from "@/data/research-groups";
import { useResearchGroups } from "@/lib/useResearchGroups";
import { memberApplicationUrl } from "@/lib/memberApplication";
import { StatusChip } from "@/components/research-groups/StatusChip";
import { FieldIcon } from "@/components/FieldIcon";
import { Prose, ProseParagraphs } from "@/components/Prose";

/**
 * How each review state is described to a reader.
 *
 * Publication is decided by review. None of these strings may promise, imply,
 * or schedule a published outcome — "submitted" and "in review" describe where
 * a manuscript sits, not where it is going.
 */
const REVIEW_LABEL: Record<ReviewStatus, string> = {
  none: "Not yet submitted for review",
  submitted: "Submitted to Atlas — not yet assigned to reviewers",
  "in review": "Under review by the Atlas research and editorial team",
  published: "Reviewed, accepted, and published",
};

/**
 * Long-form brief for a single research group.
 *
 * Reads through useResearchGroups, so a group published in the Sheet is
 * reachable at its slug without a deploy.
 *
 * The 404 is only rendered AFTER the fetch resolves. Rendering it while the
 * request is outstanding would show "no research group at this address" for a
 * group that does exist.
 */
export function ResearchGroupBrief() {
  const { slug } = useParams<{ slug: string }>();
  const { groups, loading } = useResearchGroups();

  if (loading) return <BriefSkeleton />;

  const group = groups.find((g) => g.slug === slug);
  if (!group) return <BriefNotFound />;
  return <Brief group={group} />;
}

/** Matches the brief's header and column layout, so nothing shifts. */
function BriefSkeleton() {
  return (
    <div aria-hidden className="bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto max-w-4xl px-6 pt-12 md:pt-16 pb-10">
          <div className="h-3 w-40 rounded bg-line" />
          <div className="mt-7 h-3 w-56 rounded bg-line" />
          <div className="mt-5 h-10 w-4/5 rounded bg-line" />
          <div className="mt-4 h-4 w-2/3 rounded bg-line" />
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-6 py-12 grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16 items-start">
        <div className="space-y-3">
          {Array.from({ length: 9 }, (_, i) => (
            <div key={i} className="h-3 rounded bg-line" style={{ width: `${95 - i * 4}%` }} />
          ))}
        </div>
        <div className="rounded-card border border-line p-6 space-y-4">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-2.5 w-20 rounded bg-line" />
              <div className="h-3 w-32 rounded bg-line" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Brief({ group }: { group: ResearchGroup }) {
  const applyable = canApply(group);

  const where = settingLine(group, SETTING_LABEL_LONG);

  return (
    <article className="bg-paper">
      <header className="border-b border-line">
        <div className="mx-auto max-w-4xl px-6 pt-12 md:pt-16 pb-10">
          <Link
            to="/research-groups"
            className="meta-label text-muted hover:text-ink transition-colors inline-flex items-center gap-1.5"
          >
            <span aria-hidden>←</span> All research groups
          </Link>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 meta-label text-muted">
              <FieldIcon field={group.field} size={18} className="text-ink" />
              {group.field}
            </span>
            <StatusChip status={group.status} />
          </div>

          <h1 className="type-hero font-display mt-4 max-w-3xl">
            {group.projectTitle}
          </h1>

          <p className="mt-5 max-w-2xl text-lg text-muted leading-relaxed">
            {group.oneLine}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-12 grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16 items-start">
        <Prose>
          <h2>Abstract</h2>
          <ProseParagraphs text={group.abstract} />

          <h2>Methods</h2>
          <ul>
            {group.methods.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>

          <h2>Milestones</h2>
          <ul>
            {group.milestones.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Prose>

        <aside className="lg:sticky lg:top-24 rounded-card border border-line bg-surface p-6">
          <h2 className="meta-label">Group details</h2>
          <dl className="mt-4 space-y-4 text-[15px]">
            <Detail label="Lead">{group.leadName}</Detail>
            <Detail label="Members">{group.memberCount}</Detail>
            <Detail label="Setting">{where}</Detail>
            <Detail label="Output">{group.outputType}</Detail>
            <Detail label="Started">{formatDate(group.startedAt)}</Detail>
            <Detail label="Review status">
              <span className="block text-muted">
                {REVIEW_LABEL[group.reviewStatus]}
              </span>
            </Detail>
          </dl>

          {applyable && (
            <div className="mt-6 pt-5 border-t border-line">
              <a
                href={memberApplicationUrl(group)}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center rounded-control bg-ink text-paper px-4 py-2.5 text-sm hover:bg-ink-hover transition-colors"
              >
                Apply to join
              </a>
              {/*
                What happens next, stated plainly. No response time is
                promised — leads are students, and a deadline nobody owns
                becomes a broken promise.
              */}
              <p className="mt-3 text-xs text-muted leading-relaxed">
                This group's lead reviews applications and decides who joins.
              </p>
            </div>
          )}
        </aside>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto max-w-4xl px-6 py-10">
          <p className="text-sm text-muted max-w-2xl leading-relaxed">
            Completed work may be submitted to Atlas for review. The Atlas
            research and editorial team decides what advances; work meeting the
            journal's standards may be considered for publication in the Atlas
            Journal. Submission does not guarantee publication.
          </p>
        </div>
      </div>
    </article>
  );
}

function Detail({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt className="meta-label">{label}</dt>
      <dd className="mt-1 text-ink">{children}</dd>
    </div>
  );
}

/** ISO date → readable, without pulling in a date library. */
function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

/** A slug with no matching group. Stays in light reading mode. */
function BriefNotFound() {
  return (
    <div className="bg-paper">
      <div className="mx-auto max-w-2xl px-6 py-28 text-center">
        <p className="meta-label">Not found</p>
        <h1 className="mt-5 font-display text-4xl">
          No research group at this address.
        </h1>
        <p className="mt-5 text-muted leading-relaxed">
          The link may be out of date, or the group may have been archived.
        </p>
        <Link
          to="/research-groups"
          className="mt-8 inline-flex items-center gap-2 rounded-control bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink-hover transition-colors"
        >
          Browse all research groups
          <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}
