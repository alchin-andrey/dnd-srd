<template>
	<div class="spell-wrapp">
		<div>
      <div class="spell-baner int-400">
        <AppSpells :spell_obj="spell_Obj" qr_form />
      </div>
		</div>
	</div>
</template>

<script>
import { mapState, mapWritableState } from "pinia";
import { useDicStore } from "@/stores/general/DicStore";
import { useMYStore } from "@/stores/user/MYStore";
import { usePagesStore } from "@/stores/user/PagesStore";
import { useSpellsStore } from "@/stores/modules/SpellsStore";
export default {
	name: "SpellForm",
  data() {
		return {
			first_lvl: null,
			first_select_lang: null,
		};
	},
  created() {
		this.getCreatedSpell();
	},
	computed: {
    ...mapWritableState(useDicStore, ["select_lang"]),
    ...mapState(useMYStore, ["MY"]),
    ...mapState(usePagesStore, ["site_settings", "links"]),
		...mapState(useSpellsStore, ["spells", "mods"]),

    spell_Obj() {
      const id_link = this.$route.params.id;
      const query = this.$route.query;
			const spell_arr = this.spells[id_link];

      let spell_obj = { spell: spell_arr, param: query, };
      const mod_id = this.$route.query?.m;
      if (mod_id) {
        const mod = this.mods.m.find(el => el.id == mod_id);
        spell_obj = {...spell_obj, mod: mod}
      }
			return spell_obj;
    },
	},

  methods: {
    getCreatedSpell() {
      const query = this.$route.query;
      if(query) {
        if(!this.site_settings.save.MY_level) {
          this.site_settings.save.MY_level = this.MY.level;
        }
        this.MY.level = query?.l ? Number(query.l) : this.MY.level;

        if(!this.site_settings.save.select_lang) {
          this.site_settings.save.select_lang = this.select_lang;
        }
        this.select_lang = query?.ln ?? this.select_lang;

        this.links.stats_link.strength = query?.st ? Number(query?.st) : null;
        this.links.stats_link.dexterity = query?.de ? Number(query?.de) : null;
        this.links.stats_link.constitution = query?.co ? Number(query?.co) : null;
        this.links.stats_link.intelligence = query?.in ? Number(query?.in) : null;
        this.links.stats_link.wisdom = query?.wi ? Number(query?.wi) : null;
        this.links.stats_link.charisma = query?.ch ? Number(query?.ch) : null;
      }
    },
  },

};
</script>

<style scoped>
.spell-wrapp {
  width: 100%;
  display: flex;
  justify-content: center;
	padding: 10px;
  height: 100%;
}

.spell-baner {
	padding: 28px;
	background: #1c2326;
	border-radius: 12px;
  width: 396px;
	overflow-y: scroll;
	scrollbar-width: none;
  max-height: 100%;
}

.spell-baner::-webkit-scrollbar {
	width: 0;
}
</style>
