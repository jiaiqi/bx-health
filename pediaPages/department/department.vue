<template>
	<view class="dept-info">
		<view class="dept-item">
			<view class="label">
				科室介绍
			</view>
			<view class="content">
				{{deptInfo.introduction||"暂无介绍"}}
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			dept_no: '',
			deptInfo: {}
		};
	},
	methods: {
		getDeptInfo() {
			let req = {
				serviceName: 'srvhealth_store_dept_select',
				colNames: ['*'],
				condition: [{ colName: 'no', ruleType: 'eq', value: this.dept_no }],
				page: { pageNo: 1, rownumber: 1 }
			};
			this.$fetch('select', 'srvhealth_store_dept_select', req, 'health').then(res => {
				if (Array.isArray(res.data) && res.data.length > 0) {
					this.deptInfo = res.data[0];
					if(this.deptInfo.dept_name){
						uni.setNavigationBarTitle({
							title:this.deptInfo.dept_name
						})
					}
				}
			});
		}
	},
	onLoad(option) {
		if (option.dept_no) {
			this.dept_no = option.dept_no;
			this.getDeptInfo();
		}
	}
};
</script>

<style scoped lang="scss">
	.dept-info{
		min-height: 100vh;
		background-color: #fff;
		padding: 20rpx;
	}
	.dept-item{
		.label{
			font-weight: bold;
			font-size: 16px;
			line-height: 20px;
		}
		.content{
			padding: 10rpx 0;
		}
	}
</style>
