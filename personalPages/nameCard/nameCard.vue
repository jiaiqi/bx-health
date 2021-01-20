<template>
	<view class="card-wrap">
		<view class="card">
			<view class="user-info">
				<view class="profile-box"><image :src="avatarUrl" class="image" mode="aspectFit"></image></view>
				<view class="name-box">
					<text>{{ userInfo.name }}</text>
				</view>
			</view>
			<view class="qr-code" v-if="userInfo && userInfo.no">
				<uni-qrcode
					cid="qrcodeCanvas"
					:text="'https://wx2.100xsys.cn/mpwx/' + userInfo.no"
					:size="size"
					foregroundColor="#333"
					makeOnLoad
					@makeComplete="qrcodeCanvasComplete"
					:class="{
						'qrcode-canvas': qrcodePath
					}"
				></uni-qrcode>
				<image :src="qrcodePath" class="qr-code-image" mode="aspectFit" v-if="qrcodePath"></image>
			</view>
			<view class="tips">扫描上方二维码关注当前医生</view>
		</view>
		<view class="button-box">
			<button type="primary" class="cu-btn bg-blue" open-type="share" data-type="bindDoctor">
				<text class="cuIcon-card margin-right-xs"></text>
				<text>分享名片</text>
			</button>
			<button type="primary" class="cu-btn bg-blue" data-type="seeDoctor" v-if="myHospital && myHospital.length > 1" @click="inviteSeeDoctor">
				<text class="cuIcon-share margin-right-xs"></text>
				<text>就诊链接</text>
			</button>
			<button type="primary" class="cu-btn bg-blue" open-type="share" data-type="seeDoctor" v-else>
				<text class="cuIcon-share margin-right-xs"></text>
				<text>就诊链接</text>
			</button>
		</view>
		<view class="cu-modal" :class="{ show: modalName === 'hospital-list' }">
			<view class="cu-dialog">
				<view class="select-hospital">
					<view class="cu-bar text-bold text-center">选择诊所</view>
					<bx-radio-group class="form-item-content_value radio-group" mode="button" v-model="hospitalNo">
						<bx-radio class="radio" color="#2979ff" v-for="item in myHospital" :name="item.store_no">{{ item._store_no_disp }}</bx-radio>
					</bx-radio-group>
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
			userInfo: {},
			size: uni.upx2px(550),
			qrcodePath: '',
			myHospital: [],
			modalName: '',
			hospitalNo: ''
		};
	},
	computed: {
		avatarUrl() {
			if (this.userInfo.user_image) {
				return this.getImagePath(this.userInfo.user_image);
			} else if (this.userInfo.profile_url) {
				return this.getImagePath(this.userInfo.profile_url);
			}
		}
	},
	methods: {
		inviteSeeDoctor() {
			this.modalName = 'hospital-list';
		},
		async getHospital() {
			let url = this.getServiceUrl('health', 'srvhealth_store_user_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_user_select',
				colNames: ['*'],
				condition: [{ colName: 'person_no', ruleType: 'eq', value: this.userInfo.no }],
				query_source: 'list_page'
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.myHospital = res.data.data;
				if (res.data.data.length === 1) {
					this.hospitalNo = res.data.data[0].store_no;
				}
			} else {
				this.myHospital = false;
			}
		},
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
			this.qrcodePath = e;
		}
	},
	onShareAppMessage(e) {
		let path = '';
		let title = '百想健康';
		if (e.target && e.target.data && e.target.data.type === 'seeDoctor') {
			let fieldsCond = [
				{ column: 'doctor_no', display: false, value: this.userInfo.no },
				{ column: 'doctor_name', display: false, value: this.userInfo.name },
				{ column: 'user_info_no', display: false },
				{ column: 'user_no', display: false },
				{ column: 'store_no', value: this.hospitalNo, display: false }
			];
			path =
				`/publicPages/newForm/newForm?store_no=${this.hospitalNo}&doctor_no=${
					this.userInfo.no
				}&share_type=seeDoctor&serviceName=srvhealth_see_doctor_record_add&type=add&fieldsCond=` + encodeURIComponent(JSON.stringify(fieldsCond));
			title = `${this.userInfo.name}邀请您登记就诊信息`;
		} else if (e.target && e.target.data && e.target.data.type === 'bindDoctor') {
			let q = encodeURIComponent(`https://wx2.100xsys.cn/mpwx/${this.userInfo.no}`);
			if (this.userInfo && this.userInfo.no) {
				path = `/personalPages/myDoctor/myDoctor?from=share&invite_user_no=${this.userInfo.userno}&q=${q}`;
				title = `${this.userInfo.name}邀请你体验【百想健康】小程序`;
			}
			this.saveSharerInfo(this.userInfo, path);
		} else {
			if (this.userInfo.name) {
				title = this.userInfo.name;
			}
		}
		return {
			imageUrl: this.qrcodePath,
			title: title,
			path: path
		};
	},
	async onLoad() {
		let userInfo = uni.getStorageSync('current_user_info');
		let current_user_info = await this.selectBasicUserList();
		if (current_user_info && current_user_info.userno) {
			userInfo = current_user_info;
		}
		if (userInfo) {
			this.userInfo = userInfo;
			this.getHospital();
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
	display: flex;
	flex-direction: column;
	.button-box {
		margin-top: 20rpx;
		.cu-btn {
			width: 45%;
		}
	}
	.card {
		width: 100%;
		background-color: #fff;
		border-radius: 10rpx;
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
			// background-color: #999;
			width: 550rpx;
			height: 550rpx;
			margin: 50rpx auto;
			.qrcode-canvas {
				position: fixed;
				top: -999999px;
			}
			.qr-code-image {
				width: 550rpx;
				height: 550rpx;
			}
		}
		.tips {
			text-align: center;
			color: #999;
			font-size: 24rpx;
			margin-bottom: 20rpx;
		}
	}
}
.select-hospital {
	padding: 20rpx;
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
