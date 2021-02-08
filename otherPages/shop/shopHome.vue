<template>
	<view class="shop-wrap">
		<!-- 头部 -->
		<view class="header">
			<image class="header-bg" src="@/otherPages/static/img/banner.jpg" mode=""></image>
			<!-- <view :class="showStoreBox ? 'header-bg-gray' : 'header-bg-black'"></view> -->
			<view class="header-top-Placeholder"></view>
			<view class="container storeInfo hx-shadow">
				<image class="storeAvatar hx-shadow" src="@/otherPages/static/img/3.png" mode=""></image>
				<view v-if="restAurn" class="hx-txt-18 hx-color-black hx-txt-weigth hx-mb-15 ">{{ restAurn.name }}</view>
				<view class="hx-txt-14 hx-color-black ">店家说明,本店放心吃，地方名才</view>
				<!-- <view class="">
					后续再扩展优惠券，满减，折扣，活动等功能
				</view> -->
				<view class="shrink-box"><!-- <i class="hxicon" :class="showStoreBox ? 'icon-fold' : 'icon-unfold'" @click="showStoreBox = !showStoreBox"></i> --></view>
			</view>
		</view>
		<!-- 主体 -->
		<view class="shop-main">
			<view class="shop-main-sort" :class="fixation ? 'shop-main-sort-fixed' : ''">
				<view class="shop-main-sort-left">
					<text :class="index === currLabel ? 'pitch' : ''" v-for="(item, index) in labelList" @click="sortList(index, item.type)" class="shop-main-sort-item">
						{{ item.name }}
					</text>
				</view>
				<view @click="changeTypes" class="shop-main-sort-right">
					<image v-if="changeType === 'doubleRow'" src="/otherPages/static/img/changelist.png" mode=""></image>
					<image v-else-if="changeType === 'singleRow'" src="/otherPages/static/img/changelist1.png" mode=""></image>
				</view>
			</view>
			<view v-if="shopList.length > 0" :class="changeType === 'doubleRow' ? 'doubleRow' : ''" class="shop-main-list">
				<view class="shop-main-list-wrap">
					<view @click="toDetail(item)" v-for="(item, index) in shopList" class="shop-main-list-item">
						<view class="item-left">
							<image v-if="!item.imgurl" src="/otherPages/static/img/none.png" mode=""></image>
							<image v-else :src="item.imgurl" mode=""></image>
						</view>
						<view class="item-right">
							<view class="item-right-top">
								<text>{{ item.name }}</text>
								<text>{{ item.intro ? item.intro : '脆糯营养，口感好，健康绿色' }}</text>
							</view>
							<view class="hx-comment_basic-info_center_item" style="margin-bottom: 10px;">
								<view class="hx-comment_basic-info_center_item_left"><text>评分</text></view>
								<view class="hx-comment_basic-info_center_item_center"><uni-rate size="14" :value="Number(item.mark)"></uni-rate></view>
								<view class="hx-comment_basic-info_center_item_right">
									<text>{{ item.mark ? item.mark : '0' }}</text>
								</view>
							</view>
							<view class="item-right-bot">
								<view class="item-right-bot-left">
									<text>￥</text>
									<text>{{ item.price ? item.price : '0' }}</text>
								</view>
								<view v-if="queryType === 'myShop'" class="item-right-bot-rig">
									<text @click.stop="addIngredient(item)">食材管理</text>
									<text @click.stop="del(item)">删除</text>
									<text @click.stop="amend(item)">修改</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view v-else class="detail-none">
				<view class="detail-none-t">
					<image src="/otherPages/static/img/noneData.png" mode=""></image>
					<text>暂无数据</text>
				</view>
			</view>
		</view>
		<view v-if="queryType === 'myShop'" class="public-button-box">
			<view @click="addFoods" class="add-button"><!-- <text class="add-button-num"></text> --></view>
		</view>
	</view>
</template>

<script>
import uniRate from '@/otherPages/components/uni-rate/uni-rate.vue';
import { mapState } from 'vuex';
export default {
	name: 'shopHome',
	components: { uniRate },
	computed: {
		...mapState({
			cartInfo: state => state.order.cartInfo
		})
	},
	data() {
		return {
			storeInfo:{},
			isShowFinish: false,
			restAurn: null,
			fixation: false, //顶部是否固定
			changeType: 'doubleRow',
			heightStyle: 'calc(100vh-620upx)',
			order: [
				{
					colName: 'mark',
					orderType: 'desc'
				}
			],
			pageInfo: {
				total: 0,
				rownumber: 5,
				pageNo: 1
			},
			labelList: [
				{
					name: '评分',
					type: 'score'
				},
				{
					name: '价格',
					type: 'price'
				}
			],
			currLabel: 0,
			list: [
				{
					name: '商品'
				}
			],
			shopList: [],
			queryType: '', //此店铺列表是商户列表还是当前登录人得商户列表
			rest_no: '' //当前餐馆编号
		};
	},
	onShow() {
		this.pageInfo.pageNo = 1;
		this.getFoodsList();
	},
	onReachBottom() {
		this.pageInfo.pageNo++;
		if (!this.isShowFinish) {
			this.getFoodsList();
		}
	},
	onPageScroll(e) {
		if (e.scrollTop >= 160) {
			this.fixation = true;
		} else {
			this.fixation = false;
		}
		// console.log("滚动",e)
	},
	onLoad(option) {
		let query = option.type;
		console.log('query----', query);
		this.queryType = query;
		this.rest_no = option.restaurantNo;
		this.getStoreInfo();
	},
	methods: {
		onRefresh() {
			this.pageInfo.pageNo = 1;
			// this.getListData();
			this.$nextTick(() => {
				this.$refs.pullScroll.refresh();
			});
		},
		pullDown(pullScroll) {
			console.log(pullScroll.page);
			let page = this.pageInfo;
			this.pageInfo.pageNo = 1;
			let self = this;
			setTimeout(() => {
				this.loadData(pullScroll);
			}, 200);
		},
		loadData(pullScroll) {
			let page = this.pageInfo;
			this.pageInfo.pageNo = pullScroll.page;
			console.log(pullScroll.page);
			this.getFoodsList();
		},
		changeTypes() {
			if (this.changeType === 'singleRow') {
				this.changeType = 'doubleRow';
			} else {
				this.changeType = 'singleRow';
			}
		},
		sortList(i, type) {
			this.pageInfo.pageNo = 1;
			let order = [
				{
					colName: '',
					orderType: 'desc'
				}
			];

			if (type === 'price') {
				order[0].colName = 'price';
			} else if (type === 'score') {
				order[0].colName = 'mark';
			}
			this.order = order;
			this.currLabel = i;
			this.getFoodsList(order);
		},
		toDetail(item) {
			uni.navigateTo({
				url: '/otherPages/shop/shopDetail?itemData=' + encodeURIComponent(JSON.stringify(item)) + '&type=' + this.queryType
			});
		},
		async getStoreInfo() {
			let req = {
				condition: [{ colName: 'store_no', ruleType: 'in', value: this.rest_no }]
			};
			let storeInfo = await this.$fetch('select', 'srvhealth_store_mgmt_select', req, 'health');
			if (storeInfo.success && Array.isArray(storeInfo.data) && storeInfo.data.length > 0) {
				storeInfo =  storeInfo.data[0];
				this.storeInfo = storeInfo;
				if (!this.cartInfo[storeInfo.store_no]) {
					// vuex中没有此店铺购物车数据
					this.$store.commit('SET_STORE_CART', { storeInfo, list: [] });
				}
			}
		},
		async getFoodsList(orders) {
			let self = this;
			let initOrder = [
				{
					colName: 'mark',
					orderType: 'desc'
				}
			];
			let url = this.getServiceUrl('health', 'srvhealth_mixed_food_nutrition_contents_select', 'select');
			let req = {
				serviceName: 'srvhealth_mixed_food_nutrition_contents_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'restaurant_no',
						ruleType: 'eq',
						value: this.rest_no
					}
				],
				page: self.pageInfo,
				order: this.order
			};
			if (!this.isShowFinish) {
				// uni.showToast({
				// 	title:'加载中',
				// 	icon:'none'
				// })
				uni.showLoading({
					title: '加载中',
					duration: 2000
				});
			}
			let res = await this.$http.post(url, req);
			uni.hideLoading();
			if (self.pageInfo.pageNo === 1) {
				self.shopList = [];
			}
			self.pageInfo.total = res.data.page.total;
			self.pageInfo.pageNo = res.data.page.pageNo;
			let page = self.pageInfo;
			if (page.rownumber * page.pageNo >= page.total) {
				// finish(boolean:是否显示finishText,默认显示)
				// self.$refs.pullScroll.finish();
				this.isShowFinish = true;
			} else {
				this.isShowFinish = false;
				// self.$refs.pullScroll.success();
			}
			if (res.data.state === 'SUCCESS') {
				// this.shopList = res.data.data
				this.shopList = [...this.shopList, ...res.data.data];
				this.shopList.forEach((item, index) => {
					if (item.image) {
						self.getFilePath(item.image).then(url => {
							let urls = self.$api.getFilePath + url[0].fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket') + '&thumbnailType=fwsu_100';
							this.$set(this.shopList[index], 'imgurl', urls);
						});
					}
				});
				console.log('food------', this.shopList);
			}
		},
		/* 添加食物**/
		addFoods() {
			let cond = [
				{
					colName: 'restaurant_no',
					ruleType: 'eq',
					value: this.rest_no
				},
				{
					colName: 'owner',
					ruleType: 'eq',
					value: '店铺'
				}
			];
			let fieldsCond = [
				{
					colName: 'restaurant_no',
					value: this.rest_no
				},
				{
					colName: 'owner',
					value: '店铺'
				}
			];
			uni.navigateTo({
				url: '/publicPages/newForm/newForm?serviceName=srvhealth_mixed_food_nutrition_contents_add&type=add&fieldsCond=' + decodeURIComponent(JSON.stringify(fieldsCond))
			});
		},
		/*添加食材**/
		addIngredient(item) {
			uni.navigateTo({
				url: '/otherPages/shop/foodMaterial?itemFood=' + encodeURIComponent(JSON.stringify(item))
			});
		},
		/*删除**/
		del(item) {
			let self = this;
			uni.showModal({
				title: '提示',
				content: '是否确认删除?',
				success: res => {
					if (res.confirm) {
						self.delFoods(item);
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		async delFoods(item) {
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_mixed_food_nutrition_contents_delete', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_mixed_food_nutrition_contents_delete',
					colNames: ['*'],
					condition: [
						{
							colName: 'id',
							ruleType: 'in',
							value: item.id
						}
					]
				}
			];
			let rea = await self.$http.post(url, req);
			if (rea.data.resultCode === 'SUCCESS') {
				self.onRefresh();
			} else {
				uni.showToast({
					title: rea.data.resultMessage,
					icon: 'none'
				});
			}
		},
		amend(item) {
			let cond = [
				{
					colName: 'id',
					ruleType: 'in',
					value: item.id
				}
			];
			let params = {
				type: 'update',
				condition: cond,
				serviceName: 'srvhealth_mixed_food_nutrition_contents_update',
				defaultVal: item
			};
			uni.navigateTo({
				url: `/publicPages/newForm/newForm?type=update&serviceName=srvhealth_mixed_food_nutrition_contents_update&fieldsCond=${encodeURIComponent(JSON.stringify(cond))}`
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.hx-color-black {
	color: #333333;
}
.hx-txt-14 {
	font-size: 14px;
}
.hx-txt-weigth {
	font-weight: bold;
}
.hx-txt-18 {
	font-size: 18px;
}
.hx-mt-15 {
	margin-top: 15px;
}
.hx-mb-15 {
	margin-bottom: 15px;
}
.shop-wrap {
	height: 100vh;
	background-color: #ffffff;
}
.shop-main {
	.shop-main-top {
		padding-left: 60upx;
		border-bottom: 2px solid #efefef;
	}
	.shop-main-sort {
		padding: 20upx 0;
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #ccc;
		border-top: 1px solid #ccc;
		.shop-main-sort-left {
			width: 80%;
			font-size: 28upx;
			display: flex;
			justify-content: space-around;
			.pitch {
				color: red;
			}
			.shop-main-sort-item {
				width: 50%;
				text-align: center;
			}
		}
		.shop-main-sort-right {
			margin-right: 30upx;
			image {
				width: 40upx;
				height: 40upx;
			}
		}
	}
	.shop-main-sort-fixed {
		position: fixed;
		top: -1px;
		z-index: 100;
		background-color: white;
		width: 100%;
		box-shadow: 3px 3px 4px rgba(26, 26, 26, 0.2);
		border-bottom: 0;
		border-top: 0;
	}
	.shop-main-list {
		// margin-top: 5px;
		// height: calc(100vh - 310px);
		// overflow-y: scroll;
		background-color: white;
		.shop-main-list-wrap {
			display: flex;
			justify-content: center;
			flex-direction: column;
			.shop-main-list-item {
				display: flex;
				padding: 5px 0 5px 15px;
				border-bottom: 1px solid #efefef;
				.item-left {
					width: 95px;
					height: 95px;
					image {
						width: 100%;
						height: 100%;
					}
				}
				.item-right {
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 10px;
					width: calc(100% - 180upx);
					.item-right-top {
						display: flex;
						flex-direction: column;
						text {
							width: 100%;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;
							&:first-child {
								font-size: 16px;
								font-weight: 600;
								margin-bottom: 2px;
							}
						}
					}
					.hx-comment_basic-info_center_item {
						margin-bottom: 10px;
						display: flex;
						align-items: center;
						margin-top: 5px;
						.hx-comment_basic-info_center_item_center {
							margin: 0 5px;
						}
					}
					.item-right-bot {
						display: flex;
						color: red;
						align-items: center;
						width: 100%;
						justify-content: space-between;
						.item-right-bot-left {
							text {
								&:first-child {
									font-size: 12px;
								}
								&:last-child {
									font-size: 18px;
									font-weight: 700;
								}
							}
						}
						.item-right-bot-rig {
							margin-right: 20upx;
							text {
								color: #0081ff;
								border: 1px solid #0081ff;
								border-radius: 40upx;
								padding: 4upx 20upx;
								&:first-child {
									color: #0081ff;
									margin-right: 10upx;
									border: 1px solid #0081ff;
									border-radius: 40upx;
									padding: 4upx 20upx;
								}
								&:last-child {
									color: #0081ff;
									border: 1px solid #0081ff;
									border-radius: 40upx;
									padding: 4upx 20upx;
									margin-left: 10upx;
								}
							}
						}
					}
				}
			}
		}
	}

	.doubleRow {
		display: flex;
		flex-wrap: wrap;

		.shop-main-list-wrap {
			width: 100%;
			display: flex;
			flex-direction: row !important;
			flex-wrap: wrap;
			justify-content: start;
			.shop-main-list-item {
				width: 45%;
				display: flex;
				flex-direction: column;
				border-bottom: none;
				padding-left: 0;
				margin-left: 24upx;
				&:nth-child(2n + 1) {
					// margin-left: 40upx;
				}
				.item-left {
					width: 100%;
				}
				.item-right {
					width: 100%;
					margin-left: 0;
					.item-right-top {
						width: 100%;
						text {
							&:first-child {
								text-align: center;
								padding: 10upx 0;
							}
						}
					}
					.item-right-bot {
						display: flex;
					}
				}
			}
		}
	}
}
.header {
	position: relative;
	// min-height: 230px;
	height: 320rpx;
	margin-bottom: 40rpx;
	&-bg {
		position: absolute;
		left: 0;
		top: 0;
		z-index: 2;
		width: 100%;
		height: 120px;
	}
	&-bg-black {
		position: absolute;
		left: 0;
		top: 142px;
		bottom: 0;
		z-index: 1;
		background-color: #ffffff;
		width: 100%;
		transition: background-color 0.2s;
	}
	&-bg-gray {
		position: absolute;
		left: 0;
		top: 142px;
		bottom: -16px;
		z-index: 1;
		background-color: #afafaf;
		width: 100%;
		transition: background-color 0.2s;
	}
	&-top-Placeholder {
		height: 105px;
	}
	.storeInfo {
		position: relative;
		z-index: 2;
		background: #ffffff;
		height: 160rpx;
		border-radius: 6px;
		padding: 12px;
		// margin-bottom: 4px;
		transition: all 0.2s;
		top: -50rpx;

		.shrink-box {
			position: absolute;
			bottom: 0;
			left: 0;
			right: 0;
			text-align: center;
			font-size: 20px;
			color: #a2a8ab;
		}
		.storeAvatar {
			position: absolute;
			width: 50px;
			height: 50px;
			right: 16px;
			top: -25px;
			background: #ffffff;
			border-radius: 4px;
		}
	}
}
.container {
	margin: 0 32upx;
}
.hx-shadow {
	box-shadow: 0px 6upx 16upx rgba(173, 173, 173, 0.2);
}
.tabs-box {
	width: 100%;
	position: sticky;
	top: calc(44px + var(--status-bar-height));
	z-index: 10;
	background-color: white;
	border-bottom: 1px solid #efefef;
	height: 40px;

	.hx-tabs {
		position: relative;
		display: flex;
		height: 100%;
		&-item {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			width: 70px;
			color: #666666;
			text {
				font-size: 16px;
			}
		}
		&-active {
			color: #333333;
			font-weight: bold;
		}
		&-slider-box {
			position: absolute;
			display: flex;
			justify-content: center;
			bottom: 0;
			width: 70px;
		}
		&-slider {
			display: flex;
			background: #f6d200;
			width: 30px;
			height: 3px;
		}
	}
}
.add-button {
	position: fixed;
	bottom: 20upx;
	left: calc(50% - 50upx);
	width: 100upx;
	height: 100upx;
	border-radius: 50%;
	background-color: rgb(246, 210, 0);
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24px;
	color: white;
	&::before {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		width: 60upx;
		margin-left: -30upx;
		margin-top: -3px;
		border-top: 5px solid;
	}
	&::after {
		content: '';
		position: absolute;
		left: 50%;
		top: 50%;
		height: 60upx;
		margin-left: -2px;
		margin-top: -15px;
		border-left: 5px solid;
	}
}
.detail-none {
	.detail-none-t {
		min-height: calc(100vh - 660rpx);
		display: flex;
		flex: 1;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		image {
			width: 140upx;
			height: 140upx;
		}
		text {
			color: #b0b0b0;
		}
	}
}
</style>
