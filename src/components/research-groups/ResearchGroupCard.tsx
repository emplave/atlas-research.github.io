import { Link } from "react-router-dom";
import {
  canApply,
  type ResearchGroup,
  type Setting,
} from "@/data/research-groups";
import { findOpening, isFormPending } from "@/data/openings";
import { StatusChip } from "./StatusChip";

const SETTING_LABEL: Record<Setting, string> = {
  school: "School",
  community: "Community",
  hybrid: "Hybrid",
  online: "Online",
};

/**
 * Directory card for one research group.
 *
 * Every card opens with a 16:9 block. When `image` is null it renders a
 * typographic fallback in navy carrying the field name — never a broken
 * image, never an empty gray box. The fallback is a designed state, not a
 * degraded one, because most groups will not have a photo.
 *
 * The Apply action is gated on canApply() (Recruiting only) and its URL comes
 * from the Research Group Leader opening, never hardcoded here.
 */
export function ResearchGroupCard({ group }: { group: ResearchGroup }) {
  const applyable = canApply(group);
  const opening = findOpening("chapter-leader");
  const formPending = !opening || isFormPending(opening);

  const place = [group.schoolOrCommunityName, group.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex flex-col overflow-hidden rounded-card border border-line bg-surface transition-colors hover:border-navy/40">
      <CardMedia group={group} />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="meta-label text-muted">{group.field}</span>
          <StatusChip status={group.status} />
        </div>

        <h3 className="mt-3 font-display text-xl leading-snug">
          <Link
            to={`/research-groups/${group.slug}`}
            className="hover:text-navy-hi transition-colors"
          >
            {group.projectTitle}
          </Link>
        </h3>

        <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
          {group.oneLine}
        </p>

        <dl className="mt-5 space-y-1 text-sm">
          <Row label="Lead">{group.leadName}</Row>
          <Row label="Setting">
            {SETTING_LABEL[group.setting]}
            {place && <span className="text-muted"> · {place}</span>}
          </Row>
          <Row label="Members">{group.memberCount}</Row>
        </dl>

        <div className="mt-6 pt-4 border-t border-line flex items-center justify-between gap-4">
          <Link
            to={`/research-groups/${group.slug}`}
            className="text-sm text-accent underline underline-offset-4 hover:text-navy-hi transition-colors"
          >
            Read the brief
          </Link>

          {applyable &&
            (formPending ? (
              <span
                aria-disabled="true"
                title="The Research Group Leader form is not open yet"
                className="rounded-control border border-line px-4 py-2 text-sm text-muted cursor-not-allowed"
              >
                Opening soon
              </span>
            ) : (
              <a
                href={opening.formUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-control bg-navy text-white px-4 py-2 text-sm hover:bg-navy-hi transition-colors"
              >
                Apply to join
              </a>
            ))}
        </div>
      </div>
    </article>
  );
}

/**
 * The 16:9 media block. Real image when there is one, typographic navy block
 * carrying the field name when there is not.
 */
function CardMedia({ group }: { group: ResearchGroup }) {
  if (group.image) {
    return (
      <div className="aspect-[16/9] w-full overflow-hidden bg-navy">
        <img
          src={group.image.src}
          alt={group.image.alt}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className="aspect-[16/9] w-full bg-navy px-6 flex flex-col justify-center"
    >
      <span className="meta-label text-white/55">Research group</span>
      <span className="mt-1.5 font-display text-2xl leading-tight text-white">
        {group.field}
      </span>
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-2">
      <dt className="text-muted">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}
