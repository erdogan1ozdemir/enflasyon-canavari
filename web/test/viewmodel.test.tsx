import { describe, it, expect } from "vitest";
import { loadItems, loadPrices } from "@ec/data";
import { seriBul, itemViewModel, listViewModel, paraToUrun, urunToPara } from "../lib/viewmodel";

const items = loadItems();
const prices = loadPrices();

describe("seriBul", () => {
  it("asgari-ucret net serisi artan ve dolu", () => {
    const s = seriBul(prices, "asgari-ucret", { tip: "net" });
    expect(s.length).toBeGreaterThanOrEqual(20);
    expect(s[0]![0]).toBe(2005);
    expect(s[0]![1]).toBeCloseTo(350.15);
    expect(s[s.length - 1]![0]).toBe(2026);
    expect(s[s.length - 1]![1]).toBeCloseTo(28075.5);
    for (let i = 1; i < s.length; i++) expect(s[i]![0]).toBeGreaterThan(s[i - 1]![0]);
  });
  it("verisi olmayan kalem boş seri", () => {
    expect(seriBul(prices, "yok-boyle-kalem")).toEqual([]);
  });
});

describe("itemViewModel", () => {
  it("asgari-ucret özetini üretir", () => {
    const vm = itemViewModel(items, prices, "asgari-ucret");
    expect(vm.guncel?.deger).toBeCloseTo(28075.5);
    expect(vm.ilk?.deger).toBeCloseTo(350.15);
    expect(vm.degisim?.kat).toBeCloseTo(28075.5 / 350.15);
    expect(vm.kaynak?.dogrulanmis).toBe(true);
  });
  it("verisi olmayan kalem null alanlar", () => {
    // Sentetik: var olan ama hiç fiyatı olmayan bir kalem
    const bosItem = { id: "bos", isim: "Boş", kategori: "gida", birim: "kg", ikon: "food", aciklama: "" };
    const vm = itemViewModel([bosItem as (typeof items)[number]], [], "bos");
    expect(vm.seri).toEqual([]);
    expect(vm.guncel).toBeNull();
    expect(vm.degisim).toBeNull();
  });
});

describe("listViewModel", () => {
  it("her kalem için bir satır", () => {
    const rows = listViewModel(items, prices);
    expect(rows.length).toBe(items.length);
  });
});

describe("paraToUrun", () => {
  it("TL doğrudan böler", () => {
    expect(paraToUrun(prices, 50, "TL", "ekmek", 2005)).toBeCloseTo(50 / 1.19);
  });
  it("USD önce TL'ye çevirir", () => {
    // 1 USD 2005'te 1.3408 TL; ekmek 1.19 TL/kg
    expect(paraToUrun(prices, 1, "usd", "ekmek", 2005)).toBeCloseTo(1.3408 / 1.19);
  });
  it("veri yoksa null", () => {
    expect(paraToUrun(prices, 50, "TL", "ekmek", 2026)).toBeNull();
  });
  it("negatif tutar null", () => {
    expect(paraToUrun(prices, -5, "TL", "ekmek", 2005)).toBeNull();
  });
});

describe("urunToPara", () => {
  it("TL ve USD karşılığı", () => {
    const r = urunToPara(prices, 10, "tavuk", 2005);
    expect(r?.tl).toBeCloseTo(31.3);
    expect(r?.usd).toBeCloseTo(31.3 / 1.3408);
  });
  it("ürün verisi yoksa null", () => {
    expect(urunToPara(prices, 10, "tavuk", 2026)).toBeNull();
  });
});
