import { loadSources } from "@ec/data";

export default function Kaynaklar() {
  const sources = loadSources();
  return (
    <main className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-medium">Kaynaklar ve metodoloji</h1>
      <p className="mt-2 text-neutral-500">
        Tüm fiyatlar yeni TL cinsindendir. Başlangıç: 1 Ocak 2005 (6 sıfırın atıldığı tarih).
        Değerler &quot;net&quot; veya &quot;ortalama&quot; olarak etiketlenir.
      </p>
      <ul className="mt-6 space-y-3">
        {sources.map((s) => (
          <li key={s.ad} className="rounded-lg border p-3">
            <div className="font-medium">{s.ad}</div>
            <div className="text-sm text-neutral-500">{s.metodoloji}</div>
            <a href={s.url} className="text-sm underline">{s.url}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
