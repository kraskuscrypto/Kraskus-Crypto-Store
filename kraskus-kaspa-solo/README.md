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

## 0.2.0-beta

- Wallet Send enabled with real Kaspa transaction preview, network-fee
  estimation, explicit confirm step, single-use preview tokens, and txid
  recovery after broadcast. Ambiguous post-broadcast outcomes fail closed and
  are never automatically retried.
- Existing configured wallets are no longer blocked by an unconfirmed-backup
  UI state when the one-time recovery phrase is no longer available.
- Automatic 1% developer-fee payment enabled for mature successful block
  rewards. The signer requires an operator-provisioned root-owned 0600 secret
  file; no wallet password or signing secret is included in this package.
- Updated immutable adapter, wallet-api, and UI images; live node, mining,
  worker telemetry, wallet, Blocks, and best-share/network-difficulty behavior
  revalidated on 5tratumOS.

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
