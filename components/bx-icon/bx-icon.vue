<template>
	<text :class="className" :style="{ fontSize: this.fontSize, color: color }"></text>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		name: {
			type: String
		},
		size: {
			type: [String, Number]
		},
		color: {
			type: String
		}
	},
	computed: {
		className() {
			if (this.name) {
				if (this.color && this.color.indexOf('text-') !== -1) {
					return 'cuIcon-' + this.name + ' ' + this.color;
				}
				return 'cuIcon-' + this.name;
			}
		},
		fontSize() {
			if (typeof this.size === 'number') {
				return `${uni.upx2px(this.size)}px`;
			} else {
				return `${this.size}`;
			}
		},
		fontColor() {
			if (this.color && this.color.indexOf('text-') === -1) {
				return this.color;
			}
		}
	}
};
</script>

<style lang="scss"></style>
