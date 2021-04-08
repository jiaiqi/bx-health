<template>
	<view class="staff-manage">
		<view class="title">
			<text class="cuIcon-titles text-blue"></text>
			<text class="">{{pageItem.component_label||'咨询'}}</text>
		</view>
		<view class="content">
			<view class="professor-box">
				<view class="professor-item" v-for="(staff,index) in staffList" :key="index" @click="toDetail(staff)">
					<image class="img"
						:src="staff.user_image? getImagePath(staff.user_image):getImagePath(staff.profile_url)"
						mode="aspectFit"></image>
					<view class="doc-info">
						<view class="top">
							<text class="doc-name">{{ staff.person_name || staff.nick_name || '' }}</text>
							<view class="titleDn">{{ staff.titleDn }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	// 人员管理
	export default {
		data() {
			return {
				staffList: [],
				curStaff: {}
			}
		},
		props: {
			storeNo: {
				type: String,
				default: ''
			},
			pageItem: {
				type: Object
			}
		},
		methods: {
			async getStoreUserList() {
				let url = this.getServiceUrl('health', 'srvhealth_store_user_select', 'select');
				let req = {
					serviceName: 'srvhealth_store_user_select',
					colNames: ['*'],
					condition: [{
						colName: 'store_no',
						ruleType: 'eq',
						value: this.storeNo
					}, {
						colName: 'user_role',
						ruleType: 'inset',
						value: this.pageItem.user_role||'大夫'
					}]
				};
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data)) {
					this.staffList = res.data.data;
				}
			},
			toDetail(e) {
				// return
				this.$emit('toDoctorDetail', e)
			}
		},
		created() {
			this.getStoreUserList()
		}
	}
</script>

<style scoped lang="scss">
	.staff-manage {

		// 简介
		background-color: #fff;
		padding: 20rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		margin-bottom: 20rpx;

		&.news .title {
			border-bottom: 1rpx solid #ccc;
		}

		.news-list {
			.news-item {
				display: flex;
				padding: 20rpx 0;
				border-bottom: 1rpx dotted #f1f1f1;
				align-items: center;

				.title-text {
					width: 70%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}

				.date {
					flex: 1;
					text-align: right;
					color: #ccc;
				}
			}
		}

		.title {
			font-size: 28rpx;
			font-weight: 700;
			padding: 10rpx 0;
			color: rgb(48, 49, 51);
		}

		.content {
			.rich-text {
				height: 300rpx;
				overflow: scroll;
			}

			&.grid-layout {
				display: flex;

				.group-item {
					width: 25%;
					display: flex;
					padding: 20rpx 10rpx;
					flex-direction: column;
					align-items: center;
					// background-color: #f1f1f1;
					border-radius: 20rpx;

					&+.group-item {
						border-top: none;
					}

					.icon {
						border-radius: 10rpx;
						position: relative;
						width: 100rpx;
						height: 100rpx;
						display: flex;

						.image {
							border-radius: 50rpx;
							width: 100%;
							height: 100%;
						}
					}

					.top {
						.name {
							margin-top: 10rpx;
							font-weight: bold;
							font-size: 28rpx;
							letter-spacing: 0;
						}
					}
				}
			}

			.professor-box {
				display: flex;
				flex-wrap: wrap;

				.record-detail {
					box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
					width: calc(33% - 40rpx / 3);
					display: flex;
					flex-wrap: wrap;
					justify-content: flex-start;
					align-items: center;
					margin-bottom: 10rpx;
					margin-right: 10rpx;
					margin-left: 10rpx;

					&:nth-child(3n) {
						margin-right: 0;
						margin-left: 0;
					}

					padding: 10rpx;

					.record-item {
						width: 100%;
						display: flex;
						padding: 5rpx 0;
						align-items: center;

						.label {
							font-size: 12px;
							color: #888;
							margin-right: 5px;
						}
					}
				}

				.professor-item {
					padding: 10rpx;
					margin-bottom: 10rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 25%;

					.img {
						width: 100rpx;
						height: 100rpx;
						border-radius: 10rpx;
					}

					.doc-info {
						display: flex;
						width: 100%;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						text-align: center;

						.top {
							width: 100%;
							text-align: center;
							padding: 10rpx 0;
							overflow: hidden;
							white-space: nowrap;
							text-overflow: ellipsis;

							.doc-name {
								font-size: 24rpx;
								width: 180rpx;
								// overflow: hidden;
								white-space: nowrap;
								// text-overflow: ellipsis;
							}
						}

						.center {
							width: 100%;

							.depart-name {
								width: 100%;
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: nowrap;
								font-size: 26rpx;
								color: #5e5e5e;
								padding: 2px 0;
							}
						}

						.bottom {
							overflow: hidden;
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							color: #afafaf;
							font-size: 24rpx;
						}
					}
				}
			}
		}
	}
</style>
