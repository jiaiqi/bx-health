<template>
	<view class="article-wrap">
		<view class="header">
			<!-- 	<u-search placeholder="输入关键词进行搜索" :animation="true" v-model="keyword" shape="square" @custom="searchWithKeywords"></u-search> -->
			<view class="title" v-if="tabList.length > 1">
				<!-- <u-tabs name="title" :list="tabList" :is-scroll="true" :current="showType" @change="changeShowType"></u-tabs> -->
				<!-- 	<view class="tab-item" @tap="changeShowType(index)" :class="showType == index ? 'activeContent' : ''" v-for="(item, index) in tabList" :key="item.title">
					<view :class="showType == index ? 'activeTitle' : ''" class="tab-title">{{ item.title }}</view>
					<view :class="showType == index ? 'activeHr' : ''" class="hr"></view>
				</view> -->
			</view>
		</view>
		<!-- 多个tab切换的时候，注意插件的isTab属性， 它可以用来防止两个tab之间用手滑动时造成的误操作-->
		<swiper :current="showType" @change="onChange" class="container">
			<swiper-item class="swiper-item" v-for="(item, index) in tabList" :key="index">
				<article-list @touchmove.stop.prevent class="article-list" :ref="'articleList'" @clickListItem="clickListItem" :tabNo="item.no"></article-list>
			</swiper-item>
		</swiper>
		<!-- <u-tabbar v-model="currentNav" :list="navList" :mid-button="true" :before-switch="switchNav"></u-tabbar> -->
	</view>
</template>

<script>
import articleList from '@/otherPages/articleList/articleList';
export default {
	components: {
		articleList
	},
	data() {
		return {
			currentNav: 3,
			pageInfo: {
				pageNo: 1,
				rownumber: 10,
				total: 0
			},
			navList: [
				{
					iconPath: 'home',
					selectedIconPath: 'home-fill',
					text: '首页',
					// count: 2,
					isDot: true,
					customIcon: false
				},
				{
					iconPath: 'heart',
					selectedIconPath: 'heart-fill',
					text: '健康',
					customIcon: false
				},
				{
					iconPath: 'https://cdn.uviewui.com/uview/common/min_button.png',
					selectedIconPath: 'https://cdn.uviewui.com/uview/common/min_button_select.png',
					text: '记录',
					midButton: true,
					customIcon: false
				},
				{
					iconPath: 'grid',
					selectedIconPath: 'grid-fill',
					text: '发现',
					customIcon: false
				},
				{
					iconPath: 'account',
					selectedIconPath: 'account-fill',
					text: '我的',
					// count: 23,
					isDot: false,
					customIcon: false
				}
			],
			keyword: '', // 搜索关键词
			showType: 0,
			tabList: []
		};
	},
	computed: {
		// listHeight() {
		// 	return
		// }
	},
	methods: {
		clickListItem(e) {
			console.log(e);
			//
			uni.navigateTo({
				url: '/pages/articleDetail/articleDetail?content_no=' + e.content_no
			});
		},
		async getTabList() {
			let app = 'daq';
			let url = this.getServiceUrl(app, 'srvdaq_page_item_tablist_select', 'select');
			let req = {
				serviceName: 'srvdaq_page_item_tablist_select',
				colNames: ['*'],
				// condition: [{ colName: 'item_no', ruleType: 'eq', value: 'PIT2020042808490019' }],
				page: { pageNo: 1, rownumber: 5 }
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				this.tabList = res.data.data.map(item => {
					return {
						title: item.tablist_name,
						no: item.no
					};
				});
			}
		},
		searchWithKeywords() {
			let params = {
				keyword: this.keyword,
				cond: [
					{
						colName: 'no',
						ruleType: 'eq',
						value: this.tabList[this.showType].no
					}
				]
			};
			this.$refs['articleList'][this.showType].getListData(1, params);
			// this.keyword = ''
		},
		switchNav(e) {
			// console.log(e)
			if (e === 0) {
			} else if (e === 1) {
				uni.redirectTo({
					url: '/pages/home/home',
					fail() {
						uni.navigateTo({
							url: '/archivesPages/old-home/old-home'
						});
					}
				});
			} else if (e === 2) {
			} else if (e === 3) {
				uni.redirectTo({
					url: '/pages/article/article'
				});
			} else if (e === 4) {
			}
			return true;
			// this.currentTab = e
		},

		/* 切换显示内容 */
		changeShowType(type) {
			this.showType = type;
		},
		/* 手动滑动swiper触发的事件 */
		onChange(e) {
			let params = {
				keyword: '',
				cond: [
					{
						colName: 'no',
						ruleType: 'eq',
						value: this.tabList[this.showType].no
					}
				]
			};
			this.showType = e.detail.current;
			this.$refs['articleList'][e.detail.current].getListData(1, params);
			// this.showType = e.detail.current + 1;
		}
	},
	mounted() {
		this.getTabList();
	},
	onLoad() {
		// this.getTabList()
	}
};
</script>

<style scoped lang="scss">
.article-wrap {
	width: 100%;
	height: 100vh;
	.header {
		height: 150rpx;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #fff;
		border: 1px solid #f1f1f1;
		overflow-y: hidden;
		padding-top: 10rpx;
		.u-search {
			width: 95%;
			margin: 0 auto;
		}
		.title {
			width: 100%;
			display: flex;
			overflow-y: scroll;
			.u-tabs {
				width: calc(100vw - 40rpx);
				margin: 0 auto;
			}
			.tab-item {
				flex: 1;
				margin-right: 10rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				flex-direction: column;
				padding: 10rpx 0;
				min-width: 120rpx;
				.activeTitle {
					color: #0081ff;
				}
				.hr {
					border: 2px solid #fff;
					margin: 5rpx;
					width: 30rpx;
				}
				.activeHr {
					border: 2px solid #0081ff;
				}
			}
		}
	}
	swiper {
		width: 100%;
		/* #ifdef H5 */
		// height: calc(100vh - 100rpx - 44px);
		height: calc(100vh - 260rpx);
		/* #endif */

		/* #ifdef APP-PLUS */
		height: calc(100vh - 260rpx);
		/* #endif */

		/* #ifdef MP-WEIXIN */
		height: calc(100vh - 260rpx);
		/* #endif */
		background: #ffffff;
	}
	swiper-item {
		width: 100%;
		height: 100%;
	}
}
</style>
