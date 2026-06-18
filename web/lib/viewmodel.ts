import type { Item, PricePoint, FiyatOpts, Degisim } from "@ec/data";
import { degisim as calcDegisim } from "@ec/data";
import { iconForItem } from "./icon-map";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface KaynakInfo {
  ad: string;
  tip: "net" | "ortalama";
  dogrulanmis: boolean;
}

export interface ItemViewModel {
  item: Item;
  iconName: string;
  seri: [number, number][];
  ilk: { yil: number; deger: number } | null;
  guncel: { yil: number; deger: number } | null;
  degisim: Degisim | null;
  kaynak: KaynakInfo | null;
}

export interface ListRowViewModel {
  item: Item;
  iconName: string;
  guncel: { yil: number; deger: number } | null;
  degisim: Degisim | null;
  kaynak: KaynakInfo | null;
}

// ─── seriBul ───────────────────────────────────────────────────────────────

/**
 * Build a [yil, deger] series for an item.
 * - One entry per year (prefer "dogrulanmis" when multiple for same year).
 * - Filtered by opts.tip / opts.kaynakAdi if provided.
 * - Sorted ascending by year.
 */
export function seriBul(
  prices: PricePoint[],
  itemId: string,
  opts: FiyatOpts = {},
): [number, number][] {
  let adaylar = prices.filter((p) => p.itemId === itemId);
  if (opts.tip) adaylar = adaylar.filter((p) => p.tip === opts.tip);
  if (opts.kaynakAdi) adaylar = adaylar.filter((p) => p.kaynakAdi === opts.kaynakAdi);

  if (adaylar.length === 0) return [];

  // Group by year, prefer "dogrulanmis"
  const byYear = new Map<number, PricePoint>();
  for (const p of adaylar) {
    const existing = byYear.get(p.yil);
    if (!existing) {
      byYear.set(p.yil, p);
    } else if (p.dogrulama === "dogrulanmis" && existing.dogrulama !== "dogrulanmis") {
      byYear.set(p.yil, p);
    }
  }

  return Array.from(byYear.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([yil, p]) => [yil, p.deger]);
}

// ─── itemViewModel ─────────────────────────────────────────────────────────

/**
 * Full view-model for a single item detail / featured card.
 */
export function itemViewModel(
  items: Item[],
  prices: PricePoint[],
  id: string,
  opts?: FiyatOpts,
): ItemViewModel {
  const item = items.find((i) => i.id === id);
  if (!item) {
    throw new Error(`itemViewModel: item not found: ${id}`);
  }

  const iconName = iconForItem(item);
  const seri = seriBul(prices, id, opts);

  const ilk = seri.length > 0 ? { yil: seri[0]![0], deger: seri[0]![1] } : null;
  const guncel = seri.length > 0 ? { yil: seri[seri.length - 1]![0], deger: seri[seri.length - 1]![1] } : null;

  const degisimVal =
    ilk && guncel
      ? calcDegisim(prices, id, ilk.yil, guncel.yil, opts)
      : null;

  // Latest price point for kaynak info
  let kaynak: KaynakInfo | null = null;
  if (guncel) {
    let adaylar = prices.filter((p) => p.itemId === id && p.yil === guncel.yil);
    if (opts?.tip) adaylar = adaylar.filter((p) => p.tip === opts.tip);
    if (opts?.kaynakAdi) adaylar = adaylar.filter((p) => p.kaynakAdi === opts.kaynakAdi);
    const latest = adaylar.find((p) => p.dogrulama === "dogrulanmis") ?? adaylar[0];
    if (latest) {
      kaynak = {
        ad: latest.kaynakAdi,
        tip: latest.tip,
        dogrulanmis: latest.dogrulama === "dogrulanmis",
      };
    }
  }

  return { item, iconName, seri, ilk, guncel, degisim: degisimVal, kaynak };
}

// ─── listViewModel ─────────────────────────────────────────────────────────

/**
 * Summary row view-models for the Home list.
 */
export function listViewModel(
  items: Item[],
  prices: PricePoint[],
): ListRowViewModel[] {
  return items.map((item) => {
    const vm = itemViewModel(items, prices, item.id);
    return {
      item: vm.item,
      iconName: vm.iconName,
      guncel: vm.guncel,
      degisim: vm.degisim,
      kaynak: vm.kaynak,
    };
  });
}
