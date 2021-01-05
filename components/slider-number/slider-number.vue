<template>
	<view class="slider-number">
		<view class="operate" hover-class="active" @click="numberChange('minus')" @longpress="longpressNumChange('minus')" @touchend="longpressNumEnd">-</view>
		<slider class="uni-slider" @change="changeSlider" :step="step" :min="min" :max="max" :value="bindValue" :show-value="showValue" />
		<view class="operate" hover-class="active" @click="numberChange('add')" @longpress="longpressNumChange('add')" @touchend="longpressNumEnd">+</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			bindValue: 0,
			longpressTimer: null //定时器
		};
	},
	props: {
		showValue: {
			type: Boolean,
			default: true
		},
		value: {
			type: Number
		},
		step: {
			// 步进值
			type: Number,
			default: 1
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			// 步进值
			type: Number,
			default: 99
		}
	},
	watch: {
		value: {
			deep: true,
			immediate: true,
			handler(newValue, oldValue) {
				this.bindValue = newValue;
			}
		}
	},
	methods: {
		changeSlider(e) {
			console.log('value 发生变化：' + e.detail.value);
			this.bindValue = e.detail.value;
			this.$emit('input', this.bindValue);
			this.$emit('change', this.bindValue);
		},
		longpressNumEnd() {
			// 长按结束，清除定时器
			clearInterval(this.longpressTimer);
		},
		longpressNumChange(type) {
			// 开始长按
			if (type) {
				this.longpressTimer = setInterval(() => {
					this.numberChange(type);
				}, 200);
			}
		},
		numberChange(type) {
			let step = this.step;
			if (this.max) {
				if (type === 'add') {
					if (this.bindValue + step <= this.max) {
						this.bindValue = Number((this.bindValue + step).toFixed(1));
					} else {
						clearInterval(this.longpressTimer);
					}
				} else if (type === 'minus') {
					if (this.bindValue - step >= this.min) {
						this.bindValue = Number((this.bindValue - step).toFixed(1));
					} else {
						clearInterval(this.longpressTimer);
					}
				}
			}
			this.changeSlider({ detail: { value: this.bindValue } });
		}
	}
};
</script>

<style lang="scss">
.slider-number {
	display: flex;
	height: 80rpx;
	align-items: center;
	.operate {
		display: inline-block;
		padding: 5rpx 20rpx;
		background-color: #f1f1f1;
		position: relative;
		font-size: 40rpx;
		&.active {
			transition: all 0.2s;
			transform: scale(1.2);
		}
		&::before {
			content: '';
			width: 130%;
			height: 130%;
			top: -15%;
			left: -15%;
			position: absolute;
		}
	}
	.uni-slider {
		flex: 1;
	}
}
</style>
