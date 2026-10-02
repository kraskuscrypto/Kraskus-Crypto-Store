# DigiByte Solo by Kraskus

A DigiByte Core full node, a customer-owned backed-up wallet, and true solo mining on three DigiByte algorithms. Each algorithm has its own Stratum endpoint:

| Algorithm | Stratum |
|---|---|
| SHA-256 | `stratum+tcp://<host>:1928` |
| Scrypt | `stratum+tcp://<host>:1929` |
| Skein | `stratum+tcp://<host>:1930` |

Point each miner at the port for its algorithm. The username is the worker name; `<anything>.<worker>` is shown as `<worker>`. Addresses are never displayed. Mining starts only after the wallet backup is confirmed. Block rewards pay the wallet directly, less a fixed 1% developer fee taken as a coinbase split on found blocks only (0.50%, 0.25% and 0.25% of the block reward to three developer addresses; you receive the remaining 99%).

## Safe stop before down, uninstall, reinstall or a node-version change

The 5tratumOS CLI gives DigiByte Core its 10-minute stop grace on `app update`, `app down` and `app uninstall`. To confirm a clean exit before any of these, stop DigiByte Core first:

```bash
sudo ./dgb-safe-stop.sh                  # stop the node and confirm a clean exit
sudo ./dgb-safe-stop.sh --then update    # ...then update
sudo ./dgb-safe-stop.sh --then reinstall # ...then uninstall (keep data) + install
```

Never use `docker kill`, `docker rm -f` or `--purge`, and never delete `node/` or `runtime/` unless you intend to discard the chain and wallet.

## Data

Everything lives under the app data directory:

- `node/`: chain and wallets
- `runtime/`: app state
- `stratum/<algorithm>/`: lane state
- `secrets/<component>/`: RPC credentials

A preserving reinstall keeps all of it. The DigiByte RPC port (14022) is never published.
