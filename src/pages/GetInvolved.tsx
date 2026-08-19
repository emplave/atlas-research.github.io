import {
  CATEGORY_LABEL,
  effectiveStatus,
  isFormPending,
  researchGroupOpenings,
  teamOpenings,
  type Opening,
} from "@/data/openings";
import { CONTACT_EMAIL } from "@/lib/dates";
import { HatchDivider } from "@/components/visuals/HatchDivider";

/**
 * Get Involved — the front door for anyone who is not starting a research
 * group.
 *
 * Two tracks on one page, both anchored: #researchers and #students.
 *
 * The researchers track comes FIRST and is an INVITATION, not a roster. There
 * is no advisor grid, no names, and nothing implying anyone has signed up. A
 * future named-contributor row can slot in via CONTRIBUTORS below without a
 * redesign.
 *
 * The students track renders entirely from src/data/openings.ts. Adding,
 * editing, opening, or closing a role must remain a one-file change there.
 */

/** Prefilled mailto, so an enquiry arrives already sorted. */
function mailto(subject: string): string {
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}

const WAYS = [
  {
    title: "Run a guest session",
    body: "A 30 to 40 minute conversation with student researchers about how you actually work: how you choose questions, what you do when data disappoints, how you handle a result you did not expect. Recorded with your permission so groups in other time zones can watch it. Atlas handles scheduling, the invite, and the recording.",
    cta: "Offer a guest session",
    subject: "Guest session — offer to speak with Atlas research groups",
  },
  {
    title: "Mentor a research group",
    body: "Periodic feedback on one group's question, sources, and draft. Realistically this is two to four hours a term, spread across three or four checkpoints, plus reading a draft near the end. It is not weekly, and it is not open-ended: the commitment ends when the group's project does.",
    cta: "Offer to mentor a group",
    subject: "Mentorship — offer to mentor an Atlas research group",
  },
  {
    title: "Review for the journal",
    body: "Read submitted student work against the Atlas Journal's stated criteria and return a recommendation. Most reviews are one manuscript at a time, on your own schedule. Reviewers decide what advances; revision is the normal outcome and saying so plainly is part of the job.",
    cta: "Offer to review",
    subject: "Journal review — offer to review for the Atlas Journal",
  },
  {
    title: "Institutional or organisational partnership",
    body: "For universities, journals, labs, schools, and nonprofits: submission routes, shared programming, or supporting groups in a particular region. These conversations run through the Partners page.",
    cta: "See the Partners page",
    href: "/partners",
  },
];

/**
 * Named contributors, for a future row beneath the invitation.
 *
 * EMPTY UNTIL CONFIRMED. Never add a name without that person having agreed to
 * appear — a named researcher on this page reads as an endorsement.
 */
const CONTRIBUTORS: { name: string; affiliation: string; role: string }[] = [];

export function GetInvolved() {
  return (
    <div className="bg-paper">
      <section className="border-b border-line">
        <div className="mx-auto max-w-4xl px-6 pt-16 md:pt-20 pb-12">
          <p className="meta-label">Get involved</p>
          <h1 className="type-hero font-display mt-4">
            Two ways in.
          </h1>
          <p className="mt-6 max-w-2xl type-body text-muted">
            Researchers and professionals can teach, mentor, and review.
            Students can lead a research group or join the Atlas team. Both
            start below.
          </p>
          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-[15px]">
            <a href="#researchers" className="link">
              Researchers and professionals
            </a>
            <a href="#students" className="link">
              Students
            </a>
          </p>
        </div>
      </section>

      {/* ---------------- TRACK 1 — Researchers (first) ---------------- */}
      <section id="researchers" className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <p className="meta-label">Track one</p>
          <h2 className="type-section font-display mt-3">
            Researchers and professionals
          </h2>

          {/*
            The real objection a busy researcher has is that this will become a
            teaching obligation with prep. Answer it in the first paragraph
            rather than at the bottom of the page.
          */}
          <p className="mt-7 max-w-2xl type-body text-muted">
            Atlas is a student-led research program. Guest sessions are
            conversational — no lecture, no slides, no preparation expected. You
            talk about your work and answer questions.
          </p>

          <div className="mt-10 grid gap-px border border-line bg-line md:grid-cols-2">
            {WAYS.map((way) => (
              <div key={way.title} className="bg-paper p-6 md:p-7 flex flex-col">
                <h3 className="type-card font-display">{way.title}</h3>
                <p className="mt-3 flex-1 text-[15px] text-muted leading-relaxed">
                  {way.body}
                </p>
                <p className="mt-5">
                  {way.href ? (
                    <a href={way.href} className="text-[15px] link">
                      {way.cta}
                    </a>
                  ) : (
                    <a
                      href={mailto(way.subject as string)}
                      className="text-[15px] link"
                    >
                      {way.cta}
                    </a>
                  )}
                </p>
              </div>
            ))}
          </div>

          {CONTRIBUTORS.length > 0 && (
            <div className="mt-10 pt-8 border-t border-line">
              <p className="meta-label">Contributors</p>
              <ul className="mt-4 grid gap-3 md:grid-cols-2">
                {CONTRIBUTORS.map((c) => (
                  <li key={c.name} className="text-[15px] text-ink">
                    {c.name}
                    <span className="text-muted">
                      , {c.affiliation} · {c.role}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <HatchDivider id="get-involved" className="bg-paper" />

      {/* ---------------- TRACK 2 — Students ---------------- */}
      <section id="students" className="border-t border-line bg-paper">
        <div className="mx-auto max-w-5xl px-6 py-12 md:py-16">
          <p className="meta-label">Track two</p>
          <h2 className="type-section font-display mt-3">Students</h2>
          <p className="mt-7 max-w-2xl type-body text-muted">
            Two separate pathways. You may hold both.
          </p>

          <RoleGroup
            label={CATEGORY_LABEL.chapter}
            openings={researchGroupOpenings()}
          />
          <RoleGroup label={CATEGORY_LABEL.team} openings={teamOpenings()} />
        </div>
      </section>
    </div>
  );
}

function RoleGroup({
  label,
  openings,
}: {
  label: string;
  openings: Opening[];
}) {
  if (openings.length === 0) return null;
  return (
    <div className="mt-12 first:mt-10">
      <h3 className="font-display text-[26px]">{label}</h3>
      <div className="mt-6 space-y-5">
        {openings.map((opening) => (
          <RoleCard key={opening.slug} opening={opening} />
        ))}
      </div>
    </div>
  );
}

/**
 * One role. Closed roles still render, visibly marked and without a link — a
 * disappearing role looks like a site error to someone who bookmarked it.
 */
function RoleCard({ opening }: { opening: Opening }) {
  const status = effectiveStatus(opening);
  const closed = status === "closed";
  const pending = isFormPending(opening);

  return (
    <article className="rounded-card border border-line bg-surface p-6 md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0">
          <h4 className="type-card font-display">{opening.title}</h4>
          <p className="mt-1.5 meta-label">{opening.area}</p>
        </div>
        <span
          className={
            "shrink-0 inline-flex items-center rounded-full border px-2.5 py-1 meta-label " +
            (closed
              ? "border-line text-faint"
              : "border-ink/40 bg-ink/[0.05] !text-ink")
          }
        >
          {closed ? "Closed" : status === "rolling" ? "Rolling" : "Open"}
        </span>
      </div>

      <p className="mt-4 text-[15px] text-ink">{opening.oneLine}</p>

      <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm">
        {opening.commitment && (
          <Meta label="Commitment">{opening.commitment}</Meta>
        )}
        {opening.selectivity && (
          <Meta label="Selectivity">{opening.selectivity}</Meta>
        )}
        <Meta label="Deadline">
          {opening.deadline ? formatDate(opening.deadline) : "Rolling"}
        </Meta>
      </dl>

      <div className="mt-5 space-y-4 text-[15px] text-muted leading-relaxed">
        {opening.description.split(/\n\s*\n/).map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {opening.regions && opening.regions.length > 0 && (
        <div className="mt-6">
          <p className="meta-label">Regions</p>
          <ul className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-muted">
            {opening.regions.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <BulletList title="Responsibilities" items={opening.responsibilities} />
        <BulletList title="What we look for" items={opening.lookingFor} />
      </div>

      <div className="mt-7 pt-5 border-t border-line flex flex-wrap items-center gap-4">
        {closed ? (
          <span className="text-[15px] text-faint">
            This role is not accepting applications.
          </span>
        ) : pending ? (
          <span
            aria-disabled="true"
            className="rounded-control border border-line px-5 py-2.5 text-sm text-muted cursor-not-allowed"
          >
            Opening soon
          </span>
        ) : (
          <a
            href={opening.formUrl as string}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-control bg-ink text-paper px-5 py-2.5 text-sm hover:bg-ink-hover transition-colors"
          >
            Apply
          </a>
        )}
        {!closed && opening.formNote && (
          <span className="text-sm text-muted">{opening.formNote}</span>
        )}
      </div>
    </article>
  );
}

function Meta({
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

function BulletList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="meta-label">{title}</p>
      <ul className="mt-2.5 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2.5 text-[15px] text-muted leading-relaxed"
          >
            <span aria-hidden className="text-faint shrink-0">
              —
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function formatDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
