"use client";

import React, { useEffect, useRef, useState } from "react";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { isApp } from "@/lib/platform";
import { clearProfil } from "@/lib/profile";

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 12,
  padding: "14px 16px",
  minHeight: "var(--tap-min, 44px)",
};

type ConfirmState = "idle" | "confirming" | "done";

export default function SettingsScreen() {
  const [app, setApp] = useState(false);
  const [bildirim, setBildirim] = useState(false);
  const [confirmState, setConfirmState] = useState<ConfirmState>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setApp(isApp()), []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleResetClick() {
    if (confirmState === "idle") {
      setConfirmState("confirming");
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setConfirmState("idle"), 3000);
      return;
    }
    if (confirmState === "confirming") {
      if (timerRef.current) clearTimeout(timerRef.current);
      clearProfil();
      setConfirmState("done");
      timerRef.current = setTimeout(() => setConfirmState("idle"), 2000);
    }
  }

  const resetLabel =
    confirmState === "confirming"
      ? "Emin misin? Tekrar dokun"
      : confirmState === "done"
        ? "Silindi"
        : "Verilerimi sıfırla";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card padding="none">
        {/* Dil — pasif */}
        <div style={{ ...rowStyle, borderTop: "none" }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-strong)" }}>
            Dil
          </span>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14, color: "var(--text-muted)" }}>Türkçe</span>
            <Badge tone="warning" size="sm">
              Yakında
            </Badge>
          </div>
        </div>

        {/* Bildirimler — yalnız app */}
        {app && (
          <div style={{ ...rowStyle, borderTop: "1px solid var(--border-subtle)" }}>
            <Icon name="bell" size={18} style={{ color: "var(--text-muted)" }} aria-hidden />
            <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-strong)" }}>
              Bildirimler
            </span>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
              <Badge tone="warning" size="sm">
                Yakında
              </Badge>
              <button
                type="button"
                aria-pressed={bildirim}
                onClick={() => setBildirim((v) => !v)}
                style={{
                  width: 44,
                  height: 26,
                  borderRadius: "var(--radius-pill)",
                  border: "1px solid var(--border-strong)",
                  background: bildirim ? "var(--accent)" : "var(--bg-subtle)",
                  position: "relative",
                  cursor: "pointer",
                  transition: "background var(--dur-fast) var(--ease-out)",
                  flexShrink: 0,
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: bildirim ? 21 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "#fff",
                    transition: "left var(--dur-fast) var(--ease-out)",
                    boxShadow: "var(--shadow-sm)",
                  }}
                />
              </button>
            </div>
          </div>
        )}

        {/* Reklamları kaldır — pasif */}
        <div style={{ ...rowStyle, borderTop: "1px solid var(--border-subtle)" }}>
          <Icon name="banknote" size={18} style={{ color: "var(--text-muted)" }} aria-hidden />
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--text-strong)" }}>
            Reklamları kaldır
          </span>
          <Badge tone="warning" size="sm" style={{ marginLeft: "auto" }}>
            Yakında
          </Badge>
        </div>
      </Card>

      <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--text-muted)" }}>
          Cihazında saklanan profil bilgilerini siler.
        </p>
        <Button variant="danger" onClick={handleResetClick}>
          {resetLabel}
        </Button>
      </Card>
    </div>
  );
}
