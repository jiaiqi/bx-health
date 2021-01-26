<template>
	<view class="history-wrap">
		<cu-custom :isBack="true" @onBack="onBack">
			<block slot="content">{{ pageName ? pageName : '健康记录' }}</block>
		</cu-custom>
		<view class="history-chart" v-if="isAllPages">
			<uniEcCharts class="uni-ec-charts" id="uni-ec-canvas" v-if="currentChart === 'stepChart'" :ec="stepEcData"></uniEcCharts>
			<uniEcCharts class="uni-ec-charts" id="uni-ec-canvas" v-if="currentChart === 'canvasLineA'" :ec="weightEcData"></uniEcCharts>
			<uniEcCharts class="uni-ec-charts" id="uni-ec-canvas" v-if="currentChart === 'canvasLineB'" :ec="bpEcData"></uniEcCharts>
			<uniEcCharts class="uni-ec-charts" id="uni-ec-canvas" v-if="currentChart === 'canvasColumnD'" :ec="caloriesEcData"></uniEcCharts>
			<uniEcCharts class="uni-ec-charts" id="uni-ec-canvas" v-if="currentChart === 'canvasLineC'" :ec="sleepEcData"></uniEcCharts>
		</view>
		<view class="button-box" v-if="isAllPages">
			<button class="buttons" :class="{ active: currentChart === item.chartID }" size="mini" v-for="item in subList" :key="item.key" @click="showCanvas(item.key)">
				{{ item.name }}
			</button>
		</view>
		<view class="history-box" v-if="pageType">
			<view class="symptom-page" v-if="pageType === 'symptom'">
				<view class="symptom-item-list">
					<view class="symptom-item" v-for="item in symptomRecord" :key="item.id">
						<view class="name">{{ item.symptoms_name ? item.symptoms_name : '' }}</view>
						<view class="describe">{{ item.symptoms_remark ? item.symptoms_remark : '' }}</view>
						<view class="date">{{ item.create_time.slice(5, 16) }}</view>
					</view>
				</view>
				<button type="primary" class="cu-btn bg-blue button" v-if="pageType === 'symptom'" @click="toPages('symptom')">添加</button>
			</view>
			<view class="history-content">
				<dietList
					:chatChoseTime="chatChoseTime"
					:key="pageType"
					@changePageType="changePageType"
					:pageType="pageType"
					v-if="pageType === 'diet' || pageType === 'sport'"
				></dietList>
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
					<view class="record-title" v-if="pageType !== 'weight'">最新数据</view>
					<view class="record-data" v-if="pageType !== 'weight'">
						<view class="last-data" v-if="isArray(historyRecord) && historyRecord.length > 0 && pageType === 'bp'">
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
						<view class="last-data" v-if="isArray(historyRecord) && historyRecord.length > 0 && pageType === 'sleep'">
							<text class="digital" v-if="historyRecord[0].sleep_time">{{ historyRecord[0].sleep_time.slice(0, 5) }}</text>
							<text class="unit">(时长)</text>
						</view>
						<view class="date" v-if="isArray(historyRecord) && historyRecord.length > 0">
							<text class="cuIcon-time margin-right-xs"></text>
							{{ historyRecord[0].create_time.slice(0, 16) }}
						</view>
						<!-- customer_no:患者编号,有患者编号时意味着是医生账号从患者列表进入此页面,则没有记录数据的权限 -->
						<button class="nav-button" @click="toPages(pageType)" v-if="!this.customer_no">记录数据</button>
					</view>
					<view class="bmi-box" v-if="pageType === 'weight'">
						<view class="bmi-bar-box" v-if="bmi">
							<view class="last-data">
								<view class="text-gray create-time" v-if="isArray(historyRecord) && historyRecord.length > 0">{{ historyRecord[0].create_time }}</view>
								<view class="bmi-box-item">
									<view class="title">最新体重</view>
									<view class="digit bmi" v-if="isArray(historyRecord) && historyRecord.length > 0">
										{{ getFixedNum(historyRecord[0].weight) }}
										<text class="unit">kg</text>
									</view>
								</view>
								<view class="bmi-box-item" v-if="bmi">
									<view class="title">BMI</view>
									<view class="digit bmi">{{ bmi }}</view>
								</view>
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
							<button class="nav-button" @click="toPages(pageType)" v-if="!this.customer_no">记录数据</button>
						</view>
					</view>
					<view class="data-chart" v-if="pageType === 'weight' || pageType === 'bp'">
						<uniEcCharts class="uni-ec-charts" id="uni-ec-charts" :ec="weightChartOption" v-if="pageType === 'weight'"></uniEcCharts>
						<uniEcCharts class="uni-ec-charts" id="uni-ec-charts" :ec="BPChartOption" v-if="pageType === 'bp'"></uniEcCharts>
					</view>
					<view class="history-record">
						<view class="title">历史数据</view>
						<u-empty mode="history" v-if="historyRecord && historyRecord.length === 0"></u-empty>
						<view class="list-box cu-list" v-if="historyRecord && historyRecord.length > 0">
							<view
								class="cu-item list-item"
								:class="modalName == 'move-box-' + index ? 'move-cur' : ''"
								@touchstart="ListTouchStart"
								@touchmove="ListTouchMove"
								@touchend="ListTouchEnd"
								:data-target="'move-box-' + index"
								@tap="updateItem(item)"
								v-for="(item, index) in historyRecord"
								:key="index"
							>
								<image src="../static/icon/xueya.png" mode="" class="icon" v-if="pageType === 'bp'"></image>
								<image src="../static/icon/sleep.png" mode="" class="icon" v-if="pageType === 'sleep'"></image>
								<image src="../static/icon/tizhong.png" mode="" class="icon" v-if="pageType === 'weight'"></image>
								<view class="content">
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
									<view class="heart_rate" v-if="item.heart_rate">
										<view class="data">
											<text class="label cuIcon-likefill text-red margin-right-xs"></text>
											<text class="value">{{ item.heart_rate || '-' }}次/分</text>
										</view>
									</view>
								</view>
								<view class="action">
									<text class="cu-tag text-grey sm">{{ item.create_time.slice(10, 16) }}</text>
									<text class="cu-tag bg-grey sm">
										<text v-if="item.create_time.slice(0, 3) !== new Date().getFullYear()"></text>
										{{ getDate(item.create_time) }}
									</text>
								</view>
								<view class="move"><view class="bg-red" @click.stop="deleteItem(item)">删除</view></view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: showTypePopup }">
			<view class="cu-dialog" @tap.stop="">
				<view class="switch-type-box">
					<view class="type-item cu-btn round" :class="{ 'bg-blue': item.name === currentType }" v-for="item in typeList" :key="item.name" @click="currentType = item.name">
						{{ item.name }}
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniEcCharts from '@/components/uni-ec-canvas/uni-echart.vue';
import energyListWrap from './totalEnergyList.js';
import dietList from '@/archivesPages/components/balancedDiet/balancedDiet';
import dayjs from '../static/dayjs/dayjs.min.js';
import { mapState } from 'vuex';
export default {
	components: {
		uniEcCharts,
		dietList
	},
	data() {
		return {
			modalName: null,
			weightChartOption: {
				option: {}
			},
			BPChartOption: {
				option: {}
			},
			listTouchStart: 0,
			listTouchDirection: null,
			customer_no: '',
			chatChoseTime: '',
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
			pageName: '',
			symptomRecord: []
		};
	},
	computed: {
		...mapState({
			vuex_userInfo: state => state.user.userInfo,
			vuex_isLogin: state => state.app.isLogin,
			vuex_loginUserInfo: state => state.user.loginUserInfo
		}),
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
				if (Array.isArray(this.historyRecord) && this.historyRecord.length > 0) {
					if (this.historyRecord[0].weight) {
						return Number(((this.historyRecord[0].weight * 10000) / this.userInfo.height ** 2).toFixed(1));
					}
				} else {
					return Number(((this.userInfo.weight * 10000) / this.userInfo.height ** 2).toFixed(1));
				}
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
		buildBPOption(data) {
			data = this.deepClone(data);
			if (Array.isArray(this.weightForBmi) && this.weightForBmi.length === 3) {
				const yAxisData0 = data.map(item => 80); // 舒张压-正常
				const yAxisData01 = data.map(item => 90); // 舒张压-高
				const yAxisData02 = data.map(item => 120); // 收缩压-正常
				const yAxisData1 = data.map(item => 140); // 收缩压-高
				const yAxisData2 = data.map(item => item.diastolic_pressure); //舒张压
				const yAxisData3 = data.map(item => item.systolic_pressure); //收缩压
				const xAxisData = data.map(item => this.formateDate(item.create_time, 'MM-DD'));
				let max = data.map(item => item.systolic_pressure).sort((a, b) => b - a)[0] + 2;
				let min = data.map(item => item.diastolic_pressure).sort((a, b) => a - b)[0] - 2;
				const color = ['#40c0fd', '#9900FF', '#FAD650', '#F7B235'];
				let option = {
					backgroundColor: '#fff',
					legend: {
						show: true,
						top: '5%',
						// icon: 'roundRect',
						icon:
							'path://M1635.315872 398.277883a510.609754 510.609754 0 0 0-996.200768 0H0v227.443097h639.115104a510.609754 510.609754 0 0 0 996.200768 0H2274.430976v-227.443097zM1137.215488 910.024852a398.025421 398.025421 0 1 1 398.025421-398.025421A398.025421 398.025421 0 0 1 1137.215488 910.024852z',
						itemWidth: 20,
						itemHeight: 10,
						itemGap: 10,
						data: [
							{
								name: '舒张压-正常',
								icon: 'path://M0 1024V0h3072v1024H0z m4096 0V0h3072v1024H4096z m8192 0V0h3072v1024h-3072z m-4096 0V0h3072v1024H8192z'
							},
							{
								name: '舒张压-高',
								icon: 'path://M0 1024V0h3072v1024H0z m4096 0V0h3072v1024H4096z m8192 0V0h3072v1024h-3072z m-4096 0V0h3072v1024H8192z'
							},
							{
								name: '收缩压-高',
								icon: 'path://M0 1024V0h3072v1024H0z m4096 0V0h3072v1024H4096z m8192 0V0h3072v1024h-3072z m-4096 0V0h3072v1024H8192z'
							},
							{
								name: '收缩压-正常',
								icon: 'path://M0 1024V0h3072v1024H0z m4096 0V0h3072v1024H4096z m8192 0V0h3072v1024h-3072z m-4096 0V0h3072v1024H8192z'
							},
							{
								name: '舒张压',
								// icon:'circle',
								icon:
									'path://M1635.315872 398.277883a510.609754 510.609754 0 0 0-996.200768 0H0v227.443097h639.115104a510.609754 510.609754 0 0 0 996.200768 0H2274.430976v-227.443097zM1137.215488 910.024852a398.025421 398.025421 0 1 1 398.025421-398.025421A398.025421 398.025421 0 0 1 1137.215488 910.024852z'
							},
							{
								name: '收缩压',
								// icon:'circle',
								icon:
									'path://M1635.315872 398.277883a510.609754 510.609754 0 0 0-996.200768 0H0v227.443097h639.115104a510.609754 510.609754 0 0 0 996.200768 0H2274.430976v-227.443097zM1137.215488 910.024852a398.025421 398.025421 0 1 1 398.025421-398.025421A398.025421 398.025421 0 0 1 1137.215488 910.024852z'
							}
						]
					},
					grid: {
						top: '30%',
						left: '10%',
						right: '10%',
						bottom: '15%'
					},
					xAxis: {
						type: 'category',
						data: xAxisData,
						axisLine: {
							// y轴
							show: true
						},
						axisTick: {
							show: true
						},
						boundaryGap: true //false时X轴从0开始
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
							show: false
						},
						max: max,
						min: min
					},
					series: [
						{
							name: '舒张压-正常',
							type: 'line',
							symbol: 'none',
							data: yAxisData0,
							smooth: true,
							lineStyle: {
								type: 'dashed',
								width: 1
							},
							itemStyle: {
								normal: {
									color: color[0],
									borderColor: color[0]
								}
							}
						},
						{
							name: '舒张压-高',
							type: 'line',
							symbol: 'none',
							data: yAxisData01,
							smooth: true,
							lineStyle: {
								width: 1,
								type: 'dashed'
							},
							itemStyle: {
								normal: {
									color: color[3],
									borderColor: color[3]
								}
							}
						},
						{
							name: '收缩压-高',
							type: 'line',
							symbol: 'none',
							data: yAxisData1,
							smooth: true,
							lineStyle: {
								type: 'dashed',
								width: 1
							},
							itemStyle: {
								normal: {
									color: color[3],
									borderColor: color[3]
								}
							}
						},
						{
							name: '收缩压-正常',
							type: 'line',
							symbol: 'none',
							data: yAxisData02,
							smooth: true,
							lineStyle: {
								type: 'dashed',
								width: 1
							},
							itemStyle: {
								normal: {
									color: color[0],
									borderColor: color[0]
								}
							}
						},
						{
							name: '舒张压',
							type: 'line',
							data: yAxisData2,
							symbol: 'none',
							smooth: false,
							tooltip: { trigger: 'axis' },
							itemStyle: {
								normal: {
									color: color[1],
									borderColor: color[1]
								}
							}
						},
						{
							name: '收缩压',
							type: 'line',
							data: yAxisData3,
							symbol: 'none',
							smooth: false,
							tooltip: { trigger: 'axis' },
							itemStyle: {
								normal: {
									color: color[2],
									borderColor: color[2]
								}
							}
						}
					]
				};
				this.BPChartOption = { option };
			}
		},
		buildWeightOption(data) {
			data = this.deepClone(data);
			if (Array.isArray(this.weightForBmi) && this.weightForBmi.length === 3) {
				const weightRange = this.weightForBmi.map(item => item.weight.split('kg')[0]);
				const yAxisData0 = data.map(item => weightRange[0]);
				const yAxisData1 = data.map(item => weightRange[1] - weightRange[0]);
				const yAxisData2 = data.map(item => weightRange[2] - weightRange[1]);
				const yAxisData3 = data.map(item => weightRange[2] - weightRange[1]);
				const yAxisData4 = data.map(item => item.weight);
				let min = data.map(item => item.weight).sort((a, b) => a - b)[0] - 2;
				let max = data.map(item => item.weight).sort((a, b) => b - a)[0] + 2;
				const xAxisData = data.map(item => this.formateDate(item.create_time, 'MM-DD'));
				const color = ['#40c0fd', '#4ACDBA', '#FAD650', '#F7B235'];
				const hexToRgba = (hex, opacity) => {
					let rgbaColor = '';
					let reg = /^#[\da-f]{6}$/i;
					if (reg.test(hex)) {
						rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt('0x' + hex.slice(3, 5))},${parseInt('0x' + hex.slice(5, 7))},${opacity})`;
					}
					return rgbaColor;
				};

				let option = {
					backgroundColor: '#fff',
					legend: {
						show: true,
						top: '5%',
						icon: 'roundRect',
						itemWidth: 20,
						itemHeight: 10,
						itemGap: 10,
						data: [
							{
								name: '偏瘦',
								icon: 'roundRect'
							},
							{
								name: '正常',
								icon: 'roundRect'
							},
							{
								name: '超重',
								icon: 'roundRect'
							},
							{
								name: '肥胖',
								icon: 'roundRect'
							},
							{
								name: '体重',
								icon:
									'path://M1635.315872 398.277883a510.609754 510.609754 0 0 0-996.200768 0H0v227.443097h639.115104a510.609754 510.609754 0 0 0 996.200768 0H2274.430976v-227.443097zM1137.215488 910.024852a398.025421 398.025421 0 1 1 398.025421-398.025421A398.025421 398.025421 0 0 1 1137.215488 910.024852z'
							}
						]
					},
					grid: {
						top: '20%',
						left: '10%',
						right: '10%',
						bottom: '15%'
					},
					xAxis: {
						type: 'category',
						data: xAxisData,
						axisLine: {
							// y轴
							show: true
						},
						axisTick: {
							show: true
						},
						boundaryGap: false
					},
					tooltip: {},
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
							show: false
						},
						min: min,
						max: max
					},
					series: [
						{
							name: '偏瘦',
							type: 'line',
							data: yAxisData0,
							symbol: 'none',
							smooth: true,
							stack: 100,
							itemStyle: {
								normal: {
									color: hexToRgba(color[0], 0)
									// borderColor: color[0]
								}
							},
							lineStyle: {
								color: 'rgba(0,0,0,0)'
							},
							areaStyle: {}
						},
						{
							name: '正常',
							type: 'line',
							stack: 100,
							data: yAxisData1,
							symbol: 'none',
							smooth: true,
							itemStyle: {
								normal: {
									color: hexToRgba(color[1], 0.7)
									// borderColor: color[1]
								}
							},
							lineStyle: {
								color: 'rgba(0,0,0,0)'
							},
							areaStyle: {}
						},
						{
							name: '超重',
							type: 'line',
							stack: 100,
							data: yAxisData2,
							symbol: 'none',
							smooth: true,
							areaStyle: {},
							lineStyle: {
								color: 'rgba(0,0,0,0)'
							},
							itemStyle: {
								normal: {
									color: hexToRgba(color[2], 0.7)
									// borderColor: color[2]
								}
							}
						},
						{
							name: '肥胖',
							type: 'line',
							stack: 100,
							data: yAxisData3,
							symbol: 'none',
							smooth: true,
							areaStyle: {
								origin: 'end'
							},
							lineStyle: {
								color: 'rgba(0,0,0,0)'
							},
							itemStyle: {
								normal: {
									color: hexToRgba(color[3], 0.7)
									// borderColor: color[3]
								}
							}
						},
						{
							name: '体重',
							type: 'line',
							data: yAxisData4,
							smooth: false,
							symbol: 'none',
							label: {
								// show:true
							},
							legend: {
								icon: 'circle'
							},
							itemStyle: {
								normal: {
									color: '#55aaff'
								}
							}
						}
					]
				};
				this.weightChartOption = { option };
			}
		},
		updateItem(e) {
			uni.navigateTo({
				url: '/otherPages/otherIndicator/otherIndicator?type=' + this.pageType + '&submitType=update&formId=' + e.id
			});
		},
		deleteItem(e) {
			let serviceName = '';
			let req = [];
			let self = this;
			uni.showModal({
				title: '提示',
				content: '是否删除此条数据',
				success(res) {
					if (res.confirm) {
						switch (self.pageType) {
							case 'weight': //体重
								serviceName = 'srvhealth_body_fat_measurement_record_delete';
								req = [{ serviceName: 'srvhealth_body_fat_measurement_record_delete', condition: [{ colName: 'id', ruleType: 'in', value: e.id }] }];
								break;
							case 'sleep': //睡眠
								serviceName = 'srvhealth_sleep_record_delete';
								req = [{ serviceName: 'srvhealth_sleep_record_delete', condition: [{ colName: 'id', ruleType: 'in', value: e.id }] }];
								break;
							case 'bp': //血压
								serviceName = 'srvhealth_blood_pressure_record_delete';
								req = [{ serviceName: 'srvhealth_blood_pressure_record_delete', condition: [{ colName: 'id', ruleType: 'in', value: e.id }] }];
								break;
						}
						let url = self.getServiceUrl('health', serviceName, 'operate');
						self.$http.post(url, req).then(res => {
							if (res.data.state === 'SUCCESS') {
								uni.showToast({
									title: '删除成功'
								});
								self.initPage();
								self.getChartData();
							}
						});
					}
				}
			});
		},
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
				case 'symptom':
					let fieldsCond = [
						{ column: 'info_no', value: this.vuex_userInfo.no, condition: [{ colName: 'no', ruleType: 'eq', value: this.vuex_userInfo.no }] },
						{ column: 'user_account', value: this.vuex_userInfo.userno }
					];
					url = '/publicPages/newForm/newForm?serviceName=srvhealth_self_symptoms_record_add&type=add&fieldsCond=' + encodeURIComponent(JSON.stringify(fieldsCond));
					break;
			}
			this.showPopup = false;
			if (e !== 'food' && e !== 'sport') {
				if (e === 'pressure' || e === 'bp') {
					e = 'bp';
					url = '/otherPages/otherIndicator/otherIndicator?type=' + e;
					if (this.historyRecord.length > 0) {
						let data = this.historyRecord[0];
						url = `/otherPages/otherIndicator/otherIndicator?type=${e}&systolic_pressure=${data['systolic_pressure']}&diastolic_pressure=${data['diastolic_pressure']}&heart_rate=${
							data['heart_rate']
						}`;
					}
				}
				if (url) {
					uni.navigateTo({
						url: url
					});
				} else {
					uni.navigateTo({
						url: '/otherPages/otherIndicator/otherIndicator?type=' + e
					});
				}
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
					this.getwxStepInfoList().then(_ => {
						this.selectDataFromSportRecord(this.stepInfoList);
					});
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
			console.log(this.serviceLog);
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
					rownumber: 30
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
					this.buildWeightOption(res.data.data);
				} else if (type === 'bloodPressure') {
					series = this.BPChartData.series;
					series[0].data = res.data.data.map(item => {
						return Number(item.systolic_pressure.toFixed(1));
					});
					series[1].data = res.data.data.map(item => Number(item.diastolic_pressure.toFixed(1)));
					this.BPChartData.series = series;
					this.BPChartData.categories = res.data.data.map(item => dayjs(item.create_time).format('MM-DD'));
					this.chartData = this.buildEcData(this.BPChartData, 'mmHg', '血压');
					this.buildBPOption(res.data.data);
				}
				this.historyRecord = this.deepClone(res.data.data).reverse();
			} else {
				this.historyRecord = [];
				if (type === 'weight' && this.vuex_userInfo && this.vuex_userInfo.weight) {
					this.historyRecord = [
						{
							create_time: this.vuex_userInfo.modify_time ? this.vuex_userInfo.modify_time : this.vuex_userInfo.create_time,
							create_user_disp: this.vuex_userInfo.create_user_disp,
							modify_time: this.vuex_userInfo.modify_time,
							weight: this.vuex_userInfo.weight,
							name: this.vuex_userInfo.name,
							create_user: this.vuex_userInfo.create_user
						}
					];
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
				let data = await this.decryptData(result);
				return data;
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
							item.date = this.formateDate(item.timestamp * 1000).trim();
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
		async selectDataFromSportRecord(stepList) {
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_body_activity_record_select',
				colNames: ['*'],
				condition: [{ colName: 'userno', ruleType: 'like', value: this.vuex_userInfo.userno }, { colName: 'name', ruleType: 'like', value: '手机计步' }],
				relation_condition: {},
				page: { pageNo: 1, rownumber: 31 }
			};
			let timeRange = {
				start: '',
				end: ''
			};
			timeRange.end = dayjs().format('YYYY-MM-DD');
			timeRange.start = dayjs()
				.subtract(31, 'days')
				.format('YYYY-MM-DD');
			req.condition = req.condition.concat([{ colName: 'hdate', ruleType: 'lt', value: timeRange.end }, { colName: 'hdate', ruleType: 'gt', value: timeRange.start }]);
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				let dateArr = res.data.data.map(item => item.hdate.trim()).push(dayjs().format('YYYY-MM-DD'));
				let pushData = [];
				if (Array.isArray(stepList) && stepList.length > 0) {
					stepList.forEach(item => {
						if (!dateArr.includes(item.date)) {
							pushData.push({
								userno: this.vuex_userInfo.userno,
								hdate: item.date,
								htime: '00:00:00',
								name: '手机计步',
								unit: '步',
								amount: item.step,
								energy: (item.step * 150) / 1000,
								user_name: this.vuex_userInfo.name
							});
						}
					});
				}
				pushData = pushData.reverse();
				if (pushData.length > 0) {
					this.insertStepData(pushData);
				}
			}
		},
		async insertStepData(data) {
			let url = this.getServiceUrl('health', 'srvhealth_body_activity_record_add', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_body_activity_record_add',
					condition: [],
					data: data
				}
			];
			await this.$http.post(url, req);
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
				this.$store.commit('SET_WX_USERINFO', userInfo);
				if (userInfo.headimgurl) {
					this.src = userInfo.headimgurl;
				}
			} else {
				// 没有用户信息
			}
		},
		async getSymptomRecord() {
			// 症状记录
			let userInfo = this.vuex_userInfo;
			if (userInfo && userInfo.no) {
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
				let url = this.getServiceUrl('health', 'srvhealth_self_symptoms_record_select', 'select');
				let req = {
					serviceName: 'srvhealth_self_symptoms_record_select',
					colNames: ['*'],
					condition: [
						{
							colName: 'create_time',
							ruleType: 'lt',
							value: timeRange.end
						},
						{
							colName: 'create_time',
							ruleType: 'gt',
							value: timeRange.start
						},
						{
							colName: 'info_no',
							ruleType: 'eq',
							value: this.vuex_userInfo.no
						}
					]
				};
				let res = await this.$http.post(url, req);
				if (Array.isArray(res.data.data)) {
					this.symptomRecord = res.data.data;
				}
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
					// #ifdef MP-WEIXIN
					const result = await wx.login();
					if (result.code) {
						this.code = result.code;
						await this.wxLogin({ code: result.code });
						await this.initPage();
					}
					// #endif
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
				case 'symptom':
					this.pageName = '症状记录';
					// this.showCanvas('sleep');
					this.getSymptomRecord();
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
		getDate(e) {
			if (new Date(e).getFullYear() !== new Date().getFullYear()) {
				return e.slice(0, 10);
			} else {
				return e.slice(5, 10);
			}
		},
		/*查询当前登录人创建得用户信息**/
		async getCurrUserInfo() {
			let self = this;
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
					this.$store.commit('SET_USERINFO', res.data.data[0]);
					if (!this.$store.state.app.subscsribeStatus) {
						this.checkSubscribeStatus();
					}
				}
				uni.setStorageSync('user_info_list', res.data.data);
				return res.data.data;
			} else if (res.data.resultCode === '0011') {
				// 登录失效 进行静默登录
				this.isLogin = false;
				this.$store.commit('SET_LOGIN_STATE', false);
				const result = await wx.login();
				if (result.code) {
					this.code = result.code;
					await this.wxLogin({ code: result.code });
					// await this.initPage();
				}
			} else if (Array.isArray(res.data.data) && res.data.data.length === 0) {
				// 没有角色 提示跳转到创建角色页面
				self.toAddPage();
			}
		},
		onBack() {
			uni.$emit('data-update');
		},

		// ListTouch触摸开始
		ListTouchStart(e) {
			this.listTouchStart = e.touches[0].pageX;
		},

		// ListTouch计算方向
		ListTouchMove(e) {
			this.listTouchDirection = e.touches[0].pageX - this.listTouchStart > 0 ? 'right' : 'left';
		},

		// ListTouch计算滚动
		ListTouchEnd(e) {
			if (this.listTouchDirection == 'left') {
				this.modalName = e.currentTarget.dataset.target;
			} else {
				this.modalName = null;
			}
			this.listTouchDirection = null;
		}
	},
	onShow() {
		this.initPage();
	},
	onLoad(option) {
		uni.$on('deleteItem', () => {
			this.initPage();
			this.getChartData();
		});
		if (option.isAll) {
			this.isAllPages = true;
		}
		if (option.customer_no) {
			this.customer_no = option.customer_no;
		}
		if (option.pageType) {
			this.pageType = option.pageType;
		}
		if (option.chatChoseTime) {
			this.chatChoseTime = option.chatChoseTime;
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
	.symptom-page {
		display: flex;
		flex-direction: column;
		height: calc(100vh - var(--window-top) - var(--window-bottom) - 200rpx);
		.symptom-item-list {
			flex: 1;
			padding: 20rpx;
		}
		.button {
			width: calc(100% - 40rpx);
			margin: 50rpx auto;
		}
		.symptom-item {
			display: inline-flex;
			width: calc(50% - 6rpx);
			min-height: 180rpx;
			margin-right: 10rpx;
			flex-direction: column;
			background-color: #fff;
			margin-bottom: 10rpx;
			padding: 20rpx;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
			font-weight: normal;
			&:nth-child(2n) {
				margin-right: 0;
			}
			.name {
				font-weight: bold;
			}
			.describe {
				flex: 1;
				padding: 10rpx;
				// background-color: #f8f8f8;
			}
			.date {
				color: #999;
			}
		}
	}
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
				padding: 40rpx 20rpx;
				background-color: #fff;
				margin: 20rpx 0;
				border-radius: 20rpx;
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
					.last-data {
						width: 100%;
						display: flex;
						flex-wrap: wrap;
						justify-content: space-around;
						.create-time {
							width: 100%;
						}
						.unit {
							font-size: 32rpx;
							color: #666;
							margin-left: 5rpx;
						}
					}
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
			.data-chart {
				height: 400rpx;
				margin-top: 20rpx;
				background-color: #fff;
				border-radius: 20rpx;
				overflow: hidden;
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
					overflow: hidden;
					.list-item {
						padding: 20rpx 0;
						display: flex;
						justify-content: space-around;
						border-bottom: 1rpx solid #f1f1f1;
						align-items: center;
						padding: 20rpx;
						.content {
							display: flex;
							flex: 1;
							align-items: center;
						}
						.heart_rate {
							padding: 0 20rpx;
							display: flex;
							flex: 1;
							align-items: center;
							justify-content: flex-end;
							.data {
								font-size: 26rpx;
								width: 140rpx;
							}
						}
						.action {
							display: flex;
							flex-direction: column;
							border-radius: 10rpx;
							overflow: hidden;
							// width: 150rpx;
							.cu-tag {
								margin-left: 0;
								display: flex;
								justify-content: flex-end;
							}
						}
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
	.buttons {
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
