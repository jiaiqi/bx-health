<template>
	<view class="antenatal-wrap">
		<view class="antenatal-top">
			<view class="antenatal-top-t">
				<text>出现时间</text>
			</view>
			<view class="antenatal-top-m">
				<text>孕第3周</text>
			</view>
		</view>
		<view class="antenatal-cen">
			<view class="antenatal-cen-item">
				<view class="antenatal-cen-item-t">
					<text>症状、现象</text>
				</view>
				<view class="antenatal-cen-item-b">
					<text>乳房胀痛、容易倦怠；阴部少量或点状出血</text>
				</view>
			</view>	
			<view class="antenatal-cen-item">
				<view class="antenatal-cen-item-t">
					<text>原因</text>
				</view>
				<view class="antenatal-cen-item-b">
					<text>受精卵着床</text>
				</view>
			</view>	
			<view class="antenatal-cen-item">
				<view class="antenatal-cen-item-t">
					<text>是否正常</text>
				</view>
				<view class="antenatal-cen-item-b">
					<text>是</text>
				</view>
			</view>	
			<view class="antenatal-cen-item">
				<view class="antenatal-cen-item-t">
					<text>应对措施</text>
				</view>
				<view class="antenatal-cen-item-b">
					<text>正常情况出血少且时间短；如不是请立即就医</text>
				</view>
			</view>	
		</view>
	</view>
</template>

<script>
</script>

<style lang="scss" scoped>
	.antenatal-wrap{
		background-color: white;
		min-height: 100vh;
		.antenatal-top{
			.antenatal-top-t{
				padding: 30upx;
				font-size: 36upx;
				font-weight: 600;
			}
			.antenatal-top-m{
				padding-left: 40upx;
				color: #ccc;
				font-size: 32upx;
			}
		}
		.antenatal-cen{
			.antenatal-cen-item{
				margin-top: 30upx;
				padding: 0 30upx;
				.antenatal-cen-item-t{
					font-size: 36upx;
					font-weight: 700;
					margin-bottom: 20upx;
				}
				.antenatal-cen-item-b{
					
				}
			}
		}
	}
</style>
