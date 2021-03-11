<template>
	<view>
		<!-- <lx-calendar :show-arrow="false" class="calendar"></lx-calendar> -->
		<view class="professor-box">
			<view class="professor-item" @click="toDoctorDetail">
				<image class="img" :src="getImagePath(professorInfo.profile_url) ? getImagePath(professorInfo.profile_url) : '../static/img/doctor_default.png'"
				 mode="aspectFit"></image>
				<view class="doc-info">
					<view class="top">
						<view class="doc-name">
							<text> {{ professorInfo.person_name ? professorInfo.person_name : professorInfo.nick_name || '' }}</text>
						</view>
					</view>
					<view class="center">
						<view class="depart-name">科室：{{ professorInfo.deptName || '耳鼻喉门诊科' }}</view>
					</view>
					<view class="bottom">{{ professorInfo.staff_introduction || '暂无介绍' }}</view>
				</view>
			</view>
		</view>

		<view class="schedule-view">
			<view class="cuIcon-titles text-blue titles">
				出诊表
			</view>
			<view class="time-bar">
				<view class="time-item" v-for="item in timeArr">
					{{item}}
				</view>
			</view>
			<view class="content-view">
				<view class="date-bar">
					<view class="date-item" v-for="item in dayArr">
						<text class="">
							{{item.label}}
						</text>
						<text class="">
							{{item.date}}
						</text>
					</view>
				</view>
				<view class="schedule-list">
					<view class="schedule-item" v-for="item in scheduleList">
						<view class="schedule-item-detail" :class="{'bg-blue':item&&item.am&&item.am.total}">
							<text v-if="item&&item.am&&item.am.total">{{item.am.reserved||0}}</text>
							<text v-if="item&&item.am&&item.am.total">/{{item.am.total}}</text>

						</view>
						<view class="schedule-item-detail">

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
				storeNo: "",
				doctorNo: "",
				storeInfo: {},
				professorInfo: {},
				timeArr: ["", "上午", "下午"],
				scheduleList: [{
						date: '03-01',
						am: {},
						pm: {}
					},
					{
						date: '03-02',
						am: {},
						pm: {}
					},
					{
						date: '03-03',
						am: {
							reserved: 10, //已预约
							total: 30
						},
						pm: {}
					},
					{
						date: '03-04',
						am: {},
						pm: {}
					},
					{
						date: '03-05',
						am: {},
						pm: {}
					},
					{
						date: '03-06',
						am: {},
						pm: {}
					},
					{
						date: '03-07',
						am: {},
						pm: {}
					}
				],
				dayArr: [{
						label: '星期一',
						date: '03-01'
					},
					{
						label: '星期二',
						date: '03-02'
					},
					{
						label: '星期三',
						date: '03-03'
					},
					{
						label: '星期四',
						date: '03-04'
					},
					{
						label: '星期五',
						date: '03-05'
					},
					{
						label: '星期六',
						date: '03-06'
					},
					{
						label: '星期日',
						date: '03-07'
					},

				]
			}
		},
		methods: {
			toDoctorDetail(e) {
				uni.navigateTo({
					url: `/personalPages/DoctorDetail/DoctorDetail?doctor_no=${this.doctorNo}&store_no=${this.storeNo}`
				})
			},
			selectStoreInfo() {
				let req = {
					serviceName: 'srvhealth_store_mgmt_select',
					colNames: ['*'],
					condition: [{
						colName: 'store_no',
						ruleType: 'eq',
						value: this.storeNo
					}],
					page: {
						pageNo: 1,
						rownumber: 1
					},
				};
				this.$fetch('select', 'srvhealth_store_mgmt_select', req, 'health').then(res => {
					if (res.success && Array.isArray(res.data) && res.data.length > 0) {
						this.storeInfo = res.data[0]
						uni.setNavigationBarTitle({
							title: this.storeInfo.name
						});
					}
				})
			},
			selectProfessInfo() {
				let req = {
					serviceName: 'srvhealth_store_user_select',
					colNames: ['*'],
					condition: [{
							colName: 'store_no',
							ruleType: 'eq',
							value: this.storeNo
						},
						{
							colName: 'person_no',
							ruleType: 'eq',
							value: this.doctorNo
						}
					],
					page: {
						pageNo: 1,
						rownumber: 1
					},
				};
				this.$fetch('select', 'srvhealth_store_user_select', req, 'health').then(res => {
					if (res.success && res.data.length > 0) {
						this.professorInfo = res.data[0]
					}
				})
			},
		},
		onLoad(option) {
			if (option.storeNo && option.doctorNo) {
				this.storeNo = option.storeNo
				this.doctorNo = option.doctorNo
				this.selectProfessInfo()
				this.selectStoreInfo()
			}
		}
	}
</script>

<style scoped lang="scss">
	.calendar {
		/deep/.head {
			background-color: #0BC99D;
			color: #fff;
			height: 30px;
		}
	}

	.professor-box {
		background-color: #fff;
		display: flex;
		flex-direction: column;
		border-bottom: 1px solid #f1f1f1;

		.professor-item {
			padding: 10rpx 0;
			margin: 10rpx;
			display: flex;

			.img {
				width: 100rpx;
				height: 100rpx;
				border-radius: 10rpx;
				margin-right: 20rpx;
			}

			.doc-info {
				display: flex;
				flex-direction: column;
				flex: 1;

				.top {
					display: flex;
					justify-content: space-between;

					.doc-name {
						font-size: 34rpx;
						letter-spacing: 5rpx;

						.number {
							display: inline-block;
							font-size: 14px;
							letter-spacing: 1px;
							margin-left: 10px;
						}
					}

					.titleDn {
						font-size: 28rpx;
						margin-left: 30rpx;
						display: flex;
						align-items: flex-end;
						color: #999;
					}
				}

				.center {
					.depart-name {
						font-size: 26rpx;
						color: #5e5e5e;
						padding: 2px 0;
					}
				}

				.bottom {
					// overflow: hidden;
					// text-overflow: -o-ellipsis-lastline;
					// overflow: hidden;
					// text-overflow: ellipsis;
					// display: -webkit-box;
					// -webkit-line-clamp: 3;
					// -webkit-box-orient: vertical;
					color: #afafaf;
					font-size: 24rpx;
				}
			}
		}
	}

	.schedule-view {
		background-color: #fff;
		margin-top: 20rpx;
		padding: 10px;
		box-sizing: border-box;
		.titles {
			line-height: 40px;
		}

		.time-bar {
			display: flex;
			border-bottom: 1px solid #f1f1f1;
			border-top: 1px solid #f1f1f1;
			border-right: 1px solid #f1f1f1;
			.time-item {
				flex: 1;
				line-height: 40px;
				border-left: 1px solid #fff;
				text-align: center;
				background-color: #f1f1f1;

				&:first-child {
					flex: 0.8;
				}
			}
		}

		.content-view {
			display: flex;
			.date-bar {
				display: flex;
				flex-direction: column;
				border-right: 1px solid #f1f1f1;
				border-left: 1px solid #f1f1f1;
				width: 150rpx;
				flex: 0.8;

				.date-item {
					height: 50px;
					display: flex;
					justify-content: center;
					flex-direction: column;
					padding: 10px;
					border-bottom: 1px solid #f1f1f1;
					text-align: center;
					font-weight: bold;
					color: #666;
				}
			}

			.schedule-list {
				flex: 2;
				display: flex;
				flex-direction: column;

				.schedule-item {
					display: flex;
					height: 50px;
					border-bottom: 1px solid #f1f1f1;

					.schedule-item-detail {
						border-right: 1px solid #f1f1f1;
						height: 50px;
						flex: 1;
						display: flex;
						justify-content: center;
						align-items: center;
						transition: all .2s ease-in;

						&:active {
							background-color: #f1f1f1;
						}
					}
				}
			}
		}
	}
</style>
