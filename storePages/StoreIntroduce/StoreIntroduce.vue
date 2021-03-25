<template>
	<view class="store-instroduce">
		<!-- <view class="home" @click="goHome"><text class="cuIcon-back"></text></view> -->
		<swiper v-if="swiperList.length>0" class="screen-swiper item-box square-dot" easing-function="linear"
			:height="300" :indicator-dots="true" :circular="true" :autoplay="true" interval="5000" duration="500">
			<swiper-item v-for="(item, index) in swiperList" :key="item.url">
				<image :src="item.url" mode="aspectFill" @click="toPreviewImage(item.url)"></image>
			</swiper-item>
		</swiper>
		<view class="store-info">
			<image class="logo" :src="getImagePath(storeInfo.logo)" mode=""></image>
			<view class="info">
				<view class="name">{{ storeInfo.name || '' }}</view>
				<view class="slogan"></view>
			</view>
			<view class="phone">
				<image class="image" src="../../static/icon/makePhone.png" mode="" @click="makePhoneCall"></image>
			</view>
		</view>
		<view class="instroduce">
			<view v-html="storeInfo.introduction"></view>
		</view>
		<view class="qr-code" v-if="qrCodeText">
			<uni-qrcode cid="qrcodeCanvas" :text="qrCodeText" :size="codeSize" class="qrcode-canvas"
				foregroundColor="#333" makeOnLoad @makeComplete="qrcodeCanvasComplete"></uni-qrcode>
			<image :src="qrcodePath" class="qr-code-image" mode="aspectFit" v-if="qrcodePath"
				@click="toPreviewImage(qrcodePath)"></image>
		</view>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				swiperList: [],
				storeNo: '',
				storeInfo: {},
				qrCodeText: '',
				codeSize: uni.upx2px(700),
				qrcodePath: ""
			}
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			})
		},
		onLoad(option) {
			if (option.store_no) {
				this.storeNo = option.store_no
				this.selectStoreInfo()
				this.qrCodeText = `https://wx2.100xsys.cn/home/${option.store_no}`
				// this.qrCodeText = `https://wx2.100xsys.cn/shareClinic/${option.store_no}`
			}
		},
		methods: {
			qrcodeCanvasComplete(e) {
				this.qrcodePath = e;
			},
			makePhoneCall() {
				uni.makePhoneCall({
					phoneNumber: this.storeInfo.telephone ? this.storeInfo.telephone : '10086'
				})
			},
			selectStoreInfo() {
				let url = this.getServiceUrl('health', 'srvhealth_store_mgmt_select', 'select')
				let req = {
					serviceName: 'srvhealth_store_mgmt_select',
					colNames: ['*'],
					condition: [{
						colName: 'store_no',
						ruleType: 'eq',
						value: this.storeNo
					}],
					page: {
						pageNo: 1,
						rownumber: 1
					},
					draft: false,
					query_source: 'list_page'
				}
				return new Promise((resolve, reject) => {
					this.$http.post(url, req).then(res => {
						if (Array.isArray(res.data.data) && res.data.data.length > 0) {
							this.storeInfo = res.data.data[0]
							this.getSwiperList(this.storeInfo)
							uni.setNavigationBarTitle({
								title: this.storeInfo.name
							})
							resolve(res.data.data[0])
						} else {
							reject(res)
						}
					})
				})
			},
			async getSwiperList(e) {
				if (e.image) {
					let res = await this.getFilePath(e.image)
					if (Array.isArray(res)) {
						this.swiperList = res.reduce((pre, cur) => {
							if (cur.fileurl) {
								cur.url = this.$api.getFilePath + cur.fileurl + '&bx_auth_ticket=' + uni
									.getStorageSync('bx_auth_ticket')
							}
							pre.push(cur)
							return pre
						}, [])
					}
				}
			},
			goHome() {
				uni.redirectTo({
					url: '/pediaPages/hospitalOverview/hospitalOverview?store_no=' + this.storeNo
				})
			}
		}
	}
</script>

<style scoped lang="scss">
	.store-instroduce {
		min-height: calc(100vh - var(--window-top));
		background-color: #fff;
		position: relative;
		overflow: hidden;

		.qr-code {
			background-color: #fff;
			width: 700rpx;
			height: 700rpx;
			margin: 30rpx auto 100rpx;

			.qrcode-canvas {
				position: fixed;
				top: -999999px;
			}

			.qr-code-image {
				width: 700rpx;
				height: 700rpx;
			}
		}

		.home {
			position: absolute;
			right: calc(50% - 50rpx);
			bottom: 50px;
			height: calc(var(--window-top));
			z-index: 2;
			background-color: #fff;
			width: 100rpx;
			height: 100rpx;
			border-radius: 50%;
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 30px;
			box-shadow: -1px -1px 15px 1px rgba(5, 34, 75, 0.18);
			transition: all 0.5s ease;

			&:active {
				background-color: #f8f8f8;
			}
		}
	}

	.logo {
		border-radius: 5px;
		width: 50px;
		height: 50px;
	}

	.store-info {
		padding: 20rpx;
		background-color: #fff;
		display: flex;
		align-items: center;

		.info {
			flex: 1;
			padding: 20rpx;

			.name {
				font-weight: bold;
				font-size: 18px;
			}
		}
	}

	.instroduce {
		margin: 0 20rpx;
		background-color: #f8f8f8;
		border-radius: 10rpx;
		padding: 20rpx;
	}

	.phone {
		text-align: right;
		padding-left: 20rpx;
		border-left: 1px solid #f1f1f1;

		.image {
			width: 60rpx;
			height: 60rpx;
		}
	}
</style>
