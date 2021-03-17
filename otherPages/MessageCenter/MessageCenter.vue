<template>
	<view>
		<scroll-view scroll-y="true">
			<view class="cu-list">
				<view class="cu-item" v-for="(item,index) in sessionList" :key="item.session_no" @click="toChat(item)">
					<view class="cu-avatar lg" v-if="!item.store_user_image">
						<text class="cuIcon-profilefill"></text>
					</view>
					<view class="cu-avatar  lg" v-if="item.store_user_image"
						:style="[{backgroundImage:'url('+getImagePath(item.store_user_image)+')'}]"></view>
					<view class="content">
						<view class="text-black">{{item.store_user_name||''}}</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				storeNo: '',
				sessionList: []
			};
		},
		methods: {
			toChat(e) {
				// 跳转到聊天页面
				uni.navigateTo({
					url: `/personalPages/chat/chat?type=机构用户客服&identity=客服&storeNo=${this.storeNo}&session_no=${e.session_no}`
				})
			},
			getStoreSession() {
				// 查找此店铺的客服会话列表
				let req = {
					"condition": [{
						"colName": "session_type",
						"ruleType": "in",
						"value": "机构用户客服"
					}, {
						"colName": "store_no",
						"ruleType": "eq",
						"value": this.storeNo
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 20
					}
				}
				this.$fetch('select', 'srvhealth_dialogue_session_select', req, 'health').then(res => {
					if (res.success) {
						this.sessionList = res.data
						this.getUserUnread()
					}
				})
			},
			getUserUnread() {
				// 查找用户咨询记录中未读数量
				let sessionList = this.sessionList
				if (!sessionList || !Array.isArray(sessionList)) {
					return
				}
				let condition = sessionList.map(item => {
					return {
						"relation": "AND",
						"data": [{
								"colName": "session_no",
								"ruleType": "eq",
								"value": item.session_no
							},
							{
								"colName": "create_time",
								"ruleType": "gt",
								"value": item.kefu_session_store_time
							}
						]
					}
				})
				let req = {
					"serviceName": "srvhealth_consultation_chat_record_select",
					"colNames": ["*"],
					"order": [{
						"colName": "create_time",
						"orderType": "desc"
					}],
					group:[
						{
								"colName": "session_no",
									"type": "by", 
									"aliasName":"xxx"   
						},
						{
								"colName": "sender_person_no",
									"type": "by", 
						},
						{
								"colName": "sender_profile_url",
									"type": "by", 
						},
						// {
						// 		"colName": "sender_user_image",
						// 			"type": "by", 
						// },
						{
							"colName": "id",
								"type": "count", 
								"aliasName":"amount"   // 别名
						}
					],
					"relation_condition": {
						"relation": "OR",
						"data": condition
					},
					"page": {
						"rownumber": 999,
						"pageNo": 1
					}
				}
				this.$fetch('select', 'srvhealth_consultation_chat_record_select', req, 'health').then(res => {
					if (res.success && res.page) {
						debugger
						let data = res.data.reduce((pre,cur)=>{
							
						})
					}
				})
			},
		},
		onLoad(option) {
			if (option.storeNo) {
				this.storeNo = option.storeNo
				this.getStoreSession()
			}
		},
		onPullDownRefresh() {
			if (this.storeNo) {
				this.getStoreSession()
				uni.setNavigationBarTitle({
					title: '用户咨询记录'
				})
			}
			setTimeout(() => {
				uni.stopPullDownRefresh()
			}, 1000)
		}
	}
</script>

<style lang="scss" scoped>
.cu-list{
	display: flex;
	flex-wrap: wrap;
	padding: 20rpx 0;
	.cu-item{
		width: 25%;
		margin-bottom: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		.content{
			text-overflow: ellipsis;
			white-space: nowrap;
			overflow: hidden;
			width: 90%;
			text-align: center;
		}
	}
}
</style>
