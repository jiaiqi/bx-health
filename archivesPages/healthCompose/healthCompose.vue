<template>
	<view class="couple-wrap">
		<view class="couple-more-wrap">
			<view class="couple-more-top">
				<text></text>
				<text>健康总分构成</text>
			</view>
			<view class="more-couple-cen-wrap">
				<view class="couple-cen more-couple-cen">
					<view
						@click="clickItem(item)"
						v-for="(item, index) in coupleData"
						:key="index"
						:class="{
							'couple-cen-item-active': item.name === currentItem.name
						}"
						class="couple-cen-item"
					>
						<view v-if="item.name !== '其它'" class="couple-cen-item-t" :class="item.grade === 0 ? '' : item.grade >= 0 && item.grade <= 5 ? 'risk' : 'normal'">
							<text>{{ item.grade }}</text>
						</view>
						<view class="couple-cen-item-b">
							<text>{{ item.name }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			coupleData: [
				{
					name: '体重',
					grade: 10,
					no: '20201105104133000163',
					detail: {}
				},
				{
					name: '年龄',
					grade: 5,
					no: '20201105115153000168'
				},
				{
					name: '家族史',
					grade: 5,
					no: '20201105111540000164'
				},
				{
					name: '疾病史',
					grade: 5,
					no: '20201109095316000178'
				},
				{
					name: '饮食',
					grade: 15,
					no: '20201106142616000177'
				},
				{
					name: '运动',
					grade: 10,
					no: '20201109105128000186'
				},
				{
					name: '睡眠',
					grade: 10,
					no: '20201109104327000185'
				},
				{
					name: '吸烟情况',
					grade: 5,
					no: '20201109103435000184'
				},
				{
					name: '饮酒情况',
					grade: 3,
					no: '20201109103435000184'
				},
				{
					name: '心理',
					grade: 5,
					no: '20201109103435000184'
				}
			],
			currentItem: {},
			currIndex: 0
		};
	},
	methods: {
		clickItem(item) {
			if (item.name === this.currentItem.name) {
				this.currentItem = {};
			} else {
				this.currentItem = item;
			}
		},
		async selectQuestion() {
			let self = this;
			let url = this.getServiceUrl('daq', 'srvdaq_record_reply_select', 'select');
			let req = {
				serviceName: 'srvdaq_record_reply_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'activity_no',
						ruleType: 'eq',
						value: this.currentItem.no
					},
					{
						colName: 'user_no',
						ruleType: 'eq',
						value: uni.getStorageSync('login_user_info').user_no
					},
					{
						colName: 'state',
						ruleType: 'eq',
						value: '完成'
					}
				]
			};
			let res = await this.$http.post(url, req);
			return res.data.data;
		}
	},
	onLoad() {}
};
</script>

<style lang="scss" scoped>
.couple-wrap {
	background-color: white;
	min-height: 100vh;
	.couple-cen {
		display: grid;
		grid-template-columns: repeat(3, calc(33.33% - 20rpx));
		grid-row-gap: 20rpx;
		grid-column-gap: 20rpx;
		position: relative;
		margin-left: 20rpx;
		transition: all 1s;
		.couple-cen-item {
			height: 170rpx;
			box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
			border-radius: 14rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			padding: 20rpx 0;
			border: 1px solid transparent;
			.couple-cen-item-t {
				font-size: 72rpx;
				color: #ccc;
				font-weight: 600;
			}
			.risk {
				color: #e54d42;
			}
			.normal {
				color: #39b54a;
			}
			.couple-cen-item-b {
				font-size: 32rpx;
				font-weight: 700;
			}
		}
		.couple-cen-item-active {
			height: 300rpx;
			z-index: 10;
			background-color: #fff;
			grid-column-start: 1;
			grid-column-end: 4;
			grid-row-start: 1;
			animation: 1s overview;
		}
	}
	@keyframes overview {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	.couple-more-wrap {
		.couple-more-top {
			padding: 15px;
			font-size: 16px;
			font-weight: 800;
			display: flex;
			align-items: center;
			text {
				&:first-child {
					width: 8rpx;
					height: 32rpx;
					background-color: #0081ff;
					border-radius: 8rpx;
					margin-right: 10rpx;
				}
			}
		}
	}
}
</style>
