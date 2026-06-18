FROM node:22-bookworm-slim

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app/apps/api

COPY apps/api/package.json apps/api/package-lock.json ./
RUN npm ci

COPY prisma /app/prisma
COPY apps/api /app/apps/api

RUN npm run prisma:generate

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "run", "start:deploy"]
