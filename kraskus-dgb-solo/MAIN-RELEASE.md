# Main Store release — 0.3.1

Owner authorized promotion on 2026-11-04 after beta feedback. External reward addresses, coin-specific consensus and fee rules are retained. No native-wallet controls are exposed. Move legacy native-wallet funds to another wallet you control and confirm receipt before updating; back up wallet/recovery data and never purge app data to upgrade. No automatic transfer is performed.

Fresh actual-bind creation before initialization, initializer exit, recreation and synthetic legacy-file preservation pass for all five final recipes (10/10). These tests exercise shipped mount layouts; they are not a full clean-room OS install/uninstall cycle. Existing beta and original coin-specific qualification are retained; no new physical miner or universal firmware qualification is claimed.

The refreshed images preserve shipped application code, mining/daemon executables, entrypoints and default commands. Supported base-package security updates were applied; exact images were rescanned and anonymously pulled after publishing. Image IDs and digest references are in main-release-images.json. Build procedure commit c277cd533b1a2cea746641244846a778737c7c8a; preserved image application-source label af1c008177a5d4231cd3123ca21aa20a638fab02.

No fixable findings remain at scan time. Unfixed findings remain, including High severity. Raw scans also retain five Critical package matches across CHTA/DGB: Debian bookworm zlib does not build the affected MiniZip code; DGB SQLite has no arbitrary-SQL interface, the node wallet is explicitly disabled and tested, and the Stratum code has no SQLite import. The PRL node retains module-level OpenPGP advisory matches, but official govulncheck binary analysis of pearld and prlctl finds no affected linked package/symbol. This is an image/configuration-specific assessment, not a zero-vulnerability claim. See security-assessment.json.

Sources: [Debian zlib assessment](https://security-tracker.debian.org/tracker/CVE-2023-45853), [Debian SQLite advisory](https://security-tracker.debian.org/tracker/CVE-2025-7458), [Go OpenPGP advisory](https://vuln.go.dev/ID/GO-2026-5932.json).

No live VM100 runtime deployment is part of catalog promotion. To roll back a catalog release, revert the focused promotion commit; preserve existing app state, chains, pruning limits and external destinations.

DGB: three lane views (SHA256/Scrypt/Skein), paused gate, RPC restrictions, native-wallet route404s, credential persistence and preserved legacy metadata pass on a real isolated regtest node. Node wallet disabled with -disablewallet=1; wallet files remain untouched.
