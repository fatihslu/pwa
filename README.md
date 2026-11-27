# Kas Gelişim Takipçisi — PWA

## İçerik
- `index.html`: Uygulama arayüzü
- `manifest.webmanifest`: Ana ekrana kurulum bilgileri
- `sw.js`: Çevrimdışı önbellek
- `icons/`: Uygulama simgeleri

## Telefona kurulum
PWA kurulumu için dosyaları HTTPS üzerinden yayınlamak gerekir. `file://` üzerinden açmak PWA kurulumu için yeterli değildir.

1. Bu klasörü bir HTTPS statik site barındırıcısına yükle (ör. GitHub Pages, Netlify veya kendi HTTPS alan adın).
2. Yayınlanan siteyi Android Chrome ile aç.
3. Chrome menüsünden **Ana ekrana ekle** veya **Uygulamayı yükle** seçeneğine dokun.
4. Kurulumdan sonra uygulama simgesinden açabilirsin.

## Yerel test
Bilgisayarda bu klasörde terminal açıp:
`python -m http.server 8000`
komutunu çalıştır. Ardından `http://localhost:8000` adresini aç. Telefonda test için HTTPS yayın gerekir.

## Veri saklama
Kullanıcı kayıtları tarayıcının `localStorage` alanında tutulur. Tarayıcı verilerini temizlemek kayıtları silebilir. Bu sürümde bulut senkronizasyonu veya hesap sistemi yoktur.
