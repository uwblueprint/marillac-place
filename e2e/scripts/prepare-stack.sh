#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

bash "$REPO_ROOT/e2e/scripts/ensure-env-files.sh"

echo "[e2e] Starting docker services..."
docker compose -f "$REPO_ROOT/docker-compose.yml" up -d db backend frontend

echo "[e2e] Waiting for postgres health..."
for _ in {1..30}; do
  if docker compose -f "$REPO_ROOT/docker-compose.yml" ps db | grep -Eq "healthy|running"; then
    break
  fi
  sleep 2
done

echo "[e2e] Waiting for frontend and backend..."
for _ in {1..45}; do
  frontend_status="$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000" || true)"
  backend_status="$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:5000/graphql" || true)"

  if [[ "$frontend_status" =~ ^2[0-9][0-9]$ ]] && [[ "$backend_status" =~ ^[234][0-9][0-9]$ ]]; then
    break
  fi
  sleep 2
done

echo "[e2e] Applying migrations and seeding deterministic fixtures..."
docker compose -f "$REPO_ROOT/docker-compose.yml" run --rm --entrypoint sh backend -lc \
  "npx @snaplet/seed sync && SEED_PARTICIPANT_PASSWORD=test123 npx prisma migrate deploy && SEED_PARTICIPANT_PASSWORD=test123 npx prisma db seed"

echo "[e2e] Standardizing participant login credentials..."
docker exec -i mp_db psql -U postgres -d mp -c "UPDATE participant SET password='test123' WHERE pid=1;" >/dev/null

echo "[e2e] Stack is ready."
