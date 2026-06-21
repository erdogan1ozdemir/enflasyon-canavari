import React from "react";
import type { Source } from "@ec/data";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import { Icon } from "@/components/Icon";
import { ThemeSetting } from "@/components/ThemeSetting";
import SourcesScreen from "@/components/screens/SourcesScreen";

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--text-faint)",
  marginBottom: 8,
};

export default function ProfileScreen({ sources }: { sources: Source[] }) {
  return (
    <>
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

        {/* Hakkında */}
        <Card padding="md">
          <div style={labelStyle}>Hakkında</div>
          <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6, color: "var(--text-body)" }}>
            Enflasyon Canavarı, Türkiye&apos;de paranın zaman içinde eriyişini somut, kaynaklı
            sayılarla gösterir. 2005&apos;ten bugüne fiyatları karşılaştır, satın alma gücünü ölç,
            sonucu paylaş. Tüm değerler resmi/güvenilir kaynaklardan derlenir; her sayının yanında
            kaynağı belirtilir.
          </p>
        </Card>

        {/* Tema */}
        <Card padding="md">
          <div style={labelStyle}>Tema</div>
          <ThemeSetting />
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

      {/* Kaynaklar &amp; metodoloji bölümü */}
      <SourcesScreen sources={sources} />
    </>
  );
}
