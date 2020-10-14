<template>
	<!-- @touchmove.stop.prevent是为了阻止手机默认的滑动事件 -->
	<hr-pull-load
		@refresh="refresh"
		@loadMore="loadMore"
		:height="-1"
		:pullHeight="50"
		:maxHeight="100"
		:lowerThreshold="20"
		:bottomTips="bottomTips"
		:isTab="false"
		:isAllowPull="true"
		ref="hrPullLoad"
	>
		<!-- 插入自己的数据-->
		<view class="list" v-for="(item, index) in listData" :key="index">
			<view
				class="list-item"
				:class="{ 'card-1': index % 7 === 0 && index / 7 > 1, 'card-2': index % 3 === 0, 'card-3': index % 6 === 0 && index / 3 > 1 }"
				@click="clickItem(item)"
			>
				<view class="content">
					<view class="title">{{ item.title }}</view>
					<view class="footer">
						<view class="origin">{{ item.origin }}</view>
						<view class="time">{{ item.date }}</view>
					</view>
				</view>
				<view class="images">
					<view class="image"></view>
					<view class="image" v-if="index % 6 === 0 && index / 3 > 1"></view>
					<view class="image" v-if="index % 6 === 0 && index / 3 > 1"></view>
					<view class="image" v-if="index % 6 === 0 && index / 3 > 1"></view>
				</view>
			</view>
		</view>
	</hr-pull-load>
</template>

<script>
import hrPullLoad from '@/components/hr-pull-load/hr-pull-load.vue';
export default {
	data() {
		return {
			exampleInfo: [],
			bottomTips: '',
			currentPage: 1,
			listHeight: -1,
			listData: [
				// {
				// 	title: '食以安为先！请收好这份夏季食品安全提示~',
				// 	origin: '全民健康',
				// 	date: '39分钟前'
				// },
				// {
				// 	title: '古人怎么保养自己的呢？学会这些你也可以做到',
				// 	origin: '中医养生杂志',
				// 	date: '39分钟前'
				// },
				// {
				// 	title: '夏末秋初就要吃芋头！和胃健脾、补气益肾、消炎镇痛、解毒散结',
				// 	origin: '医说健康',
				// 	date: '39分钟前'
				// },
				// {
				// 	title: '高纤维食物排行榜',
				// 	origin: 'xx医院',
				// 	date: '39分钟前'
				// },
				// {
				// 	title: '夏季厌食、肢体困重还胸闷气短？别急，4样日常食材来帮忙',
				// 	origin: '健康百科',
				// 	date: '39分钟前'
				// },
				// {
				// 	title: '经常膝盖疼，多半是4个原因！6个方法可缓解膝盖疼痛，不妨试试~',
				// 	origin: '光明营养课堂',
				// 	date: '39分钟前'
				// }
			]
		};
	},
	props: {
		tabNo: {
			type: String,
			default: ''
		}
	},
	components: {
		hrPullLoad
	},
	onLoad() {
		// this.getListData(1);
	},
	mounted() {
	this.getListData(1);
	},
	methods: {
		clickItem(e) {
			this.$emit('clickListItem', e);
		},
		async getArticleList(e) {
			let keyword = '';
			let cond = [];
			if (e) {
				keyword = e.keyword;
				cond = e.cond;
			}
			let app = 'daq';
			let url = this.getServiceUrl(app, 'srvdaq_cms_content_select', 'select');
			let req = {
				serviceName: 'srvdaq_cms_content_select',
				colNames: ['*'],
				condition: [],
				page: { pageNo: 1, rownumber: 10 }
			};
			if (cond && Array.isArray(cond)) {
				req.condition = req.condition.concat(cond);
			}
			if (this.tabNo) {
				req.condition = req.condition.concat([
					{
						colName: 'no',
						ruleType: 'eq',
						value: this.tabNo
					}
				]);
			}
			if (keyword) {
				req.condition.push({
					colName: 'title',
					ruleType: 'like',
					value: keyword
				});
			}
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				this.listData = res.data.data;
				// return res.data.data;
				return this.listData;
			}
		},
		/* 调用接口从后台获取数据，这里的逻辑处理大家可以参考，具体的处理大家可以自定义，需要注意的是：
			1.bottomTips用来控制触发加载更多时的提示
			2.this.$refs.hrPullLoad.reSet()用来重置下拉刷新状态
			*/
		async getListData(type, params) {
			/* type 1代表下拉刷新 2代表加载更多 */
			/* 接口获取到的数据 */
			let data = await this.getArticleList(params);
			// setTimeout(() => {
			// this.deepClone(this.listData);
			/* 拿到数据后的处理 */
			if (data.length > 0) {
				if (type == 1) {
					this.listData = data;
				} else if (type == 2) {
					this.listData = this.listData.concat(data);
				}
				/* 这里的10是每次调用后台接口返回的最大数据条数，可以自定义 */
				if (data.length < 10) {
					this.bottomTips = 'nomore';
				} else {
					this.bottomTips = 'more';
				}
			} else {
				if (type == 1) {
					this.listData = [];
				} else if (type == 2) {
					this.currentPage--;
				}
				this.bottomTips = 'nomore';
			}
			/* 这里300毫秒的延时，主要是为了优化视觉效果 */
			setTimeout(() => {
				this.$refs.hrPullLoad.reSet();
			}, 300);
			// }, 500);
		},
		//自定义上拉加载更多
		loadMore() {
			this.currentPage++;
			this.bottomTips = 'loading';
			this.getListData(2);
		},
		//自定义下拉刷新
		refresh() {
			this.currentPage = 1;
			this.getListData(1);
		}
	}
};
</script>

<style lang="scss" scoped>
.article-list {
	height: 100%;
	background-color: #fff;
	.list {
		width: 100%;
		padding: 0 10rpx;
		.list-item {
			/*默认布局 左边标题 右边单张图片*/
			width: 100%;
			display: flex;
			padding: 10rpx 0;
			border-bottom: 1rpx solid #f1f1f1;
			.images {
				.image {
					width: 200rpx;
					height: 150rpx;
					background-color: #f1f1f1;
					border-radius: 10rpx;
				}
			}
			.content {
				flex: 1;
				display: flex;
				flex-direction: column;
				padding-right: 10rpx;
				.title {
					font-weight: 700;
					flex: 1;
				}
				.footer {
					font-size: 24rpx;
					display: flex;
					color: #999;
					.origin {
						margin-right: 20rpx;
					}
				}
			}
			&.card-1 {
				/*card-1 右边边标题 左边单张图片*/
				flex-direction: row-reverse;
				.content {
					padding: 0;
					padding-left: 10rpx;
				}
			}
			&.card-2 {
				/*card-2 上面标题 下面100%宽度大图*/
				flex-direction: column;
				border-bottom: none;
				.content {
					padding: 0;
					.title {
						padding-top: 10rpx;
					}
					.footer {
						padding-top: 10rpx;
						display: flex;
						justify-content: space-between;
					}
				}
				.images {
					.image {
						width: 100%;
						height: 300rpx;
						margin-top: 10rpx;
					}
				}
			}
			&.card-3 {
				/*card-3 上面标题 下面多张32%宽度的小图*/
				flex-direction: column;
				border-bottom: none;
				.content {
					padding: 0;
				}
				.images {
					width: 100%;
					display: flex;
					flex-wrap: wrap;
					.image {
						margin-right: 10rpx;
						width: calc(100% / 3 - 10rpx);
						height: 200rpx;
						&:nth-child(1) {
							margin-left: 5rpx;
						}
						&:nth-child(4) {
							margin-left: 5rpx;
						}
						&:nth-child(7) {
							margin-left: 5rpx;
						}
						&:nth-child(3) {
							margin-right: 5rpx;
						}
						&:nth-child(6) {
							margin-right: 5rpx;
						}
						&:nth-child(9) {
							margin-right: 5rpx;
						}
					}
				}
			}
		}
	}
}
</style>
