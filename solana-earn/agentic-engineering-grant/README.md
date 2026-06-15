# Agentic Engineering Grant Application Package

Grant: `agentic-engineering` on Superteam Earn

Applicant contact:

- Telegram: `http://t.me/alexh_01`
- X: `@alexh_016`
- Solana wallet: `4w57SS37DRxFPe8VxJ2334SkUPY1YDUQ3oMPyuGJ9Ntr`

## Short Application Answer

I want to build and ship a small open-source Solana product called **Solana Backend Primitives**: a set of practical backend patterns rebuilt as Solana programs, starting with an on-chain rate limiter / quota ledger.

The first proof of work is already public:

`https://github.com/s9f4wfzpmy-create/Cria-market-place/tree/main/solana-earn/onchain-rate-limiter`

This prototype maps a common Web2 backend service, API quota tracking, into Solana state using an Anchor `Registry` account and per-subject `Bucket` PDAs. The next step is to turn it into a polished developer demo with docs, diagrams, tests, and a tiny web client that lets builders understand when backend logic should live on-chain.

I will use agentic coding tools to accelerate:

- Anchor program hardening and tests.
- TypeScript SDK helpers for deriving PDAs and calling instructions.
- A simple documentation site and demo UI.
- More examples of backend primitives that make sense on Solana, such as access passes, credits, subscriptions, allowlists, and usage accounting.

The shipped MVP will include:

1. A working Anchor program.
2. Tests showing quota creation, consumption, reset, and reconfiguration.
3. TypeScript usage examples.
4. A public README explaining the Web2-to-Solana mapping.
5. A small demo UI or CLI if time allows.

The project fits Solana because it demonstrates a concrete, non-speculative use case for on-chain state: making backend counters, access rights, and usage limits public, auditable, and composable. This helps developers understand Solana as a distributed state machine, not only as a token network.

Requested grant amount: `200 USDG`.

## Milestone Plan

### Milestone 1 - Working Prototype

Status: started.

Deliverables:

- Anchor program for a public quota/rate-limit state machine.
- Registry and bucket PDA model.
- `consume` and `reconfigure_bucket` instructions.
- README and tests.

Existing proof of work:

`https://github.com/s9f4wfzpmy-create/Cria-market-place/tree/main/solana-earn/onchain-rate-limiter`

### Milestone 2 - Developer Usability

Deliverables:

- Cleaner test coverage for expired windows and failure cases.
- TypeScript SDK helper examples.
- Diagram of account model and instruction flow.
- Example use cases for RPC gateways, game actions, API credits, and DAO-managed services.

### Milestone 3 - Shipped MVP

Deliverables:

- Public repo folder with complete docs.
- Demo video or screenshots.
- Optional static web demo or CLI example.
- Final write-up explaining what should and should not be moved on-chain.

## Why This Is Practical

This is intentionally scoped small. A useful Solana demo should not require a giant protocol or speculative token. A clear backend primitive with real tests can help new builders understand account design, PDAs, authority checks, and state transitions faster than another generic tutorial.

The project can ship within one month with agentic coding support.
