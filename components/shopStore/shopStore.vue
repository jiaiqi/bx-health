<template>
	<view class="store-wrap" v-if="isLogin">
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
				<view class="hx-search-box">
					<text class="cuIcon-search" style="color: #666;font-size: 22;"></text>
					<input @input="goSearch" v-model="searchVal" type="text" placeholder="输入搜索关键词" value="" />
				</view>
			</view>
		</view>
		<view class="container margin-top sort-box">
			<view class="item-box" v-for="(item, i) in sortList" :key="i">
				<view @click="tapTitItem(item, i)" class="tit" :class="{ active: sortIndex == i }">
					<text v-if="item.tit === '商户'">{{ item.tit }}</text>
					<text v-if="item.tit === '我的店铺'">{{ item.tit }}</text>
				</view>
			</view>
		</view>
		<view class=" store-box" v-if="storeList && current_tit.type === 'shop'">
			<sPullScroll
				ref="pullScroll"
				:heightStyle="heightStyle"
				:pullDown="pullDown"
				:pullUp="loadData"
				:enablePullDown="true"
				:enablePullUp="true"
				:top="310"
				:fixed="true"
				:bottom="0"
				finishText="我是有底线的..."
			>
				<view @click="toShopDetail(store)" class=" item-box" v-for="(store, i) in storeList" :key="i">
					<view class="container top-box">
						<view class="left">
							<image v-if="!store.image" src="http://imgs.1op.cn/i/hxshop/goods/14.jpg" mode="aspectFill"></image>
							<image v-else :src="store.imgurl" mode="aspectFill"></image>
						</view>
						<view class="right">
							<text class="tit">{{ store.name ? store.name : '' }}</text>
							<view class="column store-r-b">
								<view class="store-r-b-t">
									<text class="cuIcon-favorfill"></text>
									<!-- <u-icon name="star-fill"></u-icon>	 -->
									<text>{{ store.grade ? store.grade : 0 }}</text>
								</view>
								<view class="store-r-b-b">
									<text>月售{{ store.sale_num ? store.sale_num : 0 }}</text>
								</view>
							</view>
							<view class="store-r-b-b">
								<text>地址:</text>
								<text>{{ store.address ? store.address : '暂无地址' }}</text>
							</view>
						</view>
					</view>
				</view>
			</sPullScroll>
		</view>

		<view class=" store-box" v-else-if="current_tit.type === 'myShop'">
			<sPullScroll
				ref="pullScroll"
				:heightStyle="heightStyle"
				:pullDown="pullDown"
				:pullUp="loadData"
				:enablePullDown="true"
				:enablePullUp="true"
				:top="300"
				:fixed="true"
				:bottom="0"
				finishText="我是有底线的..."
			>
				<view @click="toShopDetail(store)" class=" item-box" v-for="(store, i) in myStoreList" :key="i">
					<view class="container top-box">
						<view class="left">
							<image v-if="!store.image" src="http://imgs.1op.cn/i/hxshop/goods/14.jpg" mode="aspectFill"></image>
							<image v-else :src="store.imgurl" mode="aspectFill"></image>
						</view>
						<view class="right">
							<text class="tit">{{ store.name }}</text>
							<view class="column store-r-b store-r-b-my">
								<view class="store-r-b-t">
									<!-- <u-icon name="star-fill"></u-icon>	 -->
									<text class="cuIcon-favorfill"></text>
									<text>{{ store.grade }}</text>
								</view>
								<view class="store-r-b-b">
									<text>月售{{ store.sale_num }}</text>
								</view>
							</view>
							<view class="del-shop">
								<text @click.stop="del(store)">删除</text>
								<text @click.stop="amend(store)">修改</text>
							</view>
						</view>
					</view>
				</view>
			</sPullScroll>
		</view>
		<!-- </mescroll-body> -->
		<!-- <view class="foot" v-if="showFoot">
			<text>更多商家加入中，敬请期待</text>
		</view -->
		<view class="footzw"></view>
		<view class="public-button-box">
			<view @click="addShop" class="add-button">
				<!-- <u-icon name="plus"></u-icon> -->
				<text class="cuIcon-add"></text>
				<!-- <text class="add-button-num"></text> -->
			</view>
		</view>
	</view>
</template>

<script>
//引入测试数据
import sPullScroll from '@/components/s-pull-scroll';
export default {
	components: { sPullScroll },
	data() {
		return {
			isLogin: false, //是否已经登录
			MPPR: 0,
			searchVal: '', //搜索内容
			heightStyle: 'calc(100vh-620upx)',
			GDHEAD: 0,
			pageInfo: {
				total: 0,
				rownumber: 8,
				pageNo: 1
			},
			//显示没有更多商户
			showFoot: 0,
			downOption: {
				auto: false //是否在初始化后,自动执行downCallback; 默认true
			},
			sortIndex: 0,
			sortList: [{ tit: '商户', type: 'shop' }, { tit: '我的店铺', type: 'myShop' }],
			myStoreList: [], //当前登录人得商铺列表
			current_tit: { tit: '商户', type: 'shop' }, //当前点击顶部分类
			storeList: [],
			shopList: []
		};
	},
	async created() {
		let self = this;
		uni.$on('loginStatusChange', result => {
			self.isLogin = result;
		});
		let userInfo = uni.getStorageSync('login_user_info');
		if (!userInfo) {
			// 未登录， 提示跳转
			self.isLogin = false;
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
			self.isLogin = true;
			this.onRefresh();
			this.getShopList();
		}
	},
	onLoad() {
		// this.shopList = testData.storeList[0].goods;
		// console.log('--------', this.shopList);
	},
	onShow() {
		console.log('onshow', this.isLogin);
		if (this.isLogin) {
			this.getShopList();
			this.onRefresh();
			// this.getMyShopList()
		}
	},
	methods: {
		onRefresh() {
			this.pageInfo.pageNo = 1;
			this.$nextTick(() => {
				this.$refs.pullScroll.refresh();
			});
		},
		pullDown(pullScroll) {
			console.log(pullScroll.page);
			let page = this.pageInfo;
			this.pageInfo.pageNo = 1;
			let self = this;
			setTimeout(() => {
				this.loadData(pullScroll);
			}, 200);
		},
		loadData(pullScroll) {
			console.log('上拉加载');
			let page = this.pageInfo;
			this.pageInfo.pageNo = pullScroll.page;
			console.log(pullScroll.page);
			if (this.current_tit.type === 'shop') {
				this.getShopList();
			} else if (this.current_tit.type === 'myShop') {
				this.getMyShopList();
			}
		},
		amend(item) {
			// let cond = [
			// 	{
			// 		colName: 'id',
			// 		ruleType: 'in',
			// 		value: item.id
			// 	}
			// ];
			// let params = {
			// 	type: 'update',
			// 	condition: cond,
			// 	serviceName: 'srvhealth_restaurant_mgmt_select',
			// 	defaultVal: item
			// };
			let fieldsCond = [
				{
					column: 'id',
					value: item.id
				}
			];
			uni.navigateTo({
				url: `/publicPages/newForm/newForm?type=update&serviceName=srvhealth_store_mgmt_select&fieldsCond=${JSON.stringify(fieldsCond)}`
			});
		},
		/*删除**/
		del(item) {
			let self = this;
			uni.showModal({
				title: '提示',
				content: '是否确认删除?',
				success: res => {
					if (res.confirm) {
						self.delFoods(item);
					} else if (res.cancel) {
						console.log('用户点击取消');
					}
				}
			});
		},
		async delFoods(item) {
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_restaurant_mgmt_delete', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_restaurant_mgmt_delete',
					colNames: ['*'],
					condition: [
						{
							colName: 'id',
							ruleType: 'in',
							value: item.id
						}
					]
				}
			];
			let rea = await self.$http.post(url, req);
			if (rea.data.resultCode === 'SUCCESS') {
				// self.getFoodsList()
				self.getMyShopList();
			} else {
				uni.showToast({
					title: rea.data.resultMessage,
					icon: 'none'
				});
			}
		},
		goSearch() {
			if (this.current_tit.type === 'shop') {
				this.getShopList('search', this.searchVal);
			} else if (this.current_tit.type === 'myShop') {
				this.getMyShopList('search', this.searchVal);
			}
			console.log('-=========>');
		},
		/* 点击顶部切换商铺和我得商铺列表**/
		tapTitItem(item, i) {
			this.current_tit = item;
			this.sortIndex = i;
			this.onRefresh();
			console.log('点击顶部切换===》', item);
		},
		/*跳转至商铺详情*/
		toShopDetail(item) {
			if (['诊所', '医院'].includes(item.type)) {
				uni.navigateTo({
					url:'/pediaPages/hospitalOverview/hospitalOverview?store_no='+item.store_no
				})
			} else {
				uni.navigateTo({
					url: '/otherPages/shop/shopHome?type=' + this.current_tit.type + '&restaurantNo=' + item.store_no
				});
			}
		},
		/* 获取商户列表**/
		async getShopList(type = null, search_val) {
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_store_mgmt_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_mgmt_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'type',
						ruleType: 'eq',
						value: '饭馆'
					}
				],
				order: [],
				page: self.pageInfo
			};
			if (type && type === 'search') {
				req.condition = [
					{
						colName: 'name',
						ruleType: 'like',
						value: search_val
					}
				];
			}
			let res = await this.$http.post(url, req);
			if (res.data.resultCode === '0011') {
				this.isLogin = false;
				const result = await wx.login();
				if (result.code) {
					this.code = result.code;
					await this.wxLogin({ code: result.code });
					this.isLogin = true;
					// await this.initPage();
				}
			} else {
				if (self.pageInfo.pageNo === 1) {
					self.storeList = [];
				}
				self.pageInfo.total = res.data.page.total;
				self.pageInfo.pageNo = res.data.page.pageNo;
				let page = self.pageInfo;
				if (page.rownumber * page.pageNo >= page.total) {
					// finish(boolean:是否显示finishText,默认显示)
					self.$refs.pullScroll.finish();
				} else {
					self.$refs.pullScroll.success();
				}
				if (res.data.state === 'SUCCESS') {
					console.log('商户列表-----', res.data.data);
					res.data.data.forEach(item => {
						if (item.image) {
							let urls = self.$api.downloadFile + item.image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket') + '&thumbnailType=fwsu_100';
							this.$set(item, 'imgurl', urls);
						}
					});
					this.storeList = [...this.storeList, ...res.data.data];
				}
			}
		},
		/* 获取当前登录人得商铺**/
		async getMyShopList(type = null, search_val) {
			let self = this;
			let url = this.getServiceUrl('health', 'srvhealth_store_mgmt_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_mgmt_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'create_user',
						ruleType: 'eq',
						value: uni.getStorageSync('login_user_info').user_no
					}
					// {
					// 	colName: 'type',
					// 	ruleType: 'eq',
					// 	value: '饭馆'
					// }
				],
				order: [],
				page: self.pageInfo
			};
			if (type && type === 'search') {
				let obj = {
					colName: 'name',
					ruleType: 'like',
					value: search_val
				};
				req.condition.push(obj);
			}
			let res = await this.$http.post(url, req);
			if (self.pageInfo.pageNo === 1) {
				self.myStoreList = [];
			}
			self.pageInfo.total = res.data.page.total;
			self.pageInfo.pageNo = res.data.page.pageNo;
			let page = self.pageInfo;
			if (page.rownumber * page.pageNo >= page.total) {
				// finish(boolean:是否显示finishText,默认显示)
				self.$refs.pullScroll.finish();
			} else {
				self.$refs.pullScroll.success();
			}

			if (res.data.state === 'SUCCESS') {
				console.log('我的商户列表-----', res.data.data);
				res.data.data.forEach(item => {
					if (item.image) {
						let urls = self.$api.downloadFile + item.image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket') + '&thumbnailType=fwsu_100';
						this.$set(item, 'imgurl', urls);
					}
				});
				this.myStoreList = [...this.myStoreList, ...res.data.data];
				if (this.myStoreList.length == 0) {
					this.current_tit = { tit: '商户', type: 'shop' };
					this.getShopList();
				}
			}
		},
		/*新增商铺**/
		addShop() {
			let fieldsCond = [{ column: 'address', fieldType: 'location' }];
			uni.navigateTo({
				url: `/publicPages/newForm/newForm?serviceName=srvhealth_restaurant_mgmt_add&type=add&fieldsCond=${encodeURIComponent(JSON.stringify(fieldsCond))}`
			});
		}
	}
};
</script>

<style lang="scss">
.store-wrap {
	height: 100%;
}
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
			flex-direction: column;
			color: #333333;
			justify-content: space-around;
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
.store-r-b {
	display: flex;
	align-items: center;
	.store-r-b-t {
		color: #f98c00;
		font-weight: 700;
		display: flex;
		text {
			margin-right: 10upx;
		}
	}
	.store-r-b-b {
		color: #848484;
		// margin-top: 10upx;
	}
}
.store-r-b-my {
	margin-top: 30upx;
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
			input {
				padding: 0 10rpx;
				font-size: 28rpx;
				height: 68rpx;
				width: 100%;
			}
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
		// margin-bottom: 14px;
		border-bottom: 1px solid #ccc;
		padding-bottom: 18px;
		padding-top: 18px;
		background-color: #ffffff;
		.top-box {
			display: flex;
			flex-direction: row;
			.left {
				margin-right: 10px;
				image {
					width: 150upx;
					height: 150upx;
					border-radius: 6px;
				}
			}
			.right {
				flex: 1;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
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
		.del-shop {
			display: flex;
			justify-content: flex-end;
			margin-right: 20upx;
			text {
				color: #0081ff;
				margin-right: 10px;
				border: 1px solid #0081ff;
				border-radius: 20px;
				padding: 2px 10px;
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
.add-button {
	position: fixed;
	bottom: 20upx;
	left: calc(50% - 50upx);
	width: 100upx;
	height: 100upx;
	border-radius: 50%;
	background-color: rgb(246, 210, 0);
	z-index: 100;
	display: flex;
	justify-content: center;
	align-items: center;
	font-size: 24px;
	color: white;
}
</style>
