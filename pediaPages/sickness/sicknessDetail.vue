<template>
	<view class="sickness-wrap">
		<view class="sickness-main">
			<view class="sickness-name">{{ sickData.disease_name }}</view>
			<view class="sickness-content">
				<scroll-view scroll-x class="bg-white" scroll-with-animation :scroll-left="scrollLeft">
					<view class="scroll-view">
						<view
							class="nav-item"
							:class="index == TabCur ? 'text-green cur' : ''"
							v-for="(item, index) in tabs"
							:data-key="item.key"
							:key="index"
							@tap="tabSelect"
							:data-id="index"
						>
							<text class="item-label">{{ item.label }}</text>
						</view>
					</view>
				</scroll-view>
				<view class="content-text">
					<view class="diviison-sick" v-if="showKey === 'officeData'">
							<view v-if="officeData.length > 0" v-for="item in officeData" :key="item.id" class="main-table">
								<view class="table-item">
									<view class="label">科室名称</view>
									<view class="value">{{ item._dept_no_disp ? item._dept_no_disp : '' }}</view>
								</view>
								<view class="table-item">
									<view class="label">科室说明</view>
									<view class="value">{{ item._disease_no_disp ? item._disease_no_disp : '' }}</view>
								</view>
							</view>
					</view>
					<text v-else>{{ sickData[showKey] }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'sicknessDetail',
	data() {
		return {
			sickData: '',
			fields: [],
			planDetail: '',
			officeData: [],
			TabCur: 0,
			scrollLeft: 0,
			showText: '',
			showKey: 'disease_desc',
			tabs: [
				{
					label: '概述',
					key: 'disease_desc'
				},
				{
					label: '发病部位',
					key: 'disease_location'
				},
				{
					label: '传染性',
					key: 'infectious'
				},
				{
					label: '发病人群',
					key: 'population'
				},
				{
					label: '治疗周期',
					key: 'treatment_duration'
				},
				{
					label: '治愈率',
					key: 'recovery_rate'
				},
				{
					label: '相关科室',
					key: 'officeData'
				}
			]
		};
	},
	methods: {
		tabSelect(e) {
			this.TabCur = e.currentTarget.dataset.id;
			if (e.currentTarget.dataset.key) {
				this.showKey = e.currentTarget.dataset.key;
			}
			this.scrollLeft = (e.currentTarget.dataset.id - 1) * 80;
		},
		/*查询疾病科室**/
		async sickSection() {
			let url = this.getServiceUrl('health', 'srvhealth_disease_dept_select', 'select');
			let req = {
				serviceName: 'srvhealth_disease_dept_select',
				colNames: ['*'],
				condition: [{ colName: 'disease_no', ruleType: 'eq', value: this.sickData.disease_no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			if (this.sickData && this.sickData.disease_no) {
				let res = await this.$http.post(url, req);
				if (res.data.data.length > 0) {
					this.officeData = res.data.data;
				}
			}
		},
		async getPlanDetail(no) {
			// 查找此用药计划的详细信息
			let url = this.getServiceUrl('health', 'srvhealth_disease_select', 'select');
			let req = {
				serviceName: 'srvhealth_disease_select',
				colNames: ['*'],
				condition: [{ colName: 'disease_no', ruleType: 'eq', value: this.sickData.disease_no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.planDetail = res.data.data[0];
				return res.data.data[0];
			}
		},
		async getFieldsV2(serviceName) {
			let colVs = await this.getServiceV2('srvhealth_disease_select', 'detail', 'detail', 'health');
			let defaultVal = null;
			this.colsV2Data = colVs;
			if (!colVs) {
				this.getPlanDetail();
				return;
			}
			if (Array.isArray(colVs.child_service)) {
				let childServiceData = [];
				for (let item of colVs.child_service) {
					const url = this.getServiceUrl(this.appName, item.service_name, 'select');
					let req = {
						serviceName: item.service_name,
						colNames: ['*'],
						condition: [{ colName: 'disease_no', ruleType: 'eq', value: this.planNo }]
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
			defaultVal = await this.getPlanDetail();
			let fields = this.setFieldsDefaultVal(colVs._fieldInfo, defaultVal ? defaultVal : this.params.defaultVal);
			let hideColumns = ['disease_no', 'create_time', 'create_user', 'create_user_disp', 'modify_user', 'modify_user_disp', 'modify_time'];

			this.fields = fields.filter(item => {
				return !hideColumns.includes(item.column);
			});
		}
	},

	mounted() {
		let self = this;
		this.sickData = this.$store.state.app.sickItem;
		this.sickSection();
		this.getFieldsV2();
		console.log('this.$store.state.app.sickItem', this.$store.state.app.sickItem);
	},
	onLoad(option) {}
};
</script>

<style scoped lang="scss">
.sickness-name {
	font-size: 20px;
	font-weight: bold;
	padding: 20rpx;
}
.sickness-content {
	.scroll-view {
		display: flex;
	}
	.content-text {
		padding: 20rpx;
		line-height:2;
	}
	.nav-item {
		padding: 20rpx;
		width: auto;
		white-space: nowrap;
		padding-bottom: 10rpx;
		border-bottom: 1px solid #f1f1f1;
		display: inline-block;
		.item-label {
			padding-bottom: 10rpx;
		}
		&.cur {
			.item-label {
				border-bottom: 2px solid #0bc99d;
			}
		}
	}
}


.sickness-wrap {
	min-height: 100vh;
	background-color: white;
	overflow-x: hidden;
}
.main-table {
	min-height: 180rpx;
	display: flex;
	margin: 20rpx;
	flex-wrap: wrap;
	grid-column-gap: 20rpx;
	background-color: #4cb2ff;
	box-shadow: 0px 1px 4px 0px #4e87c6, 0px 5px 2px 0px #b3d8ff;
	border-radius: 10rpx;
	.table-item {
		display: flex;
		padding: 10rpx 20rpx;
		line-height: 40rpx;
		color: #fff;
		.label {
			// flex: 0.8;
			margin-right: 20rpx;
		}
		.value {
			font-weight: 700;
			flex: 1;
		}
	}
}
.diviison-sick {
	.main-table {
		width: 100%;
		margin: 20rpx 0 0 0;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
}
</style>
