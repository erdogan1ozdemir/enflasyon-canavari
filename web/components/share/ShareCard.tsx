import React from "react";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShareCardProps {
  /** "link" = 1200×630 OG card; "story" = 1080×1920 Story card */
  variant: "link" | "story";
  /** Short category label above the question, e.g. "Gıda" */
  eyebrow: string;
  /** The question being answered, e.g. "1 asgari maaş kaç ekmek alırdı?" */
  soru: string;
  /** First (older) value, e.g. "1.250" */
  aDeger: string;
  /** Second (newer) value, e.g. "880" */
  bDeger: string;
  /** Label for aDeger, e.g. "2005" */
  aEtiket?: string;
  /** Label for bDeger, e.g. "2026" */
  bEtiket?: string;
  /** Source attribution line, e.g. "TÜİK · ortalama · net asgari ücret" */
  kaynak: string;
  /**
   * Scale factor for preview rendering (0 < scale ≤ 1).
   * The card is always authored at its native pixel size and CSS-scaled down.
   * @default 1
   */
  scale?: number;
}

// ─── Colour tokens (dark radial — share cards only) ──────────────────────────

const C = {
  bg1: "#2A140C",
  bg2: "#160C07",
  bg3: "#0C0A08",
  text: "#F7F4F1",
  textMuted: "#9A918A",
  textSub: "#C7BDB4",
  coral: "#E8643A",
  coralLight: "#F09070",
  teal: "#7FD3C6",
  tealDot: "#34B3A2",
  tealBg: "rgba(14,119,108,0.18)",
  tealBorder: "rgba(37,143,130,0.5)",
  urlText: "#7A726A",
};

// ─── Source badge (inline — replicates the trust motif in dark context) ───────

function DarkSourceBadge({ kaynak }: { kaynak: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        background: C.tealBg,
        border: `1px solid ${C.tealBorder}`,
        borderRadius: 999,
        color: C.teal,
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: C.tealDot,
          flexShrink: 0,
        }}
      />
      {kaynak}
    </span>
  );
}

// ─── Link variant (1200 × 630) ────────────────────────────────────────────────

function LinkCard({ eyebrow, soru, aDeger, bDeger, aEtiket = "2005", bEtiket = "2026", kaynak }: ShareCardProps) {
  const W = 1200;
  const H = 630;

  return (
    <div
      style={{
        width: W,
        height: H,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        background: `radial-gradient(120% 140% at 88% 18%, ${C.bg1} 0%, ${C.bg2} 46%, ${C.bg3} 100%)`,
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        color: C.text,
        padding: "64px 72px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Image src="/monster-mark.svg" alt="Enflasyon Canavarı" width={40} height={40} />
        <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>
          Enflasyon Canavarı
        </span>
        <span
          style={{
            fontSize: 13,
            color: C.coralLight,
            letterSpacing: ".04em",
            marginLeft: "auto",
          }}
        >
          PARAN NE KADAR ERİDİ?
        </span>
      </div>

      {/* Main content */}
      <div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: C.textSub,
            letterSpacing: ".01em",
            whiteSpace: "nowrap",
          }}
        >
          {eyebrow} · {soru}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 36, marginTop: 18 }}>
          {/* A column */}
          <div>
            <div style={{ fontSize: 18, color: C.textMuted, fontWeight: 600, marginBottom: 6 }}>
              {aEtiket}
            </div>
            <div
              style={{
                fontFamily: "var(--font-data, 'Geist Mono', monospace)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                fontSize: 64,
                color: C.text,
                whiteSpace: "nowrap",
              }}
            >
              {aDeger}
            </div>
          </div>
          {/* Arrow */}
          <div
            style={{
              fontSize: 46,
              color: C.coral,
              alignSelf: "center",
              marginBottom: 14,
              lineHeight: 1,
            }}
          >
            →
          </div>
          {/* B column */}
          <div>
            <div style={{ fontSize: 18, color: C.textMuted, fontWeight: 600, marginBottom: 6 }}>
              {bEtiket}
            </div>
            <div
              style={{
                fontFamily: "var(--font-data, 'Geist Mono', monospace)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1,
                fontSize: 96,
                color: C.coral,
                whiteSpace: "nowrap",
              }}
            >
              {bDeger}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <DarkSourceBadge kaynak={kaynak} />
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-data, 'Geist Mono', monospace)",
            fontSize: 15,
            color: C.urlText,
          }}
        >
          enflasyoncanavari.com
        </span>
      </div>

      {/* Mascot peeking from bottom-right */}
      <Image
        src="/monster-mark.svg"
        alt=""
        width={360}
        height={360}
        aria-hidden="true"
        style={{
          position: "absolute",
          right: -40,
          bottom: -56,
          opacity: 0.96,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ─── Story variant (1080 × 1920) ──────────────────────────────────────────────

function StoryCard({ eyebrow, soru, aDeger, bDeger, aEtiket = "2005", bEtiket = "2026", kaynak }: ShareCardProps) {
  const W = 1080;
  const H = 1920;

  return (
    <div
      style={{
        width: W,
        height: H,
        boxSizing: "border-box",
        position: "relative",
        overflow: "hidden",
        background: `radial-gradient(110% 80% at 50% 6%, ${C.bg1} 0%, ${C.bg2} 44%, ${C.bg3} 100%)`,
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        color: C.text,
        padding: "96px 88px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
        <Image src="/monster-mark.svg" alt="Enflasyon Canavarı" width={76} height={76} />
        <span style={{ fontSize: 38, fontWeight: 800, letterSpacing: "-0.02em" }}>
          Enflasyon Canavarı
        </span>
      </div>

      {/* Hero mascot */}
      <Image
        src="/monster-mark.svg"
        alt=""
        width={300}
        height={300}
        aria-hidden="true"
        style={{ width: 300, height: 300, margin: "130px auto 0", display: "block" }}
      />

      {/* Question */}
      <div
        style={{
          textAlign: "center",
          fontSize: 44,
          fontWeight: 600,
          color: C.textSub,
          marginTop: 56,
          letterSpacing: ".005em",
          lineHeight: 1.35,
        }}
      >
        {eyebrow}
        <br />
        {soru}
      </div>

      {/* Stacked numbers */}
      <div
        style={{
          marginTop: 80,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 40,
        }}
      >
        {/* A row */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.textMuted, letterSpacing: ".02em" }}>
            {aEtiket}
          </div>
          <div
            style={{
              fontFamily: "var(--font-data, 'Geist Mono', monospace)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 0.96,
              fontSize: 130,
              color: C.text,
              whiteSpace: "nowrap",
            }}
          >
            {aDeger}
          </div>
        </div>

        {/* Down arrow */}
        <div style={{ fontSize: 64, color: C.coral, lineHeight: 0.5 }}>↓</div>

        {/* B row */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: 30, fontWeight: 600, color: C.textMuted, letterSpacing: ".02em" }}>
            {bEtiket}
          </div>
          <div
            style={{
              fontFamily: "var(--font-data, 'Geist Mono', monospace)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              lineHeight: 0.96,
              fontSize: 230,
              color: C.coral,
              whiteSpace: "nowrap",
            }}
          >
            {bDeger}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Source badge */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            height: 64,
            padding: "0 30px",
            borderRadius: 999,
            background: C.tealBg,
            border: `1.5px solid ${C.tealBorder}`,
            color: C.teal,
            fontSize: 30,
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          <span
            style={{ width: 14, height: 14, borderRadius: "50%", background: C.tealDot, flexShrink: 0 }}
          />
          {kaynak}
        </span>
      </div>

      {/* URL */}
      <div
        style={{
          textAlign: "center",
          fontFamily: "var(--font-data, 'Geist Mono', monospace)",
          fontSize: 30,
          color: C.urlText,
          marginTop: 34,
          letterSpacing: ".02em",
        }}
      >
        enflasyoncanavari.com
      </div>
    </div>
  );
}

// ─── ShareCard (public export) ────────────────────────────────────────────────

/**
 * ShareCard — pure visual component for OG/Story cards.
 *
 * Authored at native pixel dimensions (1200×630 or 1080×1920).
 * Pass `scale` (0–1) to shrink for an in-page preview.
 *
 * Inline styles only — this component intentionally uses a literal dark
 * radial gradient (design exception for share cards).
 */
export default function ShareCard(props: ShareCardProps) {
  const { variant, scale = 1 } = props;
  const nativeW = variant === "link" ? 1200 : 1080;
  const nativeH = variant === "link" ? 630 : 1920;

  const inner =
    variant === "link" ? <LinkCard {...props} /> : <StoryCard {...props} />;

  if (scale === 1) return inner;

  return (
    <div
      style={{
        width: nativeW * scale,
        height: nativeH * scale,
        overflow: "hidden",
        flexShrink: 0,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          width: nativeW,
          height: nativeH,
        }}
      >
        {inner}
      </div>
    </div>
  );
}
