# Özellikler (MVP) & UX

MVP'de dört özellik birlikte yer alır ve viral döngüyle derinliği bir arada sunar.

**5.1 Yıl-yıl fiyat tablosu (çekirdek):** Kalem seçilir, 2005'ten bugüne tablo ve çizgi grafik gösterilir. Her satırda değer, net/ortalama etiketi ve kaynak rozeti bulunur. Üstte çarpıcı bir özet ("×62 katına çıktı" / "%6150 arttı") yer alır. Birden çok kalemi aynı grafikte üst üste koyabilme imkânı sunulur (ekmek vs altın vs asgari ücret).

**5.2 Kalem-kalem satın alma gücü karşılaştırması (viral motor):** İki şey ve iki yıl seçilir; örneğin "2005'te 1 asgari maaş = 1.250 ekmek, 2026'da = 880 ekmek". Hazır şablonlar mevcuttur: "1 maaşla kaç X", "1 gram altınla kaç X", "Dün vs bugün". Sonuç tek tıkla paylaşım kartına dönüşür.

**5.3 Paylaşılabilir kart üretici (büyümenin anahtarı):** Her karşılaştırmanın kalıcı ve indexlenebilir bir URL'i vardır (`/karsilastir/maas-ekmek-2005-2026`). OG görseli sunucuda anlık üretilir (`@vercel/og` / Satori), dosya tutulmaz. İki format sunulur: link önizleme için yatay (1200×630) ve Story/indirme için dikey (1080×1920). Mobilde Web Share API, masaüstünde indirme/WhatsApp/X/kopyala butonları kullanılır. Kartta marka B yönü uygulanır: koyu zemin, köşede canavar, altta kaynak rozeti.

**5.4 Kişisel maaş/para hesabı:** "2010'da maaşım 1.000₺'ydi" → bugün enflasyona göre ne olmalıydı ve o günkü 1.000₺ ile bugün ne alınırdı (kaç döner, gram altın, dolar). Giriş tarayıcıda kalır (hesap gerektirmez). Sonuç paylaşılabilir kart olarak üretilebilir.

**UX akışı:** Ana sayfa "Paranı canavar ne kadar yedi?" sorusuyla çarpıcı bir örnekle açılır. Menü: Kalemler · Karşılaştır · Hesapla · Hakkında/Kaynaklar. Kaynaklar sayfası tüm kaynakları, metodoloji bilgisini, net/ortalama farkını ve 2005 redenominasyon notunu şeffaf biçimde sunar.

Ayrıntı: docs/superpowers/specs/2026-06-17-enflasyon-canavari-design.md Bölüm 5
