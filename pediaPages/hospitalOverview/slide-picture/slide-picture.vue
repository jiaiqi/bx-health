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
			pageItem: {
				type: Object
			},
			storeInfo: {
				type: Object
			},
			userInfo: {
				type: Object
			}
		},
		data() {
			return {
				swiperList: []
			}
		},
		methods: {
			async getSwiperList() {
				let image = this.pageItem && this.pageItem.image_origin === '店铺信息' ? this.storeInfo.image : this
					.pageItem.swiper_image
				if (image) {
					let res = await this.getFilePath(image);
					if (Array.isArray(res)) {
						let swiperList = res.reduce((pre, cur) => {
							if (cur.fileurl) {
								cur.url = this.$api.getFilePath + cur.fileurl + '&bx_auth_ticket=' + uni
									.getStorageSync('bx_auth_ticket');
							}
							pre.push(cur);
							return pre;
						}, []);
						this.swiperList = swiperList
						return swiperList
					} else {
						return []
					}
				}
			},
		},
	}
</script>

<style>

</style>
