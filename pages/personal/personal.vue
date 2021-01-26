<template>
	<view
		class="container"
		:style="{
			'--global-text-font-size': globalTextFontSize + 'px',
			'--global-label-font-size': globalLabelFontSize + 'px'
		}"
	>
		<view class="container-top" @click="toPages('updateInfo')">
			<view class="top-left">
				<image
					v-if="((authSetting && authSetting.userInfo) || client_env === 'h5') && (vuex_userInfo.user_image || vuex_userInfo.profile_url)"
					class="image"
					:src="getImagePath(vuex_userInfo.user_image) ? getImagePath(vuex_userInfo.user_image) : getImagePath(vuex_userInfo.profile_url)"
				></image>
				<image class="image" src="../../static/man-profile.png" v-else></image>
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
				<view class="container-cen-top-list bg-white" @click="toPages('doctor')">
					<text class="cuIcon-service" style="font-size: 30px;"></text>
					<text class="label">我的医生</text>
					<view v-if="doctor_message != 0" class="message-tag">{{ doctor_message }}</view>
				</view>
				<view class="container-cen-top-list bg-white" @click="toPages('userList')">
					<text class="cuIcon-comment" style="font-size: 30px;"></text>
					<text class="label">我的用户</text>
					<view v-if="hzMessage != 0" class="message-tag">{{ hzMessage }}</view>
				</view>
				<view class="container-cen-top-list bg-white" @click="toPages('group')">
					<text class="cuIcon-group" style="font-size: 30px;"></text>
					<text class="label">圈子</text>
					<view v-if="groupMsgUnreadAmount != 0" class="message-tag">{{ groupMsgUnreadAmount }}</view>
				</view>
				<view class="container-cen-top-list bg-white" @click="toPages('mineStore')">
					<text class="cuIcon-home" style="font-size: 30px;"></text>
					<text class="label">我的单位</text>
					<!-- <view v-if="groupMsgUnreadAmount != 0" class="message-tag">{{ groupMsgUnreadAmount }}</view> -->
				</view>
				<!-- 		<view class="container-cen-top-list bg-white" @click="toPages('group')">
					<text class="cuIcon-edit" style="font-size: 30px;"></text>
					<text class="label">方案计划</text>
				</view> -->
				<!-- 		<view class="container-cen-top-list bg-white" @click="toPages('pinggu')">
					<text class="cuIcon-addressbook " style="font-size: 70rpx;"></text>
					<text>家庭成员</text>
				</view> -->
			</view>
			<view class="container-bot">
				<view class="cu-list menu sm-border">
					<view @click="toPages('updateInfo')" class="cu-item arrow">
						<!-- <view @click="toPersonDetail('person')" class="cu-item arrow"> -->
						<view class="content">
							<text class="cuIcon-news"></text>
							<text class="text-grey">基本信息</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="toPages('beDoctor')" v-if="!manager_type">
						<view class="content">
							<text class="cuIcon-form"></text>
							<text class="text-grey">成为管理者</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="toPages('card')" v-if="manager_type">
						<view class="content">
							<text class="cuIcon-qr_code"></text>
							<text class="text-grey">二维码名片</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="toPages('font')">
						<view class="content">
							<text class="cuIcon-font"></text>
							<text class="text-grey">字体设置</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="toPages('about')">
						<view class="content">
							<text class="cuIcon-global"></text>
							<text class="text-grey">关于小程序</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="{ show: showModal }" v-if="!manager_type">
			<view class="cu-dialog">
				<view class="padding-sm">
					<view class="text-bold">选择您要申请的管理者类型</view>
					<bx-checkbox-group mode="button" class="margin-top" v-model="checkedManagerType">
						<bx-checkbox v-for="item in managerTypeList" :key="item.label" v-model="item.checked" :name="item.value">{{ item.label }}</bx-checkbox>
					</bx-checkbox-group>
				</view>
				<view class="button-box">
					<button class="bg-grey cu-btn button" @click="hideModal">取消</button>
					<button class="bg-blue button" @click="updateManagerType">确定</button>
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
			hzMessage: 0,
			groupMsgUnreadAmount: 0,
			manager_type: '',
			showModal: false,
			checkedManagerType: ['医师'],
			managerTypeList: [
				{
					label: '医师',
					value: '医师',
					checked: true
				},
				{
					label: '营养师',
					value: '营养师',
					checked: false
				},
				{
					value: '健身教练',
					label: '健身教练',
					checked: false
				},
				{
					value: '健康管理师',
					label: '健康管理师',
					checked: false
				}
			]
		};
	},
	computed: {
		...mapState({
			globalTextFontSize: state => state.app['globalTextFontSize'],
			globalLabelFontSize: state => state.app.globalLabelFontSize,
			authUserInfo: state => state.app.authUserInfo
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
		hideModal() {
			this.showModal = false;
		},
		async getDoctorAllRecod(userNo, docNO) {
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_consultation_chat_record_select',
				colNames: ['*'],
				condition: [
					{
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
					}
				],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			if (Array.isArray(docNO)) {
				req.condition.push({
					colName: 'sender_person_no',
					ruleType: 'in',
					value: docNO.toString()
				});
			}
			let res = await this.$http.post(url, req);
			return res.data.data.length;
		},
		async getBindDoctor() {
			// 查找医生信息
			let url = this.getServiceUrl('health', 'srvhealth_person_relation_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_relation_select',
				colNames: ['*'],
				condition: [{ colName: 'userb_person_no', ruleType: 'like', value: this.userInfo.no }],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
				let noList = res.data.data.map(item => item.usera_no);
				let noStr = noList.toString();
				let count_num = 0;
				this.getDoctorRecod(noStr, '医生').then(length => {
					count_num += length;
					this.doctor_message = count_num;
				});
			}
		},
		async getUserDoctorInfo(customer_no) {
			let url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'no', ruleType: 'eq', value: customer_no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			console.log('iserInfo-----', res);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				return res.data.data[0];
			}
		},
		async getBindhzDoctor(no) {
			// 查询患者信息
			let url = this.getServiceUrl('health', 'srvhealth_person_relation_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_relation_select',
				colNames: ['*'],
				condition: [{ colName: 'usera_person_no', ruleType: 'like', value: this.userInfo.no }],
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
				let arr = res.data.data.map(items => items.userb_no).toString();
				this.getDoctorRecod(arr, '患者').then(l => {
					this.hzMessage = l;
				});
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
				case 'about':
					uni.navigateTo({
						url: '/pediaPages/AboutMiniProgram/AboutMiniProgram'
					});
					break;
				case 'group':
					uni.navigateTo({
						url: '/personalPages/chatGroup/chatGroup'
					});
					break;
				case 'doctor':
					uni.navigateTo({
						url: '/personalPages/myDoctor/myDoctor'
					});
					break;
				case 'font':
					uni.navigateTo({
						url: '/personalPages/FontSizeSetting/FontSizeSetting'
					});
					break;
				case 'card':
					uni.navigateTo({
						url: '/personalPages/nameCard/nameCard'
					});
					break;
				case 'beDoctor':
					this.showModal = true;
					break;
				case 'mineStore':
					uni.navigateTo({
						url: '/personalPages/StoreList/StoreList'
					});
					break;
				case 'userList':
					if (this.manager_type) {
						// this.getDoctorInfo().then(res => {
						this.$store.commit('SET_DOCTOR_INFO', this.userInfo);
						uni.navigateTo({
							url: '/personalPages/userList/userList'
						});
						// });
					} else {
						uni.showModal({
							title: '提示',
							content: '当前用户不是管理人员,是否申请成为管理人员',
							success(res) {
								if (res.confirm) {
									self.toPages('beDoctor');
								}
							}
						});
					}
					break;
				case 'updateInfo':
					if (this.vuex_userInfo.no) {
						let fieldsCond = [
							{
								column: 'invite_user_no',
								display: false
							},
							{
								column: 'add_url',
								display: false
							},
							{
								column: 'manager_type',
								display: false
							},
							{
								column: 'no',
								value: this.vuex_userInfo.no,
								display: false
							},
							{
								column: '_userno_disp',
								display: false
							},
							{
								column: 'font_size',
								display: false
							},
							{
								column: 'userno',
								display: false
							},
							{
								column: 'create_time',
								display: false
							},
							{
								column: 'create_user',
								display: false
							},
							{
								column: 'create_user_disp',
								display: false
							}
						];
						uni.navigateTo({
							url: '/publicPages/newForm/newForm?showChildService=false&serviceName=srvhealth_person_info_select&type=detail&fieldsCond=' + encodeURIComponent(JSON.stringify(fieldsCond))
						});
					}
					break;
			}
		},
		async getDoctorRecod(userNo, type) {
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
		async getDoctorInfo() {
			// 查找医生信息
			let url = this.getServiceUrl('health', 'srvhealth_person_relation_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_relation_select',
				colNames: ['*'],
				condition: [{ colName: 'usera_person_no', ruleType: 'like', value: this.userInfo.no }]
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
		async updateManagerType() {
			this.manager_type = this.checkedManagerType;
			let url = this.getServiceUrl('health', 'srvhealth_person_info_update', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_person_info_update',
					condition: [{ colName: 'no', ruleType: 'eq', value: this.vuex_userInfo.no }],
					data: [{ manager_type: this.checkedManagerType.toString() }]
				}
			];
			let res = await this.$http.post(url, req);
			// .then(res => {
			if (res.data.state === 'SUCCESS') {
				uni.showToast({
					title: '申请成功'
				});
			} else {
				uni.showModal({
					title: '提示',
					content: JSON.stringify(res.data) + JSON.stringify(req)
				});
			}
			this.hideModal();
			this.initPage();
			// });
		},
		async initPage() {
			let self = this;
			// #ifdef MP-WEIXIN
			let res = await wx.getSetting();
			if (!res.authSetting['scope.userInfo']) {
				this.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: false });
				this.$store.commit('SET_AUTH_USERINFO', false);
				// 没有获取用户信息授权
			} else {
				this.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: true });
				this.$store.commit('SET_AUTH_USERINFO', true);
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
					if (!this.$store.state.app.subscsribeStatus) {
						this.checkSubscribeStatus();
					}
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
				this.$store.commit('SET_AUTH_USERINFO', true);
				const result = await wx.login();
				if (result.code) {
					this.wxLogin({
						code: result.code
					});
					this.initPage();
				}
			}
			// #endif
		},
		async selectMyGroup() {
			// 查找当前登录用户已加入的圈子
			if (this.vuex_userInfo && this.vuex_userInfo.no) {
				let res = await this.selectGroup([{ colName: 'person_no', ruleType: 'eq', value: this.vuex_userInfo.no }]);
				if (Array.isArray(res) && res.length > 0) {
					let no = res.map(item => item.gc_no);
					let list = await this.selectGroupInfo(no.toString(), res);
					let lastTimeArr = res.map(item => {
						return {
							gc_no: item.gc_no,
							latest_sign_in_time: item.latest_sign_in_time
						};
					});
					return await this.selectUnreadAmount(list);
				}
			}
		},
		async selectGroupInfo(no, data, cond) {
			if (no || cond) {
				let url = this.getServiceUrl('health', 'srvhealth_group_circle_select', 'select');
				let req = {
					serviceName: 'srvhealth_group_circle_select',
					colNames: ['*'],
					condition: [{ colName: 'gc_no', ruleType: 'in', value: no }]
				};
				if (cond) {
					req.condition = cond;
				}
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data) && Array.isArray(data)) {
					res.data.data = res.data.data.map(item => {
						data.map(info => {
							if (info.gc_no === item.gc_no) {
								item.group_role = info.group_role;
								item.latest_sign_in_time = info.latest_sign_in_time;
								item.pg_no = info.pg_no;
							}
						});
						return item;
					});
					return res.data.data;
				} else if (Array.isArray(res.data.data)) {
					return res.data.data;
				}
			}
		},
		async selectGroup(cond, page) {
			// 查找圈子
			let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_group_circle_select',
				colNames: ['*'],
				page: { pageNo: 1, rownumber: 10 }
			};
			if (Array.isArray(cond)) {
				req.condition = cond;
			}
			if (page) {
				req.page = page;
			}
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				return res.data.data;
			}
		},
		async selectUnreadAmount(list) {
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_consultation_chat_record_select',
				colNames: ['*'],
				group: [
					{
						colName: 'rcv_group_no',
						type: 'by'
					},
					{
						colName: 'create_time',
						type: 'count'
					}
				]
			};
			if (Array.isArray(list)) {
				let relationCondition = {
					relation: 'OR',
					data: [
						{
							relation: 'AND',
							data: []
						}
					]
				};
				relationCondition.data = list.map(item => {
					let obj = {
						relation: 'AND',
						data: [{ colName: 'rcv_group_no', ruleType: 'eq', value: item.gc_no }, { colName: 'create_time', ruleType: 'gt', value: item.latest_sign_in_time }]
					};
					return obj;
				});
				req.relation_condition = relationCondition;
			}
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
				let amount = res.data.data.reduce((pre, cur) => {
					pre += cur.create_time;
					return pre;
				}, 0);
				this.groupMsgUnreadAmount = amount;
				return amount;
			}
		}
	},
	onLoad(option) {
		this.checkOptionParams(option);
		this.toAddPage();
	},
	async onShow() {
		if (this.vuex_userInfo && this.vuex_userInfo.hasOwnProperty('manager_type')) {
			this.manager_type = this.vuex_userInfo.manager_type;
		}
		this.userInfo = uni.getStorageSync('current_user_info');
		let amount = await this.selectMyGroup();
		this.getDoctorAllRecod(this.userInfo.userno).then(r => {
			if (amount) {
				r += amount;
			}
			if (r > 99) {
				r = '99+';
			} else {
				r = r.toString();
			}
			if (r != 0) {
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
			} else {
				uni.removeTabBarBadge({
					index: 3
				});
			}
		});
		this.getBindDoctor();
		this.getDoctorInfo().then(res => {
			if (res) {
				this.getBindhzDoctor(res.dt_no);
			}
		});
	},
	onPullDownRefresh() {
		this.selectMyGroup();
		this.initPage().then(_ => {
			uni.stopPullDownRefresh();
		});
	},
	onTabItemTap() {
		// this.initPage();
	},
	onShareAppMessage() {
		let path = `/pages/personal/personal?from=share&invite_user_no=${this.vuex_userInfo.userno}`;
		this.saveSharerInfo(this.vuex_userInfo, path);
		return {
			title: `${this.vuex_userInfo.name}邀请您体验小程序`,
			path: path
		};
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
	width: 150%;
	left: -25%;
	height: 400rpx;
	padding: 0 25%;
	padding-top: 35px;
	background-color: #0bc99d;
	display: flex;
	position: relative;
	border-radius: 0 0 50% 50%;
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
			font-size: 50rpx;
			font-weight: bold;
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
	background-color: white;
	position: relative;
	padding-top: 95px;
	.container-cen-top {
		width: calc(100% - 40rpx);
		display: flex;
		margin: 0 10px;
		flex-wrap: wrap;
		position: absolute;
		top: -80px;
		background-color: #fff;
		border-radius: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		.container-cen-top-list {
			display: flex;
			flex-direction: column;
			align-items: center;
			position: relative;
			border-radius: 50rpx;
			padding: 10px;
			width: calc(33% - 40rpx / 3);
			& + .container-cen-top-list {
				margin-left: 10px;
			}
			& + .container-cen-top-list:nth-child(3n + 1) {
				margin-left: 0;
			}
			.label {
				padding: 2px 0;
			}
			image {
				width: 80upx;
				height: 80upx;
			}
			.message-tag {
				position: absolute;
				right: 50rpx;
				top: 10rpx;
				background: red;
				color: white;
				border-radius: 50rpx;
				padding: 1px 2px;
				min-width: 45rpx;
				height: 45rpx;
				line-height: 45rpx;
				text-align: center;
				font-size: 24rpx;
			}
		}
	}
	.container-bot {
		margin: 0px 10px 0;
		overflow: hidden;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		border-radius: 10px;
		.content {
			font-size: var(--global-text-font-size);
		}
	}
}
</style>
