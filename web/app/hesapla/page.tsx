import { loadItems, loadPrices } from "@ec/data";
import type { PricePoint } from "@ec/data";
import CalcScreen from "@/components/screens/CalcScreen";

// ─── Config ──────────────────────────────────────────────────────────────────

/**
 * Preferred inflation index item id.
 * Prefer an item with birim === "endeks" when one exists in the dataset.
 * Currently none → falls back to this constant (no prices → hasEndeks: false).
 */
const ENDEKS_ID = "tufe";

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HesaplaPage() {
  const items = loadItems();
  const prices = loadPrices();

  // Resolve index item: prefer any item whose birim is "endeks", else use ENDEKS_ID.
  const endeksItem = items.find((i) => i.birim === "endeks");
  const endeksId = endeksItem?.id ?? ENDEKS_ID;

  // Available years across all price data
  const allYears = prices.map((p: PricePoint) => p.yil);
  const minYil = allYears.length > 0 ? Math.min(...allYears) : 2005;
  const maxYil = allYears.length > 0 ? Math.max(...allYears) : 2026;

  // Build a deduplicated sorted year list
  const availableYears: number[] = Array.from(new Set(allYears)).sort((a, b) => a - b);

  // Does the index item have any price data?
  const hasEndeks = prices.some((p: PricePoint) => p.itemId === endeksId);

  return (
    <main className="mx-auto max-w-2xl">
      <CalcScreen
        prices={prices}
        availableYears={availableYears}
        minYil={minYil}
        maxYil={maxYil}
        endeksId={endeksId}
        hasEndeks={hasEndeks}
      />
    </main>
  );
}
