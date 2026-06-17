import { z } from "zod";

export const KATEGORILER = [
  "gida",
  "doviz",
  "altin",
  "akaryakit",
  "fatura",
  "ulasim",
  "barinma",
  "capa",
] as const;

export const BIRIMLER = [
  "adet",
  "kg",
  "litre",
  "gram",
  "USD",
  "EUR",
  "endeks",
  "TL",
  "kWh",
  "m2",
  "m3",
] as const;

export const KAYNAK_TIPLERI = ["resmi-api", "elle", "epdk", "crowdsource"] as const;

export const ItemSchema = z.object({
  id: z.string().min(1),
  isim: z.string().min(1),
  kategori: z.enum(KATEGORILER),
  birim: z.enum(BIRIMLER),
  ikon: z.string().min(1),
  aciklama: z.string().default(""),
});

export const PricePointSchema = z.object({
  itemId: z.string().min(1),
  yil: z.number().int().min(2005).max(2100),
  deger: z.number().positive(),
  tip: z.enum(["net", "ortalama"]),
  kaynakTipi: z.enum(KAYNAK_TIPLERI),
  kaynakAdi: z.string().min(1),
  kaynakURL: z.string().url(),
  dogrulama: z.enum(["dogrulanmis", "beklemede"]),
  not: z.string().optional(),
});

export const SourceSchema = z.object({
  ad: z.string().min(1),
  tip: z.enum(KAYNAK_TIPLERI),
  url: z.string().url(),
  metodoloji: z.string().min(1),
});
