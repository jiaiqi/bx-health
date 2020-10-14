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
				<u-swiper
					:list="pageItem.carousel"
					border-radius="10"
					interval="3000"
					duration="500"
					img-mode="scaleToFill"
					:effect3d="false"
					:height="300"
					:name="'picUrl'"
					class="item-box"
					v-if="pageItem.div_type === 'carousel'"
				></u-swiper>
			</view>
			<view class="page-menu" v-if="pageItem.div_type === 'buttons'">
				<view class="title">{{ pageItem.item_name }}</view>
				<view
					class="item-box"
					:class="{ 'low-height': pageItem.buttons && pageItem.buttons.length > 0 && pageItem.buttons[0].buttons && pageItem.buttons[0].buttons.length <= 4 }"
					v-if="(pageItem.buttons && pageItem.buttons.length === 1) || !pageItem.buttons || pageItem.buttons.length === 0"
				>
					<view class="swiper-item" v-for="(swiperItem, swiperIndex) in pageItem.buttons" :key="swiperIndex">
						<view class="swiper-button" v-for="btn in swiperItem.buttons" :key="btn.button_no">
							<u-image width="60rpx" height="60rpx" :src="getMenuImagePath(btn)"></u-image>
							<text class="btn-name">{{ btn.dest_menu_no }}</text>
						</view>
					</view>
				</view>
				<swiper class="swiper item-box" :indicator-dots="true" :autoplay="false" :interval="3000" :duration="500" v-if="pageItem.buttons && pageItem.buttons.length > 1">
					<swiper-item v-for="(swiperItem, swiperIndex) in pageItem.buttons" :key="swiperIndex">
						<view class="swiper-item">
							<view class="swiper-button" v-for="btn in swiperItem.buttons" :key="btn.button_no">
								<u-image width="60rpx" height="60rpx" :src="getMenuImagePath(btn)"></u-image>
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
			pageItemList: [] // 页面项
		};
	},
	methods: {
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
				for (let index in res.data.data) {
					let result = await this.getItemDetail(res.data.data[index]);
					switch (res.data.data[index].div_type) {
						case 'buttons':
							let swiperList = [];
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
							// res.data.data[index]['swiperList'] = result.map(btn=>{
							// 	debugger
							// });
							break;
						case 'carousel':
							res.data.data[index]['carousel'] = result;
							break;
					}
				}
				console.log(res.data.data);
				this.pageItemList = res.data.data;
				return res.data.data;
				// res.data.data.forEach(item => {
				// 	this.getItemDetail(item)
				// });
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
		}
	},
	created() {
		this.getPageItem();
	}
};
</script>

<style lang="scss" scoped>
.page-wrap {
	width: 100vw;
	padding:20rpx;
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
				.swiper-button {
					// background-color: #f1f1f1;
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
