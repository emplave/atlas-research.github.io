import { Link } from "react-router-dom";

/**
 * Compact "Get involved" entry point. One line, two links — deliberately NOT
 * another full section.
 *
 * Sits between sections as a hairline strip so it does not compete with the
 * numbered sections around it.
 */
export function GetInvolvedLine() {
  return (
    <section className="border-b border-line bg-paper">
      <div className="mx-auto max-w-6xl px-6 py-7 flex flex-wrap items-baseline gap-x-6 gap-y-2">
        <p className="text-[15px] text-muted">
          Not starting a group? There is a way in for you too.
        </p>
        <span className="flex flex-wrap gap-x-5 gap-y-2 text-[15px]">
          <Link to="/get-involved#researchers" className="link">
            For researchers
          </Link>
          <Link to="/get-involved#students" className="link">
            For students
          </Link>
        </span>
      </div>
    </section>
  );
}
