<template>
	<view>
		<personal type="shop"></personal>
		<view class="bottom-layer">
			<view class="bottom-button" @click="toPages('home')">
				<text class="cuIcon-home icon"></text>
				<view class="label">小程序主页</view>  
			</view>
			<view class="bottom-button" @click="toPages('shop')">
				<text class="cuIcon-back icon"></text>
				<view class="label">返回</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	onLoad(option) {
		this.checkOptionParams(option);
		this.toAddPage();
	},
	methods: {
		toPages(e) {
			if (e === 'shop') {
				uni.navigateBack({});
			} else {
				uni.switchTab({
					url: '/pages/pedia/pedia',
					fail() {
						uni.redirectTo({
							url: '/pages/pedia/pedia'
						})
					}
				});
			}
		}
	}
};
</script>

<style scoped lang="scss">
.bottom-layer {
	position: fixed;
	bottom: 0;
	width: 100vw;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0 20rpx;
	z-index: 2;
	background-color: #fff;
	.bottom-button {
		flex: 1;
		text-align: center;
		& + .bottom-button {
			border-left: 1px solid #f1f1f1;
		}
		&:active {
			background-color: #f1f1f1;
		}
		.icon {
			font-size: 25px;
		}
	}
}
</style>
