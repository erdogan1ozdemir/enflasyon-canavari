# Tasarım Sistemi Implementasyonu — Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).

**Goal:** Claude Design System export'unu (`/tmp/ec-design`) Next.js uygulamasına (`web/`) implemente et: tokenlar, fontlar, tema, maskot, ikonlar, çekirdek + veri bileşenleri ve 5 ekran (Home, Kalem Detay, Karşılaştır, Hesapla, Kaynaklar) — hepsi gerçek `@ec/data` verisine ve hesap motoruna bağlı, light/dark, mobil-önce. Statik paylaşım kartı bileşeni dahil; dinamik OG sonraya.

**Architecture:** Bileşenler tasarımdaki gibi **inline-style + CSS değişkeni** yaklaşımıyla kalır; token CSS `globals.css`'e import edilir. Fontlar `next/font` (Geist + Geist Mono) ile; tokenlar bu değişkenlere köprülenir. Tema `next-themes` (`data-theme`). İkonlar `lucide-react` + tipli `Icon` sarmalayıcı. Rotalar dosya-tabanlı; her sayfa **server component** veriyi `@ec/data`'dan yükler ve etkileşimli **client** bileşene view-model geçer. Mock `kitData` yerine gerçek veri + `calc.ts`.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, next-themes, lucide-react, Vitest.

**Kaynak design dosyaları:** `/tmp/ec-design/` (tokens, components, ui_kits/web, assets, share_cards). Bu kalıcı değil; Faz-0'da repoya kopyalanacak referanslar dışındakiler oradan port edilir. **Önce `/tmp/ec-design`'in `web/`'e gerekli parçalarını kopyalıyoruz; zip yeniden gerekirse `~/Downloads/Enflasyon Canavarı Design System.zip`.**

---

## Genel ilkeler (tüm görevler)
- Bileşen portu = kaynaktaki `.jsx`'i `web/`'de `.tsx`'e çevir: TS prop tipleri (`.d.ts` referans), inline-style + `var(--token)` aynen korunur. Hook/handler kullanan bileşenlere `'use client'` ekle.
- Çift font yükleme yok: kopyalanan `fonts.css`'ten Google Fonts `@import`'unu çıkar; `--font-sans`→`var(--font-geist-sans)`, `--font-data`→`var(--font-geist-mono)`.
- Türkçe kopya; sayı biçimleri `formatTL`/`formatSayi`. Emoji yok. Her sayının yanında `SourceBadge`.
- Veri yoksa zarif "şimdilik veri yok" durumu (calc `null` → boş durum bileşeni).
- Her görev sonunda `npm run build -w web` geçmeli; görsel doğrulama preview screenshot ile.

---

## Task 1: Temeller — tokenlar, fontlar, asset'ler, bağımlılıklar

**Files:**
- Create: `web/app/tokens/colors.css`, `web/app/tokens/typography.css`, `web/app/tokens/spacing.css`, `web/app/tokens/fonts.css` (kaynaktan kopya, fonts.css uyarlanmış)
- Modify: `web/app/globals.css`, `web/app/layout.tsx`
- Create: `web/public/monster-mark.svg`, `web/public/expressions/*.svg` (kopya)
- Modify: `web/package.json` (deps)

- [ ] **Step 1: Bağımlılıkları kur**
Run: `npm install -w web lucide-react next-themes`
Expected: ikisi web/package.json dependencies'e eklenir.

- [ ] **Step 2: Token CSS'lerini kopyala**
`/tmp/ec-design/tokens/{colors,typography,spacing}.css` → `web/app/tokens/` (aynen). `fonts.css`'i kopyala ama Google Fonts `@import url(...)` satırını SİL ve `--font-sans`/`--font-data` tanımlarını şu hale getir:
```css
:root {
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-data: var(--font-geist-mono), ui-monospace, "SFMono-Regular", Menlo, monospace;
  /* (typography.css'in beklediği diğer font değişkenleri korunur) */
}
```
(Diğer fonts.css içeriği — varsa font-weight değişkenleri — korunur.)

- [ ] **Step 3: globals.css'i token'ları import edecek ve temel stilleri kuracak şekilde güncelle**
`web/app/globals.css` (tam içerik):
```css
@import "tailwindcss";
@import "./tokens/fonts.css";
@import "./tokens/colors.css";
@import "./tokens/typography.css";
@import "./tokens/spacing.css";

html, body { height: 100%; }
body {
  margin: 0;
  background: var(--bg-app);
  color: var(--text-body);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
* { box-sizing: border-box; }
```
(Eski `@theme inline` / Arial body kaldırılır; renkler artık tasarım tokenlarından gelir.)

- [ ] **Step 4: layout.tsx — Geist değişkenleri html'e, lang tr, tema sınıfı**
`web/app/layout.tsx`'te mevcut `next/font` Geist + Geist_Mono değişkenlerinin (`--font-geist-sans`, `--font-geist-mono`) `<html>` veya `<body>` className'inde uygulandığından emin ol. `<html lang="tr">` korunur. (Tema provider Task 2'de eklenecek; burada sadece font değişkenleri + body'nin token'lı render olduğunu doğrula.)

- [ ] **Step 5: Maskot ve ifadeleri kopyala**
`/tmp/ec-design/assets/monster-mark.svg` → `web/public/monster-mark.svg`. `/tmp/ec-design/assets/expressions/*.svg` → `web/public/expressions/`.

- [ ] **Step 6: Build doğrula**
Run: `npm run build -w web`
Expected: derleme başarılı; mevcut sayfalar (henüz eski) token'lı zeminle render olur.

- [ ] **Step 7: Commit**
```bash
git add web/app/tokens web/app/globals.css web/app/layout.tsx web/public/monster-mark.svg web/public/expressions web/package.json package-lock.json
git commit -m "feat(web): tasarım tokenları, fontlar, maskot asset'leri ve bağımlılıklar"
```

---

## Task 2: Tema sağlayıcı + İkon sarmalayıcı + AppShell (responsive)

**Files:**
- Create: `web/components/ThemeProvider.tsx`, `web/components/ThemeToggle.tsx`
- Create: `web/components/Icon.tsx`
- Create: `web/components/AppShell.tsx`, `web/components/BottomNav.tsx`
- Modify: `web/app/layout.tsx`

- [ ] **Step 1: ThemeProvider (next-themes)**
`web/components/ThemeProvider.tsx` ('use client'): `next-themes` `ThemeProvider`'ı `attribute="data-theme"`, `defaultTheme="system"`, `enableSystem` ile sarmalar.

- [ ] **Step 2: layout.tsx'e provider + AppShell**
`web/app/layout.tsx`: `<body>` içeriğini `<ThemeProvider><AppShell>{children}</AppShell></ThemeProvider>` ile sar. `<html suppressHydrationWarning>` ekle (next-themes gereği).

- [ ] **Step 3: Icon sarmalayıcı (lucide-react)**
`web/components/Icon.tsx`: tasarımdaki isim setini (`search, share, download, arrowRight, arrowLeft, chevronRight, chevronDown, x, check, info, home, chart, scale, calculator, file, sun, moon, wheat, food, dollar, gem, fuel, banknote, drumstick`) lucide-react bileşenlerine eşleyen tipli `Icon({ name, size=20, strokeWidth=2, ... })`. Lucide karşılıkları: chart→`LineChart`/`ChartLine`, scale→`Scale`, food→`Utensils`, gem→`Gem`, fuel→`Fuel`, banknote→`Banknote`, drumstick→`Drumstick`, wheat→`Wheat`, dollar→`DollarSign`, file→`FileText` vb. Bilinmeyen isim → `Info`.

- [ ] **Step 4: ThemeToggle**
`web/components/ThemeToggle.tsx` ('use client'): `useTheme` ile light/dark arası geçiş; `Icon name="sun"|"moon"`. Hidrasyon güvenli (mounted guard).

- [ ] **Step 5: AppShell + BottomNav (responsive, mobil-önce)**
`/tmp/ec-design/ui_kits/web/AppShell.jsx`'i referans alarak `web/components/AppShell.tsx` oluştur ama **sabit 402×858 yerine responsive**: ortalanmış `max-width: var(--container-sm)` kolon, sticky üst header (sol: maskot logosu + "Enflasyon Canavarı", sağ: `ThemeToggle`), altta sabit `BottomNav`. `BottomNav.tsx` ('use client'): `next/link` + `usePathname` ile aktif sekme (coral). Sekmeler: Home `/` (home), Karşılaştır `/karsilastir` (scale), Hesapla `/hesapla` (calculator), Kaynaklar `/kaynaklar` (file). İçerik alanı altında nav yüksekliği kadar padding.

- [ ] **Step 6: Build + preview doğrula**
Run: `npm run build -w web`. Sonra `/run` veya preview ile header + bottom nav + tema toggle görünür ve çalışır olmalı (mevcut sayfalar shell içinde).

- [ ] **Step 7: Commit**
```bash
git add web/components/ThemeProvider.tsx web/components/ThemeToggle.tsx web/components/Icon.tsx web/components/AppShell.tsx web/components/BottomNav.tsx web/app/layout.tsx
git commit -m "feat(web): tema sağlayıcı, ikon sarmalayıcı ve responsive AppShell"
```

---

## Task 3: Çekirdek bileşenler (Button, Card, Badge, Input, SegmentedControl)

**Files:**
- Create: `web/components/ui/{Button,Card,Badge,Input,SegmentedControl}.tsx`

- [ ] **Step 1: Portla**
`/tmp/ec-design/components/core/*.jsx` → `web/components/ui/*.tsx`. Her biri: `.d.ts`'teki prop tiplerini TS olarak ekle, inline-style + `var(--token)` aynen koru. `Input` ve `SegmentedControl` (state/handler) → `'use client'`. `Button`, `Card` (onMouse press/hover handler'ları var) → `'use client'`. `Badge` (saf) → 'use client' gerekmez.

- [ ] **Step 2: Tip kontrolü + build**
Run: `npm run build -w web` (kullanılmıyorlarsa ağaç sarsılır; en azından tip hatası olmamalı). Geçici bir test sayfası gerekмez.

- [ ] **Step 3: Commit**
```bash
git add web/components/ui
git commit -m "feat(web): çekirdek UI bileşenleri (Button, Card, Badge, Input, SegmentedControl)"
```

---

## Task 4: Veri bileşenleri (SourceBadge, BigStat, TrendPill, ItemRow, LineChart)

**Files:**
- Create: `web/components/data/{SourceBadge,BigStat,TrendPill,ItemRow,LineChart}.tsx`

- [ ] **Step 1: Portla**
`/tmp/ec-design/components/data/*.jsx` + `/tmp/ec-design/ui_kits/web/Chart.jsx` (LineChart) → `web/components/data/*.tsx`. TS tipleri ekle (`.d.ts` referans). `SourceBadge`, `BigStat`, `TrendPill` saf → server uyumlu. `ItemRow` (onClick/hover) → `'use client'`. `LineChart` SVG, prop `series: {points:[number,number][]}[]` → 'use client' gerekmez ama client ağacında kullanılacak; saf bırak.
- `SourceBadge` props: `source`, `label: "ortalama"|"net"|null`, `status: "verified"|"pending"`. `dogrulama:"beklemede"` → `status="pending"` (amber) eşlemesi UI tarafında yapılacak.

- [ ] **Step 2: Build**
Run: `npm run build -w web`. Tip hatası olmamalı.

- [ ] **Step 3: Commit**
```bash
git add web/components/data
git commit -m "feat(web): veri bileşenleri (SourceBadge, BigStat, TrendPill, ItemRow, LineChart)"
```

---

## Task 5: View-model adaptörü (TDD) + Home ekranı

**Files:**
- Create: `web/lib/viewmodel.ts`, `web/lib/icon-map.ts`
- Test: `web/test/viewmodel.test.tsx`
- Create: `web/components/screens/HomeScreen.tsx`
- Modify: `web/app/page.tsx`

- [ ] **Step 1: Adaptör testini yaz (TDD)** `web/test/viewmodel.test.tsx`:
`itemViewModel(items, prices, id)` → `{ item, seri: [yil,deger][] (tip'e göre, artan yıl), guncelYil, guncelDeger, ilkYil, ilkDeger, degisim: {kat,yuzde}|null }`. Test: asgari-ucret için seri dolu, kat/yuzde `degisim` ile uyumlu; verisi olmayan item → seri boş, degisim null. (Gerçek `loadItems`/`loadPrices` veya kurulu fixture kullan.)

- [ ] **Step 2: Test FAIL** → `npx vitest run web/test/viewmodel.test.tsx` (web vitest config `.test.tsx` zaten kapsıyor; gerekirse node env). FAIL beklenir.

- [ ] **Step 3: Adaptörü yaz** `web/lib/viewmodel.ts`: `@ec/data`'dan `fiyatBul, degisim, Item, PricePoint` kullanarak yukarıdaki view-model'i üretir. `listViewModel(items, prices)` → her item için `{ item, guncelDeger, trend }` (Home listesi). Yıl aralığını veriden türet (min/max yıl). `web/lib/icon-map.ts`: `Item.ikon`/`kategori` → `Icon name` eşlemesi (gida→wheat/food, doviz→dollar, altin→gem, akaryakit→fuel, capa→banknote vb.).

- [ ] **Step 4: Test PASS** → `npx vitest run` (regresyon dahil).

- [ ] **Step 5: HomeScreen (client) + page (server)**
`/tmp/ec-design/ui_kits/web/Home.jsx`'i referans alarak `web/components/screens/HomeScreen.tsx` ('use client'): props olarak `items` view-model listesi + featured view-model alır; arama (`Input`), featured kart (`BigStat` + `SourceBadge` + `degisim`), `ItemRow` listesi. `web/app/page.tsx` (server): `loadItems()`+`loadPrices()` → `listViewModel` + featured (verisi olan ilk item, örn. asgari-ucret) → `HomeScreen`'e geçer. `AdSlot` korunur (flag kapalı). Tıklayınca `/kalem/[id]`.

- [ ] **Step 6: Build + preview screenshot doğrula** (Home tasarıma uygun, asgari ücret featured, liste render).

- [ ] **Step 7: Commit**
```bash
git add web/lib web/test/viewmodel.test.tsx web/components/screens/HomeScreen.tsx web/app/page.tsx
git commit -m "feat(web): view-model adaptörü (TDD) ve yeni Home ekranı"
```

---

## Task 6: Kalem Detay — `/kalem/[id]`

**Files:**
- Create: `web/app/kalem/[id]/page.tsx`, `web/components/screens/ItemDetailScreen.tsx`

- [ ] **Step 1: page (server)** `web/app/kalem/[id]/page.tsx`: `params.id` ile item'ı bul; `loadPrices()`; hem `net` hem `ortalama` serilerini + `degisim`'i hesapla; `notFound()` yoksa. View-model'i `ItemDetailScreen`'e geçir. `generateStaticParams` ile `loadItems()` id'leri.
- [ ] **Step 2: ItemDetailScreen (client)** `/tmp/ec-design/ui_kits/web/ItemDetail.jsx` referans: geri butonu, başlık (ikon+isim+kategori), hero kart (`BigStat` ×kat / %yüzde + `SourceBadge`), `SegmentedControl` net/ortalama, `LineChart` seri, yıl-yıl tablo (yıl, `formatTL`, tip `Badge`, `SourceBadge`). Seçili tip'te veri yoksa zarif boş durum.
- [ ] **Step 3: Build + preview** (asgari-ucret detay: net seri grafiği + tablo + ×80 hero).
- [ ] **Step 4: Commit** `git commit -m "feat(web): kalem detay ekranı (/kalem/[id])"`

---

## Task 7: Karşılaştır — `/karsilastir`

**Files:**
- Create: `web/app/karsilastir/page.tsx`, `web/components/screens/CompareScreen.tsx`

- [ ] **Step 1: page (server)** veriyi yükle, `items`+`prices` ve mevcut yıl aralığını `CompareScreen`'e geçir.
- [ ] **Step 2: CompareScreen (client)** `/tmp/ec-design/ui_kits/web/Compare.jsx` referans: kaynak (asgari-ucret/gram-altin/usd) + hedef seçimi, iki yıl `SegmentedControl`/select; `satinAlmaGucuKarsilastir` ile koyu kartta iki `BigStat` + ok + `yuzdeDegisim`. Veri eksikse "seçili yıllarda veri yok" durumu. (Şu an çoğu hedefte veri yok → boş durum normal.)
- [ ] **Step 3: Build + preview.**
- [ ] **Step 4: Commit** `git commit -m "feat(web): karşılaştırma ekranı (/karsilastir)"`

---

## Task 8: Hesapla — `/hesapla`

**Files:**
- Create: `web/app/hesapla/page.tsx`, `web/components/screens/CalcScreen.tsx`

- [ ] **Step 1: page (server)** veriyi yükle; endeks (TÜFE) henüz yoksa, fallback olarak mevcut çapa kalem (asgari-ucret) ile `enflasyonaGore`/`kacXEder` demosu — ya da endeks yoksa "endeks verisi yakında" durumu. Endeks item id'sini config'le (`tufe`), veri gelince çalışır.
- [ ] **Step 2: CalcScreen (client)** `/tmp/ec-design/ui_kits/web/Calc.jsx` referans: tutar `Input` + yıl seçimi; `enflasyonaGore` (bugünkü karşılık) + `kacXEder` (o gün vs bugün kaç X) → `BigStat`'lar; gizlilik notu "Girdiğin tutar yalnızca tarayıcında kalır; hesap gerektirmez." Endeks/veri yoksa zarif boş durum.
- [ ] **Step 3: Build + preview.**
- [ ] **Step 4: Commit** `git commit -m "feat(web): kişisel hesap ekranı (/hesapla)"`

---

## Task 9: Kaynaklar (restyle) + statik ShareCard + share sheet

**Files:**
- Modify: `web/app/kaynaklar/page.tsx`
- Create: `web/components/screens/SourcesScreen.tsx`
- Create: `web/components/share/ShareCard.tsx`, `web/components/share/ShareSheet.tsx`

- [ ] **Step 1: Kaynaklar** `/tmp/ec-design/ui_kits/web/Sources.jsx` referans: 2005 redenominasyon info kutusu, net vs ortalama açıklama kartları, `loadSources()` listesi (tip `Badge`, metodoloji, URL). page (server) `loadSources()` → `SourcesScreen`.
- [ ] **Step 2: ShareCard (statik)** `/tmp/ec-design/share_cards/share-link-preview.html` + `share-story.html` referans: `ShareCard.tsx` props (eyebrow, soru, a/b değer, kaynak, format) ile koyu radyal zeminli, köşede maskot kart (yatay + dikey varyant). Saf görsel bileşen.
- [ ] **Step 3: ShareSheet (client)** karşılaştırma/detay sonucunu `ShareCard` ile önizleyen, "Görseli indir / Kopyala / Paylaş" butonlu alt sayfa (slide-up). İndirme şimdilik client-side (html→canvas opsiyonel) veya yalnız önizleme + "yakında". Dinamik OG sonraki iş.
- [ ] **Step 4: Build + preview.**
- [ ] **Step 5: Commit** `git commit -m "feat(web): kaynaklar restyle, statik paylaşım kartı ve share sheet"`

---

## Task 10: Cila + doğrulama

- [ ] **Step 1: Favicon/app icon** maskotu favicon olarak ayarla (`web/app/icon.svg` veya metadata).
- [ ] **Step 2: Erişilebilirlik/responsive geçiş** — masaüstünde ortalanmış kolon, mobilde tam genişlik; tap hedefleri 44px; focus ring.
- [ ] **Step 3: Tam doğrulama**
Run: `npm test && npm run test -w web && npm run build -w web`
Expected: tüm testler geçer, build başarılı, rotalar (`/`, `/kalem/[id]`, `/karsilastir`, `/hesapla`, `/kaynaklar`) üretilir.
- [ ] **Step 4: Preview screenshot'larıyla 5 ekranı + light/dark doğrula.**
- [ ] **Step 5: Commit** `git commit -m "polish(web): favicon, responsive ve erişilebilirlik cilası"`

---

## Tamamlanma Kriterleri
- [ ] Tokenlar + Geist/Geist Mono + light/dark (`data-theme`) çalışıyor.
- [ ] 9 bileşen + LineChart + Icon + AppShell portlanmış, tip-güvenli.
- [ ] 5 ekran gerçek `@ec/data` + `calc.ts`'e bağlı; veri yokken zarif boş durum.
- [ ] `npm run build -w web` ve tüm testler geçiyor; preview'da tasarıma uygun görünüyor.
- [ ] Maskot logo/favicon; statik paylaşım kartı mevcut.

## Kapsam dışı (sonraki işler)
- Dinamik OG image üretimi (`@vercel/og`) — gerçek paylaşılabilir kartlar.
- Kalan metriklerin gerçek verisi (USD, gram altın, TÜFE, benzin) — ayrı deep-research turu.
- Reklam entegrasyonu (flag açılınca).
