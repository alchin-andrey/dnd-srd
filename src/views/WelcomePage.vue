<template>
	<div class="flex-row h-100">
		<section v-if="screen_Max" class="flex-col pd-t-32 min-w-320">
			<div class="flex-row-c gap-4 pd-rl-32 h-28">
				<AppLogoCard @click="goTo('/')"/>
				<div class="int-700 cur-p buff" @click="goTo('/')">rpg-me.club</div>
			</div>
			<div class="h-100 flex-col-sb mr-t-84">
				<WelcomPage__Menu />
				<my-button-back title="command_back" @click="goTo('/')" />
			</div>
		</section>
		<div v-if="screen_Max" class="stripe-page" />
		<main class="w-100">
			<div v-if="!screen_Max" class="mob-header flex-col-c-jc">
				<div class="flex-row-sb-c pd-rl-20">
					<div class="jbm-300 cur-p buff" @click="goTo('/')">rpg-me.club</div>
					<AppBtmLink
					class="btm-blue w-200"
					@click="goTo('/')"
					name="how_to_start_2_title"
					/>
				</div>
			</div>
		
			<section class="welcom-wrapp">
				<div class="h-100">
					<div class="welcom-content">
						<WelcomPage__WhatDND id="welcom-part1" class="pd-t-32" />
						<WelcomPage__Start id="welcom-part2" class="mr-t-32 pd-t-32"/>
						<WelcomPage__Masters id="welcom-part3" class="mr-t-64 pd-t-32"/>
						<WelcomPage__Game id="welcom-part4" class="mr-t-64 pd-t-32"/>
						<WelcomPage__Footer class="mr-t-102"/>
						<div class="int-400 white-04 mr-t-102" v-html="t('lobby_footer')"/>
					</div>
				</div>
			</section>
		</main>
	</div>
</template>
<script>

import { mapActions, mapState } from "pinia";
import { useMYStore } from "@/stores/user/MYStore";
import { usePagesStore } from "@/stores/user/PagesStore";

import PlagBanner from "@/components/PlagBanner.vue";
import WelcomPage__Menu from "@/components/welcom_page/WelcomPage__Menu.vue";
import WelcomPage__WhatDND from "@/components/welcom_page/WelcomPage__WhatDND.vue";
import WelcomPage__Start from "@/components/welcom_page/WelcomPage__Start.vue";
import WelcomPage__Masters from "@/components/welcom_page/WelcomPage__Masters.vue";
import WelcomPage__Game from "@/components/welcom_page/WelcomPage__Game.vue";
import WelcomPage__Footer from "@/components/welcom_page/WelcomPage__Footer.vue";

export default {
	name: "WelcomePage",
	components: {
    PlagBanner,
		WelcomPage__Menu,
		WelcomPage__WhatDND,
		WelcomPage__Start,
		WelcomPage__Masters,
		WelcomPage__Game,
		WelcomPage__Footer,
	},

	created() {
		this.getCreated();
	},

	computed: {
		...mapState(usePagesStore, ["screen_Max"]),

		// styl_Wrapp() {
		// 	if(this.screen_Max) return 'int-700-20 pd-20-28';
		// 	return 'int-700 pd-16';
		// },
	},

	methods: {
		...mapActions(useMYStore, ["getCreated"]),

		goTo(route) {
        this.$router.push(route);
      },
	},
};
</script>

<style scoped>
.h-28 {
	height: 28px;
}

.welcom-wrapp {
	width: 100%;
	background-image: url(@/assets/img/other/welcome_image_20_grad.png);
	background-position: 0 0;
	background-repeat: repeat-x;
	background-size: 1600px 496px;
	overflow-y: scroll;
	scrollbar-width: none;
	scroll-behavior: smooth;
	height: 100%;
}
.welcom-wrapp::-webkit-scrollbar {
	width: 0;
}

.welcom-content {
	width: 956px;
	padding: 0 32px 32px;
}

.min-w-320 {min-width: 320px;}
.w-200 {width: 200px;}

@media (max-width: 1279px) {
	.welcom-wrapp {
		display: flex;
		justify-content: center;
		background-position: 50% 0;
		height: calc(100% - 88px);
	}
}

@media (max-width: 955px) {
	.welcom-content {
		width: 444px;
		padding: 0 0 32px 0;
	}
}

@media (max-width: 480px) {
	.welcom-content {
		width: 362px;
	}
}
</style>
