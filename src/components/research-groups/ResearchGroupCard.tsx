import { Link } from "react-router-dom";
import {
  canApply,
  settingLine,
  type Field,
  type ResearchGroup,
} from "@/data/research-groups";
import { memberApplicationUrl } from "@/lib/memberApplication";
import { FieldIcon } from "@/components/FieldIcon";
import { StatusChip } from "./StatusChip";
import { cn } from "@/lib/utils";

/**
 * Four greys from ink (#0E0E10) up to #3A3A40.
 *
 * Assigned deterministically by field, so the same field always gets the same
 * tint and consecutive cards in a grid are not identical slabs. Deterministic
 * rather than random because a tint that changes between renders reads as a
 * bug, and because a reader should be able to learn the association.
 */
const INK_STEPS = ["#0E0E10", "#1B1B1F", "#2A2A2F", "#3A3A40"] as const;

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

function inkForField(field: Field): string {
  const i = FIELD_ORDER.indexOf(field);
  return INK_STEPS[(i < 0 ? 0 : i) % INK_STEPS.length];
}

/**
 * "Taking members" — the scannable signal that a group is open.
 *
 * WHY IT EXISTS. The only indication used to be the apply link at the bottom of
 * the card, which is invisible when scanning a grid of six: the eye reads
 * headers, not footers. This puts the fact where the status already is.
 *
 * DRIVEN BY canApply, THE SAME PREDICATE AS THE BUTTON. That is the point of
 * passing a boolean in rather than recomputing it here — the marker and the
 * action cannot disagree, so a card can never say "taking members" and offer no
 * way to apply, or vice versa.
 *
 * Same shape as StatusChip and monochrome, but INVERTED — filled ink on paper,
 * filled paper on ink — because it is the one thing on the card a reader is
 * scanning for. Every status chip is an outline, so the fill reads as a
 * different kind of thing rather than as a louder status.
 */
function TakingMembers({ onInk = false }: { onInk?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 meta-label",
        onInk ? "bg-paper !text-ink" : "bg-ink !text-paper"
      )}
    >
      Taking members
    </span>
  );
}

/**
 * Directory card for one research group.
 *
 * The header block is the card's main surface, not dead space. With no image
 * it carries the project title in Instrument Serif, the field icon, and the
 * status chip. When a real image exists the image takes the block and the
 * title moves below it.
 *
 * TWO THINGS COME FROM canApply(), and only from it: the "Taking members" marker
 * in the header and the "Apply to join" button in the footer. Both read the same
 * predicate so they cannot contradict each other — a card that advertises intake
 * always offers a way in.
 *
 * canApply() is now RecruitingOpen alone. The link itself always exists, because
 * memberApplicationUrl() generates one from the project title when the Sheet's
 * override column is empty, which is every group today.
 *
 * The action points at the MEMBER application. It must never point at the
 * start-a-group form; those are different questions for different people. See
 * src/lib/memberApplication.ts.
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
  const hasImage = Boolean(group.image);

  const where = settingLine(group);

  return (
    <article className="card-hover flex flex-col overflow-hidden rounded-card border border-line bg-surface">
      {hasImage ? (
        <div className="aspect-[16/9] w-full overflow-hidden bg-ink">
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
            /*
             * BOUNDED, not proportional. A literal 16:9 is wrong here: the
             * featured card spans two of three columns, so at ~740px wide 16:9
             * computes to ~416px — which is the void, not the fix. These are
             * capped heights instead, and the title sits at the bottom of that
             * capped box rather than at the bottom of a stretched one.
             *
             * min-h rather than a fixed h so a long title can still push the
             * box taller instead of being clipped.
             */
            featured ? "min-h-[12rem] md:min-h-[13rem]" : "min-h-[11.5rem]"
          )}
          style={{ backgroundColor: inkForField(group.field) }}
        >
          <div className="flex items-start justify-between gap-3">
            <FieldIcon
              field={group.field}
              size={featured ? 28 : 24}
              className="text-paper/80 shrink-0"
            />
            {/* flex-wrap so a long status and the marker do not overflow. */}
            <div className="flex flex-wrap items-center justify-end gap-2">
              {applyable && <TakingMembers onInk />}
              <StatusChip status={group.status} onInk />
            </div>
          </div>

          <h3
            className={cn(
              "mt-6 font-display text-paper leading-[1.15]",
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
                className="text-ink shrink-0"
              />
              <div className="flex flex-wrap items-center justify-end gap-2">
                {applyable && <TakingMembers />}
                <StatusChip status={group.status} />
              </div>
            </div>
            <h3
              className={cn(
                "mt-3 font-display leading-snug",
                featured ? "text-2xl" : "text-xl"
              )}
            >
              <Link
                to={`/research-groups/${group.slug}`}
                className="hover:underline underline-offset-4"
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
          <Row label="Setting">{where}</Row>
          <Row label="Members">{group.memberCount}</Row>
        </dl>

        <div className="mt-6 pt-4 border-t border-line flex items-center justify-between gap-4">
          <Link
            to={`/research-groups/${group.slug}`}
            className="text-sm link"
          >
            Read the brief
          </Link>

          {applyable && (
            <a
              href={memberApplicationUrl(group)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-control bg-ink text-paper px-4 py-2 text-sm hover:bg-ink-hover transition-colors"
            >
              Apply to join
            </a>
          )}
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
