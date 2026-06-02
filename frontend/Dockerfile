# Tryb deweloperski: Vite dev server z hot reload.
# Kod zrodlowy jest montowany jako wolumen w docker-compose,
# wiec zmiany w plikach sa widoczne natychmiast bez przebudowy obrazu.
FROM node:22-alpine
WORKDIR /app

# Instalacja zaleznosci w osobnej warstwie (cache gdy package*.json bez zmian)
COPY package*.json ./
RUN npm install

# Reszta kodu (w compose i tak nadpisana bind-mountem)
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
