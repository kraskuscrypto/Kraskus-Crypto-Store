# Monero by Kraskus 0.3.4

> **Before updating:** Send any crypto held in the app’s native wallet to another wallet you control and confirm receipt. Securely back up the original wallet and recovery information. This release removes user-facing native-wallet access. Preserved legacy files are a recovery safeguard, not a substitute for moving funds. Never purge app data during an upgrade.

Use an external Monero mainnet primary address or subaddress. Confirm it in Settings, wait for node synchronization, then explicitly Start mining. Fresh installations and native-wallet migrations start paused; an explicitly selected Start/Stop state persists through ordinary restarts.

Each found block allocates 99% directly to the miner and a separate 1% developer output, rounded down to whole piconero. No hashrate is diverted. Monero rewards mature under its 60-block rule. No user wallet controls, seed prompts, balance or send interface remain. Legacy wallet directories and secrets are preserved on disk and are not mounted by this external-wallet recipe.

Local Stratum TCP1921; P2P18080; authenticated platform UI on loopback33065. Daemon RPC is internal. Protocol-defined pruning has no arbitrary disk-size slider. The read-only mempool reader reports actual counts and byte size and has no wallet mount or published port. Kraskus Pool remains Under development.

The current release is linux/amd64. See MAIN-RELEASE.md and LICENSES.md.
