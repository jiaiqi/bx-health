<template>
	<view
		class="form"
		:style="{
			'--global-text-font-size': globalTextFontSize + 'px',
			'--global-label-font-size': globalLabelFontSize + 'px'
		}"
	>
		<a-form v-if="colsV2Data && isArray(fields)" :fields="fields" :pageType="srvType" :formType="use_type" ref="bxForm" @value-blur="valueChange"></a-form>
		<view class="button-box">
			<button class="cu-btn bg-blue" type="primary" v-if="isArray(fields) && fields.length > 0" v-for="btn in colsV2Data._formButtons" @click="onButton(btn)">
				{{ btn.button_name }}
			</button>
		</view>
		<child-table :formData="defaultVal" :child-service="childService" v-if="defaultVal && childService.length > 0" @toChildServiceList="toChildServiceList"></child-table>
	</view>
</template>

<script>
import { mapState } from 'vuex';
import ChildTable from './child-table.vue';
export default {
	components: {
		ChildTable
	},
	data() {
		return {
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
			defaultVal: null,
			showChildService: true
		};
	},
	computed: {
		childService() {
			if (this.showChildService !== 'false' && this.showChildService !== false && this.colsV2Data && Array.isArray(this.colsV2Data.child_service)) {
				return this.colsV2Data.child_service;
			} else {
				return [];
			}
		},
		...mapState({
			inviterInfo: state => state.app.inviterInfo,
			shareType: state => state.app.shareType,
			userInfo: state => state.user.userInfo,
			doctorInfo: state => state.app.doctorInfo,
			globalTextFontSize: state => state.app.globalTextFontSize,
			globalLabelFontSize: state => state.app.globalLabelFontSize
		})
	},
	methods: {
		toChildServiceList(e) {
			let data = this.deepClone(e);
			let formData = this.params.defaultVal;
			let condition = [{ colName: e.foreign_key.column_name, ruleType: 'eq', value: formData[e.foreign_key.referenced_column_name] }];
			if (e.foreign_key && e.foreign_key.referenced_column_name && formData[e.foreign_key.referenced_column_name]) {
				if (e.foreign_key.more_config && e.foreign_key.more_config.targetType) {
					let targetType = e.foreign_key.more_config.targetType;
					if (targetType === 'list') {
						uni.navigateTo({
							url: '/publicPages/list/list?pageType=list&serviceName=' + e.service_name + '&cond=' + JSON.stringify(condition)
						});
					} else if (targetType === 'detail') {
						if (e.childData && e.childData.data && e.childData.data.length > 0) {
							let fieldsCond = [];
							if (e.foreign_key && e.foreign_key.referenced_column_name && e.foreign_key.column_name) {
								fieldsCond.push({
									column: id,
									value: e.childData.data[0].id,
									display: false
								});
							}
							let url = `/publicPages/newForm/newForm?type=update&serviceName=${e.service_name}&fieldsCond=${encodeURIComponent(JSON.stringify(fieldsCond))}`;
							uni.navigateTo({
								url: url
							});
						} else {
							uni.showModal({
								title: '提示',
								content: '暂无数据，是否添加数据',
								success(res) {
									if (res.confirm) {
										// referenced_column_name //被引用的字段
										// column //子表字段
										let fieldsCond = [];
										if (e.foreign_key && e.foreign_key.referenced_column_name && e.foreign_key.column_name) {
											fieldsCond.push({
												column: e.foreign_key.referenced_column_name,
												value: formData[e.foreign_key.column_name]
											});
										}
										let url = `/publicPages/newForm/newForm?type=add&serviceName=${e.service_name.replace('_select', '_add')}&fieldsCond=${encodeURIComponent(
											JSON.stringify(fieldsCond)
										)}`;
										uni.navigateTo({
											url: url
										});
									}
								}
							});
						}
					}
				} else {
					debugger;
					let viewTemp = {};
					if (e.service_name === 'srvhealth_plan_schedule_select') {
						// 方案计划
						viewTemp = {
							title: 'ds_name',
							tip: 'play_srv',
							footer: 'start_date'
						};
					}
					if (e.service_name === 'srvhealth_see_doctor_record_select') {
						// 就诊列表
						viewTemp = {
							title: 'name',
							footer: 'chief_complaint'
						};
					}
					if (e.service_name === 'srvhealth_store_user_select') {
						// 用户列表
						viewTemp = {
							img: 'profile_url',
							title: 'person_name',
							tip: 'sex',
							footer: 'user_role'
						};
					}
					if (e.service_name === 'srvhealth_store_dept_select') {
						// 部门列表
						viewTemp = {
							img: 'photo',
							title: 'introduction',
							tip: 'sex'
						};
					}
					if (e.service_name === 'srvhealth_drugstore_inventory_select') {
						// 药品库存
						viewTemp = {
							img: 'med_packing_pic',
							title: 'medicine_name',
							tip: 'type_tree_no'
						};
					}
					if (e.service_name === 'srvhealth_drug_schedule_doctor_detail_list_select') {
						// 方案计划
						viewTemp = {
							title: 'general_name',
							tip: 'take_times',
							footer: 'remind_time'
						};
					}
					uni.navigateTo({
						url:
							'/publicPages/list/list?pageType=list&serviceName=' +
							e.service_name +
							'&cond=' +
							JSON.stringify(condition) +
							'&viewTemp=' +
							encodeURIComponent(JSON.stringify(viewTemp))
					});
				}
			} else {
				uni.navigateTo({
					url: '/publicPages/list/list?pageType=list&serviceName=' + e.service_name + '&cond=' + JSON.stringify(condition)
				});
			}
		},
		toPages(type) {
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
		},
		async selectServiceNo() {
			if (!this.userInfo || !this.userInfo.no) {
				return;
			}
			let serviceName = 'srvhealth_service_record_select';
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [
					{
						colName: 'user_info_no',
						ruleType: 'eq',
						value: this.userInfo.no
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				return res.data.data[0];
			}
		},
		async updateWeight(weight) {
			let serviceLog = await this.selectServiceNo();
			const serviceName = 'srvhealth_body_fat_measurement_record_add';
			let url = this.getServiceUrl('health', serviceName, 'operate');
			let req = [
				{
					serviceName: serviceName,
					data: [
						{
							service_no: serviceLog.no,
							name: serviceLog.name,
							weight: weight
						}
					]
				}
			];
			if (weight) {
				this.$http.post(url, req);
			}
		},
		async onButton(e) {
			let self = this;
			if (!e) {
				return;
			}
			if (!this.isOnButton) {
				this.isOnButton = true;
			} else {
				uni.showToast({
					title: '正在处理中，请勿重复操作',
					icon: 'none'
				});
				return;
			}
			let req = this.$refs.bxForm.getFieldModel();
			for (let key in req) {
				if (Array.isArray(req[key])) {
					req[key] = req[key].toString();
				}
			}
			switch (e.button_type) {
				case 'edit':
					if (e.page_type === '详情' && this.use_type === 'detail') {
						this.toPages('update');
						this.isOnButton = false;
					} else {
						if (req) {
							if (e.service_name === 'srvhealth_person_info_update' && req.weight) {
								this.updateWeight(req.weight);
							}
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
									content: `${res.data.resultMessage}${self.shareType && self.shareType === 'seeDoctor' ? ' 即将跳转到就诊信息登记页面' : ' 即将跳转到详情页面'}`,
									showCancel: false,
									success(res) {
										if (self.shareType && self.shareType === 'seeDoctor') {
											// 通过邀请就诊登记链接进入 跳转到就诊信息登记页面
											let fieldsCond = [{ column: 'user_info_no', display: false }, { column: 'user_no', display: false }];
											if (self.doctorInfo && self.doctorInfo.no) {
												fieldsCond.push({ column: 'doctor_no', display: false, value: self.doctorInfo.no }, { column: 'doctor_name', display: false, value: self.doctorInfo.name });
												if (self.doctorInfo.store_no) {
													fieldsCond.push({ column: 'store_no', display: false, value: self.doctorInfo.store_no });
												}
											}
											let path =
												'/publicPages/newForm/newForm?share_type=seeDoctor&serviceName=srvhealth_see_doctor_record_add&type=add&fieldsCond=' +
												encodeURIComponent(JSON.stringify(fieldsCond));
											uni.redirectTo({
												url: path
											});
										} else {
											self.toPages('detail');
										}
									}
								});
							}
							this.isOnButton = false;
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
							if (
								Array.isArray(res.data.response) &&
								res.data.response.length > 0 &&
								res.data.response[0].response &&
								Array.isArray(res.data.response[0].response.effect_data) &&
								res.data.response[0].response.effect_data.length > 0
							) {
								this.params.submitData = res.data.response[0].response.effect_data[0];
								if (e.service_name === 'srvhealth_store_mgmt_add') {
									// 创建店铺成功，自动为其创建圈子,并为新创建的圈子添加管理员（群成员）
									self.createGroupCircle(this.params.submitData);
									self.addPersonToStore(this.params.submitData);
								}
							}
							uni.showModal({
								title: '提示',
								content: '添加成功',
								showCancel: false,
								success(res) {
									if (res.confirm) {
										if (self.shareType && self.shareType === 'seeDoctor') {
											// 通过邀请就诊登记链接进入
											if (self.serviceName === 'srvhealth_see_doctor_record_add') {
												// 登记成功 跳转到医生信息页面
												// TODO 医生信息页面
												console.log(self.doctorInfo);
												uni.redirectTo({
													url: `/personalPages/myDoctor/myDoctor`
												});
											}
										} else {
											self.toPages('detail');
										}
									}
								}
							});
						}
						this.isOnButton = false;
					}
					break;
				case 'reset':
					this.$refs.bxForm.onReset();
					this.isOnButton = false;
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
						this.isOnButton = false;
					}
					break;
				default:
					uni.showToast({
						title: e.button_name,
						icon: false
					});
					this.isOnButton = false;
					break;
			}
		},
		createGroupCircle(e) {
			let req = [{ serviceName: 'srvhealth_group_circle_add', data: [{ name: `【${e.name}】`, store_no: e.store_no }] }];
			this.$fetch('operate', 'srvhealth_group_circle_add', req, 'health').then(res => {
				if (Array.isArray(res.data) && res.data.length > 0) {
					this.addPersonToGroup(res.data[0]);
				}
			});
		},
		addPersonToStore(e) {
			// 创建店铺后将当前用户以管理员身份加入到店铺用户列表
			let req = [
				{
					serviceName: 'srvhealth_store_user_add',
					condition: [],
					data: [
						{
							store_no: e.store_no,
							name: e.name,
							type: e.type,
							person_no: this.userInfo.no,
							person_name: this.userInfo.name,
							user_account: this.userInfo.userInfo,
							nick_name: this.userInfo.nick_name,
							profile_url: this.userInfo.profile_url,
							user_image: this.userInfo.user_image,
							sex: this.userInfo.sex,
							user_role: '管理员'
						}
					]
				}
			];
			this.$fetch('operate', 'srvhealth_store_user_add', req, 'health');
		},
		addPersonToGroup(e) {
			// 创建了店铺关联的圈子后将创建人以管理员身份加入到这个圈子
			let req = [
				{
					serviceName: 'srvhealth_person_group_circle_add',
					condition: [],
					data: [
						{
							person_no: this.userInfo.no,
							user_no: this.userInfo.userno,
							name: this.userInfo.name,
							profile_url: this.userInfo.profile_url,
							user_image: this.userInfo.user_image,
							gc_no: e.gc_no,
							group_role: '管理员'
						}
					]
				}
			];
			this.$fetch('operate', 'srvhealth_person_group_circle_add', req, 'health');
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
							ruleType: 'like',
							value: item.value
						};
					});
				let app = uni.getStorageSync('activeApp');
				let url = this.getServiceUrl(app, serviceName, 'select');
				let req = {
					serviceName: serviceName,
					colNames: ['*'],
					condition: condition,
					page: { pageNo: 1, rownumber: 2 }
				};
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					if (Array.isArray(res.data.data) && res.data.data.length > 0) {
						this.params.defaultVal = res.data.data[0];
						this.defaultVal = res.data.data[0];
						return res.data.data[0];
					}
				}
			}
		},
		async getFieldsV2() {
			let app = uni.getStorageSync('activeApp');
			let colVs = await this.getServiceV2(this.serviceName, this.srvType, this.use_type, app);
			let defaultVal = this.defaultVal;
			this.colsV2Data = colVs;
			colVs = this.deepClone(colVs);
			if (colVs.service_view_name) {
				uni.setNavigationBarTitle({
					title: colVs.service_view_name
				});
			}
			switch (colVs.use_type) {
				case 'update':
				case 'detail':
					defaultVal = this.defaultVal && this.defaultVal.id ? this.defaultVal : await this.getDefaultVal();
					let fields = this.setFieldsDefaultVal(colVs._fieldInfo, defaultVal ? defaultVal : this.params.defaultVal);
					if (!fields) {
						return;
					}
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
			}
		},

		async getStoreUserInfo(no) {
			let url = this.getServiceUrl('health', 'srvhealth_store_user_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_user_select',
				colNames: ['*'],
				condition: [{ colName: 'person_no', ruleType: 'eq', value: this.userInfo.no }, { colName: 'store_no', ruleType: 'eq', value: no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.storeUserInfo = res.data.data[0];
				return res.data.data;
			}
		},
		async getStoreInfo(no) {
			let url = this.getServiceUrl('health', 'srvhealth_store_mgmt_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_mgmt_select',
				colNames: ['*'],
				condition: [{ colName: 'store_no', ruleType: 'eq', value: no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.storeInfo = res.data.data[0];
				return res.data.data;
			}
		},
		async addToStore(store_no, invite_no, storeInfo = {}) {
			// 添加用户到单位
			let url = this.getServiceUrl('health', 'srvhealth_store_user_add', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_store_user_add',
					condition: [],
					data: [
						{
							name: storeInfo.name,
							person_no: this.userInfo.no,
							type: storeInfo.type,
							user_account: this.userInfo.userno,
							user_role: '用户',
							add_url: this.inviterInfo.add_url,
							invite_user_no: this.inviterInfo.invite_user_no,
							store_no: store_no
						}
					]
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				uni.showModal({
					title: '提示',
					content: `您已成功加入【${storeInfo.name}】`,
					success(res) {
						if (res.confirm) {
							// 跳转到店铺详情
							// uni.navigateTo({
							// 	url: '/pediaPages/ClinicDetail/ClinicDetail?store_no=' + store_no
							// });
						}
					}
				});
			}
		}
	},
	async onLoad(option) {
		await this.toAddPage();
		this.checkOptionParams(option);
		const destApp = option.destApp;
		if (destApp) {
			uni.setStorageSync('activeApp', destApp);
		}
		if (option.showChildService) {
			this.showChildService = option.showChildService;
		}
		if (option.params) {
			this.params = JSON.parse(decodeURIComponent(option.params));
		}
		if (option.serviceName) {
			this.serviceName = option.serviceName;
		}
		// srvType: 'add', // 表单信息 add | update  | select |list | detail
		// use_type: 'add', // detail | proclist | list | treelist | detaillist | selectlist | addchildlist | updatechildlist | procdetaillist | add | update

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
				let fieldsCond = JSON.parse(decodeURIComponent(option.fieldsCond));
				if (Array.isArray(fieldsCond) && fieldsCond.length > 0) {
					if (option.serviceName === 'srvhealth_see_doctor_record_add') {
						if (this.doctorInfo && this.doctorInfo.no) {
							console.log(this.doctorInfo);
							this.getStoreUserInfo(this.doctorInfo.store_no).then(res => {
								this.getStoreInfo(this.doctorInfo.store_no).then(data => {
									if (!Array.isArray(res) || res.length === 0) {
										// 当前用户不在此诊所中 则添加当前用户到此诊所中
										if (option.store_no && option.invite_user_no) {
											if (Array.isArray(data) && data.length > 0) {
												this.addToStore(option.store_no, option.invite_user_no, data[0]);
											} else {
												this.addToStore(option.store_no, option.invite_user_no);
											}
										} else {
											if (this.doctorInfo.store_no) {
												this.addToStore(this.doctorInfo.store_no);
											}
										}
									}
								});
							});
							fieldsCond.push({
								column: 'doctor_no',
								value: this.doctorInfo.no,
								display: false
							});
							fieldsCond.push({
								column: 'doctor_name',
								display: false
							});
						}
					}
					this.fieldsCond = fieldsCond.map(item => {
						if (option.serviceName.indexOf('srvhealth_see_doctor') === -1) {
							if (item.column === 'user_info_no' && this.userInfo.no && !item.value) {
								item.value = this.userInfo.no;
							}
							if (item.column === 'user_no' && this.userInfo.userno && !item.value) {
								item.value = this.userInfo.userno;
							}
							if (item.column === 'store_no' && this.doctorInfo.store_no && !item.value) {
								item.value = this.doctorInfo.store_no;
								item.display = false;
							}
						}
						return item;
					});
				}
				// this.fieldsCond = fieldsCond.ma
			} catch (e) {
				//TODO handle the exception
				console.warn(e);
			}
		}
		this.getDefaultVal();
		this.getFieldsV2();
	}
};
</script>

<style lang="scss">
.form {
	width: 100%;
	background-color: #fff;
	min-height: calc(100vh - var(--window-top) - var(--window-bottom));
	// overflow: scroll;
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
