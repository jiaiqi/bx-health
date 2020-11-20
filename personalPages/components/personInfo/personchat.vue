<template>
	<view class="person-chat-wrap">
		<view class="person-chat-top">
			<view v-for="(item,index) in recordList" :key="index" class="person-chat-item" :class="item.sender_account === currentUserInfo.user_no?'person-chat-item-my':''">
				<view v-if="doctor_no?item.sender_account === doctor_no : item.sender_account === userInfo.userno" class="person-chat-item-accept">
					<view class="person-chat-item-left">
						<image src="../../static/doctor_default.jpg" mode=""></image>
					</view>
					<view class="person-chat-item-right">
						<text>{{item.msg_content}}</text>
					</view>
				</view>
				<view v-else-if="item.sender_account === currentUserInfo.user_no" class="person-chat-item-send">
					<text class="unread" v-if="item.msg_state === '未读'">{{item.msg_state}}</text>
					<view class="person-chat-item-right">
						<text>{{item.msg_content}}</text>
					</view>
					<view class="person-chat-item-left">
						<image src="../../static/doctor_default.jpg" mode=""></image>
					</view>
				</view>
				
			</view>
		</view>
		<view class="person-chat-bot" :class="doctor_no?'person-doctor-chat-bot':''">
			<view class="person-chat-left">
				<input @input="changeTest" v-model="chatText" type="text" value="" />
			</view>
			<view class="person-chat-rig">
				<text @click="changeType('link')" v-if="!isFeed && current_type === 'world'">链接</text>
				<text @click="changeType('world')" v-if="!isFeed && current_type === 'link'">文字</text>
				<text class="send" @click="sendMessage" v-if="isFeed">发送</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name:'personchat',
		components:{
			
		},
		props:{
			customer_no: {
				type: String,
				default() {
					return '';
				}
			},
			pageType:{
				type: String,
				default() {
					return '';
				}
			},
			doctor_no:{
				type: String,
				default() {
					return '';
				}
			},
		},
		computed:{
			isFeed(){
				let feed = false
				if(this.chatText){
					feed = true
				}else{
					feed = false
				}
				return feed
			}
		},
		data(){
			return {
				chatText:'',
				// isFeed:false,
				current_type:'world',
				userInfo:'',
				recordList:[],
				currentUserInfo:uni.getStorageSync('login_user_info')
			}
		},
		methods:{
			/*切换文字或者链接**/
			changeType(type){
				this.current_type = type
			},
			/*点击发送**/
			sendMessage(){
				this.sendMessageInfo()
				this.chatText = ""
			},
			
			/*input框内有没有内容**/
			changeTest(){
				
			},
			/*点击发送后添加数据**/
			async sendMessageInfo(){
				let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_add', 'operate');
				let req = [{
					serviceName: 'srvhealth_consultation_chat_record_add',
					colNames: ['*'],
					data:[{
						sender_account:this.currentUserInfo.user_no,
						receiver_account:this.doctor_no?this.doctor_no:this.userInfo.userno,
						msg_content_type:this.current_type==='world'?'文本':'链接',
					}]
				}];
				if(this.current_type === 'world'){
					req[0].data[0].msg_content=this.chatText
				}else{
					req[0].data[0].msg_link=this.chatText
				}
				console.log("res========>",req)
				let res = await this.$http.post(url, req);
				if(res.data.state === 'SUCCESS'){
					console.log("发送成功")
					this.getMessageInfo()
					
				}
			},
			/*查询当前登陆人和其他人聊天记录**/
			async getMessageInfo(type=null){
				let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_select', 'select');
				let req = {
					serviceName: 'srvhealth_consultation_chat_record_select',
					colNames: ['*'],
					relation_condition:{
						relation:'OR',
						data:[]
					},
					order:[{
						colName:'create_time',
						orderType:'asc'
					}]
				};
				let conditionData = []
				if(this.pageType){
					conditionData = [{
							relation:'AND',
							data:[{
								colName:'sender_account',
								ruleType:'eq',
								value:this.doctor_no
							},{
								colName:'receiver_account',
								ruleType:'eq',
								value:this.userInfo.userno
							}]
						},{
							relation:'AND',
							data:[{
								colName:'sender_account',
								ruleType:'eq',
								value:this.userInfo.userno
							},{
								colName:'receiver_account',
								ruleType:'eq',
								value:this.doctor_no
							}]
						}]
				}else{
					conditionData = [{
							relation:'AND',
							data:[{
								colName:'sender_account',
								ruleType:'eq',
								value:this.currentUserInfo.user_no
							},{
								colName:'receiver_account',
								ruleType:'eq',
								value:this.userInfo.userno
							}]
						},{
							relation:'AND',
							data:[{
								colName:'sender_account',
								ruleType:'eq',
								value:this.userInfo.userno
							},{
								colName:'receiver_account',
								ruleType:'eq',
								value:this.currentUserInfo.user_no
							}]
						}]
				}
				req.relation_condition.data = conditionData
				let res = await this.$http.post(url, req);
				if(res.data.data.length > 0){
					this.recordList = res.data.data
					if(type && type === 'onLoad'){
						this.updateMessageInfo()
					}
				}
			},
			/*修改消息记录状态**/
			async updateMessageInfo(){
				let url = this.getServiceUrl('health', 'srvhealth_consultation_chat_record_update', 'operate');
				let req = [{
					serviceName: 'srvhealth_consultation_chat_record_update',
					colNames: ['*'],
					condition:[{
						colName:'sender_account',
						ruleType:'eq',
						value:this.doctor_no?this.doctor_no:this.userInfo.userno
					},{
						colName:'msg_state',
						ruleType:'eq',
						value:'未读'
					}],
					data:[{
						msg_state:'已读'
					}]
				}];
				let res = await this.$http.post(url, req);
				if(res.data.state === 'SUCCESS'){
					this.getMessageInfo()
					console.log("更新成功")
				}				
			},
			/*查询当前病人**/
			async getUserInfo(customer_no) {						
				let url = this.getServiceUrl('health', 'srvhealth_person_info_select', 'select');
				let req = {
					serviceName: 'srvhealth_person_info_select',
					colNames: ['*'],
					condition: [{ colName: 'no', ruleType: 'eq', value: customer_no }],
					page: { pageNo: 1, rownumber: 10 }
				};
				let res = await this.$http.post(url, req);
				if (res.data.state === 'SUCCESS' && Array.isArray(res.data.data) && res.data.data.length > 0) {
					this.userInfo = res.data.data[0];
					this.getMessageInfo('onLoad')
					return res.data.data[0];
				}else{
					uni.showToast({
						title:'未找到患者信息',
						icon:'none'
					})
				}
			},
			
		},	
		mounted() {
			if(this.customer_no){
				this.getUserInfo(this.customer_no);
			}
		},
		onLoad(option) {
			if(option.no){
				this.getUserInfo(option.no);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.person-chat-wrap{
		min-height: 100vh;
		background-color: #eeeeee;
		.person-chat-top{
			display: flex;
			flex-direction: column;
			max-height: calc(100vh - 180rpx);
			// margin: 10rpx;
			.person-chat-item{	
				// display: flex;
				// margin-right: 20rpx;
				.person-chat-item-accept{
					display: flex;
					margin: 30rpx 10rpx;
					.person-chat-item-left{
						margin-right: 20rpx;
						image{
							width: 80rpx;
							height: 80rpx;
						}
					}
					.person-chat-item-right{
						min-width: 16%;
						background: #FFF;
						border-radius: 5px;
						padding: 5px;
						font-weight: 700;
						font-size: 12px;
						position: relative;
						&::after{
							content: '';
							display: block;
							width: 0;
							height: 0;
							border-top: 5px solid transparent;
							border-bottom: 5px solid transparent;
							border-right: 8px solid #fff;
							position: absolute;
							border-radius: 1px;
							left: -8px;
							top: 15px;
						}
					}
				}
				.person-chat-item-send{
					display: flex;
					margin: 30rpx 10rpx;
					justify-content: flex-end;
					min-width: 40%;
					.unread{
						line-height: 86rpx;
						margin-right: 10rpx;
						font-size: 24rpx;
						color: #ccc;
					}
					.person-chat-item-left{
						image{
							width: 80rpx;
							height: 80rpx;
						}
						margin-left: 20rpx;
					}
					.person-chat-item-right{
						min-width: 40%;
						background: #07c062;
						border-radius: 5px;
						padding: 5px;
						font-weight: 700;
						font-size: 12px;
						position: relative;
						&::after{
							content: '';
							display: block;
							width: 0;
							height: 0;
							border-top: 5px solid transparent;
							border-bottom: 5px solid transparent;
							border-left: 8px solid #07c062;
							position: absolute;
							right: -8px;
							top: 15px;
						}
					}
				}
			}
			.person-chat-item-my{
				display: flex;
				justify-content: flex-end;
			}
		}
		.person-chat-bot{
			background-color: #f7f7f7;
			box-shadow: 0px 1px 4px rgba(26, 26, 26, 0.2);
			position: fixed;
			bottom: 80rpx;
			width: 100%;
			display: flex;
			padding: 10rpx 20rpx;
			align-items: center;
			.person-chat-left{
				width: 85%;
				// margin-right: 30rpx;
				
				input{
					padding: 2px 10rpx;
					background: #fff;
					height: 70rpx;
					border-radius: 10rpx;
					font-size: 24rpx;
				}
			}
			.person-chat-rig{
				width: 15%;
				text-align: center;
				.send{
					background-color: #07c062;
					padding: 10rpx 20rpx;
					color: #fff;
					border-radius: 10rpx;
					margin-left: 10rpx;
				}
			}
		}
		.person-doctor-chat-bot{
			bottom: 0rpx;
		}
	}
</style>
