# kraskus-bsv-solo 0.6.2

Node startup stages are displayed truthfully. During startup verification the node does not supply current sync percentage; the pill shows the stage only. Once chain RPC is ready, the node-reported sync percentage returns.

This release updates API/UI status reporting and unlocks mining capability for owner-approved beta use. Mining still starts paused and requires a valid external payout address and a ready node. Existing node, controller, gateway and init images, chain paths, fees and prune targets are unchanged. No new physical-miner qualification is claimed. Older native-wallet releases require the protected migration first; preserve their wallet files and pruning settings rather than treating this as a fresh installation.

## Kraskus Pool integration — Under Development

The Pool tab previews planned solo/pool switching, scheduled times with an explicit time zone, invite-only private mining groups, optional connection fallback and clear mode/fee/reward status. These controls are not implemented yet; support depends on the coin and pool. The introduction does not change current mining, payout addresses or fees. See pool-tab-update.json for the exact UI image and validation scope.


## Community links

This UI update adds [Discord](https://discord.gg/P8qb9PXG7) and [X](https://x.com/KraskusCrypto) to the app header. Links open in a separate tab. Mining, wallets, fees and payout behavior are unchanged. Existing app data is retained.
