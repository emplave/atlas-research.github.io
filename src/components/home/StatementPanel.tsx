/**
 * Oversized typographic panel — Instrument Serif at extreme scale on an ink
 * band, one line.
 *
 * This is a FACTUAL STATEMENT about how the work runs, not a quote. It is
 * attributed to no one and invented from nothing: every clause describes a
 * mechanism stated elsewhere on the site (weekly logs, mentor checkpoints,
 * review deciding publication).
 *
 * NOTE ON BAND COUNT: this is an ink band, but it is a typographic rule rather
 * than a section — it carries no heading, no numeral, and no content. The two
 * *sections* that are ink remain the proof band and the closing CTA.
 */
export function StatementPanel() {
  return (
    <section className="on-ink bg-ink">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <p className="type-panel font-display text-paper max-w-5xl">
          A question, a method, and limitations stated honestly.
        </p>
      </div>
    </section>
  );
}
