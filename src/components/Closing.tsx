import { BringAtlasCta } from "./BringAtlasCta";

/**
 * Section 8 — closing CTA. INK FULL-BLEED.
 *
 * The second and final ink band on the page. One button, no secondary link: a
 * closing band is the last place to offer a reader an alternative to the action,
 * and the group listing they would be sent to is already far above them.
 *
 * THE HEADING MUST NOT RESTATE THE BUTTON. It read "Lead an Atlas research group
 * this semester." until the fixed-term claim was removed everywhere, which left
 * it as "Lead an Atlas research group." — word for word the label on the control
 * directly beneath it. A heading that repeats its own button spends the last
 * line on the page saying nothing new.
 *
 * So the heading now names the MOTIVE and the button names the ACTION. "Pick a
 * question you actually care about." is the reason someone would press it; "Lead
 * an Atlas research group" is what pressing it does. Do not harmonise them, and
 * do not restore a heading that begins "Lead".
 *
 * The homepage carries no path to the fellowship application.
 */
export function Closing() {
  return (
    <section id="start" className="on-ink bg-ink">
      <div className="mx-auto max-w-3xl px-6 py-16 md:py-20 text-center">
        <h2 className="type-section font-display">
          Pick a question you actually care about.
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
