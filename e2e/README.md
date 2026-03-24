# Playwright E2E

This test suite validates real flows across:

- frontend (`http://localhost:3000`)
- backend (`http://localhost:5000/graphql`)
- postgres (`localhost:5432`)

## Prerequisites

- Docker running
- `docker compose` available
- Node `18.18.2`

### Env files (local and CI)

`docker-compose.yml` uses gitignored files: `./.env`, `backend/.env`, `frontend/.env`.  
`e2e/scripts/ensure-env-files.sh` creates them when missing.

**Local:** copy `e2e/.env.example` → `e2e/.env`, set `E2E_JWT_SECRET` to a long random string (same idea as production `JWT_SECRET`). The script sources `e2e/.env` before generating compose env files.

**GitHub Actions:** prefer a single full-file backend env secret for parity:

1. Repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**
2. Name: `E2E_ENV_FILE`
3. Value: full backend `.env` contents (multiline)

Example secret value:
```env
NODE_ENV=test
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@mp_db:5432/mp
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-long-random-secret
ADMIN_STAFF_PASSWORD=abc123
RELIEF_STAFF_PASSWORD=test123
SEED_PARTICIPANT_PASSWORD=test123
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
```

Optional fallback secret:
- `E2E_JWT_SECRET` (used when `E2E_ENV_FILE` is not set).

Fork PRs cannot read your secrets; in that case CI uses safe defaults and a non-sensitive fallback JWT.

**Deployed app (Railway, etc.):** production `JWT_SECRET` / `REACT_APP_JWT_SECRET` stay in your host’s env (see `RAILWAY_DEPLOYMENT.md`). E2E only needs the GitHub secret for the **CI docker stack**, not for live production traffic.

## Install

```bash
cd e2e
yarn install
yarn install:browsers
```

## Run E2E (recommended)

This command starts/validates the app stack, applies migrations, seeds data, normalizes participant login credentials, and runs Playwright.

```bash
cd e2e
yarn test:docker
```

This also writes browser coverage for Codecov to:

- `e2e/coverage/e2e/lcov.info`

## Run only Playwright tests

Use this when the stack is already up and data is ready.

```bash
cd e2e
yarn test
```

To generate coverage without docker helpers (stack already up):

```bash
cd e2e
yarn test:coverage
```

## Deterministic Test Credentials

- Participant: `pid=1`, `password=test123`
- Admin: password from `backend/.env` (`ADMIN_STAFF_PASSWORD`, default docs use `abc123`)
- Relief: password from `backend/.env` (`RELIEF_STAFF_PASSWORD`, default docs use `test123`)

To make all seeded participant passwords deterministic directly from seed logic, set:

```bash
SEED_PARTICIPANT_PASSWORD=test123
```

The seed script supports this env var in `backend/prisma/seed/seed.ts`.
