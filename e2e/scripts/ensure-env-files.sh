#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [[ -f "$REPO_ROOT/e2e/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "$REPO_ROOT/e2e/.env"
  set +a
  echo "[e2e] Loaded $REPO_ROOT/e2e/.env"
fi

JWT_SHARED=""
if [[ -n "${E2E_JWT_SECRET:-}" ]]; then
  JWT_SHARED="$E2E_JWT_SECRET"
elif [[ -n "${JWT_SECRET:-}" ]]; then
  JWT_SHARED="$JWT_SECRET"
elif [[ "${CI:-}" == "true" ]]; then
  # Fork PRs cannot read repo secrets; ephemeral secret still lets E2E pass.
  # Add repository secret E2E_JWT_SECRET for a stable, explicit value (recommended).
  JWT_SHARED="ci-e2e-${GITHUB_RUN_ID:-0}-${GITHUB_SHA:-local}"
  echo "[e2e] E2E_JWT_SECRET not set — using ephemeral CI JWT (set repo secret E2E_JWT_SECRET to pin a value)" >&2
else
  JWT_SHARED="e2e-local-jwt-secret-change-me"
fi

if [[ ! -f "$REPO_ROOT/.env" ]]; then
  cat > "$REPO_ROOT/.env" <<EOF
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=mp
EOF
  echo "[e2e] Created $REPO_ROOT/.env"
fi

if [[ ! -f "$REPO_ROOT/backend/.env" ]]; then
  cat > "$REPO_ROOT/backend/.env" <<EOF
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@mp_db:5432/mp
FRONTEND_URL=http://localhost:3000
JWT_SECRET=$JWT_SHARED
ADMIN_STAFF_PASSWORD=abc123
RELIEF_STAFF_PASSWORD=test123
SEED_PARTICIPANT_PASSWORD=test123
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASSWORD=
EOF
  echo "[e2e] Created $REPO_ROOT/backend/.env"
fi

if [[ ! -f "$REPO_ROOT/frontend/.env" ]]; then
  cat > "$REPO_ROOT/frontend/.env" <<EOF
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_JWT_SECRET=$JWT_SHARED
REACT_APP_FRONTEND_URL=http://localhost:3000
EOF
  echo "[e2e] Created $REPO_ROOT/frontend/.env"
fi
