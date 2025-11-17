// =====================================================
// ÜRETİM PLANLAMA - FINAL SÜRÜM
// (Modal hataları giderildi + ürün kırılımı otomatik)
// =====================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Üretim.js yüklendi.");

  let uretimSiparisleri = [];
  let secilenSiparisId = null;

  // ------------------------ MODAL ------------------------
  const modal = document.getElementById("siparisDetayModal");
  const closeBtn = modal?.querySelector(".close-btn");

  const detayEmirNo = document.getElementById("detayEmirNo");
  const detayUrun = document.getElementById("detayUrun");
  const detayMiktar = document.getElementById("detayMiktar");
  const detayBaslangic = document.getElementById("detayBaslangic");
  const detayBitis = document.getElementById("detayBitis");
  const detayDurum = document.getElementById("detayDurum");

  const btnTamamla = document.getElementById("btnTamamla");
  const btnBeklemede = document.getElementById("btnBeklemede");

  // =======================================================
  // DETAY BUTONLARI BAĞLAMA
  // =======================================================
  function detayButonlariEkle() {
    const detayButtons = document.querySelectorAll(".btn-detay");

    detayButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = Number(btn.dataset.id);
        const siparis = uretimSiparisleri.find((s) => s.siparis_id === id);

        if (!siparis) return;

        secilenSiparisId = id;

        // Emir No
        const emirNoYazi = `ÜE-${String(id).padStart(3, "0")}`;
        detayEmirNo.textContent = emirNoYazi;

        // Ürün Adı doğrudan yaz
        detayUrun.textContent = siparis.urun_adi;

        // -----------------------------
        // 🔥 ÜRÜNLERİ OTOMATİK AYIR + MİKTARI BÖL
        // -----------------------------
        const urunListesi = siparis.urun_adi.split(",").map(u => u.trim());
        const toplam = Number(siparis.miktar);
        const kisiBasi = Math.floor(toplam / urunListesi.length);

        detayMiktar.innerHTML = urunListesi
          .map(u => `• ${u} → ${kisiBasi} adet`)
          .join("<br>");
        // -----------------------------

        // Tarihler
        detayBaslangic.textContent = new Date(siparis.baslangic_tarihi)
          .toISOString()
          .split("T")[0];

        detayBitis.textContent = new Date(siparis.bitis_tarihi)
          .toISOString()
          .split("T")[0];

        // Durum
        const satir = btn.closest("tr");
        const badge = satir.querySelector(".badge");
        detayDurum.textContent = badge?.innerText.trim() || "-";

        modal.style.display = "flex";
      });
    });
  }

  // =======================================================
  // ÜRETİM SİPARİŞLERİNİ GETİR
  // =======================================================
  async function uretimdekiSiparisleriGetir() {
    try {
      const res = await fetch("http://localhost:3000/uretim");
      const siparisler = await res.json();

      uretimSiparisleri = siparisler;

      const tbody = document.querySelector("#uretim-tablosu tbody");
      tbody.innerHTML = "";

      siparisler.forEach((s) => {
        const bitis = new Date(s.bitis_tarihi);
        const kalanGun = Math.ceil(
          (bitis - new Date()) / (1000 * 60 * 60 * 24)
        );

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>ÜE-${String(s.siparis_id).padStart(3, "0")}</td>
          <td>${s.urun_adi}</td>
          <td>${new Date(s.baslangic_tarihi).toISOString().split("T")[0]}</td>
          <td>${new Date(s.bitis_tarihi).toISOString().split("T")[0]}</td>
          <td>${kalanGun} gün</td>
          <td><span class="badge uretimde">Devam Ediyor</span></td>
          <td><button class="btn-detay" data-id="${s.siparis_id}">Detay</button></td>
        `;

        tbody.appendChild(tr);
      });

      detayButonlariEkle();
    } catch (err) {
      console.error("❌ Veri alınamadı:", err);
    }
  }

  uretimdekiSiparisleriGetir();

  // ------------------------ MODAL KAPATMA ------------------------
  closeBtn?.addEventListener("click", () => (modal.style.display = "none"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.style.display = "none";
  });

  // =======================================================
  // ✔ TAMAMLANDI BUTONU
  // =======================================================
  btnTamamla?.addEventListener("click", async () => {
    if (!secilenSiparisId) return alert("Sipariş bulunamadı!");

    try {
      const res = await fetch(
        `http://localhost:3000/uretim/${secilenSiparisId}/tamamla`,
        { method: "POST" }
      );
      const data = await res.json();

      alert("✔ " + data.message);
      modal.style.display = "none";
      uretimdekiSiparisleriGetir();
    } catch (err) {
      console.error(err);
    }
  });

  // =======================================================
  // ✔ BEKLEMEDE BUTONU
  // =======================================================
  btnBeklemede?.addEventListener("click", async () => {
    if (!secilenSiparisId) return alert("Sipariş bulunamadı!");

    try {
      const res = await fetch(
        `http://localhost:3000/uretim/${secilenSiparisId}/beklet`,
        { method: "POST" }
      );
      const data = await res.json();

      alert("⏳ " + data.message);
      modal.style.display = "none";
      uretimdekiSiparisleriGetir();
    } catch (err) {
      console.error(err);
    }
  });

  console.log("🔹 Üretim planlama tamamen hazır.");
});
