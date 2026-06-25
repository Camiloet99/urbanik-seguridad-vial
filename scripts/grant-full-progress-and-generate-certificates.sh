#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

if command -v node >/dev/null 2>&1; then
  node "$REPO_ROOT/scripts/grant-full-progress-and-generate-certificates.mjs" "$@"
  exit $?
fi

if ! command -v docker >/dev/null 2>&1; then
  echo "No encontre node ni docker. Instala Node.js 20+ o ejecuta este script en una maquina con Docker." >&2
  exit 1
fi

echo "No encontre node en el host; ejecutando con Docker node:20-alpine..."

EXTRA_ARGS=()
HAS_MODE=0
for arg in "$@"; do
  if [ "$arg" = "--mode" ]; then
    HAS_MODE=1
    break
  fi
done

if [ "$HAS_MODE" -eq 0 ]; then
  EXTRA_ARGS=(--mode direct --host 127.0.0.1)
fi

docker run --rm \
  --network host \
  -v "$REPO_ROOT:/app" \
  -w /app \
  node:20-alpine \
  sh -lc 'apk add --no-cache mysql-client >/dev/null && cd /app/portalweb && npm ci --omit=dev >/dev/null && cd /app && node scripts/grant-full-progress-and-generate-certificates.mjs "$@"' \
  sh "${EXTRA_ARGS[@]}" "$@"
