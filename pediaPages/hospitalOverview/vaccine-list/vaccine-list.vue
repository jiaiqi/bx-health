<template>
	<view class="vaccine-list" v-if="vaccineList&&vaccineList.length>0">
		<view class="vaccine-title">
			<view class="">
				<text class="cuIcon-titles text-blue"></text>
				<text>疫苗预约</text>
			</view>
			<view class="to-more text-grey" @click="toMore()" v-if="list.length>1">
				<text>更多</text>
				<text class="cuIcon-right "></text>
			</view>
		</view>
		<swiper class="swiper rectangle-dot" indicator-active-color="#00aaff" indicator-color="#ccc"
			:indicator-dots="true" :autoplay="false">
			<swiper-item v-for="(child,index) in list" :key="index" class="swiper-item">
				<view class="vaccine-item" v-for="(item,itemIndex) in child" :key="itemIndex" @click="showInfo(item)">
					<view class="title">
						{{item.vaccine_drug_name}}
					</view>
					<view class="margin-left line-blue"
						v-if="item.persons_count===1&&item.stock_count&&item.stock_count<5">
						<!-- [库存：{{item.stock_count||'0'}}] -->
						库存较少
					</view>
					<view class="margin-left text-grey" v-if="item.persons_count!==1">
						(需要预约)
					</view>
					<view class="button-box">
						<view class="cu-tag bg-cyan round" v-if="item.persons_count===1&&item.stock_count">
							随时到店
						</view>
						<view class="cu-tag bg-orange round" @click.stop="subscription"
							v-if="item.persons_count===1&&!item.stock_count">
							待到货
						</view>
						<view class="cu-tag bg-olive round " @click.stop="showModal(item)"
							v-if="item.persons_count!==1">
							预约
							<!-- <text v-if="item.to_appointment_count">({{item.to_appointment_count}})</text> -->

						</view>
					</view>
				</view>
			</swiper-item>
		</swiper>
		<view class="cu-modal" :class="{'show':modalName==='vaccine-info'}" @click="hideModal" @touchmove.prevent>
			<view class="cu-dialog" @click.stop>
				<view class="vaccine-info">
					<view class="vaccine-name" v-if="vaccineInfo.vaccine_drug_name">
						{{vaccineInfo.vaccine_drug_name}}
					</view>

					<view class="vaccine-info" v-if="vaccineInfo.usage">
						<view class="label">用法:</view>
						<view class="value">
							{{vaccineInfo.usage}}
						</view>
					</view>
					<view class="vaccine-info" v-if="vaccineInfo.remark">
						<view class="label">说明:</view>
						<view class="value">
							{{vaccineInfo.remark}}
						</view>
					</view>
					<view class="image-box" v-if="vaccineInfo.remark_pic&&isArray(imagesUrl)">
						<image :src="item.smallUrl" mode="aspectFit" class="remark-pic" v-for="item in imagesUrl"
							:key="item.smallUrl" @click="toPreviewImage(item.originUrl)">
						</image>
						<view class="tips">
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
				<view class="order-info">
					<view class="cu-bar bg-white justify-end">
						<view class="content">请选择预约时间</view>
						<view class="action" @tap="hideModal">
							<text class="cuIcon-close text-red"></text>
						</view>
					</view>
					<view class="date-area">
						<view class="date-item"
							:class="{'line-cyan':selectedVaccine.sa_no===radio.sa_no,disabled:disabledTime(radio)}"
							v-for="radio in timeArr" :key="radio.sa_no" @click="selectItem(radio)">
							{{formateDate(radio.app_date,'MM-DD')}}
							{{radio.app_time_start?radio.app_time_start.slice(0,5):''}}
							-
							{{radio.app_time_end?radio.app_time_end.slice(0,5):''}}
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
						<button class="cu-btn bg-grey" @click="toOrderList">我的预约</button>
						<button type="primary" class="cu-btn bg-blue center" @click="submitOrder">提交预约</button>
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
	import {
		getVaccineList
	} from '../getData.js'
	import dayjs from '@/static/js/dayjs.min.js'
	export default {
		name: "VaccineList", //疫苗预约列表
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			}),
			list() {
				if (this.vaccineList && Array.isArray(this.vaccineList) && this.vaccineList.length > 0) {
					return this.vaccineList.reduce((pre, item) => {
						if (pre.length === 0) {
							pre = [
								[item]
							]
						} else if (pre[pre.length - 1].length >= 5) {
							pre.push([item])
						} else {
							pre[pre.length - 1].push(item)
						}
						return pre
					}, [])
				} else {
					return []
				}
			}
		},
		data() {
			return {
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
				vaccineList: [],
				imagesUrl: [],
				vaccineInfo: {}, // 疫苗信息
				curVac: {
					data: []
				},
				tip: ''
			}
		},
		created() {
			if (!this.vaccineList || this.vaccineList.length === 0) {
				this.getVaccineList()
			}
		},
		methods: {
			subscription() {
				// return
				let tmplIds = 'fat3Nr50I5cAm0s5dBNfMSBDLJMumAUbVGHnE_am07Q'
				// 接种疫苗提醒
				wx.getSetting({
					withSubscriptions: true, //  这里设置为true,下面才会返回mainSwitch
					success: function(res) {
						// 调起授权界面弹窗
						if (res.subscriptionsSetting.mainSwitch) { // 用户打开了订阅消息总开关
							if (res.subscriptionsSetting.itemSettings !=
								null) { // 用户同意总是保持是否推送消息的选择, 这里表示以后不会再拉起推送消息的授权
								let moIdState = res.subscriptionsSetting.itemSettings[tmplIds]; // 用户同意的消息模板id
								if (moIdState === 'accept') {
									console.log('接受了消息推送');
								} else if (moIdState === 'reject') {
									console.log("拒绝消息推送");
								} else if (moIdState === 'ban') {
									console.log("已被后台封禁");
								} else if (moIdState === undefined) {
									wx.requestSubscribeMessage({ // 调起消息订阅界面
										tmplIds: [tmplIds],
										success(res) {
											console.log('订阅消息 成功 ');
											console.log(res);
										},
										fail(er) {
											console.log("订阅消息 失败 ");
											console.log(er);
										}
									})
								}
							} else {
								// 当用户没有点击’ 总是保持以上选择， 不再询问‘ 按钮。 那每次执到这都会拉起授权弹窗
								wx.showModal({
									title: '提示',
									content: '请授权开通服务通知',
									showCancel: true,
									success: function(ress) {
										if (ress.confirm) {
											wx.requestSubscribeMessage({ // 调起消息订阅界面
												tmplIds: [tmplIds],
												success(res) {
													console.log('订阅消息 成功 ');
													console.log(res);
												},
												fail(er) {
													console.log("订阅消息 失败 ");
													console.log(er);
												}
											})
										}
									}
								})
							}

						} else {
							console.log('订阅消息未开启')
						}
					},
					fail: function(error) {
						console.log(error);
					},
				})
			},
			toMore() {
				uni.navigateTo({
					url: '/storePages/VaccineList/VaccineList'
				})
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
			async showInfo(e) {
				this.vaccineInfo = e
				if (e.remark_pic) {
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
			async updateUserInfo() {
				let data = {}
				if (!this.formModel.customer_name || !this.formModel.customer_phone || !this.formModel
					.customer_birth_day || !this.formModel.id_no) {
					//  || !this.formModel.phone_xcx 暂不校验是否填写小程序手机号
					this.tip = '请确认所有实名信息已填写完整'
					return
				}
				this.tip = ''
				if (!this.userInfo.id_no || this.formModel.id_no) {
					data.id_no = this.formModel.id_no
				}
				if (!this.userInfo.phone || this.formModel.customer_phone) {
					data.phone = this.formModel.customer_phone
				}
				if (!this.userInfo.phone_xcx || this.formModel.phone_xcx) {
					data.phone_xcx = this.formModel.phone_xcx
				}
				if (!this.userInfo.birthday || this.formModel.customer_birth_day) {
					data.birthday = this.formModel.customer_birth_day
				}
				if (this.formModel.customer_name || this.formModel.customer_name) {
					data.name = this.formModel.customer_name
				}
				let req = [{
					"serviceName": "srvhealth_person_info_real_identity_update",
					"condition": [{
						"colName": "id",
						"ruleType": "eq",
						"value": this.userInfo.id
					}],
					"data": [data]
				}]
				let res = await this.$fetch('operate', 'srvhealth_person_info_real_identity_update', req, 'health')
				if (res.success) {
					if (Array.isArray(res.data) && res.data.length > 0) {
						this.$store.commit('SET_USERINFO', res.data[0])
					}
					this.selectTimeArr(this.vaccineInfo)
				}
			},
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
					await this.toAddPage()
					// let result = await wx.login()
					// if (result.code) {
					// 	await self.wxLogin({
					// 		code: result.code
					// 	})
					// }
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
			async getVaccineList() {
				// 查找可预约疫苗列表
				this.vaccineList = await getVaccineList()
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
				let res = await this.$fetch('select', 'srvhealth_store_vaccination_appointment_select', req, 'health')
				if (res.success) {
					this.timeArr = res.data
					this.formModel.customer_name = this.userInfo.name || ''
					this.formModel.customer_phone = this.userInfo.phone || ''
					this.formModel.customer_birth_day = this.userInfo.birthday || ''
					this.formModel.phone_xcx = this.userInfo.phone_xcx || ''
					this.modalName = 'vaccine'
				}

			},
			showModal(e) {
				this.vaccineInfo = e
				if (this.userInfo && (!this.userInfo.id_no || !this.userInfo.phone || !this.userInfo.phone_xcx)) {
					this.showRealNameModal()
				} else {
					this.selectTimeArr(e)
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
			getList() {
				let list = []
				for (let key in this.vaccineList) {
					let obj = this.vaccineList[key]
					obj.selected = ''
					obj.data = this.vaccineList[key].data.map(item => {
						item.checked = false
						return item
					})
					list.push(obj)
				}
				return list
			}
		}
	}
</script>

<style lang="scss" scoped>
	/deep/ swiper.rectangle-dot {
		height: 200px;
	}

	.vaccine-list {
		display: flex;
		flex-direction: column;
		margin-bottom: 20rpx;
		background-color: #fff;

	}

	.vaccine-title {
		display: flex;
		justify-content: space-between;
		font-weight: bold;
		font-size: 16px;
		padding: 20rpx 20rpx 0;

		.to-more {
			font-weight: normal;
			width: 100rpx;
			display: flex;
			justify-content: flex-end;
			align-items: center;
		}
	}

	.button-box {
		margin: 0;
		padding: 4rpx 0;
		justify-content: flex-end;
		flex: 1;

		.cu-tag,
		.cu-btn {
			min-width: 150rpx;
			font-size: 14px;
		}

		&.center {
			justify-content: center;
			margin-bottom: 20px;
		}

		.cu-btn {
			&+.cu-btn {
				margin-left: 20px;
			}
		}
	}

	.cu-modal {
		z-index: 100;

		.vaccine-info {
			padding: 20rpx;
			background-color: #fff;
			max-height: 80vh;
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
				
			}

			.vaccine-info {
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

	.vaccine-item {
		padding: 5rpx 20rpx;
		margin-bottom: 10rpx;
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		border-bottom: 1rpx solid #f1f1f1;

		&:first-child {
			border-top: 1rpx solid #f1f1f1;
			margin-top: 10px;
		}

		.title {
			display: inline-block;
			font-size: 16px;
			text-align: left;
		}

		.desc {
			flex: 1;
		}
	}


	.birthday {
		text-align: left !important;
	}

	.cu-form-group .title {
		min-width: calc(4em + 15px);
	}

	.cu-form-group uni-picker .picker {
		text-align: left;
		line-height: 40px;
	}

	.order-info {
		min-height: 50vh;
		max-height: calc(100vh - var(--window-top) - var(--window-bottom));
		overflow-y: scroll;
		background-color: #fff;
		padding: 20rpx;

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

		.date-item {
			display: flex;
			justify-content: center;
			padding: 5px 15px;
			border-radius: 5px;
			background-color: #f1f1f1;
			position: relative;
			margin-bottom: 10px;
			width: calc(50% - 5px);

			&:nth-child(2n) {
				margin-left: 10px;
			}

			&.disabled {
				// pointer-events: none;
				// cursor: default;
				opacity: 0.6;
			}
		}
	}

	.modal-title {
		font-weight: bold;
		padding: 20rpx;
		font-size: 16px;
	}

	.realname-form {
		text-align: left;

		.cu-form-group {
			.title {
				min-width: 150rpx;
			}
		}
	}
</style>
