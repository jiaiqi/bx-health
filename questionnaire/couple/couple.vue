<template>
	<view class="couple-wrap">
		<view class="couple-top">
			<text></text>
			<text>个人反馈</text>
		</view>
		<view class="couple-cen">
			<view @click="chooseItem(item)" v-for="(item,index) in coupleData" :key="index" :class="currentItem.name === item.name?'couple-cen-item-active':''" class="couple-cen-item">
				<view v-if="item.name !== '其它'" class="couple-cen-item-t" :class="item.grade===0?'':item.grade>=0&&item.grade<=50?'risk':'normal'">
					<text>{{item.grade}}</text>
				</view>
				<view class="couple-cen-item-b">
					<text>{{item.name}}</text>					
				</view>
			</view>
		</view>
		<view v-if="currentItem.no && fromType" class="couple-main">
			<view class="couple-main-t couple-top">
				<text></text>
				<text>{{currentItem.name}}</text>
			</view>
			<view class="couple-main-m">
				<question-naire :key="currIndex" :comfromType="fromType" :activityNo="currentItem.no"></question-naire>				
			</view>
		</view>
		<u-popup mode="bottom" :closeable="true" v-model="isShowMore">
			<view class="couple-more-wrap">
				<view class="couple-more-top">
					<text></text>
					<text>更多</text>
				</view>
				<view class="more-couple-cen-wrap">
					<view class="couple-cen more-couple-cen">
						<view @click="chooseMoreItem(item)" v-for="(item,index) in moreCoupleData" :key="index" :class="currentItem.name === item.name?'couple-cen-item-active':''" class="couple-cen-item">
							<view v-if="item.name !== '其它'" class="couple-cen-item-t" :class="item.grade===0?'':item.grade>=0&&item.grade<=50?'risk':'normal'">
								<text>{{item.grade}}</text>
							</view>
							<view class="couple-cen-item-b">
								<text>{{item.name}}</text>					
							</view>
						</view>
					</view>
				</view>
				
			</view>
			
		</u-popup>
	</view>
</template>

<script>
	import questionNaire from '@/questionnaire/index/index';
	export default {
		name:'couple',
		components:{questionNaire},
		data(){
			return {
				isShowMore:false,
				coupleData:[{
					name:'基本信息',
					grade:0,
					no:'20201105104133000163'
					
				},{
					name:'疾病历史',
					grade:50,
					no:'20201105115153000168'
				},{
					name:'遗传史',
					grade:20,
					no:'20201105111540000164'
				},{
					name:'运动情况',
					grade:80,
					no:'20201109095316000178'
					
				},{
					name:'饮食情况',
					grade:40,
					no:'20201106142616000177'
					
				},{
					name:'其它',
					grade:0
				}],
				moreCoupleData:[{
					name:'基本信息',
					grade:0,
					no:'20201105104133000163'
					
				},{
					name:'疾病历史',
					grade:50,
					no:'20201105115153000168'
				},{
					name:'遗传史',
					grade:20,
					no:'20201105111540000164'
				},{
					name:'运动情况',
					grade:80,
					no:'20201109095316000178'
					
				},{
					name:'饮食情况',
					grade:40,
					no:'20201106142616000177'
					
				},{
					name:'健康素养',
					grade:75,
					no:'20201109105128000186'
					
				},{
					name:'睡眠健康',
					grade:60,
					no:'20201109104327000185'
					
				},{
					name:'心理健康',
					grade:85,
					no:'20201109103435000184'
					
				}],
				currentItem:'',
				fromType:'',
				currIndex:0
			}
		},
		methods:{
			/*点击更多之中的菜单**/
			chooseMoreItem(item){
				console.log("点击更多---->",item)
				this.isShowMore = false
				this.currentItem = item
				let isHas = false
				this.coupleData.forEach(more=>{
					if(more.name === item.name){
						isHas = true
					}
				})
				if(!isHas){
					this.coupleData[this.coupleData.length - 2] = item
				}
				this.selectQuestion()
			},
			/*点击首页顶部菜单**/
			async chooseItem(item){
				++this.currIndex
				if(item.no){
					this.currentItem = item
					let question = await this.selectQuestion()
					if(question.length > 0){
						this.fromType = 'form'
					}else{
						this.fromType = 'form'
					}
				}else if(item.name === '其它'){
					this.isShowMore = true
				}
			},
			/*查询问卷内容**/
			async selectQuestion(){
				let self = this
				let url = this.getServiceUrl('daq', 'srvdaq_record_reply_select', 'select');
				let req = {
					serviceName: 'srvdaq_record_reply_select',
					colNames: ['*'],
					condition:[{
						colName:'activity_no',
						ruleType:'eq',
						value:this.currentItem.no
					},{
						colName:'user_no',
						ruleType:'eq',
						value:uni.getStorageSync('login_user_info').user_no
					},{
						colName:'state',
						ruleType:'eq',
						value:'完成'
					}]
				};
				let res = await this.$http.post(url, req);
				return res.data.data				
			},
		},
		onLoad() {
			this.currentItem = this.coupleData[0]
			this.chooseItem(this.currentItem)
		}
	}
</script>

<style lang="scss" scoped>
	.couple-wrap{
		height: 100vh;
		background-color: white;
		
		.couple-top{
			padding: 15px;
			font-size: 16px;
			font-weight: 800;
			display: flex;
			align-items: center;
			text{
				&:first-child{
					width: 8rpx;
					height: 32rpx;
					background-color: #0081FF;
					border-radius: 8rpx;
					margin-right: 10rpx;
				}
			}
		}
		.couple-cen{
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			.couple-cen-item{
				width: 30%;
				box-shadow: rgba(0, 0, 0, 0.1) 0px 3px 10px, rgba(0, 0, 0, 0.04) 0px 0px 6px;
				margin: 10rpx;
				border-radius: 14rpx;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 20rpx 0;
				border: 1px solid transparent;
				.couple-cen-item-t{
					font-size: 72rpx;
					color: #ccc;
					font-weight: 600;
				}
				.risk{
					// color: #ff0707;
					color: #e54d42;
				}
				.normal{
					color: #39b54a;
				}
				.couple-cen-item-b{
					font-size: 32rpx;
					font-weight: 700;
				}
			}
			.couple-cen-item-active{
				border-color:#f37b1d;
			}
		}
		
		.more-couple-cen{
			justify-content: flex-start;
			margin-left: 10rpx;
		}
		.couple-main{
			.couple-main-m{
				max-height: calc(100vh - 600rpx);
				overflow-y: scroll;
			}
		}
		.couple-more-wrap{
			height: 100vh;
			.couple-more-top{
				padding: 15px;
				font-size: 16px;
				font-weight: 800;
				display: flex;
				align-items: center;
				text{
					&:first-child{
						width: 8rpx;
						height: 32rpx;
						background-color: #0081FF;
						border-radius: 8rpx;
						margin-right: 10rpx;
					}
				}
			}
		}
	}
</style>
