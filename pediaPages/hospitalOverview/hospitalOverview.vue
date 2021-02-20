<template>
	<!-- 简介、导航、科室列表、名医介绍、就诊通知、在线预约挂号链接 -->
	<view class="page-wrap" :class="{'onlyCurrentPage':onlyCurrentPage}">
		<view class="page-content">
			<view class="header-wrap" v-if="storeInfo && storeInfo.id" :style="{ 'background-image': 'url(' + getImagePath(storeInfo.image) + ')' }">
				<view class="hospital-top">
					<view class="left"  @click="getCurrentLocation">
						<view class="top">
							<view class="name">{{ storeInfo.name }}</view>
						</view>
						<view class="bottom">
							<view class="address">
								<text class="content">{{ storeInfo.address }}</text>
								<text class="cuIcon-locationfill text-blue margin-left-xs"></text>
							</view>
						</view>
					</view>
					<view class="right"><text class="cuIcon-phone text-black" @click="makePhoneCall"></text></view>
				</view>
				<view class="introduction">
					<view class="title">
						<text class="cuIcon-titles text-blue"></text>
						{{ storeInfo.name || '' }}
					</view>
					<view class="content">
						<view class="rich-text">
							{{ introduction || '暂无介绍' }}
							<view class="see-more" v-if="introduction !== storeInfo.introduction&&introduction" @click="seeMore">查看更多</view>
						</view>
					</view>
				</view>
				<view class="introduction news">
					<view class="title">
						<text class="cuIcon-titles text-blue"></text>
						<text class="">通知公告</text>
					</view>
					<view class="content news-list">
						<view class="news-item" v-for="item in noticeList" @click="toArticle(item)">
							<text class="cuIcon-mail text-orange margin-right-xs"></text>
							<text class="title-text">{{ item.title }}</text>
							<text class="date">{{ formateDate(item.create_time) }}</text>
						</view>
					</view>
				</view>
				<view class="introduction">
					<view class="title">
						<view>
							<text class="cuIcon-titles text-blue"></text>
							科室列表
						</view>
					</view>
					<view class="content">
						<view class="depart-box">
							<button class="depart-item cu-btn bg-blue sm margin-right-xs" v-for="item in deptList" @click="toDeptDetail(item)">{{ item.dept_name }}</button>
						</view>
					</view>
				</view>
				<view class="introduction">
					<view class="title">
						<view>
							<text class="cuIcon-titles text-blue"></text>
							关联圈子
						</view>
					</view>
					<view class="content">
						<view class="group-box">
							<view class="group-item" v-for="item in groupList" @click="toGroup(item)">
								<image class="image" :src="getImagePath(item.icon)" mode="aspectFit" v-if="item.icon"></image>
								<text class=" image cuIcon-group_fill text-grey" v-else></text>
								<view class="label">{{ item.name }}</view>
							</view>
						</view>
					</view>
				</view>
				<view class="introduction">
					<view class="title"><view class="">专家团队</view></view>
					<view class="content">
						<view class="professor-box">
							<view class="professor-item" v-for="item in staffList" @click="toDocotrDetail(item)">
								<image class="img" :src="getImagePath(item.profile_url) ? getImagePath(item.profile_url) : '../static/img/doctor_default.jpg'" mode="aspectFit"></image>
								<view class="doc-info">
									<view class="top">
										<text class="doc-name">{{ item.person_name ? item.person_name : item.nick_name || '' }}</text>
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
				<view class="introduction news">
					<view class="title">
						<text class="cuIcon-titles text-blue"></text>
						<text class="">医院新闻</text>
					</view>
					<view class="content news-list">
						<view class="news-item">
							<text class="cuIcon-title"></text>
							<text class="title-text">关于维护良好就医秩序对广大患者的告知书</text>
							<text class="date">2021-01-20</text>
						</view>
						<view class="news-item">
							<text class="cuIcon-title"></text>
							<text class="title-text">国家药监局核查中心对我院药物临床试验数据现场核查工作顺利结束</text>
							<text class="date">2021-01-19</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="bottom-layer" v-if="onlyCurrentPage === true"><button class="cu-btn bg-black" @click="toStorePage">体验完整小程序</button></view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import hospitalData from '../static/data/hospital1.js';
export default {
	data() {
		return {
			storeNo: '',
			fullIntro:false,
			storeInfo: {},
			staffList: [], //工作人员
			deptList: [], //科室
			groupList: [], // 关联圈子
			noticeList: [],
			hospitalData: {},
			hospitalInfo: {
				name: '西安交通大学第一附属医院',
				tag: ['三甲'],
				posititon: {
					address: '', //详细地址
					longitude: '', //经度
					latitude: '' // 纬度
				}
			}
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
			inviterInfo: state => state.app.inviterInfo
		}),
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
			if (!this.fullIntro&&this.storeInfo && this.storeInfo.introduction && this.storeInfo.introduction.length > 80) {
				return this.storeInfo.introduction.slice(0, 80) + '...';
			} else {
				return this.storeInfo.introduction;
			}
		}
	},
	methods: {
		seeMore(){
			this.fullIntro = true
		},
		toStorePage() {
			uni.switchTab({
				url: '/pages/store/store'
			});
		},
		async selectPersonInGroup(group_no) {
			// 查找当前登录用户有没有在此圈子用户列表中
			let req = {
				condition: [{ colName: 'store_no', ruleType: 'eq', value: this.storeNo }]
			};
			let res = await this.$fetch('select', 'srvhealth_person_group_circle_select', req, 'health');
			if (Array.isArray(res.data)) {
				this.groupList = res.data;
			}
		},
		toArticle(e) {
			if (e.content_no) {
				uni.navigateTo({
					url: '/publicPages/article/article?serviceName=srvdaq_cms_content_select&content_no=' + e.content_no
				});
			}
		},
		getNotice() {
			let req = {
				condition: [{ colName: 'website_no', ruleType: 'eq', value: this.storeInfo.website_no }]
			};
			this.$fetch('select', 'srvdaq_cms_category_select', req, 'daq').then(res => {
				if (res.success && res.data.length > 0) {
					let data = res.data[0];
					let req = {
						condition: [{ colName: 'no', ruleType: 'eq', value: data.no }]
					};
					this.$fetch('select', 'srvdaq_cms_content_select', req, 'daq').then(res => {
						if (res.success) {
							this.noticeList = res.data;
						}
					});
				}
			});
		},
		async toGroup(e) {
			// let res = await this.selectPersonInGroup(e.gc_no)
			uni.navigateTo({
				// url: `/publicPages/chat/chat?no=${this.userInfo.no}&group_no=${e.gc_no}`
				// url:`/personalPages/myDoctor/doctorChat?no=${this.userInfo.no}&groupInfo=${encodeURIComponent(JSON.stringify(e))}`,
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
				url: '/personalPages/DoctorDetail/DoctorDetail?doctor_no=' + e.person_no + '&store_no=' + e.store_no
			});
		},
		seletGroupList() {
			let req = {
				condition: [{ colName: 'store_no', ruleType: 'eq', value: this.storeNo }]
			};
			this.$fetch('select', 'srvhealth_group_circle_select', req, 'health').then(res => {
				if (Array.isArray(res.data)) {
					this.groupList = res.data;
				}
			});
		},
		selectDepartList() {
			let req = {
				condition: [{ colName: 'store_no', ruleType: 'eq', value: this.storeNo }]
			};
			this.$fetch('select', 'srvhealth_store_dept_select', req, 'health').then(res => {
				if (Array.isArray(res.data)) {
					this.deptList = res.data;
				}
			});
		},
		selectStoreInfo() {
			let url = this.getServiceUrl('health', 'srvhealth_store_mgmt_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_mgmt_select',
				colNames: ['*'],
				condition: [{ colName: 'store_no', ruleType: 'eq', value: this.storeNo }],
				page: { pageNo: 1, rownumber: 1 },
				draft: false,
				query_source: 'list_page'
			};
			return new Promise((resolve, reject) => {
				this.$http.post(url, req).then(res => {
					if (Array.isArray(res.data.data) && res.data.data.length > 0) {
						this.storeInfo = res.data.data[0];
						uni.setNavigationBarTitle({
							title:this.storeInfo.name
						})
						this.getNotice();
						resolve(res.data.data[0]);
					} else {
						reject(res);
					}
				});
			});
		},
		selectStaffList() {
			let url = this.getServiceUrl('health', 'srvhealth_store_user_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_user_select',
				colNames: ['*'],
				condition: [{ colName: 'store_no', ruleType: 'eq', value: this.storeNo }, { colName: 'user_role', value: '大夫', ruleType: 'like' }],
				page: { pageNo: 1, rownumber: 10 },
				draft: false,
				query_source: 'list_page'
			};
			this.$http.post(url, req).then(res => {
				if (Array.isArray(res.data.data)) {
					this.staffList = res.data.data;
				}
			});
		},
		makePhoneCall() {
			uni.makePhoneCall({
				phoneNumber: this.storeInfo.telephone ? this.storeInfo.telephone : '10086'
			});
		},
		getCurrentLocation() {
			let latitude = 34.219329;
			let longitude = 108.935485;
			uni.openLocation({
				latitude: this.storeInfo.latitude ? this.storeInfo.latitude : latitude,
				longitude: this.storeInfo.longitude ? this.storeInfo.longitude : longitude,
				name: this.storeInfo.name,
				address: this.storeInfo.address,
				success: function() {
					console.log('success');
				}
			});
		},
		async getStoreUserInfo(no) {
			let url = this.getServiceUrl('health', 'srvhealth_store_user_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_user_select',
				colNames: ['*'],
				condition: [{ colName: 'person_no', ruleType: 'eq', value: this.userInfo.no }, { colName: 'store_no', ruleType: 'eq', value: no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				return res.data.data;
			}
		},
		async addToStore(store_no, invite_user_no) {
			// 添加用户到单位
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_store_user_add', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_store_user_add',
					condition: [],
					data: [
						{
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
							user_role: '用户'
						}
					]
				}
			];
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
	onShareAppMessage() {
		let path = `/pediaPages/hospitalOverview/hospitalOverview?store_no=${this.storeInfo.store_no}&from=share&invite_user_no=${this.userInfo.userno}&&doctor_no=${
			this.userInfo.no
		}&share_type=bindOrganization`;
		let title = `${this.userInfo.name}邀请您加入【${this.storeInfo.name}】`;
		let imageUrl = this.getImagePath(this.storeInfo.image);
		this.saveSharerInfo(this.userInfo, path);
		return {
			imageUrl: imageUrl,
			title: title,
			path: path
		};
	},
	async onLoad(option) {
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// #endif
		this.checkOptionParams(option);
		this.toAddPage().then(res => {
			if (res === 'fail') {
				return;
			}
			// if (!this.userInfo || !this.userInfo.no) {
			// 	return;
			// }
			if (option.share_type === 'bindOrganization') {
				// 绑定诊所
				if (option.store_no && option.invite_user_no) {
					// 查找店铺用户列表
					this.storeNo = option.store_no;
					this.selectStoreInfo().then(res => {
						this.getStoreUserInfo(option.store_no).then(res => {
							if (Array.isArray(res) && res.length >= 1) {
								// 店铺用户列表中已存在此用户
							} else {
								// 当前用户不在此诊所中 则添加当前用户到此诊所中
								this.addToStore(option.store_no, option.invite_user_no);
							}
						});
					});
					this.selectStaffList();
					this.selectDepartList();
					this.seletGroupList();
				}
			} else {
				if (option.store_no) {
					this.storeNo = option.store_no;
					this.selectStoreInfo();
					this.selectStaffList();
					this.selectDepartList();
					this.seletGroupList();
				}
			}
		});
	}
};
</script>

<style scoped lang="scss">
.page-wrap{
		&.onlyCurrentPage{
			height: calc(100vh - var(--window-top) - 50px);
			background-color:#000;
			overflow: hidden;
			.page-content{
				min-height: calc(100vh - var(--window-top) - 50px);
				background-color: #f1f1f1;
				overflow: scroll;
				border-radius: 0 0 20px 20px ;
			}
		}
}
.header-wrap {
	height: 500rpx;
	background-size: cover;
	background-position: top center;
	background-repeat: no-repeat;
	padding: 300rpx 0rpx 0;
	.hospital-top {
		border-radius: 20rpx;
		background-color: #fff;
		padding: 30rpx 28rpx;
		box-shadow: 0 3px 3px rgba(5, 34, 75, 0.18);
		display: flex;
		margin: 0 20rpx 20rpx;
		.left {
			display: flex;
			flex-direction: column;
			flex: 1;
			position: relative;
			&::after {
				position: absolute;
				right: 0;
				top: 10%;
				height: 80%;
				content: '';
				width: 1px;
				background-color: #dfdada;
			}
			.top {
				display: flex;
				.name {
					font-size: 32rpx;
					color: #333;
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
				.address {
					color: #bbb;
					width: 100%;
					display: flex;
					.content {
						width: calc(100% - 60rpx);
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
					}
				}
			}
		}
		.right {
			margin-left: 20rpx;
			width: 100rpx;
			font-size: 70rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #0ea8ff;
			// transform: rotate(10deg);
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
				border-bottom: 1rpx dotted #f1f1f1;
				align-items: center;

				.title-text {
					width: 70%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.date {
					flex: 1;
					text-align: right;
					color: #ccc;
				}
			}
		}
		.content {
			padding: 0 10px;
			.rich-text {
				min-height: 100rpx;
				overflow: scroll;
				transition: all .2s linear;
				.see-more{
					background: linear-gradient(rgba(255,255,255,0.5),#fff);
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
	background-color:#000;
	padding:0 20rpx;
	z-index: 2;
}
</style>
