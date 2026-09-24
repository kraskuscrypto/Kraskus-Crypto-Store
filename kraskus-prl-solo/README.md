# Pearl by Kraskus

Native 5tratStore package for the Kraskus Pearl (PRL) full node, Oyster
wallet and solo-mining stratum gateway.

## Ports

- 33068 — 5tratumOS app proxy entry
- 44108/tcp — Pearl P2P
- 1902/tcp — Kraskus Pearl Stratum (miners)

pearld RPC (44107), Oyster RPC (44207), gateway telemetry (1903), the API
(18441) and the UI backend are not published to the host.

## Persistent data

All persistent state lives below `${APP_DATA_DIR}`:

- node/ — pearld blockchain data
- wallet/ — Oyster wallet (`mainnet/wallet.db`) and `.kraskus/` lifecycle
  state: `lifecycle.json`, the payout activation file `receive-address`, and
  — only while a new wallet's backup is pending — `pending-backup.json`
  (0600, deleted on confirmation)
- mining/ — `blocks.jsonl`, the gateway's found-block ledger
- secrets/ — generated node/wallet RPC credentials
- logs/ — node and wallet logs

`5tratumos app uninstall` keeps all of it; `--purge` removes it.

## Artwork

`assets/prl-emblem-std-v1.png` is the approved PRL application emblem used by the Store listing.

## 0.2.0

- Truthful readiness: one state (Starting / Syncing / Synced / Stratum not
  ready / Ready / Degraded / No peers / Node unavailable) drives /health,
  /api/status, /api/readiness, Home, Mining and Settings → System. Height 0,
  zero peers, a node behind its peers or a stale tip is never "synced"; the
  gateway withholds work until the node is synced.
- Wallet fund safety: create/restore run in the background (202); the
  recovery phrase is persisted (0600) before the wallet is reported; the
  wallet stays BACKUP_REQUIRED — with mining payout off — until the phrase is
  confirmed. Pre-0.2.0 wallets are migrated without inventing a backup.
- Customer Forget wallet (Settings → Wallet, typed `FORGET WALLET`); restoring
  the same phrase returns the same address.
- Blocks: a found-block ledger written by the gateway and verified against
  the node (pending / maturing / confirmed / orphaned / rejected); "no blocks
  found" and "block data unavailable" are distinct.
- Payout safety: the gateway pays only the app wallet's confirmed address,
  never falls back to any other address, and refuses a payout address equal
  to the developer-fee address. Miners log in with a worker name only.
- Reproducible images built from committed source with OCI version/revision
  labels; version 0.2.0 shown in Settings → About.
- Send is not offered in 0.2.0.
