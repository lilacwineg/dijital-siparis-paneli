// =====================================================
// ÜRETİM PLANLAMA - TÜM GÜNCELLENMİŞ KOD
// (Hiçbir satır eksiltilmemiştir, sadece eklentiler yapılmıştır.)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Üretim.js yüklendi.");

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

  // ==============================
  // PROGRESS BAR GÜNCELLEME ÖRNEĞİ
  // ==============================
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

  // ===========================================================
  // EKLENDİ: DETAY MODAL KODLARI
  // ===========================================================

  const detayButonlari = document.querySelectorAll(".btn-detay");
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

  if (detayButonlari.length > 0 && modal) {
    detayButonlari.forEach((buton) => {
      buton.addEventListener("click", () => {
        const satir = buton.closest("tr");

        if (!satir) return;

        // Satır verilerini al
        detayEmirNo.textContent = satir.children[0].textContent;
        detayUrun.textContent = satir.children[1].textContent;
        detayMiktar.textContent = satir.children[2].textContent;
        const ilerlemeYazi = satir.querySelector(".progress-bar-inner")
          ? satir.querySelector(".progress-bar-inner").textContent
          : "%0";
        detayIlerleme.textContent = ilerlemeYazi;
        detayBaslangic.textContent = satir.children[4].textContent;
        detayBitis.textContent = satir.children[5].textContent;
        detayDurum.textContent = satir.children[7].innerText;

        // Modalı aç
        modal.style.display = "flex";
      });
    });

    // Modal kapatma
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    window.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });

    // “Tamamlandı” Butonu
    if (btnTamamla) {
      btnTamamla.addEventListener("click", () => {
        alert("✅ Üretim tamamlandı olarak işaretlendi!");
        modal.style.display = "none";
      });
    }

    // “Beklemede” Butonu
    if (btnBeklemede) {
      btnBeklemede.addEventListener("click", () => {
        alert("⏳ Sipariş beklemeye alındı!");
        modal.style.display = "none";
      });
    }
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
