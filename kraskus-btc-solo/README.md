> **BEFORE UPDATING: move any funds held in the old native wallet to another wallet you control, confirm receipt, and securely back up the wallet and recovery information. This release removes native-wallet controls. Never purge legacy app data to upgrade.**

# Bitcoin by Kraskus0.5.6

BCH0.5.9 interface standard, adapted to Bitcoin: original hero, six themes and independent light/dark, interactive graph, round best-share percentage, worker details, external payout confirmation and safe pruning. Kraskus Pool remains under development.

No native wallet or key controls. The existing1% developer output and Bitcoin-specific address/SegWit/version-rolling rules are preserved. Start mining is available after synchronization and valid external-address confirmation. New installs remain paused; each appliance restart requires an explicit Start.

Pruning starts at30000MiB of block data, excluding chainstate/indexes. Adjusting1–1000GiB requires paused mining, fresh node telemetry and a clean node restart. Host-local resource overrides must be retained during updates, including their node command wrapper. Existing installations require the reviewed migration kit, which preserves chain/state paths, payout and limits. Never uninstall/purge to apply this update.

Software qualification:121 backend tests,12 real-node regtest checks, authenticated pruning restart and responsive/theme checks pass. Installed-platform migration is still pending. All app images are digest-pinned.

UI update 0.5.4: the header duplicates the hero coin face and the Home Node card shows current sync progress. Node, API, payout rules and fee are unchanged. UI source: https://github.com/kraskuscrypto/Kraskus-Mining-Platform/commit/6de2683454de0a413f6ee70b0c6edb1462868181.
