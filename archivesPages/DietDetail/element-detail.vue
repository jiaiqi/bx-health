<template>
	<view class="diet-visual">
		<view v-if="dietInfo" class="view-tabs">
			<view class="view-tab" :class="{ 'active-tab': showChart }" @click="switchTab(true)">推荐摄入占比</view>
			<view class="view-tab" :class="{ 'active-tab': !showChart }" @click="switchTab(false)">营养素含量</view>
		</view>
		<view class="crowd-list" v-if="(dietInfo.food_no || dietInfo.meal_no) && !dietInfo.diet_record_no">
			<view class="crowd-item" :class="{ 'active-crowd': currentCrowd === item.type }" v-for="item in crowdList" :key="item.type" @click="changeCrowd(item)">
				<text v-if="item.weight">{{ item.name }}({{ item.weight }}kg)</text>
				<text v-else>我的(待完善信息)</text>
			</view>
		</view>
		<view class="visual-detail chart" v-if="showChart"><uni-echarts class="uni-ec-canvas" ref="uni-ec-canvas2" canvas-id="uni-ec-canvas2" :ec="chartData" /></view>
		<view class="visual-detail" v-if="!showChart">
			<view class="ele-item" v-for="item in eleData" :key="item.title">
				<view class="title">{{ item.title }}</view>
				<view class="content">
					<view class="ele-item" v-for="ele in item.matterList" :key="ele.key">
						<text class="label">{{ ele.label }}：</text>
						<text class="value">{{ dietInfo[ele.key] ? Number(dietInfo[ele.key]).toFixed(1) : '' }}</text>
						<text
							:class="{
								'text-red': getElementLevel('protein', dietInfo[ele.key]) === '低',
								'text-orange': getElementLevel('protein', dietInfo[ele.key]) === '中',
								'text-green': getElementLevel('protein', dietInfo[ele.key]) === '高'
							}"
						>
							({{ getElementLevel('protein', dietInfo[ele.key]) }})
						</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import eleData from './data.js';
import uniEcharts from '@/components/uni-ec-canvas/uni-echart.vue';
export default {
	components: {
		uniEcharts
	},
	computed: {
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
		},
		age() {
			if (this.userInfo && this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
				return age;
			}
		}
	},
	data() {
		return {
			showChart: true,
			eleData: eleData,
			nutrientList: [],
			chartData: {},
			currentCrowd: 'man',
			crowdList: [
				{
					name: '男性',
					type: 'man',
					sex: '男',
					age: 18,
					weight: 65
				},
				{
					name: '女性',
					type: 'woman',
					sex: '女',
					age: 18,
					weight: 55
				},
				{
					name: '我的',
					type: 'mine',
					sex: '',
					age: '',
					weight: ''
				}
			]
		};
	},
	props: {
		dietInfo: {
			type: Object
		},
		dietList: {
			type: Array
		},
		userInfo: {
			type: Object
		}
		// chartData: {
		// 	type: Object
		// }
	},
	watch: {
		userInfo: {
			deep: true,
			immediate: true,
			handler(newValue, oldValue) {
				if (newValue && newValue.sex && newValue.weight) {
					this.crowdList[2].sex = this.userInfo.sex;
					this.crowdList[2].age = this.age;
					this.crowdList[2].weight = this.userInfo.weight;
					this.currentCrowd = 'mine';
				}
			}
		},
		dietInfo: {
			handler(newValue, oldValue) {
				if (newValue && (newValue.diet_record_no || newValue.food_no || newValue.meal_no)) {
					this.switchTab(true);
				}
			}
		}
	},
	methods: {
		changeCrowd(item) {
			// 切换人群
			let self = this
			if (item.type === 'mine' && (!item.age || !item.sex)) {
				uni.showModal({
					title: '提示',
					content: '当前没有进行登记年龄、性别或体重，是否去登记?',
					success: function(res) {
						if (res.confirm) {
							let pageStack = getCurrentPages()
							if (Array.isArray(pageStack) && pageStack.length >= 1) {
								let currentPage = pageStack[pageStack.length - 1]
								self.$store.commit('SET_PRE_PAGE_URL', currentPage.$page.fullPath)
							}
							uni.redirectTo({
								url: '/otherPages/chooseFood/myFoodsInfo'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			} else {
				this.currentCrowd = item.type;
				this.getNutrientRecommended().then(_ => {
					this.buildChartOption();
				});
			}
		},
		switchTab(show) {
			this.showChart = show;
			if (show) {
				this.getNutrientRecommended().then(_ => {
					this.buildChartOption();
				});
			}
		},
		async getNutrientRecommended() {
			let self = this;
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
			let weight = self.currentCrowd === 'man' ? 65 : self.currentCrowd === 'woman' ? 55 : self.userInfo.weight;
			let age = self.currentCrowd === 'man' || self.currentCrowd === 'woman' ? 18 : self.age;
			let sex = self.currentCrowd === 'man' ? '男' : self.currentCrowd === 'woman' ? '女' : self.userInfo.sex;
			debugger;
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				let result = res.data.data.filter(item => {
					if ((item.sex && item.sex.indexOf(sex) !== -1) || !item.sex) {
						if (item.age_start && item.age_end) {
							return age >= item.age_start && age < item.age_end;
						} else if (item.age_start && !item.age_end) {
							return age >= item.age_start;
						} else if (!item.age_start && !item.age_end) {
							return true;
						} else {
							return false;
						}
					}
				});
				result.forEach(item => {
					self.eleData.forEach(energy => {
						energy.matterList.forEach(mat => {
							if (item.nutrient === mat.name || item.nutrient.indexOf(mat.name) !== -1) {
								mat.UL = item.val_ul ? item.val_ul : mat.UL;
								mat.EAR = item.val_rni ? item.val_rni : mat.EAR;
								if (energy.title !== '水溶性维生素') {
									mat.UL = item.val_ul ? item.val_ul : mat.UL;
								} else {
									mat.UL = 0;
								}
								if (mat.name === '蛋白') {
									mat.EAR = item.val_rni ? item.val_rni * weight : item.val_ear ? item.val_ear * weight : mat.EAR * weight;
									mat.UL = 0;
								}
							} else {
								if (mat.name === '脂肪') {
									mat.EAR = Number((weight * 50 * 0.2) / 9).toFixed(2);
									mat.UL = 0;
								}
								if (mat.name === '碳水') {
									mat.EAR = weight * 4;
									mat.UL = 0;
								}
							}
						});
					});
				});
				this.nutrientList = result;
				return result;
			}
		},
		getEnergyListValue(foodInfo) {
			let currentDiet = this.deepClone(this.dietInfo);
			if (currentDiet.amount === 0) {
				currentDiet.amount = 1;
			}
			let dietRecordList = this.deepClone(this.dietList);
			let energyList = this.deepClone(this.eleData);
			let eleArr = [];
			let weight = this.currentCrowd === 'man' ? 65 : this.currentCrowd === 'woman' ? 55 : this.userInfo.weight;
			energyList.forEach(item => {
				item.matterList.forEach(ele => {
					// ele.UL = item.val_ul ? item.val_ul : ele.UL;
					// ele.EAR = item.val_rni ? item.val_rni : ele.EAR;
					// if (energy.title !== '水溶性维生素') {
					// 	ele.UL = item.val_ul ? item.val_ul : ele.UL;
					// } else {
					// 	ele.UL = 0;
					// }
					// if (ele.name === '蛋白') {
					// 	ele.EAR = item.val_rni ? item.val_rni * self.userInfo.weight : item.val_ear ? item.val_ear * self.userInfo.weight : ele.EAR * self.userInfo.weight;
					// 	ele.UL = 0;
					// }

					if (ele.name === '脂肪') {
						ele.EAR = Number((weight * 50 * 0.2) / 9).toFixed(2);
						ele.UL = 0;
					}
					if (ele.name === '碳水') {
						ele.EAR = weight * 4;
						ele.UL = 0;
					}
					ele.value = 0;
					eleArr.push(ele);
				});
			});
			let foodTypes = this.deepClone(dietRecordList);
			let energyInfo = {
				EAR: this.basicOut,
				UL: 0,
				key: 'energy',
				label: '热量',
				name: '热量',
				shortName: '热量',
				value: 0
			};
			eleArr.unshift(energyInfo);
			eleArr = eleArr.map(ele => {
				dietRecordList.forEach(diet => {
					if (diet.diet_record_no === currentDiet.diet_record_no || diet.food_no === currentDiet.food_no || diet.meal_no === currentDiet.meal_no) {
						// diet = currentDiet;
					} else {
						return;
					}
					let ratio = 1;
					if (diet['unit'] === 'g') {
						if (diet.unit_amount) {
							ratio = diet.amount;
						} else if (diet.unit_weight_g) {
							ratio = diet.amount;
						}
					} else if (diet['unit'].indexOf('g') === -1) {
						if (diet.unit_weight_g) {
							ratio = (diet.unit_weight_g * diet.amount) / 100;
						} else {
							ratio = diet.amount;
						}
					} else {
						ratio = (diet.unit_weight_g * diet.amount) / (diet.unit_amount ? diet.unit_amount : 100);
					}
					if (ele['key'] === 'energy') {
						if (!diet.energy && diet.unit_energy) {
							ele.value = ele.value + diet['unit_energy'] * ratio;
						} else {
							ele.value = ele.value + diet[ele['key']];
						}
					} else {
						ele.value = ele.value + diet[ele['key']] * ratio;
					}
				});
				return ele;
			});
			return eleArr;
		},
		async buildChartOption(dietInfo) {
			let currentDiet = this.deepClone(this.dietInfo);
			if (currentDiet.amount === 0) {
				currentDiet.amount = 1;
			}
			let serviceName = '';
			let eleArr = this.getEnergyListValue();
			let category = eleArr.map(item => {
				return item.name;
			});
			let legendData = ['其它食物', '当前食物', '%推荐摄入量'];
			if ((currentDiet.food_no || currentDiet.meal_no) && !currentDiet.diet_record_no) {
				legendData = ['当前食物', '%推荐摄入量'];
			}
			let seriesData = legendData.map(le => {
				let obj = {
					name: le,
					data: []
				};
				obj.type = 'bar';
				obj.stack = '营养素';
				let data = eleArr.map(item => {
					let num = (item.value * 100) / Number(item.EAR);
					num = parseFloat(num.toFixed(1));
					return num;
				});
				switch (le) {
					case '其它食物':
						obj.data = eleArr.map(ele => {
							let cur = this.deepClone(ele);
							let ratio = 1;
							if (currentDiet.unit.indexOf('g') === -1) {
								if (currentDiet.unit_amount === 100) {
									ratio = 1;
								}
								if (currentDiet.unit_amount === 100 && currentDiet.unit_weight_g && currentDiet.unit_weight_g > 1) {
									ratio = currentDiet.unit_weight_g / currentDiet.unit_amount;
								}
							} else {
								if (currentDiet.unit_weight_g > 1) {
									ratio = currentDiet.unit_weight_g / 100;
								}
							}
							let val = cur.value - currentDiet[cur.key] * ratio * currentDiet.amount;
							if (cur.key === 'energy') {
								val = cur.value - currentDiet['unit_energy'];
							}
							let num = (val * 100) / Number(cur.EAR);
							num = parseFloat(num.toFixed(1));
							return num;
						});
						break;
					case '当前食物':
						debugger;
						obj.data = eleArr.map(ele => {
							debugger;
							let cur = this.deepClone(ele);
							let ratio = 1;
							if (currentDiet.unit.indexOf('g') !== -1 && currentDiet.unit_weight_g > 1) {
								ratio = currentDiet.unit_weight_g / 100;
							}
							let val = currentDiet[cur.key] * ratio * currentDiet.amount;
							if (!currentDiet[cur.key]) {
								val = 0;
							}
							if (cur.key === 'energy') {
								val = currentDiet['unit_energy'];
							}
							let num = (val * 100) / Number(cur.EAR);
							num = parseFloat(num.toFixed(1));
							return num;
						});
						break;
					case '%推荐摄入量':
						obj.type = 'line';
						obj.stack = false;
						obj.data = eleArr.map(item => {
							return 100;
						});
						break;
				}
				return obj;
			});
			let option = {
				color: ['#92d050', '#f79646', '#4f81bd'],
				title: {
					text: ''
				},
				tooltip: {
					show: true,
					trigger: 'axis'
				},
				legend: {
					data: legendData
				},
				grid: {
					left: '10px',
					right: '10px',
					bottom: '3%',
					top: '12%',
					containLabel: true
				},
				xAxis: [
					{
						type: 'category',
						data: category,
						axisLabel: {
							rotate: 70,
							interval: 0,
							fontSize: 10
						}
					}
				],
				yAxis: [
					{
						// max:(eleArr.sort((a,b)=>b.value-a.value)[0].value)*0.1 +10,
						type: 'value',
						axisLabel: {
							// formatter: `{value}%`
							formatter(val) {
								return `${parseInt(val.toFixed(1))}%`;
							}
						}
					}
				],
				series: []
			};
			// let maxVal = eleArr.sort((a,b)=>b.value/Number(b.EAR) -a.value/Number(a.EAR))[0]
			// option.yAxis[0].max = (maxVal.value*100/maxVal.EAR)+10;
			option.series = seriesData;
			let result = {
				option: option
			};
			console.log(eleArr);
			this.chartData = result;
		},
		getElementLevel(ele, val) {
			let result = '';
			let level = {
				protein: {
					over: 30.1,
					low: 15.5
				},
				carbohydrate: {
					over: 51.9,
					low: 25.74
				},
				axunge: {
					over: 35.3,
					low: 17.6
				},
				vitamin_a: {
					over: 915,
					low: 457
				},
				vitamin_e: {
					over: 27.9,
					low: 13.9
				},
				vitamin_b1: {
					over: 0.61,
					low: 0.32
				},
				vitamin_b2: {
					over: 0.79,
					low: 0.4
				},
				vitamin_b3: {
					over: 4.52,
					low: 2.26
				},
				vitamin_c: {
					over: 61.2,
					low: 30.6
				},
				element_ca: {
					over: 381,
					low: 190.5
				},
				element_mg: {
					over: 111.6,
					low: 55.8
				},
				element_p: {
					over: 296.4,
					low: 148.2
				},
				element_k: {
					over: 526.2,
					low: 263.1
				},
				element_fe: {
					over: 7.2,
					low: 3.6
				},
				element_zn: {
					over: 6,
					low: 3
				},
				element_se: {
					over: 23.82,
					low: 11.91
				},
				element_cu: {
					over: 1.12,
					low: 0.56
				},
				element_mn: {
					over: 4.44,
					low: 2.22
				}
			};
			try {
				result = val >= level[ele].over ? '高' : val < level[ele].over && val >= level[ele].low ? '中' : '低';
			} catch (e) {
				//TODO handle the exception
			}
			return result;
		}
	}
};
</script>

<style scoped lang="scss">
.diet-visual {
	width: 100%;
	.view-tabs {
		display: flex;
		width: 100%;
		margin: 10rpx 20rpx 0;
		.view-tab {
			text-align: center;
			line-height: 30rpx;
			font-size: 30rpx;
			border-bottom: 1px solid transparent;
			margin-right: 10px;
			color: #999;
			padding: 10rpx 0;
			&.active-tab {
				color: #fbbd08;
				font-weight: 700;
				border-color: #fbbd08;
			}
		}
	}
	.crowd-list {
		display: flex;
		padding: 20rpx;
		.crowd-item {
			border-radius: 50rpx;
			background-color: #f1f1f1;
			color: #ccc;
			border: 1rpx solid #ccc;
			padding: 10rpx 20rpx;
			& + .crowd-item {
				margin-left: 10rpx;
			}
			&.active-crowd {
				background-color: #8dc63f;
				border-color: #8dc63f;
				color: #fff;
			}
		}
	}
	.visual-detail {
		margin: 0 20rpx;
		height: 650rpx;
		padding: 10rpx;
		&.chart {
			width: 100%;
			height: 420rpx;
			margin: 0;
			padding: 0;
		}
		.ele-item {
			.title {
				color: #000;
				width: 100%;
				font-weight: 700;
			}
			.content {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				padding: 5rpx 0rpx;
				.ele-item {
					color: #909399;
					margin-right: 30rpx;
					margin-bottom: 10rpx;
				}
			}
		}
	}
}
</style>
