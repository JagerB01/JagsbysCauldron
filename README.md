# Jagsby's Cauldron

Minecraft Bedrock add-on combining Croft (Apiary Cap and Hen House),
Mob Far Scaling, and Conquest & Commerce.

[Download v0.0.15 (.mcaddon)](https://github.com/JagerB01/JagsbysCauldron/raw/refs/heads/main/downloads/Jagsbys_Cauldron_v0.0.15.mcaddon)

The `downloads` directory contains the installable add-on and SHA-256 checksum.
Source for both packs is included, so the add-on can be rebuilt independently.

## Installation and module settings

Import the `.mcaddon` in Minecraft Bedrock and enable both included packs in a
copied world first. The manifests require engine version 1.26.40 or newer and
Script API server 2.9.0 / server-ui 2.1.0.

Use the Jagsby's Cauldron item for settings. Only operators can change toggles;
changes apply on world restart. Existing Apiary settings migrate to Croft.
Hen House currently provides placement and breaking behaviour, not egg farming.

The Conquest & Commerce switch controls scripted haggling only. Its data-driven
trades, entities (including vanilla replacements), recipes, world generation,
and resource/UI changes remain loaded when the script switch is disabled.
See [integration notes](docs/conquest_commerce/README.md).

Mob Far Scaling retains Cauldron's 400-block default per scaling level.
Pack identifiers retain the original Cauldron UUIDs; do not activate
standalone copies of the integrated add-ons alongside Cauldron.

## Vibrant Visuals

The resource pack declares the `pbr` capability and retains Conquest & Commerce's
existing villager/zombie-villager MERS texture sets. Other textures use the game's
default material behavior. On supported hardware, enable **Settings → Video →
Graphics Mode → Vibrant Visuals**. Standard graphics modes remain usable.
This enables compatibility; it does not add a custom lighting preset or a full
PBR material overhaul. In-game rendering still needs verification.

Both pack icons and the Cauldron item use the supplied `Jagsbys_Cauldron.png`
artwork, resized to 256 × 256 with transparency, replacing the old images.

## Build and validation

With Python 3 and Node.js installed, run from this checkout:

```sh
python3 tools/package.py
```

This validates JSON/JSONC, JavaScript syntax, relative imports, pack linkage,
upstream Conquest & Commerce content parity, and mocked settings/haggling tests,
then builds a reproducible archive and checksum.
These checks passed for this rebuild. Minecraft runtime behaviour, world-data
migration, trade UI and world generation still require in-game validation.

Diplomacy has been removed, including the Realm Sigil and its recipe. Existing
worlds ignore the old Diplomacy module setting; the remaining settings keep their
values. Previously saved realm data is left unused. Back up existing worlds before
updating, since Realm Sigil items no longer have a pack definition.

## Credits and provenance

Rebuilt from the user-provided Jagsby's Cauldron v0.0.12 DIAGNOSTIC and Conquest
& Commerce v1.1.0 uploads to restore the previously prepared v0.0.14 integration.
Conquest & Commerce is now synced to the supplied v1.1.1 SoundFix / Performance
update (behavior pack 1.1.3, resource pack 1.1.2).
This is a fresh rebuild, not a byte-for-byte recovery of the lost artifact.
Conquest & Commerce: Kaleo5. Mob Far Scaling: IsraOrbit. Original content and
identifiers are preserved except for documented module wiring and shared registries.
