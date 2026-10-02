# LegacyLedger — notes for Claude

Dead man's switch inheritance vaults on Solana. Anchor program + Next.js static web app. Hackathon project: Colosseum Crypto World's Fair, Superteam Argentina track. **Submission deadline: 12 Oct 2026, 23:59 PT.** Everything in the submission must be in English; talk to the user in Spanish (rioplatense).

Read `CONTINUAR.md` for the current state, open decisions and pending work before starting.

## Toolchain (Windows host, builds run in WSL)

Rust, Solana CLI (Agave 4.3), Anchor 1.2.0 (via `avm`) and Node 22 live **inside WSL Ubuntu**, not on Windows. Call WSL from the PowerShell tool (`wsl -d Ubuntu -- bash -c "..."`); Git Bash rewrites `/mnt/...` paths and breaks. Load the tools with:

```bash
. ~/.cargo/env; export PATH="$HOME/.local/share/solana/install/active_release/bin:$HOME/.avm/bin:$HOME/.local/node/bin:$PATH"
```

Building on `/mnt/c` is slow. Rsync the repo to `~/ll` (exclude `target`, `node_modules`, `.next`, `out`), copy `target/deploy/legacy_ledger-keypair.json`, and build there. The user has no passwordless sudo; use `wsl -d Ubuntu -u root` for apt.

## Commands (run from the repo root in WSL)

```bash
anchor build                              # production clock (1 day = 86400 s)
anchor build -- --features demo           # demo clock (1 day = 1 s)
cargo test -p legacy_ledger               # 16 unit tests
npm test                                  # 15 e2e tests: anchor test --validator legacy -- --features demo
./scripts/demo-local.sh                   # validator on :8899 with the program preloaded
./scripts/deploy-devnet.sh                # needs ~3 devnet SOL in `solana address`
```

After changing the program interface, copy `target/idl/legacy_ledger.json` and `target/types/legacy_ledger.ts` to `app/src/idl/`. Web app: `cd app && npm ci --legacy-peer-deps && npm run dev` (Windows or WSL).

## Gotchas

- Anchor 1.2 defaults `anchor test` to surfpool, which is not installed: always pass `--validator legacy`.
- Anchor 1.2 `CpiContext::new` takes the program **id** (`token_program.key()`), not an `AccountInfo`.
- Accounts loaded by hand from `remaining_accounts` are not persisted: call `.exit(&crate::ID)?` after mutating (see `claim_inheritance.rs`).
- In `ClaimInheritance` the `heir_index < heirs.len()` constraint must stay first; the following constraints index the vector.
- Heir shares are `amount * bps / unclaimed_bps` (`validate::share_of_remaining`). Do not go back to `amount * bps / 10_000`: later heirs would be short-changed.
- Instruction handlers are named `handle_*` to avoid glob re-export clashes with the `#[program]` module.
- The program keypair `target/deploy/legacy_ledger-keypair.json` is gitignored (private key). Program ID `GXWfB5gTPxMLDSAeeYQ3e8TZmZMqpTzfFR3yEiUuBAaM`. A fresh clone must generate its own keypair and update `declare_id!` + `Anchor.toml` together.
- The web app assumes the demo clock unless built with `NEXT_PUBLIC_DEMO_CLOCK=false`.

## Rules for copy and claims

- Never say "the first on-chain will": will.eth exists (`docs/research/COMPETIDORES.md`).
- No users, metrics, partners or volumes without evidence: fabrication can disqualify. Mark unknowns as TODO/FALTA.
- No claims of legal validity. Market figures only with the source and date from `docs/research/`.
- Disclose material AI use in `docs/SUBMISSION.md`.
