<template>
	<view class="symptom-form">
		<view class="title">
			是否选择此症状
			<text class="text-bold">【{{ currentSymptom.name }}】</text>
		</view>
		<view class="symptom-date-selector">
			<view class="item-list">
				<view class="item-list-top">
					<view class="label"><text>请选择症状发生时间:</text></view>
					<view class="value" v-if="occur_time">
						<picker mode="date" :value="occur_time.split(' ')[0]" @change="DateChange($event, 'occur_time')">
							<view class="picker">{{ occur_time.split(' ')[0] }}</view>
						</picker>
						<view class="margin-right"></view>
						<picker mode="time" :value="occur_time.split(' ')[1]" @change="TimeChange($event, 'occur_time')">
							<view class="picker">{{ occur_time.split(' ')[1] }}</view>
						</picker>
					</view>
				</view>
				<view class="item-list-center">
					<view class="number-change">
						<button class="operate cu-btn" @click="changeTime('occur_time', -60)">-1小时</button>
						<button class="operate cu-btn margin-right" @click="changeTime('occur_time', -10)">-10分钟</button>
						<button class="operate cu-btn" @click="changeTime('occur_time', 10)">+10分钟</button>
						<button class="operate cu-btn" @click="changeTime('occur_time', 60)">+1小时</button>
					</view>
				</view>
			</view>
		</view>
		<view class="remark"><textarea v-model="symptoms_remark" placeholder="输入症状说明" /></view>
		<view class="button-box">
			<button class="cu-btn next-btn bg-gray shadow-blur round margin-top" @click="submitFormData('cancel')">取消</button>
			<button class="cu-btn next-btn bg-blue shadow-blur round margin-top" type="primary" @click="submitFormData">确定</button>
		</view>
	</view>
</template>

<script>
import dayjs from '@/static/js/dayjs.min.js'
import { mapState } from 'vuex'
export default {
	data() {
		return {
			occur_time: '',
			symptoms_remark: ''
		}
	},
	props: {
		currentSymptom: {
			type: Object
		}
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		})
	},
	methods: {
		submitFormData(e) {
			if (e === 'cancel') {
				this.$emit('change', false)
			} else {
				this.$emit('change', {
					occur_time: this.occur_time,
					symptoms_remark: this.symptoms_remark
				})
			}
		},
		async addSymptom() {
			let data = this.currentSymptom
			let self = this
			let req = [
				{
					serviceName: 'srvhealth_self_symptoms_record_add',
					condition: [],
					data: [
						{
							info_no: this.userInfo.no,
							user_account: this.userInfo.userno,
							occur_time: this.occur_time,
							symptoms_no: data.no,
							symptoms_name: data.name,
							symptoms_remark: this.symptoms_remark
						}
					]
				}
			]
			let res = await this.$fetch('operate', 'srvhealth_self_symptoms_record_add', req, 'health')
			if (res.success) {
				uni.showModal({
					title: '提示',
					content: '提交成功',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							self.showSymptomDateSelector = false
							self.showSymptom = false
						}
					}
				})
			}
		}
	},
	created() {
		this.occur_time = dayjs().format('YYYY-MM-DD HH:mm')
	}
}
</script>

<style lang="scss" scoped>
.symptom-form {
	padding: 20rpx;
	background-color: #fff;
	display: flex;
	flex-direction: column;
	align-items: center;
	.cascader-wrap {
		flex: 1;
	}
	.remark {
		background-color: #f8f8f8;
		border-radius: 10px;
		text-align: left;
		padding: 20rpx 10rpx;
		text-indent: 20px;
	}
	&.low-height {
		min-height: 360px;
	}
	.symptom-date-selector {
		display: flex;
		flex-direction: column;
	}
	.next-btn {
		margin-top: 20px;
		width: 30%;
	}
	.item-list {
		display: flex;
		flex-direction: column;
		margin-top: 10px;
		text {
			color: #5e5e5e;
			margin-bottom: 10upx;
			font-weight: 700;
		}
		.number-change {
			display: flex;
			padding: 20rpx 0;
			justify-content: center;
			.operate {
				padding: 2px 10px;
				background-color: #dff5f5;
				color: #0bc99d;
				& + .operate {
					margin-left: 10rpx;
				}
			}
			.value {
				flex: 1;
				border: 1rpx solid #f1f1f1;
				margin: 0 20rpx;
				border-radius: 10rpx;
				overflow: hidden;
			}
		}
		.item-list-top {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			.label {
				margin-right: 20px;
				width: 100%;
				text-align: left;
				margin-bottom: 5px;
			}
		}
		.item-list-center {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
		.value {
			font-weight: bold;
			display: flex;
			color: #0bc99d;
			justify-content: center;
		}
		.item-list-bot {
			border: 1px solid #ccc;
			padding: 10rpx;
		}
		.weight-radio-group {
			display: flex;
			margin-bottom: 10rpx;
			.weight-radio-group-item {
				margin-right: 20rpx;
				display: flex;
				align-items: center;
				/deep/ .uni-radio-input {
					transform: scale(0.8);
					.uni-radio-input-checked {
						background-color: rgb(0, 122, 255) !important;
					}
				}
				.title {
					margin-right: 4rpx;
				}
			}
		}
	}
	.button-box {
		width: 100%;
		justify-content: center;
		.next-btn + .next-btn {
			margin-left: 20px;
		}
	}
}
</style>
