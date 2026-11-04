# Kraskus Crypto Store

Official client-facing Kraskus Crypto Store releases for 5tratumOS.

## Current external-wallet releases

**Before updating an app that previously had a native wallet:** send any crypto held in the app’s native wallet to another wallet you control, confirm receipt, and securely back up the original wallet and recovery information. The new interfaces remove user-facing native-wallet access. Never purge app data during an upgrade.

- **Bitcoin by Kraskus 0.5.6** — external Bitcoin rewards, SHA256 Stratum TCP1932, fixed1% coinbase fee. Start mining is available after synchronization and valid address confirmation; fresh installs and appliance restarts remain paused.
- **Bitcoin Cash by Kraskus 0.5.12** — external CashAddr rewards, direct 99% miner / 1% developer coinbase allocation, SHA-256 Stratum TCP1933. Based on the hardware-tested BCH release with the current Kraskus UI and security-library refresh.
- **Monero by Kraskus 0.3.5** — external primary/subaddress rewards, direct 99% miner / 1% developer coinbase allocation, RandomX Stratum TCP1921. Legacy native-wallet files remain preserved and are not mounted by this edition.
- **Kaspa by Kraskus 0.5.4** — external reward destination, Kaspa miner TCP1900, fixed 1% developer fee. An internal settlement wallet forwards matured rewards after the fee and network costs; this is not direct external coinbase payment. Back up the complete wallet directory, including settlement records.

These releases target linux/amd64. Fresh installations start mining paused. Configure and confirm an external destination, wait for node readiness, then explicitly Start mining. Synchronization does not require an external reward address. The Kraskus Pool tab remains Under development. See each app’s MAIN-RELEASE.md for validation scope and remaining limitations.

## Other published apps

Apps are promoted to Main only after completing the current Kraskus UI standard and release-qualification process.

- **CheetahCoin by Kraskus 0.6.2** — external rewards, CheetahCoin Core2.5.0, normal/low-hash SHA256 entrances TCP1926/1927, fixed1% developer allocation. No native-wallet controls.
- **Mysterium Node** — Mysterium provider node with the Kraskus management UI.
- **Pearl by Kraskus 0.6.4** — Pearl node1.5.5, external rewards, GPU miner TCP1902, fixed1% direct coinbase fee. Existing node certificates and legacy files are preserved.
- **XBT by Kraskus 0.3.3** — existing Knots BLAKE2b fork at height961640, external rewards, DATUM miner TCP1923 and fixed1% coinbase fee. This is not ordinary Bitcoin SHA256; the node’s long maturity rules remain.
- **Zcash by Kraskus** — Zcash Mainnet full node (Zebra 6.2.3), Zallet wallet and Equihash 200,9 solo mining on port 3335. 0.5.2 brings the Kraskus V3 interface: one truthful mining-readiness state, workers, shares and node-confirmed blocks; a 24-word recovery-phrase wallet protected by a wallet password (receive, send with a fee preview, Forget, restore); payouts to the built-in wallet or your own transparent t-address; mining jobs are issued again (the 0.4.0 image lacked the 1% developer-fee coinbase component). Mainnet only: Zebra does not start until 320 GiB is free. **Pre-NU7 release:** Zebra 6.2.3 stops on Mainnet at its end-of-support height (about 2026-11-08) and does not support the Zcash NU7 upgrade; an NU7 maintenance update is required and will follow.
- **Bitcoin SV** (BSV Kraskus) — a pruned SV Node 1.2.2 Bitcoin SV mainnet node (10 GB excessive block size), a built-in SV Node wallet with an encrypted backup of the complete wallet file, and a native GMC-to-Stratum V1 true-solo endpoint on port 1922. 0.5.2 is the first Bitcoin SV listing on the Kraskus V3 interface to complete release qualification: plain Stratum V1 miners and modern SHA-256 ASICs that use version rolling (BIP310 / ASICBoost, e.g. LuxOS on an Antminer S19k Pro) both mine, with shares and found blocks validated against the exact header the miner hashed; the Miners list shows worker names only; mining stays off until the node is synchronized, a valid payout is configured and, for the built-in wallet, an encrypted backup has been downloaded and verified. A required 1% developer fee is paid directly from each successful block coinbase to 1H93uGCuskHDz5wXYskf39Lhy67aYupFk5; a payout address equal to it is refused. Sending from the built-in wallet is not available.
- **DigiByte by Kraskus 0.3.1** — DigiByte Core9.26.7, independent SHA256/Scrypt/Skein lanes TCP1928/1929/1930, external rewards and the existing1% fee split. Native wallet disabled; preserved wallet files are not deleted.

Other Kraskus apps remain temporarily unpublished while their interfaces are being updated to the current Kraskus UI standard and their release-qualification process completes. They will return to the Main Store after that work is done.

## First-time setup

Add this custom store in 5tratumOS using `https://github.com/kraskuscrypto/Kraskus-Crypto-Store`.

### Older 5tratumOS compatibility

Older 5tratumOS releases that reject dynamically named custom-store channels can use the compatibility installer below. Current compatible systems do not need it.

```bash
curl -fsSL https://raw.githubusercontent.com/kraskuscrypto/Kraskus-Crypto-Store/main/scripts/install-kraskus-compat.sh | sudo bash
```
