<template>
	<view class="slider-number">
		<view class="operate" hover-class="active" @click="numberChange('minus', 0.1)" @longpress="longpressNumChange('minus', 0.1)" @touchend="longpressNumEnd" v-if="step === 0.1">
			-0.1
		</view>
		<view class="operate" hover-class="active" @click="numberChange('minus')" @longpress="longpressNumChange('minus')" @touchend="longpressNumEnd">-1</view>
		<slider class="uni-slider" @change="changeSlider" :step="step" :min="min" :max="max" :value="bindValue" :show-value="showValue" />
		<input type="digit" v-model="bindValue" class="input" />
		<view class="operate" hover-class="active" @click="numberChange('add')" @longpress="longpressNumChange('add')" @touchend="longpressNumEnd">+1</view>
		<view class="operate" hover-class="active" @click="numberChange('add', 0.1)" @longpress="longpressNumChange('add', 0.1)" @touchend="longpressNumEnd" v-if="step === 0.1">
			+0.1
		</view>
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
		longpressNumChange(type, num) {
			// 开始长按
			if (type) {
				this.longpressTimer = setInterval(() => {
					this.numberChange(type, num);
				}, 200);
			}
		},
		numberChange(type, num) {
			let step = this.step;
			if (num) {
				step = num;
			} else {
				step = 1;
			}
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
	position: relative;
	.operate {
		display: inline-block;
		text-align: center;
		padding: 5rpx 10rpx;
		background-color: #f1f1f1;
		position: relative;
		font-size: 40rpx;
		margin-right: 10rpx;
		width:80rpx;
		&.active {
			transition: all 0.2s;
			transform: scale(1.1);
		}
		// &::before {
		// 	content: '';
		// 	width: 110%;
		// 	height: 110%;
		// 	top: 5%;
		// 	left: 5%;
		// 	position: absolute;
		// }
	}
	.input {
		width: 80rpx;
		position: absolute;
		right: 0;
	}
	.uni-slider {
		flex: 1;
	}
}
</style>
