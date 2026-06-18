'use client';

import React, { useState, useMemo } from "react";
import { enflasyonaGore, formatTL } from "@ec/data";
import type { PricePoint } from "@ec/data";
import { Icon } from "@/components/Icon";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import BigStat from "@/components/data/BigStat";
import SourceBadge from "@/components/data/SourceBadge";

// ─── Props ───────────────────────────────────────────────────────────────────

interface CalcScreenProps {
  prices: PricePoint[];
  availableYears: number[];
  minYil: number;
  maxYil: number;
  endeksId: string;
  hasEndeks: boolean;
  hasUrun: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Pick a sensible default starting year: 2010 if available, else minYil. */
function defaultYil(years: number[], min: number): number {
  return years.includes(2010) ? 2010 : min;
}

/** Build a deduplicated set of selectable years to show in the year picker.
 *  We keep at most ~8 evenly-spaced entries to avoid an unwieldy list. */
function buildYearOptions(years: number[]): number[] {
  if (years.length === 0) return [];
  if (years.length <= 8) return years;
  const step = (years.length - 1) / 7;
  const picked: number[] = [];
  for (let i = 0; i <= 7; i++) {
    const idx = Math.round(i * step);
    picked.push(years[Math.min(idx, years.length - 1)]!);
  }
  return Array.from(new Set(picked));
}

// ─── CalcScreen ───────────────────────────────────────────────────────────────

export default function CalcScreen({
  prices,
  availableYears,
  minYil,
  maxYil,
  endeksId,
  hasEndeks,
}: CalcScreenProps) {
  const [tutar, setTutar] = useState<number>(1000);
  const [yil, setYil] = useState<number>(() => defaultYil(availableYears, minYil));

  const yearOptions = useMemo(() => buildYearOptions(availableYears), [availableYears]);

  // Compute inflation-adjusted value
  const bugunkuKarsilik = useMemo(() => {
    if (!hasEndeks) return null;
    return enflasyonaGore(prices, endeksId, tutar, yil, maxYil);
  }, [prices, endeksId, tutar, yil, maxYil, hasEndeks]);

  // ── Input handlers ──

  function handleTutarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setTutar(isNaN(val) || val < 0 ? 0 : val);
  }

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
          Kişisel hesap
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
          Paran ne kadar eridi?
        </h1>
      </div>

      {/* ── Input card ── */}
      <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Amount input */}
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
            O günkü tutar (TL)
          </div>
          <Input
            type="number"
            value={tutar === 0 ? "" : tutar}
            onChange={handleTutarChange}
            size="lg"
            placeholder="1000"
            style={{
              fontFamily: "var(--font-data)",
              fontWeight: 600,
              fontSize: 20,
            }}
          />
        </div>

        {/* Year selector */}
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
            Hangi yıl
          </div>
          {yearOptions.length > 0 ? (
            <div
              style={{
                display: "flex",
                gap: 6,
                flexWrap: "wrap",
              }}
            >
              {yearOptions.map((y) => {
                const active = y === yil;
                return (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYil(y)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "var(--radius-pill)",
                      cursor: "pointer",
                      fontSize: 13,
                      fontWeight: 600,
                      fontFamily: "var(--font-data)",
                      border: "1px solid " + (active ? "transparent" : "var(--border-subtle)"),
                      background: active ? "var(--accent)" : "var(--surface-card)",
                      color: active ? "#fff" : "var(--text-body)",
                      transition:
                        "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
                    }}
                  >
                    {y}
                  </button>
                );
              })}
            </div>
          ) : (
            <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
              Veri yok
            </span>
          )}
        </div>

        {/* Privacy note — required */}
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "var(--text-faint)",
            lineHeight: 1.5,
          }}
        >
          Girdiğin tutar yalnızca tarayıcında kalır; hesap gerektirmez.
        </p>
      </Card>

      {/* ── Result area ── */}
      {bugunkuKarsilik !== null ? (
        // Result card — shown when we have data and a valid calculation
        <div
          data-theme="dark"
          style={{
            background: "#1C1814",
            border: "1px solid var(--border-subtle)",
            borderRadius: "var(--radius-lg)",
            padding: 20,
          }}
        >
          <BigStat
            eyebrow="BUGÜNKÜ KARŞILIĞI"
            value={formatTL(bugunkuKarsilik)}
            size="lg"
            tone="accent"
            caption={`${yil} yılındaki ${formatTL(tutar)} bugüne göre`}
          />
          <div style={{ marginTop: 12 }}>
            <SourceBadge source="TÜİK" label="TÜFE" status="verified" size="sm" />
          </div>
        </div>
      ) : (
        // Graceful empty state — no index data yet
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
            name="calculator"
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
            Sonuç hesaplanacak
          </p>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "var(--text-muted)",
              maxWidth: 300,
              lineHeight: 1.5,
            }}
          >
            Bu hesap için gerekli veri (TÜFE endeksi) yakında eklenecek.
          </p>
        </Card>
      )}
    </div>
  );
}
