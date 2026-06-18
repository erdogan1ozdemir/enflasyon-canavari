// ─── Kategori label mapping ───────────────────────────────────────────────────

export const KATEGORI_LABELS: Record<string, string> = {
  gida: "Gıda",
  doviz: "Döviz",
  altin: "Altın",
  akaryakit: "Akaryakıt",
  fatura: "Fatura",
  ulasim: "Ulaşım",
  barinma: "Barınma",
  capa: "Çapa",
};

/**
 * Returns the Turkish display label for a category key.
 * Falls back to the raw key if no mapping is found.
 */
export function kategoriLabel(k: string): string {
  return KATEGORI_LABELS[k] ?? k;
}
