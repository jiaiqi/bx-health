<template>
	<view>
		<chat :session-no="session_no" :identity="identity" page-type="session" @load-msg-complete="loadMsgComplete"
		 :groupInfo="groupInfo" :rowInfo="rowInfo" :storeInfo="storeInfo" :sessionType="sessionType" :storeNo="storeNo" :group-no="groupNo" v-if="session_no"></chat>
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
				sessionType: '', // 会话类型
				session_no: '', // 会话编号
				storeNo: '', // 机构编号
				store_user_no: '', // 客服会话 发起人的店铺用户编号
				storeInfo: {},
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
			loadMsgComplete(e) {
				// 消息加载完毕
				this.lastMessage = e
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
							uni.setNavigationBarTitle({
								title: res.data[0].userb_name
							})
						} else {
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
					if(Array.isArray(res.data)&&res.data.length>0){
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
							debugger
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
							uni.setNavigationBarTitle({
								title: this.groupInfo.name + `(${res.data.length})`
							})
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
							uni.setNavigationBarTitle({
								title: this.sessionInfo.store_name
							})
							break;
						case '群组圈子':
							this.getGroup()
							break;
						case '机构用户客服':
							if (this.identity === '客户') {
								uni.setNavigationBarTitle({
									title: this.storeInfo.name
								})
							} else if (this.identity === '客服') {
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
						data.person_image_a = this.userInfo.user_image ? this.userInfo.user_image : this.userInfo.profile_url
						data.person_name_a = this.userInfo.name
						data.person_no_a = this.userInfo.no
						data.store_no = this.storeNo
						data.store_user_no = this.store_user_no
						data.store_user_name = this.userInfo.name
						data.store_user_image = this.userInfo.user_image ? this.userInfo.user_image : this.userInfo.profile_url
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
			updateLastLookTime(e) {
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
							latest_sign_in_time: e && e.create_time ? e.create_time : this.formateDate('', 'DateTime')
						}]
					}];
					this.$http.post(url, req);
					uni.$emit("updateUnread")
				}
			},
		},
		beforeDestroy() {
			this.updateLastLookTime(this.lastMessage);
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

<style>

</style>
