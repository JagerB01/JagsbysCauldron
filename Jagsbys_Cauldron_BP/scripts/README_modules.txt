Jagsby's Cauldron script layout
- main.js: startup coordinator
- module_controller.js: settings; migrates legacy apiary toggle to croft
- cauldron_menu.js: administrator-only toggles, applied on world restart
- modules/mob_far_scaling.js: Mob Far Scaling
- modules/croft.js: Croft feature registration entry point
- modules/croft/apiary_cap.js: Apiary Cap automation
- modules/croft/hen_house.js: Hen House placement and break handling
- modules/conquest_commerce.js: Conquest & Commerce initialization
- modules/conquest_commerce/haggle.js: gated emerald haggling

Add future Croft features under modules/croft/ and import from modules/croft.js.
Gate gameplay callbacks with isCauldronModuleActive("croft").
Keep existing block/item IDs and storage keys stable for world compatibility.
Hen House currently implements a structure, not chicken or egg automation.
Paired-block break cleanup remains active while disabled to avoid orphan halves.
Conquest & Commerce toggle controls scripts only; data stays loaded.
See docs/conquest_commerce/README.md for provenance and limitations.
