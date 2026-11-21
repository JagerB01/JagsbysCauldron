"""Check uploaded Conquest & Commerce content stays intact in the merged packs."""
from pathlib import Path
import hashlib
import json

ROOT = Path(__file__).resolve().parents[1]
inventory = json.loads((ROOT / 'docs/conquest_commerce/upstream_inventory.json').read_text())
for name, expected in inventory['exact_files'].items():
    content = (ROOT / name).read_bytes()
    if name == 'Jagsbys_Cauldron_BP/entities/chicken.json':
        # Croft reroutes the three vanilla egg timers through its laying marker.
        for egg in ('egg', 'brown_egg', 'blue_egg'):
            marker = (f'"spawn_entity": "jagsby:laid_egg",\n'
                      f'              "spawn_event": "jagsby:lay_{egg}",').encode()
            assert content.count(marker) == 1, egg
            content = content.replace(marker, f'"spawn_item": "{egg}",'.encode())
    if name == 'Jagsbys_Cauldron_BP/entities/villager_v2.json':
        # Check the upstream bytes separately from Cauldron's added survey hooks.
        description_end = b'\n    },\n    "component_groups":'
        events_end = b'\n    }\n  }\n}\n'
        before, description = content.split(b',\n      "properties":', 1)
        description, remaining = description.split(description_end, 1)
        upstream, events = remaining.split(b',\n      "jagsby_frontier:request":', 1)
        content = before + description_end + upstream + events_end

        hook = json.loads(b'{"properties":' + description + b'}')
        events = json.loads(b'{"jagsby_frontier:request":' + events.removesuffix(events_end) + b'}')
        prefix = 'jagsby_frontier:'
        requested, ready, raw_rank = (prefix + field for field in ('requested', 'ready', 'raw_rank'))
        assert hook['properties'] == {
            requested: {'type': 'bool', 'default': False},
            ready: {'type': 'bool', 'default': False},
            raw_rank: {'type': 'int', 'range': [-1, 4], 'default': -1},
        }
        assert events[prefix + 'request']['set_property'] == {
            requested: True, ready: False, raw_rank: -1,
        }
        assert events[prefix + 'reset']['set_property'] == {requested: False}

        controller_path = ROOT / 'Jagsbys_Cauldron_BP/animation_controllers/frontier_trade_rank.json'
        controllers = json.loads(controller_path.read_text())['animation_controllers']
        animation, = hook['scripts']['animate']
        controller = controllers[hook['animations'][animation]]
        requested_query = f"query.property('{requested}')"
        assert controller['initial_state'] == 'default'
        states = controller['states']
        assert states['default']['transitions'] == [{'requested': requested_query}]
        cancel = {'default': f'!{requested_query}'}
        for tier in range(5):
            state = f'raw_{tier}'
            event = prefix + f'result_{tier}'
            assert events[event]['set_property'] == {requested: False, ready: True, raw_rank: tier}
            assert states['requested']['transitions'][tier] == {
                state: f'query.max_trade_tier > 0 && query.trade_tier == {tier}',
            }
            assert states[state]['on_entry'] == [f'@s {event}']
            assert states[state]['transitions'] == [cancel]
        assert states['requested']['transitions'][5:] == [cancel]
    assert hashlib.sha256(content).hexdigest() == expected, name
allowed_extras = {
    'textures/item_texture.json': {'jagsbys_cauldron', 'jagsby_hen_house'},
    'textures/terrain_texture.json': {'apiary_cap', 'jagsby_hen_house', 'jagsby_medieval_chicken_coop'},
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
print(f"PASS: {len(inventory['exact_files'])} upstream files preserve their content (with the documented chicken egg and villager survey hooks checked separately); merged textures, sounds and translations preserve upstream content.")
