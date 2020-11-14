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
						:placeholder="'请输入运动搜索'"
						confirm-type="search"
					/>
				</view>
				<view class="action">
					<button v-if="serBtn" @click.stop="searchEnd" class="cu-btn bg-orange shadow-blur round">取消</button>
				</view>
			</view>
		</view>
		<view class="" v-if="isNormalStyle"> 
			<view class="title">搜索历史</view>
			<view class="tagBox">
				<view class="box" v-for="(item,index) in serlist" @click="tagPage(item.title)">
					<text class="cu-tag" shape="circle" :text="item.title" type="info" ></text>
				</view>
			</view>
			<view class=" illustration">
				<image src="/otherPages/static/img/sport.jpg" mode=""></image>
			</view>
			<view class="sportbox">
				<view class="title">热量消耗排行榜</view><image :src="icon" mode=""></image>
			</view>
			<view class="box-crad">
				<view class="linebox" v-for="(item,index) in list">
					<view class="index" :style="{color:(index+1)<4?'#e85350':'#888'}"> {{index+1}}</view>
					<view class="box">
						<view class="titles">{{item.title}}</view>
						<view class="cont">{{item.content}}</view>
					</view>
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
							<view class="units">{{selectAnswer[0].unit_energy}}大卡<text class="unt">/每{{selectAnswer[0].unit}}</text></view>
						</view>
					</view>
				</view>
				<view class="sport-main">
					<view class="spor-main-top">
						<text>热量</text>
						<text>千卡</text>
					</view>
					<view class="spor-main-cen">
						<view class="mian-num-top">
							<text>{{selectAnswer[0].unit_energy}}</text>
							<text>千卡</text>
						</view>
						<view class="main-num-bot">
							每{{selectAnswer[0].unit}}消耗热量
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
		</view>
	</view>
</template>
   
<script>
	export default{
		data(){
			return{
				icon:require('@/otherPages/static/img/icon-burn.png'),
				nutrient:[
					{name:'热量',unit:'184千焦',remake:'热量低'},
					{name:'维生素A',unit:'1.3克',remake:''},
					{name:'蛋白质',unit:'0.4克',remake:'低'},
					{name:'维生素A',unit:'1.3克',remake:'高'},
					{name:'碳水化合物',unit:'133克',remake:'合适'},
				],
				list:[
					{
						title:'爬坡快走',
						content:'30分钟可消耗热量320千卡，1小时达650千卡。'
					},
					{
						title:'慢跑',
						content:'30分钟可以消耗295千卡热量，1小时消耗的热量则达到590千卡。'
					},
					{
						title:'自由泳',
						content:'以自由泳为例，30分钟消耗255千卡热量，1小时为510千卡'
					},
					{
						title:'打篮球',
						content:'打30分钟篮球可以消耗220千卡热量，1小时可消耗440千卡。'
					},
					{
						title:'跳舞',
						content:'跳30分钟消耗热量为165千卡，1小时为330千卡。'
					},
					{
						title:'家务',
						content:'30分钟家务，如种花、除草等可消耗165千卡热量，1小时为330千卡。'
					}
				],
				serBtn:false,
				imgThum:'',
				ismore:true,
				isNormalStyle:true,
				searchValue:'',
				selectAnswer:[],
				serlist:uni.getStorageSync('sport_recode')?uni.getStorageSync('sport_recode'):[]
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
				const url = this.getServiceUrl('health', 'srvhealth_body_activity_contents_select', 'select');
				let req = {
					serviceName: 'srvhealth_body_activity_contents_select',
					colNames: ['*'],
					condition: [{ colName: 'name', ruleType: 'in', value: name }],
				};
				const res = await this.$http.post(url, req);
				let dataItem = res.data.data
				this.isNormalStyle=false
				this.selectAnswer =dataItem
				
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
				uni.setStorageSync('sport_recode',this.serlist)
				// if(){
					// this.nutrient[0].unit = dataItem[0].unit_energy+'千焦'
				// }
				if(dataItem.length > 0){
					this.getFilePath( dataItem[0].image).then(business_img=>{
						this.imgThum  = this.$api.getFilePath + business_img[0].fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket') + '&thumbnailType=fwsu_100';
						this.$set(dataItem[0],'imgurl',this.imgThum)
						// uni.navigateTo({
						// 	url:'/pages/sportsDetail/sportsDetail?sport=' + encodeURIComponent(JSON.stringify(dataItem[0]))
						// })
					})
				}
				
				
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
		background-color: #FFF;
		.title{
			font-weight: bold;
			font-size: 28upx;
			padding-left: 26upx;
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
			.linebox{
				display: flex;
				align-items: center;
				margin-bottom: 32upx;
				.index{
					font-size: 34upx;
					font-weight: bold;
					color: #e85350;
					margin-right:20upx ;
				}
				.box{
					.titles{
						font-weight: bold;
						font-size: 28upx;
					}
					.cont{
						color: #888;
						font-size: 24upx;
						width: 88vw;
						overflow:hidden;
						text-overflow:ellipsis;
						white-space:nowrap
					}
				}
			}
		}
	}
	
	.illustration{
		image{
			width: 100%;
			height: 150upx;
			border-radius: 20upx;
		}
		margin: 26upx;
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
	.sportbox{
		display: flex;
		align-items: center;
		image{
			width: 40upx;
			height: 40upx;
		}
	}
	.sport-main{
		width: 90%;
		margin: 0 auto;
		background: white;
		padding: 20px;
		border-radius: 15px;
		margin-top: 45px;
		box-shadow: 1px 1px 16px 0px #cacaca;
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
			position: relative;
		}
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
	.pro-rad {
		overflow: inherit;
		height: 10px;
		background-color: transparent;
	}
	
</style>