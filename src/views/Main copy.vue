<template>
	<!-- Left bar -->
	<div class="main-class">

		<!-- <div class="sidebar_left">
			<div class="main_chapter">
				<HeaderMenu />
				<div class="flex-col gap-4">
					<AppCharCard mob_menu v-if="!screen_Max" />
					<section v-if="!pages.race_page">
						<div class="back-page-grup">
							<AppBackPage :text_arr="arr_Name_Race_Page" @click="goPage('race_page')" />
							<AppBackPage v-if="!pages.class_page" :text_arr="arr_Name_Class_Page" @click="goPage('class_page')" />
						</div>
						<div class="delimiter mr-t-22" v-if="screen_Max" />
					</section>
				</div>
				<AppSliderName v-if="pages.race_page" numb="01" name="race" />
				<AppSliderName v-if="pages.class_page" numb="02" name="class" />
				<AppName v-if="pages.alignment_page" numb="03" title="name" v-model="MY.name" />
				<div class="delimiter" v-if="screen_Max" />
			</div>
			<div class="main_menu_wrap" @click="showHome()">
				<div class="main_chapter_menu">
					<RaceMenu v-if="pages.race_page" @click.stop />
					<ClassMenu v-if="pages.class_page" @click.stop />
					<AlignmentMenu v-if="pages.alignment_page" @click.stop />
				</div>
				<transition name="btm-fade" mode="out-in">
					<my-button v-if="shown_home" :numb="btn_Numb" :title="btn_Name" @click="btnGo()" />
					<my-button-back v-else title="command_back" @click="showHome()" />
				</transition>
			</div>
		</div> -->

		<Main__MenuBar/>
		
		<!-- Drop-down menu -->
		<div class="sidebar_wrap" :class="{ sidebar_wrap_open: setting_open }">
			<HeaderSettings />
			<RaceSettings v-if="pages.race_page" />
			<ClassSettings v-if="pages.class_page" />
			<AlignmentSettings v-if="pages.alignment_page" />
		</div>
		<div v-if="screen_Max" class="stripe-page"></div>
		<!-- Character -->
		<div class="represent" @click="showHome()" v-show="screen_Max && !PRINT_BLANK">
			<transition name="fade-body">
				<div class="character" :class="{
					active_eyes: race_page.shown.eyes_color || race_page.shown.hair_color,
					active_skin: race_page.shown.skin_color,
				}" :style="{
	height: Char_Hight_Back,
}">
					<WelcomeBanner />
					<RaceBody body_part="skin" />
					<RaceBody body_part="eyes" />
					<RaceBody body_part="hair" />
					<RaceBody body_part="class" v-if="!pages.race_page" />
					<transition name="slide-fade">
						<mySizeGrowth v-if="hide_Ruler" division zero skale_top />
					</transition>
				</div>
			</transition>
		</div>
		<!-- Character -->
		<!-- sidebar_right -->
		<div v-show="screen_Max && !PRINT_BLANK" class="sidebar_right" :class="{ sidebar_right_close: close_Sidebar_Right }">
			<RaceParameters v-if="pages.race_page" />
			<ClassParameters v-if="pages.class_page" />
			<AlignmentParameters v-if="pages.alignment_page" />
		</div>
	</div>

	<!-- alse -->
	<my-dialog-spell v-model:show="site_settings.print_dialog" finish>
		<section>
			<PromoSlider />
			<Donate class="pd-32" finish @getPdf="exportToPDF()" :progress="progress_load" />
		</section>
	</my-dialog-spell>

	<div v-if="site_settings.print_dialog || PRINT_BLANK" id="element-to-convert">
		<BlankPrint />
	</div>

	<!-- <PlagBanner v-if="!screen_Max"/> -->
</template>

<script>
import html2pdf from "html2pdf.js";

import { mapState, mapActions } from "pinia";
import { usePagesStore } from "@/stores/user/PagesStore";
import { useMYStore } from "@/stores/user/MYStore";
import { useFormStore } from "@/stores/modules/simple/FormStore";
import { useGenderStore } from "@/stores/modules/simple/GenderStore";
import { useFeatsStore } from "@/stores/modules/FeatsStore";

import MainApp from "@/components/main/MainApp.js";
export default {
	name: "Main",
	mixins: [MainApp],
	data() {
		return {
			small_screen: false,
			PRINT_BLANK: false,
			// PRINT_BLANK: true,
			progress_load: 0,
			loading_pdf: false,
		};
	},

	created() {
		this.getCreated();
		// window.addEventListener("resize", this.onResize);
		// this.onResize();
	},

	// destroyed() {
	// 	window.removeEventListener("resize", this.onResize);
	// },

	computed: {
		//STORES
		...mapState(useMYStore, [
			"MY",
			"MY_Race",
			"MY_Ethnos",
			"MY_Backstory",
			"MY_Class",
			"MY_Subclass"
		]),
		...mapState(usePagesStore, [
			"site_settings",
			"race_page",
			"class_page",
			"shown_home",
			"page_setting_open",
			"setting_open",
			"pages",
			"page_Open",
			"btn_Numb",
			"btn_Name",
			"screen_Max"
		]),

		...mapState(useFormStore, [
			"Get_Age",
			"Get_Weight",
			"Get_Height",
			"Char_Hight_Back",
		]),

		...mapState(useFeatsStore, [
			"feats_Condition_Pass_Name",
			"feats_Arr_Select_Id",
			"feats_Arr_Free",
		]),

		...mapState(useGenderStore, ["names_Arr"]),

		t_Lobby() {
			return this.T("lobby_welcome_title");
		},

		//GETTERS

		close_Sidebar_Right() {
			const open_class_page = this.pages.class_page;
			const feats =
				this.setting_open?.slice(0, 5) == "feats" && open_class_page;
			const stats = this.setting_open?.includes("stats") && open_class_page;
			const skills = this.setting_open?.includes("skills") && open_class_page;
			const many_spells =
				this.setting_open?.includes("many_spells") && open_class_page;
			return !this.shown_home && !(stats || feats || skills || many_spells);
		},

		hide_Ruler() {
			return (
				this.pages.race_page && (this.shown_home || this.race_page.shown.height)
			);
		},

		arr_Name_Race_Page() {
			let arr = [];
			arr.push(this.MY_Race.name);
			arr.push(this.MY_Ethnos.name);
			arr.push(this.MY_Backstory.name);
			return arr;
		},

		arr_Name_Class_Page() {
			let arr = [];
			arr.push(this.MY_Class.name);
			this.MY_Subclass?.name ? arr.push(this.MY_Subclass.name) : null;
			return arr;
		},
	},
	watch: {
		"MY_Race.name": "getWatch_Race",
		"MY_Class.name": "getWatch_Class",

		names_Arr(val, oldVal) {
			const incl = val.includes(this.MY.name);
			const user_name = this.site_settings.name_user;
			if (!incl && !user_name) this.getRandomName();
		},

		feats_Condition_Pass_Name(val, oldVal) {
			if (oldVal && val.toString() !== oldVal.toString()) {
				this.feats_Arr_Select_Id.forEach((el) => {
					if (el.id_btn == "feats") {
						const obj =
							this.MY._settings_class[this.MY_Class.name][el.id_link];
						const name = obj.feats[0].name;
						const includ = this.feats_Condition_Pass_Name.includes(name);
						const new_el = this.feats_Arr_Free[0];
						if (includ) {
							this.MY._settings_class[this.MY_Class.name][el.id_link] = {
								...obj,
								feats: [new_el],
							};
						}
					}
				});
			}
		},

	},

	methods: {
		...mapActions(useMYStore, ["getCreated"]),
		...mapActions(usePagesStore, [
			"showHome",
			"closeEthnos",
			"closeColor",
			"closePar",
			"goPage",
			"closeCustomSett",
			"btnGo",
		]),
		...mapActions(useGenderStore, ["getRandomName"]),

		// onResize() {
		// 	this.small_screen = window.innerWidth <= 1279;
		// },

		exportToPDF() {
			if (!this.loading_pdf) {
				this.loading_pdf = true;
				this.progress_load = 15;
				setTimeout(() => this.loadPdf(), 0.1);
			}
		},

		loadPdf() {
			const lvl = this.MY.level;
			const name = this.MY.name.length !== 0
				? this.MY.name
				: `${this.T("someone")}_${this.t(this.MY_Race.name)}`;

			const element = document.getElementById("element-to-convert");
			const opt = {
				margin: 0,
				filename: `${name}_LVL${lvl}.pdf`,
				image: { type: "jpeg", quality: 1 },
				html2canvas: {
					dpi: 150,
					scale: 1,
					// windowWidth: 1044,
					width: 2088,
					// height: 1223,
					imageTimeout: 30000,
					letterRendering: true,
					useCORS: true,
				},
				jsPDF: {
					unit: "pt",
					format: "a4",
					orientation: "portrait",
					// hotfixes: "px_scaling",
				},
			};

			html2pdf().set(opt).from(element).toContainer().then(() => this.progress_load = 85)
				.toCanvas().toImg().toPdf().save().then(() => this.progress_load = 100)
				.output().then(() => {
					setTimeout(() => this.progress_load = 0, 1000);
					setTimeout(() => this.loading_pdf = 0, 2000);
				});
		},

		getWatch_Race() {
			this.closeEthnos();
			this.closeColor("skin");
			this.closeColor("eyes");
			this.closeColor("hair");
			this.closeCustomSett();
			this.MY.height = this.Get_Height;
			this.MY.weight = this.Get_Weight;
			this.MY.age = this.Get_Age;
		},

		getWatch_Class() {
			this.closeCustomSett();
		},
	},
};
</script>

<style>
.main-class {
	display: flex;
	height: 100%;
	width: 100%;
	overflow-x: hidden;
}

.main-class::-webkit-scrollbar {
	width: 0;
}

.delimiter {
	height: 1px;
	background: rgba(255, 255, 255, 0.2);
}

.sidebar_left {
	padding-top: 32px;
	width: 320px;
	background-color: #0e1518;
	display: flex;
	flex-direction: column;
}

.main_chapter {
	padding: 0 32px 0 32px;
	display: flex;
	flex-direction: column;
	gap: 22px;
}

.back-page-grup {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.main_menu_wrap {
	display: flex;
	flex-direction: column;
	overflow-y: scroll;
	overflow-x: hidden;
	scrollbar-width: none;
	flex: 1 1 auto;
}

.main_menu_wrap::-webkit-scrollbar {
	width: 0;
}

.main_chapter_menu {
	height: 100%;
	padding: 40px 32px 32px 32px;
	overflow-y: scroll;
	scrollbar-width: none;
}

.main_chapter_menu::-webkit-scrollbar {
	width: 0;
}

@media (max-width: 1279px) {
	.main-class {
		display: flex;
		justify-content: center;
		height: 100%;
		width: 100%;
		overflow-y: scroll;
		scrollbar-width: none;
	}

	.main-class::-webkit-scrollbar {
		width: 0;
	}

	.sidebar_left {
		width: 100%;
		max-width: 434px;
		padding-top: 20px;
	}

	.main_chapter {
		padding: 0 20px 0 20px;
		gap: 26px;
	}

	.back-page-grup {
		gap: 4px;
	}

	.main_menu_wrap {
		overflow-y: visible;
		overflow-x: visible;
	}

	.main_chapter_menu {
		padding: 34px 20px 26px 20px;
		overflow-y: visible;
	}
}

.btm-fade-enter-active {
	transition: all 0.2s ease-in-out;
}

.btm-fade-leave-active {
	transition: all 0.2s ease-in-out;
}

.btm-fade-enter-from,
.btm-fade-leave-to {
	transform: translateX(-300px);
	opacity: 0;
}

/* ---------------------characters----------------------*/

.represent {
	padding: 32px;
	flex: 1 1 auto;
	display: flex;
	background-color: #0e1518;
	z-index: 2;
	overflow: hidden;
}

.character {
	width: 100%;
	height: 100%;
	position: relative;
	transition-duration: 0.8s;
	transition-timing-function: ease-in-out;
}

.character>img {
	position: absolute;
	bottom: 0;
	right: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, 0%);
	-ms-transform: translate(-50%, 0%);
	transform: translate(-50%, 0%);
	transition-duration: 0.8s;
	transition-timing-function: ease-in-out;
}

.character>svg {
	position: absolute;
	bottom: 0;
	right: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, 0%);
	-ms-transform: translate(-50%, 0%);
	transform: translate(-50%, 0%);
	transition-property: all, fill;
	transition-duration: 0.8s, 0.1s;
	transition-timing-function: ease-in-out;
}

.active_eyes {
	align-self: flex-start;
	transition-property: all;
	transition-duration: 0.8s;
	transition-timing-function: ease-in-out;
}

.active_skin {
	align-self: flex-start;
	transition-property: all;
	transition-duration: 0.8s;
	transition-timing-function: ease-in-out;
}

/* ---------------------sidebar_right----------------------*/

.sidebar_wrap {
	height: 100%;
	display: flex;
	width: 0;
	transition: all 0.4s ease-in-out;
	position: relative;
}

.sidebar_wrap_open {
	width: 426px;
	transition: all 0.4s ease-in-out;
}

.sidebar_right {
	min-width: 426px;
	max-width: 426px;
	padding: 32px;
	overflow-y: scroll;
	scrollbar-width: none;
	background-color: #0e1518;
	z-index: 2;
	transition: all 0.4s ease-in-out;
}

.sidebar_right::-webkit-scrollbar {
	width: 0;
}

.sidebar_right_close {
	margin-right: -426px;
	opacity: 0;
	transition: all 0.4s ease-in-out;
}

.story {
	max-width: 362px;
	color: rgba(255, 255, 255, 0.4);
	text-align: start;
}

.story h3 {
	font-family: "Inter-700";
	font-style: normal;
	font-weight: normal;
	font-size: 13px;
	line-height: 15px;
	letter-spacing: 0.02em;
	color: #ffffff;
	margin-top: 26px;
	margin-bottom: 5px;
}

.story-print h3 {
	font-family: "Inter-600";
	font-style: normal;
	font-weight: normal;
	font-size: 28px;
	line-height: 30px;
	letter-spacing: 0.02em;
	margin-top: 26px;
	margin-bottom: 10px;
}

.fade-body-enter-active,
.fade-body-leave-active {
	transition: opacity 0.3s ease-in-out;
}

.fade-body-enter-from,
.fade-body-leave-to {
	opacity: 0;
}

.slide-fade-enter-active {
	transition: all 0.8s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateX(20px);
	opacity: 0;
}

/* ---------------------sidebar_right----------------------*/
</style>
