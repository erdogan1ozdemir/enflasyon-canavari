"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "./Icon";

const TABS = [
  { href: "/", label: "Kalemler", icon: "home" },
  { href: "/karsilastir", label: "Karşılaştır", icon: "scale" },
  { href: "/hesapla", label: "Hesapla", icon: "calculator" },
  { href: "/profil", label: "Profil", icon: "user" },
] as const;

function isActive(pathname: string, href: string): boolean {
  if (href === "/") {
    // Home is active for "/" and "/kalem/*" (detail pages)
    return pathname === "/" || pathname.startsWith("/kalem/");
  }
  return pathname === href || pathname.startsWith(href + "/");
}

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "var(--container-sm, 480px)",
        display: "flex",
        borderTop: "1px solid var(--border-subtle)",
        background: "var(--surface-card)",
        zIndex: 10,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {TABS.map((tab) => {
        const active = isActive(pathname, tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 3,
              padding: "10px 0 8px",
              textDecoration: "none",
              color: active ? "var(--accent)" : "var(--text-muted)",
              minHeight: "var(--tap-min, 44px)",
            }}
            aria-current={active ? "page" : undefined}
          >
            <Icon
              name={tab.icon}
              size={21}
              strokeWidth={active ? 2.4 : 2}
            />
            <span
              style={{
                fontSize: 11,
                fontWeight: active ? 600 : 500,
                lineHeight: 1,
              }}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
