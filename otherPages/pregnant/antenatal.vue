<template>
	<view class="antenatal-wrap">
		<view class="antenatal-top">
			<view class="antenatal-top-t">
				<text>产检时间</text>
			</view>
			<view class="antenatal-top-m">
				<text>孕12周</text>
			</view>
		</view>
		<view class="antenatal-cen">
			<view class="antenatal-cen-top">
				产检项目
			</view>
			<view class="antenatal-cen-main">
				<view class="antenatal-cen-main-item">
					<text>建档。</text>
					<text>建立母子健康档案意味着各次产检都会在 这家医院进行，宝宝也会在这里出生。一般来说 建档主要为了确定孕周、推算预产期、评估妊娠 风险等。</text>
				</view>
				<view class="antenatal-cen-main-item">
					<text>NT检查。</text>
					<text>即通过B超检查胎儿是否健康。孕12周 左右宝宝脖子后面会有一层透明带，染色体正常 的宝宝透明带厚度小于2.5毫米，所以NT检查又 叫胎儿颈后透明带检查。</text>
				</view>
				<view class="antenatal-cen-main-item">
					<text>身高、体重。</text>
					<text>根据孕前的体重和身高计算：BMI= 体重（KG ) /身高的平方（M )，医生会根据计 算出来的值判断整个孕期体重增加多少合适，并 给予建议。</text>
				</view>
				<view class="antenatal-cen-main-item">
					<text>手检。</text>
					<text>医生会对准妈妈的甲状腺、乳房、骨盆、 子宫大小进行检查，以判断宝宝生长的〃环境”是 否健康，评估准妈妈的妊娠风险。</text>
				</view>
				<view class="antenatal-cen-main-item">
					<text>宫高、腹围。</text>
					<text>通过检查宫高和腹围这两项数据可 以估算宝宝的体重和大小，评估宝宝的健康状况。</text>
				</view>
			</view>
		</view>
		<view class="antenatal-bot ">
			<button class="cu-btn bg-green lg">已进行</button>
			<button class="cu-btn bg-red margin-tb-sm lg">未进行</button>
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
				padding: 15px;
				font-size: 18px;
				font-weight: 600;
			}
			.antenatal-top-m{
				padding-left: 20px;
				color: #ccc;
				font-size: 16px;
			}
		}
		.antenatal-cen{
			.antenatal-cen-top{
				font-size: 18px;
				font-weight: 600;
				margin: 15px;
			}
			.antenatal-cen-main{
				.antenatal-cen-main-item{
					margin: 10px 20px;
					line-height: 25px;
					text{
						&:first-child{
							font-weight: 700;
							font-size: 16px;
						}
					}
				}
			}
		}
		.antenatal-bot{
			display: flex;
			justify-content: space-around;
			align-items: center;
			margin-top: 50upx;
		}
	}
</style>
