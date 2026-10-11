#!/usr/bin/env bash
#
# Pure behaviour checks for the vocabulary/practice logic.
#
# These live in the repo on purpose: an earlier round kept them in /tmp and a
# routine cleanup wiped the whole regression net. They need no dependencies —
# the TypeScript is compiled with the tsc already in node_modules, into a
# gitignored build directory, and the assertions run on plain node.
#
#   ./scripts/checks/run.sh
#
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
BUILD="$ROOT/.checks-build"

cd "$ROOT"
rm -rf "$BUILD"
npx tsc \
  lib/practice.ts lib/practiceContext.ts lib/vocab.ts lib/tokens.ts lib/keys.ts \
  lib/storage.ts lib/userArticles.ts lib/mockData.ts lib/weeklyDictionary.ts \
  lib/types.ts lib/i18n.ts \
  --module commonjs --target es2020 --moduleResolution node \
  --skipLibCheck --outDir "$BUILD"

BUILD_DIR="$BUILD" node "$ROOT/scripts/checks/practice.cjs"
