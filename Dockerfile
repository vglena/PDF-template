FROM node:20-slim

# Install Chromium dependencies
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  libatk-bridge2.0-0 \
  libatk1.0-0 \
  libcups2 \
  libdbus-1-3 \
  libgdk-pixbuf2.0-0 \
  libnspr4 \
  libnss3 \
  libx11-xcb1 \
  libxcomposite1 \
  libxdamage1 \
  libxfixes3 \
  libxrandr2 \
  libxss1 \
  libxtst6 \
  xdg-utils \
  --no-install-recommends && \
  rm -rf /var/lib/apt/lists/*

# Tell Playwright to use the system Chromium instead of downloading its own
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
ENV PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["npm", "start"]
