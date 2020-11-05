<template>
	<view class="health-archive-wrap">
		<view class="top text-bold" @click="showUserListPopup = true">
			<view class="avatar"><u-avatar :src="avatarUrl" size="60"></u-avatar></view>
			<view class="user-name">{{ currentUser.name }}</view>
			<view class="switch-icon cuIcon-right"></view>
		</view>
		<view class="health-overall-score">
			<!-- <view class="title">健康分数</view> -->
			<view class="content">
				<view class="shadow"></view>
				<uni-ec-charts class="uni-ec-charts" :ec="chartOption" canvasId="health-overall-score"></uni-ec-charts>
			</view>
		</view>
		<view class="health-archive-item health-advice">
			<view class="title">健康建议</view>
			<view class="content">一切正常请继续保持</view>
		</view>
		<view class="health-archive-item health-score">
			<view class="subtitle">今日健康指数</view>
			<view class="content grid-layout">
				<view class="grid-item">
					<view class="title">饮食</view>
					<view class="data text-green">71</view>
					<view class="action">
						查阅历史
						<text class="cuIcon-right"></text>
					</view>
				</view>
				<view class="grid-item">
					<view class="title">运动</view>
					<view class="data text-red">20</view>
					<view class="action">
						<view class="action">
							查阅历史
							<text class="cuIcon-right"></text>
						</view>
					</view>
				</view>
				<view class="grid-item">
					<view class="title">睡眠</view>
					<view class="data text-blue">85</view>
					<view class="action">
						<view class="action">
							查阅历史
							<text class="cuIcon-right"></text>
						</view>
					</view>
				</view>
				<view class="grid-item">
					<view class="title">症状</view>
					<view class="data text-orange">45</view>
					<view class="action">
						<view class="action">
							查阅历史
							<text class="cuIcon-right"></text>
						</view>
					</view>
				</view>
				<view class="grid-item" @click="toCouple">
					<view class="title">其它</view>
					<view class="data text-gray">0</view>
					<view class="action">
						<view class="action">
							查阅历史
							<text class="cuIcon-right"></text>
						</view>
					</view>
				</view>
				<view class="grid-item" @click="toOldHome">
					<view class="title">旧版主页</view>
					<view class="data"></view>
					<view class="action">
						<view class="action">
							<!-- 查阅历史 -->
							<text class="cuIcon-right"></text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="health-archive-item ">
			<view class="subtitle">疾病风险提示</view>
			<view class="content disease-risk">
				<view class="disease-item text-red">
					<view class="disease-name">1.高血压</view>
					<view class="number">风险: 90%</view>
					<view class="to-detail">
						查看详情
						<text class="cuIcon-roundright margin-left-xs"></text>
					</view>
				</view>
				<view class="disease-item text-orange">
					<view class="disease-name">2.肥胖</view>
					<view class="number">风险: 75%</view>
					<view class="to-detail">
						查看详情
						<text class="cuIcon-roundright margin-left-xs"></text>
					</view>
				</view>
			</view>
		</view>
		<u-popup v-model="showUserListPopup" border-radius="40" mode="top" closeable>
			<view class="user-list">
				<view class="user-item" v-for="item in userList" :key="item.id" :class="{ 'text-blue': item.name === currentUser.name }">
					<u-avatar class="avatar" :src="getavatarUrl(item.profile_url)" size="60"></u-avatar>
					{{ item.name }}
				</view>
			</view>
			<view class="button-box"><u-button shape="circle" :ripple="true" ripple-bg-color="#f3f3f3">添加新用户</u-button></view>
		</u-popup>
	</view>
</template>

<script>
import chartOption from './score-chart-option.js';
import uniEcCharts from '@/components/uni-ec-canvas/uni-echart.vue';
export default {
	components: {
		uniEcCharts
	},
	data() {
		return {
			isLogin: false,
			showUserListPopup: false,
			userList: [],
			currentUser: {},
			chartOption: chartOption,
			loginUserInfo: {}
		};
	},
	computed: {
		avatarUrl() {
			if (this.loginUserInfo.headimgurl) {
				return this.loginUserInfo.headimgurl;
			} else {
				if (this.currentUser.profile_url) {
					return this.$api.downloadFile + this.currentUser.profile_url + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
				}
			}
		}
	},
	methods: {
		toCouple() {
			uni.navigateTo({
				url: '/questionnaire/couple/couple'
			});
		},
		toOldHome() {
			uni.navigateTo({
				url: '/archivesPages/old-home/old-home'
			});
		},
		getavatarUrl(fileNo) {
			if (fileNo) {
				return this.$api.downloadFile + fileNo + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
			}
		},
		// 查找当前帐号建立的用户列表
		async selectUserList() {
			const url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'userno', ruleType: 'eq', value: uni.getStorageSync('login_user_info').user_no }],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			const res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				// 有数据
				if (uni.getStorageSync('current_user')) {
					res.data.data.forEach(item => {
						if (item.name === uni.getStorageSync('current_user')) {
							uni.setStorageSync('current_user', item.name);
							this.currentUser = item;
						}
					});
				} else {
					uni.setStorageSync('current_user_info', res.data.data[0]);
					uni.setStorageSync('current_user', res.data.data[0].name);
					this.currentUser = res.data.data[0];
				}
				uni.setStorageSync('user_info_list', res.data.data);
				this.userList = res.data.data;
				return res.data.data;
			} else if (res.data.resultCode === '0011') {
				// 登录失效 进行静默登录
				this.isLogin = false;
				// #ifdef MP-WEIXIN
				const result = await wx.login();
				if (result.code) {
					this.code = result.code;
					await this.wxLogin({ code: result.code });
					// await this.initPage();
				}
				// #endif
			} else if (Array.isArray(res.data.data) && res.data.data.length === 0) {
				// 没有角色 提示跳转到创建角色页面
				uni.showModal({
					title: '提示',
					content: '当前账号未登记个人信息，是否跳转到信息登记页面',
					// showCancel: false,
					success(res) {
						if (res.confirm) {
							let condition = [{ colName: 'userno', ruleType: 'eq', value: uni.getStorageSync('login_user_info').user_no }];
							uni.navigateTo({
								url: '/publicPages/form/form?serviceName=srvhealth_person_info_add&type=add&cond=' + decodeURIComponent(JSON.stringify(condition))
							});
						}
					}
				});
			}
		}
	},
	async onLoad() {
		if (chartOption) {
			this.chartOption = chartOption;
		}
		let userInfo = uni.getStorageSync('login_user_info');
		// #ifdef MP-WEIXIN
		let res = await wx.getSetting();
		if (!res.authSetting['scope.userInfo']) {
			// 没有获取用户信息授权
			uni.showModal({
				title: '提示',
				content: '请登录并授权获取用户信息后再进行查看',
				confirmText: '去登录',
				confirmColor: '#02D199',
				success(res) {
					if (res.confirm) {
						// 确认 跳转到登录页
						uni.navigateTo({
							url: '/publicPages/accountExec/accountExec'
						});
					} else if (res.cancel) {
						// 取消 返回首页
						uni.switchTab({
							url: '/pages/pedia/pedia'
						});
					}
				}
			});
			return;
		}
		// #endif
		if (!userInfo || !uni.getStorageSync('isLogin')) {
			// 未登录
			const result = await wx.login();
			if (result.code) {
				this.code = result.code;
				await this.wxLogin({ code: result.code });
				await this.initPage();
			}
		} else {
			this.isLogin = true;
		}
		if (userInfo) {
			this.loginUserInfo = userInfo;
			this.selectUserList();
		}
		// uni.setTabBarStyle({
		//   color: '#333',
		//   selectedColor: '#fff',
		//   backgroundColor: '#0e1327',
		//   borderStyle: 'white'
		// })
	}
};
</script>

<style scoped lang="scss">
.health-archive-wrap {
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;
	background-color: #fff;
	padding-bottom: 20rpx;
	// background-image: linear-gradient(#0e1327,#0e1327,#fff);
	.top {
		display: flex;
		padding: 20rpx;
		height: 100rpx;
		align-items: center;
		.avatar {
			// width:80rpx;
			// height: 80rpx;
			margin-right: 10rpx;
		}
	}
	.health-overall-score {
		height: 400rpx;
		width: calc(100% - 40rpx);
		margin: 0 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		background-color: #0e1327;
		// background-image: radial-gradient(#0e1327 0%,#161e3e 50%,#fff);
		.content {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			height: 400rpx;
			// border-radius: 100%;
			overflow: hidden;
			.uni-ec-charts {
				width: 400rpx;
				height: 400rpx;
			}
		}
		// .shadow {
		// 	width: 100%;
		// 	height: 100rpx;
		// 	background-color: #161e3e;
		// 	position: absolute;
		// 	left: 0;
		// 	bottom: 0;
		// 	border-radius: 50%;
		// 	// transform: skewx(50deg);
		// 	// box-shadow: 5px -6px 8px 7px #fff;
		// }
	}
	.health-archive-item {
		display: flex;
		flex-wrap: wrap;
		margin: 20rpx 20rpx 0;
		padding: 20rpx;
		border-radius: 20rpx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		.subtitle {
			width: 100%;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
			position: relative;
			text-indent: 20rpx;
			&::before {
				content: '';
				position: absolute;
				left: 0;
				height: 100%;
				width: 5px;
				background-color: #0081ff;
				border-radius: 5rpx;
			}
		}
		.content {
			width: 100%;
			min-height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: bold;
			&.grid-layout {
				display: grid;
				grid-template-columns: repeat(3, calc(33.33% - 20rpx));
				grid-row-gap: 20rpx;
				grid-column-gap: 20rpx;
				.grid-item {
					border-radius: 20rpx;
					display: flex;
					// justify-content: center;
					height: 150rpx;
					border: 1px solid #999;
					padding: 10rpx;
					flex-direction: column;
					.title {
						text-align: left;
						flex: 1;
					}
					.data {
						flex: 1;
						font-size: 50rpx;
						// text-align: left;
						text-align: center;
					}
					.action {
						font-size: 24rpx;
						color: #999;
						text-align: right;
						flex: 1;
					}
				}
			}
			&.disease-risk {
				display: flex;
				flex-direction: column;
				.disease-item {
					width: 100%;
					padding: 10rpx 20rpx;
					border-bottom: 1px dashed #999;
					display: flex;
					justify-content: space-between;
					&.text-red {
						border-color: #e54d42;
					}
					&.text-orange {
						border-color: #f37b1d;
					}
					.disease-name {
						font-size: 32rpx;
						flex: 1;
					}
					.number {
						font-size: 26rpx;
						min-width: 100rpx;
						flex: 1;
					}
				}
			}
		}
		&.health-advice {
			.content {
				color: #0081ff;
			}
		}
	}
}
.user-list {
	min-height: 300rpx;
	padding: 40rpx 30rpx 20rpx;
	.user-item {
		text-indent: 40rpx;
		display: flex;
		align-items: center;
		font-weight: bold;
		font-size: 34rpx;
		padding: 30rpx 20rpx 10rpx;
		border-bottom: 1rpx solid #f1f1f1;
		transition: all 0.5s;
		.avatar {
			margin-right: 20rpx;
		}
		&:active {
			background-color: #f1f1f1;
		}
	}
}
.button-box {
	width: 100%;
	padding: 20rpx 30rpx;
	font-weight: bold;
}
</style>
