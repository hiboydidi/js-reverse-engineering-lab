FROM node:24-bookworm-slim

WORKDIR /workspace

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx playwright install --with-deps chromium

EXPOSE 5173 3000

CMD ["npm", "run", "dev"]
