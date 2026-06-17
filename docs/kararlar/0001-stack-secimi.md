# 0001 — Teknoloji yığını seçimi

**Tarih:** 2026-06-17
**Durum:** Kabul edildi

## Karar
Web-first Next.js (App Router) + sonra Capacitor ile store. Veri katmanı npm workspace paketi (`@ec/data`).

## Gerekçe
Ürün paylaşım-önce; SEO ve OG link önizlemesi kritik. Next.js bunda en güçlü.
Flutter/RN web SEO ve OG tarafında zayıf. Capacitor bir veri/karşılaştırma uygulamasını
store'a taşımak için düşük riskli.

## Alternatifler
- Flutter: web SEO/OG zayıf — reddedildi.
- Expo/React Native: web tarafı manuel iş — reddedildi.
