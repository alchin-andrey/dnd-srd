<template>
	<div class="range_slider">
		<input
			:style="{
				'margin-bottom': Range_Margin,
				width: Range_Width,
			}"
			type="range"
			class="vertical"
			:min="Min_Range"
			:max="Max_Range"
			v-model.number="inputValue"
			step="1"
		/>
		<div
			@click="getMin()"
			:style="{
				height: Range_Bottom,
			}"
			class="range_bottom"
		></div>
		<div class="range_value">
    {{ t_Unit }}
    </div>
	</div>
</template>

<script>
import { mapState } from "pinia";
import { useMYStore } from "@/stores/user/MYStore";
import { usePagesStore } from "@/stores/user/PagesStore";
import { useFormStore } from "@/stores/modules/simple/FormStore";
export default {
	name: "MyRange",
	data() {
		return {
			inputValue: "",
		};
	},
	props: {
		modelValue: {
			type: Number,
			default: null,
		},
		lvl: {
			type: Boolean,
			default: false,
		},
		age: {
			type: Boolean,
			default: false,
		},
		height: {
			type: Boolean,
			default: false,
		},
		weight: {
			type: Boolean,
			default: false,
		},
	},

	computed: {
		...mapState(useMYStore, ["MY", "MY_Race",]),
		...mapState(usePagesStore, ["main_page", "screen_Max"]),
    ...mapState(useFormStore, ["form_kof"]),
		Target_Range() {
			if (this.lvl) {
				return "lvl";
			} else if (this.age) {
				return "age";
			} else if (this.height) {
				return "height";
			} else if (this.weight) {
				return "weight";
			} else {
				return null;
			}
		},

		age_Units() {
			let mod10 = Math.abs(this.inputValue % 10);
			let mod100 = Math.abs(this.inputValue % 100);
			if (mod100 > 10 && mod100 < 20) {
				return "years";
			} else if (mod10 >= 2 && mod10 <= 4) {
				return "yeara";
			} else if (mod10 === 1) {
				return "year";
			} else {
				return "years";
			}
		},

		t_Unit() {
			if (this.lvl) {
				return `${this.inputValue}${this.t("level_unit")} ${this.t("level")}`;
			} else if (this.age) {
				return `${this.inputValue} ${this.t(this.age_Units)}`;
			} else if (this.height) {
				return `${this.inputValue} ${this.t("cm")}`;
			} else if (this.weight) {
				return `${this.inputValue} ${this.t("kg")}`;
			} else {
				return null;
			}
		},

		Max_Range() {
			if (this.lvl) {
				return this.main_page.level_sett.max;
			} else {
				return this.MY_Race.race_settings[this.Target_Range].max;
			}
		},

		Min_Range() {
			if (this.lvl) {
				return this.main_page.level_sett.min;
			} else {
				return this.MY_Race.race_settings[this.Target_Range].min;
			}
		},

		Kof_Range() {
			if (this.lvl) {
				return null;
			} else {
				let min = this.MY_Race.race_settings[this.Target_Range].min;
				let max = this.MY_Race.race_settings[this.Target_Range].max;
				return (this.MY[this.Target_Range] - min) / (max - min);
			}
		},

		// Выравнивание ползунка
		// Range_Bottom() {
		// 	if (this.height) {
		// 		return `calc((100vh - 64px) / 210 * ${this.Min_Range} - 30px)`;
		// 	} else {
		// 		return `calc((100vh - 64px - 30px) / ${this.Max_Range} * ${this.Min_Range})`;
		// 	}
		// },
		// Range_Width() {
		// 	if (this.height) {
		// 		return `calc((100vh - 64px) - ${this.Range_Bottom} - ((100vh - 64px) - ((100vh - 64px) / 210 * ${this.Max_Range})))`;
		// 	} else {
		// 		return `calc((100vh - 64px) - ${this.Range_Bottom})`;
		// 	}
		// },
		// Range_Margin() {
		// 	return `calc(${this.Range_Width} / 2 - 172px - 1px)`;
		// },

		Range_Pad() {
			return this.screen_Max ? '64px' : '108px'
		},

		Range_Bottom() {
			const pad = this.Range_Pad;
			if (this.height) {
				return `calc((100vh - ${pad}) / 210 * ${this.Min_Range} - 30px)`;
			} else {
				return `calc((100vh - ${pad} - 30px) / ${this.Max_Range} * ${this.Min_Range})`;
			}
		},
		Range_Width() {
			const pad = this.Range_Pad;
			if (this.height) {
				return `calc((100vh - ${pad}) - ${this.Range_Bottom} - ((100vh - ${pad}) - ((100vh - ${pad}) / 210 * ${this.Max_Range})))`;
			} else {
				return `calc((100vh - ${pad}) - ${this.Range_Bottom})`;
			}
		},
		Range_Margin() {
			return `calc(${this.Range_Width} / 2 - 172px - 1px)`;
		},
	},
	watch: {
		"MY_Race.name": {
			handler() {
				if (this.lvl) {
					return null;
				} else {
					setTimeout(() => {
						this.inputValue = this.MY[this.Target_Range] + 1;
						this.$emit("update:modelValue", this.inputValue);
						this.inputValue = this.MY[this.Target_Range] - 1;
						this.$emit("update:modelValue", this.inputValue);
					}, 1);
				}
			},
			// deep: true,
			immediate: true,
		},
		modelValue: {
			handler() {
				this.inputValue = this.modelValue;
				if (this.lvl) {
					return null;
				} else {
					this.form_kof[this.Target_Range] = this.Kof_Range;
				}
			},
			immediate: true,
		},
		inputValue: {
			handler() {
				this.$emit("update:modelValue", this.inputValue);
				if (this.lvl) {
					return null;
				} else {
					this.form_kof[this.Target_Range] = this.Kof_Range;
				}
			},
			immediate: true,
		},
	},
	methods: {
		getMin() {
			this.inputValue = this.Min_Range;
		},
	},
};
</script>

<style scoped>
.range_slider {
	width: 344px;
	height: 1000vh;

	/* display: grid; */

	display: flex;
	flex-direction: column;
	justify-content: flex-end;
	align-items: center;
	border-radius: 12px;
	overflow: hidden;
	position: relative;
}

input[type="range"] {
	-webkit-appearance: none;
	height: 344px;
	background: transparent;
	cursor: pointer;
	-webkit-transform: rotate(-90deg);
	-moz-transform: rotate(-90deg);
	-ms-transform: rotate(-90deg);
	transform: rotate(-90deg);
	border-radius: 0 12px 12px 0;
	overflow: hidden;
}

::-webkit-slider-runnable-track {
	background: rgba(255, 255, 255, 0.06);
	min-height: 344px;
}

::-webkit-slider-thumb {
	-webkit-appearance: none;
	width: 30px;
	min-height: 344px;
	background: url("@/assets/img/icon/slide_knob.svg") center center no-repeat;
	background-color: #ffffff;
	box-shadow: -100vh 0 0 100vh #ffffff;
	cursor: ns-resize;
	border: 0px;
	border-radius: 0 !important;
	box-sizing: border-box;
}

::-moz-range-track {
	background: rgba(255, 255, 255, 0.06);
	min-height: 344px;
}

::-moz-range-thumb {
	width: 30px;
	height: 344px;
	background: url("@/assets/img/icon/slide_knob.svg") center center no-repeat;
	background-color: #ffffff;
	box-shadow: -100vh 0 0 100vh #ffffff;
	cursor: ns-resize;
	border: 0px;
	border-radius: 0 !important;
	box-sizing: border-box;
}

::-ms-fill-lower {
	background: #ffffff;
}

::-ms-thumb {
	background: #fff;
	height: 344px;
	box-sizing: border-box;
}

::-ms-ticks-after {
	display: none;
}

::-ms-ticks-before {
	display: none;
}

::-ms-track {
	background: #ddd;
	color: transparent;
	width: 344px;
	border: none;
}

::-ms-tooltip {
	display: none;
}

.range_value {
	position: absolute;
	left: 16px;
	bottom: 11px;
	height: 24px;
	font-family: "Inter-700";
	font-style: normal;
	font-weight: normal;
	font-size: 20px;
	line-height: 24px;
	letter-spacing: 0.02em;
	color: #000000;
	background-color: #ffffff;
}

.range_bottom {
	width: 344px;
	background-color: #ffffff;
	cursor: pointer;
}

</style>
