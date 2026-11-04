> **BEFORE UPDATING: move any funds held in the old native wallet to another wallet you control, confirm receipt, and securely back up the wallet and recovery information. This release removes native-wallet controls. Never purge legacy app data to upgrade.**

# Pearl by Kraskus 0.6.4

Solo mine Pearl to a public external mainnet address. The app has no native-wallet setup, seed, private-key, balance or send interface. Configure and confirm your own address in Settings; wait for synchronization before choosing Start mining.

- Pearl node 1.5.5, with the existing certificate-v3 gateway and a read-only node RPC adapter.
- Fixed 1% developer fee, paid directly in the coinbase of a successful block: floor(total reward / 100) Grain. The miner receives the remainder. No separate wallet or payout signer is created.
- Fresh installations start with no payout address and mining paused. The miner endpoint is local TCP 1902; the authenticated platform UI uses loopback 33068. RPC and telemetry remain internal. P2P uses TCP 44108.
- Original Pearl hero styling and matching header medallion, sync percentage, worker telemetry, light/dark modes, Pearl palettes and working local-HTTP Copy controls.
- Honest unavailable states: the gateway does not expose durable worker history, round-specific best-share statistics or editable share difficulty. Pruning is not supported here. Kraskus Pool remains Under development.

## Data and upgrades

The new node uses `node-155/`. Public payout settings, RPC credentials, app token and mining ledger use `external-060/`. Existing legacy chain, wallet, configuration and funds are left in their original directories and are never mounted into this API. Upgrading an old native-wallet installation does not import its payout address or keys; configure an external reward address explicitly. A fresh node must sync unless an operator performs a separately checked chain-data seed. Never share a writable chain directory between running nodes.

Existing external-wallet installations retain their settings and chain. The new initializer creates missing runtime files only, and preserves existing credentials and public configuration. The API runs behind Docker init so its SIGTERM is delivered without requiring a forced kill.

## Qualification and resource bounds

The exact node/gateway/API images passed real-node and regtest checks, including winning certificate-v3 blocks, integer 1% coinbase allocation, both submission dialects and invalid-proof refusal. The owner waived the physical GPU-miner test; broad hardware/firmware compatibility and GPU throughput are not claimed. CPU proof tests covered k4096/rank128/2x64-tile circuits with m256/n512 matrices; larger k12288 proofs remain unqualified.

The gateway has a 6 GiB memory cap, the node 2 GiB, and both have bounded CPU. Allow sufficient host headroom in addition to other apps. The gateway's fixed difficulty remains 500000. Software scan reports retain remaining vulnerabilities; “no fix available” does not mean “no vulnerabilities.”

Images are pinned by digest. UI and external-wallet application source: private Mining-Platform commit 674c3dccf3a01688ea598ad187230072ca5bcf99 (repository access required). Pearl upstream source commit: d7c517d267f10f5bcbbdc366f3e603942f9a5ab5. The store distributes a recipe and artwork, with runtime code in the pinned images. See LICENSES.md for upstream notices.


## UI consistency update

Version 0.6.2 supplies the shared external-wallet interface, truthful startup/capability messages and normalized best-share values. This does not claim a new physical GPU test.


## Upgrade startup fix in 0.6.3

Directory bind mounts can be prepared before the initializer runs. RPC credentials are mounted through their read-only parent directory, avoiding missing individual file sources during container creation. Credentials already present are preserved. An empty directory accidentally created at a runtime-file location can be replaced with the required file; a nonempty directory is refused. Legacy wallet and chain directories are retained. No images, fee values, miner ports or mining intent are changed by this recipe patch.
