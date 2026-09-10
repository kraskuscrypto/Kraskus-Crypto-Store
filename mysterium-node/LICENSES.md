# Licenses, provenance, and referral disclosure

## Mysterium Node

- Upstream project: Mysterium Network Node
- Source: https://github.com/mysteriumnetwork/node
- Official container: `mysteriumnetwork/myst`
- Target tag: `1.39.5-alpine`
- License: GPL-3.0
- License evidence: https://github.com/mysteriumnetwork/node/blob/master/LICENSE
- Docker installation docs: https://github.com/mysteriumnetwork/node/blob/master/INSTALL.md

The app recipe does not redistribute the Mysterium source or image. The user's
Docker daemon pulls the official upstream image.

## Portal runtime

The small static onboarding page is served by the official nginx Alpine image.
The image is pinned to an immutable RepoDigest before publication.

## Branding

The package includes a Kraskus-authored vector rendition of the Mysterium/MystNodes
mark, created from the official public brand reference for product identification.
The Mysterium and MystNodes names and marks remain the property of their respective
owner; inclusion does not imply sponsorship or endorsement of this integration.

Brand assets:
https://www.mysterium.network/brand-assets

Packaged listing icon: `assets/icon.png`

Packaged interface mark: `portal/mystnodes-mark.svg` and its runtime copy under
`data/portal/`.

## Referral disclosure

New users who click **Create MystNodes Account** are sent to:

https://my.mystnodes.com/registration?referral_code=CJSoelVnKkllilXIgv7JqeroUv1jhnZ4KWE4G6E4

This is a Kraskus referral URL. Existing users can skip that path. MystNodes
controls referral attribution, eligibility, rewards, account creation, and node
claiming.

The user's MystNodes API key is separate from the referral code and is never
embedded in this repository.

## Kraskus packaging identity

The 5tratumOS integration is distributed as **MystNodes by Kraskus**.

- Packager / app experience: Kraskus
- Underlying node runtime: Mysterium Network
- Upstream source: https://github.com/mysteriumnetwork/node
- MystNodes service: https://mystnodes.com/

The app name does not imply that Kraskus owns or authors the upstream Mysterium
node software. The underlying runtime remains the official Mysterium Network
container.

## Referral onboarding

New-user onboarding uses the disclosed Kraskus referral URL:

https://my.mystnodes.com/registration?referral_code=CJSoelVnKkllilXIgv7JqeroUv1jhnZ4KWE4G6E4

Existing users may bypass referral signup and use their own MystNodes account.
