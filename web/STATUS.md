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
- **Karşılaştır:** TÜFE "neyi alır" hedefinde görünüyor (çıkarılmalı); yıl seçiciler kartı taşırıyor (layout); varsayılan kombo boş ("veri yok") geliyor (verisi olan komboya düşmeli). → Faz 3 Adım 2
- **Hesapla:** yalnız "o gün→bugün"; ters yön ("bugün→o gün") eklenecek. → Adım 3
- **Kaynaklar → Profil:** `/profil`'e dönüştürülecek (Hakkında + Tema + kaynaklar + "yakında" cüzdan). → Adım 4
- **ShareSheet** ekranlara bağlı değil; dinamik OG yok.
- Veri olmayan kalemler "veri yok" gösteriyor (ekmek vb.).

## Komutlar
`npm run dev -w web` · `npm run build -w web` · `npm run test -w web`
