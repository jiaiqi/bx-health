<template>
	<view class="container">
		<view class="container-top">
			<view class="top-left"><image v-if="userInfo" :src="userInfo.headimgurl" mode=""></image></view>
			<view class="top-right">
				<view v-if="userInfo" class="top-right-name">{{ userInfo.nickname }}</view>
			</view>
		</view>
		<view class="container-cen">
			<view class="container-cen-top">
				<view class="container-cen-top-list" @click="toPages('yundong')">
					<image src="/otherPages/static/img/yd.png" mode=""></image>
					<text>运动</text>
				</view>
				<view class="container-cen-top-list">
					<image src="/otherPages/static/img/sm.png" mode=""></image>
					<text>睡眠</text>
				</view>
				<view class="container-cen-top-list" @click="toPages('pinggu')">
					<image src="/otherPages/static/img/pg.png" mode=""></image>
					<text>评估</text>
				</view>
			</view>
			<view class="container-bot">
				<view class="cu-list menu sm-border">
					<view @click="toPersonDetail('person')" class="cu-item arrow">
						<view class="content">
							<image src="/otherPages/static/img/zl.png" mode=""></image>
							<text class="text-grey">基本信息</text>
						</view>
					</view>
					<view @click="toPersonDetail('corp')" class="cu-item arrow">
						<view class="content">
							<image src="/otherPages/static/img/st.png" mode=""></image>
							<text class="text-grey">身体数据</text>
						</view>
					</view>
					<view class="cu-item arrow">
						<view class="content">
							<image src="/otherPages/static/img/pgs.png" mode=""></image>
							<text class="text-grey">我的评估</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'mine-info',
	data() {
		return {
			userInfo: '',
			currentUser: null
		};
	},
	methods: {
		toPages(e) {
			switch (e) {
				case 'pinggu':
					uni.navigateTo({
						url: '/otherPages/healthQuestionnaire/healthQuestionnaire'
					});
					break;
				case 'yundong':
					uni.navigateTo({
						url: '/otherPages/sportDetail/sportDetail?title=运动'
					});
					break;
			}
		},
		toPersonDetail(type) {
			uni.navigateTo({
				url: '/otherPages/personalDetail/personalDetail?type=' + type
			});
		}
	},
	created() {
		let userInfo = uni.getStorageSync('wxUserInfo');
		this.userInfo = userInfo;
		let userList = uni.getStorageSync('user_info_list');
		let current_user = uni.getStorageSync('current_user');
		if (userList && current_user) {
			let currentUser = userList.filter(item => {
				return item.name === current_user;
			});
			if (Array.isArray(currentUser) && currentUser.length > 0) this.currentUser = currentUser[0];
		}
	}
};
</script>
<style lang="scss" scoped>
.container {
	height: 100vh;
	overflow: hidden;
}
.container-top {
	width: 100%;
	height: 350rpx;
	/* #ifdef MP-WEIXIN */
	height: 200rpx;
	padding-top: 10rpx;
	/* #endif */
	background-color: #0bc99d;
	display: flex;
	/* #ifdef H5 */
	align-items: center;
	/* #endif */
	.top-left {
		height: 120upx;
		/* border-radius: 50%; */
		/* border: 1px solid white; */
		width: 120upx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 50upx;
		/* padding: 10px; */
		image {
			width: 120upx;
			height: 120upx;
			border-radius: 50%;
		}
	}
	.top-right {
		color: white;
		font-size: 16px;
		margin-left: 20upx;
	}
}
.container-cen {
	width: 100%;
	height: calc(100vh - 310upx);
	background-color: white;
	border-top-left-radius: 50upx;
	border-top-right-radius: 50upx;
	position: relative;
	top: -40upx;
	.container-cen-top {
		display: flex;
		justify-content: space-around;
		padding-top: 20upx;
		.container-cen-top-list {
			display: flex;
			flex-direction: column;
			align-items: center;
			image {
				width: 80upx;
				height: 80upx;
			}
		}
		/* justify-content:; */
	}
	.container-bot {
		margin-top: 40upx;
	}
}
</style>
