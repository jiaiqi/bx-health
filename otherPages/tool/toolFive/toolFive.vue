<template>
	<view class="wrap">
		<view class="swiper">
			<view class="swiper-box">
				<swiper autoplay="true">
					<swiper-item
						v-for="(item, index) in carouselList"
						@tap="indexTopToDetailPage(item)"
						:key="index"
					>
						<view class="swiper-item">
							<image :src="item.cover" mode="aspectFill" />
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!--  -->
		<view class="title">人体七大营养素</view>
		<view class="tagBox">
			<view class="box" v-for="(item,index) in serlist" @click="tagPage(item,index)">
				<text class="cu-tag"  :text="item.title"  shape="square" mode="dark" :type="item.status" ></text>
			</view>
		</view>
		<view class="contentDetail">
			<image :src="clickitem.image" mode=""></image>
			<view class="conBox">
				<view class="con">{{clickitem.content}}</view>
			</view>
			<view class="tag">
				<view class="name">
					<view class="">{{clickitem.title}}</view>
					<text class="cuIcon-tagfill" color="#2979ff" size="28"></text>
					<!-- <u-icon name="tags-fill" color="#2979ff" size="28"></u-icon> -->
				</view>
				<view class="tags" v-for="(item,index) in clickitem.tags">
					<text class="cu-tag circle" >{{item.title}}</text>
					<!-- <u-tag :text="item.title"  shape="circle" size="mini" mode="dark" :type="item.color" /> -->
				</view>
			</view>
		</view>
	
		<!-- <web-view :webview-styles="webviewStyles" src="https://baike.baidu.com/item/%E8%9B%8B%E7%99%BD%E8%B4%A8?timestamp=1599806887423"></web-view> -->
	</view>
</template>
   
<script>
	export default{
		data(){
			return{
				clickitem:{},
				carouselList:[
					{
						cover:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=650076368,2206845723&fm=26&gp=0.jpg'
					}
				],
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				serlist:[
					{
						title:'碳水化合物（糖类）',
						status:'primary',
						image:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1970403413,460840043&fm=26&gp=0.jpg',
						content:'它可以为人体提供热能。食物中的碳水化合物分成两类：人可以吸收利用的有效碳水化合物和人不能消化的无效碳水化合物。 [4]  糖类化合物是一切生物体维持生命活动所需能量的主要来源。',
						tags:[
							{
								title:'能量来源',
								color:'error'
							},
							{
								title:'营养物质',
								color:'info'
							},
							
						]
					},
					{
						title:'脂类',
						status:'primary',
						image:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=521923953,2917369608&fm=26&gp=0.jpg',
						content:'它可以为人体提供热能。食物中的碳水化合物分成两类：人可以吸收利用的有效碳水化合物和人不能消化的无效碳水化合物。 [4]  糖类化合物是一切生物体维持生命活动所需能量的主要来源。',
						tags:[
							{
								title:'必不可少',
								color:'success'
							},
							{
								title:'营养物质',
								color:'info'
							}
						]
					},
					{
						title:'蛋白质',
						status:'primary',
						image:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1505333279,599132863&fm=26&gp=0.jpg',
						content:'它可以为人体提供热能。食物中的碳水化合物分成两类：人可以吸收利用的有效碳水化合物和人不能消化的无效碳水化合物。 [4]  糖类化合物是一切生物体维持生命活动所需能量的主要来源。',
						tags:[
							{
								title:'种繁多',
								color:'info'
							},
							{
								title:'重要成分',
								color:'primary'
							}
						]
					},
					{
						title:'维生素',
						status:'primary',
						image:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=1643280403,3539440042&fm=26&gp=0.jpg',
						content:'它可以为人体提供热能。食物中的碳水化合物分成两类：人可以吸收利用的有效碳水化合物和人不能消化的无效碳水化合物。 [4]  糖类化合物是一切生物体维持生命活动所需能量的主要来源。',
						tags:[
							{
								title:'必不可少',
								color:'success'
							},
							{
								title:'营养物质',
								color:'info'
							}
						]
					},
					{
						title:'矿物质',
						status:'primary',
						image:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1099216095,2504844975&fm=26&gp=0.jpg',
						content:'它可以为人体提供热能。食物中的碳水化合物分成两类：人可以吸收利用的有效碳水化合物和人不能消化的无效碳水化合物。 [4]  糖类化合物是一切生物体维持生命活动所需能量的主要来源。',
						tags:[
							{
								title:'必不可少',
								color:'success'
							},
							{
								title:'营养物质',
								color:'info'
							}
						]
					},
					{
					    title:'水',
						status:'primary',
						image:'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1432825228,3083906508&fm=26&gp=0.jpg',
						content:'它可以为人体提供热能。食物中的碳水化合物分成两类：人可以吸收利用的有效碳水化合物和人不能消化的无效碳水化合物。 [4]  糖类化合物是一切生物体维持生命活动所需能量的主要来源。',
						tags:[
							{
								title:'必不可少',
								color:'success'
							},
							{
								title:'营养物质',
								color:'info'
							}
						]
					},
					{
						title:'膳食纤维',
						status:'primary',
						image:'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=325999286,354957245&fm=26&gp=0.jpg',
						content:'它可以为人体提供热能。食物中的碳水化合物分成两类：人可以吸收利用的有效碳水化合物和人不能消化的无效碳水化合物。 [4]  糖类化合物是一切生物体维持生命活动所需能量的主要来源。',
						tags:[
							{
								title:'必不可少',
								color:'success'
							},
							{
								title:'营养物质',
								color:'info'
							}
						]
					},
				],
			}
		},
		onLoad() {
			this.clickitem=this.serlist[0]
			this.$set(this.serlist[0],'status','success')
		},
		methods:{
			tagPage(val,index){
				console.log(val.status)
				this.serlist.map((item,idx)=>{
					if(index==idx){
						this.$set(item,'status','success')
					}else{
						this.$set(item,'status','primary')
					}
				})
				this.clickitem = val
			}
		}
	}
</script>

<style lang="scss" scoped>
	.wrap{
		background-color: #fff;
		min-height: 100vh;
		overflow: hidden;
		.contentDetail{
			box-shadow: 1px 1px 16px 0px #cacaca;;
			margin: 26upx ;
			padding: 30upx;
			image{
				width: 100%;
				height: 450upx;
			}
			.conBox{
				.con{
					font-size: 13px;
					color: #888;
					line-height: 44upx;
				}
			}
			.tag{
				display: flex;
				align-items: center;
				margin-top:20upx;
				justify-content: flex-end;
				.name{
					display: flex;
					align-items: center;
					margin-right: 20upx;
				}
				.tags>*{
					margin-right: 20upx;
				}
			}
			
		}
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
	}
	.swiper {
		margin-top: 30upx;
		width: 100%;
		margin-bottom: 20upx;
		display: flex;
		justify-content: center;
		.swiper-box {
			width: 96%;
			height: 40vw;
			overflow: hidden;
			border-radius: 15upx;
			box-shadow: 0upx 8upx 25upx rgba(0, 0, 0, 0.2);
			position: relative;
			z-index: 1;
			swiper {
				width: 100%;
				height: 40vw;
				swiper-item {
					image {
						width: 100%;
						height: 40vw;
					}
				}
			}
		}
	}
</style>