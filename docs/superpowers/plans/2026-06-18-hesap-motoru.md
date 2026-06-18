# Hesap Motoru Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `@ec/data` içine saf, TDD ile yazılmış bir hesap motoru (`calc.ts`) ekle: enflasyon değişimi, satın alma gücü, "kaç X eder", endekse göre güncelleme ve tr-TR biçimlendirme.

**Architecture:** `PricePoint[]` üzerinde çalışan saf fonksiyonlar. Eksik veri/sıfıra bölme → `null`. Kaynak/tip seçimi `opts` ile; varsayılan `dogrulanmis` tercihi. Endeks, `birim: "endeks"` bir kalem olarak modellenir. Mevcut node Vitest kurulumuyla test edilir; `data/src/index.ts`'ten export edilir.

**Tech Stack:** TypeScript (strict, `noUncheckedIndexedAccess`), Vitest (node), Intl (tr-TR).

---

## Dosya Yapısı

```
data/
├── src/
│   ├── calc.ts        # YENİ — hesap motoru (saf fonksiyonlar)
│   └── index.ts       # DEĞİŞİR — calc export'ları eklenir
└── test/
    └── calc.test.ts   # YENİ — TDD testleri
docs/
└── 08-hesap-motoru.md # YENİ — kısa not
```

---

## Task 1: Hesap motoru (`calc.ts`) — TDD

**Files:**
- Create: `data/src/calc.ts`
- Create: `data/test/calc.test.ts`
- Modify: `data/src/index.ts`

Bağlam: `data/src/types.ts` `PricePoint` tipini export eder (alanlar: `itemId, yil, deger, tip, kaynakTipi, kaynakAdi, kaynakURL, dogrulama, not`). `data/src/index.ts` halihazırda schema/type/loader/validator export eder. Testler kökten `npx vitest run data/test/calc.test.ts` ile çalışır. `noUncheckedIndexedAccess` açık olduğu için dizi indekslemede `!` veya null kontrolü gerekir.

- [ ] **Step 1: Başarısız testi yaz** — `data/test/calc.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { PricePointSchema } from "../src/schema";
import {
  fiyatBul,
  degisim,
  satinAlmaGucu,
  satinAlmaGucuKarsilastir,
  kacXEder,
  enflasyonaGore,
  formatTL,
  formatSayi,
} from "../src/calc";

const pp = (o: Record<string, unknown>) =>
  PricePointSchema.parse({
    tip: "ortalama",
    kaynakTipi: "elle",
    kaynakAdi: "TÜİK",
    kaynakURL: "https://www.tuik.gov.tr",
    dogrulama: "dogrulanmis",
    ...o,
  });

const prices = [
  pp({ itemId: "ekmek", yil: 2005, deger: 0.4 }),
  pp({ itemId: "ekmek", yil: 2026, deger: 25 }),
  pp({ itemId: "asgari-ucret", yil: 2005, deger: 350, tip: "net" }),
  pp({ itemId: "asgari-ucret", yil: 2026, deger: 22000, tip: "net" }),
  pp({ itemId: "tufe", yil: 2005, deger: 100 }),
  pp({ itemId: "tufe", yil: 2026, deger: 6150 }),
  // çok-kaynaklı: aynı kalem/yıl/tip, farklı kaynak + biri beklemede
  pp({ itemId: "usd", yil: 2026, deger: 45, kaynakAdi: "TCMB EVDS", kaynakTipi: "resmi-api", kaynakURL: "https://evds2.tcmb.gov.tr", dogrulama: "dogrulanmis" }),
  pp({ itemId: "usd", yil: 2026, deger: 99, kaynakAdi: "Şüpheli", dogrulama: "beklemede" }),
];

describe("fiyatBul", () => {
  it("değeri bulur", () => {
    expect(fiyatBul(prices, "ekmek", 2005)).toBe(0.4);
  });
  it("veri yoksa null", () => {
    expect(fiyatBul(prices, "ekmek", 2010)).toBeNull();
  });
  it("tip filtresi uygular", () => {
    expect(fiyatBul(prices, "asgari-ucret", 2005, { tip: "ortalama" })).toBeNull();
    expect(fiyatBul(prices, "asgari-ucret", 2005, { tip: "net" })).toBe(350);
  });
  it("kaynakAdi filtresi uygular", () => {
    expect(fiyatBul(prices, "usd", 2026, { kaynakAdi: "Şüpheli" })).toBe(99);
  });
  it("birden çok eşleşmede dogrulanmis olanı tercih eder", () => {
    expect(fiyatBul(prices, "usd", 2026)).toBe(45);
  });
});

describe("degisim", () => {
  it("kat ve yüzde hesaplar", () => {
    const d = degisim(prices, "ekmek", 2005, 2026);
    expect(d).not.toBeNull();
    expect(d!.kat).toBeCloseTo(62.5);
    expect(d!.yuzde).toBeCloseTo(6150);
  });
  it("eksik veride null", () => {
    expect(degisim(prices, "ekmek", 2005, 2010)).toBeNull();
  });
});

describe("satinAlmaGucu", () => {
  it("1 kaynak kaç hedef alır", () => {
    expect(satinAlmaGucu(prices, "asgari-ucret", "ekmek", 2005)).toBeCloseTo(875);
    expect(satinAlmaGucu(prices, "asgari-ucret", "ekmek", 2026)).toBeCloseTo(880);
  });
  it("eksik veride null", () => {
    expect(satinAlmaGucu(prices, "asgari-ucret", "ekmek", 2010)).toBeNull();
  });
});

describe("satinAlmaGucuKarsilastir", () => {
  it("iki yıl arası değişimi verir", () => {
    const r = satinAlmaGucuKarsilastir(prices, "asgari-ucret", "ekmek", 2005, 2026);
    expect(r).not.toBeNull();
    expect(r!.a).toBeCloseTo(875);
    expect(r!.b).toBeCloseTo(880);
    expect(r!.yuzdeDegisim).toBeCloseTo(((880 - 875) / 875) * 100);
  });
});

describe("kacXEder", () => {
  it("tutar kaç adet alır", () => {
    expect(kacXEder(prices, 100, "ekmek", 2026)).toBeCloseTo(4);
  });
  it("fiyat yoksa null", () => {
    expect(kacXEder(prices, 100, "ekmek", 2010)).toBeNull();
  });
});

describe("enflasyonaGore", () => {
  it("endekse göre tutarı günceller", () => {
    expect(enflasyonaGore(prices, "tufe", 350, 2005, 2026)).toBeCloseTo(350 * (6150 / 100));
  });
  it("endeks yoksa null", () => {
    expect(enflasyonaGore(prices, "yok", 350, 2005, 2026)).toBeNull();
  });
});

describe("format", () => {
  it("formatSayi tr-TR binlik ayırıcı", () => {
    expect(formatSayi(1250)).toBe("1.250");
  });
  it("formatTL ₺ içerir", () => {
    expect(formatTL(25)).toContain("₺");
  });
});
```

- [ ] **Step 2: Testi çalıştır, başarısız olduğunu gör**

Run: `npx vitest run data/test/calc.test.ts`
Expected: FAIL — `../src/calc` bulunamıyor.

- [ ] **Step 3: Motoru yaz** — `data/src/calc.ts`:

```ts
import type { PricePoint } from "./types";

export interface FiyatOpts {
  tip?: "net" | "ortalama";
  kaynakAdi?: string;
}

export interface Degisim {
  kat: number;
  yuzde: number;
}

export interface GucKarsilastir {
  a: number;
  b: number;
  yuzdeDegisim: number;
}

export function fiyatBul(
  prices: PricePoint[],
  itemId: string,
  yil: number,
  opts: FiyatOpts = {},
): number | null {
  let adaylar = prices.filter((p) => p.itemId === itemId && p.yil === yil);
  if (opts.tip) adaylar = adaylar.filter((p) => p.tip === opts.tip);
  if (opts.kaynakAdi) adaylar = adaylar.filter((p) => p.kaynakAdi === opts.kaynakAdi);
  if (adaylar.length === 0) return null;
  const secilen = adaylar.find((p) => p.dogrulama === "dogrulanmis") ?? adaylar[0]!;
  return secilen.deger;
}

export function degisim(
  prices: PricePoint[],
  itemId: string,
  yilA: number,
  yilB: number,
  opts?: FiyatOpts,
): Degisim | null {
  const a = fiyatBul(prices, itemId, yilA, opts);
  const b = fiyatBul(prices, itemId, yilB, opts);
  if (a === null || b === null || a === 0) return null;
  return { kat: b / a, yuzde: ((b - a) / a) * 100 };
}

export function satinAlmaGucu(
  prices: PricePoint[],
  kaynakId: string,
  hedefId: string,
  yil: number,
  opts?: FiyatOpts,
): number | null {
  const k = fiyatBul(prices, kaynakId, yil, opts);
  const h = fiyatBul(prices, hedefId, yil, opts);
  if (k === null || h === null || h === 0) return null;
  return k / h;
}

export function satinAlmaGucuKarsilastir(
  prices: PricePoint[],
  kaynakId: string,
  hedefId: string,
  yilA: number,
  yilB: number,
  opts?: FiyatOpts,
): GucKarsilastir | null {
  const a = satinAlmaGucu(prices, kaynakId, hedefId, yilA, opts);
  const b = satinAlmaGucu(prices, kaynakId, hedefId, yilB, opts);
  if (a === null || b === null || a === 0) return null;
  return { a, b, yuzdeDegisim: ((b - a) / a) * 100 };
}

export function kacXEder(
  prices: PricePoint[],
  tutarTL: number,
  itemId: string,
  yil: number,
  opts?: FiyatOpts,
): number | null {
  const f = fiyatBul(prices, itemId, yil, opts);
  if (f === null || f === 0) return null;
  return tutarTL / f;
}

export function enflasyonaGore(
  prices: PricePoint[],
  endeksItemId: string,
  tutar: number,
  yilA: number,
  yilB: number,
  opts?: FiyatOpts,
): number | null {
  const ia = fiyatBul(prices, endeksItemId, yilA, opts);
  const ib = fiyatBul(prices, endeksItemId, yilB, opts);
  if (ia === null || ib === null || ia === 0) return null;
  return tutar * (ib / ia);
}

export function formatTL(n: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 2,
  }).format(n);
}

export function formatSayi(n: number, ondalik = 0): string {
  return new Intl.NumberFormat("tr-TR", { maximumFractionDigits: ondalik }).format(n);
}
```

- [ ] **Step 4: index.ts'i güncelle** — `data/src/index.ts` (tam içerik):

```ts
export { ItemSchema, PricePointSchema, SourceSchema, KATEGORILER, BIRIMLER, KAYNAK_TIPLERI } from "./schema";
export type { Item, PricePoint, Source } from "./types";
export { loadItems, loadSources, loadPrices } from "./load";
export { validateDataset } from "./validate";
export {
  fiyatBul,
  degisim,
  satinAlmaGucu,
  satinAlmaGucuKarsilastir,
  kacXEder,
  enflasyonaGore,
  formatTL,
  formatSayi,
} from "./calc";
export type { FiyatOpts, Degisim, GucKarsilastir } from "./calc";
```

> Not: Mevcut `index.ts`'in ilk dört export satırını koru (KAYNAK_TIPLERI dahil) — yukarıdaki blok bunları zaten içeriyor, calc export'larını ekler.

- [ ] **Step 5: Testi çalıştır, geçtiğini gör**

Run: `npx vitest run data/test/calc.test.ts`
Expected: PASS (tüm calc testleri).

- [ ] **Step 6: Tüm paketi çalıştır (regresyon)**

Run: `npx vitest run`
Expected: data suite tamamı geçer (schema + validate + calc).

- [ ] **Step 7: Commit**

```bash
git add data/src/calc.ts data/test/calc.test.ts data/src/index.ts
git commit -m "feat(data): hesap motoru (enflasyon, satın alma gücü, format)"
```

---

## Task 2: Docs notu

**Files:**
- Create: `docs/08-hesap-motoru.md`

- [ ] **Step 1: Notu yaz** — `docs/08-hesap-motoru.md`:

```markdown
# Hesap Motoru

`@ec/data` içindeki `calc.ts`, 4 MVP özelliğinin kullandığı saf hesaplama fonksiyonlarını sağlar:
`fiyatBul`, `degisim`, `satinAlmaGucu`, `satinAlmaGucuKarsilastir`, `kacXEder`, `enflasyonaGore`,
ve `formatTL` / `formatSayi`.

İlkeler:
- Eksik veri veya sıfıra bölme → `null` (tahmin/interpolasyon yok; güven ilkesi).
- Kaynak/tip seçimi `opts` ile; varsayılan `dogrulanmis` kaydı tercih eder (çok-kaynaklılık).
- Motor ham sayı döndürür; yuvarlama/biçim UI'da (`formatTL`/`formatSayi` kolaylık için).
- Endeks (TÜFE) `birim: "endeks"` bir kalem olarak modellenir; `enflasyonaGore` onu kullanır.

Ayrıntı: docs/superpowers/specs/2026-06-18-hesap-motoru-design.md
```

- [ ] **Step 2: Commit**

```bash
git add docs/08-hesap-motoru.md
git commit -m "docs: hesap motoru notu"
```

---

## Tamamlanma Kriterleri

- [ ] `npx vitest run` → schema + validate + calc testleri geçiyor.
- [ ] `calc.ts` 8 fonksiyon + 3 tip export ediyor; `index.ts`'ten erişilebilir.
- [ ] Eksik veri/sıfıra bölme `null` döndürüyor; çok-kaynaklı seçimde `dogrulanmis` tercih ediliyor.
- [ ] `docs/08-hesap-motoru.md` yerinde.

## Sonraki Planlar (kapsam dışı)
- Yıl-yıl fiyat tablosu UI (tasarım gelince)
- Karşılaştırma + paylaşım kartı UI
- Kişisel hesap UI
- Faz 2 gerçek veri (TCMB/TÜİK/EPDK)
