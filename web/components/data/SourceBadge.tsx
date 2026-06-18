import React from "react";

export interface SourceBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Source name, e.g. "TÜİK", "TCMB EVDS", "Resmi Gazete". @default "TÜİK" */
  source?: string;
  /** Net/average qualifier shown after the source. */
  label?: "net" | "ortalama" | string | null;
  /** Verification state. @default "verified" */
  status?: "verified" | "pending";
  /** @default "md" */
  size?: "sm" | "md";
}

/**
 * SourceBadge — the trust motif. Every data point carries one.
 * Teal dot + source name, optional net/ortalama label, optional pending state.
 */
export default function SourceBadge({
  source = "TÜİK",
  label = null,
  status = "verified",
  size = "md",
  style,
  ...rest
}: SourceBadgeProps) {
  const pending = status === "pending";
  const h = size === "sm" ? 22 : 26;
  const fs = size === "sm" ? 11 : 12;
  const fg = pending ? "var(--amber-500)" : "var(--trust-text)";
  const bg = pending ? "var(--amber-50)" : "var(--trust-tint)";
  const bd = pending
    ? "color-mix(in oklch, var(--amber-500) 30%, transparent)"
    : "color-mix(in oklch, var(--trust) 22%, transparent)";

  return (
    <span
      className="ec-source-badge"
      title={pending ? "Doğrulama bekliyor" : `Kaynak: ${source}`}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: h,
        padding: `0 ${size === "sm" ? 8 : 10}px`,
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-sans)",
        fontSize: fs,
        fontWeight: 500,
        lineHeight: 1,
        whiteSpace: "nowrap",
        color: fg,
        background: bg,
        border: `1px solid ${bd}`,
        ...style,
      }}
      {...rest}
    >
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
      <span style={{ fontWeight: 600 }}>{source}</span>
      {label ? <span style={{ opacity: 0.6 }}>· {label}</span> : null}
      {pending ? <span style={{ opacity: 0.8 }}>· beklemede</span> : null}
    </span>
  );
}
