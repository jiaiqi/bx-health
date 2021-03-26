<template>
	<view class="vaccine-list" v-if="storeNo&&list.length>0">
		<view class="vaccine-title">
			<view class="title">
				<text class="cuIcon-titles text-blue"></text>
				<text>业务办理</text>
			</view>
		</view>
		<view class="news-list">
			<view class="news-item" :class="{'layout-right-image':item.biz_icon}" v-for="(item,index) in list"
				:key="index" @click="toQuest(item)">
				<image class="image-icon" :src="getImagePath(item.biz_icon)" v-if="item.biz_icon">
				</image>
				<view class="content-box">
					<text class="title-text">{{ item.biz_title }}</text>
					<text class="date">{{ formateDate(item.create_time) }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import {
		getVaccineList
	} from '../getData.js'
	export default {
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		props: {
			storeNo: {
				type: String,
				default: ''
			},
		},
		data() {
			return {
				modalName: '',
				list: [],
			}
		},
		created() {
			if (this.storeNo) {
				this.getList()
			}
		},
		methods: {
			toQuest(e) {
				if (e.daq_survey_activity_no) {
					let params = {
						// to: `/archivesPages/report/report?serviceName=srvhealth_examination_report_add&type=add`, //提交后要跳转的页面
						// idCol: 'report_daq_survey_activity_no', // 跳转时携带的参数
						// buttonLabel: '下一步',
						emptyValue: true, //清空值
						// fieldsCond: fieldsCond
					};
					uni.navigateTo({
						url: `/questionnaire/index/index?formType=form&params=${encodeURIComponent(JSON.stringify(params))}&activity_no=${e.daq_survey_activity_no}&status=进行中`
					})
				}
			},
			async getList() {
				// srvhealth_store_user_biz_daq_select 查找店铺关联业务
				let req = {
					"condition": [{
						colName: "store_no",
						ruleType: "like",
						value: this.storeNo
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 10
					},
				}
				let res = await this.$fetch('select', 'srvhealth_store_user_biz_daq_select', req,
					'health');
				if (res.success) {
					this.list = res.data
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.vaccine-list {
		display: flex;
		flex-direction: column;
		margin-bottom: 20rpx;
		background-color: #fff;

	}

	.vaccine-title {
		font-weight: bold;
		font-size: 16px;
		padding: 20rpx 20rpx 0;
		.title{
			padding-bottom: 10rpx;
			border-bottom: 1rpx solid #f1f1f1;
		}
	}

	.news-list {
		padding: 20rpx 40rpx;

		.news-item {
			display: flex;
			padding: 10rpx 0;
			border-bottom: 1rpx solid #f1f1f1;
			align-items: center;

			.title-text {
				width: 70%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				flex: 1;
				font-size: 16px;
			}

			.content-box {
				flex: 1;
				display: flex;
				flex-direction: column;
				min-height: 50px;
			}

			.date {
				color: #ccc;
			}

			&.none-image {
				// 无图
				flex-direction: column;
				align-items: flex-start;

				.title-text {
					font-size: 16px;
					width: 100%;
					white-space: normal;
					margin-bottom: 10px;
				}

				.date {
					font-size: 12px;
				}
			}

			&.layout-right-image,
			&.layout-left-image {
				// 左图
				flex-direction: row;
				flex-wrap: wrap;

				.content-box {
					min-height: 150rpx;
				}

				.image-icon {
					width: 200rpx;
					height: 150rpx;
					border-radius: 5px;
				}

				.title-text {
					margin-left: 20rpx;
					width: calc(100% - 250rpx);
					flex: 1;
				}

				.date {
					margin-left: 20rpx;
				}
			}

			&.layout-right-image {
				// 右图
				flex-direction: row-reverse;

				.title-text {
					margin-left: 0;
					width: calc(100% - 250rpx);
					flex: 1;
				}

				.date {
					margin-left: 0;
				}
			}
		}
	}
</style>
