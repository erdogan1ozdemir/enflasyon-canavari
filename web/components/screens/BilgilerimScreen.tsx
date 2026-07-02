"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/Icon";
import { isApp } from "@/lib/platform";
import { getProfil, setProfil } from "@/lib/profile";

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.07em",
  textTransform: "uppercase",
  color: "var(--text-faint)",
  marginBottom: 8,
};

export default function BilgilerimScreen() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);
  const [ad, setAd] = useState("");
  const [maas, setMaas] = useState<number>(0);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isApp()) {
      const p = getProfil();
      setAd(p.adSoyad ?? "");
      setMaas(p.maas ?? 0);
      setAllowed(true);
    } else {
      router.replace("/profil");
    }
    setChecked(true);
  }, [router]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  function handleMaasChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseFloat(e.target.value);
    setMaas(isNaN(val) || val < 0 ? 0 : val);
  }

  function handleSave() {
    setProfil({
      adSoyad: ad.trim() || undefined,
      maas: maas > 0 ? maas : undefined,
    });
    setSaved(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setSaved(false), 2000);
  }

  if (!checked || !allowed) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card padding="md" style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        <div>
          <div style={labelStyle}>Ad soyad</div>
          <Input
            type="text"
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            placeholder="Adın Soyadın"
          />
        </div>

        <div>
          <div style={labelStyle}>Aylık maaş (TL)</div>
          <Input
            type="number"
            value={maas === 0 ? "" : maas}
            onChange={handleMaasChange}
            placeholder="0"
            style={{ fontFamily: "var(--font-data)", fontWeight: 600 }}
          />
        </div>

        <p style={{ margin: 0, fontSize: 12, color: "var(--text-faint)", lineHeight: 1.5 }}>
          Maaşını kaydedersen Karşılaştır&apos;da &quot;Maaşım&quot; kısayolu görünür.
        </p>

        <Button onClick={handleSave} icon={saved ? <Icon name="check" size={16} /> : undefined}>
          {saved ? "Kaydedildi" : "Kaydet"}
        </Button>
      </Card>

      <p style={{ margin: 0, fontSize: 12, color: "var(--text-faint)", lineHeight: 1.5 }}>
        Bilgilerin yalnızca cihazında saklanır; hesap gerektirmez.
      </p>
    </div>
  );
}
