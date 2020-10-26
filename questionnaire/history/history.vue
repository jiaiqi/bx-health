<template>
	<view class="main-history">
		<view class="title">
			<text class="text">{{ title }}</text>
		</view>
		<view class="list-wrap">
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
				<view class="date">
					<view class="label">填写时间:</view>
					<view class="value">{{ item.start_time }}</view>
				</view>
				<view class="status">
					<view class="label">状态:</view>
					<view class="value">{{ item.state }}</view>
				</view>
			</view>
		</view>
		<u-loadmore :status="status" @loadmore="loadMore" />
	</view>
</template>

<script>
export default {
	data() {
		return {
			status: 'loadmore',
			title: '',
			page: {
				pageNo: 1,
				rownumber: 10,
				total: 0
			},
			activity_no: '',
			user_no: '',
			list: []
		};
	},
	methods: {
		toDetail(item) {
			uni.navigateTo({
				url: `/questionnaire/index/index?formType=detail&activity_no=${this.activity_no}`
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
	onLoad(option) {
		if (option.activity_no) {
			this.activity_no = option.activity_no;
			let user_info = uni.getStorageSync('login_user_info');
			if (user_info && user_info.user_no) {
				if (option.title) {
					this.title = option.title;
				}
				this.user_no = user_info.user_no;
				this.getList();
			}
		}
	}
};
</script>

<style scoped lang="scss">
.main-history {
	min-height: 100vh;
	background-color: #fff;
	.title {
		padding: 20rpx 0;
		text-align: center;
		font-weight: 800;
		letter-spacing: 5px;
		font-size: 30rpx;
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
.list-wrap {
	display: flex;
	flex-direction: column;
	margin: 0 20rpx 50rpx;
	background-color: #fff;
	.list-item {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		color: #fff;
		background-color: #9da1a7;
		box-shadow: 4px 3px 4px rgba(157, 161, 167, 0.5);
		padding: 20rpx;
		border-radius: 10rpx;
		transition: all 0.5s;
		&.not-completed {
			background-color: #f84343;
			box-shadow: 4px 3px 4px rgba(248, 67, 67, 0.5);
		}
		&.has-completed {
			background-color: rgba(41, 121, 255, 0.8);
			box-shadow: 4px 3px 4px rgba(41, 121, 255, 0.5);
		}
		&:active {
			// opacity: 1;
			transform: scale(1.05);
		}
		.date,
		.status {
			display: flex;
			min-height: 50rpx;
			align-items: center;
			.label {
				margin-right: 10rpx;
			}
		}
	}
}
</style>
