<script>
	import Vue from 'vue';
	import store from '@/store/index.js'
	import {
		mapState
	} from 'vuex'
	export default {
		globalData: {
			globalTextFontSize: 18,
			globalLabelFontSize: 16
		},
		computed: {
			...mapState({
				authUserInfo: state => state.app.authUserInfo
			})
		},
		onLaunch(options) {
			this.checkUpdate()
			console.log("launch", options)
			// #ifdef MP-WEIXIN
			uni.onMemoryWarning(function() {
				uni.showModal({
					title: '警告',
					content: 'onMemoryWarningReceive,内存不足'
				});
			});
			// #endif
			this.judgeClientEnviroment();
			uni.setStorageSync('isThirdParty', this.$api.isThirdParty);
			uni.getSystemInfo({
				success: function(e) {
					// #ifndef MP
					Vue.prototype.StatusBar = e.statusBarHeight;
					if (e.platform == 'android') {
						Vue.prototype.CustomBar = e.statusBarHeight + 50;
					} else {
						Vue.prototype.CustomBar = e.statusBarHeight + 45;
					}
					// #endif

					// #ifdef MP-WEIXIN
					Vue.prototype.StatusBar = e.statusBarHeight;
					let custom = wx.getMenuButtonBoundingClientRect();
					Vue.prototype.Custom = custom;
					Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
					// #endif

					// #ifdef MP-ALIPAY
					Vue.prototype.StatusBar = e.statusBarHeight;
					Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
					// #endif
				}
			});
		},
		methods: {
			checkUpdate() {
				const updateManager = uni.getUpdateManager();

				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					console.log(res.hasUpdate);
				});

				updateManager.onUpdateReady(function(res) {
					uni.showModal({
						title: '更新提示',
						content: '新版本已经准备好，是否重启应用？',
						success(res) {
							if (res.confirm) {
								// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
								updateManager.applyUpdate();
							}
						}
					});

				});

				updateManager.onUpdateFailed(function(res) {
					// 新的版本下载失败
				});
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
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
					let amount = res.data.data.reduce((pre, cur) => {
						pre += cur.create_time;
						return pre;
					}, 0);
					return amount;
				}
			},
			async getDoctorRecod(userNo) {
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
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data)) {
					return res.data.data.length;
				}
			}
		},
		onShow: async function(options) {
			console.log("onShow", options)
			let userNo = uni.getStorageSync('current_user_info');
			if (userNo.userno) {
				let groupUnread = await this.selectMyGroup();
				this.getDoctorRecod(userNo.userno).then(length => {
					if (groupUnread) {
						length += groupUnread;
					}
					if (!length && length !== 0) {
						length = 0;
					}
					if (length > 99) {
						length = '99+';
					} else {
						length = `${length}`;
					}
					if (length != 0) {
						uni.setTabBarBadge({
							index: 3,
							text: length,
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
			}
			if (this.$api.singleApp) {
				uni.setStorageSync('activeApp', this.$api.appName);
			}
			console.log('App Show');
		},
		onHide: function() {
			console.log('App Hide');
		}
	};
</script>

<style lang="scss">
	@import "./static/iconfont.css"; //引入字体文件
	@import 'colorui/main.css';
	@import 'colorui/icon.css';
	@import '@/common/uni.css';

	/*每个页面公共css */
	// --page-height:calc(100vh - var(--window-top) - var(--window-bottom))
	#app,
	uni-page-body,
	uni-page-wrapper {
		background: #f1f1f1 !important;
	}

	html,
	body {
		height: auto;
		background: #f1f1f1 !important;
	}

	uni-page-body>uni-view {
		height: 100%;
	}

	.button-box {
		display: flex;
		justify-content: space-around;
		flex-wrap: wrap;
		align-items: center;
		margin-bottom: 20rpx;

		.button {
			min-width: 45%;
			position: relative;
			border: 0px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			padding: 0 15px;
			font-size: 14px;
			height: 32px;
			line-height: 1;
			text-align: center;
			text-decoration: none;
			overflow: visible;
			margin-left: initial;
			margin-right: initial;
		}
	}
</style>
