# CHTA Kraskus (Kraskus CHTA Solo)

Native 5tratStore package for the Kraskus CheetahCoin full node and solo
mining appliance.

## Ports

- 33064 — web UI (5tratumOS dashboard; container port 8080)
- 1926/tcp — Stratum, normal SHA256 miners (min difficulty 1024 by default,
  start 4096, vardiff)
- 1927/tcp — Stratum, NMMiner / very-low-hash devices (fixed 0.002)

CheetahCoin Core RPC and P2P, the backend API and the wallet-transfer
directory are not published to the host.

## Persistent data

All persistent state lives below `${APP_DATA_DIR}`:

- `node/` — CheetahCoin Core chain data and the node's `wallet.dat`
  (`node/wallet-archive/` keeps any wallet retired by a reset or restore)
- `config/` — Core and CKPool configuration, settings, wallet state
- `secrets/` — generated Core RPC credentials
- `pool/`, `pool-lowhash/` — CKPool logs and telemetry for each port
- `wallet-transfer/` — transient backup/restore hand-off (normally empty)

A normal uninstall keeps this directory; `--purge` removes it, including the
wallet. Download and verify a wallet backup before purging.

## Logs

Each Stratum port's `ckpool.log` is rotated by the app itself (no host
logrotate): at 32 MiB it is renamed to `ckpool.log.1`, older generations move
up to `ckpool.log.3` and the oldest is dropped, so each port uses at most
about 128 MiB of log space. CKPool reopens its log once a minute, so no line
is lost, and every block the pools have seen is also kept in
`config/block-candidates-<port>.json`, so rotation never removes a found block
from the Blocks page. Per-block share logs are not written.

## Artwork

`assets/chta-official-emblem-v2.png` is the approved CHTA application emblem
used by the Store listing.

## 0.5.2

- Network difficulty no longer sticks at about 20 billion. CheetahCoin Core's
  block template inside the first 80 s after a block is a lottery between the
  spike target (bits `1836f9bf`, powLimit / 2e10) and the chain's regular
  work. 0.5.1 ignored that whole window; on a fast chain (blocks every few
  seconds at low difficulty) the tip is almost never older than 80 s, so 0.5.1
  kept the last value it had confirmed, which for long-running installs was
  the spike work of the pre-fork post-spike lock (19,999,698,720.47). 0.5.2
  takes the template's regular work whenever the lottery did not pick the
  spike target, so the value follows every block and every retarget.
- Unchanged: mining, CKPool and its ports (1926, and 1927 with the fixed
  0.002 difficulty), payouts, the wallet, the 1% developer fee and
  CheetahCoin Core 2.5.0.

## 0.5.1

- Network difficulty: the app now reports the regular network difficulty from
  CheetahCoin Core's block template, the same work CKPool hands to miners.
  A template counts only when Core is in its regular-work window, 81 to 240 s
  after the previous block, or at a retarget height. 0.5.0 showed Core's
  tip-block figure, which reads 0.0025 (shown as "0.002") whenever the tip is
  a cheetah block. Spike and cheetah work, share, port and worker
  difficulties are never shown as the network difficulty. While the node
  syncs, or before a value is confirmed, the interface shows "Updating…" and
  computes no percentage.
- Best share (this session) is CKPool's current-round best share, which resets
  when the pool finds a block. It is no longer the all-time best. CKPool
  records the block-finding share as the first best of the new round, so
  right after a found block the percentage starts at 100% or more. A miner
  idle since before the latest found block shows no round best.
- Mining, payout, the Stratum ports (1926; 1927 at a fixed 0.002), the wallet
  and the 1% developer fee are unchanged. CheetahCoin Core 2.5.0 and CKPool are
  the 0.5.0 and 0.3.1 images, unchanged.

## 0.5.0

- Kraskus V3: the shared V3 interface (Home, Mining, Workers, Blocks, Wallet,
  Settings) on foundation 1.2.0. The UI is served on port 33064 (container
  8080); the backend answers the V3 API.
- Security (V3 model): no app login. Every change and every wallet-data read
  must come through the 5tratumOS dashboard (its per-app proxy token, or an
  app token the backend creates at start on a platform without one). The
  wallet password is the only credential: it protects backup downloads,
  sending, Forget and payout changes after the first choice, with a
  persisted lock-out after repeated wrong passwords.
- Wallet set-up: create (or restore from your encrypted backup file) ->
  download the encrypted backup -> upload it back with its passphrase to
  verify -> set the wallet password last. Wallets from 0.3.x keep their
  existing password and skip that step. Backup files travel in chunks, so
  the dashboard's request-size limit no longer matters. The backup format is
  unchanged.
- Send: preview (address, amount, the fee CheetahCoin Core computes for the
  transaction, total) and confirm with the wallet password.
- Settings -> Mining -> Difficulty: Automatic (port 1926 minimum share
  difficulty 1024) or Manual (your minimum, 1 or more); CKPool keeps
  start = max(4096, minimum) and vardiff above it. The value in effect is
  shown once the Stratum service has applied it.
- Stratum: the interface shows the normal endpoint, port 1926. Port 1927 is
  unchanged and still serves NMMiner / very-low-hash devices at a fixed
  0.002 difficulty; its workers and shares are included in the totals
  (listed with instance 1927).
- CheetahCoin Core 2.5.0 (official release, SHA-256 verified). Same chain,
  wallet, RPC and P2P: the existing chain and wallet are reused in place,
  no reindex or rescan.
- Unchanged: CKPool (0.3.1 image), Stratum ports, payout logic, wallet file
  format, data paths and the 1% developer fee.

## 0.3.1

- Rejected shares are now the number of submissions the pool actually
  rejected (stale, duplicate, below the share difficulty, unknown job or
  invalid time). 0.3.0 showed CKPool's difficulty-weighted reject total, so on
  port 1926 a handful of rejected shares at difficulty 4096 appeared as tens
  of thousands of rejects and a very high reject percentage. Port 1927 was not
  visibly affected. Accepted shares, share acceptance, the payout and the 1%
  developer fee are unchanged. The corrected counter starts at zero when the
  updated pool starts; no action is needed after updating.

## 0.3.0

- Reproducible release: all custom images built from committed source with
  version/revision labels; CheetahCoin Core 2.4.0 downloaded from the official
  release and SHA-256 verified.
- Wallet backup safety: encrypted backup of the complete wallet file
  (scrypt + AES-256-GCM), verified by uploading it back before the wallet can
  send, be used as the mining payout or show its receive address. Reset /
  Forget wallet and Restore from backup, restoring the exact same address and
  keys. The wallet password can no longer be replaced by a second setup.
- Truthful readiness from real observations, per-port Stratum status, and
  Stratum ports that stay closed until the node and payout are ready.
- Port 1927 is a fixed 0.002 low-diff entrance independent of port 1926's
  settings; port 1926's minimum can no longer be set below 1.
- Upgrades now correctly restore the documented 1% Kraskus developer-fee
  coinbase split when upgrading from configurations that omitted it.
- Blocks distinguish "no blocks found" from "block data unavailable".
- Bounded CKPool logs (32 MiB x 3 generations per port) with block history
  preserved across rotation.
- Release version shown in Settings > About.
