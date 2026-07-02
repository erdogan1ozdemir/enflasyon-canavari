# web/ — DURUM

> `@ec/web` — Next.js 16 App Router frontend. Yaşayan durum/TODO. Ana izleyici: [../DURUM.md](../DURUM.md).

**Son güncelleme:** 2026-07-03 (Faz 4)

## Yapı
- `app/` — rotalar: `/` (Home), `/kalem/[id]` (detay, SSG), `/karsilastir`, `/hesapla`, `/profil` hub + `/profil/{tema,hakkinda,kaynaklar,ayarlar,bilgilerim}` (eski `/kaynaklar` → `/profil/kaynaklar` yönlendirir), `app/icon.svg` (favicon).
- `components/` — `ui/` (Button, Card, Badge, Input, SegmentedControl), `data/` (SourceBadge, BigStat, TrendPill, ItemRow, LineChart), `screens/` (Home/ItemDetail/Compare/Calc/Sources/Profile hub/Settings/Bilgilerim), `share/` (ShareCard, ShareSheet — Karşılaştır'a bağlı), `Icon`, `AppShell`, `BottomNav`, `SubPageShell` (← geri; swipe-back history ile), `ThemeProvider`, `ThemeToggle`, `ThemeSetting`, `AdSlot`.
- `lib/` — `viewmodel.ts` (seriBul/itemViewModel/listViewModel/CompareItemVM + **paraToUrun/urunToPara**), `profile.ts` (`ec_profil` localStorage: adSoyad/maas), `platform.ts` (`isApp()` Capacitor tespiti), `icon-map.ts`, `labels.ts`.
- `config/flags.ts` — ads/premium/crowdsource (hepsi kapalı).
- **Karşılaştır v2:** mod toggle ("Param ne alır?" / "Ürün kaç para?"), serbest tutar + TL/Dolar/Gram altın, "O yılın asgari ücreti" ve "Maaşım" çipleri, ürün→para TL+≈USD, Paylaş → ShareSheet.
- **Platform ayrımı:** web düz site/login'siz; app-only öğeler (`Bilgilerim`, Bildirimler) `isApp()` ile gizli; kişisel veri yalnız cihazda.
- Stil: tasarım tokenları (inline-style + `var(--token)`), Tailwind layout için. Tema `next-themes` (`data-theme`).

## Çalışıyor
- 5 ekran gerçek `@ec/data` + `calc.ts`'e bağlı; light/dark; mobil-önce responsive.
- Home (kalem listesi + öne çıkan), Kalem Detay (hero + grafik + tablo), Hesapla (TÜFE), Kaynaklar.

## Bilinen sorunlar / TODO
- ✅ **Karşılaştır** (Faz 3 Adım 2 — çözüldü): TÜFE hedeflerden çıkarıldı (`birim !== "endeks"`); yıl seçiciler iki yatay-kaydırmalı satıra alındı (tüm yıllar, taşma yok); akıllı varsayılan (verisi olan hedef + örtüşen yıllar → açılışta gerçek sonuç). `YearPicker` yerel bileşeni eklendi.
  - Birim etiketi düzeltildi (Adım 5): sonuç "adet" yerine hedefin gerçek birimini gösterir (ekmek→kg, benzin→litre).
  - ✅ Renk semantiği (Adım 6 — çözüldü): Karşılaştır'da satın alma gücü artışı artık teal ("+%X daha fazla"), düşüş coral. TrendPill yerine olumlu/olumsuz-renkli inline pill (TrendPill fiyat-artışı semantiğine sahip, satın alma gücü için ters). Home listesinde fiyat değişimi coral-yukarı kalır (fiyat artışı = doğru semantik).
- ✅ **Hesapla** (Faz 3 Adım 3 — çözüldü): yön toggle eklendi — "O gün → bugün" ve "Bugün → o gün". `enflasyonaGore` yön parametreleriyle çağrılıyor; etiket/eyebrow/caption yöne göre değişiyor.
- ✅ **Profil** (Faz 3 Adım 4 — çözüldü): `/profil` (`ProfileScreen`) — Hakkında + Tema (`ThemeSetting`: Sistem/Açık/Koyu) + Cüzdan&gelir-gider "Yakında" kartı + `SourcesScreen` bölümü. Nav "Profil" (user ikonu). Eski `/kaynaklar` → `/profil` redirect. Icon map'e `user`/`wallet` eklendi.
- **ShareSheet** ekranlara bağlı değil; dinamik OG yok.
- Veri olmayan kalemler "veri yok" gösteriyor (ekmek vb.).

## Komutlar
`npm run dev -w web` · `npm run build -w web` · `npm run test -w web`
