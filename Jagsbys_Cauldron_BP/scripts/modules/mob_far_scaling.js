import { world, system, CommandPermissionLevel, CustomCommandParamType, CustomCommandStatus, Player, ItemStack } from "@minecraft/server";
import { isCauldronModuleActive } from "../module_controller.js";

//Created by IsraOrbit//
// ==================== CONFIGURACIÓN DE IDIOMA ====================
const DEFAULT_LANGUAGE = "en";

const texts = {
    en: {
        configTitle: "=== MobFarScaling Config ===",
        system: "System",
        enabled: "Enabled",
        disabled: "Disabled",
        distanceStep: "Distance per Level (blocks)",
        heightBase: "Height Base (Y level start)",
        heightStep: "Height per Level (blocks down)",
        healthBoostPerLevel: "Health Boost per Level",
        strengthPerLevel: "Strength per Level",
        speedPerLevel: "Speed per Level",
        xpOrbsPerLevel: "XP Orbs per Level",
        maxHealthBoost: "Max Health Boost Level",
        maxStrength: "Max Strength Level",
        maxSpeed: "Max Speed Level",
        maxResistance: "§cMax Boss Resistance %",
        enderDragonResistance: "§dEnder Dragon Resistance %",
        commandsHelp: "=== MobFarScaling Commands ===",
        configReset: "Configuration reset to default",
        systemEnabled: "System enabled",
        systemDisabled: "System disabled",
        valueSet: "value set to",
        languageSet: "Language set to Spanish",
        languageSetEn: "Language set to English",
        languageChange: "Change language",
        invalidCommand: "Invalid command",
        monster: "Monster",
        animal: "Animal",
        creature: "Creature",
        boss: "Boss",
        currentConfig: "Current Configuration",
        helpMessage: "§6[MobFarScaling] §aAddon loaded! Mobs get stronger the farther you go! Use §e/mobfarscaling:help §ato see commands. §dCreated by IsraOrbit",
        enabledTypes: "Enabled Types",
        monsterEnabled: "Monster scaling enabled",
        animalEnabled: "Animal scaling enabled",
        creatureEnabled: "Creature scaling enabled",
        bossEnabled: "Boss scaling enabled",
        monsterDisabled: "Monster scaling disabled",
        animalDisabled: "Animal scaling disabled",
        creatureDisabled: "Creature scaling disabled",
        bossDisabled: "Boss scaling disabled",
        usage: "Usage",
        valueBetween: "Value must be between",
        and: "and",
        error: "Error",
        monsterExamples: "§7Examples: Zombie, Skeleton, Creeper, Spider, Enderman, Witch, Pillager, Vindicator, Ravager",
        animalExamples: "§7Optional passive scaling (off by default): Cow, Pig, Sheep, Chicken, Rabbit",
        creatureExamples: "§7Combat mobs: Golems, Wolves, Polar Bears, Bees, Llamas, Pandas, Dolphins, Pufferfish, Axolotls, Piglins, Endermen",
        bossExamples: "§7Examples: Wither, Warden (Ender Dragon has special config)",
        levelInfo: "§7Current mob scaling level in this area: §e",
        adminOnly: "§c(Admin only)",
        progressiveInfo: "§7Note: Higher levels require more mob levels to increase the effect",
        xpScaleInfo: "§7XP scales progressively: +1 orb every 2 levels (monsters) / faster for bosses",
        oreDropInfo: "§7Ore drop chance scales progressively: +1% base per level (monsters) / +2% for bosses, max 50% monsters, 100% bosses",
        resistanceInfo: "§7Boss resistance scales progressively: +5% base per level, max 85% damage reduction",
        enderDragonInfo: "§7Ender Dragon has fixed resistance: §e%s%% §7(+%s XP orbs on death)",
        effectLevels: "§7Effect levels in this area:",
        healthBoost: "Health Boost",
        strength: "Strength",
        speed: "Speed",
        resistance: "Resistance",
        bonusXP: "Bonus XP orbs",
        mobDeathLog: "§e[MobFarScaling] §7%s §e(Level %s) §7was killed. Effects: Health Boost %s, Strength %s, Speed %s. Bonus XP: %s orbs",
        bossResistanceLog: "§e[MobFarScaling] §7%s §e(Level %s) §7has §a%s%% damage resistance",
        bossDamageLog: "§e[MobFarScaling] §7%s §e(Level %s) §7received §c%.1f damage §7(original: §c%.1f§7, reduced by §a%.1f%%§7, absorbed: §c%.1f§7)",
        enderDragonDeathLog: "§e[MobFarScaling] §7Ender Dragon §e(Level %s) §7was killed. Resistance: §a%s%% §7Bonus XP: §e%s orbs",
        enderDragonDamageLog: "§e[MobFarScaling] §7Ender Dragon §7received §c%.1f damage §7(original: §c%.1f§7, reduced by §a%s%%§7, absorbed: §c%.1f§7)",
        blacklist: "Blacklist",
        blacklistAdd: "Added to blacklist",
        blacklistRemove: "Removed from blacklist",
        blacklistList: "Blacklist",
        blacklistCleared: "Blacklist cleared",
        animalList: "Animal List",
        animalAdd: "Added to animal list",
        animalRemove: "Removed from animal list",
        animalCleared: "Custom animals cleared",
        creatureList: "Creature List",
        creatureAdd: "Added to creature list",
        creatureRemove: "Removed from creature list",
        creatureCleared: "Custom creatures cleared",
        bossList: "Boss List",
        bossAdd: "Added to boss list",
        bossRemove: "Removed from boss list",
        bossCleared: "Custom bosses cleared",
        invalidId: "Invalid mob ID. Must contain a colon ':' (e.g., minecraft:zombie)",
        monsterInfo: "§7Includes: monster/hoglin/infected families (includes illager/witch/ravager)",
        animalInfo: "§7Includes: animals (by 'animal' family type or specific ID)",
        creatureInfo: "§7Combat-capable neutral mobs and defenders; excludes villagers, traders, allays and copper golems.",
        bossInfo: "§7Includes: Wither, Warden and custom bosses (Ender Dragon has special config)",
        animalListInfo: "§7Custom animal IDs (these will be treated as animals)",
        creatureListInfo: "§7Custom creature IDs (these will be treated as creatures)",
        oreDrop: "Ore Drop",
        oreDropEnabled: "Ore drop enabled",
        oreDropDisabled: "Ore drop disabled",
        oreDropChance: "Ore drop chance",
        oreDropMax: "Max ore drop chance",
        droppedItem: "dropped"
    },
    es: {
        configTitle: "=== Configuración MobFarScaling ===",
        system: "Sistema",
        enabled: "Activado",
        disabled: "Desactivado",
        distanceStep: "Distancia por Nivel (bloques)",
        heightBase: "Altura Base (nivel Y de inicio)",
        heightStep: "Altura por Nivel (bloques hacia abajo)",
        healthBoostPerLevel: "Aumento de Salud por Nivel",
        strengthPerLevel: "Fuerza por Nivel",
        speedPerLevel: "Velocidad por Nivel",
        xpOrbsPerLevel: "Orbes de XP por Nivel",
        maxHealthBoost: "Nivel Máximo de Salud",
        maxStrength: "Nivel Máximo de Fuerza",
        maxSpeed: "Nivel Máximo de Velocidad",
        maxResistance: "§cResistencia Máxima de Jefe %",
        enderDragonResistance: "§dResistencia de la Dragona de Ender %",
        commandsHelp: "=== Comandos MobFarScaling ===",
        configReset: "Configuración restablecida a valores predeterminados",
        systemEnabled: "Sistema activado",
        systemDisabled: "Sistema desactivado",
        valueSet: "valor cambiado a",
        languageSet: "Idioma cambiado a Español",
        languageSetEn: "Idioma cambiado a Inglés",
        languageChange: "Cambiar idioma",
        invalidCommand: "Comando inválido",
        monster: "Monstruo",
        animal: "Animal",
        creature: "Criatura",
        boss: "Jefe",
        currentConfig: "Configuración Actual",
        helpMessage: "§6[MobFarScaling] §a¡Addon cargado! Los mobs son más fuertes cuanto más lejos vayas! Usa §e/mobfarscaling:help §apara ver comandos. §dCreado por IsraOrbit",
        enabledTypes: "Tipos Activados",
        monsterEnabled: "Escalado de monstruos activado",
        animalEnabled: "Escalado de animales activado",
        creatureEnabled: "Escalado de criaturas activado",
        bossEnabled: "Escalado de jefes activado",
        monsterDisabled: "Escalado de monstruos desactivado",
        animalDisabled: "Escalado de animales desactivado",
        creatureDisabled: "Escalado de criaturas desactivado",
        bossDisabled: "Escalado de jefes desactivado",
        usage: "Uso",
        valueBetween: "El valor debe estar entre",
        and: "y",
        error: "Error",
        monsterExamples: "§7Ejemplos: Zombi, Esqueleto, Creeper, Araña, Enderman, Bruja, Saqueador, Vindicador, Devastador",
        animalExamples: "§7Ejemplos: Vaca, Cerdo, Oveja, Pollo, Conejo",
        creatureExamples: "§7Ejemplos: Golem de Hierro, Golem de Nieve, Aliado, Comerciante Nómada (detectado por familia)",
        bossExamples: "§7Ejemplos: Wither, Custodio (Dragona de Ender tiene config especial)",
        levelInfo: "§7Nivel de escalado de mobs en esta área: §e",
        adminOnly: "§c(Solo Admin)",
        progressiveInfo: "§7Nota: Niveles más altos requieren más niveles de mob para aumentar el efecto",
        xpScaleInfo: "§7La XP escala progresivamente: +1 orbe cada 2 niveles (monstruos) / más rápido para jefes",
        oreDropInfo: "§7La probabilidad de botín de mineral escala progresivamente: +1% base por nivel (monstruos) / +2% para jefes, max 50% monstruos, 100% jefes",
        resistanceInfo: "§7La resistencia de jefes escala progresivamente: +5% base por nivel, max 85% reducción de daño",
        enderDragonInfo: "§7La Dragona de Ender tiene resistencia fija: §e%s%% §7(+%s orbes de XP al morir)",
        effectLevels: "§7Niveles de efecto en esta área:",
        healthBoost: "Aumento de Salud",
        strength: "Fuerza",
        speed: "Velocidad",
        resistance: "Resistencia",
        bonusXP: "Orbes de XP extra",
        mobDeathLog: "§e[MobFarScaling] §7%s §e(Nivel %s) §7fue asesinado. Efectos: Aumento de Salud %s, Fuerza %s, Velocidad %s. XP extra: %s orbes",
        bossResistanceLog: "§e[MobFarScaling] §7%s §e(Nivel %s) §7tiene §a%s%% de resistencia al daño",
        bossDamageLog: "§e[MobFarScaling] §7%s §e(Nivel %s) §7recibió §c%.1f de daño §7(original: §c%.1f§7, reducido por §a%.1f%%§7, absorbido: §c%.1f§7)",
        enderDragonDeathLog: "§e[MobFarScaling] §7Dragona de Ender §e(Nivel %s) §7fue asesinada. Resistencia: §a%s%% §7XP extra: §e%s orbes",
        enderDragonDamageLog: "§e[MobFarScaling] §7Dragona de Ender §7recibió §c%.1f de daño §7(original: §c%.1f§7, reducido por §a%s%%§7, absorbido: §c%.1f§7)",
        blacklist: "Lista Negra",
        blacklistAdd: "Agregado a la lista negra",
        blacklistRemove: "Eliminado de la lista negra",
        blacklistList: "Lista Negra",
        blacklistCleared: "Lista negra limpiada",
        animalList: "Lista de Animales",
        animalAdd: "Agregado a la lista de animales",
        animalRemove: "Eliminado de la lista de animales",
        animalCleared: "Animales personalizados limpiados",
        creatureList: "Lista de Criaturas",
        creatureAdd: "Agregado a la lista de criaturas",
        creatureRemove: "Eliminado de la lista de criaturas",
        creatureCleared: "Criaturas personalizadas limpiadas",
        bossList: "Lista de Jefes",
        bossAdd: "Agregado a la lista de jefes",
        bossRemove: "Eliminado de la lista de jefes",
        bossCleared: "Jefes personalizados limpiados",
        invalidId: "ID de mob inválido. Debe contener dos puntos ':' (ejemplo: minecraft:zombie)",
        monsterInfo: "§7Incluye: familias monster/hoglin/infected (incluye illager/witch/ravager)",
        animalInfo: "§7Incluye: animales (por familia 'animal' o ID específico)",
        creatureInfo: "§7Incluye: aldeanos, comerciantes nómadas (por familia) y golems, aliados, etc.",
        bossInfo: "§7Incluye: Wither, Custodio y jefes personalizados (Dragona de Ender tiene config especial)",
        animalListInfo: "§7IDs de animales personalizados (serán tratados como animales)",
        creatureListInfo: "§7IDs de criaturas personalizados (serán tratados como criaturas)",
        oreDrop: "Botín de Mineral",
        oreDropEnabled: "Botín de mineral activado",
        oreDropDisabled: "Botín de mineral desactivado",
        oreDropChance: "Probabilidad de botín de mineral",
        oreDropMax: "Probabilidad máxima de botín de mineral",
        droppedItem: "entregó"
    }
};

// ==================== FUNCIONES DE IDIOMA ====================
function getPlayerLanguage(player) {
    try {
        const savedLanguage = world.getDynamicProperty(`mobfarscaling_lang_${player.id}`);
        return savedLanguage || DEFAULT_LANGUAGE;
    } catch (error) {
        return DEFAULT_LANGUAGE;
    }
}

function setPlayerLanguage(player, lang) {
    try {
        world.setDynamicProperty(`mobfarscaling_lang_${player.id}`, lang);
    } catch (error) { }
}

function t(player, key, ...args) {
    const lang = getPlayerLanguage(player);
    let message = texts[lang][key] || texts.en[key];
    for (let i = 0; i < args.length; i++) {
        message = message.replace("%s", args[i]);
    }
    return message;
}

// ==================== CONFIGURACIÓN GLOBAL (ACTUALIZADA) ====================
let config = {
    enabled: true,
    distanceStep: 400,                 // Jagsby's Cauldron default
    yBaseHeight: 64,                    // Cambiado: 50 → 64
    yStep: 16,                          // Cambiado: 12 → 16
    healthBoostPerLevel: 1,
    strengthPerLevel: 1,
    speedPerLevel: 1,
    xpOrbsPerLevel: 1,
    monsterEnabled: true,
    animalEnabled: false,
    creatureEnabled: true,
    bossEnabled: true,
    maxHealthBoost: 251,
    maxStrength: 5,                     // Cambiado: 6 → 5
    maxSpeed: 3,                        // Cambiado: 4 → 3
    maxResistance: 75,                  // Cambiado: 85 → 75
    oreDropEnabled: true,
    maxOreChance: 50,
    maxBossOreChance: 100,
    enderDragonResistance: 75           // Cambiado: 65 → 75
};

// Almacenar el nivel de cada mob escalado (para usarlo en el evento de muerte)
const mobLevelMap = new Map();
// Almacenar la resistencia de cada boss
const bossResistanceMap = new Map();

// ==================== TAG INTERNO ====================
const SCALED_TAG = "mobfarscaling_scaled";
const BOSS_SCALED_TAG = "mobfarscaling_boss_scaled";
const ENDER_DRAGON_TAG = "mobfarscaling_ender_dragon";

// ==================== LISTA DE BOSSES POR ID (VANILLA + ADDON + CUSTOM) ====================
// NOTA: El Ender Dragon ha sido removido de esta lista para tener configuración especial
const VANILLA_BOSS_IDS = [
    "minecraft:wither",
    "minecraft:warden"
];

const ADDON_BOSS_IDS = [
    "warden_evo:constellation", "warden_evo:gemless_constellation", "warden_evo:harasser",
    "warden_evo:gemless_harasser", "warden_evo:batface", "warden_evo:faceless",
    "warden_evo:hollowed", "warden_evo:injured", "warden_evo:leaky",
    "warden_evo:trypophobia_warden", "warden_evo:lurker", "warden_evo:gemless_lurker",
    "warden_evo:prowler", "warden_evo:prowler_transform", "warden_evo:gemless_prowler",
    "warden_evo:gemless_powler_transform", "warden_evo:sculk_block_corrupted",
    "warden_evo:sculk_block_monster", "warden_evo:skeleton_warden", "warden_evo:stalker",
    "warden_evo:stalker_transform", "warden_evo:gemless_stalker", "warden_evo:gemless_stalker_transform",
    "old_nether:nether_king_shape1", "old_nether:nether_king_shape2",
    "fusioned_mobs:creether", "fusioned_mobs:ender_wither", "fusioned_mobs:golevager",
    "fusioned_mobs:warthen", "fusioned_mobs:wigon", "fusioned_mobs:wither_golem",
    "fusioned_mobs:withaze",
    "dungeons:drowned_necromancer", "dungeons:illusioner", "dungeons:redstone_golem",
    "dungeons:wildfire", "dungeons:endersent", "dungeons:redstone_monstrosity", "dungeons:nameless_one",
    "dungeons:mooshroom_monstrosity", "dungeons:wretched_wraith", "dungeons:corrupted_cauldron",
    "dungeons:jungle_abomination", "dungeons:tempest_golem", "dungeons:ancient_guardian",
    "dungeons:boss_wildfire", "dungeons:spiked_eye", "dungeons:savage_eye",
    "dungeons:binding_eye", "dungeons:blight_eye", "dungeons:ravenous_eye",
    "dungeons:reaping_eye", "dungeons:vengeful_heart_of_ender",
    "dk:gargoyle", "dk:plague", "dk:sentinel", "dk:unbound_elemental",
    "mnra_cata:verdant_sentinel", "mnra_cata:soul_terror", "mnra_cata:solar_tesla", "mnra_cata:gneiss_golem",
    "mnra_cata:eternal_seal", "mnra_cata:astro_jelly",
    "mutant:mutant_creeper", "mutant:mutant_enderman", "mutant:mutant_evoker", "mutant:mutated_evoker_fangs",
    "mutant:mutant_pillager", "mutant:mutant_vindicator", "mutant:mutant_vex", "mutant:mutant_iron_golem",
    "mutant:mutant_piglin", "mutant:mutant_piglin_brute", "mutant:mutant_zombified_piglin", "mutant:mutant_wither_skeleton",
    "mutant:mutant_bogged", "mutant:mutant_skeleton", "mutant:mutant_stray", "mutant:mutant_zombie_villager",
    "mutant:mutant_villager", "mutant:mutant_wolf", "mutant:mutant_skeleton_wolf", "mutant:mutant_husk",
    "mutant:mutant_spider_pig", "mutant:mutant_axolotl", "mutant:mutant_endolotl", "mutant:mutant_ocelot",
    "mutant:mutant_snow_golem", "js7_mutant:zombie_giant",
    "ew:violinist", "ew:werewolf_alpha", "ew:churchman", "ew:gravedigger", "ew:rat_king", "ew:pumpking",
    "minere:inferno", "minere:glacier",
    "old_villagers_plus:magician_supreme",
    "mob:redstone_golem",
    "mob:endersent",
    "boss:primordial_wyrm",
    "boss:sculk_boss",
    "boss:floral_amalgam",
    "boss:astrageldon",
    "boss:pyrogen",
    "boss:void_pope",
    "boss:irradiated_ghast",
    "mob:drenched_squid",
    "mob:juvenile_void_wyrm",
    "mob:astral_golem",
    "mob:solaronemone",
    "mob:ringelite",
    "mob:hovering_inferno",
    "mob:ghast_balloon"
];

let customBossIds = [];

function getBossIds() {
    return [...VANILLA_BOSS_IDS, ...ADDON_BOSS_IDS, ...customBossIds];
}

function isBoss(entity) {
    try {
        const typeId = entity.typeId;
        if (typeId === "minecraft:ender_dragon") return false;
        const bossIds = getBossIds();
        return bossIds.includes(typeId);
    } catch (e) {
        return false;
    }
}

function isEnderDragon(entity) {
    try {
        return entity.typeId === "minecraft:ender_dragon";
    } catch (e) {
        return false;
    }
}

// ==================== LISTA DE ANIMALES ====================
const VANILLA_ANIMAL_IDS = [
    "minecraft:pig", "minecraft:sheep", "minecraft:cow", "minecraft:chicken",
    "minecraft:rabbit", "minecraft:fox", "minecraft:bee", "minecraft:goat",
    "minecraft:llama", "minecraft:trader_llama", "minecraft:panda", "minecraft:polar_bear",
    "minecraft:wolf", "minecraft:cat", "minecraft:ocelot", "minecraft:donkey",
    "minecraft:mule", "minecraft:skeleton_horse", "minecraft:zombie_horse",
    "minecraft:horse", "minecraft:strider", "minecraft:turtle", "minecraft:frog",
    "minecraft:axolotl", "minecraft:glow_squid", "minecraft:squid", "minecraft:cod",
    "minecraft:salmon", "minecraft:tropicalfish", "minecraft:pufferfish", "minecraft:dolphin",
    "minecraft:mooshroom", "minecraft:parrot", "minecraft:tadpole",
    "minecraft:camel", "minecraft:sniffer", "minecraft:armadillo",
    "minecraft:nautilus", "minecraft:camel_husk", "minecraft:happy_ghast"
];

const ADDON_ANIMAL_IDS = [
    "alpha_livestock:alpha_cow", "alpha_livestock:alpha_pig", "alpha_livestock:alpha_sheep",
    "alpha_livestock:beta_sheep", "alpha_livestock:beta_squid", "alpha_livestock:cow_horse",
    "alpha_livestock:diamond_chicken", "alpha_livestock:killer_bunny", "alpha_livestock:rainbow_sheep",
    "alpha_livestock:pig_horse",
    "dk:duck", "dk:flagon_mysthic",
    "minere:bird", "minere:black_bear", "minere:deer", "minere:eagle", "minere:elephant",
    "minere:grizzly_bear", "minere:monkey", "minere:moose", "minere:owl", "minere:queen_bee",
    "minere:squirrel", "minere:firefly", "minere:butterfly",
    "fusioned_mobs:crolf", "fusioned_mobs:ender_wolf", "fusioned_mobs:pow", "fusioned_mobs:spider_pig",
    "old_nether:hog", "old_nether:magma_cow", "old_nether:anomalous_mooshroom",
    "old_nether:crimson_mooshroom", "old_nether:nether_wart_mooshroom", "old_nether:soul_mooshroom",
    "old_nether:warped_mooshroom", "old_nether:withered_mooshroom", "old_nether:creepeg",
    "old_nether:creepepig", "old_nether:creepig", "old_nether:piglet"
];

let customAnimalIds = [];

function getAnimalTypes() {
    return [...VANILLA_ANIMAL_IDS, ...ADDON_ANIMAL_IDS, ...customAnimalIds];
}

function getAnimalTypesGrouped() {
    const grouped = new Map();
    const allAnimals = getAnimalTypes();

    for (const id of allAnimals) {
        const prefix = id.split(":")[0];
        if (!grouped.has(prefix)) {
            grouped.set(prefix, []);
        }
        grouped.get(prefix).push(id);
    }

    for (const [prefix, ids] of grouped) {
        ids.sort();
    }

    return grouped;
}

// ==================== LISTA DE CRIATURAS ====================
const VANILLA_CREATURE_IDS = [
    "minecraft:iron_golem", "minecraft:snow_golem",
    "minecraft:wolf", "minecraft:polar_bear", "minecraft:bee",
    "minecraft:enderman", "minecraft:piglin", "minecraft:zombie_pigman",
    "minecraft:llama", "minecraft:trader_llama", "minecraft:panda",
    "minecraft:dolphin", "minecraft:pufferfish", "minecraft:axolotl"
];

const ADDON_CREATURE_IDS = [
    "nether_biomes_expansion:flesh_golem", "nether_biomes_expansion:flesh_golem_by_player",
    "old_nether:hoglin_beast", "old_nether:soul_iron_golem", "old_nether:soul_iron_golem_by_player",
    "old_nether:soul_snow_golem", "old_nether:soul_snow_golem_by_player",
    "dungeons:baby_ghast",
    "dk:mercenary", "dk:outcast",
    "ew:worker",
    "old_villagers_plus:furnace_golem", "old_villagers_plus:furnace_golem_by_player",
    "old_villagers_plus:love_golem", "old_villagers_plus:villager_golem",
    "fusioned_mobs:golevager_tamed"
];

let customCreatureIds = [];

function getCreatureTypes() {
    return [...VANILLA_CREATURE_IDS, ...ADDON_CREATURE_IDS, ...customCreatureIds];
}

function getCreatureTypesGrouped() {
    const grouped = new Map();
    const allCreatures = getCreatureTypes();

    for (const id of allCreatures) {
        const prefix = id.split(":")[0];
        if (!grouped.has(prefix)) {
            grouped.set(prefix, []);
        }
        grouped.get(prefix).push(id);
    }

    for (const [prefix, ids] of grouped) {
        ids.sort();
    }

    return grouped;
}

// ==================== CONFIGURACIÓN DE MINERALES ====================
const ORE_WEIGHTS = {
    "coal": 35,
    "copper_ingot": 20,
    "iron_ingot": 12,
    "lapis_lazuli": 8,
    "gold_ingot": 6,
    "redstone": 5,
    "emerald": 3,
    "diamond": 1
};

// Mapeo de nombres para mostrar
const ORE_NAMES = {
    "coal": "Carbón",
    "copper_ingot": "Cobre",
    "iron_ingot": "Hierro",
    "lapis_lazuli": "Lapis Lazuli",
    "gold_ingot": "Oro",
    "redstone": "Redstone",
    "emerald": "Esmeralda",
    "diamond": "Diamante"
};

// ==================== LISTAS DINÁMICAS ====================
// BLACKLIST POR DEFECTO - Vacía
const DEFAULT_BLACKLIST = [];

let blacklistedMobs = [];

// ==================== FUNCIÓN PROGRESIVA PARA RESISTENCIA DE BOSSES ====================
function getBossResistance(mobLevel) {
    if (mobLevel <= 0) return 0;
    const maxResistance = config.maxResistance;

    if (mobLevel <= 15) {
        return Math.min(mobLevel * 5, maxResistance);
    }

    let cumulativeLevels = 15;
    let currentResistance = 75;
    let step = 3;

    for (let level = 16; level <= mobLevel; level++) {
        if (currentResistance >= 70) {
            step = 5;
        } else if (currentResistance >= 60) {
            step = 4;
        } else {
            step = 3;
        }

        cumulativeLevels++;
        if (cumulativeLevels >= step) {
            cumulativeLevels = 0;
            currentResistance = Math.min(currentResistance + 1, maxResistance);
        }
    }

    return currentResistance;
}

// ==================== FUNCIÓN PROGRESIVA PARA ORE DROP ====================
function getOreDropChance(mobLevel, isBoss) {
    if (mobLevel <= 0) return 0;

    const maxChance = isBoss ? config.maxBossOreChance : config.maxOreChance;

    // Para jefes: base 2% por nivel (el doble)
    if (isBoss) {
        if (mobLevel <= 10) {
            return Math.min(mobLevel * 2, maxChance);
        }

        let cumulativeLevels = 10;
        let currentChance = 20;
        let step = 3;

        for (let level = 11; level <= mobLevel; level++) {
            if (currentChance >= 80) {
                step = 8;
            } else if (currentChance >= 60) {
                step = 6;
            } else if (currentChance >= 40) {
                step = 5;
            } else if (currentChance >= 20) {
                step = 4;
            } else {
                step = 3;
            }

            cumulativeLevels++;
            if (cumulativeLevels >= step) {
                cumulativeLevels = 0;
                currentChance += 2;
            }
        }

        return Math.min(currentChance, maxChance);
    }

    if (mobLevel <= 10) {
        return Math.min(mobLevel, maxChance);
    }

    let cumulativeLevels = 10;
    let currentChance = 10;
    let step = 4;

    for (let level = 11; level <= mobLevel; level++) {
        if (currentChance >= 40) {
            step = 7;
        } else if (currentChance >= 30) {
            step = 6;
        } else if (currentChance >= 20) {
            step = 5;
        } else {
            step = 4;
        }

        cumulativeLevels++;
        if (cumulativeLevels >= step) {
            cumulativeLevels = 0;
            currentChance++;
        }
    }

    return Math.min(currentChance, maxChance);
}

function getRandomOreType() {
    const totalWeight = Object.values(ORE_WEIGHTS).reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (const [ore, weight] of Object.entries(ORE_WEIGHTS)) {
        if (random < weight) {
            return ore;
        }
        random -= weight;
    }
    return "coal";
}

function getRandomOreCount(isBoss) {
    if (isBoss) {
        return Math.floor(Math.random() * 4) + 3;
    }
    return Math.floor(Math.random() * 4) + 1;
}

// ==================== FUNCIONES PARA GUARDAR CONFIG GLOBAL ====================
function saveGlobalConfig() {
    try {
        const globalConfig = {
            scalingPolicyVersion: 1,
            enabled: config.enabled,
            distanceStep: config.distanceStep,
            yBaseHeight: config.yBaseHeight,
            yStep: config.yStep,
            healthBoostPerLevel: config.healthBoostPerLevel,
            strengthPerLevel: config.strengthPerLevel,
            speedPerLevel: config.speedPerLevel,
            xpOrbsPerLevel: config.xpOrbsPerLevel,
            monsterEnabled: config.monsterEnabled,
            animalEnabled: config.animalEnabled,
            creatureEnabled: config.creatureEnabled,
            bossEnabled: config.bossEnabled,
            maxHealthBoost: config.maxHealthBoost,
            maxStrength: config.maxStrength,
            maxSpeed: config.maxSpeed,
            maxResistance: config.maxResistance,
            oreDropEnabled: config.oreDropEnabled,
            maxOreChance: config.maxOreChance,
            maxBossOreChance: config.maxBossOreChance,
            enderDragonResistance: config.enderDragonResistance
        };
        world.setDynamicProperty("mobfarscaling_global_config", JSON.stringify(globalConfig));
        console.log(`[MobFarScaling] Global config saved`);
    } catch (error) {
        console.warn(`[MobFarScaling] Error saving global config: ${error.message}`);
    }
}

function loadGlobalConfig() {
    try {
        const savedConfig = world.getDynamicProperty("mobfarscaling_global_config");
        if (savedConfig && typeof savedConfig === "string") {
            const loadedConfig = JSON.parse(savedConfig);
            config.enabled = loadedConfig.enabled !== undefined ? loadedConfig.enabled : true;
            config.distanceStep = loadedConfig.distanceStep !== undefined ? loadedConfig.distanceStep : 400;
            config.yBaseHeight = loadedConfig.yBaseHeight !== undefined ? loadedConfig.yBaseHeight : 64;
            config.yStep = loadedConfig.yStep !== undefined ? loadedConfig.yStep : 16;
            config.healthBoostPerLevel = loadedConfig.healthBoostPerLevel !== undefined ? loadedConfig.healthBoostPerLevel : 1;
            config.strengthPerLevel = loadedConfig.strengthPerLevel !== undefined ? loadedConfig.strengthPerLevel : 1;
            config.speedPerLevel = loadedConfig.speedPerLevel !== undefined ? loadedConfig.speedPerLevel : 1;
            config.xpOrbsPerLevel = loadedConfig.xpOrbsPerLevel !== undefined ? loadedConfig.xpOrbsPerLevel : 1;
            config.monsterEnabled = loadedConfig.monsterEnabled !== undefined ? loadedConfig.monsterEnabled : true;
            config.animalEnabled = loadedConfig.scalingPolicyVersion === 1 && loadedConfig.animalEnabled === true;
            config.creatureEnabled = loadedConfig.creatureEnabled !== undefined ? loadedConfig.creatureEnabled : true;
            config.bossEnabled = loadedConfig.bossEnabled !== undefined ? loadedConfig.bossEnabled : true;
            config.maxHealthBoost = loadedConfig.maxHealthBoost !== undefined ? loadedConfig.maxHealthBoost : 251;
            config.maxStrength = loadedConfig.maxStrength !== undefined ? loadedConfig.maxStrength : 5;
            config.maxSpeed = loadedConfig.maxSpeed !== undefined ? loadedConfig.maxSpeed : 3;
            config.maxResistance = loadedConfig.maxResistance !== undefined ? loadedConfig.maxResistance : 75;
            config.oreDropEnabled = loadedConfig.oreDropEnabled !== undefined ? loadedConfig.oreDropEnabled : true;
            config.maxOreChance = loadedConfig.maxOreChance !== undefined ? loadedConfig.maxOreChance : 50;
            config.maxBossOreChance = loadedConfig.maxBossOreChance !== undefined ? loadedConfig.maxBossOreChance : 100;
            config.enderDragonResistance = loadedConfig.enderDragonResistance !== undefined ? loadedConfig.enderDragonResistance : 75;
            // One-time migration: old worlds opted every animal into scaling.
            // Preserve other settings and any later explicit animal opt-in.
            if (loadedConfig.scalingPolicyVersion !== 1) saveGlobalConfig();
            console.log(`[MobFarScaling] Global config loaded`);
        } else {
            console.log(`[MobFarScaling] No saved global config found, using defaults`);
        }
    } catch (error) {
        console.warn(`[MobFarScaling] Error loading global config: ${error.message}`);
    }
}

function loadSavedLists() {
    try {
        const savedBlacklist = world.getDynamicProperty("mobfarscaling_blacklist");
        if (savedBlacklist && typeof savedBlacklist === "string") {
            blacklistedMobs = JSON.parse(savedBlacklist);
            console.log(`[MobFarScaling] Blacklist loaded: ${blacklistedMobs.length} mobs`);
        } else {
            blacklistedMobs = [...DEFAULT_BLACKLIST];
            saveBlacklist();
            console.log(`[MobFarScaling] Default blacklist applied: ${blacklistedMobs.length} mobs`);
        }

        const savedAnimalList = world.getDynamicProperty("mobfarscaling_animallist");
        if (savedAnimalList && typeof savedAnimalList === "string") {
            customAnimalIds = JSON.parse(savedAnimalList);
            console.log(`[MobFarScaling] Custom animals loaded: ${customAnimalIds.length} animals`);
        }

        const savedCreatureList = world.getDynamicProperty("mobfarscaling_creaturelist");
        if (savedCreatureList && typeof savedCreatureList === "string") {
            customCreatureIds = JSON.parse(savedCreatureList);
            console.log(`[MobFarScaling] Custom creatures loaded: ${customCreatureIds.length} creatures`);
        }

        const savedBossList = world.getDynamicProperty("mobfarscaling_bosslist");
        if (savedBossList && typeof savedBossList === "string") {
            customBossIds = JSON.parse(savedBossList);
            console.log(`[MobFarScaling] Custom bosses loaded: ${customBossIds.length} bosses`);
        }
    } catch (e) {
        console.warn(`[MobFarScaling] Error loading saved lists: ${e.message}`);
        blacklistedMobs = [...DEFAULT_BLACKLIST];
    }
}

function saveBlacklist() {
    try {
        world.setDynamicProperty("mobfarscaling_blacklist", JSON.stringify(blacklistedMobs));
        console.log(`[MobFarScaling] Blacklist saved: ${blacklistedMobs.length} mobs`);
    } catch (e) {
        console.warn(`[MobFarScaling] Error saving blacklist: ${e.message}`);
    }
}

function saveAnimalList() {
    try {
        world.setDynamicProperty("mobfarscaling_animallist", JSON.stringify(customAnimalIds));
        console.log(`[MobFarScaling] Animal list saved: ${customAnimalIds.length} animals`);
    } catch (e) {
        console.warn(`[MobFarScaling] Error saving animal list: ${e.message}`);
    }
}

function saveCreatureList() {
    try {
        world.setDynamicProperty("mobfarscaling_creaturelist", JSON.stringify(customCreatureIds));
        console.log(`[MobFarScaling] Creature list saved: ${customCreatureIds.length} creatures`);
    } catch (e) {
        console.warn(`[MobFarScaling] Error saving creature list: ${e.message}`);
    }
}

function saveBossList() {
    try {
        world.setDynamicProperty("mobfarscaling_bosslist", JSON.stringify(customBossIds));
        console.log(`[MobFarScaling] Custom bosses saved: ${customBossIds.length} bosses`);
    } catch (e) {
        console.warn(`[MobFarScaling] Error saving boss list: ${e.message}`);
    }
}

// ==================== DEFINICIÓN DE MOBS POR TIPO ====================
const monsterFamilies = ["monster", "hoglin", "infected"];
const animalFamilies = ["animal"];

// ==================== FUNCIONES DE VERIFICACIÓN ====================
function isBlacklisted(entity) {
    try {
        const typeId = entity.typeId;
        return blacklistedMobs.includes(typeId);
    } catch (e) {
        return false;
    }
}

function isMonster(entity) {
    if (isBlacklisted(entity)) return false;
    if (isBoss(entity)) return false;
    if (isEnderDragon(entity)) return false;
    if (!config.monsterEnabled) return false;

    try {
        const families = entity.getComponent("minecraft:type_family");
        if (families) {
            const familyTypes = families.getTypeFamilies();

            let hasTargetFamily = false;
            for (const targetFamily of monsterFamilies) {
                if (familyTypes.includes(targetFamily)) {
                    hasTargetFamily = true;
                    break;
                }
            }

            if (!hasTargetFamily) return false;

            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
}

function isAnimal(entity) {
    if (isBlacklisted(entity)) return false;
    if (isBoss(entity)) return false;
    if (isEnderDragon(entity)) return false;
    if (!config.animalEnabled) return false;

    try {
        const families = entity.getComponent("minecraft:type_family");
        if (families) {
            const familyTypes = families.getTypeFamilies();
            for (const animalFamily of animalFamilies) {
                if (familyTypes.includes(animalFamily)) {
                    return true;
                }
            }
        }

        const typeId = entity.typeId;
        return getAnimalTypes().includes(typeId);
    } catch (e) {
        return false;
    }
}

function isCreature(entity) {
    if (isBlacklisted(entity)) return false;
    if (isBoss(entity)) return false;
    if (isEnderDragon(entity)) return false;
    if (!config.creatureEnabled) return false;

    try {
        // Combat-capable neutral mobs and defenders use an explicit list.
        // Villager/trader families also contain passive mobs and are not eligible.
        const typeId = entity.typeId;
        return getCreatureTypes().includes(typeId);
    } catch (e) {
        return false;
    }
}

function shouldScale(entity) {
    if (isBlacklisted(entity)) return false;
    if (isBoss(entity)) return false;
    if (isEnderDragon(entity)) return false;
    return isMonster(entity) || isAnimal(entity) || isCreature(entity);
}

// ==================== FUNCIÓN PARA VERIFICAR UNDEAD ====================
function isUndead(entity) {
    try {
        const familyComponent = entity.getComponent('minecraft:type_family');
        if (familyComponent && familyComponent.hasTypeFamily('undead')) {
            return true;
        }
    } catch { }
    return false;
}

// ==================== FUNCIÓN PROGRESIVA PARA CALCULAR EL AMPLIFIER ====================
function getHealthAmplifier(mobLevel, basePerLevel) {
    if (mobLevel <= 0) return -1;
    const maxBoost = config.maxHealthBoost;

    if (mobLevel <= 10) {
        let amplifier = (mobLevel * basePerLevel) - 1;
        return Math.min(amplifier, maxBoost);
    }

    let cumulativeLevels = 10;
    let currentAmplifier = 10;
    let step = 2;

    for (let level = 11; level <= mobLevel; level++) {
        if (currentAmplifier >= 40) {
            step = 6;
        } else if (currentAmplifier >= 30) {
            step = 5;
        } else if (currentAmplifier >= 20) {
            step = 4;
        } else if (currentAmplifier >= 10) {
            step = 3;
        } else {
            step = 2;
        }

        cumulativeLevels++;
        if (cumulativeLevels >= step) {
            cumulativeLevels = 0;
            currentAmplifier++;
        }
    }

    let amplifier = (currentAmplifier * basePerLevel) - 1;
    return Math.min(amplifier, maxBoost);
}

function getStrengthAmplifier(level, basePerLevel) {
    if (level <= 0) return -1;
    const maxStrength = config.maxStrength;

    let cumulativeLevels = 0;
    let currentAmplifier = 0;
    let step = 6;

    for (let mobLevel = 1; mobLevel <= level; mobLevel++) {
        if (currentAmplifier >= 4) {
            step = 24;
        } else if (currentAmplifier >= 3) {
            step = 18;
        } else if (currentAmplifier >= 2) {
            step = 13;
        } else if (currentAmplifier >= 1) {
            step = 9;
        } else {
            step = 6;
        }

        cumulativeLevels++;
        if (cumulativeLevels >= step) {
            cumulativeLevels = 0;
            currentAmplifier++;
        }
    }

    let amplifier = (currentAmplifier * basePerLevel) - 1;
    return Math.min(amplifier, maxStrength);
}

function getSpeedAmplifier(level, basePerLevel) {
    if (level <= 0) return -1;
    const maxSpeed = config.maxSpeed;

    let cumulativeLevels = 0;
    let currentAmplifier = 0;
    let step = 12;

    for (let mobLevel = 1; mobLevel <= level; mobLevel++) {
        if (currentAmplifier >= 2) {
            step = 21;
        } else if (currentAmplifier >= 1) {
            step = 18;
        } else {
            step = 12;
        }

        cumulativeLevels++;
        if (cumulativeLevels >= step) {
            cumulativeLevels = 0;
            currentAmplifier++;
        }
    }

    let amplifier = (currentAmplifier * basePerLevel) - 1;
    return Math.min(amplifier, maxSpeed);
}

// ==================== FUNCIÓN PROGRESIVA PARA XP (MÁS LENTA - 1 ORBE CADA 2 NIVELES) ====================
function getBonusXP(mobLevel) {
    if (mobLevel <= 0) return 0;

    if (mobLevel <= 10) {
        return Math.floor(mobLevel / 2);
    }

    if (mobLevel <= 20) {
        return 5 + Math.floor((mobLevel - 10) / 3);
    }

    if (mobLevel <= 30) {
        return 8 + Math.floor((mobLevel - 20) / 4);
    }

    if (mobLevel <= 40) {
        return 10 + Math.floor((mobLevel - 30) / 5);
    }

    if (mobLevel <= 50) {
        return 12 + Math.floor((mobLevel - 40) / 6);
    }

    if (mobLevel <= 70) {
        return 13 + Math.floor((mobLevel - 50) / 8);
    }

    if (mobLevel <= 100) {
        return 15 + Math.floor((mobLevel - 70) / 10);
    }

    return 18;
}

// ==================== FUNCIÓN PROGRESIVA PARA XP DE BOSSES (MÁS RÁPIDA) ====================
function getBonusXPBoss(mobLevel) {
    if (mobLevel <= 0) return 0;

    if (mobLevel <= 10) {
        return mobLevel;
    }

    let cumulativeLevels = 10;
    let currentXP = 10;
    let step = 2;

    for (let level = 11; level <= mobLevel; level++) {
        if (currentXP >= 40) {
            step = 6;
        } else if (currentXP >= 30) {
            step = 5;
        } else if (currentXP >= 20) {
            step = 4;
        } else if (currentXP >= 10) {
            step = 3;
        } else {
            step = 2;
        }

        cumulativeLevels++;
        if (cumulativeLevels >= step) {
            cumulativeLevels = 0;
            currentXP++;
        }
    }

    return currentXP;
}

// ==================== FUNCIÓN PARA CALCULAR NIVEL ====================
function calculateDistanceLevel(x, z) {
    const absX = Math.abs(x);
    const absZ = Math.abs(z);
    const maxCoord = Math.max(absX, absZ);
    const level = Math.floor(maxCoord / config.distanceStep);
    return level;
}

function calculateHeightLevel(y) {
    if (y >= config.yBaseHeight) return 0;
    const blocksBelow = config.yBaseHeight - y;
    let level = Math.floor(blocksBelow / config.yStep);
    return level;
}

function calculateMobLevel(x, y, z) {
    const distanceLevel = calculateDistanceLevel(x, z);
    const heightLevel = calculateHeightLevel(y);
    const finalLevel = Math.max(distanceLevel, heightLevel);
    return finalLevel;
}

// ==================== FUNCIÓN PARA APLICAR EFECTOS A MONSTRUOS ====================
function applyMonsterEffects(entity, level) {
    if (level <= 0) return false;

    try {
        if (entity.hasTag(SCALED_TAG)) return false;

        // Obtener el componente de salud
        const healthComponent = entity.getComponent("minecraft:health");
        if (!healthComponent) {
            console.warn(`[MobFarScaling] No health component found for ${entity.typeId}`);
            return false;
        }

        // Calcular el amplifier de health_boost
        const healthAmplifier = getHealthAmplifier(level, config.healthBoostPerLevel);

        // ============ PASO 1: APLICAR HEALTH BOOST PRIMERO ============
        // Esto aumenta la salud máxima real del mob
        if (config.healthBoostPerLevel > 0 && healthAmplifier >= 0) {
            entity.addEffect("health_boost", 999999, {
                amplifier: healthAmplifier,
                showParticles: false
            });
        }

        // ============ PASO 2: CURAR AL MOB HASTA SU NUEVA SALUD MÁXIMA ============
        // Ahora que health_boost está aplicado, la salud máxima ha aumentado
        // Obtenemos la salud máxima actual (que ya incluye el boost)
        const currentMaxHealth = healthComponent.effectiveMax;
        const currentHealth = healthComponent.currentValue;

        // Si la salud actual es menor que la nueva máxima, curar
        if (currentHealth < currentMaxHealth) {
            // Curar hasta el máximo usando el mismo método que healPlayer
            healthComponent.setCurrentValue(currentMaxHealth);
            console.log(`[MobFarScaling] ${entity.typeId} curado a máxima salud (${currentMaxHealth} HP)`);
        }

        // Aplicar Strength
        if (config.strengthPerLevel > 0) {
            const strengthAmplifier = getStrengthAmplifier(level, config.strengthPerLevel);
            if (strengthAmplifier >= 0) {
                entity.addEffect("strength", 999999, {
                    amplifier: strengthAmplifier,
                    showParticles: false
                });
            }
        }

        // Aplicar Speed
        if (config.speedPerLevel > 0) {
            const speedAmplifier = getSpeedAmplifier(level, config.speedPerLevel);
            if (speedAmplifier >= 0) {
                entity.addEffect("speed", 999999, {
                    amplifier: speedAmplifier,
                    showParticles: false
                });
            }
        }

        // Marcar como escalado
        entity.addTag(SCALED_TAG);
        mobLevelMap.set(entity.id, level);

        return true;

    } catch (error) {
        console.warn(`[MobFarScaling] Error applying effects to ${entity.typeId}: ${error.message}`);
        return false;
    }
}

// ==================== FUNCIÓN PARA APLICAR RESISTENCIA A BOSSES ====================
function applyBossResistance(entity, level) {
    if (level <= 0) return false;
    if (!config.bossEnabled) return false;

    try {
        if (entity.hasTag(BOSS_SCALED_TAG)) return false;

        const resistance = getBossResistance(level);
        bossResistanceMap.set(entity.id, resistance);

        entity.addTag(BOSS_SCALED_TAG);
        mobLevelMap.set(entity.id, level);

        const bossName = entity.typeId.split(":").pop();
        console.log(`§a[MobFarScaling] §7${bossName} §e(Level ${level}) §7has §a${resistance}% damage resistance`);

        return true;
    } catch (error) {
        return false;
    }
}

// ==================== FUNCIÓN PARA APLICAR RESISTENCIA A ENDER DRAGON ====================
function applyEnderDragonResistance(entity) {
    if (config.enderDragonResistance <= 0) return false;

    try {
        if (entity.hasTag(ENDER_DRAGON_TAG)) return false;

        entity.addTag(ENDER_DRAGON_TAG);

        const resistance = config.enderDragonResistance;
        console.log(`§a[MobFarScaling] §7Ender Dragon §7has §a${resistance}% damage resistance`);

        return true;
    } catch (error) {
        return false;
    }
}

// ==================== EVENTO PARA REDUCIR DAÑO EN BOSSES ====================
world.beforeEvents.entityHurt.subscribe((event) => {
    if (!isCauldronModuleActive("mfs")) return;
    const { hurtEntity, damage } = event;

    // Verificar si es Ender Dragon (config especial)
    if (isEnderDragon(hurtEntity)) {
        const resistance = config.enderDragonResistance;
        if (resistance <= 0) return;

        const damageReduction = resistance / 100;
        const reducedDamage = damage * (1 - damageReduction);

        event.damage = reducedDamage;

        const damageAbsorbed = damage - reducedDamage;
        console.log(`§e[MobFarScaling] §7Ender Dragon §7received §c${reducedDamage.toFixed(1)} damage §7(original: §c${damage.toFixed(1)}§7, reduced by §a${resistance}%§7, absorbed: §c${damageAbsorbed.toFixed(1)}§7)`);
        return;
    }

    // Verificar si es boss normal
    if (!hurtEntity.hasTag(BOSS_SCALED_TAG)) return;

    const resistance = bossResistanceMap.get(hurtEntity.id);
    if (resistance === undefined || resistance <= 0) return;

    const damageReduction = resistance / 100;
    const reducedDamage = damage * (1 - damageReduction);

    event.damage = reducedDamage;

    const damageAbsorbed = damage - reducedDamage;

    const bossName = hurtEntity.typeId.split(":").pop();
    const level = calculateMobLevel(hurtEntity.location.x, hurtEntity.location.y, hurtEntity.location.z);
    console.log(`§e[MobFarScaling] §7${bossName} §e(Level ${level}) §7received §c${reducedDamage.toFixed(1)} damage §7(original: §c${damage.toFixed(1)}§7, reduced by §a${resistance}%§7, absorbed: §c${damageAbsorbed.toFixed(1)}§7)`);
});

// ==================== FUNCIÓN PARA DROPEAR MINERALES ====================
function tryDropOre(entity, level, isBossEntity) {
    if (!config.oreDropEnabled) return false;
    if (level <= 0) return false;

    const dropChance = getOreDropChance(level, isBossEntity);
    const random = Math.random() * 100;

    if (random <= dropChance) {
        const oreType = getRandomOreType();
        const oreCount = getRandomOreCount(isBossEntity);
        const dimension = entity.dimension;
        const location = entity.location;

        for (let i = 0; i < oreCount; i++) {
            try {
                const offsetX = (Math.random() - 0.5) * 1.0;
                const offsetY = Math.random() * 0.5 + 0.5;
                const offsetZ = (Math.random() - 0.5) * 1.0;

                dimension.spawnItem(new ItemStack(`minecraft:${oreType}`, 1), {
                    x: location.x + offsetX,
                    y: location.y + offsetY,
                    z: location.z + offsetZ
                });
            } catch (e) {
                console.warn(`[MobFarScaling] Error spawning item ${oreType}: ${e.message}`);
            }
        }

        const oreName = ORE_NAMES[oreType] || oreType.replace("_ingot", "").replace("_", " ");
        console.log(`§a[MobFarScaling] §7${entity.typeId.split(":").pop()} §e(Level ${level}) §7dropped §6${oreCount}x ${oreName} §7(${dropChance.toFixed(1)}% chance)`);
        if (isBossEntity) {
            console.log(`§7[Boss bonus: ${oreCount} items]`);
        }
        return true;
    }
    return false;
}

// ==================== VERIFICAR MOBS CADA 20 TICKS ====================
system.runInterval(() => {
    if (!isCauldronModuleActive("mfs")) return;
    if (!config.enabled) return;

    const checkedDimensions = new Set();
    for (const player of world.getAllPlayers()) {
        const dimension = player.dimension;
        if (checkedDimensions.has(dimension.id)) continue;
        checkedDimensions.add(dimension.id);
        const allEntities = dimension.getEntities();

        for (const entity of allEntities) {
            // Buffs are one-time adjustments. Skip marked mobs before reading
            // location, calculating levels, or looking up type/family components.
            if (entity.hasTag(SCALED_TAG) || entity.hasTag(BOSS_SCALED_TAG) || entity.hasTag(ENDER_DRAGON_TAG)) continue;
            const location = entity.location;
            const level = calculateMobLevel(location.x, location.y, location.z);

            if (level <= 0) continue;

            // Verificar Ender Dragon (config especial)
            if (isEnderDragon(entity)) {
                if (!entity.hasTag(ENDER_DRAGON_TAG)) {
                    applyEnderDragonResistance(entity);
                }
                continue;
            }

            if (isBoss(entity)) {
                if (!entity.hasTag(BOSS_SCALED_TAG)) {
                    applyBossResistance(entity, level);
                }
                continue;
            }

            if (!shouldScale(entity)) continue;
            if (entity.hasTag(SCALED_TAG)) continue;

            applyMonsterEffects(entity, level);
        }
    }
}, 20);

// ==================== EVENTO DE MUERTE PARA XP Y MINERALES ====================
world.afterEvents.entityDie.subscribe(event => {
    if (!isCauldronModuleActive("mfs")) return;
    if (!config.enabled) return;

    const deadEntity = event.deadEntity;
    const damageSource = event.damageSource;

    // Verificar Ender Dragon (config especial)
    if (isEnderDragon(deadEntity)) {
        const resistance = config.enderDragonResistance;
        if (resistance > 0) {
            const xpAmount = resistance * config.xpOrbsPerLevel;
            const level = calculateMobLevel(deadEntity.location.x, deadEntity.location.y, deadEntity.location.z);
            console.log(`§e[MobFarScaling] §7Ender Dragon §e(Level ${level}) §7was killed. Resistance: §a${resistance}% §7Bonus XP: §e${xpAmount} orbs`);

            if (xpAmount > 0) {
                try {
                    const dimension = deadEntity.dimension;
                    const deadLocation = deadEntity.location;

                    for (let i = 0; i < xpAmount; i++) {
                        const offset = {
                            x: (Math.random() - 0.5) * 1.0,
                            y: Math.random() * 0.5,
                            z: (Math.random() - 0.5) * 1.0
                        };

                        dimension.spawnEntity("minecraft:xp_orb", {
                            x: deadLocation.x + offset.x,
                            y: deadLocation.y + offset.y + 0.5,
                            z: deadLocation.z + offset.z
                        });
                    }
                } catch (error) {
                    console.warn(`[MobFarScaling] Error spawning XP for Ender Dragon: ${error.message}`);
                }
            }
        }
        // Limpiar tags
        try {
            if (deadEntity.hasTag(ENDER_DRAGON_TAG)) {
                deadEntity.removeTag(ENDER_DRAGON_TAG);
            }
        } catch { }
        return;
    }

    const mobLevel = mobLevelMap.get(deadEntity.id);

    let isBossEntity = false;
    try {
        if (deadEntity.isValid()) {
            isBossEntity = deadEntity.hasTag(BOSS_SCALED_TAG);
        }
    } catch (error) {
        isBossEntity = bossResistanceMap.has(deadEntity.id);
    }

    mobLevelMap.delete(deadEntity.id);
    bossResistanceMap.delete(deadEntity.id);

    if (mobLevel === undefined) return;

    const level = mobLevel;

    if (level <= 0) return;

    let healthLevel = 0, strengthLevel = 0, speedLevel = 0;
    let resistance = 0;

    if (!isBossEntity) {
        healthLevel = getHealthAmplifier(level, config.healthBoostPerLevel) + 1;
        strengthLevel = getStrengthAmplifier(level, config.strengthPerLevel) + 1;
        speedLevel = getSpeedAmplifier(level, config.speedPerLevel) + 1;
    } else {
        resistance = getBossResistance(level);
    }

    let xpAmount;
    if (isBossEntity) {
        xpAmount = getBonusXPBoss(level) * config.xpOrbsPerLevel;
    } else {
        xpAmount = getBonusXP(level) * config.xpOrbsPerLevel;
    }

    const mobName = deadEntity.typeId.split(":").pop();
    if (isBossEntity) {
        console.log(`§e[MobFarScaling] §7${mobName} §e(Level ${level}) §7was killed. Resistance: §a${resistance}% §7Bonus XP: §e${xpAmount} orbs`);
    } else {
        console.log(`§e[MobFarScaling] §7${mobName} §e(Level ${level}) §7was killed. Effects: Health Boost ${healthLevel}, Strength ${strengthLevel}, Speed ${speedLevel}. Bonus XP: ${xpAmount} orbs`);
    }

    if (xpAmount > 0) {
        try {
            const dimension = deadEntity.dimension;
            const deadLocation = deadEntity.location;

            for (let i = 0; i < xpAmount; i++) {
                const offset = {
                    x: (Math.random() - 0.5) * 1.0,
                    y: Math.random() * 0.5,
                    z: (Math.random() - 0.5) * 1.0
                };

                dimension.spawnEntity("minecraft:xp_orb", {
                    x: deadLocation.x + offset.x,
                    y: deadLocation.y + offset.y + 0.5,
                    z: deadLocation.z + offset.z
                });
            }
        } catch (error) {
            console.warn(`[MobFarScaling] Error spawning XP: ${error.message}`);
        }
    }

    if ((isMonster(deadEntity) || isBossEntity) && config.oreDropEnabled) {
        tryDropOre(deadEntity, level, isBossEntity);
    }
});

// ==================== FUNCIONES DE MENSAJERÍA ====================
function sendCustomMessage(player, message) {
    if (player && player.sendMessage) player.sendMessage(message);
}

function showConfig(player) {
    sendCustomMessage(player, `§6${t(player, "configTitle")}`);
    sendCustomMessage(player, `§7${t(player, "system")}: ${config.enabled ? "§a" + t(player, "enabled") : "§c" + t(player, "disabled")}`);
    sendCustomMessage(player, `§7${t(player, "distanceStep")}: §e${config.distanceStep}`);
    sendCustomMessage(player, `§7${t(player, "heightBase")}: §e${config.yBaseHeight}`);
    sendCustomMessage(player, `§7${t(player, "heightStep")}: §e${config.yStep}`);
    sendCustomMessage(player, `§6${t(player, "enabledTypes")}:`);
    sendCustomMessage(player, `§7- ${t(player, "monster")}: ${config.monsterEnabled ? "§a" + t(player, "enabled") : "§c" + t(player, "disabled")}`);
    sendCustomMessage(player, `§7- ${t(player, "animal")}: ${config.animalEnabled ? "§a" + t(player, "enabled") : "§c" + t(player, "disabled")}`);
    sendCustomMessage(player, `§7- ${t(player, "creature")}: ${config.creatureEnabled ? "§a" + t(player, "enabled") : "§c" + t(player, "disabled")}`);
    sendCustomMessage(player, `§7- ${t(player, "boss")}: ${config.bossEnabled ? "§a" + t(player, "enabled") : "§c" + t(player, "disabled")}`);
    sendCustomMessage(player, `§6${t(player, "maxHealthBoost")}: §e${config.maxHealthBoost}`);
    sendCustomMessage(player, `§6${t(player, "maxStrength")}: §e${config.maxStrength}`);
    sendCustomMessage(player, `§6${t(player, "maxSpeed")}: §e${config.maxSpeed}`);
    sendCustomMessage(player, `${t(player, "maxResistance")}: §e${config.maxResistance}%`);
    sendCustomMessage(player, `${t(player, "enderDragonResistance")}: §e${config.enderDragonResistance > 0 ? config.enderDragonResistance + "%" : "Disabled"}`);
    sendCustomMessage(player, `§7${t(player, "oreDropMax")} (Monster): §e${config.maxOreChance > 0 ? config.maxOreChance + "%" : "Disabled"}`);
    sendCustomMessage(player, `§7${t(player, "oreDropMax")} (Boss): §e${config.maxBossOreChance > 0 ? config.maxBossOreChance + "%" : "Disabled"}`);
    sendCustomMessage(player, `§7${t(player, "blacklist")}: §e${blacklistedMobs.length} mobs`);
    sendCustomMessage(player, `§7${t(player, "animalList")}:`);
    sendCustomMessage(player, `§8  - §7Vanilla: §e${VANILLA_ANIMAL_IDS.length}`);
    sendCustomMessage(player, `§8  - §7Addon: §e${ADDON_ANIMAL_IDS.length}`);
    sendCustomMessage(player, `§8  - §7Custom: §e${customAnimalIds.length}`);
    sendCustomMessage(player, `§7${t(player, "creatureList")}:`);
    sendCustomMessage(player, `§8  - §7Vanilla: §e${VANILLA_CREATURE_IDS.length}`);
    sendCustomMessage(player, `§8  - §7Addon: §e${ADDON_CREATURE_IDS.length}`);
    sendCustomMessage(player, `§8  - §7Custom: §e${customCreatureIds.length}`);
    sendCustomMessage(player, `§7${t(player, "bossList")}:`);
    sendCustomMessage(player, `§8  - §7Vanilla: §e${VANILLA_BOSS_IDS.length}`);
    sendCustomMessage(player, `§8  - §7Addon: §e${ADDON_BOSS_IDS.length}`);
    sendCustomMessage(player, `§8  - §7Custom: §e${customBossIds.length}`);
}

function sendHelp(player) {
    sendCustomMessage(player, `§6${t(player, "commandsHelp")}`);
    sendCustomMessage(player, `§e/mobfarscaling:config §7- ${t(player, "currentConfig")}`);
    sendCustomMessage(player, `§e/mobfarscaling:enable §7- ${t(player, "systemEnabled")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:disable §7- ${t(player, "systemDisabled")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:distance <10-5000> §7- ${t(player, "distanceStep")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:heightbase <0-256> §7- ${t(player, "heightBase")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:heightstep <1-50> §7- ${t(player, "heightStep")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:maxhealthboost <1-251> §7- ${t(player, "maxHealthBoost")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:maxstrength <1-20> §7- ${t(player, "maxStrength")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:maxspeed <1-10> §7- ${t(player, "maxSpeed")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:maxresistance <0-85> §7- ${t(player, "maxResistance")} (0=disabled) ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:enderdragonresistance <0-90> §7- ${t(player, "enderDragonResistance")} (0=disabled) ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:maxorechance <0-50> §7- ${t(player, "oreDropMax")} (Monster) (0=disabled) ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:maxbossorechance <0-100> §7- ${t(player, "oreDropMax")} (Boss) (0=disabled) ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:monster <enable/disable> §7- ${t(player, "monster")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, t(player, "monsterExamples"));
    sendCustomMessage(player, `§e/mobfarscaling:animal <enable/disable> §7- ${t(player, "animal")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, t(player, "animalExamples"));
    sendCustomMessage(player, `§e/mobfarscaling:creature <enable/disable> §7- ${t(player, "creature")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, t(player, "creatureExamples"));
    sendCustomMessage(player, `§e/mobfarscaling:boss <enable/disable> §7- ${t(player, "boss")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, t(player, "bossExamples"));
    sendCustomMessage(player, `§e/mobfarscaling:blacklistadd <id> §7- ${t(player, "blacklistAdd")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:blacklistremove <id> §7- ${t(player, "blacklistRemove")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:blacklist §7- ${t(player, "blacklistList")}`);
    sendCustomMessage(player, `§e/mobfarscaling:animaladd <id> §7- ${t(player, "animalAdd")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:animalremove <id> §7- ${t(player, "animalRemove")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:animallist §7- ${t(player, "animalList")}`);
    sendCustomMessage(player, `§e/mobfarscaling:creatureadd <id> §7- ${t(player, "creatureAdd")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:creatureremove <id> §7- ${t(player, "creatureRemove")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:creaturelist §7- ${t(player, "creatureList")}`);
    sendCustomMessage(player, `§e/mobfarscaling:bossadd <id> §7- ${t(player, "bossAdd")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:bossremove <id> §7- ${t(player, "bossRemove")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:bosslist §7- ${t(player, "bossList")}`);
    sendCustomMessage(player, `§e/mobfarscaling:language <es/en> §7- ${t(player, "languageChange")}`);
    sendCustomMessage(player, `§e/mobfarscaling:reset §7- ${t(player, "configReset")} ${t(player, "adminOnly")}`);
    sendCustomMessage(player, `§e/mobfarscaling:level §7- ${t(player, "levelInfo")}`);
}

function getDistanceAndLevel(location) {
    const finalLevel = calculateMobLevel(location.x, location.y, location.z);
    return { finalLevel: finalLevel };
}

// ==================== REGISTRO DE COMANDOS PERSONALIZADOS ====================
system.beforeEvents.startup.subscribe(({ customCommandRegistry }) => {

    console.log("🔧 [MobFarScaling] Registering commands...");

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:help",
            description: "Show all MobFarScaling commands",
            permissionLevel: CommandPermissionLevel.Any,
            cheatsRequired: false,
        },
        (origin) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            sendHelp(source);
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:config",
            description: "Show current configuration",
            permissionLevel: CommandPermissionLevel.Any,
            cheatsRequired: false,
        },
        (origin) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            showConfig(source);
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:enable",
            description: "Enable the scaling system",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
        },
        (origin) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            config.enabled = true;
            saveGlobalConfig();
            sendCustomMessage(source, `§a✓ ${t(source, "systemEnabled")}`);
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:disable",
            description: "Disable the scaling system",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
        },
        (origin) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            config.enabled = false;
            saveGlobalConfig();
            sendCustomMessage(source, `§c✓ ${t(source, "systemDisabled")}`);
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:distance",
            description: "Set blocks per level (10-5000)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "blocks", type: CustomCommandParamType.Integer }
            ]
        },
        (origin, blocks) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (blocks < 10 || blocks > 5000) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "valueBetween")} 10 ${t(source, "and")} 5000`);
                return { status: CustomCommandStatus.Failure };
            }
            config.distanceStep = blocks;
            saveGlobalConfig();
            sendCustomMessage(source, `§a✓ ${t(source, "distanceStep")} ${t(source, "valueSet")} ${blocks}`);
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:heightbase",
            description: "Set height base level (0-256)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "height", type: CustomCommandParamType.Integer }
            ]
        },
        (origin, height) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (height < 0 || height > 256) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "valueBetween")} 0 ${t(source, "and")} 256`);
                return { status: CustomCommandStatus.Failure };
            }
            config.yBaseHeight = height;
            saveGlobalConfig();
            sendCustomMessage(source, `§a✓ ${t(source, "heightBase")} ${t(source, "valueSet")} ${height}`);
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:heightstep",
            description: "Set height blocks per level (1-50)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "blocks", type: CustomCommandParamType.Integer }
            ]
        },
        (origin, blocks) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (blocks < 1 || blocks > 50) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "valueBetween")} 1 ${t(source, "and")} 50`);
                return { status: CustomCommandStatus.Failure };
            }
            config.yStep = blocks;
            saveGlobalConfig();
            sendCustomMessage(source, `§a✓ ${t(source, "heightStep")} ${t(source, "valueSet")} ${blocks}`);
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:maxhealthboost",
            description: "Set max health boost level (1-251)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "level", type: CustomCommandParamType.Integer }
            ]
        },
        (origin, level) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (level < 1 || level > 251) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "valueBetween")} 1 ${t(source, "and")} 251`);
                return { status: CustomCommandStatus.Failure };
            }
            config.maxHealthBoost = level;
            saveGlobalConfig();
            sendCustomMessage(source, `§a✓ ${t(source, "maxHealthBoost")} ${t(source, "valueSet")} ${level}`);
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:maxstrength",
            description: "Set max strength level (1-20)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "level", type: CustomCommandParamType.Integer }
            ]
        },
        (origin, level) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (level < 1 || level > 20) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "valueBetween")} 1 ${t(source, "and")} 20`);
                return { status: CustomCommandStatus.Failure };
            }
            config.maxStrength = level;
            saveGlobalConfig();
            sendCustomMessage(source, `§a✓ ${t(source, "maxStrength")} ${t(source, "valueSet")} ${level}`);
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:maxspeed",
            description: "Set max speed level (1-10)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "level", type: CustomCommandParamType.Integer }
            ]
        },
        (origin, level) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (level < 1 || level > 10) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "valueBetween")} 1 ${t(source, "and")} 10`);
                return { status: CustomCommandStatus.Failure };
            }
            config.maxSpeed = level;
            saveGlobalConfig();
            sendCustomMessage(source, `§a✓ ${t(source, "maxSpeed")} ${t(source, "valueSet")} ${level}`);
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:maxresistance",
            description: "Set max boss resistance % (0-85)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "percent", type: CustomCommandParamType.Integer }
            ]
        },
        (origin, percent) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (percent < 0 || percent > 85) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "valueBetween")} 0 ${t(source, "and")} 85`);
                return { status: CustomCommandStatus.Failure };
            }
            config.maxResistance = percent;
            saveGlobalConfig();
            if (percent === 0) {
                sendCustomMessage(source, `§c✓ ${t(source, "maxResistance")} disabled (0%)`);
            } else {
                sendCustomMessage(source, `§a✓ ${t(source, "maxResistance")} ${t(source, "valueSet")} ${percent}%`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:enderdragonresistance",
            description: "Set Ender Dragon resistance % (0=disabled, 1-90)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "percent", type: CustomCommandParamType.Integer }
            ]
        },
        (origin, percent) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (percent < 0 || percent > 90) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "valueBetween")} 0 ${t(source, "and")} 90`);
                return { status: CustomCommandStatus.Failure };
            }
            config.enderDragonResistance = percent;
            saveGlobalConfig();
            if (percent === 0) {
                sendCustomMessage(source, `§c✓ ${t(source, "enderDragonResistance")} disabled (0%)`);
            } else {
                sendCustomMessage(source, `§a✓ ${t(source, "enderDragonResistance")} ${t(source, "valueSet")} ${percent}% (+${percent} XP orbs on death)`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:maxorechance",
            description: "Set max ore drop chance for monsters (0-50%)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "chance", type: CustomCommandParamType.Integer }
            ]
        },
        (origin, chance) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (chance < 0 || chance > 50) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "valueBetween")} 0 ${t(source, "and")} 50`);
                return { status: CustomCommandStatus.Failure };
            }
            config.maxOreChance = chance;
            saveGlobalConfig();
            if (chance === 0) {
                sendCustomMessage(source, `§c✓ ${t(source, "oreDropMax")} (Monster) disabled (0%)`);
            } else {
                sendCustomMessage(source, `§a✓ ${t(source, "oreDropMax")} (Monster) ${t(source, "valueSet")} ${chance}%`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:maxbossorechance",
            description: "Set max ore drop chance for bosses (0-100%)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "chance", type: CustomCommandParamType.Integer }
            ]
        },
        (origin, chance) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (chance < 0 || chance > 100) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "valueBetween")} 0 ${t(source, "and")} 100`);
                return { status: CustomCommandStatus.Failure };
            }
            config.maxBossOreChance = chance;
            saveGlobalConfig();
            if (chance === 0) {
                sendCustomMessage(source, `§c✓ ${t(source, "oreDropMax")} (Boss) disabled (0%)`);
            } else {
                sendCustomMessage(source, `§a✓ ${t(source, "oreDropMax")} (Boss) ${t(source, "valueSet")} ${chance}%`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:monster",
            description: "Enable/disable monster scaling",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "action", type: CustomCommandParamType.String }
            ]
        },
        (origin, action) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (action === "enable") {
                config.monsterEnabled = true;
                saveGlobalConfig();
                sendCustomMessage(source, `§a✓ ${t(source, "monsterEnabled")}`);
                sendCustomMessage(source, t(source, "monsterInfo"));
            } else if (action === "disable") {
                config.monsterEnabled = false;
                saveGlobalConfig();
                sendCustomMessage(source, `§c✓ ${t(source, "monsterDisabled")}`);
            } else {
                sendCustomMessage(source, `§c${t(source, "error")}: Use 'enable' or 'disable'`);
                return { status: CustomCommandStatus.Failure };
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:animal",
            description: "Enable/disable animal scaling",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "action", type: CustomCommandParamType.String }
            ]
        },
        (origin, action) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (action === "enable") {
                config.animalEnabled = true;
                saveGlobalConfig();
                sendCustomMessage(source, `§a✓ ${t(source, "animalEnabled")}`);
                sendCustomMessage(source, t(source, "animalInfo"));
            } else if (action === "disable") {
                config.animalEnabled = false;
                saveGlobalConfig();
                sendCustomMessage(source, `§c✓ ${t(source, "animalDisabled")}`);
            } else {
                sendCustomMessage(source, `§c${t(source, "error")}: Use 'enable' or 'disable'`);
                return { status: CustomCommandStatus.Failure };
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:creature",
            description: "Enable/disable creature scaling",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "action", type: CustomCommandParamType.String }
            ]
        },
        (origin, action) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (action === "enable") {
                config.creatureEnabled = true;
                saveGlobalConfig();
                sendCustomMessage(source, `§a✓ ${t(source, "creatureEnabled")}`);
                sendCustomMessage(source, t(source, "creatureInfo"));
            } else if (action === "disable") {
                config.creatureEnabled = false;
                saveGlobalConfig();
                sendCustomMessage(source, `§c✓ ${t(source, "creatureDisabled")}`);
            } else {
                sendCustomMessage(source, `§c${t(source, "error")}: Use 'enable' or 'disable'`);
                return { status: CustomCommandStatus.Failure };
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:boss",
            description: "Enable/disable boss scaling and resistance",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "action", type: CustomCommandParamType.String }
            ]
        },
        (origin, action) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (action === "enable") {
                config.bossEnabled = true;
                saveGlobalConfig();
                sendCustomMessage(source, `§a✓ ${t(source, "bossEnabled")}`);
                sendCustomMessage(source, t(source, "bossInfo"));
                sendCustomMessage(source, t(source, "resistanceInfo"));
            } else if (action === "disable") {
                config.bossEnabled = false;
                saveGlobalConfig();
                sendCustomMessage(source, `§c✓ ${t(source, "bossDisabled")}`);
            } else {
                sendCustomMessage(source, `§c${t(source, "error")}: Use 'enable' or 'disable'`);
                return { status: CustomCommandStatus.Failure };
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    // BLACKLIST ADD
    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:blacklistadd",
            description: "Add a mob to blacklist (won't scale)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "mobId", type: CustomCommandParamType.String }
            ]
        },
        (origin, mobId) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            if (!mobId || !mobId.includes(":")) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "invalidId")}`);
                return { status: CustomCommandStatus.Failure };
            }

            if (mobId === "minecraft:ender_dragon") {
                sendCustomMessage(source, `§cEnder Dragon has special configuration and cannot be added to blacklist.`);
                return { status: CustomCommandStatus.Failure };
            }

            const allBossIds = getBossIds();
            if (allBossIds.includes(mobId)) {
                sendCustomMessage(source, `§c${mobId} is a BOSS. Remove it from boss list first before adding to blacklist.`);
                return { status: CustomCommandStatus.Failure };
            }

            if (!blacklistedMobs.includes(mobId)) {
                blacklistedMobs.push(mobId);
                saveBlacklist();
                sendCustomMessage(source, `§a✓ ${mobId} ${t(source, "blacklistAdd")}`);
            } else {
                sendCustomMessage(source, `§e${mobId} is already in blacklist`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    // BLACKLIST REMOVE
    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:blacklistremove",
            description: "Remove a mob from blacklist",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "mobId", type: CustomCommandParamType.String }
            ]
        },
        (origin, mobId) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            const index = blacklistedMobs.indexOf(mobId);
            if (index !== -1) {
                blacklistedMobs.splice(index, 1);
                saveBlacklist();
                sendCustomMessage(source, `§a✓ ${mobId} ${t(source, "blacklistRemove")}`);
            } else {
                sendCustomMessage(source, `§e${mobId} not found in blacklist`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    // BLACKLIST LIST
    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:blacklist",
            description: "List all blacklisted mobs",
            permissionLevel: CommandPermissionLevel.Any,
            cheatsRequired: false,
        },
        (origin) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            if (blacklistedMobs.length === 0) {
                sendCustomMessage(source, `§7${t(source, "blacklist")}: §eEmpty`);
            } else {
                sendCustomMessage(source, `§6${t(source, "blacklist")} (${blacklistedMobs.length}):`);
                for (const id of blacklistedMobs) {
                    sendCustomMessage(source, `§8  - §7${id}`);
                }
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    // ANIMAL ADD
    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:animaladd",
            description: "Add a custom mob ID to animal list",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "mobId", type: CustomCommandParamType.String }
            ]
        },
        (origin, mobId) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            if (!mobId || !mobId.includes(":")) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "invalidId")}`);
                return { status: CustomCommandStatus.Failure };
            }

            if (mobId === "minecraft:ender_dragon") {
                sendCustomMessage(source, `§cEnder Dragon has special configuration and cannot be added to animal list.`);
                return { status: CustomCommandStatus.Failure };
            }

            if (!customAnimalIds.includes(mobId)) {
                customAnimalIds.push(mobId);
                saveAnimalList();
                sendCustomMessage(source, `§a✓ ${mobId} ${t(source, "animalAdd")}`);
                sendCustomMessage(source, t(source, "animalListInfo"));
            } else {
                sendCustomMessage(source, `§e${mobId} is already in animal list`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    // ANIMAL REMOVE
    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:animalremove",
            description: "Remove a custom mob ID from animal list",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "mobId", type: CustomCommandParamType.String }
            ]
        },
        (origin, mobId) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            const index = customAnimalIds.indexOf(mobId);
            if (index !== -1) {
                customAnimalIds.splice(index, 1);
                saveAnimalList();
                sendCustomMessage(source, `§a✓ ${mobId} ${t(source, "animalRemove")}`);
            } else {
                sendCustomMessage(source, `§e${mobId} not found in animal list`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    // ANIMAL LIST
    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:animallist",
            description: "List all animals (base + custom)",
            permissionLevel: CommandPermissionLevel.Any,
            cheatsRequired: false,
        },
        (origin) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            const groupedAnimals = getAnimalTypesGrouped();
            const sortedPrefixes = Array.from(groupedAnimals.keys()).sort();

            sendCustomMessage(source, `§6${t(source, "animalList")}:`);

            for (const prefix of sortedPrefixes) {
                const ids = groupedAnimals.get(prefix);
                const isVanilla = prefix === "minecraft";
                const isAddon = ["alpha_livestock", "dk", "minere", "fusioned_mobs", "old_nether"].includes(prefix);
                let prefixColor = "§7";
                if (isVanilla) prefixColor = "§7";
                else if (isAddon) prefixColor = "§e";
                else prefixColor = "§d";
                sendCustomMessage(source, `${prefixColor}${prefix}: §e${ids.length}`);
                for (const id of ids) {
                    const isCustomId = customAnimalIds.includes(id);
                    const idColor = isCustomId ? "§d" : (isVanilla ? "§7" : "§e");
                    sendCustomMessage(source, `§8  - ${idColor}${id}`);
                }
            }

            sendCustomMessage(source, `§7Total animals: §e${getAnimalTypes().length} §7(Vanilla: ${VANILLA_ANIMAL_IDS.length}, Addon: ${ADDON_ANIMAL_IDS.length}, Custom: ${customAnimalIds.length})`);
            return { status: CustomCommandStatus.Success };
        }
    );

    // CREATURE ADD
    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:creatureadd",
            description: "Add a custom mob ID to creature list",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "mobId", type: CustomCommandParamType.String }
            ]
        },
        (origin, mobId) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            if (!mobId || !mobId.includes(":")) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "invalidId")}`);
                return { status: CustomCommandStatus.Failure };
            }

            if (mobId === "minecraft:ender_dragon") {
                sendCustomMessage(source, `§cEnder Dragon has special configuration and cannot be added to creature list.`);
                return { status: CustomCommandStatus.Failure };
            }

            if (!customCreatureIds.includes(mobId)) {
                customCreatureIds.push(mobId);
                saveCreatureList();
                sendCustomMessage(source, `§a✓ ${mobId} ${t(source, "creatureAdd")}`);
                sendCustomMessage(source, t(source, "creatureListInfo"));
            } else {
                sendCustomMessage(source, `§e${mobId} is already in creature list`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    // CREATURE REMOVE
    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:creatureremove",
            description: "Remove a custom mob ID from creature list",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "mobId", type: CustomCommandParamType.String }
            ]
        },
        (origin, mobId) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            const index = customCreatureIds.indexOf(mobId);
            if (index !== -1) {
                customCreatureIds.splice(index, 1);
                saveCreatureList();
                sendCustomMessage(source, `§a✓ ${mobId} ${t(source, "creatureRemove")}`);
            } else {
                sendCustomMessage(source, `§e${mobId} not found in creature list`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    // CREATURE LIST
    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:creaturelist",
            description: "List all creatures (base + custom)",
            permissionLevel: CommandPermissionLevel.Any,
            cheatsRequired: false,
        },
        (origin) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            const groupedCreatures = getCreatureTypesGrouped();
            const sortedPrefixes = Array.from(groupedCreatures.keys()).sort();

            sendCustomMessage(source, `§6${t(source, "creatureList")}:`);

            for (const prefix of sortedPrefixes) {
                const ids = groupedCreatures.get(prefix);
                const isVanilla = prefix === "minecraft";
                const isAddon = ["nether_biomes_expansion", "old_nether", "dungeons", "dk", "ew", "old_villagers_plus", "fusioned_mobs"].includes(prefix);
                let prefixColor = "§7";
                if (isVanilla) prefixColor = "§7";
                else if (isAddon) prefixColor = "§e";
                else prefixColor = "§d";
                sendCustomMessage(source, `${prefixColor}${prefix}: §e${ids.length}`);
                for (const id of ids) {
                    const isCustomId = customCreatureIds.includes(id);
                    const idColor = isCustomId ? "§d" : (isVanilla ? "§7" : "§e");
                    sendCustomMessage(source, `§8  - ${idColor}${id}`);
                }
            }

            sendCustomMessage(source, `§7Total creatures: §e${getCreatureTypes().length} §7(Vanilla: ${VANILLA_CREATURE_IDS.length}, Addon: ${ADDON_CREATURE_IDS.length}, Custom: ${customCreatureIds.length})`);
            return { status: CustomCommandStatus.Success };
        }
    );

    // BOSS ADD
    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:bossadd",
            description: "Add a custom mob ID to boss list",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "mobId", type: CustomCommandParamType.String }
            ]
        },
        (origin, mobId) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            if (!mobId || !mobId.includes(":")) {
                sendCustomMessage(source, `§c${t(source, "error")}: ${t(source, "invalidId")}`);
                return { status: CustomCommandStatus.Failure };
            }

            if (mobId === "minecraft:ender_dragon") {
                sendCustomMessage(source, `§cEnder Dragon has special configuration and cannot be added to boss list.`);
                return { status: CustomCommandStatus.Failure };
            }

            if (blacklistedMobs.includes(mobId)) {
                sendCustomMessage(source, `§c${mobId} is in BLACKLIST. Cannot add as boss.`);
                return { status: CustomCommandStatus.Failure };
            }

            if (!customBossIds.includes(mobId)) {
                customBossIds.push(mobId);
                saveBossList();
                sendCustomMessage(source, `§a✓ ${mobId} ${t(source, "bossAdd")}`);
            } else {
                sendCustomMessage(source, `§e${mobId} is already in boss list`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    // BOSS REMOVE
    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:bossremove",
            description: "Remove a custom mob ID from boss list",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "mobId", type: CustomCommandParamType.String }
            ]
        },
        (origin, mobId) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            const index = customBossIds.indexOf(mobId);
            if (index !== -1) {
                customBossIds.splice(index, 1);
                saveBossList();
                sendCustomMessage(source, `§a✓ ${mobId} ${t(source, "bossRemove")}`);
            } else {
                sendCustomMessage(source, `§e${mobId} not found in boss list`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    // BOSS LIST
    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:bosslist",
            description: "Show all bosses (vanilla + addon + custom)",
            permissionLevel: CommandPermissionLevel.Any,
            cheatsRequired: false,
        },
        (origin) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            sendCustomMessage(source, `§6${t(source, "bossList")}:`);
            sendCustomMessage(source, `§7Vanilla: §e${VANILLA_BOSS_IDS.length}`);
            for (const id of VANILLA_BOSS_IDS) {
                sendCustomMessage(source, `§8  - §7${id}`);
            }
            sendCustomMessage(source, `§7Addon: §e${ADDON_BOSS_IDS.length}`);
            for (const id of ADDON_BOSS_IDS) {
                sendCustomMessage(source, `§8  - §7${id}`);
            }
            sendCustomMessage(source, `§7Custom: §e${customBossIds.length}`);
            for (const id of customBossIds) {
                sendCustomMessage(source, `§8  - §7${id}`);
            }
            sendCustomMessage(source, `§7Ender Dragon: §e${config.enderDragonResistance > 0 ? config.enderDragonResistance + "% resistance" : "Disabled"}`);
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:language",
            description: "Change language (es/en)",
            permissionLevel: CommandPermissionLevel.Any,
            cheatsRequired: false,
            mandatoryParameters: [
                { name: "lang", type: CustomCommandParamType.String }
            ]
        },
        (origin, lang) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            if (lang === "es") {
                setPlayerLanguage(source, "es");
                sendCustomMessage(source, `§a✓ ${t(source, "languageSet")}`);
            } else if (lang === "en") {
                setPlayerLanguage(source, "en");
                sendCustomMessage(source, `§a✓ ${t(source, "languageSetEn")}`);
            } else {
                sendCustomMessage(source, `§c${t(source, "error")}: Language must be 'es' or 'en'`);
                return { status: CustomCommandStatus.Failure };
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:reset",
            description: "Reset to default configuration (clears all custom lists)",
            permissionLevel: CommandPermissionLevel.GameDirectors,
            cheatsRequired: false,
        },
        (origin) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }

            config = {
                enabled: true,
                distanceStep: 400,
                yBaseHeight: 64,
                yStep: 16,
                healthBoostPerLevel: 1,
                strengthPerLevel: 1,
                speedPerLevel: 1,
                xpOrbsPerLevel: 1,
                monsterEnabled: true,
                animalEnabled: false,
                creatureEnabled: true,
                bossEnabled: true,
                maxHealthBoost: 251,
                maxStrength: 5,
                maxSpeed: 3,
                maxResistance: 75,
                oreDropEnabled: true,
                maxOreChance: 50,
                maxBossOreChance: 100,
                enderDragonResistance: 75
            };

            blacklistedMobs = [...DEFAULT_BLACKLIST];
            customAnimalIds = [];
            customCreatureIds = [];
            customBossIds = [];

            saveGlobalConfig();
            saveBlacklist();
            saveAnimalList();
            saveCreatureList();
            saveBossList();

            sendCustomMessage(source, `§a✓ ${t(source, "configReset")}`);
            sendCustomMessage(source, `§a✓ ${t(source, "blacklistCleared")} (default ${blacklistedMobs.length} mobs restored)`);
            sendCustomMessage(source, `§a✓ ${t(source, "animalCleared")}`);
            sendCustomMessage(source, `§a✓ ${t(source, "creatureCleared")}`);
            sendCustomMessage(source, `§a✓ ${t(source, "bossCleared")}`);
            showConfig(source);
            return { status: CustomCommandStatus.Success };
        }
    );

    customCommandRegistry.registerCommand(
        {
            name: "mobfarscaling:level",
            description: "Show current mob scaling level in this area",
            permissionLevel: CommandPermissionLevel.Any,
            cheatsRequired: false,
        },
        (origin) => {
            const source = origin.initiator ?? origin.sourceEntity;
            if (!(source instanceof Player)) {
                return { status: CustomCommandStatus.Failure, message: "Players only!" };
            }
            const { finalLevel } = getDistanceAndLevel(source.location);
            sendCustomMessage(source, `§6${t(source, "currentConfig")}`);
            sendCustomMessage(source, t(source, "levelInfo") + finalLevel.toString());

            if (finalLevel > 0) {
                const healthAmplifier = getHealthAmplifier(finalLevel, config.healthBoostPerLevel);
                const strengthAmplifier = getStrengthAmplifier(finalLevel, config.strengthPerLevel);
                const speedAmplifier = getSpeedAmplifier(finalLevel, config.speedPerLevel);
                const bonusXP = getBonusXP(finalLevel) * config.xpOrbsPerLevel;
                const bossBonusXP = getBonusXPBoss(finalLevel) * config.xpOrbsPerLevel;
                const oreChance = getOreDropChance(finalLevel, false);
                const bossOreChance = getOreDropChance(finalLevel, true);
                const bossResistance = getBossResistance(finalLevel);

                sendCustomMessage(source, `§7${t(source, "effectLevels")}`);
                sendCustomMessage(source, `§7  - ${t(source, "healthBoost")}: §e${healthAmplifier + 1}`);
                sendCustomMessage(source, `§7  - ${t(source, "strength")}: §e${strengthAmplifier + 1}`);
                sendCustomMessage(source, `§7  - ${t(source, "speed")}: §e${speedAmplifier + 1}`);
                sendCustomMessage(source, `§7  - ${t(source, "resistance")} (Normal Boss): §e${bossResistance}%`);
                sendCustomMessage(source, `§7  - ${t(source, "resistance")} (Ender Dragon): §e${config.enderDragonResistance > 0 ? config.enderDragonResistance + "%" : "Disabled"}`);
                sendCustomMessage(source, `§7  - ${t(source, "bonusXP")} (Monster): §e${bonusXP}`);
                sendCustomMessage(source, `§7  - ${t(source, "bonusXP")} (Normal Boss): §e${bossBonusXP}`);
                sendCustomMessage(source, `§7  - ${t(source, "bonusXP")} (Ender Dragon): §e${config.enderDragonResistance > 0 ? config.enderDragonResistance : 0}`);
                sendCustomMessage(source, `§7  - ${t(source, "oreDropChance")} (Monster): §e${oreChance.toFixed(1)}%`);
                sendCustomMessage(source, `§7  - ${t(source, "oreDropChance")} (Boss): §e${bossOreChance.toFixed(1)}%`);
            }
            return { status: CustomCommandStatus.Success };
        }
    );

    console.log("✅ [MobFarScaling] Commands registered successfully!");
});

// ==================== CARGA DE DATOS POSTERIOR AL REGISTRO ====================
system.runTimeout(() => {
    console.log("§a[MobFarScaling] Loading saved data...");
    loadGlobalConfig();
    loadSavedLists();

    console.log("§a=========================================");
    console.log(`§a[MobFarScaling] System: ${config.enabled ? "ENABLED" : "DISABLED"}`);
    console.log(`§a[MobFarScaling] Distance: ${config.distanceStep} blocks/level | Height base: ${config.yBaseHeight} | Step: ${config.yStep}`);
    console.log(`§a[MobFarScaling] MONSTER: ${config.monsterEnabled ? "ENABLED" : "DISABLED"} | ANIMAL: ${config.animalEnabled ? "ENABLED" : "DISABLED"}`);
    console.log(`§a[MobFarScaling] CREATURE: ${config.creatureEnabled ? "ENABLED" : "DISABLED"} | BOSS: ${config.bossEnabled ? "ENABLED" : "DISABLED"}`);
    console.log(`§a[MobFarScaling] Ender Dragon: ${config.enderDragonResistance > 0 ? "ENABLED (" + config.enderDragonResistance + "% resistance, +" + config.enderDragonResistance + " XP)" : "DISABLED"}`);
    console.log(`§a[MobFarScaling] Max limits - Health: ${config.maxHealthBoost} | Strength: ${config.maxStrength} | Speed: ${config.maxSpeed} | Max Boss Resistance: ${config.maxResistance}%`);
    console.log(`§a[MobFarScaling] Ore Drop Max - Monster: ${config.maxOreChance > 0 ? config.maxOreChance + "%" : "Disabled"} | Boss: ${config.maxBossOreChance > 0 ? config.maxBossOreChance + "%" : "Disabled"}`);
    console.log(`§a[MobFarScaling] Ore base chance: Monsters 1% per level | Bosses 2% per level (double)`);
    console.log(`§a[MobFarScaling] Ore drop amount: Monsters 1-4 | Bosses 3-6`);
    console.log(`§a[MobFarScaling] Ore Weights - Coal:35 Copper:20 Iron:12 Lapis:8 Gold:6 Redstone:5 Emerald:3 Diamond:1`);
    console.log(`§a[MobFarScaling] XP scaling (Monsters): +1 orb every 2 levels (max 18 orbs)`);
    console.log(`§a[MobFarScaling] XP scaling (Bosses): 1 orb per level up to 10, then slower (max ~40 orbs)`);
    console.log(`§a[MobFarScaling] BLACKLIST: ${blacklistedMobs.length} mobs`);
    console.log(`§a[MobFarScaling] CUSTOM ANIMALS: ${customAnimalIds.length} | CUSTOM CREATURES: ${customCreatureIds.length} | CUSTOM BOSSES: ${customBossIds.length}`);
    console.log(`§a[MobFarScaling] TOTAL BOSSES: ${getBossIds().length} (Vanilla: ${VANILLA_BOSS_IDS.length}, Addon: ${ADDON_BOSS_IDS.length}, Custom: ${customBossIds.length})`);
    console.log(`§a[MobFarScaling] TOTAL ANIMALS: ${getAnimalTypes().length} (Vanilla: ${VANILLA_ANIMAL_IDS.length}, Addon: ${ADDON_ANIMAL_IDS.length}, Custom: ${customAnimalIds.length})`);
    console.log(`§a[MobFarScaling] TOTAL CREATURES: ${getCreatureTypes().length} (Vanilla: ${VANILLA_CREATURE_IDS.length}, Addon: ${ADDON_CREATURE_IDS.length}, Custom: ${customCreatureIds.length})`);
    console.log("§a=========================================");
}, 10);

// ==================== MENSAJE INICIAL ÚNICO A LOS 30 SEGUNDOS ====================
let initialMessageSent = false;

system.runTimeout(() => {
    if (!initialMessageSent) {
        initialMessageSent = true;
        try {
            const message = "§6[MobFarScaling] §aAddon loaded! Mobs get stronger the farther you go! Use §e/mobfarscaling:help §ato see commands. §dCreated by IsraOrbit";
            for (const player of world.getAllPlayers()) {
                player.sendMessage(message);
            }
            console.log("§a[MobFarScaling] Welcome message sent to all connected players");
        } catch (error) {
            console.error("§c[MobFarScaling] Error sending global message:", error);
        }
    }
}, 600);

// ==================== MENSAJE DE BIENVENIDA AL UNIRSE ====================
world.afterEvents.playerJoin.subscribe((event) => {
    if (!isCauldronModuleActive("mfs")) return;
    const player = event.player;
    system.runTimeout(() => {
        try {
            sendCustomMessage(player, t(player, "helpMessage"));
        } catch (error) {
            console.error(`[MobFarScaling] Error sending welcome message:`, error);
        }
    }, 60);
});

// ==================== LIMPIEZA DE TAGS AL MORIR ====================
world.afterEvents.entityDie.subscribe(event => {
    if (!isCauldronModuleActive("mfs")) return;
    try {
        if (event.deadEntity.hasTag(SCALED_TAG)) {
            event.deadEntity.removeTag(SCALED_TAG);
        }
        if (event.deadEntity.hasTag(BOSS_SCALED_TAG)) {
            event.deadEntity.removeTag(BOSS_SCALED_TAG);
        }
        if (event.deadEntity.hasTag(ENDER_DRAGON_TAG)) {
            event.deadEntity.removeTag(ENDER_DRAGON_TAG);
        }
    } catch { }
});
