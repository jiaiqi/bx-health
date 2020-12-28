<template>
	<view class="health-archive-wrap">
		<view class="avatar-box">
			<view
				class="bg-view"
				:style="{ 'background-image': `url(${avatorPath ? avatorPath : 'https://tse1-mm.cn.bing.net/th/id/OIP.pX_K8kY1FWrj9h_2YRlqBwHaEB?pid=Api&rs=1'})` }"
			></view>
			<view class="content-box">
				<view class="avatar-bar">
					<image :src="avatorPath ? avatorPath : '/static/icon/wode_selected.png'" mode="aspectFit" class="avatar-iamge"></image>
					<view class="info">
						<view class="info_top">
							<text class="username">{{ userInfo.name }}</text>
							<view @click="toChatPage" class="content-right">
								<text style="z-index: 1;" v-if="unreadMessage != 0">{{ unreadMessage }}</text>
								<image src="../../static/chat.png" mode=""></image>
							</view>
						</view>

						<view class="other-info">
							<view class="info-item">
								<text class="label">性别:</text>
								<text class="value">{{ userInfo.sex }}</text>
							</view>
							<view class="info-item">
								<text class="label">年龄:</text>
								<text class="value">{{ age }}</text>
							</view>
							<view class="info-item">
								<text class="label">职业:</text>
								<text class="value">{{ userInfo.job }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="profile-box">
					<view class="title">
						<view class="text">关注</view>
						<!-- <view class="icon"><text class="cuIcon-right"></text></view> -->
					</view>
					<view class="requirement-box">
						<view class="require-item" v-for="item in requirement" :key="item">{{ item }}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="profile-box tags">
			<view class="title">
				<view class="text">标签</view>
				<view class="title-action" @click="navPages('addTag')">
					<text class="cuIcon-time"></text>
					<text class="see-histroy">添加标签</text>
				</view>
				<!-- <view class="icon"><text class="cuIcon-right"></text></view> -->
			</view>
			<view class="requirement-box">
				<view class="require-item" v-for="item in tagList" :key="item.id">{{ item.label_name }}</view>
			</view>
		</view>
		<view class="health-archive-item health-score">
			<view class="subtitle">
				<text class="title-text">近日健康指数</text>
				<view class="title-action" @click="navPages('history')">
					<text class="cuIcon-time"></text>
					<text class="see-histroy">查看历史</text>
				</view>
			</view>
			<view class="content grid-layout">
				<view class="grid-item" @click="navPages('diet')">
					<view class="title">饮食</view>
					<view class="data text-green">71</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="navPages('sport')">
					<view class="title">运动</view>
					<view class="data text-red">20</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="navPages('weight')">
					<view class="title">体重</view>
					<view class="data text-gray">0</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="navPages('bp')">
					<view class="title">血压</view>
					<view class="data text-gray">0</view>
					<view class="action"></view>
				</view>
				<view class="grid-item" @click="navPages('sleep')">
					<view class="title">睡眠</view>
					<view class="data text-blue">85</view>
					<view class="action"></view>
				</view>
				<view class="grid-item">
					<view class="title">症状</view>
					<view class="data text-orange">45</view>
					<view class="action"></view>
				</view>
			</view>
		</view>
		<view class="health-archive-item-wrap">
			<view class="health-archive-item ">
				<view class="subtitle">
					<text class="title-text">咨询记录</text>
					<view class=""></view>
				</view>
				<view class="content disease-risk">
					<view class="disease-item record"><text class="date">2020-11-13</text></view>
					<view class="disease-item record"><text class="date">2020-10-19</text></view>
					<view @click="toChatList" class="disease-item record">
						<text class="date">
							更多
							<text class="cuIcon-right margin-left-xs"></text>
						</text>
					</view>
				</view>
			</view>
			<view class="health-archive-item ">
				<view class="subtitle">
					<text class="title-text">检查报告</text>
					<view class=""></view>
				</view>
				<view class="content disease-risk">
					<view class="disease-item record" v-for="item in inspectReportRecord" :key="item.id" @click="toRecord(item)">
						<view class="title">{{ item.name }}</view>
						<view class="date">{{ item.end_time.slice(0, 10) }}</view>
					</view>
					<!-- <view v-if="inspectReportRecord&&inspectReportRecord.length>6" @click="toChatList" class="disease-item record"><text class="date">更多<text class="cuIcon-right margin-left-xs"></text></text></view> -->
				</view>
			</view>
			<view class="health-archive-item">
				<view class="subtitle">
					<text class="title-text">诊断记录</text>
					<view class=""></view>
				</view>
				<view class="content disease-risk">
					<view class="disease-item record"><text class="date">2020-11-13</text></view>
					<view class="disease-item record"><text class="date">2020-10-19</text></view>
					<view class="disease-item record">
						<text class="date">
							更多
							<text class="cuIcon-right margin-left-xs"></text>
						</text>
					</view>
				</view>
			</view>
			<view class="health-archive-item ">
				<view class="subtitle">
					<text class="title-text">用药记录</text>
					<view class=""></view>
				</view>
				<view class="content disease-risk">
					<view class="disease-item record"><text class="date">2020-11-13</text></view>
					<view class="disease-item record"><text class="date">2020-10-19</text></view>
					<view class="disease-item record">
						<text class="date">
							更多
							<text class="cuIcon-right margin-left-xs"></text>
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
export default {
	data() {
		return {
			// customer_no: '',
			userInfo: {},
			isLoad: false,
			inspectReportRecord: [],
			totalInspectReportRecord: [],
			tagList: [],
			unreadMessage: 0
		};
	},
	props: {
		customer_no: {
			type: String,
			default: ''
		},
		dp_no: {
			type: String,
			default: ''
		}
	},
	computed: {
		age() {
			if (this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
				return age;
			}
		},
		avatorPath() {
			return this.userInfo.profile_url ? this.getImagePath(this.userInfo.profile_url) : this.userInfo.user_image ? this.getImagePath(this.userInfo.user_image) : '';
		},
		requirement() {
			if (this.userInfo.requirement) {
				return this.userInfo.requirement.split(',');
			}
		},
		...mapState({
			globalTextFontSize: state => state.app['globalTextFontSize'],
			globalLabelFontSize: state => state.app.globalLabelFontSize,
			doctorInfo: state => state.app.doctorInfo
		}),
		...mapGetters({
			vuex_userInfo: 'userInfo',
			authSetting: 'authSetting',
			is_login: 'isLogin',
			wxuserinfo: 'wxUserInfo',
			login_user_info: 'loginUserInfo',
			client_env: 'env',
			authBoxDisplay: 'authBoxDisplay'
		})
	},
	methods: {
		async getMessageInfo(no) {
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
			let userno = this.$store.state.user.userInfo.userno;
			let req = {
				serviceName: 'srvhealth_consultation_chat_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'sender_account',
						ruleType: 'eq',
						value: no
					},
					{
						colName: 'receiver_account',
						ruleType: 'eq',
						value: userno
					},
					{
						colName: 'identity',
						ruleType: 'eq',
						value: '患者'
					},
					{
						colName: 'msg_state',
						ruleType: 'eq',
						value: '未读'
					}
				],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			let res = await this.$http.post(url, req);
			this.unreadMessage = res.data.data.length;
		},
		toChatPage() {
			uni.navigateTo({
				url: '/personalPages/myDoctor/doctorChat?no=' + this.customer_no
			});
		},
		getTagList() {
			let url = this.getServiceUrl('health', 'srvhealth_user_label_set_select', 'select');
			let req = {
				serviceName: 'srvhealth_user_label_set_select',
				colNames: ['*'],
				condition: [{ colName: 'dp_no', ruleType: 'eq', value: this.dp_no }]
			};
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					this.tagList = res.data.data;
				}
			});
		},
		// getPatientInfo(){

		// },
		async selectInspectionReport() {
			// 查询检查报告
			let url = this.getServiceUrl('health', 'srvhealth_see_doctor_lab_examination_select', 'select');
			let req = {
				serviceName: 'srvhealth_see_doctor_lab_examination_select',
				colNames: ['*'],
				condition: [{ colName: 'daq_survey_activity_no', ruleType: 'notnull', value: '' }]
			};
			let res = await this.$http.post(url, req);
			if (this.requestSuccess(res)) {
				let list = res.data.data;
				if (res.data.data.length > 0) {
					let no = list.map(item => item.daq_survey_activity_no).toString();
					let result = await this.getQuestRecord(no);
					this.isLoad = true;
					if (result) {
						this.totalInspectReportRecord = result.map(item => {
							list.forEach(record => {
								if (record.daq_survey_activity_no === item.activity_no) {
									item.name = record.name;
									item.attention = record.attention;
									item.examination_type = record.examination_type;
									item.content_desc = record.content_desc;
									item.specimen = record.specimen;
									item.ref_price = record.ref_price;
								}
							});
							return item;
						});
						// this.inspectReportRecord = this.totalInspectReportRecord.slice(0,6)
						this.inspectReportRecord = this.totalInspectReportRecord;
					}
				}
			} else {
				this.isLoad = true;
			}
		},
		async getQuestRecord(no) {
			let url = this.getServiceUrl('daq', 'srvdaq_record_reply_select', 'select');
			let req = {
				serviceName: 'srvdaq_record_reply_select',
				colNames: ['*'],
				condition: [
					{ colName: 'activity_no', ruleType: 'in', value: no },
					{ colName: 'state', ruleType: 'eq', value: '完成' },
					{ colName: 'user_no', ruleType: 'eq', value: this.userInfo.userno }
				]
			};
			let res = await this.$http.post(url, req);
			if (this.requestSuccess(res)) {
				let list = res.data.data;
				if (res.data.data.length > 0) {
					return res.data.data;
				}
			}
		},
		toRecord(item) {
			// 跳转到检查记录页面。
			// fill_batch_no activity_no
			if (item.activity_no && item.fill_batch_no) {
				uni.navigateTo({
					url: `/questionnaire/index/index?formType=detail&activity_no=${item.activity_no}&status=完成&fill_batch_no=${item.fill_batch_no}`
				});
			}
		},
		/*点击前往聊天列表**/
		toChatList() {
			// uni.navigateTo({
			// 	url: '/personalPages/chat/chatList'
			// });
		},
		navPages(type = 'history') {
			if (type === 'history') {
				uni.navigateTo({
					url: '/archivesPages/archives-history/archives-history?isAll=true&customer_no=' + this.customer_no
				});
			}
			if (type === 'addTag') {
				debugger
				let fieldsCond = [
					{ column: 'manager_no', display: false, value: this.doctorInfo.dt_no },
					{ column: 'customer_no', display: false, value: this.userInfo.no },
					{ column: 'dp_no', display: false, value: this.dp_no }
				];
				// if (fieldsCond.filter(item => item.value && item.value).length === 3) {
					uni.navigateTo({
						url: '/publicPages/newForm/newForm?serviceName=srvhealth_user_label_set_add&type=add&fieldsCond=' + decodeURIComponent(JSON.stringify(fieldsCond))
					});
				// }
			}
		},
		async getUserInfo(customer_no) {
			let url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'no', ruleType: 'eq', value: customer_no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.userInfo = res.data.data[0];
				uni.$emit('userInfos', res.data.data[0]);
				this.selectInspectionReport();
				this.getTagList();
				return res.data.data[0];
			} else {
				uni.showToast({
					title: '未找到患者信息',
					icon: 'none'
				});
			}
		}
	},
	mounted() {
		uni.$on('userInfos', e => {
			console.log('----------', e);
			this.getMessageInfo(e.userno);
		});
		uni.$on('updateSuccess', () => {
			console.log('0000000000000');
			this.getMessageInfo(this.userInfo.userno);
		});
		if (this.customer_no) {
			this.getUserInfo(this.customer_no);
		}
	},
	onLoad(option) {
		this.getMessageInfo();
		if (option.customer_no) {
			this.customer_no = option.customer_no;
		}
	},
	onShow() {}
};
</script>

<style scoped lang="scss">
.health-archive-wrap {
	display: flex;
	flex-direction: column;
	width: 100%;
	min-height: 100vh;
	background-color: #f1f1f1;
	padding-bottom: 110rpx;
	max-width: 1080rpx;
	margin: 0 auto;
	.avatar-box {
		position: relative;
		height: 500rpx;
		.bg-view {
			width: 100%;
			height: 400rpx;
			background-size: 100% 400rpx;
			background-repeat: no-repeat;
			filter: blur(20rpx);
			position: absolute;
			top: 0;
			left: 0;
			z-index: 1;
		}
		.content-box {
			z-index: 2;
			position: absolute;
			top: 100rpx;
			left: 0;
			height: 400rpx;
			width: 100%;
			padding: 20rpx;
			.avatar-bar {
				display: flex;
				.other-info {
					color: #fff;
					display: flex;
					align-items: center;
					flex-wrap: wrap;
					.info-item {
						margin-right: 40rpx;
						.value {
							margin-left: 10rpx;
						}
					}
				}
				.avatar-iamge {
					width: 150rpx;
					height: 150rpx;
					border-radius: 100rpx;
				}
				.info {
					display: flex;
					flex-direction: column;
					justify-content: center;
					padding-left: 20rpx;
					align-items: flex-start;
					// flex: 1;
					.info_top {
						display: flex;
						align-items: center;
						// position: relative;
						.content-right {
							display: flex;
							position: relative;
							text {
								background: red;
								min-width: 30rpx;
								height: 30rpx;
								color: #fff;
								font-weight: 600;
								display: flex;
								align-items: center;
								justify-content: center;
								border-radius: 20rpx;
								font-size: 24rpx;
								padding: 0 4rpx;
								position: absolute;
								left: 50%;
								top: -10rpx;
								z-index: 1px !important;
							}
							image {
								width: 50rpx;
								height: 50rpx;
							}
						}
					}
					.username {
						display: inline-block;
						color: #fff;
						font-weight: 600;
						font-size: 38rpx;
						padding: 10rpx 20rpx;
						// background-color: #666;
						border-top-right-radius: 20rpx;
						border-top-left-radius: 20rpx;
					}
					.other-info {
						padding: 20rpx;
						// background-color: #666;
						border-bottom-left-radius: 20rpx;
						border-bottom-right-radius: 20rpx;
						border-top-right-radius: 20rpx;
					}
				}
			}
		}
	}
	.profile-box {
		margin-top: 20rpx;
		width: 100%;
		min-height: 200rpx;
		background-color: #ffff;
		border-radius: 20rpx;
		&.tags {
			width: calc(100% - 40rpx);
			margin: 20rpx 20rpx 10rpx;
		}
		.title {
			width: 100%;
			padding: 10rpx 20rpx;
			display: flex;
			justify-content: space-between;
			color: #333;
			font-size: 34rpx;
			font-weight: 600;
			.title-action {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 0 20rpx;
				height: 60rpx;
				border-radius: 50rpx;
				border: 1px solid #f1f1f1;
				transition: all 1s;
				&:active {
					background-color: #999;
					color: #fff;
				}
				.see-histroy {
					font-size: 24rpx;
					text-indent: 10rpx;
				}
			}
		}
		.requirement-box {
			display: flex;
			align-items: flex-start;
			flex: 1;
			flex-wrap: wrap;
			.require-item {
				margin: 10rpx;
				padding: 10rpx 20rpx;
				@for $i from 1 through 20 {
					&:nth-child(#{$i}) {
						@if $i%2==1 {
							color: #409eff;
							background: #ecf5ff;
							border-color: #b3d8ff;
						}
						@if $i%2==0 {
							color: #67c23a;
							background: #f0f9eb;
							border-color: #c2e7b0;
						}
						@if $i%3==0 {
							color: #909399;
							background: #f4f4f5;
							border-color: #d3d4d6;
						}
						@if $i%4==0 {
							color: #e6a23c;
							background: #fdf6ec;
							border-color: #f5dab1;
						}
						@if $i%5==0 {
							color: #f56c6c;
							background: #fef0f0;
							border-color: #fbc4c4;
						}
					}
				}
			}
		}
	}
	.health-overall-score {
		width: calc(100% - 40rpx);
		margin: 0 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		.content {
			display: flex;
			justify-content: center;
			align-items: center;
			width: 100%;
			overflow: hidden;
			// flex-direction: column;
			flex: 1;
			.uni-ec-charts {
				width: 400rpx;
				height: 400rpx;
			}
			.separator {
				font-size: 100rpx;
				height: 160rpx;
				display: flex;
				align-items: flex-end;
			}
			.score-item {
				flex: 1;
				display: flex;
				flex-direction: column;
				color: #333;
				border-radius: 20rpx;
				width: 300rpx;
				height: 300rpx;
				align-items: center;
				justify-content: center;
				margin-right: 20rpx;
				background-color: #fff;
				box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
				position: relative;
				&:last-child {
					margin-right: 0;
				}
				.label {
					font-size: 30rpx;
					font-weight: 600;
					text-align: center;
					letter-spacing: 2px;
				}
				.value {
					font-size: 150rpx;
				}
				.trend {
					transform: rotate(180deg) scale(1, 1.5);
					font-size: 60rpx;
					position: absolute;
					bottom: 50%;
					right: 10%;
				}
			}
		}
	}
	.health-archive-item {
		display: flex;
		flex-wrap: wrap;
		margin: 20rpx 20rpx 0;
		padding: 20rpx;
		border-radius: 20rpx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		background-color: #fff;
		.subtitle {
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
					height: 100%;
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
				transition: all 1s;
				&:active {
					background-color: #999;
					color: #fff;
				}
				.see-histroy {
					font-size: 24rpx;
					text-indent: 10rpx;
				}
			}
		}
		.content {
			width: 100%;
			min-height: 80rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			font-weight: bold;
			&.grid-layout {
				display: grid;
				grid-template-columns: repeat(3, calc(33.33% - 20rpx));
				grid-row-gap: 20rpx;
				grid-column-gap: 20rpx;
				.grid-item {
					border-radius: 10rpx;
					display: flex;
					height: 150rpx;
					box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
					padding: 10rpx;
					flex-direction: column;
					.title {
						text-align: left;
					}
					.data {
						flex: 1;
						font-size: 60rpx;
						display: flex;
						justify-content: center;
						align-items: center;
					}
					.action {
						font-size: 24rpx;
						color: #999;
						text-align: right;
					}
				}
			}
			&.disease-risk {
				display: grid;
				grid-template-columns: repeat(3, calc(33.33% - 20rpx));
				grid-row-gap: 20rpx;
				grid-column-gap: 20rpx;
				.disease-item {
					padding: 10rpx 20rpx;
					border: 1px solid #999;
					display: flex;
					flex-direction: column;
					border-radius: 20rpx;
					min-height: 150rpx;
					&.record {
						min-height: 80rpx;
						background-color: #f8f8f8;
						justify-content: center;
						align-items: center;
						border: none;
						box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
					}
					&.text-red {
						border-color: #e54d42;
					}
					&.text-orange {
						border-color: #f37b1d;
					}
					.disease-name {
						font-size: 32rpx;
						flex: 1;
						// color: #666;
					}
					.number {
						font-size: 26rpx;
						min-width: 100rpx;
						flex: 1;
						text-align: center;
						.digit {
							font-size: 60rpx;
						}
					}
				}
			}
		}
	}
}
.health-item {
	min-height: 150rpx;
	display: flex;
	padding: 50rpx 30rpx;
	display: flex;
	flex-direction: column;
	.tips {
		color: #999;
		padding: 20rpx 0;
	}
	.check-box-group {
		display: flex;
		flex-wrap: wrap;
		.check-box-item {
			margin-right: 20rpx;
			min-width: 30%;
		}
	}
}
.user-list {
	min-height: 300rpx;
	padding: 50rpx 30rpx 30rpx;
	.user-item {
		text-indent: 40rpx;
		display: flex;
		align-items: center;
		font-weight: bold;
		font-size: 34rpx;
		padding: 30rpx 20rpx 10rpx;
		border-bottom: 1rpx solid #f1f1f1;
		transition: all 0.5s;
		.avatar {
			margin-right: 20rpx;
		}
		&:active {
			background-color: #f1f1f1;
		}
	}
}
.button-box {
	width: 100%;
	padding: 30rpx;
	font-weight: bold;
	text-align: center;
	.cu-btn {
		margin-right: 50rpx;
		&:last-child {
			margin-right: 0;
		}
	}
}
.health-bottom {
	display: flex;
	position: fixed;
	bottom: 0;
	background-color: #fff;
	width: 100%;
	// padding: 20rpx 0;
	height: 80rpx;
	justify-content: space-around;
	border-top: 1px solid rgba(0, 0, 0, 0.33);
	text {
		width: 49%;
		text-align: center;
		line-height: 80rpx;
		&:first-child {
			border-right: 1px solid rgba(0, 0, 0, 0.33);
		}
	}
	.active-text {
		color: chocolate;
	}
}
</style>
