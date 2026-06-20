# data/ — DURUM

> `@ec/data` — veri katmanı + şema + hesap motoru. Yaşayan durum/TODO. Ana izleyici: [../DURUM.md](../DURUM.md).

**Son güncelleme:** 2026-06-19

## Mevcut veri (12 kalem, 208 fiyat noktası, hepsi `dogrulanmis`)
| Kalem (id) | Yıllar | Nokta | Kaynak | tip / birim |
|---|---|---|---|---|
| asgari-ucret | 2005–2026 | 22 | Aile Bak. + ÇSGB (resmi) | net / TL |
| usd | 2005–2026 | 22 | doviz724 (TCMB ort.) | ortalama / USD |
| tufe | 2005–2026 | 22 | TÜİK (hakedis) | ortalama / endeks |
| gram-altin | 2005–2025 | 21 | fiyonk (USD×ons çapraz) | ortalama / gram |
| benzin | 2021–2026 | 6 | EPDK (hakedis) | ortalama / litre |
| ekmek | 2005–2021 | 17 | TÜİK (verikaynagi, Playwright/XHR) | ortalama / kg |
| tavuk | 2005–2021 | 17 | TÜİK (verikaynagi, Playwright/XHR) | ortalama / kg |
| yumurta | 2005–2021 | 17 | TÜİK (verikaynagi, Playwright/XHR) | ortalama / adet |
| patates | 2005–2021 | 17 | TÜİK (verikaynagi, Playwright/XHR) | ortalama / kg |
| sogan | 2005–2021 | 17 | TÜİK (verikaynagi, Playwright/XHR) | ortalama / kg |
| sinema | 2005–2024 | 20 | TÜİK (verikaynagi, Playwright/XHR) | ortalama / adet — kategori **hizmet** |
| pirinc | 2010–2019 | 10 | TÜİK (verikaynagi, Playwright/XHR) | ortalama / kg (dar aralık) |

> Yeni kategori: **hizmet** (schema KATEGORILER + labels + icon-map `ticket` + Icon `Ticket`). Sinema "1 maaşla kaç bilet" karşılaştırmasını açar (2005-2024 tam aralık).
> **Sigara markaları (Winston/Marlboro/Parliament):** marka-bazlı yıl-yıl geçmiş güvenilir kaynakta YOK — sadece güncel (2024-2026) snapshot fiyatlar var. TÜİK yalnızca genel "sigara" ortalaması tutar (2013-2024, extract edildi). Karar bekliyor.

> **Playwright yöntemi (TÜİK ürünleri):** verikaynagi grafik verisi `/api/graph/.../*.json` XHR'larında (Plotly `{data:[{x,y}]}` VEYA Highcharts `{options:{series:[{data:[["2005 Ocak",v],…]}]}}` formatında). Tarayıcıda fetch → aylıktan yıllık ortalama. Sayfa URL'i aramayla bulunur (kategori sayfası bot-engelli). Çoğu seri ~2021/2022'de bitiyor. Bu yöntemle su/patates/süt vb. de eklenebilir.

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
