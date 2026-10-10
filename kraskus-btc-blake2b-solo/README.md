# BTC2b by Kraskus

5tratumOS package for BTC2b by Kraskus: a pruned Bitcoin Knots node on the
BTC2b chain, one customer-owned reward wallet, and a CONVOY DATUM true-solo
Stratum V1 endpoint.

## 0.2.6: Bitcoin Knots 29.4.2 (consensus maintenance)

- **Why:** Bitcoin Knots 29.4.2 activated a *long coinbase maturity* soft fork
  on the BTC2b chain at block **973,440** (mined 2026-09-21), enforced until
  block 979,919. 0.2.5 ran Knots 29.4.1 and could follow or build blocks that
  upgraded nodes reject. 0.2.6 runs Knots 29.4.2.
- **Block rewards mature later.** Knots 29.4.2's wallet and mempool treat every
  block reward as spendable only after **6,480 blocks** (about 45 days; shown as
  6,481 confirmations). The Blocks page takes this rule from the node: rewards
  that 0.2.5 showed as mature read "Maturing x/6,481" again until they are deep
  enough. Nothing is lost; they mature on their own.
- **Network difficulty:** Knots 29.4.2 no longer reports a "difficulty" for
  BLAKE2b blocks. The app computes the same value from the block header, so the
  network difficulty, its history and the expected time to block are unchanged.
- **Updating:** in place. The chain, wallet and settings are kept. An existing
  0.2.5 install that already synced into the activation window is revalidated
  locally on its first start with 0.2.6: Knots rewinds to block 973,439 and
  re-checks the window's blocks from disk under the new rule (a few minutes).
  This does not need a full blockchain re-sync as long as those blocks are
  still on disk, which the default 100 GiB prune keeps; a node pruned much
  further may be asked to re-sync.
- **Maturity while the rule applies:** rewards need **6,481 confirmations**
  while Knots reports the long-coinbase-maturity deployment (active now,
  enforced through block 979,919).
- DATUM, Stratum, payout, wallet and the developer fee are unchanged.

## Chain

BTC2b is Bitcoin mainnet history hard-forked to BLAKE2b proof of work at
block 961640 by upstream Bitcoin Knots consensus (v29.4.2.knots20260508).
The node verifies the fork checkpoint; addresses are Bitcoin-style `bc1...`.

## Ports

- 33066/tcp: web interface (5tratumOS app port)
- 1923/tcp: Stratum V1 miner endpoint (BLAKE2b header v2, Sia-style work)

Knots P2P, Knots RPC, the DATUM API and the adapter API are not published
on the host.

## Upgrading from 0.1.x: read before updating

**Do not run an unattended update while the 0.1.x Knots container is still
running.** The 0.1.x node can take 2 to 6.5 minutes to shut down, because its
Tor-control thread hangs. The update can kill it during that shutdown, and a
killed node can corrupt its chain database. (0.2.0 disables that Tor
behaviour, so later updates are not affected.) `5tratumos app down` does not
help: it force-removes containers after 120 seconds.

Instead, stop only the BTC2b Knots container with a long timeout, confirm it
exited cleanly, then update:

```
sudo docker ps --filter label=com.docker.compose.service=knots --format '{{.Names}}' | grep kraskus-btc-blake2b-solo
sudo docker stop -t 600 <name printed above>
sudo docker inspect -f '{{.State.Status}} exit={{.State.ExitCode}}' <name printed above>
sudo 5tratumos store sync custom-kraskus-crypto-dev-store
sudo 5tratumos app update kraskus-btc-blake2b-solo --channel custom-kraskus-crypto-dev-store
```

The `inspect` line must print `exited exit=0` before you run the update. Do not
use `docker kill`, `docker rm -f`, `--purge`, or delete any chain or wallet
data. Wallets and the chain are preserved by the update.

If `app update` answers `invalid channel`, the host has an older 5tratumOS CLI
(see COMPATIBILITY-SETUP.md in the store). Nothing has been changed at that
point. With Knots already stopped as above, you can instead reinstall
**without** `--purge`, which keeps the chain and wallets:

```
sudo 5tratumos app uninstall kraskus-btc-blake2b-solo
sudo 5tratumos app install kraskus-btc-blake2b-solo --channel custom-kraskus-crypto-dev-store
sudo 5tratumos app up kraskus-btc-blake2b-solo
```

After the update:

- The Stratum port moves from 23334 to **1923**. Point miners at
  `stratum+tcp://<host>:1923`. Any worker name works; a payout address in
  the username is not needed and is never shown.
- Mining pauses after the update until the reward wallet has a confirmed
  backup. An existing 0.1.x wallet is kept: set its password, download the
  encrypted backup, verify it and confirm.
- The 0.1.x internal settlement wallet is kept and shown on the Wallet page.
  If it holds coins, back it up or sweep them into the reward wallet.
- External payout mode is retired; rewards go to the backed-up wallet.

## Mining hardware

The Stratum endpoint serves Sia-style BLAKE2b work. The authors of CONVOY
DATUM describe Antminer A3-class BLAKE2b hardware as the intended hasher.
Kraskus has not yet verified any ASIC against BTC2b. Kraskus's own BLAKE2b
miner has had shares accepted.

## Security note

5tratumOS app ports have no platform login. BTC2b requires the wallet
password for backup, restore, Forget, legacy sweep and node settings. On a
freshly installed, unconfigured app, whoever sets up the wallet first
becomes its owner, so complete setup from a trusted network.

## Persistent data

All state lives below `${APP_DATA_DIR}`: `blockchain/` (pruned chain and the
Knots wallets), `runtime/` (wallet state, settings, ledger cache),
`events/` (durable found-block log and submitted blocks) and `secrets/`
(generated RPC and DATUM credentials).

## Developer fee

DATUM is built with a fixed 1% developer output in the coinbase of blocks
this appliance finds. The fee is a build invariant and is verified at
runtime. Miner hashrate is never redirected.
