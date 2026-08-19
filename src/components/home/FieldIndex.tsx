import { FieldWheel } from "@/components/visuals/FieldWheel";
import { Section } from "./Section";

/**
 * The field index — makes the "any field" claim visible rather than asserted.
 *
 * Now a radial wheel rather than a list. The wheel earns the space because it
 * shows eight peers around one centre, which is the actual claim: no field is
 * the primary one. A vertical list implied a ranking that does not exist.
 *
 * FieldWheel collapses to a plain list below md, where a radial diagram would
 * be unreadable at that width.
 */
export function FieldIndex() {
  return (
    <Section number="04" title="Eight fields" tone="surface">
      <p className="mt-6 max-w-2xl type-body text-muted">
        A group's field is whatever its question needs. None of these is the
        default.
      </p>
      <FieldWheel className="mt-10" />
    </Section>
  );
}
