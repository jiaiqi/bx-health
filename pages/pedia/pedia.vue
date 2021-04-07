<template>
	<view class="page-wrap" :style="{
			'--global-text-font-size': globalTextFontSize + 'px'
		}" v-if="showPageContent">
		<view class="page-item" v-for="(pageItem,pageIndex) in pageItemList" :key="pageItem.item_no" :class="{
				'swiper-view': pageItem.div_type === 'carousel',
				'menu-view': pageItem.div_type === 'buttons',
				'tab-list-view': pageItem.div_type === 'tablist'
			}">
			<view class="page-slide" v-if="pageItem.div_type === 'carousel'">
				<swiper class="screen-swiper item-box square-dot" easing-function="linear" :height="300"
					:indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500">
					<swiper-item v-for="(item, index) in pageItem.carousel" :key="item.carousel_no"
						@click="toSwiperDetail(item)">
						<image :src="getImagePath(item.carousel_image, true)"></image>
					</swiper-item>
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
			<view class="store-home" :style="{minHeight:pageItem.storeInfo.imgHeight +'px'}"
				v-if="pageItem.div_type==='store_icon'&&pageItem.storeInfo&&pageItem.storeInfo.store_no">
				<!-- 机构主页快捷入口 -->
				<image class="image" v-if="pageItem.storeInfo.image"
					:style="{height:pageItem.storeInfo.imgHeight +'px',width:pageItem.storeInfo.imgWidth+'px'}"
					:src="pageItem.storeInfo.url" mode="aspectFill" @tap="toStoreHome(pageItem.storeInfo)"></image>
				<view class="store-desc" @tap="toStoreHome(pageItem.storeInfo)">
					<view class="store-name" v-if="pageItem.storeInfo.name">
						{{pageItem.storeInfo.name||''}}
					</view>
					<view class="store-address" v-if="pageItem.storeInfo.address">
						<text> {{pageItem.storeInfo.address||''}}</text>
						<text class="margin-left-xs cuIcon-locationfill text-blue "
							@tap.stop.prevent="openLocation(pageItem.storeInfo)"></text>
					</view>
				</view>
			</view>
			<view class="page-menu" v-if="pageItem.div_type === 'buttons'">
				<view class="title">{{ pageItem.item_label || '' }}</view>
				<view class="item-box"
					:class="{ 'low-height': pageItem.buttons && pageItem.buttons.length > 0 && pageItem.buttons[0].buttons && pageItem.buttons[0].buttons.length <= 4 }"
					v-if="(pageItem.buttons && pageItem.buttons.length === 1) || !pageItem.buttons || pageItem.buttons.length === 0">
					<view class="swiper-item" v-for="(swiperItem, swiperIndex) in pageItem.buttons" :key="swiperIndex">
						<view @click="skip(btn)" class="swiper-button" v-for="(btn,btnIndex) in swiperItem.buttons"
							:key="btn.button_no">
							<image class="image" :src="getMenuImagePath(btn)"></image>
							<text class="btn-name">{{ btn.dest_menu_no }}</text>
						</view>
					</view>
				</view>
				<swiper class="swiper item-box" :indicator-dots="true" :autoplay="false" :interval="3000"
					:duration="500" v-if="pageItem.buttons && pageItem.buttons.length > 1">
					<swiper-item v-for="(swiperItem, swiperIndex) in pageItem.buttons" :key="swiperIndex">
						<view class="swiper-item">
							<view @click="skip(btn)" class="swiper-button" v-for="btn in swiperItem.buttons"
								:key="btn.button_no">
								<image class="image" height="60rpx" :src="getMenuImagePath(btn)"></image>
								<text class="btn-name">{{ btn.dest_menu_no }}</text>
							</view>
						</view>
					</swiper-item>
				</swiper>
			</view>
			<view class="page-article" v-if="pageItem.div_type === 'tablist' && pageItem.tablist">
				<article-list :config="pageItem"></article-list>
			</view>
		</view>
		<button class="contact-button" @click="toFeedBack"><text
				class="cuIcon-servicefill text-blue icon"></text></button>
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
	<view class="page-wrap loading" v-else>
		<u-empty text="正在前往目标页面..." mode="search"></u-empty>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex';
	export default {
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
				env:state => state.app.env,
				authUserInfo: state => state.app.authUserInfo,
				subscsribeStatus: state => state.app.subscsribeStatus,
				loginUserInfo: state => state.user.loginUserInfo,
				userInfo: state => state.user.userInfo,
				globalTextFontSize: state => state.app['globalTextFontSize'],
				globalLabelFontSize: state => state.app.globalLabelFontSize,
				hasIntoHospital: state => state.app.hasIntoHospital
			}),
			showPageContent() {
				if (this.userInfo.add_store_no && !this.hasIntoHospital&&this.env!=='h5') {
					return false
				} else {
					return true
				}
			},
		},
		methods: {
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
					let url =
						'/publicPages/newForm/newForm?serviceName=srvhealth_suggest_record_add&type=add&fieldsCond=' +
						encodeURIComponent(JSON.stringify(fieldsCond));
					uni.navigateTo({
						url: url
					});
				}
			},
			hideModal() {
				this.modalName = '';
			},
			toSwiperDetail(e) {
				if (!e || typeof e !== 'object') {
					return;
				}
				if (e.content_no) {
					uni.navigateTo({
						url: '/publicPages/article/article?content_no=' + e.content_no
					});
				} else if (e.mini_program_url) {
					uni.navigateTo({
						url: e.mini_program_url
					});
				}
			},
			toStoreHome(e) {
				if (e.store_no) {
					uni.redirectTo({
						// url: '/pages/home/home?store_no=' + e.store_no
						url: '/pediaPages/hospitalOverview/hospitalOverview?store_no=' + e.store_no
					})
				}
			},
			openLocation(e) {
				if (!e.latitude || !e.longitude) {
					return
				}
				uni.openLocation({
					latitude: Number(e.latitude),
					longitude: Number(e.longitude),
					name: e.name,
					address: e.address,
					success: function() {
						console.log('success');
					},
					fail(err) {
						console.log('err', err);
					}
				});
			},
			async skip(item) {
				let res = await this.toAddPage();
				if (!res) {
					return;
				}
				let dest_page = '';
				let self = this;
				if (item.dest_page && item.dest_page.indexOf('/pages/specific/health') !== -1) {
					let index = item.dest_page.indexOf('/pages/specific/health');
					dest_page = '/otherPages' + item.dest_page.slice(22);
					console.log(item.dest_page);
				}
				if (dest_page && typeof dest_page === 'string' && dest_page.indexOf('/pages/') !== -1) {
					uni.switchTab({
						url: dest_page,
						fail() {
							uni.redirectTo({
								url: dest_page
							})
						}
					});
				} else {
					uni.navigateTo({
						url: item.dest_page,
						fail(err) {
							if (err.errMsg && err.errMsg.indexOf('is not found') !== -1) {
								// 通过webview展示h5页面
								if (item.dest_page.indexOf(self.$api.frontEndAddress) !== -1) {
									uni.navigateTo({
										url: '/publicPages/webviewPage/webviewPage?webUrl=' + item
											.dest_page
									});
								} else {
									uni.navigateTo({
										url: '/publicPages/webviewPage/webviewPage?webUrl=' +
											encodeURIComponent(self.$api.frontEndAddress + item
												.dest_page)
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
					condition: [{
						colName: 'website_no',
						ruleType: 'eq',
						value: 'WS2020042808470005'
					}]
				};
				let res = await this.$http.post(url, req);
				if (this.requestSuccess(res)) {
					if (res.data.data.length > 0) {
						let result = res.data.data[0];
						if (result.more_config && typeof result.more_config === 'string') {
							try {
								result.more_config = JSON.parse(result.more_config);
								if (result.more_config.globalLabelFontSize) {
									this.$store.commit('SET_GLOBAL_LABEL_SIZE', result.more_config
										.globalLabelFontSize);
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
					condition: [{
						colName: 'page_no',
						ruleType: 'eq',
						value: 'BX202004280847490008'
					}]
				};
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					this.pageItemList.length = [];
					for (let index in res.data.data) {
						let pageItem = res.data.data[index]
						let result = await this.getItemDetail(pageItem);
						switch (pageItem.div_type) {
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
								pageItem['buttons'] = swiperList;
								break;
							case 'carousel':
								pageItem['carousel'] = result;
								break;
							case 'tablist':
								pageItem['tablist'] = result;
								break;
							case "store_icon":
								//机构主页快捷入口
								if (Array.isArray(result) && result.length > 0) {
									let storeInfo = result[0]
									if (storeInfo.image) {
										storeInfo.url = this.getImagePath(storeInfo.image)
										let imageInfo = await this.getImageInfo(storeInfo)
										let Info = this.setPicHeight(imageInfo, 250)
										if (Info.w && Info.h) {
											storeInfo.imgHeight = Info.h
											storeInfo.imgWidth = Info.w
										}
									}
									pageItem['storeInfo'] = storeInfo
								}
								break;
						}
						if (pageItem.disp_flag !== '否') {
							this.pageItemList.push(pageItem);
						}
					}
					return res.data.data;
				}
			},
			async getItemDetail(item) {
				// 获取页面项详情
				let serviceName = '';
				let app = 'daq'
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
					case "store_icon":
						//机构主页快捷入口
						serviceName = 'srvhealth_store_mgmt_select';
						app = 'health'
						break;
				}
				if (serviceName && item.item_no) {
					let url = this.getServiceUrl(app, serviceName, 'select');
					let req = {
						serviceName: serviceName,
						colNames: ['*'],
						condition: [{
							colName: 'item_no',
							ruleType: 'in',
							value: item.item_no
						}],
						order: [{
							colName: 'seq',
							orderType: 'asc'
						}]
					};
					if (item.div_type === 'store_icon') {
						//机构主页快捷入口
						if (!this.userInfo) {
							await this.toAddPage()
						} else if (this.userInfo && !this.userInfo.home_store_no) {
							return
						}
						req.condition = [{
							colName: 'store_no',
							ruleType: 'eq',
							value: this.userInfo.home_store_no
						}]
						delete req.order
					}
					if (item.disp_flag === '否') {
						return []
					}
					let res = await this.$http.post(url, req);
					if (res.data.state === 'SUCCESS') {
						return res.data.data;
					}
				}
			},
			checkUserInfoParams() {
				let self = this;
				self.wxVerifyLogin(true).then(_ => {
					self.selectBasicUserList().then(res => {
						self.selectBasicUserInfo();
					});
				});
			},
			openOfficialImage() {
				uni.navigateTo({
					url: '/publicPages/webviewPage/webviewPage?webUrl=' + encodeURIComponent(
						'https://mp.weixin.qq.com/s/Z9o7ZJOtrAsR2Sj7PIIgRQ')
				});
			}
		},
		created() {
			this.getPageItem();
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
			this.checkUserInfoParams();
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
		font-size: var(--global-text-font-size);
		&.loading{
			display: flex;
			align-items: center;
			justify-content: center;
		}
		.status_bar {
			height: var(--status-bar-height);
			width: 100%;
		}

		.store-home {
			width: 100%;
			border-radius: 20rpx;
			margin-bottom: 20rpx;
			overflow: hidden;
			position: relative;
			border: 1rpx solid #f1f1f1;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
			display: flex;

			.image {
				max-height: 200rpx;
			}

			.store-desc {
				background-color: rgba($color: #fff, $alpha: 0.8);
				padding: 10rpx 20rpx;

				.store-name {
					font-weight: bold;
					font-size: 16px;
					margin-bottom: 10rpx;
					word-break: break-all;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					/**指定行数*/
					-webkit-box-orient: vertical;
					overflow: hidden;
				}

				.store-address {
					font-size: 14px;
					word-break: break-all;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					/**指定行数*/
					-webkit-box-orient: vertical;
					overflow: hidden;

					.cuIcon-locationfill {
						font-size: 20px;
					}
				}
			}
		}

		.page-item {
			border-radius: 20rpx;
			overflow: hidden;

			.item-box {
				border-radius: 10rpx;
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
						width: calc(25% - 60rpx / 4);
						// background-color: #fff;
						// width: 150rpx;
						height: 150rpx;
						display: inline-flex;
						justify-content: center;
						align-items: center;
						flex-direction: column;
						border-radius: 8rpx;
						margin-right: 20rpx;
						margin-bottom: 20rpx;

						// box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1) ;
						&:nth-child(4n) {
							margin-right: 0;
						}

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
