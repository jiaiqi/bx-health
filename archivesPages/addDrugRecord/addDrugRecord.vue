<template>
	<view class="form-page">
		<view class="drug-select-box" v-if="fields && fields.length > 0">
			<!-- 药品选择 -->
			<view class="title" v-if="drugList && drugList.length > 0">{{ addType === 'sport' ? '运动项目清单' : '药物清单' }}</view>
			<view class="drug-list" v-if="drugList && drugList.length > 0">
				<view class="drug-item" v-for="item in drugList" :class="{ active: item.checked }" @click="changeDrugChecked(item)">
					<view class="title">{{ item.label }}</view>
					<view class="check-box"><text class="cuIcon-check"></text></view>
				</view>
			</view>
		</view>
		
		<a-form-item v-if="selectedDrug" :field="sportField" pageType="add" ref="fitem"></a-form-item>
		<a-form-item v-if="selectedDrug" :field="sportUnit" pageType="add" ref="fitem"></a-form-item>
		<a-form
			ref="bxForm"
			v-if="colsV2Data && isArray(fields)"
			:fields="fields"
			:pageType="type"
			:service="serviceName"
			:formType="type"
			:moreConfig="colsV2Data && colsV2Data.more_config ? colsV2Data.more_config : null"
		></a-form>
		<view class="button-box" v-if="formType === 'detail' && isArray(fields) && fields.length > 0"><button class="cu-btn bg-red button" @click="deleteItem">删除</button></view>
		<view class="button-box" v-if="colsV2Data && isArray(fields) && fields.length > 0">
			<view v-for="(item, index) in buttons" :key="index" class="button">
				<button v-if="item.display !== false" @click="onButton(item)" class="cu-btn bg-blue">
					<text class="cuIcon-check"></text>
					{{ item.button_name }}
				</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			fields: [],
			formType: '',
			ds_no: '',
			dsr_no: '',
			colsV2Data: null,
			type: '',
			serviceName: '',
			condition: [],
			defaultCondition: [],
			params: {},
			addType: '',
			fieldsCond: [], //treeSelector类型字段的条件
			drugDetailItem: [],
			defaultVal: {},
			drugList: [], //当前用药计划的药物列表
			checkPlanItemNoList: [], //已选药物
			pb_no: '',
			selectDate: '',
			sportField: {
				column: 'amount',
				label: '运动量',
				isRequire: true,
				type: 'digit',
				max: null,
				min: null,
				showExp: true,
				display: true,
				value: '',
				step: 0.1
			},
			sportUnit: {
				column: 'unit',
				label: '单位',
				type: 'text',
				showExp: true,
				display: true,
				disabled: true,
				value: ''
			}
		};
	},
	computed: {
		selectedDrug() {
			if (this.addType === 'sport'||this.addType === 'sport'==='运动') {
				return this.drugList.find(item=>item.checked);
			}
		},
		buttons: function() {
			let buttons = [];
			if (this.colsV2Data && this.colsV2Data._buttonInfo) {
				buttons = this.colsV2Data._buttonInfo;
			} else if (this.colsV2Data && this.colsV2Data._formButtons) {
				buttons = this.colsV2Data._formButtons;
			}
			buttons = buttons.filter(item => item.button_name !== '重置');
			let data = {};
			this.fields.forEach(item => {
				data[item['column']] = item['value'];
			});
			let fieldModel = data;
			buttons.forEach(btn => {
				if (btn.disp_exps) {
					btn['display'] = eval(btn.disp_exps);
				}
				if (btn.button_name === '提交') {
					btn.button_name = '完成';
				}
				if (btn.button_name === '编辑') {
					btn.display = false;
				}
				if (btn.operate_params) {
					let fieldData = btn.operate_params['data'];
					if (fieldData && Array.isArray(fieldData) && fieldData.length > 0) {
						fieldData = fieldData[0];
						let newData = {};
						Object.keys(fieldData).forEach(data_item => {
							let item = fieldData[data_item];
							if (item.value_type && item.value_type === 'rowData') {
								newData[data_item] = fieldModel[item.value_key];
							}
						});
						btn['requestData'] = newData;
						btn['requestCondition'] = this.condition;
					}
				}
			});
			return buttons;
		}
	},

	async onLoad(option) {
		const destApp = option.destApp;
		if (destApp) {
			uni.setStorageSync('activeApp', destApp);
		}
		if (option.fieldsCond) {
			this.fieldsCond = JSON.parse(decodeURIComponent(option.fieldsCond));
		}
		if (option.date) {
			this.selectDate = option.date;
		}
		if (option.pb_no) {
			this.pb_no = option.pb_no;
		}
		if (option.addType) {
			this.addType = option.addType;
		}

		if (option.params) {
			this.params = JSON.parse(decodeURIComponent(option.params));
		}
		if (option.formType) {
			this.formType = option.formType;
			this.type = option.formType;
		}

		if (option.hasOwnProperty('params')) {
			this.serviceName = this.params.serviceName;
			this.type = this.params.type;
			this.condition = this.params.condition;
			this.defaultVal = this.params.defaultVal;
			this.getFieldsV2();
		} else if (option.serviceName && option.type) {
			this.serviceName = option.serviceName;
			this.params.serviceName = option.serviceName;
			this.type = option.formType ? option.formType : option.type;
			this.getFieldsV2();
		} else {
			uni.showToast({
				title: '加载错误',
				icon: 'none'
			});
		}
		if (option.cond) {
			this.defaultCondition = JSON.parse(decodeURIComponent(option.cond));
			if (option.formType === 'detail') {
				this.params.condition = this.defaultCondition;
				let defaultVal = await this.getDefaultVal();
				console.log(defaultVal);
			}
		}

		if (option.ds_no) {
			this.ds_no = option.ds_no;
			this.getDrugItemList();
		}
	},
	methods: {
		deleteItem() {
			let self = this;
			if (self.defaultVal.id) {
				uni.showModal({
					title: '提醒',
					content: '确认删除?',
					success(res) {
						if (res.confirm) {
							let serviceName = 'srvhealth_plan_schedule_record_delete';
							let url = self.getServiceUrl('health', serviceName, 'operate');
							let req = [{ serviceName: serviceName, condition: [{ colName: 'id', ruleType: 'in', value: self.defaultVal.id }] }];
							self.$http.post(url, req).then(res => {
								if (res.data.state === 'SUCCESS') {
									self.$emit('updateSuccess');
									uni.showModal({
										title: '提示',
										content: '删除成功，即将返回上一级页面',
										showCancel: false,
										success(res) {
											if (res.confirm) {
												uni.navigateBack();
											}
										}
									});
								}
							});
						}
					}
				});
			}
		},
		changeDrugChecked(e) {
			if (this.formType === 'detail') {
				return;
			}
			this.drugList.forEach(item => {
				if (item.id === e.id) {
					this.$set(item, 'checked', !e.checked);
				} else {
					if (this.addType === 'sport') {
						this.$set(item, 'checked', false);
					}
				}
			});
			if (this.addType === 'sport') {
				this.sportField.value = this.selectedDrug.amount_each_time;
				this.sportField.max = this.selectedDrug.amount_each_time * 20;
				this.sportUnit.value = this.selectedDrug.unit;
			}
		},
		async getSportItemInfo(list) {
			if (!list) {
				return;
			}
			let serviceName = 'srvhealth_body_activity_contents_select';
			if (this.formType === 'detail') {
				serviceName = 'srvhealth_body_activity_record_select';
			}
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				page: { pageNo: 1, rownumber: 20 },
				condition: [{ colName: 'sport_no', ruleType: 'in', value: list.map(item => item.sport_no).toString() }]
			};
			if (this.formType === 'detail') {
				req.condition = [{ colName: 'plan_no', ruleType: 'eq', value: this.defaultVal.ds_no }, { colName: 'dsr_no', ruleType: 'eq', value: this.defaultVal.dsr_no }];
			}
			let res = await this.$http.post(url, req);
			debugger;
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				list = list.map(item => {
					debugger;
					if (res.data.data.find(d => d.sport_no === item.sport_no)) {
						item.image = res.data.data.find(d => d.sport_no === item.sport_no)['image'];
						item.unit_amount = res.data.data.find(d => d.sport_no === item.sport_no)['unit_amount'];
						item.unit_energy = res.data.data.find(d => d.sport_no === item.sport_no)['unit_energy'];
						item.checked = false;
						if (this.formType === 'detail') {
							item.checked = true;
						}
						item.label = item.sport_name || item.name;
						item.value = item.sport_no;
					}
					return item;
				});
			}
			return list;
		},
		async getDrugItemList() {
			let serviceName = 'srvhealth_drug_schedule_detail_list_select';
			if (this.addType === 'sport') {
				serviceName = 'srvhealth_plan_schedule_sports_detail_select';
			}
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				page: { pageNo: 1, rownumber: 20 },
				condition: [{ colName: 'ds_no', ruleType: 'eq', value: this.ds_no }]
			};
			if (this.defaultVal && this.defaultVal.dsr_no) {
				console.log(this.defaultVal);
				if (this.addType === 'sport') {
					serviceName = 'srvhealth_body_activity_record_select';
					req = {
						serviceName: serviceName,
						colNames: ['*'],
						page: { pageNo: 1, rownumber: 20 },
						condition: [{ colName: 'plan_no', ruleType: 'eq', value: this.ds_no }, { colName: 'dsr_no', ruleType: 'eq', value: this.defaultVal.dsr_no }]
					};
				} else {
					serviceName = 'srvhealth_drug_schedule_record_detail_list_select';
					req = {
						serviceName: serviceName,
						colNames: ['*'],
						page: { pageNo: 1, rownumber: 20 },
						condition: [{ colName: 'ds_no', ruleType: 'eq', value: this.ds_no }, { colName: 'dsr_no', ruleType: 'eq', value: this.defaultVal.dsr_no }]
					};
				}
				url = this.getServiceUrl('health', serviceName, 'select');
			}
			if (this.ds_no) {
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data)) {
					if (this.addType == 'sport') {
						if (this.formType === 'detail') {
							this.drugList = res.data.data.map(item => {
								item.label = item.name;
								item.value = item.sports_no;
								item.checked = true;
								this.sportUnit.value = item.unit;
								this.sportUnit.disabled = true;
								this.sportField.value = item.amount;
								this.sportField.disabled = true;
								return item;
							});
						} else {
							this.drugList = await this.getSportItemInfo(res.data.data);
							this.checkPlanItemNoList = this.drugList.map(item => item.sport_no);
						}
					} else {
						// 药物
						this.drugList = res.data.data.map(item => {
							item.checked = true;
							item.label = item.general_name ? item.general_name : item.sport_name;
							item.value = item.med_no;
							return item;
						});
						this.checkPlanItemNoList = this.drugList.map(item => item.med_no);
					}
				}
			}
		},
		async getDefaultVal() {
			if (this.type === 'detail' || this.type === 'update') {
				let app = uni.getStorageSync('activeApp');
				let url = this.getServiceUrl(app, this.params.serviceName, 'select');
				let req = {
					serviceName: this.params.serviceName,
					colNames: ['*'],
					condition: this.params.condition ? this.params.condition : [],
					page: { pageNo: 1, rownumber: 10 }
				};
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					if (Array.isArray(res.data.data) && res.data.data.length > 0) {
						this.defaultVal = res.data.data[0];
						return res.data.data[0];
					}
				}
			}
		},
		getFieldsV2: async function() {
			let app = uni.getStorageSync('activeApp');
			let colVs = await this.getServiceV2(this.serviceName, this.type, this.type, app);
			let defaultVal = null;
			this.colsV2Data = colVs;
			if (colVs.service_view_name) {
				uni.setNavigationBarTitle({
					title: colVs.service_view_name
				});
			}
			let ignoreColumn = ['ds_no', 'person_no', 'dsr_no', 'create_time', 'create_user_disp'];
			colVs._fieldInfo = colVs._fieldInfo.map(item => {
				if (ignoreColumn.includes(item.column)) {
					item.display = false;
				}
				return item;
			});
			switch (this.type) {
				case 'update':
					defaultVal = this.defaultVal;
					this.fields = this.setFieldsDefaultVal(colVs._fieldInfo, defaultVal ? defaultVal : this.params.defaultVal);
					break;
				case 'add':
					this.fields = colVs._fieldInfo.map(field => {
						if (field.column === 'person_no') {
							field.display = false;
							field.value = this.pb_no;
						}
						if (field.label === '用药计划编码') {
							field.label = '用药计划';
							field.display = false;
						}
						if (field.column === 'take_date') {
							field.value = this.selectDate ? this.selectDate : this.formateDate();
							field.end = this.formateDate();
						}
						if (field.column === 'take_time') {
							field.value = this.formateDate('', 'dateTime');
						}
						if (this.defaultCondition && Array.isArray(this.defaultCondition) && colVs._fieldInfo && Array.isArray(colVs._fieldInfo)) {
							this.defaultCondition.forEach(cond => {
								colVs._fieldInfo.forEach(field => {
									if (cond.colName === field.column) {
										field['value'] = cond['value'];
										field['disabled'] = true;
									}
								});
							});
						}
						if (Array.isArray(this.fieldsCond) && this.fieldsCond.length > 0) {
							this.fieldsCond.forEach(item => {
								if (item.column === field.column && field.option_list_v2 && Array.isArray(field.option_list_v2.conditions) && Array.isArray(item.condition)) {
									field.option_list_v2.conditions = field.option_list_v2.conditions.concat(item.condition);
								}
							});
						}
						return field;
					});
					break;
				case 'detail':
					defaultVal = this.defaultVal;
					if (defaultVal.dsr_no) {
						this.dsr_no = defaultVal.dsr_no;
					}
					this.fields = this.setFieldsDefaultVal(colVs._fieldInfo, defaultVal ? defaultVal : this.params.defaultVal);
					break;
				default:
					break;
			}
		},
		addDrugItem(e) {
			let recordInfo = this.deepClone(e);
			if (!recordInfo || !recordInfo.dsr_no) {
				return;
			}
			let url = this.getServiceUrl('health', 'srvhealth_drug_schedule_record_detail_list_add', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_drug_schedule_record_detail_list_add',
					condition: [],
					data: []
				}
			];
			let checkDrugList = this.drugList.filter(item => item.checked);
			req[0].data = checkDrugList.map(item => {
				return {
					ds_detail_no: item.ds_detail_no,
					med_no: item.med_no,
					dsr_no: recordInfo.dsr_no,
					ds_no: item.ds_no,
					s_code: item.s_code,
					drug_reg_name: item.drug_reg_name,
					general_code: item.general_code,
					general_name: item.general_name,
					// take_times: item.take_times,
					dosage_each_time: item.dosage_each_time,
					dosage_unit: item.dosage_unit
				};
			});
			if (this.addType === 'sport') {
				url = this.getServiceUrl('health', 'srvhealth_body_activity_record_add', 'operate');
				req = [
					{
						serviceName: 'srvhealth_body_activity_record_add',
						colNames: ['*'],
						data: checkDrugList.map(item => {
							return {
								amount: this.sportField.value,
								energy: item.unit_energy * this.sportField.value,
								hdate: recordInfo.take_date,
								htime: recordInfo.take_time,
								image: item.image,
								name: item.sport_name,
								plan_no: recordInfo.ds_no,
								dsr_no: recordInfo.dsr_no,
								sports_detail_no: item.spp_no,
								sports_no: item.sport_no,
								unit: item.unit,
								user_name: uni.getStorageSync('current_user_info').name,
								userno: uni.getStorageSync('current_user_info').userno
							};
						})
					}
				];
			}
			this.$http.post(url, req);
		},
		async onButton(e) {
			let req = this.$refs.bxForm.getFieldModel();
			for (let key in req) {
				if (!req[key]) {
					delete req[key];
				}
			}
			switch (e.button_type) {
				case 'edit':
					if (e.page_type === '详情' && this.type === 'detail') {
						this.type = 'update';
						await this.getFieldsV2();
					} else {
						if (req) {
							req = [{ serviceName: e.service_name, data: [req], condition: this.condition }];
							let app = uni.getStorageSync('activeApp');
							let url = this.getServiceUrl(app, e.service_name, 'add');
							let res = await this.onRequest('update', e.service_name, req);
							console.log('res:' + e.service_name, res);
							if (res.data.state === 'SUCCESS') {
								let resData = this.getResData(res.data.response);
								console.log('resData', resData);
								this.type = 'detail';
								await this.getFieldsV2();
							}
						}
					}
					break;
				case 'submit':
					if (req) {
						req = [{ serviceName: e.service_name, data: [req] }];
						let app = uni.getStorageSync('activeApp');
						let url = this.getServiceUrl(app, e.service_name, 'add');
						let res = await this.$http.post(url, req);
						if (res.data.state === 'SUCCESS') {
							this.addDrugItem(res.data.response[0].response.effect_data[0]);
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
						}
					}
					break;
				case 'reset':
					this.$refs.bxForm.onReset().then(res => {
						if (res) {
							uni.showToast({
								title: '已重置'
							});
						} else {
							uni.showToast({
								title: '无效操作'
							});
						}
					});
					break;
				case 'customize':
					if (e.application && e.operate_service) {
						const url = this.getServiceUrl(e.application, e.operate_service, 'operate');
						const req = [
							{
								data: [e.requestData],
								serviceName: e.operate_service,
								srvApp: e.application
							}
						];
						let res = await this.$http.post(url, req);
						if (res.data.state === 'SUCCESS') {
							uni.showModal({
								title: '提示',
								content: e.tip_msg ? e.tip_msg : res.data.resultMessage,
								showCancel: false,
								success(res) {
									if (res.confirm) {
										uni.navigateBack();
									}
								}
							});
						} else {
							uni.showToast({
								title: res.data.resultMessage,
								mask: false,
								icon: 'none'
							});
						}
					}
					break;
				default:
					uni.showToast({
						title: e.button_name
					});
					break;
			}
		}
	}
};
</script>

<style lang="scss">
.form-page {
	min-height: 100vh;
	background-color: #fff;
}
.drug-select-box {
	padding: 20rpx 30rpx;
	.title {
		line-height: 60rpx;
		font-size: 28rpx;
		padding-left: 10rpx;
		color: #666;
		text-align: center;
		font-weight: bold;
	}
	.drug-list {
		display: flex;
		flex-wrap: wrap;
		.drug-item {
			width: calc(33% - 40rpx / 3);
			margin-right: 20rpx;
			margin-bottom: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			transition: all 0.5s;
			border: 1rpx solid #f1f1f1;
			background-color: #f1f1f1;
			border-radius: 10rpx;
			min-height: 200rpx;
			position: relative;
			&:nth-child(3n) {
				margin-right: 0;
			}
			&:active {
				transform: scale(1.2);
			}
			&.active {
				border-color: #0bc99d;
				background-color: rgba(11, 201, 157, 0.1);
				.title {
					color: #0bc99d;
				}
				.check-box {
					border-color: inherit;
					border-bottom: 0;
					border-right: 0;
					color: #0bc99d;
					font-size: 30rpx;
					line-height: 50rpx;
					background-color: #fff;
					text-align: center;
					font-weight: bold;
				}
			}
			.check-box {
				position: absolute;
				bottom: 1rpx;
				right: 1rpx;
				width: 50rpx;
				height: 50rpx;
				border-radius: 10rpx;
				border: 1px solid #f1f1f1;
				color: transparent;
			}
		}
	}

	.delete-button {
		width: 100rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 40rpx;
	}
}
.button-box {
	display: flex;
	justify-content: space-around;
	align-items: center;
	min-height: 200upx;
	background-color: #fff;
	flex-wrap: wrap;
	.cuIcon-check {
		border-radius: 30px;
		font-weight: bold;
		border: 2rpx solid #fff;
		margin-right: 10rpx;
		padding: 5rpx;
	}
	.button {
		width: 40%;
		.cu-btn {
			background-color: #14c4bd;
			width: 100%;
		}
	}
}
</style>
