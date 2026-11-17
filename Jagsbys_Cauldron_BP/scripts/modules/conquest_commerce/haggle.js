import { world, system } from "@minecraft/server";
import { isCauldronModuleActive } from "../../module_controller.js";

export function initialize() {

const PICKUP_RADIUS = 1.5;
const ZOMBIE_VILLAGER_TYPE = "concom:villager_haggle";
const DIMENSIONS = ["overworld", "nether", "the_end"];

// Store locations of villagers just transformed
const pendingZombieLocations = [];

function locationsAreClose(loc1, loc2, threshold = 3) {
  const dx = loc1.x - loc2.x;
  const dy = loc1.y - loc2.y;
  const dz = loc1.z - loc2.z;
  return dx*dx + dy*dy + dz*dz <= threshold*threshold;
}

system.runInterval(() => {
  if (!isCauldronModuleActive("conquest_commerce")) return;
  for (const dimName of DIMENSIONS) {
    const dimension = world.getDimension(dimName);

    for (const player of dimension.getPlayers()) {
      const villagers = dimension.getEntities({
        type: "minecraft:villager_v2",
        location: player.location,
        maxDistance: 4,
      }).filter(v => {
        const isBaby = v.getComponent("is_baby");
        const variantComp = v.getComponent("variant");
        const variant = variantComp?.value ?? 0;

        return !isBaby && variant !== 0;
      });

      // Avoid querying dropped items when no eligible villager is in range.
      if (villagers.length === 0) continue;

      const emeraldDrops = dimension.getEntities({
        type: "minecraft:item",
        location: player.location,
        maxDistance: 4,
      });

      for (const item of emeraldDrops) {
        if (!item.isValid) continue;
        const itemComp = item.getComponent("item");
        if (!itemComp || itemComp.itemStack.typeId !== "minecraft:emerald") continue;

        for (const villager of villagers) {
          if (!villager.isValid) continue;
          const dx = item.location.x - villager.location.x;
          const dy = item.location.y - villager.location.y;
          const dz = item.location.z - villager.location.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance <= PICKUP_RADIUS) {
            item.remove();
            dimension.playSound("random.pop", villager.location);
            dimension.playSound("mob.villager.yes", villager.location);
            dimension.playSound("armor.equip_gold", villager.location);

            const loc = villager.location;
            const baseY = loc.y + 1.2;
            const coords = [
              [0.25, baseY + 0.5, -0.25],
              [-0.25, baseY, 0.25],
              [0.25, baseY + 0.5, 0.25],
              [-0.25, baseY, -0.25],
              [0, baseY + 0.2, 0],
            ];

            for (const [xOff, y, zOff] of coords) {
              dimension.runCommand(`particle minecraft:crop_growth_emitter ${loc.x + xOff} ${y} ${loc.z + zOff}`);
            }

            try {
              villager.triggerEvent("haggle");
              // Store location + dimension for spawn event check
              pendingZombieLocations.push({ x: loc.x, y: loc.y, z: loc.z, dimension: dimension.id });
            } catch (e) {
              console.warn("Error triggering become_zombie: " + e.message);
            }

            break;
          }
        }
      }
    }
  }
}, 20);

world.afterEvents.entitySpawn.subscribe((event) => {
  if (!isCauldronModuleActive("conquest_commerce")) return;
  const entity = event.entity;
  if (entity.typeId === ZOMBIE_VILLAGER_TYPE) {
    // Check if this entity spawned at one of the stored pending locations
    const spawnLoc = entity.location;
    const entityDim = entity.dimension.id;

    const index = pendingZombieLocations.findIndex(loc =>
      loc.dimension === entityDim && locationsAreClose(loc, spawnLoc, 3)
    );

    if (index !== -1) {
      try {
        entity.triggerEvent("villager_haggle");
      } catch (e) {
        console.warn("Error triggering villager_haggle: " + e.message);
      }
      // Remove location so it won't trigger again
      pendingZombieLocations.splice(index, 1);
    }
  }
});

}
