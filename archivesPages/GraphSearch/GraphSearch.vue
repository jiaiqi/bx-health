<template>
	<view class="graph-search">
		<view class="cu-bar bg-white search">
			<view class="search-form radius">
				<text class="cuIcon-search"></text>
				<!-- <text class="cuIcon-searchlist"></text> -->
				<input @input="valueChange" :adjust-position="false" type="text" confirm-type="search" />
			</view>
		</view>
		<view class="hot-search-box" v-if="nodeList.length === 0">
			<view class="title">热搜</view>
			<view class="content">
				<view class="li" v-for="(item, index) in hotNodes" :key="item.id" @click="toGraphPages(item)">
					<text class="xu-hao">{{ index + 1 }}</text>
					<text class="text">{{ item.node_name }}</text>
				</view>
			</view>
		</view>
		<view class="result-box">
			<view class="node-item" v-for="item in nodeList" :key="item.id" @click="toGraphPages(item)">
				<text>{{ item.node_name }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nodeList: [],
			hotNodes: []
		};
	},
	onShow() {
		this.selectHotNode();
	},
	methods: {
		valueChange(e) {
			if (e.detail.value) {
				this.searchNode(e.detail.value);
			} else {
				this.nodeList.length = 0;
				this.nodeList = [];
			}
		},
		selectHotNode() {
			let url = this.getServiceUrl('health', 'srvhealth_knowledge_node_select', 'select');
			let req = {
				serviceName: 'srvhealth_knowledge_node_select',
				colNames: ['*'],
				page: { pageNo: 1, rownumber: 10 },
				order: [{ colName: 'search_times', orderType: 'desc' }]
			};
			this.$http.post(url, req).then(res => {
				if (Array.isArray(res.data.data)) {
					this.hotNodes = res.data.data;
				}
			});
		},
		updateSearchTimes(no, times) {
			let url = this.getServiceUrl('health', 'srvhealth_knowledge_node_update', 'operate');
			let req = [{ serviceName: 'srvhealth_knowledge_node_update', condition: [{ colName: 'kn_no', ruleType: 'eq', value: no }], data: [{ search_times: times }] }];
			this.$http.post(url, req);
		},
		searchNode(name) {
			let url = this.getServiceUrl('health', 'srvhealth_knowledge_node_select', 'select');
			let req = {
				serviceName: 'srvhealth_knowledge_node_select',
				colNames: ['*'],
				condition: [{ colName: 'node_name', ruleType: 'like', value: name }],
				page: { pageNo: 1, rownumber: 30 }
			};
			this.$http.post(url, req).then(res => {
				if (Array.isArray(res.data.data)) {
					this.nodeList = res.data.data;
				}
			});
		},
		toGraphPages(item) {
			if (item.kn_no) {
				if (item.search_times) {
					item.search_times = parseInt(item.search_times) + 1;
					this.updateSearchTimes(item.kn_no, item.search_times);
				}
				uni.redirectTo({
					url: '/archivesPages/RelationGraph/RelationGraph?currentNodeNo=' + item.kn_no
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.graph-search {
	.result-box {
		margin: 10rpx 20rpx 20rpx;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
		background-color: #fff;
		transition: all 1s ease-in-out;
		.node-item {
			border-bottom: 1rpx solid #f1f1f1;
			padding: 20rpx;
			&:active {
				background-color: #f8f8f8;
			}
		}
	}
	.hot-search-box {
		background-color: #fff;
		.title {
			font-weight: bold;
			border-bottom: 1rpx solid #f1f1f1;
			padding: 20rpx 50rpx 10rpx;
		}
		.content {
			display: flex;
			padding: 10rpx 20rpx;
			flex-wrap: wrap;
			.li {
				width: calc(50% - 20rpx);
				padding: 10rpx 0;
				&:nth-child(1) {
					.xu-hao {
						color: #f43f3b;
					}
					.text{
						&::after{
							content: 'HOT';
							position: absolute;
							right: -100rpx;
							color: #f43f3b;
							font-weight: bold;
							font-style: italic;
						}
					}
				}
				&:nth-child(2) {
					.xu-hao {
						color: #f44444;
					}
					.text{
						&::after{
							content: 'HOT';
							position: absolute;
							right: -100rpx;
							color: #f44444;
							font-weight: bold;
							font-style: italic;
						}
					}
				}
				&:nth-child(3) {
					.xu-hao {
						color: #f46046;
					}
					.text{
						&::after{
							content: 'HOT';
							position: absolute;
							right: -100rpx;
							color: #f46046;
							font-weight: bold;
							font-style: italic;
						}
					}
				}
				.xu-hao {
					margin-right: 20rpx;
					display: inline-block;
					min-width:50rpx;
					text-align: right;
				}
				.text {
					margin-right: 40rpx;
					position: relative;
					&:active {
						background-color: #f1f1f1;
					}
				}
			}
		}
	}
}
</style>
