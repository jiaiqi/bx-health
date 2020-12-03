<template>
	<view class="drug-plan">
		<view class="total-title"><view class="child-service-title"></view></view>
		<view class="main-table">
			<view class="table-item" v-for="item in fields" :key="item.column">
				<view class="label">{{ item.label }}</view>
				<view class="value">{{ item.value ? item.value : '' }}</view>
			</view>
		</view>
		<view class="child-service">
			<view class="child-service-item" v-for="(item, index) in childServiceData" :key="index">
				<view class="child-service-title" v-if="item && item.colVs">
					<text class="title-text">药品清单</text>
					<text class="title-action" @click="toAdd('detail', item)">
						<text class="cuIcon-add "></text>
						<text class="see-histroy">添加</text>
					</text>
				</view>
				<view class="child-service-data-wrap">
					<view class="child-service-data" v-for="(data, dataIndex) in item.data" :key="dataIndex">
						<view class="title">{{ data.general_name }}</view>
						<view class="detail">
							<view class="detail-label">用法：</view>
							<view class="data-item">
								<text class="label">
									<text class="value">{{ data.take_times }}</text>
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
				<view class="child-service-title"><text class="title-text">今日用药情况</text></view>
				<view class="child-service-data-wrap">
					<view class="child-service-data" v-for="(data, dataIndex) in drugList" :key="dataIndex">
						<view class="title">{{ data.general_name }}</view>
						<view class="detail">
							<view class="detail-label">已用{{ data.times }}次</view>
							<view class="detail-label">应用{{ data.take_times }}</view>
				<!-- 			<view class="data-item">
								<text class="label">
									<text class="value">{{ data.times }}</text>
								</text>
							</view> -->
						<!-- 	<view class="data-item">
								<text class="label">
									<text class="value">{{ data.dosage_each_time }}</text>
									{{ data.dosage_unit }}/次
								</text>
							</view> -->
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
				<view class="drug-record-timeline">
					<view class="cu-timeline" v-for="item in drugRecord" :key="item.date">
						<view class="cu-time" :class="{ 'text-blue': item.date === nowDate }">{{ item.date === nowDate ? `${item.date.slice(5)}(今天)` : item.date.slice(5) }}</view>
						<view
							class="cu-item text-gray"
							v-for="record in item.data"
							:class="{ 'text-bluess': item.date === nowDate, 'text-grayss': item.date !== nowDate }"
							:key="record.take_time"
						>
							<view class="timeline-content " :class="{ 'bg-bluess': item.date === nowDate, 'bg-grayss': item.date !== nowDate }">
								<view class="top">
									<view class="cu-capsule radius">
										<view class="cu-tag " :class="{ 'bg-blue': item.date === nowDate, 'bg-grey': item.date !== nowDate }">{{ calcTime(record.take_time) }}</view>
										<view class="cu-tag " :class="{ 'line-blue': item.date === nowDate, 'line-grey': item.date !== nowDate }">{{ record.take_time.slice(0, 5) }}</view>
									</view>
									<view class="delete-icon" @click="deleteRecord(record)"><text class="cuIcon-delete"></text></view>
								</view>
								<view class="drug-detail" v-if="isArray(record.detail)">
									<view class="detail-item" v-for="detail in record.detail" :class="{ 'text-blue': item.date === nowDate }">
										<text class="cuIcon-squarecheck "></text>
										<text>{{ detail.general_name }}</text>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import dayjs from '../static/dayjs/dayjs.min.js';

export default {
	data() {
		return {
			planNo: '',
			drugList:[], //当前用药计划的药品列表
			planDetail: {}, //用药计划
			colsV2Data: {},
			drugRecord: [], //用药记录
			todayRecord: [],  
			fields: [],
			childServiceData: [],
			type: 'detail',
			appName: 'health',
			serviceName: 'srvhealth_drug_schedule_select',
			login_user_info: uni.getStorageSync('login_user_info')
		};
	},
	computed: {
		nowDate() {
			return dayjs().format('YYYY-MM-DD');
		}
	},
	methods: {
		deleteRecord(e) {
			const self = this
			uni.showModal({
				title: '提示',
				content: '删除此条记录?',
				success(res) {
					if (res.confirm) {
						let url = self.getServiceUrl('health', 'srvhealth_drug_schedule_record_delete', 'operate');
						let req = [{ serviceName: 'srvhealth_drug_schedule_record_delete', condition: [{ colName: 'id', ruleType: 'in', value: e.id }] }];
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
						this.getFieldsV2(this.serviceName);
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
		toAdd(type, item) {
			let condition = [{ colName: 'ds_no', ruleType: 'eq', value: this.planNo }];
			let fieldsCond = [{ column: 'ds_no', condition: [{ colName: 'person_no', ruleType: 'eq', value: this.planDetail.person_no }] }];
			let url = '';
			switch (type) {
				case 'detail':
					condition = [{ colName: 'ds_no', ruleType: 'eq', value: this.planNo }];
					url = '/publicPages/form/form?serviceName=srvhealth_drug_schedule_detail_list_add&type=add&cond=' + decodeURIComponent(JSON.stringify(condition));
					// url = '/publicPages/form/form?serviceName=srvhealth_drug_schedule_detail_list_add&type=add&fieldsCond=' + decodeURIComponent(JSON.stringify(fieldsCond));
					break;
				case 'record':
					// url = `/publicPages/form/form?serviceName=srvhealth_drug_schedule_record_add&type=add&cond=${decodeURIComponent(
					// 	JSON.stringify(condition)
					// )}&fieldsCond=${decodeURIComponent(JSON.stringify(fieldsCond))}`;
					url = `/archivesPages/addDrugRecord/addDrugRecord?serviceName=srvhealth_drug_schedule_record_add&type=add&cond=${decodeURIComponent(
						JSON.stringify(condition)
					)}&fieldsCond=${decodeURIComponent(JSON.stringify(fieldsCond))}&ds_no=${this.planNo}`;
					break;
				case 'record-detail':
					// 用药记录明细 条件:用药计划编码（ds_no）；默认值:用药记录编码（dsr_no）
					condition = [{ colName: 'ds_no', ruleType: 'eq', value: this.planNo }];
					fieldsCond = [
						{ column: 's_code', condition: [{ colName: 'ds_no', ruleType: 'eq', value: this.planNo }] },
						{
							column: 'ds_no',
							condition: [{ colName: 'person_no', ruleType: 'eq', value: this.planDetail.person_no }, { colName: 'person_no', ruleType: 'eq', value: this.planDetail.person_no }]
						}
					];
					url = `/publicPages/form/form?serviceName=srvhealth_drug_schedule_record_detail_list_add&type=add&fieldsCond=${decodeURIComponent(JSON.stringify(fieldsCond))}`;
					break;
			}
			uni.navigateTo({
				url: url
			});
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
					break;
				case 'update':
				case 'detail':
					defaultVal = await this.getPlanDetail(this.planNo);
					let fields = this.setFieldsDefaultVal(colVs._fieldInfo, defaultVal ? defaultVal : this.params.defaultVal);
					let hideColumns = ['ds_no', 'create_time', 'create_user', 'create_user_disp', 'modify_user', 'modify_user_disp', 'modify_time', 'person_no'];

					this.fields = fields.filter(item => {
						return !hideColumns.includes(item.column);
					});
					break;
				default:
					break;
			}
			this.getDrugRecord(this.planNo);
		},
		async getDrugRecordDetail() {
			// 查找此用药计划的用药记录
			let url = this.getServiceUrl('health', 'srvhealth_drug_schedule_record_detail_list_select', 'select');
			let req = {
				serviceName: 'srvhealth_drug_schedule_record_detail_list_select',
				colNames: ['*'],
				condition: [{ colName: 'ds_no', ruleType: 'eq', value: this.planNo }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				return res.data.data;
			}
		},
		async getDrugRecord(no) {
			// 查找此用药计划的用药记录
			let url = this.getServiceUrl('health', 'srvhealth_drug_schedule_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_drug_schedule_record_select',
				colNames: ['*'],
				order: [{ colName: 'take_date', orderType: 'desc' }],
				condition: [{ colName: 'ds_no', ruleType: 'eq', value: no }]
			};
			if (this.login_user_info && this.login_user_info.user_no) {
				req.condition.push({ colName: 'create_user', ruleType: 'eq', value: this.login_user_info.user_no });
			}
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				// this.drugRecord =
				let dateArr = [];
				let DrugRecordDetailList = await this.getDrugRecordDetail();
				res.data.data.forEach(item => {
					
					if (!dateArr.includes(item.take_date)) {
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
										let hasExist = this.todayRecord.find((record)=>record.take_time===item.take_time)
										if(!hasExist){
											this.todayRecord.push(item);
										}
									}
								}
							});
						}
						if (date === item.take_date) {
							record.data.push(item);
						}
					});
					return record;
				});
				this.drugRecord = recordList;
				this.buildTodayCase()
				return res.data.data;
			}
		},
		buildTodayCase(){
			let drugList  =this.deepClone(this.childServiceData[0].data)
			let todayDrugDetail = this.todayRecord.reduce((a,b)=>a.concat(b.detail),[])
			this.drugList = drugList.map(drug=>{
				let times = 0
				todayDrugDetail.forEach(item=>{
					if(item.s_code===drug.s_code){
						times ++
					}
				})
				drug.times = times
				return drug
			})
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
	overflow: hidden;
	.main-table {
		min-height: 180rpx;
		display: grid;
		margin: 20rpx;
		grid-template-columns: repeat(2, calc(50% - 10rpx));
		// grid-row-gap: 20rpx;
		grid-column-gap: 20rpx;
		background-color: #409eff;
		box-shadow: 0px 1px 4px 0px #4e87c6, 0px 5px 2px 0px #b3d8ff;
		// box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		border-radius: 10rpx;
		.table-item {
			display: flex;
			padding: 10rpx 20rpx;
			line-height: 40rpx;
			color: #fff;
			.label {
				flex: 0.8;
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
	.cu-timeline .cu-time {
		width: 150rpx;
	}
	.timeline-content {
		padding: 30rpx;
		min-height: 200rpx;
		background-color: #fff;
		box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		.top {
			display: flex;
			justify-content: space-between;
			.delete-icon {
				font-size: 40rpx;
				transition: 0.5s all ease-out;
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
