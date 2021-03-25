<template>
	<view class="page-wrap">
		<image src="../../static/img/successPay.png" mode="aspectFit"></image>
		<view class="text">
			<text class="cuIcon-roundcheckfill text-green margin-right-xs"></text>
			支付成功
		</view>
		<view class="button-box">
			<button class="cu-btn line-grey text-black round sm margin-right" @click="toHome">返回首页</button>
			<button class="cu-btn line-grey text-black round sm" @click="toDetail">查看订单</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			order_no: ''
		};
	},
	methods: {
		toHome() {
			uni.switchTab({
				url: '/pages/pedia/pedia',
				fail() {
					uni.redirectTo({
						url: '/pages/pedia/pedia'
					})
				}
			});
		},
		toDetail() {
			uni.redirectTo({
				url: '/personalPages/payOrder/payOrder?order_no=' + this.order_no
			});
		}
	},
	onLoad(option) {
		if (option.order_no) {
			this.order_no = option.order_no;
		}
	}
};
</script>

<style lang="scss" scoped>
.page-wrap {
	background-color: #fff;
	height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	.text {
		font-size: 20px;
		font-weight: bold;
		margin-bottom: 30px;
	}
}
</style>
