/* Sıfır Atık Okulları — all interactions run locally, without analytics. */
(() => {
  'use strict';

  function calculateImpact(beforeKg, beforeDays, afterKg, afterDays) {
    const values = [beforeKg, beforeDays, afterKg, afterDays];
    if (!values.every(Number.isFinite) || beforeKg <= 0 || afterKg < 0 ||
        !Number.isInteger(beforeDays) || !Number.isInteger(afterDays) || beforeDays < 1 || afterDays < 1) {
      throw new RangeError('Başlangıç atığı sıfırdan büyük, son atık sıfır veya daha büyük; öğrenci-gün değerleri pozitif tam sayı olmalıdır.');
    }
    const before = beforeKg * 1000 / beforeDays;
    const after = afterKg * 1000 / afterDays;
    return {before, after, change: (before - after) / before * 100};
  }

  const districts = [
    ['Odunpazarı', 4, 'Kent merkezinde farklı sosyoekonomik okul profilleriyle uygulama.'],
    ['Tepebaşı', 4, 'Farklı okul türleri ile yemek ve kantin modellerinin birlikte değerlendirilmesi.'],
    ['Alpu', 1, 'Kırsal erişim ve tarımsal bağlamda öğrenme görevlerinin uyarlanması.'],
    ['Beylikova', 1, 'Küçük ilçe ölçeğinde uygulanabilir bir okul modelinin denenmesi.'],
    ['Çifteler', 1, 'Kırsal ve merkez bağlamları arasındaki ihtiyaçların değerlendirilmesi.'],
    ['Günyüzü', 1, 'Dijital erişimi sınırlı koşullarda basılı ve erişilebilir seçeneklerin denenmesi.'],
    ['Han', 1, 'Küçük nüfus ve yakın topluluk modeliyle okul–aile bağının güçlendirilmesi.'],
    ['İnönü', 1, 'Yerel kurum eşgüdümünün okul uygulamasına katkısının değerlendirilmesi.'],
    ['Mahmudiye', 1, 'Kaynak kullanımı alışkanlıkları ile okul–aile bağının birlikte ele alınması.'],
    ['Mihalgazi', 1, 'Kırsal ve mikroklima bağlamına uygun öğrenme örneklerinin geliştirilmesi.'],
    ['Mihalıççık', 1, 'Uzaklık ve lojistik koşullarının uygulama sürekliliğine etkisinin denenmesi.'],
    ['Sarıcakaya', 1, 'Gıda ve tarımsal üretim bağlantısı üzerinden israfı önleme görevleri.'],
    ['Seyitgazi', 1, 'Yaygın kırsal yerleşimlerde erişilebilir okul ve aile uygulamaları.'],
    ['Sivrihisar', 1, 'Bölgesel merkez niteliği ve yaygınlaştırma potansiyelinin değerlendirilmesi.']
  ];

  if (typeof module !== 'undefined' && module.exports) module.exports = {calculateImpact, districts};
  if (typeof document === 'undefined') return;

  const $ = (s, parent = document) => parent.querySelector(s);
  const $$ = (s, parent = document) => [...parent.querySelectorAll(s)];
  const format = new Intl.NumberFormat('tr-TR', {maximumFractionDigits: 1});
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const presentation = $('#presentation');
  const access = $('#access-screen');
  const video = $('#hero-video');
  const motionButton = $('#motion-toggle');
  const sessionKey = 'sifir-atik-demo-v1';
  const expectedHash = '64f1a43827bfa1e35f0bd0827875062ae919aef66ecad51822e652305155b6a8';
  let entered = false;
  let videoVisible = true;
  let motionPaused = false;

  // This is a presentation entrance only, not protection for public files.
  function sessionRead() { try { return sessionStorage.getItem(sessionKey) === 'open'; } catch { return false; } }
  function sessionWrite(open) { try { open ? sessionStorage.setItem(sessionKey, 'open') : sessionStorage.removeItem(sessionKey); } catch { /* Private modes may disable storage. */ } }

  function setMotionState() {
    const paused = video.paused || motionPaused;
    motionButton.setAttribute('aria-pressed', String(paused));
    motionButton.setAttribute('aria-label', paused ? 'Hareketli görseli oynat' : 'Hareketli görseli duraklat');
    motionButton.textContent = paused ? '▷' : 'Ⅱ';
  }

  function startMotion() {
    if (!entered || reduceMotion.matches || navigator.connection?.saveData || motionPaused || !videoVisible || document.hidden) {
      video.pause();
      return;
    }
    if (!video.getAttribute('src')) video.src = window.matchMedia('(max-width: 700px)').matches ? video.dataset.mobile : video.dataset.desktop;
    video.muted = true;
    video.play().then(() => {
      if (!entered || reduceMotion.matches || motionPaused || !videoVisible || document.hidden) {
        video.pause();
        return;
      }
      video.classList.add('ready');
      motionButton.hidden = false;
      setMotionState();
    }).catch(() => { motionButton.hidden = true; });
  }

  motionButton.addEventListener('click', () => {
    motionPaused = !motionPaused;
    if (motionPaused) video.pause(); else startMotion();
    setMotionState();
  });
  video.addEventListener('pause', setMotionState);
  video.addEventListener('play', setMotionState);
  video.addEventListener('error', () => { video.classList.remove('ready'); motionButton.hidden = true; });
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches) { video.pause(); motionButton.hidden = true; } else startMotion();
  });
  document.addEventListener('visibilitychange', () => document.hidden ? video.pause() : startMotion());
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    videoVisible = entries[0].isIntersecting;
    if (videoVisible) startMotion(); else video.pause();
  }, {threshold: .05}).observe($('#baslangic'));

  function enterPresentation(restore = false) {
    entered = true;
    access.hidden = true;
    presentation.hidden = false;
    presentation.inert = false;
    sessionWrite(true);
    $('#password').value = '';
    if (!restore) { window.scrollTo(0, 0); $('#hero-title').focus({preventScroll: true}); }
    startMotion();
  }

  $('#password-toggle').addEventListener('click', () => {
    const show = $('#password').type === 'password';
    $('#password').type = show ? 'text' : 'password';
    $('#password-toggle').textContent = show ? 'Gizle' : 'Göster';
    $('#password-toggle').setAttribute('aria-pressed', String(show));
  });

  $$('#access-form input, #access-form button').forEach(el => { el.disabled = false; });
  $('#access-form').addEventListener('submit', async event => {
    event.preventDefault();
    const button = $('#access-form button[type="submit"]');
    const error = $('#access-error');
    error.hidden = true;
    button.disabled = true;
    button.querySelector('span').textContent = 'Açılıyor…';
    try {
      if (!window.crypto?.subtle) throw new Error('Giriş için siteyi HTTPS veya localhost üzerinden açın.');
      const username = $('#username').value.trim().toLocaleLowerCase('tr-TR');
      const bytes = new TextEncoder().encode(`${sessionKey}\0${username}\0${$('#password').value}`);
      const digest = [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(n => n.toString(16).padStart(2, '0')).join('');
      if (digest !== expectedHash) throw new Error('Kullanıcı adı veya şifre eşleşmedi. Yeniden deneyin.');
      enterPresentation();
    } catch (err) {
      error.textContent = err.message;
      error.hidden = false;
      $('#password').focus();
    } finally {
      button.disabled = false;
      button.querySelector('span').textContent = 'Sunumu aç';
    }
  });

  // Desktop menu and mobile drawer share anchors, but use separate controls.
  const mega = $('#mega-menu');
  const megaToggle = $('#mega-toggle');
  const drawer = $('#mobile-menu');
  const mobileToggle = $('#mobile-toggle');
  const backdrop = $('#drawer-backdrop');
  const background = [$('#site-header'), $('#main'), $('.footer')];

  function closeMega() { mega.hidden = true; megaToggle.setAttribute('aria-expanded', 'false'); }
  function closeDrawer(restoreFocus = false) {
    drawer.hidden = true;
    drawer.inert = true;
    drawer.removeAttribute('aria-modal');
    drawer.removeAttribute('role');
    backdrop.hidden = true;
    mobileToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    background.forEach(el => { if (el) el.inert = false; });
    if (restoreFocus) mobileToggle.focus();
  }
  megaToggle.addEventListener('click', () => {
    const open = mega.hidden;
    mega.hidden = !open;
    megaToggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', e => { if (!mega.hidden && !mega.contains(e.target) && !megaToggle.contains(e.target)) closeMega(); });
  document.addEventListener('focusin', e => { if (!mega.hidden && !mega.contains(e.target) && !megaToggle.contains(e.target)) closeMega(); });
  $$('#mega-menu a').forEach(link => link.addEventListener('click', closeMega));
  mobileToggle.addEventListener('click', () => {
    if (!drawer.hidden) return closeDrawer(true);
    closeMega();
    drawer.hidden = false;
    drawer.inert = false;
    drawer.setAttribute('role', 'dialog');
    drawer.setAttribute('aria-modal', 'true');
    backdrop.hidden = false;
    mobileToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    background.forEach(el => { if (el) el.inert = true; });
    $('#mobile-close').focus();
  });
  $('#mobile-close').addEventListener('click', () => closeDrawer(true));
  backdrop.addEventListener('click', () => closeDrawer(true));
  $$('#mobile-menu a').forEach(link => link.addEventListener('click', () => {
    closeDrawer();
    const target = $(link.getAttribute('href'));
    if (target) { target.setAttribute('tabindex', '-1'); target.focus({preventScroll: true}); }
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!drawer.hidden) { event.preventDefault(); closeDrawer(true); }
      else if (!mega.hidden) { closeMega(); megaToggle.focus(); }
    }
    if (event.key === 'Tab' && !drawer.hidden) {
      const items = $$('a, button:not([disabled])', drawer);
      if (event.shiftKey && document.activeElement === items[0]) { event.preventDefault(); items.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === items.at(-1)) { event.preventDefault(); items[0].focus(); }
    }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', event => { if (event.matches) closeDrawer(); else closeMega(); });
  $$('[data-signout]').forEach(button => button.addEventListener('click', () => {
    closeDrawer(); closeMega();
    entered = false;
    video.pause();
    sessionWrite(false);
    presentation.inert = true;
    presentation.hidden = true;
    access.hidden = false;
    $('#password').value = '';
    $('#password').type = 'password';
    $('#password-toggle').textContent = 'Göster';
    $('#password-toggle').setAttribute('aria-pressed', 'false');
    $('#access-error').hidden = true;
    try { history.replaceState(null, '', location.pathname + location.search); } catch { /* file: preview */ }
    window.scrollTo(0, 0);
    $('#username').focus();
  }));

  const cycle = [
    ['Önce başlangıç<br>noktanı bil.', 'Okul ekibi, güvenli ve yetişkin gözetimindeki ölçümlerle hangi atığın nerede oluştuğunu belirler.', 'Beş okul günü boyunca temiz kağıt atığını kaydedin. Hangi gün daha fazla oluştuğunu birlikte tartışın.', 'Okul atık haritası ve başlangıç ölçümü'],
    ['Atığın arkasındaki<br>alışkanlığı keşfet.', 'Çocuklar bir ürünün kullanım öncesini ve sonrasını düşünür; ihtiyaç, istek ve kaynak kullanımı arasındaki ilişkiyi öğrenir.', 'Bir defterin üretimden sınıfa yolculuğunu çizin. Boş sayfalar varken yeni defter almak gerçekten gerekli mi?', 'Yaşa uygun öğrenme görevleri'],
    ['En iyi atık,<br>hiç oluşmayandır.', 'Ekipler gereksiz tüketimi ve tek kullanımlıkları azaltan küçük değişiklikler seçer. Gıda israfı için planlama ve uygun porsiyon üzerinde çalışır.', 'Bir hafta boyunca kantin veya beslenme çantasında önlenebilecek tek kullanımlık bir ürüne alternatif deneyin.', 'Önleme hedefi ve sınıf denemesi'],
    ['Bir nesneye<br>ikinci bir hayat.', 'Yeniden kullanım, güvenli onarım ve gönüllü paylaşım yoluyla ürünlerin kullanım ömrü uzatılır. Yeni ürün satın almak şart değildir.', 'Temiz bir kutuyu sınıf düzenleyicisine dönüştürün veya öğretmen eşliğinde kitap takası düzenleyin.', 'Yeniden kullanım ve paylaşım kaydı'],
    ['Geriye kalanı<br>doğru ayır.', 'Önlenemeyen atık, okulun ve yerel toplama sisteminin kabul ettiği türlere göre ayrılır. Kirli veya tehlikeli atık çocukların görevi değildir.', 'Temiz örnek nesneleri okulunuzdaki kutu etiketleriyle eşleştirin; kabul edilmeyen bir ambalaj için yetişkine danışın.', 'Yerel sisteme uygun ayrıştırma planı'],
    ['Değişimi yeniden<br>ölç, birlikte yorumla.', 'Aynı yöntemle yapılan son ölçüm, başlangıç verisiyle karşılaştırılır. Öğrenci sayısı değiştiğinde öğrenci-gün başına değerler kullanılır.', 'Önceki ve sonraki kağıt atığını aynı sayıda okul gününde ölçün. Farkın nedenlerini sınıfta tartışın.', 'Doğrulanmış ölçüm ve iyileştirme notu'],
    ['İyi alışkanlık<br>okulda kalsın.', 'İşe yarayan uygulamalar okul eylem planına girer; öğretmen ekipleri deneyimi yeni sınıflara ve ailelere aktarır.', 'Bir sonraki dönem için görev sahiplerini ve tekrar ölçüm tarihini belirleyin. Yeni sınıflara kısa bir rehber hazırlayın.', 'Sorumlusu belli okul eylem planı']
  ];
  $$('[data-step]').forEach(button => button.addEventListener('click', () => {
    const index = Number(button.dataset.step);
    $$('[data-step]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    const detail = $('#cycle-detail');
    const step = cycle[index];
    $('.detail-number', detail).textContent = `${String(index + 1).padStart(2, '0')} / 07`;
    $('h3', detail).innerHTML = step[0];
    $(':scope > p', detail).textContent = step[1];
    $('.detail-example p', detail).textContent = step[2];
    $('.detail-output strong', detail).textContent = step[3];
  }));

  const ageContent = {
    younger: ['KEŞFET · DOKUN · DENE', 'Küçük bir görev,<br>somut bir keşif.', 'Görsel hikâyeler, oyunlar, eşleştirme ve kısa gözlemlerle öğrenme. Öğretmen eşliğinde 20–30 dakikalık etkinlikler.', ['Bir nesnenin yeniden kullanımını keşfet.', 'Öğrenmeni bir resim, ürün veya kısa anlatımla göster.', 'Ailene bir küçük görev götür.']],
    older: ['ARAŞTIR · KARŞILAŞTIR · ÖNER', 'Kendi verinle<br>bir çözüm geliştir.', 'Araştırma, veri kaydı, neden–sonuç tartışması ve akran iş birliğiyle öğrenme. Öğretmen eşliğinde 30–45 dakikalık etkinlikler.', ['Okulda bir atık oluşum noktasını araştır.', 'Başlangıç ve son ölçümü aynı yöntemle karşılaştır.', 'Bulgularından yola çıkarak bir okul önerisi hazırla.']]
  };
  const ageTabs = $$('[data-age]');
  function setAge(button) {
    ageTabs.forEach(tab => { tab.setAttribute('aria-selected', String(tab === button)); tab.tabIndex = tab === button ? 0 : -1; });
    const item = ageContent[button.dataset.age];
    const panel = $('#age-panel');
    panel.setAttribute('aria-labelledby', button.id);
    $('.eyebrow', panel).textContent = item[0];
    $('h3', panel).innerHTML = item[1];
    $('p', panel).textContent = item[2];
    $('ul', panel).replaceChildren(...item[3].map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
  }
  ageTabs.forEach((button, index) => {
    button.addEventListener('click', () => setAge(button));
    button.addEventListener('keydown', e => {
      let next;
      if (['ArrowRight', 'ArrowLeft'].includes(e.key)) next = ageTabs[1 - index];
      else if (e.key === 'Home') next = ageTabs[0];
      else if (e.key === 'End') next = ageTabs.at(-1);
      if (next) { e.preventDefault(); setAge(next); next.focus(); }
    });
  });

  const modules = [
    ['İhtiyaç mı, istek mi?', 'Mevcut bir eşyayı yeni bir ürünle değiştirmeden önce ihtiyacı değerlendirme.', 'Çantandaki üç eşyayı seç. Hangisini kullanmaya devam edebilirsin, hangisinin onarılması gerekiyor?'],
    ['Bir ürünün yolculuğu', 'Bir ürünün hammaddeden kullanım sonrasına uzanan kaynak ilişkisini kurma.', 'Bir kağıdın yaşamını dört karede anlat; hangi aşamada daha az kaynak kullanabileceğini işaretle.'],
    ['Tek kullanımlığa alternatif', 'Günlük hayatta tekrar kullanılabilecek seçenekleri tanıma.', 'Evde zaten bulunan bir saklama kabıyla beslenme çantasındaki tek kullanımlık bir malzemeye alternatif dene.'],
    ['Yemeğini planla', 'Uygun porsiyon ve planlama ile yenilebilir gıda israfını önleme.', 'Yetişkin eşliğinde üç öğünde küçük porsiyonla başlamayı dene; gerekirse yeniden al ve kalanları gözlemle.'],
    ['Onar ve ömrünü uzat', 'Eşyanın kullanım ömrünü güvenli bakım ve onarımla uzatma.', 'Bir kitabın yıpranmış kapağını yetişkin desteğiyle sağlamlaştır; kesici ve elektrikli araçları yetişkine bırak.'],
    ['Paylaşım ve takas', 'Gönüllü paylaşım ile kullanılabilir nesnelerin dolaşımını sağlama.', 'Öğretmen eşliğinde, katılmak isteyenlerin getirdiği kitaplar için bir takas günü tasarla.'],
    ['Doğru ayrıştırma', 'Atığı yerel toplama sisteminin kabul ettiği türe göre ayırma.', 'Temiz örnek nesneleri okulun güncel kutu etiketleriyle eşleştir. Emin olmadığında öğretmene danış.'],
    ['Atık dedektifleri', 'Gözlem ve ölçümle atığın oluştuğu noktayı belirleme.', 'Güvenli bir temiz kağıt örneğini yetişkinle tart; aynı günlerin kayıtlarını karşılaştır.'],
    ['Ailemle sıfır atık', 'Okulda öğrenilen bir alışkanlığı evde gönüllü olarak deneme.', 'Ailenle bir tekrar kullanım görevi seç. Fotoğraf veya isim paylaşmadan kısa bir görev kartıyla deneyimini anlat.'],
    ['Okulumun eylem planı', 'Gözlemi ortak bir hedefe, sorumluluğa ve takip tarihine dönüştürme.', 'Sınıfça tek bir iyileştirme seç: Ne yapacağız, kim destekleyecek, ne zaman yeniden ölçeceğiz?']
  ];
  $('#modules').innerHTML = modules.map((m, i) => `<details class="module"><summary><span class="module-id">${String(i + 1).padStart(2, '0')}</span>${m[0]}<span class="plus" aria-hidden="true">+</span></summary><div class="module-body"><p>${m[1]}</p><span>ÖRNEK GÖREV</span><p>${m[2]}</p></div></details>`).join('');

  let scenarioIndex = 0;
  const scenarios = [
    {question: 'Çantandaki matara kullanılabilir durumda. Vitrinde yeni bir matara gördün. İlk kararın ne olur?', choices: ['Önce mevcut mataramı kullanmaya devam ederim.', 'İkisini de kullanırım diye hemen yenisini alırım.'], best: 0, good: 'Evet. Mevcut ürün ihtiyacını karşılıyorsa kullanmaya devam etmek yeni kaynak tüketimini önler.', other: 'Önce ihtiyacı düşünelim. Mevcut matara kullanılabiliyorsa yenisini almadan da ihtiyacını karşılayabilirsin.'},
    {question: 'Öğle yemeğinde ne kadar yiyebileceğinden emin değilsin. Nasıl başlayabilirsin?', choices: ['Tabağımı tamamen doldurur, kalanı bırakırım.', 'Uygun küçük bir porsiyon alır, gerekirse yeniden isterim.'], best: 1, good: 'Bu seçim yenilebilir gıda israfını önlemeye yardımcı olur. Amaç yeterli beslenirken ihtiyacın kadar almak.', other: 'Tabağı baştan doldurmak fazla yemeğin kalmasına yol açabilir. Küçük başlayıp ihtiyacın oldukça yeniden alabilirsin.'},
    {question: 'Temiz bir kutun var; aynı zamanda kalemlerin masanda dağılıyor. Hangi seçeneği deneyebilirsin?', choices: ['Kutuyu güvenli biçimde kalemlik olarak yeniden kullanırım.', 'Kutuyu atar, hemen yeni bir kalemlik alırım.'], best: 0, good: 'Güzel bir yeniden kullanım örneği. Elindeki nesne yeni bir ihtiyacı karşılayarak daha uzun süre kullanılabilir.', other: 'Yeni bir ürün almadan önce elindekine bak. Temiz kutu bir kalemlik olarak iş görebilir.'}
  ];
  function showScenario() {
    const scenario = scenarios[scenarioIndex];
    $('#scenario-count').textContent = `ÖRNEK ${scenarioIndex + 1} / ${scenarios.length}`;
    $('#scenario-question').textContent = scenario.question;
    $('#scenario-feedback').hidden = true;
    $('#scenario-options').replaceChildren(...scenario.choices.map((text, index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'scenario-option';
      button.textContent = text; button.setAttribute('aria-pressed', 'false');
      button.addEventListener('click', () => {
        $$('#scenario-options button').forEach(b => { b.setAttribute('aria-pressed', String(b === button)); b.classList.remove('chosen'); });
        button.classList.add('chosen');
        const feedback = $('#scenario-feedback');
        feedback.textContent = index === scenario.best ? scenario.good : scenario.other;
        feedback.hidden = false;
      });
      return button;
    }));
    $('#scenario-next').innerHTML = scenarioIndex === scenarios.length - 1 ? 'Başa dön <span aria-hidden="true">↺</span>' : 'Sonraki örnek <span aria-hidden="true">→</span>';
  }
  $('#scenario-next').addEventListener('click', () => { scenarioIndex = (scenarioIndex + 1) % scenarios.length; showScenario(); });
  showScenario();

  $('#district-grid').replaceChildren(...districts.map((district, index) => {
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'district-button';
    button.setAttribute('aria-pressed', String(index === 0));
    button.innerHTML = `${district[0]} <span>${district[1]} okul</span>`;
    button.addEventListener('click', () => {
      $$('#district-grid button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
      $('#district-detail h4').textContent = district[0];
      $('#district-detail > strong').innerHTML = `${district[1]} <small>okul</small>`;
      $('#district-detail > p').textContent = district[2];
    });
    return button;
  }));

  const phases = [
    ['AY 01–06', 'Dinle & ölç', 'İhtiyaç analizi, erişilebilirlik taraması ve okullarda başlangıç ölçümü.', 'M3–5 · Başlangıç verisi'],
    ['AY 05–16', 'Birlikte geliştir', 'Ortak öğrenme modülleri, öğretmen eğitimi ve uygulamaya hazırlık.', 'M11–16 · Öğretmen eğitimi'],
    ['AY 16–20', 'İlk döngüyü dene', 'Sınıf ve aile görevleri uygulanır; ara değerlendirmeyle yöntem iyileştirilir.', 'M19–20 · Ara değerlendirme'],
    ['AY 21–26', 'İyileştir & yerleştir', 'İkinci pilot uygulama yürütülür. Okullar kalıcı eylem planlarını tamamlar.', 'M24–26 · Okul eylem planları'],
    ['AY 27–30', 'Etkiyi paylaş', 'Sonuçlar değerlendirilir; uygulama rehberi ve Avrupa buluşmasıyla paylaşılır.', 'M28 · Etki / M29 · Buluşma']
  ];
  $('#timeline').innerHTML = phases.map(p => `<article><span>${p[0]}</span><h3>${p[1]}</h3><p>${p[2]}</p><strong>${p[3]}</strong></article>`).join('');

  function updateMeasurement() {
    const error = $('#measure-error');
    const result = $('#measure-result');
    try {
      const ids = ['before-weight', 'before-days', 'after-weight', 'after-days'];
      const inputs = ids.map(id => $('#' + id));
      if (inputs.some(input => !input.value.trim())) throw new RangeError('Dört alanı da doldurun.');
      const {before, after, change} = calculateImpact(...inputs.map(input => Number(input.value)));
      error.hidden = true; result.hidden = false;
      const rounded = Math.round(change * 10) / 10;
      $('.result-number strong', result).textContent = `%${format.format(Math.abs(rounded))}`;
      $('.result-number span', result).textContent = Math.abs(change) < .000001 ? 'değişim yok' : change > 0 ? 'azalma' : 'artış';
      $('#before-intensity').textContent = `${format.format(before)} g / öğrenci-gün`;
      $('#after-intensity').textContent = `${format.format(after)} g / öğrenci-gün`;
      $('#before-bar').style.width = `${before / Math.max(before, after) * 100}%`;
      $('#after-bar').style.width = `${after / Math.max(before, after) * 100}%`;
      const resultText = change >= 20 - 1e-10 ? 'Bu örnekte %20 azaltım hedefi karşılanıyor.' : change >= 0 ? 'Bu örnekte %20 azaltım hedefi henüz karşılanmıyor.' : 'Bu örnekte öğrenci-gün başına atık artıyor; olası nedenler incelenmeli.';
      $('#measure-comment').textContent = resultText + ' Gerçek proje sonucu değildir.';
    } catch (err) {
      error.textContent = err.message; error.hidden = false; result.hidden = true;
    }
  }
  $('#measurement-form').addEventListener('submit', event => { event.preventDefault(); updateMeasurement(); });
  $('#measurement-form').addEventListener('reset', () => { window.setTimeout(updateMeasurement, 0); });

  if (sessionRead()) enterPresentation(true);
})();
