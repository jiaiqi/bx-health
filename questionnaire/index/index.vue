<template>
	<view class="cu-card">
		<view class="page-wrap">
				<view class="content" style="padding:30upx 30upx 0;" v-if="formData.remark">
					<view class="desc" style="text-align: justify;">
						<view class="text-content-text text-black"><view v-html="JSON.parse(JSON.stringify(formData.remark).replace(/\<img/gi, '<img width=100%  '))"></view></view>
						<view class="date-box">
							<text v-if="formData.start_time">开始时间：{{ formData.start_time.slice(0, 10) }}</text>
							<text v-if="formData.end_time">结束时间：{{ formData.end_time.slice(0, 10) }}</text>
						</view>
					</view>
				</view>
				<view class="content form-wrap" style="box-sizing: border-box;">
					<bxform ref="bxform" :fields="configCols" :BxformType="'form'" pageType="add" @value-blur="saveValue"></bxform>
				</view>
				<view class="content" style="padding:30upx;" v-if="formData.end_remark">
					<view class="desc">
						<view class="text-content-text"><view v-html="JSON.parse(JSON.stringify(formData.end_remark).replace(/\<img/gi, '<img width=100%'))"></view></view>
					</view>
				</view>
				<view
					class="button-box"
					style="margin: 30upx;"
					v-if="formType === 'form' && configCols && configCols.length > 0 && (formData['user_state'] === '未完成' || formData['answer_times'] === '多次')"
				>
					<button class="button" type="" @click="submitForm()">提交</button>
				</view>
				<view
					class="button-box"
					style="margin: 30upx;"
					v-if="formType === 'detail' && configCols && configCols.length > 0 && formData.info_collect_type === '评估' && formData.user_state === '完成' && fill_batch_no"
				>
					<button class="button cu-btn" type="" @click="seeReport()">查看评估结果</button>
				</view>
				<view
					class="button-box"
					style="margin: 30upx;"
					v-if="formType === 'detail' && configCols && configCols.length > 0 && formData.info_collect_type === '自测' && formData.user_state === '完成' && fill_batch_no"
				>
					<button class="button cu-btn" type="" @click="seeScore" v-if="!scoreInfo.score && scoreInfo.score !== 0">查看分数</button>
					<view class="score-box" v-if="scoreInfo.score || scoreInfo.score === 0">
						得分：
						<view class="score">{{ scoreInfo.score === 0 ? '0' : scoreInfo.score }}</view>
					</view>
				</view>
				<view class="to-history" v-if="configCols && configCols.length > 0 && formType === 'form'" @click="toHistory">点击查看历史提交</view>
		</view>
		<u-empty :text="emptyText" v-if="!configCols || configCols.length === 0"></u-empty>
	</view>
</template>

<script>
import bxform from '../components/bx-form/bx-form.vue';

export default {
	name: 'questionnaire', //问卷答题页面
	components: {
		bxform
	},
	data() {
		return {
			appName: 'daq',
			emptyText: '', //无数据时提示文字
			formType: 'form', // 表单类型 预览:detail 正常:form
			activity_no: '', // 问卷编号
			status: '未开始',
			target: '',
			configCols: [],
			formData: {
				title: '', // 标题
				remark: '', //欢迎语
				end_remark: '' //结束语
			},
			userInfo: {}, // 登录用户信息
			wxUserInfo: {}, // 微信用户信息
			questionData: {},
			fill_batch_no: '', //活动批次编号
			scoreInfo: {} // 得分情况
		};
	},
	props:{
		activityNo: {
			type: String,
			default:''
		},
		comfromType:{
			type: String,
			default:''
		}
	},
	watch: {
		activityNo(newValue, oldValue) {
			if(this.activityNo){
				this.emptyText = '正在请求问卷配置数据';
				setTimeout(() => {
					this.emptyText = '未找到问卷配置数据';
				}, 3000);
				this.formType = this.comfromType;
				this.status = '进行中'
				this.activity_no = this.activityNo
				this.getQuestionnaireData();
			}
		}
	},
	methods: {
		toHistory() {
			uni.navigateTo({
				url: '/questionnaire/history/history?activity_no=' + this.activity_no + '&title=' + this.formData.title
			});
		},
		seeScore() {
			// 自测题 查看分数
			let fill_batch_no = this.fill_batch_no;
			let activity_no = this.activity_no;
			const serviceName = 'srvdaq_record_reply_select';
			const url = this.getServiceUrl(this.appName ? this.appName : 'daq', serviceName, 'select');
			const req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [
					{
						colName: 'activity_no',
						ruleType: 'eq',
						value: this.activity_no
					},
					{
						colName: 'fill_batch_no', // 批次号
						ruleType: 'eq',
						value: this.fill_batch_no
					}
				]
			};
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
					this.scoreInfo = res.data.data[0];
				}
			});
		},
		async seeReport() {
			// 查看评估结果
			uni.navigateTo({
				url: `/questionnaire/assessmentResult/assessmentResult?activity_no=${this.activity_no}&fill_batch_no=${this.fill_batch_no}`
			});
		},
		toFeedback() {
			// 跳转到意见反馈问卷
			uni.redirectTo({
				url: '/questionnaire/index/index?formType=form&activity_no=20200309125000000100&status=进行中'
			});
		},
		saveValue(e) {
			let self = this;
			if (e.value && this.status === '进行中') {
				let itemData = [
					{
						item_no: e.column,
						option_data: [e.value]
					}
				];
				if (e.type === 'checkbox') {
					itemData = [
						{
							item_no: e.column,
							option_data: e.value
						}
					];
				}
				if (Array.isArray(e.value)) {
					itemData = [
						{
							item_no: e.column,
							option_data: e.value.filter(i => i && i)
						}
					];
				}
				const serviceName = 'srvdaq_activity_result_save';
				const url = this.getServiceUrl('daq', serviceName, 'operate');
				let req = [
					{
						serviceName: serviceName,
						data: [
							{
								activity_no: this.activity_no,
								item_data: itemData
							}
						]
					}
				];
				if (self.fill_batch_no) {
					req[0].data[0].fill_batch_no = self.fill_batch_no;
				}
				self.$http.post(url, req).then(res => {
					if (res.data.state === 'SUCCESS') {
						console.log(res.data.response[0].response);
						let data = res.data.response[0].response;
						if (data.fill_batch_no && !self.fill_batch_no) {
							self.fill_batch_no = data.fill_batch_no;
							uni.setStorageSync('fill_batch_no', self.fill_batch_no);
						}
					} else {
						console.log(res);
					}
				});
			}
		},
		submitForm() {
			let self = this;
			let itemData = self.$refs.bxform.getFieldModel();
			if (itemData !== false) {
				uni.showModal({
					title: '提示',
					content: '确认提交问卷?',
					success: function(res) {
						if (res.confirm) {
							if (self.status !== '进行中') {
								uni.showToast({
									title: '状态非进行中的问卷不支持提交',
									icon: 'none'
								});
							} else {
								console.log('itemData', itemData);
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
								let req = [
									{
										serviceName: serviceName,
										data: [
											{
												fill_batch_no: self.fill_batch_no,
												activity_no: self.activity_no,
												item_data: resultData
											}
										]
									}
								];
								console.log('resultData', resultData);
								self.$http.post(url, req).then(res => {
									if (res.data.state === 'SUCCESS') {
										if (res.data.resultCode === 'SUCCESS') {
											uni.showToast({
												title: '提交成功',
												icon: 'none'
											});
											self.formType = 'detail';
											self.getQuestionnaireData(self.formData);
											if (self.target && self.target === 'health') {
												let data = {
													from: '饮食',
													data: req[0].data[0],
													result: {
														origin: self.$route.query.origin,
														scope: 10,
														remark: '饮食习惯良好'
													}
												};
												uni.redirectTo({
													url: '/pages/specific/health/home/home?result=' + JSON.stringify(data)
												});
											}
										}
									} else {
										// if (res.data.resultCode === 'FAILURE') {
										uni.showToast({
											title: res.data.resultMessage,
											icon: 'none'
										});
									}
									console.log(res);
									// }
								});
							}
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			}
		},
		getQuestionnaireData(questionData) {
			// 获取问卷数据
			let that = this;
			const serviceName = 'srvdaq_init_view_select';
			const url = this.getServiceUrl(this.appName ? this.appName : 'daq', serviceName, 'select');
			const req = {
				serviceName: serviceName,
				colNames: ['*'],
				order: [{ colName: 'item_seq', orderType: 'asc' }],
				condition: [
					{
						colName: 'activity_no',
						ruleType: 'eq',
						value: this.activity_no
					},
					{
						colName: 'type', // 查看视图初始化
						ruleType: 'eq',
						value: 'use'
					}
				]
			};
			if (this.status === '未开始') {
				req.condition = [
					{
						colName: 'activity_no',
						ruleType: 'eq',
						value: this.activity_no
					},
					{
						colName: 'biz_type',
						ruleType: 'eq',
						value: 'cfg'
					}
				];
			}
			console.log(this.questionData);
			if (questionData && questionData.fill_batch_no) {
				req.condition = [
					{
						colName: 'activity_no',
						ruleType: 'eq',
						value: questionData.activity_no
					},
					{
						colName: 'type',
						ruleType: 'eq',
						value: 'use'
					},
					{
						colName: 'fill_batch_no',
						ruleType: 'eq',
						value: questionData.fill_batch_no
					}
				];
			}
			if (this.activity_no && this.fill_batch_no) {
				req.condition = [
					{
						colName: 'activity_no',
						ruleType: 'eq',
						value: this.activity_no
					},
					{
						colName: 'type',
						ruleType: 'eq',
						value: 'use'
					},
					{
						colName: 'fill_batch_no',
						ruleType: 'eq',
						value: this.fill_batch_no
					}
				];
			}
			if (this)
				this.$http
					.post(url, req)
					.then(res => {
						if (res.data.state === 'SUCCESS') {
							const data = res.data.data[0];
							this.activity_no = data.activity_no;
							let configCols = [];
							data.item_data.forEach(item => {
								configCols.push(this.getConfig(item));
							});
							if (data.logo) {
								this.getPicture(data.logo).then(url => {
									this.$set(this.formData, 'fileUrl', url);
								});
							}
							if (data.user_data) {
								console.log('data.answer_times', data.answer_times);
								configCols.forEach(item => {
									if (this.formType === 'detail') {
										item.disabled = true;
									}

									data.user_data.forEach(items => {
										if (item.column === items.item_no) {
											if (item.item_type_attr && item.item_type_attr.radioType === 'multi') {
												item.value = items.option_data;
												console.log('items.option_data', items.option_data);
											} else {
												console.log('item_type', item);
												item.value = items.option_data[0];
											}
										}
									});
								});
							}
							this.formData = data;
							if (data.title) {
								uni.setNavigationBarTitle({
									title: data.title
								});
							}
							if (data.user_state === '完成' && data.answer_times !== '多次') {
								this.formType = 'detail';
							}
							this.configCols = configCols;
							// alert("即将获取用户信息")
							this.getUserInfo();
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
								this.updateState().then(response => {
									uni.showModal({
										title: '提示',
										content: res.data.resultMessage + ',即将跳转到列表页面',
										showCancel: false,
										success(res) {
											if (res.confirm) {
												uni.navigateBack({
													animationDuration: 2000
												});
											}
										}
									});
								});
							}
						}
					})
					.catch(err => {
						console.log('err', err);
					});
		},
		async updateState(e) {
			let reqData = [
				{
					status: '已结束'
				}
			];
			let url = this.getServiceUrl(this.appName ? this.appName : 'daq', 'srvdaq_activity_cfg_update', 'operate');
			let req = [
				{
					serviceName: 'srvdaq_activity_cfg_update',
					data: reqData,
					condition: [
						{
							colName: 'activity_no',
							ruleType: 'eq',
							value: this.activity_no
						}
					]
				}
			];
			let response = await this.$http.post(url, req);
			if (response.data.resultCode === 'SUCCESS') {
				// this.getList(this.currentTab)
			}
			return response;
			console.log(response);
		},
		async getUserInfo() {
			// 获取微信账号信息
			let url = this.$api.getUserInfo;
			let req = {
				serviceName: 'srvwx_basic_user_info_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'app_no',
						ruleType: 'eq',
						value: this.$api.appNo.wxh5
					}
				]
			};
			let res = await this.$http.post(url, req);
			// alert("wxUserInfo:"+JSON.stringify(res))
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				const userInfo = res.data.data[0];
				this.wxUserInfo = userInfo;
				uni.setStorageSync('wxUserInfo', userInfo);
				// alert(JSON.stringify(userInfo));
			} else {
				uni.showToast({
					title: '未获取到当前微信用户信息',
					icon: 'none'
				});
			}
		},
		async getPicture(file_no) {
			const serviceName = 'srvfile_attachment_select';
			const url = this.getServiceUrl('file', serviceName, 'select');
			const req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [{ colName: 'file_no', value: file_no, ruleType: 'eq' }]
			};
			if (file_no !== null && file_no !== '' && file_no !== undefined) {
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					const data = res.data.data[0];
					if (data) {
						const fileurl = this.$api.srvHost + '/file/download?filePath=' + data.fileurl;
						return fileurl;
					}
				}
			}
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
					config.type = e.item_type_attr['view_model'] === 'textarea' ? 'textarea' : 'input';
					break;
				case '图片':
					config.type = 'images';
					config['fileNum'] = e.item_type_attr['fileNum'];
					break;
				case '选项':
					config.type = e.item_type_attr.radioType && e.item_type_attr.radioType === 'multi' ? 'checkboxFk' : 'radioFk';
					config.options = e.option_data.map(item => {
						item.value = item.option_value;
						item.showimg = false;
						item.label = item.option_view_no ? item.option_view_no + '. ' + item.option_value : item.option_value;
						return item;
						// return item.option_value;
					});
					break;
				case '时间日期':
					config.type = e.item_type_attr.dateType ? e.item_type_attr.dateType : 'dateTime';
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
					config.type = 'treeSelector';
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
		saveShareRecord(share_type) {
			let url = this.$api.saveShareRecord;
			let req = [
				{
					serviceName: 'srvdaq_record_share_add',
					data: [
						{
							biz_no: this.activity_no,
							biz_type: this.appName ? this.appName : 'daq',
							share_url: window.location.href,
							from_user: this.userInfo.user_no,
							share_type: share_type ? share_type : '朋友圈'
						}
					]
				}
			];
			this.$http.post(url, req).then(res => {
				console.log(res);
			});
		},
		getParams(name) {
			let str = window.location.href;
			str = str.split('?')[1];
			let arr = str.split('&');
			let obj = {};
			arr.forEach(item => {
				obj[item.split('=')[0]] = item.split('=')[1];
			});
			if (obj[name]) {
				return obj[name];
			} else {
				return false;
			}
		}
	},
	beforeDestroy() {
		uni.setStorageSync('fill_batch_no', '');
	},
	mounted() {
		if(this.activityNo){
			this.emptyText = '正在请求问卷配置数据';
			setTimeout(() => {
				this.emptyText = '未找到问卷配置数据';
			}, 3000);
			this.formType = this.comfromType;
			this.status = '进行中'
			this.activity_no = this.activityNo
			this.getQuestionnaireData();
		}
	},
	onLoad(option) {
		
		this.emptyText = '正在请求问卷配置数据';
		setTimeout(() => {
			this.emptyText = '未找到问卷配置数据';
		}, 3000);
		if (option.formType && option.formType === 'detail') {
			this.formType = option.formType;
		} else {
			this.formType = 'form';
		}
		if (option.from) {
			this.target = option.from;
		}
		if (option.fill_batch_no) {
			this.fill_batch_no = option.fill_batch_no;
		}
		let questionData = option.questionData;
		if (questionData) {
			questionData = JSON.parse(decodeURIComponent(option.questionData));
		}
		if (questionData && questionData.fill_batch_no) {
			this.formType = 'detail';
			this.questionData = questionData;
			this.getQuestionnaireData(this.questionData);
		} else {
			if (option.status) {
				this.status = decodeURIComponent(option.status);
				console.log('status', this.status);
			}
			if (option.activity_no) {
				this.activity_no = option.activity_no
				this.getQuestionnaireData();
			} else if (this.questionData.activity_no) {
				this.status = '已完成';
				this.activity_no = this.questionData.activity_no;
				this.getQuestionnaireData();
			} else {
				uni.showModal({
					title: '提示',
					content: '未知的问卷编号，即将返回上个页面',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							uni.navigateBack({});
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.cu-card {
	background-color: #fff;
	color: #fff;
	height: 100vh;
	.page-wrap{
		height: 100%;
		overflow-y: scroll;
	}
}
.content {
	width: 100%;
	&.form-wrap {
		// height: calc(100vh - 600rpx);
		// overflow-y: scroll;
	}
	.desc {
		width: 100%;
	}
	.date-box {
		color: #0bc99d;
		padding: 20rpx 0;
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
}
.to-history {
	text-align: center;
	color: #0bc99d;
	position: relative;
	margin: 20rpx 0 50rpx;
	&::before {
		content: '';
		position: absolute;
		width: 25%;
		height: 1px;
		background-color: #0bc99d;
		top: 50%;
		left: 50rpx;
	}
	&::after {
		content: '';
		position: absolute;
		width: 25%;
		height: 1px;
		background-color: #0bc99d;
		top: 50%;
		right: 50rpx;
	}
}
.button-box {
	display: flex;
	justify-content: center;
	.button {
		color: #fff;
		background-color: #0bc99d;
		height: 60rpx;
		line-height: 60rpx;
		min-width: 45%;
	}
}
.question-title {
	min-height: 100rpx;
	color: #333;
	font-weight: 700;
	font-size: 18px;
	display: flex;
	justify-content: center;
	align-items: center;
}
.footer-button {
	background-color: #fff;
	width: 100%;
	display: flex;
	justify-content: space-around;
	align-items: center;
	padding: 20rpx 0 40rpx;
	.foot-btn {
		color: #0bc99d;
		height: 40upx;
		line-height: 40upx;
		border-bottom: 1px solid #0bc99d;
	}
}

.text-content-text {
	color: #666;
	width: 100%;
	min-height: 100rpx;
	height: auto;
	margin: 0;
	display: flex;
	flex-direction: column;
	color: #666;
	padding: 20rpx;
	border-left: 4px solid #cbcbcb;
	background-color: #f8f8f8;
	font-size: 30rpx;
	color: #666;
}
.cu-modal.bottom-modal {
	color: #333;
	.cu-dialog {
		height: auto;
	}
}
.score-box {
	height: 100rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #333;
	.score {
		padding: 0 20rpx;
		font-size: 60rpx;
		font-weight: 700;
	}
}
.u-empty{
	height: 100%;
}
</style>
