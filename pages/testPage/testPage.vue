<template>
	<view class="test">
		<a-form v-if="colsV2Data && colsV2Data._fieldInfo" :fields="colsV2Data._fieldInfo" :pageType="srvType" :formType="use_type">
			<!-- 	<a-form-item v-for="field in colsV2Data._fieldInfo" :key="field.id" :field="field" :pageType="srvType">
				<view class="form-item-detail" v-if="srvType === 'detail'">
					<view class="form-item_image" v-if="pageFormType === 'detail' && fieldData.type === 'images'">
						<image
							v-if="fieldData.type === 'images'"
							v-for="(item, index) in imagesUrl"
							:key="index"
							style="padding: 5upx;"
							class="cu-avatar radius lg"
							@tap="showModal(index, 'Image')"
							data-target="Image"
							:src="item"
						></image>
					</view>
					<view class="form-item_rich-text" v-html="field.value" v-else-if="srvType === 'detail' && (field.type === 'snote' || field.type === 'Note')"></view>
					<view class="form-item_normal-text" v-else>{{ field.value }}</view>
				</view>
			</a-form-item> -->
		</a-form>
	</view>
</template>

<script>
/**
 *
 */
export default {
	data() {
		return {
			serviceName: 'srvhealth_person_info_add',
			srvType: 'add', // 表单信息 add | update  | select |list | detail
			use_type: 'add', // detail | proclist | list | treelist | detaillist | selectlist | addchildlist | updatechildlist | procdetaillist | add | update
			colsV2Data: {
				_fieldInfo:[]
			},
			condition: []
		};
	},
	methods: {
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
				serviceName += srvType;
			}
			return serviceName;
		},
		async getFieldsV2() {
			let app = uni.getStorageSync('activeApp');
			let colVs = await this.getServiceV2(this.serviceName, this.srvType, this.use_type, app);
			let defaultVal = null;
			this.colsV2Data = colVs;
			colVs = this.deepClone(colVs);
			// debugger;
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
					break;
				default:
					break;
			}
		}
	},

	onLoad(option) {
		const destApp = option.destApp;
		if (destApp) {
			uni.setStorageSync('activeApp', destApp);
		}
		this.getFieldsV2();
	},
	onReady() {
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// #endif
	}
};
</script>

<style lang="scss">
.test {
	width: 100%;
	min-height: 100vh;
	background-color: #f8f8f8;
	// padding: 20rpx;
	.data-empty {
		width: 100%;
		margin-top: 30vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.charts {
		width: calc(100% - 40rpx);
		height: 700rpx;
		margin-bottom: 20rpx;
	}
	.detail-desc {
		padding: 20rpx;
		text-indent: 40rpx;
		.rich-text {
			width: 100%;
			overflow: hidden;
		}
	}
	.node-path {
		padding: 20rpx;
		display: flex;
		flex-wrap: wrap;
		.path-item {
			display: flex;
			line-height: 40rpx;
			margin-bottom: 20rpx;
			.name {
				background-color: #0081ff;
				border-radius: 50rpx;
				padding: 5rpx 20rpx;
				font-size: 24rpx;
				color: #fff;
			}
			.separator {
				display: inline-flex;
				align-items: center;
				position: relative;
				margin-right: 5rpx;
				.line {
					display: inline-block;
					height: 5rpx;
					width: 40rpx;
					background-color: #0081ff;
					&::after {
						content: '';
						border: 10rpx solid transparent;
						border-left-color: #0081ff;
						position: absolute;
						right: -15rpx;
						top: calc(50% - 10rpx);
					}
				}
			}
		}
	}
}
</style>
