import { BringAtlasCta, CostLine } from "@/components/BringAtlasCta";
import { ValuePropList } from "@/components/ValuePropList";
import { REQUIREMENTS } from "@/data/value-props";

/**
 * /research-groups — A FOUNDER-FACING PAGE.
 *
 * It asks a student to start something, not to join something. That is the whole
 * reason this page was rebuilt: it used to be a directory, and a directory
 * answers "what exists" for someone browsing. Nobody browses this page. The
 * people who reach it are deciding whether to run a group themselves.
 *
 * A founder moves through four questions IN THIS ORDER, and the sections below
 * are those questions:
 *
 *   1. Is this real?        → What you get
 *   2. How hard is it?      → What running a group actually involves
 *   3. What do I get?       → You run it   (the title, the ownership)
 *   4. What is step one?    → One CTA
 *
 * The old page answered only question one, and answered it with a grid of
 * placeholder group cards. Do not reorder these. Putting the commitment before
 * the value asks for sacrifice before offering anything; putting the CTA earlier
 * asks for a decision before the reader has the facts.
 *
 * NO GROUP LISTING, and no empty state standing in for one. There is no
 * directory, no filters, no "no groups yet" — an empty grid advertises absence,
 * and joining an existing group is not currently a path Atlas offers.
 *
 * The value props and requirements are imported, not written here: the homepage
 * renders the same five props from src/data/value-props.ts.
 */
export function ResearchGroups() {
  return (
    <div className="bg-paper">
      {/* ---------------------------------------------------------------- */}
      {/* Header. The cost line sits here, high and before any section.     */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 pt-16 md:pt-24 pb-12">
          <p className="meta-label">Research groups</p>
          <h1 className="type-hero font-display max-w-3xl">
            Lead an Atlas research group.
          </h1>
          <p className="mt-8 max-w-2xl type-body text-muted">
            You pick the question, recruit three or more members, and finish a
            paper in one semester. At a school, in a community, or entirely
            online.
          </p>
          <CostLine className="mt-5 max-w-2xl" />
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 1 — Is this real? What you get.                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-18">
          <p className="meta-label">01</p>
          <h2 className="type-section font-display mt-3">What you get.</h2>

          <ValuePropList className="mt-10" />
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
      {/* 3 — What do I get called? The ownership.                          */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-6 py-14 md:py-18">
          <p className="meta-label">03</p>
          <h2 className="type-section font-display mt-3">You run it.</h2>
          <p className="mt-7 max-w-3xl type-body text-muted">
            You are your group's{" "}
            <span className="text-ink">Principal Researcher</span>. You choose
            the research question, recruit your members, and run the meetings.
            Atlas provides the curriculum, the mentors, and the publication
            pathway. The group is yours.
          </p>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* 4 — Step one. Ink band, one CTA, nothing competing with it.        */}
      {/* ---------------------------------------------------------------- */}
      <section className="on-ink bg-ink">
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
          <p className="meta-label">04</p>
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
