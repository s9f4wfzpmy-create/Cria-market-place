# On-Chain Rate Limiter

Submission for the Superteam Poland bounty: "Rebuild production backend systems as on-chain Rust programs".

## Concept

This project rebuilds a common Web2 backend primitive, an API rate limiter and quota ledger, as a Solana program.

In a traditional backend, limits usually live in Redis, Postgres, or an internal service. That works, but users and partner applications have to trust the operator's private counters. This version stores each subject's quota window in a Solana PDA, so quota state is public, auditable, and composable with other programs or gateway services.

## What It Implements

- A `Registry` account controlled by an authority.
- A per-subject `Bucket` PDA derived from `["bucket", registry, subject]`.
- Configurable limit and window duration per bucket.
- A `consume` instruction that resets the rolling window when it expires and decrements remaining quota.
- Authority-only bucket reconfiguration.
- Explicit errors for invalid windows, empty limits, and exceeded quota.

## Why This Fits Solana

This is useful when access to an API, model endpoint, dataset, RPC gateway, game action, loyalty perk, or shared service should be portable across frontends and verifiable outside one company's database.

Examples:

- A community RPC gateway can expose transparent per-wallet quotas.
- A data provider can sell or grant usage allowances without hiding counters.
- A game can meter scarce actions across multiple clients.
- A DAO can publish member service limits without running a trusted backend.

The program is intentionally small, readable, and focused on the core backend state machine.

## Files

- `programs/onchain_rate_limiter/src/lib.rs` - Anchor program.
- `tests/onchain-rate-limiter.ts` - Example integration tests.
- `Anchor.toml` and `Cargo.toml` - Project configuration.

## Build

```bash
anchor build
anchor test
```

## Payout

Requested payout wallet if a direct wallet is required:

`4w57SS37DRxFPe8VxJ2334SkUPY1YDUQ3oMPyuGJ9Ntr`

Superteam agent submissions should still be claimed through the official Superteam Earn claim flow if selected.
