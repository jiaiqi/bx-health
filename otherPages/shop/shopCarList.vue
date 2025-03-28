<template>
	<view class="car-list-wrap">
		<view v-if="shopCarData.length > 0" class="car-main">
			<view v-for="item in shopCarData" class="car-main-item">
				<view @click="choseItem(item)" class="item-left-wrap">
					<view class="item-left">
						<label class="radio"><radio :checked="item.iSchoose" value="1" /></label>
					</view>
					<view class="item-right">
						<view class="item-right-l"><image :src="getImagePath(item.image)" mode="aspectFill"></image></view>
						<view class="item-right-r">
							<view class="item-right-r-t">
								<text>{{ item.name }}</text>
							</view>
							<view class="item-right-r-b">
								<view class="item-l">
									<text>￥</text>
									<text>{{ item.price }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="counter">
					<uni-number-box :min="0" :max="99" @change="valueChange($event, item)" :value="item.car_num"></uni-number-box>
					<!-- <u-number-box @minus="subtract(item)" @plus="adds(item)" :max="100" :min="1" v-model="item.car_num"></u-number-box> -->
				</view>
			</view>
		</view>
		<view v-else class="none-data"><text>还没有添加任何商品，快去添加吧</text></view>
		<view class="car-bot">
			<view class="car-bot-l">
				<view @click="checkAllCar" class="check_all">
					<label class="radio"><radio :checked="checkAll" value="1" /></label>
					<text>全选</text>
				</view>
				<view class="shop_bottom_left">
					<text>总计:</text>
					<text>￥</text>
					<text>{{ totalPrice }}</text>
				</view>
			</view>

			<view :class="isShowDel ? '' : 'none_shop_bottom_rig'" class="shop_bottom_rig">
				<text @click="del">删除所选</text>
				<text @click="payOrder">结算({{ chooseCarData.length > 0 ? chooseCarData.length : 0 }})</text>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	name: 'shopCarList',
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
			loginUserInfo: state => state.user.loginUserInfo,
			cartInfo: state => state.order.cartInfo
		}),
		totalPrice() {
			return this.chooseCarData.reduce((pre, cur) => {
				return pre + cur.price * cur.car_num;
			}, 0);
		}
	},
	data() {
		return {
			restaurant_no: '',
			iSchoose: false,
			checkAll: false,
			total: 0,
			value: 1,
			isShowDel: false,
			shopCarData: [], //购物车数据
			chooseCarData: [],
			orderData: {}
		};
	},
	watch: {
		shopCarData: {
			handler(newValue, oldValue) {},
			deep: true
		},
		chooseCarData: {
			handler(newValue, oldValue) {
				if (newValue.length > 0) {
					this.isShowDel = true;
				} else {
					this.isShowDel = false;
				}
			},
			deep: true
		}
	},
	methods: {
		valueChange(e, item) {
			this.$set(item, 'car_num', e);
			uni.setStorageSync('shop_car', this.shopCarData);
		},
		payOrder() {
			if (this.chooseCarData.length > 0) {
				// this.generateOrder();
				uni.navigateTo({
					url:'/personalPages/payOrder/payOrder?store_no=' + this.restaurant_no
				})
			}
		},
		async generateOrder() {
			let goods = this.deepClone(this.chooseCarData);
			goods = goods.map(item => {
				let obj = {
					food_no: item.meal_no,
					unit_price: item.price,
					goods_amount: item.car_num,
					sum_price: item.price * item.car_num,
					goods_desc: item.name
				};
				return obj;
			});
			let req = [
				{
					serviceName: 'srvhealth_store_order_add',
					condition: [],
					data: [
						{
							store_no: 'RT202011101738480007',
							store_name: '张记肉夹馍',
							type: '饭馆',
							person_no: this.userInfo.no,
							person_name: this.userInfo.name,
							user_account: this.userInfo.userno,
							nick_name: this.userInfo.nick_name?this.userInfo.nick_name.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, ""):'',
							sex: this.userInfo.sex,
							pay_state: '待支付',
							child_data_list: [
								{
									serviceName: 'srvhealth_store_order_goods_detail_add',
									condition: [],
									depend_keys: [{ type: 'column', add_col: 'order_no', depend_key: 'order_no' }],
									data: goods
								}
							]
						}
					]
				}
			];
			let res = await this.$fetch('operate', 'srvhealth_store_order_add', req, 'health');
			if (res.success === true && res.data.length > 0) {
				let orderData = res.data[0];
				if (orderData.order_no) {
					;
					// if (orderData.order_no.length > 24 && orderData.order_no.indexOf('RT') !== -1) {
					uni.navigateTo({
						url: '/personalPages/payOrder/payOrder?order_no=' + orderData.order_no
					});
					// }
				}
				// this.toPay(orderData, goods);
			}
		},
		async toPay(orderData, goodsData) {
			let moneyAmount = 0;
			if (Array.isArray(goodsData)) {
				goodsData.forEach(item => {
					moneyAmount += item.sum_price;
				});
			}
			let result = await this.toPlaceOrder(
				moneyAmount ? moneyAmount : 1,
				this.loginUserInfo && this.loginUserInfo.login_user_type ? this.loginUserInfo.login_user_type : '',
				orderData
			);
			let res = await this.getPayParams(result.prepay_id);
			wx.requestPayment({
				timeStamp: res.timeStamp.toString(),
				nonceStr: res.nonceStr,
				package: res.package,
				signType: 'MD5',
				paySign: res.paySign,
				success(res) {
					;
					// 支付成功
				},
				fail(res) {
					;
				}
			});
		},
		subtract(item) {
			if (item.iSchoose) {
				this.total = this.total - Number(item.price);
			}
			uni.setStorageSync('shop_car', this.shopCarData);
		},
		adds(item) {
			if (item.iSchoose) {
				this.total = this.total + Number(item.price);
			}
			uni.setStorageSync('shop_car', this.shopCarData);
		},
		choseItem(item) {
			item.iSchoose = !item.iSchoose;
			let carData = this.shopCarData;
			let isChoose = false;
			carData.forEach(item => {
				if (!item.iSchoose) {
					isChoose = true;
				}
			});
			if (!isChoose) {
				this.checkAll = true;
			} else {
				this.checkAll = false;
			}
			if (item.iSchoose) {
				this.total = this.total + Number(item.price) * item.car_num;
				this.chooseCarData.push(item);
			} else {
				this.total = this.total - Number(item.price) * item.car_num;
				this.chooseCarData.forEach((car, i) => {
					if (car.id === item.id) {
						this.chooseCarData.splice(i, 1);
					}
				});
			}
		},
		checkAllCar() {
			let shopData = this.shopCarData;
			this.checkAll = !this.checkAll;
			if (shopData.length > 0) {
				let data = [];
				if (this.checkAll) {
					this.total = 0;
				}
				shopData.forEach(item => {
					if (this.checkAll) {
						item.iSchoose = true;
						this.total = this.total + Number(item.price) * item.car_num;
						data.push(item);
					} else {
						item.iSchoose = false;
						this.total = 0;
					}
				});
				this.chooseCarData = data;
			}
		},
		del() {
			let chooseCarData = this.chooseCarData;
			let shopCarData = this.shopCarData;
			if (this.checkAll) {
				this.chooseCarData = [];
				this.shopCarData = [];
				this.checkAll = false;
			} else {
				if (chooseCarData.length > 0) {
					shopCarData.forEach((item, i) => {
						chooseCarData.forEach((dels, n) => {
							if (item.id === dels.id) {
								shopCarData.splice(i, 1);
								chooseCarData.splice(n, 1);
							}
						});
					});
					if (chooseCarData.length > 0) {
						chooseCarData.forEach(I => {
							// this.total =
						});
					}
				}
			}
			uni.setStorageSync('shop_car', this.shopCarData);
		}
	},
	onLoad(option) {
		if (option.restaurant_no) {
			this.restaurant_no = option.restaurant_no;
		}
		if (option.store_no) {
			this.restaurant_no = option.store_no;
		}
		let shopCarData = this.cartInfo[this.restaurant_no];
		if (shopCarData && Array.isArray(shopCarData.cart)) {
			shopCarData.cart.forEach(item => {
				// this.$set(item,'iSchoose',false)
				item['iSchoose'] = false;
				item.imgurl = this.getImagePath(item.image);
				// this.$api.downloadFile + item.image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket')+"&thumbnailType=fwsu_100";
			});
			this.shopCarData = shopCarData.cart;
		}
	}
};
</script>

<style lang="scss" scoped>
.car-list-wrap {
	min-height: calc(100vh - var(--window-top));
	background-color: #fafafa;
	.car-main {
		// 1px solid transparent
		border-top: 1px solid transparent;
		.car-main-item {
			display: flex;
			background-color: #ffffff;
			padding: 20upx 30upx;
			margin: 30upx 30upx 0 30upx;
			border-radius: 20upx;
			box-shadow: 0px 0px 3px rgba(26, 26, 26, 0.2);
			align-items: center;
			justify-content: space-between;
			.item-left-wrap {
				display: flex;
				align-items: center;
				.item-left {
					.radio {
						::v-deep .uni-radio-input {
							width: 40upx;
							height: 40upx;
						}
						::v-deep uni-radio::before {
							right: 6upx;
						}
					}
				}
			}

			.item-right {
				display: flex;
				margin-left: 15upx;
				.item-right-l {
					image {
						width: 100upx;
						height: 100upx;
					}
				}
				.item-right-r {
					margin-left: 10upx;
					display: flex;
					flex-direction: column;
					justify-content: space-around;
					.item-right-r-t {
						text {
							font-weight: 700;
							font-size: 32upx;
						}
					}
					.item-right-r-b {
						.item-l {
							text {
								&:first-child {
									color: #e95f07;
									font-weight: 700;
									font-size: 24upx;
								}
								&:last-child {
									color: #e95f07;
									font-weight: 700;
									font-size: 36upx;
								}
							}
						}
					}
				}
			}
		}
	}
	.none-data {
		color: #ccc;
		font-size: 32upx;
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100vh - 100upx);
	}
}
.car-bot {
	position: absolute;
	bottom: 0;
	z-index: 10;
	background-color: white;
	border-top: 2px solid #dee0e2;
	width: 100%;
	display: flex;
	justify-content: space-between;
	padding: 20upx 30upx;
	align-items: center;
	.car-bot-l {
		display: flex;
		.check_all {
			margin-right: 30upx;
			.radio {
				margin-right: 10upx;
				::v-deep .uni-radio-input {
					width: 40upx;
					height: 40upx;
				}
				::v-deep uni-radio::before {
					right: 6upx;
				}
			}
		}
		.shop_bottom_left {
			text {
				&:nth-child(2) {
					font-size: 24upx;
					color: red;
				}
				&:nth-child(3) {
					font-size: 36upx;
					font-weight: 700;
					color: red;
				}
			}
		}
	}

	.shop_bottom_rig {
		display: flex;
		align-items: center;
		text {
			&:first-child {
				border-radius: 30upx;
				background-color: red;
				padding: 10upx 30upx;
				color: #ffffff;
				margin-right: 10upx;
			}
			&:last-child {
				border-radius: 30upx;
				background-color: red;
				padding: 10upx 30upx;
				color: #ffffff;
				background-image: linear-gradient(45deg, #ffc73c, #ffa230);
			}
		}
	}
	.none_shop_bottom_rig {
		text {
			&:first-child {
				background-color: #ccc;
			}
		}
	}
}
</style>
