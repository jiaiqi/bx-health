<template>
	<view class="">
		<view class="contentWrap">
			<image :src="notFound" mode=""></image>
			<h2 class="normalText">您访问的页面不存在</h2>
		</view>
		<view class="boxbtn"><view @click="gohomePage" class="btns">返回首页</view></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			// noNetWork:require('../../../../static/img/noNetWork.png'),
			notFound: require('../../otherPages/static/img/notFound.png')
		};
	},
	methods: {
		gohomePage() {
			uni.navigateTo({
				url: '/pages/home/home',
				fail() {
					uni.navigateTo({
						url: '/archivesPages/old-home/old-home'
					});
				}
			});
		}
	}
};
</script>

<style scoped lang="scss">
.contentWrap {
	text-align: center;
	padding-top: 130upx;
	image {
		display: inline-block;
		width: 380upx;
		height: 320upx;
	}
	.normalText {
		font-size: 16px;
		margin-top: 24px;
		color: #bdbdbd;
	}
}
.boxbtn {
	width: 100vw;
	.btns {
		margin: 60px auto;
		height: 90upx;
		width: 90%;
		background: linear-gradient(to right, #4d47f3, #4450e0);
		font-size: 16px;
		color: #ffffff;
		text-align: center;
		line-height: 90upx;
		border-radius: 30px;
	}
}
</style>
