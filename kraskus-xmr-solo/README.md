# Monero by Kraskus

Native 5tratStore package for the Kraskus XMR true solo appliance.

## Ports

- 33065 — 5tratumOS app proxy entry
- 18080/tcp — Monero P2P
- 1921/tcp — RandomX Stratum solo-mining endpoint

monerod RPC, adapter RPC, wallet RPC, wallet API, and Stratum telemetry HTTP are not published to the host.

## Persistent data

All persistent state lives below `${APP_DATA_DIR}`:

- blockchain/
- wallets/
- runtime/

The package creates a private view-wallet password automatically during
first-run initialization if one does not already exist.

## Artwork

`assets/icon.png` is the approved Divinity XMR application icon from the
Kraskus brand asset vault.


## 0.1.1-beta

- Starts the UI independently so the 5tratumOS app shell opens while backend services initialize.
- Runs the miner gateway as UID/GID 1000:1000 to match persistent runtime storage ownership.
- Preserves blockchain, wallet, and runtime state in `${APP_DATA_DIR}`.


## 0.1.2-beta

- Bundles the Kraskus dynamic custom-channel compatibility bootstrap.
- On the known affected older 5tratumOS CLI, the bootstrap safely enables updates from dynamically named custom stores such as `custom-kraskus-5tratstore`.
- The bootstrap is conservative: it verifies the Kraskus store is configured, patches only the exact known stale channel-validation layout, creates a backup, runs `bash -n`, restores automatically on failure, and no-ops on compatible or unknown layouts.
- No Docker socket or privileged mode is used.


## 0.1.3-beta

- Removes the host-modifying compatibility bootstrap from the XMR package.
- Restores a stock 5tratumOS-compatible install recipe with no host CLI or store-config bind mounts.
- Retains the fast-start UI, gateway UID/GID 1000:1000, persistent APP_DATA_DIR storage, immutable image pinning, and approved Divinity app icon.
- Dynamic custom-store channel compatibility is being fixed at the 5tratumOS platform layer instead of by patching the host from inside the app.


## 0.1.4-beta

- Updates the restricted miner gateway to 0.1.1-beta with blocked POST endpoint audit events.
- Updates the wallet API to 0.1.1-beta with safe restore-height handling, legacy wallet migration, sync-wait gating, and autonomous refresh suppression while the local node is behind.
- Updates the UI to 0.1.2-beta with the finalized Divinity XMR hero, branded sidebar application icon, branded wallet receive waiting state, and explicit sync-locked send presentation.
- Adds the permanent XMR runtime qualification workflow for miner allowlists, blocked-request accounting, event auditing, mainnet identity, monerod availability, and wallet sync gating.
- Keeps monerod and adapter images unchanged.
- Full-sync mining and wallet-send qualification remain required before GA.


## 0.1.5-beta

- Updates the UI to 0.1.3-beta with a full responsive/mobile compatibility pass.
- Adds compact horizontal mobile navigation and phone/tablet-safe card stacking across all six tabs.
- Converts the Blocks submission history into a mobile-friendly record-card layout at phone widths.
- Makes wallet receive/send, settings controls, metrics, and long values responsive and touch-friendly.
- Preserves the 0.1.4-beta miner-gateway and wallet-API hardening unchanged.


## 0.1.6-beta

- Promotes the qualified immutable XMR runtime image set.
- Pins monerod, adapter, miner gateway, wallet API, and UI by exact GHCR digests.
- Adds persistent last-known-good node telemetry during temporary daemon RPC failures.
- Adds protected appliance-local spend credential storage for automatic developer-fee settlement.
- Full-wallet create and restore flows save the wallet password into a mode-0600 local credential used only for automatic fee settlement.
- Watch-only wallets remain monitoring-only.
- Kraskus XMR Solo charges a 0.25% developer fee only on successfully mined block rewards.
- Developer-fee settlement is automatic after reward maturity and does not divert miner hashrate.


## 0.1.7-beta

- Updates the XMR UI to the wallet-setup control fix from source commit `f69435d4898cfabab4d6e3948f78eef524715fda`.
- Clarifies Create New Wallet, Restore Existing Wallet, and Watch-Only as setup-method tabs rather than duplicate action buttons.
- Selecting a setup method now switches to the corresponding panel, updates accessibility state, and focuses the first relevant field.
- The lower form action remains the control that actually creates, restores, or configures the wallet.
- Keeps monerod, adapter, miner gateway, wallet API, automatic developer-fee settlement, and persistent storage behavior unchanged from 0.1.6-beta.


## 0.1.8-beta

- Updates only the XMR UI image from source commit `709e92f478ff1981053bd29e4b478e58562b68f0`.
- Corrects the sidebar footer and version service card so they display `v0.1.8-beta` instead of the stale `v0.1.1-beta` label.
- Keeps wallet setup, wallet/API, daemon, miner gateway, automatic developer-fee settlement, storage, and networking behavior unchanged from 0.1.7-beta.


## 0.1.9-beta

- Promotes the five images produced by canonical GitHub Actions build run `33825587530`, pinned by exact GHCR digests.
- Records canonical build source `9b371e3ba75f758098d9b1d63445ba37e8577eb7` and release metadata commit `46076d46195ed346c990d0fa336e8227e97f7b95`.
- Keeps the automatic developer fee at exactly 1% of successfully mined block rewards after 60-block maturity.
- Removes mining and wallet-send lockouts while automatic fee settlement is pending or temporarily failing.
- Preserves ledger integrity, orphan handling, retry, prepared-transaction recovery, fixed fee destination/rate/amount validation, and double-payment prevention.
- Remains a Dev Store candidate pending client-style VM100 qualification before any Official Store promotion.


## 0.1.10-beta

- Migrates the XMR appliance UI to Kraskus App Template V2 with the canonical Home, Mining, Wallet, Blocks, and Settings shell.
- Uses the new Next.js static-export UI and dynamic Docker-DNS nginx proxy configuration.
- Preserves the existing monerod, adapter, miner gateway, wallet API, automatic 1% developer fee, storage, and mining behavior from 0.1.9-beta.
- Pins only the new UI image to immutable digest `sha256:d9d14da0ce025c2169a599cd5dcb8908f0aba1a6f6081639bab88954d38ceb54`.
- Published to the Dev Store specifically for VM120 client-style install, restart, persistence, and UI qualification before any Main Store promotion.


## 0.1.11-beta

- Finalizes the Template V2 fidelity pass against the canonical Kaspa app.
- Changes the visible product name to **Monero by Kraskus**.
- Uses the exact supplied Monero emblem on the Template V2 hero coin.
- Preserves all XMR backend, wallet, mining, persistence, and automatic 1% developer-fee behavior.
- Pins the qualified UI image to immutable digest `sha256:10c132a36ba2cd0366e290ea4ccfebb95c2a5badbdd6af701edf60ad679eb4bf`.
- Published to the Dev Store for final VM120 client-style install/restart/persistence qualification.

## 0.1.14

- Replaces miner-facing daemon HTTP with XMRig-compatible RandomX Stratum on TCP 1921.
- Adds real worker identity, accepted/rejected shares, hashrate, Best Diff, and configurable share difficulty.
- Keeps true solo behavior: only a network-valid block is submitted to the local monerod.
- Switches block-template payout automatically to the configured local XMR wallet.
- Aligns Home, Mining, Wallet, Blocks, and Settings with the Kaspa Template V2 blueprint while preserving Monero-specific wallet behavior.
- Matches the configured Wallet normal-mode layout to Kaspa and retains Monero send/receive semantics.
- Removes the visible Top 10 Submitted Difficulty section while retaining underlying share telemetry.
- Keeps the automatic 1% developer fee maturity-gated, orphan-aware, retryable, non-blocking, and double-payment-safe.
- Pins all runtime images to the immutable GitHub Actions 0.1.14 build from source commit `da26f67f06e44b8287595cdef226d79aa673aaac`.

## 0.1.18

- Workers are listed in natural name order (`miner2` before `miner10`).
- Each worker shows its own assigned share difficulty, kept separate from best submitted share difficulty and Monero network difficulty.
- Several rigs behind one IP address are now distinct; opening a worker shows that worker.
- A rig can request its own fixed share difficulty by adding `+difficulty` to its username, for example `rig-01+50000`; the suffix is not shown in the worker name. (Removed in 0.1.20; per-worker difficulty is now configured in Workers.) There is no automatic difficulty adjustment (VarDiff); the default share difficulty stays 1,000.
- Saving a new default share difficulty asks for confirmation when miners are connected; every miner now reconnects within seconds instead of staying on a stale job.
- Share and event history files are size-bounded; lifetime accepted/rejected totals and best shares are kept across restarts and upgrades.
- Far fewer routine events and container log lines (no event per share or per block-template poll).
- Pins the rebuilt miner-gateway and UI images from GitHub Actions run 36323863586, source commit `2d3a9c1475e050576048e87b66d62e1ae8a9ca46`; monerod, adapter, and wallet-api digests are unchanged.

## 0.1.19

- Fixes wallet Reset followed by Restore failing with "Wallet already exists" and leaving the wallet half set up when the wallet was busy synchronizing.
- Reset now reports success only after both wallet services have really closed the wallet and its files are gone; if the wallet cannot be closed safely in time, Reset says so and removes nothing.
- A Restore that fails part-way no longer leaves a half-configured wallet; it can simply be retried. A slow Restore that times out in the browser still completes in the background.
- Includes the 0.1.18 worker, share-difficulty, reconnect and log changes unchanged.
- Pins the rebuilt wallet-api image from GitHub Actions run 36362496508, source commit `0f9a8cbf77015ae98ef7c8060987319a95cf838c`; miner-gateway and UI keep their 0.1.18 digests, monerod and adapter are unchanged.

## 0.1.20

- Per-worker difficulty is set in the app: open a worker under Mining → Workers and choose Difficulty **Default** or **Fixed** (100 to 2,147,483,646). Saving reconnects only that worker (about 5 seconds); other workers keep mining undisturbed. Settings are kept across restarts, updates, and uninstall without purge.
- The Workers list shows each worker's actual assigned difficulty and whether it uses Default or Fixed; "capped by network difficulty" appears only when a Fixed value is above the network difficulty.
- Difficulty suffixes in miner usernames (`name+difficulty`) are no longer supported. A login or rig ID containing `+` is refused with "Difficulty suffixes are no longer supported. Configure worker difficulty in XMR Solo → Workers."
- **Action for miners that used a `+difficulty` suffix:** after updating, remove the suffix from the miner configuration (use the plain worker name) and, if you want a fixed difficulty, set it for that worker under Workers. Existing wallet, node data, settings, and worker history are kept; no reset is needed.
- Pins the rebuilt miner-gateway and UI images from GitHub Actions run 36457837012, source commit `9b3831e487c8f8d6aa2606ffed978a516c2bc14f`; wallet-api (0.1.19), monerod and adapter are unchanged.

## 0.1.22

Security release (0.1.21 was an internal candidate and was never published).

- Showing the pending recovery seed, confirming the backup while a seed is pending, Reset and Send now need the wallet (spend) password. Reset of a watch-only wallet needs its secret view key.
- Wrong passwords are rate limited: after 5 failures from one address the check locks for 1 minute, doubling up to 1 hour; 30 failures in 15 minutes lock it for everyone for 15 minutes. The counters survive a restart and a Reset.
- The wallet API and the settings changes (default share difficulty, per-worker difficulty, appearance) are accepted only as same-origin JSON from an allowed LAN host: requests from another website, non-JSON bodies, bodies over 64 KiB and non-LAN host names are refused. Reads stay open.
- Watch-only setup checks that the secret view key belongs to the address and refuses a subaddress; before, a mismatched key gave a wallet that saw nothing while mining paid the address.
- A lost wallet password can be cleared only from the host: `docker exec <wallet-api container> python3 /app/wallet_api.py --reset-wallet --confirm RESET` (removes only this app's wallet files; restore from the 25-word seed afterwards).
- Wallet, payout, worker and share difficulty settings, statistics, logs, the developer-fee ledger and the chain are kept unchanged on update.
- Pins the rebuilt wallet-api and UI images from GitHub Actions run 38496523092, source commit `17381804e6124f4ee0ab952c276dfa4d2a00a25c`; miner-gateway (0.1.20), monerod and adapter (0.1.16) are unchanged.

## 0.2.0

Kraskus V3: the shared Kraskus app experience (Overview, Mining, Workers, Blocks, Wallet, Settings) on the same node, Stratum port and data.

- **Update keeps everything:** chain, both wallets, the wallet password, a pending backup, the payout address, share difficulty, saved per-worker Fixed difficulties, worker and share statistics, block and send logs, and the developer-fee ledger. Mining continues to the same address. Your theme choice is kept (it lives in your browser).
- **Wallet password:** the wallet password protects showing a pending recovery phrase, confirming the backup, Forget and Send. A 0.1.x full wallet keeps its existing password. A 0.1.x **watch-only** wallet sets its password once after the update, and that step asks for the wallet's secret view key; wrong keys count towards the same lock-out as wrong passwords.
- **New wallets:** create (25-word phrase, confirm 4 words, then set the password), restore (25 words, optional restore height) or watch-only (address + secret view key). Creation runs in the background, so a slow node no longer times it out.
- **Send** shows the exact amount, network fee and total from the transaction that will be relayed; the wallet password confirms it. Watch-only wallets cannot send.
- **Wallet status no longer goes "busy" after a restart:** balances and activity are served from a background snapshot with its age shown.
- **Payouts:** rewards go only to this app's own wallet. Turning payouts off stops mining (miners are refused) until they are turned on again with the wallet password.
- **Difficulty:** Settings → Mining sets one share difficulty (Automatic = the app default 1000, or a fixed value). Per-worker Fixed difficulties saved in 0.1.20–0.1.22 keep applying, but 0.2.0 has no per-worker editor. Network difficulty is shown only from a synchronized node; nothing is estimated.
- The `+difficulty` username suffix stays unsupported.
- The images now carry their third-party licences under `/usr/share/licenses` (Monero, XMRig Proxy with source directions).
- Pins five images built from Kraskus-Mining-Platform `v3/xmr`: monerod, miner-gateway, adapter and ui from source commit `7b8a5fcda8a9c7481e8905b183bbb3724acce517`, wallet-api from `1636d970d834059d2c0ef3067e20b719e6dfc584`.
