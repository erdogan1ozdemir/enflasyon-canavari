"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const OPTS = [
  { value: "system", label: "Sistem" },
  { value: "light", label: "Açık" },
  { value: "dark", label: "Koyu" },
] as const;

// 3-option theme selector for the profile (distinct from the header ThemeToggle).
export function ThemeSetting() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const current = mounted ? theme ?? "system" : "system";

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {OPTS.map((o) => {
        const on = current === o.value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => setTheme(o.value)}
            aria-pressed={on}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: "var(--radius-md)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              border: "1px solid " + (on ? "transparent" : "var(--border-subtle)"),
              background: on ? "var(--accent)" : "var(--surface-card)",
              color: on ? "#fff" : "var(--text-body)",
              transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
