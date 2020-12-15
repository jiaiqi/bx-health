<template>
	<view class="main-history">
		<view class="list-wrap" v-if="list && list.length > 0">
			<view
				@click="toDetail(item)"
				v-for="(item, index) in list"
				:key="index"
				class="list-item"
				:class="{
					'not-completed': item.state === '未完成',
					'has-completed': item.state === '完成'
				}"
			>
	
				<view class="status">
					<!-- <view class="label">状态:</view> -->
					<text class="cuIcon-time margin-right-xs"></text>
					<view class="value">{{ item.start_time.slice(10, 16) }}</view>
					<view class="value">
						<!-- {{ item.state }} -->
					</view>
				</view>
				<view class="date">
					<!-- <view class="label">填写时间:</view> -->
					<view class="value">{{ item.start_time.slice(0, 10) }}</view>
				</view>
			</view>
		</view>
		<view class="loadmore-box"><u-loadmore :status="status" @loadmore="loadMore" :load-text="loadText" v-if="list && list.length > 0" /></view>
		<u-empty text="没有找到填写记录" v-if="list.length === 0 && !initLoad"></u-empty>
	</view>
</template>

<script>
export default {
	data() {
		return {
			initLoad: false,
			status: 'loadmore',
			title: '',
			page: {
				pageNo: 1,
				rownumber: 20,
				total: 0
			},
			activity_no: '',
			user_no: '',
			list: [],
			loadText: {
				loadmore: '点击或上拉加载更多',
				loading: '努力加载中',
				nomore: '没有更多了'
			}
		};
	},
	methods: {
		toDetail(item) {
			let formType = 'detail';
			if (item.state === '未完成') {
				// formType = 'form'
			}
			uni.navigateTo({
				url: `/questionnaire/index/index?formType=${formType}&activity_no=${item.activity_no}&status=${item.state}&fill_batch_no=${item.fill_batch_no}`
			});
		},
		getList() {
			let url = this.getServiceUrl('daq', 'srvdaq_record_reply_select', 'select');
			let req = {
				serviceName: 'srvdaq_record_reply_select',
				colNames: ['*'],
				condition: [{ colName: 'activity_no', ruleType: 'like', value: this.activity_no }, { colName: 'user_no', ruleType: 'like', value: this.user_no }],
				page: { pageNo: this.page.pageNo, rownumber: this.page.rownumber }
			};
			this.$http.post(url, req).then(res => {
				this.initLoad = false;
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
					this.page.total = res.data.page.total;
					res.data.data.map(item => {
						this.list.push(item);
					});
					if (res.data.page.total <= res.data.page.rownumber * res.data.page.pageNo) {
						this.status = 'nomore';
					} else {
						this.status = 'loadmore';
					}
				}
			});
		},
		loadMore() {
			this.status = 'loading';
			this.page.pageNo = ++this.page.pageNo;
			this.getList();
		}
	},
	onReachBottom() {
		this.loadMore();
	},
	onPullDownRefresh() {
		this.page.pageNo = 1;
		this.list = [];
		this.initLoad = true;
		this.getList();
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 500);
	},
	onLoad(option) {
		if (option.activity_no) {
			this.activity_no = option.activity_no;
			let user_info = uni.getStorageSync('login_user_info');
			if (user_info && user_info.user_no) {
				if (option.title) {
					this.title = option.title;
					uni.setNavigationBarTitle({
						title: option.title
					});
				}
				this.user_no = user_info.user_no;
				// #ifdef H5
				this.getList();
				// #endif
				// #ifdef MP-WEIXIN
				uni.startPullDownRefresh();
				// #endif
			}
		}
	}
};
</script>

<style scoped lang="scss">
.main-history {
	height: calc(100vh - var(--window-top) - var(--window-bottom));
	background-color: #fff;
	.title {
		padding: 20rpx 0;
		text-align: center;
		font-weight: 800;
		letter-spacing: 5px;
		font-size: 30rpx;
		display: flex;
		flex-direction: column;
		.sub-title {
			font-size: 24rpx;
			padding: 5rpx 0;
			padding-left: 400rpx;
			opacity: 0.8;
		}
		.text {
			position: relative;
			color: #007aff;
			text-shadow: 1px 1px 10px #007aff;
			&::after {
				// content: '';
				position: absolute;
				bottom: 0;
				height: 3px;
				background-color: rgba($color: #007aff, $alpha: 1);
				width: 100%;
				left: 0;
				bottom: -10rpx;
			}
		}
	}
}
.loadmore-box {
	padding: 20rpx 0;
	background-color: #fff;
}
.list-wrap {
	display: flex;
	// flex-direction: column;
	flex-wrap: wrap;
	margin: 0;
	padding: 0 20rpx;
	background-color: #fff;
	.list-item {
		width: calc(33% - 40rpx / 3);
		margin-right: 20rpx;
		margin-top: 20rpx;
		&:nth-child(3n) {
			margin-right: 0;
		}
		display: flex;
		flex-direction: column;
		// justify-content: space-between;
	  color: #409eff;
	  background: #ecf5ff;
	  border-color: #b3d8ff;
		padding: 10rpx;
		border-radius: 10rpx;
		transition: all 0.5s;
		position: relative;
		overflow: hidden;
		&::after{
			position: absolute;
			right:-90rpx;
			top: 0;
			width: 300rpx;
			background-color: #fff;
			color: #409eff;
			transform: rotate(45deg) scale(0.8);
			font-size: 24rpx;
			text-indent: 80rpx;
			text-align: center;
		}
		&.has-completed {
			color: #FFF;
			background-color: rgba(41, 121, 255, 0.8);
			box-shadow: 4px 3px 4px rgba(124, 166, 255, 0.5);
			&::after{
				// text-indent: 90rpx;
				content: '完成';
			}
		}
		&.not-completed{
			box-shadow: 4px 3px 4px #b3d8ff;
			&::after{
				content: '未完成';
				background-color: #b3d8ff;     
				color: #fff;
			}
		}
		
		&:active {
			transform: scale(1.05);
		}
		.date,
		.status {
			display: flex;
			padding: 4rpx 10rpx;
			.label {
				margin-right: 10rpx;
			}
		}
		.status {
			// justify-content: flex-end;
		}
	}
}
</style>
