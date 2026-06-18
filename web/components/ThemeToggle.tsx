"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Icon } from "./Icon";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Render a neutral placeholder until mounted to avoid hydration mismatch
  if (!mounted) {
    return (
      <button
        aria-label="Tema değiştir"
        style={{
          width: "var(--tap-min, 44px)",
          height: "var(--tap-min, 44px)",
          borderRadius: "var(--radius-pill)",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--surface-inset)",
          border: "1px solid var(--border-subtle)",
          color: "var(--text-body)",
          flexShrink: 0,
        }}
        disabled
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
      style={{
        width: "var(--tap-min, 44px)",
        height: "var(--tap-min, 44px)",
        borderRadius: "var(--radius-pill)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--surface-inset)",
        border: "1px solid var(--border-subtle)",
        color: "var(--text-body)",
        flexShrink: 0,
      }}
    >
      <Icon name={isDark ? "sun" : "moon"} size={18} />
    </button>
  );
}
