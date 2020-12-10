<template>
	<view class="form-page">
		<a-form
			ref="bxForm"
			v-if="colsV2Data && isArray(fields)"
			:fields="fields"
			:pageType="type"
			:service="serviceName"
			:formType="type"
			:moreConfig="colsV2Data && colsV2Data.more_config ? colsV2Data.more_config : null"
		></a-form>
		<!-- 		<bxform
			ref="bxForm"
			:service="serviceName"
			:addType="addType"
			:pageType="type"
			:BxformType="type"
			:fields="fields"
			:moreConfig="colsV2Data && colsV2Data.more_config ? colsV2Data.more_config : null"
		></bxform> -->
		<view class="drug-select-box" v-if="fields && fields.length > 0">
			<!-- 药品选择 -->
			<!-- <view class="action"><button class="cu-btn">选择药物</button></view> -->
			<!-- 	<bxFormItem :field="item" v-for="(item, index) in detailField" :key="index + detailField[index].value" ref="drugForm" @on-selector-change="selectorChange($event, index)">
				<view class="delete-button" @click="deleteDetailItem(index)" v-if="detailField[index].value"><text class="cuIcon-delete"></text></view>
			</bxFormItem> -->
			<view class="title">选择药物</view>
			<bx-checkbox-group mode="normal" v-model="checkDrugNoList">
				<bx-checkbox v-for="item in drugList" v-model="item.checked" :key="item.id" :name="item.value">{{ item.label }}</bx-checkbox>
			</bx-checkbox-group>
			<!-- 		<bxform
					ref="bxForm2"
					service="srvhealth_drug_schedule_record_detail_list_add"
					addType="add"
					pageType="add"
					BxformType="add"
					:fields="detailField"
				></bxform> -->
		</view>
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
// import bxform from '@/components/bx-form/bx-form.vue';
// import bxButtons from '../components/bx-buttons/bx-buttons.vue';
// import bxFormItem from '@/components/bx-form/bx-form-item.vue';
export default {
	// components: { bxform, bxFormItem },
	props: {},
	data() {
		return {
			fields: [],
			ds_no: '',
			detailField: [
				{
					column: 's_code',
					label: '添加药物',
					placeholder: '点击选择药物',
					defaultValue: null,
					isRequire: false,
					type: 'treeSelector',
					seq: 500,
					option_list_v2: {
						refed_col: 's_code',
						serviceName: 'srvhealth_drug_schedule_detail_list_select',
						conditions: [{ colName: 'ds_no', ruleType: 'eq', value: 'DS202011270940210003' }],
						key_disp_col: 'general_name',
						is_tree: false
					},
					bx_col_type: 'fk',
					redundant: '__vue_devtool_undefined__',
					col_type: 'bxhealth_medicine',
					section: null,
					validators: 'ngMaxlength=50',
					showExp: true,
					display: true,
					in_add: 1,
					disabled: false,
					_validators: { max: 50, min: null, reg: '', required: false, msg: '', isType: { _custom: { type: 'function', display: '<span>ƒ</span> (e)' } } },
					value: '',
					valid: { column: 's_code', valid: true, msg: '不能为空!' }
				}
			],
			oldDetailField: [],
			colsV2Data: null,
			type: '',
			serviceName: '',
			condition: [],
			defaultCondition: [],
			params: {},
			addType: '',
			fieldsCond: [], //treeSelector类型字段的条件
			drugDetailItem: [],
			drugList: [], //当前用药计划的药物列表
			checkDrugNoList: [] //已选药物
		};
	},
	computed: {
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
					btn.button_name = '服药';
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
	onLoad(option) {
		const destApp = option.destApp;
		if (destApp) {
			uni.setStorageSync('activeApp', destApp);
		}
		if (option.fieldsCond) {
			this.fieldsCond = JSON.parse(decodeURIComponent(option.fieldsCond));
		}
		if (option.cond) {
			this.defaultCondition = JSON.parse(option.cond);
			this.detailField[0].option_list_v2.conditions = JSON.parse(option.cond);
		}
		if (option.ds_no) {
			this.ds_no = option.ds_no;
			this.getDrugItemList();
		}
		this.oldDetailField = this.deepClone(this.detailField);
		if (option.params) {
			this.params = JSON.parse(decodeURIComponent(option.params));
		}
		if (option.addType) {
			this.addType = option.addType;
		}

		if (option.hasOwnProperty('params')) {
			this.serviceName = this.params.serviceName;
			this.type = this.params.type;
			this.condition = this.params.condition;
			this.defaultVal = this.params.defaultVal;
			this.getFieldsV2();
		} else if (option.serviceName && option.type) {
			this.serviceName = option.serviceName;
			this.type = option.type;
			this.getFieldsV2();
		} else {
			uni.showToast({
				title: '加载错误',
				icon: 'none'
			});
		}
	},
	methods: {
		getDrugItemList() {
			let url = this.getServiceUrl('health', 'srvhealth_drug_schedule_detail_list_select', 'select');
			let req = {
				serviceName: 'srvhealth_drug_schedule_detail_list_select',
				colNames: ['*'],
				page: { pageNo: 1, rownumber: 20 },
				condition: [{ colName: 'ds_no', ruleType: 'eq', value: this.ds_no }]
			};
			if (this.ds_no) {
				this.$http.post(url, req).then(res => {
					if (Array.isArray(res.data.data)) {
						this.drugList = res.data.data.map(item => {
							item.checked = false;
							item.label = item.general_name;
							item.value = item.s_code;
							return item;
						});
					}
				});
			}
		},
		deleteDetailItem(index) {
			if (this.detailField[index].value && this.detailField.length > 1) {
				this.drugDetailItem.splice(index, 1);
				this.detailField.splice(index, 1);
			} else {
				this.detailField[index].value = '';
			}
			this.oldDetailField = this.deepClone(this.detailField);
		},
		selectorChange(e, index) {
			if (!e) {
				return;
			}
			let selectorInfo = this.deepClone(e);
			if (selectorInfo.colData && !this.oldDetailField[index].value) {
				this.drugDetailItem.push(selectorInfo.colData);
				let field = this.deepClone(this.oldDetailField[0]);
				field.value = '';
				// let field = this.deepClone(this.oldDetailField[this.oldDetailField.length - 1]);
				this.detailField.push(field);
				this.oldDetailField = this.deepClone(this.detailField);
			} else {
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
			switch (this.type) {
				case 'update':
					defaultVal = await this.getDefaultVal();
					this.fields = this.setFieldsDefaultVal(colVs._fieldInfo, defaultVal ? defaultVal : this.params.defaultVal);
					break;
				case 'add':
					this.fields = colVs._fieldInfo.map(field => {
						if (field.column === 'person_no') {
							field.display = false;
						}
						if (field.label === '用药计划编码') {
							field.label = '用药计划';
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
					defaultVal = await this.getDefaultVal();
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
					data: [
						{
							dsr_no: 'DSR202011271043520006',
							ds_no: 'DS202011270940210003',
							s_code: '86900026000308',
							drug_reg_name: '脂芪口服液',
							general_code: 'Z-Z01AA-Z0160',
							general_name: '脂芪口服液',
							take_times: '2次',
							dosage_each_time: 15,
							dosage_unit: '毫升'
						}
					]
				}
			];
			let checkDrugList = this.drugList.filter(item => this.checkDrugNoList.includes(item.s_code));
			req[0].data = checkDrugList.map(item => {
				return {
					dsr_no: recordInfo.dsr_no,
					ds_no: item.ds_no,
					s_code: item.s_code,
					drug_reg_name: item.drug_reg_name,
					general_code: item.general_code,
					general_name: item.general_name,
					take_times: item.take_times,
					dosage_each_time: item.dosage_each_time,
					dosage_unit: item.dosage_unit
				};
			});
			// req[0].data = this.drugDetailItem.map(item => {
			// 	return {
			// 		dsr_no: recordInfo.dsr_no,
			// 		ds_no: item.ds_no,
			// 		s_code: item.s_code,
			// 		drug_reg_name: item.drug_reg_name,
			// 		general_code: item.general_code,
			// 		general_name: item.general_name,
			// 		take_times: item.take_times,
			// 		dosage_each_time: item.dosage_each_time,
			// 		dosage_unit: item.dosage_unit
			// 	};
			// });
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
