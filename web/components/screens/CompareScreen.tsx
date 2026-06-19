'use client';

import React, { useState, useMemo } from "react";
import { satinAlmaGucuKarsilastir, formatSayi } from "@ec/data";
import type { PricePoint } from "@ec/data";
import { Icon } from "@/components/Icon";
import Card from "@/components/ui/Card";
import SegmentedControl from "@/components/ui/SegmentedControl";
import BigStat from "@/components/data/BigStat";
import SourceBadge from "@/components/data/SourceBadge";
import TrendPill from "@/components/data/TrendPill";
import type { CompareItemVM } from "@/lib/viewmodel";

// ─── Props ───────────────────────────────────────────────────────────────────

interface CompareScreenProps {
  items: CompareItemVM[];
  prices: PricePoint[];
  minYil: number;
  maxYil: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ANCHOR_IDS = ["asgari-ucret", "gram-altin", "usd"] as const;

const ANCHOR_LABELS: Record<string, string> = {
  "asgari-ucret": "Maaş",
  "gram-altin": "Gram altın",
  usd: "Dolar",
};

const ANCHOR_HEADLINE: Record<string, string> = {
  "asgari-ucret": "1 asgari maaş",
  "gram-altin": "1 gram altın",
  usd: "1 dolar",
};

// Build a list of years from min to max
function buildYears(min: number, max: number): number[] {
  const years: number[] = [];
  for (let y = min; y <= max; y++) years.push(y);
  return years;
}

// Horizontal scroll row of year pills (used for Yıl A and Yıl B)
function YearPicker({
  label,
  years,
  value,
  onChange,
}: {
  label: string;
  years: number[];
  value: number;
  onChange: (y: number) => void;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.07em",
          textTransform: "uppercase",
          color: "var(--text-faint)",
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
        {years.map((y) => {
          const on = y === value;
          return (
            <button
              key={y}
              type="button"
              onClick={() => onChange(y)}
              style={{
                flexShrink: 0,
                padding: "6px 12px",
                borderRadius: "var(--radius-pill)",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-data)",
                border: "1px solid " + (on ? "transparent" : "var(--border-subtle)"),
                background: on ? "var(--accent)" : "var(--surface-card)",
                color: on ? "#fff" : "var(--text-body)",
                transition:
                  "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
              }}
            >
              {y}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── CompareScreen ────────────────────────────────────────────────────────────

export default function CompareScreen({
  items,
  prices,
  minYil,
  maxYil,
}: CompareScreenProps) {
  // Anchor: items that represent money/value and exist in our item list
  const anchors = items.filter((i) => ANCHOR_IDS.includes(i.id as (typeof ANCHOR_IDS)[number]));

  // Targets: non-anchor, purchasable items (exclude index series like TÜFE)
  const targets = items.filter(
    (i) => !ANCHOR_IDS.includes(i.id as (typeof ANCHOR_IDS)[number]) && i.birim !== "endeks",
  );

  // Default anchor = asgari-ucret if present, else first anchor
  const defaultAnchorId = anchors.find((a) => a.id === "asgari-ucret")?.id ?? anchors[0]?.id ?? "asgari-ucret";
  // Default target = first target WITH data, else first target
  const defaultTargetId = targets.find((t) => t.yillar.length > 0)?.id ?? targets[0]?.id ?? "ekmek";

  // Default years: overlap of default anchor & target data, else full range
  const defAnchorYears = anchors.find((a) => a.id === defaultAnchorId)?.yillar ?? [];
  const defTargetYears = targets.find((t) => t.id === defaultTargetId)?.yillar ?? [];
  const defOverlap = defAnchorYears.filter((y) => defTargetYears.includes(y));
  const defaultYilA = defOverlap.length > 0 ? Math.min(...defOverlap) : minYil;
  const defaultYilB = defOverlap.length > 0 ? Math.max(...defOverlap) : maxYil;

  const [anchorId, setAnchorId] = useState(defaultAnchorId);
  const [targetId, setTargetId] = useState(defaultTargetId);
  const [yilA, setYilA] = useState(defaultYilA);
  const [yilB, setYilB] = useState(defaultYilB);

  const allYears = useMemo(() => buildYears(minYil, maxYil), [minYil, maxYil]);

  // ── Calculation ──
  const anchor = items.find((i) => i.id === anchorId);
  const target = items.find((i) => i.id === targetId);

  const sonuc = useMemo(() => {
    if (!anchor || !target) return null;
    return satinAlmaGucuKarsilastir(prices, anchorId, targetId, yilA, yilB);
  }, [prices, anchorId, targetId, yilA, yilB, anchor, target]);

  const anchorLabel = ANCHOR_HEADLINE[anchorId] ?? `1 ${anchor?.isim ?? anchorId}`;
  const targetIsim = target?.isim.toLowerCase() ?? targetId;

  // ── Kaynak info for anchor (to show SourceBadge) ──
  const anchorKaynak = useMemo(() => {
    const latest = prices
      .filter((p) => p.itemId === anchorId)
      .sort((a, b) => b.yil - a.yil)[0];
    return latest ?? null;
  }, [prices, anchorId]);

  return (
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Page header ── */}
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
          Satın alma gücü
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
          Aynı parayla kaç tane?
        </h1>
      </div>

      {/* ── Selector card ── */}
      <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Anchor selector */}
        {anchors.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "var(--text-faint)",
                marginBottom: 8,
              }}
            >
              Ne kadar para
            </div>
            <SegmentedControl
              size="sm"
              value={anchorId}
              onChange={setAnchorId}
              options={anchors.map((a) => ({
                value: a.id,
                label: ANCHOR_LABELS[a.id] ?? a.isim,
              }))}
              style={{ width: "100%" }}
            />
          </div>
        )}

        {/* Target selector */}
        {targets.length > 0 && (
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.07em",
                textTransform: "uppercase",
                color: "var(--text-faint)",
                marginBottom: 8,
              }}
            >
              Neyi alır
            </div>
            <div
              style={{
                display: "flex",
                gap: 8,
                overflowX: "auto",
                paddingBottom: 2,
              }}
            >
              {targets.map((t) => {
                const on = t.id === targetId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTargetId(t.id)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "7px 14px",
                      flexShrink: 0,
                      borderRadius: "var(--radius-pill)",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      border: "1px solid " + (on ? "transparent" : "var(--border-subtle)"),
                      background: on ? "var(--accent)" : "var(--surface-card)",
                      color: on ? "#fff" : "var(--text-body)",
                      transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
                    }}
                  >
                    <Icon name={t.iconName} size={14} />
                    {t.isim}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Year selectors — stacked scroll rows, all years selectable */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <YearPicker label="Yıl A" years={allYears} value={yilA} onChange={setYilA} />
          <YearPicker label="Yıl B" years={allYears} value={yilB} onChange={setYilB} />
        </div>
      </Card>

      {/* ── Result card ── */}
      {sonuc === null ? (
        // Empty state
        <Card
          padding="md"
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 10,
            padding: "32px 20px",
          }}
        >
          <Icon
            name="scale"
            size={32}
            style={{ opacity: 0.25 }}
            aria-hidden
          />
          <p
            style={{
              margin: 0,
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text-strong)",
            }}
          >
            Yeterli veri bulunamadı
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--text-muted)",
              maxWidth: 280,
              lineHeight: 1.5,
            }}
          >
            Seçili kalem ve yıllar için yeterli veri yok. Daha fazla veri yakında
            eklenecek.
          </p>
        </Card>
      ) : (
        // Dark result card
        <div
          data-theme="dark"
          style={{
            background: "#1C1814",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
          }}
        >
          {/* Headline */}
          <p
            style={{
              margin: "0 0 16px",
              fontSize: 14,
              color: "var(--text-muted)",
              lineHeight: 1.4,
            }}
          >
            {anchorLabel} ile alabileceğin{" "}
            <strong style={{ color: "var(--text-strong)" }}>{targetIsim}</strong>{" "}
            sayısı
          </p>

          {/* BigStat row */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <BigStat
              eyebrow={String(yilA)}
              value={`${formatSayi(sonuc.a, sonuc.a >= 10 ? 0 : 1)} adet`}
              size="md"
              tone="strong"
            />
            <Icon
              name="arrowRight"
              size={22}
              style={{ color: "var(--accent)", marginBottom: 8, flexShrink: 0 }}
            />
            <BigStat
              eyebrow={String(yilB)}
              value={`${formatSayi(sonuc.b, sonuc.b >= 10 ? 0 : 1)} adet`}
              size="lg"
              tone="accent"
            />
          </div>

          {/* Trend + source */}
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <TrendPill
              value={Math.round(sonuc.yuzdeDegisim)}
              direction={sonuc.yuzdeDegisim >= 0 ? "up" : "down"}
              size="sm"
            />
            {anchorKaynak && (
              <SourceBadge
                source={anchorKaynak.kaynakAdi}
                label={anchorKaynak.tip}
                status={anchorKaynak.dogrulama === "dogrulanmis" ? "verified" : "pending"}
                size="sm"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
