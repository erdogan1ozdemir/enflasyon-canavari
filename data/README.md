# @ec/data — veri katmanı

Kalem (`items/`), kaynak (`sources/`) ve fiyat (`prices/`) JSON verileri + Zod şemaları (`src/schema.ts`) ve doğrulama (`src/validate.ts`).

## Yeni fiyat eklemek
1. İlgili `prices/<kategori>.json` dosyasına nokta ekle (kaynak ve tip zorunlu).
2. Yeni bir kategori dosyası açtıysan `src/load.ts` içine import edip `priceFiles`'a ekle.
3. `npm run validate:data` çalıştır — hata yoksa tamam.

## Not
Paket, `exports` ile TypeScript kaynağını (`./src/index.ts`) dışa verir; Next.js bunu `transpilePackages` ile derler (ayrı build adımı yok). TypeScript-farkında olmayan bir tüketici bu paketi doğrudan kullanamaz.
