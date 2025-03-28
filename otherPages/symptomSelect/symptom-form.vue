<template>
	<view class="symptom-form">
		<view class="main-title">
			<text> 选择症状 </text>
			<text class="text-bold">【{{ currentSymptom.name }}】</text>
		</view>
		<scroll-view scroll-y="true">
			<view class="form-content">
				<a-form ref="bxform" class="a-form" v-if="currentSymptom&&currentSymptom.daq_survey_activity_no"
					:fields="configCols" label-position="top" option-mode="normal" pageType="add"></a-form>
				<view class="symptom-date-selector" v-if="formType==='symptom_record'">
					<view class="item-list">
						<view class="item-list-top">
							<view class="label"><text>请选择症状发生时间:</text></view>
							<view class="value" v-if="occur_time">
								<picker mode="date" :value="occur_time.split(' ')[0]"
									@change="DateChange($event, 'occur_time')">
									<view class="picker">{{ occur_time.split(' ')[0] }}</view>
								</picker>
								<view class="margin-right"></view>
								<picker mode="time" :value="occur_time.split(' ')[1]"
									@change="TimeChange($event, 'occur_time')">
									<view class="picker">{{ occur_time.split(' ')[1] }}</view>
								</picker>
							</view>
						</view>
						<view class="item-list-center">
							<view class="number-change">
								<button class="operate cu-btn" @click="changeTime('occur_time', -60)">-1小时</button>
								<button class="operate cu-btn margin-right"
									@click="changeTime('occur_time', -10)">-10分钟</button>
								<button class="operate cu-btn" @click="changeTime('occur_time', 10)">+10分钟</button>
								<button class="operate cu-btn" @click="changeTime('occur_time', 60)">+1小时</button>
							</view>
						</view>
					</view>
				</view>
				<view class="remark" v-if="formType==='symptom_record'"><textarea v-model="symptoms_remark"
						placeholder="输入症状说明" /></view>
			</view>
		</scroll-view>

		<view class="button-box">
			<button class="cu-btn next-btn bg-gray shadow-blur round margin-top"
				@click="submitFormData('cancel')">取消</button>
			<button class="cu-btn next-btn bg-blue shadow-blur round margin-top" type="primary"
				@click="submitFormData">确定</button>
		</view>
	</view>
</template>

<script>
	import dayjs from '@/static/js/dayjs.min.js'
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				activity_no: '', // 问卷编号
				formData: {}, //问卷数据
				configCols: [], //问卷配置
				occur_time: '',
				symptoms_remark: ''
			}
		},
		props: {
			currentSymptom: {
				type: Object
			},
			formType: {
				type: String,
				default: ''
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		methods: {
			changeTime(type, value) {
				this.occur_time = dayjs(this.occur_time)
					.add(value, 'm')
					.format('YYYY-MM-DD HH:mm')
			},
			submitFormData(e) {
				if (e === 'cancel') {
					this.$emit('change', false)
				} else {
					this.$emit('change', {
						occur_time: this.occur_time,
						symptoms_remark: this.symptoms_remark
					})
					this.submitQuestionnaireData()
				}
			},
			async addSymptom() {
				let data = this.currentSymptom
				let self = this
				let req = [{
					serviceName: 'srvhealth_self_symptoms_record_add',
					condition: [],
					data: [{
						info_no: this.userInfo.no,
						user_account: this.userInfo.userno,
						occur_time: this.occur_time,
						symptoms_no: data.no,
						symptoms_name: data.name,
						symptoms_remark: this.symptoms_remark
					}]
				}]
				let res = await this.$fetch('operate', 'srvhealth_self_symptoms_record_add', req, 'health')
				if (res.success) {
					uni.showModal({
						title: '提示',
						content: '提交成功',
						showCancel: false,
						success(res) {
							if (res.confirm) {
								self.showSymptomDateSelector = false
								self.showSymptom = false
							}
						}
					})
				}
			},
			submitQuestionnaireData() {
				let self = this;
				let itemData = {};
				if (this.currentSymptom && this.currentSymptom.daq_survey_activity_no) {

				}
				if (itemData !== false) {
					let resultData = [];
					Object.keys(itemData).forEach(item => {
						let obj = {
							item_no: item,
							option_data: [itemData[item]]
						};
						if (Array.isArray(itemData[item])) {
							obj.option_data = itemData[item].filter(i => i && i);
						}
						if (itemData[item]) {
							resultData.push(obj);
						}
					});
					let serviceName = 'srvdaq_activity_result_submit';
					const url = self.getServiceUrl(self.appName ? self.appName : 'daq', serviceName, 'operate');
					let req = [{
						serviceName: serviceName,
						data: [{
							activity_no: self.activity_no,
							item_data: resultData
						}]
					}];
					if(!self.activity_no){
						return
					}
					console.log('resultData', resultData);
					self.$http.post(url, req).then(res => {
						if (res.data.state === 'SUCCESS') {
							if (res.data.resultCode === 'SUCCESS') {
								uni.showModal({
									title: '提示',
									content: '提交成功',
									showCancel: false
								})
							}
						} else {
							uni.showToast({
								title: res.data.resultMessage,
								icon: 'none'
							});
						}
					});
				}
			},
			initQuestionnaireData() {
				// 获取问卷数据
				let that = this;
				const serviceName = 'srvdaq_init_view_select';
				const url = this.getServiceUrl('daq', serviceName, 'select');
				const req = {
					serviceName: serviceName,
					colNames: ['*'],
					order: [{
						colName: 'item_seq',
						orderType: 'asc'
					}],
					condition: [{
							colName: 'activity_no',
							ruleType: 'eq',
							value: this.activity_no
						},
						{
							colName: 'biz_type',
							ruleType: 'eq',
							value: 'cfg'
						}
					]
				};
				this.$http.post(url, req).then(res => {
					if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
						const data = res.data.data[0];
						this.activity_no = data.activity_no;
						let configCols = [];
						data.item_data.forEach(item => {
							configCols.push(this.getConfig(item));
						});
						this.formData = data;
						configCols.forEach((item, index) => {
							item.iconSize = 28;
							item.itemIndex = index + 1;
							if (item.label && item.label.slice(0, 1) != (index + 1).toString() && item
								.label.slice(0, 2) != (index + 1).toString()) {
								item.label = (index + 1).toString() + '.' + item.label;
							}
							if (item.type === 'digit' && item.item_type_attr.decimal && item.value) {
								item.value = Number(item.value).toFixed(item.item_type_attr.decimal);
							} else if (item.type === 'digit' && !item.item_type_attr.decimal && item
								.value) {
								item.value = Number(item.value).toFixed(1);
							} else if (item.type === 'number' && item.value) {
								item.value = parseInt(item.value).toString() !== 'NaN' ? parseInt(item
									.value) : 0;
							}
						});
						this.configCols = configCols;
					} else if (res.data.resultCode === '0011') {
						uni.showToast({
							title: '未登录',
							icon: 'none'
						});
					} else if (res.data.resultCode === 'FAILURE') {
						uni.showToast({
							title: res.data.resultMessage,
							icon: 'none'
						});
						if (res.data.resultMessage === '活动已结束') {
							uni.showModal({
								title: '提示',
								content: res.data.resultMessage,
								showCancel: false,
								success(res) {
									if (res.confirm) {
										uni.navigateBack({
											animationDuration: 2000
										});
									}
								}
							});
						}
					}
				});
			},
			getConfig(e) {
				let config = {
					label: e.item_title,
					column: e.item_no,
					srvInfo: {
						serviceName: 'srvdaq_activity_result_submit',
						appNo: this.appName ? this.appName : 'daq'
					},
					value: e.value,
					type: e.item_type,
					isRequire: e.is_require === '是' ? true : false,
					isShowExp: [],
					options: [],
					item_type_attr: e.item_type_attr,
					display: true,
					points: e.points,
					answer: e.answer,
					option_img_explain: e.option_img_explain,
					_rawData: e,
					option_list_v2: e.option_list_v2
				};
				if (this.formType === 'detail') {
					config.disabled = true;
				}
				switch (e.item_type) {
					case '文本':
						config.type = e.item_type_attr['view_model'] === 'textarea' ? 'textarea' : 'text';
						break;
					case '图片':
						config.type = 'images';
						config['fileNum'] = e.item_type_attr['fileNum'];
						break;
					case '选项':
						config.type = e.item_type_attr.radioType && e.item_type_attr.radioType === 'multi' ? 'checkboxFk' :
							'radioFk';
						config.options = e.option_data.map((item, optIndex) => {
							item.color = '#0bc99d';
							item.value = item.option_value;
							item.showimg = false;
							item.label = item.option_value;
							if (item.option_view_no) {
								item.serialChar = item.option_view_no;
							} else if (item.option_seq) {
								item.serialChar = item.option_seq;
							} else {
								item.serialChar = optIndex;
							}
							return item;
						});
						break;
					case '时间日期':
						config.type = e.item_type_attr.dateType ? e.item_type_attr.dateType : 'date';
						break;
					case '数字':
						config.type = e.item_type_attr.numberType ? e.item_type_attr.numberType : 'number';
						break;
					case '地址':
						config.type = 'cascader';
						config.srvInfo = {
							serviceName: 'srvconfig_area_adj_select',
							appNo: 'config',
							isTree: true,
							column: 'no',
							showCol: 'path_name' //要展示的字段
						};
						break;
					case '引用':
						config.type = 'Selector';
						config.option_list_v2 = {
							refed_col: e.item_type_attr.refed_col,
							srv_app: e.item_type_attr.srv_app,
							serviceName: e.item_type_attr.serviceName,
							key_disp_col: e.item_type_attr.key_disp_col
						};
						break;
					default:
						config.type = e.item_type;
						break;
				}
				return config;
			},
		},
		watch: {
			currentSymptom: {
				deep: true,
				immediate: true,
				handler(newValue, oldValue) {
					if (this.currentSymptom && this.currentSymptom.daq_survey_activity_no) {
						// 有关联问卷
						this.activity_no = this.currentSymptom.daq_survey_activity_no
						this.initQuestionnaireData()
					}
				}
			}
		},
		created() {
			this.occur_time = dayjs().format('YYYY-MM-DD HH:mm')
		}
	}
</script>

<style lang="scss" scoped>
	.symptom-form {
		background-color: #fff;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;

		.main-title {
			width: 100%;
			padding: 20rpx;
			font-size: 16px;
			font-weight: bold;
			border-bottom: 1px solid #f1f1f1;
			text-align: center;
		}

		.form-content {
			max-height: calc(100vh - var(--window-top) - 200px);
		}

		::v-deep .form-item .form-item-content.label-top {
			padding: 0;
		}

		.remark {
			background-color: #f1f1f1;
			border-radius: 5px;
			text-align: left;
			padding: 20rpx 10rpx;
			text-indent: 20px;
			margin: 0 20rpx;

			uni-textarea {
				width: 100%;
				max-height: 200rpx;
			}
		}

		&.low-height {
			min-height: 360px;
		}

		.symptom-date-selector {
			display: flex;
			flex-direction: column;
			padding: 0 20rpx;
		}

		.next-btn {
			margin-top: 20px;
			width: 30%;
		}

		.item-list {
			display: flex;
			flex-direction: column;
			margin-top: 10px;

			text {
				color: #5e5e5e;
				margin-bottom: 10upx;
				font-weight: 700;
			}

			.number-change {
				display: flex;
				padding: 20rpx 0;
				justify-content: center;

				.operate {
					padding: 2px 10px;
					background-color: #dff5f5;
					color: #0bc99d;

					&+.operate {
						margin-left: 10rpx;
					}
				}

				.value {
					flex: 1;
					border: 1rpx solid #f1f1f1;
					margin: 0 20rpx;
					border-radius: 10rpx;
					overflow: hidden;
				}
			}

			.item-list-top {
				display: flex;
				align-items: center;
				flex-wrap: wrap;

				.label {
					margin-right: 20px;
					width: 100%;
					text-align: left;
					margin-bottom: 5px;
				}
			}

			.item-list-center {
				display: flex;
				flex-direction: column;
				justify-content: center;
			}

			.value {
				font-weight: bold;
				display: flex;
				color: #0bc99d;
				justify-content: center;
			}

			.item-list-bot {
				border: 1px solid #ccc;
				padding: 10rpx;
			}

			.weight-radio-group {
				display: flex;
				margin-bottom: 10rpx;

				.weight-radio-group-item {
					margin-right: 20rpx;
					display: flex;
					align-items: center;

					::v-deep .uni-radio-input {
						transform: scale(0.8);

						.uni-radio-input-checked {
							background-color: rgb(0, 122, 255) !important;
						}
					}

					.title {
						margin-right: 4rpx;
					}
				}
			}
		}

		.button-box {
			width: 100%;
			justify-content: center;

			.next-btn+.next-btn {
				margin-left: 20px;
			}
		}
	}
</style>
