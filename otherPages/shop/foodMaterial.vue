<template>
	<view class="material-wrap">
		<view class="shop-detail-bot-b">
			<view class="shop-detail-bot-b-t"><text>食材管理</text></view>
			<view class="shop-detail-bot-tab">
				<view class="shop-detail-bot-tab-t">
					<text>食材名称</text>
					<text>食材含量</text>
					<text>操作</text>
				</view>
				<view v-if="foodChild.length > 0" class="shop-detail-bot-tab-m">
					<view v-for="(item, index) in foodChild" :key="index" class="shop-detail-bot-tab-m-item">
						<text>{{ item.name }}</text>
						<text>{{ item.unit_amount }}{{ item.unit }}</text>
						<view @click="del(item)" class="operation-food"><text>删除</text></view>
					</view>
				</view>
				<view v-else class="detail-none">
					<view class="detail-none-t">
						<image src="/otherPages/static/img/noneData.png" mode=""></image>
						<text>暂无数据</text>
					</view>
				</view>
			</view>
		</view>
		<view class="public-button-box"><view @click="addFoods" class="add-button"></view></view>
	</view>
</template>

<script>
export default {
	name: 'material',
	data() {
		return {
			currFood: '',
			foodChild: ''
		};
	},
	methods: {
		/* 获取当前食物得食材含量**/
		async getMixChildFood() {
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_mixed_food_nutrition_item_select', 'select');
			let req = {
				serviceName: 'srvhealth_mixed_food_nutrition_item_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'meal_no',
						ruleType: 'eq',
						value: this.currFood.meal_no
					}
				]
			};
			let res = await this.$http.post(url, req);
			let data = res.data.data;
			if (data.length >= 0) {
				this.foodChild = data;
			}
		},
		del(item) {
			let self = this;
			uni.showModal({
				title: '提示',
				content: '是否确认删除?',
				success: res => {
					if (res.confirm) {
						self.delFood(item);
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		async delFood(item) {
			let url = this.getServiceUrl('health', 'srvhealth_mixed_food_nutrition_item_delete', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_mixed_food_nutrition_item_delete',
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
			let res = await this.$http.post(url, req);
			if (res.data.resultCode === 'SUCCESS') {
				this.getMixChildFood();
			}
		},
		addFoods() {
			let cond = [
				{
					colName: 'meal_no',
					ruleType: 'eq',
					value: this.currFood.meal_no
				},
				{
					colName: 'unit',
					ruleType: 'eq',
					value: ''
				}
			];
			uni.navigateTo({
				url: '/publicPages/newForm/newForm?serviceName=srvhealth_mixed_food_nutrition_item_add&type=add&fieldsCond=' + decodeURIComponent(JSON.stringify(cond))
			});
		}
	},
	onLoad(option) {
		this.currFood = JSON.parse(decodeURIComponent(option.itemFood));
		this.getMixChildFood();
	},
	onShow() {
		if (this.currFood) {
			this.getMixChildFood();
		}
	}
};
</script>

<style lang="scss" scoped>
.material-wrap {
	min-height: 100vh;
	background-color: white;
}
.shop-detail-bot-b {
	background-color: white;
	.shop-detail-bot-b-t {
		font-weight: 600;
		margin-left: 20upx;
		padding: 20upx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		text {
			&:last-child {
				margin-right: 20upx;
				font-size: 36upx;
			}
		}
	}
	.shop-detail-bot-tab {
		min-height: 300upx;
		.shop-detail-bot-tab-t {
			display: flex;
			justify-content: space-around;
			background-color: rgb(240, 240, 240);
			padding: 5px 0;
			width: 95%;
			margin: 0 auto;
			text {
				width: 33%;
				text-align: center;
			}
		}
		.shop-detail-bot-tab-m {
			.shop-detail-bot-tab-m-item {
				display: flex;
				justify-content: space-around;
				padding: 10px 0;
				border-bottom: 1px solid #f2f3f3;
				width: 95%;
				margin: 0 auto;
				text {
					width: 33%;
					text-align: center;
				}
				&:last-of-type {
					border-bottom: none;
				}
			}
			.operation-food {
				width: 33%;
				text-align: center;
				text {
					color: red;
				}
			}
		}
		.detail-none {
			.detail-none-t {
				min-height: calc(100vh - 160upx);
				display: flex;
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
	}
}
.add-button {
	position: fixed;
	bottom: 100upx;
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
</style>
