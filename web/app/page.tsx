import { loadItems } from "@ec/data";
import { AdSlot } from "@/components/AdSlot";

export default function Home() {
  const items = loadItems();
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-medium">Enflasyon Canavarı</h1>
      <p className="mt-2 text-neutral-500">Paranı canavar ne kadar yedi?</p>
      <AdSlot id="anasayfa-ust" />
      <ul className="mt-6 space-y-2">
        {items.map((i) => (
          <li key={i.id} className="rounded-lg border p-3">
            <span className="font-medium">{i.isim}</span>{" "}
            <span className="text-sm text-neutral-500">({i.kategori})</span>
          </li>
        ))}
      </ul>
      <a href="/kaynaklar" className="mt-6 inline-block text-sm underline">
        Kaynaklar ve metodoloji
      </a>
    </main>
  );
}
