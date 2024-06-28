<template>
	<view class="slider-number">
		<button class="operate cu-btn" hover-class="active" @click="numberChange('minus', item)" @longpress="longpressNumChange('minus', item)"
		 @touchend="longpressNumEnd" v-for="item in stepList">
			-{{ item }}
		</button>
		<button class="operate cu-btn" hover-class="active" @click="numberChange('minus', 0.1)" @longpress="longpressNumChange('minus', 0.1)"
		 @touchend="longpressNumEnd" v-if="step === 0.1">
			-0.1
		</button>
		<button class="operate cu-btn" hover-class="active" @click="numberChange('minus')" @longpress="longpressNumChange('minus')"
		 @touchend="longpressNumEnd" v-if="step === 1 || step === 0.1">
			-1
		</button>
		<slider class="uni-slider" @changing="changeSlider" @change="changeSlider" :step="sliderStep" :min="min" :max="max" :value="bindValue"
		 :show-value="showValue" />
		<button class="operate cu-btn" hover-class="active" @click="numberChange('add')" @longpress="longpressNumChange('add')"
		 @touchend="longpressNumEnd" v-if="step === 1 || step === 0.1">
			+1
		</button>
		<button class="operate cu-btn" hover-class="active" @click="numberChange('add', 0.1)" @longpress="longpressNumChange('add', 0.1)"
		 @touchend="longpressNumEnd" v-if="step === 0.1">
			+0.1
		</button>
		<button class="operate cu-btn" hover-class="active" @click="numberChange('add', item)" @longpress="longpressNumChange('add', item)"
		 @touchend="longpressNumEnd" v-for="item in reverseStepList">
			+{{ item }}
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				bindValue: 0,
				longpressTimer: null, //定时器
				stepList: [],
				reverseStepList: [],
				sliderStep: ''
			};
		},
		created() {
			if (Array.isArray(this.step) && this.step.length > 0) {
				this.stepList = this.deepClone(this.step).sort((a, b) => a - b);
				this.reverseStepList = this.deepClone(this.stepList).reverse();
				this.sliderStep = this.deepClone(this.step).sort((a, b) => a - b)[0];
			} else {
				this.sliderStep = this.step;
			}
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
				type: [Number, Array],
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
					if(newValue){
						this.bindValue = Number(newValue.toFixed(1));
					}
				}
			}
		},
		methods: {
			changeSlider(e) {
				console.log('value 发生变化：' + e.detail.value);
				if (e.detail.value) {
					this.bindValue = Number(e.detail.value.toFixed(1));
					this.$emit('input', this.bindValue);
					this.$emit('change', this.bindValue);
				}
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
				this.changeSlider({
					detail: {
						value: this.bindValue
					}
				});
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
			padding: 20rpx 10rpx;
			background-color: #f1f1f1;
			position: relative;
			margin-right: 10rpx;
			width: 80rpx;

			&.active {
				transition: all 0.2s;
				transform: scale(1.1);
			}
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
