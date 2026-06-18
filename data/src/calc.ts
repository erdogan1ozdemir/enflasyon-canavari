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
