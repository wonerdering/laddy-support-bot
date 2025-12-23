console.log("admin.js carregado");

const token = localStorage.getItem("admin_token");

if (!token) {
  window.location.href = "/login.html";
}

async function carregarChamados() {
  try {
    const res = await fetch("/admin/chamados", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!res.ok) {
      throw new Error("Não autorizado");
    }

    const chamados = await res.json();

    console.log("Chamados recebidos:", chamados);

    document.getElementById("total").innerText = chamados.length;

    const lista = document.getElementById("lista");
    lista.innerHTML = "";

    chamados.forEach(c => {
      const card = document.createElement("div");
      card.className = "bg-white p-6 rounded-2xl shadow";

      card.innerHTML = `
        <p class="text-sm text-gray-500">
          ${c.data ? new Date(c.data).toLocaleString() : "Sem data"}
        </p>

        <p class="font-bold text-indigo-600">
          ${c.email || "Email não informado"}
        </p>

        <p class="mt-2 text-gray-800">
          ${c.descricao || "Sem descrição"}
        </p>

        <details class="mt-4">
          <summary class="cursor-pointer text-sm text-indigo-500">
            Ver histórico
          </summary>
          <pre class="text-xs bg-gray-100 p-3 mt-2 rounded overflow-x-auto">
${JSON.stringify(c.historico || [], null, 2)}
          </pre>
        </details>
      `;

      lista.appendChild(card);
    });

  } catch (err) {
    console.error("Erro painel:", err);
    document.getElementById("total").innerText = "—";
    document.getElementById("lista").innerHTML =
      "<p class='text-red-500'>Erro ao carregar chamados.</p>";
  }
}

carregarChamados();
