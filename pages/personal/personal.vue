<template>
	<view class="container" :style="{
		'--global-text-font-size':globalTextFontSize+'px',
		'--global-label-font-size':globalLabelFontSize+'px'
	}">
		<view class="container-top" @click="toPages('updateInfo')">
			<view class="top-left">
				<image
					v-if="((authSetting && authSetting.userInfo) || client_env === 'h5') && (vuex_userInfo.user_image || vuex_userInfo.profile_url)"
					class="image"
					:src="getImagePath(vuex_userInfo.user_image) ? getImagePath(vuex_userInfo.user_image) : getImagePath(vuex_userInfo.profile_url)"
				></image>
				<text class="cuIcon-people image" v-else></text>
			</view>
			<view class="top-right" v-if="vuex_userInfo && vuex_userInfo.name && ((authSetting && authSetting.userInfo) || client_env === 'h5')">
				<view class="top-right-name">{{ vuex_userInfo.name }}</view>
			</view>
			<view class="top-right" v-if="(!authSetting || !authSetting.userInfo) && client_env === 'wxmp'">
				<view class="top-right-name">游客</view>
				<view class="top-right-name">
					<button class="cu-btn bg-green margin-top-xs auth-button" type="primary" open-type="getUserInfo" @getuserinfo="getuserinfo">授权微信登录</button>
				</view>
			</view>
		</view>
		<view class="container-cen">
			<view class="container-cen-top">
				<view class="container-cen-top-list" @click="toPages('doctor')">
					<text class="cuIcon-service text-blue" style="font-size: 70rpx;"></text>
					<text>我的医生</text>
					<view class="message-tag">{{ doctor_message }}</view>
				</view>
				<view class="container-cen-top-list" @click="toPages('userList')">
					<text class="cuIcon-comment text-green" style="font-size: 70rpx;"></text>
					<text>我的用户</text>
					<view class="message-tag">{{ hzMessage }}</view>
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
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
	name: 'mine-info',
	data() {
		return {
			wxUserInfo: '',
			userInfo: '',
			doctor_message: 0,
			hzMessage: 0
		};
	},
	computed: {
		...mapState({
			'globalTextFontSize':state=>state.app["globalTextFontSize"],
			'globalLabelFontSize':state=>state.app.globalLabelFontSize
		}),
		...mapGetters({
			vuex_userInfo: 'userInfo',
			authSetting: 'authSetting',
			is_login: 'isLogin',
			wxuserinfo: 'wxUserInfo',
			login_user_info: 'loginUserInfo',
			client_env: 'env',
			authBoxDisplay: 'authBoxDisplay'
		})
	},
	methods: {
		async getDoctorAllRecod(userNo) {
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_consultation_chat_record_select',
				colNames: ['*'],
				condition:[{
					colName: 'receiver_account',
					ruleType: 'eq',
					value: userNo
				},
				{
					colName: 'msg_state',
					ruleType: 'eq',
					value: '未读'
				},
				{
					colName: 'identity',
					ruleType: 'notnull'
				}],
				// relation_condition: {
				// 	relation: 'OR',
				// 	data: [
				// 		{
				// 			relation: 'AND',
				// 			data: [
				// 				{
				// 					colName: 'receiver_account',
				// 					ruleType: 'eq',
				// 					value: userNo
				// 				},
				// 				{
				// 					colName: 'msg_state',
				// 					ruleType: 'eq',
				// 					value: '未读'
				// 				}
				// 			]
				// 		}
				// 	]
				// },
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			let res = await this.$http.post(url, req);
			return res.data.data.length;
		},
		async getBindDoctor() {
			// 查找医生信息
			let url = this.getServiceUrl('health', 'srvhealth_patient_doctor_select', 'select');
			let req = {
				serviceName: 'srvhealth_patient_doctor_select',
				colNames: ['*'],
				condition: [{ colName: 'customer_no', ruleType: 'like', value: this.userInfo.no }],
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
				// this.doctorList = res.data.data;
				let noList = res.data.data.map(item => item.manager_no);
				let noStr = noList.toString();
				let doctorList = await this.getDoctorInfoMessage(noStr, true);
			}
		},
		async getUserDoctorInfo(customer_no){
			let url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'no', ruleType: 'eq', value: customer_no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			console.log("iserInfo-----",res)
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				return res.data.data[0]
			}
		},
		async getBindhzDoctor(no) {
			// 查询患者信息
			let url = this.getServiceUrl('health', 'srvhealth_patient_doctor_select', 'select');
			let req = {
				serviceName: 'srvhealth_patient_doctor_select',
				colNames: ['*'],
				condition: [{ colName: 'manager_no', ruleType: 'like', value: no }],
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
				// this.doctorList = res.data.data;
				let arr = []
				res.data.data.forEach(items=>{
					this.getUserDoctorInfo(items.customer_no).then(r=>{
						if(r && r.userno){
							arr.push(r.userno)
						}
					}).then(_=>{
						let noStr = arr.toString()
						// let doctorList = await this.getDoctorRecod(noStr)
						this.getDoctorRecod(noStr,'患者').then(l=>{
							console.log("l------------>",l)
							this.hzMessage = l
						})
					})
				})
				// let noList = res.data.data.map(item => item.customer_name);
				
				// console.log('查询----', doctorList, res.data.data);
			}
		},
		toPages(e) {
			// #ifdef MP-WEIXIN
			if (!this.authSetting || !this.authSetting.userInfo) {
				uni.showToast({
					title: '请先授权微信登录后再进行操作',
					icon: 'none'
				});
				return;
			}
			// #endif

			let self = this;
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
					let userInfo = uni.getStorageSync('wxUserInfo');
					let fieldsCond = [
						{ column: 'dt_profile_url', display: false, value: this.vuex_userInfo ? this.vuex_userInfo.profile_url : '' },
						{ column: 'owner_account', display: false, value: uni.getStorageSync('login_user_info').user_no }
					];
					uni.navigateTo({
						url: '/publicPages/newForm/newForm?serviceName=srvhealth_doctor_add&type=add&fieldsCond=' + decodeURIComponent(JSON.stringify(fieldsCond))
						// url: '/pages/form/form?serviceName=srvhealth_doctor_add&type=add&fieldsCond=' + decodeURIComponent(JSON.stringify(fieldsCond))
					});
					break;
				case 'userList':
					this.getDoctorInfo().then(res => {
						if (res&&res.dt_no) {
							this.$store.commit('SET_DOCTOR_INFO',res)
							uni.navigateTo({
								url: '/personalPages/userList/userList'
							});
						} else {
							uni.showModal({
								title: '提示',
								content: '您还不是医生，是否申请成为医生',
								success(res) {
									if (res.confirm) {
										self.toPages('beDoctor');
									}
								}
							});
						}
					});
					break;
				case 'updateInfo':
					// let cond = [
					// 	{
					// 		colName: 'no',
					// 		ruleType: 'in',
					// 		value: this.vuex_userInfo.no
					// 	}
					// ];
					// let params = {
					// 	type: 'detail',
					// 	condition: cond,
					// 	serviceName: 'srvhealth_person_info_select'
					// };
					if (this.vuex_userInfo.no) {
						let fieldsCond = [
							{
								column: 'no',
								value: this.vuex_userInfo.no
							}
						];
						uni.navigateTo({
							url: '/publicPages/newForm/newForm?serviceName=srvhealth_person_info_select&type=detail&fieldsCond=' + encodeURIComponent(JSON.stringify(fieldsCond))
							// url: '/publicPages/form/form?type=detail&params=' + encodeURIComponent(JSON.stringify(params))
						});
					}
					break;
			}
		},
		async getDoctorRecod(userNo,type) {
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_consultation_chat_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'sender_account',
						ruleType: 'in',
						value: userNo
					},
					{
						colName: 'msg_state',
						ruleType: 'eq',
						value: '未读'
					},
					{
						colName: 'identity',
						ruleType: 'eq',
						value: type
					},
					{
						colName: 'receiver_account',
						ruleType: 'eq',
						value: this.userInfo.userno
					}
				],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			let res = await this.$http.post(url, req);
			return res.data.data.length;
		},
		async getDoctorInfoMessage(no, isSelf) {
			// 查找医生信息
			let url = this.getServiceUrl('health', 'srvhealth_doctor_select', 'select');
			let req = {
				serviceName: 'srvhealth_doctor_select',
				colNames: ['*'],
				condition: [{ colName: 'dt_no', ruleType: 'in', value: no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				if (isSelf === true) {
					this.doctorList = res.data.data;
					let arr = res.data.data.map(item => {
						return item.owner_account;
					});
					let str = arr.join(',');
					let count_num = 0;
					this.getDoctorRecod(str,'医生').then(length => {
						count_num += length;
						this.doctor_message = count_num;
						console.log('-----------------length---', count_num);
					});
				}
				return res.data.data[0];
			} else {
				return false;
			}
		},
		async getDoctorInfo() {
			// 查找医生信息
			let url = this.getServiceUrl('health', 'srvhealth_doctor_select', 'select');
			let req = {
				serviceName: 'srvhealth_doctor_select',
				colNames: ['*'],
				condition: [{ colName: 'owner_account', ruleType: 'like', value: this.wxuserinfo.user_no ? this.wxuserinfo.user_no : this.vuex_userInfo.userno }]
			};
			if (req.condition[0].value) {
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
					return res.data.data[0];
				} else {
					return false;
				}
			}
		},
		toPersonDetail(type) {
			// #ifdef MP-WEIXIN
			if (!this.authSetting || !this.authSetting.userInfo) {
				uni.showToast({
					title: '请先授权微信登录后再进行操作',
					icon: 'none'
				});
				return;
			}
			// #endif
			uni.navigateTo({
				url: '/otherPages/personalDetail/personalDetail?type=' + type
			});
		},
		async initPage() {
			let self = this;
			// #ifdef MP-WEIXIN
			let res = await wx.getSetting();
			if (!res.authSetting['scope.userInfo']) {
				this.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: false });
				// 没有获取用户信息授权
			} else {
				this.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: true });
				uni.getUserInfo({
					provider: 'weixin',
					success: function(user) {
						let rawData = {
							nickname: user.userInfo.nickName,
							sex: user.userInfo.gender,
							country: user.userInfo.country,
							province: user.userInfo.province,
							city: user.userInfo.city,
							headimgurl: user.userInfo.avatarUrl
						};
						self.$store.commit('SET_WX_USERINFO', rawData);
						self.wxUserInfo = rawData;
					}
				});
				let currentUserInfo = await this.selectBasicUserList();
				if (currentUserInfo) {
					this.$store.commit('SET_USERINFO', currentUserInfo);
					this.userInfo = currentUserInfo;
				} else if (currentUserInfo === 0) {
					// 没有创建用户
					uni.getUserInfo({
						provider: 'weixin',
						success: function(user) {
							let rawData = {
								nickname: user.userInfo.nickName,
								sex: user.userInfo.gender,
								country: user.userInfo.country,
								province: user.userInfo.province,
								city: user.userInfo.city,
								headimgurl: user.userInfo.avatarUrl
							};
							self.$store.commit('SET_WX_USERINFO', rawData);
							self.wxUserInfo = rawData;
							self.toAddPage(rawData).then(_ => {
								self.initPage();
							});
						}
					});
				}
			}
			// #endif
			if (!this.is_login) {
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
			// let wxUserInfo = uni.getStorageSync('wxUserInfo');
			// this.wxUserInfo = wxUserInfo;
		},
		async getuserinfo(e) {
			// #ifdef MP-WEIXIN
			const user = e.mp.detail;
			if (user && user.userInfo) {
				let rawData = {
					nickname: user.userInfo.nickName,
					sex: user.userInfo.gender,
					country: user.userInfo.country,
					province: user.userInfo.province,
					city: user.userInfo.city,
					headimgurl: user.userInfo.avatarUrl
				};
				this.setWxUserInfo(rawData);
				this.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: true });
				const result = await wx.login();
				if (result.code) {
					this.wxLogin({
						code: result.code
					});
					this.initPage();
				}
			}
			// #endif
		}
	},
	onShow() {
		this.userInfo = uni.getStorageSync('current_user_info');
		this.getDoctorAllRecod(this.userInfo.userno).then(r => {
			if(r > 99){
				r = '99+'
			}else{
				r = r.toString()
			}
			uni.setTabBarBadge({
				index: 3,
				text: r,
				success: e => {
					console.log('success---', e);
				},
				fail: fails => {
					console.log('fails----', fails);
				}
			});
		});
		this.getBindDoctor();
		this.getDoctorInfo().then(res => {
			if (res) {
				this.getBindhzDoctor(res.dt_no);
			}
			console.log('res-onshow---', res);
		});
	},
	onPullDownRefresh() {
		this.initPage().then(_ => {
			uni.stopPullDownRefresh();
		});
	},
	onTabItemTap() {
		this.initPage();
	},
	async created() {
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// #endif
	}
};
</script>
<style lang="scss" scoped>
.container {
	height: calc(100vh - var(--window-top) - var(--window-bottom));
	font-size: var(--global-text-font-size);
	overflow: hidden;
	background-color: #fff;
}
.container-top {
	width: 100%;
	height: 300rpx;
	padding-top: 10rpx;
	background-color: #0bc99d;
	display: flex;
	position: relative;
	align-items: center;
	.bg-view {
		width: 100%;
		height: 300rpx;
		background-size: 100% 300rpx;
		background-repeat: no-repeat;
		filter: blur(20rpx);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
	}
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
		z-index: 2;
		.cuIcon-people {
			border: 2rpx solid #333;
		}
		.image {
			width: 120rpx;
			height: 120rpx;
			border-radius: 50%;
			overflow: hidden;
			font-size: 50rpx;
			color: #333;
			border-radius: 50%;
			text-align: center;
			line-height: 120rpx;
			// border: 2rpx solid #333;
		}
	}
	.top-right {
		color: white;
		// font-size: 16px;
		font-size: var(--global-text-font-size);
		margin-left: 20upx;
		z-index: 2;
		// color: #333;
		.top-right-name {
			min-height: 40rpx;
		}
		.auth-button {
			border-radius: 30rpx;
			color: #fff;
			min-width: 500rpx;
		}
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
			position: relative;
			image {
				width: 80upx;
				height: 80upx;
			}
			.message-tag {
				position: absolute;
				right: 0;
				background: red;
				color: white;
				border-radius: 18rpx;
				padding: 1px 2px;
				top: -2px;
				min-width: 44rpx;
				height: 32rpx;
				text-align: center;
				font-size: 24rpx;
			}
		}
	}
	.container-bot {
		margin-top: 40upx;
		.content{
			font-size: var(--global-text-font-size);
		}
	}
}
</style>
