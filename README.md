# wallet-evidence

Read-only **Solana transaction evidence reports**. Fetch a transaction through one configured public RPC and get an evidence summary: slot, block time, execution error, parsed instructions, fee — and a hash of the raw RPC response.

Part of the **Agent/Chain Evidence Tools** suite — CLI-first, read-only, no keys, no payments, JSON output.

## Quick start

```bash
npx wallet-evidence inspect <transaction-signature> --rpc=https://api.mainnet-beta.solana.com --json
```

## Why UNKNOWN matters

Observed in the wild: the same transaction signature can be visible on one public RPC and `not found` on another (indexing lag differs per provider). This tool **never equates "RPC cannot see it" with "transaction does not exist"** — it returns `UNKNOWN` with the RPC host recorded, so the report stays honest about its own evidence source.

## Report contents

- RPC host, slot, block time
- transaction execution error (`meta.err`)
- parsed instructions (incl. SPL transfers), instruction count
- fee
- SHA-256 hash of the raw RPC response (re-checkable)
- status: `OK` / `FAILED_TX` / `UNKNOWN`

## NOT covered (explicitly)

- Single-RPC view — not independent consensus
- No keys accepted, no transactions submitted, no simulation
- Not a wallet security or asset-protection product

## Status

Experimental (`0.1.0`). Local JSON-RPC fixture tests pass; real Devnet transaction lookups verified slot/transfer data stability.

## Siblings

[mcpdoctor](https://www.npmjs.com/package/mcpdoctor) · [oauthdoctor](https://www.npmjs.com/package/oauthdoctor) · [x402-reconcile](https://www.npmjs.com/package/x402-reconcile) · [crosschain-incident](https://www.npmjs.com/package/crosschain-incident)

MIT © 2026 xka0085-byte (Eidon)
