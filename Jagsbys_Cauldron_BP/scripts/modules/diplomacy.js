import { world, system } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

export function initialize() {

const DATA_KEY = "diplomacy:data_v1";

const COLORS = [
  { id: "red", name: "Red", code: "§c" },
  { id: "orange", name: "Orange", code: "§6" },
  { id: "yellow", name: "Yellow", code: "§e" },
  { id: "lime", name: "Lime", code: "§a" },
  { id: "green", name: "Green", code: "§2" },
  { id: "aqua", name: "Aqua", code: "§b" },
  { id: "cyan", name: "Cyan", code: "§3" },
  { id: "blue", name: "Blue", code: "§9" },
  { id: "purple", name: "Purple", code: "§5" },
  { id: "magenta", name: "Magenta", code: "§d" },
  { id: "white", name: "White", code: "§f" },
  { id: "gray", name: "Gray", code: "§7" },
  { id: "dark_gray", name: "Dark Gray", code: "§8" }
];

const STANCES = [
  "Neutral",
  "Friendly",
  "Trade Agreement",
  "Non-Aggression Pact",
  "Alliance",
  "Rivalry",
  "War"
];

const SHOP_TYPES = [
  "Armorer",
  "Butcher",
  "Cartographer",
  "Cleric",
  "Farmer",
  "Fisherman",
  "Fletcher",
  "Leatherworker",
  "Librarian",
  "Mason",
  "Shepherd",
  "Toolsmith",
  "Weaponsmith"
];

function blankData() {
  return {
    players: {},
    villages: {},
    relations: {},
    nextVillageId: 1
  };
}

function removeDemoData(data) {
  const demoNames = new Set();

  for (const [name, record] of Object.entries(data.players ?? {})) {
    if (record?.demo === true) demoNames.add(name);
  }

  for (const [id, village] of Object.entries(data.villages ?? {})) {
    if (village?.demo === true || demoNames.has(village?.owner)) {
      delete data.villages[id];
    }
  }

  for (const name of demoNames) {
    delete data.players[name];
  }

  for (const record of Object.values(data.players ?? {})) {
    if (record?.overlord && demoNames.has(record.overlord)) record.overlord = null;
  }

  for (const key of Object.keys(data.relations ?? {})) {
    const [a, b] = key.split("||");
    if (demoNames.has(a) || demoNames.has(b)) delete data.relations[key];
  }
}

function loadData() {
  try {
    const raw = world.getDynamicProperty(DATA_KEY);
    if (typeof raw !== "string" || raw.length === 0) {
      const data = blankData();
      return data;
    }
    const data = JSON.parse(raw);
    data.players ??= {};
    for (const record of Object.values(data.players)) record.overlord ??= null;
    data.villages ??= {};
    for (const village of Object.values(data.villages)) village.shopEntries ??= [];
    data.relations ??= {};
    data.nextVillageId ??= 1;
    removeDemoData(data);
    return data;
  } catch (e) {
    const data = blankData();
    removeDemoData(data);
    return data;
  }
}

function saveData(data) {
  try {
    world.setDynamicProperty(DATA_KEY, JSON.stringify(data));
  } catch (e) {
    world.sendMessage("§c[Diplomacy] Could not save diplomacy data: " + String(e));
  }
}

function colorInfo(colorId) {
  return COLORS.find(c => c.id === colorId) ?? COLORS[10];
}

function playerIcon(record) {
  const c = colorInfo(record?.color);
  return `${c.code}■§r`;
}

function vassalageText(data, playerName) {
  const overlord = data.players[playerName]?.overlord;
  if (overlord && data.players[overlord]) return `Vassal of ${overlord}`;
  return "Independent";
}

function isVassalPair(data, a, b) {
  return data.players[a]?.overlord === b || data.players[b]?.overlord === a;
}

function wouldCreateVassalCycle(data, vassalName, overlordName) {
  let current = overlordName;
  const seen = new Set();
  while (current && data.players[current] && !seen.has(current)) {
    if (current === vassalName) return true;
    seen.add(current);
    current = data.players[current]?.overlord ?? null;
  }
  return false;
}

function relationKey(a, b) {
  return [a, b].sort((x, y) => x.localeCompare(y)).join("||");
}

function getStance(data, a, b) {
  if (a === b) return "Self";
  return data.relations[relationKey(a, b)] ?? "Neutral";
}

function setStance(data, a, b, stance) {
  data.relations[relationKey(a, b)] = stance;
}

function ownedVillages(data, playerName) {
  return Object.values(data.villages).filter(v => v.owner === playerName);
}

function realmPower(data, playerName) {
  return ownedVillages(data, playerName).reduce((sum, v) => sum + Math.max(0, Number(v.shops) || 0), 0);
}

function nobilityRank(power) {
  const n = Math.max(0, Math.floor(Number(power) || 0));
  if (n <= 3) return "Unlanded";
  if (n <= 8) return "Commoner";
  if (n <= 15) return "Noble";
  if (n <= 24) return "Lord";
  if (n <= 35) return "Baron";
  if (n <= 49) return "Count";
  if (n <= 69) return "Duke";
  if (n <= 94) return "King";
  return "Emperor";
}

function nobilityRankIconPath(rank) {
  if (rank === "Commoner") return "textures/items/diplomacy/rank_commoner";
  if (rank === "Noble") return "textures/items/diplomacy/rank_noble";
  if (rank === "Lord") return "textures/items/diplomacy/rank_lord";
  if (rank === "Baron") return "textures/items/diplomacy/rank_baron";
  if (rank === "Count") return "textures/items/diplomacy/rank_count";
  if (rank === "Duke") return "textures/items/diplomacy/rank_duke";
  if (rank === "King") return "textures/items/diplomacy/rank_king";
  if (rank === "Emperor") return "textures/items/diplomacy/rank_emperor";
  return "textures/items/diplomacy/rank_unlanded";
}

function capitalName(data, playerName) {
  const p = data.players[playerName];
  if (!p?.capitalId) return "None";
  const village = data.villages[p.capitalId];
  if (!village || village.owner !== playerName) return "None";
  return village.name;
}

function settlementTier(shops) {
  const n = Math.max(0, Math.floor(Number(shops) || 0));
  if (n <= 1) return "Outpost";
  if (n <= 3) return "Hamlet";
  if (n <= 6) return "Village";
  if (n <= 10) return "Town";
  return "City";
}

function settlementIconPath(shops) {
  const tier = settlementTier(shops);
  if (tier === "Outpost") return "textures/items/diplomacy/settlement_outpost";
  if (tier === "Hamlet") return "textures/items/diplomacy/settlement_hamlet";
  if (tier === "Village") return "textures/items/diplomacy/settlement_village";
  if (tier === "Town") return "textures/items/diplomacy/settlement_town";
  return "textures/items/diplomacy/settlement_city";
}

function stanceIconPath(stance) {
  if (stance === "Friendly") return "textures/items/diplomacy/stance_friendly";
  if (stance === "Trade Agreement") return "textures/items/diplomacy/stance_trade_agreement";
  if (stance === "Non-Aggression Pact") return "textures/items/diplomacy/stance_non_aggression_pact";
  if (stance === "Alliance") return "textures/items/diplomacy/stance_alliance";
  if (stance === "Vassalage") return "textures/items/diplomacy/stance_vassalage";
  if (stance === "Rivalry") return "textures/items/diplomacy/stance_rivalry";
  if (stance === "War") return "textures/items/diplomacy/stance_war";
  return "textures/items/diplomacy/stance_neutral";
}

function shopIconPath(type) {
  return `textures/items/diplomacy/shops/${String(type).toLowerCase()}`;
}

function sanitizeText(value, fallback = "") {
  const s = String(value ?? "").trim();
  return s.length > 40 ? s.slice(0, 40) : (s || fallback);
}

function ensureRegistered(player, callback) {
  const data = loadData();
  if (data.players[player.name]) {
    callback();
    return;
  }
  chooseInitialColor(player, callback);
}

async function chooseInitialColor(player, callback) {
  const data = loadData();
  const used = new Set(Object.values(data.players).map(p => p.color));
  let choices = COLORS.filter(c => !used.has(c.id));
  if (choices.length === 0) choices = COLORS;

  const form = new ActionFormData()
    .title("§9Choose Realm Color§r")
    .body("§fChoose the color icon that will represent you in Diplomacy.§r");

  for (const c of choices) {
    form.button(`${c.code}■§r  ${c.name}`);
  }

  const res = await form.show(player);
  if (res.canceled || res.selection === undefined) return;

  const chosen = choices[res.selection];
  const fresh = loadData();
  fresh.players[player.name] = {
    color: chosen.id,
    capitalId: null,
    overlord: null
  };
  saveData(fresh);
  player.sendMessage(`§7[Diplomacy] Realm color set.`);
  callback();
}

async function openDashboard(player) {
  ensureRegistered(player, async () => {
    const data = loadData();
    const record = data.players[player.name];
    const villages = ownedVillages(data, player.name);
    const power = realmPower(data, player.name);
    const rank = nobilityRank(power);
    const names = Object.keys(data.players)
      .filter(n => n !== player.name)
      .sort((a, b) => a.localeCompare(b));

    let body =
      `${playerIcon(record)} §f${player.name}§r  §8•§r  §e${rank}§r\n` +
      `§6Realm Power: ${power}§r\n` +
      `§dVillages: ${villages.length}§r  §8•§r  ` +
      `§bCapital: ${capitalName(data, player.name)}§r\n` +
      `§7${vassalageText(data, player.name)}§r`;

    if (names.length) {
      body += `\n§8────────────§r`;
      names.forEach((name, index) => {
        const r = data.players[name];
        const count = ownedVillages(data, name).length;
        const otherPower = realmPower(data, name);
        const otherRank = nobilityRank(otherPower);
        body +=
          `${index === 0 ? "\n" : "\n\n"}${playerIcon(r)} §f${name}§r  §8•§r  §e${otherRank}§r\n` +
          `§6Realm Power: ${otherPower}§r\n` +
          `§dVillages: ${count}§r  §8•§r  ` +
          `§bCapital: ${capitalName(data, name)}§r\n` +
          `§7${vassalageText(data, name)}§r`;
      });
    }

    const form = new ActionFormData()
      .title("§9Diplomacy§r")
      .body(body)
      .button("My Realm", nobilityRankIconPath(rank));

    for (const name of names) {
      const r = data.players[name];
      const count = ownedVillages(data, name).length;
      const otherPower = realmPower(data, name);
      const otherRank = nobilityRank(otherPower);
      const stance = getStance(data, player.name, name);
      form.button(`${playerIcon(r)} ${name}\n§0${otherRank} • ${count} villages • Power ${otherPower}§r`, stanceIconPath(stance));
    }

    form.button("Information");

    const res = await form.show(player);
    if (res.canceled || res.selection === undefined) return;
    if (res.selection === 0) return openMyVillages(player);

    if (res.selection >= 1 && res.selection <= names.length) {
      return openPlayerDetail(player, names[res.selection - 1]);
    }

    return openInformation(player);
  });
}


async function openMyRealm(player) {
  return openMyVillages(player);
}


async function openPlayers(player) {
  return openDashboard(player);
}



async function openPlayerDetail(player, targetName) {
  const data = loadData();
  const target = data.players[targetName];
  if (!target) return openDashboard(player);

  const stance = getStance(data, player.name, targetName);
  const power = realmPower(data, targetName);
  const rank = nobilityRank(power);
  const villages = ownedVillages(data, targetName)
    .sort((a, b) => (b.shops - a.shops) || a.name.localeCompare(b.name));

  const form = new ActionFormData()
    .title(`§9${targetName}§r`)
    .body(
      `${playerIcon(target)} §f${targetName}§r  §8•§r  §e${rank}§r
` +
      `§6Realm Power: ${power}§r
` +
      `§dVillages: ${villages.length}§r  §8•§r  ` +
      `§bCapital: ${capitalName(data, targetName)}§r
` +
      `§7Diplomatic Stance: §f${stance}§r` +
      `

§8────────────§r
§fSettlements§r`
    )
    .button("Back")
    .button("Set Diplomatic Stance", stanceIconPath(stance));

  for (const v of villages) {
    form.button(`${v.name}
§0${settlementTier(v.shops)} • ${v.shops} shops • ${v.biome}§r`, settlementIconPath(v.shops));
  }

  const res = await form.show(player);
  if (res.canceled || res.selection === undefined) return;
  if (res.selection === 0) return openDashboard(player);
  if (res.selection === 1) return openSetStance(player, targetName);
  return openVillageDetail(player, villages[res.selection - 2].id, false, targetName);
}

async function openSetStance(player, targetName) {
  const data = loadData();
  const current = getStance(data, player.name, targetName);
  const form = new ActionFormData()
    .title("§9Diplomatic Stance§r")
    .body(
      `§fRelationship with ${targetName}§r\n` +
      `§7Current: §f${current}§r`
    )
    .button("Back");

  for (const stance of STANCES) form.button(stance, stanceIconPath(stance));

  const res = await form.show(player);
  if (res.canceled || res.selection === undefined) return;
  if (res.selection === 0) return openPlayerDetail(player, targetName);

  const chosen = STANCES[res.selection - 1];
  const fresh = loadData();
  setStance(fresh, player.name, targetName, chosen);
  saveData(fresh);

  const verified = loadData();
  const savedStance = getStance(verified, player.name, targetName);
  player.sendMessage(`§7[Diplomacy] Stance with ${targetName} set to ${savedStance}.`);
  return openPlayerDetail(player, targetName);
}


async function openMyVillages(player) {
  const data = loadData();
  const villages = ownedVillages(data, player.name)
    .sort((a, b) => (b.shops - a.shops) || a.name.localeCompare(b.name));
  const power = realmPower(data, player.name);
  const rank = nobilityRank(power);

  const form = new ActionFormData()
    .title("§9My Realm§r")
    .body(
      `${playerIcon(data.players[player.name])} §f${player.name}§r  §8•§r  §e${rank}§r\n` +
      `§6Realm Power: ${power}§r\n` +
      `§dVillages: ${villages.length}§r  §8•§r  ` +
      `§bCapital: ${capitalName(data, player.name)}§r\n` +
      `§7${vassalageText(data, player.name)}§r`
    )
    .button("Back");

  // Villages take priority and appear immediately after Back.
  for (const v of villages) {
    form.button(
      `${v.name}\n§0${settlementTier(v.shops)} • ${v.shops} shops • ${v.biome}§r`,
      settlementIconPath(v.shops)
    );
  }

  // Realm management actions stay at the bottom.
  form.button("+ Register Village");
  form.button("Realm Color");
  form.button("Vassalage", "textures/items/diplomacy/stance_vassalage");

  const res = await form.show(player);
  if (res.canceled || res.selection === undefined) return;

  if (res.selection === 0) return openDashboard(player);

  // Village buttons occupy selections 1..villages.length.
  if (res.selection >= 1 && res.selection <= villages.length) {
    return openVillageDetail(player, villages[res.selection - 1].id, true);
  }

  const actionIndex = res.selection - (villages.length + 1);
  if (actionIndex === 0) return openCreateVillage(player);
  if (actionIndex === 1) return openChangeColor(player);
  if (actionIndex === 2) return openVassalage(player);
}

async function openCreateVillage(player) {
  const form = new ModalFormData()
    .title("§9Register Village§r")
    .textField("Village Name", "e.g. Varnesk", { defaultValue: "" })
    .textField("Active Shops", "0", { defaultValue: "0" })
    .textField("Biome", "Conquest & Commerce biome", { defaultValue: "Plains" });

  const res = await form.show(player);
  if (res.canceled || !res.formValues) return openMyVillages(player);

  const name = sanitizeText(res.formValues[0], "Unnamed Settlement");
  const shops = Math.max(0, Math.floor(Number(res.formValues[1]) || 0));
  const biome = sanitizeText(res.formValues[2], "Unknown");

  const data = loadData();
  const id = `v${data.nextVillageId++}`;
  data.villages[id] = { id, owner: player.name, name, shops, biome, shopEntries: [] };
  saveData(data);
  player.sendMessage(`§7[Diplomacy] Registered ${name} as a ${settlementTier(shops)}.`);
  return openMyVillages(player);
}

async function openEditVillage(player, villageId) {
  const data = loadData();
  const v = data.villages[villageId];
  if (!v || v.owner !== player.name) return openMyVillages(player);

  const form = new ModalFormData()
    .title("§9Edit Village§r")
    .textField("Village Name", "Village name", { defaultValue: v.name })
    .textField("Active Shops", "0", { defaultValue: String(v.shops) })
    .textField("Biome", "Conquest & Commerce biome", { defaultValue: v.biome });

  const res = await form.show(player);
  if (res.canceled || !res.formValues) return openVillageDetail(player, villageId, true);

  const fresh = loadData();
  const current = fresh.villages[villageId];
  if (!current || current.owner !== player.name) return openMyVillages(player);
  current.name = sanitizeText(res.formValues[0], current.name);
  current.shops = Math.max(0, Math.floor(Number(res.formValues[1]) || 0));
  current.biome = sanitizeText(res.formValues[2], current.biome);
  saveData(fresh);
  return openVillageDetail(player, villageId, true);
}

async function openVillageDetail(player, villageId, editable = false, backTarget = null) {
  const data = loadData();
  const v = data.villages[villageId];
  if (!v) return openDashboard(player);

  v.shopEntries ??= [];

  let body =
    `§f${v.name}§r  §8•§r  §e${settlementTier(v.shops)}§r\n` +
    `§6Active Shops: ${v.shops}§r  §8•§r  ` +
    `§bBiome: ${v.biome}§r`;

  if (v.shopEntries.length > 0) {
    body += `\n\n§8────────────§r\n§fShops§r`;
    for (const shop of v.shopEntries) {
      body += `\n§e${shop.name}§r  §8•§r  §f${shop.type}§r`;
    }
  }

  const form = new ActionFormData()
    .title(`§9${v.name}§r`)
    .body(body)
    .button("Back");

  if (editable && v.owner === player.name) {
    const isCapital = data.players[player.name]?.capitalId === villageId;
    form.button(isCapital ? "Capital (Current)" : "Set as Capital");
    form.button("Add Shop");
    form.button("Transfer Ownership");
    form.button("Edit Village");
    form.button("Delete Village");
  }

  const res = await form.show(player);
  if (res.canceled || res.selection === undefined) return;

  if (res.selection === 0) {
    if (editable && v.owner === player.name) return openMyVillages(player);
    if (backTarget) return openPlayerDetail(player, backTarget);
    return openAllVillages(player);
  }

  if (editable && v.owner === player.name) {
    if (res.selection === 1) {
      const fresh = loadData();
      if (fresh.players[player.name] && fresh.villages[villageId]?.owner === player.name) {
        fresh.players[player.name].capitalId = villageId;
        saveData(fresh);
      }
      return openVillageDetail(player, villageId, true);
    }
    if (res.selection === 2) return openAddShop(player, villageId);
    if (res.selection === 3) return openTransferVillage(player, villageId);
    if (res.selection === 4) return openEditVillage(player, villageId);
    if (res.selection === 5) return confirmDeleteVillage(player, villageId);
  }
}

async function openAddShop(player, villageId) {
  const data = loadData();
  const v = data.villages[villageId];
  if (!v || v.owner !== player.name) return openMyVillages(player);

  const form = new ModalFormData()
    .title("§9Add Shop§r")
    .textField("Shop Name", "e.g. Varnesk Smithy", { defaultValue: "" })
    .dropdown("Shop Type", SHOP_TYPES, { defaultValueIndex: 0 });

  const res = await form.show(player);
  if (res.canceled || !res.formValues) return openVillageDetail(player, villageId, true);

  const shopName = sanitizeText(res.formValues[0], "Unnamed Shop");
  const typeIndex = Math.max(0, Math.min(SHOP_TYPES.length - 1, Number(res.formValues[1]) || 0));
  const shopType = SHOP_TYPES[typeIndex];

  const fresh = loadData();
  const current = fresh.villages[villageId];
  if (!current || current.owner !== player.name) return openMyVillages(player);

  current.shopEntries ??= [];
  const shopId = `s_${Date.now()}_${current.shopEntries.length}`;
  current.shopEntries.push({ id: shopId, name: shopName, type: shopType });

  // Descriptive only: does not alter Active Shops or Realm Power.
  saveData(fresh);
  return openVillageDetail(player, villageId, true);
}

async function openTransferVillage(player, villageId) {
  const data = loadData();
  const v = data.villages[villageId];
  if (!v || v.owner !== player.name) return openMyVillages(player);

  const candidates = Object.keys(data.players)
    .filter(name => name !== player.name)
    .sort((a, b) => a.localeCompare(b));

  const form = new ActionFormData()
    .title("§9Transfer Ownership§r")
    .body(`§fTransfer ${v.name} to another player.§r`)
    .button("Back");

  for (const name of candidates) {
    form.button(`${playerIcon(data.players[name])} ${name}`);
  }

  const res = await form.show(player);
  if (res.canceled || res.selection === undefined) return;
  if (res.selection === 0) return openVillageDetail(player, villageId, true);

  const newOwner = candidates[res.selection - 1];
  if (!newOwner) return openVillageDetail(player, villageId, true);

  const fresh = loadData();
  const current = fresh.villages[villageId];
  if (!current || current.owner !== player.name || !fresh.players[newOwner]) return openMyVillages(player);

  if (fresh.players[player.name]?.capitalId === villageId) {
    fresh.players[player.name].capitalId = null;
  }

  current.owner = newOwner;
  saveData(fresh);
  return openMyVillages(player);
}

async function confirmDeleteVillage(player, villageId) {
  const data = loadData();
  const v = data.villages[villageId];
  if (!v || v.owner !== player.name) return openMyVillages(player);

  const form = new MessageFormData()
    .title("§9Delete Village§r")
    .body(`Delete ${v.name}? This only removes its Diplomacy record.`)
    .button1("Delete")
    .button2("Cancel");

  const res = await form.show(player);
  if (res.canceled) return openVillageDetail(player, villageId, true);
  if (res.selection === 0) {
    const fresh = loadData();
    delete fresh.villages[villageId];
    if (fresh.players[player.name]?.capitalId === villageId) fresh.players[player.name].capitalId = null;
    saveData(fresh);
    return openMyVillages(player);
  }
  return openVillageDetail(player, villageId, true);
}

async function openAllVillages(player) {
  const data = loadData();
  const villages = Object.values(data.villages)
    .sort((a, b) => (b.shops - a.shops) || a.name.localeCompare(b.name));

  const form = new ActionFormData()
    .title("§9All Villages§r")
    .body(villages.length ? "§fRegistered settlements across all realms.§r" : "§7No villages have been registered yet.§r")
    .button("Back");

  for (const v of villages) {
    form.button(`${v.name}\n§0${v.owner} • ${settlementTier(v.shops)} • ${v.biome}§r`, settlementIconPath(v.shops));
  }

  const res = await form.show(player);
  if (res.canceled || res.selection === undefined) return;
  if (res.selection === 0) return openMyVillages(player);
  return openVillageDetail(player, villages[res.selection - 1].id, false, null);
}


async function openPlayerVillages(player, targetName) {
  return openPlayerDetail(player, targetName);
}



async function openVassalage(player) {
  const data = loadData();
  const current = vassalageText(data, player.name);
  const candidates = Object.keys(data.players)
    .filter(name => name !== player.name)
    .filter(name => !wouldCreateVassalCycle(data, player.name, name))
    .sort((a, b) => a.localeCompare(b));

  const form = new ActionFormData()
    .title("§9Vassalage§r")
    .body(`§f${current}§r`)
    .button("Back")
    .button("Independent");

  for (const name of candidates) {
    form.button(`${playerIcon(data.players[name])} ${name}`);
  }

  const res = await form.show(player);
  if (res.canceled || res.selection === undefined) return;
  if (res.selection === 0) return openMyVillages(player);

  const fresh = loadData();
  if (!fresh.players[player.name]) return openMyVillages(player);

  if (res.selection === 1) {
    fresh.players[player.name].overlord = null;
  } else {
    const overlord = candidates[res.selection - 2];
    if (overlord && fresh.players[overlord]) {
      fresh.players[player.name].overlord = overlord;
    }
  }

  saveData(fresh);
  return openMyVillages(player);
}

async function openChangeColor(player) {
  const data = loadData();
  const used = new Set(Object.entries(data.players)
    .filter(([name]) => name !== player.name)
    .map(([, p]) => p.color));
  const choices = COLORS.filter(c => !used.has(c.id));

  const form = new ActionFormData()
    .title("§9Realm Color§r")
    .body("§7Colors already used by other registered players are hidden.§r")
    .button("Back");

  for (const c of choices) form.button(`${c.code}■§r  ${c.name}`);

  const res = await form.show(player);
  if (res.canceled || res.selection === undefined) return;
  if (res.selection === 0) return openMyVillages(player);

  const fresh = loadData();
  fresh.players[player.name].color = choices[res.selection - 1].id;
  saveData(fresh);
  return openMyVillages(player);
}


async function openInformation(player) {
  const body =
    "§fDiplomacy is a lightweight realm-tracking add-on for multiplayer worlds.§r\n" +
    "§7Use it to record settlements, compare realm power, track diplomatic relationships, vassalage, and view the political state of the world.§r\n\n" +
    "§bEverything is self-reported and optional.§r\n" +
    "§7The add-on does not automatically detect ownership, shops, borders, or political agreements. Players decide what to record and can ignore any system they do not want to use.§r\n\n" +
    "§aActive Shop§r\n" +
    "§fAn Active Shop is a proper structure or dedicated trading space that houses a villager you can reliably return to and trade with.§r\n" +
    "§7A loose, wandering, temporary, or normally roaming villager does not count as an Active Shop. Shop counts are entered manually by the player.§r\n\n" +
    "§6Realm Power§r\n" +
    "§fRealm Power is the total number of Active Shops across all registered settlements.§r\n" +
    "§7It is descriptive only and provides no gameplay bonuses.§r\n\n" +
    "§dSettlement Tiers§r\n" +
    "§f0–1  Outpost\n" +
    "2–3  Hamlet\n" +
    "4–6  Village\n" +
    "7–10  Town\n" +
    "11+  City§r\n\n" +
    "§eNobility Rank§r\n" +
    "§fYour nobility rank is assigned automatically from Realm Power.§r\n" +
    "§70–3 Unlanded  •  4–8 Commoner  •  9–15 Noble\n" +
    "16–24 Lord  •  25–35 Baron  •  36–49 Count\n" +
    "50–69 Duke  •  70–94 King  •  95+ Emperor§r\n\n" +
    "§5Vassalage§r\n" +
    "§fA realm can remain Independent or be listed as Vassal of another player.§r\n\n" +
    "§aNamed Shops§r\n" +
    "§fNamed shop entries are optional descriptions only.§r\n" +
    "§7They do not change Active Shops, settlement tier, or Realm Power.§r";

  const form = new ActionFormData()
    .title("§9Diplomacy Information§r")
    .body(body)
    .button("Back");

  const res = await form.show(player);
  if (res.canceled || res.selection === undefined) return;
  return openDashboard(player);
}


const lastSigilOpenTick = new Map();

function tryOpenFromSigil(player, itemStack) {
  if (!player || !itemStack || itemStack.typeId !== "diplomacy:realm_sigil") return;

  const now = system.currentTick;
  const last = lastSigilOpenTick.get(player.name) ?? -100;
  if (now - last < 4) return;
  lastSigilOpenTick.set(player.name, now);

  system.run(() => {
    openDashboard(player).catch((e) => {
      player.sendMessage(`§c[Diplomacy] Could not open the Diplomacy menu: ${String(e)}`);
    });
  });
}

// Using the sigil in the air.
world.afterEvents.itemUse.subscribe((event) => {
  tryOpenFromSigil(event.source, event.itemStack);
});

// Also handle using the sigil while targeting a block, so interaction is reliable
// regardless of whether Bedrock routes that click through the general item-use event.
world.afterEvents.playerInteractWithBlock.subscribe((event) => {
  if (!event.isFirstEvent) return;
  tryOpenFromSigil(event.player, event.beforeItemStack ?? event.itemStack);
});

// Same fallback for right-click/interact on an entity.
world.afterEvents.playerInteractWithEntity.subscribe((event) => {
  tryOpenFromSigil(event.player, event.beforeItemStack ?? event.itemStack);
});
}
