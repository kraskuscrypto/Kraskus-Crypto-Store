# Pearl by Kraskus

Native 5tratStore package for the Kraskus Pearl (PRL) full node, Oyster
wallet and solo-mining stratum gateway.

## 0.5.1

Miner compatibility (stratum gateway only):

- the gateway sends its `pearl.challenge` only to a miner that stays silent
  for half a second after connecting; AlphaMiner waits for it and works as
  before, while miners that speak first (SRBMiner-MULTI) no longer get an
  unsolicited method they reject;
- one stratum line may be up to 4 MiB (SRBMiner's shares are about 1.07 MB);
  a larger line gets a clean "Request too large" error and the connection
  closes;
- tested miners: **AlphaMiner 1.9.5**, **SRBMiner-MULTI 3.6.9**
  (`--algorithm pearlhash`); known incompatible: **WildRig Multi 0.51.2** and
  **WildRig Multi 0.51.3** (both tested 2026-10-12): they open with a non-JSON
  raw-hex handshake this gateway does not speak, so no shares are accepted;
  other WildRig versions are untested;
- pearld, Oyster, payout, difficulty (fixed 50,000), ports, wallet and the
  developer fee are unchanged; only the gateway image is rebuilt (the api and
  UI images are rebuilt with the new version number only).

## 0.5.0

Kraskus V3 migration (foundation 1.2.0):

- the shared V3 interface (Overview, Mining, Workers, Blocks, Wallet,
  Settings) and API contract;
- wallet set-up: the 12-word phrase is shown once, confirmed with a word
  challenge, then the wallet password is set (it protects payout changes and
  Forget); 0.2.x wallets keep their existing password;
- payout destination: the native wallet or your own external Pearl address;
- every state change and wallet read needs the platform proxy token, or the
  app token on platforms without it;
- the share difficulty stays the gateway's fixed 50,000 (shown read-only);
  no send. pearld, Oyster and the gateway are unchanged from 0.2.1.

## Ports

- 33068 — the app UI (127.0.0.1 under the 5tratumOS P2 secure proxy)
- 44108/tcp — Pearl P2P
- 1902/tcp — Kraskus Pearl Stratum (miners)

pearld RPC (44107), Oyster RPC (44207), gateway telemetry (1903), the API
(18441) and the UI backend are not published to the host.

## Persistent data

All persistent state lives below `${APP_DATA_DIR}`:

- node/ — pearld blockchain data
- wallet/ — Oyster wallet (`mainnet/wallet.db`) and `.kraskus/` lifecycle
  state: `lifecycle.json`, the native wallet record `receive-address`, the
  gateway's payout destination `payout-address` and `v3-payout.json` (0.5.0),
  and — only while a new wallet is being set up — `pending-backup.json` and
  `setup-passphrase` (0600, deleted on confirmation / when the wallet
  password is set)
- config/app-token/ — the app-token fallback (0.5.0; absent under the P2
  secure proxy)
- mining/ — `blocks.jsonl`, the gateway's found-block ledger
- secrets/ — generated node/wallet RPC credentials
- logs/ — node and wallet logs

`5tratumos app uninstall` keeps all of it; `--purge` removes it.

## Artwork

`assets/prl-emblem-std-v1.png` is the approved PRL application emblem used by the Store listing.

## 0.2.1

- Node readiness no longer reports "Node unavailable" while pearld is busy
  validating blocks. pearld's getblockchaininfo/getpeerinfo wait on the block
  being connected (observed up to ~30 seconds during block validation);
  liveness now uses its lock-free calls, the stall-prone ones only enrich the
  status with their last known values, and the node is reported unavailable
  only after real, sustained failure. The stratum gateway's sync gate uses the same probe, so it no longer
  closes (and rejects shares) during those stalls, and pearld's container
  healthcheck uses getblockcount.
- Wallet restore recovers history. A created wallet records its birthday
  (date and block height, shown with the recovery phrase); a restore takes that
  birthday (optional) and scans from it, or from the start of the chain when
  it is left blank. The wallet shows "Restoring wallet history" with scan
  progress, no balance and no mining payout until the scan has finished.
  Wallets restored with 0.2.0 are flagged: their older history may be missing
  until they are forgotten and restored again.

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
