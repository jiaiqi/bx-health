<template>
	<view class="page-wrap">
		<view class="qrcode-scan" @click="toScan">
			<text class="cuIcon-scan"></text>
			<text class="text">扫码关注</text>
		</view>
		<view class="docter-list">
			<view class="doctor-item" v-for="item in doctorList" :key="item.id">
				<view class="profile"><image class="image" :src="getPicPath(item.dt_pic) ? getPicPath(item.dt_pic) : getPicPath(item.dt_profile_url)" mode="aspectFill"></image></view>
				<view class="content">
					<view class="content-left">
						<text class="doctor-name">{{ item.dt_name }}</text>
					</view>
					<view @click="toChatPage(item)" class="content-right">
						<text v-if="item.count_num" style="z-index: 1;">{{ item.count_num }}</text>
						<image src="../static/chat.png" mode=""></image>
					</view>
				</view>
				<!-- <view class="content"><text class="hospital-address">xx市xx区xx路xx医院</text></view> -->
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
			qrcodeParams: '',
			doctorList: [],
		};
	},
	methods: {
		getPicPath(no) {
			if (no) {
				return this.$api.downloadFile + no + '&bx_auth_ticket=' + uni.getStorageSync('bx_auth_ticket');
			}
		},
		async getBindDoctor() {
			// 查找医生信息
			let url = this.getServiceUrl('health', 'srvhealth_patient_doctor_select', 'select');
			let req = {
				serviceName: 'srvhealth_patient_doctor_select',
				colNames: ['*'],
				condition: [{ colName: 'customer_no', ruleType: 'like', value: this.userInfo.no }],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
				// this.doctorList = res.data.data;
				let noList = res.data.data.map(item => item.manager_no);
				let noStr = noList.toString();
				let doctorList = await this.getDoctorInfo(noStr, true);
				if (Array.isArray(doctorList)) {
					this.doctorList = doctorList;
				}
			}
		},
		/*点击前往聊天页面**/
		toChatPage(item) {
			let no = this.userInfo.no;
			uni.navigateTo({
				url: '/personalPages/myDoctor/doctorChat?no=' + no + '&doctor=' + encodeURIComponent(JSON.stringify(item))
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
						// 进行绑定
						if (res.result.indexOf('https://wx2.100xsys.cn/mpwc/' !== -1)) {
							let result = res.result.split('https://wx2.100xsys.cn/mpwc/')[1];
							self.qrcodeParams = result;
							self.toBindDoctor(result);
						} else {
							self.toBindDoctor(res.result);
						}
					}
				}
			});
			// #endif
		},
		async getDoctorRecod(userNo) {
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_consultation_chat_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'sender_account',
						ruleType: 'eq',
						value: userNo
					},
					{
						colName: 'receiver_account',
						ruleType: 'eq',
						value: this.userInfo?this.userInfo.userno:''
					},
					{
						colName: 'msg_state',
						ruleType: 'eq',
						value: '未读'
					}
				],
				order: [
					{
						colName: 'create_time',
						orderType: 'asc'
					}
				]
			};
			let res = await this.$http.post(url, req);
			let length = 0
			if(res.data.data && res.data.data.length > 0){
				length = res.data.data.length
			}
			return length;
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
		toBindDoctor(dtno) {
			let self = this;
			let hasBind = false;
			let doctorList = self.deepClone(self.doctorList);
			if (Array.isArray(doctorList) && doctorList.length > 0) {
				doctorList.forEach(item => {
					if (item.dt_no === dtno) {
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
				this.getDoctorInfo(dtno).then(docInfo => {
					if (docInfo && docInfo.dt_no) {
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
					} else {
						uni.showModal({
							title: '提示',
							content: JSON.stringify(docInfo)
						});
					}
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
					let count_num = 0
					this.doctorList.forEach(item => {
						this.getDoctorRecod(item.owner_account).then(length => {
							count_num += length
							this.count_num = count_num
							this.$set(item, 'count_num', length);
							
							// console.log("-----------------length---",length)
						});
					});
				}
				return res.data.data[0];
			} else {
				return false;
			}
		}
	},
	async onLoad(options) {
		let userInfo = uni.getStorageSync('current_user_info');
		let current_user_info = await this.selectBasicUserList();
		if (current_user_info && current_user_info.userno) {
			userInfo = current_user_info;
		}
		let self = this;
		if (userInfo) {
			this.userInfo = userInfo;
			this.getBindDoctor().then(_ => {
				if (options.q) {
					let text = decodeURIComponent(options.q);
					if (text.indexOf('https://wx2.100xsys.cn/mpwc/' !== -1)) {
						let result = text.split('https://wx2.100xsys.cn/mpwc/')[1];
						self.qrcodeParams = result;
						self.toBindDoctor(result);
					}
				}
			});
		} else {
			uni.showToast({
				title: '未发现用户信息',
				icon: 'none'
			});
		}
	},
	onShow() {
		this.getBindDoctor();
	},
	onReachBottom() {
		// 下拉到底部
		console.log('下拉到底部');
	},
	onPullDownRefresh() {
		// 下拉
		this.getBindDoctor();

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
		display: flex;
		flex-wrap: wrap;
		.doctor-item {
			width:calc( 33% - 40rpx/3);
			margin-top: 20rpx;
			margin-right: 20rpx;
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			border-radius: 20rpx;
			overflow: hidden;
			&:nth-child(3n){
				margin-right: 0;
			}
			.profile {
				width:100%;
				// height: 150rpx;
				// border-radius: 50%;
				overflow: hidden;
				margin-bottom: 10rpx;
				.cuIcon-my {
					font-size: 100rpx;
					color: #fff;
				}
				.image {
					width:100%;
					height:200rpx;
				}
			}
			.content {
				display: flex;
				padding-top: 10rpx;
				position: relative;
				.content-left {
					line-height: 1.8;
					margin-right: 20rpx;
					font-weight: bold;
				}
				.content-right {
					display: flex;
					position: absolute;
					right: -40rpx;
					text {
						background: red;
						min-width: 30rpx;
						height: 30rpx;
						color: #fff;
						font-weight: 600;
						display: flex;
						align-items: center;
						justify-content: center;
						border-radius: 20rpx;
						font-size: 24rpx;
						padding: 0 4rpx;
						position: absolute;
						left: 50%;
						top: -10rpx;
						z-index: 1px !important;
					}
					image {
						width: 50rpx;
						height: 50rpx;
					}
				}
			}
		}
	}
}
</style>
