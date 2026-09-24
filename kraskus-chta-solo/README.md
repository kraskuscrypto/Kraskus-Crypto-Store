# CHTA Kraskus (Kraskus CHTA Solo)

Native 5tratStore package for the Kraskus CheetahCoin full node and solo
mining appliance.

## Ports

- 33064 — 5tratumOS app proxy entry (web UI)
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
