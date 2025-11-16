// =====================================================
// ÜRETİM PLANLAMA - TÜM GÜNCELLENMİŞ KOD
// (Hiçbir satır eksiltilmemiştir, sadece eklentiler yapılmıştır.)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Üretim.js yüklendi.");

  // ==============================
  // ÜRETİMDEKİ SİPARİŞLERİ GETİR
  // ==============================
  async function uretimdekiSiparisleriGetir() {
    try {
      const res = await fetch("http://localhost:3000/uretim");
      if (!res.ok) throw new Error("Veri alınamadı");

      const siparisler = await res.json();
      console.log("📦 Üretimdeki siparişler:", siparisler);

      const tablo = document.querySelector("#uretim-tablosu tbody");
      if (!tablo) {
        console.error("❌ Tablo bulunamadı!");
        return;
      }

      tablo.innerHTML = "";

      siparisler.forEach((s, index) => {
        // İlerleme yüzdesi (rastgele simüle ediyoruz - ileride gerçek veri kullanılabilir)
        const ilerleme = Math.floor(Math.random() * 100);

        // Kalan gün hesaplama
        const bitisTarihi = new Date(s.bitis_tarihi);
        const bugun = new Date();
        const kalanGun = Math.ceil((bitisTarihi - bugun) / (1000 * 60 * 60 * 24));

        // Durum belirleme
        let durum = "Devam Ediyor";
        let durumClass = "uretimde";
        if (ilerleme === 0) {
          durum = "Beklemede";
          durumClass = "onay-bekliyor";
        } else if (ilerleme >= 100) {
          durum = "Tamamlandı";
          durumClass = "tamamlandi";
        }

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>ÜE-${String(s.siparis_id).padStart(3, "0")}</td>
          <td>${s.urun_adi || "-"}</td>
        
          <td>${new Date(s.baslangic_tarihi).toISOString().split("T")[0]}</td>
          <td>${new Date(s.bitis_tarihi).toISOString().split("T")[0]}</td>
          <td>${kalanGun} gün</td>
          <td><span class="badge ${durumClass}">${durum}</span></td>
          <td><button class="btn-detay" data-id="ÜE-${String(s.siparis_id).padStart(3, "0")}">Detay</button></td>
        `;
        tablo.appendChild(tr);
      });

      // İstatistikleri güncelle
      document.querySelector(".info-card.purple .kart-deger").textContent = siparisler.length;

      // Progress bar renklerini güncelle
      const progressBars = document.querySelectorAll(".progress-bar-inner");
      progressBars.forEach((bar) => {
        const width = parseInt(bar.style.width);
        if (width >= 100) {
          bar.style.backgroundColor = "#10B981";
        } else if (width < 20) {
          bar.style.backgroundColor = "#F59E0B";
        } else {
          bar.style.backgroundColor = "#7C3AED";
        }
      });

      // Detay butonlarını yeniden bağla
      detayButonlariEkle();
    } catch (err) {
      console.error("❌ Üretimdeki siparişler alınamadı:", err);
    }
  }

  uretimdekiSiparisleriGetir();

  // ==============================
  // TAB SİSTEMİ
  // ==============================
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      tabButtons.forEach((btn) => btn.classList.remove("aktif"));
      tabContents.forEach((tab) => tab.classList.remove("aktif"));

      button.classList.add("aktif");
      const target = document.getElementById(button.dataset.target);
      if (target) target.classList.add("aktif");
    });
  });

  // ===========================================================
  // DETAY MODAL KODLARI
  // ===========================================================
  const modal = document.getElementById("siparisDetayModal");
  const closeBtn = modal ? modal.querySelector(".close-btn") : null;

  const detayEmirNo = document.getElementById("detayEmirNo");
  const detayUrun = document.getElementById("detayUrun");
  const detayMiktar = document.getElementById("detayMiktar");
  const detayIlerleme = document.getElementById("detayIlerleme");
  const detayBaslangic = document.getElementById("detayBaslangic");
  const detayBitis = document.getElementById("detayBitis");
  const detayDurum = document.getElementById("detayDurum");

  const btnTamamla = document.getElementById("btnTamamla");
  const btnBeklemede = document.getElementById("btnBeklemede");

  let secilenSiparisId = null; // Seçilen siparişin ID'sini sakla

  function detayButonlariEkle() {
    const detayButonlari = document.querySelectorAll(".btn-detay");

    if (detayButonlari.length > 0 && modal) {
      detayButonlari.forEach((buton) => {
        buton.addEventListener("click", () => {
          const satir = buton.closest("tr");

          if (!satir) return;

          // Sipariş ID'sini al (ÜE-047 formatından 47'yi çıkar)
          const emirNo = satir.children[0].textContent;
          secilenSiparisId = parseInt(emirNo.replace("ÜE-", ""));

          // Satır verilerini al
          detayEmirNo.textContent = emirNo;
          detayUrun.textContent = satir.children[1].textContent;
          detayMiktar.textContent = satir.children[2].textContent;
          const ilerlemeYazi = satir.querySelector(".progress-bar-inner")
            ? satir.querySelector(".progress-bar-inner").textContent
            : "%0";
          //detayIlerleme.textContent = ilerlemeYazi;
          detayBaslangic.textContent = satir.children[4].textContent;
          detayBitis.textContent = satir.children[5].textContent;
          detayDurum.textContent = satir.children[7].innerText;

          // Modalı aç
          modal.style.display = "flex";
        });
      });
    }
  }

  // Modal kapatma
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // "Tamamlandı" Butonu
  if (btnTamamla) {
    btnTamamla.addEventListener("click", async () => {
      if (!secilenSiparisId) {
        alert("❌ Sipariş ID bulunamadı!");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/uretim/${secilenSiparisId}/tamamla`, {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok) {
          alert("❌ Hata: " + (data.error || "Bilinmeyen hata"));
          return;
        }

        alert("✅ " + data.message);
        modal.style.display = "none";

        // Tabloyu yenile
        await uretimdekiSiparisleriGetir();
      } catch (err) {
        console.error("❌ İstek hatası:", err);
        alert("❌ Sunucuya bağlanırken hata oluştu.");
      }
    });
  }

  // "Beklemede" Butonu
  if (btnBeklemede) {
    btnBeklemede.addEventListener("click", async () => {
      if (!secilenSiparisId) {
        alert("❌ Sipariş ID bulunamadı!");
        return;
      }

      try {
        const res = await fetch(`http://localhost:3000/uretim/${secilenSiparisId}/beklet`, {
          method: "POST",
        });

        const data = await res.json();

        if (!res.ok) {
          alert("❌ Hata: " + (data.error || "Bilinmeyen hata"));
          return;
        }

        alert("⏳ " + data.message);
        modal.style.display = "none";

        // Tabloyu yenile
        await uretimdekiSiparisleriGetir();
      } catch (err) {
        console.error("❌ İstek hatası:", err);
        alert("❌ Sunucuya bağlanırken hata oluştu.");
      }
    });
  }

  // ===========================================================
  // (İLERİDE EKLENECEK GELİŞMİŞ ANALİZLER / CHART.JS)
  // ===========================================================
  const chartElement = document.getElementById("siparisTrendGrafik");
  if (chartElement) {
    try {
      new Chart(chartElement, {
        type: "line",
        data: {
          labels: ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"],
          datasets: [
            {
              label: "Siparişler",
              data: [12, 15, 18, 14, 20, 8, 5],
              borderColor: "rgba(124, 58, 237, 1)",
              backgroundColor: "rgba(124, 58, 237, 0.1)",
              fill: true,
              tension: 0.3,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: "#27273A" },
              ticks: { color: "#A0A0A0" },
            },
            x: {
              grid: { color: "#27273A" },
              ticks: { color: "#A0A0A0" },
            },
          },
          plugins: {
            legend: { labels: { color: "white" } },
          },
        },
      });
    } catch (e) {
      console.warn("Grafik yüklenemedi:", e);
    }
  }

  // ===========================================================
  // (EKSTRA: GELECEKTE VERİ TABANINDAN YÜKLENEN EMİRLER)
  // ===========================================================
  console.log("🔹 Üretim planlama sayfası başarıyla hazır.");
});
