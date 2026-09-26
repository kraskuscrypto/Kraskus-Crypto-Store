# Kraskus Crypto Store

Official client-facing Kraskus Crypto Store releases for 5tratumOS.

## Published apps

Apps are promoted to Main only after completing the current Kraskus UI standard and release-qualification process.

- **CheetahCoin by Kraskus** (CHTA Kraskus) — CheetahCoin full node and SHA256 solo mining with two Stratum entrances: port 1926 for normal miners and port 1927, a fixed 0.002-difficulty entrance for NMMiner and other very-low-hash devices. 0.3.0 is the first CHTA listing to complete release qualification: both ports stay closed until the node is synchronized and the payout is ready, readiness and each port's state are reported truthfully, the built-in wallet stays backup-required (no send, no native payout) until an encrypted backup of the complete wallet file has been downloaded and verified, a customer Reset/Forget flow restores the exact same wallet from that backup, found blocks are verified against the chain, logs are bounded, and images are built from source with version/revision labels. A fixed 1.00% developer fee applies to successfully mined blocks.
- **Kaspa by Kraskus** — full node, true-solo miner, and native wallet. 0.3.1 (first-sync status fix: truthful headers / blocks / synced stages from official kaspad RPC data during a fresh node's pruning-point, header and UTXO initialization; no consensus, wallet, Stratum or mining change) on top of 0.3.0, which replaced the earlier 0.2.0-beta listing after a full release-qualification pass: truthful node/stratum readiness, a durable wallet-backup ceremony with Send gated until the recovery phrase is confirmed, a customer Forget-wallet flow, source-built images with version/revision labels, and the canonical miner port 1900 (was 5556 in 0.2.0-beta; repoint miners after updating).
- **Mysterium Node** — Mysterium provider node with the Kraskus management UI.
- **Pearl by Kraskus** — Pearl (PRL) full node, Oyster wallet, and solo-mining stratum gateway. 0.2.0 is the first PRL listing to complete release qualification: node and mining readiness are reported truthfully and the stratum gateway hands out work only once the node is synced, a new wallet stays in a backup-required state with mining payouts off until its recovery phrase is confirmed, a customer Forget-wallet flow restores to the same address, found blocks are tracked and verified against the chain, and images are built from source with version/revision labels. Miners connect on port 1902 with a worker name only; a fixed 1.00% developer fee applies to successfully mined blocks.
- **Zcash by Kraskus** — Zcash full node, solo mining pool, and native shielded wallet. 0.4.0 is the first ZEC listing to complete release qualification: the wallet daemon is now supervised and self-heals instead of dying silently, a customer Forget-wallet flow exists that deliberately preserves the synced chain, node and mining state are reported truthfully rather than guessed at, images are built from source with version/revision labels, and Mainnet activation is gated on a real storage check — the previous check silently passed every host because the backend never emitted the fields it compared.
- **XMR Solo by Kraskus** — Monero solo-mining node, wallet, and stratum gateway. XMR Solo 0.1.17 is the first app promoted under this qualification standard.

Other Kraskus apps remain temporarily unpublished while their interfaces are being updated to the current Kraskus UI standard and their release-qualification process completes. They will return to the Main Store after that work is done.

## First-time setup

Add this custom store in 5tratumOS using `https://github.com/kraskuscrypto/Kraskus-Crypto-Store`.

### Older 5tratumOS compatibility

Older 5tratumOS releases that reject dynamically named custom-store channels can use the compatibility installer below. Current compatible systems do not need it.

```bash
curl -fsSL https://raw.githubusercontent.com/kraskuscrypto/Kraskus-Crypto-Store/main/scripts/install-kraskus-compat.sh | sudo bash
```
