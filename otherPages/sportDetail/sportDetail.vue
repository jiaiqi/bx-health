<template>
	<view class="sport-wrap">
		<view class="picker">
			<picker class="date-picker" mode="date" :value="date" :start="startDate" :end="endDate" @change="changeDate">
				<view class="uni-input">
					<text class="u-margin-10">{{ date }}</text>
					<u-icon name="arrow-down-fill margin-left" color="#333" size="28"></u-icon>
				</view>
			</picker>
		</view>
		<view class="foot-num">
			<view class="title">步数</view>
			<view class="content">
				<view class="number">
					<text class="actually">{{ stepData.step }}</text>
					<text class="target">/{{ targetStepNumbers }}步</text>
				</view>
				<view class="status">
					<text class="cuIcon-check text-green" :style="{ borderColor: '#39b54a' }"></text>
					<text class="text-green u-margin-10">完成度{{ finishRatio }}</text>
				</view>
			</view>
		</view>
		<view class="foot-status">
			<view class="qiangdu">
				<view class="title">中高强度</view>
				<view class="status">
					<text class="value">
						44
						<text class="unit">分钟</text>
					</text>
					<text class="tag bg-green light round">充足</text>
				</view>
			</view>
			<view class="xiaohao">
				<view class="title">消耗</view>
				<view class="status">
					<text class="value">
						423
						<text class="unit">千卡</text>
					</text>
					<text class="tag bg-green light round">充足</text>
				</view>
			</view>
		</view>
		<view class="foot-record">
			<text class="title">运动记录</text>
			<view class="record-item" v-for="(item, index) in stepRecord" :key="index">
				<view class="column">{{ item.htime ? item.htime.slice(0, 5) : '' }}</view>
				<view class="column">{{ item.name }}</view>
				<view class="column">{{ item.amount + item.unit }}</view>
				<view class="column">{{ item.energy }}千卡</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			date: '',
			currentUser: null,
			userInfo: null,
			srvInfo: {},
			stepRecord: [],
			wxRunData: {},
			stepInfoList: null,
			targetStepNumbers: 6000, //目标步数
			stepData: {
				step: 0
			}
		};
	},
	computed: {
		finishRatio() {
			return this.stepData.step ? (this.stepData.step * 100) / this.targetStepNumbers + '%' : '0%';
		},
		startDate() {
			return this.getDate('start');
		},
		endDate() {
			return this.getDate('end');
		}
	},
	methods: {
		changeDate(e) {
			// 切换日期
			let date = e.detail.value;
			this.date = date;
			let stepData = this.getDayStepInfo(date);
			if (stepData && stepData.step) {
				this.stepData = stepData;
			}
		},
		getDayStepInfo(date) {
			let stepInfoList = this.stepInfoList;
			if (Array.isArray(stepInfoList) && stepInfoList.length > 0) {
				let stepData = {};
				stepInfoList.forEach(item => {
					if (date.indexOf(item.date) !== -1) {
						stepData = item;
					}
				});
				return stepData;
			}
		},
		async getwxStepInfoList() {
			// 获取微信运动记录
			// #ifdef MP-WEIXIN
			let result = await wx.getWeRunData();
			if (result.errMsg === 'getWeRunData:ok') {
				this.wxRunData = result;
				this.decryptData(result);
			}
			// #endif
		},
		async decryptData(result) {
			// 解密微信加密数据
			if (result.encryptedData && result.iv) {
				let url = this.getServiceUrl('wx', 'srvwx_app_data_decrypt', 'operate');
				let req = [
					{
						data: [
							{
								encryptedData: result.encryptedData,
								signature: result.iv
							}
						],
						serviceName: 'srvwx_app_data_decrypt'
					}
				];
				let res = await this.$http.post(url, req);
				if (res.data.state == 'SUCCESS' && Array.isArray(res.data.response) && res.data.response.length > 0) {
					let stepList = res.data.response[0].response.stepInfoList;
					if (Array.isArray(stepList)) {
						stepList = stepList.map(item => {
							item.date = this.formateDate(item.timestamp * 1000);
							return item;
						});
						console.log('stepList', this.deepClone(stepList));
						this.stepInfoList = stepList;
						let stepData = this.getDayStepInfo(this.date);
						this.stepData = stepData;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
		getSportRecord() {
			// 查找运动记录
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_body_activity_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'user_name',
						ruleType: 'like',
						value: this.currentUser.name
					},
					{
						colName: 'userno',
						ruleType: 'like',
						value: this.currentUser.userno
					},
					{ colName: 'hdate', ruleType: 'like', value: this.getDate() }
				],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					this.stepRecord = res.data.data;
				}
			});
		},
		getDate(type) {
			const date = new Date();
			let year = date.getFullYear();
			let month = date.getMonth() + 1;
			let day = date.getDate();
			month = month > 9 ? month : '0' + month;
			day = day > 9 ? day : '0' + day;
			if (type === 'start') {
				year = year - 60;
			} else if (type === 'end') {
				// year = year + 2;
			} else if (type === 'now') {
				year = year;
			}
			return `${year}-${month}-${day}`;
		}
	},
	created() {
		this.date = this.formateDate(new Date(), '年月日');
		let userInfo = uni.getStorageSync('wxUserInfo');
		this.userInfo = userInfo;
		let userList = uni.getStorageSync('user_info_list');
		let current_user = uni.getStorageSync('current_user');
		if (userList && current_user) {
			let currentUser = userList.filter(item => {
				return item.name === current_user;
			});
			if (Array.isArray(currentUser) && currentUser.length > 0) {
				this.currentUser = currentUser[0];
				this.getSportRecord();
			}
		}
	},
	onLoad(option) {
		if (option.title) {
			uni.setNavigationBarTitle({
				title: option.title
			});
		}
		this.getwxStepInfoList();
	}
};
</script>

<style lang="scss" scoped>
.sport-wrap {
	background-color: #f1f1f1;
	height: 100vh;
	overflow: scroll;
	.picker {
		display: flex;
		justify-content: center;
		height: 100rpx;
		align-items: center;
	}
	.foot-num {
		display: flex;
		flex-direction: column;
		margin: 0 20rpx 10rpx;
		padding: 30rpx;
		background-color: #fff;
		border-radius: 20rpx;
		.title {
			line-height: 40rpx;
			color: #999;
		}
		.content {
			display: flex;
			padding: 10rpx;
			.number {
				display: flex;
				flex: 1;
				.actually {
					font-size: 60rpx;
					font-weight: bold;
					display: flex;
					align-items: flex-end;
				}
				.target {
					font-size: 24rpx;
					display: flex;
					align-items: flex-end;
					line-height: 40rpx;
				}
			}
			.status {
				flex: 0.5;
				.cuIcon-check {
					border-radius: 50%;
					border: 1px solid;
				}
			}
		}
	}
	.foot-status {
		display: flex;
		justify-content: space-between;
		margin: 20rpx;
		.qiangdu,
		.xiaohao {
			width: calc(50% - 10rpx);
			height: 200rpx;
			background-color: #fff;
			border-radius: 20rpx;
			padding: 20rpx 40rpx;
			.title {
				font-size: 20rpx;
				color: #999;
			}
			.status {
				display: flex;
				justify-content: space-between;
				min-height: 100rpx;
				align-items: center;
				.tag {
					border-radius: 15rpx;
					padding: 5rpx 10rpx;
				}
				.value {
					font-size: 36rpx;
					font-weight: bold;
					.unit {
						font-size: 20rpx;
					}
				}
			}
		}
	}
	.foot-record {
		display: flex;
		flex-direction: column;
		margin: 20rpx;
		.title {
			line-height: 50rpx;
			font-weight: bold;
			text-indent: 10rpx;
		}
		.record-item {
			background-color: #fff;
			border-radius: 20rpx;
			margin: 5rpx 20rpx;
			min-height: 120rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 20rpx;
			&.record-detail {
			}
			.column {
				flex: 1;
				text-align: center;
				margin: 0;
			}
			.icon {
				color: #18b566;
				margin: 0 20rpx;
				.iconfont {
					font-size: 50rpx;
				}
			}
			.step-number,
			.calorie {
				font-weight: bold;
				font-size: 40rpx;
				padding: 0 30rpx;
				.unit {
					font-size: 20rpx;
				}
			}
		}
	}
}
</style>
