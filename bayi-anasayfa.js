document.addEventListener("DOMContentLoaded", () => {
  const aktifKullanici = JSON.parse(localStorage.getItem("aktifKullanici"));

  // Oturum yoksa login'e at
  if (!aktifKullanici) {
    alert("Oturum bulunamadı. Lütfen giriş yapın.");
    window.location.href = "index.html";
    return;
  }

  console.log("✅ Aktif kullanıcı:", aktifKullanici);

  // 🔹 Chart instance'larını saklamak için global değişkenler
  window.bayiEnCokUrunChart = null;

  // 🔹 Üst bilgiler
  const hosBayi = document.getElementById("hos-geldiniz-bayi");
  const bayiAdSpan = document.getElementById("bayi-ad");
  const bugunTarihSpan = document.getElementById("bugun-tarih");

  // Bayi adını göster (varsa), yoksa kullanıcı adını göster
  const gorunecekAd = aktifKullanici.bayi_adi || aktifKullanici.kullanici_adi;

  if (hosBayi) hosBayi.textContent = gorunecekAd;
  if (bayiAdSpan) bayiAdSpan.textContent = gorunecekAd;

  if (bugunTarihSpan) {
    bugunTarihSpan.textContent = new Date().toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "long"
    });
  }

  // 🔹 Logout butonu
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Çıkış yapmak istediğinize emin misiniz?")) {
        localStorage.removeItem("aktifKullanici");
        console.log("🚪 Çıkış yapıldı");
        window.location.href = "index.html";
      }
    });
  }

  // 🔹 Bu bayiinin siparişlerini çek
  if (aktifKullanici.bayi_id) {
    bayiSiparisleriniGetir(aktifKullanici.bayi_id);
    enCokSiparisEdilenUrunleriGetir(aktifKullanici.bayi_id);
  } else {
    console.warn("Bu kullanıcıya bağlı bayi_id yok.");
  }
});

async function bayiSiparisleriniGetir(bayiId) {
  try {
    const res = await fetch(`http://localhost:3000/siparisler?bayi_id=${bayiId}`);
    const siparisler = await res.json();

    // Son 3 sipariş tablosu
    const tbody = document.querySelector("#son-siparisler tbody");
    if (tbody) {
      tbody.innerHTML = "";

      const sonUc = siparisler.slice(0, 3); // tarih DESC zaten backend'de

      if (sonUc.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="4" style="text-align:center;">Henüz siparişiniz bulunmuyor.</td>`;
        tbody.appendChild(tr);
      } else {
        sonUc.forEach(s => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>#${s.siparis_id}</td>
            <td><span class="badge ${getDurumClass(s.durum)}">${s.durum}</span></td>
            <td>${new Date(s.tarih).toLocaleDateString("tr-TR")}</td>
            <td><button class="btn-detay" onclick="siparisDetayGoster(${s.siparis_id})">Detay</button></td>
          `;
          tbody.appendChild(tr);
        });
      }
    }

    // Kartları doldur (son 30 güne göre)
    guncelleKartlar(siparisler);
  } catch (err) {
    console.error("❌ Bayi siparişleri alınırken hata:", err);
  }
}

function guncelleKartlar(siparisler) {
  const simdi = new Date();
  const otuzGunOnce = new Date();
  otuzGunOnce.setDate(simdi.getDate() - 30);

  // 1. Toplam Siparişlerim = Bugüne kadar verilen TÜM siparişler
  const toplamSiparis = siparisler.length;

  // 2. Bekleyen Siparişlerim = Sadece 'Onay Bekliyor' durumundaki siparişler
  const bekleyenSiparisler = siparisler.filter(s => s.durum === "Onay Bekliyor").length;

  // 3. Teslim Edilen = Son 1 ayda (30 gün) teslim edilmiş siparişler
  const son1AydaTeslimEdilen = siparisler.filter(s => {
    const t = new Date(s.tarih);
    return s.durum === "Tamamlandı" && t >= otuzGunOnce && t <= simdi;
  }).length;

  const kartToplam = document.querySelector(".info-card.purple .kart-deger");
  const kartBekleyen = document.querySelector(".info-card.brown .kart-deger");
  const kartTeslim = document.querySelector(".info-card.green .kart-deger");

  if (kartToplam) kartToplam.textContent = toplamSiparis;
  if (kartBekleyen) kartBekleyen.textContent = bekleyenSiparisler;
  if (kartTeslim) kartTeslim.textContent = son1AydaTeslimEdilen;
}

function getDurumClass(durum) {
  const durumMap = {
    "Onay Bekliyor": "onay-bekliyor",
    "Onaylandı": "onaylandi",
    "Üretimde": "uretimde",
    "Sevkiyatta": "sevkiyatta",
    "Tamamlandı": "tamamlandi",
    "İptal": "iptal"
  };
  return durumMap[durum] || "";
}

// Modal kontrolleri
const siparisDetayModal = document.getElementById("siparis-detay-modal");
const modalKapatBtn = document.getElementById("modal-kapat-btn");

if (modalKapatBtn) {
  modalKapatBtn.addEventListener("click", () => {
    siparisDetayModal.style.display = "none";
  });
}

// Modal dışına tıklandığında kapat
window.addEventListener("click", (e) => {
  if (e.target === siparisDetayModal) {
    siparisDetayModal.style.display = "none";
  }
});

// Sipariş detaylarını göster
async function siparisDetayGoster(siparisId) {
  try {
    // Modal'ı aç
    siparisDetayModal.style.display = "flex";
    document.getElementById("modal-siparis-no").textContent = `#${siparisId}`;

    // Detayları getir
    const res = await fetch(`http://localhost:3000/siparisler/${siparisId}/detay`);
    if (!res.ok) throw new Error("Sipariş detayları alınamadı");

    const detaylar = await res.json();
    console.log("📦 Sipariş detayları:", detaylar);

    // Tabloyu doldur
    const tbody = document.querySelector("#siparis-detay-tablosu tbody");
    tbody.innerHTML = "";

    if (detaylar.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="4" style="text-align: center; padding: 20px; color: #888;">
            Bu siparişe ait ürün bilgisi bulunamadı
          </td>
        </tr>
      `;
    } else {
      detaylar.forEach(d => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="padding: 12px 0; color: white;">${d.urun_adi || "Bilinmeyen Ürün"}</td>
          <td style="padding: 12px 0; color: white; text-align: center;">${d.urun_tip || "-"}</td>
          <td style="padding: 12px 0; color: white; text-align: center;">${d.miktar}</td>
          <td style="padding: 12px 0; color: white; text-align: center;">${d.birim || "-"}</td>
        `;
        tr.style.borderBottom = "1px solid #27273A";
        tbody.appendChild(tr);
      });
    }
  } catch (err) {
    console.error("❌ Sipariş detayları yüklenirken hata:", err);
    alert("Sipariş detayları yüklenirken hata oluştu.");
  }
}

// En çok sipariş edilen ürünleri getir ve grafik çiz
async function enCokSiparisEdilenUrunleriGetir(bayiId) {
  try {
    const res = await fetch(`http://localhost:3000/siparisler/en-cok-siparis-edilen-urunler?bayi_id=${bayiId}`);
    if (!res.ok) throw new Error("En çok sipariş edilen ürünler alınamadı");

    const urunler = await res.json();
    console.log("📊 En çok sipariş edilen ürünler:", urunler);

    const ctx = document.getElementById("bayiEnCokUrunGrafik");
    if (!ctx) return;

    // Eski chart varsa destroy et
    if (window.bayiEnCokUrunChart) {
      window.bayiEnCokUrunChart.destroy();
    }

    window.bayiEnCokUrunChart = new Chart(ctx, {
      type: "bar",
      data: {
        labels: urunler.map(u => u.urun_adi),
        datasets: [{
          label: "Toplam Miktar",
          data: urunler.map(u => u.toplam_miktar),
          backgroundColor: "rgba(139, 92, 246, 0.7)",
          borderColor: "rgba(139, 92, 246, 1)",
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            labels: { color: "#E5E7EB" }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: "#9CA3AF" },
            grid: { color: "rgba(75, 85, 99, 0.3)" }
          },
          x: {
            ticks: { color: "#9CA3AF" },
            grid: { color: "rgba(75, 85, 99, 0.3)" }
          }
        }
      }
    });
  } catch (err) {
    console.error("❌ En çok sipariş edilen ürünler yüklenirken hata:", err);
  }
}

