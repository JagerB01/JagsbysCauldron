# Jagsby's Cauldron

Minecraft Bedrock add-on combining Croft (Apiary Cap and Hen House),
Mob Far Scaling, and Conquest & Commerce.

[Download v0.0.19 (.mcaddon)](https://github.com/JagerB01/JagsbysCauldron/blob/main/downloads/Jagsbys_Cauldron_v0.0.19.mcaddon)

The `downloads` directory contains the installable add-on and SHA-256 checksum.
Source for both packs is included, so the add-on can be rebuilt independently.

## Installation and module settings

Import the `.mcaddon` in Minecraft Bedrock and enable both included packs in a
copied world first. The manifests require engine version 1.26.40 or newer and
Script API server 2.9.0 / server-ui 2.1.0.

Use the Jagsby's Cauldron item for settings. Only operators can change toggles;
changes apply on world restart. Existing Apiary settings migrate to Croft.
New Hen Houses occupy one block and face whoever places them. With Croft enabled,
the nearest Hen House with room collects chicken eggs laid within 16 blocks of
its center. It holds up to 64 eggs in total, including regular, brown, and blue
eggs. Interact with the coop to move eggs into your inventory, or break it to drop
its contents. The coop does not change how often chickens lay eggs.

For other add-ons, Croft attempts to collect freshly spawned duck and turkey egg
items near a matching bird when the item and bird identifiers identify the species.
The external pack must spawn a loose egg item for this check to work.

The Conquest & Commerce switch controls scripted haggling only. Its data-driven
trades, entities (including vanilla replacements), recipes, world generation,
and resource/UI changes remain loaded when the script switch is disabled.
See [integration notes](docs/conquest_commerce/README.md).

With Jagsby's Frontier installed, keep Cauldron above Frontier in the behavior
pack load order. Cauldron's villager definition answers Frontier's survey requests
with the villager's current trade tier. The hook uses Frontier's survey events
and properties and works independently of the haggling toggle. Cauldron can
also run standalone and has no Frontier pack dependency.

Mob Far Scaling retains Cauldron's 400-block default per scaling level.
Pack identifiers retain the original Cauldron UUIDs; do not activate
standalone copies of the integrated add-ons alongside Cauldron.

## Mob Far Scaling eligibility

Passive-animal scaling is off by default, including in migrated existing worlds.
Hostiles and combat-capable neutral mobs/defenders remain eligible: iron and snow
golems, wolves (including tamed wolves), polar bears, bees, endermen, piglins,
zombified piglins, llamas, trader llamas, pandas, dolphins, pufferfish and axolotls.
Villagers, wandering traders, allays and copper golems are excluded by default.
Boss handling is unchanged. Existing scaling effects are not removed.
Buffs are applied once and marked with persistent entity tags. Each occupied
dimension is scanned once per second, and tagged mobs skip level calculations
and effect application.

Operators can explicitly opt passive animals back in with
`/mobfarscaling:animal enable`. `/mobfarscaling:creature disable` disables the
neutral/defender group; monster-family mobs also follow the monster switch.
Existing custom lists remain available as operator overrides. The one-time
migration preserves other settings and subsequent explicit animal opt-ins.

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
