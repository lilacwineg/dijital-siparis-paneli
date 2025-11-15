document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 bayi.js yüklendi!");

    // =============== 📋 BAYİLERİ LİSTELEME ===================
    async function bayileriGetir() {
      try {
        const res = await fetch("http://localhost:3000/bayiler");
        if (!res.ok) throw new Error("Sunucudan yanıt alınamadı");

        const bayiler = await res.json();
        console.log("📦 Gelen bayiler:", bayiler);

        const tablo = document.querySelector("#bayi-tablosu tbody");
        if (!tablo) {
          console.error("❌ Tablo bulunamadı!");
          return;
        }
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

    // =============== 🔍 ARAMA FONKSİYONU ======================
    const aramaInput = document.querySelector('.arama-kutusu input');
    if (aramaInput) {
      aramaInput.addEventListener('input', function() {
        const aramaTerimi = this.value.toLocaleLowerCase('tr-TR').trim();
        const satirlar = document.querySelectorAll('#bayi-tablosu tbody tr');

        satirlar.forEach(satir => {
          const bayiAdi = satir.cells[0].textContent.toLocaleLowerCase('tr-TR');
          const sehir = satir.cells[1].textContent.toLocaleLowerCase('tr-TR');

          // Sadece bayi adı ve şehir adında ara (Türkçe karakterler dahil)
          if (bayiAdi.includes(aramaTerimi) || sehir.includes(aramaTerimi)) {
            satir.style.display = '';
          } else {
            satir.style.display = 'none';
          }
        });
      });
    }

    // =============== 🧱 MODAL AÇ / KAPAT ======================
    const yeniBayiBtn   = document.getElementById("yeni-bayi-btn");
    const yeniBayiModal = document.getElementById("yeni-bayi-modal");
    const modalKapat    = document.getElementById("modal-kapat-btn-yeni");
    const modalIptal    = document.getElementById("modal-iptal-btn-yeni");

    console.log("🔍 Element kontrolü:");
    console.log("- yeniBayiBtn:", yeniBayiBtn);
    console.log("- yeniBayiModal:", yeniBayiModal);
    console.log("- modalKapat:", modalKapat);
    console.log("- modalIptal:", modalIptal);

    if (yeniBayiBtn && yeniBayiModal) {
      yeniBayiBtn.addEventListener("click", () => {
        console.log("✅ Modal açılıyor...");
        yeniBayiModal.style.display = "flex";
      });
      [modalKapat, modalIptal].forEach(el =>
        el && el.addEventListener("click", () => {
          console.log("❌ Modal kapatılıyor...");
          yeniBayiModal.style.display = "none";
        })
      );
    } else {
      console.error("❌ Modal veya buton bulunamadı!");
    }

    // =============== ✉️ YENİ BAYİ EKLEME =====================
    const form = document.getElementById("yeni-bayi-formu");
    console.log("📝 Form:", form);

    if (!form) {
      console.error("❌ Form bulunamadı!");
      return;
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      console.log("📤 Form submit edildi!");

      const bayi_adi   = document.getElementById("bayi-adi").value.trim();
      const sehir      = document.getElementById("bayi-sehir").value.trim();
      const telefon_no = document.getElementById("bayi-iletisim").value.trim();

      console.log("📋 Form verileri:", { bayi_adi, sehir, telefon_no });

      if (!bayi_adi || !sehir || !telefon_no) {
        console.warn("⚠️ Boş alan var!");
        alert("Lütfen tüm alanları doldurun.");
        return;
      }

      try {
        console.log("🌐 POST isteği gönderiliyor...");
        const res = await fetch("http://localhost:3000/bayiler", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bayi_adi, sehir, telefon_no }),
        });

        const data = await res.json();
        console.log("📥 Sunucu yanıtı:", data);

        if (!res.ok) {
          console.error("❌ Sunucu hatası:", data);
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