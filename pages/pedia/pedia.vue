<template>
	<view class="page-wrap">
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
					class="screen-swiper item-box"
					:height="300"
					:class="'round-dot'"
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
	</view>
</template>

<script>
export default {
	// 通用站点首页
	data() {
		return {
			pageItemList: [], // 页面项
			code: '' // 微信登录用
		};
	},
	methods: {
		isDoctor(){
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
		async getPageItem() {
			// 查找页面项
			let url = this.getServiceUrl('daq', 'srvdaq_website_page_item_select', 'select');
			let req = {
				serviceName: 'srvdaq_website_page_item_select',
				colNames: ['*'],
				condition: [{ colName: 'page_no', ruleType: 'eq', value: 'BX202004280847490008' }],
				page: null
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
							result = result.filter(item=>item.display!=='隐藏')
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
					if(res.data.data[index].disp_flag!=='否'){
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
			let userInfo = uni.getStorageSync('login_user_info');
			// #ifdef MP-WEIXIN
			let res = await wx.getSetting();
			if (!res.authSetting['scope.userInfo']) {
				// 没有获取用户信息授权
				uni.showModal({
					title: '提示',
					content: '请登录并授权获取用户信息后再进行查看',
					confirmText: '去登录',
					confirmColor: '#02D199',
					success(res) {
						if (res.confirm) {
							// 确认 跳转到登录页
							uni.navigateTo({
								url: '/publicPages/accountExec/accountExec'
							});
						}
					}
				});
				return;
			}
			// #endif
			if (!userInfo || !uni.getStorageSync('isLogin')) {
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
				this.loginUserInfo = userInfo;
				await this.selectUserList(userInfo);
			}
		},
		// 查找当前帐号建立的用户列表
		async selectUserList(userInfo) {
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
						}
					});
				} else {
					uni.setStorageSync('current_user_info', res.data.data[0]);
					uni.setStorageSync('current_user', res.data.data[0].name);
				}
				uni.setStorageSync('user_info_list', res.data.data);
				return res.data.data;
			} else if (res.data.resultCode === '0011') {
				// 登录失效 进行静默登录
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
				uni.showModal({
					title: '提示',
					content: '当前账号未登记个人信息，是否跳转到信息登记页面',
					success(res) {
						if (res.confirm) {
							let condition = [{ colName: 'userno', ruleType: 'eq', value: uni.getStorageSync('login_user_info').user_no }];
							uni.navigateTo({
								url: '/publicPages/form/form?serviceName=srvhealth_person_info_add&type=add&cond=' + decodeURIComponent(JSON.stringify(condition))
							});
						}
					}
				});
			}
		}
	},
	created() {
		this.getPageItem();
	},
	onShow() {
		this.initPage()
	},
	onLoad() {
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
				height: 160rpx;
			}
			.swiper-item {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				padding: 0 calc((100% - 680rpx) / 2);
				.image{
					width: 60rpx;
					height: 60rpx;
				}
				.swiper-button {
					width: 150rpx;
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
