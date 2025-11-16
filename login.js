if (!window._loginInitialized) {
  window._loginInitialized = true; // 👈 Tek sefer çalışmasını sağlar

  document.addEventListener("DOMContentLoaded", () => {
    // 🔒 Oturum kontrolü - zaten giriş yapılmışsa yönlendir
    const aktifKullanici = JSON.parse(localStorage.getItem("aktifKullanici"));
    if (aktifKullanici) {
      console.log("✅ Aktif oturum bulundu, yönlendiriliyor...", aktifKullanici);
      if (aktifKullanici.bayi_id) {
        window.location.href = "bayi-anasayfa.html";
      } else {
        window.location.href = "panel-fabrika.html";
      }
      return; // Login formunu gösterme
    }

    const form = document.getElementById("login-form");
    const typeButtons = document.querySelectorAll(".login-type-btn");
    const selectedType = document.getElementById("selected-user-type");

    // Kullanıcı tipi seçimi
    typeButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        typeButtons.forEach(b => b.classList.remove("aktif"));
        btn.classList.add("aktif");
        selectedType.value = btn.dataset.type;
      });
    });

    // Form gönderimi
    form.addEventListener("submit", async e => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!username || !password) {
        alert("Kullanıcı adı ve şifre gerekli!");
        return;
      }

      try {
        const res = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Giriş başarısız!");
          return;
        }

        // Kullanıcı bilgilerini localStorage'a kaydet
        localStorage.setItem("aktifKullanici", JSON.stringify(data.kullanici));

        console.log("✅ Giriş başarılı:", data.kullanici);
        console.log("💾 localStorage'a kaydedildi:", localStorage.getItem("aktifKullanici"));

        // Bayi ise bayi sayfasına, değilse fabrika sayfasına yönlendir
        if (data.kullanici.bayi_id) {
          console.log("🔄 Bayi sayfasına yönlendiriliyor...");
          alert(`Hoş geldiniz, ${data.kullanici.bayi_adi}!`);
          // Alert kapandıktan sonra yönlendir
          setTimeout(() => {
            window.location.href = "bayi-anasayfa.html";
          }, 100);
        } else {
          console.log("🔄 Fabrika sayfasına yönlendiriliyor...");
          alert(`Hoş geldiniz, ${data.kullanici.kullanici_adi}!`);
          setTimeout(() => {
            window.location.href = "panel-fabrika.html";
          }, 100);
        }

      } catch (err) {
        console.error("❌ Giriş hatası:", err);
        alert("Sunucuya bağlanırken hata oluştu.");
      }
    });
  });
}


