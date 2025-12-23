# 1️⃣ Imagem base Node
FROM node:20-alpine

# 2️⃣ Pasta de trabalho dentro do container
WORKDIR /app

# 3️⃣ Copia package.json
COPY package*.json ./

# 4️⃣ Instala dependências
RUN npm install

# 5️⃣ Copia todo o projeto
COPY . .

# 6️⃣ Expõe a porta
EXPOSE 3000

# 7️⃣ Comando de start
CMD ["npm", "start"]
