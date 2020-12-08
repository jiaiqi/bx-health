<template>
<view class="auth-box">
		<view class="tips">{{tips}}</view>
		<button type="primary" class="cu-btn bg-green" lang="zh_CN" :open-type="openType"  @getuserinfo="getuserinfo">微信授权用户信息</button>
	</view>
</template>

<script>
	export default {
		props: {
			openType: {
				type: String,
				default: 'getUserInfo' 
			},
			tips:{
				type: String,
				default: '请完成微信授权以继续使用' 
			}
		},
		methods: {
			getuserinfo(e) {
				this.$emit('getuserinfo',e)
			}
		},
	}
</script>

<style lang="scss">
.auth-box {
	width: 100vw;
	height: calc(100vh - var(--window-top) - var(--window-bottom));
	z-index: 1001;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	background-color: #fff;
	.tips{
		font-size: 28rpx;
		color: #999;
		margin-bottom: 20rpx;
	}
	.button{
		font-size: 32rpx;
		color: #fff;
	}
}
</style>
