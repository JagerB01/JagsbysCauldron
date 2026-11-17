import assert from 'node:assert/strict';
import fs from 'node:fs';
const scripts = new URL('../Jagsbys_Cauldron_BP/scripts/', import.meta.url);
const read = p => fs.readFileSync(new URL(p,scripts),'utf8');
const load = s => import('data:text/javascript;base64,'+Buffer.from(s).toString('base64'));
let stored;
const world={getDynamicProperty:()=>stored,setDynamicProperty:(_,v)=>{stored=v;}};
globalThis.__world=world;
const controller=await load(read('module_controller.js').replace('import { world, system } from "@minecraft/server";','const world=globalThis.__world;'));
assert.deepEqual(controller.loadModuleSettings(),{croft:true,mfs:true,conquest_commerce:true});
for(const enabled of [false,true]){
 stored=JSON.stringify({diplomacy:true,apiary:enabled,mfs:false});
 assert.equal(controller.loadModuleSettings().croft,enabled);
 assert.equal(controller.getModuleSettings().conquest_commerce,true);
}
stored=JSON.stringify({apiary:false,croft:true});assert.equal(controller.loadModuleSettings().croft,true);
controller.saveModuleSettings({diplomacy:true,croft:false,mfs:true,conquest_commerce:false});
assert.equal(controller.isCauldronModuleActive('conquest_commerce'),true);
assert.equal(controller.isCauldronModuleActive('croft'),true);
assert.equal(controller.settingsRequireRestart(),true);
controller.loadModuleSettings();
assert.equal(controller.isCauldronModuleActive('conquest_commerce'),false);
assert.equal(controller.isCauldronModuleActive('croft'),false);
assert.equal(controller.settingsRequireRestart(),false);
let interval,spawnCallback,removed=0,triggered=0,queries=0,itemQueries=0,baby=false,hasVillager=true;
const location={x:0,y:64,z:0};
const villager={isValid:true,location,getComponent:n=>n==='is_baby'?(baby?{}:undefined):{value:1},triggerEvent:n=>{assert.equal(n,'haggle');triggered++;}};
const item={isValid:true,location,getComponent:()=>({itemStack:{typeId:'minecraft:emerald'}}),remove:()=>{removed++;}};
const dimension={id:'overworld',getPlayers:()=>[{location}],getEntities:({type})=>{queries++;if(type==='minecraft:item'){itemQueries++;return [item];}return hasVillager?[villager]:[];},playSound:()=>{},runCommand:()=>{}};
world.getDimension=n=>n==='overworld'?dimension:{...dimension,getPlayers:()=>[]};
world.afterEvents={entitySpawn:{subscribe:cb=>{spawnCallback=cb;}}};
globalThis.__system={runInterval:(cb,t)=>{assert.equal(t,20);interval=cb;}};
globalThis.__controller=controller;
const haggle=await load(read('modules/conquest_commerce/haggle.js').replace('import { world, system } from "@minecraft/server";','const world=globalThis.__world,system=globalThis.__system;').replace('import { isCauldronModuleActive } from "../../module_controller.js";','const {isCauldronModuleActive}=globalThis.__controller;'));
assert.equal(interval,undefined);haggle.initialize();interval();assert.equal(queries,0);
controller.saveModuleSettings({croft:true,mfs:true,conquest_commerce:true});controller.loadModuleSettings();
hasVillager=false;interval();assert.equal(itemQueries,0);
hasVillager=true;baby=true;interval();assert.equal(removed,0);assert.equal(itemQueries,0);
baby=false;interval();assert.equal(removed,1);assert.equal(triggered,1);assert.equal(itemQueries,1);
let transformed=0;
const entity={typeId:'concom:villager_haggle',location,dimension,triggerEvent:n=>{assert.equal(n,'villager_haggle');transformed++;}};
spawnCallback({entity});assert.equal(transformed,1);
spawnCallback({entity});assert.equal(transformed,1);
controller.saveModuleSettings({diplomacy:true,croft:true,mfs:true,conquest_commerce:false});controller.loadModuleSettings();
interval();assert.equal(removed,1);
const menu=read('cauldron_menu.js');
assert.match(menu,/!res.formValues \|\| !player.isOp\(\)/);
assert.match(menu,/conquest_commerce: res.formValues\[2\] === true/);
console.log('PASS: defaults, legacy migration, persistence, restart gating, disabled haggling, baby exclusion, adult conversion and skipped item queries without eligible villagers.');

// Old saves must retain the remaining modules without reviving Diplomacy.
stored=JSON.stringify({diplomacy:true,croft:false,mfs:true,conquest_commerce:false});
assert.deepEqual(controller.loadModuleSettings(),{croft:false,mfs:true,conquest_commerce:false});
controller.saveModuleSettings({...controller.getModuleSettings(),diplomacy:true});
assert.deepEqual(JSON.parse(stored),{croft:false,mfs:true,conquest_commerce:false});

// Exercise the actual menu callback to catch shifted toggle positions.
let itemUse,formLabels=[],formValues=[true,false,true];
world.afterEvents.itemUse={subscribe:cb=>{itemUse=cb;}};
world.afterEvents.playerInteractWithBlock={subscribe:()=>{}};
world.afterEvents.playerInteractWithEntity={subscribe:()=>{}};
class ActionForm {
 title(){return this;} body(){return this;} button(){return this;}
 async show(){return {selection:1};}
}
class ModalForm {
 title(){return this;} submitButton(){return this;}
 toggle(label){formLabels.push(label);return this;}
 async show(){return {formValues};}
}
globalThis.__ui={ActionFormData:ActionForm,ModalFormData:ModalForm};
globalThis.__system={currentTick:10,run:cb=>cb()};
await load(menu.replace('import { world, system } from "@minecraft/server";','const world=globalThis.__world,system=globalThis.__system;')
 .replace('import { ActionFormData, ModalFormData } from "@minecraft/server-ui";','const {ActionFormData,ModalFormData}=globalThis.__ui;')
 .replace('import { getModuleSettings, saveModuleSettings, settingsRequireRestart } from "./module_controller.js";','const {getModuleSettings,saveModuleSettings,settingsRequireRestart}=globalThis.__controller;'));
const player={name:'operator',isOp:()=>true,sendMessage:()=>{}};
itemUse({source:player,itemStack:{typeId:'jagsby:cauldron'}});
await new Promise(resolve=>setImmediate(resolve));
assert.deepEqual(formLabels,['Croft','Mob Far Scaling','Conquest & Commerce (scripted haggling)']);
assert.deepEqual(JSON.parse(stored),{croft:true,mfs:false,conquest_commerce:true});
formLabels=[];formValues=[false,true,false];globalThis.__system.currentTick+=5;
itemUse({source:player,itemStack:{typeId:'jagsby:cauldron'}});
await new Promise(resolve=>setImmediate(resolve));
assert.deepEqual(JSON.parse(stored),{croft:false,mfs:true,conquest_commerce:false});
console.log('PASS: legacy Diplomacy settings ignored and all three menu toggles save correctly.');
