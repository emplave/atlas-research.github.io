import { Link } from "react-router-dom";
import { canApply, type ResearchGroup, type Setting } from "@/data/chapters";
import { findOpening, isFormPending } from "@/data/openings";
import { StatusChip } from "./StatusChip";

/** Human-readable label for the setting enum. */
const SETTING_LABEL: Record<Setting, string> = {
  school: "School-based",
  community: "Community-based",
  hybrid: "Hybrid",
  online: "Online",
};

/**
 * Directory card for one research group.
 *
 * The Apply action is gated on canApply() — Recruiting only. Completed and
 * Full render the card with no Apply, and Archived never reaches the default
 * view at all (see isVisibleByDefault in src/data/chapters.ts).
 *
 * The Apply URL is read from the Chapter Leader opening in
 * src/data/openings.ts and is never hardcoded here. If that opening has no
 * form yet, the action renders disabled rather than as a dead link.
 */
export function ChapterCard({ group }: { group: ResearchGroup }) {
  const applyable = canApply(group);
  const chapterOpening = findOpening("chapter-leader");
  const formPending = !chapterOpening || isFormPending(chapterOpening);

  const place = [group.schoolOrCommunityName, group.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex flex-col rounded-card border border-line bg-panel p-6 transition-colors hover:border-brass/40">
      <div className="flex items-start justify-between gap-3">
        <span className="meta-label text-muted">{group.field}</span>
        <StatusChip status={group.status} />
      </div>

      <h3 className="mt-4 font-display text-xl leading-snug text-text">
        {group.projectTitle}
      </h3>

      <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
        {group.oneLine}
      </p>

      <dl className="mt-5 space-y-1 text-sm">
        <div className="flex gap-2">
          <dt className="text-muted">Lead</dt>
          <dd className="text-text">{group.leadName}</dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted">Setting</dt>
          <dd className="text-text">
            {SETTING_LABEL[group.setting]}
            {place && <span className="text-muted"> — {place}</span>}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted">Members</dt>
          <dd className="text-text">{group.memberCount}</dd>
        </div>
      </dl>

      <div className="mt-6 pt-4 border-t border-line flex items-center justify-between gap-4">
        <Link
          to={`/chapters/${group.slug}`}
          className="text-sm text-brass hover:text-brass-hi transition-colors inline-flex items-center gap-1.5"
        >
          View brief
          <span aria-hidden>→</span>
        </Link>

        {applyable &&
          (formPending ? (
            <span
              aria-disabled="true"
              title="The Chapter Leader form is not open yet"
              className="rounded-control border border-line px-4 py-2 text-sm text-muted cursor-not-allowed"
            >
              Opening soon
            </span>
          ) : (
            <a
              href={chapterOpening.formUrl as string}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-control bg-brass text-ground px-4 py-2 text-sm hover:bg-brass-hi transition-colors"
            >
              Apply to join
            </a>
          ))}
      </div>
    </article>
  );
}
