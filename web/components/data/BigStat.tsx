import React from "react";

export interface BigStatProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The headline value, preformatted ("×62", "+%6.150", "₺25,00"). */
  value: React.ReactNode;
  /** Small uppercase label above. */
  eyebrow?: React.ReactNode;
  /** Muted line below (often a SourceBadge goes in children instead). */
  caption?: React.ReactNode;
  /** @default "xl" */
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  /** @default "accent" */
  tone?: "accent" | "strong" | "rise" | "fall";
  /** @default "left" */
  align?: "left" | "center";
  children?: React.ReactNode;
}

/**
 * BigStat — the punchy hero number ("×62", "+%6.150", "₺25").
 * Geist Mono, tabular, tight. Optional eyebrow above + caption/source below.
 */
export default function BigStat({
  value,
  eyebrow = null,
  caption = null,
  size = "xl",
  tone = "accent",
  align = "left",
  children,
  style,
  ...rest
}: BigStatProps) {
  const sizes: Record<string, string> = {
    sm: "var(--num-md)", md: "var(--num-lg)", lg: "var(--num-xl)",
    xl: "var(--num-2xl)", "2xl": "var(--num-3xl)",
  };
  const tones: Record<string, string> = {
    accent: "var(--accent)", strong: "var(--text-strong)",
    rise: "var(--rise)", fall: "var(--fall)",
  };
  return (
    <div
      className="ec-bigstat"
      style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: align === "center" ? "center" : "flex-start", textAlign: align, ...style }}
      {...rest}
    >
      {eyebrow ? (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-xs)", fontWeight: 600, letterSpacing: "var(--ls-caps)", textTransform: "uppercase", color: "var(--text-muted)" }}>
          {eyebrow}
        </span>
      ) : null}
      <span style={{
        fontFamily: "var(--font-data)",
        fontVariantNumeric: "tabular-nums",
        fontWeight: 700,
        fontSize: sizes[size] ?? sizes.xl,
        letterSpacing: "var(--ls-tight)",
        lineHeight: 1,
        color: tones[tone] ?? tones.accent,
      }}>
        {value}
      </span>
      {caption ? (
        <span style={{ fontFamily: "var(--font-sans)", fontSize: "var(--text-sm)", color: "var(--text-muted)" }}>{caption}</span>
      ) : null}
      {children}
    </div>
  );
}
