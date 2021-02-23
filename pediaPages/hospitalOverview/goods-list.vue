<template>
	<view class="goods-list">
		<view class="goods-item" v-for="item in goodsList" @click="toGoodsDetail(item)">
			<image class="goods-image" v-if="item[image]" :src="item.url" mode="aspectFill"  :style="{height: item.imgHeight + 'px' }"></image>
			<view class="goods-image" v-else>{{ item[name].slice(0, 4) }}</view>
			<view class="goods-info">
				<view class="goods-name">{{ item[name] }}</view>
				<view class="desc">{{ item[desc] }}</view>
				<view class="price text-cyan">
					<text class="symbol">￥</text>
					<text class="number">{{ item[price] }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
/**
 * 商品列表组件
 * @description 商品列表组件
 * @property {Array} list 商品数据
 * @property {String} image 图片字段
 * @property {String} name 商品名字字段
 * @property {String} desc 商品描述字段
 * @property {String} price 商品价格字段
 * @event {Function} toGoodsDetail 跳转到商品详情
 * @example <good-list :list=""></good-list>
 */

export default {
	name: 'good-list',
	created() {
		if (Array.isArray(this.list)) {
			this.goodsList = this.deepClone(this.list).reduce((pre, cur) => {
				let url = this.getImagePath(cur[this.image],true);
				cur.url = url;
				if (cur[this.image]) {
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
				pre.push(cur)
				return pre
			}, []);
		}
	},
	data() {
		return {
			goodsList: []
		};
	},
	methods: {
		setPicHeight(content) {
			let maxW = uni.upx2px(350);
			content.h = (maxW * content.h) / content.w;
			content.w = maxW;
			return content;
		},
		toGoodsDetail(e) {
			if (e.goods_no) {
				uni.navigateTo({
					url: '/pediaPages/GoodsDetail/GoodsDetail?goods_no=' + e.goods_no
				});
			}
		}
	},
	props: {
		list: {
			type: Array
		},
		image: {
			type: String,
			default: 'image'
		},
		name: {
			type: String,
			default: 'name'
		},
		desc: {
			type: String,
			default: 'description'
		},
		price: {
			type: String,
			default: 'price'
		}
	}
};
</script>

<style scoped lang="scss">
.goods-list {
	// display: flex;
	// flex-wrap: wrap;
	column-count: 2;
	column-gap: 10px;
	padding: 0 5px 20px;
}
.goods-item {
	background-color: #fff;
	break-inside: avoid;
	margin-bottom: 20rpx;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
	&:nth-child(2n) {
		margin-right: 0;
	}
}
.goods-image {
	width: 100%;
	height: 300rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 20px;
	font-weight: bold;
	border: 1px solid #fff;
}
.goods-info {
	padding: 10rpx;
	width: 100%;
	margin-top: 5px;
	font-size: 16px;
	.desc {
		font-size: 12px;
		color: #aaa;
		margin-top: 5px;
	}
	.price {
		margin-top: 20rpx;
		.symbol {
			font-size: 12px;
		}
		.number {
			font-size: 20px;
		}
	}
}
.goods-name {
	text-align: left;
}
</style>
