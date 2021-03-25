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
					<view class="introduce" v-if="doctorStoreList.length === 1&&doctorStoreList[0].staff_introduction">
						{{ doctorStoreList[0].staff_introduction }}
					</view>
					<view class="introduce" v-else>
						暂无介绍
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
			storeNo: '',
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
			if (this.storeNo) {
				req.condition.push({
					colName: 'store_no',
					ruleType: 'eq',
					value: this.storeNo
				});
			}
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
		if (option.store_no) {
			this.storeNo = option.store_no;
		}
		if (option.doctor_no) {
			this.getDoctorInfo(option.doctor_no);
		}
	}
};
</script>

<style scoped lang="scss">
@import './style.scss';
</style>
