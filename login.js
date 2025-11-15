if (!window._loginInitialized) {
  window._loginInitialized = true; // 👈 Tek sefer çalışmasını sağlar

  document.addEventListener("DOMContentLoaded", () => {
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
      const type = selectedType.value;

      try {
        const res = await fetch("http://localhost:3000/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password, type })
        });

        const data = await res.json();

        if (!res.ok) {
          alert("Bir hata oluştu.");
          return;
        }

        localStorage.setItem("aktifKullanici", JSON.stringify(data.kullanici));

        // 🔹 Artık sadece tek mesaj çıkar
        alert(`${data.kullanici.kullanici_adi} olarak giriş yapıldı.`);

        if (type === "factory") {
          window.location.href = "panel-fabrika.html";
        } else {
          window.location.href = "bayi-anasayfa.html";
        }

      } catch (err) {
        console.error("❌ Giriş hatası:", err);
        alert("Sunucuya bağlanırken hata oluştu.");
      }
    });
  });
}


