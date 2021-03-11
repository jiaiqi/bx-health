<template>
	<!-- 简介、导航、科室列表、名医介绍、就诊通知、在线预约挂号链接 -->
	<view class="page-wrap" :class="{ onlyCurrentPage: onlyCurrentPage&&false}" v-if="!authBoxDisplay">
		<swiper class="screen-swiper item-box square-dot" easing-function="linear" :indicator-dots="true"
			:circular="true" :autoplay="true" interval="5000" duration="500" height="300">
			<swiper-item v-for="(item, index) in swiperList" :key="item.url" @click.stop="toPreviewImage(item.url)">
				<image :src="item.url" mode="scaleToFill"></image>
			</swiper-item>
		</swiper>
		<view class="page-content">
			<view class="header-wrap" v-if="storeInfo && storeInfo.id">
				<view class="hospital-top">
					<image class="logo" :src="getImagePath(storeInfo.logo)" v-if="storeInfo.logo"></image>
					<view class="logo" v-else>{{ storeInfo.name.slice(0, 1) }}</view>
					<view class="home-btn shadow-blur" @click="setHomePage">
						<view class="cuIcon-home cu-btn bg-white "> <text
								class="margin-left-xs">{{userInfo&&userInfo.add_store_no===storeNo?'取消设为首页':'设为首页'}}</text>
						</view>
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
							<image class="image" src="../../static/icon/msg.png" mode="aspectFit"></image>
							<text>在线咨询</text>
						</view>
					</view>
					<view class="instroduce">
						<view v-html="storeInfo.introduction"></view>
					</view>
				</view>
				<view class="menu-list">
					<view class="menu-item" @click="toPages('food')" v-if="storeInfo.type === '健康服务'">
						<u-icon name="yinshi" custom-prefix="custom-icon" size="60" color="#00aaff"></u-icon>
						<text class="title">食物库</text>
					</view>
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
					<view class="menu-item" @click="toPages('groupChat')" v-if="storeInfo.member_session_no">
						<text class="cuIcon-comment" style="font-size: 30px;color:#00aaff;"></text>
						<!-- <image class="icon image" src="../static/img/在线问诊.png" mode="aspectFit"> -->
						<text class="title">服务站群</text>
					</view>
					<!-- 			<view class="menu-item" @click="toPages(4)">
						<u-icon name="jilu" custom-prefix="custom-icon" size="60" color="#00aaff"></u-icon>
						<text class="title">健康记录</text>
					</view> -->
					<view class="menu-item" v-for="item in groupList" @click="toGroup(item)">
						<image class="icon image" :src="getImagePath(item.icon,true)" mode="aspectFit" v-if="item.icon">
						</image>
						<text class="icon image cuIcon-group_fill text-grey" v-else></text>
						<view class="label">{{ item.name }}</view>
					</view>
					<view class="menu-item" @click="toPages('health-manager')">
						<u-icon name="setting" size="60" color="#00aaff"></u-icon>
						<view class="label">健康管理</view>
					</view>
				</view>
				<goods-list v-if="goodsListData.length > 0" :list="goodsListData" image="goods_img" name="goods_name"
					desc="goods_desc"></goods-list>
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
	import goodsList from './goods-list.vue';
	export default {
		components: {
			goodsList
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
				queryOption: {}
			};
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo,
				inviterInfo: state => state.app.inviterInfo,
				subscsribeStatus: state => state.app.subscsribeStatus, //是否关注公众号
				authBoxDisplay: state => state.app.authBoxDisplay //授权访问用户信息
			}),
			storeUserInfo() {
				// 当前用户在店铺用户列表中的信息
				if (this.userInfo && this.userInfo.no) {
					return this.storeUserList.find(item => item.person_no === this.userInfo.no)
				} else {
					return null
				}
			},
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
					case 'notice-setting':
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
					this.groupList = res.data;
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
			seletGroupList() {
				let req = {
					condition: [{
						colName: 'store_no',
						ruleType: 'eq',
						value: this.storeNo
					}]
				};
				this.$fetch('select', 'srvhealth_group_circle_select', req, 'health').then(res => {
					if (Array.isArray(res.data)) {
						this.groupList = res.data;
					}
				});
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
			selectStoreInfo() {
				let url = this.getServiceUrl('health', 'srvhealth_store_mgmt_select', 'select');
				let req = {
					serviceName: 'srvhealth_store_mgmt_select',
					colNames: ['*'],
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
				return new Promise((resolve, reject) => {
					this.$http.post(url, req).then(res => {
						if (Array.isArray(res.data.data) && res.data.data.length > 0) {
							this.storeInfo = res.data.data[0];
							if (this.storeInfo.type === '健康服务') {
								this.getGoodsListData();
							}
							this.getSwiperList(this.storeInfo);
							uni.setNavigationBarTitle({
								title: this.storeInfo.name
							});
							this.getNotice();
							resolve(res.data.data[0]);
						} else {
							reject(res);
						}
					});
				});
			},
			selectUserList() {
				let req = {
					page: {
						rownumber: 99999
					},
					"serviceName": "srvhealth_store_user_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "store_no",
						"ruleType": "eq",
						"value": this.storeNo
					}],
				}
				this.$fetch('select', 'srvhealth_store_user_select', req, 'health').then(res => {
					if (res.success && res.data.length >= 1) {
						if (res.data.find(item => item.store_no === this.storeNo)) {
							this.isBind = true
							this.bindUserInfo = res.data.find(item => item.store_no === this.storeNo)
						}
						this.storeUserList = res.data
					}
				})
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
				let storeUserInfo = this.storeUserList.find(item => item.person_no === this.userInfo.no)
				if (!storeUserInfo) {
					storeUserInfo = await this.bindStore()
				}
				if (storeUserInfo && storeUserInfo.store_user_no) {
					uni.navigateTo({
						url: `/personalPages/chat/chat?type=机构用户客服&identity=客户&storeNo=${this.storeNo}&store_user_no=${storeUserInfo.store_user_no}`
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
						add_store_no: this.userInfo.add_store_no === this.storeNo ? '' : this.storeNo
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
					content: `请确认是否${this.userInfo.add_store_no === this.storeNo ?"取消":""}将此${this.storeInfo.type}设置为首页`,
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
		onPullDownRefresh() {
			this.toAddPage().then(res => {
				if (this.store_no) {
					this.selectUserList()
					this.selectStoreInfo();
					this.selectDepartList();
					this.seletGroupList();
				}
			})
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
		async onLoad(option) {
			this.queryOption = option
			// #ifdef MP-WEIXIN
			wx.showShareMenu({
				withShareTicket: true,
				menus: ['shareAppMessage', 'shareTimeline']
			});
			// #endif
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
			if (option.store_no) {
				this.storeNo = option.store_no;
				this.selectUserList()
				this.selectStoreInfo();
				this.selectDepartList();
				this.seletGroupList();
			}
			// });
		}
	};
</script>

<style scoped lang="scss">
	.page-wrap {
		&.onlyCurrentPage {
			height: calc(100vh - var(--window-top) - 50px);
			overflow: scroll;
		}
	}

	.header-wrap {
		background-size: cover;
		background-position: top center;
		background-repeat: no-repeat;

		.hospital-top {
			background-color: #fff;
			padding: 30rpx 28rpx;
			display: flex;
			margin-bottom: 20rpx;
			position: relative;
			padding-top: 40rpx;
			flex-wrap: wrap;

			.instroduce {
				width: 100%;
				margin-top: 10px;
				background-color: #f8f8f8;
				border-radius: 10rpx;
				padding: 20rpx;
			}

			.home-btn {
				font-weight: bold;
				text-align: center;
				position: absolute;
				height: 30px;
				top: -30px;
				left: 0px;
			}

			.logo {
				width: 120rpx;
				height: 120rpx;
				border-radius: 20rpx;
				margin-right: 20rpx;
				font-size: 60rpx;
				font-weight: bold;
				line-height: 100rpx;
				text-align: center;
				position: absolute;
				top: -80rpx;
				right: 0;
				border: 4rpx solid #fff;
			}

			.left {
				display: flex;
				flex-direction: column;
				flex: 1;
				position: relative;
				top: -20rpx;

				&::after {
					position: absolute;
					right: 0;
					top: 10%;
					height: 80%;
					content: '';
					width: 1px;
					background-color: #f1f1f1;
				}

				.top {
					display: flex;
					justify-content: space-between;
					padding-right: 20rpx;

					.name {
						font-size: 32rpx;
						color: #333;
						font-weight: bold;
						flex: 1;
					}

					.tags {
						display: flex;

						.tag {
							display: inline-block;
							margin-left: 10rpx;
							padding: 5rpx 10rpx;
							background-color: #0ea8ff;
							color: #fff;
							border-radius: 10rpx;
						}
					}
				}

				.bottom {
					padding-top: 10rpx;
					color: #aaa;

					.address {
						width: 100%;
						display: flex;
						align-items: center;

						.content {
							flex: 1;
							max-width: 400rpx;
							overflow: hidden;
							text-overflow: ellipsis;
							// white-space: nowrap;
						}
					}
				}
			}

			.right {
				margin-left: 20rpx;
				// width: 100rpx;
				display: flex;
				justify-content: center;
				align-items: center;

				// transform: rotate(10deg);
				.right-item {
					display: flex;
					flex-direction: column;
					align-items: center;
					font-size: 12px;
				}

				.image {
					width: 40px;
					height: 40px;
					padding: 5px;
				}
			}
		}

		.menu-list {
			display: flex;
			flex-wrap: wrap;
			background-color: #fff;
			margin-bottom: 20rpx;
			padding: 20rpx;

			.menu-item {
				width: calc(25% - 15px/4);
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				background-color: #f3f3f3;
				border-radius: 5px;
				margin-left: 5px;
				padding: 30rpx 20rpx;
				margin-bottom: 10px;

				&:nth-child(4n+1) {
					margin-left: 0;
				}

				.icon {
					width: 30px;
					height: 30px;
					font-size: 30px;
					text-align: center;
					line-height: 100rpx;
				}

				.title,
				.label {
					margin-top: 30rpx;
					font-size: 14px;
				}
			}
		}

		.introduction {
			// 简介
			background-color: #fff;
			padding: 20rpx;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			margin-bottom: 20rpx;

			.title {
				font-size: 28rpx;
				font-weight: 700;
				padding: 10rpx 0;
				color: rgb(48, 49, 51);
			}

			.news-list {
				.news-item {
					display: flex;
					padding: 20rpx 0;
					border-bottom: 1rpx solid #f1f1f1;
					align-items: center;

					.title-text {
						width: 70%;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}

					.content-box {
						flex: 1;
						display: flex;
						flex-direction: column;
					}

					.date {
						color: #ccc;
					}

					&.none-image {
						// 无图
						flex-direction: column;
						align-items: flex-start;

						.title-text {
							font-size: 16px;
							width: 100%;
							white-space: normal;
							margin-bottom: 10px;
						}

						.date {
							font-size: 12px;
						}
					}

					&.layout-right-image,
					&.layout-left-image {
						// 左图
						flex-direction: row;
						flex-wrap: wrap;

						.content-box {
							min-height: 150rpx;
						}

						.image-icon {
							width: 200rpx;
							height: 150rpx;
							border-radius: 5px;
						}

						.title-text {
							margin-left: 20rpx;
							width: calc(100% - 250rpx);
							flex: 1;
						}

						.date {
							margin-left: 20rpx;
						}
					}

					&.layout-right-image {
						// 右图
						flex-direction: row-reverse;

						.title-text {
							margin-left: 0;
							width: calc(100% - 250rpx);
							flex: 1;
						}

						.date {
							margin-left: 0;
						}
					}
				}
			}

			.content {
				padding: 0 10px;

				.rich-text {
					min-height: 100rpx;
					overflow: scroll;
					transition: all 0.2s linear;

					.see-more {
						background: linear-gradient(rgba(255, 255, 255, 0.5), #fff);
						color: #888;
						text-align: center;
						position: relative;
						top: -10px;
						z-index: 2;
					}
				}

				.group-box {
					width: 100%;

					.group-item {
						width: 25%;
						display: flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;

						.image {
							width: 100rpx;
							height: 100rpx;
							font-size: 40px;
							text-align: center;
							border-radius: 10rpx;
							background-color: #f1f1f1;
							margin-bottom: 10rpx;
						}

						.label {
							color: #888;
						}
					}
				}

				.depart-box {
					width: 100%;
					text-align: left;

					.depart-item {
						text-indent: 0;
						border-radius: 10rpx;
					}
				}

				.professor-box {
					display: flex;
					flex-direction: column;

					.professor-item {
						padding: 10rpx 0;
						margin: 10rpx;
						display: flex;
						align-items: center;

						.img {
							width: 100rpx;
							height: 100rpx;
							border-radius: 10rpx;
							margin-right: 20rpx;
						}

						.doc-info {
							display: flex;
							flex-direction: column;
							flex: 1;

							.top {
								display: flex;

								.doc-name {
									font-size: 34rpx;
									letter-spacing: 5rpx;
								}

								.titleDn {
									font-size: 28rpx;
									margin-left: 30rpx;
									display: flex;
									align-items: flex-end;
									color: #999;
								}
							}

							.center {
								.depart-name {
									font-size: 26rpx;
									color: #5e5e5e;
									padding: 2px 0;
								}
							}

							.bottom {
								// max-height: 100rpx;
								overflow: hidden;
								text-overflow: -o-ellipsis-lastline;
								overflow: hidden;
								text-overflow: ellipsis;
								display: -webkit-box;
								-webkit-line-clamp: 2;
								-webkit-box-orient: vertical;
								color: #afafaf;
								font-size: 24rpx;
							}
						}
					}
				}
			}
		}
	}

	.bottom-layer {
		position: fixed;
		bottom: 0;
		width: 100vw;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 0 20rpx;
		z-index: 2;
		background-color: #fff;
		box-shadow: 0 5px 20px 10px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);

		.bottom-button {
			flex: 1;
			text-align: center;
			position: relative;

			&+.bottom-button {
				border-left: 1px solid #f1f1f1;
			}

			&:active {
				background-color: #f1f1f1;
			}

			.badge {
				position: absolute;
				left: 10px;
				top: 0;
				border-radius: 50%;
				width: 20px;
				height: 20px;
			}

			.icon {
				font-size: 25px;
			}
		}
	}
</style>
