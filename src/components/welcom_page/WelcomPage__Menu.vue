<template>
	<div class="pd-rl-32">
		<section class="jbm-300 flex-col gap-18">
			<a href="#welcom-part1">{{ t("lobby_menu_1") }}</a>
			<a href="#welcom-part2">{{ t("lobby_menu_2") }}</a>
			<a href="#welcom-part3">{{ t("lobby_menu_3") }}</a>
			<a href="#welcom-part4">{{ t("lobby_menu_4") }}</a>
		</section>
		
		<section class="int-700 flex-col gap-4 mr-t-54">
			<AppBtmLink
			class="btm-blue"
			@click="goTo('/')"
			name="how_to_start_2_title" 
			/>
			<AppBtmLink 
			name="lobby_support_project" 
			icon="donate" 
			link="https://www.buymeacoffee.com/dndme" 
			/>
		</section>
	</div>
</template>
<script>

export default {
	name: "WelcomPage__Menu",
	methods: {
		goTo(route) {
        this.$router.push(route);
      },
	},
};
</script>
