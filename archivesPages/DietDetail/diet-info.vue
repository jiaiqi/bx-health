<template>
	<view class="diet-info">
		<view class="img"><image mode="aspectFit" class="img" :src="getImagePath(dietInfo.image)" v-if="dietInfo && dietInfo.image"></image></view>
		<view class="info" v-if="dietInfo">
			<view class="name">{{ dietInfo.name }}</view>
			<view class="weight">
				<text class="label margin-right-xs">热量:</text>
				<text class="heat">
					{{ dietInfo.energy }}
					<text class="unit">千卡</text>
				</text>
			</view>
			<view class="">
				<text class="label text-bold margin-right-xs">单位:</text>
				<text class="unit">{{ dietInfo.unit }}</text>
			</view>
		</view>
	</view>
</template>

<script>
import eleData from './data.js'
export default {
	data() {
		return {
			eleData:eleData
		};
	},
	watch: {
		dietInfo: {
			handler(newValue, oldValue) {
			}
		}
	},
	props: {
		dietInfo: {
			type: Object
		}
	},

};
</script>

<style scoped lang="scss">
.diet-info {
	display: flex;
	padding: 20rpx;
	.img {
		width: 150rpx;
		height: 150rpx;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	}
	.info {
		min-width: 400rpx;
		padding-left: 50rpx;
		display: flex;
		flex-direction: column;
		.name {
			font-weight: 700;
			max-width: 400rpx;
			font-size: 16px;
			display: flex;
			flex-wrap: wrap;
		}
		.element {
			color: #8dc63f;
		}
		.weight {
			padding: 10rpx 0;
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
