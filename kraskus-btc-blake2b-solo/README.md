> **BEFORE UPDATING: move any funds held in the old native wallet to another wallet you control, confirm receipt, and securely back up the wallet and recovery information. This release removes native-wallet controls. Never purge legacy app data to upgrade.**

# kraskus-btc-blake2b-solo 0.3.3

Node startup stages are displayed truthfully. During startup verification the node does not supply current sync percentage; the pill shows the stage only. Once chain RPC is ready, the node-reported sync percentage returns.

This release updates API/UI status reporting and unlocks mining capability for owner-approved beta use. Mining still starts paused and requires a valid external payout address and a ready node. Existing node, controller, gateway and init images, chain paths, fees and prune targets are unchanged. No new physical-miner qualification is claimed. Older native-wallet releases require the protected migration first; preserve their wallet files and pruning settings rather than treating this as a fresh installation.

## Kraskus Pool integration — Under Development

The Pool tab previews planned solo/pool switching, scheduled times with an explicit time zone, invite-only private mining groups, optional connection fallback and clear mode/fee/reward status. These controls are not implemented yet; support depends on the coin and pool. The introduction does not change current mining, payout addresses or fees. See pool-tab-update.json for the exact UI image and validation scope.
