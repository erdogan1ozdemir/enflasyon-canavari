# Enflasyon Canavarı — Tasarım Dokümanı (Spec)

**Tarih:** 2026-06-17
**Durum:** Onaylandı (brainstorming) → plan aşamasına hazır
**Repo adı:** `enflasyon-canavari`

---

## 1. Vizyon & Kimlik

Enflasyon Canavarı, Türkiye'deki enflasyon ve fiyat değişimini somut, paylaşılabilir
metriklerle anlatan bir **web (önce) + mobil uygulama (sonra)** ürünüdür.

Ürün **katmanlı** bir kimliğe sahiptir; ton moda göre değişir:

1. **Sağlam veri referansı** — güvenilir, kaynaklı, şeffaf fiyat/enflasyon verisi.
2. **Viral paylaşım aracı** — kullanıcılar yaptığı karşılaştırmayı Instagram / X / WhatsApp'ta
   tek tıkla paylaşır.
3. **Kişisel hesap aracı** — "maaşım bugün ne eder", "param ne kadar değer kaybetti".

Üçü birbirini besler: çarpıcı paylaşım kullanıcı çeker, sağlam veri güveni kurar,
kişisel hesap bağlılığı artırır.

### Marka yönü
Seçilen yön: **B — hafif dokunuş (dengeli)**.
- Canavar maskotu **logoda ve küçük vurgularda** yaşar; uygulama içi deneyim temiz ve
  veri odaklı kalır.
- **Paylaşım kartlarında** canavar biraz daha öne çıkar (viral çekicilik).
- His: hem sevimli hem güvenilir; "finansal araç" ciddiyeti korunur.

---

## 2. Teknik Mimari

- **Frontend:** Next.js (App Router) + TypeScript + Tailwind. Web/PWA önce.
  - Sunucu tarafı render → SEO + her karşılaştırma için anlık **OG paylaşım görseli**.
- **Veri katmanı (başlangıç):** statik dosyalar (`/data/*.json`) + Zod şema doğrulaması.
  MVP'de veri küçük ve okuma ağırlıklı; sunucu maliyeti ~sıfır. Büyüyünce Postgres/Supabase'e
  taşınabilir (veri erişim katmanı soyutlanır).
- **Mobil (sonraki faz):** Capacitor ile aynı kod tabanı App Store / Play Store'a paketlenir.
- **Feature flag katmanı:** `web/config/flags.ts` — reklam, premium, crowdsource gibi
  yetenekler tek yerden aç/kapa. MVP'de hepsi kapalı.

### Neden bu stack? (karar gerekçesi)
Ürün "paylaşım-önce" olduğu için SEO ve sosyal link önizlemesi (OG image) kritik.
Next.js bunda en güçlü. Flutter/RN web tarafında bu konuda zayıf. Capacitor, bir veri/
karşılaştırma uygulamasını store'a taşımak için düşük riskli ve yaygın bir yöntem.

---

## 3. Veri Modeli (ürünün kalbi)

İki temel kavram: **Item (kalem)** ve **PricePoint (fiyat noktası)**. Her fiyat noktası
kendi kaynağını taşır → her sayıda "kaynak: TÜİK · ortalama" rozeti gösterilebilir.

```
Item: {
  id,
  isim,
  kategori,          // gıda, döviz, altın, akaryakıt, fatura, ulaşım, barınma, çapa
  birim,             // kg / adet / litre / gram / USD / EUR / endeks
  ikon,
  açıklama
}

PricePoint: {
  itemId,
  yıl (veya tarih),
  değer,                          // ₺ (yeni TL) cinsinden, normalize
  tip: "net" | "ortalama",        // kullanıcının istediği net/ortalama ayrımı
  kaynakTipi: "resmi-api" | "elle" | "epdk" | "crowdsource",
  kaynakAdı,                      // "TÜİK", "TCMB EVDS", "EPDK", "ENAG", ...
  kaynakURL,
  doğrulama: "doğrulanmış" | "beklemede",
  not                             // ör. "İstanbul ortalaması"
}
```

Model özellikleri:
- Aynı kalemin **birden fazla kaynak serisi** olabilir (örn. enflasyon için TÜİK + ENAG).
- Crowdsource veri ayrı tutulur, `doğrulama: beklemede` ile işaretlenir, moderasyondan
  geçmeden ana veriye karışmaz.
- Her değer kaydedilmeden önce **Zod ile doğrulanır** (eksik kaynak/etiket = hata).

### 2005 redenominasyonu (Türkiye'ye özel kritik nokta)
1 Ocak 2005'te 6 sıfır atıldı (1.000.000 eski TL = 1 YTL). Tüm fiyatlar **yeni TL**
cinsinden normalize tutulur. Başlangıç sınırı **1 Ocak 2005**. 2005 öncesi veri
eklenirse dönüşüm otomatik yapılır ve arayüzde "eski TL" notu gösterilir.

---

## 4. Veri Kaynakları & Kalemler

### Sourcing stratejisi (hibrit)
- **Resmi API'ler (otomatik):** TCMB EVDS (USD, EUR, altın, faiz), TÜİK (TÜFE/enflasyon
  endeksleri). En güvenilir/güncel.
- **EPDK / sektörel:** benzin, motorin, LPG; altın için borsa/Kapalıçarşı.
- **Elle kürasyon:** sokak ekonomisi kalemleri (döner, iskender, simit, çay…), kaynak
  göstererek json'a girilir.
- **Crowdsource (sonraki faz):** moderasyonlu, ayrı havuz.

### Önerilen kalemler (Türkiye'ye özel)
- **Çapa metrikler:** asgari ücret, gram/çeyrek/cumhuriyet altın, USD, EUR, TÜİK endeksi.
- **Sokak ekonomisi (viral):** tavuk döner, iskender, simit, çay, su, ayran, kahve.
- **Akaryakıt & faturalar:** benzin, motorin, LPG, doğalgaz, elektrik (kWh), su (m³).
- **Ulaşım:** İstanbulkart/metro bileti, otobüs.
- **Barınma:** ortalama kira, konut m² fiyatı.
- **Eğitim/sağlık (opsiyonel, sonra):** özel okul, üniversite harcı.
- **Hissedilen vs açıklanan enflasyon:** TÜİK + ENAG iki ayrı kaynak serisi olarak,
  nötr dille "kaynak seç" şeklinde sunulur.

---

## 5. Özellikler (MVP) & UX

MVP'de dört özellik birlikte yer alır (viral döngü + derinlik):

### 5.1 Yıl-yıl fiyat tablosu (çekirdek)
Kalem seç → 2005'ten bugüne tablo + çizgi grafik. Her satırda değer, net/ortalama etiketi,
kaynak rozeti. Üstte çarpıcı özet ("×62 katına çıktı" / "%6150 arttı"). Birden çok kalemi
aynı grafikte üst üste koyabilme (ekmek vs altın vs asgari ücret).

### 5.2 Kalem-kalem satın alma gücü karşılaştırması (viral motoru)
İki şey + iki yıl seç → "2005'te 1 asgari maaş = 1.250 ekmek, 2026'da = 880 ekmek".
Hazır şablonlar: "1 maaşla kaç X", "1 gram altınla kaç X", "Dün vs bugün". Tek tıkla
paylaşım kartına döner.

### 5.3 Paylaşılabilir kart üretici (büyümenin anahtarı)
- Her karşılaştırmanın **kalıcı, indexlenebilir URL'i** (`/karsilastir/maas-ekmek-2005-2026`).
- **OG görseli sunucuda anlık üretilir** (`@vercel/og` / Satori) — URL parametrelerinden
  çizilir, dosya tutulmaz. Sıfır bakım, sonsuz kombinasyon.
- İki format: link önizleme için yatay (1200×630), Story/indirme için dikey (1080×1920).
- Mobilde native paylaşım (Web Share API), masaüstünde butonlar (indir, WhatsApp, Story,
  X, kopyala). Store sürümünde Capacitor ile native.
- Kartta marka B yönü: koyu zemin, köşede canavar, altta **kaynak rozeti**.

### 5.4 Kişisel maaş/para hesabı
"2010'da maaşım 1.000₺'ydi" → bugün enflasyona göre ne olmalıydı + o günkü 1.000₺ ile
bugün ne alınırdı (kaç döner, gram altın, dolar). Giriş tarayıcıda kalır (gizlilik, hesap
gerektirmez). Sonuç paylaşılabilir kart.

### UX akışı
- Ana sayfa: "Paranı canavar ne kadar yedi?" → çarpıcı örnek + arama.
- Menü: Kalemler · Karşılaştır · Hesapla · Hakkında/Kaynaklar.
- **Kaynaklar sayfası** (güven için kritik): tüm kaynaklar, metodoloji, net/ortalama farkı,
  2005 redenominasyon notu — şeffaf biçimde.
- Ton: uygulama içi sakin/veri-odaklı; paylaşım kartında canavar öne çıkar.

---

## 6. Gelir Modeli & Feature-Flag Mimarisi

- **Şimdilik ücretsiz**, ön yüzde gelir öğesi gösterilmez.
- Reklam alanları **bileşen olarak** yerleştirilir (`<AdSlot id="…"/>`) ama
  `flags.ads.enabled` kapalıyken render olmaz / yer kaplamaz.
- **Tek seferlik satın alımla reklam kaldırma** kancası hazır (web'de ödeme sağlayıcı,
  store'da IAP). Arayüz iskeleti var, kapalı. İleride premium özellikler eklenebilir.
- `web/config/flags.ts` tek kaynak: `ads.enabled`, `premium.enabled`, `crowdsource.enabled`
  → MVP'de hepsi `false`.
- Hedef: "reklamı aç" kararı tek satır flag değişikliği olsun.

---

## 7. Proje Yapısı (modüler + notlu)

```
enflasyon-canavari/
├── docs/                       # HER ŞEYİ NOTLADIĞIMIZ YER
│   ├── 00-vizyon.md
│   ├── 01-mimari.md
│   ├── 02-veri-modeli.md
│   ├── 03-veri-kaynaklari.md
│   ├── 04-ozellikler.md
│   ├── 05-marka-tasarim.md
│   ├── 06-gelir-flagler.md
│   ├── 07-yol-haritasi.md
│   ├── kararlar/               # tarihli karar günlüğü (ADR)
│   └── superpowers/specs/      # bu spec ve sonraki spec'ler
├── web/                        # Next.js frontend (App Router)
│   ├── app/                    # sayfalar + rotalar
│   ├── components/             # modüler, kolay güncellenir UI
│   ├── lib/                    # yardımcılar, hesap motoru
│   └── config/flags.ts         # feature flag'ler (reklam/premium kapalı)
├── data/                       # veri katmanı ("backend")
│   ├── items/                  # kalem tanımları (json)
│   ├── prices/                 # fiyat noktaları (json, kategoriye göre)
│   ├── sources/                # kaynak kayıtları + metodoloji
│   └── schema/                 # TypeScript/Zod şemaları + doğrulama
├── scripts/                    # veri çekme/dönüştürme (TCMB, EPDK…)
└── shared/                     # web + data ortak tipler
```

**İlkeler:**
- Her klasörün kendi `README.md`'si: "bu klasör ne işe yarar, nasıl güncellenir".
- Her özellik/komponent **tek sorumluluk**, ayrı dosya → kolay güncellenebilir (iskelet
  tasarımla başla, sonra cilala).
- `docs/` her adımı notlar; kararlar `docs/kararlar/` altında tarihli tutulur.

---

## 8. Test & Kalite

- **Hesap motoru** (enflasyon / satın alma gücü) için birim testler — yanlış sayı = yıkılan
  güven; TDD ile yazılır.
- **Veri doğrulama testleri**: Zod şeması + "her fiyat noktasının kaynağı/etiketi var mı".
- Temel UI ve erişilebilirlik kontrolü.

---

## 9. Yol Haritası (fazlar)

1. **Faz 0 — İskelet:** repo, klasörler, md'ler, şema, birkaç örnek kalem + örnek veri.
2. **Faz 1 — MVP web:** 4 özellik + OG paylaşım + kaynaklar sayfası.
3. **Faz 2 — Veri genişletme:** otomatik çekme betikleri (TCMB/EPDK), kalem sayısını artırma.
4. **Faz 3 — Store:** Capacitor paketleme, iOS/Android yayını.
5. **Faz 4 — Gelir/crowdsource:** flag'leri aç, premium/reklam, moderasyonlu crowdsource.

---

## 10. Açık Konular / Sonraki Kararlar

- Paylaşım kartının nihai içeriği ve görünümü (iskeletle başla, sonra Claude design ile cila).
- Reklam sağlayıcısı seçimi (ileride).
- TÜİK + ENAG çift kaynak sunumunun nihai dili (nötr, şeffaf).
- Veri statik dosyadan DB'ye geçiş eşiği.
