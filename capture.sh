#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
: "${CAPTURE_URL:?Set CAPTURE_URL.}"
: "${CAPTURE_DIR:?Set CAPTURE_DIR.}"

echo "capture.sh: url=$CAPTURE_URL output=$CAPTURE_DIR"

/usr/bin/time -p mkdir -p "$CAPTURE_DIR"
/usr/bin/time -p test -d "$CAPTURE_DIR"
/usr/bin/time -p node "$project_dir/scripts/capture.mjs"
