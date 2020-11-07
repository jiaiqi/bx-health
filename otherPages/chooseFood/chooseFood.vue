<template>
	<view class="food_wrap">
		<view class="cu-bar bg-white">
			<!-- <view class=" text-cyan button" >取消</view> -->
			<view class="date-time">
				<view class="date-time-rq">{{ nowDate }}</view>
				/
				<view class="date-time-rq">{{ currTime ? currTime : nowDateTime }}</view>
			</view>
			<!-- <view @click="confirms" class=" text-cyan button confir-btn">确定</view> -->
		</view>

		<view class="content">
			<view class="food-list">
				<view class="list-item">
					<view class="img-box"><image :src="currFood.imgurl"></image></view>
					<view class="info">
						<view class="name">{{ currFood.name }}</view>
						<text class="infomation">
							<text class="text-red calorie">{{ currFood.unit_energy }}</text>
							千卡/{{ currFood.unit_amount + currFood.unit }}
						</text>
					</view>
					<view class="calorie">{{ heatNum ? heatNum.toFixed(1) : '' }}千卡</view>
				</view>
			</view>
			<view class="ele-text-wrap">
				<view class="ele-text-top-tit">
					<text @click="changeCate(item,index)" v-for="(item,index) in categoryTop" :key="index" :class="categoryTopIndex === index?'active-text-top-tit':''">{{item.name}}</text>					
				</view>
				<!-- <view class="ele-text-top">主要维生素含量如下：</view> -->
				<view v-if="categoryTopIndex === 0" class="ele-text-cen">
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">产能营养素</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>蛋白质:</text>
								<text>{{ currFood.protein ? currFood.protein.toFixed(1) : '' }}g</text>
								<text style="color: red;">({{ currFood.protein >= 30.1 ? '高' : currFood.protein >= 15.5 && currFood.protein < 30.1 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>碳水化合物:</text>
								<text>{{ currFood.carbohydrate ? currFood.carbohydrate.toFixed(1) : '' }}g</text>
								<text style="color: red;">({{ currFood.carbohydrate >= 51.9 ? '高' : currFood.carbohydrate >= 25.74 && currFood.carbohydrate < 51.9 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>脂肪:</text>
								<text>{{ currFood.axunge ? currFood.axunge.toFixed(1) : '' }}g</text>
								<text style="color: red;">({{ currFood.axunge >= 35.3 ? '高' : currFood.axunge >= 17.6 && currFood.axunge < 35.3 ? '中' : '低' }})</text>
							</view>
						</view>
					</view>
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">脂溶性维生素</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>VA:</text>
								<text>{{ currFood.vitamin_a ? currFood.vitamin_a.toFixed(1) : '' }}ug</text>
								<text style="color: red;">({{ currFood.vitamin_a >= 915 ? '高' : currFood.vitamin_a >= 457 && currFood.vitamin_a < 915 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>VE:</text>
								<text>{{ currFood.vitamin_e ? currFood.vitamin_e.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.vitamin_e >= 27.9 ? '高' : currFood.vitamin_e >= 13.9 && currFood.vitamin_e < 27.9 ? '中' : '低' }})</text>
							</view>
						</view>
					</view>					
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">水溶性维生素</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>VB1:</text>
								<text>{{ currFood.vitamin_b1 ? currFood.vitamin_b1.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.vitamin_b1 >= 0.61 ? '高' : currFood.vitamin_b1 >= 0.32 && currFood.vitamin_b1 < 0.61 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>VB2:</text>
								<text>{{ currFood.vitamin_b2 ? currFood.vitamin_b2.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.vitamin_b2 >= 0.79 ? '高' : currFood.vitamin_b2 >= 0.4 && currFood.vitamin_b2 < 0.79 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>VB3:</text>
								<text>{{ currFood.vitamin_b3 ? currFood.vitamin_b3.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.vitamin_b3 >= 4.52 ? '高' : currFood.vitamin_b3 >= 2.26 && currFood.vitamin_b3 < 4.52 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>VC:</text>
								<text>{{ currFood.vitamin_c ? currFood.vitamin_c.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.vitamin_c >= 61.2 ? '高' : currFood.vitamin_c >= 30.6 && currFood.vitamin_c < 61.2 ? '中' : '低' }})</text>
							</view>
						</view>
					</view>
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">常量矿物质</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>钙:</text>
								<text>{{ currFood.element_ca ? currFood.element_ca.toFixed(1) : '' }}mg/</text>
								<text style="color: red;">({{ currFood.element_ca >= 381 ? '高' : currFood.element_ca >= 190.5 && currFood.element_ca < 381 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>镁:</text>
								<text>{{ currFood.element_mg ? currFood.element_mg.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.element_mg >= 111.6 ? '高' : currFood.element_mg >= 55.8 && currFood.element_mg < 111.6 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>磷:</text>
								<text>{{ currFood.element_p ? currFood.element_p.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.element_p >= 296.4 ? '高' : currFood.element_p >= 148.2 && currFood.element_p < 296.4 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>钾:</text>
								<text>{{ currFood.element_k ? currFood.element_k.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.element_k >= 526.2 ? '高' : currFood.element_k >= 263.1 && currFood.element_k < 526.2 ? '中' : '低' }})</text>
							</view>
						</view>
					</view>

					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">微量元素</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>铁:</text>
								<text>{{ currFood.element_fe ? currFood.element_fe.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.element_fe >= 7.2 ? '高' : currFood.element_fe >= 3.6 && currFood.element_fe < 7.2 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>锌:</text>
								<text>{{ currFood.element_zn ? currFood.element_zn.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.element_zn >= 6 ? '高' : currFood.element_zn >= 3 && currFood.element_zn < 6 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>硒:</text>
								<text>{{ currFood.element_se ? currFood.element_se.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.element_se >= 23.82 ? '高' : currFood.element_se >= 11.91 && currFood.element_se < 23.82 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>铜:</text>
								<text>{{ currFood.element_cu ? currFood.element_cu.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.element_cu >= 1.12 ? '高' : currFood.element_cu >= 0.56 && currFood.element_cu < 1.12 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>锰:</text>
								<text>{{ currFood.element_mn ? currFood.element_mn.toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.element_mn >= 4.44 ? '高' : currFood.element_mn >= 2.22 && currFood.element_mn < 4.44 ? '中' : '低' }})</text>
							</view>
						</view> 
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
					<uniEcCanvas v-if="echartsIsShow && categoryTopIndex === 1" class="uni-ec-canvas" id="uni-ec-canvas" ref="uni-ec-canvas" canvas-id="uni-ec-canvas" :ec="stepData"></uniEcCanvas>
				<!-- #endif -->
				<!-- #ifdef H5 -->
					<uniEcharts v-if="echartsIsShow && categoryTopIndex === 1" class="uni-ec-canvas" id="uni-ec-canvas" ref="uni-ec-canvas" canvas-id="uni-ec-canvas" :ec="stepData"></uniEcharts>
				<!-- #endif -->
			</view>
			<view class="calculate">
				<view class="weight">
					<view class="calculate-l">单位：</view>
					<view @click="chooseUnit(u, ids)" v-for="(u, ids) in unitList" :key="ids" :class="currIndex == ids ? 'active-unit' : ''" class="unit">
						{{ u.unit_amount ? u.unit_amount + u.unit : u.unit }}
						<!-- {{ radioLabel ? (radioLabel.unit_amount ? radioLabel.unit_amount + radioLabel.unit : radioLabel.unit) : currFood.unit_amount + currFood.unit }} -->
					</view>
					<!-- <view class="unit-change"><u-icon size="24" name="arrow-down-fill"></u-icon></view> -->
				</view>
			</view>
			<view class="amount">
				<view class="input-box">
					<view class="key-left">
						<text @click="countDietNum('-0.1')">-0.1</text>
						<text @click="countDietNum('-1')">-1</text>
					</view>
					<u-input placeholder=" " :disabled="true" :clearable="false" :border="true" maxlength="20" v-model="choiceNum" type="number" />
					<view class="key-right">
						<text @click="countDietNum('+1')">+1</text>
						<text @click="countDietNum('+0.1')">+0.1</text>
					</view>
				</view>
			</view>
		</view>
		<view class="foods-btn">
			<text @click="showBottomModal">取消</text>
			<text @click="confirms">确认</text>
		</view>
		<view class="cu-modal radio-modal" :class="modalName == 'RadioModal' ? 'show' : ''" @tap="RadiohideModal">
			<view class="cu-dialog">
				<radio-group class="block" @change="RadioChange">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item, index) in unitList" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">{{ item.unit_amount ? item.unit_amount + item.unit : item.unit }}</view>
								<radio class="round" :class="radioIndex == index ? 'checked' : ''" :checked="radioIndex == index ? true : false" :value="index.toString()"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import uniEcCanvas from '@/otherPages/components/uni-ec-canvas/uni-ec-canvas.vue';
// #endif
// #ifdef H5
import uniEcharts from '@/otherPages/components/uni-ec-canvas/uni-echarts.vue';
// #endif
export default {
	name: 'chooseFood',
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
			unitList: [],
			list: [],
			categoryTop:[{
				name:'营养素含量',
				type:'purity'
			},{
				name:'NRV%占比',
				type:'NRV'
			}],
			categoryTopIndex:0,
			currFood: '',
			heatNum: '',
			nowDate: this.formateDate(new Date(), 'date').replace(/\s*/g, ''),
			nowDateTime: this.formateDate(new Date(), 'dateTime'),
			radioLabel: '',
			radioIndex: 0,
			choiceNum: 0,
			currTime: '',
			chooseFoods: [],
			value1: 0,
			modalName: '',
			nutrientData: [
				{
					name: '蛋白质',
					key: 'protein'
				},
				{
					name: '碳水化合物',
					key: 'carbohydrate'
				},
				{
					name: '脂肪',
					key: 'axunge'
				},
				{
					name: 'VA',
					key: 'vitamin_a'
				},
				{
					name: 'VE',
					key: 'vitamin_e'
				},
				{
					name: 'VB1',
					key: 'vitamin_b1'
				},
				{
					name: 'VB2',
					key: 'vitamin_b2'
				},
				{
					name: 'VB3',
					key: 'vitamin_b3'
				},
				{
					name: '钙',
					key: 'element_ca'
				},
				{
					name: '镁',
					key: 'element_mg'
				},
				{
					name: '磷',
					key: 'element_p'
				},
				{
					name: '钾',
					key: 'element_k'
				},
				{
					name: '铁',
					key: 'element_fe'
				},
				{
					name: '锌',
					key: 'element_se'
				},
				{
					name: '铜',
					key: 'element_cu'
				},
				{
					name: '锰',
					key: 'element_mn'
				}
			],
			echartsIsShow: false,
			stepData: {
				option: {
					color: ['#92d050', '#4f81bd', '#f79646'],
					title: {
						text: 'NRV占比'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'line',
							axis: 'x',
							label: {
								backgroundColor: '#000000'
							}
						}
					},
					legend: {
						y: '25px',
						data: ['食物含量', '超标部分', '达标线']
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
						// boundaryGap: false,
						data: [],
						axisLabel: {
							rotate: 70,
							interval: 0,
							fontSize: 10
						},
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
						axisLabel: {
							formatter: `{value}%`
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
					series: [
						{
							name: '食物含量',
							type: 'bar',
							stack: '总数',
							data: []
						}
					]
				}
			},
			currIndex: '', //选择单位index
			userInfo: '',
			result: ''
		};
	},
	onLoad(option) {
		if (uni.getStorageSync('current_user_info')) {
			this.userInfo = uni.getStorageSync('current_user_info');
			uni.setStorageSync('current_user', this.userInfo.name);
		} else {
			let userList = uni.getStorageSync('user_info_list');
			if (Array.isArray(userList) && userList.length > 0) {
				this.userInfo = userList[0];
				uni.setStorageSync('current_user_info', userList[0]);
			}
		}
		console.log('option-----', option.currFood);
		let query = JSON.parse(decodeURIComponent(option.currFood));
		if (query.hdate) {
			this.nowDate = query.hdate;
		}
		this.currFood = JSON.parse(decodeURIComponent(option.currFood));
		if (this.currFood) {
			this.assembleData();
			this.selectCurrFoodUnit(this.currFood);
			// this.getNutrientRecommended()
		}
	},
	computed: {
		age() {
			if (this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
				return age;
			}
		}
	},
	methods: {
		/*点击切换营养素占比和NRV**/
		changeCate(item,index){
			this.categoryTopIndex = index
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
				this.result = result;
				let endArr = [];
				let currFood = this.currFood;
				let nutrientData = this.nutrientData;
				nutrientData.forEach(nut => {
					let num = 0;
					if (nut.name === '脂肪' || nut.name === '碳水化合物' || nut.name === 'B3') {
						endArr.push(currFood[nut.key]);
					}
					result.forEach(re => {
						if (nut.name === re.nutrient) {
							num = ((Number(currFood[nut.key]) / Number(re.val_rni)) * 100).toFixed(1);
							endArr.push(Number(num));
						}
					});
				});
				// result.forEach(item => {
				// 	self.energyListWrap.forEach(energy => {
				// 		energy.matterList.forEach(mat => {
				// 			if (item.nutrient === mat.name || item.nutrient.indexOf(mat.name) !== -1) {
				// 				// mat.EAR = item.val_ear ? item.val_ear : mat.EAR;
				// 				mat.UL = item.val_ul ? item.val_ul : mat.UL;
				// 				mat.EAR = item.val_rni ? item.val_rni : mat.EAR;
				// 				if (energy.title !== '水溶性维生素') {
				// 					mat.UL = item.val_ul ? item.val_ul : mat.UL;
				// 					// mat.UL = item.val_ul ? item.val_ul : mat.UL;
				// 				} else {
				// 					mat.UL = 0;
				// 				}
				// 				if (mat.name === '蛋白') {
				// 					mat.EAR = item.val_rni ? item.val_rni * self.userInfo.weight : item.val_ear ? item.val_ear * self.userInfo.weight : mat.EAR * self.userInfo.weight;
				// 					mat.UL = 0;
				// 					// mat.UL = item.val_rni ? item.val_rni * self.userInfo.weight : mat.UL;
				// 				}
				// 			} else {
				// 				if (mat.name === '脂肪') {
				// 					mat.EAR = Number((self.userInfo.weight * 50 * 0.2) / 9).toFixed(2);
				// 					mat.UL = 0;
				// 					// mat.UL = item.val_rni ? item.val_rni * self.userInfo.weight : mat.UL;
				// 				}
				// 				if (mat.name === '碳水') {
				// 					mat.EAR = self.userInfo.weight * 4;
				// 					mat.UL = 0;
				// 					// mat.UL = item.val_rni ? item.val_rni * self.userInfo.weight : mat.UL;
				// 				}
				// 			}
				// 		});
				// 	});
				// });
				return endArr;
			}
		},
		/* 组装图表数据**/
		async assembleData() {
			let self = this;
			let nutrientData = self.nutrientData;
			let option = self.stepData.option;
			let xdata = nutrientData.map(item => {
				return item.name;
			});
			/*达标线*/
			let obj = {
				name: '达标线',
				data: [],
				type: 'line',
				stack: false
			};
			obj.data = nutrientData.map(item => {
				return 100;
			});
			console.log('---x轴数据--', xdata);
			option.xAxis.data = xdata;
			let currFood = self.currFood;
			nutrientData.forEach(ele => {
				if (currFood[ele.key]) {
					self.$set(ele, 'value', currFood[ele.key]);
				} else {
					self.$set(ele, 'value', 0);
				}
			});
			let currData = await this.getNutrientRecommended();
			console.log('currData======>', currData);
			option.series[0].data = currData.map(ser => {
				return ser;
			});
			option.series.push(obj);
			this.countDietNum('+1');
			this.echartsIsShow = true;
		},
		/* 点击取消*/
		showBottomModal() {
			uni.navigateBack({
				delta: 0
			});
		},
		/* 点击弹出选择单位**/
		changeUnit(item) {
			this.modalName = 'RadioModal';
		},
		/*关闭弹窗**/
		RadiohideModal() {
			this.modalName = '';
		},
		/*选择单位*/
		chooseUnit(item, i) {
			console.log('单位选择----', item);
			this.currIndex = i;
			this.radioLabel = item;
			if (Number(this.choiceNum) && !this.radioLabel) {
				this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
			} else if (Number(this.choiceNum) && this.radioLabel) {
				if (this.radioLabel.unit_amount) {
					this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
				} else {
					this.heatNum = Number(this.choiceNum) * ((this.radioLabel.amount / 100) * this.currFood.unit_energy);
				}
			}
		},
		/*选择单位**/
		RadioChange(e) {
			this.radioIndex = e.detail.value;
			this.modalName = '';
			this.unitList.forEach((item, i) => {
				let unitLabel = '';
				if (i == this.radioIndex) {
					this.radioLabel = item;
				}
			});
		},
		/*点击确定**/
		confirms() {
			this.$set(this.currFood, 'heatNum', this.heatNum);
			this.$set(this.currFood, 'amount', this.choiceNum);

			if (this.currTime) {
				this.$set(this.currFood, 'htime', this.currTime);
			} else {
				this.$set(this.currFood, 'htime', this.nowDateTime);
			}
			if (this.choiceNum) {
				this.chooseFoods = [];
				this.chooseFoods.push(this.currFood);
			}
			this.goBalanceDiet();
		},
		/* 点击食物选择数字加减**/
		countDietNum(num) {
			let self = this;
			let value = Number(this.value1);
			if (value >= 0) {
				if (num === '-0.1') {
					if (value > 0) {
						value = value - 0.1;
					} else {
						value = 0;
					}
				} else if (num === '-1') {
					if (value >= 1) {
						value = value - 1;
					}
				} else if (num === '+1') {
					value = value + 1;
				} else if (num === '+0.1') {
					value = value + 0.1;
				}
				this.value1 = value.toFixed(1);
				this.choiceNum = value.toFixed(1);
				if (Number(this.choiceNum) && !this.radioLabel) {
					this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
				} else if (Number(this.choiceNum) && this.radioLabel) {
					if (this.radioLabel.unit_amount) {
						this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
					} else {
						this.heatNum = Number(this.choiceNum) * ((this.radioLabel.amount / 100) * this.currFood.unit_energy);
					}
				}
				if (value == 0) {
					this.heatNum = 0;
				}
				let addObj = {
					name: '超标部分',
					type: 'bar',
					stack: '总数',
					data: []
				};
				let addData = [];
				let option = this.stepData.option;
				let currFood = this.currFood;
				let nutrientData = this.nutrientData;
				let result = this.result;
				nutrientData.forEach(nut => {
					let num = 0;
					if (nut.name === '脂肪' || nut.name === '碳水化合物' || nut.name === 'B3') {
						addData.push(currFood[nut.key] * Number(self.choiceNum));
					}
					result.forEach(re => {
						if (nut.name === re.nutrient) {
							num = (((currFood[nut.key] * Number(self.choiceNum)) / Number(re.val_rni)) * 100).toFixed(1);
							addData.push(Number(num));
						}
					});
				});
				addObj.data = addData;

				if (option.series[2] && option.series[2].type) {
					option.series[2].data = addData;
				} else {
					option.series.push(addObj);
				}
			}
		},
		async goBalanceDiet() {
			if (this.chooseFoods.length > 0) {
				let arr = [];
				this.chooseFoods.forEach(item => {
					let obj = {
						userno: uni.getStorageSync('login_user_info').user_no,
						hdate: this.nowDate,
						htime: this.currTime ? this.currTime : this.nowDateTime,
						name: item.name,
						amount: item.amount,
						unit: item.unit,
						energy: item.heatNum,
						user_name: uni.getStorageSync('current_user'),
						image: item.image,
						unit_weight_g: this.radioLabel ? this.radioLabel.amount : 100
					};
					// if (this.searchArg.type === 'food') {
					if (item.classify && item.classify === 'mixed_food') {
						obj['mixed_food_no'] = item.meal_no;
						obj['diret_type'] = item.classify;
					} else {
						obj['diet_contents_no'] = item.food_no;
						obj['diret_type'] = 'diet_contents';
					}
					// }
					arr.push(obj);
				});
				let serviceName = 'srvhealth_diet_record_add';
				let url = this.getServiceUrl('health', serviceName, 'operate');
				let req = [{ serviceName: serviceName, colNames: ['*'], data: arr }];
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS') {
					// if (this.searchArg.type === 'food') {
					// this.getChooseFoodList();

					// 通知健康追踪页面，饮食记录已改变，需要刷新数据
					uni.$emit('dietUpdate');
					uni.navigateBack({
						delta: 0
					});
					// }
				}
			}
		},
		async selectCurrFoodUnit(item) {
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_food_unit_amount_estimate_select', 'select');
			let req = {
				serviceName: 'srvhealth_food_unit_amount_estimate_select',
				colNames: ['*'],
				condition: [{ colName: 'food_no', ruleType: 'eq', value: item.food_no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			this.radioLabel = '';
			this.radioIndex = 0;
			let unitList = [];
			unitList.push(item);
			if (res.data.state === 'SUCCESS') {
				unitList = [...unitList, ...res.data.data];
				this.unitList = unitList;
				this.list = unitList;
			}
			console.log('食物选择单位===>>>', this.unitList);
		}
	}
};
</script>

<style scoped lang="scss">
.food_wrap {
	background-color: #f8f8f8;
	height: 100vh;
}
.contents {
	// overflow: hidden;
	.flexSelece {
	}
}
.filtrate-wrap {
	.filtrate-choose {
		display: flex;
		align-items: center;
		padding-left: 20upx;
		.filtrate-choose-item {
			padding: 10upx;
		}
	}
	.filtrate-item-wrap {
		background-color: white;
		.filtrate-item {
			display: flex;
			.filtrate-item-left {
				padding: 10upx 20upx;
			}
			.filtrate-item-right {
				// padding: 10upx 20upx;
				display: flex;
				margin: 0 10upx;
				align-items: center;
			}
			.cate-active {
				color: red;
				/deep/ .u-icon {
					display: flex;
					padding-bottom: 8upx;
					padding-left: 2upx;
				}
			}
		}
	}
}
.food-list {
	display: flex;
	flex-direction: column;
	border-top: 1upx solid #eee;
	// margin-top: 50upx;
	.list-item {
		display: flex;
		width: calc(100% - 50upx);
		margin: 0 auto;
		padding: 10upx;
		align-items: center;
		border-bottom: 1upx solid #eee;
		.img-box {
			width: 100upx;
			height: 100upx;
			border-radius: 10upx;
			background-color: #eee;
			image {
				width: 100%;
				height: 100%;
			}
		}
		.info {
			flex: 1;
			padding-left: 20upx;
			.name {
				font-weight: 700;
				font-size: 28upx;
				line-height: 40upx;
			}
			.infomation {
				font-size: 20upx;
				transform: scale(0.7);
				color: #999;
				.calorie {
					padding-right: 10upx;
				}
			}
		}
		.status {
			width: 20upx;
			height: 20upx;
			border-radius: 50%;
		}
	}
}
.text {
	margin-top: 50px;
	margin-left: 20px;
	width: 100%;
}
.contentList {
	display: flex;
	flex-wrap: wrap;
	overflow-y: scroll;
	// height: calc(100vh - 300upx) !important;
}
.boxfood {
	border-top: 1upx solid #e8e8e8;
	// padding: 25upx 0;
	background: #ffffff;
	width: 23%;
	// flex:1;
	margin: 20upx 10upx 0 0;
	height: 100% !important;
	display: flex;
	align-items: center;
	position: relative;
	flex-wrap: wrap;
	padding-right: 0 !important;
	border-radius: 20upx;
	&:nth-child(4n + 1) {
		margin-left: 14upx;
	}
	.boxfood-item {
		width: 100%;
		justify-content: space-between;
		display: flex;
	}
	// .relian {
	// 	// position: absolute;
	// 	// right: 40px;
	// 	// top: 0;
	// 	// bottom: 0;
	// 	display: flex;
	// 	margin-right: 20upx;
	// 	align-items: center;
	// 	font-size: 12px;
	// 	.status {
	// 		display: block;
	// 		height: 20upx;
	// 		width: 20upx;
	// 		border-radius: 50%;
	// 		margin-right: 10upx;
	// 	}
	// }
	.smallbox {
		align-items: center;
		display: flex;
		flex-direction: column;
		width: 100%;
		.smallbox-img {
			width: 100%;
			height: 100upx;
			image {
				width: 100%;
				height: 100upx;
				border-radius: 8upx;
			}
			/deep/ .u-image__image {
				div {
					background-size: 100% 100% !important;
				}
			}
		}

		.textbox {
			width: 100%;
			padding: 10upx 4upx;
			.title-food {
				font-weight: bold;
				font-size: 30upx;
				display: flex;
				justify-content: center;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				text-align: center;
			}
			.lock-ele {
				margin-left: 5px;
				.second-lock {
					color: #dc2a26;
				}
			}
			.food-utis {
				margin-top: 6upx;
				font-size: 24upx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
				.utis {
					color: #807d7d;
				}
				.number {
					color: #dc2a26;
				}
			}
		}
	}
}
.cu-bar {
	padding: 0 50upx;
	justify-content: center;
}

.input-box {
	display: flex;
	// flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	/deep/ input {
		width: 65upx !important;
		text-align: center;
	}
	.key-left {
		text {
			padding: 12upx 12upx;
			background-color: #d6e2eb;
			font-size: 30upx;
			min-width: 100upx;
			text-align: center;
			display: inline-block;
			margin-right: 20upx;
			border-radius: 5px;
		}
	}
	.key-right {
		text {
			padding: 12upx 12upx;
			background-color: #d6e2eb;
			font-size: 30upx;
			min-width: 100upx;
			text-align: center;
			display: inline-block;
			margin-left: 20upx;
			border-radius: 5px;
		}
	}
	.digit {
		width: 33%;
		padding: 20rpx 0;
		display: flex;
		justify-content: center;
		align-items: center;
		border-right: 1px solid #cccccc;
		border-bottom: 1px solid #cccccc;
		font-size: 18px;
		&:active {
			box-shadow: 0 0 12px rgba(0, 0, 0, 0.1);
		}
		&:nth-child(3n) {
			border-right: none;
			flex: 1;
		}
		&:nth-child(10) {
			border-bottom: none;
		}
		&:nth-child(11) {
			border-bottom: none;
		}
		&:nth-child(12) {
			border-bottom: none;
		}
	}
}
.public-button-box {
	position: relative;
}
.add-button {
	position: fixed;
	bottom: 20upx;
	left: calc(50% - 50upx);
	width: 100upx;
	height: 100upx;
	border-radius: 50%;
	background-color: rgb(246, 210, 0);
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24px;
	color: white;
	.add-button-wrap {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
		color: white;
		.add-button-num {
			display: flex;
			justify-content: center;
			position: absolute;
			right: -4px;
			top: 1px;
			height: 18px;
			width: 18px;
			background-color: #ff4000;
			color: #ffffff;
			border-radius: 50%;
			z-index: 1;
			font-size: 10px;
			text-align: center;
			line-height: 18px;
		}
	}
}
.car-model {
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 990;
	.cu-dialog {
		max-height: 60vh;
		.cu-bar {
			.left {
				min-width: 48px;
				min-height: 48px;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 17px;
				opacity: 0;
			}
		}
		.foods-cont {
			padding: 0;
			min-height: calc(50vh - 200rpx);
			max-height: calc(60vh - 200rpx);
			overflow-y: scroll;
			display: flex;
			flex-direction: column;
			.boxfood_car {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin: 5px;
				margin-bottom: 0;
				background-color: white;
				.smallbox_car {
					display: flex;
					align-items: center;
					image {
						width: 100upx;
						height: 100upx;
						margin: 10upx;
					}
				}
				.relian {
					margin-right: 10px;
				}
			}
		}
		.button-box {
			display: flex;
			justify-content: center;
			align-items: flex-end;
			padding: 15rpx 0;
			button {
				width: 80%;
			}
		}
	}
}

.date-time {
	display: flex;
	color: #000;
	font-weight: 700;
	font-size: 16px;
}
.foods-move {
	width: 130upx !important;
}
.contentList /deep/ .move-cur {
	transform: translateX(-130upx) !important;
}
.ele-text-wrap {
	display: flex;
	flex-direction: column;
	color: #999;
	margin-left: 10px;
	margin-top: 10px;
	// padding: 20upx 0;
	.ele-text-top-tit{
		display: flex;
		margin-bottom: 15rpx;
		text{
			padding: 4rpx 20rpx;
			border: 1px solid #ccc;
			margin-right: 20rpx;
			border-radius: 30rpx;
		}
		.active-text-top-tit{
			background-color: #fbbd08;
			color: white;
			border-color: #FBBD08;
		}
	}
	
	.ele-text-cen {
		display: flex;
		flex-wrap: wrap;
		.ele-text-cen-item-title {
			color: #000000;
		}
		.ele-text-cen-item {
			display: flex;
			flex-direction: column;
			height: 100%;
			margin: 0 20upx;
			.ele-text-cen-item-cen {
				display: flex;
				flex-wrap: wrap;
			}
		}
	}
	.ele-text {
		margin: 5px;
	}
}
.radio-modal {
	display: flex;
	align-items: center;
}
.radio-modal /deep/ uni-radio::before {
	right: 20upx;
}
.change-tab {
	width: 100px;
	margin: 0 0 0 auto;
	margin-top: -20px;
}
.change-tab /deep/ .u-tab-item {
	padding: 0 10rpx;
}
.calculate {
	display: flex;
	justify-content: flex-start;
	// flex-wrap: wrap;
	padding: 20upx 20upx;
	min-height: 100upx;
	align-items: center;
	font-size: 36upx;
	margin-right: 20upx;
	color: #999;
	.calculate-l {
		width: 100rpx;
		font-size: 28upx;
	}
	.calorie {
		min-width: 115upx;
	}
	.weight {
		display: flex;
		align-items: center;
		font-size: 28upx;
		flex-wrap: wrap;
		white-space: nowrap;
		overflow-x: scroll;
		// justify-content: flex-end;
		// flex-wrap: wrap;
		// min-width: 220upx;
		.calculate-l {
			font-size: 28upx;
			margin-bottom: 16upx;
		}
		.unit {
			margin-right: 10upx;
			background-color: #f8f8f8;
			color: #999;
			border-radius: 40upx;
			border: 1px solid #999;
			padding: 0px 16upx;
			min-height: 54upx;
			display: flex;
			align-items: center;
			margin-bottom: 10upx;
		}
		.active-unit {
			border: 1px solid #f37b1d;
			background-color: #f37b1d;
			color: #fff;
			// color: red;
			// font-size: 32upx;
		}
		image {
			width: 40upx;
			height: 40upx;
			margin-left: 20upx;
		}
	}
}
.amount {
	color: #009688;
	font-weight: 800;
	.number {
		padding: 0 20upx;
		font-size: 34upx;
	}
	.unit {
		text-align: center;
		padding: 10upx 0upx;
	}
}
.foods-btn {
	padding: 60upx 0;
	display: flex;
	justify-content: center;
	background-color: #f8f8f8;
	text {
		padding: 15upx 40upx;
		background-color: #1cbbb4;
		color: white;
		border-radius: 10upx;
		font-size: 28upx;
		width: 30%;
		text-align: center;
		&:first-child {
			margin-right: 90upx;
		}
	}
}
.uni-ec-canvas {
	width: 710rpx;
	height: 540rpx;
}
</style>
