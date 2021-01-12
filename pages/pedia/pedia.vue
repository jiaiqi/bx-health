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
			<view class="page-list" v-if="pageItem.div_type === 'tablist'"></view>
		</view>
		<!-- #ifdef MP-WEIXIN -->
		<!-- <view class="cu-modal" :class="{ show: modalName==='showOfficialAccount' }" @click="hideModal"> -->
		<!-- <view class="cu-dialog" @click.stop=""> -->
		<official-account></official-account>
		<!-- </view> -->
		<!-- </view> -->
		<!-- #endif -->
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	// 通用站点首页
	data() {
		return {
			pageItemList: [], // 页面项
			code: '', // 微信登录用
			modalName: 'showOfficialAccount'
		};
	},
	computed: {
		...mapState({
			loginUserInfo: state => state.user.loginUserInfo,
			userInfo: state => state.user.userInfo,
			globalTextFontSize: state => state.app['globalTextFontSize'],
			globalLabelFontSize: state => state.app.globalLabelFontSize
		})
	},
	methods: {
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
				// return res.data.data;
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
		async initPage() {
			let self = this;
			let userInfo = uni.getStorageSync('login_user_info');
			// #ifdef MP-WEIXIN
			let res = await wx.getSetting();
			if (!res.authSetting['scope.userInfo']) {
				// 没有获取用户信息授权
				this.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: false });
				return;
			} else {
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
						console.log(self.wxUserInfo);
						console.log(self.userInfo);
						if (self.userInfo && self.userInfo.no && !self.userInfo.profile_url) {
							self.updateUserProfile(rawData.headimgurl, self.userInfo.no);
						}
					}
				});
				this.isAuthUserInfo = true;
				this.$store.commit('SET_AUTH_SETTING', { type: 'userInfo', value: true });
			}
			// #endif
			if (!userInfo) {
				// 未登录 h5跳转到登录页,小程序端进行静默登录
				// #ifdef MP-WEIXIN
				const result = await wx.login();
				if (result.code) {
					this.code = result.code;
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
			if (userInfo && userInfo.user_no) {
				// this.loginUserInfo = userInfo;
				this.$store.commit('SET_LOGIN_USER', userInfo);
				await this.selectUserList(userInfo);
			}
		},
		// 查找当前帐号建立的用户列表
		async selectUserList(userInfo) {
			let self = this;
			const url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'userno', ruleType: 'eq', value: userInfo.user_no }],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			const res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				// 有数据
				if (uni.getStorageSync('current_user')) {
					res.data.data.forEach(item => {
						if (item.name === uni.getStorageSync('current_user')) {
							uni.setStorageSync('current_user', item.name);
							this.$store.commit('SET_USERINFO', item);
						}
					});
				} else {
					uni.setStorageSync('current_user_info', res.data.data[0]);
					uni.setStorageSync('current_user', res.data.data[0].name);
				}
				this.$store.commit('SET_USERLIST', res.data.data);
				if (this.userInfo && this.userInfo.font_size) {
					switch (this.userInfo.font_size) {
						case '小':
							this.$store.commit('SET_GLOBAL_TEXT_SIZE', 14);
							this.$store.commit('SET_GLOBAL_LABEL_SIZE', 14);
							break;
						case '中':
							this.$store.commit('SET_GLOBAL_TEXT_SIZE', 16);
							this.$store.commit('SET_GLOBAL_LABEL_SIZE', 16);
							break;
						case '大':
							this.$store.commit('SET_GLOBAL_TEXT_SIZE', 18);
							this.$store.commit('SET_GLOBAL_LABEL_SIZE', 18);
							break;
					}
				}
				uni.setStorageSync('user_info_list', res.data.data);
				return res.data.data;
			} else if (res.data.resultCode === '0011') {
				// 登录失效 进行静默登录
				this.$store.commit('SET_LOGIN_STATE', false);
				uni.setStorageSync('isLogin', false);
				// #ifdef MP-WEIXIN
				const result = await wx.login();
				if (result.code) {
					this.code = result.code;
					await this.wxLogin({ code: result.code });
					await this.initPage();
				}
				// #endif
			} else if (Array.isArray(res.data.data) && res.data.data.length === 0) {
				// 没有角色 提示跳转到创建角色页面
				// self.toAddPage();
			}
		}
	},
	created() {
		this.getPageItem();
	},
	onShow() {
		this.initPage();
	},
	onShareAppMessage() {
		let path = '';
		let title = '百想健康'
		if (this.userInfo && this.userInfo.no) {
			path = `/pages/pedia/pedia?from=share&option.invite_user_no=${this.userInfo.userno}`;
			title = `${this.userInfo.name}邀请你体验【百想健康】小程序`
		} else if (this.loginUserInfo && this.loginUserInfo.user_no) {
			path = `/pages/pedia/pedia?from=share&option.invite_user_no=${this.loginUserInfo.user_no}`;
		}
		return {
			title:title,
			path: path
		};
	},
	onLoad(option) {
		this.checkOptionParams(option)
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
</style>
