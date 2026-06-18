# Hesap Motoru

`@ec/data` içindeki `calc.ts`, 4 MVP özelliğinin kullandığı saf hesaplama fonksiyonlarını sağlar:
`fiyatBul`, `degisim`, `satinAlmaGucu`, `satinAlmaGucuKarsilastir`, `kacXEder`, `enflasyonaGore`,
ve `formatTL` / `formatSayi`.

İlkeler:
- Eksik veri veya sıfıra bölme → `null` (tahmin/interpolasyon yok; güven ilkesi).
- Negatif tutar (kullanıcı girişi) → `null`; sıfır izinli.
- Kaynak/tip seçimi `opts` ile; varsayılan `dogrulanmis` kaydı tercih eder (çok-kaynaklılık).
- Motor ham sayı döndürür; yuvarlama/biçim UI'da (`formatTL`/`formatSayi` kolaylık için).
- Endeks (TÜFE) `birim: "endeks"` bir kalem olarak modellenir; `enflasyonaGore` onu kullanır.

Ayrıntı: docs/superpowers/specs/2026-06-18-hesap-motoru-design.md
