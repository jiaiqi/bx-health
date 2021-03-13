<template>
	<view class="vaccine-list">
		<view class="vaccine-title">
			<text class="cuIcon-titles text-blue"></text>
			<text> 疫苗预约</text>
		</view>
		<swiper class="swiper rectangle-dot" indicator-active-color="#00aaff" indicator-color="#ccc"
			:indicator-dots="true" :autoplay="false">
			<swiper-item v-for="(item,index) in list" :key="index" class="swiper-item">
				<view class="vaccine-item">
					<view class="title">
						{{item.label}}
					</view>
					<view class="desc">
						{{item.desc}}
					</view>
					<view class="button-box">
						<button type="primary" class="cu-btn bg-cyan" @click="showModal(item)">预约</button>
					</view>
				</view>
			</swiper-item>
		</swiper>
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
						<view class="date-item" :class="{'line-cyan':selectedVaccine.sa_no===radio.sa_no}"
							v-for="radio in curVac.data" :key="radio.sa_no" @click="selectItem(radio)">
							{{formateDate(radio.app_date,'MM-DD')}}
							{{formateDate(radio.app_date+' '+ radio.app_time_start,'hh:mm')}} -
							{{formateDate(radio.app_date+' '+ radio.app_time_end,'hh:mm')}}
							<text v-if="radio.app_count" class="cu-tag badge">{{radio.app_count}}</text>
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
							<textarea v-model="formModel.appoint_remark" placeholder="预约说明" class="value textarea"/>
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
	export default {
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		data() {
			return {
				modalName: '',
				selectedVaccine: {},
				list: [],
				activeField: '',
				formModel: {
					customer_name: "",
					customer_birth_day: "",
					customer_phone: '',
					appoint_remark: ''
				},
				curVac: {
					data: []
				}
			}
		},
		props: {
			vaccineList: {
				type: [Object, Array]
			},
		},
		mounted() {
			this.list = this.getList()
		},
		methods: {
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
			showModal(e) {
				this.curVac = e
				this.modalName = 'vaccine'
			},
			hideModal() {
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

<style lang="scss">
	.vaccine-list {
		display: flex;
		flex-direction: column;
		margin-bottom: 20rpx;
		background-color: #fff;
	}

	.vaccine-title {
		padding: 20rpx 20rpx 0;
	}

	.button-box {
		margin: 0;
		margin-top: 20rpx;
		justify-content: flex-end;

		&.center {
			justify-content: center;
			margin-bottom: 20px;

		}

		.cu-btn {
			width: 30%;

			&+.cu-btn {
				margin-left: 20px;
			}
		}
	}

	.swiper-item {
		display: flex;
		flex-direction: column;
	}

	.vaccine-item {
		background-color: #fff;
		min-height: 100rpx;
		padding: 20rpx;
		flex: 1;
		display: flex;
		flex-direction: column;

		.title {
			font-size: 16px;
			font-weight: bold;
			text-align: center;
			margin-bottom: 10px;
		}

		.desc {
			flex: 1;
		}
	}

	.cu-modal {
		z-index: 100;
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

		.cu-form-group .title {
			min-width: calc(4em + 15px);
		}

		.cu-form-group uni-picker .picker {
			text-align: left;
			line-height: 40px;
		}

		.from-box {
			display: flex;
			flex-direction: column;
			text-align: left;

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

					&.textarea {
						width: 100%;
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
			display: inline-block;
			padding: 5px 15px;
			border-radius: 5px;
			background-color: #f1f1f1;
			position: relative;
			margin-bottom: 10px;
			width: calc(50% - 5px);

			&:nth-child(2n) {
				margin-left: 10px;
			}
		}
	}
</style>
