<template>
	<view class="article-list">
		<view class="action margin-top-xs" v-if="config.item_label">
			<text class="cuIcon-titles text-cyan"></text>
			<text class="text-bold">{{ config.item_label }}</text>
		</view>
		<u-tabs :list="tabs" :is-scroll="true" activeColor="#0bc99d" ref="tabs" :current="current" @change="changeTab"
			v-if="tabs.length>1"></u-tabs>
		<view class="content news-list">
			<view class="news-item none-image" :class="{
						'layout-right-image':item.cover_pic_style==='右侧',
						'layout-left-image':item.cover_pic_style==='左侧',
						'layout-center-single-image':item.cover_pic_style==='下一',
						'layout-center-multi-image':item.cover_pic_style==='下三'
						}" v-for="item in list" @click="toDetail(item)">
				<image class="image-icon" :src="getImagePath(item.icon_image)" v-if="item.icon_image">
				</image>
				<view class="content-box">
					<text class="title-text">{{ item.title }}</text>
					<text class="date">{{ formateDate(item.create_time) }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				current: 0,
				tabs: [],
				list: []
			};
		},
		props: {
			config: {
				type: Object
			}
		},
		methods: {
			getTabContent() {
				let req = {
					condition: [{
						colName: 'no',
						ruleType: 'like',
						value: this.tabs[this.current].no
					}],
					page: {
						pageNo: 1,
						rownumber: 5
					}
				};
				this.$fetch('select', 'srvdaq_cms_content_select', req, 'daq').then(res => {
					if (res.success) {
						this.list = res.data;
					}
				});
			},
			toDetail(e) {
				uni.navigateTo({
					url: '/publicPages/article/article?content_no=' + e.content_no
				})
			},
			changeTab(e) {
				this.current = e;
			}
		},
		created() {
			if (Array.isArray(this.config.tablist) && this.config.tablist.length > 0) {
				this.tabs = this.config.tablist.map(item => {
					item.name = item.tablist_name;
					return item;
				});
				this.getTabContent();
			}
		}
	};
</script>

<style scoped lang="scss">
	.content.news-list {
		padding: 20rpx;

		.news-item {
			display: flex;
			padding: 10rpx 0;
			border-bottom: 1rpx solid rgba($color: #f1f1f1, $alpha: 0.5);
			align-items: center;

			.title-text {
				width: 70%;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			.content-box {
				flex: 1;
				display: flex;
				flex-direction: column;
			}

			.date {
				color: #ccc;
			}

			&.none-image {
				// 无图
				flex-direction: column;
				align-items: flex-start;

				.image-icon {
					width: 200rpx;
					height: 150rpx;
					border-radius: 5px;
				}

				.title-text {
					font-size: 16px;
					width: 100%;
					white-space: normal;
					margin-bottom: 10px;
				}

				.date {
					font-size: 12px;
				}
			}

			&.layout-right-image,
			&.layout-left-image {
				// 左图
				flex-direction: row;
				flex-wrap: wrap;

				.content-box {
					min-height: 150rpx;
				}

				.image-icon {
					width: 200rpx;
					height: 150rpx;
					border-radius: 5px;
				}

				.title-text {
					margin-left: 20rpx;
					width: calc(100% - 250rpx);
					flex: 1;
				}

				.date {
					margin-left: 20rpx;
				}
			}

			&.layout-right-image {
				// 右图
				flex-direction: row-reverse;

				.title-text {
					margin-left: 0;
					width: calc(100% - 250rpx);
					flex: 1;
				}

				.date {
					margin-left: 0;
				}
			}
		}
	}
</style>
