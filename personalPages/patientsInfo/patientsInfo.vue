<template>
	<view class="health-archive-page-wrap">
		<cu-custom :isBack="true" @onBack="onBack">
			<!-- <block slot="backText">返回</block> -->
			<block slot="content">患者信息</block>
		</cu-custom>
		<patients-info :customer_no="customer_no" :dp_no="dp_no" v-if="current_tab == 0"></patients-info>
		<person-chat ref="chat" :customer_no="customer_no" v-if="current_tab == 1"></person-chat>
		<view class="health-bottom">
			<view @click="changeTab(index)" v-for="(item,index) in bottom_tab_data" :key="index" class="info-bottom-tab" :class="current_tab==index?'active-text':''">
				<view class="info-bottom-tab-top">
					<image style="width: 70rpx;" v-show="current_tab!=index && item.name==='交流'" src="../static/chats.png" mode=""></image>
					<image style="width: 70rpx;" v-show="current_tab==index && item.name==='交流'" src="../static/chat-active.png" mode=""></image>
					<image v-show="current_tab!=index && item.name==='患者信息'" src="../static/record.png" mode=""></image>
					<image v-show="current_tab==index && item.name==='患者信息'" src="../static/record-active.png" mode=""></image>
					<text class="info-message-count" v-if="current_tab!=index && item.name==='交流' && unreadMessage != 0">{{unreadMessage}}</text>
				</view>
				
				<view class="info-bottom-tab-bot">
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import patientsInfo from '@/personalPages/components/personInfo/personInfo.vue'
	import personChat from '@/personalPages/components/personInfo/personchat.vue'
export default {
	name:'patientsInfos',
	components:{
		patientsInfo,
		personChat
	},
	data(){
		return {
			bottom_tab_data:[{
				name:'患者信息'
			},{
				name:'交流'
			}],
			current_tab:0,
			customer_no:'',
			dp_no:'',
			unreadMessage:0
		}
	},
	mounted() {
		uni.$on('userInfos',(e)=>{
			console.log("----------",e)
			this.getMessageInfo(e.userno)
		})
	},
	methods:{
		onBack(){
			
			uni.$emit('backPage')
		},
		/*点击底部tab切换*/
		changeTab(i){
			this.current_tab = i
		},
		async getMessageInfo(no){
			let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
			let userno = this.$store.state.user.userInfo.userno
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
			this.unreadMessage = res.data.data.length
		},
	},
	
	onLoad(option) {
		if (option.customer_no) {
			this.customer_no = option.customer_no;
		}
		if(option.dp_no){
			this.dp_no = option.dp_no
		}
		if(option.tab){
			this.current_tab = option.tab
		}
	},
	onPullDownRefresh() {
		// 下拉
		setTimeout(() => {
			if(this.current_tab == 1){
				this.$refs.chat.getUserInfo(this.customer_no);
			}
			uni.stopPullDownRefresh();
		}, 1000);
	}
};
</script>

<style scoped lang="scss">
.info-bottom-tab-top{
	display: flex;
	position: relative;
}
.health-bottom{
	display: flex;
	position: fixed;
	bottom: 0;
	background-color: #fff;
	width: 100%;
	// padding: 20rpx 0;
	height: 100rpx;
	justify-content: space-around;
	// border-top: 1px solid rgba(0, 0, 0, 0.33);
	box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
	.info-bottom-tab{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
		width: 49%;
		&:first-of-type{
			// border-right:1px solid rgba(0, 0, 0, 0.33);
		}
	}
	image{
		width: 50rpx;
		height: 50rpx;
	}
	
	text{
		// width: 49%;
		// text-align: center;
		// line-height: 80rpx;
		font-size: 24rpx;
		// &:first-child{
		// 	border-right: 1px solid rgba(0, 0, 0, 0.33);
		// }
	}
	.active-text{
		color: #FACC31;
	}
}	
.info-message-count{
	position: absolute;
	background: red;
	right: -5px;
	padding: 0 5px;
	color: #fff;
	border-radius: 5px;
	top: -5px;
}
</style>
