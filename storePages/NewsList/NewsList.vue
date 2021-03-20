<template>
	<view>
		<view class="news-list">
			<view class="news-item" v-for="item in list" :key="item.content_no">
				<!-- <image class="logo" src="" mode=""></image> -->
				<view class="news-title">
					<text class="cuIcon-titles"></text>
					{{item.title}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				no: '', //栏目编码
				page: {
					rownumber: 20,
					pageNo: 1,
					total: 0
				},
				list: []
			};
		},
		methods: {
			/**
			 * @description 查找公告列表
			 * @param {string} - type 加载类型 refresh:刷新 ，loadmore:加载更多   
			 */
			getList(type = 'refresh') {
				let req = {
					"serviceName": "srvdaq_cms_content_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "no",
						"ruleType": "like",
						"value": this.no
					}],
					"page": {
						"pageNo": this.page.pageNo,
						"rownumber": this.page.rownumber
					},
				}
				if (this.no) {
					this.$fetch('select', 'srvdaq_cms_content_select', req, 'daq').then(res => {
						if (res.success) {
							if (res.page) {
								if (res.page.pageNo === 1) {
									this.list = res.data
								} else {
									this.list = [...this.list, ...res.data]
								}
							}
						}
					})
				}
			},
		},
		onReachBottom() {
			
		},
		onPullDownRefresh() {
			this.getList()
			setTimeout(()=>{
				uni.stopPullDownRefresh()
			},1500)
		},
		onLoad(option) {
			if (option.no) {
				this.no = option.no
				this.getList()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.news-list{
		padding: 20rpx;
		.news-item{
			font-weight: bold;
			padding: 20rpx;
			margin-bottom: 20rpx;
			background-color: #fff;
			border-radius: 10rpx;
		}
	}
.news-title{}
</style>
