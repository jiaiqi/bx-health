<template>
	<view class="other-wrap">
		<view class="other-top">
			<view v-if="type && type === 'weight'" class="item-wrap">
				<view class="item-list">
					<text>体重(千克)</text>
					<input type="text" value="" v-model="inputVal.weight" />
				</view>
				<view class="item-list">
					<text>体脂率(%)</text>
					<input type="text" value="" v-model="inputVal.body_fat_rate" />
				</view>
			</view>
			<view v-else-if="type && type === 'sleep'" class="item-wrap">
				<view class="item-list">
					<text>开始时间</text>
					<input type="text" value="" />
				</view>
				<view class="item-list">
					<text>结束时间</text>
					<input type="text" value="" />
				</view>
			</view>
			<view v-else-if="type && type === 'heartRate'" class="item-wrap">
				<view class="item-list" @click="openTime({ type: 'heartRate', field: 'date' })">
					<text>日期和时间</text>
					<input type="text" value="" />
				</view>
				<view class="item-list">
					<text>心率(次/分)</text>
					<input type="text" value="" />
				</view>
			</view>
			<view v-else-if="type && type === 'pressure'" class="item-wrap">
				<!-- 血压 -->
				<view class="item-list">
					<text>心率</text>
					<input type="text" value="" v-model="inputVal.heart_rate" />
				</view>
				<view class="item-list">
					<text>收缩压(高压 毫米汞柱)</text>
					<input type="text" value="" v-model="inputVal.systolic_pressure" />
				</view>
				<view class="item-list">
					<text>舒张压(低压 毫米汞柱)</text>
					<input type="text" value="" v-model="inputVal.diastolic_pressure" />
				</view>
				<view class="item-list">
					<text>说明</text>
					<input type="text" value="" v-model="inputVal.remark" />
				</view>
			</view>
			<view v-else-if="type && type === 'oxygen'" class="item-wrap">
				<view class="item-list" @click="openTime({ type: 'oxygen', field: 'start_time' })">
					<text>开始时间</text>
					<input type="text" value="" v-model="inputVal.start_time" />
				</view>
				<view class="item-list" @click="openTime({ type: 'oxygen', field: 'end_time' })">
					<text>结束时间</text>
					<input type="text" value="" v-model="inputVal.end_time" />
				</view>
				<view class="item-list">
					<text>血氧饱和度最大值(%)</text>
					<input type="text" value="" v-model="inputVal.oxygen_saturation_max" />
				</view>
				<view class="item-list">
					<text>血氧饱和度最小值(%)</text>
					<input type="text" value="" v-model="inputVal.oxygen_saturation_min" />
				</view>
				<view class="item-list">
					<text>血氧饱和度平均(%)</text>
					<input type="text" value="" v-model="inputVal.oxygen_saturation_avg" />
				</view>
				<view class="item-list">
					<text>说明</text>
					<input type="text" value="" v-model="inputVal.remark" />
				</view>
			</view>
			<view v-else-if="type && type === 'glucose'" class="item-wrap">
				<!-- 血糖 -->
				<u-select v-model="showSelect" :list="glucose_time_option" @confirm="confirmSelect"></u-select>
				<view class="item-list" @click="showSelect = true">
					<text>测量时机</text>
					<input type="text" value="" disabled v-model="inputVal.glucose_time" />
				</view>
				<view class="item-list">
					<text>血糖值(mmol/l)</text>
					<input type="text" value="" v-model="inputVal.blood_glucose_val" />
				</view>
				<view class="item-list">
					<text>说明</text>
					<input type="text" value="" v-model="inputVal.remark" />
				</view>
			</view>
		</view>
		<view class="other-bot">
			<button class="cu-btn lg btn" :class="{ disabled: !canSave }"  
			@click="submitRecord" v-if="!isSubmit">保存</button>
			<button class="cu-btn lg btn" @click="back" v-if="isSubmit">返回</button>
		</view>
		<mx-date-picker
			style="z-index: 1290;"
			:format="dateFormat"
			:show="showTimePicker"
			:type="timeType"
			:value="currentVal"
			:show-tips="true"
			:begin-text="'入住'"
			:isMultiSelect="true"
			:end-text="'离店'"
			:show-seconds="true"
			@confirm="onSelected"
			@cancel="onSelected"
		/>
	</view>
</template>

<script>
import MxDatePicker from '@/otherPages/components/mx-datepicker/mx-datepicker.vue';
export default {
	name: 'otherIndicator',
	components: { MxDatePicker },
	data() {
		return {
			inputVal: {
				weight: '',
				body_fat_rate: '',
				glucose_time: '', //血糖 - 测量时机
				remark: '', // 说明
				blood_glucose_val: '', // 血糖 - 血糖值
				start_time: '', // 血氧 - 起始时间
				end_time: '', // 血氧 - 结束时间
				oxygen_saturation_max: '', // 血氧饱和度最大值%
				oxygen_saturation_min: '', //血氧饱和度最小值%
				oxygen_saturation_avg: '', // 血氧饱和度平均值%
				heart_rate: '', // 血压- 心率
				diastolic_pressure: '', //血压 - 舒张压
				systolic_pressure: '' //血压-收缩压
			},
			showSelect: false,
			glucose_time_option: [{ label: '空腹', value: '空腹' }, { label: '餐后2小时', value: '餐后2小时' }, { label: '其他', value: '其他' }],
			currentUserInfo: null,
			serviceLog: null,
			type: null,
			dateFormat: 'yyyy-mm-dd hh:ii:ss',
			showTimePicker: false,
			timeType: 'datetime',
			currentVal: null,
			currTime: '',
			dateTimeField: '',
			dateTime: this.formateDate(new Date(), 'dates'),
			isSubmit: false
		};
	},
	computed: {
		canSave() {
			let result = true;
			switch (this.type) {
				case 'weight':
					result = this.inputVal.weight && this.inputVal.body_fat_rate ? true : false;
					break;
				case 'sleep':
					break;
				case 'heartRate':
					break;
				case 'pressure':
					result = this.inputVal.systolic_pressure && this.inputVal.diastolic_pressure ? true : false;
					break;
				case 'oxygen':
					result =
						this.inputVal.start_time && this.inputVal.end_time && this.inputVal.oxygen_saturation_max && this.inputVal.oxygen_saturation_min && this.inputVal.oxygen_saturation_avg
							? true
							: false;
					break;
				case 'glucose':
					result = this.inputVal.glucose_time && this.inputVal.blood_glucose_val ? true : false;
					break;
			}
			return result;
		}
	},
	methods: {
		confirmSelect(e) {
			console.log(e);
			if (Array.isArray(e) && e.length > 0) {
				this.inputVal.glucose_time = e[0].value;
			}
		},
		async addServiceLog() {
			let serviceName = 'srvhealth_service_record_add';
			let url = this.getServiceUrl('health', serviceName, 'operate');
			let req = [
				{
					serviceName: 'srvhealth_service_record_add',
					condition: [],
					data: [{ user_info_no: this.currentUserInfo.no, user_no: this.currentUserInfo.userno, name: this.currentUserInfo.name, time: this.formateDate(new Date(), 'dateTimes') }]
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				await this.selectServiceLog();
			}
		},
		async selectServiceLog() {
			// 查找服务记录
			let serviceName = 'srvhealth_service_record_select';
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: 'srvhealth_service_record_select',
				colNames: ['*'],
				condition: [{ colName: 'user_info_no', ruleType: 'like', value: this.currentUserInfo.no }],
				relation_condition: {},
				page: { pageNo: 1, rownumber: 100 },
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				// 请求成功
				if (Array.isArray(res.data.data) && res.data.data.length > 0) {
					// 有记录
					this.serviceLog = res.data.data[0];
				} else {
					// 没有记录，添加记录
					await this.addServiceLog();
				}
			}
		},
		async submitRecord() {
			// 提交并保存身体数据
			if (!this.canSave) {
				return;
			}
			let serviceName = '';
			let req = [];
			switch (this.type) {
				case 'weight':
					serviceName = 'srvhealth_body_fat_measurement_record_add';
					req = [
						{
							serviceName: 'srvhealth_body_fat_measurement_record_add',
							data: [{ service_no: this.serviceLog.no, name: this.serviceLog.name, weight: this.inputVal.weight, body_fat_rate: this.inputVal.body_fat_rate }]
						}
					];
					break;
				case 'sleep':
					serviceName = '';
					// serviceName = 'srvhealth_sleep_record_add';
					break;
				case 'heartRate':
					serviceName = '';
					break;
				case 'pressure':
					// 血压
					serviceName = 'srvhealth_blood_pressure_record_add';
					req = [
						{
							serviceName: serviceName,
							data: [
								{
									service_no: this.serviceLog.no,
									name: this.serviceLog.name,
									heart_rate: this.inputVal.heart_rate,
									systolic_pressure: this.inputVal.systolic_pressure,
									diastolic_pressure: this.inputVal.diastolic_pressure,
									remark: this.inputVal.remark
								}
							]
						}
					];
					break;
				case 'oxygen':
					serviceName = 'srvhealth_blood_oxygen_record_add';
					req = [
						{
							serviceName: serviceName,
							data: [
								{
									service_no: this.serviceLog.no,
									name: this.serviceLog.name,
									start_time: this.inputVal.start_time,
									end_time: this.inputVal.end_time,
									oxygen_saturation_max: this.inputVal.oxygen_saturation_max,
									oxygen_saturation_min: this.inputVal.oxygen_saturation_min,
									oxygen_saturation_avg: this.inputVal.oxygen_saturation_avg,
									remark: this.inputVal.remark
								}
							]
						}
					];
					break;
				case 'glucose':
					// 血糖
					serviceName = 'srvhealth_blood_glucose_measurement_record_add';
					req = [
						{
							serviceName: serviceName,
							data: [
								{
									service_no: this.serviceLog.no,
									name: this.serviceLog.name,
									glucose_time: this.inputVal.glucose_time,
									blood_glucose_val: this.inputVal.blood_glucose_val,
									remark: this.inputVal.remark
								}
							]
						}
					];
					break;
			}
			let url = this.getServiceUrl('health', serviceName, 'operate');
			if (serviceName) {
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.response) && res.data.response.length > 0) {
					uni.showToast({
						title: '提交成功'
					});
					this.isSubmit = true;
				}
			} else {
				uni.showToast({
					title: '此功能正在开发中',
					icon: 'none'
				});
			}
		},
		openTime(e) {
			this.showTimePicker = true;
			if (e.type && e.field) {
				this.dateTimeField = e.field;
			}
		},
		back() {
			uni.navigateBack({});
		},
		onSelected(e) {
			//时间选择器
			this.showTimePicker = false;
			if (e) {
				// this.dietIn = 0
				// this.sportOut = 0
				//选择的值
				console.log('value => ' + e.value);
				this.dateTime = e.value;
				if (this.dateTimeField) {
					this.inputVal[this.dateTimeField] = e.value;
				}
				// this.$set(this.currFood,"htime",e.value)
			}
		}
	},
	onLoad(option) {
		if (option && option.type) {
			this.type = option.type;
		}
		let user_info_list = uni.getStorageSync('user_info_list');
		let name = uni.getStorageSync('current_user');
		user_info_list = user_info_list.filter(item => item.name === name);
		if (Array.isArray(user_info_list) && user_info_list.length > 0) {
			this.currentUserInfo = user_info_list[0];
			this.selectServiceLog();
		} else {
			uni.showModal({
				title: '提示',
				content: '登录信息有误,即将返回上一页面',
				showCancel: false,
				success(res) {
					if (res.confirm) {
						uni.navigateBack({});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.other-wrap {
	min-height: 100vh;
	background-color: white;

	.other-top {
		width: 90%;
		padding-top: 30upx;
		margin: 0 auto 0;
		min-height: 85vh;
		.item-wrap {
			.item-list {
				border-bottom: 1px solid #cfcfcf;
				display: flex;
				flex-direction: column;
				margin-top: 30upx;
				text {
					color: #5e5e5e;
					margin-bottom: 10upx;
				}
			}
		}
	}
	.other-bot {
		display: flex;
		justify-content: center;
		.btn {
			width: 70%;
			height: 70upx;
			color: #fff;
			background-image: linear-gradient(90deg, #70c6ff, #0081ff);
			border-radius: 50upx;
			box-shadow: 3px 3px 4px rgba(10, 141, 255, 0.2);
			&.disabled{
				cursor: not-allowed;
				opacity: 0.6;
			}
		}
		
	}
}
</style>
