# MystNodes 2.7.0

Dashboard and read-only collector improvements. The existing Mysterium 1.39.7 node, identity storage, payment handling, settlement/withdrawal controls and protected runtime updater remain intact. This app is a bandwidth provider, not a coin-mining wallet conversion.

Readiness distinguishes current local health, registration, running traffic services and external monitoring. Local snapshots expire after 3 minutes; provider reports after 30 minutes with spaced collection about every 15 minutes. A successful check does not guarantee customer demand or income.

Charts use the provider’s real dated 7/30-day series. Keyboard, touch and pointer details show reported values; missing dates are gaps. Values outside the requested period are excluded. Revenue per decimal GB uses only matching reported UTC days and is not a payout quote. Identity balance, unsettled earnings and total earned remain distinct; settled/withdrawn totals are not inferred. Stale prices show no fiat estimate.

On VM100, fresh provider traffic history currently includes an October28 point outside the latest 7-day window; some 7-day earnings/30-day traffic snapshots remain old after upstream requests fail. Their empty/unavailable states are intentional. No accounting or payment data is modified to fill a graph.

UI supports independent light/dark mode and Mysterium/Kraskus/Divinity themes, reduced motion, labelled phone navigation, HTTP clipboard fallback and manual copy fallback. All runtime/service switches remain read-only indicators; changes use the official Node UI.

Validation:36 desktop page/mode/theme checks and24 phone page/mode checks at320/375px; zero horizontal page overflow. Readiness, stale data, missing/zero amounts, dated series, revenue-per-GB and clipboard paths tested. Four monitor tests and four deployment tests passed. Embedded migration payloads match the packaged files. Node-preserving owner deployment verified unchanged node ID, image, mounts and October28 start time.

The owner’s Discord monitor runs separately on VM161 with the pre-existing private infrastructure webhook. It checks snapshots each minute, alerts after3 failed checks, limits repeat alerts to30 minutes and sends recovery notices. It never restarts services or changes payments. Credentials are not shipped in this package; other installations need their own alert setup.

Normal platform app-update workflows may restart services. The owner-specific dashboard-only deployment kit updates the protected recipe and recreates only the migration helper, then restarts the read-only collector; the Mysterium node is not recreated. Keep the private rollback backup printed by that kit. Never delete identity/payment data to update the UI.
