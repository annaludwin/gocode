# Obraz zgodny z wersja @playwright/test z package.json (np. 1.59.x)
FROM mcr.microsoft.com/playwright:v1.59.1-noble

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Domyslnie uruchamia caly suite; nadpisz przez docker run ... npm run test:chromium
CMD ["npx", "playwright", "test"]
