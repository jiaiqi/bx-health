<template>
	<view class="couple-wrap">
		<view class="total-score text-blue">
			{{ totalScore }}
			<text class="unit">分</text>
		</view>
		<view class="tips"><text class="cuIcon-creative">提示：总分为100分，下方每一项右侧显示的百分数代表当前项占总分的比例</text></view>
		<view class="couple-more-wrap">
			<view class="couple-more-top">
				<text></text>
				<text>健康总分构成</text>
			</view>
			<view class="more-couple-cen-wrap">
				<view class="couple-cen more-couple-cen">
					<view @click="toQuestionnaire(item)" v-for="(item, index) in coupleData" :key="index" class="couple-cen-item">
						<!-- <view
						@click="clickItem(item)"
						v-for="(item, index) in coupleData"
						:key="index"
						class="couple-cen-item"
					> -->
						<view class="couple-cen-item-b">
							<text>{{ item.name }}</text>
							<!-- <text class="item-total-score"><text>总分:</text>{{item.fullMark ? Number(item.fullMark.toFixed(1)) : ''}}分</text> -->
							<!-- <text class="ratio">[{{ item.fullMark ? Number(item.fullMark.toFixed(1)) : '' }}%]</text> -->
						</view>
						<view v-if="item.name !== '其它'" class="couple-cen-item-t">
							<text class="text-blue score-detail" v-if="item.finished && ((item.grade !== null && item.grade !== undefined) || item.grade === 0)">
								{{ item.grade }}
								<text class="unit">分</text>
							</text>
							<text v-if="item.finished && !item.grade && item.grade !== 0" class="text">暂无得分</text>
							<view class="unfilled" v-if="!item.finished">
								<text class="text-icon cuIcon-edit"></text>
								<text class="text">点击填写</text>
							</view>
						</view>
						<text class="item-total-score">
							<text>总分:</text>
							{{ item.fullMark ? Number(item.fullMark.toFixed(1)) : '' }}分
						</text>
					</view>
				</view>
			</view>
			<view class="couple-more-top">
				<text></text>
				<text>体质健康评测</text>
			</view>
			<view class="more-couple-cen-wrap">
				<view class="couple-cen more-couple-cen">
					<view
						@click="clickItem(item)"
						v-for="(item, index) in corporeity"
						:key="index"
						:class="{
							'couple-cen-item-active': item.name === currentItem.name
						}"
						class="couple-cen-item"
					>
						<view class="couple-cen-item-b">
							<text>{{ item.name }}</text>
						</view>
						<view v-if="item.name !== '其它'" class="couple-cen-item-t" :class="item.grade === 0 ? '' : item.grade >= 0 && item.grade <= 5 ? 'risk' : 'normal'">
							<text class="score-detail" v-if="item.finished && ((item.grade !== null && item.grade !== undefined) || item.grade === 0)">
								{{ item.grade }}
								<text class="unit">分</text>
							</text>
							<text v-if="item.finished && !item.grade && item.grade !== 0" class="text">暂无得分</text>
							<view class="unfilled" v-if="!item.finished" @click="toQuestionnaire(item)">
								<text class="text-icon cuIcon-edit"></text>
								<text class="text">点击填写</text>
							</view>
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
			userInfo: '',
			coupleData: [
				{
					name: '体重',
					grade: null,
					fullMark: 20,
					finished: false,
					detail: {}
				},
				{
					name: '年龄',
					grade: null,
					fullMark: 5,
					finished: false
				},
				{
					name: '家族史',
					grade: null,
					fullMark: 5,
					no: '20201105111540000164',
					finished: false
				},
				{
					name: '疾病史',
					finished: false,
					no: '20201027152801000160',
					grade: null,
					fullMark: 5
				},
				{
					name: '饮食',
					finished: false,
					no: '20201106104133000174',
					grade: null,
					fullMark: 20
				},
				{
					name: '运动',
					finished: false,
					no: '20201109095316000178',
					grade: null,
					fullMark: 10
				},
				{
					name: '睡眠',
					finished: false,
					no: '20201109104327000185',
					grade: null,
					fullMark: 10
				},
				{
					name: '吸烟情况',
					finished: false,
					no: '20201106115503000176',
					grade: null,
					fullMark: 5
				},
				{
					name: '饮酒情况',
					finished: false,
					no: '20201106142616000177',
					grade: null,
					fullMark: 5
				},
				{
					name: '心理',
					finished: false,
					no: '20201109103435000184',
					grade: null,
					fullMark: 10
				},
				{
					name: '健康素养',
					finished: false,
					no: '20201109105128000186',
					grade: null,
					fullMark: 5
				}
			],
			corporeity: [
				{
					name: '阴虚质体质',
					grade: null,
					no: '20201112110542000192'
				},
				{
					name: '气郁质体质',
					grade: null,
					no: '20201112112218000193'
				},
				{
					name: '血瘀质体质',
					grade: null,
					no: '20201112113200000194'
				},
				{
					name: '痰湿质体质',
					grade: null,
					no: '20201112114401000195'
				},
				{
					name: '湿热质体质',
					grade: null,
					no: '20201112143740000196'
				},
				{
					name: '特禀质体质',
					grade: null,
					no: '20201112145435000197'
				},
				{
					name: '阳虚质体质',
					grade: null,
					no: '20201112105018000191'
				},
				{
					name: '气虚质体质',
					grade: null,
					no: '20201112104036000190'
				},
				{
					name: '平和质体质',
					grade: null,
					no: '20201112103143000189'
				}
			],
			scoreInfo: {},
			currentItem: {},
			currIndex: 0
		};
	},
	computed: {
		bmi() {
			if (this.userInfo.weight && this.userInfo.height) {
				return (Number(this.userInfo.weight) / Math.pow(Number(this.userInfo.height) / 100, 2)).toFixed(1);
			}
		},
		age() {
			if (this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
				return age;
			}
		},
		totalScore() {
			let result = this.coupleData.map(a => (a.grade ? a.grade : 0)).reduce((a, b) => a + b, 0);
			uni.$emit('healthTotalScoreChanged', result);
			uni.setStorageSync('healthTotalScore', result);
			return result;
		}
	},

	methods: {
		toQuestionnaire(item) {
			if (item && item.no) {
				uni.navigateTo({
					url: `/questionnaire/index/index?formType=form&activity_no=${item.no}&status=进行中`
				});
			} else {
				if (item && (item.name !== '体重' || item.name !== '年龄')) {
					let fieldsCond = [
						{
							column: 'profile_url',
							display: false
						},
						{
							column: 'userno',
							display: false,
							value: uni.getStorageSync('login_user_info').user_no
						},
						{
							column: 'no',
							value: this.userInfo.no
						}
					];
					uni.navigateTo({
						url: '/publicPages/newForm/newForm?serviceName=srvhealth_person_info_update&type=update&fieldsCond=' + encodeURIComponent(JSON.stringify(fieldsCond))
					});
				} else {
					uni.showToast({
						title: '未知编号，请刷新重试',
						icon: 'none'
					});
				}
			}
		},
		async getScoreFromQuestionRecord(no) {
			// 以user_no和问卷编号为条件拿到最新的问卷填写记录信息
			let url = this.getServiceUrl('daq', 'srvdaq_record_reply_select', 'select');
			let req = {
				serviceName: 'srvdaq_record_reply_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'activity_no',
						ruleType: 'eq',
						value: no
					},
					{
						colName: 'state',
						ruleType: 'eq',
						value: '完成'
					},
					{
						colName: 'user_no',
						ruleType: 'eq',
						value: this.userInfo.userno
					}
				],
				page: { pageNo: 1, rownumber: 10 },
				order: [{ colName: 'end_time', orderType: 'desc' }]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				return res.data.data[0];
			} else {
				return false;
			}
		},
		getWeightScore() {
			// 计算体重分数
			if (this.bmi) {
				let bmi = this.bmi;
				let result = 0;
				if (bmi >= 28 && bmi < 38) {
					result = (38 - bmi) / 2;
				} else if (bmi < 28 && bmi >= 24) {
					result = 5 + (4 * (28 - bmi)) / 5;
				} else if (bmi >= 18.5 && bmi < 21) {
					result = 10 + ((bmi - 18.5) * 10) / 2.5;
				} else if (bmi >= 21 && bmi < 24) {
					result = 20 - ((bmi - 21) * 10) / 3;
				} else if (bmi < 18.5 && bmi >= 10) {
					result = (Math.abs(10 - bmi) * 5) / 8.5;
				}
				return Number(result.toFixed(1));
			}
		},
		getAgeScore() {
			if (this.age) {
				let age = this.age;
				let result = 0;
				if (age <= 40) {
					result = 5;
				} else if (age > 40 && age <= 50) {
					result = 4;
				} else if (age > 50 && age <= 65) {
					result = 3;
				} else if (age > 65 && age <= 80) {
					result = 3 - ((age - 65) * 3) / 15;
				}
				return Number(result.toFixed(1));
			}
		},
		questionScore2grade(score, total) {
			if (total && (score || score === 0)) {
				return (score * total) / 100;
			}
		},
		async getCorporeityScore() {
			let scoreInfo = this.scoreInfo || {};
			let corporeity = this.corporeity;
			for (let item of corporeity) {
				if (!item.grade) {
					let res = await this.getScoreFromQuestionRecord(item.no);
					scoreInfo[item.name] = res;
					if (res && (res.score || res.score === 0)) {
						item.grade = res.score;
					}
					if (res.state === '完成') {
						item.finished = true;
					}
				}
			}
		},
		async getScoreInfo() {
			let scoreInfo = this.scoreInfo || {};
			let coupleData = this.coupleData;
			for (let item of coupleData) {
				switch (item.name) {
					case '体重':
						item.grade = this.getWeightScore();
						break;
					case '年龄':
						item.grade = this.getAgeScore();
						break;
					case '家族史':
					case '疾病史':
					case '饮食':
					case '运动':
					case '睡眠':
					case '心理':
					case '吸烟情况':
					case '饮酒情况':
						if (!item.grade) {
							let res = await this.getScoreFromQuestionRecord(item.no);
							scoreInfo[item.name] = res;
							if (res && (res.score || res.score === 0)) {
								item.grade = this.questionScore2grade(res.score, item.fullMark);
							}
							if (res.state === '完成') {
								item.finished = true;
							}
						}
						break;
				}
				if (item.grade || item.grade === 0) {
					item.finished = true;
				}
			}
			this.scoreInfo = scoreInfo;
		},
		clickItem(item) {
			if (item.name === this.currentItem.name) {
				this.currentItem = {};
			} else {
				this.currentItem = item;
			}
		},
		async selectQuestion() {
			let self = this;
			let url = this.getServiceUrl('daq', 'srvdaq_record_reply_select', 'select');
			let req = {
				serviceName: 'srvdaq_record_reply_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'activity_no',
						ruleType: 'eq',
						value: this.currentItem.no
					},
					{
						colName: 'user_no',
						ruleType: 'eq',
						value: uni.getStorageSync('login_user_info').user_no
					},
					{
						colName: 'state',
						ruleType: 'eq',
						value: '完成'
					}
				]
			};
			let res = await this.$http.post(url, req);
			return res.data.data;
		}
	},
	async created() {
		let userInfo = await this.selectBasicUserList();
		if (userInfo && userInfo.userno) {
			this.userInfo = userInfo;
			this.getScoreInfo();
			this.getCorporeityScore();
		}
	},
	onShow() {
		if (this.userInfo && this.userInfo.userno) {
			this.getScoreInfo();
			this.getCorporeityScore();
		}
	}
};
</script>

<style lang="scss" scoped>
.couple-wrap {
	background-color: white;
	min-height: 100vh;
	padding-top: 20rpx;
	.tips {
		padding: 20rpx;
		color: #67c23a;
		background: #f0f9eb;
		border-color: #c2e7b0;
		margin: 20rpx;
	}
	.total-score {
		width: 50%;
		margin: 0 auto 0;
		text-align: center;
		padding: 40rpx 0;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		font-size: 80rpx;
		border-radius: 100rpx;
		.unit {
			font-size: 28rpx;
		}
	}
	.couple-cen {
		display: grid;
		grid-template-columns: repeat(3, calc(33.33% - 20rpx));
		grid-row-gap: 20rpx;
		grid-column-gap: 20rpx;
		position: relative;
		margin-left: 20rpx;
		transition: all 1s;
		.couple-cen-item {
			height: 170rpx;
			box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
			border-radius: 14rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			padding: 10rpx;
			border: 1px solid transparent;
			.couple-cen-item-t {
				font-size: 72rpx;
				color: #ccc;
				font-weight: 600;

				.score-detail {
					position: relative;
					.unit {
						font-size: 24rpx;
						font-weight: normal;
						position: absolute;
						bottom: 0;
					}
				}
				.text {
					font-size: 14rpx;
				}
				.unfilled {
					font-size: 24rpx;
					color: #999;
					display: flex;
					flex-direction: column;
					align-items: center;
					font-weight: normal;
					.text-icon {
						font-size: 48rpx;
					}
				}
			}
			.risk {
				color: #e54d42;
			}
			.normal {
				color: #39b54a;
			}
			.couple-cen-item-b {
				font-size: 30rpx;
				font-weight: 700;
				position: relative;
				width: 100%;
				.ratio {
					font-weight: normal;
					font-size: 24rpx;
					color: #999;
				}
			}
			.item-total-score {
				font-weight: normal;
				font-size: 24rpx;
				color: #999;
			}
		}
		.couple-cen-item-active {
			height: 300rpx;
			z-index: 10;
			background-color: #fff;
			grid-column-start: 1;
			grid-column-end: 4;
			grid-row-start: 1;
			animation: 1s overview;
		}
	}
	@keyframes overview {
		0% {
			transform: scale(0);
		}
		100% {
			transform: scale(1);
		}
	}
	.couple-more-wrap {
		.couple-more-top {
			padding: 15px;
			font-size: 16px;
			font-weight: 800;
			display: flex;
			align-items: center;
			text {
				&:first-child {
					width: 8rpx;
					height: 32rpx;
					background-color: #0081ff;
					border-radius: 8rpx;
					margin-right: 10rpx;
				}
			}
		}
	}
}
</style>
