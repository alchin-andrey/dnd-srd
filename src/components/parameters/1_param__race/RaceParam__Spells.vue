<template>
	<AppWrapper v-if="shown_Spells_All" gap="26" :hr="hr">
		<AppSpells
			v-for="item in spells_Race_Param"
			:key="item"
			:spell_obj="item"
      param
		/>
	</AppWrapper>
</template>

<script>
import { mapState } from "pinia";
import { useSpellsStore } from "@/stores/modules/SpellsStore";

export default {
	name: "RaceParam__Spells",
	props: {
		hr: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		...mapState(useSpellsStore, [
      "spells_Race_Param",
    ]),

		shown_Spells_All() {
			return this.spells_Race_Param.length !== 0;
		},
	},
};
</script>
