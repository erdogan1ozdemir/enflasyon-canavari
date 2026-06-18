'use client';

import React, { useState } from "react";
import Link from "next/link";
import { formatTL, formatSayi } from "@ec/data";
import { Icon } from "@/components/Icon";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Input from "@/components/ui/Input";
import BigStat from "@/components/data/BigStat";
import SourceBadge from "@/components/data/SourceBadge";
import TrendPill from "@/components/data/TrendPill";
import ItemRow from "@/components/data/ItemRow";
import type { ItemViewModel, ListRowViewModel } from "@/lib/viewmodel";

// ─── Props ──────────────────────────────────────────────────────────────────

interface HomeScreenProps {
  rows: ListRowViewModel[];
  featured: ItemViewModel;
}

// ─── Featured Card ──────────────────────────────────────────────────────────

function FeaturedCard({ vm }: { vm: ItemViewModel }) {
  const ilkYil = vm.ilk?.yil ?? 2005;
  const guncelYil = vm.guncel?.yil ?? new Date().getFullYear();
  const katStr = vm.degisim ? `×${formatSayi(Math.round(vm.degisim.kat))}` : "—";

  return (
    <Card padding="none" style={{ overflow: "hidden", border: "1px solid var(--border-subtle)" }}>
      <div
        style={{
          padding: 20,
          background: "linear-gradient(180deg, var(--accent-tint), transparent)",
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Badge tone="coral" size="sm">Öne çıkan</Badge>
          <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
            {vm.item.isim} · {ilkYil} → {guncelYil}
          </span>
        </div>

        {/* Hero multiplier */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <BigStat
            value={katStr}
            eyebrow="2005'ten bugüne"
            size="lg"
            tone="accent"
          />
          <span style={{ fontSize: 15, color: "var(--text-body)", paddingBottom: 6 }}>
            katına çıktı
          </span>
        </div>

        {/* Current value + source badge */}
        <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 6 }}>
          {vm.guncel && (
            <span style={{ fontFamily: "var(--font-data)", fontSize: 15, color: "var(--text-body)" }}>
              Güncel değer:{" "}
              <strong style={{ color: "var(--text-strong)" }}>
                {formatTL(vm.guncel.deger)}
              </strong>
              <span style={{ color: "var(--text-muted)", fontSize: 13 }}>
                {" "}/ {vm.item.birim}
              </span>
            </span>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 4 }}>
            {vm.kaynak ? (
              <SourceBadge
                source={vm.kaynak.ad}
                label={vm.kaynak.tip}
                status={vm.kaynak.dogrulanmis ? "verified" : "pending"}
              />
            ) : null}
            <Link
              href={`/kalem/${vm.item.id}`}
              style={{
                marginLeft: "auto",
                fontSize: 13,
                color: "var(--accent-text)",
                fontWeight: 600,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              İncele
              <Icon name="arrowRight" size={14} />
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ─── HomeScreen ─────────────────────────────────────────────────────────────

export default function HomeScreen({ rows, featured }: HomeScreenProps) {
  const [q, setQ] = useState("");

  const filtered = rows.filter((r) =>
    r.item.isim.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 18 }}>
      {/* Hero headline */}
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
          2005 → bugün
        </span>
        <h1
          style={{
            margin: "6px 0 0",
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--text-strong)",
          }}
        >
          Paran ne kadar<br />eridi?
        </h1>
      </div>

      {/* Featured card */}
      <FeaturedCard vm={featured} />

      {/* Search */}
      <Input
        placeholder="Kalem ara — ekmek, dolar, altın…"
        icon={<Icon name="search" size={17} />}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {/* List header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--text-faint)",
            }}
          >
            Tüm kalemler
          </span>
          <span
            style={{
              fontSize: 12,
              color: "var(--text-faint)",
              fontFamily: "var(--font-data)",
            }}
          >
            {filtered.length} kalem
          </span>
        </div>

        {/* Item rows */}
        {filtered.map((row) => {
          const hasData = row.guncel !== null;
          const valueNode = hasData ? formatTL(row.guncel!.deger) : "veri yok";
          const trendNode =
            row.degisim ? (
              <TrendPill
                value={Math.round(row.degisim.yuzde)}
                direction="up"
                size="sm"
              />
            ) : null;

          // Category label mapping for display
          const kategoriLabels: Record<string, string> = {
            gida: "Gıda",
            doviz: "Döviz",
            altin: "Altın",
            akaryakit: "Akaryakıt",
            fatura: "Fatura",
            ulasim: "Ulaşım",
            barinma: "Barınma",
            capa: "Çapa",
          };
          const kategoriLabel = kategoriLabels[row.item.kategori] ?? row.item.kategori;

          return (
            <Link
              key={row.item.id}
              href={`/kalem/${row.item.id}`}
              style={{ textDecoration: "none" }}
            >
              <ItemRow
                icon={<Icon name={row.iconName} size={20} />}
                name={row.item.isim}
                category={`${kategoriLabel} · ${row.item.birim}`}
                value={
                  <span
                    style={{
                      color: hasData ? "var(--text-strong)" : "var(--text-faint)",
                      fontStyle: hasData ? "normal" : "italic",
                    }}
                  >
                    {valueNode}
                  </span>
                }
                trend={trendNode}
              />
            </Link>
          );
        })}

        {filtered.length === 0 && (
          <div
            style={{
              padding: "32px 0",
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 14,
            }}
          >
            Eşleşen kalem bulunamadı.
          </div>
        )}
      </div>
    </div>
  );
}
