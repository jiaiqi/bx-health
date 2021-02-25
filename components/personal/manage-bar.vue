<template>
	<view class="container-cen-top">
		<view class="container-cen-top-list bg-white" @click="toPages(item.type)" v-for="item in topGridList">
			<text :class="'cuIcon-'+item.icon" style="font-size: 30px;"></text>
			<text class="label">{{item.label}}</text>
			<view v-if="item.messageAmount" class="message-tag">{{ item.messageAmount}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			topGridList: {
				type: Array
			}
		},
		methods: {
			toPages(e) {
				this.$emit('toPages',e)
			}
		},
	}
</script>

<style scoped lang="scss">
	.container-cen-top {
		z-index: 5;
		width: calc(100% - 40rpx);
		display: flex;
		margin: 0 10px;
		flex-wrap: wrap;
		position: absolute;
		top: -60px;
		background-color: #fff;
		border-radius: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

		.container-cen-top-list {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			border-radius: 50rpx;
			margin: 10px;
			flex: 1;
			transition: all 0.2s ease;

			&:active {
				background-color: #f1f1f1;
			}

			.label {
				padding: 2px 0;
			}

			image {
				width: 80upx;
				height: 80upx;
			}

			.message-tag {
				position: absolute;
				right: 10rpx;
				top: -5px;
				background: red;
				color: white;
				border-radius: 50rpx;
				padding: 1px 2px;
				min-width: 45rpx;
				height: 45rpx;
				line-height: 45rpx;
				text-align: center;
				font-size: 24rpx;
			}
		}
	}
</style>
