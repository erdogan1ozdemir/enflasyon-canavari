# Veri Kaynakları & Kalemler

Veri toplama stratejisi **hibrit** bir yapıya dayanmaktadır. **Resmi API'ler (otomatik):** TCMB EVDS (USD, EUR, altın, faiz) ve TÜİK (TÜFE/enflasyon endeksleri) en güvenilir ve güncel kaynaklar olarak kullanılır. **EPDK / sektörel kaynaklar:** benzin, motorin, LPG ve altın için borsa/Kapalıçarşı verileri alınır. **Elle kürasyon:** sokak ekonomisi kalemleri (döner, iskender, simit, çay vb.) kaynak göstererek JSON'a girilir. **Crowdsource (sonraki faz):** moderasyonlu ve ayrı havuzda tutulur.

Önerilen kalemler Türkiye'ye özel olarak belirlenmiştir: **Çapa metrikler** — asgari ücret, gram/çeyrek/cumhuriyet altın, USD, EUR, TÜİK endeksi. **Sokak ekonomisi (viral)** — tavuk döner, iskender, simit, çay, su, ayran, kahve. **Akaryakıt & faturalar** — benzin, motorin, LPG, doğalgaz, elektrik (kWh), su (m³). **Ulaşım** — İstanbulkart/metro bileti, otobüs. **Barınma** — ortalama kira, konut m² fiyatı. **Eğitim/sağlık (opsiyonel, sonraki fazda)** — özel okul, üniversite harcı.

"Hissedilen vs açıklanan enflasyon" karşılaştırması TÜİK + ENAG iki ayrı kaynak serisi olarak nötr dille "kaynak seç" şeklinde sunulur.

Ayrıntı: docs/superpowers/specs/2026-06-17-enflasyon-canavari-design.md Bölüm 4
