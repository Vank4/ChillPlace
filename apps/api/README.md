# ChillPlace API

## Quick Start

1. Copy `.env.example` to `.env`.
2. Install dependencies:
   - `npm install`
3. Bootstrap everything:
   - `npm run setup`
4. Start API:
   - `npm run dev`

## What `npm run setup` does

- `npm run db:bootstrap`: create database from `DATABASE_URL` if missing.
- `npm run prisma:generate`: generate Prisma client.
- `npm run prisma:deploy`: apply migration files in `prisma/migrations`.

## Health Check

- Endpoint: `GET /api/health`
- Includes:
  - service name
  - environment
  - process uptime
  - timestamp
  - live DB status and DB query latency

