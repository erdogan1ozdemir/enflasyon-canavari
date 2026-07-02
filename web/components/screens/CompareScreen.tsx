'use client';

import React, { useState, useMemo, useEffect } from "react";
import { fiyatBul, formatTL, formatSayi } from "@ec/data";
import type { PricePoint } from "@ec/data";
import { Icon } from "@/components/Icon";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SegmentedControl from "@/components/ui/SegmentedControl";
import BigStat from "@/components/data/BigStat";
import SourceBadge from "@/components/data/SourceBadge";
import ShareSheet from "@/components/share/ShareSheet";
import { paraToUrun, urunToPara } from "@/lib/viewmodel";
import type { CompareItemVM, ParaBirimi } from "@/lib/viewmodel";
import { getProfil } from "@/lib/profile";

// ─── Props ───────────────────────────────────────────────────────────────────

interface CompareScreenProps {
  items: CompareItemVM[];
  prices: PricePoint[];
  minYil: number;
  maxYil: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

// Para kaynakları (hedef olamaz — bunlar "para", "ürün" değil).
const PARA_KAYNAK_IDS = ["usd", "gram-altin", "asgari-ucret"] as const;

const BIRIM_ETIKET: Record<ParaBirimi, string> = {
  TL: "TL",
  usd: "dolar",
  "gram-altin": "gram altın",
};

// Bölüm etiketi stili (mevcut ekrandan aynen alındı)
const sectionLabelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--text-faint)",
  marginBottom: 8,
};

// Pill buton stili (mevcut ekrandan aynen alındı) — disabled destekli
function pillButtonStyle(on: boolean, disabled = false): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "7px 14px",
    flexShrink: 0,
    borderRadius: "var(--radius-pill)",
    cursor: disabled ? "default" : "pointer",
    fontSize: 13,
    fontWeight: 600,
    border: "1px solid " + (on ? "transparent" : "var(--border-subtle)"),
    background: on ? "var(--accent)" : "var(--surface-card)",
    color: on ? "#fff" : "var(--text-body)",
    opacity: disabled ? 0.5 : 1,
    transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
  };
}

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
      <div style={sectionLabelStyle}>{label}</div>
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
  // Mod: "para" (Param ne alır?) | "urun" (Ürün kaç para?)
  const [mod, setMod] = useState<"para" | "urun">("para");

  // Hedefler: sadece ürünler — para kaynakları (usd/gram-altin/asgari-ucret) ve
  // endeks serileri (tüfe) hedef olamaz.
  const targets = items.filter(
    (i) =>
      i.birim !== "endeks" &&
      !PARA_KAYNAK_IDS.includes(i.id as (typeof PARA_KAYNAK_IDS)[number]),
  );

  const defaultTargetId = targets.find((t) => t.yillar.length > 0)?.id ?? targets[0]?.id ?? "ekmek";
  const [targetId, setTargetId] = useState(defaultTargetId);

  const [yilA, setYilA] = useState(minYil);
  const [yilB, setYilB] = useState(maxYil);

  const allYears = useMemo(() => buildYears(minYil, maxYil), [minYil, maxYil]);

  // ── para modu state ──
  const [tutar, setTutar] = useState(100);
  const [birim, setBirim] = useState<ParaBirimi>("TL");

  // ── urun modu state ──
  const [miktar, setMiktar] = useState(1);

  // ── Profil (yalnız client'ta mount'ta oku — hydration uyumsuzluğu olmasın) ──
  const [maas, setMaas] = useState<number | undefined>(undefined);
  useEffect(() => {
    setMaas(getProfil().maas);
  }, []);

  const [sheetOpen, setSheetOpen] = useState(false);

  const target = items.find((i) => i.id === targetId);
  const targetIsim = target?.isim.toLowerCase() ?? targetId;
  const targetBirim = target?.birim ?? "adet";

  // Kısayol: "O yılın asgari ücreti" (yilA'ya göre, ham değer)
  const asgariUcretYilA = useMemo(() => fiyatBul(prices, "asgari-ucret", yilA), [prices, yilA]);

  // ── Kaynak (SourceBadge) — hedef ürünün ilgili yıldaki en güncel kaydı ──
  const kaynakBul = (yil: number) => {
    const adaylar = prices.filter((p) => p.itemId === targetId && p.yil === yil);
    return adaylar.find((p) => p.dogrulama === "dogrulanmis") ?? adaylar[0] ?? null;
  };
  const kaynakB = useMemo(() => kaynakBul(yilB), [prices, targetId, yilB]);
  const kaynakA = useMemo(() => kaynakBul(yilA), [prices, targetId, yilA]);
  const kaynak = kaynakB ?? kaynakA;

  // ── Hesaplama ──
  const paraSonuc = useMemo(() => {
    if (mod !== "para" || !target) return null;
    const a = paraToUrun(prices, tutar, birim, targetId, yilA);
    const b = paraToUrun(prices, tutar, birim, targetId, yilB);
    if (a === null || b === null) return null;
    const yuzdeDegisim = a !== 0 ? ((b - a) / a) * 100 : 0;
    return { a, b, yuzdeDegisim };
  }, [mod, prices, tutar, birim, targetId, yilA, yilB, target]);

  const urunSonuc = useMemo(() => {
    if (mod !== "urun" || !target) return null;
    const a = urunToPara(prices, miktar, targetId, yilA);
    const b = urunToPara(prices, miktar, targetId, yilB);
    if (a === null || b === null) return null;
    const yuzdeDegisim = a.tl !== 0 ? ((b.tl - a.tl) / a.tl) * 100 : 0;
    return { a, b, yuzdeDegisim };
  }, [mod, prices, miktar, targetId, yilA, yilB, target]);

  // ── Paylaş kartı içerikleri ──
  const soruBasligi =
    mod === "para"
      ? `${formatSayi(tutar)} ${BIRIM_ETIKET[birim]} ile alabileceğin ${targetIsim} miktarı`
      : `${formatSayi(miktar)} ${targetBirim} ${targetIsim} kaç paraydı?`;

  const aDegerStr =
    mod === "para"
      ? paraSonuc
        ? `${formatSayi(paraSonuc.a, paraSonuc.a >= 10 ? 0 : 1)} ${targetBirim}`
        : ""
      : urunSonuc
        ? formatTL(urunSonuc.a.tl)
        : "";
  const bDegerStr =
    mod === "para"
      ? paraSonuc
        ? `${formatSayi(paraSonuc.b, paraSonuc.b >= 10 ? 0 : 1)} ${targetBirim}`
        : ""
      : urunSonuc
        ? formatTL(urunSonuc.b.tl)
        : "";

  const kaynakAdi = kaynak?.kaynakAdi ?? "TÜİK";

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

      {/* ── Mod toggle ── */}
      <SegmentedControl
        value={mod}
        onChange={(v) => setMod(v as "para" | "urun")}
        options={[
          { value: "para", label: "Param ne alır?" },
          { value: "urun", label: "Ürün kaç para?" },
        ]}
        style={{ width: "100%" }}
      />

      {/* ── Selector card ── */}
      <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {mod === "para" ? (
          <>
            {/* Ne kadar paran var? */}
            <div>
              <div style={sectionLabelStyle}>Ne kadar paran var?</div>
              <Input
                type="number"
                value={tutar}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setTutar(Number.isFinite(v) && v >= 0 ? v : 0);
                }}
                style={{ fontFamily: "var(--font-data)" }}
              />
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <SegmentedControl
                  size="sm"
                  value={birim}
                  onChange={(v) => setBirim(v as ParaBirimi)}
                  options={[
                    { value: "TL", label: "TL" },
                    { value: "usd", label: "Dolar" },
                    { value: "gram-altin", label: "Gram altın" },
                  ]}
                />
              </div>
              {/* Kısayol çipleri */}
              <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingTop: 10, paddingBottom: 2 }}>
                <button
                  type="button"
                  disabled={asgariUcretYilA === null}
                  onClick={() => {
                    if (asgariUcretYilA === null) return;
                    setTutar(asgariUcretYilA);
                    setBirim("TL");
                  }}
                  style={pillButtonStyle(false, asgariUcretYilA === null)}
                >
                  O yılın asgari ücreti
                </button>
                {maas ? (
                  <button
                    type="button"
                    onClick={() => {
                      setTutar(maas);
                      setBirim("TL");
                    }}
                    style={pillButtonStyle(false)}
                  >
                    Maaşım
                  </button>
                ) : null}
              </div>
            </div>

            {/* Neyi almak istiyorsun? */}
            {targets.length > 0 && (
              <div>
                <div style={sectionLabelStyle}>Neyi almak istiyorsun?</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
                  {targets.map((t) => {
                    const on = t.id === targetId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTargetId(t.id)}
                        style={pillButtonStyle(on)}
                      >
                        <Icon name={t.iconName} size={14} />
                        {t.isim}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Ne kadar ürün? */}
            <div>
              <div style={sectionLabelStyle}>Ne kadar ürün?</div>
              <Input
                type="number"
                value={miktar}
                onChange={(e) => {
                  const v = parseFloat(e.target.value);
                  setMiktar(Number.isFinite(v) && v >= 0 ? v : 0);
                }}
                style={{ fontFamily: "var(--font-data)" }}
              />
            </div>

            {targets.length > 0 && (
              <div>
                <div style={sectionLabelStyle}>Hangi ürün?</div>
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
                  {targets.map((t) => {
                    const on = t.id === targetId;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTargetId(t.id)}
                        style={pillButtonStyle(on)}
                      >
                        <Icon name={t.iconName} size={14} />
                        {t.isim}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* Year selectors — stacked scroll rows, all years selectable */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <YearPicker label="Yıl A" years={allYears} value={yilA} onChange={setYilA} />
          <YearPicker label="Yıl B" years={allYears} value={yilB} onChange={setYilB} />
        </div>
      </Card>

      {/* ── Result card ── */}
      {(mod === "para" ? paraSonuc === null : urunSonuc === null) ? (
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
        <>
          {/* Dark result card */}
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
              {mod === "para" ? (
                <>
                  {formatSayi(tutar)} {BIRIM_ETIKET[birim]} ile alabileceğin{" "}
                  <strong style={{ color: "var(--text-strong)" }}>{targetIsim}</strong>{" "}
                  miktarı
                </>
              ) : (
                <>
                  {formatSayi(miktar)} {targetBirim}{" "}
                  <strong style={{ color: "var(--text-strong)" }}>{targetIsim}</strong>{" "}
                  kaç paraydı?
                </>
              )}
            </p>

            {/* BigStat row */}
            {mod === "para" && paraSonuc ? (
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
                  value={`${formatSayi(paraSonuc.a, paraSonuc.a >= 10 ? 0 : 1)} ${targetBirim}`}
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
                  value={`${formatSayi(paraSonuc.b, paraSonuc.b >= 10 ? 0 : 1)} ${targetBirim}`}
                  size="lg"
                  tone="accent"
                />
              </div>
            ) : null}

            {mod === "urun" && urunSonuc ? (
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
                  value={formatTL(urunSonuc.a.tl)}
                  size="md"
                  tone="strong"
                  caption={
                    urunSonuc.a.usd !== null
                      ? `≈ ${formatSayi(urunSonuc.a.usd, 1)} $`
                      : undefined
                  }
                />
                <Icon
                  name="arrowRight"
                  size={22}
                  style={{ color: "var(--accent)", marginBottom: 8, flexShrink: 0 }}
                />
                <BigStat
                  eyebrow={String(yilB)}
                  value={formatTL(urunSonuc.b.tl)}
                  size="lg"
                  tone="accent"
                  caption={
                    urunSonuc.b.usd !== null
                      ? `≈ ${formatSayi(urunSonuc.b.usd, 1)} $`
                      : undefined
                  }
                />
              </div>
            ) : null}

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
              {mod === "para" && paraSonuc
                ? (() => {
                    // Satın alma gücü: artış = olumlu (teal), düşüş = olumsuz (coral)
                    const artis = paraSonuc.yuzdeDegisim >= 0;
                    return (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 10px",
                          borderRadius: "var(--radius-pill)",
                          background: artis ? "var(--fall-tint)" : "var(--rise-tint)",
                          color: artis ? "var(--fall)" : "var(--rise)",
                          fontSize: 13,
                          fontWeight: 600,
                          fontFamily: "var(--font-data)",
                        }}
                      >
                        {artis ? "+" : "−"}%{Math.abs(Math.round(paraSonuc.yuzdeDegisim))}{" "}
                        {artis ? "daha fazla" : "daha az"}
                      </span>
                    );
                  })()
                : null}

              {mod === "urun" && urunSonuc
                ? (() => {
                    // Ürün pahalanması: artış = olumsuz (coral), düşüş = olumlu (teal)
                    const pahalandi = urunSonuc.yuzdeDegisim >= 0;
                    return (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "4px 10px",
                          borderRadius: "var(--radius-pill)",
                          background: pahalandi ? "var(--rise-tint)" : "var(--fall-tint)",
                          color: pahalandi ? "var(--rise)" : "var(--fall)",
                          fontSize: 13,
                          fontWeight: 600,
                          fontFamily: "var(--font-data)",
                        }}
                      >
                        {pahalandi ? "+" : "−"}%{Math.abs(Math.round(urunSonuc.yuzdeDegisim))}{" "}
                        {pahalandi ? "daha pahalı" : "daha ucuz"}
                      </span>
                    );
                  })()
                : null}

              {kaynak && (
                <SourceBadge
                  source={kaynak.kaynakAdi}
                  label={kaynak.tip}
                  status={kaynak.dogrulama === "dogrulanmis" ? "verified" : "pending"}
                  size="sm"
                />
              )}
            </div>
          </div>

          {/* Paylaş */}
          <Button
            variant="secondary"
            icon={<Icon name="share" size={16} />}
            onClick={() => setSheetOpen(true)}
          >
            Paylaş
          </Button>

          <ShareSheet
            open={sheetOpen}
            onClose={() => setSheetOpen(false)}
            card={{
              variant: "link",
              eyebrow: mod === "para" ? "Satın alma gücü" : "Ürün fiyatı",
              soru: soruBasligi,
              aDeger: aDegerStr,
              bDeger: bDegerStr,
              aEtiket: String(yilA),
              bEtiket: String(yilB),
              kaynak: kaynakAdi,
            }}
          />
        </>
      )}
    </div>
  );
}
