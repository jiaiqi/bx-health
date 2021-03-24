<template>
	<!-- 简介、导航、科室列表、名医介绍、就诊通知、在线预约挂号链接 -->
	<view class="page-wrap" v-if="!authBoxDisplay">
		<swiper class="screen-swiper item-box rectangle-dot" easing-function="linear" :indicator-dots="true"
			:circular="true" :autoplay="true" interval="5000" duration="500" height="300">
			<swiper-item v-for="(item, index) in swiperList" :key="item.url" @click.stop="toPreviewImage(item.url)">
				<image :src="item.url" mode="scaleToFill"></image>
			</swiper-item>
		</swiper>
		<view class="page-content">
			<view class="header-wrap" v-if="storeNo">
				<view class="hospital-top">
					<image class="logo" :src="getImagePath(storeInfo.logo)" v-if="storeInfo.logo"></image>
					<view class="logo" v-else-if="storeInfo.name">{{ storeInfo.name.slice(0, 1) }}</view>
					<view class="logo" v-else-if="!storeInfo.name">机构名称</view>
					<view class="home-btn" @click="setHomePage">
						<button class="cuIcon-home cu-btn  bg-cyan" v-if="userInfo&&userInfo.home_store_no!==storeNo">
						</button>
					</view>
					<view class="left" @click="toPages('instroduce')">
						<view class="top">
							<view class="name">{{ storeInfo.name ||'机构名称'}}</view>
							<view class="bind" v-if="!isBind"><button @click.stop="bindStore(true)" type="primary"
									class="bg-blue cu-btn sm">绑定</button></view>
						</view>
						<view class="bottom" v-if="introduction && introduction.length < 25">{{ introduction }}</view>
						<view class="bottom" v-if="storeInfo.address">
							<view class="address">
								<text class="content">{{ storeInfo.address||'机构地址' }}</text>
								<text @click.stop="getCurrentLocation"
									class="cuIcon-locationfill text-blue margin-left-xs"
									style="font-size: 30px;"></text>
							</view>
						</view>
					</view>
					<view class="instroduce" @click="toPages('instroduce')">
						<view v-html="storeInfo.introduction"></view>
					</view>
					<view class="right">
						<view class="right-item" @click="makePhoneCall">
							<image class="image" src="../../static/icon/makePhone.png" mode="aspectFit"></image>
							<text>电话</text>
						</view>
						<view class="right-item" @click="toConsult">
							<view class="image-box">
								<view class="cu-tag badge" v-if="kefuNum">{{kefuNum}}</view>
								<image class="image" src="../../static/icon/msg.png" mode="aspectFit"></image>
							</view>
							<text>在线咨询</text>
						</view>
					</view>
				</view>
				<view class="menu-list">
					<swiper class="swiper rectangle-dot" indicator-active-color="#00aaff" indicator-color="#ccc"
						:indicator-dots="true" :autoplay="false">
						<swiper-item v-for="(swiperItem,swiperIndex) in mainMenuList" :key="swiperIndex">
							<view class="swiper-item">
								<view class="menu-item"
									@click="item.eventType==='toPage'?toPages(item.type):toGroup(item.type)"
									v-for="(item,index) in swiperItem" :key="index">
									<view class="cu-tag badge" v-if="item.num">{{item.num||''}}</view>
									<u-icon :name="item.icon" size="60" color="#00aaff"
										v-if="item.iconType==='uicon'&&!item.custonIcon">
									</u-icon>
									<u-icon custom-prefix="custom-icon" :name="item.icon" size="60" color="#00aaff"
										v-else-if="item.iconType==='uicon'&&item.custonIcon">
									</u-icon>
									<image class="icon image" :src="item.icon" mode="aspectFit"
										v-if="item.iconType==='image'">
										<text :class="item.icon" style="font-size: 30px;color:#00aaff;"
											v-if="item.iconType==='font'"></text>
										<text class="title">{{item.label}}</text>
								</view>
							</view>
						</swiper-item>
					</swiper>
				</view>
				<goods-list v-if="goodsListData.length > 0" :list="goodsListData" image="goods_img" name="goods_name"
					desc="goods_desc"></goods-list>
				<vaccine-list v-if="storeNo==='S20210227032'"></vaccine-list>
				<business-handle :storeNo="storeNo"></business-handle>
				<view class="introduction news" v-if="noticeList.length > 0">
					<view class="title">
						<text class="cuIcon-titles text-blue"></text>
						<text class="text-bold " style="font-size: 16px;">通知公告</text>
					</view>
					<view class="content news-list">
						<view class="news-item none-image" :class="{
								'layout-right-image':item.cover_pic_style==='右侧',
								'layout-left-image':item.cover_pic_style==='左侧',
								'layout-center-single-image':item.cover_pic_style==='下一',
								'layout-center-multi-image':item.cover_pic_style==='下三'
								}" v-for="(item,noticeIndex) in noticeList" :key="noticeIndex" @click="toArticle(item)">
							<!-- <text class="cuIcon-mail text-orange margin-right-xs"></text> -->
							<image class="image-icon" :src="getImagePath(item.icon_image)" v-if="item.icon_image">
							</image>
							<view class="content-box">
								<text class="title-text">{{ item.title }}</text>
								<text class="date">{{ formateDate(item.create_time) }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="introduction" v-if="storeInfo.type !== '健康服务'&&deptList.length>0">
					<view class="title">
						<view>
							<text class="cuIcon-titles text-blue"></text>
							科室列表
						</view>
					</view>
					<view class="content">
						<view class="depart-box">
							<button class="depart-item cu-btn bg-blue sm margin-right-xs" :key="deptIndex" v-for="(item,deptIndex) in deptList"
								@click="toDeptDetail(item)">{{ item.dept_name }}</button>
						</view>
					</view>
				</view>
				<!-- <view class="introduction" v-if="storeInfo.type !== '健康服务'&&doctorList.length>0">
					<view class="title">
						<view class="">专家团队</view>
					</view>
					<view class="content">
						<view class="professor-box">
							<view class="professor-item" v-for="item in doctorList" @click="toDocotrDetail(item)">
								<image class="img"
									:src="getImagePath(item.profile_url) ? getImagePath(item.profile_url) : '../static/img/doctor_default.png'"
									mode="aspectFit"></image>
								<view class="doc-info">
									<view class="top">
										<text
											class="doc-name">{{ item.person_name ? item.person_name : item.nick_name || '' }}</text>
									</view>
									<view class="center">
										<view class="depart-name">科室：{{ item.deptName || '-' }}</view>
									</view>
									<view class="bottom">{{ item.staff_introduction || '暂无介绍' }}</view>
								</view>
							</view>
						</view>
					</view>
				</view> -->
				<view class="introduction news" v-if="storeInfo.type !== '健康服务'&&newsList.length>0">
					<view class="title">
						<text class="cuIcon-titles text-blue"></text>
						<text class="">新闻</text>
					</view>
					<view class="content news-list">
						<view class="news-item" v-for="(item,index) in newsList" :key="index" @click="toArticle(item)">
							<text class="cuIcon-title"></text>
							<text class="title-text">{{ item.title }}</text>
							<text class="date">{{ formateDate(item.create_time) }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
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
	import goodsList from './goods-list.vue';
	import vaccineList from './vaccine-list/vaccine-list.vue'
	import businessHandle from './business-handle/business-handle.vue'
	export default {
		components: {
			goodsList,
			vaccineList,
			businessHandle
		},
		mixins: [mixin],
		data() {
			return {
				isBind: false, //当前用户是否绑定此诊所
				bindUserInfo: {},
				swiperList: [],
				goodsListData: [],
				storeNo: '',
				fullIntro: false,
				storeInfo: {},
				// storeUserList: [],
				deptList: [], //科室
				noticeList: [], // 通知公告
				newsList: [], // 新闻
				menuList: [],
				queryOption: {},
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
							unreadNum: item.unreadNum
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
				list.push({
					icon: 'setting',
					iconType: 'uicon',
					label: '健康管理',
					eventType: 'toPage',
					type: 'health-manager'
				})

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
			},
			// customerList() {
			// 	// 客服列表
			// 	return this.storeUserList.filter(item => item && item.user_role && item.user_role.indexOf('客服') !== -1)
			// },
			// staffList() {
			// 	// 工作人员
			// 	return this.storeUserList.filter(item => item && item.user_role && (item.user_role.indexOf('工作人员') !== -
			// 		1 || item.user_role ===
			// 		'药房人员'))
			// },
			// doctorList() {
			// 	// 大夫列表
			// 	return this.storeUserList.filter(item => item.user_role === '大夫')
			// },
			onlyCurrentPage() {
				let pageStack = getCurrentPages();
				if (Array.isArray(pageStack) && pageStack.length > 1) {
					let currentPage = pageStack[pageStack.length - 1];
					this.$store.commit('SET_CURRENT_PAGE', currentPage.route);
					return false;
				} else if (Array.isArray(pageStack) && pageStack.length === 1) {
					return true;
				}
			},
			introduction() {
				if (!this.fullIntro && this.storeInfo && this.storeInfo.introduction && this.storeInfo.introduction
					.length > 80) {
					return this.storeInfo.introduction.slice(0, 80) + '...';
				} else {
					return this.storeInfo.introduction;
				}
			}
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
			toPages(e, info) {
				let url = '';
				switch (e) {
					case 'manager':
						url = `/personalPages/StoreManager/StoreManager?store_no=${this.storeNo}`
						break;
					case 'vaccine-order':
						url = '/storePages/VaccineOrder/VaccineOrder'
						break;
					case 'subscsribe':
						url = '/publicPages/webviewPage/webviewPage?webUrl=' + encodeURIComponent(
							'https://mp.weixin.qq.com/s/Z9o7ZJOtrAsR2Sj7PIIgRQ');
						break;
					case 'health-manager':
						url = '/pages/pedia/pedia'
						break;
					case 'food':
						url =
							'/otherPages/dietSelect/dietSelect?condType={"type":"food","serviceName":"srvhealth_diet_contents_select","colName":"name","imgCol":"image","wordKey":{"title":"name","unit":"unit","energy":"unit_energy"},"pagetType":"detail"}';

						break;
					case 1: // 就诊登记
						// url = '/storePages/Registration/Registration?storeNo=' + this.storeNo
						let fieldsCond = [{
								"column": "user_info_no",
								"display": false
							}, {
								"column": "name",
								"value": this.userInfo.name
							}, {
								"column": "time",
								"value": this.formateDate('', 'date')
							}, {
								"column": "user_no",
								"display": false,
								value: this.userInfo.userno
							},
							{
								"column": "store_no",
								"display": false,
								"value": this.storeNo
							}
						]
						url =
							'/publicPages/newForm/newForm?serviceName=srvhealth_see_doctor_record_add&type=add&fieldsCond=' +
							JSON.stringify(
								fieldsCond)
						break;
					case 2:
						url =
							'/otherPages/symptomSelect/symptomSelect2?term=%7B"serviceName"%3A"srvhealth_self_symptoms_select","srvApp"%3A"health","key"%3A"name","type"%3A"symptom"%7D';
						break;
					case 3:
						url = '/archivesPages/healthCompose/healthCompose';
						break;
					case 'groupChat':
						if (this.storeInfo.member_session_no) {
							url =
								`/personalPages/chat/chat?type=店铺机构全员&session_no=${this.storeInfo.member_session_no}&storeNo=${this.storeNo}`;
						} else {
							// url = '/personalPages/chat/chat?type=店铺机构全员&storeNo=' + this.storeNo
						}
						break;
					case 'personal':
						url = '/pediaPages/personal/personal?type=shop';
						break;
					case 'instroduce':
						url = '/storePages/StoreIntroduce/StoreIntroduce?store_no=' + this.storeNo;
						break;
				}
				if (url) {
					uni.navigateTo({
						url: url,
						fail() {
							uni.switchTab({
								url: url
							})
						}
					});
				}
			},
			seeMore() {
				this.fullIntro = true;
			},
			toStorePage() {
				uni.switchTab({
					url: '/pages/store/store'
				});
			},
			async selectPersonInGroup(group_no) {
				// 查找当前登录用户有没有在此圈子用户列表中
				let req = {
					condition: [{
						colName: 'store_no',
						ruleType: 'eq',
						value: this.storeNo
					}]
				};
				let res = await this.$fetch('select', 'srvhealth_person_group_circle_select', req, 'health');
				if (Array.isArray(res.data)) {
					this.groupList = res.data.map(item => {
						item.unreadNum = 0
						return item
					});
				}
			},
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
					}]
				};
				this.$fetch('select', 'srvdaq_cms_category_select', req, 'daq').then(res => {
					if (res.success && res.data.length > 0) {
						let req = {
							condition: [{
								colName: 'no',
								ruleType: 'in',
								value: res.data.map(item => item.no).toString()
							}]
						};
						let types = res.data.reduce((pre, cur) => {
							pre[cur.category_type] = cur.no
							return pre
						}, {})
						this.$fetch('select', 'srvdaq_cms_content_select', req, 'daq').then(res => {
							if (res.success) {
								this.newsList = res.data.filter(item => item.no === types['新闻'])
								this.noticeList = res.data.filter(item => item.no === types['通知公告'])
							}
						});
					}
				});
			},
			async toGroup(e) {
				uni.navigateTo({
					url: `/personalPages/gropDetail/gropDetail?gc_no=${e}&pb_no=${this.userInfo.no}&type=group-detail&from=store-detail`
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

			async getKefuSessionInfo() {
				// 查找在线客服对应会话信息
				let res = await getKefuSession(this.storeNo, this.userInfo.no)
				if (res) {
					this.kefuSessionInfo = res
				}
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
					}
					this.storeNum = 0
					this.kefuNum = 0
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
			async selectStoreInfo() {
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
				uni.showToast({
					title:'开始查找机构信息',
					icon:"none"
				})
				let res = await this.$fetch('select', 'srvhealth_store_mgmt_select', req, 'health')
				if (Array.isArray(res.data) && res.data.length > 0) {
					uni.showToast({
						title:'已查找到机构信息'
					})
					this.storeInfo = res.data[0];
					if (this.storeInfo.type === '健康服务') {
						this.getGoodsListData();
					}
					this.getSwiperList(this.storeInfo);
					uni.setNavigationBarTitle({
						title: this.storeInfo.name
					});
					this.getNotice();
				}else{
					uni.showToast({
						title:'未查找到机构信息',
						icon:'none'
					})
				}
				this.selectDepartList();
			},

			async bindStore(nullRole) {
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
						return this.bindUserInfo
					}
				} else {
					return res
				}
			},
			async toConsult() {
				// 在线咨询
				if (!this.bindUserInfo || !this.bindUserInfo.store_user_no) {
					this.bindUserInfo = await this.bindStore()
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
						store_no: store_no,
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
							title:'未授权获取用户信息',
							icon:'none'
						})
						// 没有获取用户信息授权
					} else {
						uni.showToast({
							title:'已授权获取用户信息',
							icon:'none'
						})
						this.$store.commit('SET_AUTH_USERINFO', true);
					}
					// #endif
				}
				uni.showToast({
					title:'初始化数据',
					icon:'none'
				})
				if (this.storeNo) {
					uni.showToast({
						title:'初始化数据',
						icon:'none'
					})
					console.log(`storeNo:${this.storeNo}`)
					await this.selectStoreInfo();
					await this.selectBindUser()
					await this.seletGroupList();
					// await this.getKefuSessionInfo()
					this.selectUnreadAmount()
				} else {
					uni.showToast({
						title: '未发现store_no',
						icon: 'none'
					})
				}
			},
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
					uni.startPullDownRefresh()
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
			this.queryOption = option
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
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
				this.initPage()
			})
			uni.$on('updateStoreInfo', (e) => {
				if (e && e.store_no === this.storeNo) {
					this.storeInfo = e
				}
			})
			if (option.q) {
				let text = decodeURIComponent(option.q);
				if (text.indexOf('https://wx2.100xsys.cn/mpwx/shareClinic/') !== -1) {
					let result = text.split('https://wx2.100xsys.cn/mpwx/shareClinic/')[1];
					if (result.split('/').length >= 2) {
						option.store_no = result.split('/')[0];
						option.invite_user_no = result.split('/')[1];
						option.share_type = 'bindOrganization'
						option.from = 'share'
					}
				}
			}
			if (option.q) {
				let text = decodeURIComponent(option.q);
				if (text.indexOf('https://wx2.100xsys.cn/shareClinic/') !== -1) {
					let result = text.split('https://wx2.100xsys.cn/shareClinic/')[1];
					if (result.split('/').length >= 2) {
						option.store_no = result.split('/')[0];
						option.invite_user_no = result.split('/')[1];
						option.share_type = 'bindOrganization'
						option.from = 'share'

					}
				}
			}
			this.checkOptionParams(option);
			await this.toAddPage()
			if (option.share_type === 'bindOrganization' && option.store_no && option
				.invite_user_no) {
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
				uni.showToast({
					title:'店铺编号：'+option.store_no,
					icon:'none'
				})
				this.storeNo = option.store_no;
				this.initPage()
			}
		}
	};
</script>

<style lang="scss" scoped>
	@import './style.scss';
</style>
