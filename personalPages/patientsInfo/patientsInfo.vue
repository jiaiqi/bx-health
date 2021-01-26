<template>
	<view class="health-archive-page-wrap">
		<cu-custom :isBack="true" @onBack="onBack"><block slot="content">患者信息</block></cu-custom>
		<patients-info :customer_no="customer_no" :dp_no="dp_no" :store-no="store_no"></patients-info>
	</view>
</template>

<script>
import patientsInfo from '@/personalPages/components/personInfo/personInfo.vue';
import personChat from '@/personalPages/components/personInfo/personchat.vue';
export default {
	name: 'patientsInfos',
	components: {
		patientsInfo,
		personChat
	},
	data() {
		return {
			store_no: '',
			current_tab: 0,
			customer_no: '',
			dp_no: '',
			unreadMessage: 0
		};
	},
	mounted() {
		uni.$on('userInfos', e => {
			this.getMessageInfo(e.userno);
		});
	},
	methods: {
		onBack() {
			uni.$emit('backPage');
		},
		async getMessageInfo(no) {
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
			let userno = this.$store.state.user.userInfo.userno;
			let req = {
				serviceName: 'srvhealth_consultation_chat_record_select',
				colNames: ['*'],
				condition: [
					{
						colName: 'sender_account',
						ruleType: 'eq',
						value: no
					},
					{
						colName: 'receiver_account',
						ruleType: 'eq',
						value: userno
					},
					{
						colName: 'identity',
						ruleType: 'eq',
						value: '患者'
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
			this.unreadMessage = res.data.data.length;
		}
	},

	onLoad(option) {
		if (option.customer_no) {
			this.customer_no = option.customer_no;
		}
		if (option.store_no) {
			this.store_no = option.store_no;
		}
		if (option.dp_no) {
			this.dp_no = option.dp_no;
		}
		if (option.tab) {
			this.current_tab = option.tab;
		}
	}
};
</script>
