import { BlockVolume, EntityInitializationCause, GameMode, ItemStack, system, world } from "@minecraft/server";
import { isCauldronModuleActive } from "../../module_controller.js";

const TYPE = "jagsby:hen_house";
const HALF = "jagsby:half";
const FACING = "jagsby:facing";
const SINGLE = "single";
const RADIUS = 16;
const CAPACITY = 64;
const EGG_MARKER = "jagsby:laid_egg";
const CHICKEN_EGGS = {
  "jagsby:lay_egg": "minecraft:egg",
  "jagsby:lay_brown_egg": "minecraft:brown_egg",
  "jagsby:lay_blue_egg": "minecraft:blue_egg",
};
const OFFSETS = {
  north: { x: 0, z: -1 }, south: { x: 0, z: 1 },
  east: { x: 1, z: 0 }, west: { x: -1, z: 0 },
};
const OPPOSITE = { north: "south", south: "north", east: "west", west: "east" };

function center({ x, y, z }) {
  return { x: x + 0.5, y: y + 0.5, z: z + 0.5 };
}

function storageKey(block) {
  const { x, y, z } = block.location;
  return `jagsby:hen_eggs:${block.dimension.id}:${x},${y},${z}`;
}

function readEggs(key) {
  const value = world.getDynamicProperty(key);
  return typeof value === "string" ? JSON.parse(value) : {};
}

function writeEggs(key, eggs) {
  world.setDynamicProperty(key, Object.keys(eggs).length ? JSON.stringify(eggs) : undefined);
}

function nearestCoop(dimension, location) {
  const { x, y, z } = location;
  const { min, max } = dimension.heightRange;
  const volume = new BlockVolume(
    { x: Math.floor(x - RADIUS), y: Math.max(min, Math.floor(y - RADIUS)), z: Math.floor(z - RADIUS) },
    { x: Math.floor(x + RADIUS), y: Math.min(max - 1, Math.floor(y + RADIUS)), z: Math.floor(z + RADIUS) },
  );
  const blocks = dimension.getBlocks(volume, { includeTypes: [TYPE] }, true);
  let nearest;
  let nearestDistance = Infinity;
  for (const position of blocks.getBlockLocationIterator()) {
    const point = center(position);
    const distance = (point.x - x) ** 2 + (point.y - y) ** 2 + (point.z - z) ** 2;
    if (distance > RADIUS ** 2 || distance >= nearestDistance) continue;
    const block = dimension.getBlock(position);
    if (block?.permutation.getState(HALF) !== SINGLE) continue;
    const key = storageKey(block);
    const eggs = readEggs(key);
    if (Object.values(eggs).reduce((sum, count) => sum + count, 0) >= CAPACITY) continue;
    nearest = { key, eggs };
    nearestDistance = distance;
  }
  return nearest;
}

function collectEgg(entity, typeId) {
  if (!isCauldronModuleActive("croft")) return false;
  const coop = nearestCoop(entity.dimension, entity.location);
  if (!coop) return false;
  const { key, eggs } = coop;
  writeEggs(key, { ...eggs, [typeId]: (eggs[typeId] ?? 0) + 1 });
  try {
    entity.remove();
  } catch (error) {
    writeEggs(key, eggs);
    throw error;
  }
  return true;
}

// The adult chicken's existing timer spawns a marker with the exact egg variant.
world.afterEvents.dataDrivenEntityTrigger.subscribe(({ entity, eventId }) => {
  const typeId = CHICKEN_EGGS[eventId];
  try {
    if (collectEgg(entity, typeId)) return;
  } catch (error) {
    console.warn("[Hen House] Collection failed: " + error);
  }
  try {
    entity.dimension.spawnItem(new ItemStack(typeId), entity.location);
    entity.remove();
  } catch (error) {
    console.warn("[Hen House] Egg drop failed: " + error);
  }
}, { entityTypes: [EGG_MARKER], eventTypes: Object.keys(CHICKEN_EGGS) });

function birdKind(id) {
  const words = id.split(/[:_.-]/);
  if (words.includes("duck") || words.includes("duckegg")) return "duck";
  if (words.includes("turkey") || words.includes("turkeyegg")) return "turkey";
  return undefined;
}

// External packs produce their own loose items. Require a fresh single egg near a matching bird.
world.afterEvents.entitySpawn.subscribe(({ entity, cause }) => {
  if (entity.typeId !== "minecraft:item" || cause === EntityInitializationCause.Loaded) return;
  if (!isCauldronModuleActive("croft")) return;
  try {
    const item = entity.getComponent("minecraft:item")?.itemStack;
    if (item?.amount !== 1 || item.typeId.startsWith("minecraft:")) return;
    const itemName = item.typeId.split(":")[1];
    if (!/(?:^|[_-])eggs?(?:$|[_-])|^(?:duck|turkey)egg$/.test(itemName)) return;
    const bird = birdKind(item.typeId);
    if (!bird) return;
    const nearby = entity.dimension.getEntities({ location: entity.location, maxDistance: 1.5 });
    if (nearby.some(animal => birdKind(animal.typeId) === bird)) collectEgg(entity, item.typeId);
  } catch (error) {
    console.warn("[Hen House] Compatibility collection failed: " + error);
  }
});

function transferEggs(block, move) {
  const key = storageKey(block);
  const eggs = readEggs(key);
  for (const [typeId, count] of Object.entries(eggs)) {
    let remaining = count;
    while (remaining > 0) {
      const stack = new ItemStack(typeId);
      stack.amount = Math.min(stack.maxAmount, remaining);
      const moved = move(stack);
      if (!moved) break;
      remaining -= moved;
      if (remaining) eggs[typeId] = remaining;
      else delete eggs[typeId];
      writeEggs(key, eggs);
      if (moved < stack.amount) break;
    }
  }
}

system.beforeEvents.startup.subscribe(({ blockComponentRegistry }) => {
  blockComponentRegistry.registerCustomComponent("jagsby:hen_house_storage", {
    onPlayerInteract({ block, player }) {
      if (!isCauldronModuleActive("croft") || block.permutation.getState(HALF) !== SINGLE) return;
      const inventory = player?.getComponent("minecraft:inventory")?.container;
      if (!inventory) return;
      transferEggs(block, stack => stack.amount - (inventory.addItem(stack)?.amount ?? 0));
    },
  });
});

world.afterEvents.playerPlaceBlock.subscribe(({ block, player }) => {
  if (block.typeId !== TYPE) return;
  try {
    const point = center(block.location);
    // The north-facing hatch points opposite the depth direction stored in the state.
    const dx = point.x - player.location.x;
    const dz = point.z - player.location.z;
    const view = dx === 0 && dz === 0 ? player.getViewDirection() : { x: dx, z: dz };
    const direction = Math.abs(view.x) > Math.abs(view.z)
      ? (view.x >= 0 ? "east" : "west")
      : (view.z >= 0 ? "south" : "north");
    writeEggs(storageKey(block), {});
    block.setPermutation(block.permutation.withState(HALF, SINGLE).withState(FACING, direction));
  } catch (error) {
    console.warn("[Hen House] Placement failed: " + error);
  }
});

world.afterEvents.playerBreakBlock.subscribe(({ block, brokenBlockPermutation, player }) => {
  if (brokenBlockPermutation.type.id !== TYPE) return;
  try {
    const half = brokenBlockPermutation.getState(HALF);
    if (half === SINGLE) {
      transferEggs(block, stack => {
        block.dimension.spawnItem(stack, center(block.location));
        return stack.amount;
      });
      return;
    }

    // Only legacy two-block coops have a matching half.
    const direction = brokenBlockPermutation.getState(FACING);
    const offset = OFFSETS[half === "front" ? direction : OPPOSITE[direction]];
    const { x, y, z } = block.location;
    const other = block.dimension.getBlock({ x: x + offset.x, y, z: z + offset.z });
    if (other?.typeId !== TYPE || other.permutation.getState(FACING) !== direction) return;
    if (other.permutation.getState(HALF) !== (half === "front" ? "back" : "front")) return;
    if (half === "back" && player.getGameMode() !== GameMode.Creative) {
      block.dimension.spawnItem(new ItemStack(TYPE), center(block.location));
    }
    other.setType("minecraft:air");
  } catch (error) {
    console.warn("[Hen House] Break cleanup failed: " + error);
  }
});
