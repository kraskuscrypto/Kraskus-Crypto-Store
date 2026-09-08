# MystNodes by Kraskus runtime architecture

## Persistent state
- `${APP_DATA_DIR}/data/mysterium/` — Mysterium identity and runtime state.
- `${APP_DATA_DIR}/data/nodeui-proxy/` — persistent Node UI proxy defaults when used.

Portal HTML/CSS/JS/images, nginx configuration, the status agent, and release
metadata are versioned application files and are replaced during updates.

## Services
- `mysterium` — pinned official upstream Mysterium node.
- `nodeui-proxy` — pinned nginx helper for the local upstream Node UI.
- `portal` — responsive Kraskus control center served through the 5tratumOS app proxy.
- `status-agent` — pinned Alpine helper that collects host metrics and read-only
  snapshots from Mysterium's localhost-only TequilAPI.
- `update-agent` — protected manual updater with backup, validation, and rollback.

The status agent does not use the Docker socket. It reads host `/proc`,
`/sys/class/net`, and `/` read-only for CPU, memory, disk, uptime, network
bandwidth, and identity-presence information.

The official TequilAPI remains bound to `localhost:4050`; it is not published to
the LAN or proxied into the browser. Every 30 seconds, the status agent writes
atomic JSON snapshots to `${APP_DATA_DIR}/data/status/api/`. Nginx exposes those
files under `/live-api/` with GET/HEAD-only access. Node-changing operations stay
in the official Mysterium Node UI under `/node/`.

## Data safety
Updates must preserve `${APP_DATA_DIR}/data/mysterium`.
