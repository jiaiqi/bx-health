<template>
	<view class="warpGrip">
		<view class="box-crad">
			<view class="crad" v-for="(item,index) in list" :key="index">
				<image :src="item.img" mode="aspectFill"></image>
				<view class="text_box">
					<view class="h2">{{item.title}}</view>
					<view class="character">{{item.content}}</view>
				</view>
				<view class="btn" @click="fillQuestionnaire(item)">开始评估</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				list:[
					{
						img:'https://ns-strategy.cdn.bcebos.com/ns-strategy/upload/fc_big_pic/part-00508-2270.jpg',
						title:'体力活动',
						content:'研究表明:目前导致人类死亡是对对方的身份的方式的士大夫挖到了静安寺的'
					},
					{
						img:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=164364934,984448078&fm=26&gp=0.jpg',
						title:'体力活动',
						content:'研究表明:目寺的'
					},
					{
						img:'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1369680714,3000448627&fm=26&gp=0.jpg',
						title:'体力活动',
						content:'研究表明:目前导致人类死亡是对对方的身份的方式的士大夫挖到了静安寺的'
					}
				]
			}
		},
		methods:{
			fillQuestionnaire(){
				uni.redirectTo({
				  url: '/pages/specific/questionnaire/questionnaire?activity_no=20200831163648000153'
				});
			}
		}
	}
</script>

<style lang="scss" scoped>	
	.warpGrip{
		padding: 50upx 30upx;
		width: 100%;
		.box-crad{
			display: flex;
			flex-wrap: wrap;
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
			background: linear-gradient(to right, #6965e2, #7a55ec);
			color: #ffffff;
			text-align: center;
			line-height: 65upx;
			border-radius: 30px;
			margin: 0 auto;
			margin-bottom: 25upx;
		}
	}
	.box-crad>.crad:nth-child(odd){
		margin-right: 4%;
	}
</style>
