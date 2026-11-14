# Conquest & Commerce integration

Source: supplied Conquest & Commerce v1.1.0 by Kaleo5.
Integrated in Cauldron v0.0.14, preserving concom identifiers and asset paths.
Shared language, texture and sound registries are merged. Pack manifests/icons
remain Cauldron's; spreadsheet lock files are excluded.
Original scripts are retained here outside the runtime import graph.

The administrator-only conquest_commerce switch controls scripted haggling.
Settings apply on world restart; old worlds default this new module to enabled.
Data-driven entities (including vanilla overrides), trades, recipes, loot,
world generation and resource/UI changes remain loaded while disabled.
A script toggle cannot unload those definitions.

Only the main haggle implementation is initialized. The source also imports
haggletest.js, a competing emerald-consumption loop without transformation;
this is retained as reference but not registered. fletch.js was not imported
originally and remains inactive.
Compatibility changes: dimension.getPlayers(), presence-based baby checks,
and the server 2.x entity.isValid property before processing entities.
Uses shared server 2.9.0 / server-ui 2.1.0 dependencies.

In-game validation is still needed: content logs, adult employed-villager
haggling, trades, animal/fishing behaviour, wild crops in new chunks, resource
and trade UI, and existing modules. Disable haggling as an operator, restart,
and verify dropped emeralds no longer trigger scripted conversion.
Test in a copied world. Static/mocked checks do not prove engine compatibility.
