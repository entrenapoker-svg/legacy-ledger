#!/usr/bin/env bash
# Deploys the DEMO build (1 inactivity day = 1 second) of LegacyLedger to devnet
# and initializes the protocol config. Needs devnet SOL in the CLI wallet
# (`solana address`; get it at https://faucet.solana.com signing in with
# GitHub) and the program keypair at target/deploy/legacy_ledger-keypair.json.
set -euo pipefail
cd "$(dirname "$0")/.."

MIN_SOL=${MIN_SOL:-4}
solana config set --url devnet >/dev/null
ADDR=$(solana address)
BAL=$(solana balance | awk '{print $1}')
echo "Deployer: $ADDR  balance: $BAL SOL"
if awk "BEGIN{exit !($BAL < $MIN_SOL)}"; then
  echo "Not enough SOL. Send at least $MIN_SOL devnet SOL to $ADDR (https://faucet.solana.com) and run again."
  exit 1
fi

[ -f target/deploy/legacy_ledger-keypair.json ] || { echo "Missing target/deploy/legacy_ledger-keypair.json"; exit 1; }

anchor build -- --features demo
anchor deploy --provider.cluster devnet
echo
echo "Deployed. Open the web app, choose Devnet, press 'Initialize protocol' once."
