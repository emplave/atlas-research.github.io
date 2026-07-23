import { ReactNode, useState } from "react";
import { FORM_ENDPOINT, APPLY_EMAIL } from "@/lib/dates";

export function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline gap-2">
        <span className="text-sm text-navy-800">{label}</span>
        {required ? (
          <span className="text-gold-600 text-xs" aria-hidden>
            required
          </span>
        ) : (
          <span className="text-navy-400 text-xs">optional</span>
        )}
      </span>
      {hint && <span className="block mt-0.5 text-xs text-navy-500">{hint}</span>}
      <span className="block mt-2">{children}</span>
    </label>
  );
}

export const inputCls =
  "w-full rounded-xl border border-hairline bg-cream-50 px-4 py-2.5 text-[15px] text-navy-900 placeholder:text-navy-400 focus:outline-none focus:border-navy-400 transition-colors";

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
          "mt-1 text-right font-mono text-[11px] " +
          (bad ? "text-gold-600" : "text-navy-400")
        }
      >
        {words} words · target {min}–{max}
      </p>
    </div>
  );
}

export type SubmitState = "idle" | "sending" | "sent" | "error";

/**
 * Submits to FORM_ENDPOINT when configured; otherwise opens a prefilled
 * email draft (guaranteed-functional fallback, no fake door).
 */
export async function submitApplication(
  kind: string,
  data: Record<string, string>,
  setState: (s: SubmitState) => void
): Promise<void> {
  setState("sending");
  if (FORM_ENDPOINT) {
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, ...data, submittedAt: new Date().toISOString() }),
      });
      setState(res.ok ? "sent" : "error");
      return;
    } catch {
      setState("error");
      return;
    }
  }
  const body = Object.entries(data)
    .map(([k, v]) => `${k}:\n${v}`)
    .join("\n\n");
  window.location.href = `mailto:${APPLY_EMAIL}?subject=${encodeURIComponent(
    `${kind} submission`
  )}&body=${encodeURIComponent(body.slice(0, 1800))}`;
  setState("sent");
}
