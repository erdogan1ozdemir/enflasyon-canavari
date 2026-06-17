# Enflasyon Canavarı

Türkiye'deki enflasyon ve fiyat değişimini paylaşılabilir metriklerle anlatan web + (sonra) mobil uygulama.

## Yapı
- `web/` — Next.js frontend (`@ec/web`)
- `data/` — veri katmanı, şema ve doğrulama (`@ec/data`)
- `scripts/` — veri çekme/doğrulama araçları
- `docs/` — vizyon, mimari ve karar notları

## Komutlar
- `npm run dev` — web geliştirme sunucusu
- `npm test` — veri/şema testleri
- `npm run validate:data` — tüm veriyi doğrula
- `npm run test -w web` — web testleri

Tasarım dokümanı: `docs/superpowers/specs/2026-06-17-enflasyon-canavari-design.md`
