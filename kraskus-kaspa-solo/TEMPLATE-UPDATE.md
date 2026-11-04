# Kaspa 0.5.0 template update

Home, Mining, Blocks, Blockchain, Kraskus Pool and Settings now use the shared external-reward interface. Themes, true light/dark, navigation preferences, fixed Kaspa face and matching header face, orbiting dots, graph, Copy, and real per-worker best difficulty are included. The bridge does not provide an authoritative global round best or durable worker history; these are labelled unavailable. DAG sync has no invented denominator; synchronized nodes show 100%.

The approved 1% post-maturity settlement mechanism is unchanged, including its network costs and reserve policy. The internal settlement wallet remains an implementation requirement; users cannot create, inspect, export or send from a native wallet through this UI. Legacy wallet files and obligations are preserved. The node, Stratum bridge and wallet API images are unchanged. Host TCP1900 now passes through an adapter gate that is paused until an external beneficiary is selected and mining explicitly started.

Fresh installs have no external beneficiary and stay paused. Only the owner's separately approved VM100 migration may fill a missing destination with the developer destination. That migration leaves the app stopped.

Software checks: 15 adapter/gate/HTTP tests; 18 responsive page checks; six themes; Copy and fixed face; actual bind-source container creation and init; exact-image served-file checks and anonymous digest pulls. Hardware on this new pause gate has not been tested. Existing metadata rights and unrelated review gates are not newly approved by these checks.

## Live phone layout follow-up — 0.5.1

Long live node-sync labels and setup actions wrap at320px. Verified on all six pages against the running APIs at1280/375/320px; zero browser errors. Web image only; nodes and mining controls unchanged.
