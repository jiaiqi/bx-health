<template>
	<image mode="scaleToFill" class="image-lazy-view no-load" ref="vref" :src="getImagePath(item[imgColName],true)"></image>
</template>
<script>
export default {
	props: {
		item: {
			type: Object,
			default() {
				return {};
			}
		},
		imgColName: {
			type: String,
			default: 'img'
		},
		className: {
			type: String,
			default: 'main-image'
		}
	},
	data() {
		return {
			imageElements: []
		};
	},
	created() {},
	mounted() {
		let self = this;
		// self.imageLazy()
	},
	methods: {
		throttle(fn, delay = 15, mustRun = 30) {
			let t_start = null;
			let timer = null;
			let context = this;
			return function() {
				let t_current = +new Date();
				let args = Array.prototype.slice.call(arguments);
				clearTimeout(timer);
				if (!t_start) {
					t_start = t_current;
				}
				if (t_current - t_start > mustRun) {
					fn.apply(context, args);
					t_start = t_current;
				} else {
					timer = setTimeout(() => {
						fn.apply(context, args);
					}, delay);
				}
			};
		},
		inViewShow() {
			let len = this.imageElements.length;
			for (let i = 0; i < len; i++) {
				let imageElement = this.imageElements[i];
				const rect = imageElement.getBoundingClientRect();
				// 出现在视野的时候加载图片
				if (rect.top < document.documentElement.clientHeight) {
					imageElement.src = imageElement.dataset.src;
					// 移除掉已经显示的
					this.imageElements.splice(i, 1);
					len--;
					i--;
					if (this.imageElements.length === 0) {
						// 如果全部都加载完 则去掉滚动事件监听
						document.removeEventListener('scroll', this._throttleFn);
					}
				}
			}
		},
		imageLazy(e) {
			let self = this;
			this.imageElements = Array.prototype.slice.call(document.querySelectorAll('.no-load'));
			if ('IntersectionObserver' in window) {
				let child = this.$refs.vref;
				let observer = new IntersectionObserver(entries => {
					entries.forEach(item => {
						let lazyImage = item.target;
						let imgUrl = item.target.dataset.src;
						if (item.isIntersecting) {
							if (imgUrl) {
								item.target.classList.remove('no-load');
								item.target.src = imgUrl;
								item.target.childNodes[0].style.backgroundImage = 'url(' + imgUrl + ')';
								item.target.childNodes[1].src = imgUrl;
							}
						} else {
						}
					});
				});
				observer.observe(child._vnode.elm);
			} else {
				self.inViewShow();
				self._throttleFn = self.throttle(self.inViewShow);
				window.addEventListener('scroll', self._throttleFn.bind(self));
			}
		}
	},
	watch: {
		item: {
			handler: function(nVal, oVal) {
				this.imageLazy();
			},
			immediate:true,
			deep: true
		}
	}
};
</script>
<style lang="scss" scoped>
.image-lazy-view {
	height: 100%;
	width: 100% !important;
}
</style>
