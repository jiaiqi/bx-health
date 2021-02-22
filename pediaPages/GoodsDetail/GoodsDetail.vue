<template>
	<view>
		<swiper
			class="screen-swiper main-image square-dot"
			easing-function="linear"
			:height="300"
			:indicator-dots="true"
			:circular="true"
			:autoplay="true"
			interval="5000"
			duration="500"
		>
			<swiper-item v-for="(item, index) in swiperList" :key="item.url"><image :src="item.url" mode="aspectFill" @click.stop="toPreviewImage(item.url)"></image></swiper-item>
		</swiper>
		<!-- <image :src="getImagePath(goodsInfo.goods_img,true)" mode="aspectFill"></image> -->
		<view class="goods-info">{{ goodsInfo.goods_name }}</view>
		<view class="desc">
			<view class="title">简介</view>
			<view class="">{{ goodsInfo.goods_desc }}</view>
		</view>
		<view class="store-info">
			<image :src="getImagePath(goodsInfo.store_image)" class="store-icon"></image>
			<view class="store-name">{{ goodsInfo.store_name }}</view>
			<view class="phoneCall"><text class="cuIcon-phone text-cyan"></text></view>
		</view>
		<view class="detail">
			<view class="title">图文详情</view>
			<view class="image-box">
				<image :src="item.url" mode="aspectFill" :style="{ width: item.imgWidth + 'px', height: item.imgHeight + 'px' }" v-for="item in goodsDetailImage"></image>
			</view>
		</view>
		<view class="cu-bar foot bottom bg-white tabbar border shop">
			<view class="price text-red margin-left">
				<text class="symbol">￥</text>
				<text class="number" v-if="fill2Digit(goodsInfo.price)">
					<text class="int">{{ fill2Digit(goodsInfo.price)[0] }}.</text>
					<text class="float">{{ fill2Digit(goodsInfo.price)[1] }}</text>
				</text>
			</view>
			<view class="right-btn"><button class="cu-btn bg-cyan round shadow-blur" @click="payOrder">立即购买</button></view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			goodsInfo: {},
			swiperList: [],
			goodsDetailImage: []
		};
	},
	filters: {},
	methods: {
		async getSwiperList(e) {
			if (e.goods_img) {
				let res = await this.getFilePath(e.goods_img);
				if (Array.isArray(res)) {
					this.swiperList = res.reduce((pre, cur) => {
						if (cur.fileurl) {
							cur.url = this.$api.getFilePath + cur.fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
						}
						pre.push(cur);
						return pre;
					}, []);
				}
			}
		},
		async getDetaiImageList(e) {
			if (e.goods_detail_image) {
				let res = await this.getFilePath(e.goods_detail_image);
				if (Array.isArray(res)) {
					this.goodsDetailImage = res.reduce((pre, cur) => {
						if (cur.fileurl) {
							let url = this.$api.getFilePath + cur.fileurl + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
							cur.url = url;
							this.getImageInfo({ url: url }).then(picInfo => {
								if (picInfo.w && picInfo.h) {
									let res = this.setPicHeight(picInfo);
									if (res.w && res.h) {
										this.$set(cur, 'imgWidth', res.w);
										this.$set(cur, 'imgHeight', res.h);
									}
								}
							});
						}
						pre.push(cur);
						return pre;
					}, []);
				}
			}
		},
		fill2Digit(val) {
			// 精确到小数点后两位
			if (Number(val).toString() !== 'NaN') {
				return [parseInt(val), val.toFixed(2).slice(-2)];
			} else {
				return false;
			}
		},
		setPicHeight(content) {
			let maxW = uni.upx2px(750);
			content.h = (maxW * content.h) / 	content.w ;
			content.w = maxW;			
			return content;
		},
		getGoodsInfo(no) {
			let req = {
				condition: [{ colName: 'goods_no', ruleType: 'eq', value: no }]
			};
			this.$fetch('select', 'srvhealth_store_goods_select', req, 'health').then(res => {
				if (Array.isArray(res.data) && res.data.length > 0) {
					this.goodsInfo = res.data[0];
					this.getSwiperList(this.goodsInfo);
					this.getDetaiImageList(this.goodsInfo);
				}
			});
		}
	},
	onLoad(option) {
		if (option.goods_no) {
			this.getGoodsInfo(option.goods_no);
		}
	}
};
</script>

<style scoped lang="scss">
.goods-info {
	font-size: 18px;
	letter-spacing: 2px;
	padding: 20rpx;
	background-color: #fff;
	margin-bottom: 20rpx;
}
.store-info {
	margin: 20rpx 0;
	background-color: #fff;
	border-top: 1rpx solid #f1f1f1;
	margin-bottom: 20rpx;
	padding: 20rpx;
	display: flex;
	align-items: center;
	.store-name {
		font-size: 16px;
		font-weight: bold;
		color: #333;
		margin-left: 20rpx;
	}
	.store-icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
	}
	.phoneCall {
		flex: 1;
		font-size: 30px;
		text-align: right;
	}
}
.desc {
	color: #aaa;
	padding: 20rpx;
	background-color: #fff;
	.title {
		padding: 10rpx 0;
		border-bottom: 1rpx solid #f1f1f1;
		margin-bottom: 10rpx;
	}
}
.detail {
	padding-bottom: 50px;
	background-color: #fff;
	.title {
		border-bottom: 1rpx solid #f1f1f1;
		padding: 20rpx;
	}
	.image-box {
		width: 100%;
		image {
			width: 100%;
		}
	}
}
.main-image {
	width: 100%;
	height: 400rpx;
	overflow: hidden;
	image {
		width: 100%;
		height: 100%;
	}
}
.right-btn {
	display: flex;
	justify-content: flex-end;
	flex: 1;
	padding-right: 20rpx;
}
.price {
	.symbol {
		font-size: 12px;
	}
	.number {
		font-size: 30px;
		margin: 0 5px;
		.float {
			font-size: 14px;
		}
	}
}
</style>
