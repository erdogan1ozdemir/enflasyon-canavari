'use client';

import React, { useState } from "react";
import Link from "next/link";
import { formatTL, formatSayi } from "@ec/data";
import type { Item } from "@ec/data";
import { Icon } from "@/components/Icon";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import BigStat from "@/components/data/BigStat";
import SourceBadge from "@/components/data/SourceBadge";
import LineChart from "@/components/data/LineChart";
import SegmentedControl from "@/components/ui/SegmentedControl";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tip = "net" | "ortalama";

interface TipSummary {
  ilk: { yil: number; deger: number } | null;
  guncel: { yil: number; deger: number } | null;
  degisim: { kat: number; yuzde: number } | null;
  kaynak: { ad: string; tip: Tip; dogrulanmis: boolean } | null;
}

export interface ItemDetailVM {
  item: Item;
  iconName: string;
  tips: Tip[];
  series: Partial<Record<Tip, [number, number][]>>;
  summary: Partial<Record<Tip, TipSummary>>;
}

// ─── Kategori label mapping ───────────────────────────────────────────────────

const KATEGORI_LABELS: Record<string, string> = {
  gida: "Gıda",
  doviz: "Döviz",
  altin: "Altın",
  akaryakit: "Akaryakıt",
  fatura: "Fatura",
  ulasim: "Ulaşım",
  barinma: "Barınma",
  capa: "Çapa",
};

// ─── ItemDetailScreen ─────────────────────────────────────────────────────────

export default function ItemDetailScreen({ vm }: { vm: ItemDetailVM }) {
  const { item, iconName, tips, series, summary } = vm;
  const [selectedTip, setSelectedTip] = useState<Tip>(tips[0] ?? "net");

  const kategoriLabel = KATEGORI_LABELS[item.kategori] ?? item.kategori;

  const currentSummary = summary[selectedTip] ?? null;
  const currentSeries = series[selectedTip] ?? [];

  // Rows for table: ascending by year
  const tableRows = [...currentSeries].sort((a, b) => a[0] - b[0]);

  return (
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Back link */}
      <Link
        href="/"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          alignSelf: "flex-start",
          color: "var(--text-muted)",
          fontSize: 14,
          fontWeight: 500,
          textDecoration: "none",
        }}
      >
        <Icon name="arrowLeft" size={16} />
        Kalemler
      </Link>

      {/* Header: icon + name + category */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            width: 46,
            height: 46,
            borderRadius: "var(--radius-md)",
            background: "var(--accent-tint)",
            color: "var(--accent-text)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Icon name={iconName} size={24} />
        </span>
        <div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: "-0.01em",
              color: "var(--text-strong)",
            }}
          >
            {item.isim}
          </div>
          <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {kategoriLabel} · {item.birim}
          </div>
        </div>
      </div>

      {/* Empty state when no data */}
      {tips.length === 0 ? (
        <Card padding="md">
          <p
            style={{
              margin: 0,
              fontSize: 15,
              color: "var(--text-muted)",
              textAlign: "center",
              padding: "24px 0",
            }}
          >
            Bu kalem için şimdilik veri yok.
          </p>
        </Card>
      ) : (
        <>
          {/* Hero card */}
          <Card padding="md">
            {currentSummary?.degisim ? (
              <>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <BigStat
                    eyebrow={
                      currentSummary.ilk && currentSummary.guncel
                        ? `${currentSummary.ilk.yil} → ${currentSummary.guncel.yil}`
                        : undefined
                    }
                    value={`×${formatSayi(currentSummary.degisim.kat, 1)}`}
                    size="lg"
                    tone="rise"
                    caption={`%${formatSayi(currentSummary.degisim.yuzde)} arttı`}
                  />
                  {currentSummary.guncel && (
                    <span
                      style={{
                        fontFamily: "var(--font-data)",
                        fontSize: 18,
                        fontWeight: 700,
                        color: "var(--text-strong)",
                        paddingBottom: 4,
                      }}
                    >
                      {formatTL(currentSummary.guncel.deger)}
                    </span>
                  )}
                </div>
                {currentSummary.kaynak && (
                  <div style={{ marginTop: 14 }}>
                    <SourceBadge
                      source={currentSummary.kaynak.ad}
                      label={currentSummary.kaynak.tip}
                      status={currentSummary.kaynak.dogrulanmis ? "verified" : "pending"}
                    />
                  </div>
                )}
              </>
            ) : (
              <p style={{ margin: 0, fontSize: 14, color: "var(--text-muted)" }}>
                Değişim hesaplanamadı.
              </p>
            )}
          </Card>

          {/* Chart card */}
          <Card padding="md">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 12,
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--text-strong)",
                }}
              >
                Yıl-yıl seyir
              </span>
              {tips.length > 1 ? (
                <SegmentedControl
                  size="sm"
                  value={selectedTip}
                  onChange={(v) => setSelectedTip(v as Tip)}
                  options={tips.map((t) => ({
                    value: t,
                    label: t === "net" ? "Net" : "Ortalama",
                  }))}
                />
              ) : (
                <Badge tone="teal" size="sm">
                  {selectedTip === "net" ? "Net" : "Ortalama"}
                </Badge>
              )}
            </div>
            {currentSeries.length > 1 ? (
              <LineChart series={[{ points: currentSeries }]} height={190} />
            ) : currentSeries.length === 1 ? (
              <p style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>
                Tek yıl verisi mevcut — grafik için en az 2 yıl gereklidir.
              </p>
            ) : null}
          </Card>

          {/* Table */}
          <div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "var(--text-faint)",
                marginBottom: 8,
              }}
            >
              Yıl-yıl tablo
            </div>
            <Card padding="none">
              {tableRows.map((p, i) => (
                <div
                  key={p[0]}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 16px",
                    borderBottom:
                      i < tableRows.length - 1
                        ? "1px solid var(--border-subtle)"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--text-muted)",
                      width: 44,
                      flexShrink: 0,
                    }}
                  >
                    {p[0]}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-data)",
                      fontSize: 16,
                      fontWeight: 700,
                      color: "var(--text-strong)",
                      flex: 1,
                    }}
                  >
                    {formatTL(p[1])}
                  </span>
                  <Badge
                    tone={selectedTip === "net" ? "coral" : "neutral"}
                    size="sm"
                  >
                    {selectedTip === "net" ? "net" : "ortalama"}
                  </Badge>
                  {currentSummary?.kaynak && (
                    <SourceBadge
                      source={currentSummary.kaynak.ad}
                      size="sm"
                    />
                  )}
                </div>
              ))}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
