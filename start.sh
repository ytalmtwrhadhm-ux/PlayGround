#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
web_dir="${OPENCODE_WEB_DIR:-/home/runner/work/_temp/omgithub-web}"
src_dir="$project_dir/src"
dist_dir="$project_dir/dist"
port="${PORT:-3000}"

echo "start.sh: project=$project_dir port=$port"

/usr/bin/time -p rm -rf "$dist_dir"
/usr/bin/time -p mkdir -p "$dist_dir"
/usr/bin/time -p cp -R "$src_dir/." "$dist_dir/"
/usr/bin/time -p test -f "$dist_dir/index.html"

/usr/bin/time -p mkdir -p "$web_dir"
DEPLOY_FILE="$web_dir/deployment-output.json" PROJECT_ROOT="$project_dir" BUILD_DIR="$dist_dir" \
  /usr/bin/time -p node -e 'const fs=require("node:fs");const path=require("node:path");const {DEPLOY_FILE,PROJECT_ROOT,BUILD_DIR}=process.env;fs.writeFileSync(DEPLOY_FILE,JSON.stringify({project:PROJECT_ROOT,directory:path.resolve(BUILD_DIR)})+"\n")'

cd "$project_dir"
exec /usr/bin/time -p env PORT="$port" node "$project_dir/scripts/serve.mjs" "$dist_dir"
