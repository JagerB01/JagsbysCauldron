import { world, system } from "@minecraft/server";

const PICKUP_RADIUS = 1.5;
const DIMENSIONS = ["overworld", "nether", "the_end"];

system.runInterval(() => {
  for (const dimName of DIMENSIONS) {
    const dimension = world.getDimension(dimName);

    for (const player of world.getPlayers({ dimension })) {
      const emeraldDrops = dimension.getEntities({
        type: "minecraft:item",
        location: player.location,
        maxDistance: 4,
      });

      const villagers = dimension.getEntities({
        type: "minecraft:villager_v2",
        location: player.location,
        maxDistance: 4,
      }).filter(v => {
        const isBaby = v.getComponent("is_baby");
        const variantComp = v.getComponent("variant");
        const variant = variantComp?.value ?? 0;

        return (!isBaby || !isBaby.value) && variant !== 0;
      });

      for (const item of emeraldDrops) {
        const itemComp = item.getComponent("item");
        if (!itemComp || itemComp.itemStack.typeId !== "minecraft:emerald") continue;

        for (const villager of villagers) {
          const dx = item.location.x - villager.location.x;
          const dy = item.location.y - villager.location.y;
          const dz = item.location.z - villager.location.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (distance <= PICKUP_RADIUS) {
            item.remove();
            dimension.playSound("mob.villager.haggle", villager.location);
            dimension.playSound("mob.villager.haggle", villager.location);

            for (const p of world.getPlayers({ dimension })) {
              const px = p.location.x - villager.location.x;
              const py = p.location.y - villager.location.y;
              const pz = p.location.z - villager.location.z;
              const pdist = Math.sqrt(px * px + py * py + pz * pz);
            }

            break;
          }
        }
      }
    }
  }
}, 20);

