# Enflasyon Canavarı — DURUM (ana izleyici)

> Bu dosya projenin **tek bakışta durumu**dur. Her anlamlı işten sonra güncellenir.
> Detaylar ilgili klasör/`docs` dosyalarındadır; buradan onlara bağlanılır.
> Kural: yeni bir yapı/yenilik → ilgili klasörün `STATUS.md`/`README.md`'sini güncelle, sonra burayı güncelle.

**Son güncelleme:** 2026-06-19

---

## Tek cümle
Türkiye'de enflasyon/fiyat değişimini kaynaklı metriklerle anlatan, paylaşılabilir web (sonra mobil) uygulaması. Next.js + Capacitor, TR, marka "B".

## Şu anki durum (özet)
- **Canlı:** Vercel production (`main`). Tasarım sistemi uygulandı (5 ekran, light/dark, mobil-önce, maskot).
- **Veri:** 6 kalem, 93 fiyat noktası — hepsi `dogrulanmis`. (Detay: [data/STATUS.md](data/STATUS.md))
- **Hesap motoru:** `@ec/data/calc.ts` (TDD, 30+ test). [docs/08-hesap-motoru.md](docs/08-hesap-motoru.md)
- **Frontend:** [web/STATUS.md](web/STATUS.md)

## Şu an üzerinde çalışılan faz — Faz 3: İyileştirmeler
Sıra (onaylı):
1. ✅ MD takip sistemi (bu dosya + per-folder STATUS)
2. ✅ Karşılaştır ekranı düzeltmeleri (TÜFE hedefi çıktı, yıl-seçici taşması giderildi, akıllı varsayılan)
3. ✅ Hesapla çift yön ("o gün→bugün" + "bugün→o gün")
4. ✅ Kaynaklar → Profil (`/profil`, nav "Profil"; Hakkında + Tema + Cüzdan "yakında" + Kaynaklar bölümü; eski `/kaynaklar` → `/profil` yönlendirme)
5. 🔶 Eksik veri — **ekmek + tavuk + yumurta + patates 2005-2021 eklendi** (TÜİK, verikaynagi'den Playwright/XHR; 9 kalem, 161 nokta). Karşılaştır birim etiketi düzeltildi. Hazır bekleyen: sinema bileti (2005-2024), sigara, soğan, pirinç. Pending: döner/çay (resmi seri yok), ürünlerin 2022-26'sı, benzin 2005-20.
6. ⏳ Tasarım cila (yeni design skill'leriyle)

## Bilinen sorunlar / TODO
- (Karşılaştır) satın alma gücü artışı coral-yukarı gösteriyor; renk semantiği cilada gözden geçirilecek. → Adım 6
- Veri eksikleri: ekmek (0 nokta), diğer ürünler yok; benzin yalnız 2021-2026. → Adım 5
- Dinamik OG paylaşım kartları henüz yok (statik ShareCard/ShareSheet var, ekranlara bağlı değil).

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
