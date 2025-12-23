// ===============================
// 🔐 SESSION ID (MULTIUSUÁRIO)
// ===============================
let sessionId = localStorage.getItem("laddy_session_id");

if (!sessionId) {
  sessionId = crypto.randomUUID();
  localStorage.setItem("laddy_session_id", sessionId);
}

// ===============================
// 🎨 CSS DA LADDY
// ===============================
const style = document.createElement("style");
style.innerHTML = `
#laddy-button {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #4f46e5;
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  cursor: pointer;
  z-index: 9999;
}

#laddy-chat {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 320px;
  height: 420px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.2);
  display: none;
  flex-direction: column;
  z-index: 9999;
  font-family: Arial, sans-serif;
}

#laddy-chat.open {
  display: flex;
}

#laddy-header {
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: white;
  padding: 14px;
  border-radius: 16px 16px 0 0;
  font-weight: bold;
}

#laddy-messages {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.laddy-user {
  background: #4f46e5;
  color: white;
  padding: 8px 12px;
  border-radius: 12px;
  margin: 6px 0;
  align-self: flex-end;
  max-width: 80%;
}

.laddy-bot {
  background: #e5e7eb;
  padding: 8px 12px;
  border-radius: 12px;
  margin: 6px 0;
  align-self: flex-start;
  max-width: 80%;
}

#laddy-input {
  border: none;
  border-top: 1px solid #eee;
  padding: 10px;
  outline: none;
}

.laddy-typing {
  display: flex;
  gap: 6px;
  padding: 10px 14px;
  background: #e5e7eb;
  border-radius: 12px;
  margin: 6px 0;
  align-self: flex-start;
  width: fit-content;
}

.laddy-typing .dot {
  width: 8px;
  height: 8px;
  background: #6b7280;
  border-radius: 50%;
  animation: blink 1.4s infinite both;
}

.laddy-typing .dot:nth-child(2) { animation-delay: 0.2s; }
.laddy-typing .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes blink {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 1; }
}
`;
document.head.appendChild(style);

// ===============================
// 🤖 BOTÃO E CHAT
// ===============================
const button = document.createElement("div");
button.id = "laddy-button";
button.innerHTML = "🤖";
document.body.appendChild(button);

const chat = document.createElement("div");
chat.id = "laddy-chat";
chat.innerHTML = `
  <div id="laddy-header">Laddy • Suporte</div>
  <div id="laddy-messages">
    <div class="laddy-bot">
      Olá! 👋 Eu sou a Laddy, assistente virtual de suporte.<br>
      Como posso te ajudar?
    </div>
  </div>
  <input id="laddy-input" placeholder="Digite sua mensagem..." />
`;
document.body.appendChild(chat);

// ===============================
// 💬 FUNÇÕES DE CHAT
// ===============================
const messages = document.getElementById("laddy-messages");
const input = document.getElementById("laddy-input");

function addUserMessage(text) {
  const msg = document.createElement("div");
  msg.className = "laddy-user";
  msg.innerText = text;
  messages.appendChild(msg);
  scrollChat();
}

function addBotMessage(text) {
  const msg = document.createElement("div");
  msg.className = "laddy-bot";
  msg.innerText = text;
  messages.appendChild(msg);
  scrollChat();
}

function showTyping() {
  removeTyping();
  const typing = document.createElement("div");
  typing.className = "laddy-typing";
  typing.id = "laddy-typing";
  typing.innerHTML = `
    <span class="dot"></span>
    <span class="dot"></span>
    <span class="dot"></span>
  `;
  messages.appendChild(typing);
  scrollChat();
}

function removeTyping() {
  const typing = document.getElementById("laddy-typing");
  if (typing) typing.remove();
}

function scrollChat() {
  messages.scrollTop = messages.scrollHeight;
}

// ===============================
// 🖱️ EVENTOS
// ===============================
button.onclick = () => {
  chat.classList.toggle("open");
  if (chat.classList.contains("open")) {
    setTimeout(() => input.focus(), 100);
  }
};

input.addEventListener("keydown", async (e) => {
  if (e.key === "Enter" && input.value.trim()) {
    const text = input.value;
    input.value = "";

    addUserMessage(text);
    showTyping();

    try {
      const res = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          sessionId: sessionId
        })
      });

      const data = await res.json();
      removeTyping();
      addBotMessage(data.reply || "Não consegui responder agora 😕");

    } catch (err) {
      removeTyping();
      addBotMessage("Erro de conexão. Verifique se o servidor está rodando.");
      console.error(err);
    }
  }
});

// Fechar ao clicar fora
document.addEventListener("click", (e) => {
  if (!chat.contains(e.target) && !button.contains(e.target)) {
    chat.classList.remove("open");
  }
});
