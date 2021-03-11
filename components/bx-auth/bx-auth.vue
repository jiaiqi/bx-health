<template>
	<view class="auth-box">
		<view class="logo-box">
			<image :src="getImagePath('20210222171446264100')" mode="aspectFit" class="logo"></image>
			<view class="label text-bold">百想健康</view>
		</view>
		<view class="tips">{{ tips }}</view>
		<!-- 	<view class="text-bold text">
			申请获取以下权限
		</view>
		<view class="margin-tb-sm text">
			获取你的公开信息（昵称、头像等）
		</view> -->
		<!-- <button type="primary" class="cu-btn bg-green" lang="zh_CN" :open-type="openType" @getuserinfo="getuserinfo">微信授权用户信息</button> -->
		<button type="primary" class="cu-btn bg-green button" lang="zh_CN" @click="toAuthPage">打开授权页面</button>
	</view>
</template>

<script>
	export default {
		props: {
			openType: {
				type: String,
				default: 'getUserInfo'
			},
			tips: {
				type: String,
				default: '请完成微信授权以继续使用'
			}
		},
		methods: {
			toAuthPage(e) {
				this.$store.commit('SET_CURRENT_PAGE', 'publicPages/accountExec/accountExec')
				let pageStack = getCurrentPages()
				if (Array.isArray(pageStack) && pageStack.length >= 1) {
					let currentPage = pageStack[pageStack.length - 1]
					this.$store.commit('SET_PRE_PAGE_URL', currentPage.$page.fullPath)
				}
				uni.redirectTo({
					url: '/publicPages/accountExec/accountExec'
				});
			},
			getuserinfo(e) {
				this.$emit('getuserinfo', e);
			}
		}
	};
</script>

<style lang="scss">
	.auth-box {
		width: 100vw;
		height: calc(100vh - var(--window-top) - var(--window-bottom));
		z-index: 1001;
		display: flex;
		// justify-content: center;
		align-items: center;
		flex-direction: column;
		background-color: #fff;
		padding-top: 20vh;

		.logo-box {
			margin-bottom: 50px;
			letter-spacing: 2px;
		}

		.logo {
			width: 100rpx;
			height: 100rpx;
			margin: 10rpx auto;
		}

		.tips {
			font-size: 28rpx;
			color: #999;
			margin-bottom: 20rpx;
		}

		.text {
			padding: 0 40px;
			text-align: left;
			width: 100%;
		}

		.button {
			font-size: 32rpx;
			// color: #fff;
			width: 80%;
			letter-spacing: 2px;
		}
	}
</style>
