<template>
	<view class="pregnant-home-wrap">
		<view class="pregnant-home-top">
			<text>选择您所处得状态</text>
		</view>
		<view class="pregnant-home-status">
			<view @click="choseItem('prepare')" class="pregnant-status">
				<view class="pregnant-status-top">
					<image src="/otherPages/static/img/sj.png" mode=""></image>
				</view>
				<text :class="current_type === 'prepare'?'active-pregnant':''">孕前</text>
			</view>
			<view @click="choseItem('family')" class="pregnant-status">
				<view class="pregnant-status-top">
					<image src="/otherPages/static/img/hy.png" mode=""></image>
				</view>				
				<text :class="current_type === 'family'?'active-pregnant':''">已怀孕</text>
			</view>
			<view @click="choseItem('baby')" class="pregnant-status">
				<view class="pregnant-status-top">
					<image src="/otherPages/static/img/son.png" mode=""></image>
				</view>
				<text :class="current_type === 'baby'?'active-pregnant':''">产后</text>
			</view>
		</view>
		<view v-if="current_type === 'family'" class="pregant-home-main">
			<view class="pregant-home-main-cont">
				<view class="pregant-home-main-title">
					预产期
				</view>
				<view  class="pregant-home-main-time">
					{{prepay_time?prepay_time:'请选择预产时间'}}
				</view>
				<view class="pregant-home-main-date">
					<text>{{prepay_date?prepay_date:''}}</text>
				</view>
			</view>
			<view class="pregant-home-main-bot">
				<text>不知道预产期?</text>
				<text>用末次月经开始日期计算</text>
			</view>
		</view>
		<view v-if="current_type === 'prepare'" class="pregant-home-main">
			<view class="pregant-home-main-cont">
				<view class="pregant-home-main-title">
					备孕期
				</view>
				<view  class="pregant-home-main-time">
					{{prepay_time?prepay_time:'请选择备孕时间'}}
				</view>
				<!-- <view class="pregant-home-main-date">
					<text>{{prepay_date?prepay_date:'恭喜怀孕5周4天'}}</text>
				</view> -->
			</view>
			<!-- <view class="pregant-home-main-bot">
				<text>不知道预产期?</text>
				<text>用末次月经开始日期计算</text>
			</view> -->
		</view>
		
		<view v-if="current_type === 'baby'" class="pregant-home-main">
			<view class="pregant-home-main-cont">
				<view class="pregant-home-main-title">
					出生日期
				</view>
				<view  class="pregant-home-main-time">
					{{prepay_time?prepay_time:'请选择出生时间'}}
				</view>
				<!-- <view class="pregant-home-main-date">
					<text>{{prepay_date?prepay_date:'恭喜怀孕5周4天'}}</text>
				</view> -->
			</view>
			<!-- <view class="pregant-home-main-bot">
				<text>不知道预产期?</text>
				<text>用末次月经开始日期计算</text>
			</view> -->
		</view>
		
		<view @click="toPregant" class="pregant-home-bot">
			立即进入
		</view>
	</view>
</template>

<script>
	export default{
		name:'pregnantHome',
		data(){
			return {
				current_type:'family', //当前选中的状态
				prepay_time:'', // 预产日期
				prepay_date:'' // 预产时间
			}
		},
		methods:{
			/*选择当前登录人的状态 **/
			choseItem(type){
				this.current_type = type
				if(type === 'prepare'){
					
				}else if(type === 'family'){
					
				}else if(type === 'baby'){
					
				}
			},
			/* 点击前往首页**/
			toPregant(){
				uni.navigateTo({
					url:'/otherPages/pregnant/pregnant'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pregnant-home-wrap{
		background-color: #f9f7fa;
		height: 100vh;
		.pregnant-home-top{
			display: flex;
			justify-content: center;
			padding-top: 30upx;
			font-size: 36upx;
			font-weight: 600;
		}
		.pregnant-home-status{
			display: flex;
			justify-content: space-around;
			margin-top: 30upx;
			
			.pregnant-status{
				display: flex;
				flex-direction: column;
				align-items: center;
				text{
					margin-top: 20upx;
					color: #CCCCCC;
				}
				.pregnant-status-top{
					width: 150upx;
					height: 150upx;
					image{
						width: 100%;
						height: 100%;
					}
				}
				.active-pregnant{
					color: #000000;
					font-weight: 700;
				}
			}
		}
		.pregant-home-main{
			width: 85%;			
			margin: 50px auto 0;
			background: white;
			border-radius: 5px;
			padding: 15px;
			box-shadow: 3px 3px 4px rgba(26, 26, 26, 0.2);
			.pregant-home-main-cont{
				.pregant-home-main-title{
					color: #79787e;
				}
				.pregant-home-main-time{
					text-align: center;
					padding: 10px;
					background-color: #f6f6f8;
					border-radius: 20px;
					margin: 10px;
					font-weight: 700;
					font-size: 16px;					
				}
				.pregant-home-main-date{
					text-align: center;
					color: #29c08d;
					font-weight: 700;
					font-size: 16px;
					margin-bottom: 15px;
				}
			}
			.pregant-home-main-bot{
				text-align: center;
				font-size: 15px;
				text{
					&:last-child{
						color: #6d6fc4;
						font-weight: 700;
					}
				}
			}
		}
		.pregant-home-bot{
			margin: 200upx auto 0;
			text-align: center;
			background-color: #5768fe;
			width: 85%;
			color: white;
			font-weight: 600;
			padding: 10px;
			border-radius: 20px;
		}
	}
	
</style>
