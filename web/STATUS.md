# web/ — DURUM

> `@ec/web` — Next.js 16 App Router frontend. Yaşayan durum/TODO. Ana izleyici: [../DURUM.md](../DURUM.md).

**Son güncelleme:** 2026-06-19

## Yapı
- `app/` — rotalar: `/` (Home), `/kalem/[id]` (detay, SSG), `/karsilastir`, `/hesapla`, `/kaynaklar`, `app/icon.svg` (favicon).
- `components/` — `ui/` (Button, Card, Badge, Input, SegmentedControl), `data/` (SourceBadge, BigStat, TrendPill, ItemRow, LineChart), `screens/` (Home/ItemDetail/Compare/Calc/Sources), `share/` (ShareCard, ShareSheet), `Icon`, `AppShell`, `BottomNav`, `ThemeProvider`, `ThemeToggle`, `AdSlot`.
- `lib/` — `viewmodel.ts` (seriBul/itemViewModel/listViewModel + CompareItemVM), `icon-map.ts`, `labels.ts` (KATEGORI_LABELS).
- `config/flags.ts` — ads/premium/crowdsource (hepsi kapalı).
- Stil: tasarım tokenları (inline-style + `var(--token)`), Tailwind layout için. Tema `next-themes` (`data-theme`).

## Çalışıyor
- 5 ekran gerçek `@ec/data` + `calc.ts`'e bağlı; light/dark; mobil-önce responsive.
- Home (kalem listesi + öne çıkan), Kalem Detay (hero + grafik + tablo), Hesapla (TÜFE), Kaynaklar.

## Bilinen sorunlar / TODO
- ✅ **Karşılaştır** (Faz 3 Adım 2 — çözüldü): TÜFE hedeflerden çıkarıldı (`birim !== "endeks"`); yıl seçiciler iki yatay-kaydırmalı satıra alındı (tüm yıllar, taşma yok); akıllı varsayılan (verisi olan hedef + örtüşen yıllar → açılışta gerçek sonuç). `YearPicker` yerel bileşeni eklendi.
  - Nüans (Adım 6/cila): satın alma gücü artışı şu an coral-yukarı; olumlu olduğu için renk semantiği gözden geçirilebilir.
- ✅ **Hesapla** (Faz 3 Adım 3 — çözüldü): yön toggle eklendi — "O gün → bugün" ve "Bugün → o gün". `enflasyonaGore` yön parametreleriyle çağrılıyor; etiket/eyebrow/caption yöne göre değişiyor.
- **Kaynaklar → Profil:** `/profil`'e dönüştürülecek (Hakkında + Tema + kaynaklar + "yakında" cüzdan). → Adım 4
- **ShareSheet** ekranlara bağlı değil; dinamik OG yok.
- Veri olmayan kalemler "veri yok" gösteriyor (ekmek vb.).

## Komutlar
`npm run dev -w web` · `npm run build -w web` · `npm run test -w web`
