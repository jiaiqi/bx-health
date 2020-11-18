<template>
	<view class="health-wrap" @click="clickPage" v-if="isLogin">
<!-- 		<u-navbar back-text="返回" :back-text-style="backTextStyle" :back-icon-color="backTextStyle.color" :is-back="false" :border-bottom="true" :background="navBackground">
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
							<text class="cuIcon-favorfill margin-right-xs" v-if="item.is_main === '是' || index === 0"></text>
							{{ item.name }}
						</view>
						<view class="menu-item" @click.stop="clickUserMenu('regulate')">人员管理</view>
					</view>
				</view>
			</view>
		</u-navbar> -->
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
					<view class="text">热量变化</view>
					<view
						class="number "
						:class="{ 'text-red': parseFloat(energyChange) > 0, 'text-green': parseFloat(energyChange) < 0 }"
						style="display: flex; width: 90px; justify-content: space-between;"
					>
						<text style="flex:1;">{{ parseFloat(energyChange) > 0 ? `+${parseFloat(energyChange).toFixed(1)}` : parseFloat(energyChange).toFixed(1) }}</text>
						<text class="units">大卡</text>
					</view>
					<view
						class="number"
						:class="{ 'text-red': parseFloat(energyChange) > 0, 'text-green': parseFloat(energyChange) < 0 }"
						style="display: flex; width: 90px; justify-content: space-between;"
					>
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
			<view class="chart-box">
				<!-- #ifdef H5 -->
				<uni-echarts v-if="currentChart === 'canvasLineA'" class="uni-ec-canvas" :ec="weightData"></uni-echarts>
				<uni-echarts v-if="currentChart === 'canvasLineB'" class="uni-ec-canvas" :ec="BPData"></uni-echarts>
				<uni-echarts v-if="currentChart === 'canvasLineC'" class="uni-ec-canvas" :ec="sleepData"></uni-echarts>
				<uni-echarts v-if="currentChart === 'canvasColumnD'" class="uni-ec-canvas" :ec="caloriesData"></uni-echarts>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<uni-ec-canvas v-if="currentChart === 'stepChart'" class="uni-ec-canvas" id="uni-ec-canvas" :ec="stepData"></uni-ec-canvas>
				<uni-ec-canvas v-if="currentChart === 'canvasLineA'" class="uni-ec-canvas" id="uni-ec-canvas" :ec="weightData"></uni-ec-canvas>
				<uni-ec-canvas v-if="currentChart === 'canvasLineB'" class="uni-ec-canvas" id="uni-ec-canvas" :ec="BPData"></uni-ec-canvas>
				<uni-ec-canvas v-if="currentChart === 'canvasLineC'" class="uni-ec-canvas" id="uni-ec-canvas" :ec="sleepData"></uni-ec-canvas>
				<uni-ec-canvas v-if="currentChart === 'canvasColumnD'" class="uni-ec-canvas" id="uni-ec-canvas" :ec="caloriesData"></uni-ec-canvas>
				<!-- #endif -->
			</view>
			<view class="button-box">
				<button class="button" :class="{ active: currentChart === item.chartID }" size="mini" v-for="item in subList" :key="item.key" @click="showCanvas(item.key)">
					{{ item.name }}
				</button>
			</view>
		</view>
		<view class="main-box">
			<view class="main-box-title">基本信息</view>
			<view class="menu-box">
				<view class="box-item filled" @click="skip('basic')">
					<view class="label title">基本数据</view>
					<view class="status">
						点击查看
						<u-icon name="eye-fill"></u-icon>
					</view>
				</view>
				<view
					class="box-item"
					:class="{
						filled: quInfo.disease && quInfo.disease.hasFill === true && quInfo.disease.state === '完成',
						'bg-green': quInfo.disease && quInfo.disease.data && quInfo.disease.data.score >= 20
					}"
					@click="toQuestionnaire('disease')"
				>
					<view class="label title">疾病史</view>
					<view class="status" v-if="!quInfo.disease || !quInfo.disease.hasFill">
						未填写
						<u-icon name="edit-pen-fill"></u-icon>
					</view>
					<view class="status" v-if="quInfo.disease && quInfo.disease.hasFill">
						<!-- {{ quInfo.disease.state === '完成' ? '点击查看' : quInfo.disease.state }} -->
						<!-- <u-icon name="eye-fill"></u-icon> -->
						<u-rate
							:count="3"
							size="24"
							active-icon="heart-fill"
							inactive-icon="heart"
							inactive-color="#fff"
							active-color="#fff"
							:current="getQuestionRate(quInfo.disease)"
						></u-rate>
					</view>
				</view>
				<view class="box-item" :class="{ filled: quInfo.genetic && quInfo.genetic.hasFill === true && quInfo.genetic.state === '完成' }" @click="toQuestionnaire('genetic')">
					<view class="label title">遗传史</view>
					<view class="status" v-if="!quInfo.genetic || !quInfo.genetic.hasFill">
						未填写
						<u-icon name="edit-pen-fill"></u-icon>
					</view>
					<view class="status" v-if="quInfo.genetic && quInfo.genetic.hasFill">
						{{ quInfo.genetic.state === '完成' ? '点击查看' : quInfo.genetic.state }}
						<u-icon name="eye-fill"></u-icon>
					</view>
				</view>
				<view class="box-item" :class="{ filled: quInfo.diet && quInfo.diet.hasFill === true && quInfo.diet.state === '完成' }" @click="toQuestionnaire('diet')">
					<view class="label title">饮食营养</view>
					<view class="status" v-if="!quInfo.diet || !quInfo.diet.hasFill">
						未填写
						<u-icon name="edit-pen-fill"></u-icon>
					</view>
					<view class="status" v-if="quInfo.diet && quInfo.diet.hasFill">
						{{ quInfo.diet.state === '完成' ? '点击查看' : quInfo.diet.state }}
						<u-icon name="eye-fill"></u-icon>
					</view>
				</view>
				<view class="box-item" :class="{ filled: quInfo.sport && quInfo.sport.hasFill === true && quInfo.sport.state === '完成' }" @click="toQuestionnaire('sport')">
					<view class="label title">运动</view>
					<view class="status" v-if="!quInfo.sport || !quInfo.sport.hasFill">
						未填写
						<u-icon name="edit-pen-fill"></u-icon>
					</view>
					<view class="status" v-if="quInfo.sport && quInfo.sport.hasFill">
						{{ quInfo.sport.state === '完成' ? '点击查看' : quInfo.sport.state }}
						<u-icon name="eye-fill"></u-icon>
					</view>
				</view>
				<view class="box-item" :class="{ filled: quInfo.sleep && quInfo.sleep.hasFill === true && quInfo.sleep.state === '完成' }" @click="toQuestionnaire('sleep')">
					<view class="label title">睡眠</view>
					<view class="status" v-if="!quInfo.sleep || !quInfo.sleep.hasFill">
						未填写
						<u-icon name="edit-pen-fill"></u-icon>
					</view>
					<view class="status" v-if="quInfo.sleep && quInfo.sleep.hasFill">
						{{ quInfo.sleep.state === '完成' ? '点击查看' : quInfo.sleep.state }}
						<u-icon name="eye-fill"></u-icon>
					</view>
				</view>
				<view class="box-item" :class="{ filled: quInfo.mental && quInfo.mental.hasFill === true && quInfo.mental.state === '完成' }" @click="toQuestionnaire('mental')">
					<view class="label title">心理</view>
					<view class="status" v-if="!quInfo.mental || !quInfo.mental.hasFill">
						未填写
						<u-icon name="edit-pen-fill"></u-icon>
					</view>
					<view class="status" v-if="quInfo.mental && quInfo.mental.hasFill">
						{{ quInfo.mental.state === '完成' ? '点击查看' : quInfo.mental.state }}
						<u-icon name="eye-fill"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<view class="main-box">
			<view class="main-box-title">慢性疾病</view>
			<view class="menu-box">
				<view class="box-item menu" :class="[bmiStatus.key]">
					<view class="status" :class="[bmiStatus.key]"><text class="label">BMI</text></view>
					<view class="value">{{ BMI }}</view>
					<view class="images">
						<text class="text">{{ bmiStatus.label }}</text>
						<image class="u-image" src="/archivesPages/static/icon/weight.png" mode=""></image>
					</view>
				</view>
				<view class="box-item menu">
					<view class="status"><text class="label">高血压</text></view>
					<view class="images">
						<text class="text"></text>
						<image class="u-image" src="/archivesPages/static/icon/bp.png" mode=""></image>
					</view>
				</view>
				<view class="box-item menu">
					<view class="status"><text class="label">糖尿病</text></view>
					<view class="images">
						<text class="text"></text>
						<image class="u-image" src="/archivesPages/static/icon/diabetes.png" mode=""></image>
					</view>
				</view>
				<view class="box-item menu">
					<view class="status"><text class="label">失眠</text></view>
					<view class="images">
						<text class="text"></text>
						<image class="u-image" src="/archivesPages/static/icon/sleep.png" mode=""></image>
					</view>
				</view>
				<view class="box-item menu">
					<view class="status"><text class="label">颈椎病</text></view>
					<view class="images">
						<text class="text"></text>
						<image class="u-image" src="/archivesPages/static/icon/cervical.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
<script>
var self;
// #ifdef MP-WEIXIN
import uniEcCanvas from '@/components/uni-ec-canvas/uni-ec-canvas.vue';
// import uniEcCanvas from '@/archivesPages/components/uni-ec-canvas/uni-ec-canvas.vue';
// #endif
// #ifdef H5
import uniEcharts from '@/components/uni-ec-canvas/uni-echarts.vue';
// import uniEcharts from '@/archivesPages/components/uni-ec-canvas/uni-echarts.vue';
// #endif
var _self;
import dayjs from '../static/dayjs/esm/index.js'
// var dayjs = require('../static/dayjs/esm/index.js');
export default {
	components: {
		// #ifdef MP-WEIXIN
		uniEcCanvas,
		// #endif
		// #ifdef H5
		uniEcharts
		// #endif
	},
	data() {
		return {
			quInfo: {}, // 问卷信息
			stepData: {
				option: {}
			},
			weightData: {},
			caloriesData: {},
			BPData: {},
			sleepData: {},
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
			wxUserInfo: {},
			serviceLog: {}, // 服务记录
			pageTitle: '健康档案',
			showUserList: false,
			backTextStyle: {
				color: '#fff'
			},
			dietIn: 0, //饮食摄入
			sportOut: 0, //运动消耗
			userInfo: {},
			selectDate: this.formateDate(new Date(), 'date'),
			userMenuList: [],
			navBackground: {
				backgroundColor: '#0bc99d'
			},
			weightChartData: {
				categories: ['10-13', '10-14', '10-15', '10-16', '10-17', '10-18'],
				series: [
					{
						name: '体重',
						data: [73, 75, 73.5, 74.5, 75, 73.5],
						color: '#1890ff'
					}
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
			wxRunData: {},
			stepInfoList: []
		};
	},
	computed: {
		profile_url() {
			if (this.loginUserInfo.headimgurl) {
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
		getQuestionRate(e) {
			let score = 0;
			if (e.data && e.data.score) {
				score = e.data.score;
			}
			if (score < 20) {
				return 0;
			} else if (score >= 20 && score < 40) {
				return 1;
			} else if (score >= 40 && score < 60) {
				return 2;
			} else if (score >= 60) {
				return 3;
			}
		},
		async checkQuestionnaireRecord() {
			let quInfo = {
				//疾病
				disease: {
					no: '20201027152801000160',
					hasFill: false
				},
				//遗传
				genetic: {
					no: '20201029103509000161',
					hasFill: false
				},
				//饮食营养
				diet: {
					no: '20201026114053000156',
					hasFill: false
				},
				sport: {
					//运动健康
					no: '20201027151517000158',
					hasFill: false
				},
				sleep: {
					// 睡眠
					no: '20200307210717000096',
					hasFill: false
				},
				mental: {
					// 心理
					no: '20201027152137000159',
					hasFill: false
				}
			};
			let no = Object.keys(quInfo).map(key => quInfo[key].no);
			let record = await this.getQuestionnaireRecord(no.toString());
			Object.keys(quInfo).forEach(key => {
				record.forEach(res => {
					if (quInfo[key].no === res.activity_no) {
						quInfo[key]['hasFill'] = true;
						quInfo[key]['data'] = res;
						quInfo[key]['state'] = res.state;
					}
				});
			});
			this.quInfo = quInfo;
		},
		async getQuestionnaireRecord(no) {
			let url = this.getServiceUrl('daq', 'srvdaq_record_reply_select', 'select');
			let req = {
				serviceName: 'srvdaq_record_reply_select',
				colNames: ['*'],
				condition: [{ colName: 'activity_no', ruleType: 'in', value: no }, { colName: 'user_no', ruleType: 'like', value: this.loginUserInfo.user_no }],
				order: [{ colName: 'create_time', orderType: 'desc' }]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				if (Array.isArray(res.data.data) && res.data.data.length > 0) {
					let noList = [];
					let result = res.data.data.filter(item => {
						if (!noList.includes(item.activity_no) && item.state === '完成') {
							// 最近时间的问卷记录
							noList.push(item.activity_no);
							return true;
						}
					});
					res.data.data.forEach(item => {
						if (!noList.includes(item.activity_no)) {
							// 最近时间的问卷记录
							noList.push(item.activity_no);
							result.push(item);
						}
					});
					return result;
				}
			}
		},
		toQuestionnaire(type) {
			let no = '';
			switch (type) {
				case 'genetic':
					// 遗传史
					no = '20201029103509000161';
					break;
				case 'disease':
					// 疾病史
					no = '20201027152801000160';
					break;
				case 'diet':
					// 饮食营养卷
					no = '20201026114053000156';
					break;
				case 'sport':
					// 运动
					no = '20201027151517000158';
					break;
				case 'sleep':
					// 睡眠
					no = '20200307210717000096';
					break;
				case 'mental':
					// 心理问卷
					no = '20201027152137000159';
					break;
				default:
					break;
			}
			let url = `/questionnaire/index/index?formType=form&activity_no=${no}&status=进行中`;
			uni.navigateTo({
				url: url
			});
		},
		topages() {
			let url = 'https://wx2.100xsys.cn/pages/specific/questionnaire/questionnaire?formType=form&activity_no=20200307210717000096&status=进行中';
			uni.navigateTo({
				url: '/publicPages/webviewPage/webviewPage?webUrl=' + encodeURIComponent(url)
			});
		},
		skip(item) {
			// 跳转页面
			let url = '';
			switch (item) {
				case 'basic':
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
							this.weightData = this.buildEcData(this.weightChartData, 'kg', '体重');
						}); // 体重
					}
					break;
				case 'BP':
					if (this.currentChart === 'canvasLineB') {
						// this.currentChart = '';
					} else {
						this.currentChart = 'canvasLineB';
						this.getChartData('bloodPressure').then(_ => {
							this.BPData = this.buildEcData(this.BPChartData, 'mmHg', '血压');
						}); // 血压
					}
					break;
				case 'sleep':
					if (this.currentChart === 'canvasLineC') {
						// this.currentChart = '';
					} else {
						this.currentChart = 'canvasLineC';
						this.sleepData = this.buildEcData(this.sleepChartData, '小时', '睡眠');
					}
					break;
				case 'calories':
					if (this.currentChart === 'canvasColumnD') {
						// this.currentChart = '';
					} else {
						this.currentChart = 'canvasColumnD';
						this.getDietSportRecordList().then(_ => {
							this.caloriesData = this.buildEcData(this.caloriesChartData, '大卡', '热量');
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
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				let series = [];
				if (type === 'weight') {
					series = this.weightChartData.series;
					series[0].data = res.data.data.map(item => {
						return item.weight;
					});
					this.weightChartData.series = series;
					this.weightChartData.categories = res.data.data.map(item => dayjs(item.create_time).format('MM-DD'));
					this.weightData = this.buildEcData(this.weightChartData, 'kg', '体重');
				} else if (type === 'bloodPressure') {
					series = this.BPChartData.series;
					series[0].data = res.data.data.map(item => {
						return item.systolic_pressure;
					});
					series[1].data = res.data.data.map(item => item.diastolic_pressure);
					this.BPChartData.series = series;
					this.BPChartData.categories = res.data.data.map(item => dayjs(item.create_time).format('MM-DD'));
					this.BPData = this.buildEcData(this.BPChartData, 'mmHg', '血压');
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
					{ colName: 'hdate', ruleType: 'like', value: this.formateDate(new Date(), 'date').trim() }
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
					{ colName: 'hdate', ruleType: 'like', value: this.formateDate(new Date(), 'date').trim() }
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
		clickPage(e) {
			if (this.showUserList) {
				this.showUserList = false;
			}
		},
		/**
		 * @param {object}  = [chartData]
		 * @param {string}  = [unit] -单位
		 * @param {string}  = [title]
		 */
		buildEcData(chartData = { categories: [], series: [] }, unit, title) {
			let option = {
				title: {
					text: title
				},
				tooltip: {
					trigger: 'axis',
					formatter: '{b}\r\n{c0}' + unit,
					axisPointer: {
						type: 'line',
						axis: 'x',
						label: {
							backgroundColor: '#000000'
						}
					}
				},
				grid: {
					left: '6%',
					right: '6%',
					top: '20%',
					bottom: '6%',
					containLabel: true
				},
				xAxis: {
					type: 'category',
					boundaryGap: false,
					data: chartData.categories,
					axisLine: {
						// y轴
						show: true
					},
					axisTick: {
						// y轴刻度线
						show: true
					},
					splitLine: {
						// 网格线
						show: true
					}
				},
				yAxis: {
					type: 'value',
					axisLine: {
						// y轴
						show: true
					},
					axisTick: {
						// y轴刻度线
						show: true
					},
					splitLine: {
						// 网格线
						show: true
					}
				},
				series: []
			};
			option.series = [];
			chartData.series.forEach(item => {
				let obj = {
					name: item.name,
					type: 'line',
					smooth: true,
					itemStyle: {
						color: item.color
					},
					label: { show: true },
					data: item.data
				};
				if (item.data.length > 10) {
					// option.grid.bottom = '20%';
					option.dataZoom = [
						{
							type: 'inside',
							start: 80,
							end: 100
						}
					];
				}
				option.series.push(obj);
			});
			let data = {
				option: option
			};
			return data;
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
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				const userInfo = res.data.data[0];
				this.wxUserInfo = userInfo;
				uni.setStorageSync('wxUserInfo', userInfo);
				if (userInfo.headimgurl) {
					this.src = userInfo.headimgurl;
				}
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
				// this.wxRunData = result;
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
						let chartData = { categories: [], series: [{}] };
						chartData.categories = stepList.map(item => item.date.slice(5));
						chartData.series[0] = {
							name: '近31日运动步数',
							data: [],
							color: '#1e4cf3'
						};
						chartData.series[0].data = stepList.map(item => item.step);
						this.wxRunData = chartData;
						this.stepData = this.buildEcData(this.wxRunData, '步', '步数');
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
			if (!userInfo || !uni.getStorageSync('isLogin')) {
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
			if (userInfo && userInfo.user_no) {
				this.loginUserInfo = userInfo;
				uni.setStorageSync('activeApp', 'health');
				await this.getCurrUserInfo(); // 查找健康app个人基本信息
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
				if (!this.wxUserInfo) {
					await this.getUserInfo(); //查找微信用户基本信息
				}
				await this.getDietAllRecord(); //查找饮食和运动记录
				if (!this.serviceLog) {
					this.selectServiceLog();
				}
				this.loginUserInfo = userInfo;
				// #ifdef MP-WEIXIN
				this.currentChart = 'stepChart';
				this.getwxStepInfoList().then(_ => {
					//获取微信运动记录
				});
				// #endif
				// #ifdef H5
				// #endif
				this.checkQuestionnaireRecord(); //检查有没有填过饮食运动等相关问卷
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
.qiun-charts {
	width: 750upx;
	height: 500upx;
	background-color: #ffffff;
	.charts-line {
		width: 710rpx;
		height: 350rpx;
	}
}
.charts {
	width: 750upx;
	height: 500upx;
	background-color: #ffffff;
}
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
		}
	}

	&.column {
		flex-direction: column;
		flex-wrap: nowrap;
		position: relative;
		.swiper {
			height: 380rpx;
			.swiper-item {
				width: 710rpx;
				height: 380rpx;
				.charts-line {
					width: 710rpx;
					height: 350rpx;
				}
			}
		}
		.chart-box {
			border-radius: 2px;
			background-color: #fff;
			margin: 0 auto;
			height: 450rpx;
			.uni-ec-canvas {
				width: 710rpx;
				height: 450rpx;
			}
			.charts-line {
				width: 710rpx;
				height: 450rpx;
			}
		}
	}
	.button-box {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100rpx;
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
			letter-spacing: 2rpx;
			padding: 20rpx;
			font-size: 32rpx;
			border-radius: 20rpx;
			// color: #fff;
			text-align: left;
			transition: all 0.5s;
			// background-color: rgba($color: #909399, $alpha: 0.5);
			box-shadow: 4px 3px 4px rgba($color: #909399, $alpha: 0.5);
			border: 1px solid #f2f2f2;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			.value {
				font-size: 40rpx;
				font-weight: bold;
			}
			&:active {
				transform: scale(1.1);
			}
			.label {
				width: 100%;
				padding: 10rpx 0;
				font-size: 30rpx;
				&.title {
					font-size: 34rpx;
				}
			}
			.u-icon {
				padding: 2px;
			}
			.images {
				width: 100%;
				display: flex;
				justify-content: space-between;
				align-items: center;
				.u-image {
					width: 60rpx;
					height: 60rpx;
				}
			}
			.status {
				font-size: 24rpx;
			}
			// &.filled {
			// 	opacity: 1;
			// 	color: #fff;
			// 	background-color: rgba($color: #2979ff, $alpha: 0.8);
			// 	box-shadow: 4px 3px 4px rgba($color: #2979ff, $alpha: 0.5);
			// }
			// &.bg-green {
			// 	background-color: rgba(11, 201, 157, 0.8);
			// 	box-shadow: 4px 3px 4px rgba(11, 201, 157, 0.8);
			// }
		}
		.menu {
			transition: all 0.5s;
			min-height: 200rpx;
			background-color: rgba($color: #fff, $alpha: 1);
			box-shadow: 4px 3px 4px rgba($color: #fff, $alpha: 0.5);
			color: #333;
			padding: 20rpx;
			border: 1px solid #999;
			&.thin {
				// background-color: #3498db;
				border: 1px solid #3498db;
				// box-shadow: 4px 3px 4px rgba($color: #3498db, $alpha: 0.5);
				.value,
				.text {
					color: #3498db;
				}
			}
			&.normal {
				// background-color: #1abc9c;
				border: 1px solid #1abc9c;
				.value,
				.text {
					color: #1abc9c;
				}
				// box-shadow: 4px 3px 4px rgba($color: #1abc9c, $alpha: 0.5);
			}
			&.overweight {
				// background-color: #f1c40f;
				border: 1px solid #f1c40f;
				.value,
				.text {
					color: #f1c40f;
				}
				// box-shadow: 4px 3px 4px rgba($color: #f1c40f, $alpha: 0.5);
			}
			&.fat {
				border: 1px solid #e74c3c;
				.value,
				.text {
					color: #e74c3c;
				}
				// background-color: #e74c3c;
				// box-shadow: 4px 3px 4px rgba($color: #e74c3c, $alpha: 0.5);
			}
		}
	}
	.energy-box {
		display: flex;
		width: 100%;
		justify-content: space-around;
		align-items: center;
		padding: 0rpx 10rpx;
	}
	.energy-item {
		color: #333;
		font-weight: bold;
		min-height: 150upx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		flex: 1;
		margin-bottom: 10rpx;
		border-radius: 20rpx;
		margin: 30rpx 10rpx;
		&:first-child {
			background-color: rgba($color: #f14d30, $alpha: 0.8);
			box-shadow: 4px 3px 4px rgba($color: #cf6d40, $alpha: 0.5);
			color: #f1f1f1;
		}
		&:nth-child(3) {
			color: #f1f1f1;
			background-color: rgba($color: #0bc99d, $alpha: 0.8);
			box-shadow: 4px 3px 4px rgba($color: #0bc99d, $alpha: 0.5);
		}
		&:nth-child(5) {
			color: #f1f1f1;
			background-color: rgba($color: #2989ff, $alpha: 0.8);
			box-shadow: 4px 3px 4px rgba($color: #2979ff, $alpha: 0.5);
		}
		&:last-child {
			background-color: #fff;
			flex: 2;
			margin-right: 0;
			color: #333;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: rgba($color: #fff, $alpha: 0.8);
			box-shadow: 0px 1px 5px 0px rgba(153, 153, 153, 0.5);
		}
		.text {
			font-size: 20upx;
			font-weight: normal;
		}
		.number {
			font-size: 30upx;
			text-align: center;
			margin-top: 10rpx;
		}
		.text-red {
			color: rgba(241, 77, 48, 0.8);
			text-align: right;
		}
		.text-green {
			color: rgba($color: #0bc99d, $alpha: 0.7);
			text-align: right;
		}
		.units {
			min-width: 65rpx;
			padding-left: 10upx;
			font-size: 20upx;
			color: #000;
			// color: #f1f1f1;
		}
	}
	.operate {
		font-size: 60upx;
		font-weight: 600;
		// width: 60upx;
		color: #ff8944;
		text-align: center;
		text-shadow: 4px 3px 4px rgba($color: #e79715, $alpha: 0.5);
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
.uni-ec-canvas {
	width: 100%;
	height: 350rpx;
	display: block;
}
</style>
