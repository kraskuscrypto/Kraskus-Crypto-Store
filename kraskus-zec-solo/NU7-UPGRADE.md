# Zcash 0.6.4 — NU7 node and mining update

This update replaces the sync-only 0.6.3 package. It uses Zebra 7.0.0 and the
matching zebra-chain 15.0.0 coinbase library. The helper rebuilds transactions
through the production librustzcash API, preserving version, consensus branch,
inputs, protocol allocations and authorizing-data commitment. It applies the
existing floor(1%) developer allocation only to the miner-controlled output.

External payout settings and saved Start/Stop intent are retained. New installs
remain paused. A valid confirmed transparent P2PKH address, synchronized node,
storage preflight and explicit Start remain required. Node synchronization does
not depend on payout setup. Port 3335 is restored for Equihash miners.

The node supervisor waits for the existing storage gate, refuses unknown or
changed networks, runs zebrad as uid/gid 10001, forwards clean shutdowns, and
restarts Zebra when the controller's external payout projection changes. Missing
or malformed payout text does not block non-authoring synchronization. It never
reads legacy wallet records or starts Zallet. Cookie credentials are read from
the existing shared node mount. RPC is not published on the host.

## Installation and preservation

Use the normal Umbrel Main Update action for version 0.6.4. There is no manual
backup acknowledgement file to create. The 0.6.3 acknowledgement file, if one was
created, is left untouched and no longer used. Preserve existing recovery backups.

Zebra performs its supported v28-to-v29 database migration on first start. The
same chain mount and existing state are reused; this update does not reset,
prune, delete, manually rename or symlink the database. A stopped-node v28 backup
before upgrading is recommended by upstream, particularly if rollback is needed.
Zebra 6 cannot read v29; do not downgrade it onto migrated data. Retain any v28
backup separately. Keep legacy wallet files and recovery backups; no user-facing
native wallet is provided.

After updating, confirm that the node progresses beyond height 3,543,405. When
synchronization completes, use the existing confirmed external payout address
and Start mining. If it was intentionally stopped, the update does not start it.
Check worker connections, accepted/rejected shares and actual mining-ready status.
If startup or mining fails, provide redacted node/controller/gateway logs, app
version, node height, peers, disk availability and miner model. Do not send wallet
files, seeds, private keys, RPC cookies or app tokens. Do not uninstall or delete
chain data to troubleshoot.

## Evidence and limits

Local helper checks: 95 independent vectors, including real NU7 Testnet coinbases,
unknown branch rejection, canonical digests and fee/output preservation. The real
gateway/helper contract includes full job construction and tampered/missing/hung
helper rejection: 142 checks passed. Linux exact-image checks and image scan are
recorded by the qualification workflow and release payload; consult that run for
its final result rather than treating this document as a passed check.

The owner delegated full-chain synchronization to the tester. A populated v28
migration and physical Equihash hardware run are not claimed complete. Neither
the absence of a long sync run nor a package version proves that a miner has found
an accepted Mainnet block. These remaining checks must be reported honestly.

Upstream:
- https://github.com/ZcashFoundation/zebra/releases/tag/v7.0.0
- https://github.com/ZcashFoundation/zebra/releases/tag/v7.0.0-rc.0

Exact-image qualification passed in run 42667728639: 95 vectors, 142 gateway/job
checks, 63 app regressions, node startup/authentication/non-root/restart checks,
and a security scan with no reported high/critical vulnerabilities or secrets.
Exact-image publication passed in run 42668758474; no rebuild occurred.
