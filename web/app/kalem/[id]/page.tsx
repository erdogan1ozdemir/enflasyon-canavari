import { notFound } from "next/navigation";
import { loadItems, loadPrices } from "@ec/data";
import { seriBul, itemViewModel } from "@/lib/viewmodel";
import { iconForItem } from "@/lib/icon-map";
import ItemDetailScreen from "@/components/screens/ItemDetailScreen";
import type { ItemDetailVM } from "@/components/screens/ItemDetailScreen";

// ─── Static params ──────────────────────────────────────────────────────────

export async function generateStaticParams() {
  const items = loadItems();
  return items.map((item) => ({ id: item.id }));
}

// ─── Page ────────────────────────────────────────────────────────────────────

// In Next.js 16 App Router, params is a Promise — must be awaited.
export default async function KalemDetayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const items = loadItems();
  const item = items.find((i) => i.id === id);
  if (!item) notFound();

  const prices = loadPrices();
  const iconName = iconForItem(item);

  // Discover which tips actually have data for this item
  const TIPS = ["net", "ortalama"] as const;
  type Tip = (typeof TIPS)[number];

  const availableTips: Tip[] = [];
  const series: Partial<Record<Tip, [number, number][]>> = {};

  for (const tip of TIPS) {
    const seri = seriBul(prices, id, { tip });
    if (seri.length > 0) {
      availableTips.push(tip);
      series[tip] = seri;
    }
  }

  // Build per-tip summary using itemViewModel
  const summary: Partial<
    Record<
      Tip,
      {
        ilk: { yil: number; deger: number } | null;
        guncel: { yil: number; deger: number } | null;
        degisim: { kat: number; yuzde: number } | null;
        kaynak: { ad: string; tip: "net" | "ortalama"; dogrulanmis: boolean } | null;
      }
    >
  > = {};

  for (const tip of availableTips) {
    const vm = itemViewModel(items, prices, id, { tip });
    summary[tip] = {
      ilk: vm.ilk,
      guncel: vm.guncel,
      degisim: vm.degisim,
      kaynak: vm.kaynak,
    };
  }

  const vm: ItemDetailVM = {
    item,
    iconName,
    tips: availableTips,
    series,
    summary,
  };

  return (
    <main className="mx-auto max-w-2xl">
      <ItemDetailScreen vm={vm} />
    </main>
  );
}
