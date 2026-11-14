import { isCauldronModuleActive } from "../../module_controller.js";
import { world, system, ItemStack } from "@minecraft/server";

const CAP = "apiary:cap";
const STORAGE_KEY = "apiary:cap_storage_v1";
const MAX_STORAGE = 576; // 9 stacks
let diagnosticsLogged = false;
let disabledLogged = false;

function readStore() {
  try {
    const raw = world.getDynamicProperty(STORAGE_KEY);
    if (typeof raw !== "string" || raw.length === 0) return {};
    return JSON.parse(raw);
  } catch { return {}; }
}

function writeStore(store) {
  try { world.setDynamicProperty(STORAGE_KEY, JSON.stringify(store)); } catch {}
}

function keyFor(block) {
  const p = block.location;
  return `${block.dimension.id}|${Math.floor(p.x)},${Math.floor(p.y)},${Math.floor(p.z)}`;
}

function getCount(block) {
  const s = readStore();
  return Number(s[keyFor(block)] ?? 0);
}

function syncVisual(block, count) {
  try {
    const wanted = Number(count) > 0;
    const current = block.permutation.getState("apiary:has_honey");
    if (current !== wanted) {
      block.setPermutation(block.permutation.withState("apiary:has_honey", wanted));
    }
  } catch {}
}

function setCount(block, count) {
  const s = readStore();
  const k = keyFor(block);
  const n = Math.max(0, Math.min(MAX_STORAGE, Math.floor(count)));
  if (n <= 0) delete s[k]; else s[k] = n;
  writeStore(s);
  syncVisual(block, n);
}

function isAdjacentToCap(block) {
  const {x,y,z}=block.location;
  const d=block.dimension;
  const pts=[[x+1,y,z],[x-1,y,z],[x,y,z+1],[x,y,z-1]];
  for (const [a,b,c] of pts) {
    try { if (d.getBlock({x:a,y:b,z:c})?.typeId === CAP) return true; } catch {}
  }
  return false;
}

function below(block) {
  const {x,y,z}=block.location;
  try { return block.dimension.getBlock({x,y:y-1,z}); } catch { return undefined; }
}

function harvest(block) {
  const hive = below(block);
  if (!hive) return;
  if (hive.typeId !== "minecraft:beehive" && hive.typeId !== "minecraft:bee_nest") return;
  const count = getCount(block);
  if (count > MAX_STORAGE - 3) return;
  let honey;
  try { honey = hive.permutation.getState("honey_level"); } catch { return; }
  if (honey !== 5) return;
  try {
    hive.setPermutation(hive.permutation.withState("honey_level", 0));
    setCount(block, count + 3);
    block.dimension.playSound("block.beehive.shear", block.location);
  } catch {}
}

function withdraw(block, player) {
  let remaining = getCount(block);
  if (remaining <= 0) return;
  const inv = player.getComponent("minecraft:inventory")?.container;
  if (!inv) return;
  let moved = 0;
  while (remaining > 0) {
    const take = Math.min(64, remaining);
    const stack = new ItemStack("minecraft:honeycomb", take);
    let leftover;
    try { leftover = inv.addItem(stack); } catch { break; }
    const left = leftover ? leftover.amount : 0;
    const accepted = take - left;
    if (accepted <= 0) break;
    moved += accepted;
    remaining -= accepted;
    if (left > 0) break;
  }
  if (moved > 0) {
    setCount(block, remaining);
    // Report only successful transfers. Include player identity because
    // API-sent script events are server-sourced rather than entity-sourced.
    try { system.sendScriptEvent("minescape:apiary_harvest", JSON.stringify({ playerId: player.id, count: moved })); } catch {}
    system.run(() => {
      try {
        player.dimension.playSound("apiary.honey_collect", player.location, { volume: 1.0, pitch: 1.0 });
      } catch {}
    });
  }
}

function dropStored(block) {
  let n = getCount(block);
  if (n <= 0) return;
  const loc = {x:block.location.x+0.5,y:block.location.y+0.5,z:block.location.z+0.5};
  while (n > 0) {
    const amt = Math.min(64,n);
    try { block.dimension.spawnItem(new ItemStack("minecraft:honeycomb",amt),loc); } catch {}
    n -= amt;
  }
  setCount(block,0);
}

system.beforeEvents.startup.subscribe((ev) => {
  ev.blockComponentRegistry.registerCustomComponent("apiary:cap_logic", {
    beforeOnPlayerPlace(e) {
      if (!isCauldronModuleActive("croft")) return;
      try {
        if (isAdjacentToCap(e.block)) {
          e.cancel = true;
        }
      } catch {}
    },
    onTick(e) {
      if (!isCauldronModuleActive("croft")) {
        if (!disabledLogged) {
          disabledLogged = true;
          console.warn("[Apiary Cap] Tick received but Croft module is disabled in world settings; harvesting is intentionally paused.");
        }
        return;
      }
      if (!diagnosticsLogged) {
        diagnosticsLogged = true;
        console.warn("[Apiary Cap] Original block onTick callback is firing (single harvest mechanism active).");
      }
      const count = getCount(e.block);
      syncVisual(e.block, count);
      harvest(e.block);
    },
    onPlayerInteract(e) { if (isCauldronModuleActive("croft") && e.player) withdraw(e.block,e.player); },
    onPlayerBreak(e) { if (isCauldronModuleActive("croft")) dropStored(e.block); }
  });
});
