# Playwright E2E

This test suite validates real flows across:

- frontend (`http://localhost:3000`)
- backend (`http://localhost:5000/graphql`)
- postgres (`localhost:5432`)

## Prerequisites

- Docker running
- `docker compose` available
- Node `18.18.2`

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

## Run only Playwright tests

Use this when the stack is already up and data is ready.

```bash
cd e2e
yarn test
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
