# Changelog

Weekly progress log required by the Superteam Argentina track.

## Week of 28 Sep – 4 Oct 2026

- Program compiles for the first time (Anchor 0.30.1 → 1.2.0 migration).
- Fixed: later heirs received less than their allocation (shares now computed against unclaimed basis points).
- Fixed: vault balances updated in `claim_inheritance` were never written back.
- Added `withdraw_asset`; any testator action now counts as a sign of life.
- Added `demo` build feature (1 inactivity day = 1 second) for live demos.
- 16 unit tests + 15 end-to-end tests on a local validator.
- Web app: create a will, fund it, heartbeat, execute as keeper, claim as heir; demo personas; localnet and devnet.
- CI (unit tests + app build) and GitHub Pages deployment.
- Pending: devnet deployment, user interviews, demo and pitch videos.
