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

## Agent / Chain Evidence Tools — the suite

All tools are read-only, take no keys, and emit JSON.

| Tool | What it checks / proves | Try |
|---|---|---|
| [mcpdoctor](https://github.com/xka0085-byte/mcp-doctor) | x402 payment endpoint & MCP server preflight | `npx @eidonze/mcpdoctor` |
| [oauthdoctor](https://github.com/xka0085-byte/oauthdoctor) | MCP OAuth discovery diagnostics | `npx oauthdoctor` |
| [x402-reconcile](https://github.com/xka0085-byte/x402-reconcile) | x402 402-challenge inspector | `npx x402-reconcile` |
| [wallet-evidence](https://github.com/xka0085-byte/wallet-evidence) | Solana transaction evidence reports | `npx wallet-evidence` |
| [crosschain-incident](https://github.com/xka0085-byte/crosschain-incident) | cross-chain message incident normalization | `npx crosschain-incident` |
| [ReceiptRail](https://github.com/xka0085-byte/agenttoll) | on-chain x402 delivery receipts (Solana) | [live MCP endpoint](https://agenttoll-receipts.app.workbuddy.host/) |

Live tools page: <https://x402-endpoint-inspection.app.workbuddy.host/tools.html>

MIT © 2026 xka0085-byte (Eidon)
---

## Suite hub

Part of the [Agent / Chain Evidence Tools](https://xka0085-byte.github.io/evidence-tools/) suite — read-only, no-keys, no-payments diagnostics for AI agents on Web3.
