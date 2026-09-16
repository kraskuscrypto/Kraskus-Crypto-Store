# Kraskus Kaspa Solo

Native 5tratStore package for the Kraskus Kaspa full node and true solo
mining appliance.

## Ports

- 33067 — 5tratumOS app proxy entry
- 16111/tcp — Kaspa P2P
- 5556/tcp — Stratum solo-mining endpoint

kaspad RPC (gRPC/borsh/JSON), the adapter, and the wallet API are not
published to the host.

## Persistent data

All persistent state lives below `${APP_DATA_DIR}`:

- node/ — kaspad blockchain data (pruned, not archival)
- wallet/ — native Kaspa wallet state

## Artwork

`assets/icon.png` is the official Kaspa mark, sourced from
https://kaspa.org/icon.svg.

## Deferred functionality

- Wallet Send is disabled in this release.
- The automatic developer fee accrues and reconciles against real wallet
  UTXOs, but automatic on-chain payment of the accrued fee is not yet
  enabled.

## 0.1.0-beta

- Initial 5tratStore release. Self-contained appliance: bundles its own
  pruned kaspad, Stratum bridge, adapter, wallet API, and UI — no shared or
  external Kaspa node dependency of any kind.
- Native Kaspa wallet with real balance, receive address/QR, and payout
  arm/disarm controls. Wallet Send remains locked (not yet enabled).
- Real Stratum solo mining: worker connect/authorize, VarDiff, accepted
  share tracking, per-worker best-share difficulty, and Block Hunt
  visualization driven only by real mining signals (no simulated data).
- Automatic 1% developer-fee accounting reconciles against real wallet
  UTXOs after coinbase maturity; automatic fee payment is intentionally
  deferred to a later release.
- All runtime images (stratum, adapter, wallet-api, ui) are pinned by exact
  GHCR digests; kaspad is pinned to the official `kaspanet/rusty-kaspad`
  upstream digest.
- Qualified through a clean 5tratumOS-style install test with fresh app
  data, and a live synced-node mining validation against a real ASIC
  (IceRiver) submitting genuine Stratum shares end-to-end: connect,
  authenticate, submit, accept, worker API visibility, Best Share update,
  and correct disconnect/idle/offline worker-lifecycle transitions — all
  passed with zero rejected/invalid shares and zero container restarts.
