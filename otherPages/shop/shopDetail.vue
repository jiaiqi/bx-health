<template>
	<view class="shop-detail-wrap">
		<view class="shop-detail-top">
			<image :src="foodObj.imgurl" mode=""></image>
		</view>
		<view class="shop-detail-cen">
			<view class="shop-detail-cen-left">
				<view class="cen-title">
					{{foodObj.name?foodObj.name:''}}
				</view>
				<view class="cen-referral">
					脆糯营养，口感好，健康绿色
				</view>
				<view class="cen-score">
					{{foodObj.mark?foodObj.mark:0}}分
				</view>
				<view class="cen-money">
					<text>￥</text>
					<text>{{foodObj.price?foodObj.price:0}}</text>
				</view>
			</view>		
			<view class="shop-detail-cen-rig">
				<view @click="toMyTodayFood" class="shop-detail-hod">
					添加至今日饮食
				</view>
			<!-- 	<view v-if="!isJoin" @click="joinCar" class="shop-detail-btn">
					加入购物车
				</view>
				<view v-else class="counter">
					<u-number-box @minus="subtract" @plus="adds" :min="1" v-model="value" @change="valChange"></u-number-box>
				</view> -->
			</view>
		</view>
		<view class="shop-detail-bot">
			<view class="ele-text-top-tit">					
				<text @click="changeCate(item,index)" v-for="(item,index) in categoryTop" v-if="item.name === '食材组成'?currFood.meal_no:true" :key="index" :class="categoryTopIndex === index?'active-text-top-tit':''">{{item.name}}</text>					
			</view>
			<view v-if="categoryTopIndex == 0" class="">
				<view class="uni-ec-canvas-top">
					<text @click="changeApprove(item,index)" :class="currentAppr.name === item.name?'active-approve':''" v-for="(item,index) in approveData" :key="index">{{item.name}}</text>
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
			<view v-if="categoryTopIndex == 1" class="shop-detail-bot-b" :class="foodChild.length >=3?'bot-padd':''">
				<view class="shop-detail-bot-b-t">
					<text>食材含量</text>
				</view>
				<view class="shop-detail-bot-tab">
					<view class="shop-detail-bot-tab-t">
						<text>食材名称</text>
						<text>食材含量</text>
						<text>单位</text>
					</view>
					<view v-if="foodChild.length > 0" class="shop-detail-bot-tab-m">
						<view v-for="(item,index) in foodChild" :key="index" class="shop-detail-bot-tab-m-item">
							<text>{{item.name}}</text>
							<text>{{item.unit_amount}}</text>
							<text>{{item.unit}}</text>
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
			
			<!-- <view class="shop-detail-bot-t">
				<view class="shop-detail-bot-t-t">
					食物营养素含量
				</view>
				<view class="ele-text-cen-item-wrap">
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">
							脂溶性维生素
						</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>VA:</text>
								<text>1ug</text>
							</view>
							<view class="ele-text">
								<text>VE:</text>
								<text>2mg</text>
							</view>
						</view>
					</view>
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">
							有机物
						</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>蛋白质:</text>							
								<text>{{ foodObj.protein ? foodObj.protein:'0' }}g</text>
							</view>								
						</view>
					</view>
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">
							水溶性维生素
						</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>VB1:</text>
								<text>2</text>
								<text>{{ foodObj.vitamin_b1 ? foodObj.vitamin_b1:0 }}mg</text>
							</view>
							<view class="ele-text">
								<text>VB2:</text>
								<text>{{ foodObj.vitamin_b2 ? foodObj.vitamin_b2:0 }}mg</text>
							</view>
							<view class="ele-text">
								<text>VB3:</text>
								<text>{{ foodObj.vitamin_b3 ? foodObj.vitamin_b3:0 }}mg</text>
							</view>		
							<view class="ele-text">
								<text>VC:</text>								
								<text>{{ foodObj.vitamin_c ? foodObj.vitamin_c:0 }}mg</text>								
							</view>
						</view>
					</view>
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">
							常量矿物质
						</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>钙:</text>
								<text>{{ foodObj.vitamin_a ? foodObj.element_ca:0 }}mg</text>
								
							</view>
							<view class="ele-text">
								<text>镁:</text>
								<text>{{ foodObj.element_mg ? foodObj.element_mg:0 }}mg</text>
								
							</view>
							<view class="ele-text">
								<text>磷:</text>								
								<text>{{ foodObj.element_p ? foodObj.element_p:0 }}mg</text>								
							</view>
							<view class="ele-text">
								<text>钾:</text>								
								<text>{{ foodObj.element_k ? foodObj.element_k:0 }}mg</text>								
							</view>
						</view>
					</view>
					
					<view class="ele-text-cen-item">
						<view class="ele-text-cen-item-title">
							微量元素
						</view>
						<view class="ele-text-cen-item-cen">
							<view class="ele-text">
								<text>铁:</text>								
								<text>{{ foodObj.element_fe ? foodObj.element_fe:0 }}mg</text>								
							</view>
							<view class="ele-text">
								<text>锌:</text>								
								<text>{{ foodObj.element_zn ? foodObj.element_zn:0 }}mg</text>								
							</view>
							<view class="ele-text">
								<text>硒:</text>								
								<text>{{ foodObj.element_se ? foodObj.element_se:0 }}mg</text>								
							</view>
							<view class="ele-text">
								<text>铜:</text>
								<text>{{ foodObj.element_cu ? foodObj.element_cu:0 }}mg</text>								
							</view>
							<view class="ele-text">
								<text>锰:</text>								
								<text>{{ foodObj.element_mn ? foodObj.element_mn:0 }}mg</text>								
							</view>
						</view>
					</view>	
				</view>
			</view>	 -->		
		</view>		
		<jumpBall :backgroundColor="'red'" :start.sync="num" :element.sync="element" @msg="jbMsg" />
	<!-- 	<view class="public-button-box">
			<view @click="goCar" class="lg text-gray cuIcon-cart add-button">
				<text class="add-button-num">{{carNum}}</text>
			</view>
		</view> -->
	</view>
</template>

<script>
	import jumpBall from '@/otherPages/components/hx-jump-ball/hx-jump-ball.vue';
	// #ifdef MP-WEIXIN
	import uniEcCanvas from '@/components/uni-ec-canvas/uni-ec-canvas.vue';
	// import uniEcCanvas from '@/otherPages/components/uni-ec-canvas/uni-ec-canvas.vue';
	// #endif
	// #ifdef H5
	import uniEcharts from '@/components/uni-ec-canvas/uni-echarts.vue';
	// import uniEcharts from '@/otherPages/components/uni-ec-canvas/uni-echarts.vue';
	// #endif
	export default {
		name:'shopDetail',
		components:{			
			jumpBall,
			// #ifdef MP-WEIXIN
			uniEcCanvas,
			// #endif
			// #ifdef H5
			uniEcharts
			// #endif			
		},
		data(){
			return {
				categoryTop:[{
					name:'NRV%占比',
					type:'NRV'
				},{
					name:'食材组成',
					type:'material'
				}],
				foodObj:"",
				foodChild:'',
				queryType:'',
				value: 1,
				num:0,
				carNum:0,
				element: [],
				nowDate: this.formateDate(new Date(), 'date').replace(/\s*/g, ''),
				nowDateTime: this.formateDate(new Date(), 'dateTime'),
				isJoin:false,
				approveData:[{
					name:'成年男性',
					type:'man',
					sex:'男',
					age:18,
					weight:65
					
				},{
					name:'成年女性',
					type:'woman',
					sex:'女',
					age:18,
					weight:55
				},{
					name:'我的',
					type:'mine',
					sex:null,
					age:null,
					weight:null
				}],
				nutrientData:[{
					name:'蛋白质',
					key:'protein'
				},{
					name:'碳水化合物',
					key:'carbohydrate'
				},{
					name:'脂肪',
					key:'axunge'
				},{
					name:'VA',
					key:'vitamin_a'
				},{
					name:'VE',
					key:'vitamin_e'
				},{
					name:'VB1',
					key:'vitamin_b1'
				},{
					name:'VB2',
					key:'vitamin_b2'
				},{
					name:'VB3',
					key:'vitamin_b3'
				},{
					name:'钙',
					key:'element_ca'
				},{
					name:'镁',
					key:'element_mg'
				},{
					name:'磷',
					key:'element_p'
				},{
					name:'钾',
					key:'element_k'
				},{
					name:'铁',
					key:'element_fe'
				},{
					name:'锌',
					key:'element_se'
				},{
					name:'铜',
					key:'element_cu'
				},{
					name:'锰',
					key:'element_mn'
				}],
				stepData:{
					option:{
						color: ['#92d050','#4f81bd','#f79646'],
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
							y:'25px',
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
							data:[],
							axisLabel:{
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
							axisLabel:{
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
						series:[{
							name:'食物含量',
							type:'bar',
							stack:'总数',
							// itemStyle:{
							// 	normal:{
							// 		label:{
							// 			show:true,
							// 			position:'top',
							// 			formatter: function(v) {										
							// 				var val = v.data;						
							// 				return val +'%';					
							// 			},
							// 			textStyle:{
							// 				color:'#f79646',
							// 				fontSize:10
							// 			}
							// 		}
							// 	}
							// },
							data:[]
						}]	
					}			
				},
				echartsIsShow:false,
				currentAppr:'',
				currFood:'',
				userInfo: '',
				result: '',
				categoryTopIndex:0,
				eleData:['protein','vitamin_b1','vitamin_b2','vitamin_b3','vitamin_c','element_mg','element_p','element_k','element_fe','element_zn','element_se','element_cu','element_mn']
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
		methods:{
			/*点击切换营养素占比和NRV**/
			changeCate(item,index){
				this.categoryTopIndex = index
				if(item.type === 'NRV'){
					this.currentAppr = this.approveData[0]
				}
			},
			/*点击切换图表顶部类型**/
			changeApprove(item,index){
				if(item.type === 'mine' && (!item.age || !item.sex)){
					uni.showModal({
					    title: '提示',
					    content: '当前没有进行登记年龄、性别和体重，是否去登记?',
					    success: function (res) {
					        if (res.confirm) {
								uni.navigateTo({
									url:'/otherPages/chooseFood/myFoodsInfo'
								})
					        } else if (res.cancel) {
					            console.log('用户点击取消');
					        }
					    }
					});
				}else{
					this.currentAppr = item
					this.assembleData()
				}
				
			},
			originalData(){
				let self = this
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
						if (nut.name === '脂肪' || nut.name === '碳水化合物' || nut.name === 'VB3'){
						addData.push(Number(currFood[nut.key]));
					}
					result.forEach(re => {
						if (nut.name === re.nutrient) {
							num = (((currFood[nut.key]) / Number(re.val_rni)) * 100);
							if(nut.name === '蛋白质'){
								// num = Number((self.currentAppr.weight * 0.9)).toFixed(1)
								num = (((currFood[nut.key]) / (Number(re.val_rni) * self.currentAppr.weight)) * 100)								
							}
							if(num > 100){
								num  = (num - 100).toFixed(1)
							}else{
								num = num.toFixed(1)
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
								if(nut.name === '蛋白质'){
									num = Number(((Number(currFood[nut.key]) / Number(re.val_rni)) * 100 / self.currentAppr.weight)).toFixed(1)
								}
								endArr.push(Number(num));						
							}												
						});
					});
					return endArr;
				}
			},
			/* 组装图表数据**/
			async assembleData(){
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
				console.log('currData======>', currData);
				// option.series[0].data = currData.map(ser => {
				// 	return ser;
				// });
				if(!option.series[1] ){
					option.series.push(obj);
				}
				// if(this.value1 == 0){
				// 	this.countDietNum('+1');
				// }else{
					this.originalData()
				// }
			},
			/*计数器change方法*/
			valChange(e) {
				// if(!this.foodObj.car_num){
				// 	this.foodObj['car_num'] = e.value
				// }else{
					this.foodObj.car_num = e.value
					this.setShopCarData()
				// }				
			},
			setShopCarData(){
				if(!this.foodObj.car_num){
					this.foodObj['car_num'] = 1
				}
				if(!uni.getStorageSync('shop_car')){
					// this.foodObj.car_num  = 1					
					let shopCarData = [this.foodObj]
					uni.setStorageSync('shop_car',shopCarData)
				}else{
					let shop_car_data = uni.getStorageSync('shop_car')
					let isHas = false
					shop_car_data.forEach(item=>{
						if(item.id === this.foodObj.id){
							isHas = true
							item.car_num = this.foodObj.car_num
						}
					})
					if(!isHas){
						shop_car_data.push(this.foodObj)
					}
					uni.setStorageSync('shop_car',shop_car_data)
				}
			},
			/* 点击购物车前往购物车列表**/
			goCar(){
				uni.navigateTo({
					url:"/otherPages/shop/shopCarList"
				})
			},
			/* 点击计数器加号回调**/
			adds(e){
				this.element = ['.counter','.add-button'];
				this.num = e.value
				this.carNum++
			},
			/* 点击计数器减号回调**/
			subtract(e){
				this.carNum--
			},
			/*添加到今日饮食记录**/
			async toMyTodayFood(){
				let current_food = this.currFood
				let obj = [{
					userno: uni.getStorageSync('login_user_info').user_no,
					hdate: this.nowDate,
					htime: this.nowDateTime,
					name: current_food.name,
					amount: 1,
					unit: current_food.unit,
					energy: current_food.unit_energy,
					user_name: uni.getStorageSync('current_user'),
					image: current_food.image,
					unit_weight_g: 100,
					mixed_food_no :current_food.meal_no,
					diret_type: 'mixed_food'
				}];
				let serviceName = 'srvhealth_diet_record_add';
				let url = this.getServiceUrl('health', serviceName, 'operate');
				let req = [{ serviceName: serviceName, colNames: ['*'], data: obj }];
				let res = await this.$http.post(url, req);
				if(res.data.state === 'SUCCESS'){
					uni.showToast({
					    title: '添加成功',
					    duration: 2000,
						icon:'none'
					});
				}
				
			},
			/* 点击加入购物车**/
			joinCar(){				
				this.element = ['.shop-detail-cen-rig', '.add-button'];
				this.num = 1
				this.isJoin = true
				this.setShopCarData()
				this.carNum += 1
			},			
			jbMsg(res) {
				//执行加入购物车的逻辑
				console.log('执行回调', res.code);
			},
			async getMixChildFood(){
				let self = this
				let url = this.getServiceUrl('health', 'srvhealth_mixed_food_nutrition_item_select', 'select');
				let req = {
					serviceName: 'srvhealth_mixed_food_nutrition_item_select',
					colNames: ['*'],
					condition:[{
						colName:"meal_no",
						ruleType:"eq",
						value:this.foodObj.meal_no
					}],
				};
				let res = await this.$http.post(url, req);
				console.log("-0-----")
				let data = res.data.data
				let eleData = this.eleData
				let dataArr = []
				// if(data.length > 0){	
					this.foodChild = data
				// }	
			}
		},
		onShow() {
			this.approveData[2].sex = this.userInfo.sex
			this.approveData[2].age = this.age
			this.approveData[2].weight = this.userInfo.weight
			this.currentAppr = this.approveData[0]
			this.getMixChildFood()
		},
		onLoad(option) {
			
			let foodsDetail = JSON.parse(decodeURIComponent(option.itemData))
			
			this.queryType = option.type
			if(foodsDetail.imgurl){
				foodsDetail.imgurl = foodsDetail.imgurl.substring(0,foodsDetail.imgurl.lastIndexOf("&"))
			}
			this.foodObj = foodsDetail
			this.currFood = foodsDetail
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
			this.assembleData()
			if(uni.getStorageSync('shop_car')){
				let car_data = uni.getStorageSync('shop_car')
				let isHas = false
				let car_curr = null
				car_data.forEach(item=>{
					if(item.id === this.foodObj.id){
						isHas = true
						car_curr = item
					}
					this.carNum += item.car_num
				})
				if(isHas){
					this.isJoin = true
					this.value = car_curr.car_num
				}
			}
			
		}
	}
</script>

<style scoped lang="scss">
.shop-detail-wrap{
	.shop-detail-top{
		width: 100%;
		height: 480upx;
		image{
			width: 100%;
		}
	}
	.shop-detail-cen{
		background-color: white;
		display: flex;
		justify-content: space-between;
		padding-bottom: 30upx;
		.shop-detail-cen-left{
			.cen-title{
				font-size: 36upx;
				font-weight: 700;
				padding: 15px;
			}
			.cen-referral{
				padding-left: 15px;	
			}
			.cen-score{
				display: flex;
				width: 100upx;
				justify-content: center;
				margin-left: 20upx;
				margin-top: 20upx;
				background: #fff5d5;
				color: #e88412;
				border-radius: 10upx;
			}
			.cen-money{
				margin-top: 30upx;
				margin-left: 30upx;
				color: #ff0000;
				text{
					&:first-child{
						font-size: 24upx;
					}
					&:last-child{
						font-size: 30px;
					}
				}
			}
		}
		.shop-detail-cen-rig{
			display: flex;
			flex-direction: column;
			justify-content: flex-end;
			.shop-detail-btn{
				margin: 20upx;
				margin-bottom: 10upx;
				padding: 10upx 20upx;
				background-color: #fed061;
				border-radius: 5px;
				font-weight: 700;
				text-align: center;
			}
			.shop-detail-hod{
				background: #fed061;
				text-align: center;
				border-radius: 10rpx;
				padding: 10rpx;
				margin-right: 20rpx;
				font-weight: 700;
				margin-bottom: 20rpx;
			}
			.counter{
				margin-right: 20upx;
			}
		}
	}
	.shop-detail-bot{
		background-color: white;
		margin-top: 30upx;
		padding: 20upx 0;
		// height: 520rpx;
		
		.shop-detail-bot-t{
			.shop-detail-bot-t-t{
				font-size: 30upx;
				font-weight: 600;
				padding: 20upx;
			}
			.ele-text-cen-item-wrap{
				margin-left: 30upx;
				.ele-text-cen-item{
					margin-right: 20upx;
					margin-bottom: 20upx;
					.ele-text-cen-item-title{
						margin-bottom: 20upx;
						font-weight: 600;
					}
					.ele-text-cen-item-cen{
						display: flex;
						margin-left: 20upx;
						.ele-text{
							margin-right: 20upx;
						}
					}
				}
			}
			
		}		
	}
	.shop-detail-bot-b{
		background-color: white;
		margin-top: 30upx;
		// padding-bottom: 100upx;
		.shop-detail-bot-b-t{
			font-weight: 600;
			margin-left: 20upx;
			padding: 20upx 0;
			display: flex;
			align-items: center;
			justify-content: space-between;
			text{
				&:last-child{
					margin-right: 20upx;
					font-size: 36upx;
				}
			}
		}
		.shop-detail-bot-tab{
			min-height: 300upx;
			.shop-detail-bot-tab-t{
				display: flex;
				justify-content: space-around;
				background-color: rgb(240,240,240);
				padding: 5px 0;
				width: 95%;
				margin: 0 auto;
				text{
					width: 24%;
					text-align: center;
					&:first-child{
						width: 50%;
					}
				}
			}
			.shop-detail-bot-tab-m{
				.shop-detail-bot-tab-m-item{
					display: flex;
					justify-content: space-around;
					padding: 10px 0;
					border-bottom: 1px solid #f2f3f3;
					width: 95%;
					margin: 0 auto;
					text{
						
						width: 24%;
						text-align: center;
						&:first-child{
							width: 50%;
						}
						
					}
					&:last-of-type{
						border-bottom: none;
					}
				}
				
			}
			.detail-none{
				.detail-none-t{
					min-height: 200upx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					image{
						width: 100upx;
						height: 100upx;
					}
					text{
						color: #b0b0b0;
					}
				}
			}
		}
	}
	.bot-padd{
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
	.uni-ec-canvas-top{
		display: flex;
		margin-left: 20rpx;
		margin-bottom: 20rpx;
		text{
			padding: 8rpx 20rpx;
			// background-color: #8dc63f;
			border:1px solid #ccc;
			color: #999;
			margin-right: 20rpx;
			border-radius: 20rpx;
			
		}
		.active-approve{
			background-color: #8dc63f;
			color: #fff;
			border-color: #8dc63f;
		}
	}
	.uni-ec-canvas-bot{
		width: 710rpx;
		height: 540rpx;
	}
	.ele-text-top-tit{
		display: flex;
		margin-bottom: 30rpx;
		text{
			font-size: 30rpx;
			padding: 8rpx 20rpx;
			border-bottom: 1px solid transparent;
			margin-right: 20rpx;
			
			// border-radius: 30rpx;
		}
		.active-text-top-tit{
			// background-color: #fbbd08;
			color: #FBBD08;
			font-weight: 700;
			border-color: #FBBD08;
		}
	}
</style>
