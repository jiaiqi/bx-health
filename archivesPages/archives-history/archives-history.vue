<template>
	<view class="history-wrap">
		<view class="history-chart" v-if="isAllPages">
			<uniEcCharts class="uni-ec-charts" id="uni-ec-canvas" v-if="currentChart === 'stepChart'" :ec="stepEcData"></uniEcCharts>
			<uniEcCharts class="uni-ec-charts" id="uni-ec-canvas" v-if="currentChart === 'canvasLineA'" :ec="weightEcData"></uniEcCharts>
			<uniEcCharts class="uni-ec-charts" id="uni-ec-canvas" v-if="currentChart === 'canvasLineB'" :ec="bpEcData"></uniEcCharts>
			<uniEcCharts class="uni-ec-charts" id="uni-ec-canvas" v-if="currentChart === 'canvasColumnD'" :ec="caloriesEcData"></uniEcCharts>
			<uniEcCharts class="uni-ec-charts" id="uni-ec-canvas" v-if="currentChart === 'canvasLineC'" :ec="sleepEcData"></uniEcCharts>
		</view>
		<view class="button-box" v-if="isAllPages">
			<button class="button" :class="{ active: currentChart === item.chartID }" size="mini" v-for="item in subList" :key="item.key" @click="showCanvas(item.key)">
				{{ item.name }}
			</button>
		</view>

		<view class="history-box" v-if="pageType">
			<view class="history-content">
				<dietList :key="pageType" @changePageType="changePageType" :pageType="pageType" v-if="pageType === 'diet' || pageType === 'sport'"></dietList>
				<view
					class="other-record"
					v-if="pageType === 'sleep' || pageType === 'bp' || pageType === 'weight'"
					:class="{
						'sleep-record': pageType === 'sleep',
						'bp-record': pageType === 'bp',
						'weight-record': pageType === 'weight'
					}"
				>
					<!-- 体重、血压、睡眠 -->
					<view class="record-title">最新数据</view>
					<view class="record-data">
						<view class="last-data" v-if="historyRecord && historyRecord.length > 0 && pageType === 'bp'">
							<text class="digital ">
								<text>
									<text
										:class="{
											'text-green': historyRecord[0].systolic_pressure < 120,
											'text-yellow': historyRecord[0].systolic_pressure >= 120 && historyRecord[0].systolic_pressure < 140,
											'text-red': historyRecord[0].systolic_pressure >= 140
										}"
									>
										{{ getFixedNum(historyRecord[0].systolic_pressure) }}
									</text>
									<text class="text-gray">/</text>
									<text
										:class="{
											'text-green': historyRecord[0].diastolic_pressure < 80,
											'text-yellow': historyRecord[0].diastolic_pressure < 90 && historyRecord[0].diastolic_pressure >= 80,
											'text-red': historyRecord[0].diastolic_pressure >= 90
										}"
									>
										{{ getFixedNum(historyRecord[0].diastolic_pressure) }}
									</text>
								</text>
							</text>
							<text class="unit">毫米汞柱</text>
						</view>
						<view class="last-data" v-if="historyRecord && historyRecord.length > 0 && pageType === 'weight'">
							<text class="digital">{{ getFixedNum(historyRecord[0].weight) }}</text>
							<text class="unit">kg</text>
						</view>
						<view class="last-data" v-if="historyRecord && historyRecord.length > 0 && pageType === 'sleep'">
							<text class="digital">{{ historyRecord[0].sleep_time.slice(0, 5) }}</text>
							<text class="unit">(时长)</text>
						</view>
						<view class="date" v-if="historyRecord && historyRecord.length > 0">
							<text class="cuIcon-time margin-right-xs"></text>
							{{ historyRecord[0].create_time.slice(0, 16) }}
						</view>
						<!-- customer_no:患者编号,有患者编号时意味着是医生账号从患者列表进入此页面,则没有记录数据的权限 -->
						<button class="nav-button" @click="toPages(pageType)" v-if="!this.customer_no">记录数据</button>
					</view>
					<view class="bmi-box" v-if="pageType === 'weight'">
						<view class="bmi-bar-box" v-if="bmi">
							<view class="bmi-box-item" v-if="bmi">
								<view class="title">BMI</view>
								<view class="digit bmi">{{ bmi }}</view>
							</view>
							<view class="bmi-label" v-if="isArray(weightForBmi)">
								<view class="label text-bold">BMI:</view>
								<view class="value" v-for="item in weightForBmi" :key="item.bmi">{{ item.bmi }}</view>
							</view>
							<view class="bmi-bar">
								<view class="bar1 bar-box">
									<view class="scale" :style="{ left: bmiScale ? bmiScale : 0 }" v-if="bmi < 18.5"><text class="cuIcon-triangledownfill"></text></view>
									<view class="bar">偏瘦</view>
								</view>
								<view class="bar2 bar-box">
									<view class="scale" :style="{ left: bmiScale ? bmiScale : 0 }" v-if="bmi >= 18.5 && bmi <= 24"><text class="cuIcon-triangledownfill"></text></view>
									<view class="bar">正常</view>
								</view>
								<view class="bar3 bar-box">
									<view class="scale" :style="{ left: bmiScale ? bmiScale : 0 }" v-if="bmi <= 28 && bmi > 24"><text class="cuIcon-triangledownfill"></text></view>
									<view class="bar">超重</view>
								</view>
								<view class="bar4 bar-box">
									<view class="scale" :style="{ left: bmiScale ? bmiScale : 0 }" v-if="bmi > 28"><text class="cuIcon-triangledownfill"></text></view>
									<view class="bar">肥胖</view>
								</view>
							</view>
							<view class="bmi-label" v-if="isArray(weightForBmi)">
								<view class="label text-bold">体重:</view>
								<view class="value" v-for="item in weightForBmi" :key="item.bmi">
									<text v-if="item.weight && isString(item.weight)">{{ item.weight }}</text>
								</view>
							</view>
						</view>
					</view>
					<view class="history-record">
						<view class="title">历史数据</view>
						<u-empty mode="history" v-if="historyRecord && historyRecord.length === 0"></u-empty>
						<view class="list-box" v-if="historyRecord && historyRecord.length > 0">
							<view class="list-item" v-for="(item, index) in historyRecord" :key="index">
								<image src="../static/icon/xueya.png" mode="" class="icon" v-if="pageType === 'bp'"></image>
								<image src="../static/icon/sleep.png" mode="" class="icon" v-if="pageType === 'sleep'"></image>
								<image src="../static/icon/tizhong.png" mode="" class="icon" v-if="pageType === 'weight'"></image>
								<view class="item">
									<text
										class="digital"
										:class="{
											'text-green': item.systolic_pressure < 120,
											'text-yellow': item.systolic_pressure >= 120 && item.systolic_pressure < 140,
											'text-red': item.systolic_pressure >= 140
										}"
										v-if="pageType === 'bp' && item && item.systolic_pressure"
									>
										{{ item.systolic_pressure ? getFixedNum(item.systolic_pressure) : '-' }}
									</text>
									<text class="digital" v-if="pageType === 'weight'">{{ item.weight ? getFixedNum(item.weight) : '-' }}</text>
									<text class="digital" v-if="pageType === 'sleep'">{{ item.sleep_time ? item.sleep_time.slice(0, 5) : '-' }}</text>
								</view>
								<view class="item" v-if="pageType === 'bp' && item && item.diastolic_pressure">
									<text class="text-gray">/</text>
									<text
										:class="{
											'text-green': item.diastolic_pressure < 80,
											'text-yellow': item.diastolic_pressure < 90 && item.diastolic_pressure >= 80,
											'text-red': item.diastolic_pressure >= 90
										}"
										class="digital bp"
									>
										{{ item.diastolic_pressure ? getFixedNum(item.diastolic_pressure) : '-' }}
									</text>
								</view>
								<view class="unit">
									<text v-if="pageType === 'bp'">mmHg</text>
									<text v-if="pageType === 'weight'">kg</text>
									<text v-if="pageType === 'sleep'">（时长）</text>
								</view>
								<view class="item">
									<text>{{ item.create_time.slice(0, 16) }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<u-popup v-model="showTypePopup" border-radius="40" mode="top" closeable>
			<view class="switch-type-box">
				<view class="type-item cu-btn round" :class="{ 'bg-blue': item.name === currentType }" v-for="item in typeList" :key="item.name" @click="currentType = item.name">
					{{ item.name }}
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
import uniEcCharts from '@/components/uni-ec-canvas/uni-echart.vue';
// import uniEcCharts from '@/archivesPages/components/uni-ec-canvas/uni-echart.vue';
import energyListWrap from './totalEnergyList.js';
import dietList from '@/archivesPages/components/balancedDiet/balancedDiet';
import dayjs from '../static/dayjs/esm/index.js';
// import dayjs from '../static/dayjs';
export default {
	components: {
		uniEcCharts,
		dietList
	},
	data() {
		return {
			customer_no: '',
			isAllPages: false,
			backTextStyle: {
				width: '100rpx',
				color: '#fff'
			},
			navBackground: {
				backgroundColor: '#0bc99d'
			},
			showTypePopup: false,
			subList: [
				{ name: '步数', key: 'step', chartID: 'stepChart' },
				{ name: '体重', key: 'weight', chartID: 'canvasLineA' },
				{ name: '血压', key: 'BP', chartID: 'canvasLineB' },
				{ name: '热量', key: 'calories', chartID: 'canvasColumnD' },
				{ name: '睡眠', key: 'sleep', chartID: 'canvasLineC' }
			],
			currentChart: 'stepChart',
			typeList: [
				{
					name: '饮食'
				},
				{
					name: '运动'
				},
				{
					name: '睡眠'
				},
				{
					name: '症状'
				},
				{
					name: '心理'
				},
				{
					name: '其它'
				}
			],
			chartData: {},
			historyRecord: null,
			currentType: '饮食',
			currentDate: 0,
			energyListWrap: [],
			loginUserInfo: {},
			userInfo: {},
			wxUserInfo: {},
			stepEcData: {},
			weightEcData: {},
			bpEcData: {},
			caloriesEcData: {},
			sleepEcData: {},
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
			stepInfoList: [],
			pageType: '',
			pageName: ''
		};
	},
	computed: {
		echartsData() {
			return this.deepClone(this.chartData);
		},
		standardWeight() {
			// 标准体重=(身高cm-100)x0.9(kg)
			// 标准体重(女)=(身高cm-100)x0.9(kg)-2.5(kg)
			// 正常体重：标准体重＋-(多少）10％．
			if (this.userInfo.height) {
				return Number(((this.userInfo.height - 100) * 0.9).toFixed(1));
			}
			return 0;
		},

		bmi() {
			// 体重（kg）/身高*身高（m）
			if (this.userInfo.weight && this.userInfo.height) {
				return Number(((this.userInfo.weight * 10000) / this.userInfo.height ** 2).toFixed(1));
			}
		},
		weightForBmi() {
			let bmiList = [18.5, 24, 28];
			let weightList = [];
			if (this.bmi && this.userInfo && this.userInfo.height) {
				bmiList.forEach(bmi => {
					let weight = ((bmi * this.userInfo.height ** 2) / 10000).toFixed(1) + 'kg';
					weightList.push({
						bmi,
						weight
					});
				});
			}
			return weightList;
		},
		bmiScale() {
			let result = 0;
			if (this.bmi) {
				let bmi = Number(this.bmi);
				if (bmi < 18.5) {
					result = bmi / 18.5;
				} else if (bmi >= 18.5 && bmi <= 24) {
					result = (bmi - 18.5) / 5.5;
				} else if (bmi > 24 && bmi <= 28) {
					result = (bmi - 24) / 4;
				} else if (bmi > 28) {
					result = bmi / 18.5;
				}
				result = result * 150 - 24;
			}
			return `${result}rpx`;
		}
	},
	methods: {
		getFixedNum(num) {
			if (num) {
				return num.toFixed(1);
			} else {
				return 0;
			}
		},
		toPages(e) {
			let condType = {};
			let url = '';
			switch (e) {
				case 'food':
					condType = {
						type: 'food',
						date: this.selectDate,
						serviceName: 'srvhealth_diet_contents_select',
						colName: 'name',
						imgCol: 'image',
						wordKey: {
							title: 'name',
							unit: 'unit',
							energy: 'unit_energy'
						}
					};
					url = '/otherPages/dietSelect/dietSelect?condType=' + encodeURIComponent(JSON.stringify(condType));
					break;
				case 'sport':
					condType = {
						type: 'sport',
						date: this.selectDate,
						serviceName: 'srvhealth_body_activity_contents_select',
						colName: 'name',
						imgCol: 'image',
						wordKey: {
							title: 'name',
							unit: 'unit',
							energy: 'unit_energy'
						}
					};
					url = '/otherPages/dietSelect/dietSelect?condType=' + encodeURIComponent(JSON.stringify(condType));
					break;
			}
			this.showPopup = false;
			if (e !== 'food' && e !== 'sport') {
				if (e === 'pressure') {
					e = bp;
				}
				uni.navigateTo({
					url: '/otherPages/otherIndicator/otherIndicator?type=' + e
				});
			} else {
				if (url) {
					uni.navigateTo({
						url: url
					});
				}
			}
		},
		changePageType(e) {
			this.pageType = e;
			switch (e) {
				case 'sport':
					this.pageName = '运动记录';
					this.showCanvas('step');
					break;
				case 'diet':
					this.pageName = '饮食记录';
					this.showCanvas('calories');
					break;
				case 'weight':
					this.pageName = '体重记录';
					this.showCanvas('weight');
					break;
			}
		},
		showCanvas(type) {
			// 显示图表
			switch (type) {
				case 'step':
					this.pageType = 'sport';
					this.currentChart = 'stepChart';
					this.getwxStepInfoList();
					this.currentType = '运动';
					break;
				case 'weight':
					this.pageType = 'weight';
					this.currentChart = 'canvasLineA';
					this.getChartData('weight').then(_ => {
						this.weightEcData = this.buildEcData(this.weightChartData, 'kg', '体重');
						// this.chartData = this.buildEcData(this.weightChartData, 'kg', '体重');
					}); // 体重
					this.currentType = '体重';
					break;
				case 'BP':
					this.pageType = 'bp';
					this.currentChart = 'canvasLineB';
					this.getChartData('bloodPressure').then(_ => {
						this.bpEcData = this.buildEcData(this.BPChartData, 'mmHg', '血压');
						// this.chartData = this.buildEcData(this.BPChartData, 'mmHg', '血压');
					}); // 血压
					this.currentType = '血压';
					break;
				case 'sleep':
					this.currentChart = 'canvasLineC';
					this.getChartData('sleep').then(_ => {
						// this.chartData = this.buildEcData(this.BPChartData, 'mmHg', '血压');
					}); // 血压
					this.sleepEcData = this.buildEcData(this.sleepChartData, '小时', '睡眠');
					// this.chartData = this.buildEcData(this.sleepChartData, '小时', '睡眠');
					this.pageType = 'sleep';
					this.currentType = '睡眠';
					break;
				case 'calories':
					this.pageType = 'diet';
					this.currentChart = 'canvasColumnD';
					this.getDietSportRecordList().then(_ => {
						this.caloriesEcData = this.buildEcData(this.caloriesChartData, '大卡', '热量');
						// this.chartData = this.buildEcData(this.caloriesChartData, '大卡', '热量');
					});
					this.currentType = '饮食';
					break;
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
					},
					max: function(value) {
						return value.max + 20;
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
				if (unit === '步') {
					obj.label.show = false;
				}
				if (item.data.length > 10) {
					if (item.data.length > 10 && item.data.length <= 20) {
						option.dataZoom = [
							{
								type: 'inside',
								start: 60,
								end: 100
							}
						];
					} else if (item.data.length > 20 && item.data.length <= 30) {
						option.dataZoom = [
							{
								type: 'inside',
								start: 70,
								end: 100
							}
						];
					} else if (item.data.length > 30 && item.data.length <= 40) {
						option.dataZoom = [
							{
								type: 'inside',
								start: 80,
								end: 100
							}
						];
					} else if (item.data.length > 40 && item.data.length <= 50) {
						option.dataZoom = [
							{
								type: 'inside',
								start: 90,
								end: 100
							}
						];
					} else {
						option.dataZoom = [
							{
								type: 'inside',
								start: 95,
								end: 100
							}
						];
					}
				} else {
					option.dataZoom = [
						{
							type: 'inside',
							start: 0,
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
		async selectServiceLog() {
			// 查找服务记录编号
			let serviceName = 'srvhealth_service_record_select';
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: 'srvhealth_service_record_select',
				colNames: ['*'],
				condition: [{ colName: 'user_info_no', ruleType: 'like', value: this.customer_no ? this.customer_no : this.userInfo.no }],
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
					data: [
						{
							user_info_no: this.customer_no ? this.customer_no : this.userInfo.no,
							user_no: this.userInfo.userno,
							name: this.userInfo.name,
							time: this.formateDate(new Date(), 'dateTimes')
						}
					]
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				await this.selectServiceLog();
			}
		},
		async getChartData(type) {
			let serviceObj = {
				weight: 'srvhealth_body_fat_measurement_record_select', // 体重体脂
				bloodPressure: 'srvhealth_blood_pressure_record_select', // 血压
				sleep: 'srvhealth_sleep_record_select' // 血压
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
						orderType: 'desc' // asc升序  desc降序
					}
				],
				page: {
					pageNo: 1,
					rownumber: 100
				}
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				res.data.data = res.data.data.reverse();
				let series = [];
				if (type === 'weight') {
					series = this.weightChartData.series;
					series[0].data = res.data.data.map(item => {
						return Number(item.weight.toFixed(1));
					});
					this.weightChartData.series = series;
					this.weightChartData.categories = res.data.data.map(item => dayjs(item.create_time).format('MM-DD'));
					this.chartData = this.buildEcData(this.weightChartData, 'kg', '体重');
				} else if (type === 'bloodPressure') {
					series = this.BPChartData.series;
					series[0].data = res.data.data.map(item => {
						return Number(item.systolic_pressure.toFixed(1));
					});
					series[1].data = res.data.data.map(item => Number(item.diastolic_pressure.toFixed(1)));
					this.BPChartData.series = series;
					this.BPChartData.categories = res.data.data.map(item => dayjs(item.create_time).format('MM-DD'));
					this.chartData = this.buildEcData(this.BPChartData, 'mmHg', '血压');
				}
				this.historyRecord = this.deepClone(res.data.data).reverse();
			} else {
				this.historyRecord = [];
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
						{ colName: 'userno', ruleType: 'like', value: this.userInfo.userno },
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
				item.data = item.data.map(num => Number(num.toFixed(1))).reverse();
				return item;
			});
			this.caloriesChartData.series = series;
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
						this.stepEcData = this.buildEcData(this.wxRunData, '步', '步数');
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
		async getNutrientRecommended() {
			let url = this.getServiceUrl('health', 'srvhealth_nutrient_values_recommended_select', 'select');
			let req = {
				serviceName: 'srvhealth_nutrient_values_recommended_select',
				colNames: ['*'],
				order: [
					{
						colName: 'nutrient',
						orderType: 'desc' // asc升序  desc降序
					}
				]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				let result = res.data.data.filter(item => {
					if ((item.sex && item.sex.indexOf(self.userInfo.sex) !== -1) || !item.sex) {
						if (item.age_start && item.age_end) {
							return self.age >= item.age_start && self.age < item.age_end;
						} else if (item.age_start && !item.age_end) {
							return self.age >= item.age_start;
						} else if (!item.age_start && !item.age_end) {
							return true;
						} else {
							return false;
						}
					}
				});
				result.forEach(item => {
					self.energyListWrap.forEach(energy => {
						energy.matterList.forEach(mat => {
							if (item.nutrient === mat.name || item.nutrient.indexOf(mat.name) !== -1) {
								// mat.EAR = item.val_ear ? item.val_ear : mat.EAR;
								mat.UL = item.val_ul ? item.val_ul : mat.UL;
								mat.EAR = item.val_rni ? item.val_rni : mat.EAR;
								if (energy.title !== '水溶性维生素') {
									mat.UL = item.val_ul ? item.val_ul : mat.UL;
								} else {
									mat.UL = 0;
								}
								if (mat.name === '蛋白') {
									mat.EAR = item.val_rni ? item.val_rni * self.userInfo.weight : item.val_ear ? item.val_ear * self.userInfo.weight : mat.EAR * self.userInfo.weight;
									mat.UL = 0;
								}
							} else {
								if (mat.name === '脂肪') {
									mat.EAR = Number((self.userInfo.weight * 50 * 0.2) / 9).toFixed(2);
									mat.UL = 0;
								}
								if (mat.name === '碳水') {
									mat.EAR = self.userInfo.weight * 4;
									mat.UL = 0;
								}
							}
						});
					});
				});
				return result;
			}
		},
		async getDietRecord(chooseDate = null) {
			//饮食记录
			if (chooseDate) {
				this.selectDate = chooseDate;
			}
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'userno',
						ruleType: 'like',
						value: this.loginUserInfo.user_no
					},
					{
						colName: 'user_name',
						ruleType: 'like',
						value: this.userInfo.name
					},
					{
						colName: 'hdate',
						ruleType: 'like',
						value: chooseDate ? chooseDate.trim() : this.selectDate.trim()
					}
				],
				order: [
					{
						colName: 'create_time',
						orderType: 'desc'
					}
				]
			};
			let res = await this.$http.post(url, req);
			let energyList = this.energyListWrap;
			energyList.forEach(item => {
				item.matterList.forEach(mat => {
					mat['value_left'] = 0;
					mat['right_width'] = 30;
					mat['left_width'] = (90 * mat.EAR) / mat.UL;
					mat['center_width'] = 90 - (90 * mat.EAR) / mat.UL;
					if (item.title === '水溶性维生素') {
						mat['right_width'] = 0;
						mat['left_width'] = 30;
						mat['center_width'] = 90;
					}
					if (item.title === '有机大分子') {
						mat['right_width'] = 0;
						mat['left_width'] = 50;
						mat['center_width'] = 70;
					}
					if (mat.center_width * 3 < mat.left_width || mat.center_width * 3 < mat.right_width) {
						mat.left_width = mat.left_width - mat['center_width'];
						mat.right_width = mat.right_width - mat['center_width'];
						mat['center_width'] = 3 * mat['center_width'];
					}
				});
			});
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				let dietIn = 0;
				res.data.data.forEach(item => {
					dietIn += item.energy;
				});
				this.dietIn = dietIn;
				uni.$emit('dietInChange', dietIn);
				console.log(this.foodType);
				this.dietRecord = res.data.data;
			} else if (res.data.state === 'SUCCESS' && res.data.data.length === 0) {
				this.dietRecord = [];
				this.dietIn = 0;
				this.energyListWrap.forEach(i => {
					i.matterList.forEach(at => {
						at.value = 0;
					});
				});
			}
			this.energyListWrap = await this.buildDietData();
			this.energyList = this.deepClone(energyList);
			this.changeSub(4);
			return res.data.data;
		},
		async getBaseInfo() {
			// 使用user_no查找基本信息
			await this.getNutrientRecommended();
			this.getDietRecord().then(res => {
				let condition = null;
				if (Array.isArray(res) && res.length > 0) {
					let names = res.map(item => item.name);
					condition = [
						{
							colName: 'name',
							ruleType: 'in',
							value: names.toString()
						}
					];
					this.getFoodType(condition);
				}
			});
		},
		async getFoodType(cond) {
			// 食物类型
			let url = this.getServiceUrl('health', 'srvhealth_diet_contents_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_contents_select',
				colNames: ['*'],
				condition: [],
				order: []
			};
			if (cond) {
				req.condition = cond;
			}
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && res.data.data.length > 0) {
				console.log(res.data.data);
				this.foodType = res.data.data;
			}
			return res.data.data;
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
		async initPage() {
			let userInfo = uni.getStorageSync('login_user_info');
			if (userInfo && userInfo.user_no) {
				this.loginUserInfo = userInfo;
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
					// await this.getCurrUserInfo(); // 查找健康app个人基本信息
					let userInfo = await this.selectBasicUserList();
					if (userInfo) {
						this.userInfo = userInfo;
					}
					// if (uni.getStorageSync('current_user_info')) {
					// 	this.userInfo = uni.getStorageSync('current_user_info');
					// } else {
					// 	let userList = uni.getStorageSync('user_info_list');
					// 	if (Array.isArray(userList) && userList.length > 0) {
					// 		let name = uni.getStorageSync('current_user');
					// 		if (name) {
					// 			userList.forEach(item => {
					// 				if (item.name === name) {
					// 					uni.setStorageSync('current_user', item.name);
					// 					uni.setStorageSync('current_user_info', item);
					// 					this.userInfo = item;
					// 				}
					// 			});
					// 		} else {
					// 			uni.setStorageSync('current_user_info', userList[0]);
					// 			uni.setStorageSync('current_user', userList[0].name);
					// 			this.userInfo = userList[0];
					// 		}
					// 	}
					// }
					if (!this.wxUserInfo) {
						await this.getUserInfo(); //查找微信用户基本信息
					}
					if (!this.serviceLog) {
						await this.selectServiceLog();
					}
					// #ifdef MP-WEIXIN
					this.currentChart = 'stepChart';
					this.getwxStepInfoList().then(_ => {
						//获取微信运动记录
					});
					// #endif
				}
			}
			console.log(this.pageType);
			switch (this.pageType) {
				case 'diet':
					this.pageName = '饮食记录';
					this.showCanvas('calories');
					break;
				case 'sport':
					this.pageName = '运动记录';
					this.showCanvas('step');
					break;
				case 'weight':
					this.pageName = '体重记录';
					this.showCanvas('weight');
					break;
				case 'bp':
					this.pageName = '血压记录';
					this.showCanvas('BP');
					break;
				case 'sleep':
					this.pageName = '睡眠记录';
					this.showCanvas('sleep');
					break;
				case 'all':
					this.pageName = '历史记录';
					// #ifdef MP-WEIXIN
					this.showCanvas('step');
					// #endif
					// #ifdef H5
					this.showCanvas('weight');
					// #endif
					break;
			}
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
							uni.setStorageSync('activeApp', 'health');
							uni.navigateTo({
								url: '/publicPages/form/form?serviceName=srvhealth_person_info_add&type=add&cond=' + decodeURIComponent(JSON.stringify(condition))
							});
						}
					}
				});
			}
		}
	},
	onShow() {
		this.initPage();
	},
	onLoad(option) {
		if (option.isAll) {
			this.isAllPages = true;
		}
		if (option.customer_no) {
			this.customer_no = option.customer_no;
		}
		if (option.pageType) {
			this.pageType = option.pageType;
		}
	}
};
</script>

<style scoped lang="scss">
.history-wrap {
	.switch-type {
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		color: #fff;
		padding-right: 20rpx;
	}
	.top {
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		background-color: #fff;
		width: 100%;
		// margin-bottom: 20rpx;
		min-height: 80rpx;
		align-items: center;
		.cuIcon-triangledownfill {
			font-size: 54rpx;
		}
	}
}
.history-chart {
	padding: 20rpx;
	background-color: #fff;
}
.history-box {
	// padding: 20rpx;
	font-size: 30rpx;
	font-weight: 700;
	width: 100%;
	.history-content {
		width: 100%;
		.other-record {
			margin: 20rpx auto;
			width: calc(100% - 40rpx);
			.record-title {
				text-align: center;
				padding: 20rpx 0;
				background-color: #fff;
				border-radius: 20rpx 20rpx 0 0;
			}
			.record-data {
				background-color: #fff;
				display: flex;
				// justify-content: center;
				align-items: center;
				flex-direction: column;
				font-weight: normal;
				min-height: 250rpx;
				padding: 0 20rpx 40rpx;
				flex: 1;
				justify-content: flex-end;
				border-radius: 0 0 20rpx 20rpx;
				.last-data {
					padding: 0 0 10rpx;
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: flex-end;
					.digital {
						font-size: 60rpx;
						font-weight: 700;
						color: #0081ff;
					}
					.unit {
						font-size: 30rpx;
						color: #66abff;
						margin-left: 10rpx;
					}
				}
				.date {
					color: #999;
					fons: 24rpx;
				}
			}
			.nav-button {
				background-color: #0bc99d;
				color: #fff;
				border-radius: 50rpx;
				margin-top: 50rpx;
				width: 200rpx;
				height: 50rpx;
				line-height: 50rpx;
				font-size: 28rpx;
			}
			.bmi-box {
				width: 100%;
				display: flex;
				padding: 40rpx 20rpx 80rpx;
				background-color: #fff;
				margin: 20rpx 0;
				border-radius: 20rpx;
				height: 410rpx;
				.bmi-box-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					text-align: center;
					margin: 20rpx 0;
					height: 100rpx;
					.title {
						color: #999;
						font-size: 24rpx;
						font-weight: normal;
					}
					.digit {
						color: #333;
						font-weight: 700;
						font-size: 30rpx;
						&.bmi {
							font-size: 60rpx;
						}
					}
				}
				.bmi-bar-box {
					width: 100%;
					display: flex;
					flex-direction: column;
					text-align: center;
					justify-content: center;
					align-items: center;
					font-weight: normal;
					.bmi-label {
						display: flex;
						position: relative;
						width: 500rpx;
						height: 40rpx;
						line-height: 40rpx;
						color: #666;
						font-size: 24rpx;
						.label {
							position: absolute;
							left: -80rpx;
						}
						.value {
							flex: 1;
						}
					}
					.bmi-bar {
						padding: 10rpx 0;
						display: flex;
						width: 100%;
						justify-content: center;
						.bar-box {
							width: 150rpx;
							position: relative;
							margin-top: 10rpx;
							.scale {
								position: absolute;
								top: -40rpx;
								font-size: 50rpx;
								left: 0;
								transition: left 2s ease;
							}
							.bar {
								height: 40rpx;
								color: #f1f1f1;
							}
						}
						.bar1 {
							margin-right: 4rpx;
							.bar {
								background-color: #40c0fd;
								border-top-left-radius: 50rpx;
								border-bottom-left-radius: 50rpx;
							}
							.active-label {
								background-color: #40c0fd;
							}
						}
						.bar2 {
							margin-right: 4rpx;
							.bar {
								background-color: #4acdba;
							}
							.active-label {
								background-color: #4acdba;
							}
						}
						.bar3 {
							margin-right: 4rpx;
							.bar {
								background-color: #fad650;
							}
							.active-label {
								background-color: #fad650;
							}
						}
						.bar4 {
							.bar {
								background-color: #f7b235;
								border-top-right-radius: 50rpx;
								border-bottom-right-radius: 50rpx;
							}
							.active-label {
								background-color: #f7b235;
							}
						}
					}
				}
			}
			.history-record {
				margin-top: 20rpx;
				background-color: #fff;
				border-radius: 20rpx;
				.title {
					padding: 20rpx;
					border-bottom: 1px solid #f1f1f1;
				}
				.list-box {
					display: flex;
					flex-direction: column;
					padding: 20rpx;
					.list-item {
						padding: 20rpx 0;
						display: flex;
						justify-content: space-around;
						border-bottom: 1rpx solid #f1f1f1;
						align-items: center;
						.icon {
							width: 50rpx;
							height: 50rpx;
							margin-right: 20rpx;
						}
						.item {
							text-align: center;
							&:last-child {
								flex: 1;
								text-align: right;
								font-weight: normal;
								color: #999;
							}
							.label {
								font-size: 28rpx;
								margin: 10rpx;
							}
							.digital {
								font-size: 40rpx;
							}
						}
						.label {
							font-weight: normal;
							font-size: 24rpx;
						}
					}
				}
			}
		}
	}
}
.date-switch {
	padding: 20rpx;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: #fff;
	.button-item {
		flex: 1;
		text-align: center;
		margin-right: 20rpx;
		background-color: #fff;
		color: #333;
		&.bg-blue {
			background-color: #0081ff;
			color: #fff;
		}
		&:last-child {
			margin-right: 0;
		}
	}
}
.history-chart {
	width: 100%;
	height: 400rpx;
	.uni-ec-charts {
		width: 100%;
		height: 100%;
	}
}

.switch-type-box {
	padding: 80rpx 50rpx 80rpx;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	.type-item {
		min-width: 100rpx;
		height: 60rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		&:last-child {
			margin-right: 0;
		}
	}
}
.button-box {
	background-color: #fff;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100rpx;
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
</style>
