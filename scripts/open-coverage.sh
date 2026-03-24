#!/usr/bin/env bash

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

REPORTS=(
  "frontend/coverage/lcov-report/index.html"
  "backend/coverage/lcov-report/index.html"
  "backend/coverage/unit/lcov-report/index.html"
  "backend/coverage/integration/lcov-report/index.html"
  "e2e/coverage/e2e/index.html"
  "coverage/all/lcov-report/index.html"
)

opened_any=false

for report in "${REPORTS[@]}"; do
  abs_path="$REPO_ROOT/$report"
  if [[ -f "$abs_path" ]]; then
    echo "[coverage] Opening $report"
    open "$abs_path"
    opened_any=true
  else
    echo "[coverage] Missing $report"
  fi
done

LCOV_REPORT="$REPO_ROOT/coverage/all/lcov.info"

if [[ -f "$LCOV_REPORT" ]]; then
  echo "[coverage] Combined LCOV available at: $LCOV_REPORT"
else
  echo "[coverage] Missing coverage/all/lcov.info"
fi

if [[ "$opened_any" == false ]]; then
  echo "[coverage] No coverage HTML reports found."
  echo "[coverage] Generate reports first, then rerun this script."
fi
