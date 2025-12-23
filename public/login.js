console.log("login.js carregado");

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const error = document.getElementById("error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    error.classList.add("hidden");
    error.innerText = "";

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        error.innerText = data.error || "Login inválido";
        error.classList.remove("hidden");
        return;
      }

      // ✅ SALVA O TOKEN REAL VINDO DO BACKEND
      localStorage.setItem("admin_token", data.token);

      // ➜ REDIRECIONA
      window.location.href = "/admin.html";

    } catch (err) {
      console.error("Erro login:", err);
      error.innerText = "Erro ao conectar com o servidor";
      error.classList.remove("hidden");
    }
  });
});
