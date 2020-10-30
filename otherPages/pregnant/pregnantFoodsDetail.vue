<template>
	<view class="foods-detail-wrap">
		<view class="foods-detail-top">
			<image src="/otherPages/static/img/ym.jpg" mode=""></image>
		</view>
		<view class="foods-detail-cen">
			<view class="foods-detail-cen-item">
				<view class="foods-detail-cen-item-t">
					<text>时间</text>
				</view>
				<view class="foods-detail-cen-item-b">
					<text>备孕至整个孕期</text>
				</view>
			</view>
			<view class="foods-detail-cen-item">
				<view class="foods-detail-cen-item-t">
					<text>原因</text>
				</view>
				<view class="foods-detail-cen-item-b">
					<text>烟草和烟雾中含有大量的有毒物质，除了人们知道的尼古丁外，还有氢氰酸、一氧化碳、二氧化碳、芳香族化合物和焦油等，这些物质可随着烟雾主动或被动吸入孕妇的体内，使母体血液和胎盘循环中氧含量降低，导致胎儿缺氧，从
而影响胎儿的生长发育。烟雾中的尼古丁可使子宫和胎盘的小血管收缩，从而导致胎儿缺氧，引起流产、死胎等。烟雾中的氰化物可导致胎儿大脑和心脏发育不全，以及腭裂、唇裂、智力低下等先天缺陷。烟草、酒精对胚胎发育的各个阶段
都有明显的毒性作用，容易引起流产、早产和胎儿畸形。有吸烟、饮酒习惯的妇；
酒精饮料过度地摄入酒精会导致血液中雄激素睾酮的数量减少。酒精严重影响精子和卵子的质量。</text>
				</view>
			</view>
			<view v-if="type!=='recommend'" class="foods-detail-cen-item">
				<view class="foods-detail-cen-item-t">
					<text>导致得风险</text>
				</view>
				<view class="foods-detail-cen-item-b">
					<text>酒精严重影响精子和卵子的质量</text>
				</view>
			</view>
			<view v-if="type==='recommend'" class="foods-detail-cen-item">
				<view class="foods-detail-cen-item-t">
					<text>食用的好处</text>
				</view>
				<view class="foods-detail-cen-item-b">
					<text>有助孕功效。富含多种矿物质，有助于备孕女性提高免疫力，增强身体素质，易于受孕。</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'pregnantFoods',
		data(){
			return {
				currFood:'',
				type:''
			}
		},
		methods:{
		},
		onLoad(option) {
			this.type = option.type
			this.currFood = JSON.parse(decodeURIComponent(option.currFood))
		}
	}
</script>

<style lang="scss" scoped>
	.foods-detail-wrap{
		min-height: 100vh;
		background-color: white;
		.foods-detail-top{
			width: 100%;
			height: 450upx;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.foods-detail-cen{
			padding: 0 30upx 30upx;
			.foods-detail-cen-item{
				margin-top: 30upx;
				.foods-detail-cen-item-t{
					margin-bottom: 20upx;
					text{
						font-size: 36upx;
						font-weight: 700;
					}
				}
				.foods-detail-cen-item-b{
					line-height: 48upx;
				}
			}
		}
	}
</style>
