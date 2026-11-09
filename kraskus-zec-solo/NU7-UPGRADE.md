# NU7 sync recovery candidate — 2026-11-09

Status: DRAFT / NOT QUALIFIED FOR CUSTOMER INSTALLATION.

## Finding

Kraskus Zcash 0.6.2 in Crypto Main and generated Umbrel Main uses
ghcr.io/kraskuscrypto/kraskus-zebra@sha256:abbbddd84563023df621f1eecceeb816da5c2951d9b60718133f131e1341c6d0.
The registry image configuration labels it Zebra 6.2.3 (upstream revision
7121c82ba6795a151523d5b308a19743f4a1ade7). Its supervisor runs zebrad,
not zcashd. The same node digest also appears in both Dev catalogs.

The reported stopping height 3,543,404 is immediately before NU7 at 3,543,405.
Upstream Zebra 7.0.0 is the first stable Mainnet NU7 release.
This establishes a packaged compatibility defect and a strong explanation for
the report; customer logs and installed image inspection are still needed to
confirm that customer's exact failure.

Sources:
- https://github.com/ZcashFoundation/zebra/releases/tag/v7.0.0
- https://github.com/ZcashFoundation/zebra/releases/tag/v7.0.0-rc.0
- https://zfnd.org/zebra-7-0-0-release/

## Candidate scope

Uses the official zfnd/zebra:7.0.0 multi-platform index pinned to
sha256:a70d2be8ffef3a4b6e37355724e36a0e6c1838e46baa28bfb216739f00cf2d34.
Registry labels identify upstream revision e8db87eb69254e0d4eedd058eadd48bdfa09065a.
Index contains linux/amd64 and linux/arm64; app-level ARM qualification is not claimed.

Retains every existing bind mount, app image, RPC cookie location, legacy wallet
directory, external payout record and storage gate. Waits for the existing
storage gate and requires Mainnet. Extends shutdown grace to ten minutes.
Does not run Zallet or zcashd, prune, reset, delete, rename or resync chain data.

This is intentionally sync-only. The existing native coinbase helper uses
zebra-chain 11.3.0 and its recorded NU7 vectors fail on the new branch ID.
The candidate supplies no mining address to Zebra and removes the public
Stratum port. Stored mining intent and payout addresses are not rewritten.
The unchanged UI can still show saved mining intent; it is not evidence that
NU7 mining works. Full mining support needs a separate helper/backend update,
consensus-vector tests and physical-miner qualification. No fee changes.

## Backup and migration

Zebra 7 upgrades state/v28 to state/v29 automatically. The move is not prevented
by delete_old_database=false. Zebra 6 cannot read v29.

Before a qualified update is installed:
1. Stop the Zcash app cleanly through Umbrel and wait for its containers to stop.
   Do not stop unrelated apps. Do not uninstall.
2. Locate this installation's actual APP_DATA_DIR. Copy its entire zebra/state/v28
   directory to a separate backup location with sufficient space while Zebra is
   stopped. Preserve ownership, permissions and file contents; verify the copy.
   Retain config, kraskus, legacy wallet files and existing recovery backups too.
   Never send wallet files, seeds, private keys, RPC cookies or app tokens to support.
3. Only after verifying that backup, create the plain-text file
   APP_DATA_DIR/config/nu7-v28-backup-confirmed with exactly this line:
   v28 backup verified
   This acknowledgement is required when v28 exists. It does not create a backup.
   Fresh installations with no v28 do not need it.
4. Apply the qualified update through the normal store path, then start the app.
   Keep mining paused. Leave the old database backup untouched.
5. Confirm logs report Zebra 7.0.0, Mainnet and successful state migration, and
   that height advances beyond 3,543,405 toward the current chain tip.
   A 99.9% label alone is not validation.
6. If migration or syncing fails, stop the app and collect redacted logs, node
   version, heights, peers and available disk space. Do not delete any database.

Rollback requires a stopped node and the separate verified v28 backup, with the
old and migrated databases retained separately. Do not launch Zebra 6 against
v29 or rename/symlink v29 to v28. An old node cannot follow NU7, so rollback is
for investigation/data recovery, not a way to resume current-chain operation.

## Validation and release gates

Completed locally: six tests exercise fresh startup, backup refusal, acknowledged
upgrade startup, wrong-network refusal, storage-gate waiting and unchanged
persistence/security. Shell syntax passes. Public old-image metadata and official
new-image manifest/config were inspected; registry response digests were checked.
The local tests use a stub entrypoint, not a real Zebra process.

Not completed: actual Docker Compose interpolation/config validation, image
signature/provenance verification, vulnerability qualification, exact-image
startup/RPC/cookie test, real empty bind-directory install, stopped v28 fixture
migration/restart/data-preservation test, and Mainnet advancement past activation.
No Docker runtime exists locally; QA SSH to vm161 timed out. No customer host was
accessed or changed. Do not merge or advertise this candidate until these checks
pass. Generate Umbrel output from the final source commit after qualification.
Zebra 7.0.0 has a short upstream support window; recheck supported stable versions
before publishing.

## Customer guidance now

We found an outdated bundled Zcash node that cannot follow the NU7 upgrade.
A sync-recovery update is in review and has not been released. Please do not
uninstall, reset or delete blockchain data. Keep mining paused and preserve your
wallet/recovery backups. We will provide the qualified update and the backup
steps before asking you to update. If requested, provide only redacted app logs
and node version/height information.
