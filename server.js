const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// ===============================
// 🔐 CONFIG ADMIN (ÚNICA FONTE)
// ===============================
const ADMIN_EMAIL = "admin@laddy.com";
const ADMIN_PASSWORD = "123456";
const ADMIN_TOKEN = "laddy-admin-123";

// ===============================
// 🔐 AUTH MIDDLEWARE
// ===============================
function authAdmin(req, res, next) {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: "Não autorizado" });
  }

  const token = auth.replace("Bearer ", "");

  if (token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: "Token inválido" });
  }

  next();
}

// ===============================
// 🔐 LOGIN ADMIN
// ===============================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    return res.json({ token: ADMIN_TOKEN });
  }

  res.status(401).json({ error: "Credenciais inválidas" });
});

// ===============================
// 🔐 SESSÕES MULTIUSUÁRIO
// ===============================
const sessions = {};

function getSession(sessionId) {
  if (!sessions[sessionId]) {
    sessions[sessionId] = {
      state: "normal",
      email: null,
      history: []
    };
  }
  return sessions[sessionId];
}

// ===============================
// 💬 CHAT LADDY
// ===============================
app.post("/chat", async (req, res) => {
  const { message, sessionId } = req.body;

  if (!sessionId || !message) {
    return res.json({ reply: "Sessão inválida." });
  }

  const session = getSession(sessionId);
  const userMessage = message.toLowerCase();

  session.history.push({
    role: "user",
    message,
    date: new Date().toISOString()
  });
// 🔴 Abrir chamado — REGRA ABSOLUTA
const pediuChamado =
  userMessage.includes("abrir chamado") ||
  userMessage.includes("quero abrir") ||
  userMessage.includes("desejo abrir");

if (pediuChamado) {
  session.state = "pedir_email";
  return res.json({
    reply: "Certo 👍 Para abrir o chamado, informe seu e-mail."
  });
}

  // 🔴 Abrir chamado
  if (userMessage.includes("abrir chamado")) {
    session.state = "pedir_email";
    return res.json({
      reply: "Certo 👍 Para abrir o chamado, informe seu e-mail."
    });
  }

  if (session.state === "pedir_email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(message)) {
      return res.json({ reply: "E-mail inválido 😕" });
    }

    session.email = message;
    session.state = "pedir_descricao";
    return res.json({ reply: "Agora descreva o problema." });
  }

  if (session.state === "pedir_descricao") {
    // 🔒 CLONA o histórico ANTES de limpar a sessão
const historicoFinal = [...session.history];

const chamado = {
  id: Date.now(),
  email: session.email,
  descricao: message,
  data: new Date().toISOString(),
  historico: historicoFinal
};

fs.appendFileSync(
  "chamados.json",
  JSON.stringify(chamado, null, 2) + ",\n"
);

// 🔄 reset da sessão
session.state = "normal";
session.email = null;
session.history = [];


    return res.json({ reply: "✅ Chamado aberto com sucesso!" });
  }

  // 🤖 IA (OLLAMA)
  try {
    const response = await axios.post("http://localhost:11434/api/generate", {
      model: "llama3",
      prompt: message,
      stream: false
    });

    res.json({ reply: response.data.response });
  } catch {
    res.json({ reply: "Erro ao responder 😕" });
  }
});

// ===============================
// 🧠 PAINEL ADMIN – CHAMADOS
// ===============================
app.get("/admin/chamados", authAdmin, (req, res) => {
  if (!fs.existsSync("chamados.json")) {
    return res.json([]);
  }

  try {
    const raw = fs.readFileSync("chamados.json", "utf-8");
    const json = `[${raw.trim().replace(/,\s*$/, "")}]`;
    const chamados = JSON.parse(json);
    res.json(chamados.reverse());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao ler chamados" });
  }
});

// ===============================
app.listen(3000, () => {
  console.log("🚀 Laddy rodando em http://localhost:3000");
});
