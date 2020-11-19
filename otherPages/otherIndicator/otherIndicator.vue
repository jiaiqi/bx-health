<template>
	<view class="other-wrap">
		<view class="other-top">
			<view class="other-top-tit">
				<text>*</text>
				<text>{{topTitle}}</text>
			</view>
			<view v-if="type && type === 'weight'" class="item-wrap">
				<view class="item-list" @click="showWeightSelect = true">
					<text>衣着穿戴</text>
					<!-- <u-select v-model="showWeightSelect" :list="list" @confirm="confirmChoose($event, 'clothing')"></u-select> -->
					<!-- <radio-group class="block weight-radio-group" @change="RadioChange($event, 'clothing')">
						<view v-for="(item, index) in list" :key="index" class="weight-radio-group-item">
							<view class="title">{{ item.value }}</view>
							<radio :class="weightCurrentRadio == item.value ? 'checked' : ''" :checked="weightCurrentRadio == item.value ? true : false" :value="item.value"></radio>
						</view>
					</radio-group> -->
					<checkbox-group @change="checkboxGroupChange($event,'clothing')" class="check-box-group">
						<label v-for="(item, index) in list" :key="item.value" class="check-box-item">
							<checkbox :value="item.value" :checked="item.checked" color="#FFCC33" style="transform:scale(0.7)" />
							{{ item.value }}
						</label>
					</checkbox-group>
					<!-- <view class="item-list-bot"><input type="text" value="" disabled /></view> -->
				</view>

				<view class="item-list" @click="showWeightDigSelect = true">
					<text>消化道情况</text>
					<checkbox-group @change="checkboxGroupChange($event,'digestion')" class="check-box-group">
						<label v-for="(item, index) in DigList" :key="item.value" class="check-box-item">
							<checkbox :value="item.value" :checked="item.checked" color="#FFCC33" style="transform:scale(0.7)" />
							{{ item.value }}
						</label>
					</checkbox-group>
					<!-- <radio-group class="block weight-radio-group" @change="RadioChange($event, 'digestion')">
						<view v-for="(item, index) in DigList" :key="index" class="weight-radio-group-item">
							<view class="title">{{ item.value }}</view>
							<radio :class="digeCurrentRadio == item.value ? 'checked' : ''" :checked="digeCurrentRadio == item.value ? true : false" :value="item.value"></radio>
						</view>
					</radio-group> -->
					<!-- <u-select v-model="showWeightDigSelect" :list="DigList" @confirm="confirmChoose($event, 'digestion')"></u-select> -->
					<!-- <view class="item-list-bot"><input type="text" value="" disabled /></view> -->
				</view>
				<view class="item-list">
					<view class="item-list-top">
						<text>*</text>
						<text>体重(千克)</text>
					</view>
					
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.weight" /></view>
				</view>
				<view class="item-list">
					<text>体脂率(%)</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.body_fat_rate" /></view>
				</view>
			</view>
			<view v-else-if="type && type === 'sleep'" class="item-wrap">
				<view class="item-list" @click="openTime({ type: 'sleep', field: 'retire_time' })">
					<view class="item-list-top">
						<text>*</text>
						<text>就寝时间</text>
					</view>
					<!-- <text>就寝时间</text> -->
					<view class="item-list-bot"><input type="text" :value="inputVal.retire_time" /></view>
				</view>
				<view class="item-list" @click="openTime({ type: 'sleep', field: 'getup_time' })">
					<view class="item-list-top">
						<text>*</text>
						<text>起床时间</text>
					</view>
					<!-- <text>起床时间</text> -->
					<view class="item-list-bot"><input type="text" :value="inputVal.getup_time" /></view>
				</view>
				<view class="item-list">
					<text>白天犯困情况</text>
					<radio-group @change="sleepyRadioChange">
						<label v-for="item in sleepy_option" :key="item.label" class="margin-right">
							<radio :value="item.value" style="transform: scale(0.7);" />
							<text>{{ item.label }}</text>
						</label>
					</radio-group>
				</view>
			</view>
			<view v-else-if="type && type === 'heartRate'" class="item-wrap">
				<view class="item-list" @click="openTime({ type: 'heartRate', field: 'date' })">
					<text>日期和时间</text>
					<view class="item-list-bot"><input type="text" value="" /></view>
				</view>
				<view class="item-list">
					<text>心率(次/分)</text>
					<view class="item-list-bot"><input type="text" value="" /></view>
				</view>
			</view>
			<view v-else-if="type && (type === 'pressure' || type === 'bp')" class="item-wrap">
				<!-- 血压 -->
				<view class="item-list">
					<view class="item-list-top">
						<text>*</text>
						<text>收缩压(高压 毫米汞柱)</text>
					</view>
					<!-- <text>收缩压(高压 毫米汞柱)</text> -->
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.systolic_pressure" /></view>
				</view>
				<view class="item-list">
					<view class="item-list-top">
						<text>*</text>
						<text>舒张压(低压 毫米汞柱)</text>
					</view>
					<!-- <text>舒张压(低压 毫米汞柱)</text> -->
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.diastolic_pressure" /></view>
				</view>
				<view class="item-list">
					<text>心率</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.heart_rate" /></view>
				</view>
				<view class="item-list">
					<text>说明</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.remark" /></view>
				</view>
			</view>
			<view v-else-if="type && type === 'oxygen'" class="item-wrap">
				<view class="item-list" @click="openTime({ type: 'oxygen', field: 'start_time' })">
					<text>开始时间</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.start_time" /></view>
				</view>
				<view class="item-list" @click="openTime({ type: 'oxygen', field: 'end_time' })">
					<text>结束时间</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.end_time" /></view>
				</view>
				<view class="item-list">
					<text>血氧饱和度最大值(%)</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.oxygen_saturation_max" /></view>
				</view>
				<view class="item-list">
					<text>血氧饱和度最小值(%)</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.oxygen_saturation_min" /></view>
				</view>
				<view class="item-list">
					<text>血氧饱和度平均(%)</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.oxygen_saturation_avg" /></view>
				</view>
				<view class="item-list">
					<text>说明</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.remark" /></view>
				</view>
			</view>
			<view v-else-if="type && type === 'glucose'" class="item-wrap">
				<!-- 血糖 -->
				<!-- <u-select v-model="showSelect" :list="glucose_time_option" @confirm="confirmSelect"></u-select> -->
				<!-- <u-select v-model="showSelect" :list="glucose_time_option"></u-select> -->
				<view class="item-list" @click="showSelect = true">
					<text>测量时机</text>
					<view class="item-list-bot"><input type="text" value="" disabled v-model="inputVal.glucose_time" /></view>
				</view>
				<view class="item-list">
					<text>血糖值(mmol/l)</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.blood_glucose_val" /></view>
				</view>
				<view class="item-list">
					<text>说明</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.remark" /></view>
				</view>
			</view>
		</view>
		<view class="other-bot">
			<button class="cu-btn lg btn" :class="{ disabled: !canSave }" @click="submitRecord" v-if="!isSubmit">保存</button>
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
import MxDatePicker from '@/components/mx-datepicker/mx-datepicker.vue';
export default {
	name: 'otherIndicator',
	components: { MxDatePicker },
	data() {
		return {
			inputVal: {
				// top_title:'',
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
				systolic_pressure: '', //血压-收缩压
				wearing: '', // 体重体脂 - 衣着穿戴
				alimentary_canal: '', // 体重体脂-  消化道情况
				retire_time: '', //睡眠 - 就寝时间
				getup_time: '', //睡眠 - 起床时间
				sleepy_daytime: '' //睡眠 - 犯困情况
			},
			sleepy_option: [{ label: '从不', value: '从不' }, { label: '很少', value: '很少' }, { label: '经常', value: '经常' }, { label: '严重', value: '严重' }],
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
			isSubmit: false,
			showWeightSelect: false,
			showWeightDigSelect: false,
			weightCurrentRadio: '',
			digeCurrentRadio: '',
			list: [
				{
					value: '穿鞋',
					label: '穿鞋'
				},
				{
					value: '穿外套外衣',
					label: '穿外套外衣'
				},
				{
					value: '穿轻薄内衣',
					label: '穿轻薄内衣'
				}
			],
			DigList: [
				{
					value: '空腹',
					label: '空腹'
				},
				{
					value: '排空大小便',
					label: '排空大小便'
				}
			]
		};
	},
	computed: {
		canSave() {
			let result = true;
			switch (this.type) {
				case 'weight':
					result = this.inputVal.weight ? true : false;
					break;
				case 'sleep':
					result = this.inputVal.retire_time && this.inputVal.getup_time ? true : false;
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
				case 'bp':
					result = result = this.inputVal.systolic_pressure && this.inputVal.diastolic_pressure ? true : false;
					break;
			}
			return result;
		},
		topTitle(){
			let str = '';
			switch (this.type) {
				case 'weight':
					str = '称体重时注意保持空腹并且不要穿太多得衣服哦,否则测量会有偏差。'
					break;
				case 'sleep':
					str = '每天最少保证睡眠时间在7小时左右并且不要熬夜哦,可以有效地缓解疲劳'
					break;
				// case 'heartRate':
				// 	break;
				// case 'pressure':
				// 	result = this.inputVal.systolic_pressure && this.inputVal.diastolic_pressure ? true : false;
				// 	break;
				// case 'oxygen':
				// 	result =
				// 		this.inputVal.start_time && this.inputVal.end_time && this.inputVal.oxygen_saturation_max && this.inputVal.oxygen_saturation_min && this.inputVal.oxygen_saturation_avg
				// 			? true
				// 			: false;
				// 	break;
				// case 'glucose':
				// 	result = this.inputVal.glucose_time && this.inputVal.blood_glucose_val ? true : false;
				// 	break;
				case 'bp':
					str = '测量血压时要注意保持心情平稳，测量前最好休息15分钟，避免情绪激动、劳累、吸烟、憋尿等。'
					break;
			}
			return str;
		}
	},
	methods: {
		/*体重--衣着穿戴多选**/
		checkboxGroupChange(e,type) {
			let str = ""
			if(e.detail.value.length > 0){
				str = e.detail.value.join(',')
			}
			switch (type) {
				case 'clothing':
					this.inputVal.wearing = str;
					break;
				case 'digestion':
					this.inputVal.alimentary_canal = str;
					break;
			}
			
			// var items = this.checkboxList,
			// 	values = e.detail.value;
			// for (var i = 0, lenI = items.length; i < lenI; ++i) {
			// 	const item = items[i];
			// 	if (values.includes(item.label)) {
			// 		this.$set(item, 'checked', true);
			// 	} else {
			// 		this.$set(item, 'checked', false);
			// 	}
			// }
			// this.checkedList = this.checkboxList.filter(item => item.checked).map(item => item.label);
		},
		sleepyRadioChange(evt) {
			this.inputVal.sleepy_daytime = evt.target.value;
		},
		RadioChange(e, type) {
			if (type === 'clothing') {
				this.inputVal.wearing = e.detail.value;
				this.weightCurrentRadio = e.detail.value;
			} else if (type === 'digestion') {
				this.inputVal.alimentary_canal = e.detail.value;
				this.digeCurrentRadio = e.detail.value;
			}
		},
		confirmChoose(e, type) {
			switch (type) {
				case 'clothing':
					this.inputVal.wearing = e[0].value;
					break;
				case 'digestion':
					this.inputVal.alimentary_canal = e[0].value;
					break;
			}
		},
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
		second2Time(second) {
			if (!second) {
				return false;
			} else {
				let dd, hh, mm, ss;
				second = typeof second === 'string' ? parseInt(second) : second;
				if (!second || second < 0) {
					return;
				}
				//小时
				hh = (second / 3600) | 0;
				second = Math.round(second) - hh * 3600;
				//分
				mm = (second / 60) | 0;
				//秒
				ss = Math.round(second) - mm * 60;
				if (Math.round(dd) < 10) {
					dd = dd > 0 ? '0' + dd : '';
				}
				if (Math.round(hh) < 10) {
					hh = '0' + hh;
				}
				if (Math.round(mm) < 10) {
					mm = '0' + mm;
				}
				if (Math.round(ss) < 10) {
					ss = '0' + ss;
				}
				return hh + ':' + mm + ':' + ss;
			}
		},
		async submitRecord() {
			// 提交并保存身体数据
			if (!this.canSave) {
				uni.showToast({
					title:'请完善信息',
					icon:'none'
				})
				return;
			}
			
			let serviceName = '';
			let req = [];
			let verify = false
			switch (this.type) {
				case 'weight':				
					serviceName = 'srvhealth_body_fat_measurement_record_add';
					req = [
						{
							serviceName: 'srvhealth_body_fat_measurement_record_add',
							data: [
								{
									service_no: this.serviceLog.no,
									name: this.serviceLog.name,
									weight: this.inputVal.weight,
									body_fat_rate: this.inputVal.body_fat_rate,
									wearing: this.inputVal.wearing,
									alimentary_canal: this.inputVal.alimentary_canal
								}
							]
						}
					];
					break;
				case 'sleep':
					let sleep_time = (new Date(this.inputVal.getup_time) - new Date(this.inputVal.retire_time)) / 1000; // 秒数
					sleep_time = this.second2Time(sleep_time);
					serviceName = 'srvhealth_sleep_record_add';
					req = [
						{
							serviceName: serviceName,
							data: [
								{
									service_no: this.serviceLog.no,
									user_info_no: this.serviceLog.user_info_no,
									retire_time: this.inputVal.retire_time,
									getup_time: this.inputVal.getup_time,
									sleepy_daytime: this.inputVal.sleepy_daytime,
									sleep_time: sleep_time
								}
							]
						}
					];
					break;
				case 'heartRate':
					serviceName = '';
					break;
				case 'bp':
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
						if(this.type==='weight'){
							this.changeWeightForBasicInfo(this.inputVal.weight)
						}
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
		changeWeightForBasicInfo(weight){
			let url = this.getServiceUrl('health', 'srvhealth_person_info_update', 'operate');
			let req = [{"serviceName":"srvhealth_person_info_update","condition":[{"colName":"userno","ruleType":"eq","value":this.currentUserInfo.userno}],"data":[{"weight":weight}]}]
			this.$http.post(url,req).then(res=>{
				if(res.data.state === 'SUCCESS'){
					this.selectBasicUserList()
					uni.showToast({
						title:'体重数据已更新',
					})
				}
			})
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
		width: 100%;
		padding-top: 30upx;
		margin: 0 auto 0;
		min-height: 85vh;
		.other-top-tit{
			background-color: #f5f5f5;
			padding: 10rpx 20rpx;
			text{
				&:first-child{
					color: red;
					margin-right: 8rpx;
				}
			}
		}
		.item-wrap {
			width: 90%;
			margin: 0 auto;
			.item-list {
				// border-bottom: 1px solid #cfcfcf;
				display: flex;
				flex-direction: column;
				margin-top: 30upx;
				text {
					color: #5e5e5e;
					margin-bottom: 10upx;
					font-weight: 700;
					
				}
				.item-list-top{
					text{
						&:first-child{
							color: red;
							margin-right: 8rpx;
						}
					}
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
		}
	}
	.other-bot {
		display: flex;
		justify-content: center;
		.btn {
			width: 70%;
			height: 70upx;
			color: #fff;
			// background-image: linear-gradient(90deg, #70c6ff, #0081ff);
			background-color: #0081ff;
			border-radius: 50upx;
			box-shadow: 3px 3px 4px rgba(10, 141, 255, 0.2);
			&.disabled {
				cursor: not-allowed;
				opacity: 0.6;
			}
		}
	}
}
</style>
