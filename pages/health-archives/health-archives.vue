<template>
	<view class="health-archive-wrap">
		<view class="top text-bold">
			<view class="left">
				<view class="avatar" @click="showUserListPopup = true"><u-avatar class="avatar" :src="avatarUrl" size="60"></u-avatar></view>
				<view class="user-name" @click="showUserListPopup = true">{{ currentUser.name }}</view>
				<view class="switch-icon cuIcon-right" @click="showUserListPopup = true"></view>
				<view class="tag-box">
					<text class="tag-item" v-for="item in checkboxList" :key="item.name" v-show="item.checked">{{ item.name }}</text>
				</view>
			</view>
			<view class="right" @click="showUserHealtManagePopup = true">健康标签管理</view>
		</view>
		<view class="health-overall-score">
			<!-- <view class="title">健康分数</view> -->
			<view class="content">
				<view class="score-item">
					<text class="label">健康分</text>
					<text class="value text-blue">86</text>
					<!-- 	<view class="thend">
						<text class="cuIcon-pullup text-white"></text>
						<text>2分</text>
					</view>
					<text>上次更新 2020年11月6日</text> -->
				</view>
				<!-- <text class="separator">/</text> -->
				<view class="score-item" @click="toPages('basic-info')">
					<text class="label">信息完整度</text>
					<text class="value  text-orange">
						32
						<text class="ratio">%</text>
					</text>
				</view>
			</view>
		</view>
		<view class="health-archive-item health-advice">
			<view class="title">健康建议</view>
			<view class="content">一切正常请继续保持</view>
		</view>
		<view class="health-archive-item health-score">
			<view class="subtitle">
				<text class="title-text">今日健康指数</text>
				<view class="title-action" @click="navPages('history')">
					<text class="cuIcon-time"></text>
					<text class="see-histroy">查看历史</text>
				</view>
			</view>
			<view class="content grid-layout">
				<view class="grid-item" @click="toPages('diet')">
					<view class="title">饮食</view>
					<view class="data text-green">71</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('sport')">
					<view class="title">运动</view>
					<view class="data text-red">20</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('weight')">
					<view class="title">体重</view>
					<view class="data text-gray">0</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('bp')">
					<view class="title">血压</view>
					<view class="data text-gray">0</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('sleep')">
					<view class="title">睡眠</view>
					<view class="data text-blue">85</view>
					<view class="action"></view>
				</view>
				<view class="grid-item">
					<view class="title">症状</view>
					<view class="data text-orange">45</view>
					<view class="action"></view>
				</view>
				<!-- 	<view class="grid-item">
					<view class="title">其它</view>
					<view class="data text-gray">0</view>
					<view class="action"></view>
				</view> -->
				<view class="grid-item" @click="toOldHome">
					<view class="title">旧版主页</view>
					<view class="data"></view>
					<view class="action"></view>
				</view>
			</view>
		</view>
		<view class="health-archive-item ">
			<view class="subtitle">
				<text class="title-text">疾病风险提示</text>
				<view class=""></view>
			</view>
			<view class="content disease-risk">
				<view class="disease-item text-red">
					<view class="disease-name">高血压</view>
					<view class="number">
						<!-- 风险: -->
						<text class="digit">90</text>
						%
					</view>
					<!-- 	<view class="to-detail">
						查看详情
						<text class="cuIcon-roundright margin-left-xs"></text>
					</view> -->
				</view>
				<view class="disease-item text-orange">
					<view class="disease-name">肥胖</view>
					<view class="number">
						<!-- 风险: -->
						<text class="digit">75</text>
						%
					</view>
					<!-- 	<view class="to-detail">
						查看详情
						<text class="cuIcon-roundright margin-left-xs"></text>
					</view> -->
				</view>
			</view>
		</view>
		<u-popup v-model="showUserListPopup" border-radius="40" mode="top" closeable>
			<view class="user-list">
				<view class="user-item" @click="currentUser = item" v-for="item in userList" :key="item.id" :class="{ 'text-blue': item.name === currentUser.name }">
					<image class="avatar" :src="getavatarUrl(item.profile_url)" size="60"></image>
					{{ item.name }}
				</view>
			</view>
			<view class="button-box"><u-button shape="circle" :ripple="true" ripple-bg-color="#f3f3f3">添加新用户</u-button></view>
		</u-popup>
		<u-popup v-model="showUserHealtManagePopup" border-radius="40" mode="top" closeable>
			<view class="health-item">
				<view class="tips">
					<text class="cuIcon-info"></text>
					最多只能勾选三项
				</view>
				<checkbox-group @change="checkboxGroupChange">
					<label v-for="(item, index) in checkboxList" :key="index">
						<checkbox
							:value="item.name"
							:checked="item.checked"
							color="#FFCC33"
							style="transform:scale(0.7)"
							:disabled="disabledTag&&!checkedList.includes(item.name)"
						/>
						{{ item.name }}
					</label>
				</checkbox-group>
				<!-- 			<u-checkbox-group @change="checkboxGroupChange" max="3">
					<u-checkbox v-model="item.checked" v-for="(item, index) in checkboxList" :key="index" :name="item.name">{{ item.name }}</u-checkbox>
				</u-checkbox-group> -->
			</view>
		</u-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isLogin: false,
			showUserListPopup: false,
			showUserHealtManagePopup: false,
			userList: [],
			currentUser: {},
			// chartOption: chartOption,
			loginUserInfo: {},
			checkboxList: [
				{
					name: '备孕',
					checked: false
				},
				{
					name: '孕期',
					checked: false
				},
				{
					name: '哺乳期',
					checked: false
				},
				{
					name: '肥胖',
					checked: false
				}
			],
			checkedList: []
		};
	},
	computed: {
		disabledTag(){
			return this.checkedList.length === 3
		},
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
		toPages(e) {
			let condType = {};
			let url = '';
			switch (e) {
				case 'diet':
				case 'sport':
				case 'sleep':
				case 'weight':
				case 'bp':
				case 'symptom':
					url = `/archivesPages/archives-history/archives-history?pageType=${e}`;
					break;
				case 'basic-info':
					url = '/questionnaire/couple/couple';
					break;
			}
			if (!url) {
				// uni.navigateTo({
				// 	url: '/otherPages/otherIndicator/otherIndicator?type=' + e
				// });
			} else {
				uni.navigateTo({
					url: url
				});
			}
		},
		addSymptom() {
			// 跳转到症状选择页面
			let term = {
				serviceName: 'srvhealth_self_symptoms_select',
				srvApp: 'health',
				key: 'name',
				type: 'symptom'
			};
			uni.navigateTo({
				url: '/otherPages/symptomSelect/symptomSelect?term=' + encodeURIComponent(JSON.stringify(term))
			});
		},
		checkboxGroupChange(e) {
			console.log(e);
			var items = this.checkboxList,
				values = e.detail.value;
			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				const item = items[i];
				if (values.includes(item.name)) {
					this.$set(item, 'checked', true);
				} else {
					this.$set(item, 'checked', false);
				}
			}

			this.checkedList = this.checkboxList.filter(item => item.checked).map(item => item.name);
		},
		navPages(type = 'history') {
			if (type === 'history') {
				uni.navigateTo({
					url: '/archivesPages/archives-history/archives-history?isAll=true'
					// url:'/otherPages/balancedDiet/balancedDiet'
				});
			}
		},
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
					await this.initPage();
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
		},
		async initPage() {
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
				// #ifdef MP-WEIXIN
				const result = await wx.login();
				if (result.code) {
					this.code = result.code;
					await this.wxLogin({ code: result.code });
					await this.initPage();
				}
				// #endif
			} else {
				this.isLogin = true;
			}
			if (userInfo) {
				this.loginUserInfo = userInfo;
				this.selectUserList();
			}
		}
	},
	onShow() {
		this.initPage();
	},
	async onLoad() {
		// if (chartOption) {
		// 	this.chartOption = chartOption;
		// }
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
	background-color: #f1f1f1;
	padding-bottom: 20rpx;
	max-width: 1080rpx;
	margin: 0 auto;
	.avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 100%;
	}
	// background-image: linear-gradient(#0e1327,#0e1327,#fff);
	.top {
		display: flex;
		padding: 20rpx;
		height: 100rpx;
		background-color: #fff;
		justify-content: space-between;
		margin-bottom: 20rpx;
		.left {
			display: flex;
			align-items: center;
			font-size: 30rpx;
			line-height: 30rpx;
			.avatar {
				// width:80rpx;
				// height: 80rpx;
				margin-right: 10rpx;
			}
			.tag-box {
				.tag-item {
					padding: 10rpx;
					border-radius: 5rpx;
					margin-left: 10rpx;
					font-size: 20rpx;
					&:nth-child(1) {
						color: #409eff;
						background: #ecf5ff;
						border-color: #b3d8ff;
					}
					&:nth-child(2) {
						color: #67c23a;
						background: #f0f9eb;
						border-color: #c2e7b0;
					}
					&:nth-child(3) {
						color: #909399;
						background: #f4f4f5;
						border-color: #d3d4d6;
					}
					&:nth-child(4) {
						color: #e6a23c;
						background: #fdf6ec;
						border-color: #f5dab1;
					}
					&:nth-child(5) {
						color: #f56c6c;
						background: #fef0f0;
						border-color: #fbc4c4;
					}
					&:nth-child(6) {
						color: #409eff;
						background: #ecf5ff;
						border-color: #b3d8ff;
					}
				}
			}
		}
		.right {
			display: flex;
			align-items: center;
		}
	}
	.health-overall-score {
		width: calc(100% - 40rpx);
		margin: 0 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		.content {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			overflow: hidden;
			// flex-direction: column;
			flex: 1;
			.uni-ec-charts {
				width: 400rpx;
				height: 400rpx;
			}
			.separator {
				font-size: 100rpx;
				height: 160rpx;
				display: flex;
				align-items: flex-end;
			}
			.score-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				color: #333;
				border-radius: 20rpx;
				width: 300rpx;
				height: 300rpx;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
				// border: 1px solid #f1f1f1;
				background-color: #fff;
				box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
				&:last-child {
					margin-right: 0;
				}
				.label {
					font-size: 30rpx;
					font-weight: 600;
					text-align: center;
					letter-spacing: 2px;
				}
				.value {
					font-size: 150rpx;
				}
				.ratio {
					font-size: 50rpx;
				}
				.thend {
					font-size: 20rpx;
				}
			}
		}
	}
	.health-archive-item {
		display: flex;
		flex-wrap: wrap;
		margin: 20rpx 20rpx 0;
		padding: 20rpx;
		border-radius: 20rpx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		background-color: #fff;
		.subtitle {
			width: 100%;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
			position: relative;
			text-indent: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title-text {
				margin: 0;
				padding: 0;
				display: inline-block;
				position: relative;
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
			.title-action {
				display: flex;
				justify-content: center;
				align-items: center;
				padding-right: 20rpx;
				height: 60rpx;
				border-radius: 50rpx;
				border: 1px solid #f1f1f1;
				// font-size: 50rpx;
				transition: all 1s;
				&:active {
					background-color: #999;
					color: #fff;
				}
				.see-histroy {
					font-size: 24rpx;
				}
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
					border-radius: 10rpx;
					display: flex;
					// justify-content: center;
					height: 150rpx;
					// border: 1px solid #999;
					box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
					padding: 10rpx;
					flex-direction: column;
					.title {
						text-align: left;
					}
					.data {
						flex: 1;
						font-size: 60rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.action {
						font-size: 24rpx;
						color: #999;
						text-align: right;
					}
				}
			}
			&.disease-risk {
				// display: flex;
				// // flex-direction: column;
				// flex-wrap: wrap;
				display: grid;
				grid-template-columns: repeat(3, calc(33.33% - 20rpx));
				grid-row-gap: 20rpx;
				grid-column-gap: 20rpx;
				.disease-item {
					padding: 10rpx 20rpx;
					border: 1px solid #999;
					display: flex;
					flex-direction: column;
					border-radius: 20rpx;
					min-height: 150rpx;
					&.text-red {
						border-color: #e54d42;
					}
					&.text-orange {
						border-color: #f37b1d;
					}
					.disease-name {
						font-size: 32rpx;
						flex: 1;
						// color: #666;
					}
					.number {
						font-size: 26rpx;
						min-width: 100rpx;
						flex: 1;
						text-align: center;
						.digit {
							font-size: 60rpx;
						}
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
.health-item {
	min-height: 150rpx;
	display: flex;
	padding: 50rpx 30rpx;
	display: flex;
	flex-direction: column;
	.tips {
		color: #999;
		padding: 20rpx 0;
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
