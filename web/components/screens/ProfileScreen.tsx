"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Icon, type IconName } from "@/components/Icon";
import { isApp } from "@/lib/platform";

const menuRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "14px 16px",
  textDecoration: "none",
  color: "var(--text-strong)",
  minHeight: "var(--tap-min, 44px)",
};

function MenuRow({
  href,
  icon,
  label,
  first = false,
}: {
  href: string;
  icon: IconName;
  label: string;
  first?: boolean;
}) {
  return (
    <Link
      href={href}
      style={{
        ...menuRowStyle,
        borderTop: first ? undefined : "1px solid var(--border-subtle)",
      }}
    >
      <Icon name={icon} size={18} style={{ color: "var(--text-muted)" }} aria-hidden />
      <span style={{ fontSize: 15, fontWeight: 600 }}>{label}</span>
      <Icon
        name="chevronRight"
        size={18}
        style={{ color: "var(--text-faint)", marginLeft: "auto" }}
        aria-hidden
      />
    </Link>
  );
}

export default function ProfileScreen() {
  const [app, setApp] = useState(false);
  useEffect(() => setApp(isApp()), []);

  return (
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--accent-text)",
          }}
        >
          Hesap
        </span>
        <h1
          style={{
            margin: "6px 0 0",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            color: "var(--text-strong)",
          }}
        >
          Profil
        </h1>
      </div>

      {/* Menu */}
      <Card padding="none">
        <MenuRow href="/profil/tema" icon="sun" label="Tema" first />
        <MenuRow href="/profil/hakkinda" icon="info" label="Hakkında" />
        <MenuRow href="/profil/kaynaklar" icon="file" label="Kaynaklar ve metodoloji" />
        <MenuRow href="/profil/ayarlar" icon="settings" label="Ayarlar" />
        {app && <MenuRow href="/profil/bilgilerim" icon="user" label="Bilgilerim" />}
      </Card>

      {/* Cüzdan & gelir-gider (yakında) */}
      <Card padding="md">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <Icon name="wallet" size={18} style={{ color: "var(--text-muted)" }} aria-hidden />
          <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-strong)" }}>
            Cüzdan &amp; gelir-gider
          </span>
          <Badge tone="warning" size="sm" style={{ marginLeft: "auto" }}>
            Yakında
          </Badge>
        </div>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)" }}>
          Yakında: gelir-giderini takip edip enflasyona karşı bütçeni izleyebileceğin kişisel
          finans alanı.
        </p>
      </Card>
    </div>
  );
}
