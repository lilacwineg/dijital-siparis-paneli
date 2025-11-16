document.addEventListener("DOMContentLoaded", () => {
  const tablo = document.querySelector("#hammadde-tablosu tbody");
  const form = document.getElementById("yeni-hammadde-formu");
  const modal = document.getElementById("yeni-hammadde-modal");
  const modalKapatBtn = document.getElementById("modal-kapat-btn-hammadde");
  const modalIptalBtn = document.getElementById("modal-iptal-btn-hammadde");

  // 🟦 Kart verilerini getir
  async function hammaddeIstatistikleriGetir() {
    try {
      const res = await fetch("http://localhost:3000/hammadde");
      const veriler = await res.json();

      // Toplam hammadde sayısı
      document.getElementById("toplam-hammadde-sayisi").textContent = veriler.length;

      // Kritik stoktaki hammadde sayısı
      const kritikSayisi = veriler.filter(h => {
        const stokYuzde = (parseFloat(h.stok_miktari) / parseFloat(h.kritik_stok_seviyesi)) * 100;
        return stokYuzde <= 60;
      }).length;
      document.getElementById("kritik-hammadde-sayisi").textContent = kritikSayisi;

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
          <td><span class="badge ${durum === "Normal" ? "tamamlandi" : durum === "Yakın" ? "onay-bekliyor" : "gecikmis"}">${durum}</span></td>
          <td>
            <button class="btn-iptal-et hammadde-sil-btn" data-id="${h.hammadde_id}" data-adi="${h.hammadde_adi}">Sil</button>
          </td>
        `;

        // 💡 kritik satırların arka planını hafif renkle belirginleştir
        if (durum === "Kritik") tr.style.backgroundColor = "rgba(239,68,68,0.07)";
        else if (durum === "Yakın") tr.style.backgroundColor = "rgba(139,92,246,0.07)";

        tablo.appendChild(tr);
      });

      // Sil butonlarına event listener ekle
      document.querySelectorAll('.hammadde-sil-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const hammaddeId = this.getAttribute('data-id');
          const hammaddeAdi = this.getAttribute('data-adi');

          if (!confirm(`"${hammaddeAdi}" hammaddesini silmek istediğinizden emin misiniz?`)) {
            return;
          }

          try {
            const res = await fetch(`http://localhost:3000/hammadde/${hammaddeId}`, {
              method: 'DELETE'
            });

            if (res.ok) {
              alert('Hammadde başarıyla silindi!');
              hammaddeleriGetir();
              hammaddeIstatistikleriGetir();
              grafikCiz();
            } else {
              alert('Hammadde silinemedi!');
            }
          } catch (err) {
            console.error('❌ Silme hatası:', err);
            alert('Sunucuya bağlanırken hata oluştu.');
          }
        });
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

    // ---- Aylık Kullanım Grafiği (sadece esans içerenler) ----
    const canvas1 = document.getElementById("hammadeKullanimGrafik");
    console.log("🖼️ Canvas 1:", canvas1);
    if (!canvas1) {
      console.error("❌ hammadeKullanimGrafik canvas bulunamadı!");
      return;
    }
    const ctx1 = canvas1.getContext("2d");

    // Sadece "esans" içeren hammaddeleri filtrele
    const esansVerileri = veriler.filter(v =>
      v.hammadde_adi && v.hammadde_adi.toLowerCase().includes('esans')
    );

    const labels = esansVerileri.map(v => v.hammadde_adi);
    const stoklar = esansVerileri.map(v => parseFloat(v.stok_miktari));
    console.log("📋 Esans sayısı:", labels.length);

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
            borderRadius: 8,
            backgroundColor: "rgba(139, 92, 246, 0.8)",
            borderColor: "rgba(139, 92, 246, 1)",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: "#FFFFFF",
              font: {
                size: 12,
                weight: '500'
              },
              padding: 15,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            cornerRadius: 8
          }
        },
        scales: {
          x: {
            ticks: {
              color: "#DDDDDD",
              font: {
                size: 11
              }
            },
            grid: {
              display: false
            }
          },
          y: {
            beginAtZero: true,
            ticks: {
              color: "#DDDDDD",
              font: {
                size: 11
              }
            },
            grid: {
              color: "rgba(255, 255, 255, 0.1)"
            }
          },
        },
        animation: {
          duration: 1500,
          easing: 'easeInOutQuart'
        }
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
            backgroundColor: [
              "rgba(16, 185, 129, 0.8)",
              "rgba(139, 92, 246, 0.8)",
              "rgba(239, 68, 68, 0.8)"
            ],
            borderColor: [
              "rgba(16, 185, 129, 1)",
              "rgba(139, 92, 246, 1)",
              "rgba(239, 68, 68, 1)"
            ],
            borderWidth: 2,
            hoverOffset: 8
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: "#FFFFFF",
              font: {
                size: 12,
                weight: '500'
              },
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle',
              generateLabels: function(chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    return {
                      text: `${label} (${value})`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      strokeStyle: data.datasets[0].borderColor[i],
                      fontColor: '#FFFFFF',
                      lineWidth: 2,
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                return `${label}: ${value} hammadde (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true,
          duration: 1500,
          easing: 'easeInOutQuart'
        },
        cutout: '65%'
      },
    });

    console.log("✅ Her iki grafik başarıyla oluşturuldu!");
    console.log("📊 Kritik Dağılım - Normal:", normal, "Yakın:", yakin, "Kritik:", kritik);
  } catch (err) {
    console.error("❌ Grafik çizme hatası:", err);
  }
}

