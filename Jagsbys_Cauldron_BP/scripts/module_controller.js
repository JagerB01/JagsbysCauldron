import { world, system } from "@minecraft/server";

const KEY = "jagsbys_cauldron:module_settings_v1";
const DEFAULTS = Object.freeze({ diplomacy: true, croft: true, mfs: true, conquest_commerce: true });
let active = { ...DEFAULTS };
let planned = { ...DEFAULTS };
let ready = false;

function readSettings() {
  try {
    const raw = world.getDynamicProperty(KEY);
    const data = raw ? JSON.parse(raw) : {};
    // Migrate the legacy Apiary switch to the shared Croft module.
    if (typeof data.croft !== "boolean" && typeof data.apiary === "boolean") data.croft = data.apiary;
    return Object.fromEntries(Object.keys(DEFAULTS).map(k => [k, typeof data[k] === "boolean" ? data[k] : DEFAULTS[k]]));
  } catch { return { ...DEFAULTS }; }
}
export function loadModuleSettings() {
  planned = readSettings();
  active = { ...planned };
  ready = true;
  return { ...active };
}
export function isCauldronModuleActive(name) { return !ready || active[name] === true; }
export function getModuleSettings() { return { ...planned }; }
export function saveModuleSettings(settings) {
  planned = Object.fromEntries(Object.keys(DEFAULTS).map(k => [k, settings[k] === true]));
  world.setDynamicProperty(KEY, JSON.stringify(planned));
}
export function settingsRequireRestart() { return Object.keys(DEFAULTS).some(k => active[k] !== planned[k]); }
