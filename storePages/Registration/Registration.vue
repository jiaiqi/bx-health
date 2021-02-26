<template>
	<view>
		<lx-calendar :show-arrow="false" class="calendar"></lx-calendar>
		<view class="professor-box">
			<view class="professor-item" v-for="item in professorList">
				<image class="img" :src="getImagePath(item.profile_url) ? getImagePath(item.profile_url) : '../static/img/doctor_default.jpg'"
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
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeNo: "",
				storeInfo: {},
				professorList: []
			}
		},
		methods: {
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
				this.selectProfessorList()
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
</style>
