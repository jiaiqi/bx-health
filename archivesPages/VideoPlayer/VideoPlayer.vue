<template>
	<view>
		<video class="video-player" :src="src" controls v-if="src"></video>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				src:""
			};
		},
		onLoad(option) {
			if(option.src){
				this.src = decodeURIComponent(option.src)
			}
		}
	}
</script>

<style lang="scss">
.video-player{
	width: 100%;
}
</style>
