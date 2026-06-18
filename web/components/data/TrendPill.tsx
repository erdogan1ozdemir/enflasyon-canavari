import React from "react";

export interface TrendPillProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Number (auto +/- sign & %) or preformatted string ("×62"). */
  value: number | string;
  /** Force direction; otherwise inferred from numeric sign. */
  direction?: "up" | "down";
  /** @default true */
  showArrow?: boolean;
  /** @default "md" */
  size?: "sm" | "md";
}

/**
 * TrendPill — direction + magnitude. Rises read coral (the monster bites),
 * falls read teal. Renders its own arrow glyph.
 */
export default function TrendPill({ value, direction, size = "md", showArrow = true, style, ...rest }: TrendPillProps) {
  // auto-direction from numeric value if not given
  const dir = direction || (typeof value === "number" ? (value >= 0 ? "up" : "down") : "up");
  const up = dir === "up";
  const fg = up ? "var(--rise)" : "var(--fall)";
  const bg = up ? "var(--rise-tint)" : "var(--fall-tint)";
  const h = size === "sm" ? 22 : 26;
  const fs = size === "sm" ? 12 : 13;

  const text = typeof value === "number"
    ? `${value > 0 ? "+" : ""}%${Math.abs(value).toLocaleString("tr-TR")}`
    : value;

  return (
    <span
      className="ec-trend-pill"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        height: h,
        padding: `0 ${size === "sm" ? 8 : 10}px`,
        borderRadius: "var(--radius-pill)",
        fontFamily: "var(--font-data)",
        fontVariantNumeric: "tabular-nums",
        fontSize: fs,
        fontWeight: 600,
        lineHeight: 1,
        color: fg,
        background: bg,
        ...style,
      }}
      {...rest}
    >
      {showArrow ? (
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0 }} aria-hidden="true">
          <path
            d={up ? "M6 2.5 L10 7 H7.5 V10 H4.5 V7 H2 Z" : "M6 9.5 L2 5 H4.5 V2 H7.5 V5 H10 Z"}
            fill="currentColor"
          />
        </svg>
      ) : null}
      {text}
    </span>
  );
}
