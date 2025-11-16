document.addEventListener("DOMContentLoaded", () => {
  console.log("🚀 urunler.js yüklendi!");

  const tablo = document.querySelector("#urun-tablosu tbody");
  const modal = document.getElementById("yeni-urun-modal");
  const yeniUrunBtn = document.getElementById("yeni-urun-btn");
  const modalKapatBtn = document.getElementById("modal-kapat-btn");
  const modalIptalBtn = document.getElementById("modal-iptal-btn");
  const form = document.getElementById("yeni-urun-formu");
  const aramaInput = document.getElementById("urun-arama");

  // Tarihi güncelle
  const tarihSpan = document.getElementById("tarih-span");
  if (tarihSpan) {
    tarihSpan.textContent = new Date().toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "long"
    });
  }

  // =============== 📋 ÜRÜNLERİ LİSTELEME ===================
  async function urunleriGetir() {
    try {
      const res = await fetch("http://localhost:3000/urunler");
      if (!res.ok) throw new Error("Sunucudan yanıt alınamadı");

      const urunler = await res.json();
      console.log("📦 Gelen ürünler:", urunler);

      if (!tablo) {
        console.error("❌ Tablo bulunamadı!");
        return;
      }
      tablo.innerHTML = "";

      if (urunler.length === 0) {
        tablo.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 40px; color: #888;">
              Henüz ürün eklenmemiş. "Yeni Ürün Ekle" butonuna tıklayarak ürün ekleyebilirsiniz.
            </td>
          </tr>
        `;
        return;
      }

      urunler.forEach((urun) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${urun.urun_id}</td>
          <td>${urun.urun_kodu}</td>
          <td>${urun.urun_adi}</td>
          <td>${urun.urun_tip}</td>
          <td>${urun.birim}</td>
          <td>${parseFloat(urun.fiyat).toFixed(2)} ₺</td>
          <td>${urun.mevcut_stok}</td>
          <td>
            <button class="btn-iptal-et urun-sil-btn" data-id="${urun.urun_id}" data-adi="${urun.urun_adi}">
              Sil
            </button>
          </td>
        `;
        tablo.appendChild(tr);
      });

      // Sil butonlarına event listener ekle
      document.querySelectorAll('.urun-sil-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          const urunId = this.getAttribute('data-id');
          const urunAdi = this.getAttribute('data-adi');

          if (!confirm(`"${urunAdi}" ürününü silmek istediğinizden emin misiniz?`)) {
            return;
          }

          try {
            const res = await fetch(`http://localhost:3000/urunler/${urunId}`, {
              method: 'DELETE'
            });

            if (res.ok) {
              alert('Ürün başarıyla silindi!');
              urunleriGetir();
            } else {
              const data = await res.json();
              alert('Hata: ' + (data?.error || 'Ürün silinemedi'));
            }
          } catch (err) {
            console.error('❌ Silme hatası:', err);
            alert('Sunucuya bağlanırken hata oluştu.');
          }
        });
      });
    } catch (err) {
      console.error("❌ Ürünler alınamadı:", err);
      if (tablo) {
        tablo.innerHTML = `
          <tr>
            <td colspan="8" style="text-align: center; padding: 40px; color: #EF4444;">
              ❌ Ürünler yüklenirken hata oluştu. Lütfen sayfayı yenileyin.
            </td>
          </tr>
        `;
      }
    }
  }

  // Sayfa yüklenince ürünleri getir
  urunleriGetir();

  // =============== 🔍 ARAMA FONKSİYONU ======================
  if (aramaInput) {
    aramaInput.addEventListener('input', function() {
      const aramaTerimi = this.value.toLocaleLowerCase('tr-TR').trim();
      const satirlar = document.querySelectorAll('#urun-tablosu tbody tr');

      satirlar.forEach(satir => {
        // Eğer "henüz ürün eklenmemiş" mesajı varsa atla
        if (satir.cells.length < 8) return;

        const urunKodu = satir.cells[1].textContent.toLocaleLowerCase('tr-TR');
        const urunAdi = satir.cells[2].textContent.toLocaleLowerCase('tr-TR');
        const urunTip = satir.cells[3].textContent.toLocaleLowerCase('tr-TR');

        if (urunKodu.includes(aramaTerimi) || urunAdi.includes(aramaTerimi) || urunTip.includes(aramaTerimi)) {
          satir.style.display = '';
        } else {
          satir.style.display = 'none';
        }
      });
    });
  }

  // =============== 🧱 MODAL AÇ / KAPAT ======================
  if (yeniUrunBtn && modal) {
    yeniUrunBtn.addEventListener("click", () => {
      console.log("✅ Modal açılıyor...");
      modal.style.display = "flex";
    });

    [modalKapatBtn, modalIptalBtn].forEach(btn => {
      if (btn) {
        btn.addEventListener("click", () => {
          console.log("❌ Modal kapatılıyor...");
          modal.style.display = "none";
          form.reset();
        });
      }
    });
  } else {
    console.error("❌ Modal veya buton bulunamadı!");
  }

  // =============== ✉️ YENİ ÜRÜN EKLEME =====================
  if (!form) {
    console.error("❌ Form bulunamadı!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    console.log("📤 Form submit edildi!");

    const urun_kodu = document.getElementById("urun-kodu").value.trim();
    const urun_adi = document.getElementById("urun-adi").value.trim();
    const urun_tip = document.getElementById("urun-tip").value.trim();
    const birim = document.getElementById("urun-birim").value;
    const fiyat = document.getElementById("urun-fiyat").value.trim();
    const mevcut_stok = document.getElementById("urun-stok").value.trim();

    console.log("📋 Form verileri:", { urun_kodu, urun_adi, urun_tip, birim, fiyat, mevcut_stok });

    if (!urun_kodu || !urun_adi || !urun_tip || !birim || !fiyat || !mevcut_stok) {
      console.warn("⚠️ Boş alan var!");
      alert("Lütfen tüm alanları doldurun.");
      return;
    }

    try {
      console.log("🌐 POST isteği gönderiliyor...");
      const res = await fetch("http://localhost:3000/urunler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urun_kodu, urun_adi, urun_tip, birim, fiyat, mevcut_stok }),
      });

      const data = await res.json();
      console.log("📥 Sunucu yanıtı:", data);

      if (!res.ok) {
        console.error("❌ Sunucu hatası:", data);
        alert("Hata: " + (data?.error || "Bilinmeyen hata"));
        return;
      }

      console.log("✅ Yeni ürün eklendi:", data);
      alert("Yeni ürün başarıyla eklendi!");

      // Formu temizle ve kapat
      form.reset();
      if (modal) modal.style.display = "none";

      // Tabloyu yenile
      await urunleriGetir();
    } catch (err) {
      console.error("❌ İstek hatası:", err);
      alert("Sunucuya bağlanırken hata oluştu.");
    }
  });
});
