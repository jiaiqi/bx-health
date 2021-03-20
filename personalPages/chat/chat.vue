<template>
	<view>
		<view class="util-bar" v-if="(groupInfo && groupInfo.gc_no)||sessionType==='店铺机构全员'">
			<!-- 		<view class="util-item " @click="toPages('group-member')">
				<view class="icon"><text class="cuIcon-friend "></text></view>
							<text class="label">成员<text
						v-if="storeInfo&&storeInfo.user_count">({{storeInfo.user_count}})</text></text>
			</view> -->
			<view class="util-item " @click="toPages('group-util')">
				<view class="icon"><text class="cuIcon-repair "></text></view>
				<text class="label">小工具</text>
			</view>
			<view class="util-item" @click="toPages('group-detail')">
				<view class="icon"><text class="cuIcon-settings"></text></view>
			</view>
		</view>
		<chat :session-no="session_no" :identity="identity" page-type="session" @load-msg-complete="loadMsgComplete"
			:groupInfo="groupInfo" :rowInfo="rowInfo" :storeInfo="storeInfo" :sessionType="sessionType"
			:storeNo="storeNo" :topHeight="(groupInfo&&groupNo)||sessionType==='店铺机构全员'?42:0" :group-no="groupNo"
			v-if="session_no"></chat>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	import chat from '../components/personInfo/personchat.vue'
	export default {
		components: {
			chat
		},
		computed: {
			...mapState({
				userInfo: state => state.user.userInfo
			}),
		},
		data() {
			return {
				pageTitle: "", //页面标题
				sessionType: '', // 会话类型
				session_no: '', // 会话编号
				storeNo: '', // 机构编号
				store_user_no: '', // 客服会话 发起人的店铺用户编号
				storeInfo: {},
				storeUserInfo: {}, // 当前登录用户在店铺成员列表中的信息
				groupNo: '', //群组编号
				row_no: '', // 一对一会话 用户关系编码
				identity: '',
				rowInfo: {},
				sessionInfo: {}, //会话信息
				groupInfo: {},
				pg_no: '',
				groupUser: [], //群组用户列表
				lastMessage: {}
			}
		},
		methods: {
			toPages(type) {
				if (this.groupInfo.gc_no) {
					uni.navigateTo({
						url: `../gropDetail/gropDetail?gc_no=${this.groupInfo.gc_no}&type=${type}`
					});
				} else {
					uni.navigateTo({
						url: `../gropDetail/gropDetail?sessionType=店铺机构全员&type=${type}&storeNo=${this.storeNo}`
					});
				}

			},
			loadMsgComplete(e) {
				// 消息加载完毕
				this.lastMessage = e
				if (this.sessionType === '机构用户客服') {
					this.updateKefuSessionLastLookTime(this.lastMessage)
				} else if (this.sessionType === '店铺机构全员') {
					this.updateStoreSessionLastLookTime(this.lastMessage)
				} else if (this.groupInfo && this.pg_no) {
					// 更新群组圈子最后查看时间
					this.updateLastLookTime(this.lastMessage);
				}
			},
			getRow() {
				let req = {
					"serviceName": "srvhealth_person_relation_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "row_no",
						"ruleType": "eq",
						"value": this.row_no
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 1
					},
				}
				this.$fetch('select', 'srvhealth_person_relation_select', req, 'health').then(res => {
					if (Array.isArray(res.data) && res.data.length > 0) {
						this.rowInfo = res.data[0]
						if (res.data[0].usera_person_no === this.userInfo.no) {
							this.pageTitle = res.data[0].userb_name
							uni.setNavigationBarTitle({
								title: res.data[0].userb_name
							})
						} else {
							this.pageTitle = res.data[0].usera_name
							uni.setNavigationBarTitle({
								title: res.data[0].usera_name
							})
						}
					}
				})
			},
			getStore() {
				let req = {
					"condition": [{
						"colName": "store_no",
						"ruleType": "eq",
						"value": this.storeNo
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 1
					}
				}
				this.$fetch('select', 'srvhealth_store_mgmt_select', req, 'health').then(res => {
					if (Array.isArray(res.data) && res.data.length > 0) {
						this.storeInfo = res.data[0]
					}
				})
			},
			getGroup() {
				// 查找圈子信息
				let req = {
					"serviceName": "srvhealth_group_circle_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "gc_no",
						"ruleType": "eq",
						"value": this.groupNo
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 1
					},
				}
				this.$fetch('select', 'srvhealth_group_circle_select', req, 'health').then(res => {
					if (Array.isArray(res.data) && res.data.length > 0) {
						this.groupInfo = res.data[0]
						this.getGroupUser()
						if (this.groupInfo.name) {
							this.pageTitle = this.groupInfo.name
							uni.setNavigationBarTitle({
								title: this.groupInfo.name
							})
						}
						if (res.data[0].session_no) {
							this.session_no = res.data[0].session_no
						} else if (this.session_no) {
							this.updateSessionNo()
						}
					}
				})
			},
			getGroupUser() {
				// 查找圈子用户列表
				let req = {
					"serviceName": "srvhealth_person_group_circle_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "gc_no",
						"ruleType": "eq",
						"value": this.groupNo
					}],
				}
				this.$fetch('select', 'srvhealth_person_group_circle_select', req, 'health').then(res => {
					if (res.success) {
						this.groupUser = res.data
						if (res.data.length > 0) {
							if (this.groupInfo && this.groupInfo.name) {
								this.pageTitle = this.groupInfo.name + `(${res.data.length})`
								uni.setNavigationBarTitle({
									title: this.groupInfo.name + `(${res.data.length})`
								})
							} else if (this.storeInfo && this.storeInfo.name) {
								this.pageTitle = this.storeInfo.name + `(${this.storeInfo.user_count})`
								uni.setNavigationBarTitle({
									title: this.storeInfo.name + `(${this.storeInfo.user_count})`
								})
							}

						}
					}
				})
			},
			async getSession(condition) {
				// 查找会话信息
				let req = {
					"serviceName": "srvhealth_dialogue_session_select",
					"colNames": ["*"],
					"condition": [{
						"colName": "session_no",
						"ruleType": "like",
						"value": this.session_no
					}],
					"page": {
						"pageNo": 1,
						"rownumber": 1
					},
				}
				if (condition) {
					req.condition = condition
				}
				let res = await this.$fetch('select', 'srvhealth_dialogue_session_select', req, 'health')
				if (res.success && Array.isArray(res.data) && res.data.length > 0) {
					this.sessionInfo = res.data[0]
					this.session_no = res.data[0].session_no
					switch (this.sessionType) {
						case '店铺机构全员':
							this.pageTitle = this.sessionInfo.session_name ? this.sessionInfo.session_name : this
								.storeInfo.name
							uni.setNavigationBarTitle({
								title: this.sessionInfo.session_name ? this.sessionInfo.session_name : this
									.storeInfo.name
							})
							if (this.storeInfo && this.storeInfo.user_count) {
								uni.setNavigationBarTitle({
									title: `${　this.sessionInfo.session_name?this.sessionInfo.session_name:this.storeInfo.name　}(${this.storeInfo.user_count})`
								})
							}
							break;
						case '群组圈子':
							this.getGroup()
							break;
						case '机构用户客服':
							if (this.identity === '客户') {
								this.pageTitle = this.storeInfo.name
								uni.setNavigationBarTitle({
									title: this.storeInfo.name
								})
							} else if (this.identity === '客服') {
								this.pageTitle = this.sessionInfo.store_user_name
								uni.setNavigationBarTitle({
									title: this.sessionInfo.store_user_name
								})
							}
							break;
						case '用户间':

							break;
					}
				}
				return this.sessionInfo
			},
			getStoreUser() {
				// 店铺全员群聊 查找当前帐号在店铺人员列表中的数据
				let req = {
					"condition": [{
						"colName": "store_no",
						"ruleType": "eq",
						"value": this.storeNo
					}, {
						"colName": "person_no",
						"ruleType": "eq",
						"value": this.userInfo.no
					}]
				}
				this.$fetch('select', 'srvhealth_store_user_select', req, 'health').then(res => {
					if (res.success && Array.isArray(res.data) && res.data.length > 0) {
						this.storeUserInfo = res.data[0]
					}
				})
			},
			updateSessionNo() {
				let req = []
				let serviceName = ''
				switch (this.sessionType) {
					case '店铺机构全员':
						// 更新店铺全员会话编码
						serviceName = 'srvhealth_store_mgmt_update'
						req = [{
							"serviceName": serviceName,
							"condition": [{
								"colName": "store_no",
								"ruleType": "eq",
								"value": this.storeNo
							}],
							"data": [{
								"member_session_no": this.session_no
							}]
						}]
						break;
					case '群组圈子':
						serviceName = 'srvhealth_group_circle_update'
						req = [{
							"serviceName": serviceName,
							"condition": [{
								"colName": "gc_no",
								"ruleType": "eq",
								"value": this.groupNo
							}],
							"data": [{
								"session_no": this.session_no
							}]
						}]
						break;
					case '机构用户客服':
						// serviceName = 'srvhealth_store_user_update'
						// req = [{
						// 	"serviceName": serviceName,
						// 	"condition": [{
						// 			"colName": "store_no",
						// 			"ruleType": "eq",
						// 			"value": this.storeNo
						// 		},
						// 		{
						// 			"colName": "person_no",
						// 			"ruleType": "eq",
						// 			"value": this.userInfo.no
						// 		}
						// 	],
						// 	"data": [{
						// 		"kefu_session_no": this.session_no
						// 	}]
						// }]
						break;
					case '用户间':
						serviceName = 'srvhealth_person_relation_update'
						req = [{
							"serviceName": serviceName,
							"condition": [{
								"colName": "row_no",
								"ruleType": "eq",
								"value": this.row_no
							}],
							"data": [{
								"session_no": this.session_no
							}]
						}]
						break;
				}
				if (serviceName && req.length > 0) {
					this.$fetch('operate', serviceName, req, 'health').then(res => {
						if (Array.isArray(res.data) && res.data.length > 0) {
							switch (this.sessionType) {
								case '店铺机构全员':
									uni.$emit('updateStoreInfo', res.data[0])
									break;
								case '群组圈子':
									uni.$emit('updateGroupInfo', res.data[0])
									break;
								case '机构用户客服':
									break;
								case '用户间':
									uni.$emit('updateRelationInfo', res.data[0])
									break;
							}
						}
					})
				}
			},
			async createSession() {
				let data = {
					"session_type": this.sessionType
				}
				switch (this.sessionType) {
					case '店铺机构全员':
						data.store_no = this.storeNo
						break;
					case '群组圈子':
						data.group_no = this.groupNo
						break;
					case '机构用户客服':
						data.person_image_a = this.userInfo.user_image ? this.userInfo.user_image : this.userInfo
							.profile_url
						data.person_name_a = this.userInfo.name
						data.person_no_a = this.userInfo.no
						data.store_no = this.storeNo
						data.store_user_no = this.store_user_no
						data.store_user_name = this.userInfo.name
						data.store_user_image = this.userInfo.user_image ? this.userInfo.user_image : this.userInfo
							.profile_url
						break;
					case '用户间':
						data.person_relation_no = this.row_no
						break;
				}
				let cond = []
				if (data.store_user_no) {
					cond = [{
						"colName": "store_user_no",
						"ruleType": "eq",
						"value": this.store_user_no
					}, {
						"colName": "store_no",
						"ruleType": "eq",
						"value": this.storeNo
					}]
				}
				if (data.person_relation_no) {
					cond = [{
						"colName": "person_relation_no",
						"ruleType": "eq",
						"value": this.row_no
					}]

				}
				if (data.group_no) {
					cond = [{
						"colName": "group_no",
						"ruleType": "eq",
						"value": this.groupNo
					}]
				}
				if (cond.length > 0) {
					let sessionInfo = await this.getSession(cond)
					if (sessionInfo && sessionInfo.session_no) {
						this.updateSessionNo()
						return
					}
				}
				let req = [{
					"serviceName": "srvhealth_dialogue_session_add",
					"condition": [],
					"data": [data]
				}]
				this.$fetch('operate', 'srvhealth_dialogue_session_add', req, 'health').then(res => {
					if (res.success && Array.isArray(res.data) && res.data.length > 0) {
						this.sessionInfo = res.data[0]
						this.session_no = res.data[0].session_no
						this.updateSessionNo()
					}
				})
			},
			updateKefuSessionLastLookTime(e) {
				// 更新用户最后查看客服会话时间
				let req = [{
					"serviceName": "srvhealth_dialogue_session_update",
					"condition": [{
						"colName": "session_no",
						"ruleType": "eq",
						"value": this.session_no
					}],
					"data": []
				}]
				if (this.identity === '客服') {
					// 客服最后查看会话时间
					req[0].data[0] = {
						kefu_kefu_last_time: e && e.create_time ? e.create_time : this.formateDate('',
							'DateTime')
					}
				} else {
					// 客户最后查看会话时间
					req[0].data[0] = {
						kefu_user_last_time: e && e.create_time ? e.create_time : this.formateDate('',
							'DateTime')
					}
				}
				this.$fetch('operate', 'srvhealth_dialogue_session_update', req, 'health').then(res => {
					if (Array.isArray(res.data) && res.data.length > 0) {
						uni.$emit('updateKefuSessionLastLookTime', res.data[0])
					}
				})
			},
			updateStoreSessionLastLookTime(e) {
				// 更新用户最后查看店铺成员群会话时间
				let req = [{
					"serviceName": "srvhealth_store_user_update",
					"condition": [{
							"colName": "store_no",
							"ruleType": "eq",
							"value": this.storeNo
						},
						{
							"colName": "person_no",
							"ruleType": "eq",
							"value": this.userInfo.no
						}
					],
					"data": [{
						store_session_sign_in_time: e && e.create_time ? e.create_time : this.formateDate(
							'',
							'DateTime')
					}]
				}]
				this.$fetch('operate', 'srvhealth_store_user_update', req, 'health').then(res => {
					if (Array.isArray(res.data) && res.data.length > 0) {
						uni.$emit('updateStoreSessionLastLookTime', res.data[0])
					}
				})
			},
			updateLastLookTime(e) {
				// 更新群组圈子最后查看时间
				if (this.groupInfo && this.pg_no) {
					let url = this.getServiceUrl('health', 'srvhealth_person_group_circle_update', 'operate');
					let req = [{
						serviceName: 'srvhealth_person_group_circle_update',
						condition: [{
							colName: 'pg_no',
							ruleType: 'eq',
							value: this.pg_no
						}],
						data: [{
							latest_sign_in_time: e && e.create_time ? e.create_time : this.formateDate('',
								'DateTime')
						}]
					}];
					this.$http.post(url, req);
					uni.$emit("updateUnread")
				}
			},
		},
		beforeDestroy() {
			if (this.sessionType === '机构用户客服') {
				this.updateKefuSessionLastLookTime(this.lastMessage)
				uni.$emit("updateUnread")
			} else if (this.sessionType === '店铺机构全员') {
				this.updateStoreSessionLastLookTime(this.lastMessage)
			} else if (this.groupInfo && this.pg_no) {
				// 更新群组圈子最后查看时间
				this.updateLastLookTime(this.lastMessage);
			}
		},
		onLoad(option) {
			if (option.type) {
				this.sessionType = option.type
			}
			if (option.session_no) {
				this.session_no = option.session_no
			}
			if (option.identity) {
				this.identity = option.identity
			}
			if (option.storeNo) {
				this.storeNo = option.storeNo
				this.getStore()
				this.getStoreUser()
			}
			if (this.session_no) {
				// 已有会话编号 查找会话信息
				this.getSession()
			} else {
				// 没有会话编号 创建
				if (option.groupNo) {
					this.groupNo = option.groupNo
					if (option.pg_no) {
						this.pg_no = option.pg_no
					}
				}
				if (option.row_no) {
					this.row_no = option.row_no
					this.getRow()
				}
				if (option.store_user_no) {
					this.store_user_no = option.store_user_no
				}
				this.createSession()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.util-bar {
		// position: fixed;
		// top: 0;
		background-color: #f5f5f5;
		display: flex;
		justify-content: flex-end;
		border-radius: 0 0 20rpx 20rpx;
		overflow: hidden;
		padding: 10rpx 20rpx;
		top: 0;
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		width: 100%;
		z-index: 2;

		.util-item {
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #fff;
			border-radius: 50px;
			padding: 5px 10px;

			&+.util-item {
				margin-left: 5px;
				// border-left: 1rpx solid #eee;
			}

			.icon {
				width: 40rpx;
				height: 40rpx;
				// border-radius: 50%;
				color: #333;
				line-height: 40rpx;
				text-align: center;
				font-size: 40rpx;
			}

			.label {
				color: #999;
				margin-top: 10rpx;
				font-size: 24rpx;
				margin-left: 5px;
			}
		}
	}
</style>
