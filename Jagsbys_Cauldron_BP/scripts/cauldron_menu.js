import { world, system } from "@minecraft/server";
import { ActionFormData, ModalFormData } from "@minecraft/server-ui";
import { getModuleSettings, saveModuleSettings, settingsRequireRestart } from "./module_controller.js";

const ITEM_ID = "jagsby:cauldron";
const lastOpenTick = new Map();

function tryOpenFromCauldron(player, itemStack) {
  if (!player || !itemStack || itemStack.typeId !== ITEM_ID) return;

  const now = system.currentTick;
  const last = lastOpenTick.get(player.name) ?? -100;
  if (now - last < 4) return;
  lastOpenTick.set(player.name, now);

  system.run(() => {
    showMenu(player).catch((e) => {
      player.sendMessage(`§c[Jagsby's Cauldron] Could not open the settings menu: ${String(e)}`);
    });
  });
}

async function showMenu(player) {
  const settings = getModuleSettings();
  const op = player.isOp();
  const names = { diplomacy: 'Diplomacy', croft: 'Croft', mfs: 'Mob Far Scaling', conquest_commerce: 'Conquest & Commerce (scripts)' };
  const status = Object.entries(settings)
    .map(([key, value]) => `${value ? '§aEnabled' : '§cDisabled'}§r  §f${names[key] ?? key}§r`)
    .join('\n');

  const form = new ActionFormData()
    .title("§aJagsby's Cauldron§r")
    .body(`§fToggle which bundled modules should load the next time the world starts.

${status}

§7Conquest & Commerce: the toggle pauses scripted haggling only. Trades, entities, recipes, world generation and resources stay loaded.§r${settingsRequireRestart() ? '\n\n§eRestart the world to apply changes.§r' : ''}`)
    .button('Close');

  if (op) form.button('Configure Modules');
  else form.button('Administrator settings only');

  const result = await form.show(player);
  if (result.canceled || result.selection === 0) return;
  if (op) return showSettings(player);
}

async function showSettings(player) {
  if (!player.isOp()) return;
  const s = getModuleSettings();
  const form = new ModalFormData()
    .title("Jagsby's Cauldron Modules")
    .toggle('Diplomacy', { defaultValue: s.diplomacy })
    .toggle('Croft', { defaultValue: s.croft })
    .toggle('Mob Far Scaling', { defaultValue: s.mfs })
    .toggle('Conquest & Commerce (scripted haggling)', { defaultValue: s.conquest_commerce })
    .submitButton('Save for next world load');

  const res = await form.show(player);
  if (res.canceled || !res.formValues || !player.isOp()) return;

  saveModuleSettings({
    diplomacy: res.formValues[0] === true,
    croft: res.formValues[1] === true,
    mfs: res.formValues[2] === true,
    conquest_commerce: res.formValues[3] === true
  });

  player.sendMessage("§a[Jagsby\'s Cauldron] Module settings saved. Restart the world to apply changes.");
}

world.afterEvents.itemUse.subscribe((event) => {
  tryOpenFromCauldron(event.source, event.itemStack);
});

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
  if (!event.isFirstEvent) return;
  tryOpenFromCauldron(event.player, event.beforeItemStack ?? event.itemStack);
});

world.afterEvents.playerInteractWithEntity.subscribe((event) => {
  tryOpenFromCauldron(event.player, event.beforeItemStack ?? event.itemStack);
});
