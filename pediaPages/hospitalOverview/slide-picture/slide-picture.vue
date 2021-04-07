<template>
	<swiper class="screen-swiper item-box rectangle-dot" easing-function="linear" indicator-active-color="#00aaff"
		:indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500" height="300">
		<swiper-item v-for="(item, index) in swiperList" :key="item.url" @click.stop="toPreviewImage(item.url)">
			<image :src="item.url" mode="scaleToFill"></image>
		</swiper-item>
	</swiper>
</template>

<script>
	export default {
		props: {
			swiperList: {
				type: Array
			},
		},
	}
</script>

<style>

</style>
