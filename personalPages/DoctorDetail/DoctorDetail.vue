<template>
	<!-- 简介、导航、科室列表、名医介绍、就诊通知、在线预约挂号链接 -->
	<view class="hospital-wrap">
		<view class="bg-view" :style="{ 'background-image': `url(${topBgImg ? topBgImg : 'https://tse1-mm.cn.bing.net/th/id/OIP.pX_K8kY1FWrj9h_2YRlqBwHaEB?pid=Api&rs=1'})` }"></view>
		<view class="hospital-top">
			<view class="left">
				<view class="top">
					<view class="name">{{ doctorInfo.name }}</view>
				</view>
				<view class="bottom">
					<view class="introduce">
						副主任医师，毕业于xx大学医学院，美国Mayo Clinic
						从事博士后研究1年。擅长肝脏肿瘤及胆道结石微创外科治疗。中国医师协会腹腔镜肝切除推广与发展专家委员会委员，陕西省分会腹腔镜外科学会青年委员会副主任委员。长期参与肝脏肿瘤和胆管结石的临床及基础研究，积累了丰富的经验。主持省级科研基金一项，参与多项国家及省级科研基金课题研究
					</view>
					<!-- 	<view class="address" @click="getCurrentLocation">
						<text class="detail">{{ storeInfo.address || '' }}</text>
						<text class="cuIcon-locationfill text-blue margin-left-xs"></text>
					</view> -->
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
				<text class="">出诊表</text>
			</view>
			<uni-calendar :selected="calenderSelected" :insert="true" :lunar="true" :start-date="'2019-3-2'" :end-date="'2019-5-20'"></uni-calendar>
		</view>
		<view class="button-area">
			<view class="button-item" @click="toPages('seeDoctor')">
				<button class="cu-btn bg-cyan"><text class="cuIcon-edit"></text></button>
				<view class="button-label">就诊登记</view>
			</view>
			<view class="button-item" @click="toPages('toContant')">
				<button class="cu-btn bg-blue"><text class="cuIcon-comment"></text></button>
				<view class="button-label">信息咨询</view>
			</view>
		</view>
		<view class="cu-modal" :class="{ show: modalName === 'sotre-list' }">
			<view class="cu-dialog">
				<view class="sotre-list">
					<view class="cu-bar bg-white justify-end">
						<view class="content">请选择就诊诊所</view>
						<view class="action" @tap="hideModal"><text class="cuIcon-close text-red"></text></view>
					</view>
					<view class="padding-xl">
						<button class="cu-btn store-item bg-cyan" v-for="item in doctorStoreList" @tap="toPages('seeDoctor', item)">{{ item.name }}</button>
					</view>
					<view class="cu-bar bg-white justify-center">
						<view class="action"><button class="cu-btn line-blue text-blue" @tap="hideModal">取消</button></view>
					</view>
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
			doctorInfo: {},
			relationInfo: {},
			storeInfo: {},
			calenderSelected: [
				{ date: '2021-01-22', info: '出诊', status: 'primary' },
				{ date: '2021-01-18', info: '出诊', status: 'primary' },
				{ date: '2021-01-21', info: '出诊', status: 'primary' },
				{ date: '2021-01-20', info: '出诊', status: 'primary' }
			],
			doctorStoreList: [],
			seeDoctorRecord: [],
			modalName: ''
		};
	},
	computed: {
		topBgImg() {
			if (this.doctorInfo && this.doctorInfo.user_image) {
				return this.getImagePath(this.doctorInfo.user_image);
			} else if (this.doctorInfo && this.doctorInfo.profile_url) {
				return this.getImagePath(this.doctorInfo.profile_url);
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
		toPages(type, data) {
			let url = '';
			switch (type) {
				case 'seeDoctor':
					let filedsCond = [
						{
							column: 'user_info_no',
							display: false
						},
						{
							column: 'name',
							value: this.userInfo.name
						},
						{
							column: 'time',
							value: this.formateDate()
						},
						{
							column: 'user_no',
							display: false
						},
						{
							column: 'doctor_no',
							display: false,
							value: this.doctorInfo.no
						},
						{
							column: 'doctor_name',
							display: false,
							value: this.doctorInfo.name
						}
					];
					if (this.doctorStoreList.length > 1) {
						// 医生所在诊所数量>1 先选择诊所
						this.modalName = 'sotre-list';
						if (data) {
							filedsCond.push({
								column: 'store_no',
								display: false,
								value: data.store_no
							});
							url = '/publicPages/newForm/newForm?serviceName=srvhealth_see_doctor_record_add&type=add&fieldsCond=' + decodeURIComponent(JSON.stringify(filedsCond));
						}
					} else {
						if (this.doctorStoreList.length === 1) {
							filedsCond.push({
								column: 'store_no',
								display: false,
								value: this.doctorStoreList[0].store_no
							});
						} else if (this.doctorStoreList.length === 0) {
							filedsCond.push({
								column: 'store_no',
								display: false
							});
						}
						url = '/publicPages/newForm/newForm?serviceName=srvhealth_see_doctor_record_add&type=add&fieldsCond=' + decodeURIComponent(JSON.stringify(filedsCond));
					}
					break;
				case 'toContant':
					url = `/personalPages/myDoctor/doctorChat?no=${this.doctorInfo.no}&doctor=${encodeURIComponent(JSON.stringify(this.relationInfo))}`;
					break;
			}
			if (url) {
				this.hideModal();
				uni.navigateTo({
					url: url
				});
			}
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
		async getStoreUserInfo(no) {
			let url = this.getServiceUrl('health', 'srvhealth_store_user_select', 'select');
			let req = {
				serviceName: 'srvhealth_store_user_select',
				colNames: ['*'],
				condition: [{ colName: 'person_no', ruleType: 'eq', value: this.doctorInfo.no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data)) {
				this.doctorStoreList = res.data.data;
				return res.data.data;
			}
		},
		async getRelationInfo() {
			let url = this.getServiceUrl('health', 'srvhealth_person_relation_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_relation_select',
				colNames: ['*'],
				condition: [{ colName: 'usera_person_no', ruleType: 'eq', value: this.doctorInfo.no }, { colName: 'userb_person_no', ruleType: 'eq', value: this.userInfo.no }],
				relation_condition: {},
				page: null,
				order: [],
				draft: false,
				query_source: 'list_page'
			};
			let res = await this.$http.post(url, req);
			if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.relationInfo = res.data.data[0];
			}
		},
		async getDoctorInfo(no) {
			let url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
			let req = {
				serviceName: 'srvhealth_person_info_select',
				colNames: ['*'],
				condition: [{ colName: 'no', ruleType: 'eq', value: no }]
			};
			let res = await this.$http.post(url, req);
			if (Array.isArray(res.data.data) && res.data.data.length > 0) {
				this.doctorInfo = res.data.data[0];
				this.getStoreUserInfo();
				this.getRelationInfo();
				return res.data.data;
			}
		}
	},
	onLoad(option) {
		this.checkOptionParams(option);
		this.toAddPage();
		if (option.doctor_no) {
			this.getDoctorInfo(option.doctor_no);
		}
		// if (option.share_type === 'bindOrganization') {
		// 	// 绑定诊所
		// 	if (option.store_no && option.invite_user_no) {
		// 		this.getStoreUserInfo(option.store_no).then(res => {
		// 			this.getStoreInfo(option.store_no).then(data => {
		// 				if (Array.isArray(res) && res.length == 1) {
		// 					// 跳转到店铺详情
		// 					uni.redirectTo({
		// 						url: '/pediaPages/StoreList/StoreList?from=liststore_no=' + res[0].store_no
		// 					});
		// 				} else if (Array.isArray(res) && res.length > 1) {
		// 					// 跳转到店铺列表
		// 					uni.redirectTo({
		// 						url: '/personalPages/StoreList/StoreList'
		// 					});
		// 				} else {
		// 					// 当前用户不在此诊所中 则添加当前用户到此诊所中
		// 					this.addToStore(option.store_no, option.invite_user_no);
		// 				}
		// 			});
		// 		});
		// 	}
		// } else if (option.store_no && option.from === 'list') {
		// 	// 从我的店铺列表中跳转
		// 	this.getStoreInfo(option.store_no);
		// 	this.getStoreUserInfo(option.store_no);
		// }
	}
};
</script>

<style scoped lang="scss">
.hospital-wrap {
	border-top: 1rpx solid #f1f1f1;
	position: relative;
	.bg-view {
		width: 100%;
		height: 300rpx;
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

		.introduce {
			color: #666;
		}
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
				// background-color: #dfdada;
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

		.title {
			font-size: 28rpx;
			font-weight: 700;
			padding: 10rpx 0;
			color: rgb(48, 49, 51);
		}
	}
	.button-area {
		background-color: #fff;
		padding: 20rpx;
		display: flex;
		justify-content: center;
		.button-item + .button-item {
			margin-left: 100rpx;
		}
		.button-label {
			padding: 10rpx 0;
			font-size: 12px;
		}
		.cu-btn {
			border-radius: 50%;
			margin-bottom: 5px;
			width: 100rpx;
			height: 100rpx;
			font-size: 30px;
			display: flex;
			justify-content: center;
			align-items: center;
			& + .cu-btn {
				margin-left: 20rpx;
			}
		}
	}
}
.padding-xl {
	display: flex;
	flex-wrap: wrap;
	.store-item {
		padding: 10rpx 20rpx;
		border-radius: 0;
		width: calc(50% - 10rpx);
		& + .store-item {
			margin-left: 20rpx;
			margin-bottom: 5px;
		}
		& + .store-item:nth-child(2n + 1) {
			margin-left: 0;
		}
	}
}
</style>
