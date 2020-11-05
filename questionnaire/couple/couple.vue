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
				<question-naire :comfromType="fromType" :activityNo="currentItem.no"></question-naire>				
			</view>
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
				coupleData:[{
					name:'基本信息',
					grade:0
				},{
					name:'疾病历史',
					grade:50
				},{
					name:'遗传史',
					grade:20,
					no:'20201105111540000164'
				},{
					name:'运动情况',
					grade:80
				},{
					name:'饮食情况',
					grade:40
				},{
					name:'其它',
					grade:0
				}],
				currentItem:'',
				fromType:''
			}
		},
		methods:{
			async chooseItem(item){
				this.currentItem = item
				if(item.no){
					let question = await this.selectQuestion()
					if(question.length > 0){
						this.fromType = 'form'
					}else{
						this.fromType = 'form'
					}
				}
			},
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
		.couple-main{
			.couple-main-m{
				max-height: calc(100vh - 600rpx);
				overflow-y: scroll;
			}
		}
	}
</style>
