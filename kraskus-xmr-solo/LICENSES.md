# Kraskus XMR Solo — Licenses and notices

Kraskus XMR Solo contains original Kraskus application code and packages
the official Monero command-line software.

## Monero

Project: Monero
Upstream: https://github.com/monero-project/monero

The Monero software is distributed under its upstream license. The package
downloads the official Monero release artifact and verifies its pinned
SHA-256 during the image build.

## XMRig Proxy

Project: XMRig Proxy
Upstream: https://github.com/xmrig/xmrig-proxy
License: GNU General Public License v3.0 (GPL-3.0)

The miner gateway image includes the official XMRig Proxy static binary,
verified by pinned SHA-256 during image build. The corresponding upstream
source and GPLv3 license are available at the project URL above.

## Kraskus application components

The UI, adapter, miner gateway, wallet API, packaging, and Divinity artwork
are Kraskus Crypto project assets.

## Base images

Container base images retain their respective upstream licenses and notices.
