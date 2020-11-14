<template>
	<view class="card-wrap">
		<view class="card">
			<view class="user-info">
				<view class="profile-box"><image :src="avatarUrl" class="image" mode="aspectFit"></image></view>
				<view class="name-box">
					<text>{{ userInfo.name }}</text>
				</view>
			</view>
			<view class="qr-code" v-if="doctoreInfo && doctoreInfo.dt_no">
				<uni-qrcode
					cid="qrcodeCanvas"
					:text="doctoreInfo.dt_no"
					:size="size"
					foregroundColor="#333"
					makeOnLoad
					@makeComplete="qrcodeCanvasComplete"
				></uni-qrcode>
			</view>
			<view class="tips">扫描上方二维码关注当前医生</view>
		</view>
	</view>
</template>

<script>
import uQRCode from '../components/uni-qrcode/uqrcode.js';
import UniQrcode from '../components/uni-qrcode/uni-qrcode';
export default {
	components: { UniQrcode },
	data() {
		return {
			userInfo: {},
			doctoreInfo: {},
			size: uni.upx2px(550)
		};
	},
	computed: {
		avatarUrl() {
			if (this.userInfo.profile_url) {
				return this.$api.downloadFile + this.userInfo.profile_url + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
			}
		}
	},
	methods: {
		async getDoctorInfo() {
			// 查找医生信息
			let url = this.getServiceUrl('health', 'srvhealth_doctor_select', 'select');
			let req = {
				serviceName: 'srvhealth_doctor_select',
				colNames: ['*'],
				condition: [{ colName: 'owner_account', ruleType: 'like', value: this.userInfo.userno }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				return res.data.data[0];
			} else {
				return false;
			}
		},
		qrcodeCanvasComplete(e) {
			console.log('qrcodeCanvasComplete', e);
		}
	},
	async onLoad() {
		let userInfo = uni.getStorageSync('current_user_info');
		if (userInfo) {
			this.userInfo = userInfo;
			let docInfo = await this.getDoctorInfo();
			if (docInfo) {
				this.doctoreInfo = docInfo;
			}
		} else {
			uni.showToast({
				title: '未发现用户信息',
				icon: 'none'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.card-wrap {
	width: 100%;
	padding: 0 50rpx;
	height: 80vh;
	padding-top: 10vh;
	display: flex;
	height: auto;
	.card {
		width: 100%;
		background-color: #fff;
		border-radius: 20rpx;
		// height: 300rpx;
		min-height: 840rpx;
		padding: 20rpx;
		.user-info {
			display: flex;
			.profile-box {
				width: 100rpx;
				height: 100rpx;
				.image {
					width: 100%;
					height: 100%;
					border-radius: 10rpx;
				}
			}
			.name-box {
				margin-left: 20rpx;
				font-size: 34rpx;
				letter-spacing: 2px;
			}
		}
		.qr-code {
			background-color: #999;
			width: 550rpx;
			height: 550rpx;
			margin: 50rpx auto;
		}
		.tips {
			text-align: center;
			color: #999;
			font-size: 24rpx;
			margin-bottom: 20rpx;
		}
	}
}
</style>
