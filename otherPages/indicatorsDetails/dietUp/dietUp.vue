<template>
	<view class="wrap">
		<view class="header-box">
			<view class="corner">经典均衡饮食</view>
			<view class="content">
				<view class="">
					<view class="title">摄入</view>
					<view class="number">1585</view>
				</view>
				<view class="">
					<view class="title">还可以吃</view>
					<view class="number">2000</view>
				</view>
			</view>
		</view>
		<view class="list-content">
			<view class="box-food" v-for="i in 5">
				<view class="box" >
					<image  src="https://res1.hoto.cn/035e502659633f0df444eb88.jpg!default" mode=""></image>
					<view>
						<view class="title">米饭</view>
						<view class="msg">2.0两</view>
					</view>
				</view>
				<view class="units">255千卡<text class="cuIcon-right icon"></text></view>
			</view>
			<view class="footer_box">
				<view class="chart">
					<view class="chartIcon">
						<view class="qiun-charts" >
							
						</view>
					</view>
					<view class="message">
						<view class="onebox" v-for="(item ,index) in chartList" :key="index">
							<text class="title"><i :style="{background:item.color}" class="example"></i>{{item.title}}</text>
							<text class="percent">{{item.percent}}</text>
							<text class="content-text">{{item.content}}</text>
						</view>
					</view>
				</view>
				<view style="width: 30%;">
					<view class="number">
						<view class="num">602</view>
						<view class="unit">千卡</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	var canvaRing=null;
	export default{
		data(){
			return{
				chartList:[
					{
						title:'蛋白质',
						percent:'9%',
						content:'14.5克',
						color:'#ffcf9e'
					},
					{
						title:'脂肪',
						percent:'55%',
						content:'16.5克',
						color:'#fc938f'
					},
					{
						title:'碳水化合物',
						percent:'67%',
						content:'103.5克',
						color:'#aaadfe'
					}
				],
				foodList:[]
			}
		},
		methods:{
			async getCurrUserInfo() {
				const url = this.getServiceUrl('health', 'srvhealth_diet_record_select', 'select');
				let user = uni.getStorageSync('login_user_info').user_no;
				let req = {
					serviceName: 'srvhealth_diet_record_select',
					colNames: ['*'],
					condition: [{ colName: 'userno', ruleType: 'eq', value: uni.getStorageSync('login_user_info').user_no }],
					order: [
						
					]
				};
				const res = await this.$http.post(url, req);
				console.log('-----', res.data.data);
				this.foodList = res.data.data
			},
		},
		onLoad() {
			this.getCurrUserInfo()
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
	.header-box{
			margin: 40upx;
			background:#fff;
			border-radius: 10upx;
			position: relative;
			box-shadow: 0 0 5px 0 rgba(0,0,0,.2);
			overflow: hidden;
			.corner{
				position: absolute;
				top: 0;
				left: 0;
				text-align: center;
				border-top-left-radius: 10upx;
				border-bottom-right-radius: 20upx;
				background: linear-gradient(to left, #f1cb7a, #efd9a9);
				padding:  10upx;
				font-size: 22upx;
				font-weight: bold;
				color: #676464;
			}
			.content{
				display: flex;
				justify-content: space-between;
				padding: 20upx 50upx;
				margin: 80upx 0 50upx 0;
				text-align: center;
				font-weight: bold;
				.number{
					font-size: 60upx;
				}
				.title{
					font-size: 22upx;
					color: #8e8e8e;
				}
			}
		}
		.list-content{
			margin: 40upx;
			background:#fff;
			border-radius: 10upx;
			box-shadow: 0 0 5px 0 rgba(0,0,0,.2);
			padding: 40upx;
			.box-food{
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 40upx ;
				.box{
					display: flex;
					align-items: center;
					image{
						height: 90upx;
						width: 90upx;
						border-radius: 8upx;
						margin-right: 25upx;
					}
					.title{
						font-weight: bold;
						padding-bottom: 8upx;
					}
					.msg{
						color: #8e8e8e;
						font-size: 22upx;
						font-weight: bold;
						padding-top: 8upx;
					}
				}
				.units{
					font-weight: bold;
					color: #8e8e8e;
					font-size: 22upx;
					.icon{
						margin-left: 8upx;
					}
				}
			}
			.box-food:last-child{
				padding-bottom: 40upx;
				margin-bottom: 0;
			}
		}
		.footer_box{
			border-top: 1upx solid #e6e6e6;
			padding-top: 40upx;
			display: flex;
			// justify-content: space-between;
			align-items: center;
			.chart{
				display: flex;
				align-items: center;
				width: 70%;
				.message{
					.onebox{
						line-height: 40upx;
						.title{
							display: inline-block;
							font-weight: bold;
							font-size: 24upx;
							width: 200upx;
						}
						.percent{
							display: inline-block;
							width: 80upx;
							color: #909090;
							font-size: 22upx;
						}
						.example{
							display: inline-block;
							height: 20upx;
							width: 20upx;
							border-radius: 4upx;
							background-color: yellow;
							margin-right: 16upx;
						}
						.content-text{
							color: #909090;
							font-size: 22upx;
						}
					}
				}
				.chartIcon{
					width: 0upx;
					height: 110upx;
					// background: #EEEEEE;
				}
			}
			.number{
				text-align: center;
				.num{
					font-size: 50upx;
					font-weight: bold;
				}
				.unit{
					font-size: 22upx;
					color: #909090;
				}
			}
		}
	}
</style>
