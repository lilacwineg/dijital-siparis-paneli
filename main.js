// Bu kod, tüm sayfa yüklendiğinde çalışmaya başlar
document.addEventListener("DOMContentLoaded", function() {

  // ===================================================
  // === GLOBAL GRAFİK DEĞİŞKENLERİ ===
  // ===================================================
  let bayiModalAylikChart = null;
  let bayiModalEnCokUrunChart = null;
  let hammaddeModalChart = null;

  // ===================================================
  // === GRAFİK ÇİZME FONKSİYONLARI ===
  // ===================================================

  // Bayi Detay Modalı için Grafik Çizer (BÖLÜM 1)
  function cizBayiModalGrafikleri() {
      if (bayiModalAylikChart) { bayiModalAylikChart.destroy(); }
      if (bayiModalEnCokUrunChart) { bayiModalEnCokUrunChart.destroy(); }

      const aylikCanvas = document.getElementById('bayiModalAylikGrafik');
      const urunCanvas = document.getElementById('bayiModalEnCokUrunGrafik');
      if (aylikCanvas) {
          bayiModalAylikChart = new Chart(aylikCanvas, {
              type: 'line', data: { labels: ["Haz", "Tem", "Ağu", "Eyl", "Eki"], datasets: [{ label: 'Sipariş Sayısı', data: [12, 18, 14, 20, 24], borderColor: 'rgba(124, 58, 237, 1)', backgroundColor: 'rgba(124, 58, 237, 0.1)', tension: 0.3 }] },
              options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } }, plugins: { legend: { display: false, labels: { color: '#A0A0A0' } } } }
          });
      }
      if (urunCanvas) {
          bayiModalEnCokUrunChart = new Chart(urunCanvas, {
              type: 'bar', data: { labels: ["Lavanta", "Papatya", "Vanilya", "Gül"], datasets: [{ label: 'Miktar', data: [150, 90, 75, 50], backgroundColor: 'rgba(59, 130, 246, 0.7)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1 }] },
              options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } }, plugins: { legend: { display: false, labels: { color: '#A0A0A0' } } } }
          });
      }
  }

  // Hammadde Detay Modalı için Grafik Çizer (BÖLÜM 11)
  function cizHammaddeModalGrafik() {
      if (hammaddeModalChart) {
          hammaddeModalChart.destroy();
      }
      const hammaddeCanvas = document.getElementById('modalHammaddeGrafik');
      if (hammaddeCanvas) {
          hammaddeModalChart = new Chart(hammaddeCanvas, {
              type: 'line',
              data: {
                  labels: ["Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas"],
                  datasets: [{
                      label: 'Kullanım Miktarı',
                      data: [80, 100, 90, 110, 100, 120], // Örnek veri
                      borderColor: 'rgba(245, 158, 11, 1)',
                      backgroundColor: 'rgba(245, 158, 11, 0.1)',
                      fill: true,
                      tension: 0.3
                  }]
              },
              options: { 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: { 
                      y: { beginAtZero: true, ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, 
                      x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } 
                  },
                  plugins: { legend: { display: false } } 
              }
          });
      }
  }

  // ===================================================
  // === BÖLÜM 1: BAYİ DETAY MODALI (bayi-yonetimi.html) ===
  // ===================================================
  const bayiModal = document.getElementById('bayi-detay-modal');
  if (bayiModal) {
    const modalKapatBtn = document.getElementById('modal-kapat-btn');
    const detayButonlari = document.querySelectorAll('#bayi-tablosu .btn-detay[data-adi]'); 
    const modalBayiAdi = document.getElementById('modal-bayi-adi');
    const modalBayiSehir = document.getElementById('modal-bayi-sehir');
    const modalBayiIletisim = document.getElementById('modal-bayi-iletisim');
    const modalBayiHacim = document.getElementById('modal-bayi-hacim'); 
    
    // Düzenle/Sil Butonları ve Form Alanı
    const duzenleAnaButonlar = document.getElementById('duzenle-ana-butonlar');
    const duzenleAcBtn = document.getElementById('duzenle-form-ac-btn');
    const bayiSilBtn = document.getElementById('bayi-sil-btn'); 
    
    const duzenleFormAlani = document.getElementById('duzenle-form-alani');
    const duzenleIptalBtn = document.getElementById('duzenle-iptal-btn');
    const bayiDuzenlemeFormu = document.getElementById('bayi-duzenleme-formu');
    
    const inputAdi = document.getElementById('duzenle-adi');
    const inputSehir = document.getElementById('duzenle-sehir');
    const inputIletisim = document.getElementById('duzenle-iletisim');
    const inputAdres = document.getElementById('duzenle-adres');

    function modalAc (event) {
      const tiklananButon = event.currentTarget;
      const adi = tiklananButon.dataset.adi; const sehir = tiklananButon.dataset.sehir; const iletisim = tiklananButon.dataset.iletisim; const hacim = tiklananButon.dataset.hacim;
      modalBayiAdi.textContent = "Bayi Detayları - " + adi; modalBayiSehir.textContent = "Şehir: " + sehir; modalBayiIletisim.textContent = "İletişim: " + iletisim; modalBayiHacim.textContent = "Sipariş Hacmi: " + hacim;
      
      inputAdi.value = adi; 
      inputSehir.value = sehir; 
      inputIletisim.value = iletisim; 
      inputAdres.value = ""; 
      
      duzenleFormAlani.style.display = 'none'; 
      if(duzenleAnaButonlar) {
        duzenleAnaButonlar.style.display = 'flex'; 
      }
      
      bayiModal.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('aktif'));
      bayiModal.querySelector('.tab-button[data-target="tab-siparis-gecmisi"]').classList.add('aktif');
      bayiModal.querySelectorAll('.tab-content').forEach(content => content.classList.remove('aktif'));
      document.getElementById('tab-siparis-gecmisi').classList.add('aktif');
      
      bayiModal.style.display = 'flex';
    }
    
    if(duzenleAcBtn) {
      duzenleAcBtn.addEventListener('click', function() { 
        duzenleFormAlani.style.display = 'block'; 
        duzenleAnaButonlar.style.display = 'none'; 
      });
    }

    if(duzenleIptalBtn) {
      duzenleIptalBtn.addEventListener('click', function() { 
        duzenleFormAlani.style.display = 'none'; 
        duzenleAnaButonlar.style.display = 'flex'; 
      });
    }
    
    if(bayiDuzenlemeFormu) {
      bayiDuzenlemeFormu.addEventListener('submit', function(event) { 
        event.preventDefault(); 
        const kaydedilenAd = inputAdi.value; 
        alert(`Bayi (${kaydedilenAd}) bilgileri güncellendi! (Simülasyon)`); 
        
        duzenleFormAlani.style.display = 'none'; 
        duzenleAnaButonlar.style.display = 'flex';
      });
    }
    
    if(bayiSilBtn) {
      bayiSilBtn.addEventListener('click', function() {
          const adi = modalBayiAdi.textContent.split(' - ')[1] || "Bu Bayi";
          if (confirm(`${adi} bayisini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
              alert(`${adi} bayisi silindi. (Simülasyon)`);
              bayiModal.style.display = 'none';
          }
      });
    }

    detayButonlari.forEach(function(buton) { buton.addEventListener('click', modalAc); });
    modalKapatBtn.addEventListener('click', function() { bayiModal.style.display = 'none'; });
  }

  // ===================================================
  // === BÖLÜM 1.5: YENİ BAYİ MODALI - KALDIRILDI ===
  // === Bu bölüm bayi.js'de gerçek backend entegrasyonu ile yönetiliyor ===
  // ===================================================

  // ===================================================
  // === BÖLÜM 2: FABRİKA DASHBOARD GRAFİKLERİ (panel-fabrika.html) ===
  // ===================================================
  const sehirGrafikTuvali = document.getElementById('sehirBazliGrafik');
  if (sehirGrafikTuvali) {
    const sehirVerisi = {labels: ["İstanbul", "Ankara", "İzmir", "Antalya"],datasets: [{label: 'Sipariş Sayısı', data: [160, 100, 85, 70],backgroundColor: ['rgba(124, 58, 237, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(16, 185, 129, 0.6)'],borderColor: ['rgba(124, 58, 237, 1)', 'rgba(59, 130, 246, 1)', 'rgba(245, 158, 11, 1)', 'rgba(16, 185, 129, 1)'],borderWidth: 1}]};
    new Chart(sehirGrafikTuvali, { type: 'bar', data: sehirVerisi, options: { scales: { y: { beginAtZero: true, ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } }, plugins: { legend: { labels: { color: '#A0A0A0' } } } } });
  }
  const aylikSatisTuvali = document.getElementById('aylikSatisGrafik');
  if (aylikSatisTuvali) {
    const aylikVeri = {labels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz"],datasets: [{ label: 'Gül Parfümü', data: [120, 135, 150, 145, 160, 175], borderColor: 'rgba(124, 58, 237, 1)', backgroundColor: 'rgba(124, 58, 237, 0.1)', fill: true, tension: 0.3 },{ label: 'Lavanta', data: [90, 95, 110, 105, 120, 130], borderColor: 'rgba(59, 130, 246, 1)', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.3 },{ label: 'Vanilya', data: [75, 80, 85, 90, 95, 100], borderColor: 'rgba(16, 185, 129, 1)', backgroundColor: 'rgba(16, 185, 129, 0.1)', fill: true, tension: 0.3 }]};
    new Chart(aylikSatisTuvali, { type: 'line', data: aylikVeri, options: { scales: { y: { beginAtZero: true, ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } }, plugins: { legend: { labels: { color: '#A0A0A0' } } } } });
  }
  const sevkiyatDurumTuvali = document.getElementById('sevkiyatDurumGrafik');
  if (sevkiyatDurumTuvali) {
    const sevkiyatVerisi = {labels: ["Teslim Edildi", "Sevkiyatta", "Hazırlanıyor", "Beklemede"],datasets: [{label: 'Sipariş Durumu', data: [420, 85, 45, 28],backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(107, 114, 128, 0.6)'],borderColor: ['rgba(16, 185, 129, 1)', 'rgba(59, 130, 246, 1)', 'rgba(245, 158, 11, 1)', 'rgba(107, 114, 128, 1)'],borderWidth: 1}]};
    new Chart(sevkiyatDurumTuvali, { type: 'doughnut', data: sevkiyatVerisi, options: { plugins: { legend: { position: 'top', labels: { color: '#A0A0A0' } } } } });
  }
  const bayiAktiviteTuvali = document.getElementById('bayiAktiviteGrafik');
  if (bayiAktiviteTuvali) {
    const bayiVerisi = {labels: ["Bayi A", "Bayi B", "Bayi C", "Bayi D", "Bayi E"],datasets: [{label: 'Siparişler', data: [45, 38, 32, 28, 25],backgroundColor: 'rgba(16, 185, 129, 0.6)', borderColor: 'rgba(16, 185, 129, 1)', borderWidth: 1}]};
    new Chart(bayiAktiviteTuvali, { type: 'bar', data: bayiVerisi, options: { indexAxis: 'y', scales: { y: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } }, plugins: { legend: { display: false } } } });
  }
  
  // ===================================================
  // === BÖLÜM 3: SİPARİŞ YÖNETİMİ GRAFİKLERİ (siparis-yonetimi.html) ===
  // ===================================================
  const siparisTrendTuvali = document.getElementById('siparisTrendGrafik');
  if (siparisTrendTuvali) {
    const trendVerisi = {labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],datasets: [{label: 'Siparişler', data: [12, 15, 18, 14, 20, 8, 5],borderColor: 'rgba(124, 58, 237, 1)', backgroundColor: 'rgba(124, 58, 237, 0.1)', fill: true, tension: 0.3}]};
    
    new Chart(siparisTrendTuvali, { 
      type: 'line', 
      data: trendVerisi, 
      options: { // TEK BAŞLANGIÇ NOKTASI BURASI
        responsive: true, 
        maintainAspectRatio: false,
        scales: { 
          y: { beginAtZero: true, min: 0, max: 30, ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, 
          x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } 
        }, 
        plugins: { 
          legend: { labels: { color: '#A0A0A0' } } 
        } 
      } // TEK BİTİŞ NOKTASI BURASI
    });
  }

  
  const siparisDurumTuvali = document.getElementById('siparisDurumGrafik');
  if (siparisDurumTuvali) {
    const durumVerisi = {labels: ["Tamamlandı", "Üretimde", "Sevkiyatta", "Onay Bekliyor", "İptal"],datasets: [{label: 'Sipariş Durumu', data: [420, 85, 45, 28, 12],backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(107, 114, 128, 0.6)', 'rgba(239, 68, 68, 0.6)'],borderColor: ['rgba(16, 185, 129, 1)', 'rgba(59, 130, 246, 1)', 'rgba(245, 158, 11, 1)', 'rgba(107, 114, 128, 1)', 'rgba(239, 68, 68, 1)'],borderWidth: 1}]};
    new Chart(siparisDurumTuvali, { type: 'pie', data: durumVerisi, options: { plugins: { legend: { position: 'top', labels: { color: '#A0A0A0' } } } } });
  }

  
  // ===================================================
  // === BÖLÜM 4: HAMMADDE YÖNETİMİ GRAFİKLERİ (hammadde-yonetimi.html) ===
  // ===================================================
  const hammaddeKullanimTuvali = document.getElementById('hammadeKullanimGrafik');
  if (hammaddeKullanimTuvali) {
    const kullanimVerisi = {labels: ["May", "Haz", "Tem", "Ağu", "Eyl", "Eki"],datasets: [{ label: 'Gül Özü', data: [120, 135, 150, 145, 160, 175], borderColor: 'rgba(124, 58, 237, 1)', tension: 0.3 },{ label: 'Lavanta', data: [90, 95, 110, 105, 120, 130], borderColor: 'rgba(59, 130, 246, 1)', tension: 0.3 },{ label: 'Vanilya', data: [75, 80, 85, 90, 95, 100], borderColor: 'rgba(16, 185, 129, 1)', tension: 0.3 },{ label: 'Alkol', data: [200, 215, 230, 220, 240, 255], borderColor: 'rgba(245, 158, 11, 1)', tension: 0.3 }]};
    new Chart(hammaddeKullanimTuvali, { type: 'line', data: kullanimVerisi, options: { scales: { y: { beginAtZero: true, ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } }, plugins: { legend: { labels: { color: '#A0A0A0' } } } } });
  }
  const kritikStokTuvali = document.getElementById('kritikStokGrafik');
  if (kritikStokTuvali) {
    const kritikStokVerisi = {labels: ["Normal", "Yakın", "Kritik"],datasets: [{label: 'Stok Durumu', data: [3, 1, 2],backgroundColor: ['rgba(16, 185, 129, 0.6)', 'rgba(245, 158, 11, 0.6)', 'rgba(239, 68, 68, 0.6)'],borderColor: ['rgba(16, 185, 129, 1)', 'rgba(245, 158, 11, 1)', 'rgba(239, 68, 68, 1)'],borderWidth: 1}]};
    new Chart(kritikStokTuvali, { type: 'doughnut', data: kritikStokVerisi, options: { plugins: { legend: { position: 'top', labels: { color: '#A0A0A0' } } } } });
  }


  // ===================================================
  // === BÖLÜM 6: BAYİ ANA SAYFA GRAFİKLERİ (bayi-anasayfa.html) ===
  // ===================================================
  const bayiHaftalikTuvali = document.getElementById('bayiHaftalikGrafik');
  if (bayiHaftalikTuvali) {
    const haftalikVeri = {labels: ["Hf 1", "Hf 2", "Hf 3", "Hf 4"],datasets: [{label: 'Sipariş', data: [8, 12, 15, 10],borderColor: 'rgba(124, 58, 237, 1)', backgroundColor: 'rgba(124, 58, 237, 0.1)', fill: true, tension: 0.3}]};
    new Chart(bayiHaftalikTuvali, { type: 'line', data: haftalikVeri, options: { scales: { y: { beginAtZero: true, ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } }, plugins: { legend: { labels: { color: '#A0A0A0' } } } } });
  }
  const bayiEnCokUrunTuvali = document.getElementById('bayiEnCokUrunGrafik');
  if (bayiEnCokUrunTuvali) {
    const enCokUrunVerisi = {labels: ["Gül Parfümü", "Lavanta", "Vanilya", "Papatya"],datasets: [{label: 'Sipariş Sayısı', data: [25, 18, 12, 8],backgroundColor: 'rgba(59, 130, 246, 0.6)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1}]};
    new Chart(bayiEnCokUrunTuvali, { type: 'bar', data: enCokUrunVerisi, options: { scales: { y: { beginAtZero: true, ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } }, plugins: { legend: { labels: { color: '#A0A0A0' } } } } });
  }
  const bayiKategoriTuvali = document.getElementById('bayiKategoriGrafik');
  if (bayiKategoriTuvali) {
    const kategoriVerisi = {labels: ["Parfüm", "Esans", "Koku"],datasets: [{label: 'Kategori Dağılımı', data: [45, 30, 25],backgroundColor: ['rgba(124, 58, 237, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(16, 185, 129, 0.6)'],borderColor: ['rgba(124, 58, 237, 1)', 'rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)'],borderWidth: 1}]};
    new Chart(bayiKategoriTuvali, { type: 'pie', data: kategoriVerisi, options: { plugins: { legend: { position: 'top', labels: { color: '#A0A0A0' } } } } });
  }

  // ===================================================
  // === BÖLÜM 7: BAYİ TRENDLER GRAFİKLERİ (bayi-trendler.html) ===
  // ===================================================
  const trendAylikTuvali = document.getElementById('trendAylikGrafik');
  if (trendAylikTuvali) {
    const trendAylikVeri = {labels: ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki"],datasets: [{ label: 'Sipariş Sayısı', data: [8, 10, 12, 11, 14, 16, 15, 18, 20, 21], borderColor: 'rgba(124, 58, 237, 1)', yAxisID: 'y', tension: 0.3 },{ label: 'Toplam Gelir (₺)', data: [68000, 85000, 102000, 93500, 119000, 136000, 127500, 153000, 170000, 178500], borderColor: 'rgba(16, 185, 129, 1)', yAxisID: 'y1', tension: 0.3 }]};
    new Chart(trendAylikTuvali, {type: 'line', data: trendAylikVeri,options: { scales: { y: { type: 'linear', display: true, position: 'left', ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, y1: { type: 'linear', display: true, position: 'right', ticks: { color: '#A0A0A0' }, grid: { drawOnChartArea: false } }, x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } }, plugins: { legend: { labels: { color: '#A0A0A0' } } } }});
  }
  const trendEnCokUrunTuvali = document.getElementById('trendEnCokUrunGrafik');
  if (trendEnCokUrunTuvali) {
    const trendEnCokUrunVerisi = {labels: ["Gül P.", "Lavanta E.", "Vanilya K.", "Papatya Ö.", "Yasemin A."],datasets: [{ label: 'Sipariş Sayısı', data: [45, 38, 32, 28, 25], backgroundColor: 'rgba(59, 130, 246, 0.6)', borderColor: 'rgba(59, 130, 246, 1)', borderWidth: 1 }]};
    new Chart(trendEnCokUrunTuvali, { type: 'bar', data: trendEnCokUrunVerisi, options: { scales: { y: { beginAtZero: true, ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } }, plugins: { legend: { labels: { color: '#A0A0A0' } } } } });
  }
  const trendGelirDagilimTuvali = document.getElementById('trendGelirDagilimGrafik');
  if (trendGelirDagilimTuvali) {
    const trendGelirDagilimVerisi = {labels: ["Gül P.", "Lavanta E.", "Vanilya K.", "Papatya Ö.", "Yasemin A."],datasets: [{ label: 'Toplam Gelir (₺)', data: [38250, 27360, 21760, 16520, 23000], backgroundColor: 'rgba(16, 185, 129, 0.6)', borderColor: 'rgba(16, 185, 129, 1)', borderWidth: 1 }]};
    new Chart(trendGelirDagilimTuvali, { type: 'bar', data: trendGelirDagilimVerisi, options: { scales: { y: { beginAtZero: true, ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } }, plugins: { legend: { labels: { color: '#A0A0A0' } } } } });
  }
  const trendKategoriTuvali = document.getElementById('trendKategoriGrafik');
  if (trendKategoriTuvali) {
    const trendKategoriVerisi = {labels: ["Parfüm", "Esans", "Koku"],datasets: [{ label: 'Kategori Dağılımı', data: [45, 30, 25], backgroundColor: ['rgba(124, 58, 237, 0.6)', 'rgba(59, 130, 246, 0.6)', 'rgba(16, 185, 129, 0.6)'], borderColor: ['rgba(124, 58, 237, 1)', 'rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)'], borderWidth: 1 }]};
    new Chart(trendKategoriTuvali, { type: 'pie', data: trendKategoriVerisi, options: { plugins: { legend: { position: 'top', labels: { color: '#A0A0A0' } } } } });
  }
  const trendHaftalikTuvali = document.getElementById('trendHaftalikGrafik');
  if (trendHaftalikTuvali) {
    const trendHaftalikVerisi = {labels: ["1. Hafta", "2. Hafta", "3. Hafta", "4. Hafta"],datasets: [{ label: 'Sipariş Sayısı', data: [4, 6, 5, 6], backgroundColor: 'rgba(124, 58, 237, 0.6)', borderColor: 'rgba(124, 58, 237, 1)', borderWidth: 1 }]};
    new Chart(trendHaftalikTuvali, { type: 'bar', data: trendHaftalikVerisi, options: { scales: { y: { beginAtZero: true, ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } }, x: { ticks: { color: '#A0A0A0' }, grid: { color: '#27273A' } } }, plugins: { legend: { labels: { color: '#A0A0A0' } } } } });
  }
  
  // ===================================================
  // === BÖLÜM 8: SEKME (TAB) KONTROL KODLARI (TEK YERDE) ===
  // ===================================================
  const tabLists = document.querySelectorAll('.tab-list');
  tabLists.forEach(function(tabList) {
    const tabButtons = tabList.querySelectorAll('.tab-button');
    tabButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        tabButtons.forEach(btn => btn.classList.remove('aktif'));
        button.classList.add('aktif');
        const targetId = button.dataset.target;
        const parentContainer = button.closest('.tablo-container') || button.closest('.main-content') || button.closest('.modal-govde');
        
        if(parentContainer){
          parentContainer.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('aktif');
          });
        }
        
        const targetContent = document.getElementById(targetId);
        if (targetContent) {
          targetContent.classList.add('aktif');
        }
        
        // Modal içi grafiklerin sadece o sekme tıklandığında çizilmesi için
        if (targetId === 'tab-trendler') {
            if (typeof cizBayiModalGrafikleri === 'function') {
                setTimeout(cizBayiModalGrafikleri, 50); 
            }
        }
      });
    });
  });

  
  // ===================================================
  // === BÖLÜM 9: SİPARİŞ DETAY MODALI (siparis-yonetimi.html) ===
  // ===================================================
  const siparisModal = document.getElementById('siparis-detay-modal');
  if (siparisModal) {
    const siparisKapatBtn = document.getElementById('modal-kapat-btn-siparis');
    const siparisDetayButonlari = document.querySelectorAll('#siparis-tablosu .btn-detay'); 
    const modalSiparisId = document.getElementById('modal-siparis-id');
    const modalSiparisBayi = document.getElementById('modal-siparis-bayi');
    const modalSiparisTarih = document.getElementById('modal-siparis-tarih');
    const modalSiparisUrun = document.getElementById('modal-siparis-urun');
    const modalSiparisMiktar = document.getElementById('modal-siparis-miktar');
    const modalSiparisBadge = document.getElementById('modal-siparis-durum-badge');
    const modalSiparisSelect = document.getElementById('durum-guncelle');
    const modalKaydetBtn = document.getElementById('modal-kaydet-btn-siparis');
    const modalSiparisTeslim = document.getElementById('modal-siparis-teslim'); 
    
    const modalIptalEtBtn = document.getElementById('modal-iptal-et-btn');
    const iptalNedeniModal = document.getElementById('iptal-nedeni-modal');
    const iptalKapatBtn = document.getElementById('modal-kapat-btn-iptal');
    const iptalVazgecBtn = document.getElementById('modal-vazgec-btn-iptal');
    const iptalFormu = document.getElementById('iptal-formu');

    function siparisModalAc(event) {
      const tiklananButon = event.currentTarget;
      const id = tiklananButon.dataset.id;
      const bayi = tiklananButon.dataset.bayi;
      const urun = tiklananButon.dataset.urun;
      const miktar = tiklananButon.dataset.miktar;
      const durum = tiklananButon.dataset.durum;
      const tarih = tiklananButon.dataset.tarih;
      const teslim = tiklananButon.dataset.teslim; 

      modalSiparisId.textContent = "Sipariş Detayları - " + id;
      modalSiparisBayi.textContent = bayi;
      modalSiparisTarih.textContent = tarih;
      modalSiparisUrun.textContent = urun;
      modalSiparisMiktar.textContent = miktar + " adet";
      modalSiparisTeslim.textContent = teslim; 
      
      modalSiparisBadge.textContent = durum;
      modalSiparisBadge.className = "badge"; 
      
      if(durum === "Onay Bekliyor" || durum === "Üretimde") {
          modalIptalEtBtn.style.display = "block";
      } else {
          modalIptalEtBtn.style.display = "none";
      }
      
      if(durum === "Onay Bekliyor") modalSiparisBadge.classList.add("onay-bekliyor");
      else if(durum === "Üretimde") modalSiparisBadge.classList.add("uretimde");
      else if(durum === "Sevkiyatta") modalSiparisBadge.classList.add("sevkiyatta");
      else if(durum === "Tamamlandı") modalSiparisBadge.classList.add("tamamlandi");
      else if(durum === "İptal") modalSiparisBadge.classList.add("iptal");
      
      modalSiparisSelect.value = durum;
      siparisModal.style.display = 'flex';
    }
    function siparisModalKapat() {
      siparisModal.style.display = 'none';
    }
    
    function iptalModalAc() {
      iptalNedeniModal.style.display = 'flex';
    }
    function iptalModalKapat() {
      iptalNedeniModal.style.display = 'none';
    }

    siparisDetayButonlari.forEach(function(buton) {
      buton.addEventListener('click', siparisModalAc);
    });
    siparisKapatBtn.addEventListener('click', siparisModalKapat);
    
    modalIptalEtBtn.addEventListener('click', iptalModalAc);
    iptalKapatBtn.addEventListener('click', iptalModalKapat);
    iptalVazgecBtn.addEventListener('click', iptalModalKapat);
    
    iptalFormu.addEventListener('submit', function(event) {
        event.preventDefault();
        alert('Sipariş iptal edildi ve sunucuya bildirildi!');
        iptalFormu.reset();
        iptalModalKapat();
        siparisModalKapat(); 
    });

    modalKaydetBtn.addEventListener('click', function() {
        const yeniDurum = modalSiparisSelect.value;
        const siparisID = modalSiparisId.textContent.split(' - ')[1]; 
        
        alert(`Sipariş (${siparisID}) durumu "${yeniDurum}" olarak güncellendi ve sunucuya gönderildi!`);
        siparisModalKapat();
    });
  }

  // ===================================================
  // === BÖLÜM 10: YENİ HAMMADDE MODALI (hammadde-yonetimi.html) ===
  // ===================================================
  // === BÖLÜM 10: YENİ HAMMADDE MODALI - KALDIRILDI ===
  // === Bu bölüm hammadde.js'de gerçek backend entegrasyonu ile yönetiliyor ===
  // ===================================================

  // ===================================================
  // === BÖLÜM 11: HAMMADDE DETAY MODALI (hammadde-yonetimi.html) ===
  // ===================================================
  const hammaddeDetayModal = document.getElementById('hammadde-detay-modal');
  
  if (hammaddeDetayModal) {
    const hammaddeKapatBtn = document.getElementById('modal-kapat-btn-hammadde-detay');
    const hammaddeKapatBtn2 = document.getElementById('modal-kapat-btn-hammadde-detay-2');
    const hammaddeDetayButonlari = document.querySelectorAll('#hammadde-tablosu .btn-detay'); 
    
    const modalHammaddeAdi = document.getElementById('modal-hammadde-adi');
    const modalHammaddeStok = document.getElementById('modal-hammadde-stok');
    const modalHammaddeKritik = document.getElementById('modal-hammadde-kritik');
    const modalHammaddeTarih = document.getElementById('modal-hammadde-tarih');
    const modalHammaddeBadge = document.getElementById('modal-hammadde-durum-badge');
    const modalHammaddeUyari = document.getElementById('modal-hammadde-uyari');
    const modalHammaddeBitmeSuresi = document.getElementById('modal-hammadde-bitme-suresi');
    const siparisVerBtn = document.getElementById('modal-hammadde-siparis-ver-btn');
    const silBtn = document.getElementById('modal-hammadde-sil-btn'); // YENİ BUTONU AL

    function hammaddeModalAc(event) {
      const tiklananButon = event.currentTarget;
      const adi = tiklananButon.dataset.adi;
      const stok = tiklananButon.dataset.stok;
      const kritik = tiklananButon.dataset.kritik;
      const durum = tiklananButon.dataset.durum;
      const tarih = tiklananButon.dataset.tarih;

      modalHammaddeAdi.textContent = "Hammadde Detayları - " + adi;
      modalHammaddeStok.textContent = stok;
      modalHammaddeKritik.textContent = kritik;
      modalHammaddeTarih.textContent = tarih;
      
      modalHammaddeBadge.textContent = durum;
      modalHammaddeBadge.className = "badge";
      if(durum === "Normal") {
          modalHammaddeBadge.classList.add("tamamlandi");
          modalHammaddeUyari.style.display = "none";
      } else if(durum === "Yakın") {
          modalHammaddeBadge.classList.add("onay-bekliyor");
          modalHammaddeUyari.style.display = "block";
      } else if(durum === "Kritik") {
          modalHammaddeBadge.classList.add("gecikmis");
          modalHammaddeUyari.style.display = "block";
      }
      
      modalHammaddeBitmeSuresi.textContent = "14 gün (mevcut tüketim hızına göre)";
      hammaddeDetayModal.style.display = 'flex';
      setTimeout(cizHammaddeModalGrafik, 50);
    }

    function hammaddeModalKapat() {
      hammaddeDetayModal.style.display = 'none';
    }

    hammaddeDetayButonlari.forEach(function(buton) {
      buton.addEventListener('click', hammaddeModalAc);
    });

    hammaddeKapatBtn.addEventListener('click', hammaddeModalKapat);
    hammaddeKapatBtn2.addEventListener('click', hammaddeModalKapat); 
    
    // Sipariş Ver Butonu
    siparisVerBtn.addEventListener('click', function() {
        const hammaddeAdi = modalHammaddeAdi.textContent.split(' - ')[1] || "Seçilen Hammadde";
        alert(`${hammaddeAdi} için tedarik siparişi oluşturuldu! (Simülasyon)`);
        hammaddeModalKapat();
    });
    
    // YENİ: Sil Butonu
    if (silBtn) { // Butonun varlığını kontrol et
      silBtn.addEventListener('click', function() {
          const hammaddeAdi = modalHammaddeAdi.textContent.split(' - ')[1] || "Seçilen Hammadde";
          if (confirm(`${hammaddeAdi} hammaddesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`)) {
              alert(`${hammaddeAdi} silindi. (Simülasyon)`);
              hammaddeModalKapat();
          }
      });
    }
  }


  // ===================================================
  // === BÖLÜM 12: YENİ FATURA MODALI (finans-yonetimi.html) ===
  // ===================================================
  const yeniFaturaBtn = document.getElementById('yeni-fatura-btn');
  const yeniFaturaModal = document.getElementById('yeni-fatura-modal');
  
  if (yeniFaturaBtn) {
    const yeniFaturaKapatBtn = document.getElementById('modal-kapat-btn-yeni-fatura');
    const yeniFaturaIptalBtn = document.getElementById('modal-iptal-btn-yeni-fatura');
    const yeniFaturaFormu = document.getElementById('yeni-fatura-formu');

    yeniFaturaBtn.addEventListener('click', function() {
      yeniFaturaModal.style.display = 'flex';
    });
    yeniFaturaKapatBtn.addEventListener('click', function() {
      yeniFaturaModal.style.display = 'none';
    });
    yeniFaturaIptalBtn.addEventListener('click', function() {
      yeniFaturaModal.style.display = 'none';
    });

    if (yeniFaturaFormu) {
      yeniFaturaFormu.addEventListener('submit', function(event) {
        event.preventDefault(); 
        alert('Yeni Fatura verileri başarıyla sunucuya (Backend/Yusuf) gönderildi ve kaydedildi.');
        yeniFaturaFormu.reset(); 
        yeniFaturaModal.style.display = 'none';
      });
    }
  }


  // ===================================================
  // === BÖLÜM 13: FATURA DETAY MODALI (finans-yonetimi.html) ===
  // ===================================================
  const faturaDetayModal = document.getElementById('fatura-detay-modal');
  
  if (faturaDetayModal) {
    const faturaDetayButonlari = document.querySelectorAll('#fatura-tablosu .btn-detay'); 
    const faturaKapatBtn = document.getElementById('modal-kapat-btn-fatura');
    const faturaKapatBtn2 = document.getElementById('modal-kapat-btn-fatura-2');
    const faturaIndirBtn = faturaDetayModal.querySelector('.btn-rapor'); 
    
    const modalFaturaId = document.getElementById('modal-fatura-id');
    const modalFaturaBayi = document.getElementById('modal-fatura-bayi');
    const modalFaturaSehir = document.getElementById('modal-fatura-sehir');
    const modalFaturaTutar = document.getElementById('modal-fatura-tutar');
    const modalFaturaTarih = document.getElementById('modal-fatura-tarih');
    const modalFaturaBadge = document.getElementById('modal-fatura-durum-badge');
    
    function faturaModalAc(event) {
      const tiklananButon = event.currentTarget;
      
      const id = tiklananButon.dataset.id;
      const bayi = tiklananButon.dataset.bayi;
      const sehir = tiklananButon.dataset.sehir;
      const tutar = tiklananButon.dataset.tutar;
      const durum = tiklananButon.dataset.durum;
      const tarih = tiklananButon.dataset.tarih;

      modalFaturaId.textContent = "Fatura Detayları - " + id;
      modalFaturaBayi.textContent = bayi;
      modalFaturaSehir.textContent = sehir;
      modalFaturaTutar.textContent = tutar;
      modalFaturaTarih.textContent = tarih;
      
      modalFaturaBadge.textContent = durum;
      modalFaturaBadge.className = "badge"; 
      if(durum === "Ödendi") modalFaturaBadge.classList.add("tamamlandi");
      else if(durum === "Bekliyor") modalFaturaBadge.classList.add("onay-bekliyor");
      else if(durum === "Gecikmiş") modalFaturaBadge.classList.add("gecikmis");

      faturaDetayModal.style.display = 'flex';
    }

    function faturaModalKapat() {
      faturaDetayModal.style.display = 'none';
    }

    faturaDetayButonlari.forEach(function(buton) {
      buton.addEventListener('click', faturaModalAc);
    });

    faturaKapatBtn.addEventListener('click', faturaModalKapat);
    faturaKapatBtn2.addEventListener('click', faturaModalKapat); 
    
    faturaIndirBtn.addEventListener('click', function() {
        const faturaID = modalFaturaId.textContent.split(' - ')[1];
        alert(`${faturaID} numaralı fatura indiriliyor... (Simülasyon)`);
    });
  }


  // ===================================================
  // === BÖLÜM 14: SİPARİŞ FİLTRELEME (siparis-yonetimi.html) ===
  // ===================================================
  const siparisYonetimiTablo = document.getElementById('siparis-tablosu');
  
  if (siparisYonetimiTablo) {
    const filtreButtons = document.querySelectorAll('.filtre-grubu .filtre');
    const aramaInput = siparisYonetimiTablo.closest('.tablo-container').querySelector('.arama-kutusu input');
    const tabloSatirlari = siparisYonetimiTablo.querySelectorAll('tbody tr');
    
    let aktifFiltre = 'Tümü';
    let aramaTerimi = '';

    function filtreUygula() {
      const terim = aramaTerimi.toLowerCase();
      tabloSatirlari.forEach(satir => {
        const durumBadge = satir.querySelector('.badge').textContent.trim();
        const siparisNo = satir.cells[0].textContent.toLowerCase();
        const bayiAdi = satir.cells[1].textContent.toLowerCase();
        const durumEslesiyor = aktifFiltre === 'Tümü' || aktifFiltre.includes(durumBadge);
        const aramaEslesiyor = siparisNo.includes(terim) || bayiAdi.includes(terim);
        
        if (durumEslesiyor && aramaEslesiyor) {
          satir.style.display = ''; 
        } else {
          satir.style.display = 'none';
        }
      });
    }

    filtreButtons.forEach(button => {
      button.addEventListener('click', function() {
        let yeniFiltre = this.textContent.trim().replace(/^(🟡|🔵|🟠|🟢|🔴)\s+/, ''); 
        if (yeniFiltre === 'Tümü') {
          aktifFiltre = 'Tümü';
        } else {
          aktifFiltre = yeniFiltre;
        }

        filtreButtons.forEach(btn => btn.classList.remove('aktif'));
        this.classList.add('aktif');
        
        filtreUygula();
      });
    });

    aramaInput.addEventListener('input', function() {
      aramaTerimi = this.value;
      filtreUygula();
    });
    
    filtreUygula();
  }


  // ===================================================
  // === BÖLÜM 15: CANLI SEPET HESAPLAMA (bayi-siparis-ver.html) ===
  // ===================================================
  const siparisVerKarti = document.querySelector('.urun-secim-karti'); // Sayfa kontrolü için
  
  if (siparisVerKarti) {
    const urunSelect = document.getElementById('urun-sec');
    const miktarInput = document.getElementById('urun-miktar');
    const sepeteEkleBtn = document.getElementById('sepete-ekle-btn');
    const sepetListesi = document.getElementById('sepet-listesi');
    const ozetUrunSayisi = document.getElementById('ozet-urun-sayisi');
    const ozetToplamAdet = document.getElementById('ozet-toplam-adet');
    const ozetToplamTutar = document.getElementById('ozet-toplam-tutar');
    const siparisOnaylaBtn = document.getElementById('siparis-onayla-btn');
    const urunSecBtnler = document.querySelectorAll('.urun-sec-btn'); 

    let sepetUrunleri = [];

    // Sayfa yüklendiğinde katalogdan gelen ürünü kontrol et
    const preSelectedProduct = localStorage.getItem('selectedProduct');
    if (preSelectedProduct) {
      urunSelect.value = preSelectedProduct; 
      miktarInput.value = 1; 
      localStorage.removeItem('selectedProduct'); // Hafızayı temizle
      
      // Gecikmeli olarak sepeteEkle'yi çağır
      setTimeout(sepeteEkle, 100); 
    }

    function sepetiGuncelle() {
      let toplamUrunSayisi = sepetUrunleri.length;
      let toplamAdet = sepetUrunleri.reduce((sum, item) => sum + item.quantity, 0);
      let toplamTutar = sepetUrunleri.reduce((sum, item) => sum + item.totalPrice, 0);

      ozetUrunSayisi.textContent = toplamUrunSayisi;
      ozetToplamAdet.textContent = toplamAdet;
      ozetToplamTutar.textContent = '₺' + toplamTutar.toLocaleString('tr-TR');

      sepetListesi.innerHTML = ''; 

      if (toplamUrunSayisi === 0) {
        sepetListesi.innerHTML = '<p class="text-center text-gray-500" id="sepet-bos-uyari" style="font-size: 14px; margin-top: 20px;">Sepetiniz henüz boş.</p>';
        siparisOnaylaBtn.disabled = true;
      } else {
        siparisOnaylaBtn.disabled = false;
        sepetUrunleri.forEach(item => {
          const sepetItem = document.createElement('div');
          sepetItem.className = 'sepet-item';
          sepetItem.innerHTML = `
            <div class="flex-1">
              <p class="sepet-urun-adi">${item.product}</p>
              <p class="sepet-urun-detay">
                ${item.quantity} adet × ₺${item.unitPrice.toLocaleString('tr-TR')} = ₺${item.totalPrice.toLocaleString('tr-TR')}
              </p>
            </div>
            <button class="btn-sil" data-id="${item.id}">Sil</button>
          `;

          sepetItem.querySelector('.btn-sil').addEventListener('click', function() {
            sepettenCikar(item.id);
          });
          
          sepetListesi.appendChild(sepetItem);
        });
      }
    }
    
    function sepeteEkle() {
      const selectedOption = urunSelect.options[urunSelect.selectedIndex];
      const productName = selectedOption.value;
      const quantity = parseInt(miktarInput.value);
      const unitPrice = parseFloat(selectedOption.getAttribute('data-price')); 

      if (!productName || quantity <= 0 || isNaN(unitPrice) || unitPrice === 0) {
        alert('Lütfen geçerli bir ürün ve miktar seçin.');
        return;
      }
      
      const existingItem = sepetUrunleri.find(item => item.product === productName);
      if (existingItem) {
          existingItem.quantity += quantity;
          existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
      } else {
          const newItem = {
              id: Date.now(), 
              product: productName,
              quantity: quantity,
              unitPrice: unitPrice,
              totalPrice: quantity * unitPrice
          };
          sepetUrunleri.push(newItem);
      }
      
      sepetiGuncelle();
    }
    
    function sepettenCikar(id) {
      sepetUrunleri = sepetUrunleri.filter(item => item.id !== id);
      sepetiGuncelle();
    }
    
    // --- Olay Dinleyicileri ---
    
    // 1. "Sepete Ekle" (Ana Buton)
    sepeteEkleBtn.addEventListener('click', sepeteEkle);

    // 2. "Seç" Butonları (Kartların İçinde)
    urunSecBtnler.forEach(button => {
        button.addEventListener('click', function() {
            const urunAdi = this.dataset.urunAdi;
            
            urunSelect.value = urunAdi; 
            
            urunSelect.dispatchEvent(new Event('change', { bubbles: true })); 
            
            miktarInput.value = 1; 
            
            // "Seç" butonuna basınca hemen sepete ekle
            sepeteEkle(); 
        });
    });

    // 3. "Siparişi Onayla" butonu simülasyonu
    siparisOnaylaBtn.addEventListener('click', function() {
      if (sepetUrunleri.length === 0) return;
      alert('Siparişiniz başarıyla oluşturuldu ve Fabrika paneline iletildi!');
      sepetUrunleri = []; 
      sepetiGuncelle();
    });
    
    // Gecikmeli çağırılan sepeteEkle'nin de sepetiGuncelle'yi tetiklemesi için
    if(!preSelectedProduct) {
        sepetiGuncelle(); // Sadece localStorage'dan gelmiyorsa anında güncelle
    }
  }


  // ===================================================
  // === BÖLÜM 16: RAPOR İNDİRME SİMÜLASYONU ===
  // ===================================================
  
  const raporSiparisBtn = document.getElementById('rapor-indir-siparis');
  if(raporSiparisBtn) {
    raporSiparisBtn.addEventListener('click', function() {
      alert('Sipariş raporu hazırlanıyor ve indiriliyor... (Simülasyon)');
    });
  }

  const raporFinansBtn = document.getElementById('rapor-indir-finans');
  if(raporFinansBtn) {
    raporFinansBtn.addEventListener('click', function() {
      alert('Finans raporu hazırlanıyor ve indiriliyor... (Simülasyon)');
    });
  }



  // ===================================================
  // === BÖLÜM 18: ÜRETİM PLANLAMA BATCH BUTONLARI (uretim-planlama.html) ===
  // ===================================================
  const uretimTab = document.getElementById('tab-batching'); // Bu sekmenin varlığını kontrol et
  
  if (uretimTab) {
    const partiOlusturButonlari = document.querySelectorAll('.parti-olustur-btn');
    const partiDetayButonlari = document.querySelectorAll('.parti-detay-btn');

    partiOlusturButonlari.forEach(button => {
      button.addEventListener('click', function() {
        const urunAdi = this.closest('.batch-card').querySelector('h4').textContent.split('<')[0].trim();
        alert(`${urunAdi} için üretim partisi oluşturuldu! (Simülasyon)`);
      });
    });

    partiDetayButonlari.forEach(button => {
      button.addEventListener('click', function() {
        const urunAdi = this.closest('.batch-card').querySelector('h4').textContent.split('<')[0].trim();
        alert(`${urunAdi} detayları yükleniyor... (Simülasyon)`);
      });
    });
  }
  
  // ===================================================
  // === BÖLÜM 19: BAYİ SİPARİŞ DETAY MODALI (bayi-siparislerim.html) ===
  // ===================================================

  // Sadece bu tablo varsa (yani bayi-siparislerim.html sayfasındaysak) çalışsın
  const siparisTablosu = document.getElementById("bayi-aktif-siparis-tablosu");

  if (siparisTablosu) {

    // --- Modal ve alanlar ---
    const bayiSiparisModal   = document.getElementById("bayi-siparis-detay-modal");
    const kapatBtn1          = document.getElementById("modal-kapat-btn-bayi-siparis");
    const kapatBtn2          = document.getElementById("modal-kapat-btn-bayi-siparis-2");
    const detayButonlari     = siparisTablosu.querySelectorAll(".btn-detay");

    const modalId            = document.getElementById("modal-bayi-siparis-id");
    const modalTarih         = document.getElementById("modal-bayi-siparis-tarih");
    const modalTeslim        = document.getElementById("modal-bayi-siparis-teslim");
    const modalUrunler       = document.getElementById("modal-bayi-siparis-urunler");
    const modalMiktar        = document.getElementById("modal-bayi-siparis-miktar");
    const modalTutar         = document.getElementById("modal-bayi-siparis-tutar");
    const modalDurumBadge    = document.getElementById("modal-bayi-siparis-durum-badge");
    const modalNo            = document.getElementById("modal-bayi-siparis-no");

    // Stepper elemanları (bu sayfada yoksa sorun değil)
    const stepOnay       = document.getElementById("step-onay");
    const stepUretim     = document.getElementById("step-uretim");
    const stepSevkiyat   = document.getElementById("step-sevkiyat");
    const stepTamamlandi = document.getElementById("step-tamamlandi");

    // Aksiyon butonları
    const btnTeslim    = document.getElementById("btn-teslim-alindi");
    const btnEksik     = document.getElementById("btn-eksik");
    const btnIptal     = document.getElementById("btn-iptal");
    const eksikKutusu  = document.getElementById("eksik-aciklama-kutusu");
    const eksikGonder  = document.getElementById("eksik-gonder");
    const eksikAciklama= document.getElementById("eksik-aciklama");

    // Seçilen sipariş ID'si burada tutulacak
    let aktifSiparisId = null;


    // -----------------------------
    // BİLDİRİM KAYIT FONKSİYONU
    // -----------------------------
    function bildirimGonder(tip, siparisId, aciklama = "") {
      let bildirimler = JSON.parse(localStorage.getItem("fabrikaBildirimler") || "[]");
      const yeni = {
        siparisId,
        tip,
        aciklama,
        tarih: new Date().toISOString()
      };
      bildirimler.push(yeni);
      localStorage.setItem("fabrikaBildirimler", JSON.stringify(bildirimler));
      console.log("BİLDİRİM KAYDEDİLDİ →", yeni);
    }


    // -----------------------------
    // MODAL AÇMA FONKSİYONU
    // -----------------------------
    function bayiSiparisModalAc() {
      // Burada "this" her zaman tıklanan .btn-detay butonu
      const btn = this;

      // Güvenlik: gerçekten btn-detay mi?
      if (!btn.classList.contains("btn-detay")) return;

      // SİPARİŞ ID'Yİ KAYDET
      aktifSiparisId = btn.dataset.id;

      // Modal alanlarını doldur
      modalId.textContent     = "Sipariş Detayları - " + btn.dataset.id;
      modalNo.textContent     = btn.dataset.id;
      modalTarih.textContent  = btn.dataset.tarih;
      modalTeslim.textContent = btn.dataset.teslim;

      const urunText   = btn.dataset.urunler;           // "Gül Parfümü (50 adet)"
      const urunAdi    = urunText.split("(")[0].trim();
      const miktarText = urunText.split("(")[1]
                        ? urunText.split("(")[1].replace(")", "")
                        : "N/A";

      modalUrunler.textContent = urunAdi;
      modalMiktar.textContent  = miktarText;
      modalTutar.textContent   = btn.dataset.tutar;

      // Durum & badge
      const durum = btn.dataset.durum;
      modalDurumBadge.textContent = durum;
      modalDurumBadge.className   = "badge"; // reset

      // Stepper reset
      if (stepOnay) {
        stepOnay.className       = "step-item";
        stepUretim.className     = "step-item";
        stepSevkiyat.className   = "step-item";
        stepTamamlandi.className = "step-item";

        if (durum === "Onay Bekliyor") {
          modalDurumBadge.classList.add("onay-bekliyor");
          stepOnay.classList.add("aktif");
        } else if (durum === "Üretimde" || durum === "Hazırlanıyor") {
          modalDurumBadge.classList.add("uretimde");
          stepOnay.classList.add("tamamlandi");
          stepUretim.classList.add("aktif");
        } else if (durum === "Sevkiyatta") {
          modalDurumBadge.classList.add("sevkiyatta");
          stepOnay.classList.add("tamamlandi");
          stepUretim.classList.add("tamamlandi");
          stepSevkiyat.classList.add("aktif");
        } else if (durum === "Tamamlandı") {
          modalDurumBadge.classList.add("tamamlandi");
          stepOnay.classList.add("tamamlandi");
          stepUretim.classList.add("tamamlandi");
          stepSevkiyat.classList.add("tamamlandi");
          stepTamamlandi.classList.add("tamamlandi");
        }
      }

      // Modalı göster
      bayiSiparisModal.style.display = "flex";
    }


    // -----------------------------
    // MODAL KAPATMA
    // -----------------------------
    function bayiSiparisModalKapat() {
      bayiSiparisModal.style.display = "none";
      // Eksik kutusunu da gizle
      if (eksikKutusu) {
        eksikKutusu.style.display = "none";
        eksikAciklama.value = "";
      }
    }


    // -----------------------------
    // EVENT LISTENER TANIMLARI
    // -----------------------------

    // Detay butonları
    detayButonlari.forEach(btn => {
      btn.addEventListener("click", bayiSiparisModalAc);
    });

    // Kapat butonları
    if (kapatBtn1) kapatBtn1.addEventListener("click", bayiSiparisModalKapat);
    if (kapatBtn2) kapatBtn2.addEventListener("click", bayiSiparisModalKapat);

    // ✔ Teslim Alındı
    if (btnTeslim) {
      btnTeslim.addEventListener("click", () => {
        if (!aktifSiparisId) return;
        bildirimGonder("teslim-alindi", aktifSiparisId);
        alert("Sipariş 'Teslim Alındı' olarak bildirildi.");
        bayiSiparisModalKapat();
      });
    }

    // ✔ Eksik Geldi — Açıklama kutusu açılır
    if (btnEksik && eksikKutusu) {
      btnEksik.addEventListener("click", () => {
        eksikKutusu.style.display = "block";
      });
    }

    // ✔ Eksik Sebebi Gönderildi
    if (eksikGonder) {
      eksikGonder.addEventListener("click", () => {
        const sebep = eksikAciklama.value.trim();
        if (!sebep) {
          alert("Lütfen eksik nedenini yazın.");
          return;
        }
        if (!aktifSiparisId) return;

        bildirimGonder("eksik", aktifSiparisId, sebep);
        alert("Eksik bildirimi gönderildi.");

        eksikKutusu.style.display = "none";
        bayiSiparisModalKapat();
      });
    }

    // ✔ İptal Edildi
    if (btnIptal) {
      btnIptal.addEventListener("click", () => {
        if (!aktifSiparisId) return;
        if (!confirm("Bu siparişi iptal etmek istediğinize emin misiniz?")) return;

        bildirimGonder("iptal", aktifSiparisId);
        alert("Sipariş 'İptal Edildi' olarak bildirildi.");
        bayiSiparisModalKapat();
      });
    }

  } // siparisTablosu if'inin sonu



  // ===================================================
  // === BÖLÜM 20: GİRİŞ FORMU (login.html veya index.html) ===
  // ===================================================
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    const seciliTipInput = document.getElementById('selected-user-type');
    const fabrikaBtn = document.getElementById('login-type-factory');
    const bayiBtn = document.getElementById('login-type-dealer');
    const submitBtn = document.getElementById('login-submit-btn');
    const submitBtnText = submitBtn.querySelector('.btn-text'); // Buton metnini al

    // Kullanıcı tipi seçimi
    fabrikaBtn.addEventListener('click', function() {
      seciliTipInput.value = 'factory';
      fabrikaBtn.classList.add('aktif');
      bayiBtn.classList.remove('aktif');
      submitBtn.style.background = ''; // Stili sıfırla, CSS'teki mor gradyan devreye girsin
      submitBtn.classList.remove('bayi-login'); // Mavi stili kaldır
    });

    bayiBtn.addEventListener('click', function() {
      seciliTipInput.value = 'dealer';
      bayiBtn.classList.add('aktif');
      fabrikaBtn.classList.remove('aktif');
      submitBtn.style.background = 'linear-gradient(to right, #3B82F6, #2563EB)'; // Mavi
      submitBtn.classList.add('bayi-login'); // Mavi stil için bir sınıf
    });

    // Form gönderimi
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault(); // Formun sayfayı yenilemesini engelle
      
      const seciliTip = seciliTipInput.value;
      const kullaniciAdi = document.getElementById('username').value;
      
      // Yükleniyor animasyonunu göster
      submitBtn.disabled = true;
      // Orijinal metni kaybetmeden "loading" sınıfını ekle
      submitBtn.classList.add('loading');
      // İçeriği değiştir
      submitBtn.innerHTML = `<div class="loading-spinner"></div> <span class="btn-text">Giriş Yapılıyor...</span>`;
      
      // Simülasyon: 1 saniye bekle
      setTimeout(function() {
        if (seciliTip === 'factory') {
          alert(`Fabrika Yöneticisi (${kullaniciAdi}) olarak giriş yapıldı!`);
          
          // ***** DİKKAT: YÖNLENDİRME LİNKİ *****
          window.location.href = 'panel-fabrika.html'; // Fabrika ana sayfasına yönlendir
        
        } else {
          alert(`Bayi (${kullaniciAdi}) olarak giriş yapıldı!`);
          window.location.href = 'bayi-anasayfa.html'; // Bayi ana sayfasına yönlendir
        }
        
        // Butonu eski haline getir (sayfa değişmezse diye)
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        submitBtn.innerHTML = `<span class="btn-text">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px; vertical-align: middle;">
                                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                                    <polyline points="10 17 15 12 10 7"></polyline>
                                    <line x1="15" y1="12" x2="3" y2="12"></line>
                                </svg>
                                Giriş Yap
                              </span>`;
      }, 1000);
    });
  }

}); // DOMContentLoaded'in sonu
