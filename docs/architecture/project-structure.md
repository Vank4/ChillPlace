# ChillPlace Project Structure

## Monorepo layout

- `apps/web`: Frontend React (Vite)
- `apps/api`: Backend Node.js/Express
- `packages/shared`: Shared types, schemas, constants
- `packages/config`: Shared lint/tsconfig presets
- `prisma`: Database schema, migrations, seeds
- `infra`: Docker, nginx, monitoring setup
- `docs`: Architecture and technical docs
- `scripts`: Dev/db/release automation scripts

## Frontend convention (`apps/web/src`)

- `app`: app bootstrap, router, providers
- `pages`: route-level pages
- `features/*`: domain modules (auth, feed, map, place, admin...)
- `components`: shared UI/layout/common components
- `services`: API clients
- `store`: global state
- `styles`: global styles and theme

## Backend convention (`apps/api/src`)

- `modules/*`: feature-based modules (controller/service/repository/dto)
- `middlewares`: auth, role guard, validation, error handler
- `common`: constants, errors, logger, utils
- `routes`: route composition
- `jobs`: background jobs/cron
- `config`: env and app config
