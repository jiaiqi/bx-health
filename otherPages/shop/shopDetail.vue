<template>
	<view class="shop-detail-wrap">
		<view class="shop-detail-top">
			<image :src="foodObj.imgurl" mode=""></image>
		</view>
		<view class="shop-detail-cen">
			<view class="shop-detail-cen-left">
				<view class="cen-title">
					{{foodObj.name}}
				</view>
				<view class="cen-referral">
					脆糯营养，口感好，健康绿色
				</view>
				<view class="cen-score">
					{{foodObj.mark}}分
				</view>
				<view class="cen-money">
					<text>￥</text>
					<text>{{foodObj.price}}</text>
				</view>
			</view>		
			<view class="shop-detail-cen-rig">
				<view v-if="!isJoin" @click="joinCar" class="shop-detail-btn">
					加入购物车
				</view>
				<view v-else class="counter">
					<u-number-box @minus="subtract" @plus="adds" :min="1" v-model="value" @change="valChange"></u-number-box>
				</view>
			</view>
		</view>
		<view class="shop-detail-bot">
			<view class="shop-detail-bot-t">
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
								<!-- <text style="color: red;">({{ foodObj.vitamin_a>=450?'高':foodObj.vitamin_a>=100&&foodObj.vitamin_a<450?'较高':'低' }})</text> -->
							</view>
							<view class="ele-text">
								<text>VE:</text>
								<text>2mg</text>
								<!-- <text style="color: red;">({{ foodObj.vitamin_e>=35?'高':foodObj.vitamin_e>=15&&foodObj.vitamin_e<35?'较高':'低' }})</text> -->
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
								<!-- <text>2</text> -->
								<text>{{ foodObj.protein ? foodObj.protein.toFixed(1):'0' }}g</text>
								<!-- <text style="color: red;">({{ foodObj.protein>=35?'高':foodObj.protein>=15&&foodObj.protein<35?'较高':'低' }})</text> -->
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
								<text>{{ foodObj.vitamin_b1 ? foodObj.vitamin_b1.toFixed(1):0 }}mg</text>
								<!-- <text style="color: red;">({{ foodObj.vitamin_b1>=0.15?'高':foodObj.vitamin_b1>=0.1&&foodObj.vitamin_b1<0.15?'较高':'低' }})</text> -->
							</view>
							<view class="ele-text">
								<text>VB2:</text>
								<!-- <text>2</text> -->
								<text>{{ foodObj.vitamin_b2 ? foodObj.vitamin_b2.toFixed(1):0 }}mg</text>
								<!-- <text style="color: red;">({{ foodObj.vitamin_b2>=0.15?'高':foodObj.vitamin_b2>=0.1&&foodObj.vitamin_b2<0.15?'较高':'低' }})</text> -->
							</view>
							<view class="ele-text">
								<text>VB3:</text>
								<!-- <text>2</text> -->
								<text>{{ foodObj.vitamin_b3 ? foodObj.vitamin_b3.toFixed(1):0 }}mg</text>
								<!-- <text style="color: red;">({{ foodObj.vitamin_b3>=5?'高':foodObj.vitamin_b3>=3.5&&foodObj.vitamin_b3<5?'较高':'低' }})</text> -->
							</view>		
							<view class="ele-text">
								<text>VC:</text>
								<!-- <text>2</text> -->
								<text>{{ foodObj.vitamin_c ? foodObj.vitamin_c.toFixed(1):0 }}mg</text>
								<!-- <text style="color: red;">({{ foodObj.vitamin_c>=50?'高':foodObj.vitamin_c>=35&&foodObj.vitamin_c<50?'较高':'低' }})</text> -->
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
								<!-- <text>2</text> -->
								<text>{{ foodObj.vitamin_a ? foodObj.element_ca.toFixed(1):0 }}mg/</text>
								<!-- <text style="color: red;">({{ foodObj.element_ca>=450?'高':foodObj.element_ca>=200?foodObj.element_ca<450?'较高':'低' }})</text> -->
							</view>
							<view class="ele-text">
								<text>镁:</text>
								<!-- <text>2</text> -->
								<text>{{ foodObj.element_mg ? foodObj.element_mg.toFixed(1):0 }}mg</text>
								<!-- <text style="color: red;">({{ foodObj.element_mg>=150?'高':foodObj.element_mg>=80?foodObj.element_mg<150?'较高':'低' }})</text> -->
							</view>
							<view class="ele-text">
								<text>磷:</text>
								<!-- <text>2</text> -->
								<text>{{ foodObj.element_p ? foodObj.element_p.toFixed(1):0 }}mg</text>
								<!-- <text style="color: red;">({{ foodObj.element_p>=250?'高':foodObj.element_p>=150?foodObj.element_p<250?'较高':'低' }})</text> -->
							</view>
							<view class="ele-text">
								<text>钾:</text>
								<!-- <text>2</text> -->
								<text>{{ foodObj.element_k ? foodObj.element_k.toFixed(1):0 }}mg</text>
								<!-- <text style="color: red;">({{ foodObj.element_k>=500?'高':foodObj.element_k>=200?foodObj.element_k<500?'较高':'低' }})</text> -->
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
								<!-- <text>2</text> -->
								<text>{{ foodObj.element_fe ? foodObj.element_fe.toFixed(1):0 }}mg</text>
								<!-- <text style="color: red;">({{ foodObj.element_fe>=8?'高':foodObj.element_fe>=4?foodObj.element_fe<8?'较高':'低' }})</text> -->
							</view>
							<view class="ele-text">
								<text>锌:</text>
								<!-- <text>2</text> -->
								<text>{{ foodObj.element_zn ? foodObj.element_zn.toFixed(1):0 }}mg</text>
								<!-- <text style="color: red;">({{ foodObj.element_zn>=7?'高':foodObj.element_zn>=4?foodObj.element_zn<7?'较高':'低' }})</text> -->
							</view>
							<view class="ele-text">
								<text>硒:</text>
								<!-- <text>2</text> -->
								<text>{{ foodObj.element_se ? foodObj.element_se.toFixed(1):0 }}mg</text>
								<!-- <text style="color: red;">({{ foodObj.element_se>=20?'高':foodObj.element_se>=10?foodObj.element_se<20?'较高':'低' }})</text> -->
							</view>
							<view class="ele-text">
								<text>铜:</text>
								<text>{{ foodObj.element_cu ? foodObj.element_cu.toFixed(1):0 }}mg</text>
								<!-- <text>2</text> -->
								<!-- <text style="color: red;">({{ foodObj.element_cu>=1.5?'高':foodObj.element_cu>=1?foodObj.element_cu<1.5?'较高':'低' }})</text> -->
							</view>
							<view class="ele-text">
								<text>锰:</text>
								<!-- <text>2</text> -->
								<text>{{ foodObj.element_mn ? foodObj.element_mn.toFixed(1):0 }}mg</text>
								<!-- <text style="color: red;">({{ foodObj.element_mn>=5?'高':foodObj.element_mn>=2.5?foodObj.element_mn<5?'较高':'低' }})</text> -->
							</view>
						</view>
					</view>	
				</view>
			</view>			
		</view>
		<view class="shop-detail-bot-b">
			<view class="shop-detail-bot-b-t">
				食材营养素含量
			</view>
			<view class="shop-detail-bot-tab">
				<view v-for="(alone,i) in foodChild" :key="i" class="table">
					<view class="tr tab-tr">
						<view class="td">
							食材
						</view>
						<view class="td">
							营养素
						</view>
						<view class="td">
							含量
						</view>
					</view>
					<view class="tr-left-wrap">
						<view class="tr-left">
							<view class="td">
								{{alone.name}}
							</view>
						</view>
						<view class="tr-right">
							<view v-for="(item,index) in alone.child" :key="index" class="tr">
								<!-- <view class="td">
									{{alone.name}}
								</view> -->
								<view class="td">
									{{item.key}}
								</view>
								<view class="td">
									{{item.value?item.value:0}}
								</view>
							</view>
						</view>
						
					</view>
					
				</view>
				
					
					<!-- <tr>
						<td rowspan="13" style="text-align: center;">{{alone.name}}</td>
						<td>{{alone.child&&alone.child[0].key}}</td>
						<td>{{alone.child&&alone.child[0].value?alone.child.value:0}}</td>
					</tr>
					<tr v-for="(item,index) in alone.child" :key="index" v-show="index < 12">
						<td>{{alone.child[index+1]?alone.child[index+1].key:''}}</td>
						<td>{{alone.child[index+1]?(alone.child[index+1].value?alone.child[index+1].value:0):''}}</td>
					</tr> -->
					
			</view>
		</view>
		<jumpBall :backgroundColor="'red'" :start.sync="num" :element.sync="element" @msg="jbMsg" />
		<view class="public-button-box">
			<view @click="goCar" class="lg text-gray cuIcon-cart add-button">
				<text class="add-button-num">{{carNum}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import jumpBall from '@/components/hx-jump-ball/hx-jump-ball.vue';
	export default {
		name:'shopDetail',
		components:{jumpBall},
		data(){
			return {
				foodObj:"",
				foodChild:'',
				value: 1,
				num:0,
				carNum:0,
				element: [],
				isJoin:false,
				eleData:['protein','vitamin_b1','vitamin_b2','vitamin_b3','vitamin_c','element_mg','element_p','element_k','element_fe','element_zn','element_se','element_cu','element_mn']
			}
		},
		methods:{
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
				if(data.length > 0){						
						data.forEach(d=>{
							let obj = {
								name:"",
								child:[]
							}
							eleData.forEach(item=>{
								let obj1 = {}
								obj['name'] = d.name
								obj1['key'] = item
								obj1['value'] = d[item]
								obj.child.push(obj1)
							})
							dataArr.push(obj)
						console.log("-0-----",dataArr)
					})
				}
				this.foodChild = dataArr
			/**
			 * [{
				 name:''
				 child:[{
					 
				 }]
			 }]
			 * */	
			}
		},
		onLoad(option) {
			let foodsDetail = JSON.parse(decodeURIComponent(option.itemData))
			// foodsDetail.imgurl = foodsDetail.imgurl.substring(0,foodsDetail.imgurl.lastIndexOf("&"))
			this.foodObj = foodsDetail
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
			this.getMixChildFood()
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
			}
			.counter{
				margin-right: 20upx;
			}
		}
	}
	.shop-detail-bot{
		background-color: white;
		margin-top: 30upx;
		padding-bottom: 20upx;
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
		padding-bottom: 20upx;
		.shop-detail-bot-b-t{
			font-weight: 600;
			margin-left: 20upx;
			padding: 20upx 0;
		}
		.shop-detail-bot-tab{
			display: flex;
			justify-content: center;
			flex-direction: column;
			align-items: center;
			width: 100%;
			.table{
				width: 95%;
				border:1px solid #000000;
				margin-top: 10upx;
				.tr-left-wrap{
					display: flex;
					.tr-left{
						width: 33%;
						border-right: 1px solid #000;
						display: flex;
						align-items: center;
						justify-content: center;
					}
					.tr-right{
						width: 67%;
					}
					
				}
				
			}
			table{
				margin-top: 10upx;
				tr{
					td{
						height: 50upx;
					}
				}
			}
		}
	}
	
}
.tr{
	display: flex;
	justify-content: space-between;
	.td{
		width: 50%;
		border-right: 1px solid #000000;
		border-bottom: 1px solid #000000;
		
	}
	&:last-child{
		.td{
			border-bottom: none;
		}
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
</style>
