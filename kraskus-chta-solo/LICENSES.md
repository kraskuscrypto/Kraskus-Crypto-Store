# CHTA Kraskus (Kraskus CHTA Solo) — Components and Distribution Notices

CHTA Kraskus is a Kraskus Crypto application packaged for 5tratumOS. Every
custom image in this package is built by `apps/chta-solo/build.sh` from a
committed revision of
https://github.com/kraskuscrypto/Kraskus-Crypto-Apps (`apps/chta-solo`) and
carries `org.opencontainers.image.version` / `.revision` labels naming that
release and commit. The exact published digests are recorded in
`apps/chta-solo/release-manifest.json`.

## Kraskus CHTA application

The backend (API, readiness monitor, wallet service, first-run
initialization), the web UI, the Stratum and node supervisors, the Store
recipe, listing text and CHTA artwork are maintained by Kraskus Crypto.

- `ghcr.io/kraskuscrypto/kraskus-chta-solo` — backend and `init`
  (Python 3.13 on Alpine; bundles `qrcode` (BSD) and `cryptography`
  (Apache-2.0 / BSD) from PyPI, hash-locked).
- `ghcr.io/kraskuscrypto/kraskus-chta-ui` — web UI (Next.js static export
  served by nginx).

## CheetahCoin Core

CheetahCoin Core is upstream software distributed under the MIT license.

- Upstream project: https://github.com/ShorelineCrypto/cheetahcoin
- Release used: v2.5.0, `cheetahcoin_2.5.0_x86_64_linux-gnu.tgz`,
  SHA-256 `1379ef7c9d8395691680c1699f63e016178be97c3ba870cd8ff2674606646928`
  (verified at build time; only `cheetahcoind` and `cheetahcoin-cli` are
  installed, unmodified).
- Image: `ghcr.io/kraskuscrypto/kraskus-cheetahcoin-core`.

The upstream copyright and MIT license terms remain applicable.

## CKPool

CKPool is free software distributed under the GNU General Public License,
version 3. This package runs a build of the NMminer fractional-difficulty
CKPool fork:

- Source: https://github.com/NMminer1024/btc-ckpool-solo at commit
  `49b45c25940f2138955c4503e1da55f19cea8de9`
- Kraskus modifications (configurable developer-fee address, fee-address
  validation made fatal, fractional-difficulty accounting fixes, portable
  SHA-256 build) are applied as scripted, verified edits in
  `apps/chta-solo/packaging/ckpool/Dockerfile` (published, with the
  complete modified source, at
  https://github.com/kraskuscrypto/Kraskus-Crypto-Release-Sources/tree/chta-ckpool-0.3.1/chta/ckpool/0.3.1 ),
  which together with the upstream commit is the complete corresponding
  source.
- Image: `ghcr.io/kraskuscrypto/kraskus-chta-ckpool` (the GPLv3 text is
  shipped at `/usr/share/licenses/ckpool/COPYING`).

CKPool's GPLv3 terms remain applicable.

## Third-party notices, source and Kraskus licence

- The complete licence texts and attribution notices of the third-party
  software in this app's images are in [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md).
- Release records and published corresponding source: https://github.com/kraskuscrypto/Kraskus-Crypto-Release-Sources
- Kraskus Crypto components are proprietary software of 4KM Ventures LLC,
  licensed under https://github.com/kraskuscrypto/Kraskus-Crypto-Release-Sources/blob/kraskus-licence-2026-10-14/LICENSE-KRASKUS.md
