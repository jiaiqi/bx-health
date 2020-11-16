<template>
	<view class="sports-wrap">
		<view class="sports-top">
			<view class="sports-top-left">
				<image :src="sports && sports.imgurl"></image>
			</view>
			<view class="sports-top-rig">
				<text>{{sports.name}}</text>
			</view>
		</view>
		<view class="sport-main">
			<view class="spor-main-top">
				<text>热量</text>
				<text>千卡</text>
			</view>
			<view class="spor-main-cen">
				<view class="mian-num-top">
					<text>{{sports.unit_energy}}</text>
					<text>千卡</text>
				</view>
				<view class="main-num-bot">
					每{{sports.unit}}消耗热量
				</view>
			</view>
			<view class="sport-main-bot">
				<view class="padding bg-white probar">
					<view class="cu-progress radius pro-rad">
						<view :num="'运动过低'" class="bg-grey low" :style="[{ width: '33%' }]"></view>
						<view class="bg-olive regular" :style="[{ width: '33%' }]"></view>
						<view :num="'运动过高'" class="bg-red risk" :style="[{ width: '33%' }]"></view>
						<view class="tootio-item-wrap">
							<view class="tootio-item max-risk">正常</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'sportsDetail',
		data(){
			return {
				sports:''
			}
		},
		onLoad(option) {
			this.sports = JSON.parse(decodeURIComponent(option.sport))
		}
	}
</script>

<style lang="scss" scoped>
	.sports-wrap{
		background-color: #f5f4f9;
		min-height: 100vh;
		.sports-top{
			background-color: white;
			display: flex;
			align-items: center;
			padding: 5px;
			.sports-top-left{
				width: 100upx;
				height: 100upx;
				margin-left: 30upx;
				image{
					width: 100%;
					height: 100%;					
				}
			}
			.sports-top-rig{
				color: #3a3c4b;
				font-weight: 700;
				font-size: 36upx;
				margin-left: 20upx;
			}
		}
		.sport-main{
			width: 90%;
			margin: 0 auto;
			background: white;
			padding: 20px;
			border-radius: 15px;
			margin-top: 45px;
			.spor-main-top{
				display: flex;
				justify-content: space-between;
				text{
					&:first-child{
						color: #3c3e57;
						font-size: 17px;
						font-weight: 700;
					}
					&:last-child{
						color: #27c9a4;
					}
				}
			}
			.spor-main-cen{
				margin-top: 20px;
				display: flex;
				flex-direction: column;
				align-items: center;
				.mian-num-top{
					text{
						&:first-child{
							margin-right: 10px;
							    font-size: 32px;
						}
					}
				}
				.main-num-bot{
					margin-top: 12px;
					color: #acafb6;
				}
			}
			.sport-main-bot{
				margin-top: 90upx;
			}
		}
	}
	.probar {
		width: 100%;
		padding: 40upx 20upx;
		position: relative;
	}
	.pro-rad {
		overflow: inherit;
		height: 10px;
		background-color: transparent;
	}
	
	.tootio-item-wrap {
		position: absolute;
		width: 80rpx;
		top: -50rpx;
		right: 127px;
	
		.tootio-item {
			background-color: #8dc63f;
			border-color: #8dc63f;
			color: #FFFFFF;
	
			&::before {
				border-color: #8dc63f transparent transparent;
			}
		}
	}
	.max-risk {
		// &::after {
		right: 8%;
	
		.tootio-item {
			background-color: #ffb347;
			border-color: #ffb347;
			color: #FFFFFF;
	
			&::before {
				border-color: #ffb347 transparent transparent;
			}
		}
	
		// align-content: ;: #ffb347;
		// }
	}
	
	.min-low {
		// &::after {
		left: 30rpx;
	
		.tootio-item {
			background-color: #00c2ff;
			border-color: #00c2ff;
			color: #FFFFFF;
	
			&::before {
				border-color: #00c2ff transparent transparent;
			}
		}
	
		// 	color: #00c2ff;
		// }
	}
	
	.loa-st {
		left: 240rpx;
	
		.tootio-item {
			background-color: #8dc63f;
			border-color: #8dc63f;
			color: #FFFFFF;
	
			&::before {
				border-color: #8dc63f transparent transparent;
			}
		}
	}
	
	.low,
	.risk {
		position: relative;
		background-color: rgb(0, 194, 255);
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
		border-right: 1px solid #ffffff;
	
		&::after {
			position: absolute;
			content: attr(num);
			right: -21px;
			bottom: -20px;
			color: #999999;
		}
	}
	
	.risk {
		border-radius: 0;
		border: none;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
		background-color: rgb(255, 179, 71);
	
		&::after {
			position: absolute;
			content: attr(num);
			left: -24px;
			bottom: -20px;
			color: #999999;
		}
	}
	
	.tipText {
		text-align: center;
		margin-top: 40upx;
		color: #888888;
	}
	
	
	.tootio-item {
		position: relative;
		width: 100%;
		height: 25px;
		border: 2px solid #3377aa;
		top: 0px;
		border-radius: 12rpx;
		color: #000000;
		font-size: 12px;
	
		&::before {
			position: absolute;
			content: '';
			width: 0;
			height: 0;
			border-width: 5px 5px;
			border-style: solid;
			border-color: #3377aa transparent transparent;
			bottom: -12px;
			left: 12px;
		}
	}
	
	.nubox {
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top:20upx;
	
		.number {
			font-size: 60upx;
			font-weight: bold;
			color: #e85350;
		}
	
		image {
			display: inline-block;
			width: 80upx;
			height: 80upx;
		}
	}
</style>
