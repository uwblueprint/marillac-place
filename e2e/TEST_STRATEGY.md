# E2E Test Strategy

## WHY:

We write Playwright E2E suite tests to validate the highest-risk workflows against a "mock prod" environment. Unit and integration tests are insufficient to capture cross-service behavior like login flows, data integrity, and full app nav. 

This strategy is designed to:

- catch full stack regressions
- verify critical authentication paths
- keep tests deterministic and idempotent so failures are actionable
- support releases by validating real user behavior

## IMPLEMENTATION:

### Scope

The suite validates production-like flows across:

- frontend: `http://localhost:3000`
- backend GraphQL API: `http://localhost:5000/graphql`
- postgres: `localhost:5432`

Priority scenarios:

- participant authentication (sign-in, sign-out, routing)
- role-based staff authentication
- key workflow paths that must persist data in the database
- login history and other critical side effects

### Environment and Setup

Prerequisites:

- Docker running
- `docker compose` installed
- Node `18.18.2` installed with nvm

Install:

```bash
cd e2e
yarn install
yarn install:browsers
```

Preferred execution (full stack + Playwright):

```bash
cd e2e
yarn test:docker
```

Use `yarn test` when test data is already seeded.

### Data Determinism

Deterministic test users:

- participant: `pid=1`, `password=test123`
- admin: `ADMIN_STAFF_PASSWORD` from `backend/.env`
- relief: `RELIEF_STAFF_PASSWORD` from `backend/.env`

To force deterministic seeded participant passwords, set in .env:

```bash
SEED_PARTICIPANT_PASSWORD=test123
```

This is supported by seed logic in `backend/prisma/seed/seed.ts`.

### Test Strategy

- run smoke tests on every workflow to catch every possible regression
- keep environment setup scripted so local and CI behavior match
- - fail with clear diagnostics (screenshots, video, context) using `yarn playwright show-report`

### Maintenance Plan

- update fixtures/seed assumptions when auth or schema changes
- quarantine and fix flaky tests immediately
- review test runtime regularly and optimize slow paths
- expand coverage incrementally with each high-risk feature
