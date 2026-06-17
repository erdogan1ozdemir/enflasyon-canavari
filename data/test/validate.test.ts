import { describe, it, expect } from "vitest";
import { ItemSchema, PricePointSchema } from "../src/schema";
import { validateDataset } from "../src/validate";

const items = [ItemSchema.parse({ id: "ekmek", isim: "Ekmek", kategori: "gida", birim: "adet", ikon: "bread", aciklama: "x" })];

const ok = [PricePointSchema.parse({ itemId: "ekmek", yil: 2005, deger: 0.4, tip: "ortalama", kaynakTipi: "elle", kaynakAdi: "TÜİK", kaynakURL: "https://www.tuik.gov.tr", dogrulama: "beklemede" })];

describe("validateDataset", () => {
  it("tutarlı veri için hata döndürmez", () => {
    const errors = validateDataset(items, ok);
    expect(errors).toEqual([]);
  });

  it("var olmayan itemId'yi yakalar", () => {
    const bad = [{ ...ok[0]!, itemId: "yok" }];
    const errors = validateDataset(items, bad);
    expect(errors.some((e) => e.includes("yok"))).toBe(true);
  });

  it("aynı item+yıl+tip için çift kaydı yakalar", () => {
    const dup = [ok[0]!, ok[0]!];
    const errors = validateDataset(items, dup);
    expect(errors.some((e) => e.includes("çift"))).toBe(true);
  });
});
