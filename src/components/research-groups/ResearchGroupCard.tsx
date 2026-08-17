import { Link } from "react-router-dom";
import {
  canApply,
  type Field,
  type ResearchGroup,
  type Setting,
} from "@/data/research-groups";
import { findOpening, isFormPending } from "@/data/openings";
import { FieldIcon } from "@/components/FieldIcon";
import { StatusChip } from "./StatusChip";
import { cn } from "@/lib/utils";

const SETTING_LABEL: Record<Setting, string> = {
  school: "School",
  community: "Community",
  hybrid: "Hybrid",
  online: "Online",
};

/**
 * Four navy steps between #1C3F5E and #2A5A82.
 *
 * Assigned deterministically by field, so the same field always gets the same
 * tint and consecutive cards in a grid are not identical slabs. Deterministic
 * rather than random because a tint that changes between renders reads as a
 * bug, and because a reader should be able to learn the association.
 */
const NAVY_STEPS = ["#1C3F5E", "#22496B", "#265078", "#2A5A82"] as const;

const FIELD_ORDER: Field[] = [
  "Computer Science & AI",
  "Health & Life Sciences",
  "Engineering & Technology",
  "Physical Sciences & Mathematics",
  "Social Sciences",
  "Humanities",
  "Economics & Business",
  "Environment & Sustainability",
];

function navyForField(field: Field): string {
  const i = FIELD_ORDER.indexOf(field);
  return NAVY_STEPS[(i < 0 ? 0 : i) % NAVY_STEPS.length];
}

/**
 * Directory card for one research group.
 *
 * The header block is the card's main surface, not dead space. With no image
 * it carries the project title in Spectral white, the field icon, and the
 * status chip. When a real image exists the image takes the block and the
 * title moves below it.
 *
 * The Apply action is gated on canApply() (Recruiting only) and its URL comes
 * from the Research Group Leader opening, never hardcoded here.
 */
export function ResearchGroupCard({
  group,
  featured = false,
}: {
  group: ResearchGroup;
  /** Larger type and a taller header, for the lead card in a grid. */
  featured?: boolean;
}) {
  const applyable = canApply(group);
  const opening = findOpening("chapter-leader");
  const formPending = !opening || isFormPending(opening);
  const hasImage = Boolean(group.image);

  const place = [group.schoolOrCommunityName, group.location]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="card-hover flex flex-col overflow-hidden rounded-card border border-line bg-surface">
      {hasImage ? (
        <div className="aspect-[16/9] w-full overflow-hidden bg-navy">
          <img
            src={group.image!.src}
            alt={group.image!.alt}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div
          className={cn(
            "flex flex-col justify-between p-6",
            featured ? "min-h-[15rem] md:min-h-[17rem]" : "min-h-[11.5rem]"
          )}
          style={{ backgroundColor: navyForField(group.field) }}
        >
          <div className="flex items-start justify-between gap-3">
            <FieldIcon
              field={group.field}
              size={featured ? 28 : 24}
              className="text-white/80 shrink-0"
            />
            <StatusChip status={group.status} onNavy />
          </div>

          <h3
            className={cn(
              "mt-6 font-display text-white leading-[1.15]",
              featured ? "text-2xl md:text-3xl" : "text-xl"
            )}
          >
            <Link
              to={`/research-groups/${group.slug}`}
              className="hover:underline underline-offset-4"
            >
              {group.projectTitle}
            </Link>
          </h3>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6">
        {hasImage && (
          <>
            <div className="flex items-start justify-between gap-3">
              <FieldIcon
                field={group.field}
                size={24}
                className="text-navy shrink-0"
              />
              <StatusChip status={group.status} />
            </div>
            <h3
              className={cn(
                "mt-3 font-display leading-snug",
                featured ? "text-2xl" : "text-xl"
              )}
            >
              <Link
                to={`/research-groups/${group.slug}`}
                className="hover:text-navy-hi transition-colors"
              >
                {group.projectTitle}
              </Link>
            </h3>
          </>
        )}

        <p
          className={cn(
            "leading-relaxed text-muted",
            hasImage ? "mt-2.5" : "",
            featured ? "text-[17px]" : "text-[15px]"
          )}
        >
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
