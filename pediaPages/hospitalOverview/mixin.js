const mixin = {
	data() {
		return {
			groupList: [], // 关联圈子
			kefuNum: 0, // 客服咨询会话未读数
			storeNum: 0, // 店铺全员会话未读数
		}
	},
	methods: {
		selectUnreadAmount() {
			// 查找未读消息数量
			let req = []
			// 查找群组消息未读数量
			// if (this.groupList.length > 0) {
			// 	req.push({
			// 		"serviceName": "srvhealth_person_group_circle_select",
			// 		"colNames": ["*"],
			// 		"page": {
			// 			pageNo: 1,
			// 			rownumber: this.groupList.length
			// 		},
			// 		"condition": [{
			// 				"colName": "gc_no",
			// 				"ruleType": "in",
			// 				"value": this.groupList.map(item => item.gc_no).toString()
			// 			},
			// 			{
			// 				"colName": "person_no",
			// 				"ruleType": "eq",
			// 				"value": this.userInfo.no
			// 			}
			// 		]
			// 	})
			// }
			// 查找店铺群未读数量
			req.push({
				"serviceName": "srvhealth_store_user_select",
				"colNames": ["*"],
				"page": {
					pageNo: 1,
					rownumber: 1
				},
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
				]
			})
			// 查找店铺客服发过来的消息未读数量
			req.push({
				"serviceName": "srvhealth_dialogue_session_select",
				"colNames": ["*"],
				"page": {
					pageNo: 1,
					rownumber: 1
				},
				"condition": [{
						"colName": "session_type",
						"ruleType": "in",
						"value": "机构用户客服"
					},
					{
						"colName": "store_person_no",
						"ruleType": "in",
						"value": this.userInfo.no
					}, {
						"colName": "store_no",
						"ruleType": "eq",
						"value": this.storeNo
					}
				]
			})
			this.$fetch('multi', 'select', req, 'health').then(res => {
				if (res.success && res.data.length === 2) {
					const data = res.data
					// if (data[0].state === 'SUCCESS' && Array.isArray(data[0].data)) {
					// 	const groupUserList = data[0].data
					// 	this.groupList = this.groupList.map(group => {
					// 		// unreadNum
					// 		let groupUserInfo = groupUserList.find(item => item.gc_no === group
					// 			.gc_no)
					// 		if (groupUserInfo) {
					// 			group.unreadNum = groupUserInfo.user_unread_msg || 0
					// 		}
					// 		return group
					// 	})
					// }

					if (data[0].state === 'SUCCESS' && Array.isArray(data[0].data) && data[0].data.length >
						0) {
						let storeUserInfo = data[0].data[0]
						this.storeNum = storeUserInfo.store_session_user_unread_msg || 0
					}

					if (data[1].state === 'SUCCESS' && Array.isArray(data[1].data) && data[1].data.length >
						0) {
						let sessionInfo = data[1].data[0]
						this.kefuNum = sessionInfo.kefu_user_unread_msg || ''
					}
				}
			})
		}
	}
}

export default mixin
