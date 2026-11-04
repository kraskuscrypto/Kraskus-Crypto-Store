# Conversion scope

External payout only; no user-facing native wallet. The algorithm selector separates SHA-256, Scrypt and Skein statistics and ports. Native wallet workers and RPC methods are removed while legacy files, credentials, data paths and the three-output1% fee remain intact.

Existing explicit external destinations are preserved. Legacy settings do not auto-arm mining after the conversion, and init closes inherited mining jobs before any lane can start. New installs have no address and are paused. Node synchronization continues independently of reward setup.

Differences from the single-algorithm baseline: lane-scoped hashrate and share units; current-session workers rather than durable worker history; best reported lane share rather than an invented global round; read-only existing pruning settings; existing block ledger with100-confirmation maturity. No new hardware run is claimed.
