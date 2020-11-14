<template>
	<view class="webview-page"><web-view :webview-styles="webviewStyles" :src="webUrl"></web-view></view>
</template>

<script>
export default {
	data() {
		return {
			webUrl: '',
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
