<template>
	<view v-if="currFood" class="food_wrap">
		<view class="cu-bar bg-white food_wrap_top" :class="pageType ? '' : 'ingredient'">
			<view @click="clickTop('edit')" v-if="pageType" class=" button">编辑</view>
			<view class="date-time">
				<view class="date-time-rq">{{ nowDate }}</view>
				/
				<view class="date-time-rq">{{ currTime ? currTime : nowDateTime }}</view>
			</view>
			<view @click="clickTop('add')" v-if="pageType" class=" button confir-btn">增加食材</view>
		</view>

		<view class="content">
			<view class="food-list">
				<view class="list-item">
					<view @click="blowImage(currFood.imgurl)" class="img-box"><image :src="currFood.imgurl"></image></view>
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
					<text
						@click="changeCate(item, index)"
						v-for="(item, index) in categoryTop"
						v-if="item.name === '食材组成' ? currFood.meal_no || (currFood.mix_type && currFood.mix_type === '混合') : true"
						:key="index"
						:class="categoryTopIndex === index ? 'active-text-top-tit' : ''"
					>
						{{ item.name }}
					</text>
				</view>
				<!-- <view class="ele-text-top">主要维生素含量如下：</view> -->
				<view v-if="categoryTopIndex === 1" class="ele-text-cen">
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">产能营养素</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>蛋白质:</text>
								<text>{{ currFood.protein ? Number(currFood.protein).toFixed(1) : '' }}g</text>
								<text style="color: red;">({{ currFood.protein >= 30.1 ? '高' : currFood.protein >= 15.5 && currFood.protein < 30.1 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>碳水化合物:</text>
								<text>{{ currFood.carbohydrate ? Number(currFood.carbohydrate).toFixed(1) : '' }}g</text>
								<text style="color: red;">
									({{ currFood.carbohydrate >= 51.9 ? '高' : currFood.carbohydrate >= 25.74 && currFood.carbohydrate < 51.9 ? '中' : '低' }})
								</text>
							</view>
							<view class="ele-text">
								<text>脂肪:</text>
								<text>{{ currFood.axunge ? Number(currFood.axunge).toFixed(1) : '' }}g</text>
								<text style="color: red;">({{ currFood.axunge >= 35.3 ? '高' : currFood.axunge >= 17.6 && currFood.axunge < 35.3 ? '中' : '低' }})</text>
							</view>
						</view>
					</view>
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">脂溶性维生素</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>VA:</text>
								<text>{{ currFood.vitamin_a ? Number(currFood.vitamin_a).toFixed(1) : '' }}ug</text>
								<text style="color: red;">({{ currFood.vitamin_a >= 915 ? '高' : currFood.vitamin_a >= 457 && currFood.vitamin_a < 915 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>VE:</text>
								<text>{{ currFood.vitamin_e ? Number(currFood.vitamin_e).toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.vitamin_e >= 27.9 ? '高' : currFood.vitamin_e >= 13.9 && currFood.vitamin_e < 27.9 ? '中' : '低' }})</text>
							</view>
						</view>
					</view>
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">水溶性维生素</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>VB1:</text>
								<text>{{ currFood.vitamin_b1 ? Number(currFood.vitamin_b1).toFixed(1) : '' }}mg</text>
								<text style="color: red;">
									({{ currFood.vitamin_b1 >= 0.61 ? '高' : currFood.vitamin_b1 >= 0.32 && currFood.vitamin_b1 < 0.61 ? '中' : '低' }})
								</text>
							</view>
							<view class="ele-text">
								<text>VB2:</text>
								<text>{{ currFood.vitamin_b2 ? Number(currFood.vitamin_b2).toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.vitamin_b2 >= 0.79 ? '高' : currFood.vitamin_b2 >= 0.4 && currFood.vitamin_b2 < 0.79 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>VB3:</text>
								<text>{{ currFood.vitamin_b3 ? Number(currFood.vitamin_b3).toFixed(1) : '' }}mg</text>
								<text style="color: red;">
									({{ currFood.vitamin_b3 >= 4.52 ? '高' : currFood.vitamin_b3 >= 2.26 && currFood.vitamin_b3 < 4.52 ? '中' : '低' }})
								</text>
							</view>
							<view class="ele-text">
								<text>VC:</text>
								<text>{{ currFood.vitamin_c ? Number(currFood.vitamin_c).toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.vitamin_c >= 61.2 ? '高' : currFood.vitamin_c >= 30.6 && currFood.vitamin_c < 61.2 ? '中' : '低' }})</text>
							</view>
						</view>
					</view>
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">常量矿物质</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>钙:</text>
								<text>{{ currFood.element_ca ? Number(currFood.element_ca).toFixed(1) : '' }}mg/</text>
								<text style="color: red;">({{ currFood.element_ca >= 381 ? '高' : currFood.element_ca >= 190.5 && currFood.element_ca < 381 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>镁:</text>
								<text>{{ currFood.element_mg ? Number(currFood.element_mg).toFixed(1) : '' }}mg</text>
								<text style="color: red;">
									({{ currFood.element_mg >= 111.6 ? '高' : currFood.element_mg >= 55.8 && currFood.element_mg < 111.6 ? '中' : '低' }})
								</text>
							</view>
							<view class="ele-text">
								<text>磷:</text>
								<text>{{ currFood.element_p ? Number(currFood.element_p).toFixed(1) : '' }}mg</text>
								<text style="color: red;">
									({{ currFood.element_p >= 296.4 ? '高' : currFood.element_p >= 148.2 && currFood.element_p < 296.4 ? '中' : '低' }})
								</text>
							</view>
							<view class="ele-text">
								<text>钾:</text>
								<text>{{ currFood.element_k ? Number(currFood.element_k).toFixed(1) : '' }}mg</text>
								<text style="color: red;">
									({{ currFood.element_k >= 526.2 ? '高' : currFood.element_k >= 263.1 && currFood.element_k < 526.2 ? '中' : '低' }})
								</text>
							</view>
						</view>
					</view>

					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">微量元素</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>铁:</text>
								<text>{{ currFood.element_fe ? Number(currFood.element_fe).toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.element_fe >= 7.2 ? '高' : currFood.element_fe >= 3.6 && currFood.element_fe < 7.2 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>锌:</text>
								<text>{{ currFood.element_zn ? Number(currFood.element_zn).toFixed(1) : '' }}mg</text>
								<text style="color: red;">({{ currFood.element_zn >= 6 ? '高' : currFood.element_zn >= 3 && currFood.element_zn < 6 ? '中' : '低' }})</text>
							</view>
							<view class="ele-text">
								<text>硒:</text>
								<text>{{ currFood.element_se ? Number(currFood.element_se).toFixed(1) : '' }}mg</text>
								<text style="color: red;">
									({{ currFood.element_se >= 23.82 ? '高' : currFood.element_se >= 11.91 && currFood.element_se < 23.82 ? '中' : '低' }})
								</text>
							</view>
							<view class="ele-text">
								<text>铜:</text>
								<text>{{ currFood.element_cu ? Number(currFood.element_cu).toFixed(1) : '' }}mg</text>
								<text style="color: red;">
									({{ currFood.element_cu >= 1.12 ? '高' : currFood.element_cu >= 0.56 && currFood.element_cu < 1.12 ? '中' : '低' }})
								</text>
							</view>
							<view class="ele-text">
								<text>锰:</text>
								<text>{{ currFood.element_mn ? Number(currFood.element_mn).toFixed(1) : '' }}mg</text>
								<text style="color: red;">
									({{ currFood.element_mn >= 4.44 ? '高' : currFood.element_mn >= 2.22 && currFood.element_mn < 4.44 ? '中' : '低' }})
								</text>
							</view>
						</view>
					</view>
				</view>
				<view v-if="categoryTopIndex == 0" class="uni-ec-canvas-wrap">
					<view class="uni-ec-canvas-top">
						<view
							@click="changeApprove(item, index)"
							v-for="(item, index) in approveData"
							class="uni-ec-canvas-top-item"
							:key="index"
							:class="currentAppr.name === item.name ? 'active-approve' : ''"
						>
							<view class="uni-ec-canvas-top-t">
								<text>{{ item.name }}</text>
							</view>
							<view class="uni-ec-canvas-top-b">
								<!-- <text>年龄:{{item.age?item.age:'??'}}</text> -->
								<text>({{ item.weight ? item.weight : '??' }}kg)</text>
							</view>
						</view>
					</view>
					<view class="uni-ec-canvas-bot">
						<!-- #ifdef MP-WEIXIN -->
						<uniEcCanvas
							v-if="categoryTopIndex == 0"
							class="uni-ec-canvas"
							id="uni-ec-canvas"
							ref="uni-ec-canvas"
							canvas-id="uni-ec-canvas"
							:ec="stepData"
						></uniEcCanvas>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<uniEcharts v-if="categoryTopIndex == 0" class="uni-ec-canvas" id="uni-ec-canvas" ref="uni-ec-canvas" canvas-id="uni-ec-canvas" :ec="stepData"></uniEcharts>
						<!-- #endif -->
					</view>
				</view>
				<view v-if="categoryTopIndex == 2 && (currFood.meal_no || (currFood.mix_type && currFood.mix_type === '混合'))" class="material-list-wrap">
					<view class="shop-detail-bot-tab">
						<view class="shop-detail-bot-tab-t">
							<text>食材名称</text>
							<text>食材含量</text>
							<text>单位</text>
						</view>
						<view v-if="foodChild.length > 0" class="shop-detail-bot-tab-m">
							<view v-for="(item, index) in foodChild" :key="index" class="shop-detail-bot-tab-m-item">
								<text>{{ item.name }}</text>
								<text>{{ item.unit_amount }}</text>
								<text>{{ item.unit }}</text>
							</view>
						</view>
						<view v-else class="detail-none">
							<view class="detail-none-t">
								<image src="/otherPages/static/img/noneData.png" mode=""></image>
								<text>暂无数据</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="calculate">
				<view v-if="!currFood.meal_no" class="cook weight">
					<view class="calculate-l">烹调方式：</view>
					<text v-if="currentCookData" @click.stop="clickCook" :class="isCookDataChoose ? 'active-cook-data' : ''">{{ currentCookData }}</text>
					<text @click="chooseCook">更多</text>
				</view>
				<view v-if="isShowZx" class="minced">
					<view class="calculate-l">自选臊子：</view>
					<!-- <view class="minced-item-all"> -->
					<text v-for="(item, index) in minceListChoose" :key="item.id" class="minced-item minced-item-active">{{ item.name }}</text>
					<!-- </view> -->
					<!-- <view @click="chooseCook('minkes')" class="minced-right-add"> -->
					<text @click="chooseCook('minkes')" class="lg text-gray cuIcon-add minced-right-add"></text>
					<!-- </view>			 -->
				</view>
				<view v-if="isShowZx" class="minced">
					<view class="calculate-l">自选配料：</view>
					<!-- <view class="minced-item-all"> -->
					<!-- <view class="minced-item-all"> -->
					<text v-for="(item, index) in chooseBurdening" :key="item.id" class="minced-item minced-item-active">{{ item.name }}</text>
					<!-- </view> -->
					<!-- <view @click="chooseCook('burdening')" class="minced-right-add"> -->
					<text @click="chooseCook('burdening')" class="lg text-gray cuIcon-add minced-right-add"></text>
					<!-- </view> -->
					<!-- </view> -->
				</view>
				<view class="weight">
					<view class="calculate-l">时间：</view>
					<view @click="chooseTime(u, ids)" v-for="(u, ids) in dinnerTime" :key="ids" :class="currFoodTime == u.value ? 'active-unit' : ''" class="unit">
						{{ u.value }}
					</view>
				</view>
				<view class="weight">
					<view class="calculate-l">单位：</view>
					<view @click="chooseUnit(u, ids)" v-for="(u, ids) in unitList" :key="ids" :class="currIndex == ids ? 'active-unit' : ''" class="unit">
						{{ u.unit_amount ? u.unit_amount + u.unit : u.unit }}
					</view>
				</view>
			</view>
			<view class="amount">
				<view class="amount-left"><text>数量：</text></view>
				<view class="input-box">
					<view class="key-left">
						<text @click="countDietNum('-0.1')">-0.1</text>
						<text @click="countDietNum('-1')">-1</text>
					</view>
					<input placeholder=" " :disabled="true" maxlength="20" v-model="choiceNum" type="number" />
					<!-- <u-input placeholder=" " :disabled="true" :clearable="false" :border="true" maxlength="20" v-model="choiceNum" type="number" /> -->
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

		<view v-if="!currFood.meal_no" class="cu-modal bottom-modal" :class="isShowCookType ? 'show' : ''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white cook-top">
					<view class="action text-blue" @tap="hideCookModel">取消</view>
					<text>常见烹调方式</text>
					<view class="action text-green" @tap="configCookFood"></view>
				</view>
				<view class="padding-xl">
					<view class="cook-wrap">
						<view
							@click="chooseCookFood(cook)"
							v-for="(cook, c) in cookData"
							:key="c"
							class="cook-item"
							:class="currentCookData == cook.value && isCookDataChoose ? 'active-cook-item' : ''"
						>
							<text>{{ cook.value }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal bottom-modal" :class="{ show: showUserHealtManagePopup }">
			<view class="cu-dialog">
				<view class="health-item">
					<bx-checkbox-group
						v-if="currFood.dish_type && currFood.dish_type === '自选臊子面食' && poupType && poupType === 'minkes'"
						mode="button"
						v-model="checkedMinceValue"
					>
						<bx-checkbox v-model="item.checked" v-for="(item, index) in minceList" :key="item.id" :name="item.name">{{ item.name }}</bx-checkbox>
					</bx-checkbox-group>

					<bx-checkbox-group
						v-if="currFood.dish_type && currFood.dish_type === '自选臊子面食' && poupType && poupType === 'burdening'"
						mode="button"
						v-model="checkedburdeningValue"
					>
						<bx-checkbox v-model="item.checked" v-for="(item, index) in burdening" :key="item.id" :name="item.name">{{ item.name }}</bx-checkbox>
					</bx-checkbox-group>

					<bx-radio-group v-model="RadioChoose" max="1" mode="button">
						<bx-radio
							v-for="item in cookData"
							v-model="item.checked"
							:key="item.value"
							:disabled="item.disable"
							:name="item.value"
							@change="checkboxGroupChange"
						>
							{{ item.label }}
						</bx-radio>
					</bx-radio-group>
					<view class="button-box">
						<button class="cu-btn" @click="closePoup">取消</button>
						<button class="cu-btn " @click="confirmCookData">确定</button>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// #ifdef MP-WEIXIN
import uniEcCanvas from '@/components/uni-ec-canvas/uni-ec-canvas.vue';
// #endif
// #ifdef H5
import uniEcharts from '@/components/uni-ec-canvas/uni-echarts.vue';
// #endif
import { mapState } from 'vuex';
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
			minceList: [],
			minceListChoose: [],
			RadioChoose: '',
			currFoodTime: '',
			dinnerTime: [
				{
					value: '早餐',
					type: 'cereal'
				},
				{
					value: '中餐',
					type: 'lunch'
				},
				{
					value: '晚餐',
					type: 'dinner'
				},
				{
					value: '夜宵',
					type: 'midnight'
				},
				{
					value: '加餐',
					type: 'extra'
				},
				{
					value: '其他',
					type: 'other'
				}
			],
			list: [],
			foodChild: [],
			isShowInfo: false,
			showUserHealtManagePopup: false,
			categoryTop: [
				{
					name: 'NRV%占比',
					type: 'NRV'
				},
				{
					name: '营养素含量',
					type: 'purity'
				},
				{
					name: '食材组成',
					type: 'material'
				}
			],
			approveData: [
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
					sex: null,
					age: null,
					weight: null
				}
			],
			categoryTopIndex: 0,
			currentAppr: '',
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
					name: '脂肪',
					key: 'axunge'
				},
				{
					name: '碳水化合物',
					key: 'carbohydrate'
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
					name: '烟酸',
					key: 'vitamin_b3'
				},
				{
					name: '叶酸',
					key: 'folic_acid'
				},
				{
					name: 'VC',
					key: 'vitamin_c'
				},
				{
					name: '钙',
					key: 'element_ca'
				},
				{
					name: '磷',
					key: 'element_p'
				},
				{
					name: '镁',
					key: 'element_mg'
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
					key: 'element_zn'
				},
				{
					name: '硒',
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
					color: ['#f79646', '#4f81bd'],
					title: {
						// text: 'NRV占比'
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
						top: '25%',
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
							// 	itemStyle: {
							// 	normal: {
							// 		label: {
							// 			show: true, //开启显示
							// 			position: 'top', //在上方显示
							// 			textStyle: { //数值样式
							// 				color: 'black',
							// 				fontSize: 16
							// 			}
							// 		}
							// 	}
							// },
						}
					]
				}
			},
			currIndex: '', //选择单位index
			userInfo: '',
			result: '',
			cookData: [], //烹饪方式
			currentCookData: null,
			isShowCookType: false,
			pageType: '',
			pageDetailType: '',
			currFoodNo: null,
			isCookDataChoose: false,
			currentChooseCookData: '',
			currentMince: '',
			burdening: [], //可选配料
			chooseBurdening: [], //可选配料
			checkedMinceValue: [],
			checkedburdeningValue: [],
			poupType: ''
		};
	},
	onShow() {
		this.approveData[2].sex = this.userInfo.sex;
		this.approveData[2].age = this.age;
		this.approveData[2].weight = this.userInfo.weight;
		this.getCurrentFood(this.currFoodNo);
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
		if (option.type) {
			this.pageType = option.type;
		}
		if (option.pageType) {
			this.pageDetailType = option.pageType;
		}
		let query = JSON.parse(decodeURIComponent(option.currFood));
		if (query.hdate) {
			this.nowDate = query.hdate;
		}
		this.currFoodNo = query;

		// if (this.currFood) {
		this.currentAppr = this.approveData[0];
		this.getCurrentFood(this.currFoodNo);

		// this.getNutrientRecommended()
		// }
	},
	computed: {
		...mapState({
			vuex_userInfo: state => state.user.userInfo,
			vuex_isLogin: state => state.app.isLogin,
			vuex_loginUserInfo: state => state.user.loginUserInfo
		}),
		age() {
			if (this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
				return age;
			}
		},
		isShowZx() {
			if (this.currFood && this.currFood.dish_type && this.currFood.dish_type === '自选臊子面食') {
				return true;
			}
		}
	},
	methods: {
		/*点击放大食材照片**/
		blowImage(url) {
			let lastIndex = url.lastIndexOf('&');
			let imgurl = url.slice(0, lastIndex);
			uni.previewImage({
				urls: [imgurl]
			});
		},
		// /*点击选择臊子**/
		// chooseMinced(item){
		// 	this.currentMince = item
		// 	console.log("点击选择臊子----")
		// },
		checkboxGroupChange(e) {
			let isHasTrue = false;
			this.currentChooseCookData = e;
		},
		closePoup() {
			this.showUserHealtManagePopup = false;
		},
		confirmCookData() {
			console.log('minceList---->', this.checkedMinceValue, 'burdening---->', this.checkedburdeningValue);
			if (this.currFood.dish_type && this.currFood.dish_type === '自选臊子面食' && this.poupType && this.poupType === 'minkes') {
				this.minceListChoose = [];
				this.minceList.forEach(item => {
					this.checkedMinceValue.forEach(v => {
						if (item.name === v) {
							this.minceListChoose.push(item);
						}
					});
				});
			} else if (this.currFood.dish_type && this.currFood.dish_type === '自选臊子面食' && this.poupType && this.poupType === 'burdening') {
				this.chooseBurdening = [];
				this.burdening.forEach(item => {
					this.checkedburdeningValue.forEach(v => {
						if (item.name === v) {
							this.chooseBurdening.push(item);
						}
					});
				});
			} else {
				this.currentCookData = this.currentChooseCookData;
				this.isCookDataChoose = true;
			}

			this.showUserHealtManagePopup = false;
		},
		async getCurrentFood(item) {
			let self = this;
			let serviceName = 'srvhealth_mixed_food_nutrition_contents_select';
			if (!item.meal_no) {
				serviceName = 'srvhealth_diet_contents_select';
			}
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [
					{
						colName: 'id',
						ruleType: 'eq',
						value: item.id
					}
				]
			};
			let res = await this.$http.post(url, req);
			let urls = self.$api.downloadFile + res.data.data[0].image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket') + '&thumbnailType=fwsu_100';
			this.$set(res.data.data[0], 'imgurl', urls);
			self.currFood = res.data.data[0];

			if (!self.currFood.meal_no) {
				self.getFoodsV2();
			}

			self.calculateCurrTime();
			self.assembleData();
			self.selectCurrFoodUnit(self.currFood);
			if (self.currFood.dish_type && self.currFood.dish_type.indexOf('自选') > -1) {
				// this.getMincedAll()
				self.getMixChildFood();
			}
		},
		/*查询臊子**/
		async getMincedAll() {
			let serviceName = 'srvhealth_mixed_food_nutrition_item_select';
			let url = this.getServiceUrl('health', serviceName, 'select');
			let req = {
				serviceName: serviceName,
				colNames: ['*'],
				condition: [
					{
						colName: 'meal_no',
						ruleType: 'eq',
						value: '自选臊子'
					}
				]
			};
			// let res = await this.$http.post(url, req);
		},
		hideCookModel() {
			this.isShowCookType = false;
		},
		configCookFood() {
			this.isShowCookType = false;
		},
		async getFoodsV2() {
			let self = this;
			let colVs = await this.getServiceV2('srvhealth_diet_contents_select', 'list', 'list', 'health');
			let colData = colVs.srv_cols;
			colData.forEach(item => {
				if (item.columns === 'cook_method') {
					self.cookData = item.option_list_v2;
					this.currentCookData = self.currFood.cook_method.split(',')[0];
				}
			});
		},
		clickTop(type) {
			if (type === 'edit') {
				let cond = [
					{
						colName: 'id',
						ruleType: 'in',
						value: this.currFood.id
					}
				];
				let params = {
					type: 'update',
					condition: cond,
					serviceName: 'srvhealth_mixed_food_nutrition_contents_update',
					defaultVal: this.currFood
				};
				let fieldsCond = [
					{
						column: 'id',
						value: this.currFood.id
					}
				];
				uni.navigateTo({
					url: '/publicPages/newForm/newForm?type=update&fieldsCond=' + encodeURIComponent(JSON.stringify(fieldsCond))
				});
			} else if (type === 'add') {
				uni.navigateTo({
					url: '/otherPages/shop/foodMaterial?itemFood=' + encodeURIComponent(JSON.stringify(this.currFood))
				});
			}
		},
		/*点击切换图表顶部类型**/
		changeApprove(item, index) {
			if (item.type === 'mine' && (!item.age || !item.sex)) {
				uni.showModal({
					title: '提示',
					content: '当前没有进行登记年龄、性别和体重，是否去登记?',
					success: function(res) {
						if (res.confirm) {
							uni.navigateTo({
								url: '/otherPages/chooseFood/myFoodsInfo'
							});
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				});
			} else {
				this.currentAppr = item;
				this.assembleData();
			}
		},
		/*点击切换营养素占比和NRV**/
		changeCate(item, index) {
			this.categoryTopIndex = index;
			if (item.type === 'NRV') {
				this.currentAppr = this.approveData[0];
			} else if (item.type === 'material') {
				if (this.currFood.mix_type && this.currFood.mix_type === '混合') {
					this.getMaterialMixChildFood();
				} else {
					this.getMixChildFood();
				}
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
			let age = self.currentAppr.age;
			if (age < 18) {
				age = 18;
			}
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				let result = res.data.data.filter(item => {
					if ((item.sex && item.sex.indexOf(self.currentAppr.sex) !== -1) || !item.sex) {
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
				// console.log("res-----",)
				this.result = result;
				let endArr = [];
				let currFood = this.currFood;
				let nutrientData = this.nutrientData;
				nutrientData.forEach(nut => {
					let num = 0;
					if (nut.name === '脂肪' || nut.name === '碳水化合物' || nut.name === '烟酸') {
						endArr.push(currFood[nut.key]);
					}
					result.forEach(re => {
						if (nut.name === re.nutrient) {
							num = ((Number(currFood[nut.key]) / Number(re.val_rni)) * 100).toFixed(1);
							if (nut.name === '蛋白质') {
								num = Number(((Number(currFood[nut.key]) / Number(re.val_rni)) * 100) / self.currentAppr.weight).toFixed(1);
							}
							endArr.push(Number(num));
						}
					});
				});
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
			if (!option.series[1]) {
				option.series.push(obj);
			}
			if (this.value1 == 0) {
				this.countDietNum('+1');
			} else {
				this.originalData();
			}
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
		chooseCook(type = null) {
			if (type) {
				this.poupType = type;
			}
			console.log('点击烹调方式');
			// this.isShowCookType = true
			this.showUserHealtManagePopup = true;
		},
		clickCook() {
			this.isCookDataChoose = !this.isCookDataChoose;
		},
		chooseCookFood(item) {
			this.currentCookData = item.value;

			this.isCookDataChoose = true;
			this.isShowCookType = false;
		},
		/*选择餐食类别(早中晚)**/
		chooseTime(item, i) {
			this.currFoodTime = item.value;
		},
		/*计算当前时间--早餐/午餐...**/
		calculateCurrTime() {
			let time = this.formateDate(new Date(), 'dateTime').split(':')[0];
			console.log('计算时间--->', time);
			let type = '';
			/**
			 * [{
				value:'早餐',
				type:'cereal'
			},{
				value:'中餐',
				type:'lunch'
			},{
				value:'晚餐',
				type:'dinner'
			},{
				value:'夜宵',
				type:'midnight'
			},{
				value:'加餐',
				type:'extra'
			},{
				value:'其他',
				type:'other'
			}],
			 * */
			if (time >= 6 && time <= 9) {
				type = '早餐';
			} else if (time >= 10 && time <= 11) {
				type = '加餐';
			} else if (time >= 12 && time <= 14) {
				type = '中餐';
			} else if (time >= 18 && time <= 20) {
				type = '晚餐';
			} else if (time >= 21 && time <= 24) {
				type = '夜宵';
			} else {
				type = '其他';
			}
			this.currFoodTime = type;
		},
		/*选择单位*/
		chooseUnit(item, i) {
			console.log('单位选择----', item);
			this.currIndex = i;
			this.radioLabel = item;
			this.currFood.unit_energy = ((item.unit_amount ? item.unit_amount : item.amount) / this.currFood.unit_amount) * this.currFood.unit_energy;
			this.currFood.unit_amount = item.unit_amount ? item.unit_amount : item.amount;
			if (Number(this.choiceNum) && !this.radioLabel) {
				this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
			} else if (Number(this.choiceNum) && this.radioLabel) {
				if (this.radioLabel.unit_amount) {
					this.heatNum = Number(this.choiceNum) * this.currFood.unit_energy;
				} else {
					this.heatNum = Number(this.choiceNum) * ((this.radioLabel.amount / 100) * this.currFood.unit_energy);
				}
			}
			// debugger
			this.assembleData();
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
		async getMaterialMixChildFood() {
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_diet_contents_item_select', 'select');
			let req = {
				serviceName: 'srvhealth_diet_contents_item_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'food_no',
						ruleType: 'eq',
						value: this.currFood.food_no
					}
				]
			};
			let res = await this.$http.post(url, req);
			this.foodChild = res.data.data;
			console.log('食材配料----->', res.data.data);
		},
		/* 获取当前食物得食材含量**/
		async getMixChildFood() {
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_mixed_food_nutrition_item_select', 'select');
			let req = {
				serviceName: 'srvhealth_mixed_food_nutrition_item_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'meal_no',
						ruleType: 'eq',
						value: this.currFood.meal_no
					}
				]
			};
			let res = await this.$http.post(url, req);
			let data = res.data.data;
			if (data.length >= 0) {
				this.foodChild = data;
			}
			this.minceList = []; //可选臊子
			this.burdening = []; //可选配料
			data.forEach(item => {
				this.$set(item, 'checked', false);
				if (item.item_form_type === '混合食物' && item.choose_type === '可选') {
					this.minceList.push(item);
				} else if (item.item_form_type === '食材' && item.choose_type === '可选') {
					this.burdening.push(item);
				}
			});
		},
		/* 点击食物选择数字加减**/
		countDietNum(num) {
			let self = this;
			this.isCountDiet = true;
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
				this.originalData();
			}
		},
		originalData() {
			let self = this;
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
				let a = 0;
				// if (nut.name === '碳水化合物' || nut.name === 'VB3') {
				if (nut.name === '脂肪' || nut.name === '碳水化合物' || nut.name === '烟酸') {
					addData.push(currFood[nut.key] * Number(self.choiceNum));
				}
				result.forEach(re => {
					if (nut.name === re.nutrient) {
						num = ((currFood[nut.key] * Number(self.choiceNum)) / Number(re.val_rni)) * 100;
						if (nut.name === '蛋白质') {
							// num = Number((self.currentAppr.weight * 0.9)).toFixed(1)
							num = ((currFood[nut.key] * Number(self.choiceNum)) / (Number(re.val_rni) * self.currentAppr.weight)) * 100;
						}
						num = parseInt(num * 10) / 10;
						if (re.nutrient === '叶酸') {
							if (a == 0) {
								addData.push(Number(num));
							}
							a++;
						} else {
							addData.push(Number(num));
						}
						// if(num > 100){
						// 	num  = (num - 100).toFixed(1)
						// }else{
						// }
					}
				});
			});
			addObj.data = addData;
			nutrientData.forEach(ele => {
				if (currFood[ele.key]) {
					// currFood[ele.key] = currFood[ele.key] * Number(this.choiceNum)
					self.$set(ele, 'value', currFood[ele.key]);
				} else {
					self.$set(ele, 'value', 0);
				}
			});
			if (option.series[0] && option.series[0].type) {
				option.series[0].data = addData;
			} else {
				option.series.push(addObj);
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
						person_info_no: this.vuex_userInfo.no,
						person_name: this.vuex_userInfo.name,
						amount: item.amount,
						unit: this.radioLabel.unit ? this.radioLabel.unit : item.unit,
						energy: item.heatNum,
						user_name: uni.getStorageSync('current_user'),
						image: item.image,
						unit_weight_g: this.radioLabel ? this.radioLabel.amount : 100,
						dining_type: this.currFoodTime,
						protein: Number(this.currFood.protein) * item.amount,
						axunge: Number(this.currFood.axunge) * item.amount,
						carbohydrate: Number(this.currFood.carbohydrate) * item.amount,
						cholesterol: Number(this.currFood.cholesterol) * item.amount,
						vitamin_a: Number(this.currFood.vitamin_a) * item.amount,
						vitamin_d: Number(this.currFood.vitamin_d) * item.amount,
						vitamin_e: Number(this.currFood.vitamin_e) * item.amount,
						vitamin_k: Number(this.currFood.vitamin_k) * item.amount,
						vitamin_b1: Number(this.currFood.vitamin_b1) * item.amount,
						vitamin_b2: Number(this.currFood.vitamin_b2) * item.amount,
						vitamin_b3: Number(this.currFood.vitamin_b3) * item.amount,
						vitamin_b6: Number(this.currFood.vitamin_b6) * item.amount,
						vitamin_b12: Number(this.currFood.vitamin_b12) * item.amount,
						folic_acid: Number(this.currFood.folic_acid) * item.amount,
						vitamin_c: Number(this.currFood.vitamin_c) * item.amount,
						element_ca: Number(this.currFood.element_ca) * item.amount,
						element_p: Number(this.currFood.element_p) * item.amount,
						element_mg: Number(this.currFood.element_mg) * item.amount,
						element_k: Number(this.currFood.element_k) * item.amount,
						element_na: Number(this.currFood.element_na) * item.amount,
						element_fe: Number(this.currFood.element_fe) * item.amount,
						element_zn: Number(this.currFood.element_zn) * item.amount,
						element_se: Number(this.currFood.element_se) * item.amount,
						element_cu: Number(this.currFood.element_cu) * item.amount,
						element_mn: Number(this.currFood.element_mn) * item.amount
					};
					// if (this.searchArg.type === 'food') {
					if (item.meal_no) {
						obj['mixed_food_no'] = item.meal_no;
						obj['diret_type'] = 'mixed_food';
						if (this.currFood.dish_type && this.currFood.dish_type.indexOf('自选') > -1) {
							if (this.minceListChoose && this.minceListChoose.length > 0) {
								this.minceListChoose.forEach(m => {
									obj.energy = (Number(obj.energy) + m.unit_energy * item.amount).toFixed(1);
									(obj.protein = (Number(obj.protein) + Number(m.protein) * item.amount).toFixed(1)),
										(obj.axunge = (Number(obj.axunge) + Number(m.axunge) * item.amount).toFixed(1)),
										(obj.carbohydrate = (Number(obj.carbohydrate) + Number(m.carbohydrate) * item.amount).toFixed(1)),
										(obj.cholesterol = (Number(obj.cholesterol) + Number(m.cholesterol) * item.amount).toFixed(1)),
										(obj.vitamin_a = (Number(obj.vitamin_a) + Number(m.vitamin_a) * item.amount).toFixed(1)),
										(obj.vitamin_d = (Number(obj.vitamin_d) + Number(m.vitamin_d) * item.amount).toFixed(1)),
										(obj.vitamin_e = (Number(obj.vitamin_e) + Number(m.vitamin_e) * item.amount).toFixed(1)),
										(obj.vitamin_k = (Number(obj.vitamin_k) + Number(m.vitamin_k) * item.amount).toFixed(1)),
										(obj.vitamin_b1 = (Number(obj.vitamin_b1) + Number(m.vitamin_b1) * item.amount).toFixed(1)),
										(obj.vitamin_b2 = (Number(obj.vitamin_b2) + Number(m.vitamin_b2) * item.amount).toFixed(1)),
										(obj.vitamin_b3 = (Number(obj.vitamin_b3) + Number(m.vitamin_b3) * item.amount).toFixed(1)),
										(obj.vitamin_b6 = (Number(obj.vitamin_b6) + Number(m.vitamin_b6) * item.amount).toFixed(1)),
										(obj.vitamin_b12 = (Number(obj.vitamin_b12) + Number(m.vitamin_b12) * item.amount).toFixed(1)),
										(obj.folic_acid = (Number(obj.folic_acid) + Number(m.folic_acid) * item.amount).toFixed(1)),
										(obj.vitamin_c = (Number(obj.vitamin_c) + Number(m.vitamin_c) * item.amount).toFixed(1)),
										(obj.element_ca = (Number(obj.element_ca) + Number(m.element_ca) * item.amount).toFixed(1)),
										(obj.element_p = (Number(obj.element_p) + Number(m.element_p) * item.amount).toFixed(1)),
										(obj.element_mg = (Number(obj.element_mg) + Number(m.element_mg) * item.amount).toFixed(1)),
										(obj.element_k = (Number(obj.element_k) + Number(m.element_k) * item.amount).toFixed(1)),
										(obj.element_na = (Number(obj.element_na) + Number(m.element_na) * item.amount).toFixed(1)),
										(obj.element_fe = (Number(obj.element_fe) + Number(m.element_fe) * item.amount).toFixed(1)),
										(obj.element_zn = (Number(obj.element_zn) + Number(m.element_zn) * item.amount).toFixed(1)),
										(obj.element_se = (Number(obj.element_se) + Number(m.element_se) * item.amount).toFixed(1)),
										(obj.element_cu = (Number(obj.element_cu) + Number(m.element_cu) * item.amount).toFixed(1)),
										(obj.element_mn = (Number(obj.element_mn) + Number(m.element_mn) * item.amount).toFixed(1));
								});
							}
							if (this.chooseBurdening && this.chooseBurdening.length > 0) {
								this.chooseBurdening.forEach(n => {
									obj.energy = (Number(obj.energy) + n.unit_energy * item.amount).toFixed(1);
									(obj.protein = (Number(obj.protein) + Number(n.protein) * item.amount).toFixed(1)),
										(obj.axunge = (Number(obj.axunge) + Number(n.axunge) * item.amount).toFixed(1)),
										(obj.carbohydrate = (Number(obj.carbohydrate) + Number(n.carbohydrate) * item.amount).toFixed(1)),
										(obj.cholesterol = (Number(obj.cholesterol) + Number(n.cholesterol) * item.amount).toFixed(1)),
										(obj.vitamin_a = (Number(obj.vitamin_a) + Number(n.vitamin_a) * item.amount).toFixed(1)),
										(obj.vitamin_d = (Number(obj.vitamin_d) + Number(n.vitamin_d) * item.amount).toFixed(1)),
										(obj.vitamin_e = (Number(obj.vitamin_e) + Number(n.vitamin_e) * item.amount).toFixed(1)),
										(obj.vitamin_k = (Number(obj.vitamin_k) + Number(n.vitamin_k) * item.amount).toFixed(1)),
										(obj.vitamin_b1 = (Number(obj.vitamin_b1) + Number(n.vitamin_b1) * item.amount).toFixed(1)),
										(obj.vitamin_b2 = (Number(obj.vitamin_b2) + Number(n.vitamin_b2) * item.amount).toFixed(1)),
										(obj.vitamin_b3 = (Number(obj.vitamin_b3) + Number(n.vitamin_b3) * item.amount).toFixed(1)),
										(obj.vitamin_b6 = (Number(obj.vitamin_b6) + Number(n.vitamin_b6) * item.amount).toFixed(1)),
										(obj.vitamin_b12 = (Number(obj.vitamin_b12) + Number(n.vitamin_b12) * item.amount).toFixed(1)),
										(obj.folic_acid = (Number(obj.folic_acid) + Number(n.folic_acid) * item.amount).toFixed(1)),
										(obj.vitamin_c = (Number(obj.vitamin_c) + Number(n.vitamin_c) * item.amount).toFixed(1)),
										(obj.element_ca = (Number(obj.element_ca) + Number(n.element_ca) * item.amount).toFixed(1)),
										(obj.element_p = (Number(obj.element_p) + Number(n.element_p) * item.amount).toFixed(1)),
										(obj.element_mg = (Number(obj.element_mg) + Number(n.element_mg) * item.amount).toFixed(1)),
										(obj.element_k = (Number(obj.element_k) + Number(n.element_k) * item.amount).toFixed(1)),
										(obj.element_na = (Number(obj.element_na) + Number(n.element_na) * item.amount).toFixed(1)),
										(obj.element_fe = (Number(obj.element_fe) + Number(n.element_fe) * item.amount).toFixed(1)),
										(obj.element_zn = (Number(obj.element_zn) + Number(n.element_zn) * item.amount).toFixed(1)),
										(obj.element_se = (Number(obj.element_se) + Number(n.element_se) * item.amount).toFixed(1)),
										(obj.element_cu = (Number(obj.element_cu) + Number(n.element_cu) * item.amount).toFixed(1)),
										(obj.element_mn = (Number(obj.element_mn) + Number(n.element_mn) * item.amount).toFixed(1));
								});
							}
						}
					} else {
						obj['diet_contents_no'] = item.food_no;
						obj['diret_type'] = 'diet_contents';
						if (this.isCookDataChoose) {
							obj['cook_method'] = this.currentCookData;
						}
					}
					// }
					arr.push(obj);
				});
				let serviceName = 'srvhealth_diet_record_add';
				let url = this.getServiceUrl('health', serviceName, 'operate');
				let req = [{ serviceName: serviceName, colNames: ['*'], data: arr }];
				if(this.userInfo && this.userInfo.sex && this.userInfo.weight && this.userInfo.age){
					let res = await this.$http.post(url, req);
					if (res.data.state === 'SUCCESS') {
						console.log('-------添加---', res);
						this.addRecodChildData(res.data.response[0].response.effect_data[0].diet_record_no);
						// if (this.searchArg.type === 'food') {
						// this.getChooseFoodList();
					
						// 通知健康追踪页面，饮食记录已改变，需要刷新数据
						uni.$emit('dietUpdate');
						uni.navigateBack({
							delta: 0
						});
						// }
					}
				}else{
					uni.showModal({
						title: '提示',
						content: '当前没有进行登记年龄、性别和体重，是否去登记?',
						success: function(res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/otherPages/chooseFood/myFoodsInfo'
								});
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
				}
				
			}
		},
		async addRecodChildData(id) {
			let chooseBurdening = [];
			let minceListChoose = [];
			if (this.chooseBurdening.length > 0) {
				this.chooseBurdening.forEach(item => {
					let obj = {
						item_form_type: item.item_form_type,
						choose_type: item.choose_type,
						food_no: item.food_no,
						unit: item.unit,
						name: item.name,
						unit_amount: item.unit_amount,
						diet_record_no: id
					};
					chooseBurdening.push(obj);
				});
			}
			if (this.minceListChoose.length > 0) {
				this.minceListChoose.forEach(alone => {
					let obj1 = {
						item_form_type: alone.item_form_type,
						item_mixed_food_no: alone.item_mixed_food_no,
						choose_type: alone.choose_type,
						unit: alone.unit,
						name: item.name,
						unit_amount: alone.unit_amount,
						diet_record_no: id
					};
					minceListChoose.push(obj1);
				});
			}
			let data = [...chooseBurdening, ...minceListChoose];
			let serviceName = 'srvhealth_diet_record_item_add';
			let url = this.getServiceUrl('health', serviceName, 'operate');
			let req = [{ serviceName: serviceName, colNames: ['*'], condition: [{ colName: 'diet_record_no', ruleType: 'eq', value: id }], data: data }];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				// uni.$emit('dietUpdate');
				// uni.navigateBack({
				// 	delta: 0
				// });
				// console.log("添加成功")
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
				this.unitList = this.deepClone(unitList);
				this.list = this.deepClone(unitList);
			}
			console.log('食物选择单位===>>>', this.unitList);
		}
	}
};
</script>

<style scoped lang="scss">
.food_wrap {
	background-color: #f8f8f8;
	min-height: 100vh;
}
.food_wrap_top {
	display: flex;
	justify-content: space-between !important;
	font-weight: 700;
	color: #000;
	font-size: 30rpx;
}
.ingredient {
	justify-content: center !important;
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
			margin-right: 10upx;
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
			margin-left: 10upx;
			border-radius: 5px;
		}
	}
	.digit {
		width: 50%;
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
		// .button-box {
		// 	display: flex;
		// 	justify-content: center;
		// 	align-items: flex-end;
		// 	padding: 15rpx 0;
		// 	button {
		// 		width: 80%;
		// 	}
		// }
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
	.ele-text-top-tit {
		display: flex;
		margin-bottom: 30rpx;
		text {
			font-size: 30rpx;
			padding: 8rpx 20rpx;
			border-bottom: 1px solid transparent;
			margin-right: 20rpx;

			// border-radius: 30rpx;
		}
		.active-text-top-tit {
			// background-color: #fbbd08;
			color: #fbbd08;
			font-weight: 700;
			border-color: #fbbd08;
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
	padding: 20upx 10upx;
	min-height: 100upx;
	align-items: flex-start;
	font-size: 36upx;
	margin-right: 20upx;
	color: #999;
	flex-direction: column;
	.calculate-l {
		// width: 100rpx;
		font-size: 28upx;
		font-weight: 600;
		color: #000;
	}
	.calorie {
		min-width: 115upx;
	}
	.weight {
		display: flex;
		align-items: center;
		font-size: 24upx;
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
	.cook {
		margin-bottom: 16rpx;
		.calculate-l {
			margin-bottom: 0;
		}
		.unit {
			padding: 0rpx 30rpx;
		}
		text {
			&:nth-child(2) {
				color: #999;
				margin-right: 8rpx;
				border: 1px solid #999;
				padding: 4rpx 30rpx;
				border-radius: 24rpx;
			}

			&:last-child {
				// margin-bottom: -10rpx;
				// font-weight: 700;
				border: 1px solid #999;
				padding: 4rpx 30rpx;
				border-radius: 24rpx;
			}
		}
		.active-cook-data {
			background-color: coral;
			color: white !important;
			border-color: coral !important;
		}
	}
}
.minced {
	display: flex;
	align-items: center;
	width: 100%;
	margin-bottom: 10rpx;
	flex-wrap: wrap;
	white-space: normal;
	font-size: 24rpx;
	// .minced-item-all{
	// 	font-size: 24rpx;
	// 	display: flex;
	.minced-item {
		padding: 10rpx 16rpx;
		background: #f8f8f8;
		border: 1px solid #999;
		color: #999;
		border-radius: 30rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		min-width: 40rpx;
		text-align: center;
	}
	.minced-item-active {
		padding: 10rpx 16rpx;
		background: #f37b1d;
		border: 1px solid #f37b1d;
		border-radius: 30rpx;
		color: #fff;
	}
	// }
	.minced-right-add {
		padding: 5px 30rpx;
		border: 1px dashed #999;
		border-radius: 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}
}
.amount {
	color: #009688;
	font-weight: 800;
	display: flex;
	align-items: center;
	margin-left: 10rpx;
	.amount-left {
		color: #000;
	}
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
.material-list-wrap {
	.shop-detail-bot-tab {
		min-height: 300upx;
		.shop-detail-bot-tab-t {
			display: flex;
			justify-content: space-around;
			background-color: rgb(240, 240, 240);
			padding: 5px 0;
			width: 95%;
			margin: 0 auto;
			text {
				width: 24%;
				text-align: center;
				&:first-child {
					width: 50%;
				}
			}
		}
		.shop-detail-bot-tab-m {
			.shop-detail-bot-tab-m-item {
				display: flex;
				justify-content: space-around;
				padding: 10rpx 0;
				border-bottom: 1px solid #f2f3f3;
				width: 95%;
				margin: 0 auto;

				text {
					width: 24%;
					&:first-child {
						width: 50%;
					}
					text-align: center;
				}
				&:last-of-type {
					border-bottom: none;
				}
			}
			.operation-food {
				width: 33%;
				text-align: center;
				text {
					color: red;
				}
			}
		}
		.detail-none {
			.detail-none-t {
				min-height: calc(100vh - 160upx);
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				image {
					width: 140upx;
					height: 140upx;
				}
				text {
					color: #b0b0b0;
				}
			}
		}
	}
}
.uni-ec-canvas-wrap {
	.uni-ec-canvas-top {
		display: flex;
		.uni-ec-canvas-top-item {
			display: flex;
			align-items: center;
			padding: 5px 10px;
			border-radius: 22px;
			text-align: center;
			color: #ccc;
			border: 1px solid #ccc;
			margin-right: 14rpx;
		}
		.active-approve {
			background-color: #8dc63f;
			color: #fff;
			border-color: #8dc63f;
		}
	}
	.uni-ec-canvas-bot {
		width: 710rpx;
		height: 540rpx;
		margin-top: 20rpx;
	}
}
.uni-ec-canvas {
	width: 710rpx;
	height: 540rpx;
}
.cook-top {
	padding: 0 15rpx;
	justify-content: space-between;
}
.cook-wrap {
	display: flex;
	flex-wrap: wrap;
	.cook-item {
		padding: 4rpx 30rpx;
		border: 1px solid #ccc;
		margin-right: 20rpx;
		margin-bottom: 10rpx;
		text {
		}
	}
	.active-cook-item {
		color: red;
		border-color: red;
	}
}
.health-item {
	min-height: 150rpx;
	display: flex;
	padding: 50rpx 30rpx;
	display: flex;
	flex-direction: column;
	.tips {
		color: #999;
		padding: 20rpx 0;
	}
	.check-box-group {
		display: flex;
		flex-wrap: wrap;
		.check-box-item {
			margin-right: 20rpx;
			min-width: 30%;
		}
	}
}
.button-box {
	width: 100%;
	padding: 30rpx;
	font-weight: bold;
	text-align: center;
	display: flex;
	.cu-btn {
		background-color: #11c5bd;
		color: #fff;
		margin-right: 50rpx;
		flex: 1;
		&:last-child {
			margin-right: 0;
		}
	}
}
</style>
