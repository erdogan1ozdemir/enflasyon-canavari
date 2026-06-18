# Hesap Motoru — Tasarım Dokümanı (Spec)

**Tarih:** 2026-06-18
**Durum:** Onaylandı (brainstorming) → plan aşamasına hazır
**Bağlam:** Faz 1'in tasarımdan bağımsız bel kemiği. Görsel tasarım paralelde (Claude design) üretilirken bu saf mantık katmanı geliştirilir.

---

## 1. Amaç

Enflasyon / satın alma gücü / "kaç X eder" hesaplamalarını yapan **saf, çerçeveden bağımsız** bir fonksiyon kütüphanesi. 4 MVP özelliğinin (yıl-yıl tablo, kalem-kalem karşılaştırma, kişisel hesap, paylaşım kartı) hepsi bu motoru kullanır. Tasarım geldiğinde UI bileşenleri bu fonksiyonlara bağlanır.

## 2. Konum

`data/src/calc.ts` (paket: `@ec/data`). Motor saf TS; `web` + `scripts` + ileride mobil tarafından kullanılabilir. Kanıtlanmış node Vitest kurulumuyla test edilir. (Spec ana dokümanında "web/lib" denmişti; saflık ve yeniden kullanılabilirlik için `@ec/data`'ya alındı — gerekçeli sapma.)

## 3. Fonksiyonlar

Tümü `PricePoint[]` üzerinde çalışır (`@ec/data` tipleri). Eksik veri → `null`.

| Fonksiyon | Döner | Açıklama |
|---|---|---|
| `fiyatBul(prices, itemId, yil, opts?)` | `number \| null` | O yıldaki değer; kaynak/tip seçimiyle; yoksa null |
| `degisim(prices, itemId, yilA, yilB, opts?)` | `{ kat, yuzde } \| null` | Fiyat değişimi (×kat ve % artış) |
| `satinAlmaGucu(prices, kaynakId, hedefId, yil, opts?)` | `number \| null` | 1 kaynak kaç hedef alır (ör. 1 maaş kaç ekmek) |
| `satinAlmaGucuKarsilastir(prices, kaynakId, hedefId, yilA, yilB, opts?)` | `{ a, b, yuzdeDegisim } \| null` | İki yıl arası satın alma gücü değişimi |
| `kacXEder(prices, tutarTL, itemId, yil, opts?)` | `number \| null` | Verilen TL kaç adet X alır |
| `enflasyonaGore(prices, endeksItemId, tutar, yilA, yilB, opts?)` | `number \| null` | Bir endeks serisine (TÜİK TÜFE, "endeks" birimli kalem) göre tutarın güncel karşılığı |
| `formatTL(n)` | `string` | tr-TR para biçimi (₺) |
| `formatSayi(n, ondalik?)` | `string` | tr-TR sayı biçimi |

`opts: { tip?: "net" | "ortalama"; kaynakAdi?: string }`.

## 4. Kararlar

- **Eksik veri:** İlgili (kalem, yıl) için fiyat yoksa `null`. **İnterpolasyon/tahmin yok** (güven ilkesi). Gerçek eksik veri sonradan research ile doldurulacak (Faz 2).
- **Kaynak/tip seçimi:** `opts` ile filtre. Belirtilmezse eşleşenler arasından önce `dogrulama: "dogrulanmis"`, o da yoksa deterministik ilk kayıt. Çok-kaynaklılık (TÜİK + ENAG) bu sayede desteklenir.
- **Sıfıra bölme:** Payda 0 veya baz değer 0 ise `null`.
- **Hassasiyet:** Motor ham `number` döndürür (tam hassasiyet); yuvarlama/biçim UI'da. `formatTL`/`formatSayi` kolaylık için.
- **Endeks:** Endeks, `birim: "endeks"` olan sıradan bir kalem olarak modellenir; `enflasyonaGore` onun `deger`'ini kullanır. Gerçek TÜFE serisi geldiğinde beslenir; testlerde stub endeks kalemiyle doğrulanır.

## 5. Test (TDD)

Her fonksiyon için hem mutlu yol hem kenar durumlar (eksik veri → null, sıfıra bölme → null, tip/kaynak filtresi, `dogrulanmis` tercihi). Biçim yardımcıları tr-TR çıktısı için. Yanlış sayı güveni yıkar → motor TDD ile yazılır.

## 6. Kapsam dışı

UI bağlama, grafik, gerçek veri toplama (Faz 2), interpolasyon. Bunlar ayrı işler.
