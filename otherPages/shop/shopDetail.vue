<template>
	<view class="shop-detail-wrap">
		<view class="shop-detail-top">
			<image class="image" :src="getImagePath(foodObj.image, true)" mode="aspectFill" v-if="foodObj && foodObj.image" @click="toPreviewImage(getImagePath(foodObj.image, true))"></image>
		</view>
		<view class="shop-detail-cen">
			<view class="shop-detail-cen-left">
				<view class="left-info">
					<view class="cen-title">{{ foodObj.name || '' }}</view>
					<view class="evaluate">
						<view class="cen-referral">脆糯营养，口感好，健康绿色</view>
						<view class="cen-score">{{ foodObj.mark || 0 }}分</view>
					</view>
				</view>
				<view class="right-code">
					<uni-qrcode
						cid="qrcodeCanvas"
						:text="qrCodeText"
						:size="codeSize"
						class="qrcode-canvas"
						foregroundColor="#333"
						makeOnLoad
						@makeComplete="qrcodeCanvasComplete"
						v-if="qrCodeText"
					></uni-qrcode>
					<image :src="qrcodePath" class="qr-code-image" mode="aspectFit" v-if="qrcodePath" @click="toPreviewImage(qrcodePath)"></image>
				</view>
				<view class="number-box">
					<view class="cen-money">
						<text>￥</text>
						<text>{{ foodObj.price || 0 }}</text>
					</view>
					<u-number-box class="u-number-box" @change="valChange" @plus="adds" @minus="subtract" :min="0" v-model.number="carNum"></u-number-box>
				</view>
			</view>
		</view>
		<view class="shop-detail-bot">
			<view class="ele-text-top-tit">
				<text
					@click="changeCate(item, index)"
					v-for="(item, index) in categoryTop"
					v-if="item.name === '食材组成' ? currFood.meal_no : true"
					:key="index"
					:class="categoryTopIndex === index ? 'active-text-top-tit' : ''"
				>
					{{ item.name }}
				</text>
			</view>
			<view v-if="categoryTopIndex == 0" class="">
				<view class="uni-ec-canvas-top">
					<text @click="changeApprove(item, index)" :class="currentAppr.name === item.name ? 'active-approve' : ''" v-for="(item, index) in approveData" :key="index">
						{{ item.name }}
					</text>
				</view>
				<view class="uni-ec-canvas-bot">
					<!-- #ifdef MP-WEIXIN -->
					<uniEcCanvas class="uni-ec-canvas" id="uni-ec-canvas" ref="uni-ec-canvas" canvas-id="uni-ec-canvas" :ec="stepData"></uniEcCanvas>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<uniEcharts class="uni-ec-canvas" id="uni-ec-canvas" ref="uni-ec-canvas" canvas-id="uni-ec-canvas" :ec="stepData"></uniEcharts>
					<!-- #endif -->
				</view>
			</view>
			<view v-if="categoryTopIndex == 1" class="shop-detail-bot-b" :class="foodChild.length >= 3 ? 'bot-padd' : ''">
				<view class="shop-detail-bot-b-t"><text>食材含量</text></view>
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
		<jumpBall :backgroundColor="'red'" :start.sync="carNum" :element.sync="element" @msg="jbMsg" />
		<view class="cu-bar foot bottom bg-white tabbar border shop">
			<button class="action" @click="toShop">
				<view class="cuIcon-shop text-orange"></view>
				店铺
			</button>
			<button class="action cart-action" @click="goCar">
				<view class="cuIcon-cart">
					<view class="cu-tag badge">{{ carNum > 99 ? '99+' : carNum }}</view>
				</view>
				购物车
			</button>
			<view class="btn-group">
				<button class="cu-btn bg-yellow round shadow-blur" @click="toMyTodayFood">记饮食</button>
				<button class="cu-btn bg-orange round shadow-blur add-to-cart" @click="joinCar">
					<text class="cuIcon-add"></text>
					购物车
				</button>
				<button class="cu-btn bg-red round shadow-blur" @click="payOrder">立即购买</button>
			</view>
		</view>
	</view>
</template>

<script>
import jumpBall from '@/otherPages/components/hx-jump-ball/hx-jump-ball.vue';
// #ifdef MP-WEIXIN
import uniEcCanvas from '@/components/uni-ec-canvas/uni-ec-canvas.vue';
// #endif
// #ifdef H5
import uniEcharts from '@/components/uni-ec-canvas/uni-echarts.vue';
// #endif
import { mapState } from 'vuex';
export default {
	name: 'shopDetail',
	components: {
		jumpBall,
		// #ifdef MP-WEIXIN
		uniEcCanvas,
		// #endif
		// #ifdef H5
		uniEcharts
		// #endif
	},
	data() {
		return {
			orderNo: '',
			orderInfo: {},
			qrcodePath: '',
			codeSize: uni.upx2px(550),
			categoryTop: [
				{
					name: 'NRV%占比',
					type: 'NRV'
				},
				{
					name: '食材组成',
					type: 'material'
				}
			],
			foodObj: '',
			foodChild: '',
			value: 1,
			carNum: 0,
			element: [],
			nowDate: this.formateDate(new Date(), 'date').replace(/\s*/g, ''),
			nowDateTime: this.formateDate(new Date(), 'dateTime'),
			isJoin: false,
			approveData: [
				{
					name: '成年男性',
					type: 'man',
					sex: '男',
					age: 18,
					weight: 65
				},
				{
					name: '成年女性',
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
			stepData: {
				option: {
					color: ['#92d050', '#4f81bd', '#f79646'],
					title: {
						// text: "营养素含量"
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
						data: ['食物含量', '达标线']
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
						}
					]
				}
			},
			echartsIsShow: false,
			currentAppr: '',
			currFood: '',
			userInfo: '',
			result: '',
			categoryTopIndex: 0,
			eleData: [
				'protein',
				'vitamin_b1',
				'vitamin_b2',
				'vitamin_b3',
				'vitamin_c',
				'element_mg',
				'element_p',
				'element_k',
				'element_fe',
				'element_zn',
				'element_se',
				'element_cu',
				'element_mn'
			]
		};
	},
	computed: {
		...mapState({
			cartInfo: state => state.order.cartInfo
		}),
		qrCodeText() {
			if (this.foodObj && this.foodObj.meal_no) {
				return 'https://wx2.100xsys.cn/shareShopFood/' + this.foodObj.meal_no;
			}
		},
		age() {
			if (this.userInfo.birthday) {
				let age = new Date().getFullYear() - new Date(this.userInfo.birthday).getFullYear();
				return age;
			}
		}
	},
	methods: {
		/*点击切换营养素占比和NRV**/
		changeCate(item, index) {
			this.categoryTopIndex = index;
			if (item.type === 'NRV') {
				this.currentAppr = this.approveData[0];
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
		qrcodeCanvasComplete(e) {
			this.qrcodePath = e;
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
				// if (nut.name === '碳水化合物' || nut.name === 'VB3') {
				if (nut.name === '脂肪' || nut.name === '碳水化合物' || nut.name === 'VB3') {
					addData.push(Number(currFood[nut.key]));
				}
				result.forEach(re => {
					if (nut.name === re.nutrient) {
						num = (currFood[nut.key] / Number(re.val_rni)) * 100;
						if (nut.name === '蛋白质') {
							// num = Number((self.currentAppr.weight * 0.9)).toFixed(1)
							num = (currFood[nut.key] / (Number(re.val_rni) * self.currentAppr.weight)) * 100;
						}
						if (num > 100) {
							num = (num - 100).toFixed(1);
						} else {
							num = num.toFixed(1);
						}
						addData.push(Number(num));
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
		payOrder() {
			if (this.foodObj.restaurant_no) {
				uni.navigateTo({
					url: '/personalPages/payOrder/payOrder?store_no=' + this.foodObj.restaurant_no + '&goods_info=' + encodeURIComponent(JSON.stringify(this.foodObj))
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
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				let result = res.data.data.filter(item => {
					if ((item.sex && item.sex.indexOf(self.currentAppr.sex) !== -1) || !item.sex) {
						if (item.age_start && item.age_end) {
							return self.currentAppr.age >= item.age_start && self.currentAppr.age < item.age_end;
						} else if (item.age_start && !item.age_end) {
							return self.currentAppr.age >= item.age_start;
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
					if (nut.name === '脂肪' || nut.name === '碳水化合物' || nut.name === 'VB3') {
						endArr.push(Number(currFood[nut.key]));
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
					// currFood[ele.key] = currFood[ele.key] * Number(this.choiceNum)
					self.$set(ele, 'value', currFood[ele.key]);
				} else {
					self.$set(ele, 'value', 0);
				}
			});
			let currData = await this.getNutrientRecommended();
			if (!option.series[1]) {
				option.series.push(obj);
			}
			this.originalData();
		},
		/*计数器change方法*/
		valChange(e) {
			this.foodObj.car_num = e.value;
			this.setShopCarData();
		},
		setShopCarData(isAdd) {
			if (!this.foodObj.car_num && this.foodObj.car_num !== 0) {
				this.foodObj['car_num'] = 1;
			}
			let shopCarData = this.cartInfo[this.restaurant_no];
			if (shopCarData && Array.isArray(shopCarData.cart)) {
				// 此店铺已有购物车数据
				shopCarData = shopCarData.cart;
				shopCarData.push(this.foodObj);
			} else {
				// 此店铺没有购物车数据
				shopCarData = [this.foodObj];
				let isHas = false;
				shopCarData.forEach(item => {
					if (item.id === this.foodObj.id) {
						isHas = true;
						item.car_num = this.foodObj.car_num;
					}
				});
				if (!isHas) {
					shopCarData.push(this.foodObj);
				}
			}
			this.$store.commit('SET_STORE_CART', { store_no: this.foodObj.restaurant_no, list: shopCarData, isAdd });
		},
		toShop() {
			// 返回店铺主页
			if (this.foodObj.restaurant_no) {
				uni.redirectTo({
					url: '/otherPages/shop/shopHome?type=find&restaurantNo=' + this.foodObj.restaurant_no
				});
			}
		},
		goCar() {
			// 跳转到购物车
			uni.navigateTo({
				url: '/otherPages/shop/shopCarList?store_no=' + this.foodObj.restaurant_no
			});
		},
		/* 点击计数器加号回调**/
		adds(e) {
			this.foodObj['car_num'] = this.carNum;
			this.element = ['.u-number-box', '.cart-action'];
			// this.element = ['.counter', '.add-button'];
		},
		/* 点击计数器减号回调**/
		subtract(e) {
			this.foodObj['car_num'] = this.carNum;
		},
		/*添加到今日饮食记录**/
		async toMyTodayFood() {
			let self = this;
			let current_food = this.currFood;
			uni.showModal({
				title: '提示',
				content: '是否将当前食物添加到今日饮食记录',
				success(res) {
					if (res.confirm) {
						let obj = [
							{
								userno: uni.getStorageSync('login_user_info').user_no,
								hdate: self.nowDate,
								htime: self.nowDateTime,
								name: current_food.name,
								amount: 1,
								unit: current_food.unit,
								energy: current_food.unit_energy,
								user_name: uni.getStorageSync('current_user'),
								image: current_food.image,
								unit_weight_g: 100,
								mixed_food_no: current_food.meal_no,
								diret_type: 'mixed_food'
							}
						];
						let serviceName = 'srvhealth_diet_record_add';
						let url = self.getServiceUrl('health', serviceName, 'operate');
						let req = [{ serviceName: serviceName, colNames: ['*'], data: obj }];
						self.$http.post(url, req).then(res => {
							if (res.data.state === 'SUCCESS') {
								uni.showToast({
									title: '添加成功',
									duration: 2000,
									icon: 'none'
								});
							}
						});
					}
				}
			});
		},
		/* 点击加入购物车**/
		joinCar() {
			this.element = ['.u-number-box', '.cart-action'];
			this.carNum++;
			this.foodObj['car_num'] = this.carNum;
			this.setShopCarData(true);
		},
		jbMsg(res) {
			//执行加入购物车的逻辑
			console.log('执行回调', res.code);
		},
		async getFoodDetail(no) {
			let req = {
				condition: [{ colName: 'meal_no', ruleType: 'eq', value: no }]
			};
			if (no) {
				let res = await this.$fetch('select', 'srvhealth_mixed_food_nutrition_contents_select', req, 'health');
				if (res.success && res.data.length > 0) {
					return res.data[0];
				}
			}
		},
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
						value: this.foodObj.meal_no
					}
				]
			};
			let res = await this.$http.post(url, req);
			let data = res.data.data;
			let eleData = this.eleData;
			let dataArr = [];
			this.foodChild = data;
		}
	},
	onShow() {
		this.approveData[2].sex = this.userInfo.sex;
		this.approveData[2].age = this.age;
		this.approveData[2].weight = this.userInfo.weight;
		this.currentAppr = this.approveData[0];
		this.getMixChildFood();
	},
	async onLoad(option) {
		let foodsDetail = {};
		if (option.q) {
			let text = decodeURIComponent(option.q);
			if (text.indexOf('https://wx2.100xsys.cn/shareShopFood/') !== -1) {
				let result = text.split('https://wx2.100xsys.cn/shareShopFood/')[1];
				option.meal_no = result;
			}
		}
		if (option.itemData) {
			foodsDetail = JSON.parse(decodeURIComponent(option.itemData));
		} else if (option.meal_no) {
			foodsDetail = await this.getFoodDetail(option.meal_no);
		}
		if (!foodsDetail || !foodsDetail.meal_no) {
			return;
		}
		if (!this.cartInfo[foodsDetail.restaurant_no]) {
			// vuex中没有此店铺购物车数据
			this.$store.commit('SET_STORE_CART', { store_no: foodsDetail.restaurant_no, list: [] });
		}
		if (foodsDetail.imgurl) {
			foodsDetail.imgurl = foodsDetail.imgurl.substring(0, foodsDetail.imgurl.lastIndexOf('&'));
		}
		this.foodObj = foodsDetail;
		if (foodsDetail.name) {
			uni.setNavigationBarTitle({
				title: foodsDetail.name
			});
		}
		this.currFood = foodsDetail;
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
		this.assembleData();
		if (this.cartInfo && this.cartInfo[this.currFood.restaurant_no] && Array.isArray(this.cartInfo[this.currFood.restaurant_no].cart)) {
			this.carNum = this.cartInfo[this.currFood.restaurant_no].cart.reduce((pre, cur) => {
				if (cur.car_num) {
					pre += cur.car_num;
				}
				return pre;
			}, 0);
			let curfood = this.cartInfo[this.currFood.restaurant_no].cart.find(item => item.id === this.currFood.id);
			if (curfood && curfood.id) {
				this.value = curfood.car_num;
				this.carNum = curfood.car_num;
			}
		}
	}
};
</script>

<style scoped lang="scss">
.shop-detail-wrap {
	.cu-bar.tabbar.shop .action {
		width: 50px;
	}
	.shop-detail-top {
		width: 100%;
		height: 480upx;
		.image {
			width: 100%;
			height: 480upx;
		}
	}
	.shop-detail-cen {
		background-color: white;
		display: flex;
		justify-content: space-between;
		padding-bottom: 30upx;
		.shop-detail-cen-left {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			.left-info {
				flex: 1;
			}
			.right-code {
				background-color: #fff;
				width: 100px;
				height: 100px;
				padding: 10px;
				.qrcode-canvas {
					position: fixed;
					top: -999999px;
				}
				.qr-code-image {
					width: 80px;
					height: 80px;
				}
			}
			.cen-title {
				font-size: 36upx;
				font-weight: 700;
				padding: 15px;
			}
			.evaluate {
				display: flex;
				align-items: center;
				.cen-referral {
					padding: 0 15px;
				}
				.cen-score {
					display: flex;
					width: 100upx;
					justify-content: center;
					background: #fff5d5;
					color: #e88412;
					border-radius: 10upx;
				}
			}
			.number-box {
				display: flex;
				justify-content: space-between;
				padding: 10px 15px 0;
				align-items: center;
				width: 100%;
				.cen-money {
					color: #ff0000;
					text {
						&:first-child {
							font-size: 24upx;
						}
						&:last-child {
							font-size: 30px;
						}
					}
				}
			}
		}
		.shop-detail-cen-rig {
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			padding: 20rpx;
			.shop-detail-btn {
				margin-bottom: 10upx;
				padding: 10upx 20upx;
				background-color: #fed061;
				border-radius: 5px;
				font-weight: 700;
				text-align: center;
			}
			.shop-detail-hod {
				background: #fed061;
				text-align: center;
				border-radius: 10rpx;
				padding: 10rpx;
				font-weight: 700;
				margin-bottom: 20rpx;
			}
			.counter {
				margin-right: 20rpx;
				margin-bottom: 20rpx;
			}
		}
	}
	.shop-detail-bot {
		background-color: white;
		margin-top: 30upx;
		padding: 20upx 0 50px;
		// height: 520rpx;

		.shop-detail-bot-t {
			.shop-detail-bot-t-t {
				font-size: 30upx;
				font-weight: 600;
				padding: 20upx;
			}
			.ele-text-cen-item-wrap {
				margin-left: 30upx;
				.ele-text-cen-item {
					margin-right: 20upx;
					margin-bottom: 20upx;
					.ele-text-cen-item-title {
						margin-bottom: 20upx;
						font-weight: 600;
					}
					.ele-text-cen-item-cen {
						display: flex;
						margin-left: 20upx;
						.ele-text {
							margin-right: 20upx;
						}
					}
				}
			}
		}
	}
	.shop-detail-bot-b {
		background-color: white;
		margin-top: 30upx;
		.shop-detail-bot-b-t {
			font-weight: 600;
			margin-left: 20upx;
			padding: 20upx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			text {
				&:last-child {
					margin-right: 20upx;
					font-size: 36upx;
				}
			}
		}
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
					padding: 10px 0;
					border-bottom: 1px solid #f2f3f3;
					width: 95%;
					margin: 0 auto;
					text {
						width: 24%;
						text-align: center;
						&:first-child {
							width: 50%;
						}
					}
					&:last-of-type {
						border-bottom: none;
					}
				}
			}
			.detail-none {
				.detail-none-t {
					min-height: 200upx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					image {
						width: 100upx;
						height: 100upx;
					}
					text {
						color: #b0b0b0;
					}
				}
			}
		}
	}
	.bot-padd {
		padding-bottom: 100upx;
	}
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
	.add-button-num {
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
.uni-ec-canvas {
	width: 710rpx;
	height: 520rpx;
}
.uni-ec-canvas-top {
	display: flex;
	margin-left: 20rpx;
	margin-bottom: 20rpx;
	text {
		padding: 8rpx 20rpx;
		// background-color: #8dc63f;
		border: 1px solid #ccc;
		color: #999;
		margin-right: 20rpx;
		border-radius: 20rpx;
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
}
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
</style>
