<template>
	<view class="diet-info">
		<view class="img"><image mode="aspectFit" class="img" :src="getImagePath(dietInfo.image)" v-if="dietInfo && dietInfo.image"></image></view>
		<view class="info" v-if="dietInfo">
			<view class="name">{{ dietInfo.name }}</view>
			<view class="weight">
				<text class="label margin-right-xs">热量:</text>
				<text class="heat">
					{{ hotNum | toFixed1 }}
					<text class="unit">千卡</text>
				</text>
			</view>
			<view class="unit-box">
				<text class="label text-bold margin-right-xs">单位:</text>
				<text class="unit">
					{{
						dietInfo.unit_weight_g && dietInfo.unit === 'g'
							? dietInfo.unit_weight_g + dietInfo.unit
							: dietInfo.unit_amount && dietInfo.unit === 'g'
							? dietInfo.unit_amount + dietInfo.unit
							: dietInfo.unit
					}}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
import eleData from './data.js';
export default {
	data() {
		return {
			eleData: eleData,
			hotNum:0
		};
	},
	filters: {
		toFixed1: function(value) {
			return value?value.toFixed(1):'';
		}
	},
	computed: {
		// hotNum() {
		// 	let res = '';
		// 	if (this.dietInfo.energy) {
		// 		res = this.dietInfo.energy;
		// 	} else if (this.dietInfo.unit_energy && this.dietInfo.unit_amount) {
		// 		res = (this.dietInfo.unit_energy * this.dietInfo.unit_amount) / 100;
		// 	}
		// 	return res;
		// }
	},
	watch: {
		dietInfo: {
			deep:true,
			immediate:true,
			handler(newValue, oldValue) {
				let hotNum = '';
				if (newValue.energy) {
					hotNum = newValue.energy;
				} else if (newValue.unit_energy && newValue.unit_amount) {
					hotNum = (newValue.unit_energy * newValue.unit_amount) / 100;
				}
				this.hotNum = hotNum
			}
		}
	},
	props: {
		dietInfo: {
			type: Object
		}
	}
};
</script>

<style scoped lang="scss">
.diet-info {
	display: flex;
	margin: 0 20rpx;
	padding: 20rpx 0;
	border-bottom: #eee 1rpx solid;
	display: flex;
	.img {
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	}
	.info {
		flex: 1;
		min-width: 400rpx;
		padding-left: 50rpx;
		display: flex;
		flex-wrap: wrap;
		.name {
			width: 100%;
			font-weight: 700;
			font-size: 16px;
			display: flex;
			flex-wrap: wrap;
		}
		.element {
			color: #8dc63f;
		}
		.unit-box,
		.weight {
			display: flex;
			align-items: center;
			width: 50%;
		}
		.weight {
			color: #ffb347;
			.heat {
				color: #ffb347;
				font-size: 16px;
			}
			.unit {
				font-size: 12px;
			}
		}
	}
}
</style>
