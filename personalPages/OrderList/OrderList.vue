<template>
	<view v-if="swiperCurrent || swiperCurrent === 0">
		<view class="wrap">
			<view class="u-tabs-box">
				<u-tabs-swiper activeColor="#0bc99d" ref="tabs" :list="list" :current="current" @change="change" :is-scroll="false" swiperWidth="750"></u-tabs-swiper>
			</view>
			<swiper class="swiper-box" :current="swiperCurrent" @transition="transition" @animationfinish="animationfinish">
				<swiper-item class="swiper-item">
					<scroll-view scroll-y @scrolltolower="reachBottom" class="scroll-view">
						<view class="page-box" v-if="loadStatus[0] === 'noMore' && orderList[0].length === 0">
							<view>
								<view class="centre">
									<image class="image" src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
						<view class="page-box" v-else>
							<view class="order" v-for="(res, index) in orderList[0]" :key="res.id">
								<view class="top">
									<view class="left" @click.stop="toStore(res)">
										<bx-icon name="home" :size="30" color="rgb(94,94,94)"></bx-icon>
										<view class="store">{{ res.store }}</view>
										<bx-icon name="right" :size="26" color="rgb(203,203,203)"></bx-icon>
									</view>
									<view class="right">{{ res.order_state || '' }}</view>
								</view>
								<view class="item" v-for="(item, index) in res.goodsList" :key="index" @click="toOrderDetail(res)">
									<view class="left"><image class="image" :src="item.goodsUrl" mode="aspectFill"></image></view>
									<view class="content">
										<view class="title">{{ item.title }}</view>
										<view class="type">{{ item.type || '' }}</view>
										<view class="right">
											<view class="price">
												￥{{ priceInt(item.price) }}
												<text class="decimal">.{{ priceDecimal(item.price) }}</text>
											</view>
											<view class="number">x{{ item.number }}</view>
										</view>
										<view class="total">
											共{{ totalNum(res.goodsList) }}件商品 合计:
											<text class="total-price">
												￥{{ priceInt(totalPrice(res.goodsList)) }}.
												<text class="decimal">{{ priceDecimal(totalPrice(res.goodsList)) }}</text>
											</text>
										</view>
									</view>
								</view>
								<view class="bottom">
									<button class="cu-btn line-red round sm" @click.stop="deleteOrder(res)">删除订单</button>
									<button class="cu-btn line-orange round sm" v-if="res.order_state === '待支付' && res.pay_state === '待支付'" @click.stop="toPay(res)">去支付</button>
								</view>
							</view>
							<uni-load-more :status="loadStatus[0]"></uni-load-more>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y @scrolltolower="reachBottom" class="scroll-view">
						<view class="page-box" v-if="loadStatus[1] === 'noMore' && orderList[1].length === 0">
							<view>
								<view class="centre">
									<image class="image" src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
						<view class="page-box" v-else>
							<view class="order" v-for="(res, index) in orderList[1]" :key="res.id">
								<view class="top">
									<view class="left" @click.stop="toStore(res)">
										<bx-icon name="home" :size="30" color="rgb(94,94,94)"></bx-icon>
										<view class="store">{{ res.store }}</view>
										<bx-icon name="right" :size="26" color="rgb(203,203,203)"></bx-icon>
									</view>
									<view class="right">{{ res.order_state || '' }}</view>
								</view>
								<view class="item" v-for="(item, index) in res.goodsList" :key="index" @click="toOrderDetail(res)">
									<view class="left">
										<image class="image" :src="item.goodsUrl" mode="aspectFill" v-if="item.goodsUrl"></image>
										<text class="cuIcon-goods image" v-else></text>
									</view>
									<view class="content">
										<view class="title u-line-2">{{ item.title }}</view>
										<view class="type">{{ item.type }}</view>
										<!-- <view class="delivery-time">发货时间 {{ item.deliveryTime }}</view> -->
										<view class="right">
											<view class="price">
												￥{{ priceInt(item.price) }}
												<text class="decimal">.{{ priceDecimal(item.price) }}</text>
											</view>
											<view class="number">x{{ item.number }}</view>
										</view>
										<view class="total">
											共{{ totalNum(res.goodsList) }}件商品 合计:
											<text class="total-price">
												￥{{ priceInt(totalPrice(res.goodsList)) }}.
												<text class="decimal">{{ priceDecimal(totalPrice(res.goodsList)) }}</text>
											</text>
										</view>
									</view>
								</view>
								<view class="bottom">
									<button class="cu-btn line-red round sm" @click.stop="deleteOrder(res)">删除订单</button>
									<button class="cu-btn line-grey round sm" @click.stop="cancelOrder(res)">取消订单</button>
									<button class="cu-btn line-orange round sm" @click.stop="toPay(res)">去支付</button>
								</view>
							</view>
							<uni-load-more :status="loadStatus[1]"></uni-load-more>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="scroll-view" @scrolltolower="reachBottom">
						<view class="page-box" v-if="loadStatus[2] === 'noMore' && orderList[2].length === 0">
							<view>
								<view class="centre">
									<image class="image" src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
						<view class="page-box" v-else>
							<view class="order" v-for="(res, index) in orderList[2]" :key="res.id">
								<view class="top">
									<view class="left" @click.stop="toStore(res)">
										<bx-icon name="home" :size="30" color="rgb(94,94,94)"></bx-icon>
										<view class="store">{{ res.store }}</view>
										<bx-icon name="right" :size="26" color="rgb(203,203,203)"></bx-icon>
									</view>
									<view class="right">{{ res.order_state || '' }}</view>
								</view>
								<view class="item" v-for="(item, index) in res.goodsList" :key="index" @click="toOrderDetail(res)">
									<view class="left"><image class="image" :src="item.goodsUrl" mode="aspectFill"></image></view>
									<view class="content">
										<view class="title u-line-2">{{ item.title }}</view>
										<view class="type">{{ item.type }}</view>
										<view class="right">
											<view class="price">
												￥{{ priceInt(item.price) }}
												<text class="decimal">.{{ priceDecimal(item.price) }}</text>
											</view>
											<view class="number">x{{ item.number }}</view>
										</view>
										<view class="total">
											共{{ totalNum(res.goodsList) }}件商品 合计:
											<text class="total-price">
												￥{{ priceInt(totalPrice(res.goodsList)) }}.
												<text class="decimal">{{ priceDecimal(totalPrice(res.goodsList)) }}</text>
											</text>
										</view>
									</view>
								</view>
								<view class="bottom">
									<view class="more"><bx-icon name="more" :size="26" color="rgb(203,203,203)"></bx-icon></view>
									<!-- <button class="cu-btn line-cyan round sm">再次购买</button> -->
								</view>
							</view>
							<uni-load-more :status="loadStatus[2]"></uni-load-more>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="scroll-view">
						<view class="page-box" v-if="loadStatus[3] === 'noMore' && orderList[3].length === 0">
							<view>
								<view class="centre">
									<image class="image" src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
						<view class="page-box" v-else>
							<view class="order" v-for="(res, index) in orderList[3]" :key="res.id">
								<view class="top">
									<view class="left" @click.stop="toStore(res)">
										<bx-icon name="home" :size="30" color="rgb(94,94,94)"></bx-icon>
										<view class="store">{{ res.store }}</view>
										<bx-icon name="right" :size="26" color="rgb(203,203,203)"></bx-icon>
									</view>
									<view class="right">{{ res.order_state || '' }}</view>
								</view>
								<view class="item" v-for="(item, index) in res.goodsList" :key="index" @click="toOrderDetail(res)">
									<view class="left">
										<image class="image" :src="item.goodsUrl" mode="aspectFill" v-if="item.goodsUrl"></image>
										<text class="cuIcon-goods image" v-else></text>
									</view>
									<view class="content">
										<view class="title u-line-2">{{ item.title }}</view>
										<view class="type">{{ item.type }}</view>
										<view class="right">
											<view class="price">
												￥{{ priceInt(item.price) }}
												<text class="decimal">.{{ priceDecimal(item.price) }}</text>
											</view>
											<view class="number">x{{ item.number }}</view>
										</view>
										<view class="total">
											共{{ totalNum(res.goodsList) }}件商品 合计:
											<text class="total-price">
												￥{{ priceInt(totalPrice(res.goodsList)) }}.
												<text class="decimal">{{ priceDecimal(totalPrice(res.goodsList)) }}</text>
											</text>
										</view>
									</view>
								</view>
								<view class="bottom">
									<view class="more"><bx-icon name="more" :size="26" color="rgb(203,203,203)"></bx-icon></view>
									<button class="cu-btn line-orange round sm" @click.stop="toPay(res)">去支付</button>
								</view>
							</view>
							<uni-load-more :status="loadStatus[3]"></uni-load-more>
						</view>
					</scroll-view>
				</swiper-item>
				<swiper-item class="swiper-item">
					<scroll-view scroll-y class="scroll-view" @scrolltolower="reachBottom">
						<view class="page-box" v-if="loadStatus[4] === 'noMore' && orderList[4].length === 0">
							<view>
								<view class="centre">
									<image class="image" src="https://cdn.uviewui.com/uview/template/taobao-order.png" mode=""></image>
									<view class="explain">
										您还没有相关的订单
										<view class="tips">可以去看看有那些想买的</view>
									</view>
									<view class="btn">随便逛逛</view>
								</view>
							</view>
						</view>
						<view class="page-box" v-else>
							<view class="order" v-for="(res, index) in orderList[4]" :key="res.id">
								<view class="top">
									<view class="left"  @click.stop="toStore(res)">
										<bx-icon name="home" :size="30" color="rgb(94,94,94)"></bx-icon>
										<view class="store">{{ res.store }}</view>
										<bx-icon name="right" :size="26" color="rgb(203,203,203)"></bx-icon>
									</view>
									<view class="right">{{ res.order_state || '' }}</view>
								</view>
								<view class="item" v-for="(item, index) in res.goodsList" :key="index" @click="toOrderDetail(res)">
									<view class="left"><image class="image" :src="item.goodsUrl" mode="aspectFill"></image></view>
									<view class="content">
										<view class="title u-line-2">{{ item.title }}</view>
										<view class="type">{{ item.type }}</view>
										<view class="right">
											<view class="price">
												￥{{ priceInt(item.price) }}
												<text class="decimal">.{{ priceDecimal(item.price) }}</text>
											</view>
											<view class="number">x{{ item.number }}</view>
										</view>
										<view class="total">
											共{{ totalNum(res.goodsList) }}件商品 合计:
											<text class="total-price">
												￥{{ priceInt(totalPrice(res.goodsList)) }}.
												<text class="decimal">{{ priceDecimal(totalPrice(res.goodsList)) }}</text>
											</text>
										</view>
									</view>
								</view>
								<view class="bottom">
									<view class="more"><bx-icon name="more" :size="26" color="rgb(94,94,94)"></bx-icon></view>
									<button class="cu-btn line-cyan round sm">再次购买</button>
								</view>
							</view>
							<uni-load-more :status="loadStatus[4]"></uni-load-more>
						</view>
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			orderList: [[], [], [], [], []],
			listPage: [{ pageNo: 1, rownumber: 10 }, { pageNo: 1, rownumber: 10 }, { pageNo: 1, rownumber: 10 }, { pageNo: 1, rownumber: 10 }, { pageNo: 1, rownumber: 10 }],
			dataList: [],
			list: [
				{
					name: '全部',
					count: 0
				},
				{
					name: '待支付',
					count: 0
				},
				{
					name: '待发货',
					count: 0
				},
				{
					name: '待收货',
					count: 0
				},
				{
					name: '已完成',
					count: 0
				}
			],
			current: 0,
			swiperCurrent: null,
			tabsHeight: 0,
			dx: 0,
			loadStatus: ['more', 'more', 'more', 'more', 'more']
		};
	},
	onLoad(option) {
		for (let i = 0; i < 5; i++) {
			this.getOrderList(i);
		}
		switch (option.type) {
			case 'order-list': //全部
				this.swiperCurrent = 0;
				break;
			case 'order-unpaid': //待支付
				this.swiperCurrent = 1;
				break;
			case 'order-deliver': // 待发货
				this.swiperCurrent = 2;
				break;
			case 'order-receiving': //待收货
				this.swiperCurrent = 3;
				break;
			case 'order-finish': //已完成
				this.swiperCurrent = 4;
				break;
		}
		this.current = this.swiperCurrent;
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		}),
		// 价格小数
		priceDecimal() {
			return val => {
				if (val) {
					val = Number(val).toFixed(2);
				} else {
					return '00';
				}
				if (Number(val) !== parseInt(val)) return val.slice(-2);
				else return '00';
			};
		},
		// 价格整数
		priceInt() {
			return val => {
				if (val) {
					val = Number(val).toFixed(2);
				} else {
					return '0';
				}
				if (Number(val) !== parseInt(val)) return val.split('.')[0];
				else return Number(val);
			};
		}
	},
	onPullDownRefresh() {
		this.loadStatus[this.current] = 'more';
		this.orderList[this.current] = [];
		this.getOrderList(this.current);
		setTimeout(_ => {
			uni.stopPullDownRefresh();
		}, 1000);
	},
	methods: {
		cancelOrder(e) {
			let self = this;
			uni.showModal({
				title: '提示',
				content: '是否取消订单',
				confirmText: '确定取消',
				cancelText: '暂不取消',
				success(res) {
					if (res.confirm) {
						self.updateOrderState('取消订单', '待支付',e);
					}
				}
			});
		},
		deleteOrder(e) {
			let self = this;
			uni.showModal({
				title: '提示',
				content: '是否删除订单',
				confirmText: '删除',
				cancelText: '取消',
				success(res) {
					if (res.confirm) {
						let req = [{ serviceName: 'srvhealth_store_order_delete', condition: [{ colName: 'id', ruleType: 'in', value: e.id }] }];
						self.$fetch('operate', 'srvhealth_store_order_delete', req, 'health').then(result => {
							console.log(result);
							debugger;
							uni.startPullDownRefresh();
						});
					}
				}
			});
		},
		updateOrderState(order_state, pay_state,info) {
			let req = [
				{
					serviceName: 'srvhealth_store_order_update',
					condition: [{ colName: 'id', ruleType: 'eq', value: info.id }],
					data: [{ order_state: order_state }, { pay_state: pay_state }]
				}
			];
			this.$fetch('operate', 'srvhealth_store_order_update', req, 'health').then(res => {
				console.log(res);
				uni.startPullDownRefresh();
			});
		},
		toStore(e) {
			uni.navigateTo({
				url: '/otherPages/shop/shopHome?restaurantNo=' + e.store_no
			});
		},
		toOrderDetail(e) {
			uni.navigateTo({
				url: '/personalPages/payOrder/payOrder?order_no=' + e.order_no
			});
		},
		toPay(e) {
			uni.navigateTo({
				url: '/personalPages/payOrder/payOrder?order_no=' + e.order_no
			});
		},
		reachBottom() {
			// 此tab为空数据
			if (this.loadStatus[this.current] == 'more') {
				// if (this.current != 2) {
				// this.loadStatus.splice(this.current, 1, 'loading');
				setTimeout(() => {
					this.getOrderList(this.current, 'more');
				}, 1200);
				// }
			}
		},
		// 页面数据
		async getOrderGoodsList(orderNos) {
			let req = {
				serviceName: 'srvhealth_store_order_goods_detail_select',
				colNames: ['*'],
				condition: [{ colName: 'order_no', ruleType: 'in', value: orderNos }],
				query_source: 'list_page'
			};
			let goodsList = await this.$fetch('select', 'srvhealth_store_order_goods_detail_select', req, 'health');
			if (goodsList.success) {
				return goodsList.data;
			} else {
				return [];
			}
		},
		async getOrderList(idx) {
			let req = {
				serviceName: 'srvhealth_store_order_select',
				colNames: ['*'],
				condition: [{ colName: 'order_state', ruleType: 'in', value: this.list[idx].name }],
				page: { pageNo: this.orderList[idx].length === 0 ? this.listPage[idx].pageNo : this.listPage[idx].pageNo + 1, rownumber: this.listPage[idx].rownumber },
				query_source: 'list_page'
			};
			if (this.loadStatus[idx] === 'more') {
				this.loadStatus.splice(idx, 1, 'loading');
			} else if (this.loadStatus[idx] === 'noMore') {
				console.log(this.loadStatus);
				debugger;
				return;
			}
			if (idx === 0) {
				req.condition = [];
			}
			let orderList = await this.$fetch('select', 'srvhealth_store_order_select', req, 'health');
			this.listPage.splice(this.current, 1, { pageNo: orderList.page.pageNo, rownumber: orderList.page.rownumber, total: orderList.page.total });
			if (orderList.success) {
				this.listPage[idx].pageNo = orderList.page.pageNo;
				this.list = this.list.map((item, index) => {
					if (index === idx) {
						if (orderList.page.total > 99) {
							orderList.page.total = '99+';
						}
						if (idx === 0 || idx === 4) {
							orderList.page.total = '';
						}
						this.$set(item, 'count', orderList.page.total);
					}
					return item;
				});
				let goodsList = await this.getOrderGoodsList(orderList.data.map(item => item.order_no).toString());
				let resultData = orderList.data.map((item, index) => {
					let data = {
						...item,
						// id: item.id,
						// order_no:item.order_no,
						store: item.store_name,
						// deal: '交易失败',
						goodsList: goodsList.reduce((pre, goods) => {
							if (goods.order_no === item.order_no) {
								pre.push({
									goodsUrl: this.getImagePath(goods.goods_image),
									title: goods.goods_desc,
									// type: '4K，广色域',
									// deliveryTime: '珍藏10年好酒',
									price: goods.unit_price ? goods.unit_price : 0,
									number: goods.goods_amount
								});
							}
							return pre;
						}, [])
					};
					return data;
				});
				let originData = this.deepClone(this.orderList[idx]);
				if (this.listPage[idx].pageNo === 1) {
					this.orderList[idx] = resultData;
				} else {
				}
				this.orderList[idx] = [...originData, ...resultData];
				if (orderList.page && orderList.page.pageNo) {
					if (orderList.page.total <= orderList.page.rownumber * orderList.page.pageNo) {
						// 没有更多数据了
						this.$set(this.loadStatus, idx, 'noMore');
					} else {
						this.$set(this.loadStatus, idx, 'more');
					}
				} else {
					this.$set(this.loadStatus, idx, 'more');
				}
			}
		},
		// 总价
		totalPrice(item) {
			let price = 0;
			item.map(val => {
				price += parseFloat(val.price * val.number);
			});
			return price.toFixed(2);
		},
		// 总件数
		totalNum(item) {
			let num = 0;
			item.map(val => {
				num += val.number;
			});
			return num;
		},
		// tab栏切换
		change(index) {
			this.swiperCurrent = index;
			if (this.orderList[index].length === 0 && this.loadStatus[index] === 'more') {
				//
				this.getOrderList(index);
			}
		},
		transition({ detail: { dx } }) {
			this.$refs.tabs.setDx(dx);
		},
		animationfinish({ detail: { current } }) {
			this.$refs.tabs.setFinishCurrent(current);
			this.swiperCurrent = current;
			this.current = current;
		}
	}
};
</script>

<style lang="scss" scoped>
.scroll-view {
	width: 100vw;
	height: calc(100vh - var(--window-top) - 40px);
}
.order {
	width: 710rpx;
	background-color: #ffffff;
	margin: 20rpx auto;
	border-radius: 20rpx;
	box-sizing: border-box;
	padding: 20rpx;
	font-size: 28rpx;
	.top {
		display: flex;
		justify-content: space-between;
		.left {
			display: flex;
			align-items: center;
			.store {
				margin: 0 10rpx;
				font-size: 32rpx;
				font-weight: bold;
			}
		}
		.right {
			color: $uni-color-error;
		}
	}
	.item {
		display: flex;
		margin: 20rpx 0 0;
		.left {
			margin-right: 20rpx;
			.image {
				display: inline-block;
				text-align: center;
				line-height: 200rpx;
				font-size: 40px;
				background-color: #f1f1f1;
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
			}
		}
		.content {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			.title {
				font-size: 32rpx;
				line-height: 40rpx;
				font-weight: bold;
			}
			.type {
				margin: 10rpx 0;
				font-size: 24rpx;
				color: $u-tips-color;
			}
			.delivery-time {
				color: #e5d001;
				font-size: 24rpx;
			}
		}
		.right {
			margin-left: 10rpx;
			text-align: right;
			.decimal {
				font-size: 24rpx;
				margin-top: 4rpx;
			}
			.number {
				color: $u-tips-color;
				font-size: 24rpx;
			}
		}
	}
	.total {
		width: 100%;
		// margin-top: 20rpx;
		text-align: right;
		font-size: 24rpx;
		.total-price {
			font-size: 32rpx;
		}
	}
	.bottom {
		display: flex;
		margin-top: 40rpx;
		padding: 0 10rpx;
		align-items: center;
		justify-content: flex-end;
		.btn {
			line-height: 52rpx;
			width: 160rpx;
			border-radius: 26rpx;
			border: 2rpx solid $u-border-color;
			font-size: 26rpx;
			text-align: center;
			color: $u-type-info-dark;
			
		}
		.cu-btn{
			&+.cu-btn{
				margin-left: 20rpx;
			}
		}
		.evaluate {
			color: $u-type-warning-dark;
			border-color: $u-type-warning-dark;
			background-color: #fff;
			margin: 0;
		}
	}
}
.centre {
	text-align: center;
	margin: 200rpx auto;
	font-size: 32rpx;
	image {
		width: 164rpx;
		height: 164rpx;
		border-radius: 50%;
		margin: 0 auto;
		margin-bottom: 20rpx;
	}
	.tips {
		font-size: 24rpx;
		color: #999999;
		margin-top: 20rpx;
	}
	.btn {
		margin: 80rpx auto;
		width: 200rpx;
		border-radius: 32rpx;
		line-height: 64rpx;
		color: #ffffff;
		font-size: 26rpx;
		background: linear-gradient(270deg, rgba(249, 116, 90, 1) 0%, rgba(255, 158, 1, 1) 100%);
	}
}
.wrap {
	display: flex;
	flex-direction: column;
	height: calc(100vh - var(--window-top));
	width: 100%;
}
.swiper-box {
	flex: 1;
}
.swiper-item {
	height: 100%;
}
</style>
