"""Check uploaded Conquest & Commerce content stays intact in the merged packs."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
inventory = json.loads((ROOT / 'docs/conquest_commerce/upstream_inventory.json').read_text())
for name, expected in inventory['exact_files'].items():
    assert hashlib.sha256((ROOT / name).read_bytes()).hexdigest() == expected, name
allowed_extras = {
    'textures/item_texture.json': {'jagsbys_cauldron', 'jagsby_hen_house'},
    'textures/terrain_texture.json': {'apiary_cap', 'jagsby_hen_house'},
    'sounds/sound_definitions.json': {'apiary.honey_collect'},
}
for name, spec in inventory['shared_json'].items():
    actual = json.loads((ROOT / name).read_text())[spec['key']]
    expected = spec['entries']
    assert {key: actual[key] for key in expected} == expected, name
    suffix = name.split('/', 1)[1]
    assert set(actual) - set(expected) == allowed_extras[suffix], name
for name, expected in inventory['language'].items():
    actual = dict(line.split('=', 1) for line in (ROOT / name).read_text().splitlines() if '=' in line)
    assert {key: actual[key] for key in expected} == expected, name
sound = json.loads((ROOT / 'Jagsbys_Cauldron_RP/sounds/sound_definitions.json').read_text())
assert sound['format_version'] == '1.20.20'
print(f"PASS: {len(inventory['exact_files'])} upstream files match exactly; merged textures, sounds and translations preserve upstream content.")
