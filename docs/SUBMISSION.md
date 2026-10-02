# Submission notes

Draft answers for the Colosseum portal and the Superteam Argentina track form. Every item marked **TODO** must be filled in by the team with real information. Fabricated users, metrics or partnerships can disqualify the project, so leave a TODO rather than guess.

## One-liner

LegacyLedger is a dead man's switch for self-custodied assets on Solana: if you stop signing for N days, anyone can trigger your will and each heir claims exactly their share from a program-controlled vault.

## Working product (track requirement 1)

- **Test environment:** local validator via `scripts/demo-local.sh` plus the web app (`app/`). Instructions are in the README under "Try it".
- **Hosted app:** GitHub Pages (see the repo's About box). Devnet deployment: **TODO** (run `scripts/deploy-devnet.sh`, then paste the deploy transaction here).
- **Demo video (max 3 min):** **TODO**. Script in [`PITCH.md`](PITCH.md).
- **Pitch video (2–3 min):** **TODO**.

## Repository and technical overview (track requirement 2)

- **Architecture:** one Anchor program with PDAs for `Protocol`, `Will`, `Vault` (signing authority) and one `VaultAsset` + token account per mint. `claim_inheritance` takes the vault's mints as `remaining_accounts` in triplets, so one transaction pays an heir across the whole portfolio.
- **Solana integration:** the program custodies SPL tokens through PDA-owned token accounts. Execution is permissionless (keeper model), so no off-chain party is trusted to declare a death.
- **Key dependencies:** `anchor-lang` / `anchor-spl` 1.2.0, SPL Token, `@anchor-lang/core`, `@solana/web3.js`, Solana wallet adapter, Next.js 16.
- **Security considerations:** see README "Security notes and known limitations". Audit status: **unaudited**. Testing environment: local validator with 16 unit tests and 15 end-to-end tests. Material risks: unaudited code; a lost testator key fires the will after the silence period by design; reserved rule types are inert.

## Problem, users and validation (track requirement 3)

- **Problem:** self-custodied assets are stranded when the holder dies; the alternatives (sharing seeds, custodians) remove self-custody.
- **Target users (hypothesis):** Argentine retail investors who already hold crypto or tokenized assets and manage family savings; families of older holders.
- **Market context (sourced):** 12.3 M people with brokerage accounts in Argentina (BYMA, 2 Jul 2026); CNV RG 1150/2026 opens a tokenization sandbox until 31 Dec 2027; Argentina has no specific rule for crypto-asset inheritance. Details and caveats in `research/MERCADO-ARGENTINA.md`.
- **Verifiable validation evidence: TODO.** Nothing has been collected yet. Suggested minimum before 12 Oct: 10 short interviews with holders, recorded answers to "what happens to your crypto if you die tomorrow?", and the number who would try a devnet version. Keep the raw notes in `docs/validation/`.

## Progress and disclosures (track requirement 4)

**Starting point record.** Contest start: 14 Sep 2026. **TODO: the team must confirm when the idea and first code started.** What the git history of this repository shows:

| Date (ART) | State |
|---|---|
| 2 Oct 2026, before 17:00 | Anchor program written against Anchor 0.30.1 but **never compiled**; static regex checker in place of a compiler; landing-page scaffold; market and rules research in Spanish |
| 2 Oct 2026, 17:16 | First successful compile (migrated to Anchor 1.2). Fixed: heirs claiming later received less than their share; vault balances in `claim_inheritance` were never persisted; no way for a living testator to withdraw |
| 2 Oct 2026, 17:19 | 15 end-to-end tests passing on a local validator |
| 2 Oct 2026, 19:17 | Web app with demo personas, verified end-to-end in a browser |

Users, revenue, funding at start: **none** (TODO: confirm).

**Third-party and open-source components:** Anchor framework, SPL Token program, Solana web3.js and wallet adapter, Next.js, Tailwind CSS, lucide-react icons. All used as published, unmodified.

**Material use of AI.** AI coding assistants were used extensively. Claude Code (Anthropic) wrote most of the program migration, the bug fixes listed above, the test suite, the web app and these documents, under the direction of the team, which **TODO: describe your own contribution** (product idea, Argentine market and regulatory research, design decisions, review, demo). Every line in the repository is expected to be understood and defensible by the team in the Zoom interview.

**Weekly changelog:** [`CHANGELOG.md`](CHANGELOG.md).

## Team and roadmap (track requirement 5)

- **Team:** **TODO** names, roles, location (at least one co-founder must reside in Argentina), relevant background.
- **Roadmap:**
  1. Devnet deployment and public test with real users (October).
  2. Will address derived from the testator key; heir notification (email / Telegram) when a will becomes executable.
  3. Multiple sign-of-life channels (any signed transaction, social recovery guardians who can delay execution).
  4. Legal wrapper research with an Argentine lawyer: how the on-chain trigger can sit next to a traditional will. No claim of legal validity until then.
  5. Security audit before any mainnet use.
- **Business model (hypothesis):** small protocol fee on deposits or claims (the config already reserves `protocol_fee_bps`, currently unused); B2B integration for exchanges and PSAVs that need an inheritance flow.

## Registration checklist

- [ ] Every team member has a colosseum.com account (**deadline 12 Oct 2026, 23:59 PT** — the form closes after that).
- [ ] Project registered in the Superteam Argentina form.
- [ ] Submission on Superteam Earn (Argentina track) and on Colosseum.
- [ ] Repository public, or access granted to `hackathon@colosseum.com`.
