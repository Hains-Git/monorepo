# Dockerfile

# Schritt 1: Basis-Image
FROM node:22 AS builder

# Arbeitsverzeichnis erstellen
WORKDIR /app

# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install

# Kopieren Sie den gesamten Code
COPY . .

# Build der Anwendung
RUN npm run build

# Schritt 2: Produktions-Image
FROM node:22 AS runner

WORKDIR /app

COPY --from=builder /app/dist/apps ./dist

# Abhängigkeiten für die Produktion installieren
COPY package*.json ./
RUN npm install --only=production

# Exponieren Sie den Port
EXPOSE 3000

# Startbefehl
CMD ["node", "dist/main.js"]

