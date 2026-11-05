# Kraskus Crypto Store

Official client-facing Kraskus Crypto Store releases for 5tratumOS.

## Current external-wallet releases

**Before updating an app that previously had a native wallet:** send any crypto held in the app’s native wallet to another wallet you control, confirm receipt, and securely back up the original wallet and recovery information. The new interfaces remove user-facing native-wallet access. Never purge app data during an upgrade.

- **Bitcoin by Kraskus 0.5.7** — external Bitcoin rewards, SHA256 Stratum TCP1932, fixed1% coinbase fee. Start mining is available after synchronization and valid address confirmation; fresh installs and appliance restarts remain paused.
- **Bitcoin Cash by Kraskus 0.5.13** — external CashAddr rewards, direct 99% miner / 1% developer coinbase allocation, SHA-256 Stratum TCP1933. Based on the hardware-tested BCH release with the current Kraskus UI and security-library refresh.
- **Monero by Kraskus 0.3.6** — external primary/subaddress rewards, direct 99% miner / 1% developer coinbase allocation, RandomX Stratum TCP1921. Legacy native-wallet files remain preserved and are not mounted by this edition.
- **Kaspa by Kraskus 0.5.5** — external reward destination, Kaspa miner TCP1900, fixed 1% developer fee. An internal settlement wallet forwards matured rewards after the fee and network costs; this is not direct external coinbase payment. Back up the complete wallet directory, including settlement records.

These releases target linux/amd64. Fresh installations start mining paused. Configure and confirm an external destination, wait for node readiness, then explicitly Start mining. Synchronization does not require an external reward address. The Kraskus Pool tab remains Under development. See each app’s MAIN-RELEASE.md for validation scope and remaining limitations.

## Other published apps

Apps are promoted to Main only after completing the current Kraskus UI standard and release-qualification process.

- **CheetahCoin by Kraskus 0.6.3** — external rewards, CheetahCoin Core2.5.0, normal/low-hash SHA256 entrances TCP1926/1927, fixed1% developer allocation. No native-wallet controls.
- **Mysterium Node** — Mysterium provider node with the Kraskus management UI.
- **Pearl by Kraskus 0.6.5** — Pearl node1.5.5, external rewards, GPU miner TCP1902, fixed1% direct coinbase fee. Existing node certificates and legacy files are preserved.
- **XBT by Kraskus 0.3.4** — existing Knots BLAKE2b fork at height961640, external rewards, DATUM miner TCP1923 and fixed1% coinbase fee. This is not ordinary Bitcoin SHA256; the node’s long maturity rules remain.
- **Zcash by Kraskus 0.6.2** — external transparent t1 rewards, Equihash200,9 TCP3335 and the existing1% developer allocation. Native-wallet access is removed; legacy files and recovery backups must be preserved. The existing storage and pre-NU7 node compatibility limits remain; this UI update does not upgrade consensus software.
- **Bitcoin SV by Kraskus 0.6.4** — external rewards, SHA256 Stratum TCP1922, existing1% developer fee and version-rolling support. Native-wallet controls are removed; legacy wallet data remains protected. Enter and confirm your own external destination before starting mining.
- **DigiByte by Kraskus 0.3.2** — DigiByte Core9.26.7, independent SHA256/Scrypt/Skein lanes TCP1928/1929/1930, external rewards and the existing1% fee split. Native wallet disabled; preserved wallet files are not deleted.

Other Kraskus apps remain temporarily unpublished while their interfaces are being updated to the current Kraskus UI standard and their release-qualification process completes. They will return to the Main Store after that work is done.

## First-time setup

Add this custom store in 5tratumOS using `https://github.com/kraskuscrypto/Kraskus-Crypto-Store`.

### Older 5tratumOS compatibility

Older 5tratumOS releases that reject dynamically named custom-store channels can use the compatibility installer below. Current compatible systems do not need it.

```bash
curl -fsSL https://raw.githubusercontent.com/kraskuscrypto/Kraskus-Crypto-Store/main/scripts/install-kraskus-compat.sh | sudo bash
```

## Planned Pool integration

The coin apps preview Under Development solo/pool mode selection, schedules, private mining groups, optional fallback and clear mode/fee/reward status. These app controls are planned, not available switches. Public pool availability is coin-specific.
