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
        const urunAdi = s.urun_adi || "Gül Parfümü"; // İstersen tabloya kolon ekleyip gerçek veri kullanırsın
        const miktar = s.miktar || "-";
        const durum = s.durum || "Onay Bekliyor";
        const siparisTarihi = (s.tarih || "").toISOString
          ? s.tarih.toISOString().split("T")[0]
          : (s.tarih || "").toString().slice(0, 10);
        const tahminiTeslim = s.tahmini_teslim
          ? s.tahmini_teslim.toString().slice(0, 10)
          : "-";

        tr.innerHTML = `
          <td>${siparisNo}</td>
          <td>${bayiAdi}</td>
          <td>${urunAdi}</td>
          <td>${miktar}</td>
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
    // 🟦 1) SON 7 GÜNLÜK SİPARİŞ TRENDİ
    // ---------------------------------------------
    const gunler = [];
    const siparisSayilari = [];

    for (let i = 6; i >= 0; i--) {
        const tarih = new Date();
        tarih.setDate(tarih.getDate() - i);

        const gunString = tarih.toISOString().split("T")[0];
        gunler.push(gunString);

        const sayi = siparisler.filter(s => s.tarih.startsWith(gunString)).length;
        siparisSayilari.push(sayi);
    }

    // Mevcut grafik varsa sil
    if (siparisTrendChart) siparisTrendChart.destroy();

    const ctx1 = document.getElementById("siparisTrendGrafik");

    if (ctx1) {
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

    if (siparisDurumChart) siparisDurumChart.destroy();

    const ctx2 = document.getElementById("siparisDurumGrafik");

    if (ctx2) {
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