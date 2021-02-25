<template>
	<view class="order-bar ">
		<view class="container-title" @click="toPages('order-list')">
			<view class="label">我的订单</view>
			<view class="arrow">
				<text> 查看全部</text> <text class="cuIcon-right"></text>
			</view>
		</view>
		<view class="container-cen-top-list" @click="toPages(item.type)" v-for="item in orderGridList">
			<text class="icon" :class="'cuIcon-'+item.icon">
			</text>
			<text class="label">{{item.label}}</text>
			<text class="badge" v-if="item.amount">{{item.amount>99?'99+':item.amount}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderGridList: [{
						label: '待支付',
						type: "order-unpaid",
						icon: 'sponsor',
						amount: 0
					},
					{
						label: '待发货',
						type: "order-deliver",
						icon: 'send',
						amount: 0
					},
					{
						label: '待收货',
						type: "order-receiving",
						icon: 'deliver',
						amount: 0
					},
					{
						label: '已完成',
						type: "order-finish",
						icon: 'goods',
						amount: 0
					}
				]
			}
		},
		methods: {
			toPages(e) {
				this.$emit('toPages', e)
			},
			async selectOrderCount() {
				let req = {
					group: [{
							colName: 'order_state',
							type: 'by'
						},
						{
							colName: 'order_no',
							type: 'count',
							aliasName: 'amount'
						}
					]
				}
				let res = await this.$fetch('select', 'srvhealth_store_order_select', req, 'health')
				this.orderGridList = this.orderGridList.map(item => {
					res.data.forEach(data => {
						if (data.order_state === item.label) {
							item.amount = data.amount
						}
					})
					return item
				})
				this.$emit('change',this.orderGridList)
			},
		},
		created() {
			this.selectOrderCount()
		}
	}
</script>

<style lang="scss" scoped>
	.order-bar {
		display: flex;
		flex-wrap: wrap;
		margin: 20rpx;
		margin-top: 0;
		border-radius: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		background-color: #fff;

		.container-title {
			width: 100%;
			display: flex;
			justify-content: space-between;
			padding: 10rpx 20rpx;
			.arrow {
				font-size: 12px;
				color: #777;
			}
		}
		.container-cen-top-list {
			padding: 20rpx;
			display: flex;
			flex-direction: column;
			flex: 1;
			justify-content: center;
			align-items: center;
			transition: all 0.2s ease;
			position: relative;
			&+.container-cen-top-list {
				&::before {
					content: '';
					position: absolute;
					left: 0;
					height: 40%;
					width: 1px;
					background-color: #f1f1f1;
				}
			}

			&:active {
				background-color: #f1f1f1;
			}

			.badge {
				position: absolute;
				font-size: 12px;
				width: 20px;
				height: 20px;
				line-height: 20px;
				text-align: center;
				border-radius: 50%;
				background-color: #ff0000;
				// border: 1px solid #ff0000;
				color: #fff;
				top: 5px;
				right: 10px;
			}

			.icon {
				font-size: 30px;
			}
		}
	}
</style>
