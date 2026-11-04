# Kaspa by Kraskus 0.5.3

> **Before updating:** Send any crypto held in the app’s native wallet to another wallet you control and confirm receipt. Securely back up the original wallet and recovery information. This release removes user-facing native-wallet access. Preserved legacy files are a recovery safeguard, not a substitute for moving funds. Never purge app data during an upgrade.

Use an external Kaspa mainnet reward address. Confirm it in Settings, wait for the node, bridge and settlement service to be ready, then explicitly Start mining. A missing address does not prevent node synchronization. A fresh configuration starts paused.

Kaspa uses an **internal settlement wallet**: matured block rewards are forwarded to the configured external destination after the fixed 1% developer fee and network costs. This is not direct coinbase payment to the external destination. The internal signing material and settlement ledger remain appliance-local; preserve and back up the entire wallet directory. Existing customer wallet files are preserved, but customer wallet controls are unavailable.

Local miner TCP1900; P2P16111; authenticated platform UI on loopback33067. Node and wallet RPC are internal. State persists under node/ and wallet/ below the app data directory. No seed or private-key entry is needed in the UI. Kaspa-native pruning and bridge difficulty remain node-managed.

The read-only mempool reader reports the actual transaction count. Byte size, block lookup and durable worker history are not reported by this adapter; unavailable capabilities are not fabricated. Kraskus Pool remains Under development.

Current release is linux/amd64. See MAIN-RELEASE.md and LICENSES.md.
