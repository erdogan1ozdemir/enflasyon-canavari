# Teknik Mimari

Frontend olarak **Next.js (App Router) + TypeScript + Tailwind** kullanılmaktadır. Sunucu tarafı render, hem SEO hem de her karşılaştırma için anlık OG paylaşım görseli üretimini mümkün kılar. Proje tek repo, npm workspaces ile iki paket olarak yapılandırılmıştır: `web/` (`@ec/web` — Next.js frontend) ve `data/` (`@ec/data` — şemalar, tipler, JSON veri, doğrulama). `web` paketi, `@ec/data`'yı doğrudan import eder; Next.js `transpilePackages` ile TypeScript kaynağını derler, ayrı bir build adımı gerekmez.

**Veri katmanı** başlangıçta statik JSON dosyaları (`/data/*.json`) + Zod şema doğrulamasından oluşur. MVP'de veri küçük ve okuma ağırlıklıdır; sunucu maliyeti yaklaşık sıfırdır. İleride büyüyünce veri erişim katmanı soyutlandığından Postgres/Supabase'e geçiş mümkündür. Mobil (sonraki faz) için aynı kod tabanı **Capacitor** ile App Store / Play Store'a paketlenecektir.

**Feature flag katmanı** `web/config/flags.ts` dosyasında tek merkezden yönetilir. Reklam, premium ve crowdsource gibi yetenekler bu dosyadaki `ads.enabled`, `premium.enabled`, `crowdsource.enabled` flag'leriyle açılıp kapatılır; MVP'de hepsi `false` değerindedir.

Ayrıntı: docs/superpowers/specs/2026-06-17-enflasyon-canavari-design.md Bölüm 2
