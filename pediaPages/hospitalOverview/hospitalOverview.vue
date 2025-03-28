<template>
	<!-- 简介、导航、科室列表、名医介绍、就诊通知、在线预约挂号链接 -->
	<view class="page-wrap" v-if="!authBoxDisplay||client_env==='web'">
		<!-- {{storeInfo.name||'首页'}} -->
		<u-navbar :is-back="false">
			<view class="nav-bar" @click="openSwitchHomePage">
				<view class="home-btn" v-if="showHomeBtn" @click.stop="goHome">
					<text class="cuIcon-home"></text>
				</view>
				{{storeInfo.name||'首页'}}
				<text class="cuIcon-unfold margin-left-xs" :class="{'show-home':showHomePageSelector}"></text>
			</view>
		</u-navbar>
		<store-item v-for="pageItem in pageItemList" :goodsListData="goodsListData" :key="pageItem.component_no"
			:pageItem="getConfig(pageItem)" :storeInfo="storeInfo" :userInfo="userInfo" :bindUserInfo="bindUserInfo"
			ref="storeItem" @toDoctorDetail="toDoctorDetail" @toConsult="toConsult" @bindStore="bindStore">
		</store-item>
		<u-popup v-model="showHomePageSelector" mode="bottom">
			<view class="store-list" v-if="storeList.length>0">
				<view class="store-item" v-for="item in storeList" :key="item.id" @click="switchStore(item)">
					{{item.name||''}}
				</view>
			</view>
		</u-popup>
	</view>
	<bx-auth v-else></bx-auth>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	// import mixin from './mixin.js'
	import {
		getUserList
	} from './getData.js'
	import StoreItem from './store-item/store-item.vue'
	let menuButtonInfo = {
		width: 0,
		height: 0
	}
	// #ifdef MP-WEIXIN
	menuButtonInfo = uni.getMenuButtonBoundingClientRect()
	// #endif
	export default {
		components: {
			StoreItem
		},
		// mixins: [mixin],
		data() {
			return {
				showHomeBtn: false,
				menuButtonInfo: menuButtonInfo,
				showHomePageSelector: false,
				selectVal: '',
				client_env: uni.getStorageSync('client_env'),
				isBind: false, //当前用户是否绑定此诊所
				bindUserInfo: {},
				swiperList: [],
				goodsListData: [],
				storeNo: '',
				fullIntro: false,
				storeInfo: {},
				deptList: [], //科室
				noticeList: [], // 通知公告
				newsList: [], // 新闻
				menuList: [],
				// msgNum: 0,
				kefuSessionInfo: {},
				vaccineList: [], // 可预约疫苗列表
				pageItemList: [],
				storeList: [],
			};
		},
		computed: {
			...mapState({
				wxUserInfo: state => state.user.wxUserInfo,
				userInfo: state => state.user.userInfo,
				inviterInfo: state => state.app.inviterInfo,
				subscsribeStatus: state => state.app.subscsribeStatus, //是否关注公众号
				authBoxDisplay: state => state.app.authBoxDisplay //授权访问用户信息
			}),
		},
		methods: {
			switchStore(e) {
				if (e.store_no) {
					this.storeNo = e.store_no
					this.initPage()
					setTimeout(_ => {
						this.showHomePageSelector = false
					}, 100)
				}
			},
			goHome() {
				uni.switchTab({
					url: '/pages/pedia/pedia'
				})
			},
			async selectInStore() {
				// 查找当前账号所在的所有店铺
				let req = {
					"condition": [{
						"colName": "person_no",
						"ruleType": "eq",
						"value": this.userInfo.no
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 10
					},
				}
				let res = await this.$fetch('select', 'srvhealth_store_user_select', req, 'health')
				if (res.success) {
					this.storeList = res.data
				}
				return res
			},
			openSwitchHomePage() {
				this.selectInStore().then(_ => {
					if (Array.isArray(this.storeList) && this.storeList.length > 1) {
						this.showHomePageSelector = !this.showHomePageSelector
					}
				})
			},
			getConfig(pageItem) {
				if (pageItem && pageItem.type) {
					let type = pageItem.type
					let keys = []
					let config = {}
					switch (type) {
						case '轮播图':
							keys = ['swiper_image', 'image_origin']
							break;
						case '店铺信息':
							keys = ['show_consult', 'show_set_home']
							break;
						case '按钮组':
							keys = ['show_subscribe', 'show_related_group', 'navigate_type', 'button_style',
								'component_no','show_public_button','row_number'
							]
							break;
						case '商品列表':
							keys = ['row_number']
							break;
						case '疫苗列表':
							keys = ['row_number']
							break;
						case '人员列表':
							keys = ['user_role', 'row_number', 'component_label']
							break;
						case '文章列表':
							keys = ['category_no', 'row_number', 'article_style']
							break;
					}
					if (Array.isArray(keys) && keys.length > 0) {
						keys.forEach(key => {
							config[key] = pageItem[key]
						})
						config.type = pageItem['type']
						return config
					}
				}
			},
			async getPageItem() {
				let req = {
					"condition": [{
						"colName": "store_no",
						"ruleType": "eq",
						"value": this.storeNo
					}],
					"order": [{
						colName: "order_no",
						orderType: "asc"
					}],
				}
				let res = await this.$fetch('select', 'srvhealth_store_home_component_select', req, 'health')
				if (res.success) {
					this.pageItemList = res.data
				}
			},
			toDeptDetail(e) {
				// 跳转到科室详情
				uni.navigateTo({
					url: '/pediaPages/department/department?dept_no=' + e.no
				});
			},
			toDocotrDetail(e) {
				// 跳转到医生主页
				uni.navigateTo({
					url: `/storePages/Registration/RegistrationDetail?storeNo=${e.store_no}&doctorNo=${e.person_no}`
					// url: '/personalPages/DoctorDetail/DoctorDetail?doctor_no=' + e.person_no + '&store_no=' + e.store_no
				});
			},
			async selectBindUser() {
				let condition = [{
					colName: 'person_no',
					ruleType: 'eq',
					value: this.userInfo.no
				}]
				let userList = await getUserList(this.storeNo, condition)
				if (Array.isArray(userList)) {
					let isBind = userList.find(item => item.person_no === this.userInfo.no)
					if (isBind && isBind.person_no) {
						this.isBind = true
						this.bindUserInfo = isBind
						this.$store.commit('SET_STORE_USER', this.bindUserInfo)
					}
				}
			},
			selectDepartList() {
				let req = {
					condition: [{
						colName: 'store_no',
						ruleType: 'eq',
						value: this.storeNo
					}]
				};
				this.$fetch('select', 'srvhealth_store_dept_select', req, 'health').then(res => {
					if (Array.isArray(res.data)) {
						this.deptList = res.data;
					}
				});
			},
			getGoodsListData() {
				let req = {
					condition: [{
						colName: 'store_no',
						ruleType: 'eq',
						value: this.storeNo
					}]
				};
				this.$fetch('select', 'srvhealth_store_goods_select', req, 'health').then(res => {
					if (Array.isArray(res.data)) {
						this.goodsListData = res.data;
					}
				});
			},
			// async getSwiperList(e) {
			// 	if (e.image) {
			// 		let res = await this.getFilePath(e.image);
			// 		if (Array.isArray(res)) {
			// 			this.swiperList = res.reduce((pre, cur) => {
			// 				if (cur.fileurl) {
			// 					cur.url = this.$api.getFilePath + cur.fileurl + '&bx_auth_ticket=' + uni
			// 						.getStorageSync('bx_auth_ticket');
			// 				}
			// 				pre.push(cur);
			// 				return pre;
			// 			}, []);
			// 		}
			// 	}
			// },
			async selectStoreInfo(times = 0) {
				let url = this.getServiceUrl('health', 'srvhealth_store_mgmt_select', 'select');
				let req = {
					condition: [{
						colName: 'store_no',
						ruleType: 'eq',
						value: this.storeNo
					}],
					page: {
						pageNo: 1,
						rownumber: 1
					},
				};
				let res = await this.$fetch('select', 'srvhealth_store_mgmt_select', req, 'health')
				if (Array.isArray(res.data) && res.data.length > 0) {
					this.storeInfo = res.data[0];
					if (this.storeInfo.type === '健康服务') {
						this.getGoodsListData();
					}
					// this.getSwiperList(this.storeInfo);
					uni.setNavigationBarTitle({
						title: this.storeInfo.name
					});
					// this.getNotice();
				} else {
					if (res && res.code === '0011') {
						await this.toAddPage()
						times++
						if (times < 3) {
							this.selectStoreInfo(times)
						}
					} else {
						uni.showModal({
							title: '未查找到机构信息',
							content: `${res?JSON.stringify(res):''}  storeNo为${this.storeNo}`,
							showCancel: false
						})
					}
				}
				// this.selectDepartList();
			},

			async bindStore() {
				// 将当前登录用户添加到店铺用户列表，角色为用户
				if (!this.storeInfo || !this.storeInfo.no) {
					let userInfo = await this.toAddPage()
				}
				let req = [{
					"serviceName": "srvhealth_store_user_add",
					"condition": [],
					"data": [{
						"store_no": this.storeNo,
						"name": this.storeInfo.name,
						"image": this.storeInfo.image,
						"type": this.storeInfo.type,
						"person_no": this.userInfo.no,
						"person_name": this.userInfo && this.userInfo.name ? this.userInfo.name
							.replace(
								/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "") : '',
						"user_account": this.userInfo.userno,
						"nick_name": this.userInfo && this.userInfo.nick_name ? this.userInfo.nick_name
							.replace(
								/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "") : '',
						"profile_url": this.userInfo.profile_url,
						user_image: this.userInfo.user_image,
						"sex": this.userInfo.sex,
						"user_role": "用户",
						add_url: this.inviterInfo.add_url,
						invite_user_no: this.inviterInfo.invite_user_no,
					}]
				}]
				let res = await this.$fetch('operate', 'srvhealth_store_user_add', req, 'health')
				if (res.success) {
					this.isBind = true
					if (res.data.length > 0) {
						this.bindUserInfo = res.data[0]
						this.$store.commit('SET_STORE_USER', this.bindUserInfo)
						return this.bindUserInfo
					}
				} else {
					return res
				}
			},
			async toDoctorDetail(e) {
				if (!this.bindUserInfo || !this.bindUserInfo.store_user_no) {
					this.bindUserInfo = await this.bindStore()
					this.$store.commit('SET_STORE_USER', this.bindUserInfo)
				}
				if (this.bindUserInfo && this.bindUserInfo.store_user_no && e.person_no && e.store_no) {
					let url = ''
					if (e && e.person_no && e.store_no && this.bindUserInfo.store_user_no) {
						url =
							`/personalPages/chat/chat?type=机构用户客服&receiver_person_no=${e.person_no}&identity=客户&storeNo=${e.store_no}&store_user_no=${this.bindUserInfo.store_user_no}`
					}
					// url = `/storePages/DoctorIntro/DoctorIntro?nouseRelation=true&person_no=${e.person_no}&store_no=${e.store_no}&store_user_no=${this.bindUserInfo.store_user_no}`
					uni.navigateTo({
						url: url
					});
				}
			},
			async toConsult() {
				// 在线咨询
				if (!this.bindUserInfo || !this.bindUserInfo.store_user_no) {
					this.bindUserInfo = await this.bindStore()
					this.$store.commit('SET_STORE_USER', this.bindUserInfo)
				}
				if (this.bindUserInfo && this.bindUserInfo.store_user_no) {
					uni.navigateTo({
						url: `/personalPages/chat/chat?type=机构用户客服&identity=客户&storeNo=${this.storeNo}&store_user_no=${this.bindUserInfo.store_user_no}`
					})
				}
			},
			async setHomePage() {
				let self = this
				let req = [{
					"serviceName": "srvhealth_person_info_update",
					"condition": [{
						"colName": "no",
						"ruleType": "eq",
						"value": this.userInfo.no
					}],
					"data": [{
						home_store_no: this.userInfo.home_store_no === this.storeNo ? '' : this.storeNo
					}]
				}]
				if (!this.userInfo || !this.userInfo.no) {
					await this.toAddPage()
				}
				if (!this.storeInfo || !this.storeInfo.store_no) {
					await this.selectStoreInfo()
				}
				uni.showModal({
					title: '提示',
					content: `请确认是否${this.userInfo.home_store_no === this.storeNo ?"取消":""}将此${this.storeInfo.type}设置为首页`,
					success(result) {
						if (result.confirm) {
							self.$fetch('operate', 'srvhealth_person_info_update', req, 'health').then(res => {
								if (res.success && res.data.length > 0 && res.data[0].no === self
									.userInfo.no) {
									uni.showToast({
										title: '设置成功'
									})
									self.$store.commit('SET_USERINFO', res.data[0])
								}
							})
						}
					}
				})
			},
			async getStoreUserInfo(no) {
				let url = this.getServiceUrl('health', 'srvhealth_store_user_select', 'select');
				let req = {
					serviceName: 'srvhealth_store_user_select',
					colNames: ['*'],
					condition: [{
						colName: 'person_no',
						ruleType: 'eq',
						value: this.userInfo.no
					}, {
						colName: 'store_no',
						ruleType: 'eq',
						value: no
					}]
				};
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data) && res.data.data.length > 0) {
					return res.data.data;
				}
			},
			async addToStore(store_no, invite_user_no) {
				// 添加用户到单位
				let self = this;
				if (!this.userInfo || !this.userInfo.no) {
					await this.toAddPage()
				}
				if (this.authBoxDisplay) {
					return
				}
				let url = this.getServiceUrl('health', 'srvhealth_store_user_add', 'operate');
				let req = [{
					serviceName: 'srvhealth_store_user_add',
					condition: [],
					data: [{
						nick_name: this.userInfo.nick_name ? this.userInfo.nick_name.replace(
							/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "") : '',
						profile_url: this.userInfo.profile_url,
						sex: this.userInfo.sex,
						user_account: this.userInfo.userno,
						user_image: this.userInfo.user_image,
						person_name: this.userInfo.name,
						add_url: this.inviterInfo.add_url,
						invite_user_no: invite_user_no,
						store_no: this.storeNo,
						person_no: this.userInfo.no,
						user_role: '用户',
						"image": this.storeInfo.image,
						"name": this.storeInfo.name,
						"type": this.storeInfo.type
					}]
				}];
				uni.showModal({
					title: '提示',
					content: `是否加入【${this.storeInfo.name}】`,
					success(res) {
						if (res.confirm) {
							self.$http.post(url, req).then(res => {
								if (res.data.state === 'SUCCESS') {
									uni.showModal({
										title: '提示',
										content: `您已成功加入【${self.storeInfo.name}】`
									});
									self.initPage()
								} else {
									uni.showModal({
										title: '提示',
										content: res.data.resultMessage,
										showCancel: false
									});
								}
							});
						}
					}
				});
			},
			async initPage() {
				await this.toAddPage()
				if (!this.subscsribeStatus) {
					// 检测是否已关注公众号
					this.checkSubscribeStatus()
				}
				if (this.storeNo) {
					// this.storeInfo.store_no = null
					this.getPageItem()
					await this.selectStoreInfo();
					await this.selectBindUser()
					uni.$emit('updateStoreItemData')
					// this.selectUnreadAmount()
				} else {
					// uni.showToast({
					// 	title: '未发现store_no',
					// 	icon: 'none'
					// })
				}
			}
		},
		onPullDownRefresh() {
			this.initPage()
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		},
		async onShow() {
			if (!this.subscsribeStatus) {
				// 检测是否已关注公众号
				this.checkSubscribeStatus()
			}
			if (this.storeNo) {
				if (this.userInfo && this.userInfo.no) {
					// uni.startPullDownRefresh()
					this.initPage()
				} else {
					this.toAddPage().then(_ => {
						uni.startPullDownRefresh()
					})
				}
			}
		},
		onShareAppMessage() {
			let path =
				`/pediaPages/hospitalOverview/hospitalOverview?from=share&store_no=${this.storeNo}&invite_user_no=${this.userInfo.userno}&share_type=bindOrganization&doctor_no=${
					this.userInfo.no
				}`;
			let title = `${this.userInfo.name}邀请您关注【${this.storeInfo.name}】`;
			let imageUrl = this.getImagePath(this.storeInfo.image);
			this.saveSharerInfo(this.userInfo, path);
			return {
				imageUrl: imageUrl,
				title: title,
				path: path
			};
		},
		beforeDestroy() {
			uni.$off('updateSessionLastLookTime')
			uni.$off('updateStoreInfo')
		},

		async onLoad(option) {
			// showHomeBtn
			let pageInfo = getCurrentPages()
			if (Array.isArray(pageInfo) && pageInfo.length === 1) {
				this.showHomeBtn = true
			}
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage']
			});
			// #endif
			uni.$on('updateStoreSessionLastLookTime', (e) => {
				this.selectBindUser()
				// this.selectUnreadAmount()
			})
			uni.$on('updateKefuSessionLastLookTime', e => {
				this.kefuSessionInfo = e
				// this.selectUnreadAmount()
			})
			uni.$on('updateUnread', e => {
				// this.initPage()
			})
			uni.$on('updateStoreInfo', (e) => {
				if (e && e.store_no === this.storeNo) {
					this.storeInfo = e
				}
			})
			if (option.q) {
				// let text = decodeURIComponent(option.q);
				let text = this.getDecodeUrl(option.q);
				if (text && text.indexOf('https://wx2.100xsys.cn/home/') !== -1) {
					let result = text.split('https://wx2.100xsys.cn/home/')[1];
					if (result.split('/').length >= 2) {
						option.store_no = result.split('/')[0];
						option.invite_user_no = result.split('/')[1];
						option.share_type = 'bindOrganization'
						option.from = 'share'
					} else if (result.split('/').length === 1) {
						option.store_no = result.split('/')[0];
						option.share_type = 'bindOrganization'
						option.from = 'share'
					}
				}
				if (text && text.indexOf('https://wx2.100xsys.cn/mpwx/shareClinic/') !== -1) {
					let result = text.split('https://wx2.100xsys.cn/mpwx/shareClinic/')[1];
					if (result.split('/').length >= 2) {
						option.store_no = result.split('/')[0];
						option.invite_user_no = result.split('/')[1];
						option.share_type = 'bindOrganization'
						option.from = 'share'
					} else if (result.split('/').length === 1) {
						option.store_no = result.split('/')[0];
						option.share_type = 'bindOrganization'
						option.from = 'share'
					}
				}
				if (text && text.indexOf('https://wx2.100xsys.cn/shareClinic/') !== -1) {
					let result = text.split('https://wx2.100xsys.cn/shareClinic/')[1];
					if (result.split('/').length >= 2) {
						option.store_no = result.split('/')[0];
						option.invite_user_no = result.split('/')[1];
						option.share_type = 'bindOrganization'
						option.from = 'share'
					} else if (result.split('/').length === 1) {
						option.store_no = result.split('/')[0];
						option.share_type = 'bindOrganization'
						option.from = 'share'
					}
				}
			}

			this.checkOptionParams(option);
			await this.toAddPage()

			if (!option.store_no) {
				if (this.userInfo && this.userInfo.home_store_no) {
					option.store_no = this.userInfo.home_store_no
				} else {
					option.store_no = 'S20210204016'
				}
			}
			if (this.authBoxDisplay) {
				return //未授权
			}
			if (option.share_type === 'bindOrganization' && option.store_no && option
				.invite_user_no && !this.authBoxDisplay) {
				// 绑定诊所
				// 查找店铺用户列表
				this.storeNo = option.store_no;
				this.selectStoreInfo().then(res => {
					this.getStoreUserInfo(option.store_no).then(res => {
						if (Array.isArray(res) && res.length >= 1) {
							// 店铺用户列表中已存在此用户
						} else {
							// 当前用户不在此诊所中 则添加当前用户到此诊所中
							this.addToStore(option.store_no, option
								.invite_user_no);
						}
					});
				});
			}
			if (option.store_no) {
				this.storeNo = option.store_no;
				this.initPage()
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './style.scss';

	::v-deep .u-flex {
		display: flex;
		z-index: 100000;
	}

	.cuIcon-unfold {
		transition: all 0.5s ease;
		display: inline-block;

		&.show-home {
			transform: rotate(90deg);
		}
	}

	::v-deep .nav-bar {
		display: flex;
		// justify-content: center;
		align-items: center;
		padding: 0 40rpx;
		width: 100%;

		.home-btn {
			// width: 30px;
			// height: 30px;
			border-radius: 50%;
			// border: 1rpx solid #f1f1f1;
			text-align: center;
			line-height: 30px;
			margin-right: 20rpx;
			font-size: 18px;
			color: #000;
			font-weight: bold;
		}
	}

	.store-list {
		.store-item {
			padding: 20rpx;
			border-bottom: 1rpx solid #f1f1f1;
		}
	}
</style>
