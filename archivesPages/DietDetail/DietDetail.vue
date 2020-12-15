<template>
	<view class="current-diet-detail" v-if="dietInfo">
		<view class="title-bar">
			<view class="date" v-if="dietInfo.hdate && dietInfo.htime">{{ dietInfo.hdate + ' ' + dietInfo.htime.slice(0, 5) }}</view>
			<view class="delete-icon" @click="deleteItem(dietInfo)">
				<text class="text">删除记录</text>
				<text class="cuIcon-delete"></text>
			</view>
		</view>
		<view class="diet-info">
			<view class="img"><image mode="aspectFit" class="img" :src="getImagePath(dietInfo.image)" v-if="dietInfo && dietInfo.image"></image></view>
			<view class="info">
				<view class="name">{{ dietInfo.name }}</view>
				<view class="weight">
					<text class="label margin-right-xs">热量:</text>
					<text class="heat">
						{{ dietInfo.energy }}
						<text class="unit">千卡</text>
					</text>
				</view>
				<view class="">
					<text class="label text-bold margin-right-xs">单位:</text>
					<text class="unit">{{ dietInfo.unit }}</text>
				</view>
			</view>
			<view v-if="dietInfo" class="view-tabs">
				<view class="view-tab" :class="{ 'active-tab': showChart }" @click="showChart = true">NRV%占比</view>
				<view class="view-tab" :class="{ 'active-tab': !showChart }" @click="showChart = false">营养素含量</view>
			</view>
			<view class="element-detail-box" v-if="dietInfo && !showChart">
				<view class="title">产能营养素</view>
				<view class="content">
					<view class="ele-item">
						<text class="label">蛋白质</text>
						<text class="value">{{ dietInfo.protein ? Number(dietInfo.protein).toFixed(1) : '' }}</text>
						<text
							:class="{
								'text-red': getElementLevel('protein', dietInfo.protein) === '低',
								'text-orange': getElementLevel('protein', dietInfo.protein) === '中',
								'text-green': getElementLevel('protein', dietInfo.protein) === '高'
							}"
						>
							({{ getElementLevel('protein', dietInfo.protein) }})
						</text>
					</view>
					<view class="ele-item">
						<text class="label">碳水化合物</text>
						<text class="value">{{ dietInfo.carbohydrate ? dietInfo.carbohydrate.toFixed(1) : '' }}</text>
						<text
							:class="{
								'text-red': getElementLevel('carbohydrate', dietInfo.carbohydrate) === '低',
								'text-orange': getElementLevel('carbohydrate', dietInfo.carbohydrate) === '中',
								'text-green': getElementLevel('carbohydrate', dietInfo.carbohydrate) === '高'
							}"
						>
							({{ getElementLevel('carbohydrate', dietInfo.carbohydrate) }})
						</text>
					</view>
					<view class="ele-item">
						<text class="label">脂肪</text>
						<text class="value">{{ dietInfo.axunge ? dietInfo.axunge.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('axunge', dietInfo.axunge) }})</text>
					</view>
				</view>
				<view class="title">脂溶性维生素</view>
				<view class="content">
					<view class="ele-item">
						<text class="label">VA</text>
						<text class="value">{{ dietInfo.vitamin_a ? dietInfo.vitamin_a.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('vitamin_a', dietInfo.vitamin_a) }})</text>
					</view>
					<view class="ele-item">
						<text class="label">VE</text>
						<text class="value">{{ dietInfo.vitamin_e ? dietInfo.vitamin_e.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('vitamin_e', dietInfo.vitamin_e) }})</text>
					</view>
				</view>
				<view class="title">水溶性维生素</view>
				<view class="content">
					<view class="ele-item">
						<text class="label">VB1</text>
						<text class="value">{{ dietInfo.vitamin_b1 ? dietInfo.vitamin_b1.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('vitamin_b1', dietInfo.vitamin_b1) }})</text>
					</view>
					<view class="ele-item">
						<text class="label">VB2</text>
						<text class="value">{{ dietInfo.vitamin_b2 ? dietInfo.vitamin_b2.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('vitamin_b2', dietInfo.vitamin_b2) }})</text>
					</view>
					<view class="ele-item">
						<text class="label">VB3</text>
						<text class="value">{{ dietInfo.vitamin_b3 ? dietInfo.vitamin_b3.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('vitamin_b3', dietInfo.vitamin_b3) }})</text>
					</view>
					<view class="ele-item">
						<text class="label">VC</text>
						<text class="value">{{ dietInfo.vitamin_c ? dietInfo.vitamin_c.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('vitamin_c', dietInfo.vitamin_c) }})</text>
					</view>
				</view>
				<view class="title">常量矿物质</view>
				<view class="content">
					<view class="ele-item">
						<text class="label">钙</text>
						<text class="value">{{ dietInfo.element_ca ? dietInfo.element_ca.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('element_ca', dietInfo.element_ca) }})</text>
					</view>
					<view class="ele-item">
						<text class="label">镁</text>
						<text class="value">{{ dietInfo.element_mg ? dietInfo.element_mg.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('element_mg', dietInfo.element_mg) }})</text>
					</view>
					<view class="ele-item">
						<text class="label">磷</text>
						<text class="value">{{ dietInfo.element_p ? dietInfo.element_p.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('element_p', dietInfo.element_p) }})</text>
					</view>
					<view class="ele-item">
						<text class="label">钾</text>
						<text class="value">{{ dietInfo.element_k ? dietInfo.element_k.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('element_k', dietInfo.element_k) }})</text>
					</view>
				</view>
				<view class="title">微量元素</view>
				<view class="content">
					<view class="ele-item">
						<text class="label">铁</text>
						<text class="value">{{ dietInfo.element_fe ? dietInfo.element_fe.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('element_fe', dietInfo.element_fe) }})</text>
					</view>
					<view class="ele-item">
						<text class="label">锌</text>
						<text class="value">{{ dietInfo.element_zn ? dietInfo.element_zn.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('element_zn', dietInfo.element_zn) }})</text>
					</view>
					<view class="ele-item">
						<text class="label">硒</text>
						<text class="value">{{ dietInfo.element_se ? dietInfo.element_se.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('element_se', dietInfo.element_se) }})</text>
					</view>
					<view class="ele-item">
						<text class="label">铜</text>
						<text class="value">{{ dietInfo.element_cu ? dietInfo.element_cu.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('element_cu', dietInfo.element_cu) }})</text>
					</view>
					<view class="ele-item">
						<text class="label">锰</text>
						<text class="value">{{ dietInfo.element_mn ? dietInfo.element_mn.toFixed(1) : '' }}</text>
						<text class="text-red">({{ getElementLevel('element_mn', dietInfo.element_mn) }})</text>
					</view>
				</view>
			</view>
			<view class="chart-box" v-if="dietInfo && showChart"><uni-echarts class="uni-ec-canvas" ref="uni-ec-canvas2" canvas-id="uni-ec-canvas2" :ec="chartData"></uni-echarts></view>
			<view class="cook-type-box" v-if="dietInfo">
				<view class="title">烹调方式:</view>
				<view class="current-cook-type" v-if="dietInfo.cook_method" @click="isShowCookType = true">{{ dietInfo.cook_method }}</view>
				<text class="" v-if="!dietInfo.cook_method" @click="isShowCookType = true">(点击选择烹调方式)</text>
				<text class="lg text-gray cuIcon-right" v-if="cookTypes.length > 0"></text>
			</view>
			<view class="unit-box">
				<view class="title">单位:</view>
				<view class="unit-item" :class="{ 'active-unit': currentUnitIndex === index }" v-for="(u, index) in unitList" :key="index" @click="checkUnit(u, index)">
					{{ u.unit_weight_g && u.unit === 'g' ? u.unit_weight_g + u.unit : u.unit }}
				</view>
			</view>
			<view class="amount">
				<view class="title">数量:</view>
				<view class="number-box">
					<text @click="changeAmount('minus', 0.1)" class="symbol">-0.1</text>
					<text @click="changeAmount('minus')" class="symbol">-1</text>
					<input class="input" @change="changeValue" v-model.number="dietInfo.amount" type="number" />
					<text @click="changeAmount('plus')" class="symbol">+1</text>
					<text @click="changeAmount('plus', 0.1)" class="symbol">+0.1</text>
				</view>
			</view>
		</view>
		<view class="delete-bar">
			<view class="btn bg-grey" @click="hideRecordDetailModal">取消</view>
			<view class="btn bg-blue" @click="UpdateDietInfo">确认</view>
		</view>
		<view class="cu-modal bottom-modal" :class="isShowCookType ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white cook-top"><text>常见烹调方式</text></view>
				<view class="cooktype-wrap" v-if="dietInfo">
					<bx-radio-group v-model="dietInfo.cook_method" mode="button">
						<bx-radio v-for="item in cookTypes" :key="item.value" :name="item.value">{{ item.label }}</bx-radio>
					</bx-radio-group>
					<view class="button-box">
						<button class="cu-btn button" @tap="isShowCookType = false">取消</button>
						<button class="cu-btn button" @tap="isShowCookType = false">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import uniEcharts from '@/components/uni-ec-canvas/uni-echart.vue';
import energyListWrap from './data.js';
import { mapState } from 'vuex';
export default {
	components: {
		uniEcharts
	},
	computed: {
		...mapState({
			authSetting: state => state.app['authSetting'],
			is_login: state => state.app['isLogin'],
			wxUserInfo: state => state.user['wxUserInfo'],
			login_user_info: state => state.user['loginUserInfo'],
			client_env: state => state.app['env'],
			authBoxDisplay: state => state.app['authBoxDisplay'],
			dietRecord: state => state.app['dietRecord']
		})
	},
	data() {
		return {
			chartData: {
				option: {}
			},
			currentUnitIndex: 0,
			cookTypes: [
				{ label: '炒', value: '炒' },
				{ label: '蒸', value: '蒸' },
				{ label: '煮', value: '煮' },
				{ label: '烧', value: '烧' },
				{ label: '炸', value: '炸' },
				{ label: '煎', value: '煎' },
				{ label: '烤', value: '烤' },
				{ label: '烩', value: '烩' },
				{ label: '闷', value: '闷' },
				{ label: '炖', value: '炖' },
				{ label: '蜜汁', value: '蜜汁' },
				{ label: '炝', value: '炝' },
				{ label: '拌', value: '拌' },
				{ label: '腌', value: '腌' },
				{ label: '熏', value: '熏' },
				{ label: '卤', value: '卤' },
				{ label: '汆', value: '汆' },
				{ label: '溜', value: '溜' },
				{ label: '即食', value: '即食' }
			],
			unitList: [
				{
					unit_weight_g: 100,
					element_cu: '0.07',
					element_na: '1.3',
					element_zn: '0.04',
					modify_user: null,
					user_name: '贾琦',
					modify_time: '2020-12-14 16:13:54',
					carbohydrate: '13.7',
					element_mn: '0.03',
					element_ca: '4',
					vitamin_b3: '0.2',
					vitamin_b2: '0.02',
					protein: '0.4',
					vitamin_b1: '0.02',
					cholesterol: '0',
					diet_contents_no: 'FD202009291633340022',
					dining_type: '夜宵',
					htime: '16:14:00',
					id: 1239,
					diret_type: 'diet_contents',
					energy: 53,
					element_se: '0.1',
					image: '20200929162850572100',
					amount: 1,
					create_time: '2020-12-14 16:13:54',
					modify_user_disp: null,
					vitamin_a: '4',
					vitamin_c: '3',
					create_user_disp: '贾琦/jiaqi',
					userno: 'jiaqi',
					vitamin_d: '0',
					vitamin_e: '0.43',
					element_mg: '4',
					vitamin_b6: '0',
					folic_acid: '6',
					vitamin_k: '0',
					cook_method: '即食',
					mixed_food_no: null,
					unit: 'g',
					diet_record_no: 'DR202012141613540172',
					element_fe: '0.3',
					name: '苹果',
					axunge: '0.2',
					element_p: '7',
					vitamin_b12: '0',
					create_user: 'jiaqi',
					hdate: '2020-12-14',
					element_k: '83',
					_userno_disp: '贾琦/jiaqi'
				},
				{
					food_name: '苹果',
					amount: 350,
					create_time: '2020-09-30 15:38:25',
					modify_user_disp: '王永利/11000006',
					modify_user: 'wangyl',
					create_user_disp: '王永利/11000006',
					modify_time: '2020-11-19 17:00:19',
					food_no: 'FD202009291633340022',
					unit: '个(大,350g)',
					unit_remark: null,
					bar_code: null,
					create_user: 'wangyl',
					id: 3
				},
				{
					food_name: '苹果',
					amount: 150,
					create_time: '2020-11-10 18:38:14',
					modify_user_disp: '王永利/11000006',
					modify_user: 'wangyl',
					create_user_disp: '贾琦/jiaqi',
					modify_time: '2020-11-19 16:59:57',
					food_no: 'FD202009291633340022',
					unit: '个(小,150g)',
					unit_remark: null,
					bar_code: null,
					create_user: 'jiaqi',
					id: 8
				},
				{
					food_name: '苹果',
					amount: 250,
					create_time: '2020-09-30 15:38:43',
					modify_user_disp: '王永利/11000006',
					modify_user: 'wangyl',
					create_user_disp: '王永利/11000006',
					modify_time: '2020-11-19 16:59:34',
					food_no: 'FD202009291633340022',
					unit: '个(中,250g)',
					unit_remark: null,
					bar_code: null,
					create_user: 'wangyl',
					id: 4
				}
			],
			showChart: false, //是否显示柱状图
			dietInfo: {
				unit_weight_g: 150,
				element_na: 1.3,
				element_zn: 0.04,
				carbohydrate: 13.7,
				element_mn: 0.03,
				element_mo: null,
				unit_energy: 53,
				protein: 0.4,
				cholesterol: 0,
				id: 1239,
				dietary_fiber: 1.7,
				element_se: 0.1,
				image: '20200929162850572100',
				create_time: '2020-12-14 16:13:54',
				modify_user_disp: null,
				vitamin_a: 4,
				vitamin_c: 3,
				biotin: null,
				vitamin_d: 0,
				vitamin_e: 0.43,
				vitamin_b6: 0,
				folic_acid: 6,
				unit_amount: 100,
				vitamin_b5: null,
				vitamin_k: 0,
				food_no: 'FD202009291633340022',
				unit: '个(小,150g)',
				element_fe: 0.3,
				name: '苹果',
				axunge: 0.2,
				create_user: 'jiaqi',
				classify: '水果干果',
				element_cu: 0.07,
				element_cr: null,
				modify_user: null,
				modify_time: '2020-12-14 16:13:54',
				choline: null,
				cook_method_default: '煮',
				element_ca: 4,
				vitamin_b3: 0.2,
				vitamin_b2: 0.02,
				vitamin_b1: 0.02,
				element_co: null,
				edible_portion: 85,
				gi: null,
				create_user_disp: '贾琦/jiaqi',
				element_mg: 4,
				moisture_content: null,
				pharmacological_action: null,
				cook_method: '即食',
				element_i: null,
				element_p: 7,
				vitamin_b12: 0,
				element_k: 83,
				user_name: '贾琦',
				diet_contents_no: 'FD202009291633340022',
				dining_type: '夜宵',
				htime: '16:14:00',
				diret_type: 'diet_contents',
				energy: 79.5,
				amount: 1,
				userno: 'jiaqi',
				mixed_food_no: null,
				diet_record_no: 'DR202012141613540172',
				hdate: '2020-12-14',
				_userno_disp: '贾琦/jiaqi'
			},
			isShowCookType: false // 选择烹饪方式
		};
	},
	methods: {
		async buildChartOption() {
			let currentDiet = this.deepClone(this.dietInfo);
			let serviceName = '';
			let condition = [{}];
			if (currentDiet.diret_type === 'diet_contents') {
				// 食材
				serviceName = 'srvhealth_diet_contents_select';
				condition[0] = {
					colName: 'food_no',
					ruleType: 'eq',
					value: currentDiet.diet_contents_no
				};
			} else if (currentDiet.diret_type === 'mixed_food') {
				// 混合食物
				serviceName = 'srvhealth_mixed_food_nutrition_contents_select';
				condition[0] = {
					colName: 'meal_no',
					ruleType: 'eq',
					value: currentDiet.mixed_food_no
				};
			}
			let foodInfo = await this.getFoodType(condition, serviceName);
			if (Array.isArray(foodInfo) && foodInfo.length > 0) {
				foodInfo = foodInfo[0];
			} else {
				// 没查到食物记录对应的食物信息
				return;
			}
			currentDiet = { ...foodInfo, ...currentDiet };
			let currentRecord = this.deepClone(currentDiet);
			Object.keys(currentRecord).forEach(key => {
				if (typeof currentRecord[key] === 'string' && Number(currentRecord[key]) - currentRecord[key] === 0 && key !== 'image') {
					currentRecord[key] = Number(currentRecord[key]);
				}
			});
			this.dietInfo = currentRecord;
			let eleArr = this.getEnergyListValue();
			let category = eleArr.map(item => {
				return item.name;
			});
			let legendData = ['其它食物', '当前食物', 'NRV%达标线'];
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
							let ratio = currentDiet.unit_weight_g / 100;
							let val = cur.value - currentDiet[cur.key] * ratio * currentDiet.amount;
							let num = (val * 100) / Number(cur.EAR);
							num = parseFloat(num.toFixed(1));
							return num;
						});
						break;
					case '当前食物':
						obj.data = eleArr.map(ele => {
							let cur = this.deepClone(ele);
							let ratio = currentDiet.unit_weight_g / 100;
							let val = currentDiet[cur.key] * ratio * currentDiet.amount;
							let num = (val * 100) / Number(cur.EAR);
							num = parseFloat(num.toFixed(1));
							return num;
						});
						break;
					case 'NRV%达标线':
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
				// #ifdef h5
				tooltip: {
					show: true,
					trigger: 'axis'
				},
				// #endif
				legend: {
					data: legendData
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					top: '10%',
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
						max: function(value) {
							return value.max + 20;
						},
						type: 'value',
						axisLabel: {
							formatter: `{value}%`
						}
					}
				],
				series: []
			};
			option.series = seriesData;
			let result = {
				option: option
			};
			this.chartData = result;
		},
		getEnergyListValue(foodInfo) {
			let currentDiet = this.deepClone(this.dietInfo);
			let dietRecordList = this.deepClone(this.dietRecord);
			let energyList = this.deepClone(energyListWrap);
			let eleArr = [];
			energyList.forEach(item => {
				item.matterList.forEach(ele => {
					ele.value = 0;
					eleArr.push(ele);
				});
			});
			dietRecordList = dietRecordList.map(item => {
				if (item.id === currentDiet.id) {
					item = currentDiet;
				}
				return item;
			});
			let foodTypes = this.deepClone(this.foodType);
			eleArr = eleArr.map(ele => {
				dietRecordList.forEach(diet => {
					if (diet.id === currentDiet.id) {
						diet = currentDiet;
					}
					foodTypes.forEach(food => {
						if (food.food_no === diet.diet_contents_no || food.meal_no === diet.mixed_food_no) {
							let ratio = 1;
							if (food['unit'] === 'g') {
								ratio = (diet.unit_weight_g * diet.amount) / food.unit_amount;
							}
							ele.value = ele.value + food[ele['key']] * ratio;
						}
					});
				});
				return ele;
			});
			console.log(eleArr);
			return eleArr;
		},
		changeAmount(e, step = 1) {
			if (e === 'minus') {
				if (this.dietInfo.amount - step > 0) {
					this.dietInfo.amount = Number((this.dietInfo.amount - step).toFixed(1));
				} else {
					return;
				}
			} else {
				this.dietInfo.amount = Number((this.dietInfo.amount + step).toFixed(1));
			}
			this.buildChartOption();
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
		},
		chooseCookType(e) {
			// 选择食物烹调方式
			this.dietInfo.cook_method = e.value;
			this.isShowCookType = false;
		},
		checkUnit(item, index) {
			// 切换单位
			this.currentUnitIndex = index;
			let currentUnit = this.unitList[index];
			//TODO 动态改变热量
			this.dietInfo.unit_weight_g = currentUnit.unit_weight_g ? currentUnit.unit_weight_g : currentUnit.amount;
			this.dietInfo.unit = item.unit;
			// this.buildCurrenDietChartOption();
		},
		deleteItem(item) {
			let self = this;
			let type = this.currentRecordType;
			uni.showModal({
				title: '提示',
				content: '确定删除此条记录?',
				success(res) {
					if (res.confirm) {
						uni.showLoading({
							mask: true,
							title: '正在删除...'
						});
						self.hideRecordDetailModal();
						let serviceName = '';
						let url = '';
						if (type === 'food') {
							serviceName = 'srvhealth_diet_record_delete';
							url = self.getServiceUrl('health', 'srvhealth_diet_record_delete', 'operate');
						} else if (type === 'sport') {
							serviceName = 'srvhealth_body_activity_record_delete';
							url = self.getServiceUrl('health', 'srvhealth_body_activity_record_delete', 'operate');
						}
						let req = [
							{
								serviceName: serviceName,
								condition: [{ colName: 'id', ruleType: 'in', value: item.id }]
							}
						];
						self.$http.post(url, req).then(res => {
							uni.hideLoading();
							if (res.data.resultCode === 'SUCCESS') {
								if (type === 'food') {
									self.getDietRecord();
								} else if (type === 'sport') {
									self.getSportsRecord();
								}
								uni.showToast({
									title: '删除成功!',
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: '删除失败!',
									icon: 'none'
								});
							}
						});
					} else if (res.cancel) {
						uni.showToast({
							title: '取消删除',
							icon: 'none'
						});
					}
				}
			});
		}
	},
	onLoad() {
		this.buildChartOption();
	}
};
</script>

<style lang="scss">
.current-diet-detail {
	width: 100vw;
	height: 100vh;
	.title-bar {
		display: flex;
		justify-content: center;
		min-height: 80rpx;
		align-items: center;
		background-color: #fff;
		position: relative;
		.date {
			font-size: 28rpx;
			font-weight: bold;
		}
		.btn {
			padding: 030rpx;
			color: #0081ff;
			font-size: 28rpx;
		}
		.delete-icon {
			position: absolute;
			right: 0;
			padding: 10rpx 20rpx;
			background-color: #fff;
			font-size: 24rpx;
			border-radius: 60rpx;
			text-align: center;
			transition: all 0.5s;
			color: #0081ff;
			&:active {
				background-color: #0081ff;
				color: #fff;
				transform: scale(1.1);
				box-shadow: 0 0 10px #6eb4ff;
			}
			.text {
			}
		}
	}
	.diet-info {
		display: flex;
		padding: 20rpx 0;
		justify-content: space-around;
		flex-wrap: wrap;
		.img {
			width: 150rpx;
			height: 150rpx;
			border-radius: 10rpx;
			overflow: hidden;
			box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		}
		.info {
			min-width: 400rpx;
			padding-left: 50rpx;
			display: flex;
			flex-direction: column;
			.name {
				font-weight: 700;
				max-width: 400rpx;
				font-size: 16px;
				display: flex;
				flex-wrap: wrap;
			}
			.element {
				color: #8dc63f;
			}
			.weight {
				padding: 10rpx 0;
				color: #ffb347;
				.heat {
					color: #ffb347;
					font-size: 16px;
				}
				.unit {
					font-size: 12px;
				}
			}
		}
		.view-tabs {
			display: flex;
			width: 100%;
			margin: 30rpx 20rpx 30rpx;
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
		.element-detail-box {
			display: flex;
			flex-direction: column;
			font-weight: normal;
			width: 100%;
			padding-left: 20rpx;
			padding-top: 20rpx;
			height: 550rpx;
			.title {
				color: #000;
				width: 100%;
				font-weight: 700;
			}
			.content {
				width: 100%;
				display: flex;
				flex-wrap: wrap;
				padding: 10rpx 20rpx;
				.ele-item {
					color: #909399;
					margin-right: 30rpx;
					margin-bottom: 10rpx;
				}
			}
		}
		.amount {
			display: flex;
			align-items: center;
			margin-top: 30rpx;
			.number-box {
				display: flex;
				justify-content: center;
				.title {
					margin-right: 20rpx;
				}
				.input {
					width: 120rpx;
					height: 70rpx;
					color: rgb(50, 50, 51);
					font-size: 14px;
					background: rgb(242, 243, 245);
					text-align: center;
					position: relative;
					padding: 10rpx 0;
					margin: 0 3px;
					display: flex;
					align-items: center;
					justify-content: center;
					border: 1px solid #dcdfe6;
					border-radius: 10rpx;
				}
				.symbol {
					border-radius: 10rpx;
					margin: 0 5rpx;
					padding: 10rpx 0;
					background: #d6e2eb;
					color: rgb(50, 50, 51);
					width: 120rpx;
					display: flex;
					justify-content: center;
					align-content: center;
					font-size: 20px;
					&:active {
						transform: scale(1.2);
					}
					&:last-child {
						margin-right: 0;
					}
				}
			}
		}
		.cook-type-box {
			width: 100%;
			display: flex;
			padding: 20rpx;
			flex-wrap: wrap;
			align-items: center;
			.current-cook-type {
				margin-right: 5px;
				border-radius: 20px;
				padding: 0px 8px;
				min-height: 27px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 5px;
				min-width: 100rpx;
				border: 1px solid #f37b1d;
				background-color: #f37b1d;
				color: #fff;
			}
		}
		.unit-box {
			width: 100%;
			display: flex;
			padding: 20rpx;
			flex-wrap: wrap;
			.title {
				margin-right: 20rpx;
			}
			.unit-item {
				margin-right: 5px;
				background-color: #f8f8f8;
				color: #999;
				border-radius: 20px;
				border: 1px solid #999;
				padding: 0px 8px;
				min-height: 27px;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 5px;
				font-size: 20rpx;
				min-width: 100rpx;
			}
			.active-unit {
				border: 1px solid #f37b1d;
				background-color: #f37b1d;
				color: #fff;
			}
		}
	}
	.delete-bar {
		flex: 1;
		padding: 10rpx 20rpx;
		color: #999;
		border-top: 1px solid #f1f1f1;
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-size: 50rpx;
		padding-top: 30rpx;
		margin-bottom: 100rpx;
		.btn {
			padding: 15rpx 30rpx;
			letter-spacing: 2px;
			border-radius: 10rpx;
			font-size: 28rpx;
			flex: 1;
			margin-right: 40rpx;
			text-align: center;
			&:last-child {
				margin-right: 0rpx;
			}
		}
	}
}
.button-box {
	width: 100%;
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	margin: 30rpx 0;
	.button {
		background-color: #11c5bd;
		color: #fff;
		margin-right: 30rpx;
		flex: 1;
		&:nth-child(2n) {
			margin-right: 0;
		}
	}
}
.cook-top {
	justify-content: center;
	font-weight: bold;
}
.cooktype-wrap {
	display: flex;
	flex-wrap: wrap;
	background-color: #fff;
	padding: 20rpx;
	.cook-item {
		background-color: #f1f1f1;
		padding: 5rpx 30rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		border-radius: 10rpx;
		transition: all 1s;
		letter-spacing: 2rpx;
		&:active {
			transform: scale(1.2);
		}
		&.active-cook-item {
			background-color: #007aff;
			color: #fff;
		}
	}
}
</style>
