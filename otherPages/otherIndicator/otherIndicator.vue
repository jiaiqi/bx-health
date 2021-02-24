<template>
	<view class="other-wrap">
		<view class="other-top">
			<view class="other-top-tit">
				<text>*</text>
				<text>{{ topTitle }}</text>
			</view>
			<view v-if="type && type === 'weight'" class="item-wrap">
				<view class="item-list" @click="showWeightSelect = true">
					<text>衣着穿戴</text>
					<bx-checkbox-group v-model="inputVal.wearing" mode="button">
						<bx-checkbox v-for="item in list" :key="item.value" :name="item.value" v-model="item.checked">{{ item.value }}</bx-checkbox>
					</bx-checkbox-group>
				</view>
				<view class="item-list" @click="showWeightDigSelect = true">
					<text>消化道情况</text>
					<bx-checkbox-group v-model="inputVal.alimentary_canal" mode="button">
						<bx-checkbox v-for="item in DigList" :key="item.value" :name="item.value" v-model="item.checked">{{ item.value }}</bx-checkbox>
					</bx-checkbox-group>
				</view>
				<view class="item-list">
					<view class="item-list-top">
						<text>*</text>
						<text>体重(千克)</text>
						<text class="margin-left-xs">{{ inputVal.weight }}kg</text>
					</view>
					<slider-number v-model="inputVal.weight" :max="200" :min="0" :step="0.1"></slider-number>
				</view>
				<view class="item-list">
					<view class="item-list-top">
						<text></text>
						<text>体脂率(%)</text>
						<text class="margin-left-xs">{{ inputVal.body_fat_rate }}%</text>
					</view>
					<slider-number v-model="inputVal.body_fat_rate" :max="50" :min="0" :step="0.1"></slider-number>
				</view>
				<view class="item-list">
					<view class="item-list-top">
						<view class="label">
							<text>*</text>
							<text>测量时间:</text>
						</view>
						<view class="value" v-if="inputVal.measure_time">
							<picker mode="date" :value="inputVal.measure_time.split(' ')[0]" @change="DateChange($event, 'measure_time')">
								<view class="picker">{{ inputVal.measure_time.split(' ')[0] }}</view>
							</picker>
							<view class="margin-right"></view>
							<picker mode="time" :value="inputVal.measure_time.split(' ')[1]" @change="TimeChange($event, 'measure_time')">
								<view class="picker">{{ inputVal.measure_time.split(' ')[1] }}</view>
							</picker>
						</view>
					</view>
					<view class="number-change">
						<button class="operate cu-btn" @click="changeTime('measure_time', -60)">-1小时</button>
						<button class="operate cu-btn margin-right" @click="changeTime('measure_time', -10)">-10分钟</button>
						<button class="operate cu-btn" @click="changeTime('measure_time', 10)">+10分钟</button>
						<button class="operate cu-btn" @click="changeTime('measure_time', 60)">+1小时</button>
					</view>
				</view>
			</view>
			<view v-else-if="type && type === 'sleep'" class="item-wrap">
				<view class="item-list">
					<view class="item-list-top">
						<view class="label">
							<text>*</text>
							<text>就寝时间:</text>
						</view>
						<view class="value" v-if="inputVal.retire_time">
							<picker mode="date" :value="inputVal.retire_time.split(' ')[0]" @change="DateChange($event, 'retire_time')">
								<view class="picker">{{ inputVal.retire_time.split(' ')[0] }}</view>
							</picker>
							<view class="margin-right"></view>
							<picker mode="time" :value="inputVal.retire_time.split(' ')[1]" @change="TimeChange($event, 'retire_time')">
								<view class="picker">{{ inputVal.retire_time.split(' ')[1] }}</view>
							</picker>
						</view>
					</view>
					<view class="number-change">
						<button class="operate cu-btn" @click="changeTime('retire_time', -60)">-1小时</button>
						<button class="operate cu-btn margin-right" @click="changeTime('retire_time', -10)">-10分钟</button>
						<button class="operate cu-btn" @click="changeTime('retire_time', 10)">+10分钟</button>
						<button class="operate cu-btn" @click="changeTime('retire_time', 60)">+1小时</button>
					</view>
				</view>
				<view class="item-list">
					<view class="item-list-top">
						<view class="label">
							<text>*</text>
							<text>起床时间:</text>
						</view>
						<view class="value" v-if="inputVal.getup_time">
							<picker mode="date" :value="inputVal.getup_time.split(' ')[0]" start="2021-01-01" end="2030-09-01" @change="DateChange($event, 'getup_time')">
								<view class="picker">{{ inputVal.getup_time.split(' ')[0] }}</view>
							</picker>
							<view class="margin-right"></view>
							<picker mode="time" :value="inputVal.getup_time.split(' ')[1]" start="07:00" end="23:00" @change="TimeChange($event, 'getup_time')">
								<view class="picker">{{ inputVal.getup_time.split(' ')[1] }}</view>
							</picker>
						</view>
					</view>
					<view class="number-change">
						<button class="operate cu-btn" @click="changeTime('getup_time', -60)">-1小时</button>
						<button class="operate cu-btn margin-right" @click="changeTime('getup_time', -10)">-10分钟</button>
						<button class="operate cu-btn" @click="changeTime('getup_time', 10)">+10分钟</button>
						<button class="operate cu-btn" @click="changeTime('getup_time', 60)">+1小时</button>
					</view>
				</view>
				<view class="item-list">
					<text>睡眠过程记录</text>
					<bx-checkbox-group v-model="inputVal.sleep_event" mode="button">
						<bx-checkbox v-model="item.checked" class="checkbox" color="#2979ff" v-for="(item, i) in sleepEventOption" :key="item.value" :name="item.value">
							{{ item.label }}
						</bx-checkbox>
					</bx-checkbox-group>
				</view>
				<view class="item-list">
					<text>醒后状态</text>
					<bx-checkbox-group v-model="inputVal.wake_up_status" mode="button">
						<bx-checkbox v-model="item.checked" class="checkbox" color="#2979ff" v-for="(item, i) in wakeUpStatusOption" :key="item.value" :name="item.value">
							{{ item.label }}
						</bx-checkbox>
					</bx-checkbox-group>
				</view>
				<view class="item-list">
					<text>白天犯困情况</text>
					<bx-radio-group v-model="inputVal.sleepy_daytime" mode="button">
						<bx-radio class="radio" color="#2979ff" v-for="(item, i) in sleepy_option" :key="item.value" :name="item.value">{{ item.label }}</bx-radio>
					</bx-radio-group>
				</view>
				<view class="item-list">
					<view class="item-list-top">
						<text></text>
						<text>起夜次数:</text>
						<text class="margin-left">{{ inputVal.urinate_times }}</text>
					</view>
					<slider-number v-model="inputVal.urinate_times" :max="10" :min="0"></slider-number>
					<!-- <view class="item-list-bot"><input type="number" :value="inputVal.urinate_times" /></view> -->
				</view>
			</view>
			<!-- 			<view v-else-if="type && type === 'heartRate'" class="item-wrap">
				<view class="item-list" @click="openTime({ type: 'heartRate', field: 'date' })">
					<text>日期和时间</text>
					<view class="item-list-bot"><input type="text" value="" /></view>
				</view>
				<view class="item-list">
					<text>心率(次/分)</text>
					<slider-number v-model="inputVal.heart_rate" :max="200" :min="50"></slider-number>
				</view>
			</view> -->
			<view v-else-if="type && (type === 'pressure' || type === 'bp')" class="item-wrap">
				<!-- 血压 -->
				<view class="item-list">
					<text>姿势</text>
					<!-- <text>收缩压(高压 毫米汞柱)</text> -->
					<bx-radio-group v-model="inputVal.posture" mode="button">
						<bx-radio class="radio" color="#2979ff" v-for="(item, i) in postList" :key="i" :name="item.value">{{ item.value }}</bx-radio>
					</bx-radio-group>
				</view>
				<view class="item-list">
					<text>测量位置</text>
					<bx-radio-group v-model="inputVal.measure_position" mode="button">
						<bx-radio class="radio" color="#2979ff" v-for="(item, i) in measureList" :key="i" :name="item.value">{{ item.value }}</bx-radio>
					</bx-radio-group>
				</view>

				<view class="item-list">
					<view class="item-list-top">
						<text>*</text>
						<text>收缩压(高压 毫米汞柱)</text>
						<text class="margin-left-xs">{{ inputVal.systolic_pressure }}</text>
					</view>
					<slider-number v-model="inputVal.systolic_pressure" :max="200" :min="50"></slider-number>
				</view>
				<view class="item-list">
					<view class="item-list-top">
						<text>*</text>
						<text>舒张压(低压 毫米汞柱)</text>
						<text class="margin-left-xs">{{ inputVal.diastolic_pressure }}</text>
					</view>
					<slider-number v-model="inputVal.diastolic_pressure" :max="120" :min="50"></slider-number>
				</view>
				<view class="item-list">
					<view class="item-list-top">
						<text></text>
						<text>心率</text>
						<text class="margin-left-xs">{{ inputVal.heart_rate }}</text>
					</view>
					<slider-number v-model="inputVal.heart_rate" :max="200" :min="30"></slider-number>
				</view>
				<view class="item-list">
					<view class="item-list-top">
						<view class="label">
							<text>*</text>
							<text>测量时间:</text>
						</view>
						<view class="value" v-if="inputVal.measure_time">
							<picker mode="date" :value="inputVal.measure_time.split(' ')[0]" @change="DateChange($event, 'measure_time')">
								<view class="picker">{{ inputVal.measure_time.split(' ')[0] }}</view>
							</picker>
							<view class="margin-right"></view>
							<picker mode="time" :value="inputVal.measure_time.split(' ')[1]" @change="TimeChange($event, 'measure_time')">
								<view class="picker">{{ inputVal.measure_time.split(' ')[1] }}</view>
							</picker>
						</view>
					</view>
					<view class="number-change">
						<button class="operate cu-btn" @click="changeTime('measure_time', -60)">-1小时</button>
						<button class="operate cu-btn margin-right" @click="changeTime('measure_time', -10)">-10分钟</button>
						<button class="operate cu-btn" @click="changeTime('measure_time', 10)">+10分钟</button>
						<button class="operate cu-btn" @click="changeTime('measure_time', 60)">+1小时</button>
					</view>
				</view>
				<view class="item-list">
					<text>说明</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.remark" /></view>
				</view>
			</view>
			<!-- 	<view v-else-if="type && type === 'oxygen'" class="item-wrap">
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
					<slider-number v-model="inputVal.oxygen_saturation_max" :max="100" :min="70"></slider-number>
				</view>
				<view class="item-list">
					<text>血氧饱和度最小值(%)</text>
					<slider-number v-model="inputVal.oxygen_saturation_min" :max="100" :min="70"></slider-number>
				</view>
				<view class="item-list">
					<text>血氧饱和度平均(%)</text>
					<slider-number v-model="inputVal.oxygen_saturation_avg" :max="100" :min="70"></slider-number>
				</view>
				<view class="item-list">
					<text>说明</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.remark" /></view>
				</view>
			</view> -->
			<view v-else-if="type && type === 'glucose'" class="item-wrap">
				<!-- 血糖 -->
				<view class="item-list" @click="showSelect = true">
					<text>测量时机</text>
					<bx-radio-group v-model="inputVal.glucose_time" mode="button">
						<bx-radio class="radio" color="#2979ff" v-for="item in glucose_time_option" :key="item.value" :name="item.value">{{ item.value }}</bx-radio>
					</bx-radio-group>
				</view>
				<view class="item-list">
					<text>血糖值(mmol/l)</text>
					<slider-number v-model="inputVal.blood_glucose_val" :max="28" :min="0.5" :step="0.1"></slider-number>
				</view>
				<view class="item-list">
					<text>说明</text>
					<view class="item-list-bot"><input type="text" value="" v-model="inputVal.remark" /></view>
				</view>
			</view>
		</view>
		<view class="other-bot">
			<button type="primary" class="cu-btn btn bg-cyan shadow-blur" :class="{ disabled: !canSave }" @click="submitRecord" v-if="!isSubmit">保存</button>
			<button class="cu-btn  btn" @click="back" v-if="isSubmit">返回</button>
			<button class="cu-btn sm round bg-red margin-left-xs" @click="deleteItem" v-if="submitType === 'update'"><text class="cuIcon-delete"></text></button>
		</view>
	</view>
</template>

<script>
import bxRadio from '@/components/bx-radio/bx-radio.vue';
import bxRadioGroup from '@/components/bx-radio-group/bx-radio-group.vue';
import dayjs from '@/static/js/dayjs.min.js';
export default {
	name: 'otherIndicator',
	components: { bxRadio, bxRadioGroup },
	data() {
		return {
			planNo: '', //关联方按计划编码
			submitType: '', // update/add
			formId: '', //update时的id
			curItem: {},
			popupStatus: false,
			inputVal: {
				weight: 50,
				measure_time: '', //测量时间
				body_fat_rate: 20,
				glucose_time: '', //血糖 - 测量时机
				remark: '', // 说明
				blood_glucose_val: 6, // 血糖 - 血糖值
				start_time: '', // 血氧 - 起始时间
				end_time: '', // 血氧 - 结束时间
				oxygen_saturation_max: 90, // 血氧饱和度最大值%
				oxygen_saturation_min: 90, //血氧饱和度最小值%
				oxygen_saturation_avg: 90, // 血氧饱和度平均值%
				heart_rate: 60, // 血压- 心率
				diastolic_pressure: 70, //血压 - 舒张压
				systolic_pressure: 110, //血压-收缩压
				wearing: '', // 体重体脂 - 衣着穿戴
				alimentary_canal: '', // 体重体脂-  消化道情况
				retire_time: '', //睡眠 - 就寝时间
				getup_time: '', //睡眠 - 起床时间
				sleepy_daytime: '', //睡眠 - 犯困情况
				sleep_event: '', //睡眠过程记录
				urinate_times: 0, //起夜次数
				wake_up_status: '', //醒后状态
				posture: '坐位', //血压 - 姿势
				measure_position: '右上臂' // 血压 - 测量位置
			},
			wakeUpStatusOption: [
				{
					label: '无恢复感',
					value: '无恢复感',
					checked: false
				},
				{
					label: '头晕',
					value: '头晕',
					checked: false
				},
				{
					label: '头疼',
					value: '头疼',
					checked: false
				},
				{
					label: '憋气感',
					value: '憋气感',
					checked: false
				},
				{
					label: '口干',
					value: '口干',
					checked: false
				},
				{
					label: '咽喉异物感',
					value: '咽喉异物感',
					checked: false
				}
			],
			sleepEventOption: [{ label: '多梦', value: '多梦', checked: false }, { label: '出汗', value: '出汗', checked: false }],
			sleepy_option: [{ label: '从不', value: '从不' }, { label: '很少', value: '很少' }, { label: '经常', value: '经常' }, { label: '严重', value: '严重' }],
			showSelect: false,
			glucose_time_option: [{ label: '空腹', value: '空腹' }, { label: '餐后2小时', value: '餐后2小时' }, { label: '其他', value: '其他' }],
			currentUserInfo: null,
			serviceLog: null,
			type: null,
			dateTime: this.formateDate(new Date(), 'dates'),
			isSubmit: false,
			showWeightSelect: false,
			showWeightDigSelect: false,
			measureList: [
				{
					value: '右上臂',
					label: '右上臂',
					checked: false
				},
				{
					value: '左上臂',
					label: '左上臂',
					checked: false
				},
				{
					value: '右手腕',
					label: '右手腕',
					checked: false
				},
				{
					value: '左手腕',
					label: '左手腕',
					checked: false
				}
			],
			postList: [
				{
					value: '坐位',
					label: '坐位',
					checked: false
				},
				{
					value: '躺卧位',
					label: '躺卧位',
					checked: false
				},
				{
					value: '站立位',
					label: '站立位',
					checked: false
				}
			],
			list: [
				{
					value: '穿鞋',
					label: '穿鞋',
					checked: false
				},
				{
					value: '穿外套外衣',
					label: '穿外套外衣',
					checked: false
				},
				{
					value: '穿轻薄内衣',
					label: '穿轻薄内衣',
					checked: false
				}
			],
			DigList: [
				{
					value: '空腹',
					label: '空腹',
					checked: false
				},
				{
					value: '排空大小便',
					label: '排空大小便',
					checked: false
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
		topTitle() {
			let str = '';
			switch (this.type) {
				case 'weight':
					str = '称体重时注意保持空腹并且不要穿太多得衣服哦,否则测量会有偏差。';
					break;
				case 'sleep':
					str = '每天最少保证睡眠时间在7小时左右并且不要熬夜哦,可以有效地缓解疲劳';
					break;
				case 'glucose':
					str = '如果您是以为内最近感染、发热、呕吐、腹泻、外伤等疾病性就诊，抽血化验“顺带”发现血糖高，那么，这个“高血糖”尚不能作为糖尿病的依据。您应当在病好后再次化验血糖';
					break;
				case 'bp':
					str = '测量血压时要注意保持心情平稳，测量前最好休息15分钟，避免情绪激动、劳累、吸烟、憋尿等。';
					break;
			}
			return str;
		}
	},
	methods: {
		getLastWeightData() {
			// 查找上一次的体重体脂数据
			let serviceName = 'srvhealth_body_fat_measurement_record_select';
			if (this.type === 'bp' || this.type === 'pressure') {
				serviceName = 'srvhealth_blood_pressure_record_select';
			} else if (this.type === 'sleep') {
				serviceName = 'srvhealth_sleep_record_select';
			}
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [{ colName: 'service_no', ruleType: 'eq', value: this.serviceLog.no }],
				order: [{ colName: 'create_time', orderType: 'desc' }],
				page: { pageNo: 1, rownumber: 2 }
			};
			if (this.formId) {
				req.condition.push({ colName: 'id', ruleType: 'eq', value: this.formId });
			}
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
					let info = res.data.data[0];
					if (this.submitType === 'update') {
						this.curItem = info;
					}
					if (info.wearing) {
						this.inputVal.wearing = info.wearing;
						this.list = this.list.map(item => {
							if (info.wearing.indexOf(item.value) !== -1) {
								item.checked = true;
							}
							return item;
						});
					}
					if (info.alimentary_canal) {
						this.inputVal.alimentary_canal = info.alimentary_canal;
						this.DigList = this.DigList.map(item => {
							if (info.alimentary_canal.indexOf(item.value) !== -1) {
								item.checked = true;
							}
							return item;
						});
					}
					// if (info.weight) {
					// 	this.inputVal.weight = info.weight;
					// }
					let keys = [
						'heart_rate',
						'measure_position',
						'posture',
						'diastolic_pressure',
						'systolic_pressure',
						'retire_time',
						'getup_time',
						'sleepy_daytime',
						'weight',
						'body_fat_rate'
					];
					Object.keys(info).forEach(key => {
						if (keys.includes(key)) {
							this.inputVal[key] = info[key];
						}
					});
				}
			});
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
				page: { pageNo: 1, rownumber: 30 },
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				// 请求成功
				if (Array.isArray(res.data.data) && res.data.data.length > 0) {
					// 有记录
					this.serviceLog = res.data.data[0];
					switch (this.type) {
						case 'weight':
							this.getLastWeightData();
							break;
						default:
							if (this.submitType === 'update' && this.formId) {
								this.getLastWeightData();
							}
							break;
					}
				} else {
					// 没有记录，添加记录
					await this.addServiceLog();
				}
			}
		},
		deleteItem() {
			let e = this.curItem;
			if (!e.id) {
				return;
			}
			let serviceName = '';
			let req = [];
			let self = this;
			uni.showModal({
				title: '提示',
				content: '是否删除此条数据',
				success(res) {
					if (res.confirm) {
						switch (self.type) {
							case 'weight': //体重
								serviceName = 'srvhealth_body_fat_measurement_record_delete';
								req = [{ serviceName: 'srvhealth_body_fat_measurement_record_delete', condition: [{ colName: 'id', ruleType: 'in', value: e.id }] }];
								break;
							case 'sleep': //睡眠
								serviceName = 'srvhealth_sleep_record_delete';
								req = [{ serviceName: 'srvhealth_sleep_record_delete', condition: [{ colName: 'id', ruleType: 'in', value: e.id }] }];
								break;
							case 'bp': //血压
								serviceName = 'srvhealth_blood_pressure_record_delete';
								req = [{ serviceName: 'srvhealth_blood_pressure_record_delete', condition: [{ colName: 'id', ruleType: 'in', value: e.id }] }];
								break;
						}
						let url = self.getServiceUrl('health', serviceName, 'operate');
						self.$http.post(url, req).then(res => {
							if (res.data.state === 'SUCCESS') {
								uni.$emit('deleteItem');
								uni.showModal({
									title: '提示',
									content: '删除成功',
									showCancel: false,
									success(e) {
										if (e.confirm) {
											uni.navigateBack();
										}
									}
								});
							}
						});
					}
				}
			});
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
					title: '请完善信息',
					icon: 'none'
				});
				return;
			}
			let serviceName = '';
			let req = [];
			let verify = false;
			switch (this.type) {
				case 'weight':
					serviceName = 'srvhealth_body_fat_measurement_record_add';
					if (this.submitType === 'update' && this.formId) {
						serviceName = 'srvhealth_body_fat_measurement_record_update';
					}
					req = [
						{
							serviceName: serviceName,
							data: [
								{
									ps_no: this.planNo,
									service_no: this.serviceLog.no,
									name: this.serviceLog.name,
									weight: this.inputVal.weight,
									body_fat_rate: this.inputVal.body_fat_rate ? this.inputVal.body_fat_rate : 0,
									wearing: this.inputVal.wearing.toString(),
									alimentary_canal: this.inputVal.alimentary_canal.toString(),
									measure_time: this.inputVal.measure_time
								}
							]
						}
					];
					break;
				case 'sleep':
					let sleep_time = (new Date(this.inputVal.getup_time) - new Date(this.inputVal.retire_time)) / 1000; // 秒数
					sleep_time = this.second2Time(sleep_time);
					serviceName = 'srvhealth_sleep_record_add';
					if (this.submitType === 'update' && this.formId) {
						serviceName = 'srvhealth_sleep_record_update';
					}
					req = [
						{
							serviceName: serviceName,
							data: [
								{
									ps_no: this.planNo,
									service_no: this.serviceLog.no,
									user_info_no: this.serviceLog.user_info_no,
									retire_time: this.inputVal.retire_time,
									getup_time: this.inputVal.getup_time,
									sleepy_daytime: this.inputVal.sleepy_daytime,
									sleep_event: this.inputVal.sleep_event.toString(),
									urinate_times: this.inputVal.urinate_times,
									wake_up_status: this.inputVal.wake_up_status.toString(),
									sleep_time: sleep_time
								}
							]
						}
					];
					break;
				case 'bp':
				case 'pressure':
					// 血压
					serviceName = 'srvhealth_blood_pressure_record_add';
					if (this.submitType === 'update' && this.formId) {
						serviceName = 'srvhealth_blood_pressure_record_update';
					}
					req = [
						{
							serviceName: serviceName,
							data: [
								{
									ps_no: this.planNo,
									service_no: this.serviceLog.no,
									name: this.serviceLog.name,
									heart_rate: this.inputVal.heart_rate,
									systolic_pressure: this.inputVal.systolic_pressure,
									diastolic_pressure: this.inputVal.diastolic_pressure,
									posture: this.inputVal.posture,
									measure_position: this.inputVal.measure_position,
									remark: this.inputVal.remark,
									measure_time: this.inputVal.measure_time
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
									ps_no: this.planNo,
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
									ps_no: this.planNo,
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
			if (this.submitType === 'update' && this.formId) {
				req[0].condition = [{ colName: 'id', ruleType: 'eq', value: this.formId }];
			}
			let url = this.getServiceUrl('health', serviceName, 'operate');
			if (serviceName) {
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.response) && res.data.response.length > 0) {
					if (this.type === 'weight') {
						this.changeWeightForBasicInfo(this.inputVal.weight);
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
		changeWeightForBasicInfo(weight) {
			let url = this.getServiceUrl('health', 'srvhealth_person_info_update', 'operate');
			let req = [
				{ serviceName: 'srvhealth_person_info_update', condition: [{ colName: 'userno', ruleType: 'eq', value: this.currentUserInfo.userno }], data: [{ weight: weight }] }
			];
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					this.selectBasicUserList();
					uni.showToast({
						title: '体重数据已更新'
					});
					uni.navigateBack({
						delta: 0
					});
				}
			});
		},
		back() {
			uni.navigateBack();
		},
		TimeChange(e, type) {
			let val = this.inputVal[type];
			this.inputVal[type] = val.split(' ')[0] + ' ' + e.detail.value;
		},
		DateChange(e, type) {
			let val = this.inputVal[type];
			this.inputVal[type] = e.detail.value + ' ' + val.split(' ')[1];
		},
		changeTime(type, value) {
			this.$set(
				this.inputVal,
				type,
				dayjs(this.inputVal[type])
					.add(value, 'm')
					.format('YYYY-MM-DD HH:mm')
			);
		}
	},
	onLoad(option) {
		if (option.planNo) {
			this.planNo = option.planNo;
		}
		if (option.submitType) {
			this.submitType = option.submitType;
			if (option.formId) {
				this.formId = option.formId;
			}
		}
		let arr = ['systolic_pressure', 'diastolic_pressure', 'heart_rate'];
		arr.forEach(key => {
			if (option[key]) {
				if (key === 'heart_rate' && Number(option[key]) < 30) {
					option[key] = 30;
				}
				this.inputVal[key] = Number(option[key]);
			}
		});
		if (option && option.type) {
			this.type = option.type;
			if (option.type === 'sleep') {
				// 初始化值
				this.inputVal.retire_time =
					dayjs()
						.subtract(1, 'day')
						.format('YYYY-MM-DD') + ' 23:00'; //睡眠 - 就寝时间
				this.inputVal.getup_time = ''; //睡眠 - 起床时间
				if (Number(dayjs().format('HH')) > 7) {
					// 当前时间晚于早上七点 默认值为七点
					this.inputVal.getup_time = dayjs().format('YYYY-MM-DD') + ' 07:00';
				} else {
					// 当前时间早于早上七点 默认值为当前时间
					this.inputVal.getup_time = dayjs().format('YYYY-MM-DD HH') + ':00';
				}
			}
			// if (Number(dayjs().format('HH')) > 7) {
			// 	// 当前时间晚于早上七点 默认值为七点
			// 	this.inputVal.measure_time = dayjs().format('YYYY-MM-DD') + ' 07:00';
			// } else {
			// 当前时间早于早上七点 默认值为当前时间
			this.inputVal.measure_time = dayjs().format('YYYY-MM-DD HH:mm') 
			// + ':00';
			// }
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
						uni.navigateBack();
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.other-wrap {
	min-height: calc(100vh - var(--window-top));
	background-color: white;

	.other-top {
		width: 100%;
		padding-top: 30upx;
		margin: 0 auto 0;
		// min-height: 85vh;
		.other-top-tit {
			background-color: #f5f5f5;
			padding: 10rpx 20rpx;
			text {
				&:first-child {
					color: red;
					margin-right: 8rpx;
				}
			}
		}
		.item-wrap {
			width: calc(100% - 40rpx);
			margin: 0 auto;
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
					padding: 20rpx;
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
					text {
						&:first-child {
							color: red;
							margin-right: 8rpx;
						}
					}
					.value {
						flex: 1;
						font-weight: bold;
						margin-left: 20px;
						display: flex;
						color: #0bc99d;
						.picker {
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
		align-items: center;
		position: relative;
		margin: 50px 0 20px;
		.round {
			border-radius: 50%;
			height: 60rpx;
			width: 60rpx;
			font-size: 36rpx;
			position: absolute;
			right: 30rpx;
		}
		.btn {
			width: 60%;
			color: #fff;
			border-radius: 50upx;
			&.disabled {
				cursor: not-allowed;
				opacity: 0.6;
			}
		}
	}
}
</style>
