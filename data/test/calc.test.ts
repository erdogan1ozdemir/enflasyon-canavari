import { describe, it, expect } from "vitest";
import { PricePointSchema } from "../src/schema";
import {
  fiyatBul,
  degisim,
  satinAlmaGucu,
  satinAlmaGucuKarsilastir,
  kacXEder,
  enflasyonaGore,
  formatTL,
  formatSayi,
} from "../src/calc";

const pp = (o: Record<string, unknown>) =>
  PricePointSchema.parse({
    tip: "ortalama",
    kaynakTipi: "elle",
    kaynakAdi: "TÜİK",
    kaynakURL: "https://www.tuik.gov.tr",
    dogrulama: "dogrulanmis",
    ...o,
  });

const prices = [
  pp({ itemId: "ekmek", yil: 2005, deger: 0.4 }),
  pp({ itemId: "ekmek", yil: 2026, deger: 25 }),
  pp({ itemId: "asgari-ucret", yil: 2005, deger: 350, tip: "net" }),
  pp({ itemId: "asgari-ucret", yil: 2026, deger: 22000, tip: "net" }),
  pp({ itemId: "tufe", yil: 2005, deger: 100 }),
  pp({ itemId: "tufe", yil: 2026, deger: 6150 }),
  pp({ itemId: "usd", yil: 2026, deger: 45, kaynakAdi: "TCMB EVDS", kaynakTipi: "resmi-api", kaynakURL: "https://evds2.tcmb.gov.tr", dogrulama: "dogrulanmis" }),
  pp({ itemId: "usd", yil: 2026, deger: 99, kaynakAdi: "Şüpheli", dogrulama: "beklemede" }),
];

describe("fiyatBul", () => {
  it("değeri bulur", () => {
    expect(fiyatBul(prices, "ekmek", 2005)).toBe(0.4);
  });
  it("veri yoksa null", () => {
    expect(fiyatBul(prices, "ekmek", 2010)).toBeNull();
  });
  it("tip filtresi uygular", () => {
    expect(fiyatBul(prices, "asgari-ucret", 2005, { tip: "ortalama" })).toBeNull();
    expect(fiyatBul(prices, "asgari-ucret", 2005, { tip: "net" })).toBe(350);
  });
  it("kaynakAdi filtresi uygular", () => {
    expect(fiyatBul(prices, "usd", 2026, { kaynakAdi: "Şüpheli" })).toBe(99);
  });
  it("birden çok eşleşmede dogrulanmis olanı tercih eder", () => {
    expect(fiyatBul(prices, "usd", 2026)).toBe(45);
  });
});

describe("degisim", () => {
  it("kat ve yüzde hesaplar", () => {
    const d = degisim(prices, "ekmek", 2005, 2026);
    expect(d).not.toBeNull();
    expect(d!.kat).toBeCloseTo(62.5);
    expect(d!.yuzde).toBeCloseTo(6150);
  });
  it("eksik veride null", () => {
    expect(degisim(prices, "ekmek", 2005, 2010)).toBeNull();
  });
});

describe("satinAlmaGucu", () => {
  it("1 kaynak kaç hedef alır", () => {
    expect(satinAlmaGucu(prices, "asgari-ucret", "ekmek", 2005)).toBeCloseTo(875);
    expect(satinAlmaGucu(prices, "asgari-ucret", "ekmek", 2026)).toBeCloseTo(880);
  });
  it("eksik veride null", () => {
    expect(satinAlmaGucu(prices, "asgari-ucret", "ekmek", 2010)).toBeNull();
  });
});

describe("satinAlmaGucuKarsilastir", () => {
  it("iki yıl arası değişimi verir", () => {
    const r = satinAlmaGucuKarsilastir(prices, "asgari-ucret", "ekmek", 2005, 2026);
    expect(r).not.toBeNull();
    expect(r!.a).toBeCloseTo(875);
    expect(r!.b).toBeCloseTo(880);
    expect(r!.yuzdeDegisim).toBeCloseTo(((880 - 875) / 875) * 100);
  });
});

describe("kacXEder", () => {
  it("tutar kaç adet alır", () => {
    expect(kacXEder(prices, 100, "ekmek", 2026)).toBeCloseTo(4);
  });
  it("fiyat yoksa null", () => {
    expect(kacXEder(prices, 100, "ekmek", 2010)).toBeNull();
  });
});

describe("enflasyonaGore", () => {
  it("endekse göre tutarı günceller", () => {
    expect(enflasyonaGore(prices, "tufe", 350, 2005, 2026)).toBeCloseTo(350 * (6150 / 100));
  });
  it("endeks yoksa null", () => {
    expect(enflasyonaGore(prices, "yok", 350, 2005, 2026)).toBeNull();
  });
});

describe("format", () => {
  it("formatSayi tr-TR binlik ayırıcı", () => {
    expect(formatSayi(1250)).toBe("1.250");
  });
  it("formatTL ₺ içerir", () => {
    expect(formatTL(25)).toContain("₺");
  });
});
