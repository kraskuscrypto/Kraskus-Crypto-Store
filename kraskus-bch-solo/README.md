# Bitcoin Cash by Kraskus 0.5.9

Solo mine Bitcoin Cash directly to your external CashAddr wallet. BCHN runs with its wallet disabled; this app never holds your private keys.

- Fixed 1% developer fee, rounded down to whole satoshis, paid in a separate output of each found block. The remaining reward goes directly to your configured address.
- Each startup is paused. Configure your address, wait for synchronization, then choose Start mining in the authenticated app.
- Local miner port: TCP 1933. Portal UI: loopback 33073. RPC is internal. No router forwarding is required for local miners.
- Live worker-only names and hashrate history, round effort, block lookup, Copy controls, light/dark modes, themes and reduced-motion support.
- Pruning defaults to 10000 MiB. Settings supports whole targets from 1 to 1000 GiB. Stop mining before applying a change; the node restarts cleanly. Pruning does not limit chainstate or total disk use. Lowering it discards old block data.
- Kraskus Pool is a future feature and remains marked Under development.

Images are pinned by digest. Source: private Mining-Platform commit ea5f14e7dc48124027a31f20ab9b2a343c1f9b23 (repository access required). Third-party notices: LICENSES.md and the image notices. This listing distributes the installation recipe, not proprietary source.

Fresh installs create their own state and token. Upgrades retain the external address, history and prune target. Never share a writable node datadir between nodes. Use a stopped-service or SQLite-supported backup for app state.

BCHN 29.2.0 has a recorded RPC expiry of 2027-05-15 12:00 UTC; update the node before that date. Mining rewards are probabilistic and never guaranteed.

UI update 0.5.10: the header duplicates the hero coin face and the Home Node card shows current sync progress. Node, API, payout rules and fee are unchanged. UI source: https://github.com/kraskuscrypto/Kraskus-Mining-Platform/commit/ff4cf14fab1eb3a63b4e0419bdd47e018d68da37.
