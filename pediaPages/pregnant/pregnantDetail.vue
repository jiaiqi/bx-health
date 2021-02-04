<template>
	<view class="pregnant-detail-wrap">
		<view class="detail-top">
			<view class="detail-top-t">
				<text>宝宝一周变化</text>
				<image src="/pregnancy/static/img/pt.png" mode=""></image>
			</view>
			<view class="detail-top-b">
				<text>关爱提醒</text>
				<text>有的妈妈有少量出血，别怕，这可能是受精卵着床成功的信号；如果量多，建议去医院检查</text>
			</view>
		</view>
		<view class="detail-cen">
			<view class="detail-cen-t">
				<text>本周概览</text>
			</view>
			<view class="detail-cen-c">
				<view class="detail-cen-c-t">
					宝宝发育
				</view>
				<view class="detail-cen-c-main">
					孕1周时，精子和卵子尚未结合，胎宝宝还
					未形成，此时卵子正乖乖呆在准妈妈的体内
					等待着那位最优秀的精子勇士的到来。
					到了孕2周，准妈妈已经进入排卵期，成熟
					女性大约每月都有一个卵细胞发育成熟并释
					放出来。卵子排出后约可存活48小时，在这
					48小时内等待着与精子相遇、结合，而最终
					只有一个精子能冲破重重障碍，与卵子一起
					形成受精卵（多胞胎除外）。生命的历程，
					将由此开始。
				</view>
			</view>
		</view>
		
		<view @click="toAntenatal" class="detail-bot">
			<view class="detail-bot-t">
				<view class="detail-bot-t-l">
					<text>产检</text>
				</view>
				<view class="detail-bot-t-r">
					<text>距下次产检</text>
					<text>55</text>
					<text>天</text>
				</view>
			</view>
			<view class="detail-bot-c">
				<text>重点：</text>
				<text>建档、NT检查、空腹</text>
			</view>
			<view class="detail-bot-b">
				<view class="detail-bot-b-l">
					<text>日期：</text>
					<text>2020-10-26</text>
				</view>
				<view class="detail-bot-b-r">
					<text>查看详情</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		name:"pregnantDetail",
		data(){
			return {
				
			}
		},
		methods:{
			toAntenatal(){
				uni.navigateTo({
					url:'/pregnancy/pregnant/antenatal'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pregnant-detail-wrap{
		.detail-top{
			.detail-top-t{
				display: flex;
				flex-direction: column;
				background-color: white;
				width: 95%;
				margin: 30upx auto;
				border-radius: 10px;
				text{
					font-weight: 600;
					font-size: 28upx;
					padding: 10px;
				}
				image{
					margin-left: 50upx;
				}
			}
			.detail-top-b{
				background-color: white;
				width: 95%;
				margin: 10px auto;
				border-radius: 10px;
				padding: 20upx;
				// fb7e62
				text{
					&:first-child{
						background-color: #fce6e9;
						color: #e0657a;
						padding: 2px 5px;
						border-radius: 5px;		
						display: inline-block;				
					}
					&:last-child{
						// display: inline-block;
						margin-left: 5px;
					}
				}
			}
		}
		.detail-cen{
			width: 95%;
			margin: 20upx auto;
			
			.detail-cen-t{
				text-align: center;
				font-size: 16px;
				font-weight: 600;
				margin-bottom: 10px;
				color: #fb7e62;
			}
			.detail-cen-c{
				background-color: white;
				padding: 20upx;
				border-radius: 20upx;
				.detail-cen-c-t{
					font-weight: 600;
					font-size: 14px;
					padding-bottom: 30upx;
				}
				.detail-cen-c-main{
					line-height: 25px;
				}
			}
		}
		.detail-bot{
			width: 95%;
			background-color: white;
			margin: 20upx auto;
			border-radius: 20upx;
			padding: 20upx;
			.detail-bot-t{
				display: flex;
				justify-content: space-between;
				padding-bottom: 5px;
				border-bottom: 1px solid #f0f1f2;
				margin-bottom: 15px;
				.detail-bot-t-l{
					font-weight: 700;
				}
				.detail-bot-t-r{
					text{
						&:nth-child(2){
							color: red;
							font-weight: 600;
							padding: 0 5px;
						}
					}
				}
			}
			.detail-bot-c{
				margin: 20upx 0;
			}
			.detail-bot-b{
				display: flex;
				justify-content: space-between;
				.detail-bot-b-r{
					color: #fb7e62;
				}
			}
		}
	}
</style>
