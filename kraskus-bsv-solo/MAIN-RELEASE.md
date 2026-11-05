# BSV Main release

Promotes the qualified external-wallet Dev release without changing its images, network ports, fee, data mounts or mining policy.

Before updating a native-wallet installation, move holdings to an external wallet and verify recovery backups. Preserve legacy files. The VM100-specific migration helper is not a general Umbrel migration tool. No new full Umbrel installation/migration or physical-miner run is claimed.

Evidence: external-wallet backend qualification, startup bind-mount audit on 2026-11-03, status-reporting regression tests, and UI consistency source d2e118347f219f46bc27552db2a79839cc3d29c7. Exact published UI files and anonymous image IDs passed the consistency release checks.

Mining starts paused and requires a valid external payout destination and ready node. Publishing this catalog does not change installed apps.
