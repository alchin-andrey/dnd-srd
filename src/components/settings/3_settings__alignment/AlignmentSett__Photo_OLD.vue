<template>
	<My-Selection-Box :shown="alignment_page.shown.photo" title="photo" :select="photo_Select" mob_fixed>
		<AppCardWrapp :active_card="!MY.param.user_photo" @click="getPhotoStatus(false)">
			<div class="int-700">{{ T('standard') }}</div>
		</AppCardWrapp>
		<AppCardWrapp gap="26" :active_card="MY.param.user_photo"
			:passive="!active_Custom_Photo || MY.param.user_photo" @click="getPhotoStatus(active_Custom_Photo)" no_blur>
			<main class="flex-col gap-8">

				<section
				ref="myFileBox"
				class="input-box" 
				:class="{
					'hov cur-p': !MY.custom_photo,
					'animation--error-photo-upload': errors.file_photo,
				}" 
				:style="stule_Img_Obj"
				>
					<label for="">
						<input type="file" ref="myFile" id="myFile" size="50" accept="image/*" @change="onChange($event)">
						<!-- <AppSvg class="svg-54 svg-main-f" name="upload"/> -->
					</label>
					<div 
					v-if="MY.custom_photo" 
					class="plag-photo-load"
					:class="{'animation--error-photo-upload': errors.file_photo}" 
					></div>
					<template v-if="size_Cover && MY.custom_photo">
						<AppRangPhoto :class="[style_Rang_Photo]" v-if="pos_Rang_Photo"
							v-model.number="MY.param.sett_photo.position" :orientation="pos_Rang_Photo" :pad="padding_Rang_Photo"
							@click.stop />
					</template>
				</section>

				<section class="grit-btm" v-if="MY.custom_photo">
					<AppBtmIcon icon="photo_fill" @click="getPosition(true)" :active_btm="MY.param.sett_photo.size_cover"
						@click.stop />
					<AppBtmIcon icon="photo_fit" @click="getPosition(false)" :active_btm="!MY.param.sett_photo.size_cover"
						@click.stop />
					<AppBtmIcon icon="delete" @click="delPhoto()" @click.stop />
				</section>
				<AppTooltip
					v-if="!MY.custom_photo" 
					class="pos-rel"
					text="url_photo_error"
					:shown="errors.url_photo"
					error
				>
					<label 
					class="photo-url flex-row" 
					for="url"
					>
						<input 
							ref="urlPhoto" 
							type="url"
							name="url"
							class="int-700"
							:class="{'error-text': errors.url_photo}"
							:placeholder="T('enter_url')"
							pattern="https://.*" 
							size="30"
							@keyup.enter="onChangeUrl($event)"
							@input="onInputUrl($event)"
						>
					</label>
				</AppTooltip>
			</main>

			<section>
				<div class="int-700 pos-rel">{{ T('your_image') }}</div>
				<div class="int-400 white-04 mr-t-4">{{ T('your_image_details') }}</div>
			</section>

			<section class="int-400 flex-row gap-32">
				<a @click.stop target="_blank" :href="photo_Link_Hero">{{ T('edit_photo') }}</a>
				<a @click.stop target="_blank" :href="photo_Link_Pinterest">{{ T('choose_photo') }}</a>
			</section>

		</AppCardWrapp>
	</My-Selection-Box>
</template>

<script>
import { mapState, mapActions } from "pinia";
import { usePagesStore } from "@/stores/user/PagesStore";
import { useMYStore } from "@/stores/user/MYStore";
import { useAlignmentStore } from "@/stores/modules/AlignmentStore";
export default {
	name: "AlignmentSett__Photo",
	data() {
		return {
			errors: {
				file_photo: false,
				url_photo: false,
			},

			upload: `url("data:image/svg+xml,%3Csvg width='36' height='54' viewBox='0 0 36 54' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 26.3251L2.30369 28.6283L16.1903 14.4785V53.9664H19.4809V14.4127L33.6307 28.6283L36 26.2591L17.8356 8.09465L0 26.3251Z' fill='white'/%3E%3Cpath d='M1.11882 0H34.8151V3.29065H1.11882V0Z' fill='white'/%3E%3C/svg%3E")`,
		};
	},

	mounted() {
		document.addEventListener("paste", this.pastePhoto);
		document.addEventListener("drop", this.dropPhoto);
		document.addEventListener("dragover", this.dragoverPhoto);
	},

	beforeUnmount() {
		document.removeEventListener("paste", this.pastePhoto);
		document.removeEventListener("drop", this.dropPhoto);
		document.removeEventListener("dragover", this.dragoverPhoto);
	},

	computed: {
		...mapState(useMYStore, ["MY", "MY_Race", "MY_Class"]),
		...mapState(usePagesStore, ["alignment_page", "shown_home"]),
		...mapState(useAlignmentStore, [
			"photo_Select",
			"photo_Link_Hero", 
			"photo_Link_Pinterest",
			// "errors",
		]),

		stule_Img_Obj() {
			if (this.active_Custom_Photo) {
				const pos = this.MY.param.sett_photo.position + '%';
				let size = 'cover';
				if (!this.MY.param.sett_photo.size_cover) {
					size = 'contain';
				}
				const pos_num = this.size_Cover ? pos : '50%';
				return {
					'background-image': `url(${this.MY.custom_photo})`,
					'background-size': size,
					'background-position': `${pos_num} ${pos_num}`,
				}
			}
			return { 'background-image': this.upload };
		},

		active_Curd() {
			return Boolean(this.MY.custom_photo) && this.MY.param.user_photo
		},

		active_Custom_Photo() {
			return Boolean(this.MY.custom_photo)
		},

		size_Cover() {
			return this.MY.param.sett_photo.size_cover
		},

		ratio_Rang_Photo() {
			const maim_rang = this.alignment_page.ratio_photo;
			const photo_rang = this.MY.param.sett_photo.ratio;
			return maim_rang - photo_rang;
		},

		pos_Rang_Photo() {
			if (this.ratio_Rang_Photo < 0) return 'horizontal';
			if (this.ratio_Rang_Photo > 0) return 'vertical';
		},

		padding_Rang_Photo() {
			if (this.ratio_Rang_Photo < 0) return 10;
			if (this.ratio_Rang_Photo > 0) return 8;
		},

		style_Rang_Photo() {
			if (this.ratio_Rang_Photo < 0) return 'rang-rl';
			if (this.ratio_Rang_Photo > 0) return 'rang-tb';
		},
	},

	methods: {
		// ...mapActions(useAlignmentStore, [
		// 	"onChange",
		// 	"onChangeUrl",
		// 	"onInputUrl",
		// 	"pastePhoto",
		// 	"dropPhoto",
		// 	"dragoverPhoto",
		// ]),

		...mapActions(usePagesStore, ["showSettings__Alignment"]),

		getPhotoStatus(bool) {
			this.MY.param.user_photo = bool;
		},

		readImg(link, file) {
			let src = link;
			if(!file) {
				const path = 'https://'
				src = link.substr(0, 4) == 'http' ? link : path + link;
				if (this.$refs.urlPhoto) {
					this.$refs.urlPhoto.value = src;
				}
			};
			const img = new Image();
			img.onerror = () => {
				this.fileError();
				if (!file) {this.errors.url_photo = true;}
			};
			img.onload = () => {
				this.MY.param.sett_photo.ratio = img.width / img.height;
				this.MY.custom_photo = src;
				this.MY.param.user_photo = true;
				this.errors.url_photo = false;
				this.errors.file_photo = false;

				if(!this.alignment_page.shown.photo) {
					const time = this.shown_home ? 200 : 0;
					setTimeout(() => this.showSettings__Alignment('photo'), time);
				}
			}
			img.src = src;
		},

		readPhotoFile(file) {
			this.errors.file_photo = false;
			let reader = new FileReader();
				reader.readAsDataURL(file);
				reader.addEventListener("load", (el) => {
					if (el.target.result) {
						this.readImg(el.target.result, true)
					}
			});
		},

		fileError() {
			this.errors.file_photo = false;
				setTimeout(() => {
				this.errors.file_photo = true;
				if(!this.MY.custom_photo && this.$refs.myFile) {
					this.$refs.myFile.value = '';
				}
			}, 4);
		},

		onChange(event) {
			const image_file = event.target.files[0].type.includes("image")
			if (image_file) {
				this.readPhotoFile(event.target.files[0], true)
			} else {
				this.fileError();
			}
		},

		// onPasteUrl(event) {
		// 	setTimeout(() => {
		// 		const link = event.target.value;
		// 		this.readImg(link);
		// 	}, 0);
		// },

		onChangeUrl(event) {
			const link = event.target.value;
			if(link) {
				this.readImg(link);
			}
		},

		onInputUrl(event) {
			const link = event.target.value;
			if(link == '') this.errors.url_photo = false;
		},

		sequencingProcess(el) {
			const item = Array.from(el.items).find(x => /^image\//.test(x.type));
			if (item) {
				this.readPhotoFile(item.getAsFile())
			} else {
				const link = el.getData('Text');
				if(link) {
					this.readImg(link);
				} else {
					this.fileError();
				}
			}
		},

		pastePhoto(event) {
			// if(this.alignment_page.shown.photo) {
			this.sequencingProcess(event.clipboardData)
			// }
		},

		dropPhoto(event) {
			this.sequencingProcess(event.dataTransfer);
			event.preventDefault();
		},

		dragoverPhoto(event) {
			event.preventDefault();
		},

		getPosition(bool) {
			this.MY.param.sett_photo.size_cover = bool;
		},

		delPhoto() {
			this.MY.param.sett_photo.size_cover = true;
			this.MY.param.sett_photo.position = 50;

			this.errors.file_photo = false;
			this.errors.url_photo = false;

			this.MY.custom_photo = null;
			this.MY.param.user_photo = false;
			this.$refs.myFile.value = '';
		},
	},
};
</script>

<style scoped>
.grit-btm {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: 48px;
	gap: 8px;
}

.input-box {
	position: relative;
	width: 100%;
	height: 480px;
	background-color: rgba(255, 255, 255, 0.06);
	background-repeat: no-repeat;
	background-position: 50%, 50%;
	border-radius: 6px;
	overflow: hidden;
}

.plag-photo-load {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 10;
}

.rang-rl {
	position: absolute;
	bottom: 8px;
	left: 8px;
	right: 8px;
	z-index: 100;
}

.rang-tb {
	position: absolute;
	top: 8px;
	bottom: 8px;
	right: 8px;
	z-index: 100;
}

.input-box input {
	width: 100%;
	height: 100%;
	opacity: 0;
	overflow: hidden;
	position: absolute;
	cursor: pointer;
}

.input-box label {
	display: -webkit-box;
	display: -ms-flexbox;
	display: flex;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	width: 100%;
	height: 100%;
	font-weight: 400;
	text-overflow: ellipsis;
	white-space: nowrap;
	overflow: hidden;
	transition-property: background-image, background-color;
	transition-duration: .5s;
}

.hov label:hover {
	background-color: rgba(255, 255, 255, 0.06);
}

/* .hov-img label:hover{
  background-image: url("data:image/svg+xml,%3Csvg width='36' height='54' viewBox='0 0 36 54' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 26.3251L2.30369 28.6283L16.1903 14.4785V53.9664H19.4809V14.4127L33.6307 28.6283L36 26.2591L17.8356 8.09465L0 26.3251Z' fill='white'/%3E%3Cpath d='M1.11882 0H34.8151V3.29065H1.11882V0Z' fill='white'/%3E%3C/svg%3E");
	background-color: rgba(0, 0, 0, 0.65);
	background-repeat: no-repeat;
	background-position: 50%, 50%;
  } */

input[type=url] {
	width: 100%;
	height: 48px;
	background-color: rgba(255, 255, 255, 0.06);
	border-radius: 8px;
	padding: 16px;
	color: #ffffff;
}

input[type=text] {
	width: 100%;
	height: 48px;
	background-color: rgba(255, 255, 255, 0.06);
	border-radius: 8px;
	padding: 16px;
	color: #ffffff;
}

.photo-url:hover {
	background-color: rgba(255, 255, 255, 0.06);
	transition-duration: .5s;
	border-radius: 8px;
	height: 100%;
}
</style>
