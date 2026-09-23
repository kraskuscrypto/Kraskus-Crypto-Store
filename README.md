# Kraskus Crypto Store

Official client-facing Kraskus Crypto Store releases for 5tratumOS.

## Published apps

Apps are promoted to Main only after completing the current Kraskus UI standard and release-qualification process.

- **Kaspa by Kraskus** — full node, true-solo miner, and native wallet. 0.3.0 replaces the earlier 0.2.0-beta listing after a full release-qualification pass: truthful node/stratum readiness, a durable wallet-backup ceremony with Send gated until the recovery phrase is confirmed, a customer Forget-wallet flow, source-built images with version/revision labels, and the canonical miner port 1900 (was 5556 in 0.2.0-beta; repoint miners after updating).
- **Mysterium Node** — Mysterium provider node with the Kraskus management UI.
- **XMR Solo by Kraskus** — Monero solo-mining node, wallet, and stratum gateway. XMR Solo 0.1.17 is the first app promoted under this qualification standard.

Other Kraskus apps remain temporarily unpublished while their interfaces are being updated to the current Kraskus UI standard and their release-qualification process completes. They will return to the Main Store after that work is done.

## First-time setup

Add this custom store in 5tratumOS using `https://github.com/kraskuscrypto/Kraskus-Crypto-Store`.

### Older 5tratumOS compatibility

Older 5tratumOS releases that reject dynamically named custom-store channels can use the compatibility installer below. Current compatible systems do not need it.

```bash
curl -fsSL https://raw.githubusercontent.com/kraskuscrypto/Kraskus-Crypto-Store/main/scripts/install-kraskus-compat.sh | sudo bash
```
