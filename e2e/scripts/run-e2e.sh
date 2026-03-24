#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
E2E_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

bash "$SCRIPT_DIR/prepare-stack.sh"

cd "$E2E_ROOT"
rm -rf ./.coverage/raw
mkdir -p ./.coverage/raw
npx playwright test
node ./scripts/build-e2e-coverage.mjs || true
