<template>
	<view class="drug-plan">
		<view class="total-title">
			<view class="child-service-title">
				<text class="title-text">用药计划</text>
				<text class="title-action" @click="toAdd('plan')">
					<text class="cuIcon-add "></text>
					<text class="see-histroy">添加</text>
				</text>
			</view>
		</view>
		<bx-form
			ref="bxForm"
			:service="serviceName"
			:pageType="type"
			:BxformType="type"
			:fields="fields"
			:moreConfig="colsV2Data && colsV2Data.more_config ? colsV2Data.more_config : null"
		></bx-form>
		<view class="child-service">
			<view class="child-service-item" v-for="item in childServiceData">
				<view class="child-service-title" v-if="item && item.colVs">
					<text class="title-text">{{ item.colVs.service_view_name }}</text>
					<text class="title-action" @click="toAdd('detail', item)">
						<text class="cuIcon-add "></text>
						<text class="see-histroy">添加</text>
					</text>
				</view>
				<view class="child-service-data-wrap">
					<view class="child-service-data" v-for="data in item.data">
						<view class="title">{{ data.general_name }}</view>
						<view class="detail">
							<view class="detail-label">用法：</view>
							<view class="data-item">
								<text class="label">
									<!-- 用药 -->
									<text class="value">{{ data.take_times }}</text>
								</text>
							</view>
							<view class="data-item">
								<text class="label">
									每次用药
									<text class="value">{{ data.dosage_each_time }}</text>
									{{ data.dosage_unit }}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="child-service-item">
				<view class="child-service-title">
					<text class="title-text">用药记录</text>
					<text class="title-action" @click="toAdd('record')">
						<text class="cuIcon-add "></text>
						<text class="see-histroy">添加</text>
					</text>
				</view>
				<view class="child-service-data-wrap">
					<view class="child-service-data" v-for="item in drugRecord">
						<view class="title">{{ item.take_date }} {{ item.take_time.slice(0, 5) }}</view>
						<view class="detail">
							<!-- <view class="detail-label">用法：</view>
							<view class="data-item">
								<text class="label">
									每日用药
									<text class="value">222</text>
								</text>
							</view>
							<view class="data-item">
								<text class="label">
									每次用药
									<text class="value">333</text>
								</text>
							</view> -->
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			planNo: '',
			planDetail: {}, //用药计划
			colsV2Data: {},
			drugRecord: [], //用药记录
			fields: [],
			childServiceData: [],
			type: 'detail',
			appName: 'health',
			serviceName: 'srvhealth_drug_schedule_select',
			login_user_info: uni.getStorageSync('login_user_info')
		};
	},
	methods: {
		toAdd(type, item) {
			let condition = [];
			switch (type) {
				case 'plan':
					condition = [{ colName: 'userno', ruleType: 'eq', value: uni.getStorageSync('login_user_info').user_no }];
					uni.navigateTo({
						url: '/publicPages/form/form?serviceName=srvhealth_drug_schedule_add&type=add&cond=' + decodeURIComponent(JSON.stringify(condition))
					});
					break;
				case 'detail':
					condition = [{ colName: 'userno', ruleType: 'eq', value: uni.getStorageSync('login_user_info').user_no }];
					uni.navigateTo({
						url: '/publicPages/form/form?serviceName=srvhealth_drug_schedule_detail_list_add&type=add&cond=' + decodeURIComponent(JSON.stringify(condition))
					});
					break;
				case 'record':
					condition = [{ colName: 'userno', ruleType: 'eq', value: uni.getStorageSync('login_user_info').user_no }];
					uni.navigateTo({
						url: '/publicPages/form/form?serviceName=srvhealth_drug_schedule_record_add&type=add&cond=' + decodeURIComponent(JSON.stringify(condition))
					});
					break;
			}
		},
		async getFieldsV2(serviceName) {
			let colVs = await this.getServiceV2('srvhealth_drug_schedule_select', 'detail', 'detail', 'health');
			let defaultVal = null;
			this.colsV2Data = colVs;
			if (!colVs) {
				this.getPlanDetail(this.planNo);
				return;
			}
			// if (colVs.service_view_name) {
			// 	uni.setNavigationBarTitle({
			// 		title: colVs.service_view_name
			// 	});
			// }
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
						childServiceData.push({
							colVs: item,
							data: res.data.data
						});
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
					this.fields = colVs._fieldInfo;
					break;
				case 'update':
				case 'detail':
					defaultVal = await this.getPlanDetail(this.planNo);
					let fields = this.setFieldsDefaultVal(colVs._fieldInfo, defaultVal ? defaultVal : this.params.defaultVal);
					let hideColumns = ['ds_no', 'create_time', 'create_user', 'create_user_disp', 'modify_user', 'modify_user_disp', 'modify_time'];
					this.fields = fields.filter(item => {
						return !hideColumns.includes(item.column);
					});
					break;
				default:
					break;
			}
			this.getDrugRecord(this.planNo);
		},
		async getDrugRecord(no) {
			// 查找此用药计划的用药记录
			let url = this.getServiceUrl('health', 'srvhealth_drug_schedule_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_drug_schedule_record_select',
				colNames: ['*'],
				condition: [{ colName: 'ds_no', ruleType: 'eq', value: no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			if (this.login_user_info && this.login_user_info.user_no) {
				req.condition.push({ colName: 'create_user', ruleType: 'eq', value: this.login_user_info.user_no });
			}
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				this.drugRecord = res.data.data;
				return res.data.data;
			}
		},
		async getPlanDetail(no) {
			// 查找此用药计划的详细信息
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
	onShow() {
		if (this.planNo) {
			this.getFieldsV2(this.serviceName);
		}
	},
	onLoad(options) {
		if (options.ds_no) {
			this.planNo = options.ds_no;
			this.getFieldsV2(this.serviceName);
		}
	}
};
</script>

<style lang="scss" scoped>
.drug-plan {
	min-height: 100vh;
	background-color: #fff;
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
		// font-size: 50rpx;
		transition: all 1s;
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
		margin-bottom: 20rpx;

		,
		.child-service-data-wrap {
			display: flex;
			flex-wrap: wrap;
			width: 100%;
			.child-service-data {
				padding: 10rpx 0;
				width: calc(50% - 10rpx);
				margin-right: 20rpx;
				margin-bottom: 20rpx;
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
</style>
