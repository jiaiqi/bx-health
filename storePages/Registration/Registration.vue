<template>
	<view>
		<lx-calendar :show-arrow="false" class="calendar" :value="selectedDate" @change="dateChange"></lx-calendar>
		<view class="schedule-view">
			<view class="schedule-range bg-white">
				<!-- <view class="schedule-range line-blue bg-blue   light round"> -->
				<view class="range-item">

				</view>
				<view class="range-item value" v-for="item in scheduleRange">
					<view class="">
						{{item.label}}
					</view>
					<view class="range">
						{{item.range}}
					</view>
				</view>
			</view>
			<view class="schedule-content">
				<view class="schedule-item" v-for="item in scheduleList">
					<view class="name schedule text-blue">
						<view class="text bg-orange light">
							{{item.name}}
						</view>
					</view>
					<view class="range schedule" v-for="range in item.range">
						<!-- <text v-if="range.status" :class="{'line-blue  light cu-btn  round':range.status==='上班'}">{{range.status}}</text> -->
						<view v-if="range.status" class="text" :class="{'bg-blue  light':range.status==='上班'}">
							{{range.status}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 	<view class="professor-box">
				<view class="professor-item" v-for="item in professorList" @click="toDetail(item)">
				<image class="img" :src="getImagePath(item.profile_url) ? getImagePath(item.profile_url) : '../static/img/doctor_default.png'"
				 mode="aspectFit"></image>
				<view class="doc-info">
					<view class="top">
						<view class="doc-name">
							<text> {{ item.person_name ? item.person_name : item.nick_name || '' }}</text>
							<text class="number">| 挂号量：<text class="text-blue">15</text></text>
						</view>
						<text class="cu-btn line-blue sm">有号</text>
					</view>
					<view class="center">
						<view class="depart-name">科室：{{ item.deptName || '耳鼻喉门诊科' }}</view>
					</view>
					<view class="bottom">{{ item.staff_introduction || '暂无介绍' }}</view>
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeNo: "",
				selectedDate: '2021-04-12',
				storeInfo: {},
				professorList: [],
				scheduleRange: [{
						label: '上午',
						range: '09:00 - 12:00',
					}, {
						label: '下午',
						range: '13:30 - 17:00',
					},
					{
						label: '晚上',
						range: '19:30 - 22:00',
					}
				],
				scheduleList: [{
						name: '李医生',
						range: [{
								value: '09:00 - 12:00',
								status: '上班'
							},
							{
								value: '13:00 - 17:00',
								status: '上班'
							}, {
								value: '19:00 - 22:00',
								status: ''
							}
						]
					},
					{
						name: '张医生',
						range: [{
								value: '09:00 - 12:00',
								status: ''
							},
							{
								value: '13:00 - 17:00',
								status: '上班'
							}, {
								value: '19:00 - 22:00',
								status: '上班'
							}
						]
					},
					{
						name: '赵医生',
						range: [{
								value: '09:00 - 12:00',
								status: '上班'
							},
							{
								value: '13:00 - 17:00',
								status: '上班'
							}, {
								value: '19:00 - 22:00',
								status: '上班'
							}
						]
					},
					{
						name: '张医生',
						range: [{
								value: '09:00 - 12:00',
								status: ''
							},
							{
								value: '13:00 - 17:00',
								status: '上班'
							}, {
								value: '19:00 - 22:00',
								status: '上班'
							}
						]
					}
				]
			}
		},
		methods: {
			dateChange(e) {
				this.selectedDate = e.fulldate
			},
			toDetail(e) {
				uni.navigateTo({
					url: `./RegistrationDetail?storeNo=${this.storeNo}&doctorNo=${e.person_no}`
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
					draft: false,
					query_source: 'list_page'
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
			selectProfessorList() {
				let req = {
					serviceName: 'srvhealth_store_user_select',
					colNames: ['*'],
					condition: [{
						colName: 'store_no',
						ruleType: 'eq',
						value: this.storeNo
					}, {
						colName: 'user_role',
						value: '大夫',
						ruleType: 'like'
					}],
					page: {
						pageNo: 1,
						rownumber: 10
					},
				};
				this.$fetch('select', 'srvhealth_store_user_select', req, 'health').then(res => {
					if (res.success) {
						this.professorList = res.data
					}
				})
			},
		},
		onLoad(option) {
			if (option.storeNo) {
				this.storeNo = option.storeNo
				// this.selectProfessorList()
				this.selectStoreInfo()
			}
		}
	}
</script>

<style scoped lang="scss">
	.calendar {
		/deep/.head {
			// background-color: #0BC99D;
			// color: #fff;
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
			align-items: center;

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
					// max-height: 100rpx;
					overflow: hidden;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 1;
					-webkit-box-orient: vertical;
					color: #afafaf;
					font-size: 24rpx;
				}
			}
		}
	}

	.schedule-view {
		margin: 20rpx;
		margin-top: 0;
		// border-radius: 20px;
		border-top: 1px solid #f1f1f1;
		// border-bottom: 1px solid #f1f1f1;
		overflow: hidden;

		.schedule-range {
			display: flex;
			// border: 1px solid #f1f1f1;
			// border-radius: 10px 10px 0 0;
			// background-color: #d2f1f0;
			border-bottom: 1px solid #f1f1f1;
			// border-radius: 10rpx;
			height: auto;
			overflow: hidden;

			.range-item {
				flex: 1;
				border-left: 1px solid #f1f1f1;

				// border: 1px solid #f1f1f1;
				&:first-child {
					flex: 0.8;
					border-left: none;
					// border-left: 1px solid #f1f1f1;
					// border-top: 1px solid #f1f1f1;
					// border-bottom: 1px solid #f1f1f1;
					border-radius: 10px 0 0 0;
					// border-right: 1px solid #fff;
				}

				&.value {
					// background-color: #f1f1f1;
					// border-right: 1px solid #fff;
					text-align: center;

					&:last-child {
						border-right: none;
					}

					.range {
						font-size: 12px;
					}

				}
			}
		}

		.schedule-content {
			border-radius: 0px 0px 10px 10px;
			overflow: hidden;

			// border: 1px solid #f1f1f1;
			.schedule-item {
				display: flex;
				box-sizing: border-box;

				.schedule {
					flex: 1;
					// border-left: 1px solid #f1f1f1;
					// border-bottom: 1px solid #f1f1f1;
					text-align: center;
					display: flex;
					justify-content: center;
					align-items: center;
					padding: 5rpx 0;

					// border-top: 1px solid #f1f1f1;
					&:first-child {
						flex: 0.8;
					}

					&:last-child {
						// border-right: 1px solid #f1f1f1;
						box-sizing: border-box;
					}

					&.name {
						// border-right: 1px solid #f1f1f1;
					}

					.text {
						width: calc(100% - 10rpx);
						padding: 10rpx 0;
						border-radius: 5px;
					}
				}
			}
		}
	}
</style>
