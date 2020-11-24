<template>
	<view class="container">
		<view class="container-top">
			<view class="top-left"><image v-if="userInfo" :src="getImagePath(userInfo.profile_url)" mode=""></image></view>
			<view class="top-right">
				<view v-if="userInfo" class="top-right-name">{{ userInfo.name }}</view>
			</view>
		</view>
		<view class="container-cen">
			<view class="container-cen-top">
				<view class="container-cen-top-list" @click="toPages('doctor')">
					<text class="cuIcon-service text-blue" style="font-size: 70rpx;"></text>
					<!-- <image src="/otherPages/static/img/yd.png" mode=""></image> -->
					<text>我的医生</text>
				</view>
				<view class="container-cen-top-list">
					<text class="cuIcon-comment text-green" style="font-size: 70rpx;"></text>
					<text>健康咨询</text>
				</view>
				<view class="container-cen-top-list" @click="toPages('pinggu')">
					<text class="cuIcon-addressbook text-orange" style="font-size: 70rpx;"></text>
					<text>家庭成员</text>
				</view>
			</view>
			<view class="container-bot">
				<view class="cu-list menu sm-border">
					<view @click="toPersonDetail('person')" class="cu-item arrow">
						<view class="content">
							<text class="cuIcon-news"></text>
							<text class="text-grey">基本信息</text>
						</view>
					</view>
					<view @click="toPersonDetail('corp')" class="cu-item arrow">
						<view class="content">
							<text class="cuIcon-rank"></text>
							<text class="text-grey">身体数据</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="toPages('beDoctor')">
						<view class="content">
							<text class="cuIcon-text"></text>
							<text class="text-grey">成为医生</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="toPages('card')">
						<view class="content">
							<text class="cuIcon-text"></text>
							<text class="text-grey">医生名片</text>
						</view>
					</view>
					<!-- 	<view class="cu-item arrow">
						<view class="content">
							<text class="cuIcon-text"></text>
							<text class="text-grey">我的评估</text>
						</view>
					</view> -->
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
			wxUserInfo: '',
			userInfo: '',
			currentUser: null
		};
	},
	methods: {
		toPages(e) {
			switch (e) {
				case 'doctor':
					uni.navigateTo({
						url: '/personalPages/myDoctor/myDoctor'
					});
					break;
				case 'card':
					uni.navigateTo({
						url: '/personalPages/nameCard/nameCard'
					});
					break;
				case 'beDoctor':
					uni.navigateTo({
						url: '/publicPages/form/form?serviceName=srvhealth_doctor_add&type=add&cond='
					});
			}
		},
		toPersonDetail(type) {
			uni.navigateTo({
				url: '/otherPages/personalDetail/personalDetail?type=' + type
			});
		},
		async initPage() {
			if (!this.userInfo || !uni.getStorageSync('isLogin')) {
				// 未登录 h5跳转到登录页,小程序端进行静默登录
				// #ifdef MP-WEIXIN
				const result = await wx.login();
				if (result.code) {
					await this.wxLogin({ code: result.code });
					await this.initPage();
				}
				// #endif
				// #ifdef H5
				uni.navigateTo({
					url: '/publicPages/accountExec/accountExec'
				});
				// #endif
			}
		}
	},
	async created() {
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// #endif
		let userInfo = uni.getStorageSync('wxUserInfo');
		this.wxUserInfo = userInfo;
		let userList = uni.getStorageSync('user_info_list');
		let current_user_info = uni.getStorageSync('current_user_info');
		let currentUserInfo = await this.selectBasicUserList();
		if (currentUserInfo) {
			current_user_info = currentUserInfo;
		}
		if (current_user_info) {
			this.userInfo = current_user_info;
		}
		// if (userList && current_user) {
		// 	let currentUser = userList.filter(item => {
		// 		return item.name === current_user;
		// 	});
		// 	if (Array.isArray(currentUser) && currentUser.length > 0) this.currentUser = currentUser[0];
		// }
		// this.initPage();
	}
};
</script>
<style lang="scss" scoped>
.container {
	height: calc(100vh - 188rpx);
	overflow: hidden;
}
.container-top {
	width: 100%;
	height: 200rpx;
	padding-top: 10rpx;
	background-color: #0bc99d;
	display: flex;
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
	height: calc(100vh - 350upx);
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
	}
	.container-bot {
		margin-top: 40upx;
	}
}
</style>
