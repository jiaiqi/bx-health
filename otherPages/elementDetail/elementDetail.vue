<template>
	<view class="element-wrap">
		<view class="element-box">
			<view class="element-name">
				<text class="text">{{ elementData.label }}({{ elementData.units }})</text>
			</view>
			<view class="ele-item-wrap" v-if="elementData.label !== '钠'">
				<text class="ele-item-name">{{ elementData.name }}</text>
				<view class="probar">
					<view class="cu-progress progress-bar radius">
						<view
							v-if="elementData.value_left || elementData.value_left === 0"
							class="pointer"
							:text="elementData.value === 0 ? '0' : elementData.value.toFixed(2)"
							:style="{ left: elementData.value_left * 2 + 'px' }"
						>
							<view class="after">{{ elementData.value === 0 ? '0' : elementData.value.toFixed(2) }}</view>
						</view>
						<view
							class="bg-grey EAR"
							:style="{
								width: elementData.left_width ? elementData.left_width * 2 + 'px' : '33%'
							}"
						>
							<view class="after">{{ elementData.left_width ? elementData.EAR : '' }}</view>
						</view>
						<view
							class="bg-olive regular"
							:style="{
								width: elementData.center_width ? elementData.center_width * 2 + 'px' : '33%',
								'border-top-right-radius': !elementData.UL ? '5px' : '',
								'border-bottom-right-radius': !elementData.UL ? '5px' : ''
							}"
						></view>
						<view
							class="risk"
							:style="{
								width: elementData.UL && elementData.right_width ? elementData.right_width * 2 + 'px' : !elementData.UL ? 0 : '33%'
							}"
						>
							<view class="after">{{ elementData.right_width && elementData.UL ? elementData.UL : '' }}</view>
							<view
								class="before"
								:class="{
									lack: elementData.value < elementData.EAR,
									normal: elementData.value >= elementData.EAR && (elementData.value <= elementData.UL || !elementData.UL),
									over: elementData.UL && elementData.value > elementData.UL
								}"
							>
								{{ elementData.value < elementData.EAR ? '不足' : elementData.UL && elementData.value > elementData.UL ? '过多' : '正常' }}
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="qiun-charts">
				<!-- #ifdef MP-WEIXIN -->
				<uni-ec-canvas class="uni-ec-canvas" ref="canvasPie" @click-chart="clickCharts" canvas-id="canvasPie" :ec="ec"></uni-ec-canvas>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<uni-echarts @click-chart="clickCharts" class="uni-ec-canvas" ref="canvasPie" canvas-id="canvasPie" :ec="ec"></uni-echarts>
				<!-- #endif -->
			</view>
		</view>
		<view class="element-box">
			<view class="element-name title">
				<text class="text">饮食记录</text>
				<button class="cu-btn bg-white text-blue" @click="toAddDiet">
					<text class="cuIcon-add margin-right-xs"></text>
					选餐
				</button>
			</view>
			<view class="cu-list">
				<view class="diet-item column-name">
					<view class="column">食物名称</view>
					<view class="column">单位</view>
					<view class="column">{{ elementData.label }}</view>
					<view class="column">热量</view>
				</view>
				<view
					@touchstart="ListTouchStart"
					@touchmove="ListTouchMove"
					@touchend="ListTouchEnd"
					@click="clickDietItem(item)"
					:data-target="'move-box-' + index"
					class="diet-item cu-item"
					v-for="(item, index) in dietRecord"
					:key="index"
					:class="modalName == 'move-box-' + index ? 'move-cur' : ''"
				>
					<view class="column diet-name">{{ item.name }}</view>
					<view class="column">{{ item.unit === 'g' ? item.amount * item.unit_weight_g + item.unit : item.amount + item.unit }}</view>
					<view class="column">{{ (item.amount * item[elementData.key]).toFixed(1) + elementData.units }}</view>
					<view class="column">{{ item.amount * item.unit_energy }}千卡</view>
					<view class="move column"><view class="" @click="deleteItem(item)">删除</view></view>
				</view>
				<view class="diet-item total" v-if="dietRecord.length > 0">
					<view class="column">共计:</view>
					<view class="column">{{ totalWeight }}g</view>
					<view class="column">{{ totalNutrient + elementData.units }}</view>
					<view class="column heat">{{ totalCalories }}千卡</view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: showEditModal }" @click.self="(showEditModal = false), (currentRecord = null)">
			<!-- <u-popup v-model="showEditModal" mode="bottom" border-radius="50"> -->
			<!-- <view class="cu-modal bottom-modal" :class="{ show: showEditModal }" @click.self="(showEditModal = false), (currentDiet = null)"> -->
			<view class="cu-dialog current-diet-detail" v-if="currentDiet">
				<view class="title-bar" v-if="currentDiet.hdate && currentDiet.htime">
					<view class="date">{{ currentDiet.hdate + ' ' + currentDiet.htime.slice(0, 5) }}</view>
				</view>
				<view class="diet-info">
					<view class="img"><u-image width="100%" height="100%" :src="currentDietImgUrl"></u-image></view>
					<view class="info">
						<view class="name">
							{{ currentDiet.name }}
							<view class="delete-icon" @click="deleteItem(currentDiet)">
								<text class="text">删除记录</text>
								<text class="cuIcon-delete"></text>
							</view>
						</view>
						<view class="weight">
							<text class="label margin-right-xs">热量:</text>
							<text class="heat">
								{{ currentDiet.energy }}
								<text class="unit">千卡</text>
							</text>
						</view>
						<view class="">
							<text class="label text-bold margin-right-xs">单位:</text>
							<!-- {{ currentDiet.unit_weight_g ? currentDiet.amount * currentDiet.unit_weight_g : currentDiet.amount }} -->
							<text class="unit">{{ currentDiet.unit }}</text>
						</view>
					</view>
					<view class="chart-box">
						<!-- #ifdef MP-WEIXIN -->
						<uni-ec-canvas class="uni-ec-canvas" ref="uni-ec-canvas2" canvas-id="uni-ec-canvas2" :ec="currentDietChartData"></uni-ec-canvas>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<uni-echarts class="uni-ec-canvas" ref="uni-ec-canvas2" canvas-id="uni-ec-canvas2" :ec="currentDietChartData"></uni-echarts>
						<!-- #endif -->
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
							<text @click="changeCurrentVal('minus', 0.1)" class="symbol">-0.1</text>
							<text @click="changeCurrentVal('minus')" class="symbol">-1</text>
							<input class="input" @change="changeValue" v-model.number="currentDiet.amount" type="number" />
							<text @click="changeCurrentVal('plus')" class="symbol">+1</text>
							<text @click="changeCurrentVal('plus', 0.1)" class="symbol">+0.1</text>
						</view>
					</view>
				</view>
				<view class="delete-bar">
					<view class="btn bg-grey" @click="(showEditModal = false), (currentDiet = null)">取消</view>
					<view class="btn bg-blue" @click="UpdateDietInfo">确认</view>
				</view>
				<view class="number-bar"></view>
				<view class="unit-bar"></view>
			</view>
			<!-- </u-popup> -->
		</view>
	</view>
</template>

<script>
var _self;
// #ifdef MP-WEIXIN
import uniEcCanvas from '@/components/uni-ec-canvas/uni-ec-canvas.vue';
// import uniEcCanvas from '@/otherPages/components/uni-ec-canvas/uni-ec-canvas.vue';
// #endif
// #ifdef H5
import uniEcharts from '@/components/uni-ec-canvas/uni-echarts.vue';
// import uniEcharts from '@/otherPages/components/uni-ec-canvas/uni-echarts.vue';
// #endif
import energyListWrap from '../static/js/totalEnergyList.js';
export default {
	components: {
		// #ifdef MP-WEIXIN
		uniEcCanvas,
		// #endif
		// #ifdef H5
		uniEcharts
		// #endif
	},
	computed: {
		totalWeight() {
			let total = 0;
			this.dietRecord.forEach(item => {
				total = total + item.amount * item.unit_weight_g;
			});
			return Number(total.toFixed(1));
		},
		totalNutrient() {
			let total = 0;
			this.dietRecord.forEach(item => {
				total = total + item.amount * item[this.elementData.key];
			});
			return Number(total.toFixed(1));
		},
		totalCalories() {
			let total = 0;
			this.dietRecord.forEach(item => {
				total += item.energy;
			});
			return Number(total.toFixed(1));
		},
		currentDietImgUrl() {
			let currentDiet = this.currentDiet;
			if (currentDiet && currentDiet.image) {
				return this.$api.downloadFile + currentDiet['image'] + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket') + '&thumbnailType=fwsu_100';
			}
		},
		age() {
			if (this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
				return age;
			}
		}
	},
	data() {
		return {
			currentDietChartData: {},
			ec: {},
			currentDiet: null,
			currentUnitIndex: 0,
			unitList: [],
			showEditModal: false,
			chartData: {
				series: []
			},
			elementData: {},
			copyElementData: {},
			user_no: '',
			date: '',
			dietRecord: [],
			listTouchStart: 0,
			modalName: null,
			piearr: [],
			energyListWrap: energyListWrap,
			userInfo: uni.getStorageSync('current_user_info')
		};
	},
	methods: {
		clickCharts(e) {
			console.log(e);
		},
		async getFoodUnit(item) {
			// 查找当前食物的单位
			let url = this.getServiceUrl('health', 'srvhealth_food_unit_amount_estimate_select', 'select');
			let req = {
				serviceName: 'srvhealth_food_unit_amount_estimate_select',
				colNames: ['*'],
				condition: [{ colName: 'food_no', ruleType: 'eq', value: item.diet_contents_no ? item.diet_contents_no : item.mixed_food_no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			let unitList = [];
			unitList.push(item);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				unitList = [...unitList,...res.data.data];
			} else {
				// unitList = [item];
			}
			this.unitList = unitList;
			return unitList;
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
		checkUnit(item, index) {
			// 切换单位
			this.currentUnitIndex = index;
			let currentUnit = this.unitList[index];
			console.log(this.currentDiet);
			//TODO 动态改变热量
			this.currentDiet.unit_weight_g = currentUnit.unit_weight_g ? currentUnit.unit_weight_g : currentUnit.amount;
			this.currentDiet.unit = item.unit;
			this.buildCurrenDietChartOption();
		},
		async buildCurrenDietChartOption() {
			let currentDiet = this.deepClone(this.currentDiet);
			let dietRecordList = this.deepClone(this.dietRecord);
			let foodType = [];
			if (Array.isArray(this.foodType) && this.foodType.length > 0) {
				foodType = this.deepClone(this.foodType);
			} else {
				let record = this.dietRecord;
				let condition = null;
				if (Array.isArray(record) && record.length > 0) {
					let names = record.map(item => item.name);
					condition = [
						{
							colName: 'name',
							ruleType: 'in',
							value: names.toString()
						}
					];
					foodType = await this.getFoodType(condition);
				}
			}
			foodType.forEach(food => {
				if (currentDiet.name === food.name) {
					currentDiet = { ...food, ...currentDiet };
				}
			});
			this.energyListWrap = await this.buildDietData();
			console.log(this.energyListWrap);
			let energyList = this.deepClone(this.energyListWrap);
			let eleArr = [];
			energyList.forEach(item => {
				item.matterList.forEach(ele => {
					eleArr.push(ele);
				});
			});
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
						obj.data = eleArr.map(item => {
							let ratio = (currentDiet.unit_weight_g * currentDiet.amount) / 100;
							item.value = item.value - currentDiet[item.key];
							let num = (item.value * 100) / Number(item.EAR);
							num = Math.abs(parseFloat(num.toFixed(1)));
							return num;
						});
						break;
					case '当前食物':
						obj.data = eleArr.map(item => {
							let ratio = (currentDiet.unit_weight_g * currentDiet.amount) / 100;
							let num = currentDiet[item.key] ? (ratio * currentDiet[item.key] * 100) / Number(item.EAR) : 0;
							num = Math.abs(parseFloat(num.toFixed(1)));
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
				tooltip: {
					show: false,
					trigger: 'axis'
				},
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
			this.currentDietChartData = result;
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
				result.forEach(item => {
					self.energyListWrap.forEach(energy => {
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
				console.log(this.deepClone(self.energyListWrap));
				return result;
			}
		},
		/* 根据饮食记录查找食物**/
		async getChooseFood(str) {
			let url = this.getServiceUrl('health', 'srvhealth_diet_contents_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_contents_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'name',
						ruleType: 'in',
						value: str
					}
				]
			};
			let res = await this.$http.post(url, req);
			console.log('res-------', res.data.data);
			return res.data.data;
		},
		async buildDietData() {
			let data = this.dietRecord;
			let strArr = [];
			data.forEach(item => {
				item['editable'] = false;
				strArr.push(item.name);
			});
			let energyList = this.deepClone(this.energyListWrap);
			let str = strArr.join();
			let a = await this.getChooseFood(str);
			if (Array.isArray(a) && a.length > 0) {
				a.forEach(food => {
					data.forEach(re => {
						if (food.name === re.name) {
							food['amount'] = food['amount'] ? food['amount'] + re.amount : re.amount;
						}
					});
				});
				let chooseFood = a;
				if (chooseFood && chooseFood.length > 0) {
					let eledata = '';
					energyList.forEach(item => {
						item.matterList.forEach(mat => {
							mat.value = 0;
							chooseFood.forEach(fod => {
								for (let a in fod) {
									if (mat.key && mat.key == a) {
										mat.value = Number(mat.value) + Number(fod.amount) * Number(fod[a]);
									}
								}
							});
						});
					});
				}
			}
			return energyList;
		},
		async clickDietItem(item) {
			let unitList = await this.getFoodUnit(item);
			unitList.forEach((unit, index) => {
				console.log(item, unit);
				if (item.unit === unit.unit) {
					this.currentUnitIndex = index;
				}
			});
			this.showEditModal = true;
			this.currentDiet = this.deepClone(item);
			this.buildCurrenDietChartOption();
		},
		async UpdateDietInfo() {
			let self = this;
			let dietInfo = this.deepClone(this.currentDiet);
			let serviceName = 'srvhealth_diet_record_update';
			let url = this.getServiceUrl('health', serviceName, 'operate');
			let req = [
				{
					serviceName: 'srvhealth_diet_record_update',
					condition: [{ colName: 'id', ruleType: 'eq', value: dietInfo.id }],
					data: [
						{
							amount: dietInfo.amount,
							energy: dietInfo.energy,
							unit_weight_g: dietInfo.unit_weight_g,
							unit: dietInfo.unit
						}
					]
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				await self.getDietRecord();
				console.log(self.elementData);
				self.showEditModal = false;
			}
		},
		changeCurrentVal(e, step = 1) {
			if (e === 'minus') {
				if (this.currentDiet.amount >= 1) {
					this.currentDiet.amount = Number((this.currentDiet.amount - step).toFixed(1));
				} else {
					return;
				}
			} else {
				this.currentDiet.amount = Number((this.currentDiet.amount + step).toFixed(1));
			}
			this.buildCurrenDietChartOption();
		},
		toAddDiet() {
			// 跳转到选餐页面
			let elementData = this.deepClone(this.elementData);
			const condType = {
				type: 'food',
				serviceName: 'srvhealth_diet_contents_select',
				colName: 'name',
				imgCol: 'image',
				wordKey: {
					title: 'name',
					unit: 'unit',
					energy: 'unit_energy'
				},
				lackEle: elementData
			};
			// if (elementData.value < elementData.EAR) {
			condType.order = [
				{
					colName: this.elementData.key,
					orderType: 'desc' // asc升序  desc降序
				}
			];
			const url = '/otherPages/dietSelect/dietSelect?condType=' + encodeURIComponent(JSON.stringify(condType));
			uni.navigateTo({
				url: url
			});
		},
		deleteItem(item) {
			let self = this;
			uni.showModal({
				title: '提示',
				content: '确定要删除吗?',
				success(res) {
					if (res.confirm) {
						let url = self.getServiceUrl('health', 'srvhealth_diet_record_delete', 'operate');
						let req = [
							{
								serviceName: 'srvhealth_diet_record_delete',
								condition: [{ colName: 'id', ruleType: 'in', value: item.id }]
							}
						];
						self.$http.post(url, req).then(res => {
							if (res.data.state === 'SUCCESS') {
								uni.showToast({
									title: '删除成功'
								});
								self.showEditModal = false;
								self.getDietRecord();
							}
						});
					}
				}
			});
		},
		async getDietList(foodNameStr) {
			// 食物列表
			let url = this.getServiceUrl('health', 'srvhealth_diet_contents_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_contents_select',
				colNames: ['*'],
				condition: [{ colName: 'name', ruleType: 'in', value: foodNameStr }]
			};
			if (this.elementData.key) {
				req.order = [
					{
						colName: this.elementData.key,
						orderType: 'desc' // asc升序  desc降序
					}
				];
			}
			let res = await this.$http.post(url, req);
			return res.data.data;
		},
		async getDietRecord() {
			await this.getNutrientRecommended();
			// 饮食记录
			let url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_record_select',
				colNames: ['*'],
				condition: [
					{ colName: 'userno', ruleType: 'like', value: this.user_no },
					{
						colName: 'user_name',
						ruleType: 'like',
						value: uni.getStorageSync('current_user')
					},
					{ colName: 'hdate', ruleType: 'like', value: this.date.trim() }
				]
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				let foodNameList = res.data.data.map(item => {
					return item.name;
				});
				let foodNameStr = foodNameList.toString();
				let foodList = await this.getDietList(foodNameStr);
				res.data.data.forEach(item => {
					foodList.forEach(food => {
						if (food.name === item.name) {
							item[this.elementData.key] = food[this.elementData.key];
							item['unit_energy'] = food.unit_energy;
							if (food.image) {
								item['image'] = food['image'];
							}
						}
					});
				});
				let resultData = this.deepClone(res.data.data);
				this.dietRecord = resultData.sort((a, b) => {
					return b[this.elementData.key] * b.amount - a[this.elementData.key] * a.amount;
				});
				let dietNameList = [];
				let dietList = [];
				res.data.data.forEach(item => {
					if (dietNameList.indexOf(item.name) !== -1) {
						dietList[dietNameList.indexOf(item.name)].amount += item.amount;
					} else {
						dietNameList.push(item.name);
						dietList.push(item);
					}
				});
				let series = dietList.map(item => {
					return {
						unit: item.unit,
						name: item.name,
						amount: item.amount,
						value: item[this.elementData.key] * item.amount
					};
				});
				this.buildEchartsData(series);
				_self.elementData.value_left = 0;
				return this.dietRecord;
			}
		},
		buildEchartsData(data) {
			// 构建echarts需要的数据格式
			let elementData = this.elementData;
			let option = {
				color: [
					'#0090ff',
					'#06d3c4',
					'#ffbc32',
					'#2ccc44',
					'#ff3976',
					'#6173d6',
					'#914ce5',
					'#42b1cc',
					'#ff55ac',
					'#0090ff',
					'#06d3c4',
					'#ffbc32',
					'#2ccc44',
					'#ff3976',
					'#6173d6',
					'#914ce5',
					'#42b1cc',
					'#ff55ac'
				],
				label: {
					formatter: '{b}:{d}%'
				},
				tooltip: {
					trigger: 'item',
					formatter: '{a}:{b}:{c}' + elementData.units + '({d}%)'
				},
				series: {
					name: '食物占比',
					type: 'pie',
					radius: '50%',
					center: ['50%', '50%'],
					data: data,
					labelLine: {
						smooth: true
					}
				}
			};
			let result = {
				option: option
			};
			this.ec = result;
			return result;
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
	created() {
		uni.$on('dietUpdate', () => {
			this.getDietRecord();
		});
	},
	onLoad(e) {
		_self = this;
		if (e.data) {
			try {
				let data = JSON.parse(e.data);
				if (data.units.indexOf('/d') !== -1) {
					data.units = data.units.slice(0, data.units.indexOf('/d'));
				}
				this.elementData = data;
				_self.elementData.value_left = 0;
				setTimeout(() => {
					_self.elementData.value_left = JSON.parse(e.data).value_left;
				}, 1000);
				this.copyElementData = JSON.parse(e.data);
			} catch (e) {
				//TODO handle the exception
			}
		}
		if (e.user_no && e.date) {
			this.user_no = e.user_no;
			this.date = e.date;
			this.getDietRecord();
		}
	}
};
</script>

<style scoped lang="scss">
.element-wrap {
	width: 100%;
	background-color: #fff;
	min-height: 100vh;
	padding: 20rpx 0;
	.element-box {
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		margin: 0 20rpx 20rpx;
	}
	.qiun-charts {
		width: 100%;
		height: 500rpx;
		background-color: #ffffff;
	}
	.chart-box {
		width: 100%;
		height: 550rpx;
	}
	.charts-pie {
		width: 100%;
		height: 500upx;
		background-color: #ffffff;
	}

	.cu-list {
		margin-bottom: 20rpx;
		overflow: hidden;
	}
	.cu-modal {
		z-index: 666;
	}
	.current-diet-detail {
		width: 100vw;
		height: 100%;
		overflow: scroll;
		.title-bar {
			display: flex;
			justify-content: center;
			min-height: 80rpx;
			align-items: center;
			background-color: #fff;
			.date {
				font-size: 28rpx;
				font-weight: bold;
			}
			.btn {
				padding: 030rpx;
				color: #0081ff;
				font-size: 28rpx;
			}
		}
		.diet-info {
			display: flex;
			padding: 20rpx 0;
			justify-content: space-around;
			flex-wrap: wrap;
			.img {
				width: 200rpx;
				height: 200rpx;
				border-radius: 10rpx;
				overflow: hidden;
				box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
			}
			.info {
				min-width: 400rpx;
				padding-left: 50rpx;
				display: flex;
				flex-direction: column;
				.delete-icon {
					padding: 10rpx 20rpx;
					background-color: #fff;
					font-size: 24rpx;
					border-radius: 60rpx;
					text-align: center;
					transition: all 0.5s;
					border: 1rpx solid #e54d42;
					color: #f56c6c;
					background: #fef0f0;
					border-color: #fbc4c4;
					&:active {
						background-color: #e54d42;
						color: #fff;
						transform: scale(1.1);
						box-shadow: 0 0 10px #e54d42;
					}
					.text {
					}
				}
				.cuIcon-delete {
					display: inline-block;
					text-align: center;
					border-radius: 100%;
				}
				.name {
					font-weight: 700;
					font-size: 16px;
					display: flex;
					justify-content: space-between;
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
			.amount {
				display: flex;
				align-items: center;
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
					margin-bottom: 5px;
					font-size: 20rpx;
				}
				.active-unit {
					font-size: 26rpx;
					border: 1px solid #f37b1d;
					background-color: #f37b1d;
					color: #fff;
				}
			}
		}
		.delete-bar {
			flex: 1;
			padding: 15rpx 30rpx;
			letter-spacing: 2px;
			color: #999;
			border-top: 1px solid #f1f1f1;
			display: flex;
			justify-content: space-between;
			align-items: center;
			font-size: 50rpx;
			padding-top: 30rpx;
			margin-bottom: 100rpx;
			.btn {
				padding: 10rpx 30rpx;
				border-radius: 10rpx;
				font-size: 28rpx;
				flex: 1;
				margin-right: 20rpx;
				text-align: center;
				&:last-child {
					margin-right: 0rpx;
				}
			}
		}
	}
}
.element-name {
	font-size: 34upx;
	font-weight: 600;
	position: relative;
	padding: 20rpx 0;
	display: flex;
	justify-content: space-between;
	background-color: #fff;
	border-bottom: 0.5px solid #f1f1f1;
	.cu-btn {
		border-radius: 0;
		height: auto;
	}
	.text {
		position: relative;
		text-indent: 45rpx;
		&::before {
			content: '';
			width: 8rpx;
			height: 30rpx;
			border-radius: 10rpx;
			background-color: #0081ff;
			position: absolute;
			left: 20rpx;
			top: 10rpx;
		}
	}
}

.ele-item-wrap {
	width: 100%;
	display: flex;
	align-items: center;
	// justify-content: center;
	background-color: #fff;
	padding: 40rpx 0 10rpx;
	padding-left: 20rpx;
	.probar {
		padding: 0 10rpx;
		position: relative;
		.pointer {
			position: absolute;
			width: 8rpx;
			height: 50rpx;
			bottom: 0;
			background-color: rgba(250, 65, 65, 0.6);
			z-index: 20;
			border-radius: 20rpx;
			transition: left 1s ease;
			.after {
				position: absolute;
				font-size: 14px;
				top: -35rpx;
				color: red;
			}
		}
		.EAR {
			transition: none;
			.after {
				position: absolute;
				right: 0px;
				color: #333;
				z-index: 2;
			}
		}
		.risk {
			transition: none;
			.after {
				position: absolute;
				left: 0px;
				color: #333;
				z-index: 2;
			}
			.before {
				width: auto;
				position: absolute;
				right: -26px;
				color: #333;
				font-size: 12px;
				z-index: 2;
				&.lack {
					color: #333;
				}
				&.normal {
					color: #8dc63f;
				}
				&.over {
					color: #ffb347;
				}
			}
		}

		.regular {
			transition: none;
			position: relative;
		}
		.progress-bar {
			height: 40rpx;
			position: relative;
			width: auto;
			overflow: inherit;
			background-color: #fff;
		}
	}
	.ele-item-name {
		font-size: 14px;
		font-weight: 700;
		min-width: 30px;
		text-align: right;
	}
	.ele-item-num {
		text-align: center;
		background: #39b54a;
		padding: 4px 5px;
		border-radius: 4px;
		font-size: 12px;
		min-width: 75px;
		:nth-child(2) {
			font-size: 14px;
			font-weight: 700;
		}
	}
	.max {
		background-color: #e54d42;
	}
}
.diet-item {
	display: flex;
	position: relative;
	&.cu-item {
		&:active {
			transform: scale(1.2);
			background-color: #999;
		}
	}
	.diet-name {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	&.column-name {
		color: #9c9c9c;
	}
	&.total {
		background-color: #f1f1f1;
		font-weight: 700;
		// color: #fff;
		.column {
			background-color: transparent;
		}
		.heat {
			color: #ffb347;
		}
	}
	.column {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #fff;
		min-height: 80rpx;
		border-top: 1rpx solid #f1f1f1;
		white-space: nowrap;
		&:first-child {
			text-indent: 20px;
			justify-content: flex-start;
		}
		&:last-child {
			// flex: 0.5;
			// background-color: #fa3534;
			// color: #fff;
		}
		&.move {
			flex: 0.5;
			background-color: #fa3534;
			color: #fff;
		}
	}
}

.max-risk {
	right: 8%;
	.tootio-item {
		background-color: #ffb347;
		border-color: #ffb347;
		color: #ffffff;
		&::before {
			border-color: #ffb347 transparent transparent;
		}
	}
}
.min-low {
	left: 30rpx;
	.tootio-item {
		background-color: #00c2ff;
		border-color: #00c2ff;
		color: #ffffff;
		&::before {
			border-color: #00c2ff transparent transparent;
		}
	}
}
.EAR,
.risk {
	position: relative;
	background-color: #cfcfcf;
	border-top-left-radius: 5px;
	border-bottom-left-radius: 5px;
}
.risk {
	border-radius: 0;
	border: none;
	border-top-right-radius: 5px;
	border-bottom-right-radius: 5px;
	background-color: rgb(255, 179, 71);
}
.uni-ec-canvas {
	width: 100%;
	height: 100%;
	display: block;
}
</style>
