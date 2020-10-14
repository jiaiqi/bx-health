<template>
	<view class="record">
		<view class="list-item" v-for="(item, index) in cardList" :key="index" @click="toDetail(item)">
			<view class="title">{{ item.title }}</view>
			<view class="content">
				<view class="icon" :style="item.style"><text class="iconfont" :class="item.icon"></text></view>
				<view class="text">
					<view class="content-text">
						<text class="value">{{ item.value }}</text>
						<text class="unit">{{ item.unit }}</text>
					</view>
					<view class="remark">{{ item.remark }}</view>
				</view>
				<view class="tag" v-if="item.tag.text">
					<text class="cu-tag round light" :class="item.tag.color">{{ item.tag.text }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
// import 'static/icon/health/font/iconfont.css';
export default {
	data() {
		return {
			cardList: [
				{
					title: '运动',
					icon: 'icon-yundong',
					style: {
						backgroundColor: '#18b566'
					},
					value: '7542',
					unit: '步',
					tag: { color: 'bg-green', text: '充足' },
					remark: '40分钟前'
				},
				{
					title: '饮食',
					icon: 'icon-yinshi',
					style: {
						backgroundColor: '#ff9900'
					},
					value: '2164',
					unit: '千卡',
					tag: { color: 'bg-green', text: '' }
				},
				{
					title: '睡眠',
					icon: 'icon-shuimian',
					style: {
						backgroundColor: '#2979ff'
					},
					value: '25920',
					unit: '秒',
					tag: { color: 'bg-green', text: '充足' },
					remark: '22:44 - 06:34'
				},
				{
					title: '体重',
					icon: 'icon-tizhong',
					style: {
						backgroundColor: '#f29100'
					},
					value: '70',
					unit: 'kg',
					tag: { color: 'bg-yellow', text: '偏胖' },
					remark: '2020年8月14日 15:03'
				},
				{
					title: '心率',
					icon: 'icon-ziyuan',
					style: {
						backgroundColor: '#fa4444'
					},
					value: '103',
					unit: '次/分',
					tag: { color: 'bg-red', text: '偏高' },
					remark: '今天 16:31'
				},
				{
					title: '血压',
					icon: 'icon-ziyuan2',
					style: {
						backgroundColor: '#fa4444'
					},
					value: '',
					unit: '',
					tag: { color: '', text: '' }
				},
				{
					title: '血氧',
					icon: 'icon-ziyuan1',
					style: {
						backgroundColor: '#fa4444'
					},
					value: '97',
					unit: '%',
					tag: { color: 'bg-green', text: '正常' },
					remark: '今天 16:31'
				},
				{
					title: '血糖',
					icon: 'icon-ziyuan3',
					style: {
						backgroundColor: '#fa4444'
					},
					value: '4.7',
					unit: 'mmol/L',
					tag: { color: 'bg-green', text: '正常' }
				}
			]
		};
	},
	methods: {
		toDetail(e) {
			let item = this.deepClone(e);
			console.log(item);
			if(item.title==="运动"){
				uni.navigateTo({
					url:"/pages/sportDetail/sportDetail?title=运动"
				})
			}
			if(item.title==="饮食"){
				uni.navigateTo({
					url:"/pages/indicatorsDetails/dietUp/dietUp"
				})
			}
			if(item.title==="体重"){
				uni.navigateTo({
					url:"/pages/indicatorsDetails/dietDetail/dietDetail"
				})
			}
		
		}
	}
};
</script>

<style lang="scss" scoped>
.record {
	width: 100%;
	height: 100vh;
	background-color: #f1f1f1;
	padding: 20rpx;
	overflow-y: scroll;
	padding-bottom: 200rpx;
}

.list-item {
	background-color: #fff;
	border-radius: 20rpx;
	margin: 10rpx 0;
	padding: 10rpx 20rpx;
	min-height: 200rpx;
	display: flex;
	flex-direction: column;
	&:first-child {
		margin-top: 0;
	}
	&:last-child {
		margin-bottom: 0;
	}
	.title {
		border-bottom: 1rpx solid #f1f1f1;
		height: 50rpx;
		font-weight: bold;
		color: #303133;
	}
	.content {
		padding: 10rpx 0;
		display: flex;
		align-items: center;
		.tag {
			width: 150rpx;
		}
		.icon {
			background-color: #1abc9c;
			border-radius: 20rpx;
			width: 130rpx;
			height: 130rpx;
			margin: 20rpx 20rpx 10rpx;
			text-align: center;
			.iconfont {
				font-size: 80rpx;
				color: #fff;
				line-height: 130rpx;
			}
		}
		.text {
			padding: 0 30rpx;
			flex: 1;
			display: flex;
			flex-direction: column;
			min-height: 100rpx;
			justify-content: center;
			.content-text {
				display: flex;
				flex: 1;
				align-items: center;
				.value {
					font-size: 40rpx;
					font-weight: bold;
					line-height: 40rpx;
				}
				.unit {
					font-size: 20rpx;
					font-weight: bold;
					display: flex;
					align-items: flex-end;
				}
			}
			.remark {
				padding: 5rpx 0;
				color: #8f8f94;
				font-size: 20rpx;
			}
		}
	}
}
</style>
