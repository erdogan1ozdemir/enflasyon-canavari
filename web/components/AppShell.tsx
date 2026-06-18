import type { ReactNode } from "react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { BottomNav } from "./BottomNav";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100svh",
        background: "var(--bg-app)",
      }}
    >
      {/* Centered column */}
      <div
        style={{
          width: "100%",
          maxWidth: "var(--container-sm, 480px)",
          marginLeft: "auto",
          marginRight: "auto",
          display: "flex",
          flexDirection: "column",
          flex: 1,
        }}
      >
        {/* Sticky header */}
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "0 18px",
            height: 56,
            borderBottom: "1px solid var(--border-subtle)",
            background: "var(--surface-card)",
            position: "sticky",
            top: 0,
            zIndex: 5,
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 9,
              textDecoration: "none",
              flex: 1,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/monster-mark.svg"
              width={28}
              height={28}
              alt=""
              aria-hidden="true"
            />
            <span
              style={{
                fontWeight: 800,
                fontSize: 17,
                letterSpacing: "-0.02em",
                color: "var(--text-strong)",
                fontFamily: "var(--font-sans)",
              }}
            >
              Enflasyon Canavarı
            </span>
          </Link>
          <ThemeToggle />
        </header>

        {/* Page content — padded bottom to clear fixed nav */}
        <main
          style={{
            flex: 1,
            paddingBottom: "calc(var(--tap-min, 44px) + 24px + env(safe-area-inset-bottom, 0px))",
          }}
        >
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
