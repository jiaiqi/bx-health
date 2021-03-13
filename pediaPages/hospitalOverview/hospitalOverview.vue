<template>
	<!-- 简介、导航、科室列表、名医介绍、就诊通知、在线预约挂号链接 -->
	<view class="page-wrap" :class="{ onlyCurrentPage: onlyCurrentPage&&false}" v-if="!authBoxDisplay">
		<swiper class="screen-swiper item-box rectangle-dot" easing-function="linear" :indicator-dots="true"
			:circular="true" :autoplay="true" interval="5000" duration="500" height="300">
			<swiper-item v-for="(item, index) in swiperList" :key="item.url" @click.stop="toPreviewImage(item.url)">
				<image :src="item.url" mode="scaleToFill"></image>
			</swiper-item>
		</swiper>
		<view class="page-content">
			<view class="header-wrap" v-if="storeInfo && storeInfo.id">
				<view class="hospital-top">
					<!-- 					<image class="logo" :src="getImagePath(storeInfo.logo)" v-if="storeInfo.logo"></image>
					<view class="logo" v-else>{{ storeInfo.name.slice(0, 1) }}</view> -->
					<view class="home-btn" @click="setHomePage">
						<!-- <button class="cuIcon-home cu-btn bg-cyan"> -->
						<button class="cuIcon-home cu-btn  bg-cyan" v-if="userInfo&&userInfo.home_store_no!==storeNo">
							<!-- <text class="margin-left-xs">{{userInfo&&userInfo.add_store_no===storeNo?'取消设为首页':'设为首页'}}</text> -->
						</button>
					</view>
					<view class="home-btn like-btn" @click="toPages('subscsribe')" v-if="!subscsribeStatus">
						<button class="cuIcon-notice cu-btn bg-orange">
						</button>
					</view>
					<view class="left" @click="toPages('instroduce')">
						<view class="top">
							<view class="name">{{ storeInfo.name }}</view>
							<view class="bind" v-if="!isBind"><button @click.stop="bindStore(true)" type="primary"
									class="bg-blue cu-btn sm">绑定</button></view>
						</view>
						<view class="bottom" v-if="introduction && introduction.length < 25">{{ introduction }}</view>
						<view class="bottom" v-if="storeInfo.address" @click.stop="getCurrentLocation">
							<view class="address">
								<text class="content">{{ storeInfo.address }}</text>
								<text class="cuIcon-locationfill text-blue margin-left-xs"
									style="font-size: 20px;"></text>
							</view>
						</view>
					</view>
					<view class="right">
						<view class="right-item" @click="makePhoneCall">
							<image class="image" src="../../static/icon/makePhone.png" mode="aspectFit"></image>
							<text>电话</text>
						</view>
						<view class="right-item" @click="toConsult">
							<view class="cu-tag badge" v-if="kefuNum">{{kefuNum}}</view>
							<image class="image" src="../../static/icon/msg.png" mode="aspectFit"></image>
							<text>在线咨询</text>
						</view>
					</view>
					<view class="instroduce">
						<view v-html="storeInfo.introduction"></view>
					</view>
				</view>
				<view class="menu-list">
					<swiper class="swiper rectangle-dot" indicator-active-color="#00aaff" indicator-color="#ccc"
						:indicator-dots="true" :autoplay="false">
						<swiper-item>
							<view class="swiper-item">
								<view class="menu-item" @click="toPages('groupChat')"
									v-if="storeInfo.member_session_no">
									<view class="cu-tag badge" v-if="storeNum">{{storeNum}}</view>
									<text class="cuIcon-comment" style="font-size: 30px;color:#00aaff;"></text>
									<text class="title">服务站群</text>
								</view>
								<view class="menu-item" v-for="item in groupList" @click="toGroup(item)">
									<view class="cu-tag badge" v-if="item.unreadNum">{{item.unreadNum}}</view>
									<image class="icon image" :src="getImagePath(item.icon,true)" mode="aspectFit"
										v-if="item.icon">
									</image>
									<text class="icon image cuIcon-group_fill text-grey" v-else></text>
									<view class="label">{{ item.name }}</view>
								</view>
								<view class="menu-item" @click="toPages('vaccine-order')">
									<u-icon name="order" size="60" color="#00aaff"></u-icon>
									<view class="label">我的预约</view>
								</view>
								<view class="menu-item" @click="toPages('food')" v-if="storeInfo.type === '健康服务'">
									<u-icon name="yinshi" custom-prefix="custom-icon" size="60" color="#00aaff">
									</u-icon>
									<text class="title">食物库</text>
								</view>
							</view>
						</swiper-item>
						<swiper-item>
							<view class="swiper-item">
								<view class="menu-item" @click="toPages('health-manager')">
									<u-icon name="setting" size="60" color="#00aaff"></u-icon>
									<view class="label">健康管理</view>
								</view>
							</view>
						</swiper-item>
					</swiper>

					<!-- 			<view class="menu-item" @click="toPages(1)" v-if="storeInfo.type !== '健康服务'">
						<u-icon name="guahaowenzhen" custom-prefix="custom-icon" size="60" color="#00aaff"></u-icon>
						<image class="icon image" src="../static/img/挂号问诊.png" mode="aspectFit">
							<text class="title">就诊登记</text>
					</view> -->
					<!-- 		<view class="menu-item" @click="toPages(2)">
						<image class="icon image" src="../static/img/问诊体检.png" mode="aspectFit">
							<u-icon name="zhengzhuang" custom-prefix="custom-icon" size="60" color="#00aaff"></u-icon>
							<text class="title">症状自检</text>
					</view> -->
					<!-- 	<view class="menu-item" @click="toPages(3)">
						<image class="icon image" src="../static/img/检验报告.png" mode="aspectFit">
							<u-icon name="zhenduan" custom-prefix="custom-icon" size="60" color="#00aaff"></u-icon>
							<text class="title">健康评测</text>
					</view> -->

					<!-- 			<view class="menu-item" @click="toPages(4)">
						<u-icon name="jilu" custom-prefix="custom-icon" size="60" color="#00aaff"></u-icon>
						<text class="title">健康记录</text>
					</view> -->
					<!-- 		<view class="menu-item" v-for="item in groupList" @click="toGroup(item)">
						<view class="cu-tag badge" v-if="item.unreadNum">{{item.unreadNum}}</view>
						<image class="icon image" :src="getImagePath(item.icon,true)" mode="aspectFit" v-if="item.icon">
						</image>
						<text class="icon image cuIcon-group_fill text-grey" v-else></text>
						<view class="label">{{ item.name }}</view>
					</view>
					<view class="menu-item" @click="toPages('vaccine-order')">
						<u-icon name="order" size="60" color="#00aaff"></u-icon>
						<view class="label">疫苗预约</view>
					</view>
					<view class="menu-item" @click="toPages('health-manager')">
						<u-icon name="setting" size="60" color="#00aaff"></u-icon>
						<view class="label">健康管理</view>
					</view> -->
				</view>
				<goods-list v-if="goodsListData.length > 0" :list="goodsListData" image="goods_img" name="goods_name"
					desc="goods_desc"></goods-list>
				<vaccine-list :vaccineList="vaccineList"></vaccine-list>
				<view class="introduction news" v-if="noticeList.length > 0">
					<view class="title">
						<text class="cuIcon-titles text-blue"></text>
						<text class="">通知公告</text>
					</view>
					<view class="content news-list">
						<view class="news-item none-image" :class="{
								'layout-right-image':item.cover_pic_style==='右侧',
								'layout-left-image':item.cover_pic_style==='左侧',
								'layout-center-single-image':item.cover_pic_style==='下一',
								'layout-center-multi-image':item.cover_pic_style==='下三'
								}" v-for="item in noticeList" @click="toArticle(item)">
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
							<button class="depart-item cu-btn bg-blue sm margin-right-xs" v-for="item in deptList"
								@click="toDeptDetail(item)">{{ item.dept_name }}</button>
						</view>
					</view>
				</view>
				<!-- <view class="introduction" v-if="storeInfo.type !== '健康服务'&&groupList.length>0">
					<view class="title">
						<view>
							<text class="cuIcon-titles text-blue"></text>
							关联圈子
						</view>
					</view>
					<view class="content">
						<view class="group-box">
							<view class="group-item" v-for="item in groupList" @click="toGroup(item)">
								<image class="image" :src="getImagePath(item.icon)" mode="aspectFit" v-if="item.icon">
								</image>
								<text class=" image cuIcon-group_fill text-grey" v-else></text>
								<view class="label">{{ item.name }}</view>
							</view>
						</view>
					</view>
				</view> -->
				<view class="introduction" v-if="storeInfo.type !== '健康服务'&&doctorList.length>0">
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
				</view>
				<view class="introduction news" v-if="storeInfo.type !== '健康服务'&&newsList.length>0">
					<view class="title">
						<text class="cuIcon-titles text-blue"></text>
						<text class="">新闻</text>
					</view>
					<view class="content news-list">
						<view class="news-item" v-for="item in newsList" @click="toArticle(item)">
							<text class="cuIcon-title"></text>
							<text class="title-text">{{ item.title }}</text>
							<text class="date">{{ formateDate(item.create_time) }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 		<view class="bottom-layer" v-if="onlyCurrentPage === true">
					<view class="bottom-button" @click="toStorePage">
				<text class="cuIcon-home icon"></text>
				<view class="label">小程序主页</view>
			</view>
			<view class="bottom-button" @click="toPages('notice-setting')">
				<text class="cuIcon-notice icon"></text>
				<view class="label">通知设置</view>
				<view class="badge" :class="{'bg-green':subscsribeStatus,'bg-orange':!subscsribeStatus}">
				</view>
			</view>
			<view class="bottom-button" @click="toPages('personal')">
				<text class="cuIcon-people icon"></text>
				<view class="label">我的</view>
			</view>
		</view> -->
	</view>
	<bx-auth v-else-if="authBoxDisplay" @getuserinfo="getuserinfo"></bx-auth>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	import {
		getKefuSession,
		getGroupListUser,
		getUserList,
		getVaccineList
	} from './getData.js'
	import goodsList from './goods-list.vue';
	import vaccineList from './vaccine-list/vaccine-list.vue'
	export default {
		components: {
			goodsList,
			vaccineList
		},
		data() {
			return {
				isBind: false, //当前用户是否绑定此诊所
				bindUserInfo: {},
				swiperList: [],
				goodsListData: [],
				storeNo: '',
				fullIntro: false,
				storeInfo: {},
				storeUserList: [],
				deptList: [], //科室
				groupList: [], // 关联圈子
				noticeList: [], // 通知公告
				newsList: [], // 新闻
				menuList: [],
				queryOption: {},
				kefuNum: 0, // 客服咨询会话未读数
				storeNum: 0, // 店铺全员会话未读数
				kefuSessionInfo: {},
				vaccineList: [], // 可预约疫苗列表
			};
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
				inviterInfo: state => state.app.inviterInfo,
				subscsribeStatus: state => state.app.subscsribeStatus, //是否关注公众号
				authBoxDisplay: state => state.app.authBoxDisplay //授权访问用户信息
			}),
			customerList() {
				// 客服列表
				return this.storeUserList.filter(item => item.user_role.indexOf('客服') !== -1)
			},
			staffList() {
				// 工作人员
				return this.storeUserList.filter(item => item.user_role.indexOf('工作人员') !== -1 || item.user_role ===
					'药房人员')
			},
			doctorList() {
				// 大夫列表
				return this.storeUserList.filter(item => item.user_role === '大夫')
			},
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
			toPages(e) {
				let url = '';
				switch (e) {
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
						// case 4:
						// 	url = '/personalPages/HealthRecord/HealthRecord';
						// 	break;
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
						url: '/publicPages/article/article?serviceName=srvdaq_cms_content_select&content_no=' + e
							.content_no
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
					url: `/personalPages/gropDetail/gropDetail?gc_no=${e.gc_no}&pb_no=${this.userInfo.no}&type=group-detail&from=store-detail`
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
			async getVaccineList() {
				// 查找可预约疫苗列表
				this.vaccineList = await getVaccineList()
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
			async selectUserList() {
				let userList = await getUserList(this.storeNo)
				if (userList) {
					let isBind = userList.find(item => item.person_no === this.userInfo.no)
					if (isBind && isBind.person_no) {
						this.isBind = true
						this.bindUserInfo = isBind
					}
					this.storeUserList = userList
					this.storeNum = 0
					this.kefuNum = 0
				}
			},
			selectUnreadAmount() {
				// 查找未读消息数量
				let req = {
					"serviceName": "srvhealth_consultation_chat_record_select",
					"colNames": ["*"],
					// group: [
					// 	{
					// 		"colName": "session_no",
					// 		"type": "by"
					// 	},
					// 	{
					// 		"colName": "id",
					// 		"type": "count"
					// 	}
					// ],
					"relation_condition": {
						"relation": "OR",
						"data": [{
								"relation": "AND",
								"data": [{
										"colName": "session_no",
										"ruleType": "eq",
										"value": this.storeInfo.member_session_no //店铺成员群
									},
									{
										"colName": "create_time",
										"ruleType": "ge",
										"value": this.bindUserInfo.store_session_sign_in_time
									}
								]
							},
							{
								"relation": "AND",
								"data": [{
										"colName": "session_no",
										"ruleType": "eq",
										"value": this.kefuSessionInfo.session_no //机构用户客服
									},
									{
										"colName": "create_time",
										"ruleType": "ge",
										"value": this.kefuSessionInfo.kefu_session_user_time
									}
								]
							}
						]
					},
					"order": [{
						"colName": "create_time",
						"orderType": "desc"
					}],
					"page": {
						"rownumber": 999,
						"pageNo": 1
					}
				}
				this.groupList.forEach(item => {
					let result = {
						"relation": "AND",
						"data": [{
							"colName": "rcv_group_no",
							"ruleType": "eq",
							"value": item.gc_no
						}]
					}
					if (item.latest_sign_in_time) {
						result.data.push({
							"colName": "create_time",
							"ruleType": "ge",
							"value": item.latest_sign_in_time
						})
					}
					req.relation_condition.data.push(result)
				})
				// req.relation_condition.data.push()
				this.$fetch('select', 'srvhealth_consultation_chat_record_select', req, 'health').then(res => {
					if (res.success) {
						res.data.map(item => {
							if (item.rcv_group_no) {
								// 群聊
								let index = this.groupList.findIndex(gc => gc.gc_no === item.rcv_group_no)
								if (index !== -1) {
									let unreadNum = this.groupList[index].unreadNum ? this.groupList[index]
										.unreadNum : 0
									this.$set(this.groupList[index], 'unreadNum', unreadNum + 1)
								}
							} else if (item.session_no === this.bindUserInfo.kefu_session_no) {
								// 机构全员
								this.kefuNum += 1
							} else if (item.session_no === this.kefuSessionInfo.session_no) {
								// 机构客服
								this.storeNum += 1
							}
						})
					}
				})
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
					this.getNotice();
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
						"person_name": this.userInfo.name,
						"user_account": this.userInfo.userno,
						"nick_name": this.userInfo.nick_name,
						"profile_url": this.userInfo.profile_url,
						user_image: this.userInfo.user_image,
						"sex": this.userInfo.sex,
						"user_role": nullRole ? null : "用户",
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
				if (!this.bindUserInfo) {
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
						// "add_store_type": this.userInfo.add_store_no === this.storeNo ? '' : this
						// 	.storeInfo.type,
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
						nick_name: this.userInfo.nick_name,
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
			}
		},
		async onPullDownRefresh() {
			await this.toAddPage()
			if (this.storeNo) {
				await this.selectUserList()
				await this.selectStoreInfo();
				await this.seletGroupList();
				await this.getKefuSessionInfo()
				this.selectUnreadAmount()
			}
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
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
				this.selectUserList()
			})
			uni.$on('updateKefuSessionLastLookTime', e => {
				this.kefuSessionInfo = e
			})
			uni.$on('updateStoreInfo', (e) => {
				if (e && e.store_no === this.storeNo) {
					this.storeInfo = e
				}
			})
			this.checkOptionParams(option);
			if (this.authBoxDisplay) {
				// 未授权
				return
			}
			let res = await this.toAddPage()

			// this.toAddPage().then(res => {

			if (res === 'fail') {
				return;
			}
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
			if (option.store_no && this.userInfo.no) {
				this.storeNo = option.store_no;
				if (option.store_no === 'S20210227032') {
					// 金地西沣公元卫生服务站 查找可预约疫苗
					this.getVaccineList()
				}
				await this.selectUserList()
				await this.selectStoreInfo();
				await this.getKefuSessionInfo()
				await this.seletGroupList();
				this.selectUnreadAmount()
			}
			// });
		}
	};
</script>

<style lang="scss">
	@import './style.scss';
</style>
