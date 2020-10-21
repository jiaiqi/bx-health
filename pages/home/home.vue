<template>
	<view class="health-wrap" @click="clickPage" v-if="isLogin">
		<u-navbar back-text="返回" :back-text-style="backTextStyle" :back-icon-color="backTextStyle.color" :is-back="false" :border-bottom="true" :background="navBackground">
			<view class="header-wrap">
				<view class="title">{{ pageTitle }}</view>
				<view class="user-info" @click.stop="showUserList = !showUserList">
					<u-avatar :src="profile_url" mode="circle" :size="60"></u-avatar>
					<view class="user-name" data-event="showUserList">
						<text class="text" data-event="showUserList">{{ userInfo.name }}</text>
						<u-icon name="arrow-down-fill" size="28" :class="{ active: showUserList }"></u-icon>
					</view>
					<view class="user-list" :class="{ active: showUserList }">
						<view class="menu-item" :class="{ 'current-user': userInfo.name === item.name }" @click.stop="clickUserMenu(item)" v-for="(item, index) in userMenuList" :key="index">
							{{ item.name }}
						</view>
						<view class="menu-item" @click.stop="clickUserMenu('regulate')">人员管理</view>
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="main-box" @click="toToday">
			<view class="main-box-title">今日概览</view>
			<view class="energy-item ">
				<view class="text">饮食摄入</view>
				<view class="number">{{ parseFloat(dietIn).toFixed(1) }}</view>
			</view>
			<view class="operate">-</view>
			<view class="energy-item">
				<view class="text">运动消耗</view>
				<view class="number">{{ parseFloat(sportOut).toFixed(1) }}</view>
			</view>
			<view class="operate">-</view>
			<view class="energy-item">
				<view class="text">基础代谢</view>
				<view class="number">{{ basicOut ? parseFloat(basicOut).toFixed(1) : '0' }}</view>
			</view>
			<view class="operate">=</view>
			<view class="energy-item">
				<view class="text">体重变化</view>
				<view class="number text-red" style="display: flex; width: 90px; justify-content: space-between;">
					<text style="flex:1;">{{ parseFloat(energyChange) > 0 ? `+${parseFloat(energyChange).toFixed(1)}` : parseFloat(energyChange).toFixed(1) }}</text>
					<text class="units">大卡</text>
				</view>
				<view class="number text-red" style="display: flex; width: 90px; justify-content: space-between;">
					<text style="flex:1;">
						{{ energyChange === 0 ? '0.0' : parseFloat(energyChange / 7.7) > 0 ? `+${parseFloat(energyChange / 7.7).toFixed(1)}` : parseFloat(energyChange / 7.7).toFixed(1) }}
					</text>
					<text class="units">g脂肪</text>
				</view>
			</view>
		</view>
		<view class="main-box column">
			<view class="main-box-title">近期趋势</view>
			<view class="menu-box">
				<view class="box-item" :class="{ active: currentChart === 'canvasLineA' }" @click="showCanvas('weight')">体重</view>
				<view class="box-item" :class="{ active: currentChart === 'canvasLineB' }" @click="showCanvas('BP')">血压</view>
				<view class="box-item" :class="{ active: currentChart === 'canvasLineC' }" @click="showCanvas('sleep')">睡眠</view>
				<view class="box-item" :class="{ active: currentChart === 'canvasColumnD' }" @click="showCanvas('calories')">热量</view>
			</view>
			<view class="chart-box" :class="{ 'max-height': currentChart }">
				<canvas v-show="currentChart === 'canvasLineA'" canvas-id="canvasLineA" id="canvasLineA" class="charts-line" @touchstart="touchLineA"></canvas>
				<canvas v-show="currentChart === 'canvasLineB'" canvas-id="canvasLineB" id="canvasLineB" class="charts-line" @touchstart="touchLineB"></canvas>
				<canvas v-show="currentChart === 'canvasLineC'" canvas-id="canvasLineC" id="canvasLineC" class="charts-line" @touchstart="touchLineC"></canvas>
				<canvas v-show="currentChart === 'canvasColumnD'" canvas-id="canvasColumnD" id="canvasColumnD" class="charts-line" @touchstart="touchColumnD"></canvas>
			</view>
		</view>
		<view class="main-box">
			<view class="main-box-title">基本信息</view>
			<view class="menu-box">
				<view class="box-item" @click="skip('basic')">基本数据</view>
				<view class="box-item">疾病史</view>
				<view class="box-item">遗传史</view>
			</view>
		</view>
		<view class="main-box"><view class="main-box-title">饮食营养</view></view>
		<view class="main-box"><view class="main-box-title">运动健康</view></view>
		<view class="main-box"><view class="main-box-title">慢性疾病</view></view>
	</view>
</template>
<script>
var self;
import uCharts from '@/components/u-charts/u-charts.js';
var _self;
var canvaLineA = null;
var canvaLineB = null;
var canvaLineC = null;
var canvaColumnD = null;
var dayjs = require('dayjs');
export default {
	data() {
		return {
			currentChart: '', //当前chart id
			isLogin: false, // 是否已经登录
			loginUserInfo: {},
			serviceLog: {}, // 服务记录
			pageTitle: '健康档案',
			showUserList: false,
			backTextStyle: {
				color: '#fff'
			},
			dietIn: 0, //饮食摄入
			sportOut: 0, //运动消耗
			modalName: '',
			showTimeSignPicker: false,
			userInfo: {},
			selectDate: this.formateDate(new Date(), 'date'),
			userMenuList: [],
			navBackground: {
				backgroundColor: '#0bc99d'
			},
			cWidth: '',
			cHeight: '',
			pixelRatio: 1,
			weightChartData: {
				categories: ['10-13', '10-14', '10-15', '10-16', '10-17', '10-18'],
				series: [
					{
						name: '体重',
						data: [73, 75, 73.5, 74.5, 75, 73.5],
						color: '#1890ff'
					}
					// {
					// 	name: '基础代谢',
					// 	data: [73, 75, 73.5, 74.5, 75, 73.5],
					// 	color: '#ff9900'
					// }
				]
			},
			BPChartData: {
				categories: ['10-13', '10-14', '10-15', '10-16', '10-17', '10-18'],
				series: [
					{
						name: '收缩压',
						data: [117, 115, 121, 105, 110, 115],
						color: '#2fc25b'
					},
					{
						name: '舒张压',
						data: [71, 75, 73, 77, 79, 75],
						color: '#facc14'
					}
				]
			},
			caloriesChartData: {
				categories: ['10-13', '10-14', '10-15', '10-16', '10-17', '10-18'],
				series: [
					{
						name: '饮食',
						data: [1314, 1124, 1300, 1215, 1001, 1416],
						color: '#ff9900'
					},
					{
						name: '运动',
						data: [234, 315, 517, 145, 357, 241],
						color: '#8dc63f'
					}
				]
			},
			sleepChartData: {
				categories: ['10-13', '10-14', '10-15', '10-16', '10-17', '10-18'],
				series: [
					{
						name: '睡眠',
						data: [7.5, 8, 7.5, 7, 6, 8.5],
						color: '#8543e0'
					}
				]
			},
			chartData: {
				categories: ['10-13', '10-14', '10-15', '10-16', '10-17', '10-18'],
				series: [
					{
						name: '体重',
						data: [35, 20, 25, 37, 4, 20],
						color: '#000000'
					},
					{
						name: '血压',
						data: [70, 40, 65, 100, 44, 68]
					},
					{
						name: '热量',
						data: [100, 80, 95, 150, 112, 132]
					}
				]
			}
		};
	},
	computed: {
		profile_url() {
			if (this.userInfo.profile_url) {
				return this.$api.downloadFile + this.userInfo.profile_url + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
			} else if (this.loginUserInfo.headimgurl) {
				return this.loginUserInfo.headimgurl;
			}
		},
		energyChange() {
			return Number(this.dietIn) - Number(this.sportOut) - Number(this.basicOut);
		},
		age() {
			if (this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
				return age;
			}
		},
		basicOut() {
			//基础代谢
			// IF(B4="男",IF(B3>=60,B2*13.4+490,IF(B3>=31,B2*11.5+830,B2*15.2+680)),IF(B3>=60,B2*10.4+600,IF(B3>=31,B2*8.6+830,B2*14.6+450)))
			if (this.userInfo.sex === '男') {
				if (this.age >= 60) {
					return this.userInfo.weight * 13.4 + 490;
				} else if (this.age >= 31 && this.age < 60) {
					return this.userInfo.weight * 11.5 + 830;
				} else {
					return this.userInfo.weight * 15.2 + 600; //<31
				}
			} else {
				if (this.age >= 60) {
					return this.userInfo.weight * 10.4 + 600;
				} else if (this.age >= 31 && this.age <= 60) {
					return this.userInfo.weight * 8.6 + 830;
				} else {
					return this.userInfo.weight * 14 + 450; //<31
				}
			}
		}
	},
	methods: {
		skip(item) {
			// 跳转页面
			debugger
			let url = '';
			switch (item) {
				case 'basic':
					url = '/otherPages/personal/personal';
					break;
				default:
					break;
			}
			if (url) {
				uni.navigateTo({
					url: url
				});
			}
		},
		showCanvas(type) {
			// 显示图表
			this.cWidth = uni.upx2px(690);
			this.cHeight = uni.upx2px(300);
			switch (type) {
				case 'weight':
					if (this.currentChart === 'canvasLineA') {
						this.currentChart = '';
					} else {
						this.currentChart = 'canvasLineA';
						this.getChartData('weight').then(_ => {
							this.showLineA('canvasLineA', this.weightChartData, 'kg');
						}); // 体重
					}
					break;
				case 'BP':
					if (this.currentChart === 'canvasLineB') {
						this.currentChart = '';
					} else {
						this.currentChart = 'canvasLineB';
						this.getChartData('bloodPressure').then(_ => {
							this.showLineB('canvasLineB', this.BPChartData, 'mmHg');
						}); // 血压
					}
					break;
				case 'sleep':
					if (this.currentChart === 'canvasLineC') {
						this.currentChart = '';
					} else {
						this.currentChart = 'canvasLineC';
						this.showLineC('canvasLineC', this.sleepChartData, '小时');
					}
					break;
				case 'calories':
					if (this.currentChart === 'canvasColumnD') {
						this.currentChart = '';
					} else {
						this.currentChart = 'canvasColumnD';
						this.getDietSportRecordList().then(_ => {
							this.showColumnD('canvasColumnD', this.caloriesChartData, '大卡');
						});
					}
					break;
			}
		},
		async selectServiceLog() {
			// 查找服务记录编号
			let serviceName = 'srvhealth_service_record_select';
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: 'srvhealth_service_record_select',
				colNames: ['*'],
				condition: [{ colName: 'user_info_no', ruleType: 'like', value: this.userInfo.no }],
				page: { pageNo: 1, rownumber: 100 }
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				// 请求成功
				if (Array.isArray(res.data.data) && res.data.data.length > 0) {
					// 有记录
					this.serviceLog = res.data.data[0];
				} else {
					// 没有记录，添加记录
					await this.addServiceLog();
				}
			}
		},
		async addServiceLog() {
			// 创建服务记录
			let serviceName = 'srvhealth_service_record_add';
			let url = this.getServiceUrl('health', serviceName, 'operate');
			let req = [
				{
					serviceName: 'srvhealth_service_record_add',
					condition: [],
					data: [{ user_info_no: this.currentUserInfo.no, user_no: this.currentUserInfo.userno, name: this.currentUserInfo.name, time: this.formateDate(new Date(), 'dateTimes') }]
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				await this.selectServiceLog();
			}
		},
		async getChartData(type) {
			//
			let serviceObj = {
				weight: 'srvhealth_body_fat_measurement_record_select', // 体重体脂
				// bloodGlucose: '', // 血糖
				bloodPressure: 'srvhealth_blood_pressure_record_select' // 血压
			};
			let serviceName = serviceObj[type];
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [{ colName: 'service_no', ruleType: 'like', value: this.serviceLog.no }],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc' // asc升序  desc降序
					}
				],
				page: {
					rownumber: 7
				}
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				let series = [];
				if (type === 'weight') {
					series = this.weightChartData.series;
					series[0].data = res.data.data.map(item => {
						return item.weight;
					});
					this.weightChartData.series = series;
					this.weightChartData.categories = res.data.data.map(item => dayjs(item.create_time).format('MM-DD'));
					this.showLineA('canvasLineA', this.weightChartData, 'kg');
				} else if (type === 'bloodPressure') {
					series = this.BPChartData.series;
					series[0].data = res.data.data.map(item => {
						return item.systolic_pressure;
					});
					series[1].data = res.data.data.map(item => item.diastolic_pressure);
					this.BPChartData.series = series;
					this.BPChartData.categories = res.data.data.map(item => dayjs(item.create_time).format('MM-DD'));
					this.showLineB('canvasLineB', this.BPChartData, 'mmHg');
				}
			}
		},
		async getDietSportRecordList() {
			// 查找最近七天的饮食记录和运动记录，展示为柱状图
			let serveList = [
				'srvhealth_diet_record_select', //饮食
				'srvhealth_body_activity_record_select' //运动
			];
			let resultData = {};
			let timeRange = {
				start: '',
				end: ''
			};
			timeRange.end = dayjs()
				.add(1, 'days')
				.format('YYYY-MM-DD');
			timeRange.start = dayjs()
				.subtract(6, 'days')
				.format('YYYY-MM-DD');
			console.log('timeRange', timeRange);
			for (let i in serveList) {
				let serviceName = serveList[i];
				let url = this.getServiceUrl('health', serviceName, 'select');
				let req = {
					serviceName: serviceName,
					colNames: ['*'],
					condition: [
						{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no },
						{ colName: 'user_name', ruleType: 'like', value: this.userInfo.name },
						{ colName: 'hdate', ruleType: 'gt', value: timeRange.start },
						{ colName: 'hdate', ruleType: 'lt', value: timeRange.end }
					]
				};
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data)) {
					resultData[serviceName] = res.data.data;
				}
			}
			resultData = {
				diet: resultData.srvhealth_diet_record_select,
				sport: resultData.srvhealth_body_activity_record_select
			};
			let dateList = [];
			let series = [
				{
					name: '饮食',
					data: [0, 0, 0, 0, 0, 0, 0],
					color: '#ff9900'
				},
				{
					name: '运动',
					data: [0, 0, 0, 0, 0, 0, 0],
					color: '#8dc63f'
				}
			];
			Object.keys(resultData).forEach(key => {
				const data = resultData[key];
				data.forEach(item => {
					for (let i = 0; i < 7; i++) {
						let day = dayjs()
							.subtract(i, 'days')
							.format('YYYY-MM-DD');
						dateList[i] = day;
						if (item.hdate === day) {
							if (key === 'diet') {
								series[0].data[i] += item.energy;
							} else if (key === 'sport') {
								series[1].data[i] += item.energy;
							}
						}
					}
				});
			});
			this.caloriesChartData.categories = dateList
				.map(item => {
					return item.slice(5);
				})
				.reverse();
			console.log(series);
			series = series.map(item => {
				item.data = item.data.reverse();
				return item;
			});
			this.caloriesChartData.series = series;
			// this.showColumnD('canvasColumnD', this.caloriesChartData, '大卡');
		},
		toToday() {
			uni.navigateTo({
				url: '/otherPages/balancedDiet/balancedDiet'
			});
		},
		/*查询当前登录人创建得用户信息**/
		async getCurrUserInfo() {
			self = this;
			const url = self.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let user = uni.getStorageSync('login_user_info').user_no;
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'userno', ruleType: 'eq', value: user }],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			const res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				// 有数据
				uni.setStorageSync('current_user', res.data.data[0].name);
				uni.setStorageSync('user_info_list', res.data.data);
				this.userMenuList = res.data.data;
			} else {
				// 没有角色 提示跳转到创建角色页面
				uni.showModal({
					title: '提示',
					content: '当前账号未登记个人信息，即将跳转到信息登记页面',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							let condition = [{ colName: 'userno', ruleType: 'eq', value: user }];
							uni.navigateTo({
								url: '/publicPages/form/form?serviceName=srvhealth_person_info_add&type=add&cond=' + decodeURIComponent(JSON.stringify(condition))
							});
						}
					}
				});
			}
		},
		async getDietAllRecord() {
			//饮食记录
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: this.userInfo.name },
					{ colName: 'hdate', ruleType: 'like', value: this.selectDate.trim() }
				]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				let dietIn = 0;
				res.data.data.forEach(item => {
					dietIn += item.energy;
				});
				this.dietIn = dietIn;
				this.getSportsAllRecord(res.data.data);
			}
		},
		async getSportsAllRecord(data) {
			// 运动记录
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_body_activity_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.loginUserInfo.user_no },
					{ colName: 'user_name', ruleType: 'like', value: this.userInfo.name },
					{ colName: 'hdate', ruleType: 'like', value: this.selectDate.trim() }
				],
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				let sportOut = 0;
				res.data.data.forEach(item => {
					sportOut = item.energy + sportOut;
				});
				this.sportOut = sportOut;
			}
		},
		getSignature(formData) {
			let self = this;
			let linkurl = window.location.href.split('#')[0];
			let req = {
				serviceName: 'srvwx_app_signature_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'app_no',
						ruleType: 'eq',
						value: this.$api.appNo.wxh5
					},
					{
						colName: 'page_url',
						ruleType: 'eq',
						value: linkurl
					}
				]
			};
			console.log('linkurl', linkurl);
			uni.setStorageSync('linkUrl', null);
			self.$http.post(self.$api.getSignature, req).then(res => {
				if (res.data.state === 'SUCCESS') {
					let resData = res.data.data[0];
					uni.setStorageSync('signatureInfo', resData);
					self.$wx.config({
						debug: false, // 调试阶段建议开启
						appId: resData.appId, // APPID
						timestamp: resData.timestamp, // 时间戳timestamp
						nonceStr: resData.noncestr, // 随机数nonceStr
						signature: resData.signature, // 签名signature
						// 需要调用的方法接口
						jsApiList: [
							'updateAppMessageShareData',
							'updateTimelineShareData',
							'onMenuShareTimeline',
							'onMenuShareAppMessage',
							'onMenuShareWeibo',
							'onMenuShareQQ',
							'onMenuShareQZone'
						]
					});
					self.$wx.ready(() => {
						console.log('wx.ready()', self.wxUserInfo);
						self.$wx.updateAppMessageShareData({
							//自定义“分享给朋友”及“分享到QQ”按钮的分享内容
							imgUrl: self.wxUserInfo.headimgurl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
							desc: '百想健康', // 摘要,如果分享到朋友圈的话，不显示摘要。
							title: '百想健康', // 分享卡片标题
							// link:  window.location.href, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							success: function() {
								// 分享成功后的回调函数
							},
							cancel: function() {
								// 用户取消分享后执行的回调函数
								// //// alert('分享失败')
							}
						}); // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
						self.$wx.updateTimelineShareData({
							imgUrl: self.formData.fileUrl, // 分享图，默认当相对路径处理，所以使用绝对路径的的话，“http://”协议前缀必须在。
							desc: '百想健康', // 摘要,如果分享到朋友圈的话，不显示摘要。
							title: '百想健康', // 分享卡片标题
							link: linkurl, // 分享出去后的链接，这里可以将链接设置为另一个页面。
							success: function() {
								// 分享成功后的回调函数
							},
							cancel: function() {
								// 用户取消分享后执行的回调函数
								// //// alert('分享失败')
							}
						});
					});
					self.$wx.error(function(res) {
						uni.showModal({
							title: '提示',
							content: JSON.stringify(res),
							success() {}
						});
					});
				} else {
					uni.showToast({
						title: '获取签名失败',
						icon: 'none'
					});
				}
			});
		},
		clickPage(e) {
			if (this.showUserList) {
				this.showUserList = false;
			}
		},
		async getUserInfo() {
			let url = this.$api.getUserInfo;
			let req = {
				serviceName: 'srvwx_basic_user_info_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'app_no',
						ruleType: 'eq',
						value: this.$api.appNo.wxmp
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				const userInfo = res.data.data[0];
				this.wxUserInfo = userInfo;
				uni.setStorageSync('wxUserInfo', userInfo);
				if (userInfo.headimgurl) {
					this.src = userInfo.headimgurl;
				}
				// #ifdef H5
				// this.getSignature();
				// #endif
			} else {
				// 没有用户信息
			}
		},
		clickUserMenu(e) {
			console.log(e);
			if (e === 'regulate') {
				let viewTemp = {
					title: 'name',
					tip: 'sex',
					img: 'pic',
					footer: 'job'
				};
				let cond = [
					{
						colName: 'userno',
						ruleType: 'eq',
						value: 'user_no'
					}
				];
				uni.navigateTo({
					url:
						'/publicPages/list/list?serviceName=srvhealth_person_info_select&navigationBarTitle=我的车辆&pageType=list&type=skip&viewTemp=' +
						decodeURIComponent(JSON.stringify(viewTemp)) +
						'&cond=' +
						decodeURIComponent(JSON.stringify(cond))
				});
			} else if (e === 'health') {
				uni.navigateTo({
					url: '/pages/balancedDiet/balancedDiet'
				});
			} else {
				uni.setStorageSync('current_user', e.name);
				uni.setStorageSync('current_user_info', e);
				this.userInfo = e;
			}
			this.showUserList = false;
		},
		showLineA(canvasId, chartData, unit) {
			let options = this.getChartOptions(canvasId, chartData, unit);
			canvaLineA = new uCharts(options);
		},
		showLineB(canvasId, chartData, unit) {
			let options = this.getChartOptions(canvasId, chartData, unit);
			canvaLineB = new uCharts(options);
		},
		showLineC(canvasId, chartData, unit) {
			let options = this.getChartOptions(canvasId, chartData, unit);
			canvaLineC = new uCharts(options);
		},
		showColumnD(canvasId, chartData, unit) {
			let options = this.getChartOptions(canvasId, chartData, unit, 'column');
			canvaColumnD = new uCharts(options);
		},
		getChartOptions(canvasId, chartData, unit, type) {
			return {
				$this: _self,
				colors: ['#1890ff', '#2fc25b', '#facc14', '#f04864', '#8543e0', '#90ed7d'],
				canvasId: canvasId,
				type: type ? type : 'line',
				fontSize: 11,
				// legend: { show: true },
				dataLabel: false,
				dataPointShape: true,
				background: '#FFFFFF',
				pixelRatio: _self.pixelRatio,
				categories: chartData.categories,
				series: chartData.series,
				animation: true,
				xAxis: {
					type: 'grid',
					gridColor: '#CCCCCC',
					gridType: 'dash'
					// dashLength: 8
				},
				yAxis: {
					gridType: 'dash',
					gridColor: '#CCCCCC',
					// dashLength: 8,
					// splitNumber: 5,
					// min: 10,
					// max: 180,
					format: val => {
						// y轴显示
						return val.toFixed(0) + unit;
					}
				},
				width: _self.cWidth * _self.pixelRatio,
				height: _self.cHeight * _self.pixelRatio,
				extra: {
					column: {
						type: 'stack',
						width: 20
					},
					line: {
						type: 'straight'
					}
				}
			};
		},
		touchLineA(e) {
			canvaLineA.showToolTip(e, {
				format: function(item, category) {
					return category + ' ' + item.name + ':' + item.data + 'kg';
				}
			});
			canvaLineA.touchLegend(e);
		},
		touchLineB(e) {
			canvaLineB.showToolTip(e, {
				format: function(item, category) {
					return category + ' ' + item.name + ':' + item.data + 'mmHg';
				}
			});
			canvaLineB.touchLegend(e);
		},
		touchLineC(e) {
			canvaLineC.showToolTip(e, {
				format: function(item, category) {
					return category + ' ' + item.name + ':' + item.data + '小时';
				}
			});
			canvaLineC.touchLegend(e);
		},
		touchColumnD(e) {
			canvaColumnD.showToolTip(e, {
				format: function(item, category) {
					return category + ' ' + item.name + ':' + item.data + '大卡';
				}
			});
			canvaColumnD.touchLegend(e);
		}
	},
	created() {
		let userInfo = uni.getStorageSync('login_user_info');
		if (!userInfo) {
			// 未登录， 提示跳转
			this.isLogin = false;
			uni.showModal({
				title: '提示',
				content: '未登录,是否跳转到登录页面?',
				confirmText: '去登录',
				confirmColor: '#02D199',
				success(res) {
					if (res.confirm) {
						// 确认 跳转到登录页
						uni.redirectTo({
							url: '/publicPages/accountExec/accountExec'
						});
					} else if (res.cancel) {
						// 取消 返回首页
						uni.switchTab({
							url: '/pages/pedia/pedia'
						});
					}
				}
			});
		} else {
			this.isLogin = true;
		}
		uni.$on('dietInChange', dietIn => {
			this.dietIn = dietIn;
		});
		uni.$on('sportOutChange', sportOut => {
			this.sportOut = sportOut;
		});
	},
	onLoad() {
		_self = this;
		if (!this.isLogin) {
			console.log('onLoad-未登录');
			return;
		}
	},
	async onShow() {
		if (!this.isLogin) {
			console.log('onShow-未登录');
			return;
		}
		self = this;
		uni.setStorageSync('activeApp', 'health');
		let userInfo = uni.getStorageSync('login_user_info');
		if (userInfo && userInfo.user_no) {
			await this.getUserInfo();
			await this.getCurrUserInfo();
			await this.getDietAllRecord();
			// this.getUserInfo().then(_ => {
			// this.getCurrUserInfo().then(_ => {
			// this.getDietSportRecordList();
			if (uni.getStorageSync('current_user_info')) {
				this.userInfo = uni.getStorageSync('current_user_info');
			} else {
				let userList = uni.getStorageSync('user_info_list');
				if (Array.isArray(userList) && userList.length > 0) {
					this.userInfo = userList[0];
					uni.setStorageSync('current_user_info', userList[0]);
				}
			}
			this.selectServiceLog();
			this.loginUserInfo = userInfo;
		}
	}
};
</script>

<style lang="scss" scoped>
.health-wrap {
	background-color: #fff;
	width: 100vw;
	height: 100vh;
	overflow-y: scroll;
	text-align: center;
	position: relative;
	/deep/ .u-navbar {
		border-bottom: 1px solid #f1f1f1;
	}
}

.header-wrap {
	// 顶部导航栏
	color: #f1f1f1;
	display: flex;
	align-items: center;
	justify-content: space-between;
	flex: 1;
	padding: 10rpx 30rpx;
	position: relative;
	background-color: #0bc99d;
	/* #ifdef MP-WEIXIN */
	width: 100vw;
	justify-content: center;
	/* #endif */
	.title {
		// 顶部标题
		font-weight: 700;
		/* #ifdef MP-WEIXIN */
		position: absolute;
		left: 10rpx;
		/* #endif */
	}
	.user-info {
		display: flex;
		align-items: center;
		position: relative;
		.user-name {
			min-width: 100rpx;
			display: flex;
			.text {
				padding: 0 10rpx 0 20rpx;
			}
			.u-icon {
				transition: all 0.5s;
				&.active {
					transform: rotate(90deg);
				}
			}
		}
		.user-list {
			position: absolute;
			box-sizing: border-box;
			width: 200rpx;
			height: 0;
			border-radius: 10rpx;
			right: 0;
			opacify: 0;
			transition: all 0.5s;
			overflow: hidden;
			background-color: #fff;
			&.active {
				border: 1px solid #ddd;
				opacify: 1;
				height: auto;
				top: 70rpx;
				z-index: 999;
			}
			.menu-item {
				color: #333;
				min-height: 80rpx;
				font-weight: bold;
				border-bottom: 1px solid #fef0f0;
				font-size: 16px;
				display: flex;
				align-items: center;
				padding-left: 30rpx;
				&.current-user {
					color: #0586ff;
				}
			}
			.user {
				width: 100%;
				height: 50rpx;
				padding: 5rpx;
				text-align: center;
				display: flex;
				align-items: center;
				justify-content: center;
				border-bottom: 1rpx solid #fff;
			}
		}
	}
}
.main-box {
	display: flex;
	box-sizing: border-box;
	width: calc(100% - 20rpx);
	flex-wrap: wrap;
	background-color: #fff;
	justify-content: space-between;
	margin: 10rpx;
	padding: 10rpx;
	border-radius: 2px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	min-height: 150rpx;
	.main-box-title {
		width: 100%;
		font-weight: bold;
		letter-spacing: 5px;
		margin: 0 auto 20rpx;
		position: relative;
		max-height: 40rpx;
		&::after {
			position: absolute;
			content: '';
			width: 100%;
			height: 2rpx;
			border-bottom: 1px dotted #f1f1f1;
			bottom: -10rpx;
			left: 0;
			// left: calc(50% - 50rpx);
		}
	}
	&.column {
		flex-direction: column;
		flex-wrap: nowrap;
		.chart-box {
			border-radius: 2px;
			background-color: #fff;
			margin: 10rpx;
			height: 0;
			transition: all 1s;
			&.max-height {
				height: 280rpx;
			}
			.charts-line {
				width: 690rpx;
				height: 300rpx;
			}
		}
	}
	.menu-box {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		.box-item {
			width: calc(50% - 10rpx);
			margin: 5rpx;
			height: 80rpx;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			letter-spacing: 10rpx;
			font-size: 32rpx;
			border-radius: 5rpx;
			opacity: 0.6;
			transition: opacity 1s;
			&.active {
				opacity: 1;
			}
			&:nth-child(1) {
				background-color: #3498db;
			}
			&:nth-child(2) {
				background-color: #e74c3c;
			}
			&:nth-child(3) {
				background-color: #8e44ad;
			}
			&:nth-child(4) {
				background-color: #e67e22;
			}
		}
	}
	.energy-item {
		color: #333;
		font-weight: bold;
		min-height: 100upx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		.text {
			font-size: 20upx;
		}
		.number {
			font-size: 30upx;
			text-align: center;
		}
		.text-red {
			color: #red;
			text-align: right;
		}
		.units {
			min-width: 65rpx;
			padding-left: 10upx;
			font-size: 20upx;
			color: #000;
		}
	}
	.operate {
		font-size: 60upx;
		font-weight: 600;
		width: 60upx;
		text-align: center;
	}
}
.popup-box {
	display: flex;
	justify-content: center;
	padding: 50rpx 0 20rpx;
	flex-wrap: wrap;
	.icon-item {
		// width: 33%;
		min-width: 22%;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		height: 210rpx;
		align-items: center;
		.icon {
			width: 130rpx;
			height: 130rpx;
			border-radius: 100%;
			background-color: rgba($color: orange, $alpha: 0.1);
			padding: 30rpx;
		}
		.label {
			padding: 10rpx 0;
		}
	}
}
.close-icon {
	width: 100%;
	padding-bottom: 20rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	.cuIcon-close {
		padding: 20rpx;
		border-radius: 50%;
		background-color: #f1f1f1;
		font-size: 40rpx;
	}
}
</style>
