# kraskus-bsv-solo 0.6.2

Node startup stages are displayed truthfully. During startup verification the node does not supply current sync percentage; the pill shows the stage only. Once chain RPC is ready, the node-reported sync percentage returns.

This release updates API/UI status reporting and unlocks mining capability for owner-approved beta use. Mining still starts paused and requires a valid external payout address and a ready node. Existing node, controller, gateway and init images, chain paths, fees and prune targets are unchanged. No new physical-miner qualification is claimed. Older native-wallet releases require the protected migration first; preserve their wallet files and pruning settings rather than treating this as a fresh installation.
