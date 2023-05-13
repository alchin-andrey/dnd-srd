// import { ref, computed } from "vue";
// import { mapState } from "pinia";
import { defineStore } from "pinia";
import { useMYStore } from "@/stores/user/MYStore";
import { useMainStore } from "@/stores/general/MainStore";
import { usePagesStore } from "@/stores/user/PagesStore";

import { useStatsStore } from "@/stores/modules/StatsStore";
import { useProficienciesStore } from "@/stores/modules/ProficienciesStore";
import { useSpellsStore } from "@/stores/modules/SpellsStore";

import feats_srd from "@/assets/catalog/base_data/srd/list_feats.js";
import feats_phb from "@/assets/catalog/base_data/phb/list_feats.js";

export const useFeatsStore = defineStore({
	id: "FeatsStore",
	state: () => ({
		feats_srd: feats_srd,
		feats_phb: feats_phb,
		stats_2: [
			{
				name_set: "strength",
				stats: [{ name: "strength", num: 2, details: "strength_details" }],
			},
			{
				name_set: "dexterity",
				stats: [{ name: "dexterity", num: 2, details: "dexterity_details" }],
			},
			{
				name_set: "constitution",
				stats: [
					{ name: "constitution", num: 2, details: "constitution_details" },
				],
			},
			{
				name_set: "intelligence",
				stats: [
					{ name: "intelligence", num: 2, details: "intelligence_details" },
				],
			},
			{
				name_set: "wisdom",
				stats: [{ name: "wisdom", num: 2, details: "wisdom_details" }],
			},
			{
				name_set: "charisma",
				stats: [{ name: "charisma", num: 2, details: "charisma_details" }],
			},
		],
		stats_1_1: [
			{
				name_set: "strength",
				stats: [{ name: "strength", num: 1, details: "strength_details" }],
			},
			{
				name_set: "dexterity",
				stats: [{ name: "dexterity", num: 1, details: "dexterity_details" }],
			},
			{
				name_set: "constitution",
				stats: [
					{ name: "constitution", num: 1, details: "constitution_details" },
				],
			},
			{
				name_set: "intelligence",
				stats: [
					{ name: "intelligence", num: 1, details: "intelligence_details" },
				],
			},
			{
				name_set: "wisdom",
				stats: [{ name: "wisdom", num: 1, details: "wisdom_details" }],
			},
			{
				name_set: "charisma",
				stats: [{ name: "charisma", num: 1, details: "charisma_details" }],
			},
		],
	}),

	getters: {

    feats_Obj() {
      const MainStore = useMainStore();
      return MainStore.srd ? this.feats_srd : this.feats_phb;
		},

		feats_Arr() {
      const new_arr = Object.values(this.feats_Obj);
			return new_arr;
		},

    feats_Arr_Select_Id() {
      const arr_select = this.feats_Select_Arr.reduce((acc, el) => {
        if(el.id_btn == "feats") return acc.concat(el);
        return acc;
      }, []);
      return arr_select;
    },

    feats_Arr_Free() {
      const arr_select = this.feats_Arr_Select_Id.reduce((acc, el) => acc.concat(el.select_list), []);
      const arr_condition_pass = this.feats_Condition_Pass;
      const arr_all = [...arr_select, ...arr_condition_pass];
      const arr_free = this.feats_Arr.filter(el => !arr_all.some(item => item.name == el.name));
			return arr_free;
		},

    feats_Condition() {
      const new_arr = this.feats_Arr.filter(el => el.filter);
			return new_arr;
		},

    feats_Condition_Pass() {
      const new_arr = this.feats_List_Filter(this.feats_Condition);
			return new_arr;
		},

    feats_Condition_Pass_Name() {
      const all_name = this.feats_Condition_Pass.reduce((acc, el) => acc.concat(el.name), []);
			return all_name;
		},

		feats_Settings_Class() {
			const MYStore = useMYStore();
			const sett_lvl = MYStore.level_Filter_Arr(MYStore.MY_Class.settings);
			const sett_for_type = sett_lvl.filter((el) => el.type == "feats");
			let new_arr = [];
			sett_for_type?.forEach((item, i) => {
				const link_type_i = `feats__${i}`;
				new_arr.push({
					...item,
					id_link: link_type_i,
				});
			});
			return new_arr;
		},

		feats_Stats_2_Arr() {
			return this.getStatsForFeatsArr("stats_2", 1);
		},

		feats_Stats_1_1_Arr() {
			return this.getStatsForFeatsArr("stats_1_1", 2);
		},

		feats_Feats_Arr() {
			return this.getFeatsForFeatsArr(this.feats_Arr);
		},

		feats_Select_Arr() {
			const MYStore = useMYStore();
			const sett_select = MYStore.MY._settings_class[MYStore.MY_Class.name];
			const feats_lvl = this.feats_Settings_Class;
			let new_arr = [];
			feats_lvl?.forEach((item) => {
				const select_save = sett_select?.[item.id_link];
				let select_list = [];
				let btn_link = "stats_2";
				if (select_save) {
					const btn_save = select_save.id_btn;
					btn_link = btn_save;
					if (btn_save == "stats_2") {
						const stats_2 = this.feats_Stats_2_Arr.find(
							(el) => el.id_link == item.id_link
						);
						select_list = stats_2.select_list;
					} else if (btn_save == "stats_1_1") {
						const stats_1_1 = this.feats_Stats_1_1_Arr.find(
							(el) => el.id_link == item.id_link
						);
						select_list = stats_1_1.select_list;
					} else if (btn_save == "feats") {
						const feats = this.feats_Feats_Arr.find(
							(el) => el.id_link == item.id_link
						);
						select_list = feats.select_list;
					}
				} else {
					const stats_2 = this.feats_Stats_2_Arr.find(
						(el) => el.id_link == item.id_link
					);
					select_list = stats_2.select_list;
				}

				new_arr.push({
					...item,
					id_btn: btn_link,
					select_list: select_list,
				});
			});
			return new_arr;
		},
	},

	actions: {

    feats_List_Filter(arr) {
			const filter_arr = arr.filter((el) => {
				if (el.filter?.stats) {
					return !this.feats_List_Filter_MinBaseStats(el.filter.stats);
				} else if (el.filter.proficiencies?.armor) {
					return !this.feats_List_Filter_ArmorMastery(
						el.filter.proficiencies?.armor
					);
				} else if (el.filter?.spells_exception) {
					return !this.feats_List_Filter_SpellsException(
						el.filter.spells_exception
					);
				} else {
					return true;
				}
			});
			return filter_arr;
		},

		feats_List_Filter_MinBaseStats(arr) {
			const StatsStore = useStatsStore();
			let res = false;
			arr.forEach((item) => {
				const base_stats_name = item.name;
				const base_stats_num = StatsStore.stats_Numb(base_stats_name);
				res = base_stats_num >= item.min_num || res;
			});
			return res;
		},

		feats_List_Filter_ArmorMastery(arr) {
			const ProficienciesStore = useProficienciesStore();
			let res = false;
			const base_pof_name = ProficienciesStore.proficiencies_Page_Arr("armor");
			arr.forEach((item) => {
				res = base_pof_name.includes(item) || res;
			});
			return res;
		},

		feats_List_Filter_SpellsException(arr) {
			const SpellsStore = useSpellsStore();
			let res = false;
			const spell_arr = SpellsStore.spells_For_Arr_Obj(SpellsStore.spells_Page_Arr);
			let all_type = spell_arr.reduce(
				(acc, el) => acc.concat(el.find((item) => item.type).type),
				[]
			);
			const uniqu_type = [...new Set(all_type)];
			arr.forEach((item) => {
				res = uniqu_type.some((el) => el !== item.type) || res;
			});
			return res;
		},

		getFeatsForFeatsArr(arr) {
			const link_btn = "feats";
			const MYStore = useMYStore();
			const sett_select_old =
				MYStore.MY._settings_class_old[MYStore.MY_Class.name];
			const sett_select = MYStore.MY._settings_class[MYStore.MY_Class.name];
			const feats_lvl = this.feats_Settings_Class;
			let list = arr;
			let select_list_all = [];
			let save_list_old = [];
			let new_arr = [];
			feats_lvl?.forEach((item) => {
				const select_save_old = sett_select_old?.[item.id_link]?.[link_btn];
				const btn_save_old = sett_select_old?.[item.id_link]?.id_btn;
				if (select_save_old && btn_save_old == "feats") {
					save_list_old.push(select_save_old[0].name);
				}
			});

			feats_lvl?.forEach((item) => {
				const btn_save_old = sett_select_old?.[item.id_link]?.id_btn;

				const select_save = sett_select?.[item.id_link]?.[link_btn];
				const btn_save = sett_select?.[item.id_link]?.id_btn;

				let select_list = [];
				if (btn_save == "feats") {
					const includ_select = select_list_all.some(
						(el) => el.name == select_save?.[0]?.name
					);
					const includ_save_old = save_list_old.some(
						(el) => el == select_save?.[0]?.name
					);
					const includ_null = list.some(
						(el) => el.name == select_save?.[0]?.name
					);
					if (btn_save == btn_save_old && includ_null) {
						select_list = select_save;
						const sett = MYStore.MY._settings_class;
						MYStore.MY._settings_class_old = JSON.parse(JSON.stringify(sett));
					} else if (
						select_save &&
						!includ_select &&
						!includ_save_old &&
						includ_null
					) {
						select_list = select_save;
					} else {
						const list_select_includ = list.filter(
							(el) => !save_list_old.includes(el.name)
						);
						select_list.push(list_select_includ[0]);
						MYStore.MY._settings_class[MYStore.MY_Class.name][item.id_link][
							link_btn
						] = select_list;
					}
				} else {
					select_list.push(list[0]);
				}

				new_arr.push({
					...item,
					name: link_btn,
					select_list: select_list,
					list: list,
				});
				if (btn_save == "feats") {
					list = list.filter((el) => !select_list.some(item => item.name == el.name));
					select_list_all = select_list_all.concat(select_list);
				}
			});
			let feats_arr = [];
			const list_all = arr;
			new_arr.forEach((item) => {
				const select_list_all_includ = select_list_all.filter(
					(el) => !item.select_list.some(item => item.name == el.name)
				);
				const new_list = list_all.filter(
					(el) => !select_list_all_includ.some(item => item.name == el.name)
				);
				feats_arr.push({
					...item,
					list: new_list,
				});
			});
			return feats_arr;
		},

		getStatsForFeatsArr(link_btn, select_numb) {
			const MYStore = useMYStore();
			const sett_select = MYStore.MY._settings_class[MYStore.MY_Class.name];
			const feats_lvl = this.feats_Settings_Class;
			let new_arr = [];
			feats_lvl?.forEach((item) => {
				const select_save = sett_select?.[item.id_link]?.[link_btn];
				const list = this[link_btn];

				let select_list = [];
				if (select_save) {
					select_list = select_save;
				} else {
					for (let i = 0; i < select_numb; i += 1) {
						select_list.push(list[i]);
					}
				}

				new_arr.push({
					...item,
					name: link_btn,
					select_list: select_list,
					list: list,
				});
			});
			return new_arr;
		},
	},
});
