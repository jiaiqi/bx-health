<template>
	<view class="health-archive-wrap">
		<view class="top text-bold">
			<view class="left">
				<view class="avatar" @click="showUserListPopup = true"><image class="avatar" :src="avatarUrl"></image></view>
				<view class="user-name" @click="showUserListPopup = true">{{ userInfo.name }}</view>
				<view class="switch-icon cuIcon-right" @click="showUserListPopup = true"></view>
				<view class="tag-box" @click="showUserHealtManagePopup = true">
					<text class="tag-item" v-for="item in selectedTags" :key="item.value">{{ item.label }}</text>
				</view>
			</view>
			<view class="right" @click="showUserHealtManagePopup = true" v-if="selectedTags.length === 0">健康标签管理</view>
		</view>
		<view class="user-info-tip">
			<text class="tips" @click="toPages('basic-info')">
				<text class="cuIcon-info"></text>
				<text class="text">信息完整度: 75%</text>
			</text>
		</view>
		<view class="health-overall-score">
			<view class="content">
				<view class="score-item" @click="toPages('score-compose')">
					<text class="label">整体健康分</text>
					<text class="value text-blue" v-if="healthTotalScore || healthTotalScore === 0">{{ healthTotalScore }}</text>
					<text class="valuetip text-blue" v-else>
						<text class="cuIcon-all"></text>
						点击评测
					</text>
					<view class="trend" v-if="healthTotalScore">
						<!-- <image src="/static/icon/down3.png" mode="aspectFit" class="trend-icon" style="transform: rotate(180deg);"></image> -->
						<image src="/static/icon/up3.png" mode="aspectFit" class="trend-icon"></image>
						<text class="text">较上次评测增加两分</text>
					</view>
				</view>
				<view class="score-item">
					<text class="label">近日健康分</text>
					<text class="value  text-cyan">
						64
						<text class="ratio"></text>
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
				<text class="title-text">近日健康指数</text>
				<view class="title-action" @click="navPages('history')">
					<text class="cuIcon-time"></text>
					<text class="see-histroy">查看历史</text>
				</view>
			</view>
			<view class="content grid-layout">
				<view class="grid-item" @click="toPages('diet')">
					<view class="title">
						饮食
						<text class="ratio">[50%]</text>
					</view>
					<view class="data text-green">71</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('sport')">
					<view class="title">
						运动
						<text class="ratio">[20%]</text>
					</view>
					<view class="data text-red">20</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('weight')">
					<view class="title">
						体重
						<text class="ratio">[5%]</text>
					</view>
					<view class="data text-gray">{{ weightScore ? weightScore : 0 }}</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('bp')">
					<view class="title">
						血压
						<text class="ratio">[5%]</text>
					</view>
					<view class="data text-gray">0</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('sleep')">
					<view class="title">
						睡眠
						<text class="ratio">[10%]</text>
					</view>
					<view class="data text-blue">85</view>
					<view class="action"></view>
				</view>
				<view class="grid-item">
					<view class="title">
						症状
						<text class="ratio">[10%]</text>
					</view>
					<view class="data text-orange">45</view>
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
				</view>
				<view class="disease-item text-orange">
					<view class="disease-name">肥胖</view>
					<view class="number">
						<!-- 风险: -->
						<text class="digit">75</text>
						%
					</view>
				</view>
			</view>
		</view>
		<u-popup v-model="showUserListPopup" border-radius="40" mode="top">
			<view class="user-list">
				<view class="user-item" @click="userInfo = item" v-for="item in userList" :key="item.id" :class="{ 'text-blue': item.name === userInfo.name }">
					<image class="avatar" :src="getavatarUrl(item.profile_url)" size="60"></image>
					{{ item.name }}
				</view>
			</view>
			<view class="button-box"><button class="cu-btn bg-white text-blue" @click="toAddPage">添加新用户</button></view>
		</u-popup>
		<u-popup v-model="showUserHealtManagePopup" border-radius="40" mode="bottom">
			<view class="health-item">
				<view class="tips">
					<text class="cuIcon-info"></text>
					最多只能勾选五项
				</view>
				<checkbox-group @change="checkboxGroupChange" class="check-box-group">
					<label v-for="(item, index) in checkboxList" :key="index" class="check-box-item">
						<checkbox :value="item.value" :checked="item.checked" color="#FFCC33" style="transform:scale(0.7)" :disabled="disabledTag && !checkedList.includes(item.value)" />
						{{ item.label }}
					</label>
				</checkbox-group>
				<view class="button-box">
					<button class="cu-btn bg-gray" @click="cancelSelectTag">取消</button>
					<button class="cu-btn bg-blue" @click="changeSelectedTag">确定</button>
				</view>
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
			healthTotalScore: null,
			userList: [],
			userInfo: {},
			loginUserInfo: {},
			checkboxList: [
				{
					value: '备孕',
					checked: false
				},
				{
					value: '孕期',
					checked: false
				},
				{
					value: '哺乳期',
					checked: false
				},
				{
					value: '肥胖',
					checked: false
				}
			],
			selectedTags: [],
			checkedList: []
		};
	},
	computed: {
		disabledTag() {
			return this.checkedList.length >= 5;
		},
		avatarUrl() {
			if (this.userInfo.profile_url) {
				return this.$api.downloadFile + this.userInfo.profile_url + '&thumbnailType=fwsu_100' + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
			} else if (this.loginUserInfo.headimgurl) {
				return this.loginUserInfo.headimgurl;
			}
		},
		bmi() {
			if (this.userInfo.weight && this.userInfo.height) {
				return (Number(this.userInfo.weight) / Math.pow(Number(this.userInfo.height) / 100, 2)).toFixed(1);
			}
		},
		age() {
			if (this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
				return age;
			}
		},
		dietScore() {
			return 0;
		},
		weightScore() {
			// 计算体重分数
			if (this.bmi) {
				let bmi = this.bmi;
				let result = 0;
				// >28 及<10 都是0
				if (bmi <= 28 && bmi >= 24) {
					//0-2.5
					result = (2.5 * (28 - bmi)) / 4;
				} else if (bmi >= 21 && bmi < 24) {
					// 5-2.5
					result = 5 - (bmi - 21) / 3;
				} else if (bmi >= 18.5 && bmi < 21) {
					//2.5-5
					result = 2.5 + bmi - 18.5;
				} else if (bmi < 18.5 && bmi >= 10) {
					//2.5-0
					result = (Math.abs(10 - bmi) * 2.5) / 8.5;
				}
				return Number(result.toFixed(1));
			}
		}
	},
	methods: {
		calcDietScore(){
			// 满分 50
			let result = 0
			let bmi = this.bmi
			// bmi 占10分
			if(bmi>24&&bmi<=28){
				// 超重 饮食热量需要比基础代谢低
				
			}else if(bmi>=18.5&&bmi<=24){
				// 超重 饮食热量需要比基础代谢低
				result +=10
			}else if(bmi<18.5){
				// 体重过轻 饮食热量需要比基础代谢高
				
			}
			
		},
		calcSportScore(){
			// 满分20
			
		},
		calcSleepScore(){
			// 满分10分 睡觉时间：7小时以内每小时1分;11点前2分，12点1分
			
		},
		getDietRecord(){
			// 查找饮食记录
		},
		async getCheckboxList() {
			let url = this.getServiceUrl('health', 'srvsys_service_columnex_v2_select', 'select');
			let req = {
				serviceName: 'srvsys_service_columnex_v2_select',
				colNames: ['*'],
				condition: [{ colName: 'service_name', value: 'srvhealth_person_info_select', ruleType: 'eq' }, { colName: 'use_type', value: 'list', ruleType: 'eq' }],
				order: [{ colName: 'seq', orderType: 'asc' }]
			};
			let res = await this.$http.post(url, req);
			if (res.data.resultCode === 'SUCCESS' && Array.isArray(res.data.data.srv_cols)) {
				let { srv_cols } = res.data.data;
				let requirement = null;
				if (Array.isArray(srv_cols) && srv_cols.length > 0) {
					srv_cols.forEach(item => {
						if (item.columns === 'requirement') {
							this.checkboxList = item.option_list_v2.map(item => {
								item['checked'] = false;
								return item;
							});
						}
					});
				}
			}
		},
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
				case 'score-compose':
					url = '/archivesPages/healthCompose/healthCompose';
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
		changeSelectedTag() {
			this.selectedTags = this.checkboxList.filter(item => item.checked);
			this.checkedList = this.checkboxList.filter(item => item.checked).map(item => item.label);
			this.updataUserTags().then(res => {
				this.showUserHealtManagePopup = false;
			});
		},
		async updataUserTags() {
			let url = this.getServiceUrl('health', 'srvhealth_person_info_update', 'operate');
			let requirement = this.selectedTags.map(item => item.value);
			if (Array.isArray(requirement) && requirement.length > 0) {
				let req = [
					{
						serviceName: 'srvhealth_person_info_update',
						condition: [{ colName: 'no', ruleType: 'eq', value: this.userInfo.no }],
						data: [{ requirement: requirement.toString() }]
					}
				];
				if (this.userInfo.no) {
					let res = await this.$http.post(url, req);
					if (res.data.state === 'SUCCESS') {
						return res.data;
					}
				}
			}
		},
		cancelSelectTag() {
			if (Array.isArray(this.selectedTags) && this.selectedTags.length === 0) {
				this.checkboxList = this.checkboxList.map(item => {
					item.checked = false;
					return item;
				});
			} else if (Array.isArray(this.selectedTags) && this.selectedTags.length > 0) {
				this.checkboxList = this.checkboxList.map(item => {
					item.checked = false;
					this.selectedTags.forEach(sel => {
						if (item.label === sel.label) {
							item.checked = true;
						}
					});
					return item;
				});
			}
			this.checkedList = this.checkboxList.filter(item => item.checked).map(item => item.label);
			this.showUserHealtManagePopup = false;
		},
		checkboxGroupChange(e) {
			console.log(e);
			var items = this.checkboxList,
				values = e.detail.value;
			for (var i = 0, lenI = items.length; i < lenI; ++i) {
				const item = items[i];
				if (values.includes(item.label)) {
					this.$set(item, 'checked', true);
				} else {
					this.$set(item, 'checked', false);
				}
			}
			this.checkedList = this.checkboxList.filter(item => item.checked).map(item => item.label);
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
		getavatarUrl(fileNo) {
			if (fileNo) {
				return this.$api.downloadFile + fileNo + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket') + '&thumbnailType=fwsu_100';
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
							console.log(this.checkboxList);
							this.userInfo = item;
						}
					});
				} else {
					uni.setStorageSync('current_user_info', res.data.data[0]);
					uni.setStorageSync('current_user', res.data.data[0].name);
					this.userInfo = res.data.data[0];
				}
				if (this.userInfo && this.userInfo.requirement) {
					let tags = this.userInfo.requirement.split(',');
					if (Array.isArray(this.checkboxList) && this.checkboxList.length > 0) {
						this.selectedTags = this.checkboxList.filter(item => {
							if (tags.includes(item.value)) {
								item.checked = true;
								return true;
							}
						});
					}
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
				// 未登录 h5跳转到登录页,小程序端进行静默登录
				// #ifdef MP-WEIXIN
				const result = await wx.login();
				if (result.code) {
					this.code = result.code;
					await this.wxLogin({ code: result.code });
					await this.initPage();
				}
				// #endif
				// #ifdef H5
				uni.navigateTo({
					url: '/publicPages/accountExec/accountExec'
				});
				// #endif
			} else {
				this.isLogin = true;
			}
			if (userInfo) {
				this.loginUserInfo = userInfo;
				await this.getCheckboxList();
				await this.selectUserList();
			}
		},
		toAddPage() {}
	},
	created() {
		uni.$on('healthTotalScoreChanged', result => {
			if (result) {
				this.healthTotalScore = result;
			}
		});
		let score = uni.getStorageSync('healthTotalScore');
		if (score) {
			this.healthTotalScore = score;
		}
	},
	onShow() {
		this.initPage();
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
	.user-info-tip {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		margin-bottom: 20rpx;
		.tips {
			min-width: 33%;
			color: #fff;
			border-top-right-radius: 50rpx;
			border-bottom-right-radius: 50rpx;
			// border-top-left-radius: 50rpx;
			// border-bottom-left-radius: 50rpx;
			background-color: #2b85e4;
			padding: 10rpx 20rpx;
			animation: 2s ease slidein;
			.text {
				margin-left: 10rpx;
			}
		}
	}
	@keyframes slidein {
		from {
			transform: translateX(-300px);
		}
		to {
			transform: translateX(0);
		}
	}
	.avatar {
		margin-right: 10rpx;
		width: 60rpx;
		height: 60rpx;
		border-radius: 100%;
	}
	.top {
		display: flex;
		padding: 20rpx 0;
		padding-right: 20rpx;
		background-color: #fff;
		justify-content: space-between;
		margin-bottom: 20rpx;
		flex-wrap: wrap;
		.left {
			display: flex;
			align-items: center;
			font-size: 30rpx;
			line-height: 30rpx;
			margin: 0 20rpx;
			.tag-box {
				.tag-item {
					padding: 10rpx;
					border-radius: 5rpx;
					margin-left: 10rpx;
					font-size: 20rpx;
					@for $i from 1 through 20 {
						&:nth-child(#{$i}) {
							@if $i%2==1 {
								color: #409eff;
								background: #ecf5ff;
								border-color: #b3d8ff;
							} @else if $i%2==0 {
								color: #67c23a;
								background: #f0f9eb;
								border-color: #c2e7b0;
							} @else if $i%3==0 {
								color: #909399;
								background: #f4f4f5;
								border-color: #d3d4d6;
							} @else if $i%4==0 {
								color: #e6a23c;
								background: #fdf6ec;
								border-color: #f5dab1;
							} @else if $i%5==0 {
								color: #f56c6c;
								background: #fef0f0;
								border-color: #fbc4c4;
							}
						}
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
				position: relative;
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
				.valuetip {
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 28rpx;
					height: 160rpx;
					width: 160rpx;
				}
				.trend {
					font-size: 30rpx;
					position: absolute;
					bottom: 10%;
					left: 10%;
					display: flex;
					align-items: center;
					.trend-icon {
						width: 32rpx;
						height: 32rpx;
					}
					.text-icon {
						display: inline-block;
						transform: rotate(180deg) scale(1, 1.5);
					}
					.text {
						transform: rotate(0) scale(1);
						font-size: 24rpx;
						color: #999;
					}
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
						.ratio {
							font-weight: normal;
							font-size: 24rpx;
							color: #999;
						}
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
	.check-box-group {
		display: flex;
		flex-wrap: wrap;
		.check-box-item {
			margin-right: 20rpx;
			min-width: 30%;
		}
	}
}
.user-list {
	min-height: 300rpx;
	padding: 50rpx 30rpx 30rpx;
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
	padding: 30rpx;
	font-weight: bold;
	text-align: center;
	.cu-btn {
		margin-right: 50rpx;
		&:last-child {
			margin-right: 0;
		}
	}
}
</style>
