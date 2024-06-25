<template>
	<view class="image-container">
		<image :src="result.url" :style="{width:result.imgWidth + 'px',height:result.imgHeight+'px'}" mode="aspectFill"></image>
	</view>
</template>

<script>
	/**
	 * @description 图片发送、加载展示组件. 发送时使用本地图片路径 图片上显示蒙层 蒙层上显示`发送中`
	 * @property {String} src - 本地图片地址/网络图片地址/fileNo
	 * @property {Number|String} max -图片最大宽度
	 * @property {Object} srvInfo -图片上传时需要的属性
	 */
	export default {
		props: {
			maxWidth: {
				type: [Number, String],
				default: 375
			},
			src: {
				required: true,
				type: String
			},
			srvInfo: {
				type: Object
			},
		},
		computed: {

			filePath() {
				return this.data
			}
		},
		watch: {   
			src: {
				immediate: true,
				handler(newVal, oldVal) {
					if (newVal.indexOf('api.100xsys.cn') !== -1) {
						this.status = 'loading'
					}
				}
			}
		},
		data() {
			return {
				status: 'sending', // sending-发送中、loading-加载中
				result: {},
				localPath: '', // 本地路径
				fileNo: '', // 文件编号
				netPath: '', //网络路径
			};
		},
		methods: {
			async getImageSize() {
				let url = this.getImagePath(this.src)
				let result = {
					url: url
				}
				let picInfo = await this.getImageInfo({
					url: url
				})
				if (picInfo.w && picInfo.h) {
					let res = this.setPicSize(picInfo);
					if (res.w && res.h) {
						result.imgWidth = Number(res.w.toFixed(2))
						result.imgHeight = Number(res.h.toFixed(2))
					}
					this.result = result
					return result
				}
			},

			//处理图片尺寸，如果不处理宽高，新进入页面加载图片时候会闪
			setPicSize(content, max = 350) {
				// 让图片最长边等于设置的最大长度，短边等比例缩小，图片控件真实改变，区别于aspectFit方式。
				if (this.max) {
					max = this.max
				}
				let maxW = uni.upx2px(max); //max是定义消息图片最大宽度
				let maxH = uni.upx2px(max); //max是定义消息图片最大高度
				if (content.w > maxW || content.h > maxH) {
					let scale = content.w / content.h;
					content.w = scale > 1 ? maxW : maxH * scale;
					content.h = scale > 1 ? maxW / scale : maxH;
				}
				return content;
			},
		},
		created() {
			if (this.src) {
				this.getImageSize()
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>
