<template>
	<view class="webview-page"><web-view :webview-styles="webviewStyles" :src="webUrl"></web-view></view>
</template>

<script>
export default {
	data() {
		return {
			webUrl: '',
			userno:'',
			doctor_no:'',
			webviewStyles: {
				progress: {
					color: '#FF3333'
				}
			}
		};
	},
	onLoad(option) {
		if(option.webUrl){
			this.webUrl = decodeURIComponent(option.webUrl)
			// this.webUrl = 'http://srvms.100xsys.cn/health/remote/getPage?address=https://xw.qq.com/cmsid/20201201A0296600'
		}else{
			this.webUrl ='https://wx2.100xsys.cn/pages/specific/testPage/testPage'
		}
	}
	
};
</script>

<style lang="scss" scoped>
	.webview-page{
		width: 100vw;
		height: 100vh;
		background-color: #fff;
	}
</style>
