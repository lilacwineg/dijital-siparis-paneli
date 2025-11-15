document.addEventListener("DOMContentLoaded", () => {
  const aktifKullanici = JSON.parse(localStorage.getItem("aktifKullanici"));

  // Oturum yoksa login'e at
  if (!aktifKullanici) {
    alert("Oturum bulunamadı. Lütfen giriş yapın.");
    window.location.href = "bayi-anasayfa.html";
    return;
  }

  // 🔹 Üst bilgiler
  const hosBayi = document.getElementById("hos-geldiniz-bayi");
  const bayiAdSpan = document.getElementById("bayi-ad");
  const bugunTarihSpan = document.getElementById("bugun-tarih");

  if (hosBayi) hosBayi.textContent = aktifKullanici.kullanici_adi;
  if (bayiAdSpan) bayiAdSpan.textContent = aktifKullanici.kullanici_adi;

  if (bugunTarihSpan) {
    bugunTarihSpan.textContent = new Date().toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // 🔹 Bu bayiinin siparişlerini çek
  if (aktifKullanici.bayi_id) {
    bayiSiparisleriniGetir(aktifKullanici.bayi_id);
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
        tr.innerHTML = `<td colspan="5" style="text-align:center;">Henüz siparişiniz bulunmuyor.</td>`;
        tbody.appendChild(tr);
      } else {
        sonUc.forEach(s => {
          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${s.siparis_id}</td>
            <td>-</td>
            <td>-</td>
            <td>${s.durum}</td>
            <td>${new Date(s.tarih).toLocaleDateString("tr-TR")}</td>
          `;
          // Ürün ve miktar siparis_detay tablosuna bağlıysa buraya join'li veri eklenebilir.
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

  const buAySiparisler = siparisler.filter(s => {
    const t = new Date(s.tarih);
    return t >= otuzGunOnce && t <= simdi;
  });

  const oncekiOtuzGun = new Date();
  oncekiOtuzGun.setDate(simdi.getDate() - 60);

  const oncekiAySiparisler = siparisler.filter(s => {
    const t = new Date(s.tarih);
    return t >= oncekiOtuzGun && t < otuzGunOnce;
  });

  const toplamBuAy = buAySiparisler.length;
  const toplamOncekiAy = oncekiAySiparisler.length;

  const bekleyen = siparisler.filter(s => s.durum !== "Tamamlandı" && s.durum !== "İptal").length;
  const teslimEdilen = siparisler.filter(s => s.durum === "Tamamlandı").length;

  const kartToplam = document.querySelector(".info-card.purple .kart-deger");
  const kartToplamTrend = document.querySelector(".info-card.purple .kart-trend");
  const kartBekleyen = document.querySelector(".info-card.brown .kart-deger");
  const kartTeslim = document.querySelector(".info-card.green .kart-deger");
  const kartTeslimTrend = document.querySelector(".info-card.green .kart-trend");
  const kartArtis = document.querySelector(".info-card.blue .kart-deger");
  const kartArtisAciklama = document.querySelector(".info-card.blue .kart-trend");

  if (kartToplam) kartToplam.textContent = toplamBuAy;
  if (kartToplamTrend) kartToplamTrend.textContent = `↑ Bu ay ${toplamBuAy} sipariş`;

  if (kartBekleyen) kartBekleyen.textContent = bekleyen;

  if (kartTeslim) kartTeslim.textContent = teslimEdilen;
  if (kartTeslimTrend) kartTeslimTrend.textContent = `↑ Bu ay ${buAySiparisler.filter(s => s.durum === "Tamamlandı").length}`;

  let artisYuzde = 0;
  if (toplamOncekiAy > 0) {
    artisYuzde = Math.round(((toplamBuAy - toplamOncekiAy) / toplamOncekiAy) * 100);
  } else if (toplamBuAy > 0) {
    artisYuzde = 100;
  }

  if (kartArtis) kartArtis.textContent = `%${artisYuzde}`;
  if (kartArtisAciklama) kartArtisAciklama.textContent = "Önceki 30 güne göre";
}

