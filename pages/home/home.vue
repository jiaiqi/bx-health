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
							<text class="cuIcon-favorfill margin-right-xs" v-if="item.is_main === '是'"></text>
							{{ item.name }}
						</view>
						<view class="menu-item" @click.stop="clickUserMenu('regulate')">人员管理</view>
					</view>
				</view>
			</view>
		</u-navbar>
		<view class="main-box" @click="toToday">
			<view class="main-box-title">今日概览</view>
			<view class="energy-box">
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
		</view>
		<view class="main-box column">
			<view class="main-box-title">近期趋势</view>
			<view class="chart-box" :class="{ 'max-height': currentChart }">
				<canvas
					v-if="currentChart === 'stepChart'"
					canvas-id="stepChart"
					id="stepChart"
					class="charts-line"
					disable-scroll="true"
					@touchmove="moveLine"
					@touchend="touchEndLine"
					@touchstart="touchLine"
				></canvas>
				<canvas v-if="currentChart === 'canvasLineA'" canvas-id="canvasLineA" id="canvasLineA" class="charts-line" @touchstart="touchLineA"></canvas>
				<canvas v-if="currentChart === 'canvasLineB'" canvas-id="canvasLineB" id="canvasLineB" class="charts-line" @touchstart="touchLineB"></canvas>
				<canvas v-if="currentChart === 'canvasLineC'" canvas-id="canvasLineC" id="canvasLineC" class="charts-line" @touchstart="touchLineC"></canvas>
				<canvas v-if="currentChart === 'canvasColumnD'" canvas-id="canvasColumnD" id="canvasColumnD" class="charts-line" @touchstart="touchColumnD"></canvas>
			</view>
			<view class="button-box">
				<button class="button" :class="{ active: currentChart === item.chartID }" size="mini" v-for="item in subList" :key="item.key" @click="showCanvas(item.key)">
					{{ item.name }}
				</button>
				<!-- <view class="box-item" :class="{ active: currentChart === 'canvasLineA' }" @click="showCanvas('weight')">步数</view>
				<view class="box-item" :class="{ active: currentChart === 'canvasLineA' }" @click="showCanvas('weight')">体重</view>
				<view class="box-item" :class="{ active: currentChart === 'canvasLineB' }" @click="showCanvas('BP')">血压</view>
				<view class="box-item" :class="{ active: currentChart === 'canvasLineC' }" @click="showCanvas('sleep')">睡眠</view>
				<view class="box-item" :class="{ active: currentChart === 'canvasColumnD' }" @click="showCanvas('calories')">热量</view> -->
			</view>
		</view>
		<view class="main-box">
			<view class="main-box-title">基本信息</view>
			<view class="menu-box">
				<view class="box-item filled" @click="skip('basic')">
					<view class="label">基本数据</view>
					<view class="status">
						点击查看
						<u-icon name="eye-fill"></u-icon>
					</view>
				</view>
				<view class="box-item" @click="topages">
					<view class="label">疾病史</view>

					<view class="status">
						未填写
						<u-icon name="edit-pen-fill"></u-icon>
					</view>
				</view>
				<view class="box-item">
					<view class="label">遗传史</view>
					<view class="status">
						未填写
						<u-icon name="edit-pen-fill"></u-icon>
					</view>
				</view>
				<view class="box-item">
					<view class="label">饮食营养</view>
					<view class="status">
						未填写
						<u-icon name="edit-pen-fill"></u-icon>
					</view>
				</view>
				<view class="box-item">
					<view class="label">运动</view>
					<view class="status">
						未填写
						<u-icon name="edit-pen-fill"></u-icon>
					</view>
				</view>
				<view class="box-item">
					<view class="label">睡眠</view>
					<view class="status">
						未填写
						<u-icon name="edit-pen-fill"></u-icon>
					</view>
				</view>
				<view class="box-item">
					<view class="label">心理</view>
					<view class="status">
						未填写
						<u-icon name="edit-pen-fill"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="main-box">
			<view class="main-box-title">慢性疾病</view>

			<view class="menu-box">
				<view class="box-item menu" :class="[bmiStatus.key]">
					<view class="status" :class="[bmiStatus.key]">
						<text class="label">BMI:</text>
						{{ BMI }}
					</view>
					<view class="status" :class="[bmiStatus.key]">
						<text class="icon"></text>
						[{{ bmiStatus.label }}]
					</view>
				</view>
				<view class="box-item menu">高血压</view>
				<view class="box-item menu">糖尿病</view>
				<view class="box-item menu">失眠</view>
				<view class="box-item menu">颈椎病</view>
			</view>
		</view>
	</view>
</template>
<script>
var self;
import uCharts from '@/components/u-charts/u-charts.js';
var _self;
var canvasLineA = null;
var canvasLineB = null;
var canvasLineC = null;
var canvasColumnD = null;
var stepChart = null;
var dayjs = require('dayjs');
export default {
	data() {
		return {
			subList: [
				{ name: '步数', key: 'step', chartID: 'stepChart' },
				{ name: '体重', key: 'weight', chartID: 'canvasLineA' },
				{ name: '血压', key: 'BP', chartID: 'canvasLineB' },
				{ name: '热量', key: 'calories', chartID: 'canvasColumnD' },
				{ name: '睡眠', key: 'sleep', chartID: 'canvasLineC' }
			],
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
			},
			wxRunData: {},
			stepInfoList: [],
			stepData: []
		};
	},
	computed: {
		profile_url() {
			if (this.userInfo.is_main === '是' && this.loginUserInfo.headimgurl) {
				return this.loginUserInfo.headimgurl;
			} else {
				if (this.userInfo.profile_url) {
					return this.$api.downloadFile + this.userInfo.profile_url + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
				}
			}
		},
		energyChange() {
			return Number(this.dietIn) - Number(this.sportOut) - Number(this.basicOut);
		},
		// BMI=体重（千克）除以身高（米）的平方。
		BMI() {
			if (this.userInfo.weight && this.userInfo.height) {
				return (Number(this.userInfo.weight) / Math.pow(Number(this.userInfo.height) / 100, 2)).toFixed(2);
			}
		},
		bmiStatus() {
			if (this.BMI) {
				if (this.BMI < 18.5) {
					return {
						label: '偏瘦',
						key: 'thin'
					};
				} else if (18.5 <= this.BMI && this.BMI < 24) {
					return {
						label: '正常',
						key: 'normal'
					};
				} else if (24 <= this.BMI && this.BMI < 28) {
					return {
						label: '超重',
						key: 'overweight'
					};
				} else if (28 <= this.BMI) {
					return {
						label: '肥胖',
						key: 'fat'
					};
				}
			}
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
		topages() {
			let url = 'https://wx2.100xsys.cn/pages/specific/questionnaire/questionnaire?formType=form&activity_no=20200307210717000096&status=进行中';
			uni.navigateTo({
				url: '/publicPages/webviewPage/webviewPage?webUrl=' + url
			});
		},
		skip(item) {
			// 跳转页面
			let url = '';
			switch (item) {
				case 'basic':
					// url = '/otherPages/personal/personal';
					let row = this.userInfo;
					let params = {
						type: 'detail',
						condition: [
							{
								colName: 'id',
								ruleType: 'in',
								value: row.id
							}
						],
						serviceName: 'srvhealth_person_info_select',
						defaultVal: row
					};
					uni.navigateTo({
						url: '/publicPages/form/form?params=' + JSON.stringify(params)
					});
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
			this.cWidth = uni.upx2px(710);
			this.cHeight = uni.upx2px(350);
			switch (type) {
				case 'step':
					if (this.currentChart === 'stepChart') {
						// this.currentChart = '';
					} else {
						this.currentChart = 'stepChart';
						this.getwxStepInfoList();
					}
					break;
				case 'weight':
					if (this.currentChart === 'canvasLineA') {
						// this.currentChart = '';
					} else {
						this.currentChart = 'canvasLineA';
						this.getChartData('weight').then(_ => {
							this.showLineA('canvasLineA', this.weightChartData, 'kg');
						}); // 体重
					}
					break;
				case 'BP':
					if (this.currentChart === 'canvasLineB') {
						// this.currentChart = '';
					} else {
						this.currentChart = 'canvasLineB';
						this.getChartData('bloodPressure').then(_ => {
							this.showLineB('canvasLineB', this.BPChartData, 'mmHg');
						}); // 血压
					}
					break;
				case 'sleep':
					if (this.currentChart === 'canvasLineC') {
						// this.currentChart = '';
					} else {
						this.currentChart = 'canvasLineC';
						this.showLineC('canvasLineC', this.sleepChartData, '小时');
					}
					break;
				case 'calories':
					if (this.currentChart === 'canvasColumnD') {
						// this.currentChart = '';
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
					data: [{ user_info_no: this.userInfo.no, user_no: this.userInfo.userno, name: this.userInfo.name, time: this.formateDate(new Date(), 'dateTimes') }]
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
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'userno', ruleType: 'eq', value: uni.getStorageSync('login_user_info').user_no }],
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
				if (uni.getStorageSync('current_user')) {
					res.data.data.forEach(item => {
						if (item.name === uni.getStorageSync('current_user')) {
							uni.setStorageSync('current_user', item.name);
						}
					});
				} else {
					uni.setStorageSync('current_user_info', res.data.data[0]);
				}
				uni.setStorageSync('user_info_list', res.data.data);
				self.userMenuList = res.data.data;
				return res.data.data;
			} else if (res.data.resultCode === '0011') {
				// 登录失效 进行静默登录
				this.isLogin = false;
				const result = await wx.login();
				if (result.code) {
					this.code = result.code;
					await this.wxLogin({ code: result.code });
					await this.initPage();
				}
			} else if (Array.isArray(res.data.data) && res.data.data.length === 0) {
				// 没有角色 提示跳转到创建角色页面
				uni.showModal({
					title: '提示',
					content: '当前账号未登记个人信息，即将跳转到信息登记页面',
					showCancel: false,
					success(res) {
						if (res.confirm) {
							let condition = [{ colName: 'userno', ruleType: 'eq', value: uni.getStorageSync('login_user_info').user_no }];
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
			console.log(this.loginUserInfo);
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
			let linkurl = '';
			// #ifdef H5
			window.location.href.split('#')[0];
			// #endif
			let req = {
				serviceName: 'srvwx_app_signature_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'app_no',
						ruleType: 'eq',
						value: this.$api.appNo.wxmp
						// value: this.$api.appNo.wxh5
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
					// #ifdef H5
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
					// #endif
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
						'/publicPages/list/list?serviceName=srvhealth_person_info_select&pageType=list&type=skip&viewTemp=' +
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
				this.getDietAllRecord().then(_ => {
					this.showCanvas('weight');
				});
			}
			this.showUserList = false;
		},
		showLineA(canvasId, chartData, unit) {
			let options = this.getChartOptions(canvasId, chartData, unit);
			canvasLineA = new uCharts(options);
		},
		showLineB(canvasId, chartData, unit) {
			let options = this.getChartOptions(canvasId, chartData, unit);
			canvasLineB = new uCharts(options);
		},
		showLineC(canvasId, chartData, unit) {
			let options = this.getChartOptions(canvasId, chartData, unit);
			canvasLineC = new uCharts(options);
		},
		showColumnD(canvasId, chartData, unit) {
			let options = this.getChartOptions(canvasId, chartData, unit, 'column');
			canvasColumnD = new uCharts(options);
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
						type: 'curve'
					}
				}
			};
		},
		touchEndLine(e) {
			stepChart.showToolTip(e, {
				format: function(item, category) {
					return category + ' 步数' + ': ' + item.data + '步';
				}
			});
			// stepChart.scrollEnd(e);
		},
		touchLine(e) {
			stepChart.scrollStart(e);
		},
		moveLine(e) {
			stepChart.scroll(e);
		},
		touchLineA(e) {
			canvasLineA.showToolTip(e, {
				format: function(item, category) {
					return category + ' ' + item.name + ':' + item.data + 'kg';
				}
			});
			canvasLineA.touchLegend(e);
		},
		touchLineB(e) {
			canvasLineB.showToolTip(e, {
				format: function(item, category) {
					return category + ' ' + item.name + ':' + item.data + 'mmHg';
				}
			});
			canvasLineB.touchLegend(e);
		},
		touchLineC(e) {
			canvasLineC.showToolTip(e, {
				format: function(item, category) {
					return category + ' ' + item.name + ':' + item.data + '小时';
				}
			});
			canvasLineC.touchLegend(e);
		},
		touchColumnD(e) {
			canvasColumnD.showToolTip(e, {
				format: function(item, category) {
					return category + ' ' + item.name + ':' + item.data + '大卡';
				}
			});
			canvasColumnD.touchLegend(e);
		},
		getDayStepInfo(date) {
			let stepInfoList = this.stepInfoList;
			if (Array.isArray(stepInfoList) && stepInfoList.length > 0) {
				let stepData = {};
				stepInfoList.forEach(item => {
					if (date && date.indexOf(item.date) !== -1) {
						stepData = item;
					}
				});
				return stepData;
			}
		},
		async getwxStepInfoList() {
			// 获取微信运动记录
			// #ifdef MP-WEIXIN
			let result = await wx.getWeRunData();
			if (result.errMsg === 'getWeRunData:ok') {
				this.wxRunData = result;
				this.decryptData(result);
			}
			// #endif
		},
		async decryptData(result) {
			// 解密微信加密数据
			if (result.encryptedData && result.iv) {
				let url = this.getServiceUrl('wx', 'srvwx_app_data_decrypt', 'operate');
				let req = [
					{
						data: [
							{
								encryptedData: result.encryptedData,
								signature: result.iv
							}
						],
						serviceName: 'srvwx_app_data_decrypt'
					}
				];
				let res = await this.$http.post(url, req);
				if (res.data.state == 'SUCCESS' && Array.isArray(res.data.response) && res.data.response.length > 0) {
					let stepList = res.data.response[0].response.stepInfoList;
					if (Array.isArray(stepList)) {
						stepList = stepList.map(item => {
							item.date = this.formateDate(item.timestamp * 1000);
							return item;
						});
						console.log('stepList', this.deepClone(stepList));
						this.stepInfoList = stepList;
						// let stepData = this.getDayStepInfo(this.date);
						// this.stepData = stepData;
						let chartData = { categories: [], series: [{}] };
						chartData.categories = stepList.map(item => item.date.slice(5));
						chartData.series[0] = {
							name: '近31日运动步数',
							data: []
						};
						chartData.series[0].data = stepList.map(item => item.step);
						if (_self.userInfo.is_main === '是') {
							_self.showChart('stepChart', chartData);
						} else {
							uni.showToast({
								title: '无权查看',
								icon: 'none'
							});
							self.showCanvas('weight');
						}
						return stepList;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} else {
				return false;
			}
		},
		showChart(canvasId, chartData) {
			this.cWidth = uni.upx2px(710);
			this.cHeight = uni.upx2px(350);
			stepChart = new uCharts({
				$this: _self,
				canvasId: canvasId,
				type: 'line',
				fontSize: 11,
				legend: { show: true },
				dataLabel: true,
				dataPointShape: true,
				background: '#FFFFFF',
				pixelRatio: 1,
				categories: chartData.categories,
				series: chartData.series,
				animation: false,
				enableScroll: true, //开启图表拖拽功能
				xAxis: {
					type: 'grid',
					disableGrid: false,
					gridColor: '#CCCCCC',
					gridType: 'dash',
					dashLength: 8,
					itemCount: 8, //x轴单屏显示数据的数量，默认为5个
					scrollShow: true, //新增是否显示滚动条，默认false
					scrollAlign: 'right' //滚动条初始位置
				},
				yAxis: {
					disableGrid: false,
					gridType: 'dash',
					gridColor: '#CCCCCC',
					dashLength: 8,
					splitNumber: 5,
					min: 10,
					max: 180,
					format: val => {
						return val.toFixed(0) + '步';
					}
				},
				width: this.cWidth,
				height: this.cHeight,
				extra: {
					line: {
						type: 'curve' //曲线
					}
				}
			});
		},
		async initPage() {
			let userInfo = uni.getStorageSync('login_user_info');
			// #ifdef MP-WEIXIN

			let res = await wx.getSetting();
			if (!res.authSetting['scope.userInfo']) {
				// 没有获取用户信息授权
				uni.showModal({
					title: '提示',
					content: '请登录并授权获取用户信息后再进行查看',
					confirmText: '去登录',
					confirmColor: '#02D199',
					success(res) {
						if (res.confirm) {
							// 确认 跳转到登录页
							uni.navigateTo({
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
				return;
			}
			// #endif
			if (!userInfo) {
				// 未登录
				const result = await wx.login();
				if (result.code) {
					this.code = result.code;
					await this.wxLogin({ code: result.code });
					await this.initPage();
				}
			} else {
				this.isLogin = true;
			}
			self = this;
			uni.setStorageSync('activeApp', 'health');
			if (userInfo && userInfo.user_no) {
				this.loginUserInfo = userInfo;
				if (uni.getStorageSync('current_user_info')) {
					this.userInfo = uni.getStorageSync('current_user_info');
				} else {
					let userList = uni.getStorageSync('user_info_list');
					if (Array.isArray(userList) && userList.length > 0) {
						let name = uni.getStorageSync('current_user');
						if (name) {
							userList.forEach(item => {
								if (item.name === name) {
									uni.setStorageSync('current_user', item.name);
									uni.setStorageSync('current_user_info', item);
									this.userInfo = item;
								}
							});
						} else {
							uni.setStorageSync('current_user_info', userList[0]);
							uni.setStorageSync('current_user', userList[0].name);
							this.userInfo = userList[0];
						}
					}
				}
				await this.getUserInfo(); //查找微信用户基本信息
				await this.getCurrUserInfo(); // 查找健康app个人基本信息
				await this.getDietAllRecord(); //查找饮食和运动记录
				this.selectServiceLog();
				this.loginUserInfo = userInfo;
				// #ifdef MP-WEIXIN
				this.getwxStepInfoList().then(_ => {
					this.currentChart = 'stepChart';
				}); //获取微信运动记录
				// #endif
				// #ifdef H5
				this.showCanvas('weight');
				// #endif
			}
		}
	},
	created() {
		uni.$on('loginStatusChange', result => {
			this.isLogin = result;
		});
		uni.$on('dietInChange', dietIn => {
			this.dietIn = dietIn;
		});
		uni.$on('sportOutChange', sportOut => {
			this.sportOut = sportOut;
		});
	},
	onLoad() {
		_self = this;
		// #ifdef MP-WEIXIN
		wx.showShareMenu({
			withShareTicket: true,
			menus: ['shareAppMessage', 'shareTimeline']
		});
		// #endif
	},
	async onShow() {
		await this.initPage();
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
			margin: 0 auto;
			height: 0;
			transition: all 0.5s;
			&.max-height {
				height: 330rpx;
			}
			.charts-line {
				width: 690rpx;
				height: 350rpx;
			}
		}
	}
	.button-box {
		display: flex;
		justify-content: center;
		height: 80rpx;
		.u-subsection {
			width: 100%;
		}
		.button {
			flex: 1;
			margin: 0 10rpx 10rpx;
			padding: 0;
			height: 50rpx;
			line-height: 50rpx;
			&.active {
				background-color: #007aff;
				color: #fff;
			}
		}
	}
	.menu-box {
		display: flex;
		flex-wrap: wrap;
		width: 100%;
		.box-item {
			width: calc(33.33% - 20rpx);
			margin: 10rpx;
			min-height: 120rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			letter-spacing: 2rpx;
			font-size: 32rpx;
			border-radius: 20rpx;
			color: #fff;
			transition: all 0.5s;
			background-color: rgba($color: #909399, $alpha: 0.5);
			box-shadow: 4px 3px 4px rgba($color: #909399, $alpha: 0.5);
			flex-wrap: wrap;
			&:active {
				// opacity: 1;
				transform: scale(1.1);
			}
			// background-color: rgba($color: #e74c3c, $alpha: 0.5);
			&.active {
				// opacity: 0.8;
			}
			&.menu {
				background-color: rgba($color: #f1f1f1, $alpha: 1);
				box-shadow: 4px 3px 4px rgba($color: #f1f1f1, $alpha: 0.5);
				color: #333;
				padding: 20rpx;
			}
			&.thin {
				background-color: #3498db;
				box-shadow: 4px 3px 4px rgba($color: #3498db, $alpha: 0.5);
			}
			&.normal {
				background-color: #1abc9c;
				box-shadow: 4px 3px 4px rgba($color: #1abc9c, $alpha: 0.5);
			}
			&.overweight {
				background-color: #f1c40f;
				box-shadow: 4px 3px 4px rgba($color: #f1c40f, $alpha: 0.5);
			}
			&.fat {
				background-color: #e74c3c;
				box-shadow: 4px 3px 4px rgba($color: #e74c3c, $alpha: 0.5);
			}
			.label {
				width: 100%;
			}

			.u-icon {
				padding: 2px;
			}
			.status {
				color: #fff;
				&.thin {
					.icon {
						width: 50rpx;
						height: 50rpx;
						display: inline-block;
						background-color: #3498db;
					}
				}
			}
			.status {
				font-size: 24rpx;
			}
			// &:nth-child(1) {
			// 	background-color: #3498db;
			// }
			// &:nth-child(2) {
			// 	background-color: #e74c3c;
			// }
			// &:nth-child(3) {
			// 	background-color: #8e44ad;
			// }
			// &:nth-child(4) {
			// 	background-color: #e67e22;
			// }
			// &:nth-child(5) {
			// 	background-color: #3498db;
			// }
			// &:nth-child(6) {
			// 	background-color: #e74c3c;
			// }
			// &:nth-child(7) {
			// 	background-color: #8e44ad;
			// }
			// &:nth-child(8) {
			// 	background-color: #e67e22;
			// }
			&.filled {
				opacity: 1;
				color: #fff;
				background-color: rgba($color: #2979ff, $alpha: 0.8);
				box-shadow: 4px 3px 4px rgba($color: #2979ff, $alpha: 0.5);
			}
		}
	}
	.energy-box {
		display: flex;
		width: 100%;
		justify-content: space-around;
		align-items: center;
		padding: 40rpx 20rpx;
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
