#!/usr/bin/env bash
# Starts a local Solana validator with LegacyLedger preloaded (demo clock:
# one inactivity "day" = one second). Leave it running during the demo and
# point the web app at "Localnet". Requires: solana CLI + anchor (see README).
set -euo pipefail
cd "$(dirname "$0")/.."

PROGRAM_ID=$(grep -oP 'declare_id!\("\K[^"]+' programs/legacy-ledger/src/lib.rs)

# Reuses an existing build; set REBUILD=1 after changing the program.
if [ "${REBUILD:-0}" = "1" ] || [ ! -f target/deploy/legacy_ledger.so ]; then
  anchor build -- --features demo
fi

[ -f ~/.config/solana/id.json ] || solana-keygen new --no-bip39-passphrase -s -o ~/.config/solana/id.json

echo "Program $PROGRAM_ID -> http://127.0.0.1:8899  (Ctrl+C to stop)"
exec solana-test-validator --reset \
  --ledger "${LEDGER_DIR:-/tmp/legacy-ledger-test-ledger}" \
  --upgradeable-program "$PROGRAM_ID" target/deploy/legacy_ledger.so "$(solana-keygen pubkey)"
