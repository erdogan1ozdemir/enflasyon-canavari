# Veri Modeli

Veri modelinin iki temel kavramı vardır: **Item (kalem)** ve **PricePoint (fiyat noktası)**. Her fiyat noktası kendi kaynağını taşır; bu sayede her sayıda "kaynak: TÜİK · ortalama" rozeti gösterilebilir. Item; id, isim, kategori (gıda/döviz/altın/akaryakıt/fatura/ulaşım/barınma/çapa), birim, ikon ve açıklama alanlarından oluşur. PricePoint ise itemId, yıl (veya tarih), değer (₺ yeni TL cinsinden, normalize), tip (net/ortalama), kaynakTipi (resmi-api/elle/epdk/crowdsource), kaynakAdı, kaynakURL, doğrulama durumu (doğrulanmış/beklemede) ve opsiyonel not alanlarından oluşur.

Aynı kalemin birden fazla kaynak serisi olabilir (örneğin enflasyon için TÜİK + ENAG). Crowdsource veri ayrı tutulur, `doğrulama: beklemede` ile işaretlenir ve moderasyondan geçmeden ana veriye karışmaz. Her değer kaydedilmeden önce Zod ile doğrulanır; eksik kaynak veya etiket hata üretir.

**2005 redenominasyonu (Türkiye'ye özel kritik nokta):** 1 Ocak 2005'te 6 sıfır atıldı (1.000.000 eski TL = 1 YTL). Tüm fiyatlar yeni TL cinsinden normalize tutulur; başlangıç sınırı 1 Ocak 2005'tir. 2005 öncesi veri eklenirse dönüşüm otomatik yapılır ve arayüzde "eski TL" notu gösterilir.

**Çok-kaynaklılık:** aynı (itemId, yıl, tip) için farklı kaynak serileri (ör. TÜİK + ENAG) bilinçli olarak birlikte tutulabilir; çift kayıt kontrolü kaynak adını da anahtara dahil eder.

Ayrıntı: docs/superpowers/specs/2026-06-17-enflasyon-canavari-design.md Bölüm 3
