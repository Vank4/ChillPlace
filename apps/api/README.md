# ChillPlace API

## Requirements

- Node.js 20+
- MySQL 8.x running at the host configured in `DATABASE_URL`

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
- Local URL: `http://localhost:3000/api/health`
- Includes:
  - service name
  - environment
  - process uptime
  - timestamp
  - live DB status and DB query latency

## Foundation Test

```bash
npm test
```

The foundation suite validates database health, response contracts, error
handling, request validation, security middleware and upload rules.

## Foundation Dependencies

- `zod`: request validation
- `express-rate-limit`: global and route-level rate limiting
- `multer`: multipart upload foundation

Run a production dependency audit with:

```bash
npm audit --omit=dev
```
