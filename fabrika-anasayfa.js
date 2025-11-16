// fabrika-anasayfa.js
document.addEventListener("DOMContentLoaded", async () => {
  // 🔒 Oturum kontrolü
  const aktifKullanici = JSON.parse(localStorage.getItem("aktifKullanici"));
  if (!aktifKullanici) {
    alert("Oturum bulunamadı. Lütfen giriş yapın.");
    window.location.href = "index.html";
    return;
  }

  // Kullanıcı bilgilerini göster
  const kullaniciSpan = document.getElementById("fabrika-kullanici");
  const tarihSpan = document.getElementById("fabrika-tarih");

  if (kullaniciSpan) {
    kullaniciSpan.textContent = aktifKullanici.kullanici_adi || "Yönetici";
  }

  if (tarihSpan) {
    tarihSpan.textContent = new Date().toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "long"
    });
  }

  await fabrikaOzetGetir();
  // Grafiklerin biraz gecikmeli yüklenmesi flicker hatalarını engeller
  setTimeout(() => {
    sehirBazliGrafikCiz();
    aylikSatisGrafikCiz();
  }, 300);
});

// 🚪 Çıkış yapma fonksiyonu
function cikisYap() {
  if (confirm("Çıkış yapmak istediğinize emin misiniz?")) {
    localStorage.removeItem("aktifKullanici");
    console.log("🚪 Çıkış yapıldı");
    window.location.href = "index.html";
  }
}


// 🔹 1. Fabrika Özet Verileri
async function fabrikaOzetGetir() {
  try {
    const res = await fetch("http://localhost:3000/fabrika/ozet");
    const data = await res.json();

    document.querySelector(".info-card.purple .kart-deger").textContent = data.toplam_siparis;
    document.querySelector(".info-card.blue .kart-deger").textContent = data.aktif_bayiler;
    document.querySelector(".info-card.red .kart-deger").textContent = data.kritik_stoklar;
    document.querySelector(".info-card.green .kart-deger").textContent = data.sevkiyat_durumu;
  } catch (err) {
    console.error("❌ Fabrika özet verisi alınamadı:", err);
  }
}



// 🔹 2. Şehir Bazlı Sipariş Grafiği
async function sehirBazliGrafikCiz() {
  try {
    const res = await fetch("http://localhost:3000/fabrika/sehir-siparis");
    const data = await res.json();
    console.log("📊 Şehir verisi:", data);

    if (!Array.isArray(data) || data.length === 0) return;

    const canvas = document.getElementById("sehirBazliGrafik");

    // Chart.js 4'te canvas temizlenmeden tekrar çizim yapılırsa hata verir
    if (Chart.getChart("sehirBazliGrafik")) {
      Chart.getChart("sehirBazliGrafik").destroy();
    }

    new Chart(canvas, {
      type: "bar",
      data: {
        labels: data.map(d => d.sehir || "Bilinmiyor"),
        datasets: [{
          label: "Sipariş Sayısı",
          data: data.map(d => d.siparis_sayisi),
          backgroundColor: ["#7C3AED", "#3B82F6", "#F59E0B", "#10B981"]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#fff" } }
        },
        scales: {
          x: { ticks: { color: "#ccc" } },
          y: { ticks: { color: "#ccc" } }
        }
      }
    });

  } catch (err) {
    console.error("❌ Şehir bazlı grafik hatası:", err);
  }
}



// 🔹 3. Aylık Satış Grafiği
async function aylikSatisGrafikCiz() {
  try {
    const res = await fetch("http://localhost:3000/fabrika/aylik-satis");
    const data = await res.json();
    console.log("📈 Aylık satış verisi:", data);

    if (!Array.isArray(data) || data.length === 0) return;

    // 12 aylık sabit eksen
    const aylar = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
    const ayVerisi = aylar.map(ay => {
      const bulunan = data.find(d => d.ay === ay);
      return bulunan ? bulunan.siparis_sayisi : 0;
    });

    const canvas = document.getElementById("aylikSatisGrafik");

    if (Chart.getChart("aylikSatisGrafik")) Chart.getChart("aylikSatisGrafik").destroy();

    new Chart(canvas, {
      type: "line",
      data: {
        labels: aylar,
        datasets: [{
          label: "Sipariş Sayısı",
          data: ayVerisi,
          borderColor: "#7C3AED",
          backgroundColor: "rgba(124, 58, 237, 0.2)",
          fill: true,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: "#7C3AED"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: "#fff" } },
          tooltip: { enabled: true }
        },
        scales: {
          x: {
            ticks: { color: "#ccc", font: { size: 13 } },
            grid: { display: false }
          },
          y: {
            ticks: { color: "#aaa" },
            grid: { color: "rgba(255,255,255,0.1)" }
          }
        }
      }
    });

  } catch (err) {
    console.error("❌ Aylık satış grafiği hatası:", err);
  }
}


