<template>
	<view class="page-wrap">
		<view class="qrcode-scan" @click="toScan">
			<text class="cuIcon-scan"></text>
			<text class="text">扫码关注</text>
		</view>
		<view class="docter-list">
			<view class="doctor-item" v-for="item in doctorList" :key="item.id">
				<view class="profile"><image class="image" :src="getPicPath(item.dt_pic)" mode="aspectFit"></image></view>
				<view class="content">
					<text class="doctor-name">{{ item.dt_name }}</text>
				</view>
				<view class="content"><text class="hospital-address">xx市xx区xx路xx医院</text></view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			userInfo: {},
			docInfo: {},
			doctorList: []
		};
	},
	methods: {
		getPicPath(no) {
			return this.$api.downloadFile + no + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
		},
		getBindDoctor() {
			// 查找医生信息
			let url = this.getServiceUrl('health', 'srvhealth_patient_doctor_select', 'select');
			let req = {
				serviceName: 'srvhealth_patient_doctor_select',
				colNames: ['*'],
				condition: [{ colName: 'customer_no', ruleType: 'like', value: this.userInfo.no }],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			this.$http.post(url, req).then(res => {
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
					this.doctorList = res.data.data;
					let noList = res.data.data.map(item => item.manager_no);
					let noStr = noList.toString();
					this.getDoctorInfo(noStr, true);
				}
			});
		},
		toScan() {
			// 调起客户端扫码功能,允许从相机和相册扫码
			let self = this;
			// #ifndef H5
			uni.scanCode({
				success: function(res) {
					console.log('条码类型：' + res.scanType);
					console.log('条码内容：' + res.result);
					if (res.result && res.result.indexOf('DT') !== -1) {
						let hasBind = false;
						let doctorList = self.deepClone(self.doctorList);
						if (Array.isArray(doctorList) && doctorList.length > 0) {
							doctorList.forEach(item => {
								if (item.dt_no === res.result) {
									hasBind = true;
								}
							});
						}
						if (hasBind) {
							// 已绑定此医生
							uni.showModal({
								title: '提示',
								content: '已绑定此医生,请不要重复绑定',
								showCancel: false,
								confirmText: '知道了'
							});
						} else {
							// 进行绑定
							self.getDoctorInfo(res.result).then(docInfo => {
								self.docInfo = docInfo;
								uni.showModal({
									title: '提示',
									content: '确认是否绑定' + docInfo.dt_name + '为您的医生',
									confirmText: '绑定',
									success(res) {
										if (res.confirm) {
											self.bindDoctor(docInfo);
										}
									}
								});
							});
						}
					}
				}
			});
			// #endif
		},
		async bindDoctor(docInfo) {
			if (!docInfo) {
				console.log('未找到医生信息');
				return;
			}
			let url = this.getServiceUrl('health', 'srvhealth_patient_doctor_add', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_patient_doctor_add',
					condition: [],
					data: [{ customer_no: this.userInfo.no, customer_name: this.userInfo.name, manager_no: docInfo.dt_no, manager_name: docInfo.dt_name }]
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				this.getBindDoctor();
				uni.showModal({
					title: '提示',
					content: '绑定成功',
					showCancel: false,
					confirmText: '知道了'
				});
			}
		},
		async getDoctorInfo(no, isSelf) {
			// 查找医生信息
			let url = this.getServiceUrl('health', 'srvhealth_doctor_select', 'select');
			let req = {
				serviceName: 'srvhealth_doctor_select',
				colNames: ['*'],
				condition: [{ colName: 'dt_no', ruleType: 'in', value: no }],
				page: { pageNo: 1, rownumber: 10 }
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				if (isSelf === true) {
					this.doctorList = res.data.data;
				}
				return res.data.data[0];
			} else {
				return false;
			}
		}
	},
	onLoad() {
		let userInfo = uni.getStorageSync('current_user_info');
		if (userInfo) {
			this.userInfo = userInfo;
			this.getBindDoctor();
		} else {
			uni.showToast({
				title: '未发现用户信息',
				icon: 'none'
			});
		}
	},
	onReachBottom() {
		// 下拉到底部
		console.log('下拉到底部');
	},
	onPullDownRefresh() {
		// 下拉
		setTimeout(() => {
			uni.stopPullDownRefresh();
		}, 1000);
	}
};
</script>

<style lang="scss" scoped>
.page-wrap {
	width: 100%;
	// height: 100vh;
	padding: 20rpx;
	.qrcode-scan {
		background-color: #fff;
		border-radius: 20rpx;
		text-align: center;
		line-height: 100rpx;
		font-size: 34rpx;
		.text {
			margin-left: 30rpx;
		}
	}
	.docter-list {
		.doctor-item {
			margin-top: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			border-radius: 20rpx;
			min-height: 300rpx;
			padding-bottom: 50rpx;
			.profile {
				width: 100rpx;
				height: 100rpx;
				border-radius: 50%;
				overflow: hidden;
				margin-bottom: 10rpx;
				background-color: #0081ff;
				.cuIcon-my {
					font-size: 100rpx;
					color: #fff;
				}
				.image {
					width: 100rpx;
					height: 100rpx;
				}
			}
			.content {
				padding-top: 10rpx;
			}
		}
	}
}
</style>
