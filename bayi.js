// bayi.js
document.addEventListener("DOMContentLoaded", () => {
  // =============== 📋 BAYİLERİ LİSTELEME ===================
  async function bayileriGetir() {
    try {
      const res = await fetch("http://localhost:3000/bayiler");
      if (!res.ok) throw new Error("Sunucudan yanıt alınamadı");

      const bayiler = await res.json();
      console.log("📦 Gelen bayiler:", bayiler);

      const tablo = document.querySelector("#bayi-tablosu tbody");
      tablo.innerHTML = "";

      bayiler.forEach((b) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${b.bayi_adi}</td>
          <td>${b.sehir}</td>
          <td>${b.telefon_no}</td>
          <td>-</td>
          <td>Aktif</td>
          <td><button class="btn-detay">Detay</button></td>
        `;
        tablo.appendChild(tr);
      });
    } catch (err) {
      console.error("❌ Bayiler alınamadı:", err);
    }
  }

  // Sayfa yüklenince bayileri getir
  bayileriGetir();

  // =============== 🧱 MODAL AÇ / KAPAT ======================
  const yeniBayiBtn   = document.getElementById("yeni-bayi-btn");
  const yeniBayiModal = document.getElementById("yeni-bayi-modal");
  const modalKapat    = document.getElementById("modal-kapat-btn-yeni");
  const modalIptal    = document.getElementById("modal-iptal-btn-yeni");

  if (yeniBayiBtn && yeniBayiModal) {
    yeniBayiBtn.addEventListener("click", () => (yeniBayiModal.style.display = "flex"));
    [modalKapat, modalIptal].forEach(el =>
      el && el.addEventListener("click", () => (yeniBayiModal.style.display = "none"))
    );
  }

  // =============== ✉️ YENİ BAYİ EKLEME =====================
  const form = document.getElementById("yeni-bayi-formu");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const bayi_adi   = document.getElementById("bayi-adi").value.trim();
    const sehir      = document.getElementById("bayi-sehir").value.trim();
    const telefon_no = document.getElementById("bayi-iletisim").value.trim();

    if (!bayi_adi || !sehir || !telefon_no) {
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/bayiler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bayi_adi, sehir, telefon_no }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert("Hata: " + (data?.error || "Bilinmeyen hata"));
        return;
      }

      console.log("✅ Yeni bayi eklendi:", data);
      alert("Yeni bayi başarıyla eklendi!");

      // Formu temizle ve kapat
      form.reset();
      if (yeniBayiModal) yeniBayiModal.style.display = "none";

      // Tabloyu yenile
      await bayileriGetir();
    } catch (err) {
      console.error("❌ İstek hatası:", err);
      alert("Sunucuya bağlanırken hata oluştu.");
    }
  });
});