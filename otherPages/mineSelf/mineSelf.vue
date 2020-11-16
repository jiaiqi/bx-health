<template>
	<view class="center">
		<view class="center_top">
			<view class="mask"><image :src="wxUserInfo.headimgurl" mode=""></image></view>
		</view>
		<view class="center_box_bg">
			<view class="profily">
				<view class="base">
					<view class="profily_header"><image :src="wxUserInfo.headimgurl" mode=""></image></view>
					<text>{{wxUserInfo.nickname}}</text>
					<image src="/otherPages/static/fumou-center-template/setting.png" mode=""></image>
				</view>
				<view class="order_status">
					<view class="status" v-for="item in status" :key="item.name">
						<image class="icon" :src="item.url" mode="aspectFill"></image>
						<text>{{ item.name }}</text>
					</view>
				</view>
			</view>
			<view class="baiban"></view>
			<view class="center_menu">
				<view class="menu_item" v-for="item in menus" :key="item.name">
					<image :src="item.icon" mode="aspectFill"></image>
					<text>{{ item.name }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			status: [
				{
					key: 1,
					name: '家族史',
					url: '/otherPages/static/fumou-center-template/4.png'
				},
				{
					key: 2,
					name: '疾病史',
					url: '/otherPages/static/fumou-center-template/4.png'
				},
				{
					key: 3,
					name: '过敏史',
					url: '/otherPages/static/fumou-center-template/4.png'
				},
				{
					key: 4,
					name: '手术史',
					url: '/otherPages/static/fumou-center-template/4.png'
				}
			],
			menus: [
				{
					name: '个人资料',
					icon: '/otherPages/static/fumou-center-template/5.png',
					key: 1
				},
				{
					name: '健康档案',
					icon: '/otherPages/static/fumou-center-template/6.png',
					key: 2
				},
				{
					name: '我的关注',
					icon: '/otherPages/static/fumou-center-template/7.png',
					key: 3
				},
				{
					name: '我的收藏',
					icon: '/otherPages/static/fumou-center-template/8.png',
					key: 4
				},
				{
					name: '意见反馈',
					icon: '/otherPages/static/fumou-center-template/9.png',
					key: 5
				},
				{
					name: '关于我们',
					icon: '/otherPages/static/fumou-center-template/10.png',
					key: 6
				}
			]
		};
	},
	computed: {
		wxUserInfo() {
			let wxUserInfo = uni.getStorageSync('wxUserInfo');
				return wxUserInfo
		}
	},
	methods: {

	}
};
</script>

<style lang="scss">
page {
	height: 100%;
}

.profily,
.profily_header {
	border-radius: 8px;
}

.center {
	height: 100vh;
	overflow-y: scroll;

	&_top {
		height: 200rpx;
		// background: url('/static/fumou-center-template/header.jpg') no-repeat 0% 50%;
		background-size: cover;

		// background: #E6E6E6;
		.mask {
			background: rgba(0, 0, 0, 0.4);
			height: 100%;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}

	&_box_bg {
		background: #f9f9f9;
		position: relative;

		.profily {
			position: absolute;
			width: 90%;
			// border:1px solid #F7F7F7;
			margin: 0 auto;
			top: -100upx;
			left: 5%;
			background: #fefefe;
			padding: 35upx;
			box-sizing: border-box;
			box-shadow: 0px 2px 5px #ededed;
		}
	}
}

.base {
	display: flex;
	align-items: center;
	border-bottom: 2px solid #f6f6f6;
	padding-bottom: 35upx;
	position: relative;
	.profily_header {
		height: 120upx;
		width: 120upx;
		// background-image: url('/static/fumou-center-template/header.jpg');
		// background-size: 100%;
		image {
			height: 120upx;
			width: 120upx;
			position: relative !important;
		}
	}

	text {
		margin-left: 20px;
		font-size: 30upx;
	}

	image {
		position: absolute;
		height: 40upx;
		width: 40upx;
		right: 0px;
		top: 0px;
	}
}

.order_status {
	display: flex;
	justify-content: space-between;
	margin-top: 35upx;

	.status {
		width: 140upx;
		font-size: 24upx;
		text-align: center;
		letter-spacing: 0.5px;
		display: flex;
		flex-direction: column;
		.icon {
			width: 50upx;
			height: 50upx;
			margin: 0 auto;
			margin-bottom: 5px;
		}
	}
}

.baiban {
	background: #fefefe;
	height: 300upx;
}

.center_menu {
	width: 100%;
	display: inline-block;

	.menu_item {
		font-size: 28upx;
		letter-spacing: 1px;
		padding: 14px 5%;
		background: #fefefe;
		overflow: hidden;
		box-sizing: border-box;
		display: flex;
		align-items: center;
		position: relative;
		border-bottom: 1px solid #efefef;

		&:hover {
			background: #f6f6f6 !important;
		}

		&::after {
			content: '';
			width: 30upx;
			height: 30upx;
			position: absolute;
			right: 5%;
			background: url('@/otherPages/static/img/right.png') no-repeat;
			background-size: 100%;
		}

		text:nth-of-type(1) {
			margin-left: 10px;
		}

		image {
			width: 40upx;
			height: 40upx;
		}

		&:nth-of-type(4) {
			margin-top: 10px;
		}
	}
}
</style>
