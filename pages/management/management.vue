<template>
	<view><bx-filter :searchArg="searchArg" v-if="searchArg" :menuAgList="menuAgList" @clickItem="toPages('patients',$event)" @click-add-item="clickAddItem"></bx-filter></view>
</template>

<script>
import bxFilter from '@/components/bx-filtrate/bx-filtrate';
export default {
	components: {
		bxFilter
	},
	data() {
		return {
			userInfo: {},
			currentUser: {},
			doctorInfo: {},
			searchArg: null,
			menuAgList: null
		};
	},
	methods: {
		toPages(type,item){
			if(type==='patients'&&item.customer_no){
				uni.navigateTo({
					url: '/personalPages/patientsInfo/patientsInfo?customer_no='+item.customer_no
				});
			}
		},
		clickAddItem() {
			uni.navigateTo({
				url: '/personalPages/nameCard/nameCard'
			});
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
		buildMenuAgList() {
			let obj = {
				classify_name: '性别',
				type: 'food',
				colunn: 'sex',
				children: [
					{
						title: '全部',
						value: '全部',
						choose: true
					},
					{
						title: '男',
						value: '男',
						choose: false
					},
					{
						title: '女',
						value: '女',
						choose: false
					}
				]
			};
			this.menuAgList = [obj];
		},
		buildSearchArg(doctorInfo) {
			if (doctorInfo.dt_no) {
				this.searchArg = {
					serviceName: 'srvhealth_patient_doctor_select',
					imgCol: 'customer_profile_url',
					condition: [{ colName: 'manager_no', ruleType: 'like', value: doctorInfo.dt_no }],
					wordKey: {
						title: 'customer_name'
					}
				};
			}
		}
	},
	created() {
		let userInfo = uni.getStorageSync('wxUserInfo');
		this.userInfo = userInfo;
		let userList = uni.getStorageSync('user_info_list');
		let current_user = uni.getStorageSync('current_user');
		if (userList && current_user) {
			let currentUser = userList.filter(item => {
				return item.name === current_user;
			});
			if (Array.isArray(currentUser) && currentUser.length > 0) this.currentUser = currentUser[0];
			this.getDoctorInfo().then(res => {
				if (res && res.dt_no) {
					this.doctorInfo = res;
					this.buildSearchArg(res);
					this.buildMenuAgList();
				}
			});
		}
	}
};
</script>

<style></style>
