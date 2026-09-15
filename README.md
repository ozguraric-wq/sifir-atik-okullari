# Sıfır Atık Okulları

Eskişehir'in 14 ilçesinden Avrupa'ya uzanan sıfır atık eğitim projesi için Türkçe sunum sitesi. Erasmus+ KA220-SCH 2027 hazırlık taslağıdır; fon desteği veya kesinleşmiş kurumsal ortaklık ilanı değildir.

## Yayın

Site hazır statik dosyalardan oluşur; uygulama derlemesi, paket kurulumu, veritabanı veya API anahtarı gerektirmez. Görseller, videolar, yazı tipi ve proje belgeleri depoda `deployment/site-assets.tar.gz.*` parçalarında korunur. Yayın akışı bunları doğrulayıp `dist` içine otomatik açar.

1. GitHub'da `sifir-atik-okullari` adlı herkese açık bir depo oluşturun.
2. Bu klasörün içeriğini, `.github` klasörü dahil, `main` dalına ekleyin.
3. Depoda **Settings → Pages → Build and deployment → Source → GitHub Actions** seçin.
4. **Actions → Publish Sifir Atik Okullari → Run workflow** ile ilk yayını çalıştırın. Sonraki `main` güncellemeleri otomatik yayımlanır.

Depo `ozguraric-wq/sifir-atik-okullari` olarak oluşturulursa beklenen adres `https://ozguraric-wq.github.io/sifir-atik-okullari/` olur. Bu adres, GitHub Pages iş akışı başarıyla tamamlandığında kullanılabilir.

Yayın iş akışı [GitHub'ın resmî Pages dokümantasyonunu](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) izler.

## Yerelde açma

Depodan indirilen kaynaklarda önce medya ve belgeleri açın:

```sh
cat deployment/site-assets.tar.gz.* | tar -xz -C dist
```

Ardından `dist/index.html` modern bir tarayıcıda açılabilir. Tarayıcı yerel dosyada giriş özelliğini kısıtlarsa proje klasöründe aşağıdaki komutla localhost kullanın:

```sh
python3 -m http.server 8080 --directory dist
```

Ardından `http://localhost:8080` adresini açın. Sunum giriş bilgileri proje sahibine ayrıca iletilir; düz metin şifre kaynak dosyalarında tutulmaz.

## İçerik ve etkileşimler

- Ratel Dijital logolu sunum girişi ve sekme oturumu.
- Masaüstü mega menü; mobilde kayan, klavyeyle kullanılabilen menü.
- Ayrı mobil ve masaüstü videosuyla hareketli açılış görseli.
- Yedi adımlı öğrenme döngüsü, iki yaş grubu ve on açılır eğitim modülü.
- Üç kısa seçim senaryosu; açıklayıcı geri bildirim.
- On dört ilçenin önerilen okul dağılımı.
- Otuz aylık takvim ve beş iş paketinin özeti.
- Öğrenci-gün başına atık değişimini hesaplayan yerel örnek.
- Kurumların önerilen rolleri, sürdürülebilirlik ve sık sorulan sorular.
- Ana proje dosyasının PDF ve Word indirmeleri.

Tüm sayılar planlanan hedefler veya açıkça işaretlenmiş örneklerdir. Site öğrenci, öğretmen veya aile kaydı tutmaz. Maliyet dosyası ve ticari hizmet potansiyeli yayıma dahil değildir.

## Sunum girişi hakkında

Giriş ekranı tarayıcıda çalışan bir sunum düzenidir; sunucu taraflı yetkilendirme sağlamaz. Herkese açık bir GitHub deposundaki kod ve belge adresleri doğrudan erişilebilir. Bu yapıya gizli belge, kişisel veri veya erişim anahtarı eklenmemelidir. Şifre tarayıcıda SHA-256 özetiyle karşılaştırılır; oturum durumu yalnızca `sessionStorage` içinde tutulur. Analitik, izleme çerezi veya dışarıya form gönderimi bulunmaz.

## Erişilebilirlik ve hareket

Sekmeler ok tuşlarıyla değişir. Menü Escape ile kapanır; mobil menü açıldığında klavye odağı menü içinde kalır. Etkileşim durumları ekran okuyuculara bildirilir. İşletim sisteminin hareket azaltma tercihi ve tarayıcının veri tasarrufu sinyali varsa video otomatik yüklenmez. Video görünümden çıktığında veya sekme gizlendiğinde durur. Statik görsel her zaman yedektir.

## Dosyalar

```text
dist/index.html                 Sayfa ve sabit içerik
dist/assets/site.css            Duyarlı tasarım
dist/assets/site.js             Yerel etkileşimler
dist/assets/                    Görseller, video, logo, yerel yazı tipi
dist/belgeler/                  Ana proje PDF ve Word
.github/workflows/pages.yml     GitHub Pages yayını
deployment/                    Medya ve belge arşivi; SHA-256 doğrulaması
ASSET_SOURCES.md                Görsel ve içerik kaynakları
```

İçerik temeli: Sıfır Atık Okulları ana proje dosyası V3.1, 12 Eylül 2026. 2027 çağrısı ve ortak kabulleri kesinleştiğinde başvuru durumu ve ortaklık metinleri güncellenmelidir.
