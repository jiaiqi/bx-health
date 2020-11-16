<template>
	<view class="couple-wrap">
		<view class="couple-roof">
			<view class="couple-top">
				<text></text>
				<text>个人反馈</text>
			</view>
			<view class="couple-cen">
				<view @click="chooseItem(item)" v-for="(item,index) in coupleData" :key="index" class="couple-cen-item">
					<view class="couple-cen-item-t-t">
						<text v-if="item.grade || item.grade == 0">已填写</text>
					</view>
					<view v-if="item.name !== '其它'" class="couple-cen-item-t" :class="((!item.grade && item.grade!==0))?'':item.grade>0&&item.grade<=50?'risk':'normal'">					
					<!-- <view v-if="item.name !== '其它'" class="couple-cen-item-t">					 -->
						<!-- <text v-if="item.grade && item.grade !== '0'">{{item.grade}}</text>
						<text class="no-write" v-else>未填写</text> -->
						<text v-if="(item.grade || item.grade===0)">{{item.grade}}</text>
						<text class="no-write" v-else-if="(!item.grade&&item.grade!==0)">未填写</text>
					</view>
					<view class="couple-cen-item-b">
						<text>{{item.name}}</text>					
					</view>
				</view>
			</view>
		</view>
		
		<view class="couple-roof">
			<view class="couple-top">
				<text></text>
				<text>体质健康</text>
			</view>
			<view class="couple-cen">
				<view @click="chooseItem(item)" v-for="(item,index) in corporeity" :key="index" class="couple-cen-item">
					<view class="couple-cen-item-t-t">
						<text v-if="(item.grade || item.grade=== 0)">已填写</text>
					</view>
					<view v-if="item.name !== '其它'" class="couple-cen-item-t" :class="((!item.grade && item.grade!==0))?'':item.grade>=0&&item.grade<=50?'risk':'normal'">					
					<!-- <view v-if="item.name !== '其它'" class="couple-cen-item-t">					 -->
						<text v-if="(item.grade || item.grade===0)">{{item.grade}}</text>
						<text class="no-write" v-else-if="(!item.grade&&item.grade!==0)">未填写</text>
					</view>
					<view class="couple-cen-item-b">
						<text>{{item.name}}</text>					
					</view>
				</view>
			</view>
		</view>
		
		<!-- <view v-if="currentItem.no && fromType" class="couple-main">
			<view class="couple-main-t couple-top">
				<text></text>
				<text>{{currentItem.name}}</text>
			</view>
			<view class="couple-main-m">
				<question-naire :key="currIndex" :comfromType="fromType" :activityNo="currentItem.no"></question-naire>				
			</view>
		</view> -->
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
					grade:null,
					no:'20201105104133000163'
					
				},{
					name:'疾病历史',
					grade:null,
					no:'20201105115153000168'
				},{
					name:'遗传史',
					grade:null,
					no:'20201105111540000164'
				},{
					name:'运动情况',
					grade:null,
					no:'20201109095316000178'
					
				},{
					name:'饮食情况',
					grade:null,
					no:'20201106104133000174'
					
				},
				{
					name:'健康素养',
					grade:null,
					no:'20201109105128000186'
					
				},{
					name:'睡眠健康',
					grade:null,
					no:'20201109104327000185'
					
				},{
					name:'心理健康',
					grade:null,
					no:'20201109103435000184'
					
				},{
					name:'环境健康',
					grade:null,
					no:'20201109102605000183'
					
				}
				// ,{
				// 	name:'其它',
				// 	grade:0
				// },
				],
				corporeity:[{
					name:'阴虚质体质',
					grade:null,
					no:'20201112110542000192'
				},{
					name:'气郁质体质',
					grade:null,
					no:'20201112112218000193'
				},{
					name:'血瘀质体质',
					grade:null,
					no:'20201112113200000194'
				},{
					name:'痰湿质体质',
					grade:null,
					no:'20201112114401000195'
				},{
					name:'湿热质体质',
					grade:null,
					no:'20201112143740000196'
				},{
					name:'特禀质体质',
					grade:null,
					no:'20201112145435000197'
				},{
					name:'阳虚质体质',
					grade:null,
					no:'20201112105018000191'
				},{
					name:'气虚质体质',
					grade:null,
					no:'20201112104036000190'
				},{
					name:'平和质体质',
					grade:null,
					no:'20201112103143000189'
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
					
				},
				{
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
				uni.navigateTo({
					url:`/questionnaire/index/index?formType=form&activity_no=${item.no}&status=进行中`
				})	
				return 
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
			},
			/*获取分数**/
			async getScore(item){
				let url = this.getServiceUrl('daq', 'srvdaq_record_reply_select', 'select');
				let req = {
					serviceName: 'srvdaq_record_reply_select',
					colNames: ['*'],
					condition:[{
						colName:'activity_no',
						ruleType:'eq',
						value:item.no
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
				if(res.data.data.length > 0){
					item.grade = res.data.data[0].score
				}
				console.log("------分数-------",res.data.data)
			},
			/*点击首页顶部菜单**/
			async chooseItem(item){
					this.currentItem = item
					if(item.name === '其它'){
						this.isShowMore = true
					}
					uni.navigateTo({
						url:`/questionnaire/index/index?formType=form&activity_no=${item.no}&status=进行中`
					})					
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
			
			// this.chooseItem(this.currentItem)
		},
		onShow() {
			this.coupleData.forEach(item=>{
				if(item.no){
					this.getScore(item)
				}
			})
			this.corporeity.forEach(core=>{
				if(core.no){
					this.getScore(core)
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	.couple-wrap{
		min-height: 100vh;
		background-color: white;
		.couple-roof{
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
				padding: 10rpx 0 20rpx;
				border: 1px solid transparent;
				.couple-cen-item-t-t{
					width: 100%;
					text-align: right;
					margin-bottom: 10rpx;
					padding-right: 10rpx;
					font-size: 24rpx;
					color: #999;
				}
				.couple-cen-item-t{
					font-size: 72rpx;
					color: #ccc;
					font-weight: 600;
					line-height: 72rpx;
					.no-write{
						font-size: 32rpx;
					}
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
