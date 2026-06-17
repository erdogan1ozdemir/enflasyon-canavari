# Gelir Modeli & Feature-Flag Mimarisi

Uygulama şimdilik **ücretsiz** olarak sunulur; ön yüzde gelir öğesi gösterilmez. Reklam alanları bileşen olarak (`<AdSlot id="…"/>`) yerleştirilmiştir, ancak `flags.ads.enabled` kapalıyken render olmaz ve yer kaplamaz.

**Tek seferlik satın alımla reklam kaldırma** kancası hazırdır: web'de ödeme sağlayıcı, store'da IAP (uygulama içi satın alma) entegrasyonu için arayüz iskeleti mevcuttur; MVP'de kapalıdır. İleride premium özellikler de eklenebilir.

`web/config/flags.ts` tek kaynak olarak kullanılır: `ads.enabled`, `premium.enabled`, `crowdsource.enabled` değerleri MVP'de hepsi `false`'tur. Hedef: "reklamı aç" kararı tek satır flag değişikliğiyle uygulanabilsin.

Ayrıntı: docs/superpowers/specs/2026-06-17-enflasyon-canavari-design.md Bölüm 6
