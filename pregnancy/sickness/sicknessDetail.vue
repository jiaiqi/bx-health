<template>
	<view class="sickness-wrap">
		<view class="sickness-top">
			<view class="child-service-title">
				<text class="title-text">疾病</text>
			</view>
			<view class="main-table">
				<view class="table-item" v-for="item in fields" :key="item.column">
					<view class="label">{{ item.label }}</view>
					<view class="value">{{ item.value ? item.value : '' }}</view>
				</view>
			</view>
		</view>
		
		<view class="diviison-sick">
			<view class="child-service-title">
				<text class="title-text">科室</text>
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
				<!-- <text class="title-action" @click="toAdd('detail', item)">
					<text class="cuIcon-add "></text>
					<text class="see-histroy">添加</text>
				</text> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'sicknessDetail',
		data(){
			return {
				sickData:'',
				fields:[],
				planDetail:'',
				officeData:[]
			}
		},
		methods:{
			/*查询疾病科室**/
			async sickSection(){
				let url = this.getServiceUrl('health', 'srvhealth_disease_dept_select', 'select');
				let req = {
					serviceName: 'srvhealth_disease_dept_select',
					colNames: ['*'],
					condition: [{ colName: 'disease_no', ruleType: 'eq', value: this.sickData.disease_no }],
					page: { pageNo: 1, rownumber: 10 }
				};
				let res = await this.$http.post(url, req);
				if(res.data.data.length > 0){
					this.officeData = res.data.data
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
			let self = this
			this.sickData = this.$store.state.app.sickItem
			this.sickSection()
			this.getFieldsV2()
			console.log("this.$store.state.app.sickItem",this.$store.state.app.sickItem)
		},
		onLoad(option){
		}
	}
</script>

<style scoped lang="scss">
	.sickness-wrap{
		min-height: 100vh;
		background-color: white;
		padding-top: 1px;
		overflow-x: hidden;
		.sickness-top{
			.child-service-title{
				margin-left: 20rpx;
				margin-top: 20rpx;
			}
		}
	}	
	.diviison-sick{
		margin: 20rpx;
	}
	.child-service-title {
		width: 100%;
		font-size: 32rpx;
		font-weight: bold;
		// margin-bottom: 20rpx;
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
	.main-table {
		min-height: 180rpx;
		display: flex;
		margin: 20rpx;
		// grid-template-columns: repeat(2, calc(50% - 10rpx));
		flex-wrap: wrap;
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
				// flex: 0.8;
				margin-right: 20rpx;
			}
			.value {
				font-weight: 700;
				flex: 1;
			}
		}
	}
	.diviison-sick{
		// width: 100%;
		.child-service-title{
			display: flex;
			flex-direction: column;
			align-items: flex-start;
		}		
		.main-table{
			width: 100%;
			margin: 20rpx 0 0 0;
			display: flex;
			flex-direction: column;
			justify-content: center;
		}
	}
</style>
