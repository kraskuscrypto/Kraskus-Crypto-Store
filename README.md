# Kraskus Crypto Store

Official client-facing Kraskus Crypto Store releases for 5tratumOS.

## First-time setup

1. Add this custom store in 5tratumOS using `https://github.com/kraskuscrypto/Kraskus-Crypto-Store`.
2. Install **Kraskus Compatibility** first.
3. Open it once and wait for the completion screen.
4. Install or update Kraskus apps normally.

Kraskus Compatibility is a one-time safety utility for older 5tratumOS releases that reject dynamically named custom-store channels. It supports both the legacy `custom-kraskus-5tratstore` channel and the current `custom-kraskus-crypto-store` channel. Newer compatible systems are left unchanged.

## Terminal fallback

If the Compatibility app cannot be installed, use:

```bash
curl -fsSL https://raw.githubusercontent.com/kraskuscrypto/Kraskus-Crypto-Store/main/scripts/install-kraskus-compat.sh | sudo bash
```
