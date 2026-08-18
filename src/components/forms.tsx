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
  "w-full rounded-control border border-line bg-paper px-4 py-2.5 text-[15px] text-ink placeholder:text-muted focus:outline-none focus:border-navy transition-colors";

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

/**
 * Submits to FORM_ENDPOINT.
 *
 * THERE IS NO MAILTO FALLBACK. A mailto: handler is a dead end for anyone
 * without a configured desktop mail client, and it silently loses the
 * submission — which is worse than telling the reader the form is not open.
 *
 * When FORM_ENDPOINT is null, callers must render the form visibly DISABLED
 * (see isFormEndpointConfigured below) rather than call this. Calling it
 * without an endpoint is a programming error and reports "error".
 */
export async function submitApplication(
  kind: string,
  data: Record<string, string>,
  setState: (s: SubmitState) => void
): Promise<void> {
  if (!FORM_ENDPOINT) {
    setState("error");
    return;
  }
  setState("sending");
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, ...data, submittedAt: new Date().toISOString() }),
    });
    setState(res.ok ? "sent" : "error");
  } catch {
    setState("error");
  }
}

/**
 * True when a real submission endpoint exists. Pages gate their forms on this
 * and render a disabled state when it is false.
 */
export function isFormEndpointConfigured(): boolean {
  return Boolean(FORM_ENDPOINT);
}
