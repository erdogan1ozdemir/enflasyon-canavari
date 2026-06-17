import type { Item, PricePoint } from "./types";

export function validateDataset(items: Item[], prices: PricePoint[]): string[] {
  const errors: string[] = [];
  const itemIds = new Set(items.map((i) => i.id));

  for (const p of prices) {
    if (!itemIds.has(p.itemId)) {
      errors.push(`Fiyat noktası var olmayan kaleme bağlı: "${p.itemId}" (${p.yil})`);
    }
  }

  const seen = new Set<string>();
  for (const p of prices) {
    const key = `${p.itemId}|${p.yil}|${p.tip}|${p.kaynakAdi}`;
    if (seen.has(key)) {
      errors.push(`çift kayıt: ${key}`);
    }
    seen.add(key);
  }

  return errors;
}
