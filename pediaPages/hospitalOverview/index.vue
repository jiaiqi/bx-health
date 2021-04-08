<template>
	<!-- 简介、导航、科室列表、名医介绍、就诊通知、在线预约挂号链接 -->
	<view class="page-wrap" v-if="!authBoxDisplay||client_env==='web'">
		<slide-list :swiperList="swiperList"></slide-list>
		<store-info :storeInfo="storeInfo" :userInfo="userInfo" :bindUserInfo="bindUserInfo" @bindUser="bindStore"
			v-if="storeInfo.store_no" :isBind="isBind" @setHomePage="setHomePage" @addToStore="addToStore"></store-info>
		<button-list :mainMenuList="mainMenuList" :userInfo="userInfo" :bindUserInfo="bindUserInfo"
			:storeInfo="storeInfo" @addToStore="addToStore"></button-list>
		<goods-list v-if="goodsListData.length > 0" :list="goodsListData" image="goods_img" name="goods_name"
			desc="goods_desc"></goods-list>
		<vaccine-list v-if="storeNo==='S20210227032'" ref='vaccineList'></vaccine-list>
		<staff-manage :storeNo="storeNo" v-if="storeInfo&&storeInfo.type==='诊所'" @toDoctorDetail="toDoctorDetail">
		</staff-manage>
		<news-list :website_no="storeInfo&&storeInfo.website_no" ref="newsList" :storeInfo="storeInfo">
		</news-list>
		<!-- 	<view class="introduction" v-if="storeInfo.type !== '健康服务'&&deptList.length>0">
					<view class="title">
						<view>
							<text class="cuIcon-titles text-blue"></text>
							科室列表
						</view>
					</view>
					<view class="content">
						<view class="depart-box">
							<button class="depart-item cu-btn bg-blue sm margin-right-xs" :key="deptIndex"
								v-for="(item,deptIndex) in deptList"
								@click="toDeptDetail(item)">{{ item.dept_name }}</button>
						</view>
					</view>
				</view> -->
	</view>
	<bx-auth v-else @getuserinfo="getuserinfo"></bx-auth>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import mixin from './mixin.js'
	import {
		getKefuSession,
		getGroupListUser,
		getUserList
	} from './getData.js'
	import slideList from './slide-picture/slide-picture.vue'
	import storeInfo from './store-info/store-info.vue'
	import buttonList from './button-group/button-group.vue'
	import goodsList from './goods-list/goods-list.vue';
	import vaccineList from './vaccine-list/vaccine-list.vue'
	import newsList from './news-list/news-list.vue'
	import staffManage from './staff-manage/staff-manage.vue'
	export default {
		components: {
			slideList,
			storeInfo,
			buttonList,
			goodsList,
			vaccineList,
			staffManage,
			newsList
		},
		mixins: [mixin],
		data() {
			return {
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
				msgNum: 0,
				kefuSessionInfo: {},
				vaccineList: [], // 可预约疫苗列表
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
			mainMenuList() {
				// 大按钮列表
				let list = []
				if (Array.isArray(this.groupList)) {
					let groupList = this.groupList.map(item => {
						return {
							icon: this.getImagePath(item.icon, true),
							iconType: 'image',
							label: item.name,
							eventType: 'toGroup',
							type: item.gc_no,
							num: item.unreadNum,
						}
					})
					list = [...list, ...groupList]
				}
				if (this.storeInfo && this.storeInfo.member_session_no) {
					list.unshift({
						icon: 'cuIcon-comment',
						iconType: 'font',
						label: this.storeInfo.member_session_name ? this.storeInfo.member_session_name : '公开咨询',
						eventType: 'toPage',
						type: 'groupChat',
						num: this.storeNum,
					})
				}
				if (!this.subscsribeStatus) {
					list.unshift({
						icon: 'cuIcon-notice text-orange',
						iconType: 'font',
						label: '通知设置',
						eventType: 'toPage',
						type: 'subscsribe',
						num: '请设置'
					})
				}

				if (this.bindUserInfo && this.bindUserInfo.user_role && (this.bindUserInfo.user_role.indexOf('工作人员') !== -
						1 || this.bindUserInfo.user_role.indexOf('管理员') !== -1)) {
					list.push({
						icon: 'cuIcon-shop',
						iconType: 'font',
						label: '管理入口',
						eventType: 'toPage',
						num: this.storeInfo && this.storeInfo.kefu_unread_msg ? this.storeInfo.kefu_unread_msg : 0,
						type: 'manager'
					})
				}
				if (this.storeNo === 'S20210227032') {
					list.push({
						icon: 'order',
						iconType: 'uicon',
						label: '我的预约',
						eventType: 'toPage',
						type: 'vaccine-order'
					})
				}
				if (this.storeInfo && this.storeInfo.type === '健康服务') {
					list.push({
						icon: 'yinshi',
						custonIcon: true,
						iconType: 'uicon',
						label: '食物库',
						eventType: 'toPage',
						type: 'food'
					})
				}
				list.push({
					icon: 'setting',
					iconType: 'uicon',
					label: '健康管理',
					eventType: 'toPage',
					type: 'health-manager'
				})
				if (Array.isArray(list)) {
					return list.reduce((pre, item) => {
						if (pre.length === 0) {
							pre = [
								[item]
							]
						} else if (pre[pre.length - 1].length >= 4) {
							pre.push([item])
						} else {
							pre[pre.length - 1].push(item)
						}
						return pre
					}, [])
				}
			},
			// introduction() {
			// 	if (!this.fullIntro && this.storeInfo && this.storeInfo.introduction && this.storeInfo.introduction
			// 		.length > 80) {
			// 		return this.storeInfo.introduction.slice(0, 80) + '...';
			// 	} else {
			// 		return this.storeInfo.introduction;
			// 	}
			// }
		},
		methods: {
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
					this.$store.commit('SET_WX_USERINFO', rawData);
					this.$store.commit('SET_AUTH_SETTING', {
						type: 'userInfo',
						value: true
					});
					this.$store.commit('SET_AUTH_USERINFO', true);
					this.toAddPage();
				}
				// #endif
			},
			// async selectPersonInGroup(group_no) {
			// 	// 查找当前登录用户有没有在此圈子用户列表中
			// 	let req = {
			// 		condition: []
			// 	};
			// 	if (group_no) {
			// 		req.condition.push({
			// 			colName: 'person_no',
			// 			ruleType: 'eq',
			// 			value: this.userInfo.no
			// 		})
			// 		req.condition.push({
			// 			// {
			// 			colName: 'gc_no',
			// 			ruleType: 'eq',
			// 			value: group_no
			// 			// },
			// 		})
			// 	} else {
			// 		return
			// 	}
			// 	let res = await this.$fetch('select', 'srvhealth_person_group_circle_select', req, 'health');
			// 	if (Array.isArray(res.data) && res.data.length > 0) {
			// 		return res.data[0]
			// 	}
			// },
			toArticle(e) {
				if (e.content_no) {
					uni.navigateTo({
						url: `/publicPages/article/article?serviceName=srvdaq_cms_content_select&content_no=${e.content_no}&store_no=${this.storeNo}&store_name=${this.storeInfo.name}`
					});
				}
			},
			getNotice() {
				let req = {
					condition: [{
							colName: 'website_no',
							ruleType: 'eq',
							value: this.storeInfo.website_no
						},
						{
							colName: 'is_leaf',
							ruleType: 'eq',
							value: '是'
						}
					]
				};
				this.$fetch('select', 'srvdaq_cms_category_select', req, 'daq').then(cate => {
					if (cate.success && cate.data.length > 0) {
						let types = cate.data.reduce((pre, cur) => {
							let obj = {
								name: cur.cate_name,
								no: cur.no,
								list: []
							}
							pre.push(obj)
							return pre
						}, [])
						this.noticeList = types
						let req = []
						if (types.length > 0) {
							types.forEach(type => {
								let obj = {
									//查询请求1
									colNames: ["*"],
									condition: [{
										colName: 'no',
										ruleType: 'eq',
										value: type.no
									}],
									order: [{
										colName: "create_time",
										orderType: "desc"
									}],
									page: {
										pageNo: 1,
										rownumber: 3
									},
									serviceName: "srvdaq_cms_content_select"
								}
								req.push(obj)
							})
						}
						this.$fetch('multi', 'select', req, 'daq').then(res => {
							if (res.success) {
								res.data.forEach((item, key) => {
									if (item.state === "SUCCESS") {
										types[key].list = item.data
										this.$set(this.noticeList, key, types[key])
									}
								})
							}
						})
					}
				});
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
			async seletGroupList() {
				// 查找店铺关联群组
				let res = await getGroupListUser(this.storeNo, this.userInfo.no)
				if (Array.isArray(res)) {
					this.groupList = res
				}
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
					this.storeNum = 0
					this.msgNum = 0
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
			async getSwiperList(e) {
				if (e.image) {
					let res = await this.getFilePath(e.image);
					if (Array.isArray(res)) {
						this.swiperList = res.reduce((pre, cur) => {
							if (cur.fileurl) {
								cur.url = this.$api.getFilePath + cur.fileurl + '&bx_auth_ticket=' + uni
									.getStorageSync('bx_auth_ticket');
							}
							pre.push(cur);
							return pre;
						}, []);
					}
				}
			},
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
					this.getSwiperList(this.storeInfo);
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
						// const result = await wx.login();
						// if (result.code) {
						// 	await this.wxLogin({
						// 		code: result.code
						// 	});
						// 	times++
						// 	if (times < 3) {
						// 		this.selectStoreInfo(times)
						// 	}
						// }
					} else {
						uni.showModal({
							title: '未查找到机构信息',
							content: `${res?JSON.stringify(res):''}  storeNo为${this.storeNo}`,
							showCancel: false
						})
					}
				}
				this.selectDepartList();
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
			makePhoneCall() {
				uni.makePhoneCall({
					phoneNumber: this.storeInfo.telephone ? this.storeInfo.telephone : '10086'
				});
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
			getCurrentLocation() {
				let latitude = 34.219329;
				let longitude = 108.935485;
				uni.openLocation({
					latitude: this.storeInfo.latitude ? Number(this.storeInfo.latitude) : latitude,
					longitude: this.storeInfo.longitude ? Number(this.storeInfo.longitude) : longitude,
					name: this.storeInfo.name,
					address: this.storeInfo.address,
					success: function() {
						console.log('success');
					},
					fail(err) {
						console.log('err', err);
					}
				});
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
				if (this.authBoxDisplay) {
					// 未授权
					// #ifdef MP-WEIXIN
					let res = await wx.getSetting();
					if (!res.authSetting['scope.userInfo']) {
						this.$store.commit('SET_AUTH_SETTING', {
							type: 'userInfo',
							value: false
						});
						uni.showToast({
							title: '未授权获取用户信息',
							icon: 'none'
						})
						// 没有获取用户信息授权
					} else {
						this.$store.commit('SET_AUTH_USERINFO', true);
					}
					// #endif
				}
				if (!this.subscsribeStatus) {
					// 检测是否已关注公众号
					this.checkSubscribeStatus()
				}
				if (this.storeNo) {
					await this.selectStoreInfo();
					await this.selectBindUser()
					await this.seletGroupList();
					if (this.$refs.vaccineList) {
						this.$refs.vaccineList.getVaccineList()
					}
					if (this.$refs.newsList) {
						this.$refs.newsList.getNotice()
					}
					this.selectUnreadAmount()
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
			if (this.authBoxDisplay) {
				// 未授权
				// #ifdef MP-WEIXIN
				let res = await wx.getSetting();
				if (res.authSetting['scope.userInfo']) {
					this.$store.commit('SET_AUTH_USERINFO', true);
					// 没有获取用户信息授权
				}
				// #endif
			}
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
			this.$store.commit('SET_INTO_HOSPITAL_STATUS', true)
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage']
			});
			// #endif
			uni.$on('updateStoreSessionLastLookTime', (e) => {
				this.selectBindUser()
				this.selectUnreadAmount()
			})
			uni.$on('updateKefuSessionLastLookTime', e => {
				this.kefuSessionInfo = e
				this.selectUnreadAmount()
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
</style>
