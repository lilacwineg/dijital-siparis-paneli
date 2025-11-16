// public/js/siparis.js
document.addEventListener("DOMContentLoaded", () => {
  const siparisTablosu = document.querySelector("#siparis-tablosu tbody");

  // Eski filtre butonlarının sınıflarını KULLANALIM:
  // .filtre-grubu .filtre  (Tümü, Onay Bekliyor, Üretimde...)
  const filtreButtons = document.querySelectorAll(".filtre-grubu .filtre");

  // 🔹 Siparişleri backend'den çeken fonksiyon
  async function siparisleriGetir(durum = "Tümü") {
    try {
      const baseUrl = "http://localhost:3000/siparisler";

      const url =
        !durum || durum === "Tümü"
          ? baseUrl
          : `${baseUrl}?durum=${encodeURIComponent(durum)}`;

      const res = await fetch(url);
      const siparisler = await res.json();

      // Tabloyu temizle
      siparisTablosu.innerHTML = "";

      // Her sipariş için satır oluştur
      siparisler.forEach((s) => {
        const tr = document.createElement("tr");

        const siparisNo = `SP-${s.siparis_id.toString().padStart(3, "0")}`;
        const bayiAdi = s.bayi_adi || "Bayi Bilinmiyor";
        const urunAdi = s.urun_adi || "Gül Parfümü";
        const miktar = s.miktar || "-";
        const durum = s.durum || "Onay Bekliyor";
        const siparisTarihi = (s.tarih || "").toISOString
          ? s.tarih.toISOString().split("T")[0]
          : (s.tarih || "").toString().slice(0, 10);

        // Tahmini teslim: Sipariş tarihine +7 gün ekle
        let tahminiTeslim = "-";
        if (s.tahmini_teslim) {
          tahminiTeslim = s.tahmini_teslim.toString().slice(0, 10);
        } else if (s.tarih) {
          // Sipariş tarihinden 7 gün sonrası
          const siparisTarihiObj = new Date(s.tarih);
          siparisTarihiObj.setDate(siparisTarihiObj.getDate() + 7);
          tahminiTeslim = siparisTarihiObj.toISOString().split("T")[0];
        }

        tr.innerHTML = `
          <td>${siparisNo}</td>
          <td>${bayiAdi}</td>
          <td>
            <span class="badge ${badgeClass(durum)}">${durum}</span>
          </td>
          <td>${siparisTarihi}</td>
          <td>${tahminiTeslim}</td>
          <td>
            <button
              class="btn-detay"
              data-id="${s.siparis_id}"
              data-bayi="${bayiAdi}"
              data-urun="${urunAdi}"
              data-miktar="${miktar}"
              data-durum="${durum}"
              data-tarih="${siparisTarihi}"
              data-teslim="${tahminiTeslim}"
            >
              Detay
            </button>
          </td>
        `;

        siparisTablosu.appendChild(tr);
      });
    } catch (err) {
      console.error("❌ Sipariş çekme hatası:", err);
    }
  }

  // 🔹 Duruma göre rozet (badge) class'ı
  function badgeClass(durum) {
    switch (durum) {
      case "Onay Bekliyor":
        return "onay-bekliyor";
      case "Üretimde":
        return "uretimde";
      case "Sevkiyatta":
        return "sevkiyatta";
      case "Onaylandı":
        return "tamamlandi";
      case "Tamamlandı":
        return "tamamlandi";
      case "İptal":
        return "iptal";
      default:
        return "";
    }
  }

  // 🔹 Filtre butonlarını bağla (mevcut tasarım korunarak)
  if (filtreButtons.length > 0) {
    filtreButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Aktif class yönetimi (senin CSS'ine dokunmuyoruz)
        filtreButtons.forEach((b) => b.classList.remove("aktif"));
        btn.classList.add("aktif");

        // Yazıdan durumu çıkar (başındaki emoji'yi sök)
        let durum = btn.textContent.trim();
        durum = durum.replace(/^(🟡|🔵|🟠|🟢|🔴)\s*/, ""); // emoji ve boşlukları al

        siparisleriGetir(durum);
      });
    });
  }

  // 🔹 Sayfa ilk açıldığında "Tümü" getir
  siparisleriGetir();

  // =============== 📋 DETAY BUTONU EVENT DELEGATION ======================
  // Dinamik olarak eklenen butonlar için event delegation kullan
  siparisTablosu.addEventListener('click', function(e) {
    // Eğer tıklanan element .btn-detay ise
    if (e.target.classList.contains('btn-detay')) {
      const btn = e.target;

      // Modal elementlerini bul
      const siparisModal = document.getElementById('siparis-detay-modal');
      const modalSiparisId = document.getElementById('modal-siparis-id');
      const modalSiparisBayi = document.getElementById('modal-siparis-bayi');
      const modalSiparisTarih = document.getElementById('modal-siparis-tarih');
      const modalSiparisUrun = document.getElementById('modal-siparis-urun');
      const modalSiparisMiktar = document.getElementById('modal-siparis-miktar');
      const modalSiparisBadge = document.getElementById('modal-siparis-durum-badge');
      const modalSiparisTeslim = document.getElementById('modal-siparis-teslim');

      if (!siparisModal) {
        console.error('❌ Sipariş detay modal bulunamadı!');
        return;
      }

      // Modal alanlarını doldur
      const id = btn.dataset.id;
      const bayi = btn.dataset.bayi;
      const urun = btn.dataset.urun;
      const miktar = btn.dataset.miktar;
      const durum = btn.dataset.durum;
      const tarih = btn.dataset.tarih;
      const teslim = btn.dataset.teslim;

      if (modalSiparisId) modalSiparisId.textContent = "Sipariş Detayları - SP-" + id.toString().padStart(3, '0');
      if (modalSiparisBayi) modalSiparisBayi.textContent = bayi;
      if (modalSiparisTarih) modalSiparisTarih.textContent = tarih;
      if (modalSiparisUrun) modalSiparisUrun.textContent = urun;
      if (modalSiparisMiktar) modalSiparisMiktar.textContent = miktar + " adet";
      if (modalSiparisTeslim) modalSiparisTeslim.textContent = teslim;

      if (modalSiparisBadge) {
        modalSiparisBadge.textContent = durum;
        modalSiparisBadge.className = "badge";

        if (durum === "Onay Bekliyor") modalSiparisBadge.classList.add("onay-bekliyor");
        else if (durum === "Üretimde") modalSiparisBadge.classList.add("uretimde");
        else if (durum === "Sevkiyatta") modalSiparisBadge.classList.add("sevkiyatta");
        else if (durum === "Onaylandı") modalSiparisBadge.classList.add("tamamlandi");
        else if (durum === "Tamamlandı") modalSiparisBadge.classList.add("tamamlandi");
        else if (durum === "İptal") modalSiparisBadge.classList.add("iptal");
      }

      // Durum select'te mevcut durumu seç
      const durumSelect = document.getElementById('durum-guncelle');
      if (durumSelect) {
        console.log('🔍 Mevcut durum:', durum);
        console.log('📋 Select options:', Array.from(durumSelect.options).map(o => o.value));

        // Durumu seç
        durumSelect.value = durum;

        // Kontrol et
        console.log('✅ Seçilen değer:', durumSelect.value);

        // Eğer seçilmediyse manuel seç
        if (durumSelect.value !== durum) {
          for (let i = 0; i < durumSelect.options.length; i++) {
            if (durumSelect.options[i].value === durum) {
              durumSelect.selectedIndex = i;
              console.log('✅ Manuel olarak seçildi:', i);
              break;
            }
          }
        }
      } else {
        console.error('❌ Durum select elementi bulunamadı!');
      }

      // Sipariş detaylarını çek ve göster
      siparisDetaylariniGetir(id);

      // Modalı aç
      siparisModal.style.display = 'flex';
    }
  });

  // =============== 📦 SİPARİŞ DETAYLARINI GETIR ======================
  async function siparisDetaylariniGetir(siparisId) {
    try {
      const res = await fetch(`http://localhost:3000/siparisler/${siparisId}/detay`);
      const detaylar = await res.json();

      console.log('📦 Sipariş detayları:', detaylar);

      // Detayları göstermek için bir tablo veya liste oluştur
      const detayTablosu = document.querySelector('#siparis-detay-tablosu tbody');
      if (detayTablosu) {
        detayTablosu.innerHTML = '';

        if (detaylar.length === 0) {
          detayTablosu.innerHTML = `
            <tr>
              <td colspan="2" style="text-align: center; color: #888;">
                Bu sipariş için detay bulunamadı.
              </td>
            </tr>
          `;
        } else {
          detaylar.forEach(d => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
              <td>${d.urun_adi || 'Ürün adı bulunamadı'}</td>
              <td style="text-align: center;">${d.miktar} adet</td>
            `;
            detayTablosu.appendChild(tr);
          });
        }
      } else {
        console.warn('⚠️ #siparis-detay-tablosu bulunamadı. HTML\'de bu ID\'ye sahip bir tablo olmalı.');
      }
    } catch (err) {
      console.error('❌ Sipariş detayları yüklenemedi:', err);
    }
  }

  // =============== 💾 DURUM GÜNCELLEME ======================
  const modalKaydetBtn = document.getElementById('modal-kaydet-btn-siparis');
  const durumSelect = document.getElementById('durum-guncelle');

  if (modalKaydetBtn && durumSelect) {
    modalKaydetBtn.addEventListener('click', async function() {
      const modalSiparisId = document.getElementById('modal-siparis-id');
      if (!modalSiparisId) return;

      const siparisIdText = modalSiparisId.textContent;
      const siparisId = siparisIdText.split('SP-')[1]?.replace(/^0+/, '') || siparisIdText.split(' - ')[1];
      const yeniDurum = durumSelect.value;

      if (!siparisId || !yeniDurum) {
        alert('Sipariş ID veya durum bulunamadı!');
        return;
      }

      try {
        console.log('🔄 Durum güncelleniyor:', { siparisId, yeniDurum });

        const res = await fetch(`http://localhost:3000/siparisler/${siparisId}/durum`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ durum: yeniDurum })
        });

        const data = await res.json();

        if (!res.ok) {
          alert('Hata: ' + (data?.error || 'Durum güncellenemedi'));
          return;
        }

        console.log('✅ Durum güncellendi:', data);
        alert(`Sipariş durumu "${yeniDurum}" olarak güncellendi!`);

        // Modalı kapat
        const siparisModal = document.getElementById('siparis-detay-modal');
        if (siparisModal) siparisModal.style.display = 'none';

        // Tabloyu yenile
        siparisleriGetir();
      } catch (err) {
        console.error('❌ Durum güncelleme hatası:', err);
        alert('Sunucuya bağlanırken hata oluştu.');
      }
    });
  }

  // =============== ❌ MODAL KAPAT ======================
  const modalKapatBtn = document.getElementById('modal-kapat-btn-siparis');
  if (modalKapatBtn) {
    modalKapatBtn.addEventListener('click', function() {
      const siparisModal = document.getElementById('siparis-detay-modal');
      if (siparisModal) siparisModal.style.display = 'none';
    });
  }

  // =============== 🔴 İPTAL ET BUTONU ======================
  let aktifIptalSiparisId = null;

  const iptalEtBtn = document.getElementById('modal-iptal-et-btn');
  const iptalModal = document.getElementById('iptal-nedeni-modal');
  const iptalKapatBtn = document.getElementById('modal-kapat-btn-iptal');
  const iptalVazgecBtn = document.getElementById('modal-vazgec-btn-iptal');
  const iptalFormu = document.getElementById('iptal-formu');

  if (iptalEtBtn) {
    iptalEtBtn.addEventListener('click', function() {
      // Aktif sipariş ID'sini al
      const modalSiparisId = document.getElementById('modal-siparis-id');
      if (!modalSiparisId) return;

      const siparisIdText = modalSiparisId.textContent;
      aktifIptalSiparisId = siparisIdText.split('SP-')[1]?.replace(/^0+/, '') || siparisIdText.split(' - ')[1];

      // Detay modalını kapat
      const siparisModal = document.getElementById('siparis-detay-modal');
      if (siparisModal) siparisModal.style.display = 'none';

      // İptal modalını aç
      if (iptalModal) {
        iptalModal.style.display = 'flex';
        // Formu temizle
        const iptalNedeniTextarea = document.getElementById('iptal-nedeni');
        if (iptalNedeniTextarea) iptalNedeniTextarea.value = '';
      }
    });
  }

  // İptal modalı kapat butonları
  [iptalKapatBtn, iptalVazgecBtn].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', function() {
        if (iptalModal) iptalModal.style.display = 'none';
        aktifIptalSiparisId = null;
      });
    }
  });

  // İptal formu submit
  if (iptalFormu) {
    iptalFormu.addEventListener('submit', async function(e) {
      e.preventDefault();

      if (!aktifIptalSiparisId) {
        alert('Sipariş ID bulunamadı!');
        return;
      }

      const iptalNedeni = document.getElementById('iptal-nedeni').value.trim();

      try {
        console.log('🔴 Sipariş iptal ediliyor:', { siparisId: aktifIptalSiparisId, nedeni: iptalNedeni });

        const res = await fetch(`http://localhost:3000/siparisler/${aktifIptalSiparisId}/durum`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ durum: 'İptal' })
        });

        const data = await res.json();

        if (!res.ok) {
          alert('Hata: ' + (data?.error || 'Sipariş iptal edilemedi'));
          return;
        }

        console.log('✅ Sipariş iptal edildi:', data);
        alert('Sipariş başarıyla iptal edildi!');

        // Modalı kapat
        if (iptalModal) iptalModal.style.display = 'none';
        aktifIptalSiparisId = null;

        // Tabloyu yenile
        siparisleriGetir();
      } catch (err) {
        console.error('❌ Sipariş iptal hatası:', err);
        alert('Sunucuya bağlanırken hata oluştu.');
      }
    });
  }
});

// 📄 PDF Rapor Oluşturma
document.getElementById("rapor-indir-siparis")?.addEventListener("click", () => {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF("p", "pt", "a4");

  // --- PDF Başlık ---
  pdf.setFontSize(18);
  pdf.text("Sipariş Yönetimi Raporu", 40, 40);

  pdf.setFontSize(12);
  pdf.text("Oluşturulma Tarihi: " + new Date().toLocaleString(), 40, 65);

  // --- HTML Tablosunu Okuma ---
  const table = document.querySelector("#siparis-tablosu");

  // Başlıkları al
  const headers = [...table.querySelectorAll("thead th")].map(th =>
    th.innerText.trim()
  );

  // Satırları al
  const rows = [...table.querySelectorAll("tbody tr")].map(tr =>
    [...tr.querySelectorAll("td")].map(td => td.innerText.trim())
  );

  // --- autoTable ile PDF tablo oluştur ---
  pdf.autoTable({
    head: [headers],
    body: rows,
    startY: 90,
    styles: {
      fontSize: 10,
      cellPadding: 6,
      textColor: "#000",
    },
    headStyles: {
      fillColor: [52, 73, 94],  // koyu gri başlık
      textColor: "#fff",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    theme: "striped"
  });

  pdf.save("Siparis_Raporu.pdf");
});


// ===================================================
// ===   SİPARİŞ GRAFİKLERİ - TREND + DURUM DAĞILIMI ===
// ===================================================

let siparisTrendChart = null;
let siparisDurumChart = null;

async function grafikVerileriniOlustur() {
    const res = await fetch("http://localhost:3000/siparisler");
    const siparisler = await res.json();

    // ---------------------------------------------
    // 🟦 1) SON 30 GÜNLÜK (1 AY) SİPARİŞ TRENDİ
    // ---------------------------------------------
    const gunler = [];
    const siparisSayilari = [];

    for (let i = 29; i >= 0; i--) {
        const tarih = new Date();
        tarih.setDate(tarih.getDate() - i);

        const gunString = tarih.toISOString().split("T")[0];
        gunler.push(gunString);

        const sayi = siparisler.filter(s => s.tarih.startsWith(gunString)).length;
        siparisSayilari.push(sayi);
    }

    const ctx1 = document.getElementById("siparisTrendGrafik");

    if (ctx1) {
        // Mevcut grafik varsa sil
        const mevcutChart = Chart.getChart(ctx1);
        if (mevcutChart) {
            mevcutChart.destroy();
        }

        siparisTrendChart = new Chart(ctx1, {
            type: "line",
            data: {
                labels: gunler,
                datasets: [{
                    label: "Sipariş Sayısı",
                    data: siparisSayilari,
                    borderWidth: 2,
                    borderColor: "#8B5CF6",
                    backgroundColor: "rgba(139,92,246,0.3)",
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { color: "#ffffff" }
                    },
                    x: {
                        ticks: { color: "#ffffff" }
                    }
                }
            }
        });
    }

    // ---------------------------------------------
    // 🟧 2) DURUM BAZLI SİPARİŞ DAĞILIMI
    // ---------------------------------------------
    const durumlar = ["Onay Bekliyor", "Üretimde", "Sevkiyatta", "Tamamlandı", "İptal"];
    const renkler = ["#F59E0B", "#3B82F6", "#10B981", "#6EE7B7", "#EF4444"];

    const durumSayilari = durumlar.map(d =>
        siparisler.filter(s => s.durum === d).length
    );

    const ctx2 = document.getElementById("siparisDurumGrafik");

    if (ctx2) {
        // Mevcut grafik varsa sil
        const mevcutChart = Chart.getChart(ctx2);
        if (mevcutChart) {
            mevcutChart.destroy();
        }

        siparisDurumChart = new Chart(ctx2, {
            type: "doughnut",
            data: {
                labels: durumlar,
                datasets: [{
                    data: durumSayilari,
                    backgroundColor: renkler
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: "white" } }
                }
            }
        });
    }
}

// İlk yüklemede grafikleri oluştur
grafikVerileriniOlustur();