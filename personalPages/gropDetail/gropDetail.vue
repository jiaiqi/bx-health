<template>
	<view>
		<view class="basic-info">
			<image :src="groupInfo.icon ? getImagePath(groupInfo.icon) : '../static/chat-active.png'" mode="aspectFit" class="logo"></image>
			<view class="content">
				<view class="name">{{ groupInfo.name }}</view>
				<view class="introduce">群主很懒，还没有群介绍哦~</view>
			</view>
		</view>
		<view class="setting-item cu-list group-member">
			<view class="title cu-item arrow">圈子成员</view>
			<view class="content-list">
				<view class="content-item" v-for="item in memberList">
					<image :src="getProfilePath(item)" mode="aspectFit" class="image"></image>
					<text class="label">{{ item.name }}</text>
				</view>
			</view>
		</view>
		<view class="setting-item group-util">
			<view class="title">小工具</view>
			<view class="content-list">
				<view class="content-item">
					<view class="image"><text class="cuIcon-file text-yellow"></text></view>
					<text class="label">文件</text>
				</view>
				<view class="content-item">
					<view class="image"><text class="cuIcon-pic text-blue"></text></view>
					<text class="label">图片</text>
				</view>
				<view class="content-item" @click="toPages('food')">
					<view class="image"><text class="cuIcon-similar text-green"></text></view>
					<text class="label">食物信息</text>
				</view>
				<view class="content-item" @click="toPages('sport')">
					<view class="image"><text class="cuIcon-hot text-orange"></text></view>
					<text class="label">运动信息</text>
				</view>
			</view>
		</view>
		<view class="tip">圈子信息</view>
		<view class="setting-item cu-list group-util">
			<view class="title cu-item arrow" @click="showQrCodeModal(true)">
				<text>二维码</text>
				<text class="cuIcon-qrcode"></text>
			</view>
		</view>
		<view class="setting-item cu-list group-util">
			<view class="title cu-item arrow">
				<text>公告</text>
				<text class="cuIcon-form"></text>
			</view>
			<view class="content-text">问君西游何时还？畏途巉岩不可攀。但见悲鸟号古木，雄飞雌从绕林间。又闻子规啼夜月，愁空山。蜀道之难，难于上青天，使人听此凋朱颜</view>
		</view>
		<view class="cu-modal" :class="{ show: showQrCode }">
			<view class="cu-dialog radius" @click.stop="">
				<view class="qr-code">
					<view class="qr-code-info">
						<view class="logo"><image :src="groupInfo.icon ? getImagePath(groupInfo.icon) : '../static/chat-active.png'" mode="aspectFit" class="img"></image></view>
						<view class="title">{{ groupInfo.name }}</view>
					</view>
					<uni-qrcode cid="qrcodeCanvas" class="qr-code-container" :text="groupInfo.gc_no" :size="qrCodeSize" foregroundColor="#333" makeOnLoad v-if="showQrCode&&groupInfo.gc_no"></uni-qrcode>
					<view class="action"><button class="cu-btn line-green text-green" @tap="showQrCodeModal(false)">取消</button></view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import UniQrcode from '../components/uni-qrcode/uni-qrcode';
export default {
	components: { UniQrcode },
	data() {
		return {
			gc_no: '',
			qrCodeSize: uni.upx2px(500),
			groupInfo: {},
			memberList: [],
			showQrCode: false
		};
	},
	methods: {
		showQrCodeModal(showQrCode) {
			this.showQrCode = showQrCode;
		},
		getProfilePath(e) {
			if (e.profile_url) {
				return this.getImagePath(e.profile_url);
			} else if (e.user_image) {
				return this.getImagePath(e.user_image);
			}
		},
		async selectGroupInfo() {
			// 圈子信息
			let url = this.getServiceUrl('health', 'srvhealth_group_circle_select', 'select');
			let req = {
				serviceName: 'srvhealth_group_circle_select',
				colNames: ['*'],
				condition: [{ colName: 'gc_no', ruleType: 'eq', value: this.gc_no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.groupInfo = res.data.data[0];
				return res.data.data[0];
			}
		},
		async selectGroupMember() {
			// 圈子成员
			// srvhealth_person_group_circle_select
			let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_group_circle_select',
				colNames: ['*'],
				condition: [{ colName: 'gc_no', ruleType: 'eq', value: this.gc_no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				this.memberList = res.data.data;
				return res.data.data;
			}
		},
		toPages(type) {
			let url = '';
			switch (type) {
				case 'sport':
					url = '/archivesPages/SportItemList/SportItemList';
					break;
				case 'food':
					let detail = {
						type: 'food',
						serviceName: 'srvhealth_diet_contents_select',
						colName: 'name',
						imgCol: 'image',
						wordKey: { title: 'name', unit: 'unit', energy: 'unit_energy' },
						pagetType: 'detail'
					};
					url = `/otherPages/dietSelect/dietSelect?condType=${encodeURIComponent(JSON.stringify(detail))}`;
					break;
			}
			if (url) {
				uni.navigateTo({
					url: url
				});
			}
		}
	},
	onLoad(option) {
		if (option.gc_no) {
			this.gc_no = option.gc_no;
			this.selectGroupInfo();
			this.selectGroupMember();
		}
	}
};
</script>

<style lang="scss" scoped>
.basic-info {
	padding: 20rpx;
	display: flex;
	background-color: #fff;
	.logo {
		width: 100rpx;
		height: 100rpx;
		border-radius: 20rpx;
		margin-right: 20rpx;
	}
	.content {
		.name {
			font-size: 28rpx;
			font-weight: bold;
		}
		.introduce {
			color: #999;
		}
	}
}
.setting-item {
	padding: 20rpx;
	margin: 20rpx 0;
	background-color: #fff;
	.content-text {
		color: #888;
		padding: 10rpx 0;
		font-size: 28rpx;
	}
	.title {
		font-weight: bold;
		font-size: 32rpx;
		display: flex;
		justify-content: space-between;
	}
	.content-list {
		display: flex;
		padding: 20rpx 0;
		.content-item {
			padding: 0 10rpx;
			flex: 1;
			max-width: 20%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			.image {
				width: 80rpx;
				height: 80rpx;
				border-radius: 10rpx;
				line-height: 80rpx;
				text-align: center;
				font-size: 80rpx;
			}
			.label {
				padding-top: 10rpx;
				font-size: 24rpx;
			}
		}
	}
}
.tip {
	padding: 20rpx 20rpx 0;
	font-size: 24rpx;
	color: #999;
}
.qr-code {
	position: relative;
	padding-top: 80rpx;
	.action {
		padding: 20rpx;
	}
	.qr-code-info {
		.logo {
			width: 150rpx;
			height: 150rpx;
			position: absolute;
			top: -75rpx;
			left: calc(50% - 75rpx);
			background-color: #f8f8f8;
			border-radius: 50%;
			overflow: hidden;
			display: flex;
			justify-content: center;
			align-items: center;
			.img {
				width: 100rpx;
				height: 100rpx;
			}
		}
		.title {
			font-size: 38rpx;
			font-weight: bold;
			margin: 10rpx 0;
		}
	}
	.qr-code-container {
		padding: 20rpx;
		display: flex;
		justify-content: center;
	}
}
/deep/.cu-dialog {
	overflow: initial;
}
</style>
