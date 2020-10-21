<template>
	<view v-if="isLogin">
		<view class="head-box">
			<view class="navbar"></view>
			<view class="container">
				<view class="left"><!-- <view class="logo"><image src="/otherPages/static/img/logo96x96.png" mode="aspectFit"></image></view> --></view>
				<view class="right" :style="'padding-right: ' + MPPR + 'px'">
					<view class="address-box">
						<i class="hxicon-locationfill"></i>
						<i class="hxicon-right"></i>
					</view>
					<view class="notice"><i class="hxicon-notice"></i></view>
				</view>
			</view>
		</view>
		<view class="search-box" :class="{ QZBG: GDHEAD }" :style="GDHEAD ? 'padding-right: ' + MPPR + 'px' : ''">
			<!-- <view class="navbar" ></view> -->
			<view class="ctn">
				<view class="hx-search-box" @click="goSearch">
					<uni-icons type="search" size="22" color="#666666" />
					<text>输入搜索关键词</text>
				</view>
			</view>
		</view>
		<view class="container margin-top sort-box">
			<view class="item-box" v-for="(item, i) in sortList" :key="i">
				<view class="tit" :class="{ active: sortIndex == i }">
					<text>{{ item.tit }}</text>
				</view>
			</view>
		</view>
		<view @click="toShopDetail" class=" store-box" v-if="storeList">
			<view class=" item-box" v-for="(store, i) in storeList" :key="i">
				<view class="container top-box">
					<view class="left"><image src="http://imgs.1op.cn/i/hxshop/goods/14.jpg" mode="aspectFill"></image></view>
					<view class="right">
						<text class="tit">{{ store.name }}</text>
						<view class="row justify-content">
							<view class="row-right"><i class="hxicon-locationfill"></i></view>
						</view>
					</view>
				</view>
				<scroll-view scroll-x class="bottom-box">
					<view class="bottom-box-container">
						<view class="goods-box" v-for="(goods, j) in shopList" :key="j" @click="toStore(store, goods.id)">
							<view class="img-box">
								<image :src="goods.main_pic" mode="aspectFit"></image>
								<view class="tag">{{ goods.tag }}</view>
							</view>
							<view class="tit">{{ goods.name }}</view>
							<view class="price-box">
								<text class="txt1">￥</text>
								<text class="txt2">{{ goods.price }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
		<!-- </mescroll-body> -->
		<!-- <view class="foot" v-if="showFoot">
			<text>更多商家加入中，敬请期待</text>
		</view -->
		<view class="footzw"></view>
	</view>
</template>

<script>
//引入测试数据
import testData from '@/common/testdata.js';
export default {
	components: {},
	data() {
		return {
			isLogin: false, //是否已经登录
			MPPR: 0,
			GDHEAD: 0,
			//显示没有更多商户
			showFoot: 0,
			downOption: {
				auto: false //是否在初始化后,自动执行downCallback; 默认true
			},
			sortIndex: 0,
			sortList: [{ tit: '商户' }, { tit: '评分' }],
			storeList: [],
			shopList: []
		};
	},
	async created() {
		uni.$on('loginStatusChange',(result)=>{
			this.isLogin = result
		})
		let userInfo = uni.getStorageSync('login_user_info');
		if (!userInfo) {
			// 未登录， 提示跳转
			this.isLogin = false;
			let res = await uni.showModal({
				title: '提示',
				content: '未登录,是否跳转到登录页面?',
				confirmText: '去登录',
				confirmColor: '#02D199'
			});
			if (Array.isArray(res) && res.length > 1) {
				if (res[1].confirm) {
					// 确认 跳转到登录页
					uni.navigateTo({
						url: '/publicPages/accountExec/accountExec'
					});
				} else if (res[1].cancel) {
					// 取消 返回首页
					uni.switchTab({
						url: '/pages/pedia/pedia'
					});
				}
			}
		} else {
			this.isLogin = true;
		}
	},
	onLoad() {
		this.shopList = testData.storeList[0].goods;
		console.log('--------', this.shopList);
	},
	onShow() {
		console.log('onshow', this.isLogin);
		if (this.isLogin) {
			this.getShopList();
		}
	},
	methods: {
		/*跳转至商铺详情*/
		toShopDetail() {
			console.log('---------');
			uni.navigateTo({
				url: '/otherPages/shop/shopHome'
			});
		},
		/* 获取商户列表**/
		async getShopList() {
			let url = this.getServiceUrl('health', 'srvhealth_restaurant_mgmt_select', 'select');
			let req = {
				serviceName: 'srvhealth_restaurant_mgmt_select',
				colNames: ['*'],
				condition: [],
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				console.log('商户列表-----', res.data.data);
				this.storeList = res.data.data;
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #f8f8f8;
}
.b-b {
	position: relative;
}
.b-b:after,
.b-t:after {
	position: absolute;
	z-index: 3;
	left: 0;
	right: 0;
	height: 0;
	content: '';
	transform: scaleY(0.5);
	border-bottom: 1px solid #e4e7ed;
}

.b-b:after {
	bottom: 0;
}
.b-t:after {
	top: 0;
}
.container {
	margin: 0 15px;
}
.margin-top {
	margin-top: 12px;
}
.head-box {
	padding: 14px 0;
	/* #ifdef MP */
	padding-top: 2px;
	/* #endif */
	background: linear-gradient(100deg, #ffeb3b, #ffc107);
	position: relative;
	z-index: 3;
	.navbar {
		position: sticky;
		top: 0;
		// height: var(--status-bar-height);
	}

	.container {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		height: 32px;
		align-items: center;
		.left {
			.logo {
				width: 32px;
				height: 32px;

				image {
					width: 32px;
					height: 32px;
					border-radius: 50%;
				}
			}
		}
		.right {
			display: flex;
			flex-direction: row;
			color: #333333;
			align-items: center;

			.address-box {
				font-size: 14px;
				margin-right: 16px;
				display: flex;
				flex-direction: row;
				align-items: center;
				text {
					margin-left: 2px;
					margin-right: 4px;
				}
				.icon-right {
					position: relative;
					top: 2px;
				}
			}

			.notice {
				font-weight: bold;
				font-size: 18px;
			}
		}
	}
}
.search-box {
	position: sticky;
	top: 0;
	z-index: 2;
	background: linear-gradient(100deg, #ffeb3b, #ffc107);
	// padding-top: var(--status-bar-height);
	// margin-top: calc(var(--status-bar-height) * -1);
	.ctn {
		border-top-left-radius: 50upx;
		border-top-right-radius: 50upx;
		background: #f8f8f8;
		padding: 15px 15px 12px;

		.hx-search-box {
			border-radius: 40px;
			padding: 0 15px;
			height: 34px;
			display: flex;
			align-items: center;
			line-height: 44rpx;
			background-color: #eeeeee;
			flex: 1;
			color: #888888;
			font-size: 14px;
		}
	}
}
.QZBG {
	background: #ffffff;
	box-shadow: 0 1px 6px #ccc;
	.navbar {
		// height: var(--status-bar-height);
	}
	.ctn {
		background: #ffffff;
		/* #ifdef MP */
		padding-top: 0px;
		/* #endif */
	}
}
.hot-box {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
	.item {
		margin-right: 12px;
		background-color: #eeeeee;
		color: #666666;
		font-size: 12px;
		border-radius: 20px;
		padding: 2px 6px;
		margin-bottom: 8px;
	}
	.item:last-child {
		margin-right: 0;
	}
}
.bannerimg-box {
	border-bottom-left-radius: 10upx;
	border-bottom-right-radius: 10upx;
	padding: 24rpx;
	swiper {
		height: 233rpx;
		width: 699rpx;
	}
	.swiper-item {
		display: flex;
		justify-content: center;
		align-content: center;
		overflow: hidden;

		width: 100%;
		height: 100%;
		image {
			border-radius: 8px;
			width: 100%;
		}
	}
}

.menu-box {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin-top: 12px;
	border-radius: 8px;
	background: #ffffff;
	padding: 12px 8px;
	.item-box {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		image {
			width: 40px;
			height: 40px;
		}
		.tit {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 12px;
			margin-top: 6px;
			color: #333333;
			padding: 2px 0;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.active {
			color: #ffffff;
			background-color: #999999;
			border-radius: 60px;
		}
	}
}
.sort-box {
	display: flex;
	flex-direction: row;
	margin-top: 12px;
	.item-box {
		margin-right: 16px;
		.tit {
			display: flex;
			justify-content: center;
			align-items: center;
			font-size: 12px;
			color: #333333;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		.active {
			//color: #111111;
			font-weight: bold;
		}
	}
}
.store-box {
	margin-top: 20px;

	.item-box {
		display: flex;
		flex-direction: column;
		margin-bottom: 14px;
		padding-bottom: 18px;
		padding-top: 18px;
		background-color: #ffffff;
		.top-box {
			display: flex;
			flex-direction: row;
			.left {
				margin-right: 10px;

				image {
					width: 72px;
					height: 54px;
					border-radius: 6px;
				}
			}
			.right {
				flex: 1;
				.tit {
					font-size: 16px;
					font-weight: bold;
					color: #333333;
					white-space: nowrap;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.justify-content {
					display: flex;
					flex-direction: row;
					justify-content: space-between;
				}
				.row {
					font-size: 12px;
					color: #999999;
					margin-top: 4px;
					.row-left {
						display: flex;
						flex-direction: row;
						.t1,
						i {
							color: #ffca3e;
						}
					}
					.t2 {
						margin-left: 12px;
					}
					.row-right {
						display: flex;
						flex-direction: row;
						i {
							margin-right: 4px;
						}
					}
				}
			}
		}
		.bottom-box {
			&-container {
				margin: 12px 0 0;
				padding-left: 82px;

				white-space: nowrap;
				.goods-box {
					width: 80px;
					margin-left: 12px;
					display: inline-block;
					.img-box {
						position: relative;
						width: 80px;
						height: 60px;
						background-color: #f1f1f1;
						border-radius: 4px;
						image {
							width: 100%;
							height: 60px;
						}
						.tag {
							position: absolute;
							bottom: 0;
							left: 0;
							background-color: #ff5722;
							color: #ffffff;
							padding: 2px 4px;
							font-size: 12px;
							border-radius: 4px;
						}
					}
					.tit {
						font-size: 14px;
						margin-top: 4px;
						white-space: nowrap;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.price-box {
						margin-top: 4px;
						height: 80upx;
						.txt1 {
							font-size: 10px;
							color: #ff5722;
						}
						.txt2 {
							font-size: 16px;
							color: #ff5722;
						}
						.txt3 {
							margin-left: 6px;
							font-size: 10px;
							color: #bbbbbb;
							text-decoration: line-through;
						}
					}
				}
				.goods-box:last-child {
					margin-right: 12px;
				}
			}
		}
	}
	.item-box:last-child {
		border-bottom: 0;
	}
}
.foot {
	position: relative;
	display: flex;
	justify-content: center;
	margin-top: 36px;
	margin-bottom: 50px;
	text {
		font-size: 14px;
		position: relative;
		z-index: 2;
		height: 20px;
		line-height: 20px;
		background-color: #f8f8f8;
		color: #cccccc;
		padding: 0 12px;
	}
}
.foot::before {
	content: '';
	z-index: 1;
	display: block;
	position: absolute;
	top: 50%;
	height: 0;
	width: 100%;
	transform: scaleY(0.5);
	border-bottom: 1px solid #e4e7ed;
}
.footzw {
	/* #ifdef H5*/
	height: 50px;
	/* #endif */
}
</style>
