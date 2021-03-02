<template>
	<view>
		<chat :session-no="session_no" page-type="session" :group-no="groupNo" v-if="session_no"></chat>
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
				groupNo: '', //群组编号
				row_no: '', // 一对一会话 用户关系编码
				sessionInfo: {}, //会话信息
				groupInfo: {},
				groupUser: [], //群组用户列表
			}
		},
		methods: {
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
							uni.setNavigationBarTitle({
								title: this.groupInfo.name
							})

						}
						if (res.data[0].session_no) {
							this.session_no = res.data[0].session_no
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
						"value": "DS202103021335580001"
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
							break;
						case '用户间':

							break;
					}
				}
				return this.sessionInfo
			},
			updateSessionNo() {
				switch (this.sessionType) {
					case '店铺机构全员':
						this.updateStoreSessionNo()
						break;
					case '群组圈子':
						break;
					case '机构用户客服':
						break;
					case '用户间':
						this.updateRelationSessionNo()
						break;
				}
			},
			updateRelationSessionNo() {
				// 修改一对一关系中的session_no
				let req = [{
					"serviceName": "srvhealth_person_relation_update",
					"condition": [{
						"colName": "row_no",
						"ruleType": "eq",
						"value": this.row_no
					}],
					"data": [{
						"session_no": this.session_no
					}]
				}]
			},
			updateStoreSessionNo() {
				// 更新店铺全员会话编码
				let req = [{
					"serviceName": "srvhealth_store_mgmt_update",
					"condition": [{
						"colName": "store_no",
						"ruleType": "eq",
						"value": this.storeNo
					}],
					"data": [{
						"order_count": 0,
						"goods_count": 0,
						"user_count": 0,
						"member_session_no": this.session_no
					}]
				}]
				this.$fetch('operate', 'srvhealth_store_mgmt_update', req, 'health').then(res => {
					if (Array.isArray(res.data) && res.data.length > 0) {
						this.$emit('updateStoreInfo', res.data[0])
					}
				})
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
						break;
					case '用户间':
						data.person_relation_no = this.row_no
						break;
				}
				if (data.person_relation_no) {
					let cond = [{
						"colName": "person_relation_no",
						"ruleType": "eq",
						"value": this.row_no
					}]
					let sessionInfo = await this.getSession(cond)
					if (sessionInfo && sessionInfo.session_no) {
						return
					}
				}
				if (data.group_no) {
					let cond = [{
						"colName": "group_no",
						"ruleType": "eq",
						"value": this.groupNo
					}]
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
		},
		onLoad(option) {
			if (option.type) {
				this.sessionType = option.type
			}
			if (option.session_no) {
				this.session_no = option.session_no
			}
			if (this.session_no) {
				// 已有会话编号 查找会话信息
				this.getSession()
			} else {
				// 没有会话编号 创建
				// if (option.storeNo) {
				// 	this.storeNo = option.storeNo
				// }
				if (option.groupNo) {
					this.groupNo = option.groupNo
				}
				if (option.row_no) {
					this.row_no = option.row_no
				}
				this.createSession()
			}

		}
	}
</script>

<style>

</style>
