# Dockerfile

# Schritt 1: Basis-Image
FROM node:22 AS builder

# Arbeitsverzeichnis erstellen
WORKDIR /app

# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install --force

# Kopieren Sie den gesamten Code
COPY . .

# Build der Anwendung
RUN npx prisma generate
RUN npx nx build hains --prod --verbose

# Schritt 2: Produktions-Image
FROM node:22 AS runner

WORKDIR /app

COPY --from=builder /app/dist/apps ./dist

# Abhängigkeiten für die Produktion installieren
COPY package*.json ./
RUN npm install --only=production --force

# Exponieren Sie den Port
EXPOSE 3010

# Startbefehl
CMD ["node", "dist/hains/.next/server/index.html"]

