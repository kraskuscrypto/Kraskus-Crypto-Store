# Kraskus XMR Solo — Licenses and notices

Kraskus XMR Solo contains original Kraskus application code and packages
the official Monero command-line software.

## Monero

Project: Monero
Upstream: https://github.com/monero-project/monero

The Monero software is distributed under its upstream license. The package
downloads the official Monero release artifact and verifies its pinned
SHA-256 during the image build. Since 0.2.0 the Monero licence (BSD-3-Clause)
from that release archive is also inside the image, at
`/usr/share/licenses/monero/LICENSE`.

## XMRig Proxy

Project: XMRig Proxy
Upstream: https://github.com/xmrig/xmrig-proxy
License: GNU General Public License v3.0 (GPL-3.0)

The miner gateway image includes the official XMRig Proxy static binary,
verified by pinned SHA-256 during image build
(`xmrig-proxy-6.26.0-linux-static-x64.tar.gz`, SHA-256
`73cceb10be474ba8ce20faddb9d2c6af0cb50bce84e72f7d36a326f7147c01c4`), and is not
modified. Its complete corresponding source is XMRig Proxy v6.26.0, commit
`0dc23f69b546ae973ae0ae6fb65593f998256589`:
https://github.com/xmrig/xmrig-proxy/tree/0dc23f69b546ae973ae0ae6fb65593f998256589 .
The full GPLv3 text is in `THIRD-PARTY-NOTICES.md`, and since 0.2.0 also
inside the miner gateway image, with these source directions, at
`/usr/share/licenses/xmrig-proxy/` (`LICENSE`, `SOURCE.md`).

## Kraskus application components

The UI, adapter, miner gateway, wallet API, packaging, and Divinity artwork
are Kraskus Crypto project assets.

## Base images

Container base images retain their respective upstream licenses and notices.

## Third-party notices, source and Kraskus licence

- The complete licence texts and attribution notices of the third-party
  software in this app's images are in [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md).
- Release records and published corresponding source: https://github.com/kraskuscrypto/Kraskus-Crypto-Release-Sources
- Kraskus Crypto components are proprietary software of 4KM Ventures LLC,
  licensed under https://github.com/kraskuscrypto/Kraskus-Crypto-Release-Sources/blob/kraskus-licence-2026-10-14/LICENSE-KRASKUS.md
