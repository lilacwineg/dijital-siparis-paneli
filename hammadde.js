document.addEventListener("DOMContentLoaded", () => {
  const tablo = document.querySelector("#hammadde-tablosu tbody");
  const form = document.getElementById("yeni-hammadde-formu");
  const modal = document.getElementById("yeni-hammadde-modal");
  const modalKapatBtn = document.getElementById("modal-kapat-btn-hammadde");
  const modalIptalBtn = document.getElementById("modal-iptal-btn-hammadde");

  // 🟦 Kart verilerini getir
  async function hammaddeIstatistikleriGetir() {
    try {
      const res = await fetch("http://localhost:3000/hammadde/istatistikler");
      const data = await res.json();

      document.querySelector(".info-card.purple .kart-deger").textContent = data.toplam;
      document.querySelector(".info-card.red .kart-deger").textContent = data.kritik;
      document.querySelector(".info-card.blue .kart-deger").textContent = data.ortalamaTuketim + " lt";
      document.querySelector(".info-card.orange .kart-deger").textContent = data.tedarikIhtiyaci;
    } catch (err) {
      console.error("❌ İstatistik çekme hatası:", err);
    }
  }

  hammaddeIstatistikleriGetir();

  // 🟣 Modal aç/kapat
  document.getElementById("yeni-hammadde-btn").addEventListener("click", () => {
    modal.style.display = "flex";
  });

  [modalKapatBtn, modalIptalBtn].forEach(btn => {
    if (btn) btn.addEventListener("click", () => (modal.style.display = "none"));
  });

  // 🟢 Hammadde verilerini backend'den çek
  async function hammaddeleriGetir() {
    try {
      const res = await fetch("http://localhost:3000/hammadde");
      const veriler = await res.json();

      tablo.innerHTML = "";
      veriler.forEach(h => {
        // 📊 stok yüzdesini hesapla
        const stokYuzde = ((parseFloat(h.stok_miktari) / parseFloat(h.kritik_stok_seviyesi)) * 100).toFixed(0);

        // ⚙️ durum hesapla
        let durum = "";
        if (stokYuzde <= 60) {
          durum = "Kritik";
        } else if (stokYuzde <= 85) {
          durum = "Yakın";
        } else {
          durum = "Normal";
        }

        // 🎨 renk seçimi
        const renk =
          stokYuzde <= 60
            ? "#EF4444" // kırmızı
            : stokYuzde <= 85
            ? "#8B5CF6" // mor/turuncu
            : "#10B981"; // yeşil

        // 🧱 tablo satırı oluştur
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${h.hammadde_adi}</td>
          <td>${h.stok_miktari} ${h.birim}</td>
          <td>${h.kritik_stok_seviyesi} ${h.birim}</td>
          <td>
            <div class="progress-bar">
              <div class="progress-bar-inner" style="width: ${Math.min(stokYuzde, 100)}%; background-color: ${renk};">
                ${stokYuzde}%
              </div>
            </div>
          </td>
          <td>${new Date().toISOString().split("T")[0]}</td>
          <td><span class="badge ${durum === "Normal" ? "tamamlandi" : durum === "Yakın" ? "onay-bekliyor" : "gecikmis"}">${durum}</span></td>
          <td>
            <button class="btn-detay" 
              data-adi="${h.hammadde_adi}" 
              data-stok="${h.stok_miktari} ${h.birim}" 
              data-kritik="${h.kritik_stok_seviyesi} ${h.birim}" 
              data-durum="${durum}" 
              data-tarih="${new Date().toISOString().split("T")[0]}">Detay</button>
          </td>
        `;

        // 💡 kritik satırların arka planını hafif renkle belirginleştir
        if (durum === "Kritik") tr.style.backgroundColor = "rgba(239,68,68,0.07)";
        else if (durum === "Yakın") tr.style.backgroundColor = "rgba(139,92,246,0.07)";

        tablo.appendChild(tr);
      });
    } catch (err) {
      console.error("❌ Veri çekme hatası:", err);
    }
  }

  hammaddeleriGetir();

  // 🟡 Yeni hammadde ekleme
  form.addEventListener("submit", async e => {
    e.preventDefault();

    const hammadde_adi = document.getElementById("hammadde-adi").value;
    const birim = document.getElementById("hammadde-birim").value;
    const stok_miktari = document.getElementById("hammadde-stok").value;
    const kritik_stok_seviyesi = document.getElementById("hammadde-kritik").value;

    try {
      const res = await fetch("http://localhost:3000/hammadde", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hammadde_adi, birim, stok_miktari, kritik_stok_seviyesi }),
      });

      const data = await res.json();
      console.log("✅ Yeni hammadde eklendi:", data);
      form.reset();
      modal.style.display = "none";
      hammaddeleriGetir();
      hammaddeIstatistikleriGetir();
      grafikCiz(); // Grafikleri de güncelle
    } catch (err) {
      console.error("❌ Hata:", err);
    }
  });

  // 📈 Grafikleri DOM yüklendikten sonra çiz
  grafikCiz();
});

// 📈 Grafikler
let kullanimGrafik, kritikGrafik;

async function grafikCiz() {
  try {
    console.log("🎨 grafikCiz() çağrıldı");
    console.log("📦 Chart.js yüklü mü?", typeof Chart !== 'undefined' ? "✅ Evet" : "❌ Hayır");

    const res = await fetch("http://localhost:3000/hammadde");
    const veriler = await res.json();
    console.log("📊 Gelen veri sayısı:", veriler.length);

    // ---- Aylık Kullanım Grafiği ----
    const canvas1 = document.getElementById("hammadeKullanimGrafik");
    console.log("🖼️ Canvas 1:", canvas1);
    if (!canvas1) {
      console.error("❌ hammadeKullanimGrafik canvas bulunamadı!");
      return;
    }
    const ctx1 = canvas1.getContext("2d");
    const labels = veriler.map(v => v.hammadde_adi);
    const stoklar = veriler.map(v => parseFloat(v.stok_miktari));
    console.log("📋 Label sayısı:", labels.length);

    // Mevcut chart varsa yok et
    const mevcutChart1 = Chart.getChart("hammadeKullanimGrafik");
    if (mevcutChart1) {
      console.log("🗑️ Mevcut Chart 1 yok ediliyor...");
      mevcutChart1.destroy();
    }

    kullanimGrafik = new Chart(ctx1, {
      type: "bar",
      data: {
        labels,
        datasets: [
          {
            label: "Mevcut Stok",
            data: stoklar,
            borderRadius: 6,
            backgroundColor: "#8B5CF6",
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { color: "#DDD" }, grid: { color: "#222" } },
          y: { ticks: { color: "#DDD" }, grid: { color: "#222" } },
        },
      },
    });

    // ---- Kritik Stok Dağılımı ----
    const canvas2 = document.getElementById("kritikStokGrafik");
    console.log("🖼️ Canvas 2:", canvas2);
    if (!canvas2) {
      console.error("❌ kritikStokGrafik canvas bulunamadı!");
      return;
    }
    const ctx2 = canvas2.getContext("2d");

    let kritik = 0,
      yakin = 0,
      normal = 0;

    veriler.forEach(v => {
      const stokYuzde = (parseFloat(v.stok_miktari) / parseFloat(v.kritik_stok_seviyesi)) * 100;
      if (stokYuzde <= 60) kritik++;
      else if (stokYuzde <= 90) yakin++;
      else normal++;
    });

    // Mevcut chart varsa yok et
    const mevcutChart2 = Chart.getChart("kritikStokGrafik");
    if (mevcutChart2) {
      console.log("🗑️ Mevcut Chart 2 yok ediliyor...");
      mevcutChart2.destroy();
    }

    kritikGrafik = new Chart(ctx2, {
      type: "doughnut",
      data: {
        labels: ["Normal", "Yakın", "Kritik"],
        datasets: [
          {
            data: [normal, yakin, kritik],
            backgroundColor: ["#10B981", "#8B5CF6", "#EF4444"],
            borderWidth: 0,
          },
        ],
      },
      options: {
        plugins: {
          legend: { labels: { color: "#DDD" } },
        },
      },
    });

    console.log("✅ Her iki grafik başarıyla oluşturuldu!");
    console.log("📊 Kritik Dağılım - Normal:", normal, "Yakın:", yakin, "Kritik:", kritik);
  } catch (err) {
    console.error("❌ Grafik çizme hatası:", err);
  }
}

