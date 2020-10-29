<template>
	<view>
		<view class="padding-xl assessment-wrap">
			<view class="cu-bar justify-start">
				<view class="action sub-title">
					<text class="text-xl text-bold text-blue">评估报告</text>
					<text class="text-ABC text-blue">Report</text>
				</view>
			</view>
			<view class="content-wrap">
				<view class="padding-sm  assessment-item margin-top shadow" v-for="(item, index) in assessmentReport" :key="index">{{ item.sug_desc }}</view>
			</view>
			<view class="contact-us">
				<p>您好:</p>
				<p style="text-indent: 40upx;">如果您需要我们与您联系,帮助您进一步分析原因和给出建议,请您点击下面按钮提交您的联系方式</p>
				<button class="cu-btn bg-blue" @click="toContcat">反馈联系方式</button>
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
				url: '/pages/specific/questionnaire/questionnaire?activity_no=20200319161730000131&formType=form&status=进行中'
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

<style lang="scss">
.assessment-wrap {
	margin: 0upx;
	min-height: 100vh;
	background: rgba($color: #fff, $alpha: 0.8);
	background-image: url(../static/note.png);
	background-size: 100%;
	background-repeat: no-repeat;
	background-position-y: center;
	box-shadow: 0 0 5px rgba(0, 0, 100, 0.27), 0 0 20px rgba(0, 100, 100, 0.1) inset;
	// -webkit-filter: blur(3px);
	//    filter: blur(3px);
	display: flex;
	flex-direction: column;
	// box-shadow:0 0 5px rgba(0,0,0,0.27),0 0 20px  rgba(0,0,0,.1) inset;
}
.assessment-wrap:after {
	content: '';
	background-image: url(../static/note.png);
	background-size: 100%;
	background-repeat: no-repeat;
	background-position-y: center;
	width: 750upx;
	height: 100vh;
	opacity: 0.5;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
	position: absolute;
	z-index: -1;
	-webkit-filter: blur(3px);
	filter: blur(3px);
}
.content-wrap {
	flex: 1;
	background-color: rgba($color: #fff, $alpha: 0.2);
	.assessment-item {
		border-radius: 20upx;
		line-height: 1.5;
		color: #fff;
		font-size: 36upx;
		background-color: rgba($color: #0081ff, $alpha: 0.5);
	}
}

.contact-us {
	width: 100%;
	min-height: 300upx;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	font-size: 32upx;
	line-height: 50upx;
	button {
		width: 80%;
		margin: 20upx auto;
	}
}
</style>
