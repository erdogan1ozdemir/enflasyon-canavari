import { loadItems, loadPrices } from "@ec/data";
import { listViewModel, itemViewModel } from "@/lib/viewmodel";
import HomeScreen from "@/components/screens/HomeScreen";
import { AdSlot } from "@/components/AdSlot";

export default function Home() {
  const items = loadItems();
  const prices = loadPrices();

  const rows = listViewModel(items, prices);
  const featured = itemViewModel(items, prices, "asgari-ucret");

  return (
    <main className="mx-auto max-w-2xl">
      <AdSlot id="anasayfa-ust" />
      <HomeScreen rows={rows} featured={featured} />
    </main>
  );
}
