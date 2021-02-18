<template>
	<!-- 简介、导航、科室列表、名医介绍、就诊通知、在线预约挂号链接 -->
	<view class="hospital-wrap">
		<view class="bg-view" :style="{ 'background-image': `url(${topBgImg ? topBgImg : 'https://tse1-mm.cn.bing.net/th/id/OIP.pX_K8kY1FWrj9h_2YRlqBwHaEB?pid=Api&rs=1'})` }"></view>
		<view class="hospital-top">
			<view class="left">
				<view class="top">
					<view class="name">{{ storeInfo.name }}</view>
				</view>
				<view class="bottom">
					<view class="address" @click="getCurrentLocation">
						<text class="detail">{{ storeInfo.address || '' }}</text>
						<text class="cuIcon-locationfill text-blue margin-left-xs"></text>
					</view>
				</view>
			</view>
			<view class="right">
				<!-- <text class="cuIcon-phone" @click="makePhoneCall"></text> -->
				<image :src="topBgImg" mode="aspectFit"></image>
			</view>
		</view>
		<view class="introduction">
			<view class="title">
				<text class="cuIcon-titles text-blue"></text>
				<text class="">客户管理</text>
			</view>
			<view class="content">
				<view class="professor-box">
					<view class="professor-item" v-for="custom in customerList" :data-item="custom" @click="toNav(custom, 'custom', $event)">
						<image class="img" :src="getImagePath(custom.profile_url)" mode="aspectFit"></image>
						<view class="doc-info">
							<view class="top">
								<text class="doc-name">{{ custom.nick_name || custom.person_name || '' }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="introduction">
			<view class="title">
				<text class="cuIcon-titles text-blue"></text>
				<text class="">就诊记录</text>
			</view>
			<view class="content">
				<view class="professor-box">
					<view class="record-detail " v-for="item in seeDoctorRecord" :key="item.docCode">
						<view class="record-item">
							<view class="label">姓名:</view>
							<view class="value text-bold">{{ item.name || '' }}</view>
						</view>
						<view class="record-item">
							<view class="label">大夫:</view>
							<view class="value text-bold">{{ item.doctor_name || '' }}</view>
						</view>
						<view class="record-item">
							<!-- <view class="label">就诊日期</view> -->
							<view class="value text-gray">{{ formateDate(item.time) }}</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="introduction">
			<view class="title">
				<text class="cuIcon-titles text-blue"></text>
				<text class="">员工管理</text>
			</view>
			<view class="content">
				<view class="professor-box">
					<view class="professor-item" v-for="staff in staffList" :data-item="staff" @click="toNav(staff, 'staff', $event)">
						<image class="img" :src="getImagePath(staff.profile_url)" mode="aspectFit"></image>
						<view class="doc-info">
							<view class="top">
								<text class="doc-name">{{ staff.nick_name || staff.person_name || '' }}</text>
								<view class="titleDn">{{ staff.titleDn }}</view>
							</view>
							<view class="center">
								<view class="depart-name">{{ staff.user_role }}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="cu-modal" :class="{ show: modalName === 'staffDetail' }">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">请选择下一步操作</view>
					<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
				</view>
				<view class="padding-xl bg-white">
					<bx-radio-group class="form-item-content_value radio-group" mode="button" @change="radioChange">
						<bx-radio class="radio" color="#2979ff" v-for="item in ['查看员工信息', '员工管理']" :key="item" :name="item">{{ item }}</bx-radio>
					</bx-radio-group>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { mapState } from 'vuex';
export default {
	data() {
		return {
			modalName: '',
			storeInfo: {},
			storeUserInfo: {},
			storeUserList: [],
			seeDoctorRecord: [],
			curStaff: {}
		};
	},
	computed: {
		staffList() {
			if (Array.isArray(this.storeUserList)) {
				return this.storeUserList.filter(item => item.user_role && (item.user_role.indexOf('用户') === -1 || item.user_role.indexOf('用户,') !== -1));
			} else {
				return [];
			}
		},
		customerList() {
			if (Array.isArray(this.storeUserList)) {
				return this.storeUserList.filter(item => item.user_role && item.user_role.indexOf('用户') !== -1);
			} else {
				return [];
			}
		},
		professorList() {
			if (this.storeInfo && this.storeInfo.professorList) {
				let arr = this.deepClone(this.hospitalData.professorList);
				if (Array.isArray(this.hospitalData.professorList) && this.hospitalData.professorList.length > 3) {
					arr = arr.splice(0, 3);
				}
				return arr;
			}
		},
		topBgImg() {
			if (this.storeInfo && this.storeInfo.image) {
				return this.getImagePath(this.storeInfo.image);
			}
		},
		...mapState({
			userInfo: state => state.user.userInfo,
			inviterInfo: state => state.app.inviterInfo
		})
	},
	methods: {
		hideModal() {
			this.modalName = '';
		},
		radioChange(e) {
			if (e === '查看员工信息') {
				uni.navigateTo({
					url: '/personalPages/DoctorDetail/DoctorDetail?doctor_no=' + this.curStaff.person_no + '&store_no=' + this.curStaff.store_no
				});
			} else if (e === '员工管理') {
				let fieldsCond = [
					{
						column: 'store_no',
						display: false,
						value: this.curStaff.store_no
					},
					{
						column: 'name',
						display: false,
						value: this.curStaff.name
					},
					{
						column: 'type',
						display: false,
						value: this.curStaff.type
					},
					{
						column: 'nick_name',
						display: false,
						value: this.curStaff.nick_name
					},
					{
						column: 'user_account',
						display: false,
						value: this.curStaff.user_account
					},
					{
						column: 'sex',
						display: false,
						value: this.curStaff.sex
					}
				];
				uni.navigateTo({
					url: '/publicPages/newForm/newForm?serviceName=srvhealth_store_user_update&type=update&fieldsCond=' + encodeURIComponent(JSON.stringify(fieldsCond))
				});
			}
		},
		toNav(data, type, event) {
			if (type === 'custom') {
				// 患者详情
				uni.navigateTo({
					url: `/personalPages/patientsInfo/patientsInfo?customer_no=${data.person_no}&store_no=${data.store_no}`
				});
			} else if (type === 'staff') {
				// 点击员工头像 -  弹出弹框提示选择跳转到员工信息页面还是员工管理页面
				this.modalName = 'staffDetail';
				this.curStaff = data;
			}
		},
		getCurrentLocation() {
			let latitude = 34.219329;
			let longitude = 108.935485;
			uni.openLocation({
				latitude: this.storeInfo.latitude ? Number(this.storeInfo.latitude) : latitude,
				longitude: this.storeInfo.longitude ? Number(this.storeInfo.longitude) : longitude,
				name: this.storeInfo.name,
				address: this.storeInfo.address,
				success: function() {
					console.log('success');
				},
				fail(err) {
					console.log('err', err);
				}
			});
		},
		async getSeeDoctorRecord() {
			// 就诊记录
			let url = this.getServiceUrl('health', 'srvhealth_see_doctor_record_select', 'select');
			let req = {
				serviceName: 'srvhealth_see_doctor_record_select',
				colNames: ['*'],
				condition: [{ colName: 'store_no', ruleType: 'eq', value: this.storeInfo.store_no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				this.seeDoctorRecord = res.data.data;
				return res.data.data;
			}
		},
		async getStoreUserList() {
			let url = this.getServiceUrl('health', 'srvhealth_store_user_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_user_select',
				colNames: ['*'],
				condition: [{ colName: 'store_no', ruleType: 'eq', value: this.storeInfo.store_no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				this.storeUserList = res.data.data;
				return res.data.data;
			}
		},
		async getStoreUserInfo(no) {
			let url = this.getServiceUrl('health', 'srvhealth_store_user_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_user_select',
				colNames: ['*'],
				condition: [{ colName: 'person_no', ruleType: 'eq', value: this.userInfo.no }, { colName: 'store_no', ruleType: 'eq', value: no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.storeUserInfo = res.data.data[0];
				return res.data.data;
			}
		},
		async getStoreInfo(no) {
			let url = this.getServiceUrl('health', 'srvhealth_store_mgmt_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_mgmt_select',
				colNames: ['*'],
				condition: [{ colName: 'store_no', ruleType: 'eq', value: no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.storeInfo = res.data.data[0];
				this.getStoreUserList();
				this.getSeeDoctorRecord();
				return res.data.data;
			}
		},
		async addToStore(store_no, invite_no) {
			// 添加用户到单位
			let url = this.getServiceUrl('health', 'srvhealth_store_user_add', 'operate');
			let req = [
				{
					serviceName: 'srvhealth_store_user_add',
					condition: [],
					data: [
						{
							add_url: this.inviterInfo.add_url,
							invite_user_no: this.inviterInfo.invite_user_no,
							store_no: store_no,
							person_no: this.userInfo.no,
							user_role: '用户'
						}
					]
				}
			];
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS') {
				uni.showModal({
					title: '提示',
					content: `您已成功加入【${this.storeInfo.name}】`,
					success(res) {
						if (res.confirm) {
							// 跳转到店铺详情
							// uni.navigateTo({
							// 	url: '/pediaPages/ClinicDetail/ClinicDetail?store_no=' + store_no
							// });
						}
					}
				});
			}
		}
	},
	onLoad(option) {
		this.checkOptionParams(option);
		this.toAddPage();
		if (option.share_type === 'bindOrganization') {
			// 绑定诊所
			if (option.store_no && option.invite_user_no) {
				this.getStoreUserInfo(option.store_no).then(res => {
					this.getStoreInfo(option.store_no).then(data => {
						if (Array.isArray(res) && res.length == 1) {
							// 跳转到店铺详情
							uni.redirectTo({
								url: '/pediaPages/StoreList/StoreList?from=liststore_no=' + res[0].store_no
							});
						} else if (Array.isArray(res) && res.length > 1) {
							// 跳转到店铺列表
							uni.redirectTo({
								url: '/personalPages/StoreList/StoreList'
							});
						} else {
							// 当前用户不在此诊所中 则添加当前用户到此诊所中
							this.addToStore(option.store_no, option.invite_user_no);
						}
					});
				});
			}
		} else if (option.store_no && option.from === 'list') {
			// 从我的店铺列表中跳转
			this.getStoreInfo(option.store_no);
			this.getStoreUserInfo(option.store_no);
		}
	}
};
</script>

<style scoped lang="scss">
.hospital-wrap {
	border-top: 1rpx solid #f1f1f1;
	background-color: #f9f9f9;
	.bg-view {
		width: 100%;
		height: 200rpx;
		background-size: 100% 400rpx;
		background-repeat: no-repeat;
		filter: blur(20rpx);
		position: absolute;
		top: 0;
		left: 0;
		z-index: 0;
	}
	.hospital-top {
		// border-radius: 20rpx;
		background-color: #fff;
		padding: 50rpx 28rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		display: flex;
		align-items: center;
		margin: 0rpx 10rpx 20rpx;
		margin-top: 40px;
		position: relative;
		.left {
			display: flex;
			flex-direction: column;
			flex: 1;
			position: relative;
			&::after {
				position: absolute;
				right: 0;
				top: 10%;
				height: 80%;
				content: '';
				width: 1px;
				background-color: #dfdada;
			}
			.top {
				display: flex;
				.name {
					font-size: 32rpx;
					font-weight: 800;
					color: #333;
				}
				.tags {
					display: flex;
					.tag {
						display: inline-block;
						margin-left: 10rpx;
						padding: 5rpx 10rpx;
						background-color: #0ea8ff;
						color: #fff;
						border-radius: 10rpx;
					}
				}
			}
			.bottom {
				padding-top: 10rpx;
				.address {
					color: #bbb;
					display: flex;
					.cuIcon-locationfill {
						width: 80rpx;
						display: flex;
						align-items: flex-start;
						justify-content: center;
					}
					.detail {
						width: 90%;
						overflow: scroll;
					}
				}
			}
		}
		.right {
			margin-left: 20rpx;
			width: 100rpx;
			height: 100rpx;
			font-size: 70rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			color: #0ea8ff;
			border-radius: 10rpx;
			overflow: hidden;
			position: absolute;
			right: 20px;
			top: -50rpx;
			border: 4rpx solid #fff;
			box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
			// transform: rotate(10deg);
		}
	}
	.introduction {
		// 简介
		background-color: #fff;
		padding: 20rpx;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
		margin-bottom: 20rpx;
		&.news .title {
			border-bottom: 1rpx solid #ccc;
		}
		.news-list {
			.news-item {
				display: flex;
				padding: 20rpx 0;
				border-bottom: 1rpx dotted #f1f1f1;
				align-items: center;

				.title-text {
					width: 70%;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
				}
				.date {
					flex: 1;
					text-align: right;
					color: #ccc;
				}
			}
		}
		.title {
			font-size: 28rpx;
			font-weight: 700;
			padding: 10rpx 0;
			color: rgb(48, 49, 51);
		}
		.content {
			.rich-text {
				height: 300rpx;
				overflow: scroll;
			}
			&.grid-layout {
				display: flex;
				.group-item {
					width: 25%;
					display: flex;
					padding: 20rpx 10rpx;
					flex-direction: column;
					align-items: center;
					// background-color: #f1f1f1;
					border-radius: 20rpx;
					& + .group-item {
						border-top: none;
					}
					.icon {
						border-radius: 10rpx;
						position: relative;
						width: 100rpx;
						height: 100rpx;
						display: flex;
						.image {
							border-radius: 50rpx;
							width: 100%;
							height: 100%;
						}
					}
					.top {
						.name {
							margin-top: 10rpx;
							font-weight: bold;
							font-size: 28rpx;
							letter-spacing: 0;
						}
					}
				}
			}
			.professor-box {
				display: flex;
				flex-wrap: wrap;
				.record-detail {
					box-shadow: 4px 0px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
					width: calc(33% - 40rpx / 3);
					display: flex;
					flex-wrap: wrap;
					justify-content: flex-start;
					align-items: center;
					margin-bottom: 10rpx;
					margin-right: 10rpx;
					margin-left: 10rpx;
					&:nth-child(3n) {
						margin-right: 0;
						margin-left: 0;
					}
					padding: 10rpx;
					.record-item {
						width: 100%;
						display: flex;
						padding: 5rpx 0;
						align-items: center;
						.label {
							font-size: 12px;
							color: #888;
							margin-right: 5px;
						}
					}
				}
				.professor-item {
					padding: 10rpx;
					margin-bottom: 10rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					width: 25%;

					.img {
						width: 100rpx;
						height: 100rpx;
						border-radius: 10rpx;
					}
					.doc-info {
						display: flex;
						width: 100%;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						text-align: center;
						.top {
							width: 100%;
							text-align: center;
							padding: 10rpx 0;
							.doc-name {
								font-size: 34rpx;
								letter-spacing: 5rpx;
							}
						}
						.center {
							width: 100%;
							.depart-name {
								width: 100%;
								text-overflow: ellipsis;
								overflow: hidden;
								white-space: nowrap;
								font-size: 26rpx;
								color: #5e5e5e;
								padding: 2px 0;
							}
						}
						.bottom {
							overflow: hidden;
							text-overflow: -o-ellipsis-lastline;
							overflow: hidden;
							text-overflow: ellipsis;
							display: -webkit-box;
							-webkit-line-clamp: 2;
							-webkit-box-orient: vertical;
							color: #afafaf;
							font-size: 24rpx;
						}
					}
				}
			}
		}
	}
}
</style>
