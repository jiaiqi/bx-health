<template>
	<view class="page-wrap">
		<view class="vaccine-list">
			<view class="vaccine-item animation-fade " v-for="(item,index) in vaccineList" :key="item.id">
				<view class="badge-ribbon">
				<!-- <view class="badge-ribbon" v-if="item.isSubscribe"> -->
					<image class="icon" src="../static/a.png" mode="aspectFit"></image>
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
					<view class="subscribe-detail animation-fade" v-if="item.showDetail">
						<view class="subscribe-item">
							<view class="label">
								就诊人
							</view>
							<view class="value">
								{{item.customer_name}}
							</view>
						</view>
						<view class="subscribe-item">
							<view class="label">
								出生日期
							</view>
							<view class="value">
								{{item.customer_birth_day}}
							</view>
						</view>
						<view class="subscribe-item">
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
					.desc-value{
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
				}
			}
		}
	}
</style>
