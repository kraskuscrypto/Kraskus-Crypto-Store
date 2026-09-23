# Kraskus Kaspa Solo

Native 5tratStore package for the Kraskus Kaspa full node and true solo
mining appliance.

## Ports

- 33067 — 5tratumOS app proxy entry
- 16111/tcp — Kaspa P2P
- 1900/tcp — Stratum solo-mining endpoint

kaspad RPC (gRPC/borsh/JSON), the adapter, and the wallet API are not
published to the host.

## Persistent data

All persistent state lives below `${APP_DATA_DIR}`:

- node/ — kaspad blockchain data (pruned, not archival)
- wallet/ — native Kaspa wallet state (customer wallet, the app-internal
  settlement wallet, and the one-time recovery-backup artifact while a new
  wallet's backup is pending)

## Artwork

`assets/kaspa-emblem-std-v2.png` is the approved Kaspa application emblem used by the Store listing.

## 0.3.0

- Truthful readiness: one state (Starting / Syncing / Synced / Stratum starting /
  Ready / Degraded / No peers / Node unavailable) derived from kaspad's own sync
  status, block and header counts, peers, the Stratum bridge's reported phase
  and a live stratum handshake. Home, Mining, the node header, Settings → System
  and the API agree, and the app never reports synced or mining-ready while the
  node is still at genesis.
- Wallet backup safety: a newly created wallet's recovery phrase is stored in a
  protected one-time artifact before the wallet becomes usable, shown through a
  backup ceremony that survives a lost page or a slow request, and deleted once
  the words are confirmed. Send stays disabled until then. Restored wallets are
  not affected.
- Forget wallet: Settings → Wallet → "Forget wallet" (typed confirmation) removes
  the customer wallet so a new one can be created or restored from its phrase
  with the same address. The internal settlement wallet, rewards not yet paid
  out, developer-fee records and chain data are untouched.
- Wallet service startup is retried with a bounded timeout and logs
  diagnostics instead of failing silently after a stall.
- Version 0.3.0 is shown in Settings → About and reported by every component;
  all images are built from committed source and carry version/revision labels.
- **Stratum port migration for Main Store customers:** the Main Store 0.2.0-beta
  package published the miner endpoint on host port **5556**; 0.3.0 uses the
  canonical Kraskus port **1900** (the bridge stays on 5556 internally), the
  same as the Dev Store 0.2.4/0.2.5 packages. After updating, point miners at
  `stratum+tcp://<appliance>:1900` (the Connect miner dialog shows the exact
  address). Existing Dev Store installs are unaffected.
- Browsers that used 0.2.0-beta may keep its cached page until one hard reload
  (Ctrl+Shift+R); 0.3.0 sends no-cache headers so this does not recur.
- Automatic 1% developer fee on successful blocks after coinbase maturity,
  handled by the internal rolling-reserve settlement wallet, is unchanged;
  miner hashrate is never diverted.

## 0.2.4

- Template V2 UI parity pass completed across Home, Mining, Wallet, Blocks, and Settings.
- Public Stratum endpoint standardized to port 1900 while the bridge remains on 5556 internally.
- Native wallet Send enabled through a guarded preview -> explicit confirm -> broadcast flow with real fee estimation, single-use preview tokens, txid recovery, and fail-closed ambiguous-broadcast handling.
- Existing configured wallets no longer become trapped behind an impossible recovery-confirmation screen when no persisted backup challenge exists.
- Automatic 1% developer fee remains successful-block-only. Mature coinbase rewards are handled by the internal rolling-reserve settlement wallet; miner hashrate is never diverted.
- Settlement secrets and recovery material remain root-owned 0600 files inside persistent app storage and are never included in the Store package.
- Hero coin updated to the approved Kaspa emblem treatment using the CHTA Template V2 construction.
- UI caching corrected so Workbench reloads pick up the current hashed bundle after app updates.
- Live node, wallet, mining, worker, payout, block, developer-fee, and send paths revalidated on 5tratumOS.

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
