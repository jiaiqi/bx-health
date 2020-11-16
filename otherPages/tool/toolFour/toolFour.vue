<template>
	<view class="wrap">
		<view class="box">
			<view class="cu-bar search bg-white">
				<view class="search-form round">
					<text class="cuIcon-search"></text>
					<input
						:adjust-position="false"
						v-model="searchValue"
						@keyup.enter="searchStart"
						@change="searchStart"
						type="text"
						:placeholder="'请输入食品搜索'"
						confirm-type="search"
					/>
				</view>
				<view class="action">
					<button v-if="serBtn" @click.stop="searchEnd" class="cu-btn bg-orange shadow-blur round">返回</button>
				</view>
			</view>
		</view>
		<view class="" v-if="isNormalStyle"> 
			<view class="title">搜索历史</view>
			<view class="tagBox">
				<view class="box" v-for="(item,index) in serlist"  @click="tagPage(item.title)">
					<text class="cu-tag" shape="circle" :text="item.title" type="info" ></text>
				</view>
			</view>
			<view class="title">大家都在搜</view>
			<view class="box-crad">
				<view class="crad" v-for="(item,index) in list" :key="index" @click="tagPage(item.title)">
					<image :src="item.img" mode="aspectFill"></image>
					<view class="text_box">
						<view class="h2">{{item.title}}</view>
						<view class="character">{{item.content}}</view>
					</view>
					<view class="btn">营养成分</view>
				</view>
			</view>
		</view>
		<view class="" v-else>
			<view class="title">搜索结果</view>
			<view class="">
				<view class="tagBox" v-if="selectAnswer.length">
					<view class="box" v-for="(item,index) in selectAnswer" >
						<text class="cu-tag" shape="circle" :text="item.name"  type="success" ></text>
					</view>
				</view>
				<view class="more" v-else>
					没有找到相关食物~
				</view>
			</view>
			<view class="" v-if="selectAnswer.length">
				<view class="title">营养价值</view>
				<view class="nutrition">
					<view class="card-decks">
						<image :src="imgThum" mode=""></image>
						<view class="contxox">
							<view class="tit">{{selectAnswer[0].name}}</view>
							<view class="units">{{selectAnswer[0].unit_energy}}大卡<text class="unt">/每100克</text></view>
						</view>
					</view>
				</view>
				<view class="listElements">
					<view class="tr">
						<view class="name">营养元素</view>
						<view class="unit">每100克</view>
						<view class="remake">备注</view>
					</view>
					<view class="td" v-for="(item,index) in  nutrient">
						<view class="name">{{item.name}}</view>
						<view class="unit">{{item.unit}}</view>
						<view class="remake">{{item.remake}}</view>
					</view>
					<view class="more" @click="more" v-if="ismore">
						查看更多营养素
					</view>
				</view>
			</view>
		</view>
	</view>
</template>
   
<script>
	export default{
		data(){
			return{
				nutrient:[
					{name:'热量',unit:'184千焦',remake:'热量低'},
					{name:'维生素A',unit:'1.3克',remake:''},
					{name:'蛋白质',unit:'0.4克',remake:'低'},
					{name:'维生素A',unit:'1.3克',remake:'高'},
					{name:'碳水化合物',unit:'133克',remake:'合适'},
				],
				serBtn:false,
				imgThum:'',
				ismore:true,
				isNormalStyle:true,
				searchValue:'',
				selectAnswer:[],
				serlist:uni.getStorageSync('food_recode')?uni.getStorageSync('food_recode'):[],
				list:[
					{
						img:'/otherPages/static/img/food1.jpg',
						title:'鱼肉',
						content:'每百克营养成分能量 489.175千卡 、维生素B60.02毫克、叶酸1.32微克、'
					},
					{
						img:'/otherPages/static/img/food3.jpg',
						title:'青菜',
						content:'青菜每100克含水分94.5克,蛋白质1.3克脂肪0.3克,碳水化合物2.3克,粗纤维0.6克,'
					},
					{
						img:'/otherPages/static/img/food2.jpg',
						title:'饺子',
						content:'饺子每百克营养成分能量 48459.175千卡 、维生素B60.02毫克、叶酸1.32微克、'
					},
					{
						img:'/otherPages/static/img/food4.jpg',
						title:'香蕉',
						content:'香蕉含有蛋白水解酶、单宁果胶和糖类等有机物，以及钙、钾、硒、锌、锗等,'
					},
				]
			}
		},
		methods:{
			tagPage(val){
				this.serBtn =true;
				this.selectDataOrgin(val)
			},
			searchEnd(){
				this.serBtn =false
				this.isNormalStyle =true
				this.searchValue=''
			},
			more(){
				let addList =[
					{name:'钙/ca',unit:'0.014克',remake:''},
					{name:'铁/fe',unit:'0.22克',remake:''},
					{name:'镁/mg',unit:'0.002克',remake:''},
				]
				this.nutrient =this.nutrient.concat(addList)
				this.ismore = false
			},
			searchStart(e){
				if(this.searchValue){this.serBtn =true;this.selectDataOrgin(this.searchValue)}
			},
			async selectDataOrgin(name){
				const url = this.getServiceUrl('health', 'srvhealth_diet_contents_select', 'select');
				let req = {
					serviceName: 'srvhealth_diet_contents_select',
					colNames: ['*'],
					condition: [{ colName: 'name', ruleType: 'in', value: name }],
				};
				const res = await this.$http.post(url, req);
				let dataItem = res.data.data
				this.isNormalStyle=false
				this.selectAnswer =dataItem
				if(!Array.isArray(res.data.data)||res.data.data.length===0){
					return
				}
				let searchItem = {title:dataItem[0].name}
				let is_repetition = false
				if(this.serlist.length < 10){
					if(this.serlist.length>0){
						this.serlist.forEach(item=>{
							if(item.title === dataItem[0].name){
								is_repetition = true
							}
						})
					}
					if(!is_repetition){
						this.serlist.push(searchItem)
					}
					
				}
				uni.setStorageSync('food_recode',this.serlist)
				// if(){
					this.nutrient[0].unit = dataItem[0].unit_energy+'千焦'
				// }
				this.getFilePath( dataItem[0].image).then(business_img=>{
					this.imgThum  = this.$api.getFilePath + business_img[0].fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket') + '&thumbnailType=fwsu_100';
				})
			}
		},
		computed:{
		
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		min-height: 100vh;
		overflow: hidden;
		.title{
			font-weight: bold;
			font-size: 28upx;
			padding:20upx 26upx 0 26upx;
		}
		.tagBox{
			display: flex;
			margin: 20upx ;
			flex-wrap: wrap;
			.box{
				margin: 8upx 10upx;
			}
		}
		.detail{
			margin: 20upx ;
		}
		.box-crad{
			display: flex;
			flex-wrap: wrap;
			margin: 26upx ;
			.crad{
				display: inline-block;
				width: 48%;
				margin-bottom: 4%;
				background: #FFF;
				border-radius: 20upx;
				image{
					height: 230upx !important;
					border-top-left-radius:20upx ;
					border-top-right-radius:20upx ;
				}
			}
		}
	}
	.box-crad>.crad:nth-child(odd){
		margin-right: 4%;
	}
	.text_box{
		padding: 10upx 18upx;
		padding-bottom: 25upx;
		.h2{
			font-weight: bold;
			font-size: 36upx;
			padding-bottom: 10upx;
		}
		.character{
			color: #8c8c8c;
			font-weight: 600;
			height: 64upx;
			font-size: 24upx;
			overflow: hidden;
		    text-overflow: ellipsis;
		    display: -webkit-box;
		    -webkit-line-clamp: 2;
		    -webkit-box-orient: vertical;
		}
	}
	.btn{
		height: 65upx;
		width: 86%;
		background: linear-gradient(to right, #65bba7, #8fd6a5);
		color: #ffffff;
		text-align: center;
		line-height: 65upx;
		border-radius: 30px;
		margin: 0 auto;
		margin-bottom: 25upx;
	}
	.more{
		color: #888;
		text-align: center;
		margin-top: 20upx;
		width: 100%;
	}
	.listElements{
		padding: 30upx;
		box-shadow: 1px 1px 16px 0px #cacaca;;
		margin: 26upx ;
		
		.name{
			width: 70px;
		}
		.unit{
			width: 60px;
		}
		.remake{
			width:  60px;
			text-align: end;
		}
		.tr,.td{
			display: flex;
			justify-content: space-between;
			border-bottom: 1px solid #d6d6d6;
			line-height: 80upx;
		}
		.tr{
			color: #888888;
			font-size: 28upx;
		}
	}
	.nutrition{
		.card-decks{
			display: flex;
			align-items: center;
			padding: 30upx;
			box-shadow: 1px 1px 16px 0px #cacaca;;
			margin: 26upx ;
			image{
				width: 90upx;
				height: 90upx;
				border-radius: 50%;
				margin-right: 20upx;
			}
			.contxox{
				.tit{
					
				}
				.units{
					font-size: 34upx;
					font-weight: 600;
				}
				.unt{
					color: #888888;
					font-size: 26upx;
					font-weight: normal;
				}
			}
		}
	}
</style>