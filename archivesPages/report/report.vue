<template>
	<view
		class="form"
		:style="{
			'--global-text-font-size': globalTextFontSize + 'px',
			'--global-label-font-size': globalLabelFontSize + 'px'
		}"
	>
		<a-form v-if="colsV2Data && isArray(fields)" :fields="fields" :pageType="srvType" :formType="use_type" ref="bxForm" @value-blur="valueChange"></a-form>
		<view class="button-box" v-if="isArray(fields) && fields.length > 0 && !params.to">
			<button class="cu-btn bg-blue" type="primary" v-for="btn in colsV2Data._formButtons" :key="btn.id" @click="onButton(btn)">{{ btn.button_name }}</button>
		</view>
		<view class="button-box" v-if="isArray(fields) && fields.length > 0 && params.to"><button class="cu-btn bg-blue" @click="onButton(nextBtn)">下一步</button></view>
		<view class="button-box" v-if="this.params.defaultVal && this.params.defaultVal.report_daq_survey_activity_no && this.params.defaultVal.report_daq_survey_ack_no">
			<button class="cu-btn bg-blue" @click="toPages('quest')">查看更多</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			globalTextFontSize: 14,
			globalLabelFontSize: 12,
			serviceName: '',
			srvType: 'add', // 表单信息 add | update  | select |list | detail
			use_type: 'add', // detail | proclist | list | treelist | detaillist | selectlist | addchildlist | updatechildlist | procdetaillist | add | update
			colsV2Data: {
				_fieldInfo: [],
				_formButtons: []
			},
			fields: [],
			condition: [],
			fieldsCond: [],
			params: {},
			nextBtn: {
				action: 'nextPage',
				page_type: '增加',
				button_type: 'submit',
				button_name: '提交',
				service_name: 'srvhealth_examination_report_add',
				application: 'health'
			}
		};
	},
	methods: {
		toPages(type) {
			if (type === 'quest') {
				uni.navigateTo({
					url: `/questionnaire/index/index?formType=detail&activity_no=${this.params.defaultVal.report_daq_survey_activity_no}&status=完成&fill_batch_no=${
						this.params.defaultVal.report_daq_survey_ack_no
					}`
				});
			}else{
				this.srvType = type;
				if (this.params.to && this.params.idCol && this.params.submitData && this.params.submitData[this.params.idCol]) {
					uni.redirectTo({
						url: `${this.params.to}?${this.params.idCol}=${this.params.submitData[this.params.idCol]}`
					});
				} else {
					uni.redirectTo({
						url: `/publicPages/newForm/newForm?type=${type}&serviceName=${this.getServiceName(this.serviceName)}&fieldsCond=${encodeURIComponent(JSON.stringify(this.fieldsCond))}`
					});
				}
			}
		},
		async onButton(e) {
			console.log(e);
			let self = this;
			let req = this.$refs.bxForm.getFieldModel();
			for (let key in req) {
				if (!req[key]) {
					delete req[key];
				}
				if (Array.isArray(req[key])) {
					req[key] = req[key].toString();
				}
			}
			switch (e.button_type) {
				case 'edit':
					if (e.page_type === '详情' && this.use_type === 'detail') {
						this.toPages('update');
					} else {
						if (req) {
							req = [{ serviceName: e.service_name, data: [req], condition: this.condition }];
							if (self.params.defaultVal && self.params.defaultVal.id) {
								req[0].condition = [{ colName: 'id', ruleType: 'eq', value: self.params.defaultVal.id }];
							}
							let app = uni.getStorageSync('activeApp');
							let url = this.getServiceUrl(app, e.service_name, 'add');
							if (!Array.isArray(req[0].condition) || req[0].condition.length === 0) {
								uni.showToast({
									title: '参数错误，请刷新重试',
									icon: 'none'
								});
								return;
							}
							let res = await this.onRequest('update', e.service_name, req);
							console.log('res:' + e.service_name, res);
							if (res.data.state === 'SUCCESS') {
								if (
									Array.isArray(res.data.response) &&
									res.data.response.length > 0 &&
									res.data.response[0].response &&
									Array.isArray(res.data.response[0].response.effect_data) &&
									res.data.response[0].response.effect_data.length > 0
								) {
									this.params.submitData = res.data.response[0].response.effect_data[0];
								}
								uni.showModal({
									title: '提示',
									content: res.data.resultMessage + '，即将跳转到详情页面',
									showCancel: false,
									success(res) {
										self.toPages('detail');
									}
								});
							}
						}
					}
					break;
				case 'submit':
					if (req) {
						for (let key in req) {
							if (!req[key]) {
								delete req[key];
							}
						}
						this.params.defaultVal = req;
						let data = this.deepClone(req);
						req = [{ serviceName: e.service_name, data: [data] }];
						let app = uni.getStorageSync('activeApp');
						let url = this.getServiceUrl(app, e.service_name, 'add');
						let res = await this.$http.post(url, req);
						if (res.data.state === 'SUCCESS') {
							if (e.action === 'nextPage') {
								uni.redirectTo({
									url: this.params.to
								});
							} else {
								if (
									Array.isArray(res.data.response) &&
									res.data.response.length > 0 &&
									res.data.response[0].response &&
									Array.isArray(res.data.response[0].response.effect_data) &&
									res.data.response[0].response.effect_data.length > 0
								) {
									this.params.submitData = res.data.response[0].response.effect_data[0];
								}
								uni.showModal({
									title: '提示',
									content: '操作成功',
									showCancel: false,
									success(res) {
										if (res.confirm) {
											self.toPages('detail');
										}
									}
								});
							}
						}
					}
					break;
				case 'reset':
					this.$refs.bxForm.onReset();
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
						title: e.button_name,
						icon: false
					});
					break;
			}
		},
		valueChange(e) {
			this.fields = this.fields.map(item => {
				if (e.hasOwnProperty(item.column)) {
					item.value = e[item.column];
				}
				return item;
			});
		},
		async getFieldsModel(srv) {
			let app = uni.getStorageSync('activeApp');
			let serviceName = this.getServiceName(srv);
			let url = this.getServiceUrl(app, serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: this.condition ? this.condition : [],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
			}
		},
		getServiceName(srv) {
			let len = srv.lastIndexOf('_');
			let serviceName = srv.slice(0, len) + '_';
			if (this.srvType === 'list' || this.srvType === 'detail') {
				serviceName += 'select';
			} else {
				serviceName += this.srvType;
			}
			return serviceName;
		},
		async getDefaultVal() {
			if (this.use_type === 'detail' || this.use_type === 'update') {
				let serviceName = this.serviceName.replace('_update', '_select').replace('_add', '_select');
				let condition = this.fieldsCond
					.filter(item => item.value)
					.map(item => {
						return {
							colName: item.column,
							ruleType: 'in',
							value: item.value
						};
					});
				let app = uni.getStorageSync('activeApp');
				let url = this.getServiceUrl(app, serviceName, 'select');
				let req = {
					serviceName: serviceName,
					colNames: ['*'],
					condition: condition,
					page: { pageNo: 1, rownumber: 10 }
				};
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					if (Array.isArray(res.data.data) && res.data.data.length > 0) {
						this.params.defaultVal = res.data.data[0];
						return res.data.data[0];
					}
				}
			}
		},
		async getFieldsV2() {
			let app = uni.getStorageSync('activeApp');
			let colVs = await this.getServiceV2(this.serviceName, this.srvType, this.use_type, app);
			let defaultVal = null;
			colVs._formButtons = colVs._formButtons.filter(item => {
				return item.button_type !== 'edit';
			});
			this.colsV2Data = colVs;
			colVs = this.deepClone(colVs);
			if (colVs.service_view_name) {
				uni.setNavigationBarTitle({
					title: colVs.service_view_name
				});
			}
			switch (colVs.use_type) {
				case 'update':
					defaultVal = await this.getDefaultVal();
					let fields = this.setFieldsDefaultVal(colVs._fieldInfo, defaultVal ? defaultVal : this.params.defaultVal);
					this.fields = fields.map(field => {
						if (field.type === 'Set' && Array.isArray(field.option_list_v2)) {
							field.option_list_v2 = field.option_list_v2.map(item => {
								item.checked = false;
								return item;
							});
						}
						if (Array.isArray(this.fieldsCond) && this.fieldsCond.length > 0) {
							this.fieldsCond.forEach(item => {
								if (item.column === field.column) {
									if (item.hasOwnProperty('display')) {
										field.display = item.display;
									}
									if (item.hasOwnProperty('value')) {
										field.value = item.value;
									}
									if (field.option_list_v2 && Array.isArray(field.option_list_v2.conditions) && Array.isArray(item.condition)) {
										field.option_list_v2.conditions = field.option_list_v2.conditions.concat(item.condition);
									} else if (field.option_list_v2 && !field.option_list_v2.conditions && Array.isArray(item.condition)) {
										field.option_list_v2.conditions = item.condition;
									}
								}
							});
						}
						return field;
					});
					break;
				case 'add':
					this.fields = colVs._fieldInfo.map(field => {
						if (field.type === 'Set' && Array.isArray(field.option_list_v2)) {
							field.option_list_v2 = field.option_list_v2.map(item => {
								item.checked = false;
								return item;
							});
						}
						if (this.defaultCondition && Array.isArray(this.defaultCondition) && colVs._fieldInfo && Array.isArray(colVs._fieldInfo)) {
							this.defaultCondition.forEach(cond => {
								colVs._fieldInfo.forEach(field => {
									if (cond.colName === field.column) {
										field['value'] = cond['value'];
										// field['disabled'] = true;
									}
								});
							});
						}
						if (Array.isArray(this.fieldsCond) && this.fieldsCond.length > 0) {
							this.fieldsCond.forEach(item => {
								if (item.column === field.column) {
									if (item.hasOwnProperty('display')) {
										field.display = item.display;
									}
									if (item.hasOwnProperty('value')) {
										field.value = item.value;
									}
									if (field.option_list_v2 && Array.isArray(field.option_list_v2.conditions) && Array.isArray(item.condition)) {
										field.option_list_v2.conditions = field.option_list_v2.conditions.concat(item.condition);
									} else if (field.option_list_v2 && !field.option_list_v2.conditions && Array.isArray(item.condition)) {
										field.option_list_v2.conditions = item.condition;
									}
								}
							});
						}
						return field;
					});
					break;
				case 'detail':
					defaultVal = await this.getDefaultVal();
					this.fields = this.setFieldsDefaultVal(colVs._fieldInfo, defaultVal ? defaultVal : this.params.defaultVal);
					this.fields = this.fields.map(field => {
						if (Array.isArray(this.fieldsCond) && this.fieldsCond.length > 0) {
							this.fieldsCond.forEach(item => {
								if (item.column === field.column) {
									if (item.hasOwnProperty('display')) {
										field.display = item.display;
									}
									if (item.hasOwnProperty('value')) {
										field.value = item.value;
									}
									if (field.option_list_v2 && Array.isArray(field.option_list_v2.conditions) && Array.isArray(item.condition)) {
										field.option_list_v2.conditions = field.option_list_v2.conditions.concat(item.condition);
									} else if (field.option_list_v2 && !field.option_list_v2.conditions && Array.isArray(item.condition)) {
										field.option_list_v2.conditions = item.condition;
									}
								}
							});
						}
						return field;
					});
					break;
			}
		}
	},
	onShow() {
		this.globalTextFontSize = getApp().globalData.globalTextFontSize ? getApp().globalData.globalTextFontSize : 14;
		this.globalLabelFontSize = getApp().globalData.globalLabelFontSize ? getApp().globalData.globalLabelFontSize : 14;
	},
	onLoad(option) {
		const destApp = option.destApp;
		if (destApp) {
			uni.setStorageSync('activeApp', destApp);
		}
		if (option.params) {
			this.params = JSON.parse(decodeURIComponent(option.params));
		}
		if (option.serviceName) {
			this.serviceName = option.serviceName;
		}
		if (option.type) {
			if (option.type.indexOf(',') !== -1) {
				option.type = option.type.split(',')[0];
			}
			if (option.type === 'form') {
				option.type = 'add';
			}
			this.srvType = option.type;
			this.use_type = option.type;
		}
		if (option.fieldsCond) {
			try {
				this.fieldsCond = JSON.parse(decodeURIComponent(option.fieldsCond));
			} catch (e) {
				//TODO handle the exception
				console.warn(e);
			}
		}
		this.getFieldsV2();
	}
};
</script>

<style lang="scss">
.form {
	width: 100%;
	background-color: #fff;
	min-height: calc(100vh - var(--window-top) - var(--window-bottom));
	.button-box {
		width: 100%;
		display: flex;
		padding: 40rpx 20rpx;
		justify-content: space-around;
		.cu-btn {
			min-width: 45%;
		}
	}
}
</style>
