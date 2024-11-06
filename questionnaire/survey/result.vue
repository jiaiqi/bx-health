<template>
	<view class="page-wrap">
    <view class="title">
      评估结果
    </view>
		<view class="padding-xl assessment-wrap ">
			<view class="content-wrap">
				<view class="padding-sm  assessment-item margin-top shadow" v-for="(item, index) in assessmentReport" :key="index">{{ item.sug_desc }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'assessmentResult', //评估结果
	data() {
		return {
			assessmentReport: [], //评估列表
			activity_no: '',
			fill_batch_no: ''
		};
	},
	methods: {
		toContcat() {
			uni.redirectTo({
				url: '/questionnaire/index/index?activity_no=20200319161730000131&formType=form&status=进行中'
			});
		},
		async seeReport(obj) {
			// 查看评估结果
			uni.showLoading({
				mask: true
			});
			let url = this.getServiceUrl('daq', 'srvdaq_activity_sug_select', 'select');
			let req = {
				serviceName: 'srvdaq_activity_sug_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'activity_no',
						ruleType: 'eq',
						value: obj.activity_no ? obj.activity_no : this.activity_no
					},
					{
						colName: 'fill_batch_no',
						ruleType: 'eq',
						value: obj.fill_batch_no ? obj.fill_batch_no : this.fill_batch_no
					}
				]
			};
			let res = await this.$http.post(url, req);
			uni.hideLoading();
			if (res.data.state === 'SUCCESS') {
				this.assessmentReport = res.data.data;
			} else {
				uni.showToast({
					title: '评估结果加载失败...',
					icon: 'none'
				});
			}
		}
	},
	onLoad(option) {
		if (option.activity_no && option.fill_batch_no) {
			this.fill_batch_no = decodeURIComponent(option.fill_batch_no);
			this.activity_no = decodeURIComponent(option.activity_no);
			this.seeReport({ fill_batch_no: option.fill_batch_no, activity_no: option.activity_no });
		}
	}
};
</script>

<style lang="scss" scoped>
  .page-wrap{
    background-color: #F7F9FD;
    min-height: 100vh;
    padding: 20px;
    .title{
      border-radius: 10px 10px 0px 0px;
      background: linear-gradient(159.97deg, rgba(206,234,158,1) -140.78%,rgba(53,179,137,1) 89.45%);
      font-size: 16px;
      color: #fff;
      padding: 10px 20px;
    }
  }
.assessment-wrap {
	display: flex;
	flex-direction: column;
  border: 1px solid #0E9472;
  border-radius: 0 0 10px 10px;
  min-height: 50vh;
}

.content-wrap {
	flex: 1;
	background-color:#fff;
  font-size: 20px;
  border-radius: 10px;
  min-height: 50vh;
}

</style>
