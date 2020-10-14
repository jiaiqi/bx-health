<template>
	<view class="health-wrap" @click="clickPage">
		<u-navbar back-text="返回" :back-text-style="backTextStyle" :back-icon-color="backTextStyle.color" :is-back="false" :border-bottom="true" :background="navBackground">
			<view class="header-wrap">
				<view class="title">{{ pageTitle }}</view>
				<view class="user-info" @click.stop="showUserList = !showUserList">
					<u-avatar :src="profile_url" mode="circle" :size="60"></u-avatar>
					<view class="user-name" data-event="showUserList">
						<text class="text" data-event="showUserList">{{ userInfo.name }}</text>
						<u-icon name="arrow-down-fill" size="28" :class="{ active: showUserList }"></u-icon>
					</view>
					<view class="user-list" :class="{ active: showUserList }">
						<view class="menu-item" :class="{ 'current-user': userInfo.name === item.name }" @click.stop="clickUserMenu(item)" v-for="(item, index) in userMenuList" :key="index">
							{{ item.name }}
						</view>
						<view class="menu-item" @click.stop="clickUserMenu('regulate')">人员管理</view>
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="main-box" @click="toToday">
			<view class="main-box-title">今日概览</view>
			<view class="energy-item ">
				<view class="text">饮食摄入</view>
				<view class="number">{{ parseFloat(dietIn).toFixed(1) }}</view>
			</view>
			<view class="operate">-</view>
			<view class="energy-item">
				<view class="text">运动消耗</view>
				<view class="number">{{ parseFloat(sportOut).toFixed(1) }}</view>
			</view>
			<view class="operate">-</view>
			<view class="energy-item">
				<view class="text">基础代谢</view>
				<view class="number">{{ basicOut ? parseFloat(basicOut).toFixed(1) : '0' }}</view>
			</view>
			<view class="operate">=</view>
			<view class="energy-item">
				<view class="text">体重变化</view>
				<view class="number text-red" style="display: flex; width: 90px; justify-content: space-between;">
					<text style="flex:1;">{{ parseFloat(energyChange) > 0 ? `+${parseFloat(energyChange).toFixed(1)}` : parseFloat(energyChange).toFixed(1) }}</text>
					<text class="units">大卡</text>
				</view>
				<view class="number text-red" style="display: flex; width: 90px; justify-content: space-between;">
					<text style="flex:1;">
						{{ energyChange === 0 ? '0.0' : parseFloat(energyChange / 7.7) > 0 ? `+${parseFloat(energyChange / 7.7).toFixed(1)}` : parseFloat(energyChange / 7.7).toFixed(1) }}
					</text>
					<text class="units">g脂肪</text>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
let self;
export default {
	data() {
		return {
			loginUserInfo: {},
			pageTitle: '健康档案',
			showUserList: false,
			backTextStyle: {
				color: '#fff'
			},
			dietIn: 0, //饮食摄入
			sportOut: 0, //运动消耗
			modalName: '',
			showTimeSignPicker: false,
			userInfo: {},
			selectDate: this.formateDate(new Date(), 'date'),
			markDays: [],
			userMenuList: [],
			navBackground: {
				backgroundColor: '#0bc99d'
			}
		};
	},
	computed: {
		profile_url() {
			if (this.userInfo.profile_url) {
				return this.$api.downloadFile + this.userInfo.profile_url + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
			} else if (this.loginUserInfo.headimgurl) {
				return this.loginUserInfo.headimgurl;
			}
		},
		energyChange() {
			return Number(this.dietIn) - Number(this.sportOut) - Number(this.basicOut);
		},
		age() {
			if (this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
				return age;
			}
		},
		basicOut() {
			//基础代谢
			// IF(B4="男",IF(B3>=60,B2*13.4+490,IF(B3>=31,B2*11.5+830,B2*15.2+680)),IF(B3>=60,B2*10.4+600,IF(B3>=31,B2*8.6+830,B2*14.6+450)))
			if (this.userInfo.sex === '男') {
				if (this.age >= 60) {
					return this.userInfo.weight * 13.4 + 490;
				} else if (this.age >= 31 && this.age < 60) {
					return this.userInfo.weight * 11.5 + 830;
				} else {
					return this.userInfo.weight * 15.2 + 600; //<31
				}
			} else {
				if (this.age >= 60) {
					return this.userInfo.weight * 10.4 + 600;
				} else if (this.age >= 31 && this.age <= 60) {
					return this.userInfo.weight * 8.6 + 830;
				} else {
					return this.userInfo.weight * 14 + 450; //<31
				}
			}
		}
	},
	methods: {
		toToday() {
			uni.navigateTo({
				url: '/otherPages/balancedDiet/balancedDiet'
			});
		},
		/*查询当前登录人创建得用户信息**/
		async getCurrUserInfo() {
			self = this;
			const url = self.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let user = uni.getStorageSync('login_user_info').user_no;
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'userno', ruleType: 'eq', value: user }],
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
				uni.setStorageSync('current_user', res.data.data[0].name);
				uni.setStorageSync('user_info_list', res.data.data);
				this.userMenuList = res.data.data;
			} else {
				// 没有角色 提示跳转到创建角色页面
				uni.showModal({
					title: '提示',
					content: '当前账号未登记个人信息，即将跳转到信息登记页面',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							let condition = [{ colName: 'userno', ruleType: 'eq', value: user }];
							uni.navigateTo({
								url: '/publicPages/form/form?serviceName=srvhealth_person_info_add&type=add&cond=' + decodeURIComponent(JSON.stringify(condition))
							});
						}
					}
				});
			}
		},
		changeSignDate() {
			this.modalName = 'Modal';
			let dietRecord = null;
			this.showTimeSignPicker = !this.showTimeSignPicker;
		},
		closeDay(e) {
			this.modalName = '';
			this.showTimeSignPicker = false;
		},
		onDayClick(data) {
			this.curDate = data.date;
			this.showTimeSignPicker = false;
			this.selectDate = data.date;
			this.modalName = '';
			this.$refs.diet.getDietRecord(this.selectDate);
			this.$refs.diet.getSportsRecord(this.selectDate);
			this.$refs.diet.changeSub(4);
		},
		async getDietAllRecord() {
			//饮食记录
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: uni.getStorageSync('current_user') }
				],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			let res = await this.$http.post(url, req);
			console.log('00000000000000');
			if (res.data.state === 'SUCCESS') {
				this.getSportsAllRecord(res.data.data);
			}
		},
		async getSportsAllRecord(data) {
			// 运动记录
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_body_activity_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: uni.getStorageSync('current_user') }
				],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				let arr = [...data, ...res.data.data];
				let timeArr = [];
				arr.forEach(item => {
					timeArr.push(item.hdate);
				});

				let allRecord = Array.from(new Set(timeArr));
				this.markDays = allRecord;
			}
		},
		getSignature(formData) {
			let self = this;
			let linkurl = window.location.href.split('#')[0];
			let req = {
				serviceName: 'srvwx_app_signature_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'app_no',
						ruleType: 'eq',
						value: this.$api.appNo.wxh5
					},
					{
						colName: 'page_url',
						ruleType: 'eq',
						value: linkurl
					}
				]
			};
			console.log('linkurl', linkurl);
			uni.setStorageSync('linkUrl', null);
			self.$http.post(self.$api.getSignature, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					let resData = res.data.data[0];
					uni.setStorageSync('signatureInfo', resData);
					self.$wx.config({
						debug: false, // 调试阶段建议开启
						appId: resData.appId, // APPID
						timestamp: resData.timestamp, // 时间戳timestamp
						nonceStr: resData.noncestr, // 随机数nonceStr
						signature: resData.signature, // 签名signature
						// 需要调用的方法接口
						jsApiList: [
							'updateAppMessageShareData',
							'updateTimelineShareData',
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareWeibo',
							'onMenuShareQQ',
							'onMenuShareQZone'
						]
					});
					self.$wx.ready(() => {
						console.log('wx.ready()', self.wxUserInfo);
						self.$wx.updateAppMessageShareData({
							//自定义“分享给朋友”及“分享到QQ”按钮的分享内容
							imgUrl: self.wxUserInfo.headimgurl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
							desc: '百想健康', // 摘要,如果分享到朋友圈的话，不显示摘要。
							title: '百想健康', // 分享卡片标题
							// link:  window.location.href, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							success: function() {
								// 分享成功后的回调函数
							},
							cancel: function() {
								// 用户取消分享后执行的回调函数
								// //// alert('分享失败')
							}
						}); // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
						self.$wx.updateTimelineShareData({
							imgUrl: self.formData.fileUrl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
							desc: '百想健康', // 摘要,如果分享到朋友圈的话，不显示摘要。
							title: '百想健康', // 分享卡片标题
							link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							success: function() {
								// 分享成功后的回调函数
							},
							cancel: function() {
								// 用户取消分享后执行的回调函数
								// //// alert('分享失败')
							}
						});
					});
					self.$wx.error(function(res) {
						uni.showModal({
							title: '提示',
							content: JSON.stringify(res),
							success() {}
						});
					});
				} else {
					uni.showToast({
						title: '获取签名失败',
						icon: 'none'
					});
				}
			});
		},
		clickPage(e) {
			if (this.showUserList) {
				this.showUserList = false;
			}
		},
		async getUserInfo() {
			let url = this.$api.getUserInfo;
			let req = {
				serviceName: 'srvwx_basic_user_info_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'app_no',
						ruleType: 'eq',
						value: this.$api.appNo.wxmp
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				const userInfo = res.data.data[0];
				this.wxUserInfo = userInfo;
				uni.setStorageSync('wxUserInfo', userInfo);
				if (userInfo.headimgurl) {
					this.src = userInfo.headimgurl;
				}
				// #ifdef H5
				// this.getSignature();
				// #endif
			}else{
				// 没有用户信息 
			}
		},
		clickUserMenu(e) {
			console.log(e);
			if (e === 'regulate') {
				let viewTemp = {
					title: 'name',
					tip: 'sex',
					img: 'pic',
					footer: 'job'
				};
				let cond = [
					{
						colName: 'userno',
						ruleType: 'eq',
						value: 'user_no'
					}
				];
				uni.navigateTo({
					url:
						'/publicPages/list/list?serviceName=srvhealth_person_info_select&navigationBarTitle=我的车辆&pageType=list&type=skip&viewTemp=' +
						decodeURIComponent(JSON.stringify(viewTemp)) +
						'&cond=' +
						decodeURIComponent(JSON.stringify(cond))
				});
			} else if (e === 'health') {
				uni.navigateTo({
					url: '/pages/balancedDiet/balancedDiet'
				});
			} else {
				uni.setStorageSync('current_user', e.name);
				uni.setStorageSync('current_user_info', e);
				this.userInfo = e;
				this.$refs.diet.resetRadioArr();
				this.$refs.diet.changeSub(4);
				this.$refs.diet.getDietRecord();
				this.$refs.diet.getSportsRecord();
			}
			this.showUserList = false;
		}
	},
	created() {
		uni.$on('dietInChange',(dietIn)=>{
			this.dietIn = dietIn
		})
		uni.$on('sportOutChange',(sportOut)=>{
			this.dietIn = dietIn
		})
	},
	onShow() {
		self = this;
		uni.setStorageSync('activeApp', 'health');
		let userInfo = uni.getStorageSync('login_user_info');
		if (userInfo && userInfo.user_no) {
			this.getUserInfo();
			this.loginUserInfo = userInfo;
			this.getCurrUserInfo().then(_ => {
				if (uni.getStorageSync('current_user_info')) {
					this.userInfo = uni.getStorageSync('current_user_info');
				} else {
					let userList = uni.getStorageSync('user_info_list');
					if (Array.isArray(userList) && userList.length > 0) {
						this.userInfo = userList[0];
						uni.setStorageSync('current_user_info', userList[0]);
					}
				}
			});
			this.getDietAllRecord();
		}
	}
};
</script>

<style lang="scss" scoped>
.health-wrap {
	background-color: #f1f1f1;
	height: 100vh;
	/deep/ .u-navbar {
		border-bottom: 1px solid #f1f1f1;
	}
	text-align: center;
	position: relative;
}
.switch-date {
	/* #ifdef MP-WEIXIN */
	width: 100%;
	/* #endif */
	height: 50rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #fff;
	color: #333;
	.u-icon {
		padding-left: 10rpx;
		position: relative;
		top: -2px;
	}
}
.header-wrap {
	// 顶部导航栏
	color: #f1f1f1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex: 1;
	padding: 0 30rpx;
	position: relative;
	/* #ifdef MP-WEIXIN */
	width: 100vw;
	justify-content: center;
	/* #endif */
	.title {
		// 顶部标题
		font-weight: 700;
		/* #ifdef MP-WEIXIN */
		position: absolute;
		left: 10rpx;
		/* #endif */
	}
	.switch-date {
		height: 50rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #0bc99d;
		color: #fff;
		.u-icon {
			padding-left: 10rpx;
		}
	}
	.user-info {
		display: flex;
		align-items: center;
		position: relative;
		.user-name {
			min-width: 100rpx;
			display: flex;
			.text {
				padding: 0 10rpx 0 20rpx;
			}
			.u-icon {
				transition: all 0.5s;
				&.active {
					transform: rotate(90deg);
				}
			}
		}
		.user-list {
			position: absolute;
			box-sizing: border-box;
			width: 200rpx;
			height: 0;
			border-radius: 10rpx;
			right: 0;
			opacify: 0;
			transition: all 0.5s;
			overflow: hidden;
			background-color: #fff;
			&.active {
				border: 1px solid #ddd;
				opacify: 1;
				height: auto;
				top: 70rpx;
				z-index: 999;
			}
			.menu-item {
				color: #333;
				min-height: 80rpx;
				font-weight: bold;
				border-bottom: 1px solid #fef0f0;
				font-size: 16px;
				display: flex;
				align-items: center;
				padding-left: 30rpx;
				&.current-user {
					color: #0586ff;
				}
			}
			.user {
				width: 100%;
				height: 50rpx;
				padding: 5rpx;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom: 1rpx solid #fff;
			}
		}
	}
}
.main-box {
	width: 100%;
	display: flex;
	box-sizing: border-box;
	width: 100%;
	padding: 10rpx;
	flex-wrap: wrap;
	background-color: #fff;
	justify-content: space-between;
	margin: 10rpx 0;
	.main-box-title {
		width: 100%;
	}
	.energy-item {
		min-height: 100upx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		.text {
			font-size: 20upx;
		}
		.number {
			font-size: 30upx;
			text-align: center;
		}
		.text-red {
			color: #red;
			text-align: right;
		}
		.units {
			min-width: 65rpx;
			padding-left: 10upx;
			font-size: 20upx;
			color: #000;
		}
	}
	.operate {
		font-size: 60upx;
		font-weight: 600;
		width: 60upx;
		text-align: center;
	}
}
.popup-box {
	display: flex;
	justify-content: center;
	padding: 50rpx 0 20rpx;
	flex-wrap: wrap;
	.icon-item {
		// width: 33%;
		min-width: 22%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		height: 210rpx;
		align-items: center;
		.icon {
			width: 130rpx;
			height: 130rpx;
			border-radius: 100%;
			background-color: rgba($color: orange, $alpha: 0.1);
			padding: 30rpx;
		}
		.label {
			padding: 10rpx 0;
		}
	}
}
.close-icon {
	width: 100%;
	padding-bottom: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	.cuIcon-close {
		padding: 20rpx;
		border-radius: 50%;
		background-color: #f1f1f1;
		font-size: 40rpx;
	}
}
</style>
