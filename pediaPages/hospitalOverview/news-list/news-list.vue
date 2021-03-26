<template>
	<view class="list-wrap">
		<view class="news" v-for="cate in noticeList" :key="cate.no" v-show="cate.list.length>0">
			<view class="title">
				<view class="">
					<text class="cuIcon-titles text-blue"></text>
					<text class="text-bold " style="font-size: 16px;">{{cate.name}}</text>
				</view>
				<text class="cuIcon-right text-grey" v-if="cate.list.length>3"></text>
			</view>
			<view class="content news-list">
				<view class="news-item none-image" :class="{
						'layout-right-image':item.cover_pic_style==='右侧',
						'layout-left-image':item.cover_pic_style==='左侧',
						'layout-center-single-image':item.cover_pic_style==='下一',
						'layout-center-multi-image':item.cover_pic_style==='下三'
						}" v-for="(item,noticeIndex) in cate.list" :key="noticeIndex" @click="toArticle(item)">
					<image class="image-icon" :src="getImagePath(item.icon_image)" v-if="item.icon_image">
					</image>
					<view class="content-box">
						<text class="title-text">{{ item.title }}</text>
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
		// onShow() {
		// 	this.getNotice()
		// },
		// created() {
		// 	this.getNotice()
		// },
		methods: {
			toArticle(e) {
				if (e.content_no) {
					let url =
						`/publicPages/article/article?serviceName=srvdaq_cms_content_select&content_no=${e.content_no}`
					if (this.storeInfo && this.storeInfo.name) {
						url += `&store_name=${this.storeInfo.name}`
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
									}],
									order: [{
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
								debugger
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
			border-bottom: 1rpx solid #f1f1f1;

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
	}
</style>
