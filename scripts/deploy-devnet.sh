#!/usr/bin/env bash
# Deploys the DEMO build (1 day = 1 second) of LegacyLedger to devnet.
# Needs ~3 SOL on devnet in the CLI wallet (`solana address` shows it;
# get SOL at https://faucet.solana.com signing in with GitHub) and the
# program keypair at target/deploy/legacy_ledger-keypair.json.
set -euo pipefail
cd "$(dirname "$0")/.."

solana config set --url devnet >/dev/null
echo "Deployer: $(solana address)  balance: $(solana balance)"
anchor build -- --features demo
anchor deploy --provider.cluster devnet
echo "Deployed. Open the web app, pick Devnet, and press 'Initialize protocol' once."
