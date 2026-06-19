# data/ — DURUM

> `@ec/data` — veri katmanı + şema + hesap motoru. Yaşayan durum/TODO. Ana izleyici: [../DURUM.md](../DURUM.md).

**Son güncelleme:** 2026-06-19

## Mevcut veri (6 kalem, 110 fiyat noktası, hepsi `dogrulanmis`)
| Kalem (id) | Yıllar | Nokta | Kaynak | tip |
|---|---|---|---|---|
| asgari-ucret | 2005–2026 | 22 | Aile Bak. + ÇSGB (resmi) | net |
| usd | 2005–2026 | 22 | doviz724 (TCMB ort.) | ortalama |
| tufe | 2005–2026 | 22 | TÜİK (hakedis) | ortalama |
| gram-altin | 2005–2025 | 21 | fiyonk (USD×ons çapraz) | ortalama |
| benzin | 2021–2026 | 6 | EPDK (hakedis) | ortalama |
| ekmek | 2005–2021 | 17 | TÜİK (verikaynagi, **Playwright** ile XHR'dan) — birim **kg** | ortalama |

> Playwright yöntemi: verikaynagi grafiklerinin verisi `/api/graph/.../*.json` XHR'larında; tarayıcıda fetch edip aylıktan yıllık ortalama hesaplandı. Diğer TÜİK ürünleri (patates, su…) aynı yöntemle ~2022'ye kadar alınabilir.

Fiyat dosyaları: `prices/{gida(boş),capa,doviz,endeks,altin,akaryakit}.json` → `src/load.ts` `priceFiles`.

## Şema & motor
- `src/schema.ts` (Item/PricePoint/Source, KATEGORILER/BIRIMLER/KAYNAK_TIPLERI), `src/types.ts`.
- `src/load.ts` (statik JSON import), `src/validate.ts` (referans + çift kayıt).
- `src/calc.ts` — fiyatBul, degisim, satinAlmaGucu, satinAlmaGucuKarsilastir, kacXEder, enflasyonaGore, formatTL, formatSayi. (TDD)

## Eksik / TODO (Faz 3 Adım 5)
- **Ekmek 2022–2026:** verikaynagi serisi Ocak 2022'de bitiyor; yeni TÜİK verisi gerek.
- **Diğer ürünler:** döner, su, çay — döner/çay için resmi yıl-yıl seri yok (sokak fiyatı); su TÜİK madde olabilir → Playwright/verikaynagi ile denenebilir (~2022'ye kadar).
- **Benzin 2005–2020:** EPDK eski bültenleri sorgu-arkası; güvenilir kaynak aranacak.
- **Gram altın 2026:** kaynak 2025'te bitiyor; 2026 eklenecek.

## Yeni veri eklerken
1. İlgili `prices/<kategori>.json`'a nokta ekle (kaynak + tip zorunlu, doğru Türkçe diakritik).
2. Yeni kategori dosyası ise `src/load.ts`'e import + `priceFiles`'a ekle.
3. Yeni kalem ise `items/items.json`'a, yeni kaynak ise `sources/sources.json`'a ekle.
4. `npm run validate:data` → hata yoksa tamam. Mümkünse çapraz doğrula.
