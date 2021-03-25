<template>
	<view class="container" :style="{
			'--global-text-font-size': globalTextFontSize + 'px'
		}">
		<view class="container-top">
			<view class="top-left">
				<image @click="toPages('updateInfo')" v-if="(authUserInfo || client_env === 'h5') && (vuex_userInfo.user_image || vuex_userInfo.profile_url)"
				 class="image" :src="getImagePath(vuex_userInfo.user_image) ? getImagePath(vuex_userInfo.user_image) : getImagePath(vuex_userInfo.profile_url)"></image>
				<image @click="toPages('updateInfo')" class="image" src="../../static/man-profile.png" v-else></image>
			</view>
			<view class="top-right" v-if="vuex_userInfo && vuex_userInfo.name && (authUserInfo || client_env === 'h5')">
				<view class="top-right-name" @click="toPages('updateInfo')">{{ vuex_userInfo.name }}</view>
			</view>
			<view class="top-right" v-if="!authUserInfo && client_env === 'wxmp'">
				<view class="top-right-name">游客</view>
				<view class="top-right-name">
					<button class="cu-btn bg-green margin-top-xs auth-button" type="primary" open-type="getUserInfo" @getuserinfo="getuserinfo">授权微信登录</button>
				</view>
			</view>
		</view>
		<view class="container-cen" :class="{ top90: type == 'shop' }">
			<manage-bar :topGridList="topGridList" @toPages="toPages" v-if="type!=='shop'"></manage-bar>
			<order-bar @toPages="toPages" @change="orderAmountChange"></order-bar>
			<view class="container-bot">
				<view class="cu-list menu sm-border">
					<view @click="toPages('updateInfo')" class="cu-item arrow">
						<view class="content">
							<text class="cuIcon-news"></text>
							<text class="text-grey">基本信息</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="toPages('beDoctor')" v-if="!manager_type && type !== 'shop'">
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
					<view class="cu-item arrow" @click="openOfficialImage">
						<view class="content">
							<text class="cuIcon-attentionfavor"></text>
							<text class="text-grey">消息提醒设置</text>
						</view>
						<view class="text-green" v-if="subscsribeStatus">已设置</view>
						<view class="text-orange" v-else>待设置</view>
					</view>
					<view class="cu-item arrow" @click="toPages('about')">
						<view class="content">
							<text class="cuIcon-global"></text>
							<text class="text-grey">关于小程序</text>
						</view>
					</view>
					<view class="cu-item arrow" @click="toPages('bxoa')" v-if="isAdminUser">
						<view class="content">
							<text class="cuIcon-forward"></text>
							<text class="text-grey">西安市民一码通</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<applyManagerModal :show="showModal" v-if="!manager_type" @hideModal="hideModal" @updateManagerType="updateManagerType"></applyManagerModal>
	</view>
</template>

<script>
	import {
		mapGetters,
		mapState
	} from 'vuex';
	import orderBar from './order-bar.vue'
	import manageBar from './manage-bar.vue'
	import applyManagerModal from './apply-manage-modal.vue'
	export default {
		components: {
			orderBar,
			manageBar,
			applyManagerModal
		},
		name: 'mine-info',
		props: {
			type: {
				type: String
			}
		},
		data() {
			return {
				wxUserInfo: '',
				userInfo: '',
				manager_type: '',
				showModal: false,
				orderMsgNum: 0,
				topGridList: [{
						label: '医生',
						type: "doctor",
						icon: 'friendfavor',
						tag: 'doctor_message',
						messageAmount: 0
					},
					{
						label: '用户',
						type: "userList",
						icon: 'peoplelist',
						tag: 'hzMessage',
						messageAmount: 0
					},
					// {
					// 	label: '圈子',
					// 	type: "group",
					// 	icon: 'link',
					// 	tag: 'groupMsgUnreadAmount',
					// 	messageAmount: 0
					// },
					{
						label: '单位',
						type: "mineStore",
						icon: 'home',
					}
				],
				checkedManagerType: ['医师']
			};
		},
		computed: {
			isAdminUser() {
				if (this.loginUserInfo && this.loginUserInfo.user_type === '内部用户') {
					return true;
				}
			},
			...mapState({
				loginUserInfo: state => state.user.loginUserInfo,
				subscsribeStatus: state => state.app.subscsribeStatus,
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
			orderAmountChange(e) {
				if (Array.isArray(e) && e.length > 0) {
					this.orderMsgNum = e.reduce((pre, cur) => {
						if (cur.amount) {
							pre += cur.amount
						}
						return pre
					}, 0)
				}
			},
			openOfficialImage() {
				uni.navigateTo({
					url: '/publicPages/webviewPage/webviewPage?webUrl=' + encodeURIComponent(
						'https://mp.weixin.qq.com/s/Z9o7ZJOtrAsR2Sj7PIIgRQ')
				});
			},
			hideModal() {
				this.showModal = false;
			},
			async getDoctorAllRecod(userNo, docNO) {
				let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
				let req = {
					serviceName: 'srvhealth_consultation_chat_record_select',
					colNames: ['*'],
					condition: [{
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
					order: [{
						colName: 'create_time',
						orderType: 'asc'
					}]
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
					condition: [{
						colName: 'userb_person_no',
						ruleType: 'like',
						value: this.userInfo.no
					}],
					page: {
						pageNo: 1,
						rownumber: 10
					},
					order: []
				};
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
					let noList = res.data.data.map(item => item.usera_no);
					let noStr = noList.toString();
					let count_num = 0;
					this.getDoctorRecod(noStr, '医生').then(length => {
						count_num += length;
						this.topGridList[0].messageAmount = count_num
						this.doctor_message = count_num;
					});
				}
			},
			async getUserDoctorInfo(customer_no) {
				let url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
				let req = {
					serviceName: 'srvhealth_person_info_select',
					colNames: ['*'],
					condition: [{
						colName: 'no',
						ruleType: 'eq',
						value: customer_no
					}],
					page: {
						pageNo: 1,
						rownumber: 10
					}
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
					condition: [{
						colName: 'usera_person_no',
						ruleType: 'like',
						value: this.userInfo.no
					}],
					order: []
				};
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
					let arr = res.data.data.map(items => items.userb_no).toString();
					this.getDoctorRecod(arr, '患者').then(l => {
						this.topGridList[1].messageAmount = l
					});
				}
			},
			toPages(e) {
				// #ifdef MP-WEIXIN
				if (!this.authUserInfo) {
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
							url: '/publicPages/article/article?serviceName=srvdaq_cms_content_select&content_no=CT2021012719370101'
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
						if (this.vuex_userInfo.manager_type) {
							this.$store.commit('SET_DOCTOR_INFO', this.userInfo);
							uni.navigateTo({
								url: '/personalPages/userList/userList'
							});
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
							let fieldsCond = [{
									column: 'invite_user_no',
									display: false
								},
								{
									column: 'add_url',
									display: false
								},
								{
									column: 'manager_type'
									// display: false
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
									column: 'add_store_no',
									display: false
								},
								{
									column: 'home_store_no',
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
								url: '/publicPages/newForm/newForm?showChildService=false&serviceName=srvhealth_person_info_select&type=detail&fieldsCond=' +
									encodeURIComponent(JSON.stringify(fieldsCond))
							});
						}
						break;
					case 'bxoa':
						// #ifdef MP-WEIXIN
						uni.navigateToMiniProgram({
							appId: 'wxec4343871c957260',
							// envVersion: 'trial', //体验版
							extraData: {
								from: 'bx-health'
							}
						});
						// #endif
						break;
					case 'order-list': //全部
					case 'order-finish': //已完成
					case 'order-receiving': //待收货
					case 'order-deliver': // 待发货
					case 'order-unpaid': //待支付
						uni.navigateTo({
							url: '/personalPages/OrderList/OrderList?type=' + e
						});
						break;
				}
			},
			async getDoctorRecod(userNo, type) {
				let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
				let req = {
					serviceName: 'srvhealth_consultation_chat_record_select',
					colNames: ['*'],
					condition: [{
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
					order: [{
						colName: 'create_time',
						orderType: 'asc'
					}]
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
					condition: [{
						colName: 'usera_person_no',
						ruleType: 'like',
						value: this.userInfo.no
					}]
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
				if (!this.authUserInfo) {
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
			async updateManagerType(e) {
				this.manager_type = this.checkedManagerType;
				if (!Array.isArray(e)) {
					return
				}
				let url = this.getServiceUrl('health', 'srvhealth_person_info_update', 'operate');
				let req = [{
					serviceName: 'srvhealth_person_info_update',
					condition: [{
						colName: 'no',
						ruleType: 'eq',
						value: this.vuex_userInfo.no
					}],
					data: [{
						manager_type: e.toString()
					}]
				}];
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					uni.showToast({
						title: '申请成功'
					});
					if (
						Array.isArray(res.data.response) &&
						res.data.response.length > 0 &&
						res.data.response[0].response &&
						Array.isArray(res.data.response[0].response.effect_data) &&
						res.data.response[0].response.effect_data.length > 0
					) {
						let data = res.data.response[0].response.effect_data[0];
						this.$store.commit('SET_USERINFO', data);
					}
					this.toAddPage();
				} else {
					uni.showModal({
						title: '提示',
						content: JSON.stringify(res.data) + JSON.stringify(req)
					});
				}
				this.hideModal();
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
					this.toAddPage();
					this.$store.commit('SET_AUTH_SETTING', {
						type: 'userInfo',
						value: true
					});
					this.$store.commit('SET_AUTH_USERINFO', true);
				}
				// #endif
			},
			async selectMyGroup() {
				// 查找当前登录用户已加入的圈子
				if (this.vuex_userInfo && this.vuex_userInfo.no) {
					let res = await this.selectGroup([{
						colName: 'person_no',
						ruleType: 'eq',
						value: this.vuex_userInfo.no
					}]);
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
						condition: [{
							colName: 'gc_no',
							ruleType: 'in',
							value: no
						}]
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
					page: {
						pageNo: 1,
						rownumber: 10
					}
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
					group: [{
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
						data: [{
							relation: 'AND',
							data: []
						}]
					};
					relationCondition.data = list.map(item => {
						let obj = {
							relation: 'AND',
							data: [{
								colName: 'rcv_group_no',
								ruleType: 'eq',
								value: item.gc_no
							}, {
								colName: 'create_time',
								ruleType: 'gt',
								value: item.latest_sign_in_time
							}]
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
					this.topGridList[2].messageAmount = amount
					// this.groupMsgUnreadAmount = amount;
					return amount;
				}
			},
			async updateUnreadAmount(){
				let amount = 0;
				// let amount = await this.selectMyGroup();
				this.getDoctorAllRecod(this.userInfo.userno).then(r => {
					if (amount) {
						r += amount;
					}
					if (this.orderMsgNum) {
						r += this.orderMsgNum
					}
					if (r > 99) {
						r = '99+';
					} else {
						r = r.toString();
					}
					if (r != 0) {
						uni.setTabBarBadge({
							index: 3,
							text: r
						});
					} else {
						uni.removeTabBarBadge({
							index: 3
						});
					}
				});
			},
		},
		
		async mounted() {
			uni.$on('updateUnread',_=>{
				this.updateUnreadAmount();
			})
			if (this.vuex_userInfo && this.vuex_userInfo.hasOwnProperty('manager_type')) {
				this.manager_type = this.vuex_userInfo.manager_type;
			}
			this.userInfo = this.vuex_userInfo
			
			this.getBindDoctor();
			this.getDoctorInfo().then(res => {
				if (res) {
					this.getBindhzDoctor(res.dt_no);
				}
			});
			this.updateUnreadAmount()
		},
		onShareAppMessage() {
			let path = `/pages/personal/personal?from=share&invite_user_no=${this.vuex_userInfo.userno}`;
			this.saveSharerInfo(this.vuex_userInfo, path);
			return {
				title: `${this.vuex_userInfo.name}邀请您体验小程序`,
				path: path
			};
		},
		onShow() {
			 // 检测是否已关注公众号
			this.checkSubscribeStatus()
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
		min-height: calc(100vh - var(--window-top) - var(--window-bottom));
		font-size: var(--global-text-font-size);
		overflow: hidden;
		background-color: #fff;
	}

	.container-top {
		width: 150%;
		left: -25%;
		height: 150px;
		padding: 0 25%;
		padding-top: 20px;
		background-color: #0bc99d;
		display: flex;
		position: relative;
		border-radius: 0 0 50% 50%;
		margin-bottom: 10px;

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
		position: relative;
		padding-top: 30px;
		margin-bottom: 50px;

		&.top90 {
			top: -90px;
		}


		.container-center {
			display: flex;
			flex-wrap: wrap;
			margin: 20rpx;
			margin-top: 0;
			border-radius: 10px;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
			background-color: #fff;

			.container-title {
				width: 100%;
				display: flex;
				justify-content: space-between;
				border-bottom: 1px solid #f1f1f1;
				padding: 10rpx 20rpx;

				.arrow {
					font-size: 12px;
					color: #777;
				}
			}

			.container-cen-top-list {
				padding: 20rpx;
				display: flex;
				flex-direction: column;
				flex: 1;
				justify-content: center;
				align-items: center;
				transition: all 0.2s ease;

				&:active {
					background-color: #f1f1f1;
				}

				.icon {
					font-size: 30px;
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

	.official-account {
		margin: 20rpx;
		border-radius: 10rpx;
		overflow: hidden;
		background-color: #fff;
		padding: 10rpx 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

		.text {
			display: flex;
			width: 100%;
			justify-content: center;
			align-items: center;
			padding: 10rpx 40rpx;
			color: #0bc99d;
			font-weight: bold;
			font-size: 24rpx;
		}
	}
</style>
