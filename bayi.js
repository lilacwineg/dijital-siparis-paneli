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
            <td>Aktif</td>
            <td><button class="btn-detay" data-bayi-id="${b.bayi_id}" data-bayi-adi="${b.bayi_adi}" data-sehir="${b.sehir}" data-telefon="${b.telefon_no}" data-adres="${b.adres || ''}">Detay</button></td>
          `;
          tablo.appendChild(tr);
        });

        // Detay butonlarına event listener ekle
        detayButonlariniDinle();
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

    // =============== 📊 DETAY MODAL FONKSİYONLARI =====================

    let aktifBayiId = null;

    function detayButonlariniDinle() {
      const detayButonlari = document.querySelectorAll('.btn-detay');
      detayButonlari.forEach(btn => {
        if (btn.hasAttribute('data-bayi-id')) {
          btn.addEventListener('click', () => {
            const bayiId = btn.getAttribute('data-bayi-id');
            const bayiAdi = btn.getAttribute('data-bayi-adi');
            const sehir = btn.getAttribute('data-sehir');
            const telefon = btn.getAttribute('data-telefon');
            const adres = btn.getAttribute('data-adres');

            detayModalAc(bayiId, bayiAdi, sehir, telefon, adres);
          });
        }
      });
    }

    async function detayModalAc(bayiId, bayiAdi, sehir, telefon, adres) {
      aktifBayiId = bayiId;

      const modal = document.getElementById('bayi-detay-modal');
      document.getElementById('modal-bayi-adi').textContent = bayiAdi;
      document.getElementById('modal-bayi-sehir').textContent = `Şehir: ${sehir}`;
      document.getElementById('modal-bayi-iletisim').textContent = `İletişim: ${telefon}`;

      // Düzenleme formunu doldur
      document.getElementById('duzenle-adi').value = bayiAdi;
      document.getElementById('duzenle-sehir').value = sehir;
      document.getElementById('duzenle-iletisim').value = telefon;
      document.getElementById('duzenle-adres').value = adres || '';

      modal.style.display = 'flex';

      // Sipariş geçmişini yükle
      await siparisGecmisiYukle(bayiId);
    }

    async function siparisGecmisiYukle(bayiId) {
      try {
        const res = await fetch(`http://localhost:3000/siparisler?bayi_id=${bayiId}`);
        const siparisler = await res.json();

        const tbody = document.querySelector('#tab-siparis-gecmisi tbody');
        if (!tbody) return;

        tbody.innerHTML = '';

        if (siparisler.length === 0) {
          tbody.innerHTML = '<tr><td colspan="4" style="text-align: center; padding: 20px;">Henüz sipariş yok</td></tr>';
          return;
        }

        for (const siparis of siparisler) {
          // Her sipariş için detayları al
          const detayRes = await fetch(`http://localhost:3000/siparisler/${siparis.siparis_id}/detay`);
          const detaylar = await detayRes.json();

          const urunListesi = detaylar.map(d => `${d.urun_adi} (${d.miktar} ${d.birim})`).join(', ') || 'Detay yok';

          const tarih = new Date(siparis.tarih).toLocaleDateString('tr-TR');
          const durumBadge = getBadgeClass(siparis.durum);

          const tr = document.createElement('tr');
          tr.style.borderBottom = '1px solid #27273A';
          tr.innerHTML = `
            <td style="padding: 10px 0;">${tarih}</td>
            <td style="padding: 10px 0;">${urunListesi}</td>
            <td style="padding: 10px 0;">${siparis.toplam_tutar} ₺</td>
            <td style="padding: 10px 0;"><span class="badge ${durumBadge}">${siparis.durum}</span></td>
          `;
          tbody.appendChild(tr);
        }
      } catch (err) {
        console.error('❌ Sipariş geçmişi alınamadı:', err);
      }
    }

    function getBadgeClass(durum) {
      const durumMap = {
        'Tamamlandı': 'tamamlandi',
        'Tamamlandi': 'tamamlandi',
        'Sevkiyatta': 'sevkiyatta',
        'Üretimde': 'uretimde',
        'Onay Bekliyor': 'beklemede',
        'Onaylandı': 'onaylandi',
        'İptal': 'iptal'
      };
      return durumMap[durum] || 'beklemede';
    }

    // Modal kapatma
    const detayModal = document.getElementById('bayi-detay-modal');
    const detayModalKapat = document.getElementById('modal-kapat-btn');

    if (detayModalKapat) {
      detayModalKapat.addEventListener('click', () => {
        detayModal.style.display = 'none';
        document.getElementById('duzenle-form-alani').style.display = 'none';
        document.getElementById('duzenle-ana-butonlar').style.display = 'flex';
      });
    }

    // Düzenleme formu aç/kapat
    const duzenleFormAcBtn = document.getElementById('duzenle-form-ac-btn');
    const duzenleIptalBtn = document.getElementById('duzenle-iptal-btn');

    if (duzenleFormAcBtn) {
      duzenleFormAcBtn.addEventListener('click', () => {
        document.getElementById('duzenle-ana-butonlar').style.display = 'none';
        document.getElementById('duzenle-form-alani').style.display = 'block';
      });
    }

    if (duzenleIptalBtn) {
      duzenleIptalBtn.addEventListener('click', () => {
        document.getElementById('duzenle-form-alani').style.display = 'none';
        document.getElementById('duzenle-ana-butonlar').style.display = 'flex';
      });
    }

    // Bayi düzenleme formu submit
    const duzenlemeFormu = document.getElementById('bayi-duzenleme-formu');
    if (duzenlemeFormu) {
      duzenlemeFormu.addEventListener('submit', async (e) => {
        e.preventDefault();

        const yeniBayiAdi = document.getElementById('duzenle-adi').value.trim();
        const yeniSehir = document.getElementById('duzenle-sehir').value.trim();
        const yeniTelefon = document.getElementById('duzenle-iletisim').value.trim();
        const yeniAdres = document.getElementById('duzenle-adres').value.trim();

        try {
          const res = await fetch(`http://localhost:3000/bayiler/${aktifBayiId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              bayi_adi: yeniBayiAdi,
              sehir: yeniSehir,
              telefon_no: yeniTelefon,
              adres: yeniAdres
            })
          });

          if (res.ok) {
            alert('Bayi bilgileri güncellendi!');
            detayModal.style.display = 'none';
            await bayileriGetir();
          } else {
            alert('Güncelleme başarısız!');
          }
        } catch (err) {
          console.error('❌ Güncelleme hatası:', err);
          alert('Sunucuya bağlanırken hata oluştu.');
        }
      });
    }

    // Bayi silme
    const bayiSilBtn = document.getElementById('bayi-sil-btn');
    if (bayiSilBtn) {
      bayiSilBtn.addEventListener('click', async () => {
        if (!confirm('Bu bayiyi silmek istediğinizden emin misiniz?')) {
          return;
        }

        try {
          const res = await fetch(`http://localhost:3000/bayiler/${aktifBayiId}`, {
            method: 'DELETE'
          });

          if (res.ok) {
            alert('Bayi silindi!');
            detayModal.style.display = 'none';
            await bayileriGetir();
          } else {
            alert('Silme başarısız!');
          }
        } catch (err) {
          console.error('❌ Silme hatası:', err);
          alert('Sunucuya bağlanırken hata oluştu.');
        }
      });
    }

  });