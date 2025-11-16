document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ bayi-siparislerim.js yüklendi");

  const aktifKullanici = JSON.parse(localStorage.getItem("aktifKullanici"));
  console.log("📋 Aktif kullanıcı:", aktifKullanici);

  // Oturum yoksa veya bayi değilse login'e yönlendir
  if (!aktifKullanici) {
    alert("Oturum bulunamadı. Lütfen giriş yapın.");
    window.location.href = "index.html";
    return;
  }

  if (!aktifKullanici.bayi_id) {
    alert("Bu kullanıcı bir bayi değil. Lütfen bayi olarak giriş yapın.");
    console.error("❌ bayi_id bulunamadı:", aktifKullanici);
    window.location.href = "index.html";
    return;
  }

  console.log("✅ Bayi ID:", aktifKullanici.bayi_id);

  // Kullanıcı bilgilerini göster
  const kullaniciBilgisi = document.querySelector(".kullanici-bilgisi");
  if (kullaniciBilgisi) {
    const bayiAd = aktifKullanici.bayi_adi || aktifKullanici.kullanici_adi;
    const bugun = new Date().toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      weekday: "long"
    });
    kullaniciBilgisi.innerHTML = `
      ${bayiAd}
      <span>${bugun}</span>
    `;
  }

  // Siparişleri yükle
  bayiSiparisleriniYukle(aktifKullanici.bayi_id);

  // Tab sistemi
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      tabButtons.forEach(btn => btn.classList.remove("aktif"));
      tabContents.forEach(content => content.classList.remove("aktif"));

      button.classList.add("aktif");
      const targetId = button.dataset.target;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add("aktif");
      }
    });
  });
});

async function bayiSiparisleriniYukle(bayiId) {
  try {
    const res = await fetch(`http://localhost:3000/siparisler?bayi_id=${bayiId}`);
    if (!res.ok) throw new Error("Siparişler yüklenemedi");

    const siparisler = await res.json();
    console.log("📦 Gelen siparişler:", siparisler);

    // Kartları güncelle
    guncelleKartlar(siparisler);

    // Tabloları doldur
    const aktifSiparisler = siparisler.filter(s =>
      s.durum !== "Tamamlandı" && s.durum !== "İptal"
    );
    const gecmisSiparisler = siparisler.filter(s =>
      s.durum === "Tamamlandı" || s.durum === "İptal"
    );

    doldurAktifSiparisler(aktifSiparisler);
    doldurGecmisSiparisler(gecmisSiparisler);

  } catch (err) {
    console.error("❌ Siparişler yüklenirken hata:", err);
    alert("Siparişler yüklenirken hata oluştu.");
  }
}

function guncelleKartlar(siparisler) {
  const onayBekleyen = siparisler.filter(s => s.durum === "Onay Bekliyor").length;
  const hazirlanan = siparisler.filter(s =>
    s.durum === "Üretimde" || s.durum === "Sevkiyatta"
  ).length;

  // Son 30 gün tamamlanan
  const bugun = new Date();
  const otuzGunOnce = new Date();
  otuzGunOnce.setDate(bugun.getDate() - 30);

  const tamamlanan30Gun = siparisler.filter(s => {
    const siparisTarihi = new Date(s.tarih);
    return s.durum === "Tamamlandı" && siparisTarihi >= otuzGunOnce;
  }).length;

  // Kartları güncelle
  document.querySelector(".orange-gradient .kart-deger").textContent = onayBekleyen;
  document.querySelector(".blue-gradient .kart-deger").textContent = hazirlanan;
  document.querySelector(".green-gradient .kart-deger").textContent = tamamlanan30Gun;
}

function doldurAktifSiparisler(siparisler) {
  const tbody = document.querySelector("#aktif-siparisler-tablo tbody");
  if (!tbody) {
    console.warn("❌ Aktif siparişler tablosu bulunamadı");
    return;
  }

  tbody.innerHTML = "";

  if (siparisler.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" style="text-align: center; color: #888;">
          Aktif siparişiniz bulunmuyor
        </td>
      </tr>
    `;
    return;
  }

  siparisler.forEach(s => {
    const durumBadge = getDurumBadge(s.durum);
    const tarih = new Date(s.tarih).toLocaleDateString("tr-TR");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${s.siparis_id}</td>
      <td><span class="badge ${durumBadge.class}">${s.durum}</span></td>
      <td>${tarih}</td>
      <td><button class="btn-detay" onclick="siparisDetayGoster(${s.siparis_id})">Detay</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function doldurGecmisSiparisler(siparisler) {
  const tbody = document.querySelector("#gecmis-siparisler-tablo tbody");
  if (!tbody) {
    console.warn("❌ Geçmiş siparişler tablosu bulunamadı");
    return;
  }

  tbody.innerHTML = "";

  if (siparisler.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; color: #888;">
          Geçmiş siparişiniz bulunmuyor
        </td>
      </tr>
    `;
    return;
  }

  siparisler.forEach(s => {
    const durumBadge = getDurumBadge(s.durum);
    const tarih = new Date(s.tarih).toLocaleDateString("tr-TR");

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>#${s.siparis_id}</td>
      <td><span class="badge ${durumBadge.class}">${s.durum}</span></td>
      <td>${tarih}</td>
      <td>${s.toplam_tutar ? parseFloat(s.toplam_tutar).toFixed(2) + " ₺" : "-"}</td>
      <td><button class="btn-detay" onclick="siparisDetayGoster(${s.siparis_id})">Detay</button></td>
    `;
    tbody.appendChild(tr);
  });
}

function getDurumBadge(durum) {
  const badges = {
    "Onay Bekliyor": { class: "onay-bekliyor", emoji: "🟡" },
    "Onaylandı": { class: "onaylandi", emoji: "🟢" },
    "Üretimde": { class: "uretimde", emoji: "🔵" },
    "Sevkiyatta": { class: "sevkiyatta", emoji: "🟠" },
    "Tamamlandı": { class: "tamamlandi", emoji: "✅" },
    "İptal": { class: "iptal", emoji: "🔴" }
  };
  return badges[durum] || { class: "", emoji: "" };
}

// Modal açma/kapatma
const siparisDetayModal = document.getElementById("bayi-siparis-detay-modal");
const modalKapatBtn1 = document.getElementById("modal-kapat-btn-bayi-siparis");
const modalKapatBtn2 = document.getElementById("modal-kapat-btn-bayi-siparis-2");

if (modalKapatBtn1) {
  modalKapatBtn1.addEventListener("click", () => {
    siparisDetayModal.style.display = "none";
  });
}

if (modalKapatBtn2) {
  modalKapatBtn2.addEventListener("click", () => {
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
    document.getElementById("modal-siparis-no").textContent = siparisId;

    // Önce sipariş bilgisini al (durum kontrolü için)
    const aktifKullanici = JSON.parse(localStorage.getItem("aktifKullanici"));
    const siparisRes = await fetch(`http://localhost:3000/siparisler?bayi_id=${aktifKullanici.bayi_id}`);
    if (!siparisRes.ok) throw new Error("Sipariş bilgisi alınamadı");

    const siparisler = await siparisRes.json();
    const siparis = siparisler.find(s => s.siparis_id == siparisId);

    // Butonları kontrol et - "Onaylandı" ve "Sevkiyatta" durumlarında göster
    const btnTeslimAlindi = document.getElementById("btn-teslim-alindi");
    const btnEksikGeldi = document.getElementById("btn-eksik-geldi");

    if (siparis && (siparis.durum === "Onaylandı" || siparis.durum === "Sevkiyatta")) {
      btnTeslimAlindi.style.display = "inline-block";
      btnEksikGeldi.style.display = "inline-block";

      // Buton event listener'larını ekle (önce varsa eski listener'ları kaldır)
      btnTeslimAlindi.onclick = () => siparisOnayDurumuGuncelle(siparisId, "Tamamlandı");
      btnEksikGeldi.onclick = () => siparisOnayDurumuGuncelle(siparisId, "İptal");
    } else {
      btnTeslimAlindi.style.display = "none";
      btnEksikGeldi.style.display = "none";
    }

    // Detayları getir
    const res = await fetch(`http://localhost:3000/siparisler/${siparisId}/detay`);
    if (!res.ok) throw new Error("Sipariş detayları alınamadı");

    const detaylar = await res.json();
    console.log("📦 Sipariş detayları:", detaylar);

    // Tabloyu doldur
    const tbody = document.querySelector("#siparis-urun-tablosu tbody");
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

// Sipariş onay durumunu güncelle (Teslim Alındı / Eksik Geldi)
async function siparisOnayDurumuGuncelle(siparisId, yeniDurum) {
  const mesaj = yeniDurum === "Tamamlandı"
    ? "Bu siparişi teslim aldığınızı onaylıyor musunuz?"
    : "Bu siparişin eksik geldiğini bildirmek istiyor musunuz?";

  if (!confirm(mesaj)) {
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/siparisler/${siparisId}/durum`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ durum: yeniDurum })
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || "Durum güncellenemedi");
    }

    const basariMesaji = yeniDurum === "Tamamlandı"
      ? "✅ Sipariş teslim alındı olarak işaretlendi"
      : "⚠️ Sipariş eksik geldi olarak işaretlendi";

    alert(basariMesaji);

    // Modal'ı kapat ve sayfayı yenile
    siparisDetayModal.style.display = "none";
    const aktifKullanici = JSON.parse(localStorage.getItem("aktifKullanici"));
    bayiSiparisleriniYukle(aktifKullanici.bayi_id);

  } catch (err) {
    console.error("❌ Sipariş durumu güncellenirken hata:", err);
    alert("Hata: " + err.message);
  }
}
