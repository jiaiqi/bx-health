<template>
	<view class="store-wrap" v-if="isLogin">
		<view class="cu-bar justify-start bg-white">
			<view class="action border-title margin-right" v-for="(item, index) in sortList" @click="tapTitItem(item, index)">
				<text class="text-xl" :class="{ 'text-bold': sortIndex == index }">{{ item.tit }}</text>
				<text class="bg-blue" style="width:1rem" v-if="sortIndex == index"></text>
			</view>
		</view>
		<view class="search-box">
			<view class="ctn">
				<view class="hx-search-box">
					<text class="cuIcon-search" style="color: #666;font-size: 22;"></text>
					<input @input="goSearch" v-model="searchVal" type="text" placeholder="输入搜索关键词" value="" />
				</view>
			</view>
		</view>
		<view class="filtrate-item-wrap">
			<view class="filtrate-item">
				<view style="display: flex;  flex-flow: wrap;">
					<view @click="chooseMenu(cate)" v-for="(cate, index) in classify" :key="cate.label" :class="{ 'cate-active': currentType === cate.label }"
					 class="filtrate-item-right">
						<text>{{ cate.label }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="container margin-top sort-box">
			<view class="item-box" v-for="(item, i) in sortList" :key="i">
				<view @click="tapTitItem(item, i)" class="tit" :class="{ active: sortIndex == i }">
					<text>{{ item.tit }}</text>
				</view>
			</view>
		</view>
		<view class="store-box" v-if="storeList && current_tit.type === 'find'">
			<sPullScroll ref="pullScroll" heightStyle="calc(100vh-620upx)" :pullDown="pullDown" :pullUp="loadData"
			 :enablePullDown="true" :enablePullUp="true" :top="340" :fixed="true" :bottom="0" finishText="我是有底线的...">
				<view @click="toShopDetail(store)" class=" item-box" v-for="(store, i) in storeList" :key="i">
					<view class="container top-box">
						<view class="left">
							<image v-if="!store.image" src="http://imgs.1op.cn/i/hxshop/goods/14.jpg" mode="aspectFill"></image>
							<image v-else :src="store.imgurl" mode="aspectFill"></image>
						</view>
						<view class="right">
							<text class="tit">{{ store.name ? store.name : '' }}</text>
							<view class="column store-r-b" v-if="store.type === '饭馆'">
								<view class="store-r-b-t">
									<text class="cuIcon-favorfill"></text>
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
		<view class=" store-box" v-else-if="current_tit.type === 'shop'">
			<sPullScroll ref="pullScroll" heightStyle="calc(100vh-620upx)" :pullDown="pullDown" :pullUp="loadData"
			 :enablePullDown="true" :enablePullUp="true" :top="340" :fixed="true" :bottom="0" finishText="我是有底线的...">
				<view @click="toShopDetail(store)" class=" item-box" v-for="(store, i) in myStoreList" :key="i">
					<view class="container top-box">
						<view class="left">
							<image v-if="!store.image" src="http://imgs.1op.cn/i/hxshop/goods/14.jpg" mode="aspectFill"></image>
							<image v-else :src="store.imgurl" mode="aspectFill"></image>
						</view>
						<view class="right">
							<text class="tit">{{ store.name }}</text>
							<view class="column store-r-b store-r-b-my" v-if="store.type === '饭馆'">
								<view class="store-r-b-t">
									<text class="cuIcon-favorfill"></text>
									<text>{{ store.grade }}</text>
								</view>
								<view class="store-r-b-b">
									<text>月售{{ store.sale_num }}</text>
								</view>
							</view>
							<view class="store-r-b-b">
								<text>地址:</text>
								<text>{{ store.address ? store.address : '暂无地址' }}</text>
							</view>
							<!-- 	<view class="del-shop">
								<text @click.stop="del(store)">删除</text>
								<text @click.stop="amend(store)">修改</text>
							</view> -->
						</view>
					</view>
				</view>
			</sPullScroll>
		</view>
		<view class="footzw"></view>
	</view>
</template>

<script>
	//引入测试数据
	import {
		vuex
	} from 'vue';
	import sPullScroll from '@/components/s-pull-scroll';
	export default {
		components: {
			sPullScroll
		},
		data() {
			return {
				classify: [{
						label: '全部',
						value: '全部'
					},
					{
						label: '饭馆',
						value: '饭馆'
					},
					{
						label: '水果店',
						value: '水果店'
					},
					{
						label: '健身房',
						value: '健身房'
					},
					{
						label: '诊所',
						value: '诊所'
					},
					{
						label: '医院',
						value: '医院'
					},
					{
						label: '体检中心',
						value: '体检中心'
					},
					{
						label: '药店',
						value: '药店'
					},
					{
						label: '孕婴店',
						value: '孕婴店'
					},
					{
						label: '健康服务',
						value: '健康服务'
					}
					// { label: '其他', value: '其他' }
				],
				currentType: '全部',
				isLogin: false, //是否已经登录
				searchVal: '', //搜索内容
				heightStyle: 'calc(100vh-620upx)',
				pageInfo: {
					total: 0,
					rownumber: 8,
					pageNo: 1
				},
				//显示没有更多商户
				downOption: {
					auto: false //是否在初始化后,自动执行downCallback; 默认true
				},
				sortIndex: 0,
				sortList: [{
					tit: '发现',
					type: 'find'
				}, {
					tit: '我的',
					type: 'shop'
				}],
				myStoreList: [], //当前登录人得商铺列表
				// current_tit: {
				// 	tit: '我的',
				// 	type: 'shop'
				// }, 
				//当前点击顶部分类
				current_tit: {
					tit: '发现',
					type: 'find'
				},
				storeList: [],
				shopList: []
			};
		},
		async created() {
			let self = this;
			uni.$on('loginStatusChange', result => {
				self.isLogin = result;
			});
			self.isLogin = true;
			this.onRefresh();
			this.getShopList();
		},

		methods: {
			chooseMenu(e) {
				if (e && e.label) {
					this.currentType = e.label;
				} else {
					this.currentType = 'e.label';
				}
				this.onRefresh();
			},
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
				if (this.current_tit.type === 'find') {
					this.getShopList();
				} else if (this.current_tit.type === 'shop') {
					this.getMyShopList();
				}
			},
			amend(item) {
				let fieldsCond = [{
					column: 'id',
					value: item.id
				}];
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
				let req = [{
					serviceName: 'srvhealth_restaurant_mgmt_delete',
					colNames: ['*'],
					condition: [{
						colName: 'id',
						ruleType: 'in',
						value: item.id
					}]
				}];
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
				if (this.current_tit.type === 'find') {
					this.getShopList('search', this.searchVal);
				} else if (this.current_tit.type === 'shop') {
					this.getMyShopList('search', this.searchVal);
				}
			},
			/* 点击顶部切换商铺和我得商铺列表**/
			tapTitItem(item, i) {
				this.current_tit = item;
				this.sortIndex = i;
				this.currentType = '全部';
				this.onRefresh();
				console.log('点击顶部切换===》', item);
			},
			/*跳转至商铺详情*/
			toShopDetail(item) {
				if (['诊所', '医院', '健康服务'].includes(item.type)) {
					uni.navigateTo({
						url: '/pediaPages/hospitalOverview/hospitalOverview?store_no=' + item.store_no
					});
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
					req.condition = [{
						colName: 'name',
						ruleType: 'like',
						value: search_val
					}];
				}
				if (this.currentType && this.currentType !== '全部') {
					req.condition.push({
						colName: 'type',
						ruleType: 'eq',
						value: this.currentType
					});
				}
				let res = await this.$http.post(url, req);
				if (res.data.resultCode === '0011') {
					this.isLogin = false;
					const result = await wx.login();
					if (result.code) {
						this.code = result.code;
						await this.wxLogin({
							code: result.code
						});
						this.isLogin = true;
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
								let urls = self.$api.downloadFile + item.image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket') +
									'&thumbnailType=fwsu_100';
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
					condition: [{
						colName: 'create_user',
						ruleType: 'eq',
						value: uni.getStorageSync('login_user_info').user_no
					}],
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
				if (this.currentType && this.currentType !== '全部') {
					req.condition.push({
						colName: 'type',
						ruleType: 'eq',
						value: this.currentType
					});
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
							let urls = self.$api.downloadFile + item.image + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket') +
								'&thumbnailType=fwsu_100';
							this.$set(item, 'imgurl', urls);
						}
					});
					this.myStoreList = [...this.myStoreList, ...res.data.data];
					if (this.myStoreList.length == 0) {
						this.current_tit = {
							tit: '商户',
							type: 'shop'
						};
						this.getShopList();
					}
				}
			},
			/*新增商铺**/
			addShop() {
				let fieldsCond = [{
					column: 'address',
					fieldType: 'location'
				}];
				uni.navigateTo({
					url: `/publicPages/newForm/newForm?serviceName=srvhealth_restaurant_mgmt_add&type=add&fieldsCond=${encodeURIComponent(JSON.stringify(fieldsCond))}`
				});
			}
		}
	};
</script>

<style lang="scss">
	.filtrate-item-wrap {
		background-color: white;

		.filtrate-item {
			display: flex;
			min-height: 100rpx;
			align-items: center;
			padding: 10rpx 20rpx;

			.filtrate-item-right {
				padding: 5rpx 20rpx;
				background-color: #f1f1f1;
				border-radius: 50rpx;
				display: flex;
				margin: 0 10rpx 10rpx 0;
				justify-content: center;
				border: 2rpx solid #f1f1f1;
				transition: all 0.5s;

				&:active {
					transform: scale(1.2);
				}
			}

			.cate-active {
				border-color: #0bc99d;
				color: #0bc99d;
				background-color: rgba($color: #0bc99d, $alpha: 0.1);
			}
		}

		.padding-filtrate-item {
			padding: 30rpx 0;
		}
	}

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

	.search-box {
		position: sticky;
		top: 0;
		z-index: 2;
		background-color: #fff;

		.ctn {
			border-top-left-radius: 50upx;
			border-top-right-radius: 50upx;
			padding: 5px 10px 10px;

			.hx-search-box {
				border-radius: 5px;
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

	.footzw {
		/* #ifdef H5*/
		height: 50px;
		/* #endif */
	}

	.add-button {
		position: fixed;
		bottom: calc(20px + var(--window-bottom));
		left: calc(50% - 50upx);
		width: 100upx;
		height: 100upx;
		border-radius: 50%;
		background-color: rgb(246, 210, 0);
		z-index: 10;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 24px;
		color: white;
	}
</style>
