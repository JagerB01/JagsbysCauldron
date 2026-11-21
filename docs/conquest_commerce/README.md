# Conquest & Commerce integration

Source: user-supplied `Conquest_Commerce_v1.1.1_SoundFix_Performance_v1.1.3.mcaddon`
by Kaleo5. The upload identifies its behavior pack as 1.1.3 and resource pack as
1.1.2, while its display names say v1.1.1. `upstream_inventory.json` records the
upload SHA-256, exact content hashes, and shared registry/translation entries.

Conquest & Commerce gameplay definitions, textures, models, UI, audio assets,
recipes, loot, trades and world generation match this upload apart from the
additive Frontier survey hooks on `minecraft:villager_v2`. This includes
animal sound-variant properties and cartographer exploration-map functions.
The sound fix removes the old bulk vanilla sound overrides: only upstream's
`sparkler.use` and Croft's `apiary.honey_collect` remain in sound definitions.
Shared texture and translation registries retain Cauldron/Croft entries alongside
unchanged Conquest & Commerce entries. Cauldron pack manifests, icons, UUIDs and
current Script API dependencies remain in use. Spreadsheet lock files are excluded.

`original_scripts` retains the upload's scripts byte-for-byte for comparison.
Only `mta/haggle.js` is imported by upstream's entry point; `fletch.js` remains
inactive here too. The obsolete reference `haggletest.js` has been removed.
The active haggling implementation retains upstream's 20-tick interval,
4-block player search, 1.5-block pickup radius, employed-adult filtering,
conversion events, effects and pending transformation matching. It also skips
dropped-item queries when no eligible villager is nearby, as in the update.

The runtime adapter differs only for Cauldron integration and current API use:
- Explicit initialization from the world-load coordinator.
- Module-switch guards on the interval and spawn callback.
- `dimension.getPlayers()` for dimension-scoped players.
- Presence-based baby-component checks and `isValid` property guards.

The administrator-only conquest_commerce switch controls scripted haggling.
Settings apply on world restart; old worlds default this module to enabled.
Data-driven entities (including vanilla overrides), trades, recipes, loot,
world generation and resource/UI changes remain loaded while disabled.
A script toggle cannot unload those definitions.

Cauldron's villager exposes the `jagsby_frontier:request` and
`jagsby_frontier:reset` events and reports `ready` and `raw_rank` properties in
the same namespace. The behavior animation controller responds on demand using
Bedrock's trade-tier queries. It returns tiers 0–4 for ranked villagers and
leaves the result unset when no trade tier is available. There is no Frontier
UUID or version dependency. Frontier builds using this survey protocol can read
the result with Cauldron above Frontier in the behavior pack order.

`python3 tools/package.py` runs source-content parity checks, JSON/JSONC and
JavaScript validation, mocked settings/haggling/performance tests, and builds
the archive. These checks do not establish Minecraft runtime compatibility.
In a copied world, test content logs, animal audio, music, adult employed-villager
haggling, cartographer maps, trades, fishing, wild crops in new chunks, resource
and trade UI, and existing modules. Disable haggling as an operator, restart,
and verify dropped emeralds no longer trigger scripted conversion.
