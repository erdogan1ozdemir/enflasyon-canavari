import { describe, it, expect } from "vitest";
import { ItemSchema, PricePointSchema } from "../src/schema";

describe("ItemSchema", () => {
  it("geçerli bir kalemi kabul eder", () => {
    const ok = ItemSchema.safeParse({
      id: "ekmek",
      isim: "Ekmek",
      kategori: "gida",
      birim: "adet",
      ikon: "bread",
      aciklama: "300g somun ekmek",
    });
    expect(ok.success).toBe(true);
  });

  it("bilinmeyen kategoriyi reddeder", () => {
    const bad = ItemSchema.safeParse({
      id: "ekmek",
      isim: "Ekmek",
      kategori: "uzay",
      birim: "adet",
      ikon: "bread",
      aciklama: "x",
    });
    expect(bad.success).toBe(false);
  });
});

describe("PricePointSchema", () => {
  it("kaynaklı ve etiketli noktayı kabul eder", () => {
    const ok = PricePointSchema.safeParse({
      itemId: "ekmek",
      yil: 2005,
      deger: 0.4,
      tip: "ortalama",
      kaynakTipi: "elle",
      kaynakAdi: "TÜİK",
      kaynakURL: "https://www.tuik.gov.tr",
      dogrulama: "dogrulanmis",
    });
    expect(ok.success).toBe(true);
  });

  it("2005'ten önceki yılı reddeder", () => {
    const bad = PricePointSchema.safeParse({
      itemId: "ekmek",
      yil: 2004,
      deger: 0.4,
      tip: "ortalama",
      kaynakTipi: "elle",
      kaynakAdi: "TÜİK",
      kaynakURL: "https://www.tuik.gov.tr",
      dogrulama: "dogrulanmis",
    });
    expect(bad.success).toBe(false);
  });

  it("negatif değeri reddeder", () => {
    const bad = PricePointSchema.safeParse({
      itemId: "ekmek",
      yil: 2010,
      deger: -1,
      tip: "net",
      kaynakTipi: "elle",
      kaynakAdi: "TÜİK",
      kaynakURL: "https://www.tuik.gov.tr",
      dogrulama: "dogrulanmis",
    });
    expect(bad.success).toBe(false);
  });
});
