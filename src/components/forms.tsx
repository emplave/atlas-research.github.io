import { ReactNode, useState } from "react";
import { FORM_ENDPOINT } from "@/lib/dates";

export function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  /** Inline validation message, shown under the control when set. */
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline gap-2">
        <span className="text-sm text-ink">{label}</span>
        {required ? (
          <span className="text-muted text-xs">required</span>
        ) : (
          <span className="text-muted text-xs">optional</span>
        )}
      </span>
      {hint && <span className="block mt-0.5 text-xs text-muted">{hint}</span>}
      <span className="block mt-2">{children}</span>
      {error && (
        <span role="alert" className="block mt-1.5 text-xs text-alert">
          {error}
        </span>
      )}
    </label>
  );
}

export const inputCls =
  "w-full rounded-control border border-line bg-paper px-4 py-2.5 text-[15px] text-ink placeholder:text-muted focus:outline-none focus:border-ink transition-colors";

export function WordCountArea({
  name,
  min,
  max,
  placeholder,
  value,
  onChange,
}: {
  name: string;
  min: number;
  max: number;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const words = value.trim() ? value.trim().split(/\s+/).length : 0;
  const bad = words > 0 && (words < min || words > max);
  return (
    <div>
      <textarea
        name={name}
        rows={6}
        className={inputCls + " resize-y min-h-32"}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p
        className={
          "mt-1 text-right font-sans text-[11px] " +
          (bad ? "text-alert" : "text-muted")
        }
      >
        {words} words · target {min}–{max}
      </p>
    </div>
  );
}

export type SubmitState = "idle" | "sending" | "sent" | "error";

/*
 * submitApplication() was removed here when /partners was wired up.
 *
 * It POSTed in CORS mode and read `res.ok`, which does not work against these
 * Apps Script endpoints: /exec answers with a 302 to a target that sends no
 * Access-Control-Allow-Origin header, so the fetch rejects AFTER the row has
 * been written and the sender is told it failed when it had not.
 *
 * Both forms now post inline with `mode: "no-cors"` — see the comments in
 * src/pages/Fellowship.tsx and src/pages/Partners.tsx. Do not reintroduce a
 * shared CORS-mode helper; it would be a trap that looks correct.
 */

/**
 * True when a real submission endpoint exists. Pages gate their forms on this
 * and render a disabled state when it is false.
 */
export function isFormEndpointConfigured(): boolean {
  return Boolean(FORM_ENDPOINT);
}
