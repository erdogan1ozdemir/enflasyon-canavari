'use client';

import React from "react";

export interface ItemRowProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon node shown in the leading tile. */
  icon?: React.ReactNode;
  /** Item name, e.g. "Ekmek". */
  name: React.ReactNode;
  /** Category / unit line under the name. */
  category?: React.ReactNode;
  /** Right-aligned current value, e.g. "₺25,00". */
  value?: React.ReactNode;
  /** Trailing node — usually a <TrendPill/>. */
  trend?: React.ReactNode;
  onClick?: () => void;
}

/**
 * ItemRow — a price item in a list (home, search results, compare picker).
 * Icon tile + name/category on the left, current value + trend on the right.
 */
export default function ItemRow({
  icon = null,
  name,
  category = null,
  value = null,
  trend = null,
  onClick,
  style,
  ...rest
}: ItemRowProps) {
  return (
    <div
      className="ec-item-row"
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        minHeight: 64,
        padding: "12px 16px",
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-md)",
        cursor: onClick ? "pointer" : "default",
        transition: "border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
        ...style,
      }}
      onMouseEnter={onClick ? (e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.background = "var(--surface-inset)"; } : undefined}
      onMouseLeave={onClick ? (e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; e.currentTarget.style.background = "var(--surface-card)"; } : undefined}
      {...rest}
    >
      <span style={{
        width: 40, height: 40, flexShrink: 0,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        borderRadius: "var(--radius-sm)",
        background: "var(--accent-tint)",
        color: "var(--accent-text)",
      }}>{icon}</span>

      <span style={{ display: "flex", flexDirection: "column", gap: 2, minWidth: 0, flex: 1 }}>
        <span style={{ fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: 600, color: "var(--text-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</span>
        {category ? <span style={{ fontFamily: "var(--font-sans)", fontSize: 12.5, color: "var(--text-muted)" }}>{category}</span> : null}
      </span>

      {value != null ? (
        <span style={{ fontFamily: "var(--font-data)", fontVariantNumeric: "tabular-nums", fontSize: 16, fontWeight: 600, color: "var(--text-strong)", whiteSpace: "nowrap" }}>{value}</span>
      ) : null}
      {trend}
    </div>
  );
}
