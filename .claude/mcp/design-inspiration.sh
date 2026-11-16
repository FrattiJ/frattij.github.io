#!/usr/bin/env bash
# Launches the design-inspiration MCP server (stdio), pinned to a reviewed commit.
set -euo pipefail
REPO="https://github.com/notsointresting/design-inspiration-mcp"
REV="817716d983513147cc06611c3e4d6073f912e93f"
DIR="${XDG_CACHE_HOME:-$HOME/.cache}/mcp/design-inspiration-$REV"
if [ ! -f "$DIR/.ready" ]; then
  rm -rf "$DIR" && mkdir -p "$DIR"
  git -C "$DIR" init -q
  git -C "$DIR" fetch -q --depth 1 "$REPO" "$REV"
  git -C "$DIR" checkout -q FETCH_HEAD
  (cd "$DIR" && npm ci --omit=dev --silent --no-audit --no-fund >&2)
  touch "$DIR/.ready"
fi
exec node "$DIR/src/index.js"
