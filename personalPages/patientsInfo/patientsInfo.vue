<template>
	<view class="health-archive-wrap">
		<view class="health-archive-item basic-info"></view>
		<view class="health-archive-item health-score">
			<view class="subtitle">
				<text class="title-text">近日健康指数</text>
				<view class="title-action" @click="navPages('history')">
					<text class="cuIcon-time"></text>
					<text class="see-histroy">查看历史</text>
				</view>
			</view>
			<view class="content grid-layout">
				<view class="grid-item" @click="toPages('diet')">
					<view class="title">饮食</view>
					<view class="data text-green">71</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('sport')">
					<view class="title">运动</view>
					<view class="data text-red">20</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('weight')">
					<view class="title">体重</view>
					<view class="data text-gray">0</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('bp')">
					<view class="title">血压</view>
					<view class="data text-gray">0</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="toPages('sleep')">
					<view class="title">睡眠</view>
					<view class="data text-blue">85</view>
					<view class="action"></view>
				</view>
				<view class="grid-item">
					<view class="title">症状</view>
					<view class="data text-orange">45</view>
					<view class="action"></view>
				</view>
			</view>
		</view>
		<view class="health-archive-item ">
			<view class="subtitle">
				<text class="title-text">疾病风险提示</text>
				<view class=""></view>
			</view>
			<view class="content disease-risk">
				<view class="disease-item text-red">
					<view class="disease-name">高血压</view>
					<view class="number">
						<!-- 风险: -->
						<text class="digit">90</text>
						%
					</view>
				</view>
				<view class="disease-item text-orange">
					<view class="disease-name">肥胖</view>
					<view class="number">
						<!-- 风险: -->
						<text class="digit">75</text>
						%
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
			customer_no: '',
			userInfo: {}
		};
	},
	computed: {
		avatorPath(){
			return this.$api.downloadFile + this.userInfo.profile_url + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
		}
	},
	methods: {
		async getUserInfo(customer_no) {
			let url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'no', ruleType: 'eq', value: customer_no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.userInfo = res.data.data[0];
				return res.data.data[0];
			}
		}
	},
	onLoad(option) {
		if (option.customer_no) {
			this.customer_no = option.customer_no;
			this.getUserInfo(option.customer_no);
		}
	},
	onShow() {}
};
</script>

<style scoped lang="scss">
.health-archive-wrap {
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;
	background-color: #f1f1f1;
	padding-bottom: 20rpx;
	max-width: 1080rpx;
	margin: 0 auto;
	.health-overall-score {
		width: calc(100% - 40rpx);
		margin: 0 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		.content {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			overflow: hidden;
			// flex-direction: column;
			flex: 1;
			.uni-ec-charts {
				width: 400rpx;
				height: 400rpx;
			}
			.separator {
				font-size: 100rpx;
				height: 160rpx;
				display: flex;
				align-items: flex-end;
			}
			.score-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				color: #333;
				border-radius: 20rpx;
				width: 300rpx;
				height: 300rpx;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
				background-color: #fff;
				box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
				position: relative;
				&:last-child {
					margin-right: 0;
				}
				.label {
					font-size: 30rpx;
					font-weight: 600;
					text-align: center;
					letter-spacing: 2px;
				}
				.value {
					font-size: 150rpx;
				}
				.trend {
					transform: rotate(180deg) scale(1, 1.5);
					font-size: 60rpx;
					position: absolute;
					bottom: 50%;
					right: 10%;
				}
			}
		}
	}
	.health-archive-item {
		display: flex;
		flex-wrap: wrap;
		margin: 20rpx 20rpx 0;
		padding: 20rpx;
		border-radius: 20rpx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		background-color: #fff;
		.subtitle {
			width: 100%;
			font-size: 32rpx;
			font-weight: bold;
			margin-bottom: 20rpx;
			position: relative;
			text-indent: 20rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			.title-text {
				margin: 0;
				padding: 0;
				display: inline-block;
				position: relative;
				&::before {
					content: '';
					position: absolute;
					left: 0;
					height: 100%;
					width: 5px;
					background-color: #0081ff;
					border-radius: 5rpx;
				}
			}
			.title-action {
				display: flex;
				justify-content: center;
				align-items: center;
				padding-right: 20rpx;
				height: 60rpx;
				border-radius: 50rpx;
				border: 1px solid #f1f1f1;
				transition: all 1s;
				&:active {
					background-color: #999;
					color: #fff;
				}
				.see-histroy {
					font-size: 24rpx;
				}
			}
		}
		.content {
			width: 100%;
			min-height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: bold;
			&.grid-layout {
				display: grid;
				grid-template-columns: repeat(3, calc(33.33% - 20rpx));
				grid-row-gap: 20rpx;
				grid-column-gap: 20rpx;
				.grid-item {
					border-radius: 10rpx;
					display: flex;
					height: 150rpx;
					box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
					padding: 10rpx;
					flex-direction: column;
					.title {
						text-align: left;
					}
					.data {
						flex: 1;
						font-size: 60rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.action {
						font-size: 24rpx;
						color: #999;
						text-align: right;
					}
				}
			}
			&.disease-risk {
				display: grid;
				grid-template-columns: repeat(3, calc(33.33% - 20rpx));
				grid-row-gap: 20rpx;
				grid-column-gap: 20rpx;
				.disease-item {
					padding: 10rpx 20rpx;
					border: 1px solid #999;
					display: flex;
					flex-direction: column;
					border-radius: 20rpx;
					min-height: 150rpx;
					&.text-red {
						border-color: #e54d42;
					}
					&.text-orange {
						border-color: #f37b1d;
					}
					.disease-name {
						font-size: 32rpx;
						flex: 1;
						// color: #666;
					}
					.number {
						font-size: 26rpx;
						min-width: 100rpx;
						flex: 1;
						text-align: center;
						.digit {
							font-size: 60rpx;
						}
					}
				}
			}
		}
	}
}
.health-item {
	min-height: 150rpx;
	display: flex;
	padding: 50rpx 30rpx;
	display: flex;
	flex-direction: column;
	.tips {
		color: #999;
		padding: 20rpx 0;
	}
	.check-box-group {
		display: flex;
		flex-wrap: wrap;
		.check-box-item {
			margin-right: 20rpx;
			min-width: 30%;
		}
	}
}
.user-list {
	min-height: 300rpx;
	padding: 50rpx 30rpx 30rpx;
	.user-item {
		text-indent: 40rpx;
		display: flex;
		align-items: center;
		font-weight: bold;
		font-size: 34rpx;
		padding: 30rpx 20rpx 10rpx;
		border-bottom: 1rpx solid #f1f1f1;
		transition: all 0.5s;
		.avatar {
			margin-right: 20rpx;
		}
		&:active {
			background-color: #f1f1f1;
		}
	}
}
.button-box {
	width: 100%;
	padding: 30rpx;
	font-weight: bold;
	text-align: center;
	.cu-btn {
		margin-right: 50rpx;
		&:last-child {
			margin-right: 0;
		}
	}
}
</style>
