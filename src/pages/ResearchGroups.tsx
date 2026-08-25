import { BringAtlasCta, CostLine } from "@/components/BringAtlasCta";
import { ValuePropList } from "@/components/ValuePropList";
import { REQUIREMENTS } from "@/data/value-props";
import { isVisibleByDefault, sortForListing } from "@/data/research-groups";
import { useResearchGroups } from "@/lib/useResearchGroups";
import { GroupGridSkeleton } from "@/components/research-groups/GroupCardSkeleton";
import { ResearchGroupCard } from "@/components/research-groups/ResearchGroupCard";

/**
 * /research-groups — A FOUNDER-FACING PAGE.
 *
 * It asks a student to start something, not to join something. That is the whole
 * reason this page was rebuilt: it used to be a directory, and a directory
 * answers "what exists" for someone browsing. Nobody browses this page. The
 * people who reach it are deciding whether to run a group themselves.
 *
 * A founder moves through these questions IN THIS ORDER, and the sections below
 * are those questions:
 *
 *   1. Is this real? What do I get?  → the value props
 *   2. How hard is it?               → What running a group actually involves
 *   3. What is step one?             → One CTA
 *
 * THERE WAS A FOURTH, "You run it.", and it is deleted. The first value prop is
 * "You lead it." — "You are the Principal Researcher. You choose the question,
 * pick your members, and run the meetings." That section said the same thing in
 * the same order, and said it SECOND, so the page repeated itself. The prop
 * supersedes it and lands the point earlier, where status-before-features does
 * the work.
 *
 * The old page answered only question one, and answered it with a grid of
 * placeholder group cards. Do not reorder these. Putting the commitment before
 * the value asks for sacrifice before offering anything; putting the CTA earlier
 * asks for a decision before the reader has the facts.
 *
 * THE LISTING SITS ABOVE ALL FOUR, so a visitor meets real groups before being
 * asked to start one. It was removed when every group on the site was a
 * fabricated placeholder and is back now that real groups exist. Proof, then
 * pitch — reversing that asks someone to commit before showing them anything.
 *
 * NO FILTERS. Six groups do not need filtering, and DirectoryFilters is still in
 * git history (at 81dc692) for when they do.
 *
 * NO EMPTY STATE. When nothing is published the listing section is omitted
 * entirely and the page reads as the founder page it was — an empty grid or a
 * "none yet" line advertises absence. All six rows are published now, so that
 * path is currently unused.
 *
 * ONE PRIMARY CTA. The listing carries no "browse" or "see all" action of its
 * own; the only button on the page is "Lead an Atlas research group".
 *
 * The value props and requirements are imported, not written here: the homepage
 * renders the same five props from src/data/value-props.ts.
 */
export function ResearchGroups() {
  const { groups, loading } = useResearchGroups();

  /*
   * Groups taking members first, newest first within each half. Archived
   * excluded by the same rule the homepage uses.
   *
   * The order comes from sortForListing, which reads canApply — the same
   * predicate as the marker and the button — so a card marked "Taking members"
   * can never sort below one that is not. See src/data/research-groups.ts,
   * including the note on why the secondary date sort is currently arbitrary.
   */
  const listed = sortForListing(groups.filter(isVisibleByDefault));

  const showListing = loading || listed.length > 0;

  return (
    <div className="bg-paper">
      {/* ---------------------------------------------------------------- */}
      {/* Header. The cost line sits here, high and before any section.     */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-24 pb-12">
          <p className="meta-label">Research groups</p>
          {/*
            The page title NAMES the page; the ask lives in the section 01
            heading, which reads "Lead a research group." Both used to say the
            same sentence, two sections apart.
          */}
          <h1 className="type-hero font-display max-w-3xl">Research groups.</h1>
          <p className="mt-8 max-w-2xl type-body text-muted">
            You pick the question, recruit three or more members, and finish a
            paper in one semester. At a school, in a community, or entirely
            online.
          </p>
          <CostLine className="mt-5 max-w-2xl" />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* THE LISTING — real groups, before the pitch to start one.         */}
      {/* Omitted entirely when nothing is published.                       */}
      {/* ---------------------------------------------------------------- */}
      {showListing && (
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-6 py-14 md:py-18">
            {/*
              NO HEADING HERE. It read "Research groups." — which is now the page
              h1, directly above this section, so the two were the same sentence
              twice in a row. The h1 names the page and this is the page's first
              content, so it needs no second label.

              The line below is kept: it says what the list is and what the marker
              means, and asserts nothing about progress. Any heading added back
              here must avoid claiming activity — every group is Forming with one
              member, which is why "Groups running now" was wrong before.
            */}
            <p className="max-w-2xl type-body text-muted">
              Every published Atlas research group. Groups taking new members are
              marked.
            </p>

            {loading ? (
              <div className="mt-10">
                <GroupGridSkeleton />
              </div>
            ) : (
              <div className="mt-10 grid items-start gap-5 md:grid-cols-2 lg:grid-cols-3">
                {listed.map((group) => (
                  <ResearchGroupCard key={group.slug} group={group} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* 1 — Is this real? What you get.                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-18">
          <p className="meta-label">01</p>
          {/*
            "What you get." is gone — ValuePropList carries its own heading now.
            Two headings in a row said the same thing.
          */}
          <ValuePropList className="mt-3" />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 2 — How hard is it? The commitment, stated without softening.     */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-18">
          <p className="meta-label">02</p>
          <h2 className="type-section font-display mt-3">
            What running a group actually involves.
          </h2>

          {/*
            A plain list with a rule between items, not cards. These are facts a
            founder is checking off against their own situation, and cards would
            invite skimming past the one that matters to them.
          */}
          <ul className="mt-9 max-w-3xl divide-y divide-line border-t border-line">
            {REQUIREMENTS.map((item) => (
              <li key={item} className="py-4 type-body text-ink">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 3 — Step one. Ink band, one CTA, nothing competing with it.        */}
      {/* ---------------------------------------------------------------- */}
      <section className="on-ink bg-ink">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
          <p className="meta-label">03</p>
          <h2 className="type-section font-display mt-3">
            Start with the application.
          </h2>
          <div className="mt-9">
            <BringAtlasCta tone="paper" />
          </div>
          <p className="mt-4 text-sm text-paper/70">Takes about two minutes.</p>
        </div>
      </section>
    </div>
  );
}
