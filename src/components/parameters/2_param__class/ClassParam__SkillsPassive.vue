<template>
	<AppWrapper v-if="all" :hr="hr">
		<AppSkills
			v-for="skill in skills_passive"
			:key="skill"
			:title="skill.name"
			:numb="skills_passive_All_Numb(skill.name)"
		/>
	</AppWrapper>
	<AppWrapper v-else-if="shown_Skills_Passive" :hr="hr">
		<AppSkills
			v-for="name in skills_passive_Class_Param"
			:key="name"
			:title="name"
			:numb="skills_passive_Class_Numb(name)"
			:second_numb="skills_passive_RP_MOD_Numb(name)"
		/>
	</AppWrapper>
</template>

<script>
import { mapState } from "pinia";
import { useSkillsStore } from "@/stores/modules/SkillsStore";

export default {
	name: "ClassParam__SkillsPassive",
	props: {
		hr: {
			type: Boolean,
			default: false,
		},
		all: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		...mapState(useSkillsStore, [
			"skills_passive",
			"skills_passive_Class_Param",
			"skills_passive_RP_MOD_Numb",
			"skills_passive_Class_Numb",
			"skills_passive_All_Numb",
		]),

		shown_Skills_Passive() {
			return this.skills_passive_Class_Param.length !== 0;
		},
	},
};
</script>
