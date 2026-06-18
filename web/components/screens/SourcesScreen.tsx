import React from "react";
import type { Source } from "@ec/data";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import SourceBadge from "@/components/data/SourceBadge";
import { Icon } from "@/components/Icon";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SourcesScreenProps {
  sources: Source[];
}

// ─── Tip label mapping ────────────────────────────────────────────────────────

const TIP_LABELS: Record<string, string> = {
  "resmi-api": "Resmi API",
  "elle": "Elle derlenen",
  "epdk": "EPDK",
  "crowdsource": "Topluluk",
};

function tipLabel(tip: string): string {
  return TIP_LABELS[tip] ?? tip;
}

function tipTone(tip: string): "teal" | "coral" | "neutral" | "warning" {
  switch (tip) {
    case "resmi-api": return "teal";
    case "epdk": return "teal";
    case "elle": return "warning";
    case "crowdsource": return "neutral";
    default: return "neutral";
  }
}

// ─── SourcesScreen ────────────────────────────────────────────────────────────

export default function SourcesScreen({ sources }: SourcesScreenProps) {
  return (
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Page header */}
      <div>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--trust-text)",
          }}
        >
          Şeffaflık
        </span>
        <h1
          style={{
            margin: "6px 0 4px",
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--text-strong)",
          }}
        >
          Kaynaklar ve metodoloji
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: 14,
            lineHeight: 1.5,
            color: "var(--text-body)",
          }}
        >
          Her fiyatın kaynağı ve etiketi var. Tüm değerler yeni TL cinsindendir; başlangıç 1 Ocak 2005.
        </p>
      </div>

      {/* 2005 redenomination info box */}
      <Card
        padding="md"
        style={{
          display: "flex",
          gap: 12,
          alignItems: "flex-start",
          background: "var(--trust-tint)",
          border: "1px solid color-mix(in oklch, var(--trust) 22%, transparent)",
        }}
      >
        <span style={{ color: "var(--trust-text)", marginTop: 1, flexShrink: 0 }}>
          <Icon name="info" size={20} />
        </span>
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: "var(--text-strong)",
              marginBottom: 3,
            }}
          >
            2005 redenominasyonu
          </div>
          <div style={{ fontSize: 13.5, lineHeight: 1.5, color: "var(--text-body)" }}>
            1 Ocak 2005'te paradan 6 sıfır atıldı (1.000.000 eski TL = 1 YTL).
            Tüm fiyatlar yeni TL'ye normalize edilir; tarihi karşılaştırmalar doğrudan yapılabilir.
          </div>
        </div>
      </Card>

      {/* Net / Ortalama explainer cards */}
      <div style={{ display: "flex", gap: 10 }}>
        <Card padding="sm" style={{ flex: 1 }}>
          <Badge tone="coral" size="sm">net</Badge>
          <div
            style={{
              fontSize: 12.5,
              lineHeight: 1.45,
              color: "var(--text-muted)",
              marginTop: 8,
            }}
          >
            Vergi ve kesintiler sonrası ele geçen tutar. Örneğin asgari ücretin net değeri.
          </div>
        </Card>
        <Card padding="sm" style={{ flex: 1 }}>
          <Badge tone="neutral" size="sm">ortalama</Badge>
          <div
            style={{
              fontSize: 12.5,
              lineHeight: 1.45,
              color: "var(--text-muted)",
              marginTop: 8,
            }}
          >
            Dönem geneli ortalama değer. TÜİK sepet kalemleri ve enflasyon verileri bu türdendir.
          </div>
        </Card>
      </div>

      {/* Source list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--text-faint)",
          }}
        >
          Veri kaynakları
        </div>

        {sources.map((s) => {
          const isElle = s.tip === "elle" || s.tip === "crowdsource";
          return (
            <Card key={s.ad} padding="md">
              {/* Header row: source badge + type badge + URL */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 8,
                  flexWrap: "wrap",
                }}
              >
                <SourceBadge
                  source={s.ad}
                  status={isElle ? "pending" : "verified"}
                />
                <Badge tone={tipTone(s.tip)} size="sm">
                  {tipLabel(s.tip)}
                </Badge>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    marginLeft: "auto",
                    fontFamily: "var(--font-data)",
                    fontSize: 12,
                    color: "var(--text-faint)",
                    textDecoration: "underline",
                    textUnderlineOffset: 2,
                    wordBreak: "break-all",
                  }}
                >
                  {s.url}
                </a>
              </div>

              {/* Methodology text */}
              <div
                style={{
                  fontSize: 13.5,
                  lineHeight: 1.5,
                  color: "var(--text-body)",
                }}
              >
                {s.metodoloji}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
