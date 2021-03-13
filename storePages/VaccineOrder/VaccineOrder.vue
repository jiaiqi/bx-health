<template>
	<view class="page-wrap">
		<view class="vaccine-list">
			<view class="vaccine-item animation-fade " v-for="(item,index) in vaccineList" :key="item.id">
				<view class="badge-ribbon">
					<!-- <view class="badge-ribbon" v-if="item.isSubscribe"> -->
					<image class="icon"
						src="data:image/png;base64,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"
						mode="aspectFit"></image>
				</view>
				<!-- 		<view class="badge-ribbon no-sub" v-else>
					<image class="icon" src="../static/b.png" mode="aspectFit"></image>
				</view> -->
				<view class="content">
					<view class="name">{{item.appoint_name}}</view>
					<view class="desc ">
						<view class="desc-item">
							<view class="desc-value">
								{{formateDate(item.app_date,'MM-DD')}}
								{{formateDate(item.app_date+' '+ item.app_time_start,'hh:mm')}} -
								{{formateDate(item.app_date+' '+ item.app_time_end,'hh:mm')}}
							</view>
						</view>
						<!-- 	<view class="desc-item">
							<view class="desc-label">
								已预约<text class="text-bold">{{item.app_count}}</text>人
							</view>
						</view> -->
					</view>
					<!-- <view class="desc  animation-slide-bottom">
						<view class="">
							{{item.app_desc}}
						</view>
					</view> -->
					<view class="subscribe-detail animation-slide-left" v-if="item.showDetail">
						<view class="subscribe-item">
							<view class="label">
								就诊人
							</view>
							<view class="value">
								{{item.customer_name}}
							</view>
						</view>
						<view class="subscribe-item" v-if="item.customer_birth_day">
							<view class="label">
								出生日期
							</view>
							<view class="value">
								{{item.customer_birth_day||''}}
							</view>
						</view>
						<view class="subscribe-item" v-if="item.customer_phone">
							<view class="label">
								电话
							</view>
							<view class="value">
								{{item.customer_phone}}
							</view>
						</view>
					</view>
					<view class="button-box">
						<button class="cu-btn animation-slide-right" @click="toDetail(index)"
							v-if="item.isSubscribe">{{item.showDetail?"收起":"查看"}}预约信息</button>
						<!-- <button class=" cu-btn"  @click="toOrder(item)" v-else>预约</button> -->
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				vaccineList: [], //疫苗列表
				vaccineRecord: [], //疫苗预约记录
				page: {
					rownumber: 10,
					total: 0,
					pageNo: 1
				}
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		methods: {
			toDetail(e) {
				let item = this.vaccineList[e]
				item.showDetail = !item.showDetail
				this.$set(this.vaccineList, e, item)
			},
			toOrder(e) {
				// 跳转到疫苗预约表单
				let fieldsCond = [{
						column: 'sa_no',
						display: false,
						value: e.sa_no
					},
					{
						column: 'appoint_name',
						display: false,
						value: e.appoint_name
					},
					{
						column: 'app_date',
						display: false,
						value: e.app_date
					},
					{
						column: 'app_time_start',
						display: false,
						value: e.app_time_start
					},
					{
						column: 'app_time_end',
						display: false,
						value: e.app_time_end
					},
					{
						column: 'person_no',
						display: false,
						value: this.userInfo.no
					},
					{
						column: 'person_user_no',
						display: false,
						value: this.userInfo.userno
					},
					{
						column: 'person_name',
						display: false,
						value: this.userInfo.name
					},
					{
						column: 'person_image',
						display: false,
						value: this.userInfo.user_image || this.userInfo.profile_url
					}
				];
				uni.navigateTo({
					url: `/publicPages/newForm/newForm?afterSubmit=back&submitAction=vaccineSuccess&serviceName=srvhealth_store_vaccination_appoint_record_add&successTip=已成功提交预约&type=add&fieldsCond=${JSON.stringify(fieldsCond)}`
				})
			},
			// async getVaccineRecord(saList) {
			// 	// 查找已预约疫苗列表
			// 	let req = {
			// 		"condition": [{
			// 			"colName": "sa_no",
			// 			"ruleType": "in",
			// 			"value": saList.toString()
			// 		}, {
			// 			"colName": "person_no",
			// 			"ruleType": "eq",
			// 			"value": this.userInfo.no
			// 		}],
			// 		"relation_condition": {},
			// 		"page": {
			// 			"pageNo": 1,
			// 			"rownumber": 99999
			// 		},
			// 	}
			// 	let res = await this.$fetch('select', 'srvhealth_store_vaccination_appoint_record_select', req,
			// 		'health')
			// 	if (res.success) {
			// 		return res.data
			// 	}
			// },
			async getVaccineRecord(saList) {
				// 查找已预约疫苗列表
				let req = {
					"condition": [{
						"colName": "person_no",
						"ruleType": "eq",
						"value": this.userInfo.no
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 99999
					},
				}
				let res = await this.$fetch('select', 'srvhealth_store_vaccination_appoint_record_select', req,
					'health')
				if (res.success) {
					this.vaccineList = res.data
					return res.data.map(item => {
						item.showDetail = false
						item.isSubscribe = true
						return item
					})
				}
			},
			async getVaccineList() {
				// 查找疫苗列表
				let req = {
					"condition": [{
						"colName": "app_date",
						"ruleType": "ge",
						"value": this.formateDate('', 'date')
					}],
					"page": {
						"pageNo": this.page.pageNo,
						"rownumber": this.page.rownumber
					},
				}
				let res = await this.$fetch('select', 'srvhealth_store_vaccination_appointment_select', req, 'health')
				if (res.success) {
					let saList = res.data.map(item => item.sa_no)
					if (saList.length > 0) {
						let vaccineRecord = await this.getVaccineRecord(saList)
						this.vaccineList = res.data.map(item => {
							let info = vaccineRecord.find(record => item.sa_no === record.sa_no)
							if (info) {
								// 已预约此疫苗
								item.isSubscribe = true
								item.detail = info
							} else {
								item.isSubscribe = false
							}
							item.showDetail = false
							return item
						})
					} else {
						this.vaccineList = res.data
					}
					return this.vaccineList
				}
			},
		},
		onPullDownRefresh() {
			this.getVaccineRecord().then(_ => {
				uni.stopPullDownRefresh()
			})
		},
		created() {
			uni.$on('vaccineSuccess', () => {
				this.getVaccineRecord()
				setTimeout(() => {
					uni.startPullDownRefresh({

					})
				}, 200)
			})
			this.getVaccineRecord()
		}
	}
</script>

<style lang="scss" scoped>
	@import "@/colorui/animation.css";

	.page-wrap {
		min-height: calc(100vh - var(--window-bottom) - var(--window-top));
		// background-color: #fff;
	}

	.button-box {
		display: flex;
		justify-content: center;
		margin-top: 10px;

		.cu-btn {
			background-color: #0bc99d;
			color: #fff;
		}
	}

	.vaccine-list {
		display: flex;
		flex-direction: column;
		padding: 40rpx 20rpx;
		overflow: auto;

		.vaccine-item {
			box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
			display: flex;
			background-color: #fff;
			border-radius: 5px;
			padding: 20rpx 20rpx 0;
			margin-bottom: 20px;
			position: relative;

			.name {
				font-weight: bold;
				font-size: 16px;
				padding: 10rpx 20rpx;
			}

			.badge-ribbon {
				position: absolute;
				right: 0;
				top: 15px;
				width: 100px;
				height: 100px;
				z-index: 2;
				transform: rotate(65deg);

				.image {
					width: 100px;
					height: 100px;
				}

				.icon {
					width: 100px;
					height: 100px;
				}

				&::after {
					color: #0bc99d;
					content: '已预约';
					position: absolute;
					right: 43px;
					top: 41px;
					font-size: 12px;
					transform: rotate(337deg) scale(1.2);
				}

				&.no-sub {
					&::after {
						color: #ccc;
						content: '待预约';
						position: absolute;
					}
				}

			}

			.desc {
				padding: 10rpx 20rpx;
				border-radius: 10rpx;
				overflow: hidden;
				display: flex;

				&+.desc {
					margin-top: 10rpx;
				}

				.desc-item {
					display: flex;

					&+.desc-item {
						margin-left: 10px;
					}

					.desc-value {
						font-weight: bold;
						color: #666;
					}

					.desc-label {
						margin-right: 10px;
						font-size: 12px;
					}
				}
			}

			.subscribe-detail {
				padding: 0 20rpx;
				border-radius: 10rpx;
				display: flex;
				flex-wrap: wrap;

				.subscribe-item {
					min-width: 50%;
					display: flex;
					padding: 4px;
					align-items: center;
					text-align: justify;
					text-align-last: justify;
					text-justify: inter-ideograph;

					.label {
						margin-right: 10px;
						font-size: 12px;
						min-width: 50px;
						display: inline-block;
					}

					.value {
						font-weight: bold;
					}
				}
			}
		}
	}
</style>
