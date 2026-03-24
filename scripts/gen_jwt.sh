#!/usr/bin/env bash
# Upserts JWT-related keys in backend/.env, frontend/.env, and e2e/.env (only those lines).
set -euo pipefail
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
export REPO_ROOT
exec python3 - "$@" <<'PY'
import argparse
import os
import secrets
import sys
from pathlib import Path


def upsert_key(path: Path, key: str, value: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    text = path.read_text() if path.exists() else ""
    lines = text.splitlines()
    prefix = f"{key}="
    out: list[str] = []
    found = False
    for line in lines:
        if line.startswith(prefix):
            out.append(f"{key}={value}")
            found = True
        else:
            out.append(line)
    if not found:
        out.append(f"{key}={value}")
    path.write_text("\n".join(out) + ("\n" if out else ""))


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Add or update JWT secret lines in backend/, frontend/, and e2e/ .env only."
    )
    parser.add_argument("--secret", help="Use this secret instead of generating a new one.")
    parser.add_argument("--print-secret", action="store_true", help="Print the secret to stdout.")
    parser.add_argument("--dry-run", action="store_true", help="Do not modify files.")
    args = parser.parse_args()

    secret = args.secret or secrets.token_hex(32)
    root = Path(os.environ["REPO_ROOT"])
    backend_env = root / "backend" / ".env"
    frontend_env = root / "frontend" / ".env"
    e2e_env = root / "e2e" / ".env"

    if args.print_secret or args.dry_run:
        print(secret)

    if args.dry_run:
        print("[gen_jwt] dry-run: would set JWT_SECRET / REACT_APP_JWT_SECRET / E2E_JWT_SECRET in:", file=sys.stderr)
        print(f"  {backend_env}", file=sys.stderr)
        print(f"  {frontend_env}", file=sys.stderr)
        print(f"  {e2e_env}", file=sys.stderr)
        return 0

    upsert_key(backend_env, "JWT_SECRET", secret)
    upsert_key(frontend_env, "REACT_APP_JWT_SECRET", secret)
    upsert_key(e2e_env, "E2E_JWT_SECRET", secret)
    print(
        f"[gen_jwt] Updated JWT lines only in {backend_env}, {frontend_env}, and {e2e_env}",
        file=sys.stderr,
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
PY
