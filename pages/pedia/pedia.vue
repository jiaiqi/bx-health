<template>
	<view
		class="page-wrap"
		:style="{
			'--global-text-font-size': globalTextFontSize + 'px',
			'--global-label-font-size': globalLabelFontSize + 'px'
		}"
	>
		<!-- <view class="status_bar"> -->
		<!-- 这里是状态栏 -->
		<!-- </view> -->
		<view
			class="page-item"
			v-for="(pageItem, index) in pageItemList"
			:class="{
				'swiper-view': pageItem.div_type === 'carousel',
				'menu-view': pageItem.div_type === 'buttons',
				'tab-list-view': pageItem.div_type === 'tablist'
			}"
			:key="index"
		>
			<view class="page-slide">
				<swiper
					class="screen-swiper item-box round-dot"
					:height="300"
					:indicator-dots="true"
					:circular="true"
					:autoplay="true"
					interval="5000"
					duration="500"
					v-if="pageItem.div_type === 'carousel'"
				>
					<swiper-item v-for="(item, index) in pageItem.carousel" :key="index"><image :src="item.picUrl" mode="scaleToFill"></image></swiper-item>
				</swiper>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="official-account" v-if="!subscsribeStatus && index === 0">
				<!-- #ifdef  MP-WEIXIN -->
				<official-account></official-account>
				<!-- #endif -->
				<view class="text text-yellow" @click="openOfficialImage">
					<text class="cuIcon-noticefill  margin-right-xs"></text>
					关注百想助理公众号，健康通知不错过
				</view>
			</view>
			<!-- #endif -->
			<view class="page-menu" v-if="pageItem.div_type === 'buttons'">
				<view class="title">{{ pageItem.item_name }}</view>
				<view
					class="item-box"
					:class="{ 'low-height': pageItem.buttons && pageItem.buttons.length > 0 && pageItem.buttons[0].buttons && pageItem.buttons[0].buttons.length <= 4 }"
					v-if="(pageItem.buttons && pageItem.buttons.length === 1) || !pageItem.buttons || pageItem.buttons.length === 0"
				>
					<view class="swiper-item" v-for="(swiperItem, swiperIndex) in pageItem.buttons" :key="swiperIndex">
						<view @click="skip(btn)" class="swiper-button" v-for="btn in swiperItem.buttons" :key="btn.button_no">
							<image class="image" :src="getMenuImagePath(btn)"></image>
							<text class="btn-name">{{ btn.dest_menu_no }}</text>
						</view>
					</view>
				</view>
				<swiper class="swiper item-box" :indicator-dots="true" :autoplay="false" :interval="3000" :duration="500" v-if="pageItem.buttons && pageItem.buttons.length > 1">
					<swiper-item v-for="(swiperItem, swiperIndex) in pageItem.buttons" :key="swiperIndex">
						<view class="swiper-item">
							<view @click="skip(btn)" class="swiper-button" v-for="btn in swiperItem.buttons" :key="btn.button_no">
								<image class="image" height="60rpx" :src="getMenuImagePath(btn)"></image>
								<text class="btn-name">{{ btn.dest_menu_no }}</text>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="page-article" v-if="pageItem.div_type === 'tablist' && pageItem.tablist">
				<view class="title">{{ pageItem.item_name }}</view>
				<article-list :config="pageItem"></article-list>
			</view>
		</view>

		<button class="contact-button" @click="toFeedBack"><text class="cuIcon-servicefill text-blue icon"></text></button>
		<view class="cu-modal" :class="modalName === 'feedback' ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">请选择跳转页面</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="padding-xl button-box">
					<button class="cu-btn bg-blue" open-type="contact">客服</button>
					<button class="cu-btn bg-green" @click="toPages('feedback')">意见反馈</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import ArticleList from './article-list.vue';
export default {
	// 通用站点首页
	components: {
		ArticleList
	},
	data() {
		return {
			pageItemList: [], // 页面项
			code: '', // 微信登录用
			modalName: '',
			isAuthUserInfo: false
		};
	},
	computed: {
		...mapState({
			authUserInfo: state => state.app.authUserInfo,
			subscsribeStatus: state => state.app.subscsribeStatus,
			loginUserInfo: state => state.user.loginUserInfo,
			userInfo: state => state.user.userInfo,
			globalTextFontSize: state => state.app['globalTextFontSize'],
			globalLabelFontSize: state => state.app.globalLabelFontSize
		})
	},
	methods: {
		async getStoreUserInfo() {
			let url = this.getServiceUrl('health', 'srvhealth_store_user_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_user_select',
				colNames: ['*'],
				condition: [{ colName: 'person_no', ruleType: 'eq', value: this.userInfo.no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.$store.commit('SET_STORE_LIST', res.data.data);
				if (res.data.data.length > 1) {
					// 多个店铺 跳转到店铺列表
				} else {
					// 只有一个店铺 跳转到店铺详情页
					this.$store.commit('SET_HOSPITAL_INFO', res.data.data[0]);
					if (['大夫', '管理员', '工作人员', '药房人员', '客服'].includes(res.data.data[0].user_role.split(','))) {
						// 不是用户 跳转到商铺管理页面
						uni.navigateTo({
							url: '/pediaPages/hospitalOverview/hospitalOverview?store_no=' + res.data.data[0].store_no
						});
					} else {
						uni.navigateTo({
							url: '/pediaPages/hospitalOverview/hospitalOverview?store_no=' + res.data.data[0].store_no
						});
					}
				}
				return this.storeUserInfo;
			}
		},
		toFeedBack() {
			// 跳转到反馈页面
			this.modalName = 'feedback';
		},
		toPages(type) {
			if (type === 'feedback') {
				let fieldsCond = [
					// { column: 'info_no', value: this.vuex_userInfo.no, condition: [{ colName: 'no', ruleType: 'eq', value: this.vuex_userInfo.no }] },
					// { column: 'user_account', value: this.vuex_userInfo.userno }
				];
				let url = '/publicPages/newForm/newForm?serviceName=srvhealth_suggest_record_add&type=add&fieldsCond=' + encodeURIComponent(JSON.stringify(fieldsCond));
				uni.navigateTo({
					url: url
				});
			}
		},
		hideModal() {
			this.modalName = '';
		},
		isDoctor() {
			// 查询当前用户是否是医生
			let url = this.getServiceUrl('daq', 'srvdaq_website_page_item_select', 'select');
			let req = {
				serviceName: 'srvdaq_website_page_item_select',
				colNames: ['*'],
				condition: [{ colName: 'page_no', ruleType: 'eq', value: 'BX202004280847490008' }],
				page: null
			};
		},
		skip(item) {
			let dest_page = '';
			let self = this;
			if (item.dest_page && item.dest_page.indexOf('/pages/specific/health') !== -1) {
				let index = item.dest_page.indexOf('/pages/specific/health');
				dest_page = '/otherPages' + item.dest_page.slice(22);
				console.log(item.dest_page);
			}
			if (dest_page && typeof dest_page === 'string' && dest_page.indexOf('/pages/') !== -1) {
				uni.switchTab({
					url: dest_page
				});
			} else {
				uni.navigateTo({
					url: item.dest_page,
					fail(err) {
						if (err.errMsg && err.errMsg.indexOf('is not found') !== -1) {
							// 通过webview展示h5页面
							if (item.dest_page.indexOf(self.$api.frontEndAddress) !== -1) {
								uni.navigateTo({
									url: '/publicPages/webviewPage/webviewPage?webUrl=' + item.dest_page
								});
							} else {
								uni.navigateTo({
									url: '/publicPages/webviewPage/webviewPage?webUrl=' + encodeURIComponent(self.$api.frontEndAddress + item.dest_page)
								});
							}
						}
					}
				});
			}
		},
		getMenuImagePath(btn) {
			return this.$api.backEndAddress + '/main/images/appicon/' + btn.icon;
		},
		async getPageConfig() {
			let url = this.getServiceUrl('daq', 'srvdaq_website_cfg_select', 'select');
			let req = {
				serviceName: 'srvdaq_website_cfg_select',
				colNames: ['*'],
				condition: [{ colName: 'website_no', ruleType: 'eq', value: 'WS2020042808470005' }]
			};
			let res = await this.$http.post(url, req);
			if (this.requestSuccess(res)) {
				if (res.data.data.length > 0) {
					let result = res.data.data[0];
					if (result.more_config && typeof result.more_config === 'string') {
						try {
							result.more_config = JSON.parse(result.more_config);
							if (result.more_config.globalLabelFontSize) {
								this.$store.commit('SET_GLOBAL_LABEL_SIZE', result.more_config.globalLabelFontSize);
							}
							if (result.more_config.globalTextFontSize) {
								this.$store.commit('SET_GLOBAL_TEXT_SIZE', result.more_config.globalTextFontSize);
							}
						} catch (e) {
							//TODO handle the exception
						}
					}
				}
			}
		},
		async getPageItem() {
			// 查找页面项
			let url = this.getServiceUrl('daq', 'srvdaq_website_page_item_select', 'select');
			let req = {
				serviceName: 'srvdaq_website_page_item_select',
				colNames: ['*'],
				condition: [{ colName: 'page_no', ruleType: 'eq', value: 'BX202004280847490008' }]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				this.pageItemList.length = [];
				for (let index in res.data.data) {
					let result = await this.getItemDetail(res.data.data[index]);
					switch (res.data.data[index].div_type) {
						case 'buttons':
							let swiperList = [];
							result = result.filter(item => item.display !== '隐藏');
							let length = Math.ceil(result.length / 8); //向上取整
							if (length > 0) {
								for (var i = 0; i < length; i++) {
									swiperList.push({
										index: i,
										buttons: result.slice(i * 8, (i + 1) * 8)
									});
								}
							}
							res.data.data[index]['buttons'] = swiperList;
							break;
						case 'carousel':
							res.data.data[index]['carousel'] = result;
							break;
						case 'tablist':
							res.data.data[index]['tablist'] = result;
							break;
					}
					if (res.data.data[index].disp_flag !== '否') {
						this.pageItemList.push(res.data.data[index]);
					}
				}
				return res.data.data;
			}
		},
		async getItemDetail(item) {
			// 获取页面项详情
			let serviceName = '';
			switch (item.div_type) {
				case 'buttons':
					serviceName = 'srvdaq_page_item_buttons_select';
					break;
				case 'carousel':
					serviceName = 'srvdaq_page_item_carousel_select';
					break;
				case 'tablist':
					serviceName = 'srvdaq_page_item_tablist_select';
					break;
			}
			if (serviceName && item.item_no) {
				let url = this.getServiceUrl('daq', serviceName, 'select');
				let req = {
					serviceName: serviceName,
					colNames: ['*'],
					condition: [{ colName: 'item_no', ruleType: 'in', value: item.item_no }],
					order: [{ colName: 'seq', orderType: 'asc' }]
				};
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					let itemList = res.data.data.map((pageitem, index) => {
						switch (item.div_type) {
							case 'carousel':
								pageitem['picUrl'] = this.$api.downloadFile + pageitem.carousel_image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
								break;
							case 'buttons':
								break;
							case 'tablist':
								break;
						}
						return pageitem;
					});
					return itemList;
				}
			}
		},
		openOfficialImage() {
			uni.navigateTo({
				url: '/publicPages/webviewPage/webviewPage?webUrl=' + encodeURIComponent('https://mp.weixin.qq.com/s/Z9o7ZJOtrAsR2Sj7PIIgRQ')
			});
		}
	},
	created() {
		this.toAddPage().then(res => {
			if (res) {
				this.getPageItem();
			}
		});
	},
	onShow(option) {
		// #ifdef MP-WEIXIN
		if (!this.authUserInfo || typeof this.authUserInfo === 'object') {
			debugger;
			this.$store.commit('SET_CURRENT_PAGE', 'publicPages/accountExec/accountExec');
			let pageStack = getCurrentPages();
			if (Array.isArray(pageStack) && pageStack.length >= 1) {
				let currentPage = pageStack[pageStack.length - 1];
				this.$store.commit('SET_PRE_PAGE_URL', currentPage.$page.fullPath);
			}
			uni.reLaunch({
				url: '/publicPages/accountExec/accountExec'
			});
		}
		// #endif
	},
	onShareAppMessage() {
		let path = '';
		let title = '百想健康';
		if (this.userInfo && this.userInfo.no) {
			path = `/pages/pedia/pedia?from=share&invite_user_no=${this.userInfo.userno}`;
			title = `${this.userInfo.name}邀请你体验【百想健康】小程序`;
		} else if (this.loginUserInfo && this.loginUserInfo.user_no) {
			path = `/pages/pedia/pedia?from=share&invite_user_no=${this.loginUserInfo.user_no}`;
		}
		this.saveSharerInfo(this.userInfo, path);
		return {
			title: title,
			path: path
		};
	},
	onLoad(option) {
		this.checkOptionParams(option);
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
.page-wrap {
	width: 100vw;
	padding: 20rpx;
	box-sizing: border-box;
	background-color: #fff;
	min-height: 100vh;
	font-size: var(--global-label-font-size);
	.status_bar {
		height: var(--status-bar-height);
		width: 100%;
	}
	.page-item {
		background-color: #fff;
		margin-bottom: 10rpx;
		.item-box {
			border-radius: 10rpx;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
			min-height: 100rpx;
		}
		.page-menu {
			width: 100%;
			display: flex;
			flex-direction: column;
			padding: 10rpx 0;
			min-height: 100rpx;
			.swiper {
				height: 360rpx;
				::v-deep.uni-swiper-dot {
					transition: all 0.5s;
				}
				::v-deep.uni-swiper-dot-active {
					width: 35rpx;
					border-radius: 10rpx;
					height: 15rpx;
				}
			}
			.low-height {
				min-height: 160rpx;
			}
			.swiper-item {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				// padding: 0 calc((100% - 680rpx) / 2);
				.image {
					width: 60rpx;
					height: 60rpx;
				}
				.swiper-button {
					width: calc(25% - 20rpx);
					// width: 150rpx;
					height: 150rpx;
					display: inline-flex;
					justify-content: center;
					align-items: center;
					flex-direction: column;
					border-radius: 8rpx;
					margin: 10rpx;
					.btn-name {
						padding: 10rpx 0;
						overflow: hidden;
						white-space: nowrap;
						text-overflow: ellipsis;
					}
				}
			}
		}
		.title {
			font-size: 18px;
			font-weight: 700;
			margin-bottom: 10rpx;
		}
	}
}
.contact-button {
	position: fixed;
	bottom: 70rpx;
	right: 50rpx;
	border-radius: 100%;
	width: 100rpx;
	height: 100rpx;
	display: flex;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	overflow: hidden;
	background-color: #fff;
	border: none;
	justify-content: center;
	align-items: center;
	padding: 0;
	font-size: 24rpx;
	.icon {
		font-size: 70rpx;
	}
}
.button-box {
	display: flex;
	justify-content: space-around;
	.cu-btn {
		width: 45%;
	}
}
.official-account {
	margin: 20rpx 0;
	border-radius: 10rpx;
	overflow: hidden;
	background-color: #fff;
	padding: 10rpx 0;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	padding-left: 20rpx;
	.text {
		display: flex;
		align-items: center;
		font-size: 24rpx;
	}
}
</style>
