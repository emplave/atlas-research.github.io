import { BringAtlasCta } from "./BringAtlasCta";

/**
 * Section 8 — closing CTA. INK FULL-BLEED.
 *
 * The second and final ink band on the page. One button, no secondary link: the
 * "Browse research groups" companion is gone with the directory, and a closing
 * band is the last place to offer a reader an alternative to the action.
 *
 * The homepage carries no path to the fellowship application.
 */
export function Closing() {
  return (
    <section id="start" className="on-ink bg-ink">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
        <h2 className="type-section font-display">
          Bring Atlas to your school this semester.
        </h2>
        <p className="mt-5 text-lg text-paper/75 leading-relaxed">
          Pick a question, recruit three or more members, and submit the finished
          paper for review. Free.
        </p>

        <div className="mt-9">
          <BringAtlasCta tone="paper" />
        </div>
        <p className="mt-4 text-sm text-paper/70">Takes about two minutes.</p>
      </div>
    </section>
  );
}
