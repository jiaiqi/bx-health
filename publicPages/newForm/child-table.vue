<template>
	<view class="child-service-box">
		<!-- <view class="normal-title">子表</view> -->
		<view class="child-service-item" v-for="item in childService" @click="toChildServiceList(item)">
			<view class="child-service-title">{{ item.foreign_key && item.foreign_key.section_name ? item.foreign_key.section_name : item.service_view_name }}</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		childService: {
			type: Array
		},
	},
	methods: {
		toChildServiceList(item) {
			this.$emit('toChildServiceList',item)
		}
	},
};
</script>

<style scoped lang="scss">
.child-service-box {
	margin: 20rpx;
	padding: 20rpx;
	display: flex;
	flex-wrap: wrap;
	box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	.child-service-item {
		min-height: 100rpx;
		width: calc(33% - 6rpx);
		display: flex;
		justify-content: center;
		align-items: center;
		transform: translate(2px, 2px);
		background-color: #409eff;
		color: #fff;
		transition: 0.2s all ease-in-out;
		border-radius: 10rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		&:nth-child(3n) {
			margin-right: 0;
		}
		&:active {
			transform: translate(2px, 2px);
			color: #409eff;
			background: #ecf5ff;
			box-shadow: 0px 0px 4px #ecf5ff, 0 0 6px #b3d8ff;
		}
		.child-service-title {
			text-align: center;
		}
	}
}
</style>
