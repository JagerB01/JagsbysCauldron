// Jagsby's Cauldron startup coordinator.
import { world, system } from "@minecraft/server";
import { loadModuleSettings } from "./module_controller.js";
import { initialize as startDiplomacy } from "./modules/diplomacy.js";
import "./modules/croft.js";
import { initialize as startConquestCommerce } from "./modules/conquest_commerce.js";
import "./modules/mob_far_scaling.js"; // Commands register at early startup; runtime scaling is gated.
import "./cauldron_menu.js";
world.afterEvents.worldLoad.subscribe(() => {
  const enabled = loadModuleSettings();
  if (enabled.diplomacy) startDiplomacy();
  if (enabled.conquest_commerce) startConquestCommerce();
  console.warn(`[Jagsby's Cauldron] Active modules: ${Object.entries(enabled).filter(([,v]) => v).map(([k]) => k).join(', ') || 'none'}`);
});
