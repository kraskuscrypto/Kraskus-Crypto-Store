# BTC2b by Kraskus

5tratumOS package for BTC2b by Kraskus: a pruned Bitcoin Knots node on the
BTC2b chain, one customer-owned reward wallet, and a CONVOY DATUM true-solo
Stratum V1 endpoint.

## Chain

BTC2b is Bitcoin mainnet history hard-forked to BLAKE2b proof of work at
block 961640 by upstream Bitcoin Knots consensus (v29.4.1.knots20260508).
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
