<template>
	<view class="list-wrap">
		<view class="news" v-for="cate in noticeList" :key="cate.no" v-show="cate.list.length>0">
			<view class="title">
				<view class="">
					<text class="cuIcon-titles text-blue"></text>
					<text class="text-bold " style="font-size: 16px;">{{cate.name}}</text>
				</view>
				<view class="to-more" @click="toMore(cate)">
					<text class="cuIcon-right text-grey" v-if="cate.list.length>2"></text>
				</view>
			</view>
			<view class="content news-list">
				<view class="news-item" :class="{
						'none-image':!item.icon_image,
						'layout-right-image':item.icon_image,
						'layout-left-image':item.cover_pic_style==='左侧'&&item.icon_image,
						'layout-center-single-image':item.cover_pic_style==='下一'&&item.icon_image,
						'layout-center-multi-image':item.cover_pic_style==='下三'&&item.icon_image
						}" v-for="(item,noticeIndex) in cate.list" :key="noticeIndex" @click="toArticle(item)">
					<image mode="aspectFill" class="image-icon" :src="getImagePath(item.icon_image,true)"
						v-if="item.icon_image">
					</image>
					<view class="content-box">
						<text class="title-text">
							<text>{{ item.title }}</text>
							<text class="text-red cuIcon-hotfill"
								v-if="item&&item.other_status&&item.other_status==='热门'">hot</text>
							<text class="line-red" v-if="item&&item.other_status&&item.other_status==='精选'">精选</text>
							<text class="line-red" v-if="item&&item.top_status&&item.top_status==='是'">置顶</text>
						</text>
						<text class="date">{{ formateDate(item.create_time) }}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				noticeList: []
			}
		},
		props: {
			storeInfo: {
				type: Object
			},
			website_no: {
				type: String
			},
		},
		methods: {
			toMore(e) {
				if (e.no) {
					let url = `/publicPages/articleList/articleList?cateNo=${e.no}`
					if (e.name) {
						url += `&cate_name=${e.name}`
					}
					uni.navigateTo({
						url: url
					})
				}
			},
			toArticle(e) {
				if (e.content_no) {
					let url =
						`/publicPages/article/article?serviceName=srvdaq_cms_content_select&content_no=${e.content_no}`
					if (this.storeInfo && this.storeInfo.name) {
						url += `&store_name=${this.storeInfo.name}`
					}
					if (this.storeInfo.store_no) {
						url += `&store_no=${this.storeInfo.store_no}`
					}
					uni.navigateTo({
						url: url
					});
				}
			},
			getNotice() {
				let req = {

					condition: [{
							colName: 'website_no',
							ruleType: 'eq',
							value: this.website_no
						},
						{
							colName: 'is_leaf',
							ruleType: 'eq',
							value: '是'
						}
					]
				};
				this.$fetch('select', 'srvdaq_cms_category_select', req, 'daq').then(cate => {
					if (cate.success && cate.data.length > 0) {
						let types = cate.data.reduce((pre, cur) => {
							let obj = {
								name: cur.cate_name,
								no: cur.no,
								list: []
							}
							pre.push(obj)
							return pre
						}, [])
						// this.noticeList = types
						let req = []
						if (types.length > 0) {
							types.forEach(type => {
								let obj = {
									//查询请求1
									colNames: ["*"],
									condition: [{
											colName: 'no',
											ruleType: 'eq',
											value: type.no
										},
										{
											colName: 'content_status',
											ruleType: 'eq',
											value: '发布'
										}
									],
									order: [{
										colName: "top_status",
										orderType: "desc"
									}, {
										colName: "other_status",
										orderType: "desc"
									}, {
										colName: "create_time",
										orderType: "desc"
									}],
									page: {
										pageNo: 1,
										rownumber: 3
									},
									serviceName: "srvdaq_cms_content_select"
								}
								req.push(obj)
							})
						}
						this.$fetch('multi', 'select', req, 'daq').then(res => {
							if (res.success) {
								res.data.forEach((item, index) => {
									if (item.state === "SUCCESS") {
										types[index].list = item.data
										// this.$set(this.noticeList, key, types[key])
									}
								})
								this.noticeList = types
							}
						})
					}
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.list-wrap {
		// 简介
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		margin-bottom: 20rpx;

		.news {
			padding: 20rpx;
			margin-bottom: 10px;
			background-color: #fff;
		}

		.title {
			font-size: 28rpx;
			font-weight: 700;
			padding: 10rpx 0;
			color: rgb(48, 49, 51);
			display: flex;
			justify-content: space-between;

			.to-more {
				width: 100rpx;
				display: flex;
				justify-content: flex-end;
				align-items: center;
			}

			.cuIcon-right {
				font-weight: 200;
			}
		}

		.news-list {
			.news-item {
				display: flex;
				padding: 20rpx 0;
				border-bottom: 1rpx solid #f1f1f1;
				align-items: center;

				.title-text {
					width: 70%;
					overflow: hidden;
					text-overflow: ellipsis;
					// white-space: nowrap;
					font-size: 32rpx;
					padding-bottom: 20rpx;

					.text-red {
						display: inline-block;
						margin-left: 10rpx;
						font-size: 24rpx;
						position: relative;
						top: -10rpx;
						font-weight: bold;
					}

					.line-red {
						border-radius: 5px;
						margin-left: 10rpx;
						padding: 2px 4px;
						font-size: 12px;
						font-weight: bold;
						border: 1rpx solid #e54d42;
					}
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

					.content-box {
						height: auto;
						min-height: 50rpx;
					}

					.title-text {
						font-size: 16px;
						width: 100%;
						white-space: normal;
					}

					.date {
						font-size: 12px;
					}
				}

				&.layout-center-single-image,
				&.layout-center-single-image-top {
					flex-direction: column-reverse;
					border-radius: 10rpx;
					padding: 0;
					border: none;
					overflow: hidden;
					box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
					margin-bottom: 20rpx;

					.image-icon {
						width: 100%;
						height: 200rpx;
					}

					.content-box {
						padding: 10rpx 20rpx;
						width: 100%;
						display: flex;
						flex-direction: row;

						.title-text {
							font-weight: bold;
							margin-left: 0;
							width: calc(100% - 250rpx);
							flex: 1;
						}
					}
				}

				&.layout-center-single-image-top {
					flex-direction: column;
				}

				&.layout-right-image,
				&.layout-left-image {
					// 左图
					flex-direction: row;
					flex-wrap: wrap;

					.content-box {
						min-height: 150rpx;
						width: calc(100% - 250rpx);
					}

					.image-icon {
						width: 200rpx;
						height: 150rpx;
						border-radius: 5px;
					}

					.title-text {
						margin-left: 20rpx;
						flex: 1;
						width: 100%;
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
					}

					.date {
						margin-left: 0;
					}
				}
			}
		}
	}
</style>
