<template>
	<view class="my-food-list-wrap">
		<view class="my-food-list-top">
			<text></text>
			<text>我的饭菜</text>
		</view>
		<view class="my-food-list-main">
			<view class="my-food-list-main-item">
				<view @click="toFoodDetail(item)" v-for="(item, index) in foodList" :key="index" class="smallbox">
					<view class="smallbox-img">
						<image width="100%" height="100%" v-if="!item.imgurl" src="/otherPages/static/img/none.png"></image>
						<image width="100%" height="100%" v-else :src="item.imgurl"></image>
					</view>

					<view class="textbox">
						<view class="title-food">{{ item.name }}</view>
						<!-- <view v-if="lockEledata " class="lock-ele">
							(
							<text>{{ lockEledata.label }}:</text>
							<text class="second-lock">{{ food[lockEledata.key] }}</text>
							<text class="second-lock">{{ lockEledata.units ? lockEledata.units.split('/')[0] : '' }}</text>
							)
						</view> -->
						<view class="food-utis">
							<text class="number" style="margin-right: 5px;">{{ item.unit_energy }}千卡</text>
							<text class="utis">/{{ item.unit_amount + item.unit }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view v-if="foodList.length === 0" class="my-food-list-main-no">
			<view class="my-food-list-main-no-m">
				<text>还没有添加饭菜，快去</text>
				<text @click="addFood">添加</text>
			</view>
		</view>
		<view class="public-button-box">
			<view @click="addFood" class="add-button">
				<!-- <u-icon name="plus"></u-icon> -->
				<text class="cuIcon-add"></text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'myFoodList',
	data() {
		return {
			foodList: []
		};
	},
	onShow() {
		this.getFoodList();
	},
	methods: {
		addFood() {
			let cond = [
				{
					colName: 'restaurant_no',
					ruleType: 'eq',
					value: ''
				}
			];
			uni.navigateTo({
				url: '/publicPages/newForm/newForm?serviceName=srvhealth_mixed_food_nutrition_contents_add&type=add'
				// url: '/publicPages/form/form?serviceName=srvhealth_mixed_food_nutrition_contents_add&type=add&addType=onwer&cond='+decodeURIComponent(JSON.stringify(cond))
			});
		},
		async getFoodList() {
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_mixed_food_nutrition_contents_select', 'select');
			let req = {
				serviceName: 'srvhealth_mixed_food_nutrition_contents_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'restaurant_no',
						ruleType: 'isnull',
						value: ''
					},
					{
						colName: 'create_user',
						ruleType: 'eq',
						value: uni.getStorageSync('current_user_info').userno
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (res.data.data.length > 0) {
				res.data.data.forEach(item => {
					let urls = self.$api.downloadFile + item.image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket') + '&thumbnailType=fwsu_100';
					this.$set(item, 'imgurl', urls);
				});
			}
			this.foodList = res.data.data;
			console.log('res-------', res.data.data);
		},
		toFoodDetail(item) {
			let food = encodeURIComponent(JSON.stringify(item));
			uni.navigateTo({
				url: '/otherPages/chooseFood/chooseFood?currFood=' + food
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.my-food-list-wrap {
	height: 100vh;
	.my-food-list-top {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: white;
		text {
			font-size: 32rpx;
			font-weight: 700;
			&:first-child {
				width: 8rpx;
				height: 32rpx;
				background-color: #0081ff;
				margin-right: 10rpx;
			}
		}
	}
	.my-food-list-main {
		.my-food-list-main-item {
			display: flex;
			flex-wrap: wrap;
			.smallbox {
				align-items: center;
				display: flex;
				flex-direction: column;
				width: 100%;
				border-top: 1upx solid #e8e8e8;
				// padding: 25upx 0;
				background: #ffffff;
				width: 23%;
				// flex:1;
				margin: 20upx 10upx 0 0;
				height: 100% !important;
				display: flex;
				align-items: center;
				position: relative;
				flex-wrap: wrap;
				padding-right: 0 !important;
				border-radius: 20upx;
				&:nth-child(4n + 1) {
					margin-left: 14upx;
				}
				.smallbox-img {
					width: 100%;
					height: 100upx;
					image {
						width: 100%;
						height: 100upx;
						border-radius: 8upx;
					}
					/deep/ .u-image__image {
						div {
							background-size: 100% 100% !important;
						}
					}
				}

				.textbox {
					width: 100%;
					padding: 10upx 4upx;
					.title-food {
						font-weight: bold;
						font-size: 30upx;
						display: flex;
						justify-content: center;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
						text-align: center;
					}
					.lock-ele {
						margin-left: 5px;
						.second-lock {
							color: #dc2a26;
						}
					}
					.food-utis {
						margin-top: 6upx;
						font-size: 24upx;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
						.utis {
							color: #807d7d;
						}
						.number {
							color: #dc2a26;
						}
					}
				}
			}
		}
	}
	.my-food-list-main-no {
		width: 36%;
		margin: 0 auto;
		text-align: center;
		height: calc(100vh - 80rpx);
		font-size: 30rpx;
		font-weight: 700;
		display: flex;
		align-items: center;
		text {
			&:last-child {
				color: #0081ff;
			}
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
}
</style>
