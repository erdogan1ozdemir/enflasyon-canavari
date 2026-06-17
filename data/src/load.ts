import itemsJson from "../items/items.json";
import sourcesJson from "../sources/sources.json";
import gidaPrices from "../prices/gida.json";
import { ItemSchema, PricePointSchema, SourceSchema } from "./schema";
import type { Item, PricePoint, Source } from "./types";

export function loadItems(): Item[] {
  return (itemsJson as unknown[]).map((r) => ItemSchema.parse(r));
}

export function loadSources(): Source[] {
  return (sourcesJson as unknown[]).map((r) => SourceSchema.parse(r));
}

const priceFiles: unknown[][] = [gidaPrices as unknown[]];

export function loadPrices(): PricePoint[] {
  return priceFiles.flat().map((r) => PricePointSchema.parse(r));
}
