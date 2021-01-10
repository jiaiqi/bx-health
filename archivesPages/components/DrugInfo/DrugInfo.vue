<template>
	<view class="drug-detail">
		<view class="detail-item item-title" v-if="drugDetail && drugDetail.med_no">
			<view class="label">药品名称:</view>
			<view class="value">{{ drugDetail.medicine_name }}</view>
			<text class="cuIcon-delete icon" @click="deleteDrugItem"></text>
			<!-- <image class="icon" src="../../static/icon/drug.png" mode="aspectFit"></image> -->
		</view>
		<view class="detail-item column" v-if="drugDetail && drugDetail.med_no">
			<view class="label">类别:</view>
			<view class="value">
				{{ delNotChineseChar(drugDetail.one_type) }}
				<text class="spec" v-if="drugDetail.two_type">/</text>
				{{ delNotChineseChar(drugDetail.two_type) }}
				<text class="spec" v-if="drugDetail.three_type">/</text>
				{{ delNotChineseChar(drugDetail.three_type) }}
				<text class="spec" v-if="drugDetail.four_type">/</text>
				{{ delNotChineseChar(drugDetail.four_type) }}
				<text class="spec" v-if="drugDetail.five_type">/</text>
				{{ delNotChineseChar(drugDetail.five_type) }}
			</view>
		</view>
		<view class="detail-item" v-if="drugDetail && drugDetail.med_no">
			<view class="label">药品注册剂型:</view>
			<view class="value">{{ drugDetail.register_frug_form || '' }}</view>
		</view>
		<view class="detail-item border-bottom" v-if="drugDetail && drugDetail.med_no">
			<view class="label">生产企业:</view>
			<view class="value">{{ drugDetail.medicine_company || '' }}</view>
		</view>
		<view class="detail-item item-title" v-if="drugInfos && drugInfos.med_no">
			<view class="label">药品名称:</view>
			<view class="value">{{ drugInfos.general_name }}</view>
			<text class="cuIcon-delete icon" @click="deleteDrugItem"></text>
			<!-- <image class="icon" src="../../static/icon/drug.png" mode="aspectFit"></image> -->
		</view>
		<view class="detail-item" v-if="drugInfos && drugInfos.med_no">
			<view class="label">用量单位:</view>
			<view class="value">
				<bx-radio-group class="form-item-content_value radio-group" v-model="drugInfos.dosage_unit" mode="button">
					<bx-radio v-for="item in useDrugUnit" :key="item.value" :name="item.value">{{ item.label }}</bx-radio>
				</bx-radio-group>
			</view>
		</view>
		<view class="detail-item" v-if="drugInfos && drugInfos.med_no">
			<view class="label">每次用量:</view>
			<view class="value input">
				<text
					class="operate shadow-blur"
					:class="{ disabled: drugInfos.dosage_each_time - 1 < 0 }"
					@click="changeAmount(-1)"
					@longpress="longChange(-1)"
					@touchend="longChangeEnd"
				>
					- 1
				</text>
				<text
					class="operate"
					:class="{ disabled: drugInfos.dosage_each_time - 0.5 < 0 }"
					@click="changeAmount(-0.5)"
					@longpress="longChange(-0.5)"
					@touchend="longChangeEnd"
				>
					- 0.5
				</text>
				<input class="input" type="text" v-model="drugInfos.dosage_each_time" />
				<text class="operate" :class="{ disabled: drugInfos.dosage_each_time + 0.5 < 0 }" @click="changeAmount(0.5)" @longpress="longChange(0.5)" @touchend="longChangeEnd">
					+0.5
				</text>
				<text class="operate" :class="{ disabled: drugInfos.dosage_each_time + 1 < 0 }" @click="changeAmount(1)" @longpress="longChange(1)" @touchend="longChangeEnd">
					+ 1
				</text>
			</view>
		</view>
		<view class="detail-item" v-if="drugInfos && drugInfos.med_no">
			<view class="label">每天服用次数:</view>
			<view class="value">
				<bx-radio-group class="form-item-content_value radio-group" v-model="drugInfos.take_times" mode="button">
					<bx-radio v-for="item in times" :key="item.value" :name="item.value">{{ item.label }}</bx-radio>
				</bx-radio-group>
			</view>
		</view>
		<!-- 		<view class="detail-item" v-if="drugInfos && drugInfos.sport_no">
			<view class="label">每天服用次数:</view>
			<view class="value">
				<bx-radio-group class="form-item-content_value radio-group" v-model="drugInfos.take_times" mode="button">
					<bx-radio v-for="item in times" :key="item.value" :name="item.value">{{ item.label }}</bx-radio>
				</bx-radio-group>
			</view>
		</view> -->
		<view class="detail-item item-title" v-if="drugDetail && (drugDetail.sport_no || drugInfos.sport_no)">
			<view class="label">运动名称:</view>
			<view class="value">{{ drugDetail.name || drugInfos.sport_name }}</view>
			<text class="cuIcon-delete icon" @click="deleteDrugItem"></text>
		</view>

		<view class="detail-item item-title" v-if="drugDetail && (drugDetail.sport_no || drugInfos.sport_no)">
			<view class="label">单位:</view>
			<view class="value">{{ drugDetail.unit || drugInfos.unit }}</view>
		</view>

		<view class="detail-item item-title" v-if="drugDetail && drugDetail.sport_no">
			<view class="label">单位消耗热量:</view>
			<view class="value">{{ drugDetail.unit_energy }}千卡</view>
		</view>

		<view class="detail-item item-title" v-if="drugInfos && (drugDetail.sport_no || drugInfos.sport_no)">
			<view class="label">每次运动量:</view>
			<view class="value input">
				<text
					class="operate shadow-blur"
					:class="{ disabled: drugInfos.amount_each_time - 1 < 0 }"
					@click="changeAmount(-1)"
					@longpress="longChange(-1)"
					@touchend="longChangeEnd"
				>
					- 1
				</text>
				<text
					class="operate"
					:class="{ disabled: drugInfos.amount_each_time - 0.1 < 0 }"
					@click="changeAmount(-0.1)"
					@longpress="longChange(-0.1)"
					@touchend="longChangeEnd"
				>
					- 0.1
				</text>
				<input class="input" type="text" v-model="drugInfos.amount_each_time" />
				<text class="operate" :class="{ disabled: drugInfos.amount_each_time + 0.1 < 0 }" @click="changeAmount(0.1)" @longpress="longChange(0.1)" @touchend="longChangeEnd">
					+0.1
				</text>
				<text class="operate" :class="{ disabled: drugInfos.amount_each_time + 1 < 0 }" @click="changeAmount(1)" @longpress="longChange(1)" @touchend="longChangeEnd">
					+ 1
				</text>
			</view>
		</view>
		<view class="detail-item column" v-if="drugInfos && (drugDetail.sport_no || drugInfos.sport_no)">
			<view class="label">请选择每周安排:</view>
			<view class="value">
				<bx-checkbox-group v-model="drugInfos.take_times_each_week" mode="button">
					<bx-checkbox v-model="item.checked" v-for="item in weekDate" :name="item.value">{{ item.label }}</bx-checkbox>
				</bx-checkbox-group>
			</view>
		</view>
		<view class="detail-item column" v-if="drugInfos">
			<view class="label">请选择提醒时间:</view>
			<view class="value">
				<bx-checkbox-group v-model="drugInfos.remind_time" mode="button">
					<bx-checkbox v-model="item.checked" v-for="item in selectorData" :name="item.value">{{ item.label }}</bx-checkbox>
				</bx-checkbox-group>
			</view>
		</view>
		<view class="button-box">
			<view class="button cu-btn gray" @click="hideModal">取消</view>
			<view class="button cu-btn bg-cyan" @click="addDrugItem(drugDetail)">确定</view>
		</view>
		<!-- <view class="delete-icon" v-if="drugInfo && drugInfo.id" @click="deleteDrugItem"><text class="cuIcon-delete"></text></view> -->
	</view>
</template>

<script>
export default {
	name: 'drug-info',
	props: {
		drugDetail: {
			type: Object
		},
		drugInfo: {
			type: Object
		},
		planNo: {
			type: String
		},
		type: {
			type: String
		}
	},
	data() {
		return {
			drugInfos: {
				energy: '', // 消耗热量
				sport_no: '', //运动项目编号
				unit: '', // 运动项目单位
				amount_each_time: 1, //每次运动数量
				take_times_each_week: '', //每周安排
				dosage_unit: '片',
				take_times: '3',
				dosage_each_time: 1, //每次用量
				remind_time: [] //'提醒时间'
			},
			selectorData: [
				{
					label: '7:00',
					value: '7:00',
					checked: false
				},
				{
					label: '8:00',
					value: '8:00',
					checked: false
				},
				{
					label: '9:00',
					value: '9:00',
					checked: false
				},
				{
					label: '10:00',
					value: '10:00',
					checked: false
				},
				{
					label: '11:00',
					value: '11:00',
					checked: false
				},
				{
					label: '12:00',
					value: '12:00',
					checked: false
				},
				{
					label: '13:00',
					value: '13:00',
					checked: false
				},
				{
					label: '14:00',
					value: '14:00',
					checked: false
				},
				{
					label: '15:00',
					value: '15:00',
					checked: false
				},
				{
					label: '16:00',
					value: '16:00',
					checked: false
				},
				{
					label: '17:00',
					value: '17:00',
					checked: false
				},
				{
					label: '18:00',
					value: '18:00',
					checked: false
				},
				{
					label: '19:00',
					value: '19:00',
					checked: false
				},
				{
					label: '20:00',
					value: '20:00',
					checked: false
				},
				{
					label: '21:00',
					value: '21:00',
					checked: false
				},
				{
					label: '22:00',
					value: '22:00',
					checked: false
				}
			],
			useDrugUnit: [
				{
					label: '片',
					value: '片'
				},
				{
					label: '颗',
					value: '颗'
				},
				{
					label: '毫升',
					value: '毫升'
				}
			],
			weekDate: [
				{
					label: '周一',
					value: '周一',
					checked: false
				},
				{
					label: '周二',
					value: '周二',
					checked: false
				},
				{
					label: '周三',
					value: '周三',
					checked: false
				},
				{
					label: '周四',
					value: '周四',
					checked: false
				},
				{
					label: '周五',
					value: '周五',
					checked: false
				},
				{
					label: '周六',
					value: '周六',
					checked: false
				},
				{
					label: '周日',
					value: '周日',
					checked: false
				}
			],
			times: [
				{
					label: '1次',
					value: '1'
				},
				{
					label: '2次',
					value: '2'
				},
				{
					label: '3次',
					value: '3'
				}
			]
		};
	},
	watch: {
		drugInfo: {
			deep: true,
			handler(newValue, oldValue) {
				if (newValue && newValue.id) {
					this.drugInfos = this.drugInfo;
					if (this.drugInfos.remind_time && typeof this.drugInfos.remind_time === 'string') {
						this.drugInfos.remind_time = this.drugInfos.remind_time.split(',');
					}
					if (newValue.sport_no) {
						if (this.drugInfos.take_times_each_week && typeof this.drugInfos.take_times_each_week === 'string') {
							this.drugInfos.take_times_each_week = this.drugInfos.take_times_each_week.split(',');
						}
						this.weekDate = this.weekDate.map(item => {
							if (this.drugInfos.take_times_each_week.indexOf(item.value) !== -1) {
								item.checked = true;
							} else {
								item.checked = false;
							}
							return item;
						});
					}
					this.selectorData = this.selectorData.map(item => {
						if (this.drugInfos.remind_time.indexOf(item.value) !== -1) {
							item.checked = true;
						} else {
							item.checked = false;
						}
						return item;
					});
				}
			}
		}
	},
	methods: {
		deleteDrugItem() {
			let item = this.drugInfo;
			let self = this;
			if (item.id) {
				uni.showModal({
					title: '提醒',
					content: '确认删除?',
					success(res) {
						if (res.confirm) {
							let serviceName = 'srvhealth_drug_schedule_detail_list_delete';
							if (self.drugInfos.sport_no || self.drugDetail.sport_no) {
								serviceName = 'srvhealth_plan_schedule_sports_detail_delete';
							}
							let url = self.getServiceUrl('health', serviceName, 'operate');
							let req = [{ serviceName: serviceName, condition: [{ colName: 'id', ruleType: 'in', value: self.drugInfo.id }] }];
							self.$http.post(url, req).then(res => {
								if (res.data.state === 'SUCCESS') {
									uni.showToast({
										title: '删除成功'
									});
									self.$emit('updateSuccess');
								}
							});
						}
					}
				});
			}
		},
		hideModal() {
			this.$emit('hideModal');
		},
		longChange(num) {
			this.timer = setInterval(() => {
				this.changeAmount(num);
			}, 200);
		},
		longChangeEnd() {
			clearInterval(this.timer);
		},
		changeAmount(num) {
			let amount = 0;
			if (this.drugDetail.sport_no || this.drugInfos.sport_no) {
				amount = Number(this.drugInfos.amount_each_time);
			} else {
				amount = Number(this.drugInfos.dosage_each_time);
			}
			if (amount + num >= 0) {
				amount += num;
			}
			if (this.drugDetail.sport_no || this.drugInfos.sport_no) {
				this.drugInfos.amount_each_time = Number(amount.toFixed(1));
			} else {
				this.drugInfos.dosage_each_time = Number(amount.toFixed(1));
			}
		},
		async addDrugItem() {
			let detail = this.drugDetail;
			let info = this.drugInfos;
			let url = '';
			let req = [];
			console.log(this.type, this.drugInfo);
			if (this.type === 'add') {
				url = this.getServiceUrl('health', 'srvhealth_drug_schedule_detail_list_add', 'operate');
				req = [
					{
						serviceName: 'srvhealth_drug_schedule_detail_list_add',
						data: [
							{
								med_no: detail.med_no,
								s_code: detail.s_code,
								drug_reg_name: detail.register_name,
								general_code: detail.medicine_no,
								general_name: detail.medicine_name,
								take_times: info.take_times, //每天用药次数
								dosage_each_time: info.dosage_each_time, //每次用量
								dosage_unit: info.dosage_unit, //用量单位
								remind_time: info.remind_time.toString(), //提醒时间
								ds_no: this.planNo
							}
						]
					}
				];
				if (this.drugDetail.sport_no) {
					url = this.getServiceUrl('health', 'srvhealth_plan_schedule_sports_detail_add', 'operate');
					req[0] = {
						serviceName: 'srvhealth_plan_schedule_sports_detail_add',
						data: [
							{
								sport_no: detail.sport_no,
								sport_name: detail.name,
								unit: detail.unit, //运动单位
								amount_each_time: info.amount_each_time, //每次数量
								take_times_each_week: info.take_times_each_week.toString(), //每周安排
								remind_time: info.remind_time.toString(), //提醒时间
								ds_no: this.planNo
							}
						]
					};
				}
			} else if (this.type === 'update' && this.drugInfo.id) {
				url = this.getServiceUrl('health', 'srvhealth_drug_schedule_detail_list_update', 'operate');
				req = [
					{
						serviceName: 'srvhealth_drug_schedule_detail_list_update',
						condition: [{ colName: 'id', ruleType: 'eq', value: this.drugInfo.id }],
						data: [
							{
								take_times: info.take_times, //每天用药次数
								dosage_each_time: info.dosage_each_time, //每次用量
								dosage_unit: info.dosage_unit, //用量单位
								remind_time: info.remind_time.toString() //提醒时间
							}
						]
					}
				];
				if (this.drugInfo.sport_no) {
					url = this.getServiceUrl('health', 'srvhealth_plan_schedule_sports_detail_update', 'operate');
					req[0] = {
						serviceName: 'srvhealth_plan_schedule_sports_detail_update',
						condition: [{ colName: 'id', ruleType: 'eq', value: this.drugInfo.id }],
						data: [
							{
								unit: detail.unit, //运动单位
								amount_each_time: info.amount_each_time, //
								take_times_each_week: info.take_times_each_week.toString(), // 每周安排
								remind_time: info.remind_time.toString() //提醒时间
							}
						]
					};
				}
			}
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					if (this.type === 'add')
						uni.showModal({
							title: '提示',
							content: '添加成功',
							showCancel: false,
							success(res) {
								if (res.confirm) {
									uni.navigateBack();
								}
							}
						});
					this.$emit('updateSuccess');
				} else {
					uni.showToast({
						title: res.data.resultMessage
					});
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.drug-detail {
	display: flex;
	flex-direction: column;
	padding: 20rpx;
	position: relative;
	/deep/ .bx-checkbox-group .bx-checkbox .bx-checkbox__label {
		padding: 5rpx 20rpx;
	}
	.cuIcon-delete.icon {
		font-size: 40rpx;
	}
	.button-box {
		margin: 40rpx 0;
	}
	.detail-item {
		display: flex;
		align-items: center;
		padding: 10rpx 0;
		&.border-bottom {
			border-bottom: 2rpx dashed #ccc;
			padding-bottom: 20rpx;
		}
		&.column {
			flex-direction: column;
			align-items: flex-start;
		}
		&.item-title {
			justify-content: space-between;
			.value {
				font-weight: bold;
				color: #0bc99d;
				flex: 1;
				text-align: left;
				text-indent: 20rpx;
			}
		}
		.label {
			margin-right: 20rpx;
			font-weight: bold;
			min-width: 150rpx;
			text-align: left;
		}
		.value {
			text-align: left;
			.spec {
				display: inline-block;
				color: #0bc99d;
				margin-top: 10rpx;
				padding: 0 10rpx;
			}
			&.input {
				flex: 1;
				margin: 10rpx;
				width: 200rpx;
				display: flex;
				text-align: center;
				align-items: center;
				.input {
					display: inline-block;
					width: 100rpx;
					margin-right: 10rpx;
					border-bottom: 1rpx solid #ccc;
				}
				.operate {
					display: inline-block;
					color: #fff;
					background-color: rgba(11, 201, 157, 0.7);
					width: 100rpx;
					height: 50rpx;
					line-height: 50rpx;
					margin-right: 10rpx;
					border-radius: 30rpx;
					transition: all 0.5s;
					cursor: pointer;
					&.disabled {
						background-color: #dcdfe6;
						cursor: no-drop;
						color: #bcbec2;
					}
					&:active {
						transform: scale(1.1);
					}
				}
			}
		}
		.icon {
			width: 50rpx;
			height: 50rpx;
			margin-right: 50rpx;
		}
	}
}
</style>
