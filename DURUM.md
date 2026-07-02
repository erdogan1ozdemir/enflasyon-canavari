# Enflasyon Canavarı — DURUM (ana izleyici)

> Bu dosya projenin **tek bakışta durumu**dur. Her anlamlı işten sonra güncellenir.
> Detaylar ilgili klasör/`docs` dosyalarındadır; buradan onlara bağlanılır.
> Kural: yeni bir yapı/yenilik → ilgili klasörün `STATUS.md`/`README.md`'sini güncelle, sonra burayı güncelle.

**Son güncelleme:** 2026-07-03 — **Faz 4 tamamlandı** (temizlik + Karşılaştır v2 + Profil alt-ekranları; main yeşil)

---

## Tek cümle
Türkiye'de enflasyon/fiyat değişimini kaynaklı metriklerle anlatan, paylaşılabilir web (sonra mobil) uygulaması. Next.js + Capacitor, TR, marka "B".

## Şu anki durum (özet)
- **Canlı:** Vercel production (`main`). Tasarım sistemi uygulandı (5 ekran, light/dark, mobil-önce, maskot).
- **Veri:** 12 kalem, 208 fiyat noktası — hepsi `dogrulanmis`. (Detay: [data/STATUS.md](data/STATUS.md))
- **Hesap motoru:** `@ec/data/calc.ts` (TDD; toplam 42 test). [docs/08-hesap-motoru.md](docs/08-hesap-motoru.md)
- **Frontend:** [web/STATUS.md](web/STATUS.md)

## Faz 4 — ✅ TAMAMLANDI (2026-07-03)
Spec: [docs/superpowers/specs/2026-07-03-faz4-design.md](docs/superpowers/specs/2026-07-03-faz4-design.md) · Plan: [docs/superpowers/plans/2026-07-03-faz4.md](docs/superpowers/plans/2026-07-03-faz4.md)
1. ✅ **4C Temizlik:** kopya " 2/3.tsx" dosyalar silindi; Home `TrendPill` yön hatası düzeltildi (işaretten türetir); `LineChart` 0'a-bölme guard'ı; kök `npm test` artık web testlerini de koşuyor (30+12); `.playwright-mcp/` gitignore'landı.
2. ✅ **4A Karşılaştır v2:** mod toggle "Param ne alır?"/"Ürün kaç para?"; serbest tutar + TL/Dolar/Gram altın; "O yılın asgari ücreti" + "Maaşım" (profil maaşından) çipleri; ürün→para TL+≈USD; `paraToUrun`/`urunToPara` (TDD, 6 yeni test); **Paylaş** butonu → ShareSheet bağlandı.
3. ✅ **4B Profil alt-ekranları:** `/profil` hub (menü satırları) → `/profil/{tema,hakkinda,kaynaklar,ayarlar,bilgilerim}`; `SubPageShell` (← geri; swipe-back history ile bedava); `isApp()` platform bayrağı (`web/lib/platform.ts`); **Bilgilerim** app-only (web'de redirect; ad-soyad + maaş, `ec_profil` localStorage, gizlilik notu); **Ayarlar** (Dil "yakında", Bildirimler app-only stub, Reklamları kaldır "yakında", iki-adımlı Verilerimi sıfırla). Eski `/kaynaklar` → `/profil/kaynaklar`.
4. 🔶 **Veri turu:** gram altın 2026 / benzin 2005-20 / ürünlerin 2022-26'sı için doğrulanabilir kaynak yine çıkmadı (TÜİK madde fiyatı yayını ~2022'de durdu; altin.in yalnız günlük değer veriyor) → eklenmedi, [data/STATUS.md](data/STATUS.md)'de kayıtlı.

## Faz 3: İyileştirmeler — ✅ TAMAMLANDI (6/6)
Sıra (onaylı):
1. ✅ MD takip sistemi (bu dosya + per-folder STATUS)
2. ✅ Karşılaştır ekranı düzeltmeleri (TÜFE hedefi çıktı, yıl-seçici taşması giderildi, akıllı varsayılan)
3. ✅ Hesapla çift yön ("o gün→bugün" + "bugün→o gün")
4. ✅ Kaynaklar → Profil (`/profil`, nav "Profil"; Hakkında + Tema + Cüzdan "yakında" + Kaynaklar bölümü; eski `/kaynaklar` → `/profil` yönlendirme)
5. ✅ Eksik veri — **7 ürün eklendi** (TÜİK, verikaynagi'den Playwright/XHR): ekmek, tavuk, yumurta, patates, soğan, pirinç (gıda); sinema bileti (yeni **hizmet** kategorisi, 2005-2024). **12 kalem, 208 nokta.** Karşılaştır birim etiketi düzeltildi. Sigara deep research'le incelendi → marka geçmişi doğrulanamadı, atlandı. Pending (kaynak yok): döner/çay, gıda ürünlerinin 2022-26'sı, benzin 2005-20.
6. ✅ Tasarım cila — Karşılaştır satın alma gücü renk semantiği düzeltildi (artış=teal/olumlu, düşüş=coral). Geri kalan tasarım zaten sadık Claude Design uygulaması; keyfi restyle yapılmadı (karpathy). Daha geniş redesign = yeni Claude Design export gerektirir.

## Bilinen sorunlar / TODO (backlog)
- Dinamik OG image üretimi (@vercel/og) + ShareSheet'te gerçek görsel indirme (şu an "yakında" stub).
- Kaynak geçmişi timeline'ı (yıl × kaynak rozeti, ItemDetail'e).
- Çoklu-kalem karşılaştırma grafiği (LineChart 3 seri desteği hazır, kullanılmıyor).
- ItemDetail'de veri boşluğu (gap) rozetleri.
- Sepet bazlı "bugünkü paranla o yıla gitsen" hesabı.
- Veri: gram altın 2026, benzin 2005-20, ürünlerin 2022-26'sı (doğrulanmış kaynak bulunursa), döner/çay (resmi seri yok).
- `/profil/kaynaklar`'da çifte başlık/padding (SubPageShell + SourcesScreen kendi başlığı) — küçük cila.
- Capacitor kurulumu (Faz 5 adayı) — profil/app-only altyapı hazır.

## Tamamlanan fazlar (kısa geçmiş)
- **Faz 0 — İskelet:** monorepo (npm workspaces), Zod şema + doğrulama (TDD), Next.js kabuğu, feature-flag AdSlot.
- **Faz 1 — Hesap motoru:** fiyatBul/değişim/satınAlmaGücü/kaçXEder/enflasyonaGöre + format (TDD).
- **Faz 1 — Tasarım:** Claude Design sistemi (tokenlar, tema, maskot, bileşenler, 5 ekran) gerçek veriye bağlı.
- **Faz 2 — Veri:** asgari ücret, USD, TÜFE, gram altın, benzin serileri (kaynaklı).

## İndeks (tüm dokümanlar)
- Vizyon/karar: [docs/00-vizyon.md](docs/00-vizyon.md) · [docs/01-mimari.md](docs/01-mimari.md) · [docs/02-veri-modeli.md](docs/02-veri-modeli.md) · [docs/03-veri-kaynaklari.md](docs/03-veri-kaynaklari.md) · [docs/04-ozellikler.md](docs/04-ozellikler.md) · [docs/05-marka-tasarim.md](docs/05-marka-tasarim.md) · [docs/06-gelir-flagler.md](docs/06-gelir-flagler.md) · [docs/07-yol-haritasi.md](docs/07-yol-haritasi.md) · [docs/08-hesap-motoru.md](docs/08-hesap-motoru.md)
- Kararlar: [docs/kararlar/](docs/kararlar/)
- Spec/plan: [docs/superpowers/specs/](docs/superpowers/specs/) · [docs/superpowers/plans/](docs/superpowers/plans/)
- Klasör durumları: [web/STATUS.md](web/STATUS.md) · [data/STATUS.md](data/STATUS.md) · [web/README.md](web/README.md) · [data/README.md](data/README.md) · [scripts/README.md](scripts/README.md)

## Komutlar
`npm run dev` · `npm test` · `npm run validate:data` · `npm run test -w web` · `npm run build -w web`

## Deploy
GitHub: erdogan1ozdemir/enflasyon-canavari · Vercel: Root Directory=`web`, framework `web/vercel.json` (nextjs), production=`main`.
