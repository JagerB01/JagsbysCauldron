import { world, system, BlockPermutation, ItemStack } from "@minecraft/server";
import { isCauldronModuleActive } from "../../module_controller.js";
const TYPE = "jagsby:hen_house";
const offsets = {north:{x:0,z:-1},south:{x:0,z:1},east:{x:1,z:0},west:{x:-1,z:0}};
const opposite = {north:"south",south:"north",east:"west",west:"east"};
function adjacent(block,direction) {
  const o=offsets[direction];
  return block.dimension.getBlock({x:block.location.x+o.x,y:block.location.y,z:block.location.z+o.z});
}
world.afterEvents.playerPlaceBlock.subscribe(({block,player})=>{
  if(block.typeId!==TYPE) return;
  if(!isCauldronModuleActive("croft")) return;
  try {
    const facing=player.getViewDirection();
    const direction=Math.abs(facing.x)>Math.abs(facing.z) ? (facing.x>=0?"east":"west") : (facing.z>=0?"south":"north");
    const second=adjacent(block,direction);
    if(!second || second.typeId!=="minecraft:air"){
      block.setType("minecraft:air");
      const inv=player.getComponent("minecraft:inventory")?.container;
      if(player.getGameMode()!=="Creative") inv?.addItem(new ItemStack(TYPE,1));
      player.sendMessage("§cHen House needs two empty blocks in front of you.");
      return;
    }
    block.setPermutation(BlockPermutation.resolve(TYPE,{"jagsby:half":"front","jagsby:facing":direction}));
    second.setPermutation(BlockPermutation.resolve(TYPE,{"jagsby:half":"back","jagsby:facing":direction}));
  } catch(e) { console.warn("[Hen House] Placement failed: "+e); }
});
world.afterEvents.playerBreakBlock.subscribe(({block,brokenBlockPermutation})=>{
  if(brokenBlockPermutation.type.id!==TYPE) return;
  try {
    const direction=brokenBlockPermutation.getState("jagsby:facing");
    const half=brokenBlockPermutation.getState("jagsby:half");
    const other=adjacent(block,half==="front"?direction:opposite[direction]);
    if(other?.typeId!==TYPE) return;
    if(other.permutation.getState("jagsby:facing")!==direction) return;
    if(other.permutation.getState("jagsby:half")===(half==="front"?"back":"front")) {
      // No duplicate item: only front half has a loot table.
      if(half==="back") {
        const origin=block.location;
        block.dimension.spawnItem(new ItemStack(TYPE,1),{x:origin.x+0.5,y:origin.y+0.5,z:origin.z+0.5});
      }
      other.setType("minecraft:air");
    }
  } catch(e){console.warn("[Hen House] Break cleanup: "+e);}
});
