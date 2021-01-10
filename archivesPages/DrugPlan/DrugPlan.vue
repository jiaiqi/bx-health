<template>
	<view class="drug-plan">
		<view class="total-title"><view class="child-service-title"></view></view>
		<view class="main-table" @click="toPages('update')">
			<view class="table-item" v-for="item in fields" :key="item.column" :class="{ 'wrap-row': ['take_times_each_week', 'remark'].includes(item.column) }">
				<view class="label"><text class="text">{{ item.label }}</text></view>
				<view class="value">{{ item.value || '' }}</view>
			</view>
		</view>
		<view class="child-service">
			<view class="child-service-item" v-for="(item, index) in childServiceData" :key="index">
				<view class="child-service-title" v-if="item && item.colVs">
					<text class="title-text" v-if="item.colVs.service_view_name.indexOf('用药') !== -1">药品列表</text>
					<text class="title-text" v-if="item.colVs.service_view_name.indexOf('运动') !== -1">运动项目</text>
					<view class="" style="display: flex;">
						<text class="title-action margin-right-xs" @click="toPages('addPlan', item)">
							<text class="cuIcon-add "></text>
							<text class="see-histroy">添加</text>
						</text>
						<text class="title-action" @click="toPages('scanDrug', item)" v-if="item.colVs.service_view_name.indexOf('用药') !== -1">
							<text class="cuIcon-scan margin-right-xs"></text>
							<text class="see-histroy">扫一扫</text>
						</text>
					</view>
				</view>
				<view class="child-service-data-wrap">
					<view class="child-service-data" v-for="(data, dataIndex) in item.data" :key="dataIndex" @click="showDetailBox(data)">
						<view class="title" v-if="data.general_name">{{ data.general_name }}</view>
						<view class="title align-center" v-if="data.sport_name">{{ data.sport_name }}</view>
						<view class="detail" v-if="data.med_no">
							<view class="detail-label">用法：</view>
							<view class="data-item">
								<text class="label">
									<text class="value">一天{{ data.take_times }}次</text>
								</text>
							</view>
							<view class="data-item">
								<text class="label">
									<text class="value">{{ data.dosage_each_time }}</text>
									{{ data.dosage_unit }}/次
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="child-service-item">
				<view class="child-service-title">
					<text class="title-text">{{ planDetail.play_srv || '' }}记录</text>
					<view class="center-action">
						<text class="cuIcon-back operate" @click="changeDate('-')"></text>
						<text @click="toPages('open-calendar')">
							<text>{{ info.currentDate || nowDate }}{{ info.currentDate === nowDate ? '(今天)' : '' }}</text>
						</text>
						<text class="cuIcon-right operate" @click="changeDate('+')"></text>
					</view>
					<text class="title-action" @click="toPages('record')">
						<text class="cuIcon-add "></text>
						<text class="see-histroy">添加</text>
					</text>
				</view>
				<view class="drug-record-timeline">
					<view class="cu-timeline none-data" v-if="noRecord === true">
						<text class="cuIcon-warn margin-right-xs"></text>
						未找到今日{{ planDetail.play_srv || '' }}记录
					</view>
					<view class="cu-timeline" v-for="item in drugRecord" :key="item.date">
						<view class="cu-item">
							<view class="cu-time" :class="{ 'text-blue': item.date === nowDate }">{{ item.date === nowDate ? `${item.date.slice(5)}(今天)` : item.date.slice(5) }}</view>
							<view class="timeline-content">
								<view
									class="timeline-item"
									v-for="(record,index) in item.data"
									:key="index"
									@click="toPages('record-detail', record)"
									:class="{ 'bg-blue': item.date === nowDate, 'bg-gray': item.date !== nowDate }"
								>
									<view class="time">
										<text>{{ record.take_time.slice(0, 5) }}</text>
										<text class="margin-left-xs" v-if="record.blood_glucose_val">({{ record.blood_glucose_val }}mmol/L)</text>
										<text class="margin-left-xs" v-if="record.weight">({{ record.weight }}kg)</text>
										<text class="margin-left-xs" v-if="record.name&&!record.blood_glucose_val&&!record.weight">({{ record.name }})</text>
									</view>
									<view class="info" v-if="planDetail.play_srv === '运动'">{{ record.name + record.amount + record.unit }}</view>
									<view class="info" v-if="isArray(record.drugList) && planDetail.play_srv !== '运动'">已完成：{{ getDegree(record.drugList, 'degree') }}</view>
									<view
										class="progress bg-blue"
										:style="{ width: getDegree(record.drugList).width }"
										v-if="isArray(record.drugList) && planDetail.play_srv !== '运动' && getDegree(record.drugList) && getDegree(record.drugList).width"
									></view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: modalName === 'showAddRecord' }">
			<view class="cu-dialog " @tap.stop="">
				<view class="inspect-record">
					<view class="title">选择检查报告类型</view>
					<view class="cu-bar search bg-white">
						<view class="search-form round">
							<text class="cuIcon-search"></text>
							<input @blur="InputBlur" :adjust-position="false" type="text" placeholder="搜索检查报告类型" confirm-type="search" />
						</view>
						<view class="action"><button class="cu-btn bg-green shadow-blur round">搜索</button></view>
					</view>
					<tree-selector
						class="selector-wrap"
						:srvInfo="isArray(configCols.option_list_v2) ? null : configCols.option_list_v2"
						:treeData="treeSelectorData"
						:childNodeCol="'_childNode'"
						:disColName="configCols && configCols.option_list_v2 && configCols.option_list_v2['key_disp_col'] ? configCols.option_list_v2['key_disp_col'] : ''"
						:nodeKey="configCols.option_list_v2 && configCols.option_list_v2['refed_col'] ? configCols.option_list_v2['refed_col'] : 'no'"
						@clickLastNode="confirmTree"
					></tree-selector>
					<view class="" v-if="showCustomAddRecord">
						<text>未找到想要的报告类型？</text>
						<text class="text-blue" @click="confirmTree">直接添加</text>
					</view>
					<view class="button-box"><button class="cu-btn bg-grey" @tap="hideModal">取消</button></view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="{ show: modalName === 'drugDetail' }">
			<view class="cu-dialog">
				<DrugDetailInfo
					:drugInfo="drugInfo"
					:planNo="planNo"
					:type="drugDetailType"
					:drugDetail="drugDetail"
					@hideModal="hideModal"
					@updateSuccess="updateSuccess"
				></DrugDetailInfo>
			</view>
		</view>
		<uni-calendar
			v-if="showCalender"
			ref="calendar"
			class="uni-calendar--hook"
			:clear-date="true"
			:range="false"
			:startDate="info.startDate"
			:endDate="info.endDate"
			:date="info.date"
			:insert="info.insert"
			:selected="info.selected"
			:lunar="info.lunar"
			@confirm="confirmDate"
			@monthSwitch="monthSwitch"
		/>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import dayjs from '../static/dayjs/dayjs.min.js';
import DrugDetailInfo from '../components/DrugInfo/DrugInfo.vue';
/**
 * 获取任意时间
 */
function getDate(date, AddDayCount = 0) {
	if (!date) {
		date = new Date();
	}
	if (typeof date !== 'object') {
		date = date.replace(/-/g, '/');
	}
	const dd = new Date(date);

	dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期

	const y = dd.getFullYear();
	const m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1; // 获取当前月份的日期，不足10补0
	const d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); // 获取当前几号，不足10补0
	return {
		fullDate: y + '-' + m + '-' + d,
		year: y,
		month: m,
		date: d,
		day: dd.getDay()
	};
}
export default {
	components: {
		DrugDetailInfo
	},
	data() {
		return {
			info: {
				lunar: true,
				insert: false,
				startDate: '',
				endDate: '',
				selected: [],
				currentDate: ''
			},
			noRecord: false, //没有记录
			planNo: '',
			drugList: [], //当前用药计划的药品列表
			planDetail: {}, //用药计划
			colsV2Data: {},
			drugRecord: [], //用药记录
			todayRecord: [],
			currentRecord: {
				take_date: '',
				take_time: ''
			},
			fields: [],
			childServiceData: [],
			type: 'detail',
			appName: 'health',
			serviceName: 'srvhealth_plan_schedule_select',
			login_user_info: uni.getStorageSync('login_user_info'),
			drugDetail: {}, // 药品详情
			drugInfo: {
				dosage_unit: '片',
				take_times: '3',
				dosage_each_time: 1 //每次用量
			},
			timer: '',
			modalName: '',
			showCalender: false,
			drugDetailType: 'add',
			useDrugUnit: [
				{
					label: '片',
					value: '片'
				},
				{
					label: '颗/粒',
					value: '颗/粒'
				},
				{
					label: '毫升',
					value: '毫升'
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
			],
			showCustomAddRecord: false,
			configCols: {
				column: 'activity_no',
				label: '选择检查报告类型',
				srvInfo: { serviceName: 'srvdaq_activity_result_submit', appNo: 'daq' },
				type: 'treeSelector',
				isRequire: false,
				display: true,
				option_list_v2: { refed_col: 'daq_survey_activity_no', srv_app: 'health', serviceName: 'srvhealth_see_doctor_lab_examination_select', key_disp_col: 'name' },
				showExp: true,
				value: ''
			},
			treeSelectorData: [],
			treePageInfo: {
				pageNo: 1,
				rownumber: 20
			}
		};
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo
		}),
		nowDate() {
			return dayjs().format('YYYY-MM-DD');
		}
	},
	watch: {
		drugRecord: {
			deep: true,
			handler(newValue, oldValue) {}
		}
	},
	methods: {
		confirmDate(e) {
			this.info.currentDate = e.fulldate;
			this.getDrugRecord(this.planNo, this.info.currentDate);
		},
		changeDate(e) {
			let fullDate = this.info.currentDate;
			if (e === '-') {
				this.info.currentDate = dayjs(this.info.currentDate)
					.subtract(1, 'day')
					.format('YYYY-MM-DD');
			} else if (e === '+') {
				this.info.currentDate = dayjs(this.info.currentDate)
					.add(1, 'day')
					.format('YYYY-MM-DD');
			}
			this.getDrugRecord(this.planNo, this.info.currentDate);
		},
		monthSwitch(e) {
			this.getDrugRecord(this.planNo, `${e.year}-${e.month}`);
		},
		openCalendar() {},
		getDegree(drugList, type) {
			if (type === 'degree') {
				return `${drugList.filter(item => item.hasTook).length}/${drugList.length}`;
			} else {
				if(Array.isArray(drugList)){
					let num = drugList.filter(item => item.hasTook).length / drugList.length;
					if (num < 0.5) {
						return {
							width: `${num * 100}%`,
							bg: 'bg-red'
						};
					} else if (num >= 0.5 && num < 1) {
						return {
							width: `${num * 100}%`,
							bg: 'bg-orange'
						};
					} else if (num === 1) {
						return {
							width: `${num * 100}%`,
							bg: 'bg-green'
						};
					} else if (this.planDetail.play_srv !== '用药' || this.planDetail.play_srv !== '运动') {
						return {
							width: `100%`,
							bg: 'bg-blue'
						};
					}
				}
			}
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
			let amount = Number(this.drugInfo.dosage_each_time);
			if (amount + num >= 0) {
				amount += num;
			}
			this.drugInfo.dosage_each_time = Number(amount.toFixed(1));
		},
		deleteRecord(e) {
			const self = this;
			uni.showModal({
				title: '提示',
				content: '删除此条记录?',
				success(res) {
					if (res.confirm) {
						let url = self.getServiceUrl('health', 'srvhealth_plan_schedule_record_delete', 'operate');
						let req = [{ serviceName: 'srvhealth_plan_schedule_record_delete', condition: [{ colName: 'id', ruleType: 'in', value: e.id }] }];
						self.$http.post(url, req).then(res => {
							if (res.data.state === 'SUCCESS') {
								self.deleteRecordDetail(e.dsr_no);
							}
						});
					}
				}
			});
		},
		deleteRecordDetail(dsr_no) {
			let url = this.getServiceUrl('health', 'srvhealth_drug_schedule_record_detail_list_delete', 'operate');
			let req = [{ serviceName: 'srvhealth_drug_schedule_record_detail_list_delete', condition: [{ colName: 'dsr_no', ruleType: 'in', value: dsr_no }] }];
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					uni.showToast({
						title: '删除成功'
					});
					if (this.planNo) {
						// this.getFieldsV2(this.serviceName);
						this.getDrugRecord(this.planNo, this.nowDate);
					}
				}
			});
		},
		calcTime(time) {
			if (!time) {
				return;
			}
			let t = time.slice(0, 2);
			if (t > 9 && t <= 11) {
				return '上午';
			} else if (t > 11 && t <= 13) {
				return '中午';
			} else if (t > 13 && t <= 18) {
				return '下午';
			} else if (t > 18 && t <= 20) {
				return '傍晚';
			} else if (t > 20 && t <= 24) {
				return '晚上';
			} else if (t >= 0 && t < 4) {
				return '深夜';
			} else if (t >= 4 && t < 6) {
				return '凌晨';
			} else if (t >= 6 && t <= 9) {
				return '早晨';
			}
		},
		InputBlur(e) {
			let value = e.detail.value;
			if (e.detail.value) {
				let cond = [{ colName: 'name', ruleType: 'like', value: value }];
				this.getTreeSelectorData(cond);
			} else {
				this.getTreeSelectorData();
			}
		},
		async getTreeSelectorData(cond) {
			let self = this;
			let req = {
				serviceName: self.configCols.option_list_v2.serviceName,
				colNames: ['*'],
				condition: [],
				page: { pageNo: this.treePageInfo.pageNo, rownumber: this.treePageInfo.rownumber }
			};
			if (cond) {
				req.condition = [...req.condition, ...cond];
				setTimeout(() => {
					this.showCustomAddRecord = true;
				}, 1000);
			} else {
				this.showCustomAddRecord = false;
			}
			let appName = self.configCols.option_list_v2.srv_app;
			let res = await self.onRequest('select', req.serviceName, req, appName);
			if (res.data.state === 'SUCCESS') {
				if (res.data.page) {
					this.treePageInfo = res.data.page;
				}
				if (res.data.page && res.data.page.pageNo > 1) {
					let data = res.data.data;
					self.treeSelectorData = [...self.treeSelectorData, ...data];
				} else {
					if (res.data.data.length === 0) {
						uni.showToast({
							title: '没有找到相关数据',
							icon: 'none'
						});
					}
					self.treeSelectorData = res.data.data;
				}
			}
		},
		toPages(type, item) {
			let condition = [{ colName: 'ds_no', ruleType: 'eq', value: this.planNo }];
			let fieldsCond = [{ column: 'ds_no', condition: [{ colName: 'person_no', ruleType: 'eq', value: this.planDetail.person_no }] }];
			let url = '';
			switch (type) {
				case 'addPlan':
					fieldsCond = [{ column: 'ds_no', value: this.planNo, display: false }];
					url = '../DrugSelect/DrugSelect?ds_no=' + this.planNo + '&type=' + this.planDetail.play_srv;
					break;
				case 'scanDrug':
					let self = this;
					// #ifdef H5
					uni.showToast({
						title: '请在小程序端进行此操作',
						icon: 'none'
					});
					// #endif
					// #ifdef MP
					uni.scanCode({
						scanType: ['barCode'],
						success: function(res) {
							console.log('条码类型：' + res.scanType);
							console.log('条码内容：' + res.result);
							if (res.result) {
								self.selectDrugWithBarCode(res.result).then(result => {
									if (result) {
										result.take_times = '';
										self.drugDetail = result;
										self.drugDetailType = 'add';
										self.modalName = 'drugDetail';
									}else{
										uni.showModal({
											title:'提示',
											content:'未找到相关药品信息',
											showCancel:false
										})
									}
								});
							}
						}
					});
					// #endif

					break;
				case 'record-detail':
					if (item.sports_detail_no) {
						// condition.push({ colName: 'sports_detail_no', ruleType: 'eq', value: item.sports_detail_no });
					} else if (item.dsr_no) {
						condition.push({ colName: 'dsr_no', ruleType: 'eq', value: item.dsr_no });
					}
					url = `/archivesPages/addDrugRecord/addDrugRecord?formType=detail&serviceName=srvhealth_plan_schedule_record_select&pb_no=${
						this.planDetail.owner_person_no
					}&type=add&cond=${encodeURIComponent(JSON.stringify(condition))}&ds_no=${this.planNo}`;
					if (this.planDetail.play_srv === '运动') {
						url += '&addType=sport';
					} else if (this.planDetail.play_srv) {
						url += '&addType=' + this.planDetail.play_srv;
					}
					if (this.planDetail.play_srv === '测血压') {
						return;
						url = '/otherPages/otherIndicator/otherIndicator?type=bp&planNo=' + this.planNo;
					}
					break;
				case 'record':
					url = `/archivesPages/addDrugRecord/addDrugRecord?serviceName=srvhealth_plan_schedule_record_add&date=${this.info.currentDate}&pb_no=${
						this.planDetail.owner_person_no
					}&type=add&cond=${encodeURIComponent(JSON.stringify(condition))}&ds_no=${this.planNo}`;
					switch (this.planDetail.play_srv) {
						case '运动':
							url += '&addType=sport';
							break;
						case '测血压':
							url = '/otherPages/otherIndicator/otherIndicator?type=bp&planNo=' + this.planNo;
							break;
						case '测体重':
							url = '/otherPages/otherIndicator/otherIndicator?type=weight&planNo=' + this.planNo;
							break;
						case '测血糖':
							url = '/otherPages/otherIndicator/otherIndicator?type=glucose&planNo=' + this.planNo;
							break;
						case '饮食':
							let contentType = {
								type: 'food',
								date: this.info.currentDate,
								serviceName: 'srvhealth_diet_contents_select',
								colName: 'name',
								imgCol: 'image',
								wordKey: {
									title: 'name',
									unit: 'unit',
									energy: 'unit_energy'
								}
							};
							url = `/otherPages/dietSelect/dietSelect?condType=${encodeURIComponent(JSON.stringify(contentType))}&planNo=${this.planNo}`;
							break;
						case '检查':
						case '治疗':
						case '就医':
							this.modalName = 'showAddRecord';
							this.showCustomAddRecord = false;
							this.getTreeSelectorData();
							url = '';
							break;
						default:
							url += '&addType=' + this.planDetail.play_srv;
							break;
					}
					break;
				case 'open-calendar':
					if (this.$refs.calendar) {
						this.$refs.calendar.open();
					}
					break;
				case 'update':
					let fieldsCond = [
						{ column: 'ds_no', display: false, value: this.planDetail.ds_no },
						{ column: 'end_date', display: false },
						{ column: 'person_no', display: false },
						{ column: 'create_manager_no', display: false },
						{ column: 'owner_person_no', display: false }
					];
					let params = {
						to: '/archivesPages/DrugPlan/DrugPlan', //提交后要跳转的页面
						idCol: 'ds_no' // 跳转时携带的参数
					};
					uni.navigateTo({
						url: `/publicPages/newForm/newForm?serviceName=srvhealth_plan_schedule_update&type=update&fieldsCond=${encodeURIComponent(
							JSON.stringify(fieldsCond)
						)}&params=${encodeURIComponent(JSON.stringify(params))}`
					});
					break;
			}
			if (url) {
				uni.navigateTo({
					url: url
				});
			}
		},
		async selectDrugWithBarCode(medicine_barcode) {
			let url = this.getServiceUrl('health', 'srvhealth_medicine_info_select', 'select');
			let req = {
				serviceName: 'srvhealth_medicine_info_select',
				colNames: ['*'],
				condition: [{ colName: 'medicine_barcode', ruleType: 'eq', value: medicine_barcode }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				return res.data.data[0];
			}
		},
		async addDrugItem() {
			let detail = this.drugDetail;
			let info = this.drugInfo;
			let url = this.getServiceUrl('health', 'srvhealth_drug_schedule_detail_list_add', 'operate');
			let req = [
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
							ds_no: this.planNo
						}
					]
				}
			];
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					uni.showToast({
						title: '添加成功'
					});
					this.modalName = '';
					this.getFieldsV2();
				}
			});
		},
		showDetailBox(item) {
			this.drugInfo = item;
			this.modalName = 'drugDetail';
			this.drugDetailType = 'update';
		},
		async getFieldsV2(serviceName) {
			let colVs = await this.getServiceV2('srvhealth_plan_schedule_select', 'detail', 'detail', 'health');
			let defaultVal = '';
			if (this.planNo) {
				defaultVal = await this.getPlanDetail(this.planNo);
			}
			this.colsV2Data = colVs;
			if (!colVs) {
				// this.getPlanDetail(this.planNo);
				return;
			}
			if (Array.isArray(colVs.child_service)) {
				let childServiceData = [];
				for (let item of colVs.child_service) {
					const url = this.getServiceUrl(this.appName, item.service_name, 'select');
					let req = {
						serviceName: item.service_name,
						colNames: ['*'],
						condition: [{ colName: 'ds_no', ruleType: 'eq', value: this.planNo }]
					};
					let res = await this.$http.post(url, req);
					if (res.data.data) {
						if (item.service_view_name.indexOf(this.planDetail.play_srv) !== -1) {
							childServiceData.push({
								colVs: item,
								data: res.data.data
							});
							this.drugList = res.data.data;
						}
					}
				}
				this.childServiceData = childServiceData;
			}
			switch (this.type) {
				case 'add':
					if (this.defaultCondition && Array.isArray(this.defaultCondition) && colVs._fieldInfo && Array.isArray(colVs._fieldInfo)) {
						let arr = [];
						this.defaultCondition.forEach(cond => {
							colVs._fieldInfo.forEach(field => {
								if (cond.colName === field.column) {
									field['value'] = cond['value'];
									field['disabled'] = true;
								}
							});
						});
					}
					break;
				case 'update':
				case 'detail':
					let fields = this.setFieldsDefaultVal(colVs._fieldInfo, defaultVal ? defaultVal : this.params.defaultVal);
					let hideColumns = [
						'play_srv',
						'create_manager_no',
						'manager_user_no',
						'owner_user_profile_url',
						'owner_user_no',
						'owner_person_no',
						'ds_no',
						'create_time',
						'create_user',
						'create_user_disp',
						'modify_user',
						'modify_user_disp',
						'modify_time',
						'person_no',
						'end_date'
					];
					this.fields = fields.filter(item => {
						return !hideColumns.includes(item.column);
					});
					break;
				default:
					break;
			}
			this.info.currentDate = this.nowDate;
			this.getDrugRecord(this.planNo, this.nowDate);
		},
		async getDrugRecordDetail() {
			// 查找此计划的记录
			let serviceName = 'srvhealth_drug_schedule_record_detail_list_select';
			if (this.planDetail.play_srv === '运动') {
				serviceName = 'srvhealth_body_activity_record_select';
			}
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [{ colName: 'ds_no', ruleType: 'eq', value: this.planNo }]
			};
			if (this.planDetail.play_srv === '运动') {
				req.condition = [{ colName: 'plan_no', ruleType: 'eq', value: this.planNo }];
			}
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				return res.data.data;
			}
		},
		async getDrugRecord(no, date) {
			// 查找此计划的记录
			this.noRecord = false;
			let url = this.getServiceUrl('health', 'srvhealth_plan_schedule_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_plan_schedule_record_select',
				colNames: ['*'],
				order: [{ colName: 'take_date', orderType: 'desc' }],
				condition: [{ colName: 'ds_no', ruleType: 'eq', value: no }]
			};
			if (this.login_user_info && this.login_user_info.user_no) {
				req.condition.push({ colName: 'create_user', ruleType: 'eq', value: this.login_user_info.user_no });
			}
			if (this.planDetail.play_srv === '测血压') {
				url = this.getServiceUrl('health', 'srvhealth_blood_pressure_record_select', 'select');
				req.serviceName = 'srvhealth_blood_pressure_record_select';
				req.condition = [{ colName: 'ps_no', ruleType: 'eq', value: no }];
				req.order = [];
				if (date) {
					req.condition.push({ colName: 'create_time', ruleType: 'like', value: date });
				}
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data)) {
					this.drugRecord = [
						{
							date: date,
							data: res.data.data.map(item => {
								item.take_time = item.create_time.slice(11);
								item.date = item.create_time.slice(0, 10);
								item.take_date = item.date;
								item.hasTook = true; //已服用
								return item;
							})
						}
					];
				}
				return;
			}
			if (this.planDetail.play_srv === '测体重') {
				url = this.getServiceUrl('health', 'srvhealth_body_fat_measurement_record_select', 'select');
				req.serviceName = 'srvhealth_body_fat_measurement_record_select';
				req.condition = [{ colName: 'ps_no', ruleType: 'eq', value: no }];
				req.order = [];
				if (date) {
					req.condition.push({ colName: 'create_time', ruleType: 'like', value: date });
				}
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data)) {
					this.drugRecord = [
						{
							date: date,
							data: res.data.data.map(item => {
								item.take_time = item.create_time.slice(11);
								item.date = item.create_time.slice(0, 10);
								item.take_date = item.date;
								item.hasTook = true; //已服用
								return item;
							})
						}
					];
				}
				return;
			}
			if (this.planDetail.play_srv === '测血糖') {
				url = this.getServiceUrl('health', 'srvhealth_blood_glucose_measurement_record_select', 'select');
				req.serviceName = 'srvhealth_blood_glucose_measurement_record_select';
				req.condition = [{ colName: 'ps_no', ruleType: 'eq', value: no }];
				req.order = [];
				if (date) {
					req.condition.push({ colName: 'create_time', ruleType: 'like', value: date });
				}
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data)) {
					this.drugRecord = [
						{
							date: date,
							data: res.data.data.map(item => {
								item.take_time = item.create_time.slice(11);
								item.date = item.create_time.slice(0, 10);
								item.take_date = item.date;
								item.hasTook = true; //已服用
								return item;
							})
						}
					];
				}
				return;
			}
			if (['检查', '就医', '治疗'].includes(this.planDetail.play_srv)) {
				url = this.getServiceUrl('health', 'srvhealth_examination_report_select', 'select');
				req.serviceName = 'srvhealth_examination_report_select';
				req.condition = [{ colName: 'ps_no', ruleType: 'eq', value: no }];
				req.order = [];
				if (date) {
					req.condition.push({ colName: 'create_time', ruleType: 'like', value: date });
				}
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data)) {
					this.drugRecord = [
						{
							date: date,
							data: res.data.data.map(item => {
								item.take_time = item.create_time.slice(11);
								item.date = item.create_time.slice(0, 10);
								item.take_date = item.date;
								item.hasTook = true; //已服用
								return item;
							})
						}
					];
				}
				return;
			}
			if (this.planDetail.play_srv === '饮食') {
				url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
				req.serviceName = 'srvhealth_diet_record_select';
				req.condition = [{ colName: 'ps_no', ruleType: 'eq', value: no }];
				req.order = [];
				if (date) {
					req.condition.push({ colName: 'create_time', ruleType: 'like', value: date });
				}
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data)) {
					this.drugRecord = [
						{
							date: date,
							data: res.data.data.map(item => {
								item.take_time = item.create_time.slice(11);
								item.date = item.create_time.slice(0, 10);
								item.take_date = item.date;
								item.hasTook = true; //已服用
								return item;
							})
						}
					];
				}
				return;
			}
			let res = await this.$http.post(url, req);
			setTimeout(() => {
				this.showCalender = true;
			}, 2000);
			if (Array.isArray(res.data.data)) {
				if (res.data.data.length == 0) {
					this.drugRecord = [];
					return;
				}
				let dateArr = [];
				let DrugRecordDetailList = await this.getDrugRecordDetail();
				if (!DrugRecordDetailList) {
					return;
				}
				res.data.data.forEach(item => {
					if (item.take_date && !dateArr.includes(item.take_date)) {
						dateArr.push(item.take_date);
					}
				});
				let recordList = dateArr.map(date => {
					let record = {
						date: date,
						data: []
					};
					res.data.data.forEach(item => {
						item.detail = [];
						if (Array.isArray(DrugRecordDetailList) && DrugRecordDetailList.length > 0) {
							DrugRecordDetailList.forEach(detail => {
								if (detail.dsr_no === item.dsr_no) {
									item.detail.push(detail);
									if (item.take_date === this.nowDate) {
										let hasExist = this.todayRecord.find(record => record.take_time === item.take_time);
										if (!hasExist) {
											this.todayRecord.push(item);
										}
									}
								}
							});
						}
						let drugList = this.deepClone(this.drugList);
						item.drugList = drugList.map(d => {
							d.hasTook = false;
							if (Array.isArray(item.detail) && item.detail.length > 0) {
								item.detail.forEach(drug => {
									if (d.s_code === drug.s_code) {
										d.hasTook = true; //已服用
									}
								});
							}
							return d;
						});
						if (this.planDetail.play_srv === '运动' && date === item.take_date) {
							if (Array.isArray(DrugRecordDetailList) && DrugRecordDetailList.length > 0) {
								DrugRecordDetailList.forEach(detail => {
									detail.date = detail.hdate;
									detail.take_date = detail.hdate;
									detail.hasTook = true; //已服用
									detail.take_time = detail.htime;
									record.data.push(detail);
								});
							}
						} else {
							if (date === item.take_date) {
								record.data.push(item);
							}
						}
					});
					return record;
				});
				if (Array.isArray(recordList) && recordList.length > 0) {
					this.info.selected = recordList.reduce((pre, cur) => {
						console.log(this.planDetail);
						let info = {
							date: cur.date,
							info: '',
							status: 'primary'
						};
						if (Array.isArray(cur.data) && cur.data.length > 0) {
							cur.data.forEach(detail => {
								if (Array.isArray(detail.drugList)) {
									if (detail.drugList.length === this.drugList.length) {
										info.status = 'success';
										info.info = '正常';
									} else if (detail.drugList.length > 0 && detail.drugList.length < this.drugList.length) {
										info.status = 'warning';
										info.info = '缺少';
									} else if (detail.drugList.length == 0) {
										info.status = 'error';
										info.info = '未进行';
									}
								}
							});
						}
						pre.push(info);
						return pre;
					}, []);
				}
				this.drugRecord = recordList.filter(item => {
					return item.date.indexOf(date) !== -1;
				});
				if (this.drugRecord.length === 0) {
					this.noRecord = true;
				} else {
					this.noRecord = false;
				}
				return recordList;
			}
		},
		buildTodayCase() {
			let drugList = this.deepClone(this.childServiceData[0].data);
			let todayDrugDetail = this.todayRecord.reduce((a, b) => a.concat(b.detail), []);
			this.drugList = drugList.map(drug => {
				let times = 0;
				todayDrugDetail.forEach(item => {
					if (item.s_code === drug.s_code) {
						times++;
					}
				});
				drug.times = times;
				return drug;
			});
		},
		async getPlanDetail(no) {
			// 查找此用药计划的详细信息
			let url = this.getServiceUrl('health', 'srvhealth_plan_schedule_select', 'select');
			let req = {
				serviceName: 'srvhealth_plan_schedule_select',
				colNames: ['*'],
				condition: [{ colName: 'ds_no', ruleType: 'eq', value: no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.planDetail = res.data.data[0];
				this.info.startDate = this.planDetail.start_date;
				this.info.endDate = dayjs(this.planDetail.start_date)
					.add(this.planDetail.take_days)
					.format('YYYY-MM-DD');
				return res.data.data[0];
			}
		},
		updateSuccess() {
			this.hideModal();
			this.getFieldsV2(this.serviceName);
		},
		hideModal() {
			this.modalName = '';
		},
		confirmTree(e) {
			if (e.item && e.item.jy_no) {
				let fieldsCond = [
					{ column: 'specimen', value: e.item.specimen }, //标本类型
					{ column: 'examination_type', value: e.item.examination_type }, //检查类别
					{ column: 'jy_no', display: false, value: e.item.jy_no },
					{ column: 'examinate_person_no', display: false, value: this.userInfo.no },
					{ column: 'examinate_name', display: false, value: this.userInfo.name },
					{ column: 'examinate_account', display: false, value: this.userInfo.userno },
					{ column: 'examinate_date', display: true, value: dayjs().format('YYYY-MM-DD') },
					{ column: 'report_daq_survey_activity_no', display: false },
					{ column: 'report_record', display: false },
					{ column: 'report_daq_survey_ack_no', display: false }
				];
				let url = `/archivesPages/report/report?serviceName=srvhealth_examination_report_add&type=add&fieldsCond=${encodeURIComponent(JSON.stringify(fieldsCond))}`;
				if (e.item.daq_survey_activity_no) {
					let params = {
						to: `/archivesPages/report/report?serviceName=srvhealth_examination_report_add&type=add`, //提交后要跳转的页面
						idCol: 'report_daq_survey_activity_no', // 跳转时携带的参数
						buttonLabel: '下一步',
						fieldsCond: fieldsCond
					};
					fieldsCond[fieldsCond.findIndex(item => item.column === 'report_daq_survey_activity_no')].value = e.item.daq_survey_activity_no;
					url = `/questionnaire/index/index?formType=form&planNo=${this.planNo}&activity_no=${e.item.daq_survey_activity_no}&status=进行中&params=${encodeURIComponent(
						JSON.stringify(params)
					)}`;
				}
				uni.navigateTo({
					url: url
				});
			} else {
				let fieldsCond = [
					{ column: 'jy_no', display: false },
					{ column: 'examinate_person_no', display: false, value: this.userInfo.no },
					{ column: 'examinate_name', display: false, value: this.userInfo.name },
					{ column: 'examinate_account', display: false, value: this.userInfo.userno },
					{ column: 'examinate_date', display: true, value: dayjs().format('YYYY-MM-DD') },
					{ column: 'report_daq_survey_activity_no', display: false },
					{ column: 'report_record', display: false },
					{ column: 'report_daq_survey_ack_no', display: false }
				];
				uni.navigateTo({
					url: `/archivesPages/report/report?serviceName=srvhealth_examination_report_add&planNo=${this.planNo}&type=add&fieldsCond=${encodeURIComponent(
						JSON.stringify(fieldsCond)
					)}`
				});
			}
		}
	},
	onShow() {
		if (this.planNo) {
			this.getFieldsV2(this.serviceName);
		}
	},
	created() {
		let self = this;
		uni.$on('selectDrug', e => {
			(e.dosage_unit = '片'), (e.take_times = '3次');
			self.drugDetail = e;
			self.modalName = 'drugDetail';
		});
		uni.$on('addDrug', e => {
			this.getFieldsV2(this.serviceName);
		});
	},
	onLoad(options) {
		if (options.ds_no) {
			this.planNo = options.ds_no;
			this.getFieldsV2(this.serviceName);
		}
		if (options.play_srv == '用药' || options.play_srv == '运动') {
			this.childServiceData = [
				{
					colVs: {
						main_table: 'bxhealth_drug_schedule_detail_list',
						service_name: 'srvhealth_drug_schedule_detail_list_select',
						foreign_key: {
							table_name: 'bxhealth_drug_schedule_detail_list',
							column_name: 'ds_no',
							referenced_table_name: 'bxhealth_plan_schedule',
							referenced_column_name: 'ds_no',
							keydispcol: 'ds_name',
							foreign_key_type: '字段引用',
							update_rule: 'CASCADE',
							delete_rule: 'CASCADE',
							create_to_physical: '否',
							actual_physical_state: null,
							show_ui_child_table: '是',
							show_child_list_expr: null,
							show_ui_seq: 10,
							show_ui_model: 'collapse',
							view_model: 'list',
							card_no: null,
							child_table_readonly: '否',
							section_name: '用药明细',
							show_ui_grandson_table: '否',
							section_grandson_name: null,
							biz_no: null,
							biz_path: null,
							more_config: null,
							create_user: 'wangyl',
							create_time: '2020-11-25 15:30:50',
							modify_time: '2020-11-25 15:30:50',
							modify_user: null,
							create_user_disp: '王永利/11000006',
							modify_user_disp: null,
							del_flag: '否',
							conditions: []
						},
						service_view_name: '用药计划明细列表',
						data: []
					}
				}
			];
		}
	}
};
</script>

<style lang="scss" scoped>
.drug-plan {
	min-height: calc(100vh - var(--window-top) - var(--window-bottom));
	background-color: #fff;
	overflow: hidden;
	.main-table {
		// padding: 20rpx 0;
		display: grid;
		margin: 20rpx;
		grid-template-columns: repeat(2, calc(50% - 0rpx));
		// grid-column-gap: 20rpx;
		background-color: #409eff;
		box-shadow: 0px 1px 4px 0px #4e87c6, 0px 5px 2px 0px #b3d8ff;
		// box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		border-radius: 20rpx;
		min-height: 220rpx;
		overflow: hidden;
		.table-item {
			display: flex;
			padding: 10rpx 20rpx;
			line-height: 40rpx;
			color: #fff;
			// border: 1px solid #f1f1f1;
			margin-left: -1px;
			margin-top: -1px;
			&.wrap-row {
				// flex-direction: column;
				grid-column-end: 3;
				grid-column-start: 1;
				.label{
					flex: 0.5;
				}
				.value {
					margin: 10rpx 0;
				}
			}
			&.delete {
				justify-content: center;
				grid-column-end: 3;
				grid-column-start: 1;
				background-color: #fff;
				color: #f76260;
				border: 1rpx solid #409eff;
				border-bottom-left-radius: 10rpx;
				border-bottom-right-radius: 10rpx;
			}
			.label {
				flex: 0.8;
				display: flex;
				align-items: center;
				.text{
					position: relative;
					// &::after{
					// 	content: '';
					// 	position: absolute;
					// 	width: 80%;
					// 	bottom: -10rpx;
					// 	left: 0;
					// 	border-bottom: 5rpx solid #fff;
					// }
				}
			}
			.value {
				font-weight: 700;
				flex: 1;
			}
		}
	}
}
.total-title {
	padding: 20rpx 20rpx 0;
	/deep/ .cu-form-group {
		margin: 0;
		padding: 0;
	}
	.child-service-title {
		margin-bottom: 0;
	}
}
.drug-record-timeline {
	.cu-timeline {
		& > .cu-item {
			padding: 20rpx 20rpx 20rpx 90rpx;
		}
		.cu-time {
			width: 150rpx;
			text-align: left;
			&.text-blue {
				color: #0081ff;
			}
		}
		&.none-data {
			display: flex;
			min-height: 200rpx;
			align-items: center;
			justify-content: center;
			width: 100%;
			color: #999;
			font-weight: bold;
		}
	}
	.timeline-content {
		background-color: #fff;
		display: flex;
		flex-wrap: wrap;
		// flex-direction: column;
		// box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.12);
		.timeline-item {
			min-width: calc(50% - 20rpx);
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			padding: 10rpx 20rpx;
			box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
			display: flex;
			flex-direction: column;
			border-radius: 30rpx;
			position: relative;
			overflow: hidden;
			color: #fff;
			text-align: center;
			&:nth-child(2n) {
				margin-right: 0;
			}
			.info {
				margin: 10rpx 0;
				z-index: 2;
			}
			.time {
				z-index: 2;
			}
			.delete-bar {
				position: absolute;
				right: 20rpx;
				top: 10rpx;
				z-index: 2;
			}
			.progress {
				position: absolute;
				left: 0;
				top: 0;
				width: 0;
				height: 100%;
				transition: all 2s ease-in-out;
				&.bg-blue {
					background-color: #409eff;
				}
			}
		}
		.top {
			display: flex;
			justify-content: space-between;
			.delete-icon {
				font-size: 40rpx;
				transition: 0.5s all ease-in-out;
				&:active {
					transform: scale(1.3);
				}
			}
		}
		.drug-detail {
			display: flex;
			flex-wrap: wrap;
			margin-top: 20rpx;
			.detail-item {
				flex: 1;
				min-width: 45%;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.cuIcon-squarecheck {
					font-size: 40rpx;
					margin-right: 10rpx;
				}
			}
		}
	}
}
.child-service-title {
	width: 100%;
	font-size: 32rpx;
	font-weight: bold;
	margin-bottom: 20rpx;
	position: relative;
	text-indent: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
	.center-action {
		display: flex;
		align-items: center;
		color: #0081ff;
		padding: 10rpx 0;
		box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.32), 0 0 6px rgba(0, 0, 0, 0.04);
		border-radius: 50rpx;
		padding-right: 20rpx;
		.title-action {
			box-shadow: none;
			border: none;
		}
		.operate {
			&.margin-right-xs {
				margin-right: 15rpx;
			}
			&:active {
				background-color: #f1f1f1;
			}
			// box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.32), 0 0 6px rgba(0, 0, 0, 0.04);
		}
	}
	.title-text {
		margin: 0;
		padding: 0;
		display: inline-block;
		position: relative;
		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 10%;
			height: 80%;
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
		color: #0081ff;
		transition: all 1s;
		box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		&:active {
			background-color: #999;
			color: #fff;
		}

		.see-histroy {
			font-size: 24rpx;
			text-indent: 0;
		}
	}
}
.child-service {
	background-color: #fff;
	padding-top: 20rpx;
	.child-service-item {
		padding: 0 20rpx;
		margin-bottom: 40rpx;
		min-height: 220rpx;
		&:first-child {
			min-height: 220rpx;
		}
		.child-service-data-wrap {
			display: grid;
			grid-template-columns: repeat(3, calc(33.33% - 40rpx / 3));
			grid-row-gap: 20rpx;
			grid-column-gap: 20rpx;
			.child-service-data {
				padding: 10rpx 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				border-radius: 0rpx;
				color: #409eff;
				background: #ecf5ff;
				border-color: #b3d8ff;
				box-shadow: 0px 0px 4px #ecf5ff, 0 0 6px #b3d8ff;
				&:nth-child(2n) {
					margin-right: 0;
				}
				.title {
					width: 100%;
					// text-align: center;
					font-weight: 700;
					padding: 0 10rpx;
					&.align-center {
						text-align: center;
					}
				}
				.detail {
					display: flex;
					flex-wrap: wrap;
					padding: 10rpx;
					font-size: 24rpx;
					.detail-label {
						width: 100%;
					}
					.data-item {
						margin-right: 10rpx;
					}
				}
			}
		}
	}
}
.cu-modal {
	z-index: 900;
	.cu-dialog {
		overflow: initial;
	}
}

.cu-dialog .drug-detail {
	display: flex;
	flex-direction: column;
	padding: 20rpx;
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
			// &:last-child{
			// 	border-top: 2rpx dashed #ccc;
			// }
		}
		&.item-title {
			justify-content: space-between;
			margin-bottom: 20rpx;
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
			// font-size: 24rpx;
			// text-align: left;
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
				}
				.operate {
					display: inline-block;
					color: #fff;
					background-color: rgba(11, 201, 157, 0.7);
					// background-color: #bababa;
					width: 100rpx;
					height: 80rpx;
					line-height: 80rpx;
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
.inspect-record {
	width: 100%;
	background-color: #fff;
	position: relative;
	display: flex;
	flex-direction: column;
	height: 80vh;
	.selector-wrap {
		overflow: scroll;
		flex: 1;
	}
	.title {
		width: 100%;
		text-align: center;
		font-size: 36rpx;
		font-weight: 700;
		padding: 20rpx;
	}
	.button-box {
		// position: absolute;
		// bottom: 20rpx;
		.cu-btn {
			width: 45%;
		}
	}
}
</style>
