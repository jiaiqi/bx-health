<template>
	<view class="pregnant-foods-wrap">
		<view class="foods-item-wrap">
			<view @click="toDetail(item)" v-for="(item,index) in foodsData" :key="index" class="foods-item">
				<view class="foods-item-left">
					<image src="/pregnancy/static/img/ym.jpg" mode=""></image>
				</view>
				<view class="foods-item-right">
					<view class="foods-item-right-t">
						<text>{{item.name}}</text>
					</view>
					<view v-if="type==='recommend'" class="foods-item-right-b">
						<u-icon size="36" color="#67deb4" name="checkmark-circle-fill"></u-icon>
						<text>可以食用</text>
					</view>
					<view v-if="type==='prudent'" class="foods-item-right-b">
						<u-icon size="36" color="#ffd37c" name="error-circle-fill"></u-icon>
						<text>谨慎食用</text>
					</view>
					<view v-if="type==='forbid'" class="foods-item-right-b">
						<u-icon size="36" color="#ff92a6" name="close-circle-fill"></u-icon>
						<text>禁止食用</text>
					</view>
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
				type:'',
				foodsData:[{
					name:'核桃仁',
					cause:'有助孕功效。含有大量磷脂、脂肪油、蛋白质、亚油酸、赖氨酸、亚麻酸对大脑及机体代谢有很大作用；含有胡萝卜素、维生素A、B、C、E、磷、钙等。含有大量易被人体吸收的脂肪和蛋白质，有对人体极为重要的赖氨酸，丰富的磷脂，这些对大脑神经的更新极为有益。核桃仁中的磷、镁、钙、铁、锰等多种矿物质，有助于备孕女性提高免疫力，增强身体素质，易于受孕。',
					benefit:'有助孕功效。富含多种矿物质，有助于备孕女性提高免疫力，增强身体素质，易于受孕。'
				},{
					name:'黄豆芽',
					cause:'含有蛋白质及矿物质磷、铁、维生素A、C及碳水化合物，营养丰富，滋味鲜美，适合做汤。',
					benefit:'增加血管壁的弹性，纺织生产出血；纤维素能防止便秘发作；蛋白质是生长组织细胞的主要原料，能修复生孩子室损伤的组织。'
					
				},{
					name:'海带',
					cause:'含有大量的碘和铁',
					benefit:'碘是制造甲状腺素的主要原料；铁是制造血细胞的主要原料。'
					
				},{
					name:'紫菜',
					cause:'含有丰富的膳食纤维、多种维生素、微量元素如：维生素A，维生素B，纤维素，矿物质维生素C，磷脂，碘的含量很高。营养价值和药用价值都很高。',
					benefit:'有助于排除身体的废物和毒素；预防大肠癌；抗氧化，提高免疫力；防癌，抗癌；软化血管；丰富的胆碱，对保护大脑和提高记忆力很有好处。'
					
				}]
			}
		},
		methods:{
			toDetail(item){
				uni.navigateTo({
					url:'/pregnancy/pregnant/pregnantFoodsDetail?currFood=' + encodeURIComponent(JSON.stringify(item)) + '&type=' + this.type
				})
			}
		},
		onLoad(option) {
			this.type = option.type
			if(option.type === 'prudent'){
				this.foodsData = [{
					name:'荔枝',
					cause:'荔枝含有丰富的糖分，患有妊娠糖尿病的孕妈妈要禁止食用。',
					risk:'大量食用荔枝还会出现头晕、恶心、心慌等荔枝中毒现象。'
				},{
					name:'山楂',
					cause:'山楂酸甜可口，是很多孕妈妈喜欢吃的水果。但是，山楂对子宫有一定的兴奋作用，可促使子宫收缩，增加流产的风险。',
					risk:'有一定的兴奋作用，可促使子宫收缩，增加流产的风险'
				},{
					name:'芒果',
					cause:'芒果是少数富含蛋白质的水果，多吃易饱。但是芒果中也含有容易致敏的成分，因此过敏体质的孕妇要尽量少吃芒果。',
					risk:'芒果中也含有容易致敏的成分，因此过敏体质的孕妇要尽量少吃芒果'
				},{
					name:'木瓜',
					cause:'本瓜中含有的木瓜苷有增加子宫收缩的作用，为了避免流产、早产，孕妈妈还是尽量不要食用木瓜。',
					risk:'木瓜苷有增加子宫收缩的作用，为了避免流产、早产，孕妈妈还是尽量不要食用木瓜'
				}]
			}
		}
	}
</script>

<style lang="scss" scoped>
	.pregnant-foods-wrap{
		height: 100vh;
		background-color: #fff;
		.foods-item-wrap{
			.foods-item{
				display: flex;
				padding: 10upx 20upx;
				border-bottom: 1px solid #f8f8f8;
				.foods-item-left{
					width: 130upx;
					height: 130upx;					
					image{
						width: 100%;
						height: 100%;
					}
				}
				.foods-item-right{
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					margin-left: 20upx;
					.foods-item-right-t{
						font-weight: 700;
						font-size: 30upx;
					}
					.foods-item-right-b{
						display: flex;
						align-items: center;
						text{
							margin-left: 5upx;
						}
					}
				}
			}
		}
	}
</style>
