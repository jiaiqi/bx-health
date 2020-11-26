<template>
	<view></view>
</template>

<script>
export default {
	data() {
		return {
			planNo: '',
			planDetail: {},
			fields: [],
			childServiceData:[]
		};
	},
	methods: {
		async getFieldsV2() {
			let colVs = await this.getServiceV2('srvhealth_drug_schedule_select', 'detail', 'detail', 'health');
			let defaultVal = null;
			this.colsV2Data = colVs;
			if (colVs.service_view_name) {
				uni.setNavigationBarTitle({
					title: colVs.service_view_name
				});
			}
			if (Array.isArray(colVs.child_service)) {
				for(let item of colVs.child_service){
					const url = this.getServiceUrl('health', item.service_name, 'select');
					let req = {
						serviceName: item.service_name,
						colNames: ['*'],
						condition: [],
					};
				}
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
					this.fields = colVs._fieldInfo;
					break;
				case 'update':
				case 'detail':
					defaultVal = await this.getPlanDetail(this.planNo);
					this.fields = this.setFieldsDefaultVal(colVs._fieldInfo, defaultVal ? defaultVal : this.params.defaultVal);
					break;
				default:
					break;
			}
		},
		async getPlanDetail(no) {
			let url = this.getServiceUrl('health', 'srvhealth_drug_schedule_select', 'select');
			let req = {
				serviceName: 'srvhealth_drug_schedule_select',
				colNames: ['*'],
				condition: [{ colName: 'ds_no', ruleType: 'eq', value: no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.planDetail = res.data.data[0];
				return res.data.data[0];
			}
		}
	},
	onLoad(options) {
		if (options.ds_no) {
			this.planNo = options.ds_no;
			this.getFieldsV2().then(_ => {
				// this.getPlanDetail(options.ds_no);
			});
		}
	}
};
</script>

<style></style>
