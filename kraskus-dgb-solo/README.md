> **BEFORE UPDATING: move any funds held in the old native wallet to another wallet you control, confirm receipt, and securely back up the wallet and recovery information. This release removes native-wallet controls. Never purge legacy app data to upgrade.**

# DigiByte by Kraskus0.3.1

Shared six-page mining interface with Home, Mining, Blocks, Blockchain, Kraskus Pool and Settings. A fixed blue DigiByte coin, matching header emblem, true light/dark modes, Kraskus/Divinity/coin themes, orbiting dots and responsive navigation follow the common app standard.

## Mining and rewards

SHA-256, Scrypt and Skein retain their existing independent endpoints onTCP1928/1929/1930. Use the algorithm selector to view one lane's graph, workers, hashrate and best reported shares. Scrypt uses its established pool difficulty units. Cross-algorithm hashrates and difficulties are never summed or compared as one number. Start/Pause applies to all three lanes.

Set and confirm an external DigiByte address, then explicitly start mining once the node and fee validation are ready. Fresh installations start blank and paused; older installations also stay paused until explicitly activated through the converted interface. Existing selected external addresses are retained. The existing policy rejects a reward destination equal to a pinned developer-fee script; no developer destination is silently substituted.

The original1% fee is preserved as0.50%,0.25%,0.25% coinbase outputs, with each share rounded down and all remainders going to the miner. There is no payout scheduler, custodial balance or wallet send screen. The existing ledger uses100 confirmations for maturity.

## Legacy wallets and storage

No native-wallet, seed/phrase, key-export, restore or send routes are served. No wallet background worker runs, and the adapter's RPC permissions exclude wallet methods. Existing native wallet files, funds and metadata are left on disk; the protected update backs them up without exposing them or moving funds. Keep any existing external recovery backups.

The DigiByte Core9.26.7 and Stratum images, persistent paths, ports and credentials are preserved. Node startup/sync is independent of reward setup. The current prune target remains visible in Settings; pruning changes remain under node configuration, with DigiDollar block locks potentially retaining more than the target. Manual lane difficulty mutation, durable worker history, global round best and full block lookup are not exposed by this release. Unsupported figures remain unavailable rather than invented.

Kraskus Pool is Under development; its page does not activate pool forwarding. Qubit and Odo remain reserved and disabled.

## Release validation

15 backend/HTTP/initialization tests;18 responsive page checks;12 theme/mode combinations; independent3-lane switching, worker privacy, best-share rendering, Copy and block-allocation display. A full isolated real-node regtest check uses the actual catalog bind mounts and verifies initialization, all three lane APIs, blocked native routes/RPCs, paused mining, credential persistence and legacy metadata preservation. Exact web-image serving matches the tested files. Node, lane and fee implementation changes are not introduced; no new physical-miner qualification is claimed.

The node runs with its native wallet disabled; legacy wallet files remain preserved.
