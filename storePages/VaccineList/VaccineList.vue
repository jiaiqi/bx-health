<template>
	<view class="vaccine-list" :style="{'--page-height':pageHeight}">
		<view class="vaccine-item" v-for="(item,itemIndex) in vaccineList" :key="itemIndex" @click="showInfo(item)">
			<view class="title">
				{{item.vaccine_drug_name}}
			</view>
			<!-- 		<text class="margin-left text-grey" v-if="item.persons_count!==1">
					(需要预约)
				</text> -->
			<view class="margin-left margin-right text-orange" v-if="!item.stock_count||item.stock_count<1">
				待到货
			</view>
			<!-- persons_count=1 - 不需要预约 -->
			<!-- stock_count 库存 -->
			<view class="margin-left  margin-right text-blue"
				v-if="item.persons_count===1&&item.stock_count&&item.stock_count<5">
				<!-- [库存：{{item.stock_count||'0'}}] -->
				库存较少
			</view>
			<view class="margin-left  margin-right text-olive" v-if="item.persons_count!==1">
				需要预约
			</view>
			<view class="button-box">
				<view class="cu-tag bg-cyan round" v-if="item.persons_count===1&&item.stock_count&&item.stock_count>0">
					随时到店
				</view>
				<!-- 	<view class="cu-tag bg-orange round" @click.stop="subscription"
					v-if="item.persons_count===1&&!item.stock_count">
					待到货
				</view> -->
				<view class="cu-tag bg-olive round " @click.stop="showModal(item)" v-if="item.persons_count!==1">
					预约
				</view>
				<!-- <view class="cu-tag bg-cyan round"
					v-if="item.persons_count===1&&item.stock_count&&item.stock_count>0">
					到店登记
				</view> -->
				<view class="cu-tag bg-orange round " @click.stop="showModal(item)"
					v-if="!item.stock_count||item.stock_count<1">
					到货通知
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="{'show':modalName==='vaccine-info'}" @click="hideModal" @touchmove.prevent>
			<view class="cu-dialog" @click.stop>
				<view class="vaccine-info">
					<view class="vaccine-name" v-if="vaccineInfo.vaccine_drug_name">
						{{vaccineInfo.vaccine_drug_name}}
					</view>
		
					<view class="vaccine-detail" v-if="vaccineInfo.usage">
						<view class="label">用法:</view>
						<view class="value">
							{{vaccineInfo.usage}}
						</view>
					</view>
					<view class="vaccine-detail" v-if="vaccineInfo.remark">
						<view class="label">说明:</view>
						<view class="value">
							{{vaccineInfo.remark}}
						</view>
					</view>
					<view class="image-box" v-if="vaccineInfo.remark_pic&&isArray(imagesUrl)">
						<image :src="item.smallUrl" mode="aspectFit" class="remark-pic" v-for="item in imagesUrl"
							:key="item.smallUrl" @tap="toPreviewImage(imagesUrl.map(e=>e.originUrl))">
						</image>
						<view class="tips" v-if="vaccineInfo.remark_pic&&isArray(imagesUrl)"
							@tap="toPreviewImage(imagesUrl.map(e=>e.originUrl))">
							点击照片查看详情
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="{'show':modalName==='realname'}" @click="hideModal" @touchmove.prevent>
			<view class="cu-dialog" @click.stop>
				<!-- 实名登记信息 -->
				<view class="modal-title text-bold text-cyan bg-white">
					请先完善实名信息
				</view>
				<form class="realname-form">
					<view class="cu-form-group">
						<view class="title">姓名</view>
						<input placeholder="请输入您的真实姓名" name="input" v-model="formModel.customer_name"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">身份证号</view>
						<input placeholder="请输入您的身份证号" name="input" type="idcard" v-model="formModel.id_no"></input>
					</view>
					<view class="cu-form-group">
						<view class="title">出生日期</view>
						<picker mode="date" v-model="formModel.customer_birth_day" start="1930-09-01" end="2022-09-01"
							@change="DateChange">
							<view class="picker birthday">
								{{formModel.customer_birth_day||'请选择'}}
							</view>
						</picker>
					</view>
					<view class="cu-form-group">
						<view class="title">手机号码</view>
						<text v-if="!formModel.phone_xcx">点击右侧按钮获取手机号</text>
						<!-- 				<input placeholder="请先授权获取手机号" name="input" type="number" v-model="formModel.customer_phone"
							:disabled="!formModel.phone_xcx" v-else></input> -->
						<input placeholder="请先授权获取手机号" name="input" type="number" v-model="formModel.customer_phone"
							v-else></input>
						<view class="cu-capsule radius" v-if="!formModel.phone_xcx">
							<button class="cu-tag bg-blue" type="primary" open-type="getPhoneNumber"
								@getphonenumber="decryptPhoneNumber">
								获取手机号
							</button>
						</view>
					</view>
				</form>
				<view class="bg-white tip text-red" v-if="tip">
					{{tip}}
				</view>
				<view class="button-box">
					<button type="primary" class="cu-btn bg-blue" @click="updateUserInfo">确定</button>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{'show':modalName==='vaccine'}" @click="hideModal"
			@touchmove.prevent>
			<view class="cu-dialog" @click.stop>
				<view class="vaccine-info">
					<view class="cu-bar bg-white justify-end vaccine-name" v-if="vaccineInfo.vaccine_drug_name">
						<view class="content"> {{vaccineInfo.vaccine_drug_name}}</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>

					<view class="vaccine-info" v-if="vaccineInfo.usage">
						<view class="label">用法:</view>
						<view class="value">
							{{vaccineInfo.usage}}
						</view>
						<view class="tips" v-if="vaccineInfo.remark_pic&&isArray(imagesUrl)"
							@tap="toPreviewImage(imagesUrl.map(e=>e.originUrl))">
							点击查看照片说明
						</view>
					</view>
					<view class="vaccine-info" v-if="vaccineInfo.remark">
						<view class="label">说明:</view>
						<view class="value">
							{{vaccineInfo.remark}}
						</view>
					</view>
				</view>
				<view class="order-info">
					<view class="date-area" v-if="isArray(timeArr)&&timeArr.length>0">
						<view class="tips">
							{{vaccineTip}}
						</view>
						<view class="date-item"
							:class="{'line-cyan':selectedVaccine.sa_no===radio.sa_no,disabled:disabledTime(radio)}"
							v-for="radio in timeArr" :key="radio.sa_no" @click="selectItem(radio)">

							<text v-if="vaccineInfo.persons_count===1">{{radio.appoint_name}}</text>
							<view v-else>{{formateDate(radio.app_date,'MM-DD')}}
								{{radio.app_time_start?radio.app_time_start.slice(0,5):''}}
								-
								{{radio.app_time_end?radio.app_time_end.slice(0,5):''}}
							</view>
							<text v-if="radio.app_count" class="cu-tag badge">{{radio.app_count||''}}</text>
						</view>
					</view>
					<view class="from-box">
						<view class="form-title cuIcon-info text-gray">
							填写就诊人相关信息
						</view>
						<view class="cu-form-group">
							<text class="text-red">*</text>
							<view class="title">姓名</view>
							<input placeholder="姓名" name="input" v-model="formModel.customer_name"></input>
						</view>
						<view class="cu-form-group">
							<view class="title">出生日期</view>
							<picker mode="date" v-model="formModel.customer_birth_day" start="1900-09-01"
								end="2022-09-01" @change="DateChange">
								<view class="picker">
									{{formModel.customer_birth_day||'请选择'}}
								</view>
							</picker>
						</view>
						<view class="cu-form-group">
							<view class="title">手机号码</view>
							<input placeholder="手机号码" name="input" v-model="formModel.customer_phone"></input>
							<view class="cu-capsule radius">
								<view class='cu-tag bg-blue '>
									+86
								</view>
								<view class="cu-tag line-blue">
									中国大陆
								</view>
							</view>
						</view>
						<view class="form-item" :class="{active:activeField==='appoint_remark'}">
							<textarea v-model="formModel.appoint_remark" placeholder="预约说明" class="value textarea"
								:adjust-position="false" :fixed="true" :show-confirm-bar="false" />
						</view>
					</view>
					<view class="button-box center">
						<button class="cu-btn bg-grey margin-right-xs" @click="toOrderList">我的预约</button>
						<button type="primary" class="cu-btn bg-blue center" @click="submitOrder">提交预约</button>
					</view>
				</view>
			</view>
		</view>
		<view class="" style="margin-top:30vh;" v-if="loadStatus==='noMore'&&vaccineList.length===0">
			<u-empty text="数据为空" mode="list">
			</u-empty>
		</view>
		<uni-load-more :status="loadStatus"
			v-if="loadStatus!=='noMore'||(loadStatus==='noMore'&&vaccineList.length!==0)"></uni-load-more>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'

	import dayjs from '@/static/js/dayjs.min.js'
	export default {
		data() {
			return {
				vaccineList: [],
				condition: [], // 查询条件
				loadStatus: 'noMore', //more,loading,noMore
				page: {
					pageNo: 1,
					rownumber: 15,
					total: 0
				},
				modalName: '',
				selectedVaccine: {},
				activeField: '',
				formModel: {
					id_no: '',
					phone_xcx: '',
					customer_name: "",
					customer_birth_day: "",
					customer_phone: '',
					appoint_remark: ''
				},
				timeArr: [],
				imagesUrl: [],
				vaccineInfo: {}, // 疫苗信息
				curVac: {
					data: []
				},
				tip: ''
			}
		},
		computed: {
			pageHeight() {
				return 'calc(100vh - var(--window-top) - var(--window-bottom))'
			},
			vaccineTip() {
				if (this.vaccineInfo) {
					if (!this.vaccineInfo.stock_count || this.vaccineInfo.stock_count < 1) {
						return '请在下方选择您需要被通知的业务'
					} else {
						return '请在下方选择您预约打疫苗的时间'
					}
				}
			},
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},

		methods: {
			async decryptPhoneNumber(e) {
				// 解密手机号信息
				let self = this
				try {
					let sessionStatus = await wx.checkSession()
				} catch (err) {
					// session_key 已经失效， 需要重新执行登录流程
					if (err) {
						uni.showToast({
							title: err,
							icon: false
						})
					}
					let result = await wx.login()
					if (result.code) {
						await self.wxLogin({
							code: result.code
						})
					}
				}

				if (e.detail && e.detail.errMsg && e.detail.errMsg.indexOf('ok') !== -1) {
					let url = this.getServiceUrl('wx', 'srvwx_app_data_decrypt', 'operate')
					let req = [{
						data: [{
							encryptedData: e.detail.encryptedData,
							signature: e.detail.iv
						}],
						serviceName: 'srvwx_app_data_decrypt'
					}]
					let res = await this.$http.post(url, req);
					if (res.data.resultCode === 'SUCCESS' && Array.isArray(res.data.response) && res.data.response
						.length > 0 && res.data.response[0].response && res.data.response[0].response.phoneNumber) {
						this.formModel.phone_xcx = res.data.response[0].response.phoneNumber
						this.formModel.customer_phone = res.data.response[0].response.phoneNumber
					} else {
						// wx.checkSession({
						// 	fail(err) {
						// 		// session_key 已经失效， 需要重新执行登录流程
						// 		wx.login({
						// 			success(result) {
						// 				if (result.code) {
						// 					self.wxLogin({
						// 						code: result.code
						// 					}).then(_ => {
						// 						self.decryptPhoneNumber(e)
						// 					})
						// 				}
						// 			}
						// 		})
						// 	}
						// })
					}
				}
			},
			hideModal() {
				this.vaccineInfo = {}
				this.curVac = {}
				this.selectedVaccine = {}
				this.modalName = ''
				Object.keys(this.formModel).forEach(key => {
					this.formModel[key] = ''
				})
			},
			onFocus(e) {
				this.activeField = e
			},
			toOrderList() {
				uni.navigateTo({
					url: '/storePages/VaccineOrder/VaccineOrder'
				})
			},
			async submitOrder() {
				// 提交预约信息
				if (!this.selectedVaccine || !this.selectedVaccine.sa_no) {
					uni.showToast({
						title: '请选择预约时间',
						icon: 'none'
					})
					return
				}
				if (!this.formModel.customer_name) {
					uni.showToast({
						title: '请填写就诊人姓名',
						icon: 'none'
					})
					return
				}
				let req = [{
					"serviceName": "srvhealth_store_vaccination_appoint_record_add",
					"condition": [],
					"data": [{
						"sa_no": this.selectedVaccine.sa_no,
						"appoint_name": this.selectedVaccine.appoint_name,
						"app_date": this.selectedVaccine.app_date,
						"app_time_start": this.selectedVaccine.app_time_start,
						"app_time_end": this.selectedVaccine.app_time_end,
						"customer_name": this.formModel.customer_name,
						"customer_birth_day": this.formModel.customer_birth_day,
						"customer_phone": this.formModel.customer_phone,
						"appoint_remark": this.formModel.appoint_remark,
						"person_no": this.userInfo.no,
						"person_user_no": this.userInfo.userno,
						"person_name": this.userInfo.name || this.userInfo.nick_name,
						"person_image": this.userInfo.person_image || this.userInfo.profile_url
					}]
				}]
				let res = await this.$fetch('operate', 'srvhealth_store_vaccination_appoint_record_add', req,
					'health');
				if (res.success) {
					this.$emit('submit', res.data)
					this.hideModal()
					uni.showModal({
						title: '提示',
						content: "预约成功",
						showCancel: false
					})
				}
			},
			DateChange(e) {
				this.formModel.customer_birth_day = e.detail.value
			},
			onBlur() {
				this.activeField = ''
			},
			selectItem(e) {
				if (this.disabledTime(e)) {
					uni.showToast({
						title: '已过期,不可预约',
						icon: 'none'
					})
					return
				}
				this.selectedVaccine = e
			},
			disabledTime(e) {
				// 判断是否过期 已过期则禁用
				let time = new Date(e.app_date + ' ' + e.app_time_start)
				let now = new Date()
				if (time.getTime() < now.getTime()) {
					return true
				} else {
					return false
				}
			},
			async getVaccineList(type = 'refresh') {
				// 查找可预约疫苗列表
				if (type === 'refresh') {
					this.page.pageNo = 1
				}
				let req = {
					"page": {
						"pageNo": this.page.pageNo,
						"rownumber": this.page.rownumber
					},
				}
				let res = await this.$fetch('select', 'srvhealth_store_vaccine_stocks_select', req, 'health')
				if (res.success) {
					if (type === 'refresh') {
						this.vaccineList = res.data
					} else {
						this.vaccineList = [...this.vaccineList, ...res.data]
					}
					if (res.page) {
						if (res.page.total > res.page.rownumber * res.page.pageNo) {
							this.loadStatus = 'more'
							this.page.pageNo++
						} else {
							this.loadStatus = 'noMore'
						}
					}
				}
				return this.vaccineList
			},
			// async showInfo(e) {
			// 	this.vaccineInfo = e
			// 	if (e.remark_pic) {
			// 		this.imagesUrl = [];
			// 		let images = await this.getFilePath(e.remark_pic)
			// 		if (Array.isArray(images)) {
			// 			for (let i = 0; i < images.length; i++) {
			// 				const obj = {
			// 					originUrl: `${this.$api.getFilePath}${images[i].fileurl}&bx_auth_ticket=${uni.getStorageSync('bx_auth_ticket')}`,
			// 					smallUrl: `${this.$api.getFilePath}${images[i].fileurl}&thumbnailType=fwsu_100&bx_auth_ticket=${uni.getStorageSync('bx_auth_ticket')}`
			// 				}
			// 				this.imagesUrl.push(obj);
			// 			}
			// 		}
			// 	}
			// 	this.modalName = 'vaccine-info'
			// },
			async selectTimeArr(e) {
				let req = {
					"condition": [{
							"colName": "svs_no",
							"ruleType": "eq",
							"value": e.vs_no
						},
						{
							"colName": "app_date",
							"ruleType": "ge",
							"value": this.formateDate()
						},
						// {
						// 	"colName": "app_date",
						// 	"ruleType": "lt",
						// 	value: dayjs().add(5, 'day').format('YYYY-MM-DD')
						// }
					],
					order: [{
						colName: "app_date",
						orderType: "asc"
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 20
					},
				}
				if (!e.stock_count || e.stock_count < 1) {
					req.condition = [{
							"colName": "svs_no",
							"ruleType": "eq",
							"value": e.vs_no
						},
						{
							"colName": "appoint_type",
							"ruleType": "eq",
							"value": '登记'
						}
					]
					delete req.order
				}
				let res = await this.$fetch('select', 'srvhealth_store_vaccination_appointment_select', req, 'health')
				if (res.success) {
					this.timeArr = res.data
					this.formModel.customer_name = this.userInfo.name || ''
					this.formModel.customer_phone = this.userInfo.phone || ''
					this.formModel.customer_birth_day = this.userInfo.birthday || ''
					this.formModel.phone_xcx = this.userInfo.phone_xcx || ''
					this.modalName = 'vaccine'
					this.getImage(e)
				}
			},
			async getImage(e) {
				if (e && e.remark_pic) {
					this.imagesUrl = [];
					let images = await this.getFilePath(e.remark_pic)
					if (Array.isArray(images)) {
						for (let i = 0; i < images.length; i++) {
							const obj = {
								originUrl: `${this.$api.getFilePath}${images[i].fileurl}&bx_auth_ticket=${uni.getStorageSync('bx_auth_ticket')}`,
								smallUrl: `${this.$api.getFilePath}${images[i].fileurl}&thumbnailType=fwsu_100&bx_auth_ticket=${uni.getStorageSync('bx_auth_ticket')}`
							}
							this.imagesUrl.push(obj);
						}
					}
				}
			},
			async showInfo(e) {
				this.vaccineInfo = e
				this.getImage(e)
				this.modalName = 'vaccine-info'
			},
			showRealNameModal() {
				this.formModel.customer_name = this.userInfo.name
				this.formModel.customer_phone = this.userInfo.phone
				this.formModel.customer_birth_day = this.userInfo.birthday
				this.formModel.id_no = this.userInfo.id_no
				this.formModel.phone_xcx = this.userInfo.phone_xcx
				this.modalName = 'realname'
			},
			showModal(e) {
				this.vaccineInfo = e
				if (this.userInfo && (!this.userInfo.id_no || !this.userInfo.phone || !this.userInfo.phone_xcx)) {
					this.showRealNameModal()
				} else {
					this.selectTimeArr(e)
				}
			},
		},
		created() {
			this.getVaccineList()
		},
		onReachBottom() {
			if (this.loadStatus !== 'noMore') {
				this.getVaccineList('loadmore')
			}
		},
		onPullDownRefresh() {
			this.getVaccineList().then(_ => {
				uni.stopPullDownRefresh()
			})
		}
	}
</script>

<style scoped lang="scss">
	.vaccine-list {
		display: flex;
		flex-direction: column;
		margin-bottom: 20rpx;
		background-color: #fff;
		min-height: var(--page-height);

		.vaccine-item {
			padding: 5rpx 20rpx;
			margin-bottom: 10rpx;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			border-bottom: 1rpx solid #f1f1f1;

			&:first-child {
				border-top: 1rpx solid #f1f1f1;
			}

			.title {
				display: inline-block;
				font-size: 16px;
				text-align: left;
				flex: 1;
			}

			.desc {
				flex: 1;
			}

			.button-box {
				flex: inherit;
				min-width: 75px;
				margin: 10rpx 0;

				.cu-tag {
					width: 100%;
				}
			}
		}

	}

	.cu-modal {
		z-index: 100;

		.vaccine-info {
			background-color: #fff;
			overflow: scroll;

			.vaccine-name {
				font-weight: bold;
				text-align: center;
			}

			.tips {
				width: 100%;
				text-align: center;
				font-size: 12px;
				color: #666;
				font-weight: bold;
			}

			.vaccine-detail {
				display: flex;
				padding: 0;
				padding: 10rpx;

				.label {
					color: #666;
					margin-right: 20rpx;
					min-width: 100rpx;
				}

				.value {
					flex: 1;
					text-align: left;
				}

				.tips {
					width: auto;
					text-align: center;
					font-size: 12px;
					color: #666;
					font-weight: bold;
				}
			}

			.image-box {
				border-radius: 20rpx;
				overflow: hidden;
				display: flex;
				justify-content: center;
				flex-wrap: wrap;

				.remark-pic {
					width: 300rpx;
					margin-right: 10rpx;

					.tips {
						width: 100%;
					}
				}
			}
		}

		.tip {
			text-align: center;
			padding: 10px;
		}

		.button-box {
			justify-content: center;
			text-align: center;
			padding: 20rpx;

			.cu-btn {
				min-width: 45%;
			}
		}
	}

	.birthday {
		text-align: left !important;
	}

	.cu-form-group {
		text-align: left;

		.title {
			min-width: calc(4em + 15px);
		}

		uni-picker .picker {
			text-align: left;
			line-height: 40px;
		}
	}

	.order-info {
		min-height: 50vh;
		max-height: calc(100vh - var(--window-top) - var(--window-bottom));
		overflow-y: scroll;
		background-color: #fff;
		padding: 20rpx;
		padding-top: 0;
		.cu-form-group {
			min-height: 40px;
		}

		.from-box {
			display: flex;
			flex-direction: column;
			text-align: left;
			margin-bottom: 20px;

			.form-title {
				text-indent: 20px;
				margin-top: 10px;
			}

			.form-item {
				display: flex;
				min-height: 30px;
				position: relative;
				margin: 10px 0;
				font-size: 16px;
				align-items: center;

				&:last-child {
					margin: 0;
				}

				.label {
					// position: absolute;
					line-height: 20px;
					left: 10px;
					padding: 0 5px;
					transition: all .5s ease;
					z-index: 2;
					top: 10px;
					color: #999;
					min-width: 80px;
				}

				// &.active {
				// 	.label {
				// 		top: -15px;
				// 		font-size: 14px;
				// 	}
				// }

				.value {
					width: 100%;
					height: 40px;
					display: flex;
					align-items: center;
					border-bottom: 1px solid #f1f1f1;
					text-indent: 20px;

					.text-area {}

					&.textarea {
						margin: 0 20rpx;
						min-height: 100rpx;
						text-indent: 20px;
						background-color: #f1f1f1;
						border-radius: 10px;
						padding: 10px 0;
					}
				}
			}
		}
	}

	.date-area {
		margin-top: 20rpx;
		display: flex;
		flex-wrap: wrap;

		.tips {
			width: 100%;
			padding-bottom: 5px;
			color: rgba($color: #39c5a9, $alpha: 1);
		}

		.date-item {
			display: flex;
			justify-content: center;
			padding: 5px 15px;
			border-radius: 5px;
			background-color: #f1f1f1;
			position: relative;
			margin-bottom: 10px;
			width: calc(50% - 5px);
			transition: all 0.5s ease;
			border: 1rpx solid transparent;
			
			&:nth-child(2n+1) {
				margin-left: 10px;
			}

			&.disabled {
				// pointer-events: none;
				// cursor: default;
				opacity: 0.6;
			}
		}
	}
</style>
