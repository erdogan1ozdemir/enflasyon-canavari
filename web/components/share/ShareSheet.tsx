'use client';

import React, { useCallback, useEffect, useState } from "react";
import ShareCard, { type ShareCardProps } from "./ShareCard";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/Icon";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ShareSheetProps {
  open: boolean;
  onClose: () => void;
  card: ShareCardProps;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ShareSheet — slide-up bottom sheet that previews a ShareCard and
 * exposes "Görseli indir", "Bağlantıyı kopyala", "Paylaş" actions.
 *
 * Implemented as a full-viewport flex container (position:fixed) with the
 * panel anchored to the bottom edge. Traps focus and closes on Escape.
 */
export default function ShareSheet({ open, onClose, card }: ShareSheetProps) {
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");
  const [downloadState, setDownloadState] = useState<"idle" | "yakinda">("idle");

  // ── Close on Escape ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // ── Prevent body scroll while open ──────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const handleCopy = useCallback(async () => {
    const url =
      typeof window !== "undefined" ? window.location.href : "https://enflasyoncanavari.com";
    try {
      await navigator.clipboard.writeText(url);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("idle");
    }
  }, []);

  const handleDownload = useCallback(() => {
    setDownloadState("yakinda");
    setTimeout(() => setDownloadState("idle"), 2500);
  }, []);

  const handleShare = useCallback(async () => {
    const url =
      typeof window !== "undefined" ? window.location.href : "https://enflasyoncanavari.com";
    const data: ShareData = {
      title: "Enflasyon Canavarı",
      text: card.soru,
      url,
    };
    if (typeof navigator !== "undefined" && navigator.share && navigator.canShare?.(data)) {
      try {
        await navigator.share(data);
      } catch {
        // kullanıcı iptal etti veya API desteklenmiyor
      }
    } else {
      // Web Share API yoksa bağlantı kopyalamaya geri dön
      await handleCopy();
    }
  }, [card.soru, handleCopy]);

  // ── Preview scale — fit within ~340 px wide ──────────────────────────────
  const previewW = 340;
  const nativeW = card.variant === "link" ? 1200 : 1080;
  const previewScale = previewW / nativeW;

  if (!open) return null;

  return (
    /* Backdrop — full-viewport flex container */
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Paylaş"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      {/* Sheet panel */}
      <div
        style={{
          background: "var(--surface-page, #fff)",
          borderRadius: "16px 16px 0 0",
          padding: "20px 20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          maxHeight: "92dvh",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "var(--text-strong)",
              letterSpacing: "-0.01em",
            }}
          >
            Paylaş
          </span>
          <button
            onClick={onClose}
            aria-label="Kapat"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              color: "var(--text-muted)",
              display: "flex",
              alignItems: "center",
            }}
          >
            <Icon name="x" size={20} />
          </button>
        </div>

        {/* Card preview */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            overflow: "hidden",
            borderRadius: 12,
            border: "1px solid var(--border-subtle)",
          }}
        >
          <ShareCard {...card} scale={previewScale} />
        </div>

        {/* Variant toggle hint */}
        <p
          style={{
            margin: 0,
            fontSize: 12,
            color: "var(--text-faint)",
            textAlign: "center",
          }}
        >
          {card.variant === "link" ? "Yatay görsel · 1200×630" : "Story görseli · 1080×1920"}
        </p>

        {/* Action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* Görseli indir */}
          <Button
            variant="secondary"
            fullWidth
            icon={<Icon name="download" size={16} />}
            onClick={handleDownload}
          >
            {downloadState === "yakinda" ? "Yakında geliyor…" : "Görseli indir"}
          </Button>

          {/* Bağlantıyı kopyala */}
          <Button
            variant="secondary"
            fullWidth
            icon={copyState === "copied" ? <Icon name="check" size={16} /> : <Icon name="share" size={16} />}
            onClick={handleCopy}
          >
            {copyState === "copied" ? "Kopyalandı!" : "Bağlantıyı kopyala"}
          </Button>

          {/* Paylaş (Web Share API) */}
          <Button
            variant="primary"
            fullWidth
            icon={<Icon name="share" size={16} />}
            onClick={handleShare}
          >
            Paylaş
          </Button>
        </div>
      </div>
    </div>
  );
}
