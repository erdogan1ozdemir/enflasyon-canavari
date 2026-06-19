import itemsJson from "../items/items.json";
import sourcesJson from "../sources/sources.json";
import gidaPrices from "../prices/gida.json";
import capaPrices from "../prices/capa.json";
import dovizPrices from "../prices/doviz.json";
import endeksPrices from "../prices/endeks.json";
import altinPrices from "../prices/altin.json";
import akaryakitPrices from "../prices/akaryakit.json";
import { ItemSchema, PricePointSchema, SourceSchema } from "./schema";
import type { Item, PricePoint, Source } from "./types";

export function loadItems(): Item[] {
  return (itemsJson as unknown[]).map((r) => ItemSchema.parse(r));
}

export function loadSources(): Source[] {
  return (sourcesJson as unknown[]).map((r) => SourceSchema.parse(r));
}

const priceFiles: unknown[][] = [
  gidaPrices as unknown[],
  capaPrices as unknown[],
  dovizPrices as unknown[],
  endeksPrices as unknown[],
  altinPrices as unknown[],
  akaryakitPrices as unknown[],
];

export function loadPrices(): PricePoint[] {
  return priceFiles.flat().map((r) => PricePointSchema.parse(r));
}
