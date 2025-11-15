document.addEventListener("DOMContentLoaded", () => {
  const tabloBody = document.querySelector("#uretim-tablosu tbody");
  const modal = document.getElementById("siparisDetayModal");
  const closeBtn = document.querySelector(".close-btn");

  if (!tabloBody || !modal) return;

  // 🔹 1. Hemen gösterilecek örnek veriler
  let data = [
    {
      siparis_id: "ÜE-001",
      urun_adi: "Gül Parfümü",
      miktar: "350 / 500",
      ilerleme: 70,
      baslangic_tarihi: "2025-11-05",
      bitis_tarihi: "2025-11-12",
      durum: "Üretimde",
    },
    {
      siparis_id: "ÜE-004",
      urun_adi: "Papatya Özü",
      miktar: "0 / 400",
      ilerleme: 0,
      baslangic_tarihi: "2025-11-09",
      bitis_tarihi: "2025-11-16",
      durum: "Beklemede",
    },
  ];

  // 🔹 2. Tabloyu çizen fonksiyon
  function tabloyuCiz() {
    tabloBody.innerHTML = "";
    data.forEach((kayit) => {
      const baslangic = new Date(kayit.baslangic_tarihi).toLocaleDateString("tr-TR");
      const bitis = new Date(kayit.bitis_tarihi).toLocaleDateString("tr-TR");

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${kayit.siparis_id}</td>
        <td>${kayit.urun_adi}</td>
        <td>${kayit.miktar}</td>
        <td>
          <div class="progress-bar">
            <div class="progress-bar-inner" style="width:${kayit.ilerleme}%;">${kayit.ilerleme}%</div>
          </div>
        </td>
        <td>${baslangic}</td>
        <td>${bitis}</td>
        <td>7 gün</td>
        <td><span class="badge ${kayit.durum === "Beklemede" ? "onay-bekliyor" : "uretimde"}">${kayit.durum}</span></td>
        <td><button class="btn-detay" data-id="${kayit.siparis_id}">Detay</button></td>
      `;
      tabloBody.appendChild(tr);
    });

    // Detay butonları aktif
    tabloBody.querySelectorAll(".btn-detay").forEach((btn) => {
      btn.addEventListener("click", () => {
        const siparis = data.find((k) => k.siparis_id === btn.dataset.id);
        if (!siparis) return;
        document.getElementById("detayEmirNo").textContent = siparis.siparis_id;
        document.getElementById("detayUrun").textContent = siparis.urun_adi;
        document.getElementById("detayMiktar").textContent = siparis.miktar;
        document.getElementById("detayIlerleme").textContent = `${siparis.ilerleme}%`;
        document.getElementById("detayBaslangic").textContent = siparis.baslangic_tarihi;
        document.getElementById("detayBitis").textContent = siparis.bitis_tarihi;
        document.getElementById("detayDurum").textContent = siparis.durum;
        modal.style.display = "flex";
      });
    });
  }

  // 🔹 3. Sayfa açılır açılmaz çiz (hiç bekletmeden)
  tabloyuCiz();

  // 🔹 4. Arka planda veriyi çek (gelirse tabloyu yenile)
  fetch("http://localhost:3000/uretim")
    .then((res) => (res.ok ? res.json() : Promise.reject()))
    .then((json) => {
      if (Array.isArray(json) && json.length) {
        data = json;
        tabloyuCiz();
      }
    })
    .catch(() => console.warn("⚠️ Backend bağlantısı başarısız, örnek veriyle devam ediliyor."));

  // �
})