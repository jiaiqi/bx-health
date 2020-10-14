<template>
	<view class="foods-detail-wrap">
		<view class="foods-detai-title">
			<text>营养元素</text>
			<text>每100克</text>
		</view>
		<view class="foods-detai-main">
			<view :class="filterArr.indexOf(item.key) != -1?'filtration':''" v-for="(item,index) in restArr" :key="index" class="foods-detai-main-item">
				<text>{{item.name}}</text>
				<text>{{foodItem[item.key]}}{{item.unit}}</text>
			</view>
			<!-- <view class="foods-detai-main-item">
				<text>蛋白质</text>
				<text>{{foodItem.protein}}克</text>
			</view>
			<view class="foods-detai-main-item">
				<text>脂肪</text>
				<text>{{foodItem.axunge}}克</text>
			</view>
			<view class="foods-detai-main-item">
				<text>碳水化合物</text>
				<text>{{foodItem.carbohydrate}}克</text>
			</view>
			<view class="foods-detai-main-item">
				<text>硫胺素</text>
				<text>{{foodItem.thiamine}}毫克</text>
			</view>
			<view class="foods-detai-main-item">
				<text>核黄素</text>
				<text>{{foodItem.riboflavin}}毫克</text>
			</view>
			<view class="foods-detai-main-item">
				<text>烟酸</text>
				<text>{{foodItem.niacin}}毫克</text>
			</view> -->
		</view>
		<view class="foods-detai-foot">
			<view class="foods-detai-foot-top">
				<text>维生素</text>
			</view>
			<view class="foods-detai-foot-b">
				<view :class="filterArr.indexOf(vt.key) != -1?'filtration':''" v-for="(vt,v) in vitaminArr" :key="v" class="foods-detai-foot-b-item">
					<text>{{vt.name}}</text>
					<text>{{foodItem[vt.key]}}{{vt.unit}}</text>
				</view>
				<!-- <view class="foods-detai-foot-b-item">
					<text>VC</text>
					<text>{{foodItem.vitamin_c}}毫克</text>
				</view>	 -->			
			</view>
		</view>
		<view class="foods-detai-foot">
			<view class="foods-detai-foot-top">
				<text>矿物质</text>
			</view>
			<view class="foods-detai-foot-b">
				<view :class="filterArr.indexOf(el.key) != -1?'filtration':''" v-for="(el,l) in mineralArr" :key="l" class="foods-detai-foot-b-item">
					<text>{{el.name}}</text>
					<text>{{foodItem[el.key]}}{{el.unit}}</text>
				</view>
				<!-- <view class="foods-detai-foot-b-item">
					<text>镁</text>
					<text>{{foodItem.element_m}}毫克</text>
				</view>
				<view class="foods-detai-foot-b-item">
					<text>钾</text>
					<text>{{foodItem.element_k}}毫克</text>
				</view>	 -->			
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:"foodDetail",
		data(){
			return {
				foodItem:'',
				filterArr:'',
				restArr:[{
					name:'热量',
					key:'unit_energy',
					unit:'千卡'
				},{
					name:'蛋白质',
					key:'protein',
					unit:'克'
				},{
					name:'脂肪',
					key:'axunge',
					unit:'克'
				},{
					name:'碳水化合物',
					key:'carbohydrate',
					unit:'克'
				},{
					name:'硫胺素',
					key:'thiamine',
					unit:'毫克'
				},{
					name:'核黄素',
					key:'riboflavin',
					unit:'毫克'
				},{
					name:'烟酸',
					key:'niacin',
					unit:'毫克'
				}],
				vitaminArr:[{
					name:'VA',
					key:'vitamin_a',
					unit:'微克'
				},{
					name:'VC',
					key:'vitamin_c',
					unit:'毫克'
				}],
				mineralArr:[{
					name:'钙',
					key:'element_c',
					unit:'毫克'
				},{
					name:'镁',
					key:'element_m',
					unit:'毫克'
				},{
					name:'钾',
					key:'element_k',
					unit:'毫克'
				}]
			}
		},
		onLoad(option) {
			this.foodItem = JSON.parse(decodeURIComponent(option.foods))
			this.filterArr = JSON.parse(decodeURIComponent(option.filters))
			console.log("options--",option)
		}
	}
</script>

<style lang="scss" scoped>
	.foods-detail-wrap{
		min-height: 100vh;
		.foods-detai-title{
			width: 100%;
			background-color: #f9f9f9;
			height: 90upx;
			color: #989898;
			display: flex;
			align-items: center;
			justify-content: space-around;
		}
		.foods-detai-main{
			// height: calc(100vh - 90upx);
			background-color: white;
			display: flex;
			flex-direction: column;
			// justify-content: center;
			align-items: center;
			.foods-detai-main-item{
				display: flex;
				justify-content: space-around;
				align-content: center;
				width: 95%;
				height: 90upx;
				border-bottom: 1px solid #eeeeee;
				color: #696969;
				text{
					width: 50%;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				&:last-child{
					border-bottom: none;
				}
			}
			.filtration{
				text{
					color: red;
				}
			}
		}
		.foods-detai-foot{
			background-color: white;
			.foods-detai-foot-top{
				font-size: 18px;
				font-weight: 700;
				color: #393a59;
				padding: 30upx;
				
			}
			.foods-detai-foot-b{
				width: 95%;
				display: flex;
				flex-direction: column;
				// justify-content: space-around;
				// align-items: center;
				margin: 0 auto;
				.foods-detai-foot-b-item{
					display: flex;
					justify-content: space-around;
					align-content: center;
					width: 100%;
					height: 90upx;
					border-bottom: 1px solid #eeeeee;
					color: #696969;
					text{
						display: flex;
						align-items: center;
					}
					&:last-child{
						border-bottom: none;
					}
				}
			}
		}
	}
	.filtration{
		color: red!important;
	}
</style>
