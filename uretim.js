document.addEventListener("DOMContentLoaded", () => {
  const tabloBody = document.querySelector("#uretim-tablosu tbody");
  if (!tabloBody) return;

  async function uretimListesiniGetir() {
    try {
      const res = await fetch("http://localhost:3000/uretim");
      const data = await res.json();
      console.log("📦 Üretim listesi:", data);

      tabloBody.innerHTML = "";

      if (!data || data.length === 0) {
        tabloBody.innerHTML = `
          <tr><td colspan="9" style="text-align:center;">Şu anda üretimde sipariş bulunmuyor.</td></tr>
        `;
        return;
      }

      data.forEach(kayit => {
        const baslangic = kayit.baslangic_tarihi
          ? new Date(kayit.baslangic_tarihi).toLocaleDateString("tr-TR")
          : "-";

        const bitis = kayit.bitis_tarihi
          ? new Date(kayit.bitis_tarihi).toLocaleDateString("tr-TR")
          : "-";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${kayit.siparis_id}</td>
          <td>${kayit.bayi_adi || "-"}</td>
          <td>${kayit.miktar || "-"}</td>
          <td>
            <div class="progress-bar">
              <div class="progress-bar-inner" style="width: 50%;"></div>
            </div>
          </td>
          <td>${baslangic}</td>
          <td>${bitis}</td>
          <td>7 gün</td>
          <td><span class="badge uretimde">Üretimde</span></td>
          <td>
            <button class="btn-onayla btn-uretim-tamamla" data-id="${kayit.siparis_id}">
              Üretimi Tamamla
            </button>
          </td>
        `;
        tabloBody.appendChild(tr);
      });

      document.querySelectorAll(".btn-uretim-tamamla").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;
          const onay = confirm(`Sipariş ${id} için üretimi tamamlamak istiyor musunuz?`);
          if (!onay) return;
          await uretimiTamamla(id);
          await uretimListesiniGetir();
        });
      });

    } catch (err) {
      console.error("❌ Üretim listesi alınırken hata:", err);
    }
  }

  async function uretimiTamamla(siparisId) {
    try {
      const res = await fetch(`http://localhost:3000/uretim/${siparisId}/tamamla`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      console.log("✅ Üretim tamamlandı:", data);
      alert(`Sipariş ${siparisId} için üretim tamamlandı.`);
    } catch (err) {
      console.error("❌ Üretim tamamlama hatası:", err);
    }
  }

  uretimListesiniGetir();
});

