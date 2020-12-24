<script>
import Vue from 'vue';
export default {
	globalData: {
		globalTextFontSize: 18,
		globalLabelFontSize: 16
	},
	onLaunch() {
		// #ifdef H5
		// uni.navigateBack = (params)=>{
		// 	let {delta,animationDuration,animationType} = params
		// 	let pages = getCurrentPages()
		// 	if(pages.length<=1){
		// 		// H5端页面刷新之后页面栈会消失，此时navigateBack不能返回
		// 		history.back()
		// 	}else{
		// 		uni.navigateBack({
		// 			delta:delta,
		// 			animationDuration:animationDuration,
		// 			animationType:animationType
		// 		})
		// 	}
		// }
		// #endif
		// #ifdef MP-WEIXIN
		uni.onMemoryWarning(function() {
			console.log('onMemoryWarningReceive');
			uni.showModal({
				title: '警告',
				content: 'onMemoryWarningReceive,内存不足'
			});
		});
		// #endif
		this.judgeClientEnviroment();
		uni.setStorageSync('isThirdParty', this.$api.isThirdParty);
		uni.getSystemInfo({
			success: function(e) {
				// #ifndef MP
				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				}
				// #endif

				// #ifdef MP-WEIXIN
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif

				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
			}
		});
	},
	methods: {
		async getBindDoctor(no) {
			// 查找医生信息
			let url = this.getServiceUrl('health', 'srvhealth_patient_doctor_select', 'select');
			let req = {
				serviceName: 'srvhealth_patient_doctor_select',
				colNames: ['*'],
				condition: [{ colName: 'customer_no', ruleType: 'like', value: no }],
				page: { pageNo: 1, rownumber: 10 },
				order: []
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data)) {
				// this.doctorList = res.data.data;
				let noList = res.data.data.map(item => item.manager_no);
				let noStr = noList.toString();
				await this.getDoctorInfo(noStr, true);
				// if (Array.isArray(doctorList)) {
				// 	this.doctorList = doctorList;
				// }
			}
		},
		async getDoctorRecod(userNo) {
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_consultation_chat_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'receiver_account',
						ruleType: 'eq',
						value: userNo
					},
					{
						colName: 'msg_state',
						ruleType: 'eq',
						value: '未读'
					},
					{
						colName: 'identity',
						ruleType: 'notnull'
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
			if (Array.isArray(res.data.data)) {
				return res.data.data.length;
			}
		}
	},
	onShow: function() {
		console.log('APP Show-------', uni.getStorageSync('current_user_info'));
		let userNo = uni.getStorageSync('current_user_info');
		if (userNo.userno) {
			this.getDoctorRecod(userNo.userno).then(length => {
				if (!length && length !== 0) {
					length = 0;
				}
				if (length > 99) {
					length = '99+';
				} else {
					length = `${length}`;
				}
				if (length != 0) {
					
					uni.setTabBarBadge({
						index: 3,
						text: length,
						success: e => {
							console.log('success---', e);
						},
						fail: fails => {
							console.log('fails----', fails);
						}
					});
				} else {
					uni.removeTabBarBadge({
						index: 3
					});
				}
			});
		}

		if (this.$api.singleApp) {
			uni.setStorageSync('activeApp', this.$api.appName);
		}
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	}
};
</script>

<style lang="scss">
@import 'colorui/main.css';
@import 'colorui/icon.css';
@import '@/common/uni.css';

/*每个页面公共css */
// --page-height:calc(100vh - var(--window-top) - var(--window-bottom))
#app,
uni-page-body,
uni-page-wrapper {
	background: #f1f1f1 !important;
}
html,
body {
	height: auto;
	background: #f1f1f1 !important;
}
uni-page-body > uni-view {
	height: 100%;
}
.button-box {
	display: flex;
	justify-content: space-around;
	flex-wrap: wrap;
	.button {
		min-width: 45%;
	}
}
</style>
