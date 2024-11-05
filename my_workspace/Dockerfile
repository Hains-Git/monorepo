# Dockerfile
# Schritt 1: Basis-Image
FROM node:22

# Arbeitsverzeichnis erstellen
WORKDIR /app

# Abhängigkeiten installieren
COPY package*.json ./
RUN npm install --force

# Kopieren Sie den gesamten Code
COPY . .

# Exponieren Sie den Port
EXPOSE 3010
ENTRYPOINT ["/app/entry.sh"]
