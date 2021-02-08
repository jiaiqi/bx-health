<template>
	<view class="pay-order">
		<view class="address-box" @click="chooseAddress">
			<view class="left "><text class="cuIcon-locationfill"></text></view>
			<view class="center">
				<view class="">
					<text class="name">{{ addressInfo.userName || userInfo.name }}</text>
					<text class="phone">{{ addressInfo.phone || '-' }}</text>
				</view>
				<view class="address">{{ addressInfo.fullAddress || '-' }}</view>
			</view>
			<view class="right"><text class="cuIcon-right"></text></view>
		</view>
		<view class="order-detail">
			<view class="order-info">
				<view class="title-bar">
					<image class="store-logo" :src="getImagePath(orderInfo.image)" mode="aspectFill" v-if="orderInfo.image"></image>
					<text class="store-logo cuIcon-shop" v-else></text>
					<text class="store-name">{{ orderInfo.store_name ? orderInfo.store_name : orderInfo.name || '' }}</text>
				</view>
				<view class="goods-list">
					<view class="goods-item" v-for="goods in orderInfo.goodsList">
						<image
							class="goods-image"
							:src="goods.goods_image ? getImagePath(goods.goods_image) : goods.image ? getImagePath(goods.image) : '../static/doctor_default.jpg'"
							mode=""
						></image>
						<view class="content">
							<view class="goods-name">{{ goods.goods_desc ? goods.goods_desc : goods.name || '' }}</view>
						</view>
						<view class="num">
							<view class="price">
								<text class="money-operate">￥</text>
								{{ goods.unit_price ? goods.unit_price : goods.price || '' }}
							</view>
							<view class="amount">x{{ goods.goods_amount ? goods.goods_amount : goods.car_num || '' }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="handler-bar">
			<text class="amount">共{{ totalAmount }}件</text>
			<text class="text">合计:</text>
			<text class="money-amount">
				<text class="money-operate">￥</text>
				<text>{{ totalMoney }}</text>
			</text>
			<button class="cu-btn bg-gradual-orange round" @click="submitOrder" v-if="orderInfo.order_state === '待提交'">提交订单</button>
			<button
				class="cu-btn bg-gradual-orange round"
				@click="toPay"
				v-if="orderInfo.order_state === '待支付' && (orderInfo.pay_state === '取消支付' || orderInfo.pay_state === '待支付')"
			>
				付款
			</button>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			orderNo: '', //订单编号
			orderInfo: {},
			addressInfo: {
				fullAddress: '陕西省西安市雁塔区太白南路'
			}
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
			loginUserInfo: state => state.user.loginUserInfo,
			cartInfo: state => state.order.cartInfo
		}),
		totalAmount() {
			if (Array.isArray(this.orderInfo.goodsList)) {
				return this.orderInfo.goodsList.reduce((pre, cur) => {
					if (cur.goods_amount) {
						pre += cur.goods_amount;
					}
					if (cur.car_num) {
						pre += cur.car_num;
					}
					return pre;
				}, 0);
			}
		},
		totalMoney() {
			if (Array.isArray(this.orderInfo.goodsList)) {
				return this.orderInfo.goodsList.reduce((pre, cur) => {
					if (cur.goods_amount && cur.unit_price) {
						pre += cur.goods_amount * cur.unit_price;
					} else if (cur.price && cur.car_num) {
						pre += cur.car_num * cur.price;
					}
					return pre;
				}, 0);
			}
		}
	},
	methods: {
		updateOrderState(order_state, pay_state, prepay_id) {
			let req = [
				{
					serviceName: 'srvhealth_store_order_update',
					condition: [{ colName: 'id', ruleType: 'eq', value: this.orderInfo.id }],
					data: [{ order_state: order_state }, { pay_state: pay_state }]
				}
			];
			if (prepay_id) {
				req[0].data.push({
					prepay_id: prepay_id
				});
			}
			this.$fetch('operate', 'srvhealth_store_order_update', req, 'health').then(res => {
				debugger;
			});
		},
		chooseAddress() {
			let self = this;
			// #ifdef MP-WEIXIN
			uni.chooseAddress({
				success(res) {
					self.addressInfo = res;
					self.addressInfo.phone = res.telNumber; // 手机号
					self.addressInfo.fullAddress = res.provinceName + res.cityName + res.countyName + res.detailInfo;
				}
			});
			// #endif
		},
		async getOrderInfo() {
			let req = {
				condition: [{ colName: 'order_no', ruleType: 'in', value: this.orderNo }]
			};
			let orderInfo = await this.$fetch('select', 'srvhealth_store_order_select', req, 'health');
			if (orderInfo && orderInfo.success && orderInfo.data.length > 0) {
				this.orderInfo = orderInfo.data[0];
				if (this.orderInfo.order_state === '待支付' && this.orderInfo.pay_state === '取消支付') {
					uni.setNavigationBarTitle({
						title: '等待买家付款'
					});
				}
				let goods = await this.getGoodsList();
				return this.orderInfo;
			}
		},
		async getGoodsList() {
			let req = {
				condition: [{ colName: 'order_no', ruleType: 'in', value: this.orderNo }]
			};
			let goodsList = await this.$fetch('select', 'srvhealth_store_order_goods_detail_select', req, 'health');
			if (goodsList.success) {
				this.$set(this.orderInfo, 'goodsList', goodsList.data);
			}
		},
		submitOrder() {
			let req = [
				{
					serviceName: 'srvhealth_store_order_add',
					condition: [],
					data: [
						{
							store_no: this.orderInfo.store_no,
							store_name: this.orderInfo.name,
							image: this.orderInfo.image,
							type: this.orderInfo.type,
							rcv_addr_str: this.addressInfo.fullAddress,
							rcv_name: this.addressInfo.userName,
							rcv_telephone: this.addressInfo.telNumber,
							person_no: this.userInfo.no,
							person_name: this.userInfo.name,
							user_account: this.userInfo.userno,
							nick_name: this.userInfo.nick_name,
							profile_url: this.userInfo.profile_url,
							user_image: this.userInfo.user_image,
							sex: this.userInfo.sex,
							user_role: this.userInfo.user_role,
							order_remark: '订单备注',
							pay_state: '待支付',
							order_state: '待支付',
							child_data_list: [
								{
									serviceName: 'srvhealth_store_order_goods_detail_add',
									condition: [],
									depend_keys: [{ type: 'column', add_col: 'order_no', depend_key: 'order_no' }],
									data: this.orderInfo.goodsList.map(item => {
										let obj = {
											food_no: item.meal_no,
											goods_amount: item.car_num,
											goods_desc: item.name,
											goods_image: item.image,
											store_no: this.orderInfo.store_no,
											sum_price: item.car_num * item.unit_price,
											unit_price: Number(item.price)
										};
										return obj;
									})
								}
							]
						}
					]
				}
			];
			this.$fetch('operate', 'srvhealth_store_order_add', req, 'health').then(res => {
				if (res.success && Array.isArray(res.data) && res.data.length > 0) {
					console.log(res.data[0]);
					this.orderNo = res.data[0].order_no;
					this.getOrderInfo().then(data => {
						this.toPay();
					});
				}
			});
		},
		async toPay() {
			let self = this;
			let orderData = this.deepClone(this.orderInfo);
			let goodsData = this.deepClone(this.orderInfo.goodsList);
			if (typeof this.totalMoney !== 'number' || this.totalMoney.toString() === 'NaN') {
				uni.showModal({
					title: '提示',
					content: '订单状态有误',
					showCancel: false
				});
				return;
			}
			let result = {};
			if (orderData.prepay_id) {
				result.prepay_id = orderData.prepay_id;
			} else {
				result = await this.toPlaceOrder(
					this.totalMoney ? this.totalMoney : 1,
					this.loginUserInfo && this.loginUserInfo.login_user_type ? this.loginUserInfo.login_user_type : '',
					orderData
				);
			}
			if (result && result.prepay_id) {
				let res = await this.getPayParams(result.prepay_id);
				wx.requestPayment({
					timeStamp: res.timeStamp.toString(),
					nonceStr: res.nonceStr,
					package: res.package,
					signType: 'MD5',
					paySign: res.paySign,
					success(res) {
						// 支付成功
						self.orderInfo.order_state = '待发货';
						self.updateOrderState('待发货', '已支付', result.prepay_id);
						self.orderInfo.pay_state = '已支付';
						uni.redirectTo({
							url: '/personalPages/successPay/successPay?order_no=' + orderData.order_no + '&totalMoney=' + self.totalMoney
						});
					},
					fail(res) {
						// 支付失败/取消支付
						self.orderInfo.pay_state = '取消支付';
						self.updateOrderState('待支付', '取消支付', result.prepay_id);
					}
				});
			}
		}
	},
	onLoad(option) {
		if (option.store_no && option.goods_info) {
			if (this.cartInfo[option.store_no]) {
				this.orderInfo = this.cartInfo[option.store_no].storeInfo;
				option.goods_info = JSON.parse(decodeURIComponent(option.goods_info));
				if(!option.goods_info.car_num){
					option.goods_info.car_num = 1
				}
				this.orderInfo.goodsList = [option.goods_info];
			}
		} else if (option.store_no) {
			// 从购物车进入 还未生成订单
			if (this.cartInfo[option.store_no] && Array.isArray(this.cartInfo[option.store_no].cart)) {
				this.orderInfo = this.cartInfo[option.store_no].storeInfo;
				this.orderInfo.goodsList = this.cartInfo[option.store_no].cart.map(item=>{
					if(!item.car_num){
						item.car_num = 1
					}
					return item
				});
				this.orderInfo.order_state = '待提交';
				this.orderInfo.pay_state = '待支付';
			}
		} else if (option.order_no) {
			this.orderNo = option.order_no;
			this.getOrderInfo();
		}
	}
};
</script>

<style lang="scss" scoped>
.pay-order {
	height: calc(100vh - var(--window-top));
	display: flex;
	flex-direction: column;
	.address-box {
		margin: 20rpx;
		padding: 20rpx;
		display: flex;
		background-color: #fff;
		border-radius: 10px;
		align-items: center;
		.left {
			height: 50px;
			width: 50px;
			text-align: center;
			line-height: 50px;
			font-size: 30px;
			background: linear-gradient(#ff9700, #ed1c24);
			color: #fff;
			border-radius: 50px;
		}
		.center {
			flex: 1;
			padding: 20rpx;
			.name {
				line-height: 30px;
				font-size: 16px;
				font-weight: bold;
			}
		}
		.right {
			font-size: 20px;
			color: #999;
		}
	}
	.order-detail {
		flex: 1;
	}
	.order-info {
		margin: 20rpx;
		margin-top: 0;
		background-color: #fff;
		padding: 20rpx 20rpx 40rpx;
		border-radius: 10px;
		.title-bar {
			padding: 20rpx 0 30rpx;
		}
		.store-logo {
			width: 20px;
			height: 20px;
		}
		.store-name {
			font-weight: bold;
			margin-left: 10rpx;
		}
		.goods-item {
			display: flex;
			& + .goods-item {
				margin-top: 20px;
			}
			.goods-image {
				width: 100rpx;
				height: 100rpx;
				background-color: #f1f1f1;
				border-radius: 5px;
			}
			.content {
				flex: 1;
				padding: 0 20rpx;
				font-weight: bold;
			}
			.num {
				width: 100px;
				text-align: right;
				margin-bottom: 5px;
				.price {
					font-weight: bold;
					color: #f76260;
					font-size: 18px;
					margin-bottom: 5px;
					.money-operate {
						font-size: 12px;
					}
				}
				.amount {
					font-size: 12px;
					color: #999;
				}
			}
		}
	}
	.handler-bar {
		background-color: #fff;
		height: 50px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		padding-right: 20rpx;
		.amount {
			font-size: 12px;
			color: #999;
			margin-right: 10px;
		}
		.text {
			font-weight: bold;
		}
		.money-amount {
			padding-right: 10px;
			font-size: 18px;
			color: orange;
			.money-operate {
				font-size: 12px;
			}
		}
	}
}
</style>
