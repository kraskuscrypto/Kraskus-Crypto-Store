> **BEFORE UPDATING: move any funds held in the old native wallet to another wallet you control, confirm receipt, and securely back up the wallet and recovery information. This release removes native-wallet controls. Never purge legacy app data to upgrade.**

# CheetahCoin by Kraskus 0.6.2

External-payout mining with the owner-selected BCH interaction standard, CHTA artwork and real telemetry.

Ports1926 (normal vardiff) and1927 (low-hash, fixed0.002) and the1% developer allocation are preserved. Start mining is explicit and requires a valid external address and a ready node. Fresh installations have no payout destination and stay paused. Kraskus Pool is under development. Prune configuration remains unchanged and is read-only in this app.

Native-wallet controls and routes have been removed. **Existing native-wallet installations require the protected migration**, which backs up wallet/config data before replacing only API/UI services. Wallet files and funds are retained on the node; no automatic transfer occurs. The owner’s chosen reward address is an installation-specific choice, never a fresh-install default.

Source: https://github.com/kraskuscrypto/Kraskus-Mining-Platform/tree/0bf9f796de6df870291806698c26d0d2b92c3148/apps/chta-solo

The node and CKPool images are unchanged; their earlier qualification is retained. No new hardware or full-block test is claimed for this conversion. The new API/UI images passed143 checks and security scans. Fresh installation on an independent host remains untested for this release.
