import { loadItems, loadPrices } from "@ec/data";
import type { PricePoint } from "@ec/data";
import { seriBul } from "@/lib/viewmodel";
import { iconForItem } from "@/lib/icon-map";
import CompareScreen from "@/components/screens/CompareScreen";

// ─── Types (serializable) ────────────────────────────────────────────────────

export interface CompareItemVM {
  id: string;
  isim: string;
  iconName: string;
  birim: string;
  /** Years that have price data (may be empty). */
  yillar: number[];
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function KarsilastirPage() {
  const items = loadItems();
  const prices = loadPrices();

  // Build per-item VM with available years
  const itemVMs: CompareItemVM[] = items.map((item) => {
    const seri = seriBul(prices, item.id);
    return {
      id: item.id,
      isim: item.isim,
      iconName: iconForItem(item),
      birim: item.birim,
      yillar: seri.map(([yil]) => yil),
    };
  });

  // Overall year range across all data
  const allYears = prices.map((p: PricePoint) => p.yil);
  const minYil = allYears.length > 0 ? Math.min(...allYears) : 2005;
  const maxYil = allYears.length > 0 ? Math.max(...allYears) : 2026;

  return (
    <main className="mx-auto max-w-2xl">
      <CompareScreen
        items={itemVMs}
        prices={prices}
        minYil={minYil}
        maxYil={maxYil}
      />
    </main>
  );
}
