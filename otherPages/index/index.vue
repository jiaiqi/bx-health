<template>
	<view class="index-wrap">
		<!-- 轮播图1 -->
		<view class="header">
			<view class="title" >首页</view>
			<view class="content">健康多一点，生活妙无限</view>
		</view>
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
		
		
		<view class="cu-list grid col-4 no-border" >
			<view class="cu-item" v-for="(item,index) in cuIconList" :key="index" @click="toolPage(item)" v-if="index<gridCol*2">
				<view :class="['cuIcon-' + item.cuIcon,'text-' + item.color]">
				</view>
				<text>{{item.name}}</text>
			</view>
		</view>
		
		
		<view class="hot-recommend">
			<view class="left">
				<image class="hot-recommend-image"  :src="hotRecommendList[0].icon"></image>
			</view>
			<view class="right">
				<image class="hot-recommend-image"  :src="hotRecommendList[1].icon"></image>
				<image class="hot-recommend-image"  :src="hotRecommendList[2].icon"></image>
			</view>
		</view>
	</view>
</template>

<script>

	export default {
		components: {
		},
		data() {
			return {
				gridCol: 4,
				carouselList:[
					{
						cover:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2167288005,2510652821&fm=26&gp=0.jpg'
					},
					{
						cover:"https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2084283987,1818207420&fm=26&gp=0.jpg"
					},
					{
						cover:"https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=623299958,1073163637&fm=26&gp=0.jpg"
					},
				],
				hotRecommendList:[
					{
						icon:'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1599735079942&di=27a1a6d7f9fc7004d8547103a661e7c7&imgtype=0&src=http%3A%2F%2Fimage31.bookschina.com%2F2010%2F20100906%2F4838287.jpg'
					},
					{
						icon:'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3695464703,4082528458&fm=15&gp=0.jpg'
					},
					{
						icon:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2335547108,1124613662&fm=26&gp=0.jpg'
					}
				],
				cuIconList: [{
					cuIcon: 'cardboardfill',
					color: 'red',
					badge: 0,
					name: '消耗卡路里计算',
					href:'/pages/tool/toolOne/toolOne'
				}, {
					cuIcon: 'recordfill',
					color: 'orange',
					badge: 0,
					name: '婴儿发育查询',
					href:'/pages/tool/toolThree/toolThree'
				}, {
					cuIcon: 'picfill',
					color: 'yellow',
					badge: 0,
					name: 'BMI 身体质量指数计算',
					href:'/pages/tool/toolTwo/toolTwo'
				}, {
					cuIcon: 'noticefill',
					color: 'olive',
					badge: 0,
					name: '营养素介绍',
					href:'/pages/tool/toolFive/toolFive'
				}, {
					cuIcon: 'upstagefill',
					color: 'cyan',
					badge: 0,
					name: '食品查询',
					href:'/pages/tool/toolFour/toolFour'
				}, {
					cuIcon: 'clothesfill',
					color: 'blue',
					badge: 0,
					name: '运动查询',
					href:'/pages/tool/toolSix/toolSix'
				}, {
					cuIcon: 'discoverfill',
					color: 'purple',
					name: '工具'
				}, {
					cuIcon: 'questionfill',
					color: 'mauve',
					name: '帮助'
				}],
			};
		},
		methods: {
			toolPage(data){
				uni.navigateTo({
					url:data.href
				})
			}
		},
		props: {
			
		},
		computed: {
			
		},
		mounted() {
			
		}
	};
</script>

<style lang="scss" scoped>
	.index-wrap{
		background: #fff;
		.header{
			padding: 0px 30upx;
			box-shadow: -3px -8px 20px 0px rgba(0, 0, 0, 0.32);
			.title{
				font-size: 50upx;
				font-weight: bold;
				padding-top: 8upx;
			}
			.content{
				color: #757575;
				line-height: 70upx;
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
	.hot-recommend {
		background-color: white;
		display: flex;
		padding: 2%;
		.hot-recommend-image {
			width: 100%;
			height: 100%;
		}
		.left {
			flex: 3;
			height: 350upx;
			margin-right: 15upx;
		}
		.right {
			flex: 4;
			.hot-recommend-image {
				height: 170upx;
			}
		}
	}
</style>
