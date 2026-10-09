# Bitcoin SV

Bitcoin SV (SV Node 1.2.2, pruned) node and private solo-mining controller for
5tratumOS. Miners connect to `stratum+tcp://<host>:1922` with any worker name;
rewards pay the address configured in the app (external address or the
built-in wallet). 1% of each block reward is a developer-fee coinbase output.

## 0.5.2

Display-only cleanup; Stratum, payout, wallet and the node are as in 0.5.1.

- **Worker names:** the Miners list, worker details and found blocks show only
  the worker name (the part after the last dot), e.g. `Ashborne` for
  `<address>.Ashborne`. The address part is never shown. Miners keep using
  the same username.
- **Miner username help:** any worker name is accepted; an
  `<address>.<worker>` username is also accepted, and the app shows only the
  worker name.

## 0.5.1

Stratum compatibility for modern SHA-256 ASICs. Nothing else changes: node,
wallet, payout, difficulty, developer fee and the interface are as in 0.5.0.

- **Version rolling (BIP310 / ASICBoost):** `mining.configure` now grants
  version rolling with mask `1fffe000` (or the overlap with the miner's own
  mask), so firmware that requires it (for example LuxOS on an Antminer
  S19k Pro, the Avalon Nano 3S) can subscribe and mine. Shares and block
  candidates are checked against the header the miner actually hashed,
  including its rolled version bits, and a found block is submitted to SV
  Node with that version.
- Plain Stratum V1 miners (no `mining.configure`) work exactly as before.

## 0.5.0

Bitcoin SV on the Kraskus V3 app template (foundation 1.2.0), the same
interface as Kaspa by Kraskus 0.4.0. Mining, the node and the wallet work
exactly as in 0.4.0: SV Node 1.2.2, the same data bind mount, command, prune
target and 660 s stop grace, the same Stratum port 1922 and 1% developer fee.

- **Interface:** the shared Kraskus V3 UI (Home, Mining with workers, Wallet,
  Blocks, Settings, hashrate trend, system health). The silver B/SV coin stays.
- **Wallet:** create -> download the encrypted backup file -> upload it back
  with its passphrase and confirm (the app checks that the file restores this
  wallet) -> set the wallet password. Restore by uploading a backup file (or a
  raw `wallet.dat`); the file is checked before anything is replaced. Payout
  destination: Native Wallet ON/OFF or your own external address. Sending
  from the built-in wallet is still not available.
- **Difficulty** (Settings -> Mining): Automatic (the app default share
  difficulty, 16,384) or Manual (one value for all miners), with the current
  difficulty shown.
- **Platforms without the 5tratumOS proxy token** (stock 5tratumOS, Umbrel):
  the app creates its own internal token at start, so wallet actions work
  there too; the wallet password still protects every sensitive action.
- The 0.4.0 "Rescan wallet history" action is not in this interface (the
  service is unchanged).

## 0.4.0

Hardened release on the Kraskus foundation 1.1.1 (Kaspa Solo 0.3.3 model).
Nothing about the chain changes: SV Node 1.2.2, uid 999, the same data bind
mount, command, prune target and 660 s stop grace.

- **Name and look:** the product is now called **Bitcoin SV** (the
  top-left label stays BSV Kraskus) and the Home hero is the brushed-silver
  B/SV coin, replacing the 0.3.3 gold dragon coin. Ticker, network, app id
  and image names are unchanged.
- **Access:** the 5tratumOS login + per-app proxy token gate every state
  change and every wallet-data read; the UI port 18422 is published on
  127.0.0.1 only (open the app from the 5tratumOS dashboard).
- **Wallet password** (the only app credential): set as the last step of
  wallet set-up (create or restore -> back up -> verify -> set password).
  Required, over the dashboard's HTTPS and behind a lock-out (5 free
  failures, then 60 s doubling to 1 h), for the encrypted backup export,
  Forget, payout destination changes and the wallet history rescan.
- **The app never rebuilds the blockchain.** The 0.3.x "Rebuild History"
  (SV Node `-reindex`, a full re-download) is removed; the node supervisor
  also refuses to start if its command or `bitcoin.conf` asks for a reindex.
- **Rescan wallet history** (Wallet, destructive zone): rescans only the
  wallet over the blocks this node still has, from the wallet's first block
  (or the prune height, whichever is later) to the tip. Wallet password +
  the typed phrase `RESCAN WALLET`. It can take hours and keeps SV Node busy
  while it runs; nothing is deleted, re-downloaded or rebuilt. History older
  than the prune height cannot be rescanned and the app says so.
- **Genesis-sync guard:** SV Node refuses to start (exit 78, nothing changed)
  when a chain was there before but `chainstate/` is now missing or empty,
  for example a missing bind mount.
- **Workers/Miners:** live online / idle / offline state, estimated
  hashrate, accepted / stale / invalid shares, difficulty, session uptime,
  session-best share and blocks per miner.
- Miners use any non-empty username (the worker name); the password is
  ignored; rewards always go to the payout configured in the app.
- **Updates from a named Kraskus store (5tratumOS v0.8.28):** the platform
  refuses `app update` from a `custom-…` store ("invalid channel"). Run the
  shared Kraskus store-compatibility bootstrap ONCE, as root, to map the
  store into a free custom2/custom1 slot (never overwrites one):

      sudo bash /opt/5tratumos/store/<kraskus-store-slot>/kraskus-bsv-solo/kraskus-store-bootstrap.sh

  It prints one `KRASKUS_STORE_BOOTSTRAP=…` line; `--check` changes nothing,
  `--rollback` undoes it. It touches only `/etc/5tratumos/store.json` (with a
  backup) and the new slot; never the CLI, containers, apps or P2 files.
  It cannot run automatically on v0.8.28 (root-only host change; 5tratumOS
  runs no store code).
- API and controller run as uid 10001; secret and wallet files are 0600.
- `/api/overview` no longer answers 500 during initial sync.

## 0.3.3

Home hero coin face only; everything else is unchanged from 0.3.2.

- The hero coin is gold: engraved legend band from the Satoshi Vision
  reference coin, BSV side marks, circuit traces and a dragon coiled behind the struck B, drawn
  in code (`ui-v2/components/bsv-coin-face.tsx`, no image asset). The coin's
  size, float and tilt, orbits and glow are unchanged.

## 0.3.2

SV Node shutdown hardening; everything else is unchanged from 0.3.1.

- Every SV Node stop is logged by the node supervisor:
  `BSV_NODE_SHUTDOWN_BEGIN`, then `BSV_NODE_SHUTDOWN_CLEAN`,
  `BSV_NODE_SHUTDOWN_UNCLEAN` or `BSV_NODE_SHUTDOWN_TIMEOUT`.
- A clean exit leaves `.kraskus-node-clean-shutdown` in the node datadir; a
  stop that runs out of time exits 137 instead of reporting success; a start
  after an unconfirmed stop logs `BSV_NODE_PREVIOUS_SHUTDOWN_UNCONFIRMED`.
- `bsv-safe-stop.sh` (in this package) stops SV Node with up to 900 s to
  flush and refuses to continue an update or reinstall unless the clean exit
  is confirmed. Run it before any update, `app down` or `app uninstall`:

      sudo bash /opt/5tratumos/store/<channel>/kraskus-bsv-solo/bsv-safe-stop.sh --then update

## 0.3.1

Stratum job-lifecycle hotfix; everything else is unchanged from 0.3.0.

- Same-tip template refreshes keep earlier jobs valid (`clean_jobs=false`);
  each job for the current block is honoured for 10 minutes, up to 64 jobs.
  Refreshes are published at most every 30 s; a new block is published at
  once with `clean_jobs=true` and retires every older job.
- Share replies distinguish `stale job` (old block), `Job not found
  (expired)` and `Job not found` (never issued).
- A transient node condition (an RPC call timing out while SV Node is busy)
  holds the gate open with the issued jobs for up to 90 s instead of
  disconnecting every miner; the cause is logged (`BSV_GATE_HOLD`).
- Every Stratum disconnect is logged with its reason
  (`BSV_STRATUM_DISCONNECT`) and counted in the controller status.

## 0.3.0

- Images rebuilt from committed source (`apps/bsv-solo/build.sh`), labelled
  with version and source revision; hero artwork restored in source.
- SV Node always runs with `-excessiveblocksize=10000000000` (10 GB),
  appended last by the node supervisor and verified via `getsettings`.
- One readiness model for Home, Mining, Stratum and the API; Stratum 1922
  refuses miners with a reason until the node is synced, has peers, a payout
  is configured and (for the built-in wallet) its backup is confirmed.
- Built-in wallet: create, encrypted full `wallet.dat` backup, verify and
  confirm, forget, restore (Kraskus backup or raw `wallet.dat`) to the same
  address, pruned-history rebuild. Sending removed.
- Blocks from a durable ledger with confirmed / maturing / orphaned /
  rejected states; "no blocks found" is distinct from "block data
  unavailable".
- Upgrading from 0.2.2-beta keeps chain data, settings and the node wallet
  (same address); the legacy UI and backup-export services are removed. If
  the 0.2.x built-in wallet was the mining payout, mining to it pauses until
  an encrypted backup is downloaded, verified and confirmed, then resumes.
- The wallet password is an app password (backup download, restore/replace,
  Forget), not a spending password.
