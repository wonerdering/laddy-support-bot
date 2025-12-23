\# 🤖 Laddy — Assistente Virtual de Suporte



Laddy é um projeto de assistente virtual de suporte técnico com abertura automática de chamados, painel administrativo e integração com IA (Ollama).



O objetivo do projeto é demonstrar conceitos práticos de \*\*Backend\*\*, \*\*Frontend\*\*, \*\*autenticação\*\*, \*\*gestão de estado\*\*, e \*\*containerização com Docker\*\*.



---



\## 🚀 Funcionalidades



\- 💬 Chat de atendimento automatizado

\- 📩 Abertura automática de chamados via conversa

\- 🧠 Integração com IA (Ollama / Llama3)

\- 🔐 Login administrativo

\- 📊 Painel admin com listagem de chamados e histórico

\- 🐳 Projeto totalmente containerizado com Docker



---



\## 🛠️ Tecnologias Utilizadas



\- Node.js

\- Express

\- HTML / CSS / JavaScript

\- Docker \& Docker Compose

\- Ollama (IA local)

\- File System (JSON) para persistência



---



\## 📦 Como rodar o projeto (Docker)



\### Pré-requisitos

\- Docker

\- Docker Compose



\### Passos



```bash

git clone https://github.com/wonerdering/laddy-support-bot.git

cd laddy

docker compose up --build

Acesse:

Chat: http://localhost:3000

Login admin: http://localhost:3000/login.html

Painel admin: http://localhost:3000/admin.html



\##🔐 Credenciais Admin (demo)


Email: admin@laddy.com

Senha: 123456




\##📌 Observações


Projeto educacional

Não utiliza banco de dados (persistência via JSON)

Foco em arquitetura, lógica e DevOps




\##🧠 Autor

Desenvolvido por João Eduardo
