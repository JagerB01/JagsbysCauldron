import { world, ItemStack, Items, BlockTypes } from "@minecraft/server";

world.afterEvents.playerInteractWithBlock.subscribe(ev => {
    const player = ev.player;
    const block = ev.block;

    // Only trigger on fletching table
    if (block.typeId !== "minecraft:fletching_table") return;

    const inv = player.getComponent("inventory").container;
    const selected = inv.getItem(player.selectedSlot);

    // Must be holding an arrow
    if (!selected || selected.typeId !== "minecraft:arrow") return;

    // Consume 1 arrow
    selected.amount -= 1;
    if (selected.amount <= 0) {
        inv.setItem(player.selectedSlot, undefined);
    } else {
        inv.setItem(player.selectedSlot, selected);
    }

    // Roll 25% chance for each outcome
    const roll = Math.random();

    let resultItem = null;

    if (roll < 0.25) {
        resultItem = new ItemStack(Items.stick, 1);
    } else if (roll < 0.50) {
        resultItem = new ItemStack(Items.feather, 1);
    } else if (roll < 0.75) {
        resultItem = new ItemStack(Items.flint, 1);
    } else {
        // 25% chance of nothing
        return;
    }

    // Drop the resulting item at the table
    block.dimension.spawnItem(resultItem, {
        x: block.location.x + 0.5,
        y: block.location.y + 1,
        z: block.location.z + 0.5
    });
});
