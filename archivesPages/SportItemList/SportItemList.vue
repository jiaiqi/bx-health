<template>
	<view class="page-wrap">
		<view class="filter-box">
			<view class="label">{{ fieldMap.classifyLabel }}</view>
			<view class="filter-list">
				<view class="filter-item" :class="{ active: !currentFilter }" @click="changeFilter('')"><text>全部</text></view>
				<view class="filter-item" :class="{ active: currentFilter === item[fieldMap.classifyCol] }" v-for="item in classifyList" @click="changeFilter(item)">
					<text>{{ item[fieldMap.classifyCol] }}</text>
				</view>
			</view>
		</view>
		<view class="layout-switch text-green">
			<text class="cuIcon-cascades" v-if="layout === 'list'" @click="switchLayout('grid')"></text>
			<text class="cuIcon-list" v-if="layout === 'grid'" @click="switchLayout('list')"></text>
		</view>
		<view class="list-box" :class="{ grid: layout === 'grid', list: layout === 'list' }">
			<view class="list-item" v-for="(item, index) in list" :key="index" @click="toItemDetail">
				<view class="profile"><image class="image" :src="getImagePath(item[fieldMap.image])" mode="aspectFit"></image></view>
				<view class="content">
					<view class="label">{{ item[fieldMap.label] || '' }}</view>
				</view>
			</view>
		</view>
		<uni-load-more :status="loadStatus"></uni-load-more>
	</view>
</template>

<script>
export default {
	data() {
		return {
			list: [],
			layout: 'grid',
			classifyList: [],
			serviceName: 'srvhealth_body_activity_contents_select',
			condition: [],
			currentFilter: '',
			page: {
				total: 0,
				rownumber: 20,
				pageNo: 1
			},
			group: [
				{
					colName: 'classify',
					type: 'by'
				}
			],
			fieldMap: {
				classifyCol: 'classify',
				classifyLabel: '分类',
				label: 'name',
				image: 'image'
			},
			loadStatus: 'more' //more,loading,noMore
		};
	},
	methods: {
		switchLayout(e) {
			this.layout = e;
		},
		changeFilter(e) {
			if (!e) {
				this.currentFilter = '';
				this.condition = [];
			} else {
				this.currentFilter = e[this.fieldMap.classifyCol];
				this.condition = [{ colName: this.fieldMap.classifyCol, ruleType: 'like', value: e[this.fieldMap.classifyCol] }];
			}
			uni.startPullDownRefresh();
		},
		toItemDetail() {
			uni.navigateTo({
				url: '/pediaPages/hospitalOverview/hospitalOverview'
			});
		},
		async getClassifyList() {
			let url = this.getServiceUrl('health', this.serviceName, 'select');
			let req = {
				serviceName: this.serviceName,
				group: this.group,
				colNames: ['*'],
				condition: this.condition
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
				this.classifyList = res.data.data.filter(item => item && item[this.fieldMap.classifyCol]);
			}
		},
		async getList() {
			let url = this.getServiceUrl('health', this.serviceName, 'select');
			let req = {
				serviceName: this.serviceName,
				page: { rownumber: this.page.rownumber, pageNo: this.page.pageNo },
				colNames: ['*'],
				condition: this.condition
			};
			this.loadStatus = 'loading';
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
				if (res.data.page.pageNo === 1) {
					this.list = res.data.data;
				} else {
					this.list = [...this.list, ...res.data.data];
				}
				if (this.page.total > this.page.pageNo * this.page.rownumber) {
					this.loadStatus = 'more';
				} else {
					this.loadStatus = 'noMore';
				}
				this.page.total = res.data.page.total;
				return res.data.data;
			}
		}
	},
	async onLoad(options) {
		if (options.serviceName) {
			this.serviceName = options.serviceName;
		}
		this.getClassifyList();
		uni.startPullDownRefresh();
	},

	onReachBottom() {
		// 下拉到底部
		console.log('下拉到底部');
		if (this.page.total > this.page.pageNo * this.page.rownumber) {
			this.page.pageNo++;
			this.getList();
		}
	},
	onPullDownRefresh() {
		// 下拉刷新
		this.getList().then(_ => {
			uni.stopPullDownRefresh();
		});
	}
};
</script>

<style lang="scss" scoped>
.page-wrap {
	width: 100%;
	padding: 20rpx;
	.filter-box {
		display: flex;
		background-color: #fff;
		padding: 20rpx;
		border-radius: 20rpx;
		align-items: center;
		.label {
			margin-right: 20rpx;
			padding-right: 20rpx;
			border-right: 1rpx solid #ccc;
		}
		.filter-list {
			display: inline-flex;
			flex-wrap: wrap;
			flex: 1;
		}
		.filter-item {
			padding: 5rpx 20rpx;
			margin-right: 10rpx;
			background-color: #f1f1f1;
			border-radius: 20rpx;
			margin-bottom: 10rpx;
			border: 1rpx solid #f1f1f1;
			transition: all 0.5s;
			&.active {
				border-color: #0bc99d;
				color: #0bc99d;
				background-color: rgba(11, 201, 157, 0.1);
			}
			&:active {
				transform: scale(1.2);
			}
		}
	}
	.text-green{
		color: #0bc99d;
	}
	.layout-switch {
		padding: 20rpx 20rpx 0;
		text-align: right;
		font-size: 20px;
	}
	.list-box {
		display: flex;
		flex-wrap: wrap;

		.list-item {
			width: calc(25% - 60rpx / 4);
			margin-bottom: 20rpx;
			margin-right: 20rpx;
			min-height: 220rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			border-radius: 20rpx;
			overflow: hidden;
			&:nth-child(4n) {
				margin-right: 0;
			}
			.profile {
				width: 100%;
				height: 150rpx;
				overflow: hidden;
				border-bottom: #f1f1f1 1rpx solid;
				.image {
					width: 100%;
					height: 200rpx;
				}
			}
			.content {
				display: flex;
				.label {
					text-align: center;
				}
			}
		}
		&.list {
			flex-direction: column;
			.list-item {
				width: 100%;
				flex-direction: row;
				.profile {
					width: 200rpx;
					height: 100%;
					border-bottom: none;
				}
				.content {
					padding-left: 20rpx;
					flex: 1;
				}
			}
		}
	}
}
</style>
