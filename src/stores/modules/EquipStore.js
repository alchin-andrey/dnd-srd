import { defineStore } from "pinia";
import { useMYStore } from "@/stores/user/MYStore";



export const useEquipStore = defineStore({
	id: 'EquipStore',
	state: () => ({
    equipment: [
      "armor",
      "weapon",
      "inventory",
      "inventory_packs"
    ],

    ammunition: [
      "bolt",
      "arrow",
      "bullet",
    ]
	}),

  getters: {
    // SECTION - Tootal
    item_Equip_Arr: (stor) => (obj_arr, item) => {
      const MYStore = useMYStore();
      const eqip_lvl = MYStore.level_Filter_Arr(obj_arr);
			let arr = [];
			eqip_lvl?.forEach((el) =>
				el[item]?.forEach((sub_el) => arr.push(sub_el))
			);
			return arr;
		},

    gold_Equip_Numb: (stor) => (obj_arr) => {
      const MYStore = useMYStore();
      const eqip_lvl = MYStore.level_Filter_Arr(obj_arr);
      const res = eqip_lvl.reduce((acc, el) => el.gold ? acc + el.gold : acc, 0);
      return res;
    },
    // !SECTION - Tootal

    // SECTION - Race
    equipments_Race_Main_Arr() {
      const MYStore = useMYStore();
			return MYStore.level_Filter_Arr(MYStore.MY_Race.equipment);
		},

    equipments_Race_Ethnos_Arr() {
      const MYStore = useMYStore();
			return MYStore.level_Filter_Arr(MYStore.MY_Ethnos.equipment);
		},

    equipments_Race_Backstory_Arr() {
      const MYStore = useMYStore();
			return MYStore.level_Filter_Arr(MYStore.MY_Backstory.equipment);
		},

    equipments_Race_Custom_Arr() {
      const MYStore = useMYStore();
			return MYStore.filter_Custom_Race_Lvl("equipment");
		},

    equipments_Race_Params() {
			const race = this.equipments_Race_Main_Arr;
			const ethnos = this.equipments_Race_Ethnos_Arr;
      const backstory = this.equipments_Race_Backstory_Arr;
      const race_custom = this.equipments_Race_Custom_Arr;
			return [...race, ...ethnos, ...backstory, ...race_custom];
		},

    item_Equip_Race_Arr: (stor) => (item) => {
			return stor.item_Equip_Arr(stor.equipments_Race_Params, item);
		},

    weapons_Equip_Race() {
			return this.item_Equip_Race_Arr("weapon");
		},

    inventory_Equip_Race() {
			return this.item_Equip_Race_Arr("inventory");
		},

    packs_Equip_Race() {
			return this.item_Equip_Race_Arr("inventory_packs");
		},

    armors_Equip_Race() {
			return this.item_Equip_Race_Arr("armor");
		},

    gold_Equip_Race() {
			return this.gold_Equip_Numb(this.equipments_Race_Params);
		},
    // !SECTION - Race

    // SECTION - Castom
    equipments_Class_Main_Arr() {
      const MYStore = useMYStore();
			return MYStore.level_Filter_Arr(MYStore.MY_Class.equipment);
		},

    equipments_Class_Custom_Arr() {
      const MYStore = useMYStore();
			return MYStore.filter_Custom_Class_Lvl("equipment");
		},

    equipments_Class_Params() {
			const equip_class = this.equipments_Class_Main_Arr;
      const equip_custom = this.equipments_Class_Custom_Arr;
			return [...equip_class, ...equip_custom];
		},

    item_Equip_Class_Arr: (stor) => (item) => {
			return stor.item_Equip_Arr(stor.equipments_Class_Params, item);
		},

    weapons_Equip_Class() {
			return this.item_Equip_Class_Arr("weapon");
		},

    inventory_Equip_Class() {
			return this.item_Equip_Class_Arr("inventory");
		},

		packs_Equip_Class() {
			return this.item_Equip_Class_Arr("inventory_packs");
		},

    armors_Equip_Class() {
			return this.item_Equip_Class_Arr("armor");
		},

    gold_Equip_Class() {
			return this.gold_Equip_Numb(this.equipments_Class_Params);
		},
    // !SECTION - Castom

    // SECTION - ALL
		armor_Equip_Element() {
			return this.armors_Equip_Race[0]?.[0] ?? this.armors_Equip_Class[0]?.[0];
		},

    equipments_All_Params() {
			const race_param = this.equipments_Race_Params;
      const class_param = this.equipments_Class_Params;
			return [...race_param, ...class_param];
		},

    item_Equip_All_Arr: (stor) => (item) => {
			return stor.item_Equip_Arr(stor.equipments_All_Params, item);
		},

    weapons_Equip_All() {
			return this.item_Equip_All_Arr("weapon");
		},

    inventory_Equip_All() {
			return this.item_Equip_All_Arr("inventory");
		},

		packs_Equip_All() {
			return this.item_Equip_All_Arr("inventory_packs");
		},

    armors_Equip_All() {
			return this.item_Equip_All_Arr("armor");
		},

    gold_Equip_All() {
			return this.gold_Equip_Numb(this.equipments_All_Params);
		},

    inventory_Equip_Print() {
      const all = this.inventory_Equip_All;
      const filter = all.filter(el => !this.ammunition.includes(el[0].name));
			return filter;
		},

    ammunition_Equip_Print() {
      const all = this.inventory_Equip_All;
      const find = all.find(el => this.ammunition.includes(el[0].name));
			return find;
		},
    // !SECTION - ALL
  },
  
  actions: {
  }
});
