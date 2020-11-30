<template>
	<view class="graph-search">
		<view class="cu-bar bg-white search">
			<view class="search-form radius">
				<text class="cuIcon-search"></text>
				<!-- <text class="cuIcon-searchlist"></text> -->
				<input @input="valueChange" :adjust-position="false" type="text" placeholder="搜索节点" confirm-type="search" />
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
			nodeList: []
		};
	},
	methods: {
		valueChange(e) {
			if (e.detail.value) {
				this.searchNode(e.detail.value);
			}
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
}
</style>
