import type { Item } from "@ec/data";

/**
 * Maps an Item to an Icon name (from web/components/Icon.tsx MAP).
 * Falls back to "chart" for unknown categories.
 */
export function iconForItem(item: Item): string {
  // Honor item.ikon if it directly matches a known icon name
  const knownIcons = new Set([
    "search", "share", "download", "arrowRight", "arrowLeft",
    "chevronRight", "chevronDown", "x", "check", "info",
    "home", "chart", "scale", "calculator", "file",
    "sun", "moon", "wheat", "food", "dollar", "gem",
    "fuel", "banknote", "drumstick", "user", "wallet", "ticket",
  ]);

  if (knownIcons.has(item.ikon)) return item.ikon;

  // Map by kategori
  const kategoriMap: Record<string, string> = {
    gida: "wheat",
    doviz: "dollar",
    altin: "gem",
    akaryakit: "fuel",
    fatura: "file",
    ulasim: "home",
    barinma: "home",
    capa: "banknote",
    hizmet: "ticket",
  };

  return kategoriMap[item.kategori] ?? "chart";
}
