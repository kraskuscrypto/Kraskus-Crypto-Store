# Kraskus Crypto Store

Official client-facing Kraskus Crypto Store releases for 5tratumOS.

## Published apps

The Main Store currently publishes:

- **Kaspa by Kraskus** — full node, true-solo miner, and native wallet.
- **CheetahCoin by Kraskus** — CheetahCoin full node and local SHA256 CKPool solo-mining appliance.
- **Mysterium Node** — Mysterium provider node with the Kraskus management UI.

Other Kraskus apps remain temporarily unpublished while their interfaces are
being updated to the current Kraskus UI standard. They will return to the
Main Store after their refresh and release qualification are complete.

## First-time setup

Add this custom store in 5tratumOS using
`https://github.com/kraskuscrypto/Kraskus-Crypto-Store`.

### Older 5tratumOS compatibility

Older 5tratumOS releases that reject dynamically named custom-store channels
can use the compatibility installer below. Current compatible systems do not
need it.

```bash
curl -fsSL https://raw.githubusercontent.com/kraskuscrypto/Kraskus-Crypto-Store/main/scripts/install-kraskus-compat.sh | sudo bash
```
