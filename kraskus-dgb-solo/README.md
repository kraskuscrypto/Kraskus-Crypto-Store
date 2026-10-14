# DigiByte Solo by Kraskus

A DigiByte Core full node, a customer-owned wallet, and true solo mining on three DigiByte algorithms. Each algorithm has its own Stratum endpoint, and the app shows each one on its own (Mining has a lane selector; nothing is added up across algorithms):

| Algorithm | Stratum |
|---|---|
| SHA-256 | `stratum+tcp://<host>:1928` |
| Scrypt | `stratum+tcp://<host>:1929` |
| Skein | `stratum+tcp://<host>:1930` |

Point each miner at the port for its algorithm. The username is the worker name; `<anything>.<worker>` is shown as `<worker>`. Addresses are never displayed. Qubit (1931) and Odocrypt (1932) are validated by the node but not mined in this release.

Block rewards pay the payout destination you choose on the Wallet page: this app's own wallet (once it is backed up and its password is set) or an external DigiByte address. You can switch between them, or turn payouts off, at any time; once the wallet has its password, every change needs it. Mining stops while payouts are off. Rewards are paid less a fixed 1% developer fee taken as a coinbase split on found blocks only (0.50%, 0.25% and 0.25% of the block reward to three developer addresses; you receive the remaining 99%). The wallet itself never pays a fee to the developer.

## Wallet (0.2.0)

- **New wallets** get a 24-word recovery phrase. It is shown once; you confirm three of its words, then set the wallet password. The phrase is never shown again. It restores the wallet in this app or any wallet that supports BIP39 + BIP84 for DigiByte (`m/84'/20'/0'`).
- **Wallets created by 0.1.x** keep their encrypted backup file and password. Nothing about them changes on update: same keys, same address, and the backup file you saved still restores them. Settings → Wallet shows the backup type.
- **Send** shows the exact amount, network fee and total before anything is signed. The wallet password confirms it. If the app cannot tell whether a send reached the network, it says so and blocks a second send until the network answers: never resend in that case, check the wallet activity first.
- **Forget** unloads the wallet and keeps its files on the node volume.

## Safe stop before down, uninstall, reinstall or a node-version change

The 5tratumOS CLI gives DigiByte Core its 10-minute stop grace on `app update`, `app down` and `app uninstall`. To confirm a clean exit before any of these, stop DigiByte Core first:

```bash
sudo ./dgb-safe-stop.sh                  # stop the node and confirm a clean exit
sudo ./dgb-safe-stop.sh --then reinstall # ...then uninstall (keep data) + install
```

`--then reinstall` is the supported update path for installs from a Kraskus store. It installs from the
Kraskus Dev Store channel by default; Kraskus Store (Main) installs set the channel:

```bash
sudo DGB_CHANNEL=custom-kraskus-crypto-store ./dgb-safe-stop.sh --then reinstall
```

`--then update` runs `5tratumos app update`, which on 5tratumOS releases before v0.8.31 refuses apps
installed from a named custom store ("invalid channel") and leaves the app untouched.

Never use `docker kill`, `docker rm -f` or `--purge`, and never delete `node/` or `runtime/` unless you intend to discard the chain and wallet.

## Data

Everything lives under the app data directory:

- `node/`: chain and wallets
- `runtime/`: app state
- `stratum/<algorithm>/`: lane state
- `secrets/<component>/`: RPC credentials

A preserving reinstall keeps all of it. The DigiByte RPC port (14022) is never published.
