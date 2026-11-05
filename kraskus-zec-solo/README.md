# Zcash by Kraskus0.6.0

External-payout template with the approved Zcash gold hero and BCH-standard interaction patterns.

Equihash(200,9), port3335, fixed difficulty500000 and the1% miner-controlled reward fee remain unchanged. Mandatory consensus allocations and the real coinbase helper are retained. Use a valid external transparent P2PKH address(t1 on Mainnet); unified, shielded, P2SH, wrong-network and checksum-invalid destinations are refused. No reward address is provided automatically, and mining starts paused.

Native-wallet controls, wallet routes, reconciliation and auto-shielding are retired. Existing wallet files and funds are preserved. **Legacy installations require the protected migration and cold wallet backup** before update; the legacy Zallet daemon is then stopped, not purged. No seed, key, balance or send control is presented.

Zebra’s existing node/storage/network-upgrade baseline is unchanged. Mainnet retains its320GiB preflight; the new UI explains blocked storage instead of fabricating sync progress. This release does not qualify NU7 or add pruning.

Validation:63runtime checks,98coinbase-helper checks, exact shipped-file hashes,6themes and6pages at desktop/375/320px. Backend scan retains49unfixed high findings, with no critical findings, available fixes or embedded secrets; UI scan clean. No new physical-miner or independent full-chain lifecycle run is claimed.

Source: https://github.com/kraskuscrypto/Kraskus-Mining-Platform/tree/fc34e8511d35455976c876846772bd4754e4f659/apps/zec-solo

## Kraskus Pool integration — Under Development

The Pool tab previews planned solo/pool switching, scheduled times with an explicit time zone, invite-only private mining groups, optional connection fallback and clear mode/fee/reward status. These controls are not implemented yet; support depends on the coin and pool. The introduction does not change current mining, payout addresses or fees. See pool-tab-update.json for the exact UI image and validation scope.
