<template>
	<view class="diet-info">
		<view class="img"><image mode="aspectFit" class="img" :src="getImagePath(dietInfo.image)" v-if="dietInfo && dietInfo.image"></image></view>
		<view class="info" v-if="dietInfo">
			<view class="name">
				<view class="title">{{ dietInfo.name }}</view>
				<view class="weight">
					<text class="label margin-right-xs">热量:</text>
					<text class="heat">
						{{ hotNum | toFixed1 }}
						<text class="unit">千卡</text>
					</text>
				</view>
			</view>
			<view class="gi">
				<text class="label margin-right-xs">升糖指数:</text>
				<text class="heat">{{ dietInfo.gi || ' - ' }}</text>
			</view>
			<view class="gi">
				<text class="label margin-right-xs">可食部数量:</text>
				<text class="heat">{{ dietInfo.edible_portion ? dietInfo.edible_portion : ' - ' }}</text>
			</view>
			<view class="gi">
				<text class="label margin-right-xs">水分(g):</text>
				<text class="heat">{{ dietInfo.moisture_content ? dietInfo.moisture_content + 'g/100g' : ' - ' }}</text>
			</view>
			<view class="unit-box">
				<text class="label text-bold margin-right-xs">单位:</text>
				<text class="unit">{{ unit }}</text>
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
		};
	},
	filters: {
		toFixed1: function(value) {
			return value ? value.toFixed(1) : '0';
		}
	},
	computed: {
		hotNum(){
			if(this.dietInfo){
				if(this.dietInfo.unit!=='g'&&this.dietInfo.unit_weight_g&&this.dietInfo.unit_amount&&this.dietInfo.unit_energy){
					return this.dietInfo.unit_weight_g*this.dietInfo.unit_energy/this.dietInfo.unit_amount
				}else{
					return this.dietInfo.unit_energy
				}
			}
		},
		unit() {
			if (this.dietInfo && this.dietInfo.unit && this.dietInfo.unit === 'g') {
				if (this.dietInfo.unit_amount && this.dietInfo.unit_amount > 1) {
					return this.dietInfo.unit_amount + 'g';
				} else if (this.dietInfo.unit_weight_g && this.dietInfo.unit_weight_g > 1) {
					return this.dietInfo.unit_weight_g + 'g';
				}
			} else {
				return this.dietInfo.unit;
			}
		}
	},
	watch: {
		dietInfo: {
			deep: true,
			immediate: true,
			handler(newValue, oldValue) {
			
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
			justify-content: space-between;
		}
		.element {
			color: #8dc63f;
		}
		.unit-box,
		.gi {
			display: flex;
			align-items: center;
			width: 50%;
			.heat {
				color: #666;
				font-size: 14px;
			}
			// margin-right: 20rpx;
		}
		.weight {
			color: #ffb347;
			width: 50%;
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
